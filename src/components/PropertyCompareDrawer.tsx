import React, { useState } from 'react';
import { Property, SiteSettings } from '../types';
import { 
  X, 
  ArrowRight, 
  Check, 
  Minus, 
  Sparkles, 
  Scale, 
  Bed, 
  Bath, 
  Car, 
  Maximize, 
  Building2, 
  MapPin, 
  MessageCircle, 
  Landmark, 
  ShieldCheck 
} from 'lucide-react';
import { formatCurrency, createWhatsAppUrl } from '../utils/formatters';

interface PropertyCompareDrawerProps {
  compareList: Property[];
  onRemoveFromCompare: (propertyId: string) => void;
  onClearCompare: () => void;
  onSelectProperty: (property: Property) => void;
  settings: SiteSettings;
}

export const PropertyCompareDrawer: React.FC<PropertyCompareDrawerProps> = ({
  compareList,
  onRemoveFromCompare,
  onClearCompare,
  onSelectProperty,
  settings,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (compareList.length === 0) return null;

  const handleWhatsAppCompare = () => {
    const propertyCodes = compareList.map((p) => `${p.code} (${p.title})`).join(' vs ');
    const text = `Olá Daniel! Estou comparando os imóveis: ${propertyCodes}. Poderia me orientar sobre qual apresenta o melhor custo-benefício e fluxo de pagamento?`;
    const url = createWhatsAppUrl(settings.whatsapp || '5548998001744', text);
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Floating Bottom Dock / Pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-xl animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="luxury-glass bg-[#0A0A0A]/95 text-white border border-[#C9A227]/40 rounded-2xl p-3 sm:p-4 shadow-2xl flex items-center justify-between gap-3">
          {/* Thumbnails of compared items */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C9A227] shrink-0 mr-1">
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">Comparador:</span>
              <span className="font-mono bg-[#C9A227]/20 border border-[#C9A227]/30 text-[#C9A227] px-1.5 py-0.5 rounded text-[10px]">
                {compareList.length}/3
              </span>
            </div>

            <div className="flex items-center gap-2">
              {compareList.map((p) => (
                <div key={p.id} className="relative group shrink-0">
                  <div className="w-11 h-11 rounded-lg overflow-hidden border border-white/20 bg-black/50">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => onRemoveFromCompare(p.id)}
                    className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-700 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] shadow-sm cursor-pointer transition-transform group-hover:scale-110"
                    title="Remover da comparação"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClearCompare}
              className="text-[11px] text-[#A0A0A0] hover:text-white px-2 py-1 transition-colors cursor-pointer"
            >
              Limpar
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={compareList.length < 2}
              className="bg-[#C9A227] hover:bg-[#B8931F] disabled:opacity-40 text-[#0A0A0A] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <span>Comparar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative bg-[#121212] text-white border border-[#2A2A2A] w-full max-w-5xl rounded-3xl p-6 sm:p-8 shadow-2xl my-6 animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4 mb-6">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-[#C9A227]" />
                  Comparador Imobiliário de Alto Padrão
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Análise Lado a Lado
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-[#A0A0A0] hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4">
              {compareList.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-[#C9A227]/50 transition-colors"
                >
                  <div className="space-y-3">
                    {/* Image */}
                    <div 
                      onClick={() => {
                        setIsModalOpen(false);
                        onSelectProperty(item);
                      }}
                      className="relative aspect-video rounded-xl overflow-hidden bg-black/50 cursor-pointer group"
                    >
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 bg-[#C9A227] text-[#0A0A0A] text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                        {item.status}
                      </span>
                      <span className="absolute top-2 right-2 bg-black/80 text-white font-mono text-[9px] px-2 py-0.5 rounded border border-white/10">
                        Cód. {item.code}
                      </span>
                    </div>

                    {/* Title & Location */}
                    <div>
                      <h3 
                        onClick={() => {
                          setIsModalOpen(false);
                          onSelectProperty(item);
                        }}
                        className="font-bold text-base text-white hover:text-[#C9A227] cursor-pointer transition-colors line-clamp-1"
                      >
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#A0A0A0] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#C9A227]" />
                        <span>{item.neighborhood}, {item.city}</span>
                      </p>
                    </div>

                    {/* Price */}
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] uppercase tracking-wider text-[#A0A0A0] block">Valor Estimado</span>
                      <span className="text-lg font-bold font-serif text-[#C9A227] block tabular-nums">
                        {item.price ? formatCurrency(item.price) : 'Consulte Valor'}
                      </span>
                    </div>

                    {/* Specs Table */}
                    <div className="space-y-2 text-xs divide-y divide-white/5 pt-1">
                      <div className="flex justify-between py-1.5">
                        <span className="text-[#A0A0A0]">Área Privativa</span>
                        <span className="font-semibold text-white tabular-nums">{item.areaM2 ? `${item.areaM2} m²` : 'Sob Consulta'}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-[#A0A0A0]">Dormitórios</span>
                        <span className="font-semibold text-white">{item.bedrooms || '-'}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-[#A0A0A0]">Suítes</span>
                        <span className="font-semibold text-white">{item.suites || '-'}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-[#A0A0A0]">Vagas de Garagem</span>
                        <span className="font-semibold text-white">{item.garageSpots || '-'}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-[#A0A0A0]">Construtora</span>
                        <span className="font-semibold text-white truncate max-w-[140px]">{item.developer || 'Oficial'}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-[#A0A0A0]">Financiamento</span>
                        <span className="font-semibold text-[#1F8A4C]">
                          {item.directFinancing ? 'Direto Construtora' : item.bankFinancing ? 'Bancário' : 'À Vista / Negociável'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Property Actions */}
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        onSelectProperty(item);
                      }}
                      className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors text-center cursor-pointer"
                    >
                      Ver Detalhes do Imóvel
                    </button>
                    <button
                      onClick={() => onRemoveFromCompare(item.id)}
                      className="text-[11px] text-red-400 hover:text-red-300 py-1 transition-colors text-center cursor-pointer"
                    >
                      Remover da Comparação
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Modal CTA */}
            <div className="mt-6 pt-4 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#A0A0A0]">
                Deseja que o corretor <strong>Daniel Pacheco</strong> elabore um comparativo formal com fluxo de parcelamento para você?
              </p>
              <button
                onClick={handleWhatsAppCompare}
                className="bg-[#1F8A4C] hover:bg-[#197A42] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Pedir Análise no WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
