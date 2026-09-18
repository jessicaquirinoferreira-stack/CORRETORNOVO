import React from 'react';
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
  Landmark
} from 'lucide-react';
import { Property, SiteSettings } from '../types';
import { formatCurrency, getStatusBadgeColor, createWhatsAppUrl, getOptimizedImageUrl } from '../utils/formatters';

interface PropertyCardProps {
  property: Property;
  settings: SiteSettings;
  onSelect: (property: Property) => void;
  priority?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  settings,
  onSelect,
  priority = false,
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const badgeStyle = getStatusBadgeColor(property.status);
  
  const whatsappMessage = `Olá Daniel! Gostaria de mais informações sobre o imóvel cód. ${property.code} (${property.title} em ${property.city}).`;
  const whatsappUrl = createWhatsAppUrl(settings.whatsapp || '5548998001744', whatsappMessage);

  const rawImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c';
  
  // Utiliza tamanho otimizado 'card' (WebP leve, alta nitidez em Retina, carregamento 10x mais rápido)
  const mainImage = getOptimizedImageUrl(rawImage, 'card');

  return (
    <div
      id={`property-card-${property.code}`}
      className="group relative bg-[#FFFFFF] rounded-2xl border border-[#E5E0D8] hover:border-[#C9A227] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/5"
    >
      {/* Image & Badges Container */}
      <div 
        className="relative aspect-[16/10] w-full overflow-hidden cursor-pointer bg-[#F7F3EB]"
        onClick={() => onSelect(property)}
      >
        {/* Shimmer skeleton enquanto a imagem carrega */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#EAE5DC] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F7F3EB]/70 to-transparent -translate-x-full animate-[shimmer_1.4s_infinite]" />
          </div>
        )}

        <img
          src={mainImage}
          alt={property.title}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2 z-10">
          {/* Status Badge */}
          <div className="bg-[#C9A227] text-[#0A0A0A] text-[9px] font-extrabold px-2.5 py-0.5 uppercase tracking-tighter shadow-md rounded">
            <span>{property.status}</span>
          </div>

          {/* Signature / Code Tag */}
          <div className="flex items-center gap-1.5">
            {property.featured && (
              <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#0A0A0A]/90 text-[#C9A227] border border-[#C9A227]/40 backdrop-blur-md flex items-center gap-1 shadow-md rounded">
                <Sparkles className="w-2.5 h-2.5 fill-current" />
                <span>Exclusivo</span>
              </span>
            )}
            <span className="px-2 py-0.5 text-[9px] font-mono bg-black/80 text-white/90 backdrop-blur-md border border-white/10 rounded">
              Cód. {property.code}
            </span>
          </div>
        </div>

        {/* Construtora / Direct Financing / Bank Financing Badges */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 pointer-events-none flex-wrap max-w-[85%]">
          {property.developer && (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#0A0A0A]/85 text-[#FFFFFF] border border-white/10 flex items-center gap-1 backdrop-blur-sm shadow-sm">
              <Building className="w-2.5 h-2.5 text-[#C9A227]" />
              <span>{property.developer}</span>
            </span>
          )}
          {property.bankFinancing && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0284C7]/90 text-white border border-[#38BDF8]/40 flex items-center gap-1 backdrop-blur-sm shadow-sm">
              <Landmark className="w-2.5 h-2.5 text-white" />
              <span>Aceita Financiamento Bancário</span>
            </span>
          )}
          {property.directFinancing && (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1F8A4C]/90 text-white border border-[#1F8A4C]/30 flex items-center gap-1 backdrop-blur-sm shadow-sm">
              <ShieldCheck className="w-2.5 h-2.5 text-white" />
              <span>Direto c/ Construtora</span>
            </span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-[#5A5A5A] mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
            <span className="font-medium text-[#111111] truncate">{property.neighborhood}</span>
            <span className="text-[#5A5A5A]">•</span>
            <span className="text-[#5A5A5A]">{property.city}, {property.state}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(property)}
            className="text-base font-semibold text-[#111111] group-hover:text-[#C9A227] transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {property.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#5A5A5A] mt-1.5 line-clamp-2 leading-relaxed">
            {property.shortDescription || property.description}
          </p>
        </div>

        {/* Specifications Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 border-y border-[#E5E0D8] text-[#5A5A5A] text-xs">
          {property.bedrooms !== undefined && property.bedrooms > 0 && (
            <div className="flex flex-col items-center justify-center text-center p-1.5 rounded-lg bg-[#F7F3EB]" title={`${property.bedrooms} Dormitórios`}>
              <div className="flex items-center gap-1 text-[#111111]">
                <Bed className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="font-semibold">{property.bedrooms}</span>
              </div>
              <span className="text-[10px] text-[#5A5A5A] mt-0.5">Quartos</span>
            </div>
          )}

          {property.bathrooms !== undefined && property.bathrooms > 0 && (
            <div className="flex flex-col items-center justify-center text-center p-1.5 rounded-lg bg-[#F7F3EB]" title={`${property.bathrooms} Banheiros`}>
              <div className="flex items-center gap-1 text-[#111111]">
                <Bath className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="font-semibold">{property.bathrooms}</span>
              </div>
              <span className="text-[10px] text-[#5A5A5A] mt-0.5">Banheiros</span>
            </div>
          )}

          {property.garageSpaces !== undefined && property.garageSpaces > 0 && (
            <div className="flex flex-col items-center justify-center text-center p-1.5 rounded-lg bg-[#F7F3EB]" title={`${property.garageSpaces} Vagas de Garagem`}>
              <div className="flex items-center gap-1 text-[#111111]">
                <Car className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="font-semibold">{property.garageSpaces}</span>
              </div>
              <span className="text-[10px] text-[#5A5A5A] mt-0.5">Vagas</span>
            </div>
          )}

          {property.areaM2 ? (
            <div className="flex flex-col items-center justify-center text-center p-1.5 rounded-lg bg-[#F7F3EB]" title={`Área: ${property.areaM2}m²`}>
              <div className="flex items-center gap-1 text-[#111111]">
                <Maximize className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="font-semibold">{property.areaM2}</span>
              </div>
              <span className="text-[10px] text-[#5A5A5A] mt-0.5">m² total</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-1.5 rounded-lg bg-[#F7F3EB]">
              <span className="text-xs text-[#111111] font-medium">{property.type}</span>
              <span className="text-[10px] text-[#5A5A5A] mt-0.5">Tipo</span>
            </div>
          )}

          {/* For Lots/Terrenos with few metrics, fill with Type badge */}
          {property.bedrooms === undefined && property.bathrooms === undefined && (
            <>
              <div className="flex flex-col items-center justify-center text-center p-1.5 rounded-lg bg-[#F7F3EB]">
                <span className="text-xs text-[#111111] font-semibold">{property.type}</span>
                <span className="text-[10px] text-[#5A5A5A] mt-0.5">Categoria</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-1.5 rounded-lg bg-[#F7F3EB]">
                <span className="text-xs text-[#111111] font-semibold truncate max-w-[80px]">{property.neighborhood}</span>
                <span className="text-[10px] text-[#5A5A5A] mt-0.5">Bairro</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-1.5 rounded-lg bg-[#F7F3EB]">
                <span className="text-xs text-[#1F8A4C] font-semibold">Regularizado</span>
                <span className="text-[10px] text-[#5A5A5A] mt-0.5">Matrícula</span>
              </div>
            </>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div>
            <span className="text-[10px] text-[#5A5A5A] uppercase tracking-wider block">Valor</span>
            <span className="text-sm sm:text-base font-bold text-[#111111]">
              {property.priceFormatted || formatCurrency(property.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`card-view-btn-${property.code}`}
              onClick={() => onSelect(property)}
              className="p-2 rounded-lg bg-[#F7F3EB] hover:bg-[#E5E0D8] text-[#111111] hover:text-[#C9A227] transition-all border border-[#E5E0D8]"
              title="Ver detalhes completos"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              id={`card-whatsapp-btn-${property.code}`}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-lg bg-[#1F8A4C] hover:bg-[#197A42] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Perguntar no WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
