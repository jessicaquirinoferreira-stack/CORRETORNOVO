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
}

export const CidadesPage: React.FC<CidadesPageProps> = ({
  properties,
  settings,
  onSelectProperty,
  onOpenCuratedModal,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('Criciúma (sede)');

  const activeCityData = CITIES_DATA.find((c) => c.name.toLowerCase() === selectedCity.toLowerCase()) || CITIES_DATA[0];

  const cleanSelectedCity = selectedCity.replace(/\s*\(sede\)/i, '').trim().toLowerCase();

  const cityProperties = properties.filter((p) => {
    const pCity = (p.city || '').toLowerCase();
    return pCity.includes(cleanSelectedCity) || cleanSelectedCity.includes(pCity);
  });

  return (
    <div id="cidades-page" className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E5E0D8] text-xs text-[#C9A227] shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Região da AMREC • Sul Catarinense</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#111111]">
          Cidades Atendidas
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed">
          {AMREC_DESCRIPTION} Conheça os diferenciais e oportunidades imobiliárias em cada município atendido com assessoria direta do corretor Daniel Pacheco.
        </p>
      </div>

      {/* AMREC 12 Municipalities Information Bar */}
      <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E5E0D8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5A5A5A]">
        <div className="flex items-center gap-2 font-semibold text-[#111111]">
          <Compass className="w-4 h-4 text-[#C9A227] shrink-0" />
          <span>AMREC — Associação dos Municípios da Região Carbonífera (12 Municípios)</span>
        </div>
        <span className="text-[11px] text-[#8A8A8A] bg-white px-3 py-1 rounded-full border border-[#E5E0D8]">
          Atendimento Oficial no Sul de SC
        </span>
      </div>

      {/* City Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 justify-start scrollbar-thin">
        {CITIES_DATA.map((city) => (
          <button
            key={city.id}
            onClick={() => setSelectedCity(city.name)}
            className={`px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
              selectedCity.toLowerCase() === city.name.toLowerCase()
                ? 'bg-[#0A0A0A] text-[#C9A227] shadow-md scale-105 font-bold border border-[#C9A227]'
                : 'bg-[#FFFFFF] text-[#5A5A5A] hover:text-[#111111] hover:bg-[#F0EBE1] border border-[#E5E0D8] font-medium'
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Selected City Detail Card */}
      <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-3xl p-8 sm:p-12 overflow-hidden relative shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-[#C9A227] font-semibold">
                Guia Regional
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1F8A4C]/15 text-[#1F8A4C] border border-[#1F8A4C]/30 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Valorização {activeCityData.averageGrowth}</span>
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-[#FFFFFF]">
              {activeCityData.name}
            </h2>

            <p className="text-sm font-medium text-[#C9A227]">
              {activeCityData.tagline}
            </p>

            <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed font-light">
              {activeCityData.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {activeCityData.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#FFFFFF]">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={onOpenCuratedModal}
                className="px-5 py-3 rounded-xl bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold text-xs transition-colors cursor-pointer"
              >
                Solicitar Oportunidades em {activeCityData.name}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] border border-[#2A2A2A] shadow-xl">
              <img
                src={getOptimizedImageUrl(activeCityData.image, 'hero')}
                alt={activeCityData.name}
                decoding="async"
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Properties in this City */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider">
              Acervo Local
            </span>
            <h3 className="text-2xl font-bold font-serif-luxury text-[#111111]">
              Imóveis Disponíveis em {activeCityData.name}
            </h3>
          </div>
          <span className="text-xs text-[#5A5A5A]">{cityProperties.length} imóveis encontrados</span>
        </div>

        {cityProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityProperties.map((prop, idx) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                settings={settings}
                onSelect={onSelectProperty}
                priority={idx < 3}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl p-6 text-xs text-[#5A5A5A]">
            Nenhum imóvel listado publicamente para {activeCityData.name} no momento. Fale com Daniel para opções off-market.
          </div>
        )}
      </div>
    </div>
  );
};
