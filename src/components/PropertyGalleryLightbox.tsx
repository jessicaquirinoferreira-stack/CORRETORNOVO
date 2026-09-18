import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { getHighResImageUrl, getOptimizedImageUrl, preloadImage } from '../utils/formatters';

interface PropertyGalleryLightboxProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  title: string;
}

export const PropertyGalleryLightbox: React.FC<PropertyGalleryLightboxProps> = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  title,
}) => {
  const [mainLoaded, setMainLoaded] = useState(false);

  // Preload next and previous images in background for instant slide switching
  useEffect(() => {
    if (!isOpen || images.length === 0) return;
    setMainLoaded(false);

    const nextIdx = (currentIndex + 1) % images.length;
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    preloadImage(getOptimizedImageUrl(images[nextIdx], 'full'));
    preloadImage(getOptimizedImageUrl(images[prevIdx], 'full'));
  }, [currentIndex, images, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between z-10 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-[#C9A227] font-mono font-semibold">
            Galeria Oficial
          </span>
          <span className="text-white/40">|</span>
          <h4 className="text-sm font-medium text-white/90 truncate max-w-xs sm:max-w-md">
            {title}
          </h4>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-white/60 bg-white/10 px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-[#C9A227] text-white hover:text-[#0A0A0A] transition-all cursor-pointer"
            aria-label="Fechar galeria"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center my-4 select-none">
        {!mainLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-[#C9A227]/30 border-t-[#C9A227] rounded-full animate-spin" />
          </div>
        )}

        <img
          src={getOptimizedImageUrl(images[currentIndex], 'full')}
          alt={`${title} - Foto ${currentIndex + 1}`}
          decoding="async"
          onLoad={() => setMainLoaded(true)}
          className={`max-h-[84vh] max-w-[94vw] object-contain rounded-xl shadow-2xl transition-all duration-300 filter drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)] ${
            mainLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
          }`}
        />

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#C9A227] text-white hover:text-[#0A0A0A] backdrop-blur-md transition-all shadow-lg cursor-pointer"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#C9A227] text-white hover:text-[#0A0A0A] backdrop-blur-md transition-all shadow-lg cursor-pointer"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip (Super fast 380px WebP thumbnails) */}
      {images.length > 1 && (
        <div className="w-full max-w-5xl mx-auto overflow-x-auto flex items-center justify-center gap-2 py-2 px-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                const diff = idx - currentIndex;
                if (diff > 0) {
                  for (let i = 0; i < diff; i++) onNext();
                } else if (diff < 0) {
                  for (let i = 0; i < Math.abs(diff); i++) onPrev();
                }
              }}
              className={`relative h-14 sm:h-16 aspect-[16/10] rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                currentIndex === idx
                  ? 'border-[#C9A227] scale-105 shadow-md'
                  : 'border-transparent opacity-40 hover:opacity-100'
              }`}
            >
              <img 
                src={getOptimizedImageUrl(img, 'thumb')} 
                alt={`Miniatura ${idx + 1}`} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
