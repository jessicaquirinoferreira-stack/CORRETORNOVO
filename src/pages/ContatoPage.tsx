import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Instagram,
  CheckCircle2
} from 'lucide-react';
import { SiteSettings } from '../types';
import { FAQ_LIST } from '../data/initialSettings';
import { createWhatsAppUrl } from '../utils/formatters';
import { SocialMediaBar } from '../components/SocialLinks';

interface ContatoPageProps {
  settings: SiteSettings;
}

export const ContatoPage: React.FC<ContatoPageProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: 'Apartamentos na Planta',
    message: '',
  });

  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `*NOVA MENSAGEM DO SITE DANIEL PACHECO*\n\n` +
      `👤 *Nome:* ${formData.name}\n` +
      `📱 *Telefone/WhatsApp:* ${formData.phone}\n` +
      `✉️ *E-mail:* ${formData.email || 'Não informado'}\n` +
      `🏢 *Interesse:* ${formData.interest}\n` +
      (formData.message ? `💬 *Mensagem:* ${formData.message}\n` : '') +
      `\nOlá Daniel, estou entrando em contato através da página de contato do seu site!`;

    const url = createWhatsAppUrl(settings.whatsapp || '5548998001744', text);
    window.open(url, '_blank');
  };

  const whatsappDirectUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel! Gostaria de conversar com você sobre imóveis no Sul de Santa Catarina.'
  );

  return (
    <div id="contato-page" className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E5E0D8] text-xs text-[#C9A227] shadow-sm">
          <img
            src={settings.logoUrl || "https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png"}
            alt="Logo"
            className="h-4 w-auto max-w-[80px] object-contain shrink-0"
          />
          <span className="h-3 w-[1px] bg-[#E5E0D8]" />
          <span>Canais Oficiais de Atendimento</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#111111]">
          Fale com Daniel Pacheco
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed">
          Atendimento personalizado com agilidade, discrição e conhecimento aprofundado do mercado imobiliário regional.
        </p>
      </div>

      {/* Main Grid: Info Cards + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* WhatsApp Direct Card */}
          <div className="p-6 rounded-3xl bg-[#0A0A0A] border border-[#1F8A4C]/40 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1F8A4C] text-white flex items-center justify-center font-bold">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-[#1F8A4C]">Canal Principal</span>
                <h3 className="text-lg font-bold text-white">WhatsApp Direto</h3>
              </div>
            </div>
            <p className="text-xs text-[#8A8A8A] leading-relaxed">
              Tire dúvidas em tempo real, receba plantas em PDF, vídeos de decorados e agende visitas com rapidez.
            </p>
            <a
              id="contact-page-whatsapp-btn"
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#1F8A4C] hover:bg-[#197A42] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Iniciar Conversa no WhatsApp</span>
            </a>
          </div>

          {/* Info Details List */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E0D8] space-y-4 text-xs shadow-sm">
            <div className="flex items-start gap-3 pb-3 border-b border-[#E5E0D8]">
              <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#5A5A5A] block">Endereço do Escritório</span>
                <span className="text-[#111111] font-semibold block leading-relaxed">
                  {settings.address || 'Rua Marcelo Lodetti 55 Condominio Ed. Florença - Criciúma - SC, 88801-510'}
                </span>
                <span className="text-[11px] text-[#C9A227] font-semibold block mt-1">
                  (Atendimento somente sob agendamento)
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-3 border-b border-[#E5E0D8]">
              <Phone className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#5A5A5A] block">Telefone / WhatsApp</span>
                <a href="tel:48998001744" className="text-[#111111] font-semibold hover:text-[#C9A227] transition-colors block">
                  {settings.phone || '(48) 99800-1744'}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-3 border-b border-[#E5E0D8]">
              <Mail className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#5A5A5A] block">E-mail Corporativo</span>
                <span className="text-[#111111] font-semibold">{settings.email || 'daniel.pacheco@creci.org.br'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
              <div className="w-full">
                <span className="text-[#5A5A5A] block mb-1.5 font-medium">Horário de funcionamento:</span>
                <div className="space-y-1 text-[11px] bg-[#F9F7F4] p-3 rounded-xl border border-[#E5E0D8]">
                  <div className="flex justify-between py-0.5 border-b border-[#E5E0D8]/60">
                    <span className="text-[#5A5A5A]">segunda-feira</span>
                    <span className="text-[#111111] font-semibold">08:00–18:00</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#E5E0D8]/60">
                    <span className="text-[#5A5A5A]">terça-feira</span>
                    <span className="text-[#111111] font-semibold">08:00–18:00</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#E5E0D8]/60">
                    <span className="text-[#5A5A5A]">quarta-feira</span>
                    <span className="text-[#111111] font-semibold">08:00–18:00</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#E5E0D8]/60">
                    <span className="text-[#5A5A5A]">quinta-feira</span>
                    <span className="text-[#111111] font-semibold">08:00–18:00</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#E5E0D8]/60">
                    <span className="text-[#5A5A5A]">sexta-feira</span>
                    <span className="text-[#111111] font-semibold">08:00–18:00</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#E5E0D8]/60">
                    <span className="text-[#8A8A8A]">sábado</span>
                    <span className="text-[#8A8A8A] font-medium">Fechado</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#8A8A8A]">domingo</span>
                    <span className="text-[#8A8A8A] font-medium">Fechado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider">
              Mensagem Direta
            </span>
            <h3 className="text-2xl font-bold font-serif-luxury text-[#111111]">
              Envie sua Mensagem
            </h3>
            <p className="text-xs text-[#5A5A5A] mt-1">
              Preencha os campos abaixo para iniciar um atendimento personalizado.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">Seu Nome *</label>
                <input
                  type="text"
                  required
                  placeholder="Nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">WhatsApp com DDD *</label>
                <input
                  type="tel"
                  required
                  placeholder="(48) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">E-mail (Opcional)</label>
                <input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">Principal Interesse</label>
                <select
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl px-3.5 py-3 outline-none appearance-none cursor-pointer"
                >
                  <option value="Apartamentos na Planta">Apartamentos na Planta</option>
                  <option value="Imóveis Prontos para Morar">Imóveis Prontos para Morar</option>
                  <option value="Loteamentos / Terrenos">Loteamentos / Terrenos</option>
                  <option value="Casas em Condomínio">Casas em Condomínio</option>
                  <option value="Avaliação de Imóvel">Avaliação de Imóvel</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#111111] mb-1.5 block">Como podemos ajudar?</label>
              <textarea
                rows={3}
                placeholder="Descreva detalhes como bairro de preferência, número de quartos ou dúvidas sobre financiamento..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar e Iniciar Conversa</span>
            </button>
          </form>
        </div>
      </div>

      {/* Official Social Media Channels */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider">
            Conecte-se nas Redes Oficiais
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#111111]">
            Acompanhe o Trabalho de Daniel Pacheco
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5A5A]">
            Siga os perfis oficiais para conferir lançamentos em primeira mão, tours em vídeo e análises do mercado imobiliário.
          </p>
        </div>

        <SocialMediaBar settings={settings} variant="contact" />
      </div>

      {/* Interactive FAQ Section */}
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider">
            Perguntas Frequentes
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#111111]">
            Dúvidas Comuns de Compradores e Investidores
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_LIST.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#F7F3EB] border border-[#E5E0D8] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#111111] hover:text-[#C9A227] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#C9A227] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#5A5A5A] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs text-[#5A5A5A] leading-relaxed border-t border-[#E5E0D8]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
