import React, { useState, useMemo } from 'react';
import { Sparkles, Trees, CheckCircle2, ShieldCheck, Calculator, ArrowRight, MapPin } from 'lucide-react';
import { Property, SiteSettings } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { createWhatsAppUrl } from '../utils/formatters';

interface TerrenosPageProps {
  properties: Property[];
  settings: SiteSettings;
  onSelectProperty: (property: Property) => void;
  onOpenCuratedModal: () => void;
  isFavorite?: (id: string) => boolean;
  onToggleFavorite?: (id: string) => void;
  compareList?: Property[];
  onToggleCompare?: (property: Property) => void;
}

export const TerrenosPage: React.FC<TerrenosPageProps> = ({
  properties,
  settings,
  onSelectProperty,
  onOpenCuratedModal,
  isFavorite,
  onToggleFavorite,
  compareList = [],
  onToggleCompare,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('Todas');

  const terrenosProperties = useMemo(() => {
    return properties.filter(
      (p) => p.type === 'Lote/Terreno' || p.status === 'Loteamento' || p.title.toLowerCase().includes('lote') || p.title.toLowerCase().includes('terreno')
    );
  }, [properties]);

  const citiesList = useMemo(() => {
    return Array.from(new Set(terrenosProperties.map((p) => p.city))).filter(Boolean);
  }, [terrenosProperties]);

  const filteredTerrenos = useMemo(() => {
    if (selectedCity === 'Todas') return terrenosProperties;
    return terrenosProperties.filter((p) => p.city.toLowerCase() === selectedCity.toLowerCase());
  }, [terrenosProperties, selectedCity]);

  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel! Gostaria de consultar os Lotes e Terrenos disponíveis com financiamento direto em até 120x pelo CUB ou até 240x.'
  );

  return (
    <div id="terrenos-page" className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 text-white">
      {/* Header Banner */}
      <div className="relative bg-[#141414] border border-white/10 rounded-3xl p-8 sm:p-14 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 text-xs text-[#C9A227] font-semibold">
            <Trees className="w-3.5 h-3.5" />
            <span>Loteamentos Oficiais & Terrenos Escriturados</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white">
            Terrenos e Loteamentos no Sul de Santa Catarina
          </h1>

          <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed font-light">
            Encontre o lote ideal para construir sua casa própria ou investir com alta taxa de valorização. Loteamentos com infraestrutura completa e parcelamento direto com a loteadora em <strong className="text-white">até 120 vezes pela variação do CUB</strong> ou em <strong className="text-white">até 240 vezes</strong> sem burocracia bancária.
          </p>

          <div className="pt-3 flex flex-wrap gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#1F8A4C] hover:bg-[#197A42] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Consultar Tabela de Lotes no WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenCuratedModal}
              className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white hover:text-[#C9A227] transition-all cursor-pointer"
            >
              Simular Parcelamento em até 120x ou 240x
            </button>
          </div>
        </div>
      </div>

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 sm:p-7 rounded-3xl bg-[#141414] border border-white/10 shadow-xl space-y-3 hover:border-[#C9A227]/40 transition-colors">
          <div className="p-3 rounded-2xl bg-[#C9A227]/15 text-[#C9A227] w-fit">
            <Calculator className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-serif">Até 120x (CUB) ou 240x Direto</h3>
          <p className="text-xs text-[#A0A0A0] leading-relaxed">
            Condições flexíveis: parcele em até 120 vezes pela variação do CUB ou em até 240 vezes com correções monetárias, diretamente com as loteadoras parceiras e sem burocracia bancária.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-[#141414] border border-white/10 shadow-xl space-y-3 hover:border-[#C9A227]/40 transition-colors">
          <div className="p-3 rounded-2xl bg-[#1F8A4C]/15 text-[#4ADE80] w-fit">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-serif">Infraestrutura Completa</h3>
          <p className="text-xs text-[#A0A0A0] leading-relaxed">
            Rede de energia elétrica, abastecimento de água tratada, ruas pavimentadas com asfalto ou lajota e drenagem pluvial prontos para construir.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-[#141414] border border-white/10 shadow-xl space-y-3 hover:border-[#C9A227]/40 transition-colors">
          <div className="p-3 rounded-2xl bg-[#C9A227]/15 text-[#C9A227] w-fit">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-serif">100% Escriturados & Legalizados</h3>
          <p className="text-xs text-[#A0A0A0] leading-relaxed">
            Loteamentos devidamente aprovados nos órgãos ambientais e prefeituras, com matrícula individualizada e garantia de segurança jurídica total.
          </p>
        </div>
      </div>

      {/* City Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        <span className="text-xs text-[#7A7A7A] uppercase tracking-wider font-semibold mr-2">
          Filtrar Cidade:
        </span>
        <button
          onClick={() => setSelectedCity('Todas')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            selectedCity === 'Todas'
              ? 'bg-[#C9A227] text-[#0A0A0A]'
              : 'bg-white/5 hover:bg-white/10 text-white/80'
          }`}
        >
          Todas ({terrenosProperties.length})
        </button>
        {citiesList.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              selectedCity.toLowerCase() === city.toLowerCase()
                ? 'bg-[#C9A227] text-[#0A0A0A]'
                : 'bg-white/5 hover:bg-white/10 text-white/80'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredTerrenos.map((prop, idx) => (
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
      </div>
    </div>
  );
};
