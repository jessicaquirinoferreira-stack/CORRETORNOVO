import React, { useState } from 'react';
import { MapPin, TrendingUp, Sparkles, CheckCircle2, ArrowRight, Building, Compass } from 'lucide-react';
import { Property, SiteSettings } from '../types';
import { CITIES_DATA, CityGuide, AMREC_DESCRIPTION } from '../data/initialSettings';
import { PropertyCard } from '../components/PropertyCard';
import { getOptimizedImageUrl } from '../utils/formatters';

interface CidadesPageProps {
  properties: Property[];
  settings: SiteSettings;
  onSelectProperty: (property: Property) => void;
  onOpenCuratedModal: () => void;
  isFavorite?: (id: string) => boolean;
  onToggleFavorite?: (id: string) => void;
  compareList?: Property[];
  onToggleCompare?: (property: Property) => void;
}

export const CidadesPage: React.FC<CidadesPageProps> = ({
  properties,
  settings,
  onSelectProperty,
  onOpenCuratedModal,
  isFavorite,
  onToggleFavorite,
  compareList = [],
  onToggleCompare,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('Criciúma (sede)');

  const activeCityData = CITIES_DATA.find((c) => c.name.toLowerCase() === selectedCity.toLowerCase()) || CITIES_DATA[0];

  const cleanSelectedCity = selectedCity.replace(/\s*\(sede\)/i, '').trim().toLowerCase();

  const cityProperties = properties.filter((p) => {
    const pCity = (p.city || '').toLowerCase();
    return pCity.includes(cleanSelectedCity) || cleanSelectedCity.includes(pCity);
  });

  return (
    <div id="cidades-page" className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#C9A227]/40 text-xs text-[#C9A227] shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Região da AMREC · Sul Catarinense</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white">
          Cidades Atendidas
        </h1>
        <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
          {AMREC_DESCRIPTION} Conheça os diferenciais e oportunidades imobiliárias em cada município atendido com assessoria direta do corretor Daniel Pacheco.
        </p>
      </div>

      {/* AMREC 12 Municipalities Information Bar */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A0A0A0]">
        <div className="flex items-center gap-2 font-semibold text-white">
          <Compass className="w-4 h-4 text-[#C9A227] shrink-0" />
          <span>AMREC — Associação dos Municípios da Região Carbonífera (12 Municípios)</span>
        </div>
        <span className="text-[11px] text-[#C9A227] bg-white/5 px-3 py-1 rounded-full border border-white/10">
          Atendimento Oficial no Sul de SC
        </span>
      </div>

      {/* City Selector Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 justify-start scrollbar-thin">
        {CITIES_DATA.map((city) => (
          <button
            key={city.id}
            onClick={() => setSelectedCity(city.name)}
            className={`px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
              selectedCity.toLowerCase() === city.name.toLowerCase()
                ? 'bg-[#C9A227] text-[#0A0A0A] font-bold shadow-md'
                : 'bg-[#141414] text-[#A0A0A0] hover:text-white hover:bg-white/10 border border-white/10 font-medium'
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Selected City Detail Card */}
      <div className="bg-[#141414] border border-white/10 rounded-3xl p-8 sm:p-12 overflow-hidden relative shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A227]">
                Polo Regional
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F8A4C]" />
              <span className="text-xs font-mono text-[#4ADE80] font-bold tabular-nums">
                {activeCityData.averageGrowth}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              {activeCityData.name}
            </h2>

            <p className="text-xs sm:text-sm text-[#C9A227] font-semibold">
              {activeCityData.tagline}
            </p>

            <p className="text-xs sm:text-sm text-[#B0B0B0] leading-relaxed">
              {activeCityData.description}
            </p>

            {/* Highlights */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7A7A] block">
                Pontos de Destaque:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {activeCityData.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-[#E0E0E0]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onOpenCuratedModal}
                className="px-6 py-3 rounded-xl bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                Solicitar Imóveis em {activeCityData.name}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video lg:aspect-[4/3] shadow-2xl relative">
              <img
                src={activeCityData.image}
                alt={activeCityData.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-xs font-bold text-white bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10">
                {activeCityData.name} · Sul de SC
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties in this city */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-2xl font-serif font-bold text-white">
            Imóveis Disponíveis em {activeCityData.name} ({cityProperties.length})
          </h3>
          <span className="text-xs text-[#A0A0A0]">
            Atualizado em tempo real
          </span>
        </div>

        {cityProperties.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#141414] rounded-3xl border border-white/10">
            <Building className="w-10 h-10 text-[#C9A227] mx-auto opacity-40" />
            <h4 className="text-base font-bold text-white">Novas unidades em captação nesta cidade</h4>
            <p className="text-xs text-[#A0A0A0] max-w-md mx-auto">
              Contate o corretor Daniel Pacheco no WhatsApp para receber opções off-market em {activeCityData.name}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {cityProperties.map((prop, idx) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                settings={settings}
                onSelect={onSelectProperty}
                priority={idx < 3}
                isFavorite={isFavorite ? isFavorite(prop.id) : false}
                onToggleFavorite={onToggleFavorite}
                isCompared={compareList.some((c) => c.id === prop.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
