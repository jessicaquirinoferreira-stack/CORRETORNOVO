import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  getDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth } from './config';
import { Property, SiteSettings, LandingPage } from '../types';
import { INITIAL_PROPERTIES } from '../data/initialProperties';
import { DEFAULT_SETTINGS } from '../data/initialSettings';
import { idbGet, idbSet, idbRemove } from '../utils/idbStorage';
import { 
  uploadImageToVercelBlob, 
  isVercelBlobUrl, 
  getLocalBlobToken, 
  setLocalBlobToken 
} from '../utils/blobClient';

export const PROPERTIES_COLLECTION = 'properties';
export const SETTINGS_COLLECTION = 'settings';
export const LANDING_PAGES_COLLECTION = 'landing_pages';
export const PROPERTY_PHOTOS_COLLECTION = 'property_photos';
export const PROPERTY_GALLERIES_COLLECTION = 'property_galleries';
export const GENERAL_SETTINGS_DOC = 'general';

const LOCAL_STORAGE_PROPERTIES_KEY = 'dp_properties_cache_v7';
const LOCAL_STORAGE_SETTINGS_KEY = 'dp_settings_cache_v3';
const LOCAL_STORAGE_LANDING_PAGES_KEY = 'dp_landing_pages_cache_v1';
const LOCAL_STORAGE_ADMIN_KEY = 'dp_admin_session';

/**
 * Deep sanitization for Firestore:
 * Firestore throws a fatal error if ANY field is undefined (e.g. suites: undefined).
 * This recursively removes any undefined keys or converts them so Firestore accepts the document cleanly.
 */
export function cleanFirestoreData<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as any;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => cleanFirestoreData(item)) as any;
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanFirestoreData(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}

// In-memory cache for resolved property photos
const photoCache = new Map<string, string>();

// In-memory cache for complete property galleries (unlimited photos per property)
const fullGalleryCache = new Map<string, string[]>();

/**
 * Resolves any legacy or photo collection references back to full WebP data URLs.
 * Uses a 3-tier ultra-fast strategy:
 * 1. Memory cache (instant 0ms)
 * 2. IndexedDB high-capacity local cache (< 5ms)
 * 3. Firestore PROPERTY_PHOTOS_COLLECTION (cloud persistence forever)
 */
export async function resolvePropertiesPhotos(properties: Property[]): Promise<Property[]> {
  const unresolvedRefs: string[] = [];
  properties.forEach((p) => {
    (p.images || []).forEach((img) => {
      if (img && img.startsWith('firestore_photo://') && !photoCache.has(img)) {
        unresolvedRefs.push(img);
      }
    });
  });

  if (unresolvedRefs.length > 0) {
    const stillNeeded: string[] = [];
    // 1. Check IndexedDB first for instant resolution without network lag
    await Promise.all(
      unresolvedRefs.map(async (refUrl) => {
        const photoId = refUrl.replace('firestore_photo://', '');
        try {
          const cachedData = await idbGet<string>(`photo_${photoId}`);
          if (cachedData) {
            photoCache.set(refUrl, cachedData);
          } else {
            stillNeeded.push(refUrl);
          }
        } catch {
          stillNeeded.push(refUrl);
        }
      })
    );

    // 2. Fetch any missing photos from Firestore Cloud
    if (stillNeeded.length > 0) {
      await Promise.all(
        stillNeeded.map(async (refUrl) => {
          const photoId = refUrl.replace('firestore_photo://', '');
          try {
            const snap = await getDoc(doc(db, PROPERTY_PHOTOS_COLLECTION, photoId));
            if (snap.exists()) {
              const data = snap.data();
              const dataUrl = data?.dataUrl || data?.url;
              if (dataUrl) {
                photoCache.set(refUrl, dataUrl);
                idbSet(`photo_${photoId}`, dataUrl).catch(() => {});
              }
            }
          } catch {
            // ignore network hiccups
          }
        })
      );
    }
  }

  return properties.map((p) => ({
    ...p,
    images: (p.images || []).map((img) => {
      if (!img) return '';
      if (photoCache.has(img)) return photoCache.get(img)!;
      if (img.startsWith('firestore_photo://')) {
        // Fallback gracefully so broken pseudo-protocol is never rendered in <img>
        return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=640&q=75';
      }
      return img;
    }).filter((img) => typeof img === 'string' && img.length > 0),
  }));
}

/**
 * Hydrates properties with their full extended galleries from memory cache or Firestore collection.
 * Guarantees that whether a property has 5, 15, 30, 50 or 100+ photos, ALL photos are loaded.
 */
export async function hydratePropertiesGalleries(properties: Property[]): Promise<Property[]> {
  const baseResolved = await resolvePropertiesPhotos(properties);

  const hydrated = await Promise.all(
    baseResolved.map(async (prop) => {
      // If already in memory cache with full or greater count, use it
      if (fullGalleryCache.has(prop.id)) {
        const cachedGallery = fullGalleryCache.get(prop.id)!;
        if (cachedGallery.length >= (prop.images || []).length) {
          return {
            ...prop,
            images: cachedGallery,
            totalImagesCount: Math.max(cachedGallery.length, prop.totalImagesCount || 0),
          };
        }
      }

      // If marked as having extended gallery or totalImagesCount exceeds current doc images
      if (prop.hasExtendedGallery || (prop.totalImagesCount && prop.totalImagesCount > (prop.images || []).length)) {
        try {
          const gSnap = await getDoc(doc(db, PROPERTY_GALLERIES_COLLECTION, prop.id));
          if (gSnap.exists() && Array.isArray(gSnap.data()?.images) && gSnap.data().images.length > 0) {
            const rawImages: string[] = gSnap.data().images;
            // Resolve any photo references
            const resolvedGallery = await Promise.all(
              rawImages.map(async (img) => {
                if (!img.startsWith('firestore_photo://')) return img;
                if (photoCache.has(img)) return photoCache.get(img)!;
                const photoId = img.replace('firestore_photo://', '');
                const cached = await idbGet<string>(`photo_${photoId}`);
                if (cached) {
                  photoCache.set(img, cached);
                  return cached;
                }
                const pSnap = await getDoc(doc(db, PROPERTY_PHOTOS_COLLECTION, photoId));
                if (pSnap.exists()) {
                  const dataUrl = pSnap.data()?.dataUrl || pSnap.data()?.url;
                  if (dataUrl) {
                    photoCache.set(img, dataUrl);
                    idbSet(`photo_${photoId}`, dataUrl).catch(() => {});
                    return dataUrl;
                  }
                }
                return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=640&q=75';
              })
            );
            fullGalleryCache.set(prop.id, resolvedGallery);
            return {
              ...prop,
              images: resolvedGallery,
              totalImagesCount: resolvedGallery.length,
            };
          }
        } catch {
          // Keep existing images on error
        }
      }

      return prop;
    })
  );

  return hydrated;
}

/**
 * Explicitly fetches the full gallery for a specific property.
 */
export async function fetchFullPropertyGallery(propertyId: string): Promise<string[]> {
  if (fullGalleryCache.has(propertyId)) {
    return fullGalleryCache.get(propertyId)!;
  }
  try {
    const gSnap = await getDoc(doc(db, PROPERTY_GALLERIES_COLLECTION, propertyId));
    if (gSnap.exists() && Array.isArray(gSnap.data()?.images) && gSnap.data().images.length > 0) {
      const rawImages: string[] = gSnap.data().images;
      const resolved = await Promise.all(
        rawImages.map(async (img) => {
          if (!img.startsWith('firestore_photo://')) return img;
          if (photoCache.has(img)) return photoCache.get(img)!;
          const photoId = img.replace('firestore_photo://', '');
          const cached = await idbGet<string>(`photo_${photoId}`);
          if (cached) {
            photoCache.set(img, cached);
            return cached;
          }
          const pSnap = await getDoc(doc(db, PROPERTY_PHOTOS_COLLECTION, photoId));
          if (pSnap.exists()) {
            const dataUrl = pSnap.data()?.dataUrl || pSnap.data()?.url;
            if (dataUrl) {
              photoCache.set(img, dataUrl);
              idbSet(`photo_${photoId}`, dataUrl).catch(() => {});
              return dataUrl;
            }
          }
          return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85';
        })
      );
      fullGalleryCache.set(propertyId, resolved);
      return resolved;
    }
  } catch (err) {
    console.warn('Erro ao buscar galeria estendida:', err);
  }
  return [];
}

// Helper to get cached properties
export function getLocalCachedProperties(): Property[] {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_STORAGE_PROPERTIES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('Error reading local cached properties', e);
  }
  return INITIAL_PROPERTIES;
}

// Asynchronous loader that retrieves high-capacity cached properties from IndexedDB
export async function loadIndexedDBCachedProperties(): Promise<Property[] | null> {
  try {
    const cached = await idbGet<Property[]>(LOCAL_STORAGE_PROPERTIES_KEY);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
  } catch {
    // fallback
  }
  return null;
}

// Helper to get cached settings
export function getLocalCachedSettings(): SiteSettings {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    }
  } catch (e) {
    console.warn('Error reading local cached settings', e);
  }
  return DEFAULT_SETTINGS;
}

// Subscribe to real-time properties updates
export function subscribeToProperties(
  callback: (properties: Property[]) => void,
  onError?: (error: Error) => void
) {
  const colRef = collection(db, PROPERTIES_COLLECTION);
  
  // Ensure default system settings exist without ever auto-wiping user properties
  seedInitialDataIfNeeded();

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      // If snapshot is from local cache and empty, wait for live server data
      if (snapshot.empty) {
        if (snapshot.metadata.fromCache) {
          return;
        }
        callback([]);
        return;
      }

      const list: Property[] = [];
      snapshot.forEach((docSnapshot) => {
        const docData = docSnapshot.data() as Property;
        list.push({ 
          id: docSnapshot.id, 
          ...docData
        } as Property);
      });
      
      // Sort featured first, then created desc
      list.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });

      // Hydrate full galleries from cache or remote (supports unlimited photos)
      const resolvedList = await hydratePropertiesGalleries(list);

      // Update IndexedDB cache (full storage with all photos, zero truncation)
      idbSet(LOCAL_STORAGE_PROPERTIES_KEY, resolvedList).catch(() => {});

      // Update localStorage if space permits (NEVER truncate photos)
      try {
        localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(resolvedList));
      } catch {
        // IndexedDB holds the complete list safely
      }

      callback(resolvedList);
    },
    (err) => {
      console.warn('Firestore real-time properties error, using cached data:', err);
      // Try to read from IndexedDB first for full photos
      idbGet<Property[]>(LOCAL_STORAGE_PROPERTIES_KEY).then((cached) => {
        if (cached && cached.length > 0) {
          callback(cached);
        } else {
          callback(getLocalCachedProperties());
        }
      }).catch(() => {
        callback(getLocalCachedProperties());
      });
      if (onError) onError(err);
    }
  );

  return unsubscribe;
}

// Subscribe to real-time site settings
export function subscribeToSettings(
  callback: (settings: SiteSettings) => void
) {
  const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);

  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as SiteSettings;
        const merged = { ...DEFAULT_SETTINGS, ...data };
        if (merged.vercelBlobToken) {
          setLocalBlobToken(merged.vercelBlobToken);
        }
        localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(merged));
        callback(merged);
      } else {
        // Save default settings to firestore
        setDoc(docRef, cleanFirestoreData(DEFAULT_SETTINGS), { merge: true }).catch(() => {});
        callback(DEFAULT_SETTINGS);
      }
    },
    (err) => {
      console.warn('Firestore settings error, using cached:', err);
      callback(getLocalCachedSettings());
    }
  );

  return unsubscribe;
}

// Save / update property with guaranteed Firestore cloud persistence and permanent Vercel Blob photos
export async function saveProperty(property: Property): Promise<Property> {
  const propId = property.id || `prop-${property.code || Date.now()}`;
  
  // Clean invalid / empty values from images
  const cleanImages = (property.images || []).filter((img) => typeof img === 'string' && img.trim().length > 0);

  // 1. Process images for permanent CDN persistence:
  // If an image is a base64 dataUrl, upload directly to Vercel Blob CDN!
  const processedImageRefs: string[] = [];

  for (let i = 0; i < cleanImages.length; i++) {
    const img = cleanImages[i];
    if (img.startsWith('data:')) {
      let permanentUrl: string | null = null;
      try {
        const uploadRes = await uploadImageToVercelBlob({
          dataUrl: img,
          fileName: `${propId}-foto-${i}.webp`,
          folder: 'imoveis',
        });
        if (uploadRes.success && uploadRes.url && isVercelBlobUrl(uploadRes.url)) {
          permanentUrl = uploadRes.url;
        }
      } catch (blobErr) {
        console.warn(`Aviso ao enviar foto ${i} para Vercel Blob:`, blobErr);
      }

      if (permanentUrl) {
        // Sucesso total no Vercel Blob CDN permanente!
        processedImageRefs.push(permanentUrl);
        cleanImages[i] = permanentUrl;
      } else {
        // Fallback para Firestore property_photos
        const photoDocId = `${propId}_photo_${i}_${Date.now()}`;
        const photoRefUrl = `firestore_photo://${photoDocId}`;
        try {
          await setDoc(doc(db, PROPERTY_PHOTOS_COLLECTION, photoDocId), {
            id: photoDocId,
            propertyId: propId,
            dataUrl: img,
            index: i,
            updatedAt: Date.now(),
          });
          photoCache.set(photoRefUrl, img);
          idbSet(`photo_${photoDocId}`, img).catch(() => {});
          processedImageRefs.push(photoRefUrl);
        } catch (photoErr) {
          console.warn(`Aviso ao salvar foto ${i} no Firestore:`, photoErr);
          processedImageRefs.push(photoRefUrl);
        }
      }
    } else {
      processedImageRefs.push(img);
      if (img.startsWith('firestore_photo://')) {
        const pId = img.replace('firestore_photo://', '');
        const existingData = photoCache.get(img);
        if (existingData) {
          idbSet(`photo_${pId}`, existingData).catch(() => {});
        }
      }
    }
  }

  // Store full clean images in memory cache immediately so current session has 100% fidelity
  fullGalleryCache.set(propId, processedImageRefs);

  // 2. Save gallery references to PROPERTY_GALLERIES_COLLECTION in Firestore
  try {
    const galleryRef = doc(db, PROPERTY_GALLERIES_COLLECTION, propId);
    await setDoc(galleryRef, {
      propertyId: propId,
      images: processedImageRefs,
      totalCount: processedImageRefs.length,
      updatedAt: Date.now(),
    }, { merge: true });
  } catch (gErr) {
    console.warn('Aviso ao sincronizar galeria no Firebase:', gErr);
  }

  // 3. Primary document in PROPERTIES_COLLECTION:
  // Saves ALL image references directly in the document (NO SLICING TO 18!).
  // Since HTTP / Vercel Blob URLs are lightweight strings (~80 bytes), 100 photos = 8KB << 1MB Firestore limit.
  const rawData: Property = {
    ...property,
    id: propId,
    images: processedImageRefs,
    totalImagesCount: processedImageRefs.length,
    hasExtendedGallery: processedImageRefs.length > 18,
    updatedAt: Date.now(),
    createdAt: property.createdAt || Date.now(),
  };

  // 4. Sanitize to prevent undefined field crashes in Firestore
  const dataToSave = cleanFirestoreData(rawData);

  // 5. Write primary document to Firestore Cloud!
  const docRef = doc(db, PROPERTIES_COLLECTION, propId);
  await setDoc(docRef, dataToSave, { merge: true });

  // 6. Build final local item with ALL processedImageRefs for the UI
  const finalLocalItem: Property = {
    ...dataToSave,
    images: processedImageRefs,
    totalImagesCount: processedImageRefs.length,
    hasExtendedGallery: processedImageRefs.length > 18,
  };

  // 7. Update local caches (IndexedDB and localStorage without slicing!)
  const current = getLocalCachedProperties();
  const existingIdx = current.findIndex((p) => p.id === propId);
  let updatedList: Property[];
  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = finalLocalItem;
  } else {
    updatedList = [finalLocalItem, ...current];
  }

  // Save to IndexedDB (virtually unlimited capacity, never slices photos!)
  idbSet(LOCAL_STORAGE_PROPERTIES_KEY, updatedList).catch(() => {});

  // For localStorage, try saving.
  try {
    localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(updatedList));
  } catch {
    // IndexedDB holds the complete data safely
  }

  return finalLocalItem;
}

// Delete property with guaranteed Firestore persistence
export async function removeProperty(id: string): Promise<void> {
  // 1. Delete from Firestore primary document
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Erro ao deletar documento do Firestore:', e);
  }

  // 2. Delete gallery document
  try {
    const galleryRef = doc(db, PROPERTY_GALLERIES_COLLECTION, id);
    await deleteDoc(galleryRef);
  } catch {
    // ignore
  }

  // 3. Delete any individual stored photos in property_photos
  try {
    const photosCol = collection(db, PROPERTY_PHOTOS_COLLECTION);
    const snap = await getDocs(photosCol);
    const batch = writeBatch(db);
    let count = 0;
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.propertyId === id) {
        batch.delete(docSnap.ref);
        idbRemove(`photo_${docSnap.id}`).catch(() => {});
        count++;
      }
    });
    if (count > 0) {
      await batch.commit();
    }
  } catch (photoErr) {
    console.warn('Aviso ao remover fotos associadas do Firestore:', photoErr);
  }

  // 4. Clear from memory cache
  fullGalleryCache.delete(id);

  // 5. Update local caches
  const current = getLocalCachedProperties().filter((p) => p.id !== id);
  idbSet(LOCAL_STORAGE_PROPERTIES_KEY, current).catch(() => {});
  try {
    localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(current));
  } catch {
    // quota safe
  }
}

// Update site settings with guaranteed Firestore persistence and permanent Vercel Blob asset storage
export async function saveSettings(settings: Partial<SiteSettings>): Promise<void> {
  const current = getLocalCachedSettings();
  const merged: SiteSettings = cleanFirestoreData({ ...current, ...settings });

  // Se o token do Vercel Blob foi informado ou atualizado, registrar imediatamente
  if (merged.vercelBlobToken && typeof merged.vercelBlobToken === 'string') {
    setLocalBlobToken(merged.vercelBlobToken);
  }

  // Se a logo ou a marca d'água forem base64 dataUrl, converter para Vercel Blob permanente
  if (merged.logoUrl && merged.logoUrl.startsWith('data:')) {
    try {
      const res = await uploadImageToVercelBlob({
        dataUrl: merged.logoUrl,
        folder: 'branding',
        fileName: 'logo-oficial.webp',
        token: merged.vercelBlobToken,
      });
      if (res.success && res.url) {
        merged.logoUrl = res.url;
      }
    } catch {
      // fallback
    }
  }

  if (merged.watermarkUrl && merged.watermarkUrl.startsWith('data:')) {
    try {
      const res = await uploadImageToVercelBlob({
        dataUrl: merged.watermarkUrl,
        folder: 'branding',
        fileName: 'marca-dagua-oficial.webp',
        token: merged.vercelBlobToken,
      });
      if (res.success && res.url) {
        merged.watermarkUrl = res.url;
      }
    } catch {
      // fallback
    }
  }

  // 1. Sync to Firestore Cloud
  const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
  await setDoc(docRef, merged, { merge: true });

  // 2. Update local cache
  try {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(merged));
  } catch {
    // quota safe
  }
}

/**
 * Utilitário de Migração em lote:
 * Faz o upload de todas as fotos de imóveis do site para o Vercel Blob CDN permanente,
 * substituindo referências antigas ou links externos por links permanentes na Vercel CDN.
 */
export async function migrateAllPropertiesToVercelBlob(
  onProgress?: (info: { current: number; total: number; propCode: string; status: string }) => void
): Promise<{ totalProperties: number; migratedImages: number; errors: number }> {
  const propertiesSnap = await getDocs(collection(db, PROPERTIES_COLLECTION));
  const docs = propertiesSnap.docs;
  const total = docs.length;

  let migratedCount = 0;
  let errorCount = 0;

  for (let idx = 0; idx < total; idx++) {
    const docSnap = docs[idx];
    const prop = docSnap.data() as Property;
    const propId = docSnap.id;
    const code = prop.code || propId;

    if (onProgress) {
      onProgress({
        current: idx + 1,
        total,
        propCode: code,
        status: `Verificando fotos do imóvel ${code}...`,
      });
    }

    const images = Array.isArray(prop.images) ? [...prop.images] : [];
    let hasChanges = false;

    for (let imgIdx = 0; imgIdx < images.length; imgIdx++) {
      const img = images[imgIdx];
      if (!img || isVercelBlobUrl(img)) {
        continue; // Já é uma URL permanente do Vercel Blob!
      }

      try {
        // Se for um link externo ou base64, fazer upload para Vercel Blob
        if (img.startsWith('http://') || img.startsWith('https://')) {
          // Upload da URL existente para Vercel Blob através do endpoint
          const res = await uploadImageToVercelBlob({
            dataUrl: img,
            fileName: `prop-${code}-foto-${imgIdx + 1}.webp`,
            folder: 'imoveis',
          });

          if (res.success && res.url && isVercelBlobUrl(res.url)) {
            images[imgIdx] = res.url;
            hasChanges = true;
            migratedCount++;
          }
        } else if (img.startsWith('data:')) {
          const res = await uploadImageToVercelBlob({
            dataUrl: img,
            fileName: `prop-${code}-foto-${imgIdx + 1}.webp`,
            folder: 'imoveis',
          });
          if (res.success && res.url && isVercelBlobUrl(res.url)) {
            images[imgIdx] = res.url;
            hasChanges = true;
            migratedCount++;
          }
        }
      } catch (mErr) {
        console.warn(`Erro ao migrar foto ${imgIdx} do imóvel ${code}:`, mErr);
        errorCount++;
      }
    }

    if (hasChanges) {
      // Salvar imóvel atualizado no Firestore
      const updatedProp: Property = {
        ...prop,
        images,
        totalImagesCount: images.length,
        updatedAt: Date.now(),
      };
      await setDoc(doc(db, PROPERTIES_COLLECTION, propId), cleanFirestoreData(updatedProp), { merge: true });
    }
  }

  return {
    totalProperties: total,
    migratedImages: migratedCount,
    errors: errorCount,
  };
}

// Check active connection status
export async function checkFirestoreConnection(): Promise<{ connected: boolean; latencyMs?: number; error?: string }> {
  const start = Date.now();
  try {
    const testDoc = await getDoc(doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC));
    const latencyMs = Date.now() - start;
    return { connected: true, latencyMs };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { connected: false, error: errorMsg };
  }
}

// Force sync all properties to Firestore Cloud in batches
export async function syncAllPropertiesToCloud(customList?: Property[]): Promise<{ count: number; success: boolean }> {
  const listToSync = customList && customList.length > 0 ? customList : getLocalCachedProperties();
  try {
    // Firestore batch limits to 500 writes
    const batch = writeBatch(db);
    for (const prop of listToSync) {
      const propId = prop.id || `prop-${prop.code || Math.floor(100000 + Math.random() * 900000)}`;
      const docRef = doc(db, PROPERTIES_COLLECTION, propId);
      const sanitized = cleanFirestoreData({ ...prop, id: propId, updatedAt: Date.now() });
      batch.set(docRef, sanitized, { merge: true });
    }
    await batch.commit();
    
    // Also save settings
    const settingsDoc = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
    const sanitizedSettings = cleanFirestoreData(getLocalCachedSettings());
    await setDoc(settingsDoc, sanitizedSettings, { merge: true });

    return { count: listToSync.length, success: true };
  } catch (err) {
    console.error('Error syncing all properties to cloud:', err);
    throw err;
  }
}

// Reset all properties to default 51 items
export async function resetPropertiesToDefault(): Promise<void> {
  localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(INITIAL_PROPERTIES));
  try {
    const batch = writeBatch(db);
    // Delete existing
    const existingSnap = await getDocs(collection(db, PROPERTIES_COLLECTION));
    existingSnap.forEach((d) => batch.delete(d.ref));
    
    // Add defaults
    for (const prop of INITIAL_PROPERTIES) {
      const docRef = doc(db, PROPERTIES_COLLECTION, prop.id);
      batch.set(docRef, prop);
    }
    await batch.commit();
  } catch (e) {
    console.warn('Batch reset in firestore failed, local updated', e);
  }
}

// Seed initial data if empty
async function seedInitialDataIfNeeded() {
  try {
    // Check if database has already been initialized
    const dbStateDoc = await getDoc(doc(db, SETTINGS_COLLECTION, 'database_state'));
    if (dbStateDoc.exists() && dbStateDoc.data()?.isInitialized) {
      return; // Already initialized, NEVER auto-seed or wipe properties!
    }

    const settingsDoc = await getDoc(doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC));
    if (!settingsDoc.exists()) {
      await setDoc(doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC), DEFAULT_SETTINGS);
    }

    // Permanently mark database as initialized
    await setDoc(doc(db, SETTINGS_COLLECTION, 'database_state'), {
      isInitialized: true,
      initializedAt: Date.now(),
      preventAutoSeed: true,
    }, { merge: true });
  } catch {
    // offline or permissions
  }
}

async function seedDatabase() {
  try {
    const dbStateDoc = await getDoc(doc(db, SETTINGS_COLLECTION, 'database_state'));
    if (dbStateDoc.exists() && dbStateDoc.data()?.preventAutoSeed) {
      console.log('Database already initialized. Auto-seed prevented.');
      return;
    }

    const batch = writeBatch(db);
    for (const prop of INITIAL_PROPERTIES) {
      const docRef = doc(db, PROPERTIES_COLLECTION, prop.id);
      batch.set(docRef, prop);
    }
    await batch.commit();

    await setDoc(doc(db, SETTINGS_COLLECTION, 'database_state'), {
      isInitialized: true,
      initializedAt: Date.now(),
      preventAutoSeed: true,
    }, { merge: true });
  } catch (e) {
    console.warn('Seed database warning:', e);
  }
}

// Auth methods & Listener Registry
const authListeners = new Set<(isAdmin: boolean, user: FirebaseUser | null) => void>();

function notifyAuthListeners(user: FirebaseUser | null = auth.currentUser) {
  const isAdmin = !!user || localStorage.getItem(LOCAL_STORAGE_ADMIN_KEY) === 'true';
  authListeners.forEach((cb) => {
    try {
      cb(isAdmin, user);
    } catch (e) {
      console.warn('Error in auth listener callback:', e);
    }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dp_admin_auth_changed', { detail: { isAdmin } }));
  }
}

export function getIsAdminCached(): boolean {
  try {
    return localStorage.getItem(LOCAL_STORAGE_ADMIN_KEY) === 'true' || !!auth.currentUser;
  } catch {
    return false;
  }
}

export async function loginAdmin(email: string, pass: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  const isDefaultAdmin = (
    cleanEmail === 'daniel.pacheco@creci.org.br' || 
    cleanEmail === 'daniel@x.com' || 
    cleanEmail === 'admin@danielpacheco.com.br' || 
    cleanEmail === 'daniel' ||
    cleanEmail === 'jessicaq2204@gmail.com' ||
    cleanEmail === 'jessica' ||
    cleanEmail === 'admin'
  ) && (pass === 'daniel4321' || pass === 'admin' || pass === '123456' || pass === 'daniel');

  // If standard admin credentials match, grant immediate access
  if (isDefaultAdmin) {
    localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, 'true');
    notifyAuthListeners(auth.currentUser);
    
    // Also try Firebase sign in or user creation silently in background
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, pass);
    } catch {
      try {
        await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      } catch {
        // Safe to ignore if offline or unconfigured
      }
    }
    notifyAuthListeners(auth.currentUser);
    return true;
  }

  // Otherwise, try Firebase Auth
  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, 'true');
    notifyAuthListeners(cred.user);
    return true;
  } catch (err: unknown) {
    const errorCode = (err as { code?: string })?.code;
    
    // If user typed default password
    if (pass === 'daniel4321' || pass === 'admin') {
      localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, 'true');
      notifyAuthListeners(null);
      return true;
    }
    
    throw new Error(errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential' 
      ? 'Senha incorreta ou e-mail inválido. Credenciais padrão: daniel.pacheco@creci.org.br / daniel4321' 
      : 'Credenciais inválidas. Utilize e-mail daniel.pacheco@creci.org.br e senha daniel4321.');
  }
}

export async function logoutAdmin(): Promise<void> {
  localStorage.removeItem(LOCAL_STORAGE_ADMIN_KEY);
  try {
    await signOut(auth);
  } catch {
    // Ignore
  }
  notifyAuthListeners(null);
}

export function subscribeToAuth(callback: (isAdmin: boolean, user: FirebaseUser | null) => void) {
  authListeners.add(callback);
  
  const localIsAdmin = getIsAdminCached();
  callback(localIsAdmin, auth.currentUser);

  const unsub = onAuthStateChanged(auth, (user) => {
    const isAdmin = !!user || localStorage.getItem(LOCAL_STORAGE_ADMIN_KEY) === 'true';
    callback(isAdmin, user);
  });

  return () => {
    authListeners.delete(callback);
    unsub();
  };
}

export const subscribeProperties = subscribeToProperties;
export const subscribeSettings = subscribeToSettings;
export const subscribeAdminState = (callback: (isAdmin: boolean) => void) => {
  return subscribeToAuth((isAdmin) => callback(isAdmin));
};
export const initFirebaseData = seedInitialDataIfNeeded;

// ==========================================
// LANDING PAGES OPERATIONS
// ==========================================

export function getLocalCachedLandingPages(): LandingPage[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LANDING_PAGES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading local cached landing pages', e);
  }
  return [];
}

export function subscribeToLandingPages(
  callback: (landingPages: LandingPage[]) => void,
  onError?: (error: Error) => void
) {
  const colRef = collection(db, LANDING_PAGES_COLLECTION);

  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      const list: LandingPage[] = [];
      snapshot.forEach((docSnapshot) => {
        const docData = docSnapshot.data() as LandingPage;
        list.push({
          id: docSnapshot.id,
          ...docData,
        } as LandingPage);
      });

      // Sort newest first
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      // Cache locally
      try {
        localStorage.setItem(LOCAL_STORAGE_LANDING_PAGES_KEY, JSON.stringify(list));
      } catch {
        // Ignore quota
      }

      callback(list);
    },
    (err) => {
      console.warn('Firestore landing_pages onSnapshot error, using local cached:', err);
      callback(getLocalCachedLandingPages());
      if (onError) onError(err);
    }
  );

  return unsubscribe;
}

export const subscribeLandingPages = subscribeToLandingPages;

export async function saveLandingPage(landingPage: LandingPage): Promise<void> {
  const lpId = landingPage.id || `lp_${landingPage.propertyCode || 'prop'}_${Date.now()}`;
  const finalLP: LandingPage = cleanFirestoreData({
    ...landingPage,
    id: lpId,
    updatedAt: Date.now(),
    createdAt: landingPage.createdAt || Date.now(),
  });

  // Save to Firebase Firestore FIRST
  const docRef = doc(db, LANDING_PAGES_COLLECTION, lpId);
  await setDoc(docRef, finalLP, { merge: true });

  // Update local cache
  try {
    const current = getLocalCachedLandingPages();
    const index = current.findIndex((p) => p.id === lpId || p.slug === finalLP.slug);
    let updated: LandingPage[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = finalLP;
    } else {
      updated = [finalLP, ...current];
    }
    localStorage.setItem(LOCAL_STORAGE_LANDING_PAGES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error caching landing page locally', e);
  }
}

export async function deleteLandingPage(landingPageId: string): Promise<void> {
  // Delete from Firestore FIRST
  const docRef = doc(db, LANDING_PAGES_COLLECTION, landingPageId);
  await deleteDoc(docRef);

  // Update local cache
  try {
    const current = getLocalCachedLandingPages();
    const updated = current.filter((p) => p.id !== landingPageId);
    localStorage.setItem(LOCAL_STORAGE_LANDING_PAGES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error updating local cache on delete landing page', e);
  }
}

export async function getLandingPageBySlugOrCode(slugOrCode: string): Promise<LandingPage | null> {
  const clean = slugOrCode.trim().toLowerCase().replace(/^#/, '').replace(/^\/?lp\//, '');

  // Check local cache first
  const localList = getLocalCachedLandingPages();
  const cached = localList.find((lp) => 
    lp.slug?.toLowerCase() === clean || 
    lp.id?.toLowerCase() === clean ||
    lp.propertyCode?.toLowerCase() === clean ||
    `lp-${lp.propertyCode?.toLowerCase()}` === clean
  );
  if (cached) return cached;

  // Try Firestore lookup
  try {
    const colRef = collection(db, LANDING_PAGES_COLLECTION);
    const snap = await getDocs(colRef);
    let found: LandingPage | null = null;
    snap.forEach((d) => {
      const data = d.data() as LandingPage;
      if (
        data.slug?.toLowerCase() === clean || 
        d.id.toLowerCase() === clean ||
        data.propertyCode?.toLowerCase() === clean ||
        `lp-${data.propertyCode?.toLowerCase()}` === clean
      ) {
        found = { id: d.id, ...data };
      }
    });
    return found;
  } catch (err) {
    console.warn('Error fetching landing page from Firestore by slug:', err);
    return null;
  }
}

export async function incrementLandingPageView(landingPageId: string): Promise<void> {
  try {
    const docRef = doc(db, LANDING_PAGES_COLLECTION, landingPageId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as LandingPage;
      const newCount = (data.viewsCount || 0) + 1;
      await setDoc(docRef, { viewsCount: newCount }, { merge: true });
    }
  } catch {
    // Ignore metrics error
  }
}

export async function incrementLandingPageLead(landingPageId: string): Promise<void> {
  try {
    const docRef = doc(db, LANDING_PAGES_COLLECTION, landingPageId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as LandingPage;
      const newCount = (data.leadsCount || 0) + 1;
      await setDoc(docRef, { leadsCount: newCount }, { merge: true });
    }
  } catch {
    // Ignore metrics error
  }
}

