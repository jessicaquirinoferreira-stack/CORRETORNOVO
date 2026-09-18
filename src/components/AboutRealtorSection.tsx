import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  MessageCircle, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  Users, 
  Star, 
  Compass, 
  Key, 
  ArrowRight 
} from 'lucide-react';
import { SiteSettings } from '../types';
import { createWhatsAppUrl } from '../utils/formatters';
import { SocialMediaBar } from './SocialLinks';

interface AboutRealtorSectionProps {
  settings: SiteSettings;
  onOpenCuratedModal?: () => void;
}

export const REALTOR_PHOTO_URL = 'https://i.postimg.cc/Zng8bkvm/785942868-2174475163129869-3466266936528563212-n.jpg';

export const AboutRealtorSection: React.FC<AboutRealtorSectionProps> = ({
  settings,
  onOpenCuratedModal,
}) => {
  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel Pacheco! Li sua trajetória e gostaria de conversar sobre imóveis no Sul de Santa Catarina.'
  );

  return (
    <section id="sobre" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#C9A227]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-6 sm:p-10 lg:p-14 shadow-xl overflow-hidden">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#C9A227_1px,transparent_1px)] opacity-[0.04] [background-size:24px_24px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Column 1: Realtor High-Quality Portrait with Signature Frame */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-sm sm:max-w-md">
              {/* Outer Golden Glow Border */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[#C9A227] via-amber-200 to-[#C9A227] opacity-60 blur-sm group-hover:opacity-90 transition-all duration-700" />

              <div className="relative rounded-2xl overflow-hidden bg-[#F7F3EB] border border-[#E5E0D8] shadow-2xl aspect-[3/4] flex items-center justify-center">
                <img
                  src={REALTOR_PHOTO_URL}
                  alt="Corretor de Imóveis Daniel Pacheco"
                  className="w-full h-full object-cover object-top scale-100 group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    // Fallback if network issue
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800';
                  }}
                />

                {/* Bottom Shadow Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none" />

                {/* Floating Authority Badge on Photo */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#0A0A0A]/90 backdrop-blur-md border border-[#C9A227]/40 p-3.5 rounded-xl shadow-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold font-serif text-[#FFFFFF]">Daniel Pacheco</h4>
                    <p className="text-[11px] text-[#C9A227] font-semibold">
                      {settings.creci || 'CRECI: 38 813'} • {settings.cnai || 'CNAI: 34 653'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#C9A227]/10 border border-[#C9A227]/30 px-2.5 py-1 rounded-full text-[10px] font-bold text-[#C9A227]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Oficial</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar Under Photo */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm sm:max-w-md mt-4">
              <div className="p-3.5 rounded-2xl bg-[#F7F3EB] border border-[#E5E0D8] text-center">
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#C9A227] block">8+ Anos</span>
                <span className="text-[10px] text-[#5A5A5A] uppercase tracking-wider font-semibold">No Mercado</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F7F3EB] border border-[#E5E0D8] text-center">
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#111111] block">300+</span>
                <span className="text-[10px] text-[#5A5A5A] uppercase tracking-wider font-semibold">Negócios Realizados</span>
              </div>
            </div>
          </div>

          {/* Column 2: Biography Text & Personal Commitment */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F3EB] border border-[#E5E0D8] text-xs text-[#C9A227]">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="font-semibold uppercase tracking-wider">Trajetória & Autoridade</span>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-luxury text-[#111111] leading-tight">
                Sobre o Corretor <br />
                <span className="italic text-[#C9A227]">Daniel Pacheco</span>
              </h2>
              <div className="h-[2px] w-20 bg-gradient-to-r from-[#C9A227] to-transparent mt-3" />
            </div>

            {/* Authentic Bio Text */}
            <div className="space-y-4 text-sm sm:text-base text-[#5A5A5A] font-normal leading-relaxed">
              <p className="bg-[#F7F3EB] border-l-3 border-[#C9A227] pl-4 py-3 rounded-r-xl text-[#111111]">
                Eu me chamo <strong className="text-[#111111] font-semibold">Daniel Pacheco</strong>, sou corretor de imóveis há aproximadamente <span className="text-[#C9A227] font-semibold">oito anos</span>, acompanhando de perto a realização de muitos sonhos. Iniciei minha trajetória como colaborador de uma construtora, onde conheci o mercado imobiliário e, desde então, me apaixonei por esse segmento.
              </p>

              <p>
                Atualmente, minha principal preocupação é atender cada cliente com <strong className="text-[#111111] font-semibold">ética, profissionalismo e comprometimento</strong>. Já realizei <span className="text-[#C9A227] font-semibold">mais de 300 negócios</span> e mantenho uma excelente média de avaliações no Google, resultado do cuidado em cada atendimento.
              </p>

              <p className="text-[#111111] font-medium">
                Estou apto a auxiliar e realizar o sonho dos meus clientes com dedicação e responsabilidade.
              </p>
            </div>

            {/* Pillars / Distinctions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F7F3EB] border border-[#E5E0D8]">
                <div className="p-2 rounded-lg bg-[#C9A227]/10 text-[#C9A227] shrink-0 mt-0.5">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">Excelência no Google</h4>
                  <p className="text-[11px] text-[#5A5A5A] leading-tight mt-0.5">Alta taxa de satisfação e depoimentos positivos de compradores.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F7F3EB] border border-[#E5E0D8]">
                <div className="p-2 rounded-lg bg-[#C9A227]/10 text-[#C9A227] shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">Origem em Construtora</h4>
                  <p className="text-[11px] text-[#5A5A5A] leading-tight mt-0.5">Domínio técnico de obras, plantas, acabamentos e negociação direta.</p>
                </div>
              </div>
            </div>

            {/* Realtor Official Networks */}
            <SocialMediaBar settings={settings} variant="about" />

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-4">
              <a
                id="about-realtor-whatsapp-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#1F8A4C] hover:bg-[#197A42] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current text-white" />
                <span>Conversar com Daniel Pacheco</span>
              </a>

              {onOpenCuratedModal && (
                <button
                  id="about-realtor-curated-btn"
                  onClick={onOpenCuratedModal}
                  className="px-6 py-3.5 rounded-xl bg-[#F7F3EB] hover:bg-[#E5E0D8] border border-[#E5E0D8] text-xs font-semibold text-[#111111] hover:text-[#C9A227] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#C9A227]" />
                  <span>Solicitar Consultoria VIP</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
