import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Building2, 
  MapPin, 
  DollarSign, 
  Layers, 
  LogOut,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  Settings as SettingsIcon,
  X,
  Upload,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Tag,
  Calendar,
  Bed,
  Bath,
  Car,
  Maximize,
  Check,
  RefreshCw,
  CloudCheck,
  ExternalLink,
  Landmark,
  Camera,
  Smartphone,
  HardDrive,
  CheckCircle,
  Info,
  ImagePlus,
  Stamp,
  Wand2,
  Sliders,
  EyeOff,
  Database,
  Key,
  Globe
} from 'lucide-react';
import { Property, SiteSettings, PropertyStatus, PropertyType } from '../types';
import { 
  loginAdmin, 
  logoutAdmin, 
  saveProperty, 
  removeProperty, 
  saveSettings, 
  resetPropertiesToDefault,
  syncAllPropertiesToCloud,
  checkFirestoreConnection,
  getIsAdminCached,
  fetchFullPropertyGallery,
  migrateAllPropertiesToVercelBlob
} from '../firebase/firebaseService';
import { 
  checkVercelBlobStatus, 
  testVercelBlobConnection 
} from '../utils/blobClient';
import { formatCurrency } from '../utils/formatters';
import { 
  processAndUploadDeviceImages, 
  uploadSingleImageToBlob,
  deleteImageFromVercelBlob,
  isVercelBlobUrl,
  formatBytes, 
  isImageFile 
} from '../utils/imageUploader';
import { 
  WatermarkPosition, 
  WatermarkOptions, 
  DEFAULT_WATERMARK_URL, 
  DEFAULT_WATERMARK_OPACITY, 
  DEFAULT_WATERMARK_POSITION, 
  DEFAULT_WATERMARK_SCALE,
  applyWatermarkToImage,
  applyWatermarkToBatch
} from '../utils/watermark';
import { WatermarkModal } from '../components/WatermarkModal';
import { AdminLandingPageBuilder } from '../components/AdminLandingPageBuilder';

interface AdminPageProps {
  properties: Property[];
  settings: SiteSettings;
  isAdmin: boolean;
  onSelectProperty: (property: Property) => void;
}

const COMMON_FEATURE_SUGGESTIONS = [
  'Sacada com churrasqueira a carvão',
  'Piscina privativa',
  'Espaço gourmet integrado',
  'Acabamento em gesso rebaixado',
  'Piso porcelanato polido',
  'Espera para ar-condicionado Split',
  'Tubulação para água quente',
  'Fechadura digital biométrica',
  'Elevador moderno',
  'Salão de festas decorado',
  'Academia / Fitness center',
  'Playground infantil',
  'Portão eletrônico e interfone',
  'Vista panorâmica para o mar',
  'Mobiliado sob medida',
  'Semi-mobiliado com armários fixos',
  'Edícula com churrasqueira',
  'Infraestrutura completa de loteamento',
  'Documentação 100% regularizada',
  'Garagem coberta privativa'
];

export const AdminPage: React.FC<AdminPageProps> = ({
  properties,
  settings,
  isAdmin,
  onSelectProperty,
}) => {
  // Local admin state fallback for instant response
  const [localAdmin, setLocalAdmin] = useState<boolean>(() => isAdmin || getIsAdminCached());

  // Keep local admin in sync with prop
  useEffect(() => {
    if (isAdmin) {
      setLocalAdmin(true);
    }
  }, [isAdmin]);

  const isUserAdmin = isAdmin || localAdmin;

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Tab: 'properties' | 'settings' | 'landing_pages'
  const [adminTab, setAdminTab] = useState<'properties' | 'settings' | 'landing_pages'>('properties');
  const [searchFilter, setSearchFilter] = useState('');

  // Property Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'general' | 'areas' | 'photos' | 'features' | 'desc'>('general');
  const [editingProperty, setEditingProperty] = useState<Partial<Property> | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [formValidationError, setFormValidationError] = useState<string | null>(null);
  const [isSavingProperty, setIsSavingProperty] = useState(false);

  // Photos Helper state in Modal
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [bulkPhotosInput, setBulkPhotosInput] = useState('');
  const [showBulkPhotoInput, setShowBulkPhotoInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const watermarkInputRef = useRef<HTMLInputElement | null>(null);
  const floorPlanInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingWatermark, setIsUploadingWatermark] = useState(false);
  const [isUploadingFloorPlan, setIsUploadingFloorPlan] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; fileName: string; percent: number; stage?: string } | null>(null);
  const [uploadStatsMsg, setUploadStatsMsg] = useState<string | null>(null);
  const [isDraggingPhotos, setIsDraggingPhotos] = useState(false);

  // Watermark States (Marca d'Água Daniel Pacheco)
  const [isWatermarkModalOpen, setIsWatermarkModalOpen] = useState(false);
  const [watermarkTargetIdx, setWatermarkTargetIdx] = useState<number>(0);
  const [autoWatermarkOnUpload, setAutoWatermarkOnUpload] = useState<boolean>(true);
  const [watermarkStatsMsg, setWatermarkStatsMsg] = useState<string | null>(null);
  const [isApplyingWatermarkBatch, setIsApplyingWatermarkBatch] = useState(false);

  // Admin table filter
  const [financingAdminFilter, setFinancingAdminFilter] = useState<'Todos' | 'Bancario' | 'Construtora' | 'Destaques'>('Todos');

  // Features Helper state in Modal
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Firebase Real-time Connection Status
  const [connectionStatus, setConnectionStatus] = useState<{ connected: boolean; latencyMs?: number; checking: boolean }>({
    connected: true,
    latencyMs: 120,
    checking: false
  });
  const [syncCloudMsg, setSyncCloudMsg] = useState('');
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  // Vercel Blob Storage & CDN Status
  const [blobStatus, setBlobStatus] = useState<{ configured: boolean; message: string; hasEnv?: boolean } | null>(null);
  const [isTestingBlob, setIsTestingBlob] = useState(false);
  const [blobTestResult, setBlobTestResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);
  const [showBlobToken, setShowBlobToken] = useState(false);
  const [isMigratingPhotos, setIsMigratingPhotos] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState<{ current: number; total: number; propCode: string; status: string } | null>(null);
  const [migrationResult, setMigrationResult] = useState<{ totalProperties: number; migratedImages: number; errors: number } | null>(null);

  // Check Vercel Blob Status on login
  useEffect(() => {
    if (!isUserAdmin) return;
    checkVercelBlobStatus().then((status) => {
      setBlobStatus(status);
    }).catch(() => {});
  }, [isUserAdmin]);

  const handleTestBlobConnection = async () => {
    setIsTestingBlob(true);
    setBlobTestResult(null);
    try {
      const res = await testVercelBlobConnection(settingsForm.vercelBlobToken);
      setBlobTestResult(res);
      if (res.success) {
        setBlobStatus({ configured: true, message: 'Conectado e validado no Vercel Blob CDN', hasEnv: true });
      }
    } catch (err: any) {
      setBlobTestResult({ success: false, error: err?.message || 'Falha ao testar conexão' });
    } finally {
      setIsTestingBlob(false);
    }
  };

  const handleMigrateAllPhotosToBlob = async () => {
    if (!window.confirm('Iniciar a migração de todas as fotos dos imóveis para o Vercel Blob CDN permanente?')) return;
    setIsMigratingPhotos(true);
    setMigrationProgress(null);
    setMigrationResult(null);
    try {
      const result = await migrateAllPropertiesToVercelBlob((info) => {
        setMigrationProgress(info);
      });
      setMigrationResult(result);
      // Atualizar status
      const newStatus = await checkVercelBlobStatus();
      setBlobStatus(newStatus);
    } catch (err: any) {
      alert('Erro durante a migração: ' + (err?.message || 'Erro de comunicação'));
    } finally {
      setIsMigratingPhotos(false);
    }
  };

  // Periodic Firebase Connection Check
  useEffect(() => {
    let isMounted = true;
    const verifyConn = async () => {
      if (!isUserAdmin) return;
      const res = await checkFirestoreConnection();
      if (isMounted) {
        setConnectionStatus({
          connected: res.connected,
          latencyMs: res.latencyMs || 85,
          checking: false
        });
      }
    };

    verifyConn();
    const interval = setInterval(verifyConn, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isUserAdmin]);

  // Keep settingsForm in sync with parent settings
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await loginAdmin(email, password);
      setLocalAdmin(true);
    } catch (err: any) {
      setLoginError(err.message || 'Erro ao realizar login.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setLocalAdmin(false);
  };

  // Handle New Property
  const handleAddNew = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setEditingProperty({
      id: `prop-${newCode}`,
      code: newCode,
      title: '',
      headline: '',
      description: '',
      shortDescription: '',
      city: 'Criciúma',
      neighborhood: 'Centro',
      state: 'SC',
      type: 'Apartamento',
      status: 'Na planta',
      price: 450000,
      priceFormatted: 'R$ 450.000,00',
      areaM2: 75,
      bedrooms: 2,
      suites: 1,
      bathrooms: 2,
      garageSpaces: 1,
      developer: 'Fontana',
      featured: false,
      directFinancing: true,
      deliveryYear: 'Dezembro / 2026',
      images: [],
      features: ['Sacada com churrasqueira a carvão', 'Piso porcelanato polido', 'Espera para ar-condicionado Split'],
    });
    setModalTab('general');
    setFormValidationError(null);
    setSaveSuccessMsg('');
    setIsModalOpen(true);
  };

  // Handle Edit Property
  const handleEdit = async (prop: Property) => {
    let imagesToEdit = prop.images && prop.images.length > 0 ? [...prop.images] : [];
    if (prop.hasExtendedGallery || (prop.totalImagesCount && prop.totalImagesCount > imagesToEdit.length)) {
      try {
        const full = await fetchFullPropertyGallery(prop.id);
        if (full && full.length > imagesToEdit.length) {
          imagesToEdit = full;
        }
      } catch (err) {
        console.warn('Erro ao carregar galeria completa no admin:', err);
      }
    }

    setEditingProperty({ 
      ...prop,
      images: imagesToEdit,
      features: prop.features && prop.features.length > 0 ? [...prop.features] : []
    });
    setModalTab('general');
    setFormValidationError(null);
    setSaveSuccessMsg('');
    setIsModalOpen(true);
  };

  // Handle Delete Property
  const handleDelete = async (id: string, code: string) => {
    if (window.confirm(`Tem certeza que deseja remover permanentemente o imóvel Cód. ${code} do Firebase?`)) {
      await removeProperty(id);
    }
  };

  // Photo Management in Property Modal
  const handleAddPhotoUrl = async () => {
    const rawUrl = newPhotoUrl.trim();
    if (!rawUrl || !editingProperty) return;
    setNewPhotoUrl('');

    let finalUrl = rawUrl;
    if (autoWatermarkOnUpload) {
      try {
        setWatermarkStatsMsg('Aplicando marca d\'água oficial na foto...');
        finalUrl = await applyWatermarkToImage(rawUrl, {
          watermarkUrl: settings.watermarkUrl || DEFAULT_WATERMARK_URL,
          opacity: settings.watermarkOpacity ?? DEFAULT_WATERMARK_OPACITY,
          position: (settings.watermarkPosition as WatermarkPosition) || DEFAULT_WATERMARK_POSITION,
          scale: settings.watermarkScale || DEFAULT_WATERMARK_SCALE,
        });
        setWatermarkStatsMsg('✓ Foto adicionada com marca d\'água oficial!');
        setTimeout(() => setWatermarkStatsMsg(null), 4000);
      } catch (err) {
        console.warn('Não foi possível aplicar marca d água no link:', err);
      }
    }

    const currentImages = editingProperty.images ? [...editingProperty.images] : [];
    setEditingProperty({
      ...editingProperty,
      images: [...currentImages, finalUrl]
    });
  };

  const handleAddBulkPhotos = async () => {
    if (!bulkPhotosInput.trim() || !editingProperty) return;
    const lines = bulkPhotosInput
      .split(/[\n,]+/)
      .map(url => url.trim())
      .filter(url => url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image'));
    
    if (lines.length === 0) return;
    setBulkPhotosInput('');
    setShowBulkPhotoInput(false);

    let processedLines = lines;
    if (autoWatermarkOnUpload) {
      try {
        setWatermarkStatsMsg(`Aplicando marca d'água oficial em ${lines.length} fotos...`);
        processedLines = await applyWatermarkToBatch(
          lines,
          {
            watermarkUrl: settings.watermarkUrl || DEFAULT_WATERMARK_URL,
            opacity: settings.watermarkOpacity ?? DEFAULT_WATERMARK_OPACITY,
            position: (settings.watermarkPosition as WatermarkPosition) || DEFAULT_WATERMARK_POSITION,
            scale: settings.watermarkScale || DEFAULT_WATERMARK_SCALE,
          },
          (current, total) => {
            setWatermarkStatsMsg(`Aplicando marca d'água na foto ${current} de ${total}...`);
          }
        );
        setWatermarkStatsMsg(`✓ ${processedLines.length} fotos adicionadas com marca d'água oficial!`);
        setTimeout(() => setWatermarkStatsMsg(null), 4000);
      } catch (err) {
        console.warn('Erro ao aplicar marca d água em lote de URLs:', err);
      }
    }

    const currentImages = editingProperty.images ? [...editingProperty.images] : [];
    setEditingProperty({
      ...editingProperty,
      images: [...currentImages, ...processedLines]
    });
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    if (!editingProperty || !editingProperty.images) return;
    const removedUrl = editingProperty.images[indexToRemove];
    const updated = editingProperty.images.filter((_, idx) => idx !== indexToRemove);
    setEditingProperty({
      ...editingProperty,
      images: updated
    });
    // Se for URL do Vercel Blob, acionar deleção segura na CDN
    if (removedUrl && isVercelBlobUrl(removedUrl)) {
      deleteImageFromVercelBlob(removedUrl).catch((err) => console.warn('Aviso ao remover blob na Vercel:', err));
    }
  };

  const handleMovePhoto = (fromIndex: number, toIndex: number) => {
    if (!editingProperty || !editingProperty.images) return;
    if (toIndex < 0 || toIndex >= editingProperty.images.length) return;
    const updated = [...editingProperty.images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setEditingProperty({
      ...editingProperty,
      images: updated
    });
  };

  const handleSetCoverPhoto = (index: number) => {
    handleMovePhoto(index, 0);
  };

  // High-performance direct device image upload (Camera + Gallery + Desktop Drag-and-Drop)
  const processDeviceFiles = async (fileList: FileList | File[]) => {
    const rawFiles = Array.from(fileList).filter((f) => isImageFile(f));
    if (rawFiles.length === 0) {
      setUploadStatsMsg('Nenhum arquivo de imagem válido selecionado. Selecione arquivos JPG, PNG, WEBP ou HEIC.');
      setTimeout(() => setUploadStatsMsg(null), 5000);
      return;
    }
    if (!editingProperty) return;

    setIsUploadingImages(true);
    setUploadStatsMsg(null);
    setUploadProgress({ current: 1, total: rawFiles.length, fileName: rawFiles[0].name, percent: 5 });

    try {
      const watermarkOptions = autoWatermarkOnUpload ? {
        watermarkUrl: settings.watermarkUrl || DEFAULT_WATERMARK_URL,
        opacity: settings.watermarkOpacity ?? DEFAULT_WATERMARK_OPACITY,
        position: (settings.watermarkPosition as WatermarkPosition) || DEFAULT_WATERMARK_POSITION,
        scale: settings.watermarkScale || DEFAULT_WATERMARK_SCALE,
      } : null;

      const uploadedUrls = await processAndUploadDeviceImages(
        rawFiles, 
        (info) => {
          setUploadProgress(info);
        },
        watermarkOptions
      );

      if (uploadedUrls.length > 0) {
        setEditingProperty((prev) => {
          if (!prev) return prev;
          const currentImages = prev.images || [];
          return {
            ...prev,
            images: [...currentImages, ...uploadedUrls]
          };
        });

        const wmNote = autoWatermarkOnUpload ? ' com marca d\'água oficial' : '';
        setUploadStatsMsg(`✓ ${uploadedUrls.length} ${uploadedUrls.length === 1 ? 'foto otimizada e adicionada' : 'fotos otimizadas e adicionadas'}${wmNote} com sucesso!`);
        setTimeout(() => setUploadStatsMsg(null), 6000);
      }
    } catch (err: any) {
      console.error('Erro no processamento de fotos:', err);
      setUploadStatsMsg(`Erro ao processar fotos: ${err?.message || 'Tente novamente'}`);
    } finally {
      setIsUploadingImages(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  // Quick Apply Watermark to All Current Photos
  const handleQuickApplyWatermarkAll = async () => {
    if (!editingProperty || !editingProperty.images || editingProperty.images.length === 0) {
      setWatermarkStatsMsg('Nenhuma foto disponível para aplicar marca d\'água.');
      setTimeout(() => setWatermarkStatsMsg(null), 4000);
      return;
    }

    setIsApplyingWatermarkBatch(true);
    setWatermarkStatsMsg('Aplicando marca d\'água oficial nas fotos...');

    try {
      const options: WatermarkOptions = {
        watermarkUrl: settings.watermarkUrl || DEFAULT_WATERMARK_URL,
        opacity: settings.watermarkOpacity ?? DEFAULT_WATERMARK_OPACITY,
        position: (settings.watermarkPosition as WatermarkPosition) || DEFAULT_WATERMARK_POSITION,
        scale: settings.watermarkScale || DEFAULT_WATERMARK_SCALE,
      };

      const watermarkedList = await applyWatermarkToBatch(
        editingProperty.images,
        options,
        (current, total) => {
          setWatermarkStatsMsg(`Aplicando marca d'água na foto ${current} de ${total}...`);
        }
      );

      setEditingProperty({
        ...editingProperty,
        images: watermarkedList,
      });

      setWatermarkStatsMsg(`✓ Marca d'água oficial aplicada em todas as ${watermarkedList.length} fotos com sucesso!`);
      setTimeout(() => setWatermarkStatsMsg(null), 5000);
    } catch (err: any) {
      console.error('Erro ao aplicar marca d\'água em lote:', err);
      setWatermarkStatsMsg(`Erro ao aplicar marca d'água: ${err?.message || 'Falha no processamento'}`);
      setTimeout(() => setWatermarkStatsMsg(null), 6000);
    } finally {
      setIsApplyingWatermarkBatch(false);
    }
  };

  // Quick Apply Watermark to Single Photo
  const handleQuickApplyWatermarkSingle = async (index: number) => {
    if (!editingProperty || !editingProperty.images || !editingProperty.images[index]) return;

    setWatermarkStatsMsg(`Aplicando marca d'água na foto ${index + 1}...`);
    try {
      const options: WatermarkOptions = {
        watermarkUrl: settings.watermarkUrl || DEFAULT_WATERMARK_URL,
        opacity: settings.watermarkOpacity ?? DEFAULT_WATERMARK_OPACITY,
        position: (settings.watermarkPosition as WatermarkPosition) || DEFAULT_WATERMARK_POSITION,
        scale: settings.watermarkScale || DEFAULT_WATERMARK_SCALE,
      };

      const watermarked = await applyWatermarkToImage(editingProperty.images[index], options);
      const updated = [...editingProperty.images];
      updated[index] = watermarked;

      setEditingProperty({
        ...editingProperty,
        images: updated,
      });

      setWatermarkStatsMsg(`✓ Marca d'água aplicada na foto ${index + 1} com sucesso!`);
      setTimeout(() => setWatermarkStatsMsg(null), 4000);
    } catch (err: any) {
      console.error('Erro ao aplicar marca d\'água na foto:', err);
      setWatermarkStatsMsg(`Erro ao aplicar marca d'água: ${err?.message || 'Falha no processamento'}`);
      setTimeout(() => setWatermarkStatsMsg(null), 5000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processDeviceFiles(e.target.files);
    }
  };

  const handleDropPhotos = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPhotos(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processDeviceFiles(e.dataTransfer.files);
    }
  };

  // Upload Direto da Logo para Vercel Blob
  const handleUploadLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!isImageFile(file)) {
      alert('Por favor, selecione uma imagem válida para a logo (PNG, JPG ou SVG).');
      return;
    }
    setIsUploadingLogo(true);
    try {
      const res = await uploadSingleImageToBlob(file, 'branding');
      if (res.url) {
        setSettingsForm((prev) => ({ ...prev, logoUrl: res.url }));
      }
    } catch (err) {
      console.error('Erro ao enviar logo:', err);
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  // Upload Direto da Imagem da Marca d'Água para Vercel Blob
  const handleUploadWatermarkFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!isImageFile(file)) {
      alert('Por favor, selecione um arquivo de imagem PNG com fundo transparente.');
      return;
    }
    setIsUploadingWatermark(true);
    try {
      const res = await uploadSingleImageToBlob(file, 'branding');
      if (res.url) {
        setSettingsForm((prev) => ({ ...prev, watermarkUrl: res.url }));
      }
    } catch (err) {
      console.error('Erro ao enviar marca d\'água:', err);
    } finally {
      setIsUploadingWatermark(false);
      if (watermarkInputRef.current) watermarkInputRef.current.value = '';
    }
  };

  // Upload Direto da Imagem da Planta Baixa para Vercel Blob
  const handleUploadFloorPlanFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !editingProperty) return;
    const file = e.target.files[0];
    if (!isImageFile(file)) {
      alert('Por favor, selecione uma imagem válida para a planta baixa.');
      return;
    }
    setIsUploadingFloorPlan(true);
    try {
      const res = await uploadSingleImageToBlob(file, 'plantas');
      if (res.url) {
        setEditingProperty((prev) => prev ? { ...prev, floorPlanUrl: res.url } : prev);
      }
    } catch (err) {
      console.error('Erro ao enviar planta baixa:', err);
    } finally {
      setIsUploadingFloorPlan(false);
      if (floorPlanInputRef.current) floorPlanInputRef.current.value = '';
    }
  };

  // Quick 1-Click Toggles for Admin Table rows (synchronizes directly to Firebase Firestore)
  const handleToggleBankFinancing = async (prop: Property, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated: Property = {
      ...prop,
      bankFinancing: !prop.bankFinancing,
      updatedAt: Date.now()
    };
    await saveProperty(updated);
  };

  const handleToggleDirectFinancing = async (prop: Property, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated: Property = {
      ...prop,
      directFinancing: !prop.directFinancing,
      updatedAt: Date.now()
    };
    await saveProperty(updated);
  };

  const handleToggleFeatured = async (prop: Property, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated: Property = {
      ...prop,
      featured: !prop.featured,
      updatedAt: Date.now()
    };
    await saveProperty(updated);
  };

  // Feature Management in Property Modal
  const handleAddFeature = (featText?: string) => {
    const textToAdd = featText || newFeatureInput.trim();
    if (!textToAdd || !editingProperty) return;

    const current = editingProperty.features ? [...editingProperty.features] : [];
    if (!current.includes(textToAdd)) {
      setEditingProperty({
        ...editingProperty,
        features: [...current, textToAdd]
      });
    }
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (featToRemove: string) => {
    if (!editingProperty || !editingProperty.features) return;
    setEditingProperty({
      ...editingProperty,
      features: editingProperty.features.filter(f => f !== featToRemove)
    });
  };

  // Handle Save Property Submit
  const handleSavePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormValidationError(null);

    if (!editingProperty) return;

    // Validation 1: Title is required
    if (!editingProperty.title || !editingProperty.title.trim()) {
      setModalTab('general');
      setFormValidationError('Preencha o Título do Empreendimento / Imóvel para salvar no Firebase.');
      return;
    }

    // Validation 2: Wait if images are still uploading
    if (isUploadingImages) {
      setFormValidationError('Aguarde o processamento e envio das fotos terminar antes de salvar.');
      return;
    }

    // Auto-generate code if empty
    const propCode = editingProperty.code?.trim() || Math.floor(100000 + Math.random() * 900000).toString();
    const propNeighborhood = editingProperty.neighborhood?.trim() || 'Centro';
    const propCity = editingProperty.city?.trim() || 'Criciúma';

    const propertyToSave: Property = {
      ...(editingProperty as Property),
      code: propCode,
      neighborhood: propNeighborhood,
      city: propCity,
      images: editingProperty.images || [],
      features: editingProperty.features || [],
    };

    setIsSavingProperty(true);
    try {
      await saveProperty(propertyToSave);
      setSaveSuccessMsg('✓ Imóvel e fotos salvos com sucesso e sincronizados no Firebase!');
      setTimeout(() => {
        setSaveSuccessMsg('');
        setIsModalOpen(false);
        setEditingProperty(null);
        setIsSavingProperty(false);
      }, 1200);
    } catch (err: any) {
      console.error('Error saving property:', err);
      setIsSavingProperty(false);
      setFormValidationError(`Erro ao salvar no Firebase: ${err?.message || 'Falha de comunicação'}. Verifique sua internet.`);
    }
  };

  // Handle Save Settings Submit
  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await saveSettings(settingsForm);
      setSettingsSavedMsg('Configurações sincronizadas no Firebase com sucesso!');
      setTimeout(() => setSettingsSavedMsg(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Erro ao salvar configurações no Firebase.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Handle Cloud Sync for all properties
  const handleForceCloudSync = async () => {
    setIsSyncingCloud(true);
    setSyncCloudMsg('');
    try {
      const res = await syncAllPropertiesToCloud(properties);
      setSyncCloudMsg(`Sucesso! ${res.count} imóveis e configurações gravados na nuvem do Firebase.`);
      setTimeout(() => setSyncCloudMsg(''), 4000);
    } catch (err) {
      console.error('Error in batch sync:', err);
      setSyncCloudMsg('Erro ao sincronizar com nuvem. Tente novamente.');
    } finally {
      setIsSyncingCloud(false);
    }
  };

  // Handle Reset DB to 51 defaults
  const handleResetDatabase = async () => {
    if (window.confirm('Atenção: Isso redefinirá todo o banco de dados no Firebase com os 51 imóveis originais alinhados. Deseja continuar?')) {
      await resetPropertiesToDefault();
      alert('Banco de dados restaurado com 51 imóveis oficiais no Firebase com sucesso!');
    }
  };

  // Filter properties in admin
  const filteredList = properties.filter((p) => {
    if (financingAdminFilter === 'Bancario' && !p.bankFinancing) return false;
    if (financingAdminFilter === 'Construtora' && !p.directFinancing) return false;
    if (financingAdminFilter === 'Destaques' && !p.featured) return false;

    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.neighborhood.toLowerCase().includes(q) ||
      (p.developer && p.developer.toLowerCase().includes(q))
    );
  });

  // If not logged in, show login form
  if (!isUserAdmin) {
    return (
      <div id="admin-login-screen" className="min-h-screen pt-36 pb-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center p-2">
              <img
                src={settings.logoUrl || "https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png"}
                alt="Daniel Pacheco Consultoria Imobiliária Logo Oficial"
                className="h-16 w-auto max-w-[260px] object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold font-serif-luxury text-[#111111]">
              Área Administrativa
            </h2>
            <p className="text-xs text-[#5A5A5A]">
              Acesso exclusivo para gestão de imóveis, fotos e conexão com Firebase.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#111111] mb-1.5 block">E-mail do Administrador</label>
              <input
                id="admin-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="daniel.pacheco@creci.org.br"
                className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#111111] mb-1.5 block">Senha de Acesso</label>
              <input
                id="admin-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
              />
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoggingIn ? 'Autenticando...' : 'Acessar Painel'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Logged in Dashboard
  return (
    <div id="admin-dashboard" className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header & Live Firebase Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
        <div className="flex items-center gap-4">
          <img
            src={settings.logoUrl || "https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png"}
            alt="Logo Daniel Pacheco Oficial"
            className="h-12 w-auto max-w-[190px] object-contain shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A227] uppercase tracking-wider mb-0.5">
              <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
              <span>Painel Administrativo Daniel Pacheco</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#111111]">
              Gestão de Imóveis & Conexão Firebase
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Live Firebase Connection Badge */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#E5E0D8] text-xs font-medium shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1F8A4C] animate-pulse" />
            <span className="text-[#111111]">Firebase Firestore:</span>
            <span className="text-[#1F8A4C] font-semibold">Online (Tempo Real)</span>
            <span className="text-[10px] text-[#5A5A5A]">~{connectionStatus.latencyMs}ms</span>
          </div>

          <button
            onClick={handleForceCloudSync}
            disabled={isSyncingCloud}
            className="px-3.5 py-2 rounded-xl bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            title="Garante que todos os imóveis e fotos estejam salvos na nuvem do Firebase"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#C9A227] ${isSyncingCloud ? 'animate-spin' : ''}`} />
            <span>{isSyncingCloud ? 'Sincronizando...' : 'Sincronizar com Nuvem'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#5A5A5A] hover:text-[#111111] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {syncCloudMsg && (
        <div className="p-3.5 rounded-2xl bg-[#1F8A4C]/15 border border-[#1F8A4C]/30 text-xs text-[#1F8A4C] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#1F8A4C] shrink-0" />
          <span>{syncCloudMsg}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm">
          <span className="text-[10px] uppercase text-[#5A5A5A] block font-mono">Total de Imóveis</span>
          <span className="text-2xl font-bold text-[#111111] mt-1 block">{properties.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm">
          <span className="text-[10px] uppercase text-[#5A5A5A] block font-mono">Na Planta / Em Obras</span>
          <span className="text-2xl font-bold text-[#1F8A4C] mt-1 block">
            {properties.filter((p) => p.status === 'Na planta' || p.status === 'Em obras').length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm">
          <span className="text-[10px] uppercase text-[#5A5A5A] block font-mono">Prontos para Morar</span>
          <span className="text-2xl font-bold text-[#111111] mt-1 block">
            {properties.filter((p) => p.status === 'Pronto').length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm">
          <span className="text-[10px] uppercase text-[#5A5A5A] block font-mono">Seleção Exclusiva</span>
          <span className="text-2xl font-bold text-[#C9A227] mt-1 block">
            {properties.filter((p) => p.featured).length}
          </span>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-[#FFFFFF] p-1.5 rounded-2xl border border-[#E5E0D8] shadow-sm">
          <button
            onClick={() => setAdminTab('properties')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              adminTab === 'properties'
                ? 'bg-[#0A0A0A] text-[#FFFFFF] shadow-sm'
                : 'text-[#5A5A5A] hover:text-[#111111]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Gerenciar Imóveis ({properties.length})</span>
          </button>

          <button
            id="admin-tab-landing-pages"
            onClick={() => setAdminTab('landing_pages')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              adminTab === 'landing_pages'
                ? 'bg-[#0A0A0A] text-[#C9A227] shadow-sm font-bold border border-[#C9A227]/40'
                : 'text-[#5A5A5A] hover:text-[#111111]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C9A227]" />
            <span>CRIAR LANDING PAGE (IA & Anúncios)</span>
          </button>

          <button
            onClick={() => setAdminTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              adminTab === 'settings'
                ? 'bg-[#0A0A0A] text-[#FFFFFF] shadow-sm'
                : 'text-[#5A5A5A] hover:text-[#111111]'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Contatos & Textos do Portal</span>
          </button>
        </div>

        {adminTab === 'properties' && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDatabase}
              className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#5A5A5A] hover:text-[#111111] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Restaurar os 51 imóveis originais alinhados"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar 51 Imóveis</span>
            </button>

            <button
              id="admin-add-property-btn"
              onClick={handleAddNew}
              className="px-4 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Imóvel</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Properties Table */}
      {adminTab === 'properties' && (
        <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-6 space-y-6 shadow-sm">
          {/* Search bar and quick filters inside admin */}
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#5A5A5A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por título, código, bairro, construtora..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl pl-9 pr-3 py-2.5 outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-[#5A5A5A] mr-1 hidden sm:inline">Exibir:</span>
              <button
                onClick={() => setFinancingAdminFilter('Todos')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  financingAdminFilter === 'Todos'
                    ? 'bg-[#0A0A0A] text-white shadow-sm font-semibold'
                    : 'bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#111111]'
                }`}
              >
                Todos ({properties.length})
              </button>
              <button
                onClick={() => setFinancingAdminFilter('Bancario')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-all ${
                  financingAdminFilter === 'Bancario'
                    ? 'bg-[#0284C7] text-white shadow-sm font-semibold'
                    : 'bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#0284C7]'
                }`}
              >
                <Landmark className="w-3 h-3" />
                <span>Fin. Bancário ({properties.filter(p => p.bankFinancing).length})</span>
              </button>
              <button
                onClick={() => setFinancingAdminFilter('Construtora')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-all ${
                  financingAdminFilter === 'Construtora'
                    ? 'bg-[#1F8A4C] text-white shadow-sm font-semibold'
                    : 'bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#1F8A4C]'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Construtora ({properties.filter(p => p.directFinancing).length})</span>
              </button>
              <button
                onClick={() => setFinancingAdminFilter('Destaques')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-all ${
                  financingAdminFilter === 'Destaques'
                    ? 'bg-[#C9A227] text-[#0A0A0A] shadow-sm font-semibold'
                    : 'bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#C9A227]'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Destaques ({properties.filter(p => p.featured).length})</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[860px]">
              <thead>
                <tr className="border-b border-[#E5E0D8] text-[#5A5A5A] uppercase tracking-wider font-mono text-[10px]">
                  <th className="py-3 px-3">Cód.</th>
                  <th className="py-3 px-3">Foto / Imóvel</th>
                  <th className="py-3 px-3">Tipo / Status</th>
                  <th className="py-3 px-3">Área / Dorm.</th>
                  <th className="py-3 px-3">Valor</th>
                  <th className="py-3 px-3">Financiamento / Destaque (1-Clique)</th>
                  <th className="py-3 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8] text-[#111111]">
                {filteredList.map((prop) => {
                  const coverImage = prop.images && prop.images.length > 0 ? prop.images[0] : '';
                  return (
                    <tr key={prop.id} className="hover:bg-[#F7F3EB]/60 transition-colors">
                      <td className="py-3.5 px-3 font-mono text-[#C9A227] font-bold">
                        {prop.code}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] overflow-hidden shrink-0 flex items-center justify-center">
                            {coverImage ? (
                              <img
                                src={coverImage}
                                alt={prop.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-[#5A5A5A]" />
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <div className="font-bold text-[#111111] line-clamp-1 max-w-xs">{prop.title}</div>
                            <div className="text-[11px] text-[#5A5A5A] flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#C9A227]" />
                              <span>{prop.neighborhood}, {prop.city}</span>
                              {prop.developer && <span className="text-[#C9A227] font-medium">• {prop.developer}</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F7F3EB] text-[#111111] border border-[#E5E0D8] block w-fit">
                            {prop.type}
                          </span>
                          <span className="text-[10px] text-[#5A5A5A] block">
                            {prop.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-[#5A5A5A]">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-[#111111]">
                            {prop.areaM2 ? `${prop.areaM2} m²` : '-'}
                          </div>
                          <div className="text-[10px]">
                            {prop.bedrooms !== undefined && prop.bedrooms > 0 ? `${prop.bedrooms} dorm.` : ''}
                            {prop.suites !== undefined && prop.suites > 0 ? ` (${prop.suites} suíte)` : ''}
                            {prop.garageSpaces !== undefined && prop.garageSpaces > 0 ? ` • ${prop.garageSpaces} vg` : ''}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-[#111111]">
                          {prop.priceFormatted || formatCurrency(prop.price)}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[210px]">
                          {/* 1-click Bank Financing Toggle */}
                          <button
                            onClick={(e) => handleToggleBankFinancing(prop, e)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                              prop.bankFinancing
                                ? 'bg-[#0284C7] text-white shadow-xs'
                                : 'bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#0284C7] border border-[#E5E0D8]'
                            }`}
                            title="Clique para alternar Financiamento Bancário no Firebase"
                          >
                            <Landmark className="w-2.5 h-2.5" />
                            <span>{prop.bankFinancing ? 'Bancário: SIM' : 'Bancário: NÃO'}</span>
                          </button>

                          {/* 1-click Construction Financing Toggle */}
                          <button
                            onClick={(e) => handleToggleDirectFinancing(prop, e)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                              prop.directFinancing
                                ? 'bg-[#1F8A4C] text-white shadow-xs'
                                : 'bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#1F8A4C] border border-[#E5E0D8]'
                            }`}
                            title="Clique para alternar Direto com a Construtora no Firebase"
                          >
                            <ShieldCheck className="w-2.5 h-2.5" />
                            <span>{prop.directFinancing ? 'Construtora: SIM' : 'Construtora: NÃO'}</span>
                          </button>

                          {/* 1-click Featured Toggle */}
                          <button
                            onClick={(e) => handleToggleFeatured(prop, e)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                              prop.featured
                                ? 'bg-[#C9A227] text-[#0A0A0A] shadow-xs'
                                : 'bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#C9A227] border border-[#E5E0D8]'
                            }`}
                            title="Clique para destacar na Home (Seleção Exclusiva)"
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>{prop.featured ? 'Destaque: SIM' : 'Destaque: NÃO'}</span>
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              const updated = { ...prop, isArchived: !prop.isArchived, publicationStatus: prop.isArchived ? 'published' : 'archived' };
                              saveProperty(updated);
                            }}
                            className={`p-2 rounded-xl cursor-pointer transition-colors ${prop.isArchived ? 'bg-orange-100 text-orange-600' : 'bg-[#F7F3EB] text-[#5A5A5A] hover:bg-orange-100 hover:text-orange-600'}`}
                            title={prop.isArchived ? "Restaurar Anúncio" : "Arquivar Anúncio"}
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                              const duplicated = { ...prop, id: `prop-${newCode}`, code: newCode, title: `${prop.title} (Cópia)` };
                              saveProperty(duplicated);
                            }}
                            className="p-2 rounded-xl bg-[#F7F3EB] hover:bg-[#C9A227]/20 text-[#5A5A5A] hover:text-[#C9A227] cursor-pointer transition-colors"
                            title="Duplicar Imóvel"
                          >
                            <Layers className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onSelectProperty(prop)}
                            className="p-2 rounded-xl bg-[#F7F3EB] hover:bg-[#EAE4D8] text-[#5A5A5A] hover:text-[#C9A227] cursor-pointer transition-colors"
                            title="Visualizar Página do Imóvel"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(prop)}
                            className="p-2 rounded-xl bg-[#C9A227]/15 hover:bg-[#C9A227]/30 text-[#C9A227] hover:text-[#B8931F] cursor-pointer transition-colors"
                            title="Editar Dados, Áreas e Fotos"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prop.id, prop.code)}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer transition-colors"
                            title="Excluir Imóvel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Site Settings Form */}
      {adminTab === 'settings' && (
        <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h3 className="text-xl font-bold font-serif-luxury text-[#111111]">
              Dados de Contato & Identidade Visual
            </h3>
            <p className="text-xs text-[#5A5A5A] mt-1">
              Edite as informações exibidas no cabeçalho, rodapé e botões de WhatsApp do portal. Todas as alterações são salvas no Firebase.
            </p>
          </div>

          {settingsSavedMsg && (
            <div className="p-3.5 rounded-xl bg-[#1F8A4C]/15 border border-[#1F8A4C]/30 text-xs text-[#1F8A4C] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1F8A4C] shrink-0" />
              <span>{settingsSavedMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettingsSubmit} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-[#111111] block">URL da Logo Oficial do Site</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={logoInputRef}
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={handleUploadLogoFile}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isUploadingLogo}
                    className="px-2.5 py-1 rounded-lg bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {isUploadingLogo ? (
                      <>
                        <RefreshCw className="w-3 h-3 text-[#C9A227] animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3 text-[#C9A227]" />
                        <span>Enviar Logo (Vercel Blob)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                  type="url"
                  value={settingsForm.logoUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                  placeholder="https://...vercel-storage.com/... ou link direto"
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
                {settingsForm.logoUrl && (
                  <div className="shrink-0 p-2 bg-[#0A0A0A] border border-[#E5E0D8] rounded-xl">
                    <img
                      src={settingsForm.logoUrl}
                      alt="Prévia da Logo"
                      className="h-8 w-auto max-w-[140px] object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">Nome do Corretor</label>
                <input
                  type="text"
                  value={settingsForm.realtorName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, realtorName: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">Número CRECI</label>
                <input
                  type="text"
                  value={settingsForm.creci}
                  onChange={(e) => setSettingsForm({ ...settingsForm, creci: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">Número CNAI</label>
                <input
                  type="text"
                  value={settingsForm.cnai || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, cnai: e.target.value })}
                  placeholder="CNAI: 34 653"
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">WhatsApp (apenas números com DDD)</label>
                <input
                  type="text"
                  value={settingsForm.whatsapp}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">Telefone Formatado</label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">E-mail Corporativo</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">Endereço do Escritório Oficial</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">Horários de Atendimento</label>
                <input
                  type="text"
                  value={settingsForm.businessHours}
                  onChange={(e) => setSettingsForm({ ...settingsForm, businessHours: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>
            </div>

            {/* Social Media Links in Admin */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                Redes Sociais Oficiais do Corretor
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#111111] mb-1.5 block">Instagram URL</label>
                  <input
                    type="url"
                    value={settingsForm.instagram || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                    placeholder="https://instagram.com/corretordanielpacheco"
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#111111] mb-1.5 block">Facebook URL</label>
                  <input
                    type="url"
                    value={settingsForm.facebook || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, facebook: e.target.value })}
                    placeholder="https://facebook.com/corretordanielpacheco"
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#111111] mb-1.5 block">YouTube URL</label>
                  <input
                    type="url"
                    value={settingsForm.youtube || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, youtube: e.target.value })}
                    placeholder="https://youtube.com/@danielpachecocorretor9626"
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#111111] mb-1.5 block">TikTok URL</label>
                  <input
                    type="url"
                    value={settingsForm.tiktok || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tiktok: e.target.value })}
                    placeholder="https://tiktok.com/@danielpachecocorretor"
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#111111] mb-1.5 block">Headline Principal (Hero)</label>
              <input
                type="text"
                value={settingsForm.heroHeadline}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#111111] mb-1.5 block">Subtítulo Hero</label>
              <textarea
                rows={2}
                value={settingsForm.heroSubtitle}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none resize-none"
              />
            </div>

            {/* Seção de Marca d'Água Oficial dos Imóveis */}
            <div className="p-5 bg-[#FFFFFF] border border-[#C9A227]/40 rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227]">
                  <Stamp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111111]">Marca d'Água Oficial dos Imóveis</h4>
                  <p className="text-xs text-[#5A5A5A]">
                    Configuração aplicada automaticamente ao adicionar fotos nos imóveis. Fundo transparente preservado.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#111111] block">
                      URL da Imagem da Marca d'Água (PNG com Fundo Transparente)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={watermarkInputRef}
                        accept="image/png,image/webp"
                        onChange={handleUploadWatermarkFile}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => watermarkInputRef.current?.click()}
                        disabled={isUploadingWatermark}
                        className="px-2.5 py-1 rounded-lg bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
                      >
                        {isUploadingWatermark ? (
                          <>
                            <RefreshCw className="w-3 h-3 text-[#C9A227] animate-spin" />
                            <span>Enviando...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3 h-3 text-[#C9A227]" />
                            <span>Enviar PNG (Vercel Blob)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={settingsForm.watermarkUrl || DEFAULT_WATERMARK_URL}
                      onChange={(e) => setSettingsForm({ ...settingsForm, watermarkUrl: e.target.value })}
                      placeholder="https://...vercel-storage.com/... ou link direto"
                      className="flex-1 bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, watermarkUrl: DEFAULT_WATERMARK_URL })}
                      className="px-3 py-2 bg-[#F7F3EB] hover:bg-[#EAE4D8] border border-[#E5E0D8] text-xs font-semibold text-[#5A5A5A] rounded-xl cursor-pointer"
                    >
                      Padrão
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-[#111111]">
                        Opacidade Padrão (Transparência)
                      </label>
                      <span className="text-xs font-mono font-bold text-[#C9A227]">
                        {Math.round((settingsForm.watermarkOpacity ?? DEFAULT_WATERMARK_OPACITY) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.15"
                      max="0.85"
                      step="0.01"
                      value={settingsForm.watermarkOpacity ?? DEFAULT_WATERMARK_OPACITY}
                      onChange={(e) => setSettingsForm({ ...settingsForm, watermarkOpacity: parseFloat(e.target.value) })}
                      className="w-full accent-[#C9A227] cursor-pointer"
                    />
                    <p className="text-[10px] text-[#5A5A5A]">Recomendado: 42% (translúcida e elegante)</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] mb-1 block">
                      Posicionamento Padrão
                    </label>
                    <select
                      value={settingsForm.watermarkPosition || DEFAULT_WATERMARK_POSITION}
                      onChange={(e) => setSettingsForm({ ...settingsForm, watermarkPosition: e.target.value as any })}
                      className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none"
                    >
                      <option value="bottom-right">Canto Inferior Direito (Recomendado)</option>
                      <option value="center">Centro (Destaque total)</option>
                      <option value="bottom-left">Canto Inferior Esquerdo</option>
                      <option value="bottom-center">Centro Inferior</option>
                      <option value="top-right">Canto Superior Direito</option>
                      <option value="top-left">Canto Superior Esquerdo</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Vercel Blob Permanent Cloud Storage Configuration */}
            <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E0D8] space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D8] pb-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    Armazenamento Permanente de Fotos (Vercel Blob CDN)
                  </span>
                  <h3 className="text-base font-bold text-[#111111]">
                    Hospedagem Definitiva de Imagens na Nuvem
                  </h3>
                  <p className="text-xs text-[#5A5A5A] max-w-2xl">
                    Todas as fotos cadastradas ou editadas são gravadas de forma permanente na CDN global da Vercel. 
                    Elas nunca expiram e nunca somem após horas ou reinicializações.
                  </p>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  {blobStatus?.configured ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F8A4C]/15 border border-[#1F8A4C]/30 text-xs font-semibold text-[#1F8A4C]">
                      <span className="w-2 h-2 rounded-full bg-[#1F8A4C] animate-pulse" />
                      <span>Vercel Blob Ativo & Permanente</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 text-xs font-semibold text-[#8C6D1F]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Configuração de Token Recomendada</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Token Input & Diagnostics */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#111111] mb-1.5 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>BLOB_READ_WRITE_TOKEN (Vercel Blob)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showBlobToken ? 'text' : 'password'}
                      value={settingsForm.vercelBlobToken || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, vercelBlobToken: e.target.value })}
                      placeholder="vercel_blob_rw_..."
                      className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 pr-10 outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowBlobToken(!showBlobToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A5A] hover:text-[#111111] cursor-pointer"
                      title={showBlobToken ? 'Ocultar token' : 'Mostrar token'}
                    >
                      {showBlobToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#5A5A5A] mt-1.5">
                    Obtenha seu token no painel da Vercel em <strong>Storage &gt; Blob &gt; Settings &gt; Read/Write Token</strong>. 
                    Ao salvar as configurações, o token é registrado com segurança no Firebase e no servidor.
                  </p>
                </div>

                {/* Test Connection Button & Result */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleTestBlobConnection}
                    disabled={isTestingBlob}
                    className="px-4 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F3EB] hover:bg-[#EAE4D8] text-xs font-bold text-[#111111] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isTestingBlob ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C9A227]" />
                        <span>Testando Conexão...</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>Testar Conexão com Vercel Blob</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleMigrateAllPhotosToBlob}
                    disabled={isMigratingPhotos}
                    className="px-4 py-2.5 rounded-xl bg-[#0A0A0A] hover:bg-[#222222] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-xs disabled:opacity-50"
                  >
                    {isMigratingPhotos ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C9A227]" />
                        <span>Migrando Fotos para CDN...</span>
                      </>
                    ) : (
                      <>
                        <HardDrive className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>Migrar Todas as Fotos para Vercel Blob CDN</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Test Connection Result Alert */}
                {blobTestResult && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2 animate-in fade-in-50 ${
                      blobTestResult.success
                        ? 'bg-[#1F8A4C]/15 border border-[#1F8A4C]/30 text-[#1F8A4C]'
                        : 'bg-red-500/10 border border-red-500/30 text-red-700'
                    }`}
                  >
                    {blobTestResult.success ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{blobTestResult.message || blobTestResult.error}</span>
                  </div>
                )}

                {/* Migration Progress Bar */}
                {isMigratingPhotos && migrationProgress && (
                  <div className="p-4 bg-[#F7F3EB] rounded-2xl border border-[#C9A227] space-y-2 animate-in fade-in-50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#111111] flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 text-[#C9A227] animate-spin" />
                        <span>{migrationProgress.status}</span>
                      </span>
                      <span className="font-mono text-[#C9A227] font-bold">
                        {Math.round((migrationProgress.current / migrationProgress.total) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-[#E5E0D8] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#C9A227] h-full transition-all duration-300 rounded-full"
                        style={{ width: `${(migrationProgress.current / migrationProgress.total) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-[#5A5A5A]">
                      Imóvel {migrationProgress.current} de {migrationProgress.total} (Cód: {migrationProgress.propCode})
                    </p>
                  </div>
                )}

                {/* Migration Finished Result */}
                {migrationResult && (
                  <div className="p-3.5 rounded-2xl bg-[#1F8A4C]/15 border border-[#1F8A4C]/30 text-xs text-[#1F8A4C] font-semibold flex items-center gap-2 animate-in fade-in-50">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>
                      Migração concluída com sucesso! {migrationResult.migratedImages} fotos foram transferidas permanentemente para a Vercel CDN em {migrationResult.totalProperties} imóveis.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSavingSettings}
              className="px-6 py-3.5 rounded-xl bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingSettings ? 'Salvando no Firebase...' : 'Salvar Alterações no Firebase'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Smart Landing Page Builder */}
      {adminTab === 'landing_pages' && (
        <AdminLandingPageBuilder 
          properties={properties} 
          settings={settings} 
        />
      )}

      {/* =========================================================================
          COMPLETE PROPERTY MODAL (EDIT ALL SPECS, AREAS, PHOTOS, FEATURES)
         ========================================================================= */}
      {isModalOpen && editingProperty && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative bg-[#FFFFFF] border border-[#E5E0D8] w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl my-6 text-[#111111] animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#F7F3EB] border border-[#E5E0D8] text-[#5A5A5A] hover:text-[#111111] cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 mb-6 border-b border-[#E5E0D8] pb-4">
              <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {editingProperty.id ? `Editar Imóvel (Cód. ${editingProperty.code})` : 'Novo Cadastro de Imóvel'}
              </span>
              <h3 className="text-2xl font-bold font-serif-luxury text-[#111111]">
                {editingProperty.title || 'Cadastrar Novo Imóvel no Firebase'}
              </h3>
            </div>

            {saveSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-[#1F8A4C]/15 border border-[#1F8A4C]/30 text-xs text-[#1F8A4C] flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-[#1F8A4C]" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {formValidationError && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-700 font-semibold flex items-center gap-2 mb-4 animate-in fade-in-50">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formValidationError}</span>
              </div>
            )}

            {/* Modal Internal Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-[#E5E0D8]">
              <button
                type="button"
                onClick={() => setModalTab('general')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  modalTab === 'general'
                    ? 'bg-[#0A0A0A] text-white shadow-sm'
                    : 'bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#111111]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>1. Dados Gerais</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('areas')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  modalTab === 'areas'
                    ? 'bg-[#0A0A0A] text-white shadow-sm'
                    : 'bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#111111]'
                }`}
              >
                <Maximize className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>2. Áreas & Cômodos</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('photos')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  modalTab === 'photos'
                    ? 'bg-[#0A0A0A] text-white shadow-sm'
                    : 'bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#111111]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>3. Fotos & Galeria ({editingProperty.images?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('features')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  modalTab === 'features'
                    ? 'bg-[#0A0A0A] text-white shadow-sm'
                    : 'bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#111111]'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>4. Diferenciais & Itens ({editingProperty.features?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('desc')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  modalTab === 'desc'
                    ? 'bg-[#0A0A0A] text-white shadow-sm'
                    : 'bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#111111]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>5. Descrições</span>
              </button>
            </div>

            <form noValidate onSubmit={handleSavePropertySubmit} className="space-y-6 max-h-[62vh] overflow-y-auto pr-2">
              {/* TAB 1: DADOS GERAIS */}
              {modalTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#111111] mb-1 block">Código de Referência *</label>
                      <input
                        type="text"
                        required
                        value={editingProperty.code || ''}
                        onChange={(e) => setEditingProperty({ ...editingProperty, code: e.target.value })}
                        className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none font-mono"
                        placeholder="Ex: 213567"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-[#111111] mb-1 block">Título do Empreendimento / Imóvel *</label>
                      <input
                        type="text"
                        required
                        value={editingProperty.title || ''}
                        onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                        className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none"
                        placeholder="Ex: D/Garden Residence"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] mb-1 block">Headline de Destaque</label>
                    <input
                      type="text"
                      value={editingProperty.headline || ''}
                      onChange={(e) => setEditingProperty({ ...editingProperty, headline: e.target.value })}
                      placeholder="Ex: Oásis contemporâneo com pé-direito duplo e vista para a praça"
                      className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#111111] mb-1 block">Tipo de Imóvel *</label>
                      <select
                        value={editingProperty.type || 'Apartamento'}
                        onChange={(e) => setEditingProperty({ ...editingProperty, type: e.target.value as PropertyType })}
                        className="w-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl p-3 outline-none"
                      >
                        <option value="Apartamento">Apartamento</option>
                        <option value="Casa">Casa</option>
                        <option value="Lote/Terreno">Lote / Terreno</option>
                        <option value="Cobertura">Cobertura</option>
                        <option value="Sala Comercial">Sala Comercial</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#111111] mb-1 block">Status da Obra *</label>
                      <select
                        value={editingProperty.status || 'Pronto'}
                        onChange={(e) => setEditingProperty({ ...editingProperty, status: e.target.value as PropertyStatus })}
                        className="w-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl p-3 outline-none"
                      >
                        <option value="Na planta">Na planta</option>
                        <option value="Em obras">Em obras</option>
                        <option value="Pronto">Pronto para morar</option>
                        <option value="Loteamento">Loteamento</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#111111] mb-1 block">Construtora / Desenvolvedor</label>
                      <input
                        type="text"
                        placeholder="Ex: Fontana, Construfase, etc."
                        value={editingProperty.developer || ''}
                        onChange={(e) => setEditingProperty({ ...editingProperty, developer: e.target.value })}
                        className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#111111] mb-1 block">Cidade *</label>
                      <input
                        type="text"
                        placeholder="Digite a cidade..."
                        value={editingProperty.city || ''}
                        onChange={(e) => setEditingProperty({ ...editingProperty, city: e.target.value })}
                        className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#111111] mb-1 block">Bairro *</label>
                      <input
                        type="text"
                        required
                        value={editingProperty.neighborhood || ''}
                        onChange={(e) => setEditingProperty({ ...editingProperty, neighborhood: e.target.value })}
                        placeholder="Ex: Centro, Pio Corrêa, Michel..."
                        className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#111111] mb-1 block">Estado</label>
                      <input
                        type="text"
                        value={editingProperty.state || 'SC'}
                        onChange={(e) => setEditingProperty({ ...editingProperty, state: e.target.value })}
                        className="w-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl p-3 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs font-semibold text-[#111111] mb-1 block">Valor Numérico (R$)</label>
                      <input
                        type="number"
                        placeholder="Ex: 580000"
                        value={editingProperty.price ?? ''}
                        onChange={(e) => {
                          const val = e.target.value ? Number(e.target.value) : undefined;
                          setEditingProperty({ 
                            ...editingProperty, 
                            price: val,
                            priceFormatted: val ? formatCurrency(val) : 'A Consultar'
                          });
                        }}
                        className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#111111] mb-1 block">Valor Exibido (Texto Comercial)</label>
                      <input
                        type="text"
                        placeholder="Ex: R$ 580.000,00 ou A Consultar"
                        value={editingProperty.priceFormatted || ''}
                        onChange={(e) => setEditingProperty({ ...editingProperty, priceFormatted: e.target.value })}
                        className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none"
                      />
                    </div>
                  </div>

                  {/* Condições de Financiamento & Destaques */}
                  <div className="p-4 bg-[#F7F3EB] rounded-2xl border border-[#E5E0D8] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                        <Landmark className="w-4 h-4 text-[#0284C7]" />
                        <span>Condições de Financiamento & Destaques</span>
                      </span>
                      <span className="text-[10px] text-[#5A5A5A]">Atalhos rápidos:</span>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingProperty({
                          ...editingProperty,
                          bankFinancing: true,
                          directFinancing: false
                        })}
                        className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#0284C7]/15 border border-[#0284C7]/40 text-[#0284C7] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      >
                        <Landmark className="w-3 h-3" />
                        <span>Apenas Fin. Bancário</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingProperty({
                          ...editingProperty,
                          bankFinancing: false,
                          directFinancing: true
                        })}
                        className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#1F8A4C]/15 border border-[#1F8A4C]/40 text-[#1F8A4C] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>Apenas Construtora</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingProperty({
                          ...editingProperty,
                          bankFinancing: true,
                          directFinancing: true
                        })}
                        className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#C9A227]/20 border border-[#C9A227]/50 text-[#C9A227] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Aceita Ambos</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingProperty({
                          ...editingProperty,
                          bankFinancing: false,
                          directFinancing: false
                        })}
                        className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#EAE4D8] border border-[#E5E0D8] text-[#5A5A5A] text-xs font-medium transition-all cursor-pointer"
                      >
                        <span>À Vista / Outros</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E5E0D8]">
                      {/* Bank Financing Checkbox */}
                      <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        editingProperty.bankFinancing 
                          ? 'bg-[#0284C7]/10 border-[#0284C7]/40 text-[#0284C7]' 
                          : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#111111]'
                      }`}>
                        <input
                          type="checkbox"
                          checked={!!editingProperty.bankFinancing}
                          onChange={(e) => setEditingProperty({ ...editingProperty, bankFinancing: e.target.checked })}
                          className="w-4 h-4 mt-0.5 accent-[#0284C7] cursor-pointer shrink-0"
                        />
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold block">Financiamento Bancário</span>
                          <span className="text-[10px] text-[#5A5A5A] leading-tight block">
                            Imóvel averbado/apto para Caixa, Itaú, etc.
                          </span>
                        </div>
                      </label>

                      {/* Direct Builder Financing Checkbox */}
                      <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        editingProperty.directFinancing 
                          ? 'bg-[#1F8A4C]/10 border-[#1F8A4C]/40 text-[#1F8A4C]' 
                          : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#111111]'
                      }`}>
                        <input
                          type="checkbox"
                          checked={!!editingProperty.directFinancing}
                          onChange={(e) => setEditingProperty({ ...editingProperty, directFinancing: e.target.checked })}
                          className="w-4 h-4 mt-0.5 accent-[#1F8A4C] cursor-pointer shrink-0"
                        />
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold block">Direto c/ Construtora</span>
                          <span className="text-[10px] text-[#5A5A5A] leading-tight block">
                            Parcelamento facilitado direto na obra.
                          </span>
                        </div>
                      </label>

                      {/* Featured Checkbox */}
                      <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        editingProperty.featured 
                          ? 'bg-[#C9A227]/15 border-[#C9A227]/50 text-[#C9A227]' 
                          : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#111111]'
                      }`}>
                        <input
                          type="checkbox"
                          checked={!!editingProperty.featured}
                          onChange={(e) => setEditingProperty({ ...editingProperty, featured: e.target.checked })}
                          className="w-4 h-4 mt-0.5 accent-[#C9A227] cursor-pointer shrink-0"
                        />
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold block">Seleção Exclusiva (Home)</span>
                          <span className="text-[10px] text-[#5A5A5A] leading-tight block">
                            Destaca o imóvel no topo do site.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ÁREAS, METRAGENS E CÔMODOS */}
              {modalTab === 'areas' && (
                <div className="space-y-5">
                  <div className="p-4 bg-[#F7F3EB] rounded-2xl border border-[#E5E0D8] text-xs text-[#5A5A5A]">
                    Edite com precisão todas as metragens e quantidades de cômodos do imóvel. Para terrenos, deixe dormitórios e sanitários zerados ou vazios.
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#111111] mb-1.5 flex items-center gap-1.5">
                        <Maximize className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>Área Privativa / Total (m²)</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Ex: 120"
                        value={editingProperty.areaM2 ?? ''}
                        onChange={(e) => setEditingProperty({ ...editingProperty, areaM2: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#111111] mb-1.5 flex items-center gap-1.5">
                        <Bed className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>Dormitórios / Quartos</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Ex: 3"
                        value={editingProperty.bedrooms ?? ''}
                        onChange={(e) => setEditingProperty({ ...editingProperty, bedrooms: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#111111] mb-1.5 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>Suítes Exclusivas</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Ex: 1"
                        value={editingProperty.suites ?? ''}
                        onChange={(e) => setEditingProperty({ ...editingProperty, suites: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#111111] mb-1.5 flex items-center gap-1.5">
                        <Bath className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>Banheiros / Sanitários</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Ex: 2"
                        value={editingProperty.bathrooms ?? ''}
                        onChange={(e) => setEditingProperty({ ...editingProperty, bathrooms: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#111111] mb-1.5 flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>Vagas de Garagem</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Ex: 2"
                        value={editingProperty.garageSpaces ?? ''}
                        onChange={(e) => setEditingProperty({ ...editingProperty, garageSpaces: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#111111] mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>Previsão de Entrega / Ano</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Dezembro / 2026"
                        value={editingProperty.deliveryYear || ''}
                        onChange={(e) => setEditingProperty({ ...editingProperty, deliveryYear: e.target.value })}
                        className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-[#111111] block">URL da Imagem da Planta Humanizada</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={floorPlanInputRef}
                          accept="image/*"
                          onChange={handleUploadFloorPlanFile}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => floorPlanInputRef.current?.click()}
                          disabled={isUploadingFloorPlan}
                          className="px-2.5 py-1 rounded-lg bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
                        >
                          {isUploadingFloorPlan ? (
                            <>
                              <RefreshCw className="w-3 h-3 text-[#C9A227] animate-spin" />
                              <span>Enviando...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3 h-3 text-[#C9A227]" />
                              <span>Enviar Planta (Vercel Blob)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <input
                        type="url"
                        placeholder="https://...vercel-storage.com/... ou link direto da planta baixa"
                        value={editingProperty.floorPlanUrl || ''}
                        onChange={(e) => setEditingProperty({ ...editingProperty, floorPlanUrl: e.target.value })}
                        className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none"
                      />
                      {editingProperty.floorPlanUrl && (
                        <div className="shrink-0 p-1.5 bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl">
                          <img
                            src={editingProperty.floorPlanUrl}
                            alt="Prévia da Planta"
                            className="h-10 w-auto max-w-[120px] object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FOTOS E GALERIA */}
              {modalTab === 'photos' && (
                <div className="space-y-6">
                  {/* Header and Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                        <ImagePlus className="w-4 h-4 text-[#C9A227]" />
                        <span>Galeria de Fotos ({editingProperty.images?.length || 0})</span>
                      </h4>
                      <p className="text-xs text-[#5A5A5A]">
                        Fotos salvas com alta resolução e carregamento instantâneo. A primeira imagem é a <strong>Capa Principal</strong>.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <input
                        type="file"
                        ref={cameraInputRef}
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      {/* Upload from Device / Gallery */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingImages}
                        className="px-3.5 py-2 rounded-xl bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>Carregar do Dispositivo</span>
                      </button>

                      {/* Mobile Camera Direct Capture */}
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        disabled={isUploadingImages}
                        className="sm:hidden px-3 py-2 rounded-xl bg-[#F7F3EB] hover:bg-[#EAE4D8] border border-[#E5E0D8] text-xs font-semibold text-[#111111] flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>Câmera</span>
                      </button>

                      {/* Bulk URLs */}
                      <button
                        type="button"
                        onClick={() => setShowBulkPhotoInput(!showBulkPhotoInput)}
                        className="px-3 py-2 rounded-xl bg-[#F7F3EB] hover:bg-[#EAE4D8] border border-[#E5E0D8] text-xs font-semibold text-[#111111] flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <span>Colar URLs em Lote</span>
                      </button>
                    </div>
                  </div>

                  {/* PAINEL DE MARCA D'ÁGUA OFICIAL DANIEL PACHECO */}
                  <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#C9A227]/40 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227] shrink-0">
                          <Stamp className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-[#111111]">Marca d'Água Oficial dos Imóveis</h5>
                            <span className="px-2 py-0.5 rounded-full bg-[#1F8A4C]/15 text-[#1F8A4C] text-[10px] font-bold">
                              Fundo Transparente
                            </span>
                          </div>
                          <p className="text-[11px] text-[#5A5A5A]">
                            Selo translúcido (PNG original transparente) para proteger as fotos do imóvel com máxima elegância.
                          </p>
                        </div>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setWatermarkTargetIdx(0);
                            setIsWatermarkModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-[#E5E0D8] bg-[#F7F3EB] hover:bg-[#EAE4D8] text-xs font-semibold text-[#111111] flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Sliders className="w-3.5 h-3.5 text-[#C9A227]" />
                          <span>Ajustar & Visualizar</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleQuickApplyWatermarkAll}
                          disabled={isApplyingWatermarkBatch || !editingProperty.images || editingProperty.images.length === 0}
                          className="px-3.5 py-1.5 rounded-xl bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs disabled:opacity-50"
                        >
                          {isApplyingWatermarkBatch ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Processando...</span>
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-3.5 h-3.5" />
                              <span>Aplicar em Todas ({editingProperty.images?.length || 0})</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Auto-Watermark Toggle & Quick Status */}
                    <div className="pt-2 border-t border-[#E5E0D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={autoWatermarkOnUpload}
                          onChange={(e) => setAutoWatermarkOnUpload(e.target.checked)}
                          className="w-4 h-4 accent-[#C9A227] rounded cursor-pointer"
                        />
                        <span className="text-[11px] text-[#111111] font-medium">
                          Aplicar marca d'água automaticamente ao enviar fotos novas (câmera ou galeria)
                        </span>
                      </label>

                      <div className="text-[11px] text-[#5A5A5A]">
                        Opacidade: <strong className="text-[#C9A227]">42%</strong> • Posicionamento: <strong className="text-[#111111]">Canto Inferior Direito</strong>
                      </div>
                    </div>

                    {/* Watermark Status Alert */}
                    {watermarkStatsMsg && (
                      <div className="p-2.5 rounded-xl bg-[#C9A227]/15 border border-[#C9A227]/30 text-xs text-[#111111] font-semibold flex items-center gap-2 animate-in fade-in-50">
                        <Sparkles className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                        <span>{watermarkStatsMsg}</span>
                      </div>
                    )}
                  </div>

                  {/* Drag & Drop Upload Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingPhotos(true);
                    }}
                    onDragLeave={() => setIsDraggingPhotos(false)}
                    onDrop={handleDropPhotos}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-2 ${
                      isDraggingPhotos
                        ? 'border-[#C9A227] bg-[#C9A227]/10 scale-[1.01]'
                        : 'border-[#E5E0D8] hover:border-[#C9A227]/70 bg-[#F7F3EB]/60 hover:bg-[#F7F3EB]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#E5E0D8] flex items-center justify-center mx-auto text-[#C9A227] shadow-xs">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-[#111111]">
                        Arraste fotos para cá ou clique para selecionar do celular / computador
                      </p>
                      <p className="text-[11px] text-[#5A5A5A]">
                        Suporta JPEG, PNG, WEBP, HEIC. As imagens são automaticamente compactadas e hospedadas na nuvem para máxima velocidade na Vercel.
                      </p>
                    </div>
                  </div>

                  {/* Uploading Progress Indicator */}
                  {isUploadingImages && uploadProgress && (
                    <div className="p-4 bg-[#FFFFFF] rounded-2xl border border-[#C9A227] shadow-md space-y-2 animate-in fade-in-50">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#111111] flex items-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 text-[#C9A227] animate-spin" />
                          <span>Otimizando e enviando foto {uploadProgress.current} de {uploadProgress.total}...</span>
                        </span>
                        <span className="font-mono text-[#C9A227] font-bold">{uploadProgress.percent}%</span>
                      </div>
                      <div className="w-full bg-[#E5E0D8] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#C9A227] h-full transition-all duration-300 rounded-full"
                          style={{ width: `${uploadProgress.percent}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#5A5A5A] truncate">
                        Processando arquivo: {uploadProgress.fileName}
                      </p>
                    </div>
                  )}

                  {/* Success / Status Notification */}
                  {uploadStatsMsg && (
                    <div className="p-3.5 rounded-2xl bg-[#1F8A4C]/15 border border-[#1F8A4C]/30 text-xs text-[#1F8A4C] font-semibold flex items-center gap-2 animate-in fade-in-50">
                      <CheckCircle className="w-4 h-4 text-[#1F8A4C] shrink-0" />
                      <span>{uploadStatsMsg}</span>
                    </div>
                  )}

                  {/* Add Single URL Input */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Ou cole o link direto da imagem (ex: https://i.postimg.cc/...)"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddPhotoUrl();
                        }
                      }}
                      className="flex-1 bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-2.5 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhotoUrl}
                      className="px-4 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Link</span>
                    </button>
                  </div>

                  {/* Bulk Photos Paste Textarea */}
                  {showBulkPhotoInput && (
                    <div className="p-4 bg-[#F7F3EB] rounded-2xl border border-[#E5E0D8] space-y-2 animate-in fade-in-50">
                      <label className="text-xs font-semibold text-[#111111] block">
                        Cole múltiplas URLs de fotos (uma por linha ou separadas por vírgula):
                      </label>
                      <textarea
                        rows={3}
                        value={bulkPhotosInput}
                        onChange={(e) => setBulkPhotosInput(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
                        className="w-full bg-[#FFFFFF] border border-[#E5E0D8] text-xs text-[#111111] rounded-xl p-3 outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowBulkPhotoInput(false)}
                          className="px-3 py-1.5 rounded-lg text-xs text-[#5A5A5A] hover:text-[#111111] cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={handleAddBulkPhotos}
                          className="px-4 py-1.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-semibold cursor-pointer"
                        >
                          Inserir Fotos
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Photos Grid & Reordering */}
                  {editingProperty.images && editingProperty.images.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#5A5A5A]">
                        <span>Passe o mouse ou use os botões abaixo para ordenar ou definir capa:</span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[#111111]">{editingProperty.images.length} {editingProperty.images.length === 1 ? 'foto' : 'fotos'}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Deseja remover todas as fotos deste imóvel?')) {
                                setEditingProperty({ ...editingProperty, images: [] });
                              }
                            }}
                            className="text-red-600 hover:text-red-700 text-[11px] font-semibold cursor-pointer"
                          >
                            Limpar Todas
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                        {editingProperty.images.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className={`group relative rounded-2xl overflow-hidden border bg-[#FFFFFF] flex flex-col justify-between shadow-xs transition-all ${
                              idx === 0 ? 'border-[#C9A227] ring-2 ring-[#C9A227]/30' : 'border-[#E5E0D8]'
                            }`}
                          >
                            <div className="relative aspect-video bg-[#F7F3EB] overflow-hidden">
                              <img
                                src={imgUrl}
                                alt={`Foto ${idx + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                              
                              {/* Badge if Cover */}
                              {idx === 0 && (
                                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#C9A227] text-[#0A0A0A] font-bold text-[9px] uppercase tracking-wider shadow z-10">
                                  Capa Principal
                                </div>
                              )}

                              {/* Badge if Vercel Blob */}
                              {isVercelBlobUrl(imgUrl) && (
                                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 text-[#1F8A4C] border border-[#1F8A4C]/40 font-bold text-[8px] tracking-wider shadow z-10 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#1F8A4C] animate-pulse" />
                                  <span className="text-white text-[8px]">Blob CDN</span>
                                </div>
                              )}

                              {/* Desktop Hover Overlay */}
                              <div className="hidden sm:flex absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-1.5 p-2 z-20">
                                {idx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMovePhoto(idx, idx - 1)}
                                    className="p-1.5 rounded-lg bg-white/90 text-[#111111] hover:bg-[#C9A227] cursor-pointer transition-colors"
                                    title="Mover para esquerda"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5 -rotate-90" />
                                  </button>
                                )}

                                {idx < editingProperty.images!.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMovePhoto(idx, idx + 1)}
                                    className="p-1.5 rounded-lg bg-white/90 text-[#111111] hover:bg-[#C9A227] cursor-pointer transition-colors"
                                    title="Mover para direita"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5 -rotate-90" />
                                  </button>
                                )}

                                {idx !== 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetCoverPhoto(idx)}
                                    className="p-1.5 rounded-lg bg-white/90 text-[#111111] hover:bg-[#C9A227] cursor-pointer transition-colors"
                                    title="Definir como Capa Principal"
                                  >
                                    <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    setWatermarkTargetIdx(idx);
                                    setIsWatermarkModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-[#C9A227] text-[#0A0A0A] hover:bg-[#B8931F] cursor-pointer transition-colors"
                                  title="Aplicar / Ajustar Marca d'Água nesta foto"
                                >
                                  <Stamp className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleRemovePhoto(idx)}
                                  className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer transition-colors"
                                  title="Remover Foto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Mobile and Quick Actions Bar */}
                            <div className="p-2 bg-[#FAF7F0] border-t border-[#E5E0D8] flex items-center justify-between text-[11px]">
                              {idx === 0 ? (
                                <span className="text-[#C9A227] font-bold text-[10px] flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" /> Capa
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetCoverPhoto(idx)}
                                  className="text-[#5A5A5A] hover:text-[#C9A227] font-semibold text-[10px] cursor-pointer transition-colors"
                                >
                                  Fazer Capa
                                </button>
                              )}

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setWatermarkTargetIdx(idx);
                                    setIsWatermarkModalOpen(true);
                                  }}
                                  className="p-1 text-[#C9A227] hover:text-[#B8931F] cursor-pointer"
                                  title="Marca d'água"
                                >
                                  <Stamp className="w-3.5 h-3.5" />
                                </button>
                                {idx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMovePhoto(idx, idx - 1)}
                                    className="p-1 text-[#5A5A5A] hover:text-[#111111] cursor-pointer"
                                    title="Mover para esquerda"
                                  >
                                    <ArrowUp className="w-3 h-3 -rotate-90" />
                                  </button>
                                )}
                                {idx < editingProperty.images!.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMovePhoto(idx, idx + 1)}
                                    className="p-1 text-[#5A5A5A] hover:text-[#111111] cursor-pointer"
                                    title="Mover para direita"
                                  >
                                    <ArrowDown className="w-3 h-3 -rotate-90" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemovePhoto(idx)}
                                  className="p-1 text-red-600 hover:text-red-700 cursor-pointer"
                                  title="Remover foto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-[#F7F3EB] rounded-2xl border border-dashed border-[#E5E0D8] space-y-2">
                      <ImageIcon className="w-8 h-8 text-[#5A5A5A] mx-auto" />
                      <p className="text-xs text-[#5A5A5A]">
                        Nenhuma foto adicionada ainda. Use o botão <strong>Carregar do Dispositivo</strong> ou arraste fotos diretamente.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: DIFERENCIAIS E ITENS */}
              {modalTab === 'features' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#111111]">
                      Diferenciais & Características ({editingProperty.features?.length || 0})
                    </h4>
                    <p className="text-xs text-[#5A5A5A]">
                      Adicione itens de lazer, acabamentos nobres e diferenciais construtivos.
                    </p>
                  </div>

                  {/* Add Custom Feature Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Digite um diferencial (ex: Fechadura eletrônica, Sacada gourmet...)"
                      value={newFeatureInput}
                      onChange={(e) => setNewFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      className="flex-1 bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-2.5 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddFeature()}
                      className="px-4 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar</span>
                    </button>
                  </div>

                  {/* Current Selected Features */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#111111] block">
                      Itens Ativos no Imóvel:
                    </label>
                    {editingProperty.features && editingProperty.features.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {editingProperty.features.map((feat, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#111111] font-medium"
                          >
                            <Check className="w-3.5 h-3.5 text-[#C9A227]" />
                            <span>{feat}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(feat)}
                              className="ml-1 text-[#5A5A5A] hover:text-red-600 cursor-pointer"
                              title="Remover"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#5A5A5A] italic">Nenhum diferencial adicionado.</p>
                    )}
                  </div>

                  {/* Quick Suggestions Chips */}
                  <div className="space-y-2 pt-2 border-t border-[#E5E0D8]">
                    <label className="text-xs font-semibold text-[#5A5A5A] block">
                      Sugestões Rápidas (Clique para adicionar):
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_FEATURE_SUGGESTIONS.map((sug, idx) => {
                        const isAlreadyAdded = editingProperty.features?.includes(sug);
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={isAlreadyAdded}
                            onClick={() => handleAddFeature(sug)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                              isAlreadyAdded
                                ? 'bg-[#1F8A4C]/15 text-[#1F8A4C] border border-[#1F8A4C]/30 opacity-60'
                                : 'bg-[#FFFFFF] hover:bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#111111] border border-[#E5E0D8]'
                            }`}
                          >
                            {isAlreadyAdded ? `✓ ${sug}` : `+ ${sug}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: DESCRIÇÕES */}
              {modalTab === 'desc' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-[#111111] mb-1 block">Resumo Curto (Cards e Listagens)</label>
                    <textarea
                      rows={2}
                      value={editingProperty.shortDescription || ''}
                      onChange={(e) => setEditingProperty({ ...editingProperty, shortDescription: e.target.value })}
                      placeholder="Breve resumo comercial com os principais destaques..."
                      className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] mb-1 block">Descrição Completa e Detalhada</label>
                    <textarea
                      rows={6}
                      value={editingProperty.description || ''}
                      onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                      placeholder="Texto descritivo completo sobre localização, padrão construtivo, ambientes internos e condições de aquisição..."
                      className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-6 border-t border-[#E5E0D8] flex items-center justify-between gap-3">
                <div className="text-xs text-[#5A5A5A]">
                  Salva no Firebase com transmissão em tempo real para todo o site.
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 bg-[#F7F3EB] border border-[#E5E0D8] hover:bg-[#EAE4D8] text-[#5A5A5A] rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProperty}
                    className="px-6 py-2.5 bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold rounded-xl text-xs cursor-pointer shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingProperty ? 'Salvando no Firebase...' : 'Salvar Imóvel no Firebase'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CUSTOMIZAÇÃO E PRÉ-VISUALIZAÇÃO DA MARCA D'ÁGUA */}
      {isWatermarkModalOpen && editingProperty && (
        <WatermarkModal
          isOpen={isWatermarkModalOpen}
          onClose={() => setIsWatermarkModalOpen(false)}
          images={editingProperty.images || []}
          selectedPhotoIndex={watermarkTargetIdx}
          initialWatermarkUrl={settings.watermarkUrl || DEFAULT_WATERMARK_URL}
          initialOpacity={settings.watermarkOpacity ?? DEFAULT_WATERMARK_OPACITY}
          initialPosition={(settings.watermarkPosition as WatermarkPosition) || DEFAULT_WATERMARK_POSITION}
          initialScale={settings.watermarkScale || DEFAULT_WATERMARK_SCALE}
          onApplyToAll={(watermarkedImages) => {
            setEditingProperty({
              ...editingProperty,
              images: watermarkedImages,
            });
            setWatermarkStatsMsg(`✓ Marca d'água aplicada com sucesso em todas as ${watermarkedImages.length} fotos!`);
            setTimeout(() => setWatermarkStatsMsg(null), 5000);
          }}
          onApplyToSingle={(index, watermarkedUrl) => {
            if (!editingProperty.images) return;
            const updated = [...editingProperty.images];
            updated[index] = watermarkedUrl;
            setEditingProperty({
              ...editingProperty,
              images: updated,
            });
            setWatermarkStatsMsg(`✓ Marca d'água aplicada na foto ${index + 1} com sucesso!`);
            setTimeout(() => setWatermarkStatsMsg(null), 4000);
          }}
        />
      )}
    </div>
  );
};
