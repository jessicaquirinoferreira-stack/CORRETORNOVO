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
    <section id="sobre" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20 text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#C9A227]/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative z-10 bg-[#141414] border border-white/10 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl overflow-hidden">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(201,162,39,0.15)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
          {/* Column 1: Realtor High-Quality Portrait with Signature Frame */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-sm sm:max-w-md">
              {/* Outer Golden Glow Border */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[#C9A227] via-amber-200/50 to-[#C9A227] opacity-40 blur-md group-hover:opacity-80 transition-all duration-700" />

              <div className="relative rounded-2xl overflow-hidden bg-[#1A1A1A] border border-white/10 shadow-2xl aspect-[3/4] flex items-center justify-center">
                <img
                  src={REALTOR_PHOTO_URL}
                  alt="Corretor de Imóveis Daniel Pacheco"
                  className="w-full h-full object-cover object-top scale-100 group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800';
                  }}
                />

                {/* Bottom Shadow Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-85 pointer-events-none" />

                {/* Floating Authority Badge on Photo */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/90 backdrop-blur-md border border-[#C9A227]/40 p-3.5 rounded-xl shadow-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold font-serif text-white">Daniel Pacheco</h4>
                    <p className="text-[11px] text-[#C9A227] font-semibold">
                      {settings.creci || 'CRECI: 38 813'} · {settings.cnai || 'CNAI: 34 653'}
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
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#C9A227] block tabular-nums">8+ Anos</span>
                <span className="text-[10px] text-[#A0A0A0] uppercase tracking-wider font-semibold">No Mercado</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="text-xl sm:text-2xl font-bold font-serif text-white block tabular-nums">300+</span>
                <span className="text-[10px] text-[#A0A0A0] uppercase tracking-wider font-semibold">Negócios Realizados</span>
              </div>
            </div>
          </div>

          {/* Column 2: Biography Text & Personal Commitment */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#C9A227]">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="font-semibold uppercase tracking-wider">Trajetória & Autoridade</span>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-luxury text-white leading-tight">
                Sobre o Corretor <br />
                <span className="italic gold-gradient-text">Daniel Pacheco</span>
              </h2>
              <div className="h-[2px] w-20 bg-gradient-to-r from-[#C9A227] to-transparent mt-3" />
            </div>

            {/* Authentic Bio Text */}
            <div className="space-y-4 text-sm sm:text-base text-[#B0B0B0] font-normal leading-relaxed">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[#E0E0E0]">
                Eu me chamo <strong className="text-white font-semibold">Daniel Pacheco</strong>, sou corretor de imóveis há aproximadamente <span className="text-[#C9A227] font-semibold">oito anos</span>, acompanhando de perto a realização de muitos sonhos. Iniciei minha trajetória como colaborador de construtora, onde conheci a fundo os bastidores do mercado imobiliário e me apaixonei pelo segmento.
              </div>

              <p>
                Atualmente, minha principal preocupação é atender cada cliente com <strong className="text-white font-semibold">ética, profissionalismo e comprometimento</strong>. Já realizei <span className="text-[#C9A227] font-semibold">mais de 300 negócios</span> e mantenho uma excelente média de avaliações 5 estrelas no Google, resultado do cuidado personalizado em cada negociação.
              </p>

              <p>
                Ofereço assessoria completa na compra, venda e investimentos, além de avaliação imobiliária certificada como perito credenciado pelo <strong className="text-white font-semibold">CNAI 34.653</strong>.
              </p>
            </div>

            {/* Core Values Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-[#D0D0D0]">
                <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
                <span>Especialista em plantas e negociação direta</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#D0D0D0]">
                <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
                <span>Perito Avaliador Imobiliário (CNAI 34.653)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#D0D0D0]">
                <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
                <span>Atendimento presencial em Criciúma e Rincão</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#D0D0D0]">
                <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
                <span>Auditoria jurídica de R.I. e contratos</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-white/10">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#1F8A4C] hover:bg-[#197A42] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Iniciar Conversa com Daniel</span>
              </a>

              {onOpenCuratedModal && (
                <button
                  onClick={onOpenCuratedModal}
                  className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white hover:text-[#C9A227] transition-all cursor-pointer"
                >
                  Solicitar Consultoria VIP
                </button>
              )}
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <span className="text-[11px] text-[#7A7A7A] uppercase tracking-wider block mb-2 font-medium">
                Redes Oficiais:
              </span>
              <SocialMediaBar settings={settings} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
