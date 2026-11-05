import React, { useState, useRef } from 'react';
import { 
  Bed, 
  Bath, 
  Car, 
  Maximize, 
  MapPin, 
  Building, 
  MessageCircle, 
  ArrowUpRight,
  Sparkles, 
  ShieldCheck, 
  Landmark, 
  Heart, 
  Scale, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Check 
} from 'lucide-react';
import { Property, SiteSettings } from '../types';
import { formatCurrency, getStatusBadgeColor, createWhatsAppUrl, getOptimizedImageUrl } from '../utils/formatters';

interface PropertyCardProps {
  property: Property;
  settings: SiteSettings;
  onSelect: (property: Property) => void;
  priority?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (propertyId: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  settings,
  onSelect,
  priority = false,
  isFavorite = false,
  onToggleFavorite,
  isCompared = false,
  onToggleCompare,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Spotlight mouse tracking effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const imagesList = property.images && property.images.length > 0 
    ? property.images.slice(0, 5) 
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'];

  const currentImage = getOptimizedImageUrl(imagesList[activePhotoIdx] || imagesList[0], 'card');

  const whatsappMessage = `Olá Daniel! Gostaria de mais informações sobre o imóvel cód. ${property.code} (${property.title} em ${property.city}).`;
  const whatsappUrl = createWhatsAppUrl(settings.whatsapp || '5548998001744', whatsappMessage);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/#${property.slug || property.id || property.code}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }).catch(() => {});
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : imagesList.length - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev < imagesList.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      ref={cardRef}
      id={`property-card-${property.code}`}
      onMouseMove={handleMouseMove}
      className="spotlight-card group relative bg-[#FFFFFF] rounded-2xl border border-[#E5E0D8] hover:border-[#C9A227] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl"
    >
      {/* Image & Badges Container */}
      <div 
        className="relative aspect-[16/10] w-full overflow-hidden cursor-pointer bg-[#F4EFE6]"
        onClick={() => onSelect(property)}
      >
        {/* Shimmer skeleton enquanto carrega */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#EFE9DF] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.4s_infinite]" />
          </div>
        )}

        <img
          src={currentImage}
          alt={property.title}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Cinematic Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges & Actions */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          {/* Status Badge */}
          <div className="flex items-center gap-1.5">
            <span className="bg-[#C9A227] text-[#0A0A0A] text-[9px] font-extrabold px-2.5 py-1 uppercase tracking-wider shadow-md rounded-md font-sans">
              {property.status}
            </span>
            {property.featured && (
              <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-black/80 text-[#C9A227] border border-[#C9A227]/40 backdrop-blur-md flex items-center gap-1 shadow-md rounded-md">
                <Sparkles className="w-2.5 h-2.5 fill-current" />
                <span className="hidden sm:inline">Exclusivo</span>
              </span>
            )}
          </div>

          {/* Interactive Actions: Share, Favorite, Code */}
          <div className="flex items-center gap-1.5">
            {/* Copy Link button */}
            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition-all cursor-pointer shadow-sm"
              title="Copiar link do imóvel"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#1F8A4C]" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            {/* Favorite button */}
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(property.id);
                }}
                className={`p-1.5 rounded-lg backdrop-blur-md border transition-all cursor-pointer shadow-sm ${
                  isFavorite
                    ? 'bg-red-500/20 border-red-500/50 text-red-400'
                    : 'bg-black/60 hover:bg-black/90 border-white/10 text-white/80 hover:text-red-400'
                }`}
                title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}

            {/* Code Tag */}
            <span className="px-2 py-1 text-[9px] font-mono bg-black/75 text-white/90 backdrop-blur-md border border-white/10 rounded-md">
              Cód. {property.code}
            </span>
          </div>
        </div>

        {/* Photo Gallery Navigation Controls on Hover */}
        {imagesList.length > 1 && (
          <>
            <button
              onClick={handlePrevPhoto}
              className="hidden group-hover:flex absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 text-white items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer z-10"
              title="Foto anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextPhoto}
              className="hidden group-hover:flex absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 text-white items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer z-10"
              title="Próxima foto"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Photo Indicator Dots */}
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm border border-white/10">
              {imagesList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIdx(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === activePhotoIdx ? 'w-3 bg-[#C9A227]' : 'bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Ver foto ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Bottom Badges: Construtora / Direct Financing */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 pointer-events-none flex-wrap max-w-[70%]">
          {property.developer && (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#0A0A0A]/90 text-white border border-white/15 flex items-center gap-1 backdrop-blur-md shadow-sm">
              <Building className="w-2.5 h-2.5 text-[#C9A227]" />
              <span className="truncate max-w-[120px]">{property.developer}</span>
            </span>
          )}
          {property.directFinancing && (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1F8A4C]/90 text-white border border-[#1F8A4C]/30 flex items-center gap-1 backdrop-blur-sm shadow-sm">
              <ShieldCheck className="w-2.5 h-2.5 text-white" />
              <span>Direto Construtora</span>
            </span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Unboxed Metadata with Typographic Bullets */}
          <div className="flex items-center gap-1.5 text-xs text-[#666666] mb-2 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
            <span className="text-[#222222] font-semibold truncate">{property.neighborhood}</span>
            <span aria-hidden="true" className="text-[#999999]">·</span>
            <span className="text-[#666666]">{property.city}, {property.state}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(property)}
            className="text-base font-bold text-[#111111] group-hover:text-[#C9A227] transition-colors line-clamp-1 cursor-pointer leading-snug font-serif"
          >
            {property.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#555555] mt-1.5 line-clamp-2 leading-relaxed">
            {property.shortDescription || property.description}
          </p>
        </div>

        {/* Specifications Matrix with Tabular Figures */}
        <div className="grid grid-cols-4 gap-2 py-2.5 border-y border-[#EBE5DC] text-xs text-[#555555]">
          {/* Bedrooms */}
          <div className="flex flex-col items-center justify-center text-center p-1.5 rounded-lg bg-[#F7F3EB] border border-[#EBE5DC]/60" title={`${property.bedrooms || 0} Quartos`}>
            <div className="flex items-center gap-1 text-[#111111]">
              <Bed className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="font-bold tabular-nums">{property.bedrooms || '-'}</span>
            </div>
            <span className="text-[10px] text-[#666666] mt-0.5">Quartos</span>
          </div>

          {/* Bathrooms */}
          <div className="flex flex-col items-center justify-center text-center p-1.5 rounded-lg bg-[#F7F3EB] border border-[#EBE5DC]/60" title={`${property.bathrooms || 0} Banheiros`}>
            <div className="flex items-center gap-1 text-[#111111]">
              <Bath className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="font-bold tabular-nums">{property.bathrooms || '-'}</span>
            </div>
            <span className="text-[10px] text-[#666666] mt-0.5">Banh.</span>
          </div>

          {/* Garage */}
          <div className="flex flex-col items-center justify-center text-center p-1.5 rounded-lg bg-[#F7F3EB] border border-[#EBE5DC]/60" title={`${property.garageSpots || 0} Vagas`}>
            <div className="flex items-center gap-1 text-[#111111]">
              <Car className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="font-bold tabular-nums">{property.garageSpots || '-'}</span>
            </div>
            <span className="text-[10px] text-[#666666] mt-0.5">Vagas</span>
          </div>

          {/* Area */}
          <div className="flex flex-col items-center justify-center text-center p-1.5 rounded-lg bg-[#F7F3EB] border border-[#EBE5DC]/60" title={`${property.areaM2 || 0} m² Privativos`}>
            <div className="flex items-center gap-1 text-[#111111]">
              <Maximize className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="font-bold tabular-nums">{property.areaM2 ? `${property.areaM2}m²` : '-'}</span>
            </div>
            <span className="text-[10px] text-[#666666] mt-0.5">Área</span>
          </div>
        </div>

        {/* Pricing & Interactive CTA Row */}
        <div className="pt-1 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#7A7A7A] block">
              {property.status === 'Na planta' ? 'A partir de' : 'Valor'}
            </span>
            <div className="text-base sm:text-lg font-bold font-serif text-[#C9A227] tracking-tight tabular-nums">
              {property.price && property.price > 0 
                ? formatCurrency(property.price) 
                : <span className="text-sm font-sans font-semibold text-[#111111]">Sob Consulta</span>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Compare checkbox / toggle */}
            {onToggleCompare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare(property);
                }}
                className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                  isCompared
                    ? 'bg-[#C9A227] border-[#C9A227] text-[#0A0A0A] font-bold'
                    : 'bg-[#F7F3EB] border-[#E5E0D8] text-[#555555] hover:text-[#111111] hover:bg-[#EAE4D8]'
                }`}
                title={isCompared ? 'Remover do comparador' : 'Adicionar ao comparador'}
              >
                <Scale className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[10px]">{isCompared ? 'Comparando' : 'Comparar'}</span>
              </button>
            )}

            {/* WhatsApp Quick Inquire */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2.5 rounded-xl bg-[#1F8A4C] hover:bg-[#197A42] text-white transition-all cursor-pointer shadow-md hover:scale-105"
              title="Falar no WhatsApp sobre este imóvel"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
            </a>

            {/* View Details CTA */}
            <button
              onClick={() => onSelect(property)}
              className="px-4 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#B38F20] text-[#0A0A0A] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:scale-105"
            >
              <span>Ver</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
