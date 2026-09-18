import React, { useState, useEffect, useRef } from 'react';
import { 
  Stamp, 
  Sliders, 
  X, 
  Check, 
  RefreshCw, 
  Layers, 
  Eye, 
  Wand2, 
  AlertCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
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

interface WatermarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialWatermarkUrl?: string;
  initialOpacity?: number;
  initialPosition?: WatermarkPosition;
  initialScale?: number;
  onApplyToAll: (watermarkedImages: string[]) => void;
  onApplyToSingle: (index: number, watermarkedUrl: string) => void;
  selectedPhotoIndex?: number;
}

const POSITION_OPTIONS: { id: WatermarkPosition; label: string; desc: string }[] = [
  { id: 'bottom-right', label: 'Canto Inf. Direito', desc: 'Padrão imobiliário clássico' },
  { id: 'center', label: 'Centro', desc: 'Máxima proteção e destaque' },
  { id: 'bottom-left', label: 'Canto Inf. Esquerdo', desc: 'Discreto e equilibrado' },
  { id: 'bottom-center', label: 'Centro Inferior', desc: 'Simétrico na base da foto' },
  { id: 'top-right', label: 'Canto Sup. Direito', desc: 'Topo da imagem' },
  { id: 'top-left', label: 'Canto Sup. Esquerdo', desc: 'Topo esquerdo' },
];

const SCALE_OPTIONS = [
  { value: 0.22, label: 'Pequena (22%)' },
  { value: 0.32, label: 'Média (32%)' },
  { value: 0.42, label: 'Grande (42%)' },
  { value: 0.52, label: 'Extra (52%)' },
];

export const WatermarkModal: React.FC<WatermarkModalProps> = ({
  isOpen,
  onClose,
  images,
  initialWatermarkUrl = DEFAULT_WATERMARK_URL,
  initialOpacity = DEFAULT_WATERMARK_OPACITY,
  initialPosition = DEFAULT_WATERMARK_POSITION,
  initialScale = DEFAULT_WATERMARK_SCALE,
  onApplyToAll,
  onApplyToSingle,
  selectedPhotoIndex = 0,
}) => {
  const [watermarkUrl, setWatermarkUrl] = useState(initialWatermarkUrl);
  const [opacity, setOpacity] = useState(initialOpacity);
  const [position, setPosition] = useState<WatermarkPosition>(initialPosition);
  const [scale, setScale] = useState(initialScale);
  const [currentIdx, setCurrentIdx] = useState(selectedPhotoIndex);
  
  // Live preview state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRenderingPreview, setIsRenderingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  // Keep index within bounds
  useEffect(() => {
    if (selectedPhotoIndex >= 0 && selectedPhotoIndex < (images.length || 1)) {
      setCurrentIdx(selectedPhotoIndex);
    }
  }, [selectedPhotoIndex, images.length]);

  // Selected sample image
  const sampleImage = images[currentIdx] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  // Debounced live preview rendering
  useEffect(() => {
    if (!isOpen) return;

    let isSubscribed = true;
    setIsRenderingPreview(true);
    setPreviewError(null);

    const timer = setTimeout(async () => {
      try {
        const options: WatermarkOptions = {
          watermarkUrl,
          opacity,
          position,
          scale,
        };
        const result = await applyWatermarkToImage(sampleImage, options);
        if (isSubscribed) {
          setPreviewUrl(result);
          setIsRenderingPreview(false);
        }
      } catch (err: any) {
        if (isSubscribed) {
          console.error('Erro na pré-visualização da marca d água:', err);
          setPreviewError('Não foi possível carregar a prévia. Verifique sua conexão.');
          setIsRenderingPreview(false);
        }
      }
    }, 120);

    return () => {
      isSubscribed = false;
      clearTimeout(timer);
    };
  }, [isOpen, sampleImage, watermarkUrl, opacity, position, scale]);

  if (!isOpen) return null;

  const handleApplySingle = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    try {
      const options: WatermarkOptions = { watermarkUrl, opacity, position, scale };
      const watermarked = await applyWatermarkToImage(sampleImage, options);
      onApplyToSingle(currentIdx, watermarked);
      onClose();
    } catch (err: any) {
      alert(`Erro ao aplicar marca d'água: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyAll = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setProgress({ current: 1, total: images.length });
    try {
      const options: WatermarkOptions = { watermarkUrl, opacity, position, scale };
      const watermarkedList = await applyWatermarkToBatch(
        images,
        options,
        (curr, tot) => setProgress({ current: curr, total: tot })
      );
      onApplyToAll(watermarkedList);
      onClose();
    } catch (err: any) {
      alert(`Erro ao aplicar marca d'água em lote: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in-50">
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E0D8] bg-[#F7F3EB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227]">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
                <span>Marca d'Água Oficial dos Imóveis</span>
                <span className="px-2 py-0.5 rounded-md bg-[#C9A227] text-[#0A0A0A] font-bold text-[10px] uppercase tracking-wider">
                  Alta Resolução
                </span>
              </h3>
              <p className="text-xs text-[#5A5A5A]">
                Fundo transparente preservado (PNG) com opacidade suave e posicionamento milimétrico.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-xl text-[#5A5A5A] hover:text-[#111111] hover:bg-[#EAE4D8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body (2 Columns on Desktop) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Live Interactive Preview */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#111111] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Pré-visualização em Tempo Real</span>
              </span>

              {images.length > 1 && (
                <div className="flex items-center gap-1.5 bg-[#F7F3EB] border border-[#E5E0D8] rounded-xl px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="p-0.5 text-[#5A5A5A] hover:text-[#111111] cursor-pointer"
                    title="Foto anterior"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-medium text-[#111111]">
                    Foto {currentIdx + 1} de {images.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="p-0.5 text-[#5A5A5A] hover:text-[#111111] cursor-pointer"
                    title="Próxima foto"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Preview Viewport Container */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#111111] border border-[#E5E0D8] shadow-inner flex items-center justify-center group">
              {isRenderingPreview && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1.5 z-20">
                  <RefreshCw className="w-3 h-3 animate-spin text-[#C9A227]" />
                  <span>Atualizando...</span>
                </div>
              )}

              {previewError ? (
                <div className="p-4 text-center text-red-500 text-xs flex flex-col items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <span>{previewError}</span>
                </div>
              ) : (
                <img
                  src={showOriginal ? sampleImage : (previewUrl || sampleImage)}
                  alt="Prévia com marca d'água"
                  className="w-full h-full object-cover transition-opacity duration-200"
                />
              )}

              {/* Compare Button Floating Over Preview */}
              <button
                type="button"
                onMouseDown={() => setShowOriginal(true)}
                onMouseUp={() => setShowOriginal(false)}
                onTouchStart={() => setShowOriginal(true)}
                onTouchEnd={() => setShowOriginal(false)}
                className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/85 backdrop-blur-xs text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-md transition-all select-none z-20"
              >
                <Layers className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>{showOriginal ? 'Visualizando Original' : 'Segure para ver Original'}</span>
              </button>

              {/* Badge indicating transparency */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-[#0A0A0A]/80 backdrop-blur-xs text-xs text-[#C9A227] font-semibold border border-[#C9A227]/30 z-20">
                Opacidade: {Math.round(opacity * 100)}%
              </div>
            </div>

            {/* Watermark Details & Alpha Channel Proof */}
            <div className="p-3 bg-[#F7F3EB] rounded-xl border border-[#E5E0D8] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                {/* Checkerboard Pattern for Transparency Demonstration */}
                <div 
                  className="w-12 h-10 rounded-lg border border-[#E5E0D8] overflow-hidden flex items-center justify-center p-0.5"
                  style={{
                    backgroundImage: `linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%)`,
                    backgroundSize: '8px 8px',
                    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
                  }}
                  title="Fundo transparente preservado (Canal Alfa PNG)"
                >
                  <img
                    src={watermarkUrl}
                    alt="Logo Marca d'Água"
                    className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                    crossOrigin="anonymous"
                  />
                </div>
                <div>
                  <p className="font-bold text-[#111111] text-[11px]">Selo Oficial Daniel Pacheco</p>
                  <p className="text-[10px] text-[#5A5A5A]">Fundo transparente 100% preservado • Sem caixas ou bordas sólidas</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setWatermarkUrl(DEFAULT_WATERMARK_URL);
                  setOpacity(DEFAULT_WATERMARK_OPACITY);
                  setPosition(DEFAULT_WATERMARK_POSITION);
                  setScale(DEFAULT_WATERMARK_SCALE);
                }}
                className="text-[11px] text-[#C9A227] hover:underline font-semibold cursor-pointer"
              >
                Restaurar Padrões
              </button>
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-5 flex flex-col space-y-5">
            
            {/* 1. Opacity Slider (Transparência) */}
            <div className="space-y-2 bg-[#F7F3EB] p-4 rounded-2xl border border-[#E5E0D8]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Transparência da Marca d'Água</span>
                </label>
                <span className="font-mono text-xs font-bold text-[#C9A227] bg-[#FFFFFF] px-2 py-0.5 rounded-md border border-[#E5E0D8]">
                  {Math.round(opacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.15"
                max="0.85"
                step="0.01"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-[#C9A227] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#5A5A5A]">
                <span>15% (Mais translúcida)</span>
                <span className="text-[#C9A227] font-semibold">42% (Recomendada)</span>
                <span>85% (Mais visível)</span>
              </div>
            </div>

            {/* 2. Position Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#111111] block">
                Posicionamento na Foto
              </label>
              <div className="grid grid-cols-2 gap-2">
                {POSITION_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPosition(opt.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      position === opt.id
                        ? 'border-[#C9A227] bg-[#C9A227]/10 ring-1 ring-[#C9A227]'
                        : 'border-[#E5E0D8] bg-[#FFFFFF] hover:bg-[#F7F3EB]'
                    }`}
                  >
                    <p className={`text-xs font-bold ${position === opt.id ? 'text-[#111111]' : 'text-[#5A5A5A]'}`}>
                      {opt.label}
                    </p>
                    <p className="text-[10px] text-[#8A8A8A] truncate">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Scale / Size Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#111111] block">
                Tamanho da Marca d'Água
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {SCALE_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setScale(s.value)}
                    className={`py-2 px-1 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                      scale === s.value
                        ? 'border-[#C9A227] bg-[#C9A227] text-[#0A0A0A]'
                        : 'border-[#E5E0D8] bg-[#FFFFFF] text-[#5A5A5A] hover:bg-[#F7F3EB]'
                    }`}
                  >
                    {s.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Watermark URL Input (Optional customization) */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#5A5A5A] block">
                Link da Imagem da Marca d'Água (PNG transparente)
              </label>
              <input
                type="text"
                value={watermarkUrl}
                onChange={(e) => setWatermarkUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#F7F3EB] border border-[#E5E0D8] text-[11px] text-[#111111] rounded-xl px-3 py-2 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="px-6 py-4 border-t border-[#E5E0D8] bg-[#F7F3EB] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-[#5A5A5A]">
            {isProcessing && progress ? (
              <span className="flex items-center gap-2 font-bold text-[#111111]">
                <RefreshCw className="w-4 h-4 animate-spin text-[#C9A227]" />
                <span>Aplicando marca d'água na foto {progress.current} de {progress.total}...</span>
              </span>
            ) : (
              <span>Disponível para {images.length} {images.length === 1 ? 'foto' : 'fotos'} neste imóvel.</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FFFFFF] text-xs font-semibold text-[#5A5A5A] hover:text-[#111111] cursor-pointer transition-colors"
            >
              Cancelar
            </button>

            {images.length > 0 && (
              <button
                type="button"
                onClick={handleApplySingle}
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-xl border border-[#C9A227] bg-[#FFFFFF] hover:bg-[#C9A227]/10 text-xs font-bold text-[#111111] flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
              >
                <Stamp className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Aplicar Somente na Foto {currentIdx + 1}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleApplyAll}
              disabled={isProcessing || images.length === 0}
              className="px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Aplicar em Todas as Fotos ({images.length})</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
