import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { SiteSettings } from '../types';
import { createWhatsAppUrl } from '../utils/formatters';

interface WhatsAppFloatingButtonProps {
  settings: SiteSettings;
  onOpenCuratedModal: () => void;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  settings,
  onOpenCuratedModal,
}) => {
  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel Pacheco! Gostaria de conversar sobre as opções de imóveis disponíveis no Sul de Santa Catarina.'
  );

  return (
    <div className="fixed bottom-12 sm:bottom-14 right-4 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Floating Buttons Group */}
      <div className="flex items-center gap-3">
        {/* Consultoria VIP Quick button */}
        <button
          id="floating-vip-curation-btn"
          onClick={onOpenCuratedModal}
          className="hidden md:flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#0A0A0A] hover:bg-[#222222] border border-[#C9A227]/50 text-[#C9A227] text-xs font-semibold shadow-lg transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Consultoria Personalizada</span>
        </button>

        {/* WhatsApp Icon Button */}
        <a
          id="whatsapp-floating-main-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-14 h-14 rounded-full bg-[#1F8A4C] hover:bg-[#197A42] text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all group"
          title="Falar com Daniel Pacheco no WhatsApp"
        >
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-[#FFFFFF] rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-[#FFFFFF] rounded-full" />
          <MessageCircle className="w-7 h-7 fill-current" />
        </a>
      </div>
    </div>
  );
};
