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
}

export const ImoveisProntosPage: React.FC<ImoveisProntosPageProps> = ({
  properties,
  settings,
  onSelectProperty,
  onOpenCuratedModal,
}) => {
  const readyProperties = properties.filter((p) => p.status === 'Pronto');

  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel Pacheco! Gostaria de agendar visitas para imóveis prontos para morar no Sul de SC.'
  );

  return (
    <div id="imoveis-prontos-page" className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header Banner */}
      <div className="relative bg-[#0A0A0A] border border-[#2A2A2A] rounded-3xl p-8 sm:p-14 overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F8A4C]/15 border border-[#1F8A4C]/40 text-xs text-[#1F8A4C] font-semibold">
            <Key className="w-3.5 h-3.5" />
            <span>Chaves na Mão • Mudança Imediata</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#FFFFFF]">
            Imóveis Prontos para Morar no Sul de SC
          </h1>

          <p className="text-sm sm:text-base text-[#8A8A8A] leading-relaxed font-light">
            Casas residenciais com quintal, apartamentos centrais com 2 ou mais vagas de garagem e opções mobiliadas em Criciúma, Balneário Rincão, Nova Veneza e região.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#1F8A4C] hover:bg-[#197A42] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Agendar Visitas Imediatas com Daniel</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenCuratedModal}
              className="px-6 py-3.5 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] text-xs font-semibold text-[#FFFFFF] hover:text-[#C9A227] transition-all cursor-pointer"
            >
              Buscar por Bairro ou Faixa de Preço
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider">
              Disponibilidade Imediata
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#111111]">
              Apartamentos e Casas Prontas
            </h2>
          </div>
          <span className="text-xs text-[#5A5A5A]">{readyProperties.length} imóveis prontos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {readyProperties.map((prop, idx) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              settings={settings}
              onSelect={onSelectProperty}
              priority={idx < 3}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
