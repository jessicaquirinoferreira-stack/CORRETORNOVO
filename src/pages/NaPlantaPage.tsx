import React from 'react';
import { Sparkles, TrendingUp, ShieldCheck, Calculator, ArrowRight, Building2, Calendar } from 'lucide-react';
import { Property, SiteSettings } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { createWhatsAppUrl } from '../utils/formatters';

interface NaPlantaPageProps {
  properties: Property[];
  settings: SiteSettings;
  onSelectProperty: (property: Property) => void;
  onOpenCuratedModal: () => void;
  isFavorite?: (id: string) => boolean;
  onToggleFavorite?: (id: string) => void;
  compareList?: Property[];
  onToggleCompare?: (property: Property) => void;
}

export const NaPlantaPage: React.FC<NaPlantaPageProps> = ({
  properties,
  settings,
  onSelectProperty,
  onOpenCuratedModal,
  isFavorite,
  onToggleFavorite,
  compareList = [],
  onToggleCompare,
}) => {
  const naPlantaProperties = properties.filter(
    (p) => (p.status === 'Na planta' || p.status === 'Em obras') && p.type !== 'Casa'
  );

  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel! Gostaria de conhecer os lançamentos na planta com financiamento direto da construtora no Sul de SC.'
  );

  return (
    <div id="na-planta-page" className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 text-white">
      {/* Header Banner */}
      <div className="relative bg-[#141414] border border-white/10 rounded-3xl p-8 sm:p-14 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F8A4C]/15 border border-[#1F8A4C]/40 text-xs text-[#4ADE80] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lançamentos Oficiais & Obras em Andamento</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white">
            Apartamentos na Planta no Sul de Santa Catarina
          </h1>

          <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed font-light">
            Adquira seu imóvel com preço de lançamento e parcelamento direto com a construtora sem as taxas e burocracia dos bancos tradicionais.
          </p>

          <div className="pt-3 flex flex-wrap gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#1F8A4C] hover:bg-[#197A42] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Receber Tabela de Lançamento no WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenCuratedModal}
              className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white hover:text-[#C9A227] transition-all cursor-pointer"
            >
              Simular Entrada e Parcelamento
            </button>
          </div>
        </div>
      </div>

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 sm:p-7 rounded-3xl bg-[#141414] border border-white/10 shadow-xl space-y-3 hover:border-[#C9A227]/40 transition-colors">
          <div className="p-3 rounded-2xl bg-[#1F8A4C]/15 text-[#4ADE80] w-fit">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-serif">Valorização de 20% a 40%</h3>
          <p className="text-xs text-[#A0A0A0] leading-relaxed">
            Comprar no início da obra assegura o menor preço por metro quadrado e garante rentabilidade expressiva até a entrega das chaves.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-[#141414] border border-white/10 shadow-xl space-y-3 hover:border-[#C9A227]/40 transition-colors">
          <div className="p-3 rounded-2xl bg-[#C9A227]/15 text-[#C9A227] w-fit">
            <Calculator className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-serif">Financiamento Direto Facilitado</h3>
          <p className="text-xs text-[#A0A0A0] leading-relaxed">
            Pague em até 72x direto com a construtora, ajustando o valor de parcelas mensais, balões anuais e chaves conforme seu fluxo de caixa.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-[#141414] border border-white/10 shadow-xl space-y-3 hover:border-[#C9A227]/40 transition-colors">
          <div className="p-3 rounded-2xl bg-[#C9A227]/15 text-[#C9A227] w-fit">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-serif">Segurança Jurídica & R.I.</h3>
          <p className="text-xs text-[#A0A0A0] leading-relaxed">
            Trabalhamos exclusivamente com construtoras consolidadas que possuem Registro de Incorporação (R.I.) averbado em cartório e patrimônio de afetação.
          </p>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl font-serif font-bold text-white">
            Empreendimentos na Planta ({naPlantaProperties.length})
          </h2>
          <span className="text-xs text-[#A0A0A0]">
            Criciúma, Balneário Rincão e região
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {naPlantaProperties.map((prop, idx) => (
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
