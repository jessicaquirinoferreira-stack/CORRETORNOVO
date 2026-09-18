import { applyWatermarkToImage, WatermarkOptions } from './watermark';
import { uploadImageToVercelBlob, deleteImageFromVercelBlob, isVercelBlobUrl } from './blobClient';

/**
 * Utilitário de Processamento, Otimização e Upload de Imagens com Vercel Blob
 * Suporta fotos tiradas diretamente de smartphones (iPhone iOS / Android)
 * ou computadores, otimiza com máxima fidelidade e envia para armazenamento
 * permanente no Vercel Blob CDN (https://...vercel-storage.com).
 */

export interface OptimizedImageResult {
  url: string;
  originalSize: number;
  optimizedSize: number;
  savingsPercentage: number;
  width: number;
  height: number;
  isVercelBlob?: boolean;
}

export interface UploadProgressInfo {
  current: number;
  total: number;
  fileName: string;
  percent: number;
  stage?: 'optimizing' | 'watermarking' | 'uploading_blob' | 'done';
}

/**
 * Formata bytes para exibição amigável (ex: 35 KB, 1.2 MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Verifica se um arquivo é uma imagem válida (por MIME type ou extensão)
 */
export function isImageFile(file: File): boolean {
  if (file.type && file.type.startsWith('image/')) return true;
  const name = (file.name || '').toLowerCase();
  return /\.(jpe?g|png|webp|gif|avif|heic|heif|bmp|tiff)$/i.test(name);
}

/**
 * Otimiza e redimensiona um arquivo de imagem local usando Canvas no navegador.
 * Reduz fotos pesadas de celulares (5MB-25MB) para 20KB-40KB de alta nitidez.
 */
export async function optimizeImageFile(
  file: File | Blob,
  maxWidth = 1200,
  maxHeight = 900,
  quality = 0.62
): Promise<{ dataUrl: string; blob: Blob; width: number; height: number; originalSize: number; optimizedSize: number }> {
  const originalSize = file.size || 0;

  return new Promise((resolve, reject) => {
    // Usar URL.createObjectURL para performance instantânea e economia drástica de memória RAM
    let objectUrl: string | null = null;
    try {
      objectUrl = URL.createObjectURL(file);
    } catch {
      // Fallback se createObjectURL não estiver disponível
    }

    const img = new Image();

    const cleanup = () => {
      if (objectUrl) {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch {
          // ignore
        }
      }
    };

    img.onerror = () => {
      cleanup();
      // Se falhou com objectUrl, tentar FileReader como fallback secundário
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Formato de foto não suportado ou arquivo corrompido'));
      reader.onload = (e) => {
        const fallbackImg = new Image();
        fallbackImg.onerror = () => reject(new Error('Formato de foto não suportado ou arquivo corrompido'));
        fallbackImg.onload = () => processImageElement(fallbackImg, resolve, reject, originalSize, maxWidth, maxHeight, quality);
        fallbackImg.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    };

    img.onload = () => {
      cleanup();
      processImageElement(img, resolve, reject, originalSize, maxWidth, maxHeight, quality);
    };

    if (objectUrl) {
      img.src = objectUrl;
    } else {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Falha ao ler o arquivo de imagem'));
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  });
}

function processImageElement(
  img: HTMLImageElement,
  resolve: (value: { dataUrl: string; blob: Blob; width: number; height: number; originalSize: number; optimizedSize: number }) => void,
  reject: (reason?: any) => void,
  originalSize: number,
  maxWidth: number,
  maxHeight: number,
  quality: number
) {
  try {
    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;

    if (!width || !height) {
      reject(new Error('Dimensões da imagem inválidas'));
      return;
    }

    // Manter proporção original respeitando os limites máximos
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.max(1, Math.round(width * ratio));
      height = Math.max(1, Math.round(height * ratio));
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Não foi possível inicializar renderizador 2D'));
      return;
    }

    // Suavização bilinear de alta qualidade
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    // Priorizar WebP para máxima compressão e nitidez
    let mimeType = 'image/webp';
    let dataUrl = canvas.toDataURL(mimeType, quality);

    // Fallback para JPEG caso o navegador não suporte codificação WebP
    if (!dataUrl.startsWith('data:image/webp')) {
      mimeType = 'image/jpeg';
      dataUrl = canvas.toDataURL(mimeType, quality);
    }

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve({
            dataUrl,
            blob,
            width,
            height,
            originalSize,
            optimizedSize: blob.size,
          });
        } else {
          // Conversão manual caso toBlob falhe
          try {
            const byteString = atob(dataUrl.split(',')[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            const fallbackBlob = new Blob([ab], { type: mimeType });
            resolve({
              dataUrl,
              blob: fallbackBlob,
              width,
              height,
              originalSize,
              optimizedSize: fallbackBlob.size,
            });
          } catch {
            const emptyBlob = new Blob([], { type: mimeType });
            resolve({
              dataUrl,
              blob: emptyBlob,
              width,
              height,
              originalSize,
              optimizedSize: Math.round(dataUrl.length * 0.75),
            });
          }
        }
      },
      mimeType,
      quality
    );
  } catch (err) {
    reject(err);
  }
}

/**
 * Prepara uma foto individual para armazenamento permanente no Vercel Blob.
 */
export async function uploadToPermanentHost(blobOrFile: Blob | File, folder: 'imoveis' | 'plantas' | 'branding' | 'geral' = 'imoveis'): Promise<string> {
  if (blobOrFile instanceof File || blobOrFile instanceof Blob) {
    const opt = await optimizeImageFile(blobOrFile, 1200, 900, 0.62);
    const fileName = blobOrFile instanceof File ? blobOrFile.name : `arquivo-${Date.now()}.webp`;
    
    // Tentar upload para Vercel Blob
    const blobRes = await uploadImageToVercelBlob({
      dataUrl: opt.dataUrl,
      fileName,
      folder,
    });

    return blobRes.url;
  }
  return '';
}

/**
 * Upload de imagem individual com opções de pasta e retorno detalhado
 */
export async function uploadSingleImageToBlob(
  fileOrBlob: File | Blob,
  folder: 'imoveis' | 'plantas' | 'branding' | 'geral' = 'imoveis',
  applyWatermark?: WatermarkOptions | null
): Promise<{ url: string; isBlob: boolean; error?: string }> {
  try {
    const opt = await optimizeImageFile(fileOrBlob, 1200, 900, 0.62);
    let finalDataUrl = opt.dataUrl;

    if (applyWatermark) {
      try {
        finalDataUrl = await applyWatermarkToImage(opt.dataUrl, applyWatermark);
      } catch (wErr) {
        console.warn("Aviso ao aplicar marca d'água na imagem única:", wErr);
      }
    }

    const fileName = fileOrBlob instanceof File ? fileOrBlob.name : `imagem-${Date.now()}.webp`;
    const res = await uploadImageToVercelBlob({
      dataUrl: finalDataUrl,
      fileName,
      folder,
    });

    return res;
  } catch (err: any) {
    return {
      url: '',
      isBlob: false,
      error: err?.message || 'Falha no upload da imagem',
    };
  }
}

/**
 * Processa múltiplos arquivos enviados do celular ou computador em lote:
 * 1. Otimiza cada imagem localmente (WebP 1200x900 nítido e leve).
 * 2. Aplica a marca d'água oficial da imobiliária se habilitado.
 * 3. Faz o upload para o Vercel Blob CDN permanente (https://...vercel-storage.com).
 * 4. Notifica o progresso para a interface de usuário.
 * 5. Retorna uma lista de URLs permanentes do Vercel Blob.
 */
export async function processAndUploadDeviceImages(
  files: File[],
  onProgress?: (info: UploadProgressInfo) => void,
  watermarkOptions?: WatermarkOptions | null,
  folder: 'imoveis' | 'plantas' | 'branding' | 'geral' = 'imoveis'
): Promise<string[]> {
  const finalUrls: string[] = [];
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        fileName: file.name,
        percent: Math.round((i / total) * 100),
        stage: 'optimizing',
      });
    }

    try {
      // 1. Otimização com qualidade visual nítida
      const maxWidth = total > 15 ? 1080 : 1200;
      const maxHeight = total > 15 ? 810 : 900;
      const quality = total > 15 ? 0.60 : 0.62;

      const opt = await optimizeImageFile(file, maxWidth, maxHeight, quality);
      if (opt.dataUrl) {
        let processedDataUrl = opt.dataUrl;

        // 2. Aplicação de marca d'água oficial
        if (watermarkOptions) {
          if (onProgress) {
            onProgress({
              current: i + 1,
              total,
              fileName: file.name,
              percent: Math.round((i / total) * 100) + 10,
              stage: 'watermarking',
            });
          }
          try {
            processedDataUrl = await applyWatermarkToImage(opt.dataUrl, watermarkOptions);
          } catch (wmErr) {
            console.warn(`Aviso ao aplicar marca d'água na foto ${file.name}:`, wmErr);
          }
        }

        // 3. Upload seguro para o Vercel Blob
        if (onProgress) {
          onProgress({
            current: i + 1,
            total,
            fileName: file.name,
            percent: Math.round((i / total) * 100) + 20,
            stage: 'uploading_blob',
          });
        }

        const blobResult = await uploadImageToVercelBlob({
          dataUrl: processedDataUrl,
          fileName: file.name,
          folder,
        });

        // Se o upload no Vercel Blob teve sucesso, usa a URL permanente pública da Vercel
        // Caso contrário, usa a imagem otimizada com segurança
        finalUrls.push(blobResult.url || processedDataUrl);
      }
    } catch (error) {
      console.error(`Erro ao processar imagem ${file.name}:`, error);
    }

    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        fileName: file.name,
        percent: Math.round(((i + 1) / total) * 100),
        stage: 'done',
      });
    }
  }

  return finalUrls;
}

export { uploadImageToVercelBlob, deleteImageFromVercelBlob, isVercelBlobUrl };
