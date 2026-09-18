import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('dp_cookies_accepted');
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('dp_cookies_accepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div 
      id="cookie-consent-banner"
      className="fixed bottom-6 left-6 z-50 bg-[#FFFFFF] border border-[#E5E0D8] p-4 rounded-xl shadow-xl max-w-[300px] text-[#111111] animate-in slide-in-from-bottom-3 duration-300"
    >
      <p className="text-[11px] mb-3 leading-relaxed text-[#5A5A5A]">
        Utilizamos cookies para melhorar sua experiência e oferecer uma consultoria personalizada. Saiba mais em nossa{' '}
        <a
          href="#cookie-policy"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = 'cookie-policy';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-[#C9A227] underline font-semibold hover:text-[#111111]"
        >
          Política de Cookies
        </a>
        .
      </p>
      <div className="flex items-center gap-2">
        <button
          id="cookie-accept-btn"
          onClick={handleAccept}
          className="bg-[#0A0A0A] text-[#FFFFFF] hover:bg-[#222222] px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-lg shadow-sm"
        >
          Aceitar todos
        </button>
        <button
          onClick={() => setVisible(false)}
          className="text-[#5A5A5A] hover:text-[#111111] px-2 py-1.5 text-[10px] font-medium uppercase tracking-wider transition-colors cursor-pointer"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
