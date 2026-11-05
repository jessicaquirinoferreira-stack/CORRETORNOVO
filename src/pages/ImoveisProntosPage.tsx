import React from 'react';
import { Key, Sparkles, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Property, SiteSettings } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { createWhatsAppUrl } from '../utils/formatters';

interface ImoveisProntosPageProps {
  properties: Property[];
  settings: SiteSettings;
  onSelectProperty: (property: Property) => void;
  onOpenCuratedModal: () => void;
  isFavorite?: (id: string) => boolean;
  onToggleFavorite?: (id: string) => void;
  compareList?: Property[];
  onToggleCompare?: (property: Property) => void;
}

export const ImoveisProntosPage: React.FC<ImoveisProntosPageProps> = ({
  properties,
  settings,
  onSelectProperty,
  onOpenCuratedModal,
  isFavorite,
  onToggleFavorite,
  compareList = [],
  onToggleCompare,
}) => {
  const readyProperties = properties.filter((p) => p.status === 'Pronto');

  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel Pacheco! Gostaria de agendar visitas para imóveis prontos para morar no Sul de SC.'
  );

  return (
    <div id="imoveis-prontos-page" className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 text-white">
      {/* Header Banner */}
      <div className="relative bg-[#141414] border border-white/10 rounded-3xl p-8 sm:p-14 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F8A4C]/15 border border-[#1F8A4C]/40 text-xs text-[#4ADE80] font-semibold">
            <Key className="w-3.5 h-3.5" />
            <span>Chaves na Mão · Mudança Imediata</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white">
            Imóveis Prontos para Morar no Sul de SC
          </h1>

          <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed font-light">
            Casas residenciais com quintal, apartamentos centrais com 2 ou mais vagas de garagem e opções mobiliadas em Criciúma, Balneário Rincão, Nova Veneza e região.
          </p>

          <div className="pt-3 flex flex-wrap gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#1F8A4C] hover:bg-[#197A42] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Agendar Visita Imediata com Daniel</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenCuratedModal}
              className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white hover:text-[#C9A227] transition-all cursor-pointer"
            >
              Buscar por Bairro ou Faixa de Preço
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider block">
              Disponibilidade Imediata
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Apartamentos e Casas Prontas
            </h2>
          </div>
          <span className="text-xs text-[#A0A0A0] font-mono tabular-nums">{readyProperties.length} imóveis prontos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {readyProperties.map((prop, idx) => (
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
