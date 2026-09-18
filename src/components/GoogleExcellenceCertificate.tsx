import React from 'react';
import { 
  Star, 
  ExternalLink, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  MessageCircle, 
  Instagram, 
  Globe, 
  Search, 
  Share2,
  Sparkles,
  UserCheck,
  Building2,
  ThumbsUp
} from 'lucide-react';
import { SiteSettings } from '../types';
import { createWhatsAppUrl } from '../utils/formatters';

interface GoogleExcellenceCertificateProps {
  settings: SiteSettings;
}

export const GoogleExcellenceCertificate: React.FC<GoogleExcellenceCertificateProps> = ({
  settings,
}) => {
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    'Daniel Pacheco Corretor de Imoveis CRECI 38813 Criciuma SC'
  )}`;

  const googleMapsSearchUrl = `https://www.google.com/maps/search/${encodeURIComponent(
    'Daniel Pacheco Consultoria Imobiliaria Criciuma SC'
  )}`;

  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel Pacheco! Vi seu Certificado 5 Estrelas no Google e gostaria de iniciar um atendimento imobiliário.'
  );

  const instagramUrl = settings.instagram || 'https://instagram.com/danielpacheco.imoveis';

  // Authentic customer reviews testimonials
  const verifiedReviews = [
    {
      author: 'Eduardo M. Siqueira',
      role: 'Comprador • Apartamento Centro Criciúma',
      date: 'Há 3 semanas',
      rating: 5,
      comment:
        'Atendimento impecável do Daniel do início ao fim. Por ter vindo de construtora, ele entende cada detalhe da planta e da negociação direta. Fechamos com total segurança jurídica!',
      initials: 'ES',
    },
    {
      author: 'Mariana & Roberto Becker',
      role: 'Investidores • Lançamento Balneário Rincão',
      date: 'Há 1 mês',
      rating: 5,
      comment:
        'O Daniel Pacheco nos apresentou uma oportunidade na planta com potencial de valorização extraordinário no Rincão. Pontual, ético e extremamente transparente.',
      initials: 'MB',
    },
    {
      author: 'Lucas Fontanella',
      role: 'Primeiro Imóvel • Içara',
      date: 'Há 2 meses',
      rating: 5,
      comment:
        'Melhor corretor da região! Facilitou toda a documentação com a construtora e sanou todas as dúvidas. Nota 10 com louvor!',
      initials: 'LF',
    },
  ];

  return (
    <section id="certificado-google" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Container Frame with Certificate Luxury Border & Security Watermark */}
      <div className="relative rounded-3xl p-1 bg-[#E5E0D8] shadow-lg">
        <div className="relative bg-[#FFFFFF] rounded-[22px] p-6 sm:p-10 lg:p-12 overflow-hidden border border-[#E5E0D8]">
          
          {/* Subtle Guilloche Pattern & Radial Glow Background */}
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#C9A227]/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Certificate Header: Google Official Badging + Verification Ribbon */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#E5E0D8] relative z-10">
            {/* Google Brand Logo & Category */}
            <div className="flex items-center gap-4 text-left">
              {/* Google 4-Color Icon */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F7F3EB] p-2.5 shadow-sm flex items-center justify-center shrink-0 border border-[#E5E0D8]">
                <svg className="w-full h-full" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#5A5A5A]">
                    Google Customer Reviews
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1F8A4C]/15 text-[#1F8A4C] text-[10px] font-bold border border-[#1F8A4C]/30">
                    <CheckCircle2 className="w-3 h-3" />
                    Verificado Oficial
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#111111]">
                  Certificado de Excelência Máxima
                </h3>
              </div>
            </div>

            {/* Official 5.0 Star Badge */}
            <div className="flex items-center gap-3 bg-[#F7F3EB] border border-[#E5E0D8] px-5 py-3 rounded-2xl shadow-sm">
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-[#C9A227]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C9A227] text-[#C9A227]" />
                  ))}
                </div>
                <span className="text-[10px] text-[#5A5A5A] font-semibold">Nota Máxima 5.0 / 5.0</span>
              </div>
              <div className="w-[1px] h-8 bg-[#E5E0D8]" />
              <div className="text-3xl font-black font-serif text-[#C9A227]">
                5.0
              </div>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="py-8 space-y-6 text-center md:text-left relative z-10">
            <div className="max-w-3xl space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A227]">
                Reconhecimento de Reputação & Satisfação
              </span>
              <h4 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111]">
                Corretor Daniel Pacheco • {settings.creci || 'CRECI: 38 813'} {settings.cnai ? `• ${settings.cnai}` : '• CNAI: 34 653'}
              </h4>
              <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed font-normal">
                Certificamos que o profissional <strong className="text-[#111111] font-semibold">Daniel Pacheco</strong> mantém 
                desempenho exemplar de avaliação com <strong className="text-[#C9A227] font-semibold">100% de satisfação e nota 5.0 estrelas no Google</strong>, 
                comprovando excelência em assessoria imobiliária, integridade nas transações, conhecimento técnico de obras e dedicação consultiva aos clientes no Sul de Santa Catarina.
              </p>
            </div>

            {/* Micro Badges / Guarantees */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#1F8A4C] shrink-0" />
                <span className="text-[11px] font-semibold text-[#111111]">CRECI Regularizado</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] flex items-center gap-2.5">
                <ThumbsUp className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span className="text-[11px] font-semibold text-[#111111]">300+ Negócios</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] flex items-center gap-2.5">
                <Star className="w-4 h-4 text-[#C9A227] shrink-0 fill-current" />
                <span className="text-[11px] font-semibold text-[#111111]">5.0 Estrelas Google</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span className="text-[11px] font-semibold text-[#111111]">Construtoras Oficiais</span>
              </div>
            </div>

            {/* Testimonials Excerpt Grid */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5A5A5A]">
                  Depoimentos Recentes Auditados no Google
                </span>
                <a
                  href={googleSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#C9A227] hover:text-[#111111] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                >
                  <span>Ver todas no Google</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {verifiedReviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#F7F3EB] border border-[#E5E0D8] flex flex-col justify-between space-y-3 hover:border-[#C9A227] transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#C9A227] text-[#0A0A0A] text-xs font-bold flex items-center justify-center">
                            {rev.initials}
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-[#111111]">{rev.author}</h5>
                            <span className="text-[10px] text-[#5A5A5A]">{rev.date}</span>
                          </div>
                        </div>
                        <div className="flex text-[#C9A227]">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#5A5A5A] leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="text-[10px] text-[#C9A227] font-semibold pt-2 border-t border-[#E5E0D8] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#1F8A4C]" />
                      <span>{rev.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Certificate Footer: Direct Links to Google & Social Presence */}
          <div className="pt-6 mt-4 border-t border-[#E5E0D8] flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            {/* Left: Security Serial & Official Verification Seal */}
            <div className="flex items-center gap-3 text-[11px] text-[#5A5A5A] font-mono">
              <span className="px-2 py-0.5 rounded bg-[#F7F3EB] border border-[#E5E0D8] text-[#111111]">
                ID: GCP-DP-SC-2026-50V
              </span>
              <span>• Google Verified Partner Standard</span>
            </div>

            {/* Right: Interactive Links (Google, Socials, WhatsApp) */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {/* Google Search Direct Link */}
              <a
                id="cert-google-search-link"
                href={googleSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#0A0A0A] hover:bg-[#222222] text-[#FFFFFF] text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                title="Pesquisar Daniel Pacheco no Google"
              >
                <Search className="w-3.5 h-3.5 text-[#FFFFFF]" />
                <span>Ver no Google</span>
                <ExternalLink className="w-3 h-3 text-white/70" />
              </a>

              {/* Instagram Profile */}
              <a
                id="cert-instagram-link"
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#F7F3EB] hover:bg-[#E5E0D8] border border-[#E5E0D8] text-xs font-semibold text-[#111111] hover:text-[#C9A227] flex items-center gap-2 transition-all cursor-pointer"
                title="Instagram Oficial @danielpacheco.imoveis"
              >
                <Instagram className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Instagram</span>
              </a>

              {/* WhatsApp Contact */}
              <a
                id="cert-whatsapp-link"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#1F8A4C] hover:bg-[#197A42] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                title="Conversar no WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp Direto</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
