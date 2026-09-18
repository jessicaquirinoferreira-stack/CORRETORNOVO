import React, { useState, useEffect } from 'react';
import { getOptimizedImageUrl, ImageSizeTarget } from '../utils/formatters';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'size'> {
  src: string;
  alt: string;
  size?: ImageSizeTarget;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  aspectRatioClass?: string;
  fallbackSrc?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  size = 'card' as ImageSizeTarget,
  priority = false,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  aspectRatioClass = '',
  fallbackSrc = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=850&q=80',
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Computa a URL perfeitamente balanceada para rapidez de download e nitidez
  const optimizedUrl = React.useMemo(() => {
    if (hasError) return fallbackSrc;
    return getOptimizedImageUrl(src, size as ImageSizeTarget);
  }, [src, size, hasError, fallbackSrc]);

  // Se a imagem mudar, reinicia o estado de carregamento
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${containerClassName} ${aspectRatioClass}`}>
      {/* Shimmer skeleton enquanto a imagem carrega */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-[#EDE8DF] z-0 flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F7F3EB]/70 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
      )}

      {/* Imagem Otimizada */}
      <img
        src={optimizedUrl}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) setHasError(true);
          setIsLoaded(true);
        }}
        className={`${className} transition-opacity duration-300 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...rest}
      />
    </div>
  );
};
