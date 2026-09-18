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
}

export const TerrenosPage: React.FC<TerrenosPageProps> = ({
  properties,
  settings,
  onSelectProperty,
  onOpenCuratedModal,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('Todas');

  // Filter terrenos and loteamentos
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
    'Olá Daniel! Gostaria de consultar os Lotes e Terrenos disponíveis com financiamento direto em até 120x pela variação do CUB ou até 240 vezes com correções.'
  );

  return (
    <div id="terrenos-page" className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header Banner */}
      <div className="relative bg-[#0A0A0A] border border-[#2A2A2A] rounded-3xl p-8 sm:p-14 overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 text-xs text-[#C9A227] font-semibold">
            <Trees className="w-3.5 h-3.5" />
            <span>Loteamentos Oficiais & Terrenos Escriturados</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#FFFFFF]">
            Terrenos e Loteamentos no Sul de Santa Catarina
          </h1>

          <p className="text-sm sm:text-base text-[#8A8A8A] leading-relaxed font-light">
            Encontre o lote ideal para construir sua casa própria ou investir com alta taxa de valorização. Loteamentos com infraestrutura completa e parcelamento direto com a loteadora em <strong className="text-white">até 120 vezes pela variação do CUB</strong>, ou em <strong className="text-white">até 240 vezes com correções</strong>, sem burocracia bancária.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#1F8A4C] hover:bg-[#197A42] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Consultar Tabela de Lotes no WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenCuratedModal}
              className="px-6 py-3.5 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] text-xs font-semibold text-[#FFFFFF] hover:text-[#C9A227] transition-all cursor-pointer"
            >
              Simular Parcelamento em até 120x ou 240x
            </button>
          </div>
        </div>
      </div>

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm space-y-3">
          <div className="p-3 rounded-2xl bg-[#C9A227]/10 text-[#C9A227] w-fit">
            <Calculator className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#111111]">Até 120x (CUB) ou até 240x Direto</h3>
          <p className="text-xs text-[#5A5A5A] leading-relaxed">
            Condições flexíveis: parcele em até 120 vezes pela variação do CUB ou em até 240 vezes com correções monetárias, diretamente com as loteadoras parceiras e sem intermediários.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm space-y-3">
          <div className="p-3 rounded-2xl bg-[#1F8A4C]/10 text-[#1F8A4C] w-fit">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#111111]">Infraestrutura Completa</h3>
          <p className="text-xs text-[#5A5A5A] leading-relaxed">
            Rede de energia elétrica, abastecimento de água tratada, ruas pavimentadas, iluminação pública e drenagem pluvial prontos para construir.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm space-y-3">
          <div className="p-3 rounded-2xl bg-[#C9A227]/10 text-[#C9A227] w-fit">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#111111]">Segurança Jurídica & R.I.</h3>
          <p className="text-xs text-[#5A5A5A] leading-relaxed">
            Loteamentos devidamente aprovados pelos órgãos municipais e registrados no Registro Geral de Imóveis (RGI), garantindo escritura pública individualizada.
          </p>
        </div>
      </div>

      {/* City Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs text-[#5A5A5A] font-semibold whitespace-nowrap flex items-center gap-1.5 mr-2">
          <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
          Filtrar por Município:
        </span>
        <button
          onClick={() => setSelectedCity('Todas')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCity === 'Todas'
              ? 'bg-[#0A0A0A] text-[#C9A227] shadow-sm'
              : 'bg-white border border-[#E5E0D8] text-[#5A5A5A] hover:text-[#111111]'
          }`}
        >
          Todos os Municípios ({terrenosProperties.length})
        </button>
        {citiesList.map((city) => {
          const count = terrenosProperties.filter((p) => p.city.toLowerCase() === city.toLowerCase()).length;
          return (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCity === city
                  ? 'bg-[#0A0A0A] text-[#C9A227] shadow-sm'
                  : 'bg-white border border-[#E5E0D8] text-[#5A5A5A] hover:text-[#111111]'
              }`}
            >
              {city} ({count})
            </button>
          );
        })}
      </div>

      {/* Properties Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider">
              Loteamentos Selecionados
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#111111]">
              Lotes e Terrenos Disponíveis
            </h2>
          </div>
          <span className="text-xs text-[#5A5A5A]">{filteredTerrenos.length} opções disponíveis</span>
        </div>

        {filteredTerrenos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTerrenos.map((prop, idx) => (
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
          <div className="text-center py-16 bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-8 space-y-3">
            <Trees className="w-10 h-10 text-[#8A8A8A] mx-auto" />
            <h3 className="text-lg font-bold text-[#111111]">Nenhum loteamento encontrado para este filtro</h3>
            <p className="text-xs text-[#5A5A5A]">
              Entre em contato diretamente com Daniel Pacheco para receber novidades sobre novos lançamentos de loteamentos na região.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
