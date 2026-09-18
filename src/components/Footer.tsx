import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Instagram, 
  MessageCircle, 
  Shield, 
  Lock, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  FileText
} from 'lucide-react';
import { SiteSettings } from '../types';
import { createWhatsAppUrl } from '../utils/formatters';
import { EconomicIndicatorsModal, IndicatorTab } from './EconomicIndicatorsModal';
import { SocialMediaBar } from './SocialLinks';

interface FooterProps {
  navigate: (route: string) => void;
  settings: SiteSettings;
  isAdmin?: boolean;
  onLogoutAdmin?: () => void;
  onOpenCuratedModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  navigate,
  settings,
  isAdmin = false,
  onLogoutAdmin = () => {},
}) => {
  const [isIndicatorsModalOpen, setIsIndicatorsModalOpen] = useState<boolean>(false);
  const [indicatorsInitialTab, setIndicatorsInitialTab] = useState<IndicatorTab>('cub');

  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel! Estava no seu site e gostaria de tirar uma dúvida.'
  );

  const handleLink = (route: string) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenIndicators = (tab: IndicatorTab) => {
    setIndicatorsInitialTab(tab);
    setIsIndicatorsModalOpen(true);
  };

  return (
    <footer id="main-footer" className="bg-[#0A0A0A] text-[#8A8A8A] border-t border-[#2A2A2A] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 xl:gap-10 pb-12 border-b border-[#2A2A2A]">
          {/* Column 1: Brand & Profile */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex flex-col gap-2.5">
              <img
                src={settings.logoUrl || "https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png"}
                alt="Daniel Pacheco Consultoria Imobiliária Logo Oficial"
                className="h-14 sm:h-16 w-auto max-w-[230px] object-contain filter drop-shadow-[0_2px_12px_rgba(201,162,39,0.25)]"
              />
              <p className="text-xs text-[#C9A227] font-semibold tracking-wider">
                {settings.creci || 'CRECI-38.813'} • {settings.cnai || 'CNAI 34.653'}
              </p>
            </div>
            <p className="text-xs leading-relaxed text-[#8A8A8A]">
              Consultoria imobiliária especializada em lançamentos na planta, empreendimentos oficiais e imóveis selecionados no Sul de Santa Catarina.
            </p>
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">
                Redes Sociais & Contato
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  id="footer-whatsapp-icon-btn"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#181818] border border-[#2A2A2A] text-[#1F8A4C] flex items-center justify-center hover:bg-[#1F8A4C] hover:text-white transition-all hover:scale-110 shadow-sm"
                  title="WhatsApp Direto"
                  aria-label="Falar no WhatsApp com Daniel Pacheco"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                </a>
                <SocialMediaBar settings={settings} variant="footer" />
              </div>
            </div>
          </div>

          {/* Column 2: Navigation & Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  id="footer-nav-home"
                  onClick={() => handleLink('home')}
                  className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-[#5A5A5A] shrink-0" />
                  <span>Página Inicial</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-portfolio"
                  onClick={() => handleLink('portfolio')}
                  className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-[#5A5A5A] shrink-0" />
                  <span>Todos os Imóveis</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-na-planta"
                  onClick={() => handleLink('na-planta')}
                  className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-[#5A5A5A] shrink-0" />
                  <span>Apartamentos na Planta</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-prontos"
                  onClick={() => handleLink('prontos')}
                  className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-[#5A5A5A] shrink-0" />
                  <span>Imóveis Prontos para Morar</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-terrenos"
                  onClick={() => handleLink('terrenos')}
                  className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-[#5A5A5A] shrink-0" />
                  <span>Terrenos & Loteamentos</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-sobre"
                  onClick={() => handleLink('sobre')}
                  className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-[#5A5A5A] shrink-0" />
                  <span>Sobre o Corretor Daniel</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-como-escolher"
                  onClick={() => handleLink('como-escolher')}
                  className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-[#5A5A5A] shrink-0" />
                  <span>Guia: Como Escolher</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: AMREC 12 Municipalities */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-1.5">
              <span>Região AMREC (12 Cidades)</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  id="footer-city-criciuma"
                  onClick={() => handleLink('cidades')}
                  className="hover:text-[#C9A227] transition-colors text-left cursor-pointer"
                >
                  Criciúma (sede)
                </button>
              </li>
              <li>
                <button
                  id="footer-city-rincao"
                  onClick={() => handleLink('cidades')}
                  className="hover:text-[#C9A227] transition-colors text-left cursor-pointer"
                >
                  Balneário Rincão & Lagoas
                </button>
              </li>
              <li>
                <button
                  id="footer-city-icara"
                  onClick={() => handleLink('cidades')}
                  className="hover:text-[#C9A227] transition-colors text-left cursor-pointer"
                >
                  Içara (Loteamentos & Casas)
                </button>
              </li>
              <li>
                <button
                  id="footer-city-novaveneza"
                  onClick={() => handleLink('cidades')}
                  className="hover:text-[#C9A227] transition-colors text-left cursor-pointer"
                >
                  Nova Veneza (Gastronomia)
                </button>
              </li>
              <li>
                <button
                  id="footer-city-others"
                  onClick={() => handleLink('cidades')}
                  className="hover:text-[#C9A227] transition-colors text-left cursor-pointer text-[11px] text-[#A0A0A0]"
                >
                  + Forquilhinha, Cocal do Sul, Lauro Müller, Morro da Fumaça, Orleans, Siderópolis, Treviso e Urussanga
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Indicadores da Construção e Economia */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Indicadores & Economia</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              {/* CUB – Santa Catarina */}
              <li>
                <div className="group flex flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <button
                      id="footer-indicator-cub-btn"
                      onClick={() => handleOpenIndicators('cub')}
                      className="hover:text-[#C9A227] text-gray-200 transition-colors flex items-center gap-1.5 text-left font-medium cursor-pointer"
                      title="Consultar CUB – Santa Catarina (Sinduscon Florianópolis)"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                      <span>CUB – Santa Catarina</span>
                    </button>
                    <a
                      id="footer-cub-ext-link"
                      href="https://sinduscon-fpolis.org.br/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#C9A227] p-1 transition-colors"
                      title="Abrir site oficial do Sinduscon Florianópolis em nova aba"
                      aria-label="Abrir site oficial do Sinduscon Florianópolis"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <span className="text-[10px] text-[#7A7A7A] pl-5">
                    Sinduscon Florianópolis (Oficial)
                  </span>
                </div>
              </li>

              {/* IGP-M – Índice Geral de Preços – Mercado */}
              <li>
                <div className="group flex flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <button
                      id="footer-indicator-igpm-btn"
                      onClick={() => handleOpenIndicators('igpm')}
                      className="hover:text-[#C9A227] text-gray-200 transition-colors flex items-center gap-1.5 text-left font-medium cursor-pointer"
                      title="Consultar IGP-M – Índice Geral de Preços – Mercado (FGV IBRE)"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                      <span>IGP-M – Mercado</span>
                    </button>
                    <a
                      id="footer-igpm-ext-link"
                      href="https://portalibre.fgv.br/temas-de-estudo/indices-e-indicadores/igp-m"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#C9A227] p-1 transition-colors"
                      title="Abrir portal oficial FGV IBRE em nova aba"
                      aria-label="Abrir portal oficial FGV IBRE"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <span className="text-[10px] text-[#7A7A7A] pl-5">
                    FGV IBRE / Mercado Imobiliário
                  </span>
                </div>
              </li>
            </ul>
            <p className="text-[10px] text-[#6A6A6A] leading-relaxed pt-1 border-t border-[#222222]">
              Referências oficiais para reajuste de contratos e custos da construção civil.
            </p>
          </div>

          {/* Column 5: Contact & Business Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider">
              Atendimento Consultivo
            </h4>
            <div className="space-y-3 text-xs text-[#8A8A8A]">
              <div className="space-y-1">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#FFFFFF] font-medium block">Endereço:</span>
                    <span className="text-[#A3A3A3] leading-relaxed block">
                      {settings.address || 'Rua Marcelo Lodetti 55 Condominio Ed. Florença - Criciúma - SC, 88801-510'}
                    </span>
                    <span className="text-[11px] text-[#C9A227] font-medium block mt-0.5">
                      (Atendimento somente sob agendamento)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <div>
                  <span className="text-[#FFFFFF] font-medium mr-1">Telefone:</span>
                  <a
                    href="tel:48998001744"
                    className="text-[#A3A3A3] hover:text-[#C9A227] transition-colors font-medium"
                  >
                    {settings.phone || '(48) 99800-1744'}
                  </a>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#222222]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                  <span className="text-[#FFFFFF] font-medium">Horário de funcionamento:</span>
                </div>
                <div className="space-y-0.5 text-[11px] pl-5.5">
                  <div className="flex justify-between py-0.5 border-b border-[#1A1A1A]">
                    <span className="text-[#9A9A9A]">segunda-feira</span>
                    <span className="text-[#D4D4D4] font-medium">08:00–18:00</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#1A1A1A]">
                    <span className="text-[#9A9A9A]">terça-feira</span>
                    <span className="text-[#D4D4D4] font-medium">08:00–18:00</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#1A1A1A]">
                    <span className="text-[#9A9A9A]">quarta-feira</span>
                    <span className="text-[#D4D4D4] font-medium">08:00–18:00</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#1A1A1A]">
                    <span className="text-[#9A9A9A]">quinta-feira</span>
                    <span className="text-[#D4D4D4] font-medium">08:00–18:00</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#1A1A1A]">
                    <span className="text-[#9A9A9A]">sexta-feira</span>
                    <span className="text-[#D4D4D4] font-medium">08:00–18:00</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#1A1A1A]">
                    <span className="text-[#666666]">sábado</span>
                    <span className="text-[#888888]">Fechado</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#666666]">domingo</span>
                    <span className="text-[#888888]">Fechado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Admin Link & Legal Info */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#8A8A8A]">
          <div className="flex items-center gap-6 flex-wrap justify-center sm:justify-start">
            <span>© {new Date().getFullYear()} Daniel Pacheco Consultoria. Todos os direitos reservados.</span>
            <button
              id="footer-terms-btn"
              onClick={() => handleLink('termos-de-uso')}
              className="hover:text-white hover:underline transition-colors cursor-pointer"
            >
              Termos de Uso
            </button>
            <button
              id="footer-privacy-btn"
              onClick={() => handleLink('politica-de-privacidade')}
              className="hover:text-white hover:underline transition-colors cursor-pointer"
            >
              Política de Privacidade
            </button>
            <button
              id="footer-cookie-policy-btn"
              onClick={() => handleLink('cookie-policy')}
              className="hover:text-white hover:underline transition-colors cursor-pointer"
            >
              Política de Cookies
            </button>
            <button
              id="footer-sitemap-btn"
              onClick={() => handleLink('mapa-do-site')}
              className="hover:text-white hover:underline transition-colors cursor-pointer"
            >
              Mapa do Site
            </button>
            <button
              id="footer-replay-intro-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('dp_replay_intro'))}
              className="hover:text-[#C9A227] text-[#C9A227]/90 transition-colors cursor-pointer flex items-center gap-1"
              title="Reproduzir a animação cinematográfica de 6 segundos"
            >
              <span>✦ Rever Abertura (6s)</span>
            </button>
          </div>

          {/* Socials & Admin Link in the footer */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-xs">
              <a 
                href={settings.instagram || "https://instagram.com"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#C9A227] cursor-pointer transition-colors"
                title="Instagram"
              >
                IG
              </a>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#C9A227] cursor-pointer transition-colors"
                title="WhatsApp"
              >
                WA
              </a>
              <span className="hover:text-[#C9A227] cursor-pointer transition-colors">LI</span>
            </div>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  id="footer-admin-panel-btn"
                  onClick={() => handleLink('admin')}
                  className="px-2.5 py-1 rounded bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227]/20 flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Painel Admin</span>
                </button>
                <button
                  id="footer-admin-logout-btn"
                  onClick={onLogoutAdmin}
                  className="hover:text-[#FFFFFF] text-[10px] underline uppercase tracking-wider"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                id="footer-admin-login-btn"
                onClick={() => handleLink('admin')}
                className="opacity-40 hover:opacity-100 transition-opacity uppercase tracking-widest font-bold border border-white/20 px-3 py-1 text-[9px] text-[#8A8A8A] hover:text-white cursor-pointer"
                title="Acesso restrito para administração do site"
              >
                Área Admin
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Economic Indicators In-App Consultation Modal */}
      <EconomicIndicatorsModal
        isOpen={isIndicatorsModalOpen}
        onClose={() => setIsIndicatorsModalOpen(false)}
        initialTab={indicatorsInitialTab}
      />
    </footer>
  );
};

