/**
 * Utilitário de Aplicação de Marca d'Água para Imóveis
 * - Respeita 100% o fundo transparente da imagem PNG original
 * - Aplica opacidade ajustável para transparência sutil e refinada
 * - Posicionamento milimetricamente calculado (Centro, Cantos, etc.)
 * - Pré-carregamento e cache para processamento ultrarrápido em lote
 */

export type WatermarkPosition = 
  | 'bottom-right' 
  | 'center' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'top-right' 
  | 'top-left';

export interface WatermarkOptions {
  watermarkUrl?: string;
  opacity?: number; // 0.1 to 1.0 (ex: 0.40 = 40% visível, 60% transparente)
  position?: WatermarkPosition;
  scale?: number; // 0.15 to 0.60 (fração da largura da imagem)
  paddingPercent?: number; // distância da borda em % (ex: 0.03 = 3%)
}

export const DEFAULT_WATERMARK_URL = 'https://i.postimg.cc/FKYZkRgL/Chat-GPT-Image-10-09-2026-08-55-36.png';
export const DEFAULT_WATERMARK_OPACITY = 0.42; // 42% de opacidade (sutil e translúcida)
export const DEFAULT_WATERMARK_POSITION: WatermarkPosition = 'bottom-right';
export const DEFAULT_WATERMARK_SCALE = 0.32; // 32% da largura da foto

let cachedWatermarkImg: HTMLImageElement | null = null;
let cachedWatermarkUrl: string | null = null;

/**
 * Carrega a imagem da marca d'água com suporte a CORS e cache em memória
 */
export async function loadWatermarkImage(url: string = DEFAULT_WATERMARK_URL): Promise<HTMLImageElement> {
  if (cachedWatermarkImg && cachedWatermarkUrl === url && cachedWatermarkImg.complete && cachedWatermarkImg.naturalWidth > 0) {
    return cachedWatermarkImg;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      cachedWatermarkImg = img;
      cachedWatermarkUrl = url;
      resolve(img);
    };

    img.onerror = () => {
      // Se falhar com crossOrigin anonymous, tenta carregar via fetch Blob como fallback
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          const fallbackImg = new Image();
          fallbackImg.onload = () => {
            cachedWatermarkImg = fallbackImg;
            cachedWatermarkUrl = url;
            resolve(fallbackImg);
          };
          fallbackImg.onerror = () => reject(new Error('Não foi possível carregar a marca d água'));
          fallbackImg.src = blobUrl;
        })
        .catch(err => reject(new Error(`Erro ao baixar marca d água: ${err.message}`)));
    };

    img.src = url;
  });
}

/**
 * Carrega uma imagem base (foto do imóvel)
 */
function loadBaseImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Se não for dataUrl, definir crossOrigin para permitir renderização em canvas
    if (!src.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => resolve(img);
    img.onerror = () => {
      // Se falhar com crossOrigin, tentar via fetch blob
      if (!src.startsWith('data:')) {
        fetch(src)
          .then(res => res.blob())
          .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            const fallbackImg = new Image();
            fallbackImg.onload = () => resolve(fallbackImg);
            fallbackImg.onerror = () => reject(new Error('Falha ao renderizar foto'));
            fallbackImg.src = blobUrl;
          })
          .catch(() => reject(new Error('Falha ao carregar foto do imóvel')));
      } else {
        reject(new Error('Falha ao carregar foto base em base64'));
      }
    };

    img.src = src;
  });
}

/**
 * Aplica a marca d'água preservando estritamente a transparência do PNG
 * e aplicando a opacidade desejada via canvas globalAlpha
 */
export async function applyWatermarkToImage(
  baseImageSrc: string,
  options: WatermarkOptions = {}
): Promise<string> {
  const {
    watermarkUrl = DEFAULT_WATERMARK_URL,
    opacity = DEFAULT_WATERMARK_OPACITY,
    position = DEFAULT_WATERMARK_POSITION,
    scale = DEFAULT_WATERMARK_SCALE,
    paddingPercent = 0.035,
  } = options;

  // Carregar tanto a foto base quanto a marca d'água em paralelo
  const [baseImg, wmImg] = await Promise.all([
    loadBaseImage(baseImageSrc),
    loadWatermarkImage(watermarkUrl),
  ]);

  let width = baseImg.naturalWidth || baseImg.width;
  let height = baseImg.naturalHeight || baseImg.height;

  if (!width || !height) {
    throw new Error('Dimensões da foto base inválidas');
  }

  // Redimensionamento proporcional inteligente: fotos de smartphones (4000x3000)
  // são ajustadas para até 1200x900, mantendo altíssima nitidez visual e reduzindo
  // o peso de 10MB para ~25KB-35KB, permitindo dezenas de fotos sem estourar o banco.
  const MAX_W = 1200;
  const MAX_H = 900;
  if (width > MAX_W || height > MAX_H) {
    const ratio = Math.min(MAX_W / width, MAX_H / height);
    width = Math.max(1, Math.round(width * ratio));
    height = Math.max(1, Math.round(height * ratio));
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Não foi possível obter contexto 2D do canvas');
  }

  // 1. Renderiza a foto do imóvel com máxima nitidez
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(baseImg, 0, 0, width, height);

  // 2. Cálculo dimensional proporcional da marca d'água
  const wmNaturalW = wmImg.naturalWidth || 1280;
  const wmNaturalH = wmImg.naturalHeight || 782;
  const wmAspect = wmNaturalW / wmNaturalH;

  let targetW = width * scale;
  let targetH = targetW / wmAspect;

  // Não permitir que a marca d'água ocupe mais de 45% da altura da foto
  if (targetH > height * 0.45) {
    targetH = height * 0.45;
    targetW = targetH * wmAspect;
  }

  // Distância das bordas
  const paddingX = Math.round(width * paddingPercent);
  const paddingY = Math.round(height * paddingPercent);

  let x = width - targetW - paddingX;
  let y = height - targetH - paddingY;

  switch (position) {
    case 'center':
      x = Math.round((width - targetW) / 2);
      y = Math.round((height - targetH) / 2);
      break;
    case 'bottom-right':
      x = Math.round(width - targetW - paddingX);
      y = Math.round(height - targetH - paddingY);
      break;
    case 'bottom-left':
      x = Math.round(paddingX);
      y = Math.round(height - targetH - paddingY);
      break;
    case 'bottom-center':
      x = Math.round((width - targetW) / 2);
      y = Math.round(height - targetH - paddingY);
      break;
    case 'top-right':
      x = Math.round(width - targetW - paddingX);
      y = Math.round(paddingY);
      break;
    case 'top-left':
      x = Math.round(paddingX);
      y = Math.round(paddingY);
      break;
  }

  // 3. Aplicação da marca d'água:
  // Salva o estado atual do contexto
  ctx.save();

  // Define a transparência global:
  // Isto aplica a opacidade desejada ao elemento desenhado
  // RESPEITANDO 100% o canal alfa (fundo transparente) do PNG original!
  ctx.globalAlpha = Math.max(0.1, Math.min(1.0, opacity));

  // Renderiza a marca d'água perfeitamente posicionada
  ctx.drawImage(wmImg, x, y, targetW, targetH);

  // Restaura o contexto
  ctx.restore();

  // 4. Retorna a imagem combinada em WebP otimizado (ou JPEG se necessário) de alta fidelidade
  // Qualidade 0.65 oferece nitidez cristalina enquanto mantém o arquivo super leve (~25KB-35KB)
  let resultUrl = canvas.toDataURL('image/webp', 0.65);
  if (!resultUrl.startsWith('data:image/webp')) {
    resultUrl = canvas.toDataURL('image/jpeg', 0.68);
  }

  return resultUrl;
}

/**
 * Aplica marca d'água em lote com notificação de progresso
 */
export async function applyWatermarkToBatch(
  images: string[],
  options: WatermarkOptions = {},
  onProgress?: (current: number, total: number) => void
): Promise<string[]> {
  const result: string[] = [];
  const total = images.length;

  // Pré-carrega a marca d'água uma única vez
  await loadWatermarkImage(options.watermarkUrl || DEFAULT_WATERMARK_URL);

  for (let i = 0; i < total; i++) {
    if (onProgress) {
      onProgress(i + 1, total);
    }
    try {
      const watermarked = await applyWatermarkToImage(images[i], options);
      result.push(watermarked);
    } catch (err) {
      console.warn(`Erro ao aplicar marca d'água na foto ${i + 1}:`, err);
      // Mantém a foto original caso haja algum erro de CORS ou carregamento
      result.push(images[i]);
    }
  }

  return result;
}
