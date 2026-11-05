import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MessageCircle, 
  Menu, 
  X, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Heart
} from 'lucide-react';
import { SiteSettings } from '../types';
import { createWhatsAppUrl } from '../utils/formatters';
import { SocialMediaBar } from './SocialLinks';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
  settings: SiteSettings;
  onOpenCuratedModal: () => void;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  navigate,
  settings,
  onOpenCuratedModal,
  favoritesCount = 0,
  onOpenFavorites,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', route: 'home' },
    { label: 'Imóveis', route: 'portfolio' },
    { label: 'Na Planta', route: 'na-planta' },
    { label: 'Prontos', route: 'prontos' },
    { label: 'Terrenos', route: 'terrenos' },
    { label: 'Cidades', route: 'cidades' },
    { label: 'Sobre', route: 'sobre' },
    { label: 'Como Escolher', route: 'como-escolher' },
    { label: 'Contato', route: 'contato' },
  ];

  const handleNavClick = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappMessage = 'Olá Daniel Pacheco! Gostaria de uma assessoria imobiliária personalizada no Sul de Santa Catarina.';
  const whatsappUrl = createWhatsAppUrl(settings.whatsapp || '5548998001744', whatsappMessage);

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'h-16 bg-[#F4EFE6] backdrop-blur-xl border-b border-[#E2DBD0] shadow-md flex items-center'
            : 'h-20 bg-[#F4EFE6] backdrop-blur-md border-b border-[#E2DBD0] shadow-sm flex items-center'
        }`}
      >
        <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-6 lg:gap-10">
          {/* Logo & Realtor Identity */}
          <button
            id="header-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left group transition-all cursor-pointer py-1 shrink-0 mr-4 lg:mr-6"
            title="Daniel Pacheco Consultoria Imobiliária - Início"
          >
            <img
              src={settings.logoUrl || "https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png"}
              alt="Daniel Pacheco Consultoria Imobiliária Logo Oficial"
              className="h-10 sm:h-12 w-auto max-w-[180px] sm:max-w-[220px] object-contain group-hover:scale-105 transition-all duration-300 filter brightness-0 drop-shadow-[0_2px_14px_rgba(201,162,39,0.4)]"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[11px] uppercase tracking-widest font-semibold">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  id={`nav-link-${link.route}`}
                  onClick={() => handleNavClick(link.route)}
                  className={`py-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 relative font-semibold ${
                    isActive
                      ? 'text-[#C9A227] font-bold'
                      : 'text-[#111111] hover:text-[#C9A227]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A227] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Favorites Icon Button */}
            {onOpenFavorites && (
              <button
                onClick={onOpenFavorites}
                className="relative p-2.5 rounded-full bg-[#F4EFE6] hover:bg-[#EAE4D8] text-[#111111] border border-[#E5E0D8] transition-colors cursor-pointer flex items-center justify-center shadow-xs"
                title="Ver imóveis favoritados"
              >
                <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-[#C9A227] text-[#C9A227]' : 'text-[#555555]'}`} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C9A227] text-[#0A0A0A] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono shadow-sm">
                    {favoritesCount}
                  </span>
                )}
              </button>
            )}

            {/* VIP Consulting */}
            <button
              id="header-curated-btn"
              onClick={onOpenCuratedModal}
              className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#0A0A0A] bg-[#C9A227]/20 border border-[#C9A227] hover:bg-[#C9A227] hover:text-[#0A0A0A] rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Consultoria VIP</span>
            </button>

            {/* WhatsApp */}
            <a
              id="header-whatsapp-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1F8A4C] hover:bg-[#197A42] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg hover:shadow-[#1F8A4C]/25 whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {onOpenFavorites && (
              <button
                onClick={onOpenFavorites}
                className="relative p-2 bg-white/5 text-white rounded-lg border border-white/10 cursor-pointer"
                title="Favoritos"
              >
                <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-[#C9A227] text-[#C9A227]' : ''}`} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C9A227] text-[#0A0A0A] font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono">
                    {favoritesCount}
                  </span>
                )}
              </button>
            )}

            <a
              id="header-mobile-whatsapp-icon"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#1F8A4C] text-white hover:bg-[#197A42] rounded-lg transition-colors"
              title="Falar no WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </a>

            <button
              id="header-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#111111] hover:text-[#C9A227] rounded-lg bg-[#F4EFE6] border border-[#E5E0D8] transition-colors cursor-pointer"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#FFFFFF]/98 backdrop-blur-2xl lg:hidden flex flex-col justify-between p-6 animate-in slide-in-from-top-4 duration-300 text-[#111111]">
          <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-4">
            <img
              src={settings.logoUrl || "https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png"}
              alt="Daniel Pacheco Logo"
              className="h-9 w-auto max-w-[160px] object-contain filter brightness-0"
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full bg-[#F4EFE6] text-[#111111]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-3 py-6 overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`p-3 rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-[#C9A227]/20 text-[#0A0A0A] font-bold border border-[#C9A227]'
                      : 'text-[#333333] hover:bg-[#F4EFE6]'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              );
            })}
          </nav>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCuratedModal();
              }}
              className="w-full py-3 bg-[#C9A227] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Solicitar Consultoria VIP</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#1F8A4C] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chamar no WhatsApp Oficial</span>
            </a>

            <div className="text-center pt-2 text-[11px] text-[#7A7A7A]">
              Daniel Pacheco • CRECI 38.813 • CNAI 34.653
            </div>
          </div>
        </div>
      )}
    </>
  );
};
