import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  MessageCircle, 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Send,
  User,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SiteSettings } from '../types';
import { createWhatsAppUrl } from '../utils/formatters';

interface CuratedFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
}

export const CuratedFormModal: React.FC<CuratedFormModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    objective: 'Morar',
    cityPreference: 'Criciúma',
    propertyType: 'Apartamento',
    budgetRange: 'R$ 400.000 a R$ 800.000',
    timeframe: 'Imediato (Pronto)',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#C9A227', '#F7F3EB', '#1F8A4C']
      });
    } catch {
      // Confetti fallback
    }

    setSubmitted(true);

    // Format WhatsApp message
    const message = `*SOLICITAÇÃO DE Consultoria VIP - DANIEL PACHECO*\n\n` +
      `👤 *Nome:* ${formData.name || 'Cliente'}\n` +
      `📱 *Contato:* ${formData.phone || 'Não informado'}\n` +
      `🎯 *Objetivo:* ${formData.objective}\n` +
      `📍 *Cidade de interesse:* ${formData.cityPreference}\n` +
      `🏠 *Tipo de imóvel:* ${formData.propertyType}\n` +
      `💰 *Faixa orçamentária:* ${formData.budgetRange}\n` +
      `⏳ *Prazo:* ${formData.timeframe}\n` +
      (formData.notes ? `📝 *Observações:* ${formData.notes}\n` : '') +
      `\nOlá Daniel, acabei de preencher a consultoria no seu site e gostaria de receber as melhores oportunidades alinhadas ao meu perfil!`;

    const whatsappUrl = createWhatsAppUrl(settings.whatsapp || '5548998001744', message);

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1200);
  };

  const handleClose = () => {
    setSubmitted(false);
    setStep(1);
    onClose();
  };

  return (
    <div id="curated-modal-backdrop" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div 
        id="curated-modal-card" 
        className="relative bg-[#FFFFFF] border border-[#E5E0D8] w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl text-[#111111] my-8 animate-in zoom-in-95 duration-200"
      >
        {/* Close button */}
        <button
          id="curated-modal-close-btn"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#F7F3EB] text-[#5A5A5A] hover:text-[#111111] hover:bg-[#EAE4D8] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 pb-2 border-b border-[#E5E0D8]">
              <img
                src={settings.logoUrl || "https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png"}
                alt="Daniel Pacheco Consultoria Imobiliária Logo Oficial"
                className="h-10 sm:h-12 w-auto max-w-[170px] object-contain shrink-0"
              />
              <div className="border-l-0 sm:border-l border-[#E5E0D8] sm:pl-3">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#C9A227]">
                  Assessoria Exclusiva
                </span>
                <h2 className="text-lg sm:text-xl font-bold font-serif-luxury text-[#111111]">
                  Consultoria Personalizada de Imóveis
                </h2>
              </div>
            </div>

            <p className="text-xs text-[#5A5A5A] mb-6 leading-relaxed">
              Conte-nos exatamente o que você procura. Daniel Pacheco fará uma seleção técnica e exclusiva dos melhores empreendimentos disponíveis no Sul de SC.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Step 1: Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#111111] mb-1.5 block">Seu Nome Completo *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#5A5A5A] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="curated-input-name"
                      type="text"
                      required
                      placeholder="Ex: João da Silva"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-sm text-[#111111] rounded-xl pl-9 pr-3 py-2.5 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#111111] mb-1.5 block">WhatsApp com DDD *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#5A5A5A] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="curated-input-phone"
                      type="tel"
                      required
                      placeholder="(48) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-sm text-[#111111] rounded-xl pl-9 pr-3 py-2.5 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Goal / Objective */}
              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">Qual é o seu objetivo principal?</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Morar', 'Investir', 'Segunda Residência'].map((obj) => (
                    <button
                      key={obj}
                      type="button"
                      onClick={() => setFormData({ ...formData, objective: obj })}
                      className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                        formData.objective === obj
                          ? 'bg-[#0A0A0A] text-[#FFFFFF] border-[#0A0A0A] font-semibold shadow-sm'
                          : 'bg-[#F7F3EB] text-[#5A5A5A] border-[#E5E0D8] hover:bg-[#EAE4D8]'
                      }`}
                    >
                      {obj}
                    </button>
                  ))}
                </div>
              </div>

              {/* City & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#111111] mb-1.5 block">Cidade de Preferência</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#5A5A5A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={formData.cityPreference}
                      onChange={(e) => setFormData({ ...formData, cityPreference: e.target.value })}
                      className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-sm text-[#111111] rounded-xl pl-9 pr-3 py-2.5 outline-none appearance-none cursor-pointer"
                    >
                      <option value="Criciúma">Criciúma</option>
                      <option value="Balneário Rincão">Balneário Rincão</option>
                      <option value="Içara">Içara</option>
                      <option value="Nova Veneza">Nova Veneza</option>
                      <option value="Cocal do Sul">Cocal do Sul</option>
                      <option value="Forquilhinha">Forquilhinha</option>
                      <option value="Morro da Fumaça">Morro da Fumaça</option>
                      <option value="Outras regiões de SC">Outras regiões de SC</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#111111] mb-1.5 block">Tipo de Imóvel Desejado</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#5A5A5A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-sm text-[#111111] rounded-xl pl-9 pr-3 py-2.5 outline-none appearance-none cursor-pointer"
                    >
                      <option value="Apartamento na Planta">Apartamento na Planta</option>
                      <option value="Apartamento Pronto">Apartamento Pronto</option>
                      <option value="Casa Residencial">Casa Residencial</option>
                      <option value="Lote / Terreno">Lote / Terreno</option>
                      <option value="Cobertura / Alto Padrão">Cobertura / Alto Padrão</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Budget & Timeframe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#111111] mb-1.5 block">Expectativa de Investimento</label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-sm text-[#111111] rounded-xl px-3 py-2.5 outline-none appearance-none cursor-pointer"
                  >
                    <option value="Até R$ 350.000">Até R$ 350.000</option>
                    <option value="R$ 350.000 a R$ 600.000">R$ 350.000 a R$ 600.000</option>
                    <option value="R$ 600.000 a R$ 1.200.000">R$ 600.000 a R$ 1.200.000</option>
                    <option value="Acima de R$ 1.200.000">Acima de R$ 1.200.000 (Alto Padrão)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#111111] mb-1.5 block">Prazo de Mudança / Entrega</label>
                  <select
                    value={formData.timeframe}
                    onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                    className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-sm text-[#111111] rounded-xl px-3 py-2.5 outline-none appearance-none cursor-pointer"
                  >
                    <option value="Imediato (Pronto)">Imediato (Imóvel Pronto)</option>
                    <option value="Curto Prazo (Em obras / 1 ano)">Curto Prazo (Em obras / 1 ano)</option>
                    <option value="Médio/Longo Prazo (Na Planta 2026-2028)">Médio/Longo Prazo (Na Planta 2026-2028)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-medium text-[#111111] mb-1.5 block">
                  Deseja adicionar algum detalhe ou exigência específica? (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Preciso de 2 vagas de garagem, sacada com churrasqueira e vista livre..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#F7F3EB] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] rounded-xl p-3 outline-none resize-none"
                />
              </div>

              {/* Submit button */}
              <button
                id="curated-submit-btn"
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#1F8A4C] hover:bg-[#197A42] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current text-white" />
                <span>Receber Consultoria no WhatsApp de Daniel Pacheco</span>
              </button>
            </form>
          </div>
        ) : (
          /* Submission success view */
          <div className="text-center py-8 space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-[#1F8A4C]/15 border border-[#1F8A4C]/30 text-[#1F8A4C] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-serif-luxury text-[#111111]">
              Solicitação Enviada com Sucesso!
            </h3>
            <p className="text-sm text-[#5A5A5A] max-w-md mx-auto leading-relaxed">
              Obrigado, <strong className="text-[#111111]">{formData.name}</strong>! Estamos abrindo sua conversa no WhatsApp com o Corretor Daniel Pacheco para apresentar as opções selecionadas.
            </p>
            <div className="pt-4 flex justify-center">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-[#0A0A0A] hover:bg-[#222222] text-xs font-semibold text-[#FFFFFF] transition-colors cursor-pointer"
              >
                Fechar Janela
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
