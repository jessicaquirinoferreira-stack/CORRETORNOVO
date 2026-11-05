import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { createWhatsAppUrl } from '../utils/formatters';

interface WhatsAppFloatingButtonProps {
  settings: SiteSettings;
  onOpenCuratedModal?: () => void;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  settings,
}) => {
  const [hoveredButton, setHoveredButton] = useState<'whatsapp' | 'instagram' | null>(null);

  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel Pacheco! Gostaria de conversar sobre as opções de imóveis disponíveis no Sul de Santa Catarina.'
  );

  const instagramUrl = settings.instagram || 'https://instagram.com/corretordanielpacheco';

  return (
    <div 
      id="floating-social-buttons" 
      className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto"
    >
      {/* 1. Official Instagram Floating Button */}
      <div className="relative flex items-center">
        {/* Tooltip Label */}
        {hoveredButton === 'instagram' && (
          <div className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-[#141414]/95 text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-right-2 duration-200">
            <span>Siga no Instagram</span>
            <span className="text-[#C9A227] ml-1 font-mono text-[11px]">@corretordanielpacheco</span>
          </div>
        )}

        <a
          id="instagram-floating-btn"
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredButton('instagram')}
          onMouseLeave={() => setHoveredButton(null)}
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer border border-white/20"
          title="Seguir Daniel Pacheco no Instagram"
          aria-label="Abrir Instagram oficial de Daniel Pacheco"
        >
          {/* Official Instagram SVG Icon */}
          <svg
            className="w-7 h-7 fill-white group-hover:rotate-6 transition-transform duration-300"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
      </div>

      {/* 2. Official WhatsApp Floating Button */}
      <div className="relative flex items-center">
        {/* Tooltip Label */}
        {hoveredButton === 'whatsapp' && (
          <div className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-[#141414]/95 text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-right-2 duration-200">
            <span>Conversar no WhatsApp</span>
            <span className="text-[#25D366] ml-1 font-mono text-[11px]">(48) 9 9800-1744</span>
          </div>
        )}

        <a
          id="whatsapp-floating-main-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredButton('whatsapp')}
          onMouseLeave={() => setHoveredButton(null)}
          className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer border border-white/20"
          title="Falar com Daniel Pacheco no WhatsApp"
          aria-label="Abrir conversa no WhatsApp oficial de Daniel Pacheco"
        >
          {/* Active online ping effect */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full shadow-sm" />

          {/* Official WhatsApp SVG Icon */}
          <svg
            className="w-8 h-8 fill-white group-hover:scale-105 transition-transform duration-300"
            viewBox="0 0 24 24"
          >
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.99.571 1.913.882 3.821.882 3.183 0 5.768-2.586 5.768-5.767 0-3.18-2.585-5.768-5.793-5.768zm3.364 8.163c-.14.394-.716.732-1.02.779-.276.043-.637.076-1.028-.05-.24-.077-.552-.19-1.037-.398-1.579-.68-2.613-2.28-2.693-2.387-.08-.107-.64-.852-.64-1.625 0-.773.407-1.153.552-1.309.145-.156.317-.195.423-.195.106 0 .212.001.304.006.097.005.228-.037.356.271.134.321.458 1.116.498 1.198.04.082.067.178.013.286-.053.107-.08.174-.16.267-.08.093-.168.208-.24.28-.08.08-.163.167-.07.327.094.16.417.688.895 1.114.615.548 1.133.718 1.293.798.16.08.254.071.348-.037.094-.107.4-.467.507-.627.107-.16.213-.133.36-.08.147.053.933.44 1.093.52.16.08.267.12.307.187.04.066.04.385-.1.779zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.178L2.05 22l4.975-1.304A9.954 9.954 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
          </svg>
        </a>
      </div>
    </div>
  );
};
