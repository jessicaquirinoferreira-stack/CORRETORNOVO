import React, { useState } from 'react';
import { Calculator, ShieldCheck, DollarSign, MessageCircle, ArrowRight, HelpCircle } from 'lucide-react';
import { Property, SiteSettings } from '../types';
import { formatCurrency, createWhatsAppUrl } from '../utils/formatters';

interface FinancingSimulatorProps {
  property: Property;
  settings: SiteSettings;
}

export const FinancingSimulator: React.FC<FinancingSimulatorProps> = ({ property, settings }) => {
  // Estimated base price if undefined
  const basePrice = property.price || 480000;
  
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [monthsCount, setMonthsCount] = useState<number>(48);
  const [balloonCount, setBalloonCount] = useState<number>(4);

  const downPaymentValue = (basePrice * downPaymentPercent) / 100;
  const balloonTotalValue = (basePrice * 0.25); // 25% in annual balloons
  const balloonSingleValue = balloonCount > 0 ? balloonTotalValue / balloonCount : 0;
  const keysPaymentValue = (basePrice * 0.15); // 15% at keys
  const remainingForInstallments = basePrice - downPaymentValue - balloonTotalValue - keysPaymentValue;
  const monthlyInstallment = remainingForInstallments > 0 ? remainingForInstallments / monthsCount : 0;

  const handleSimulateWhatsApp = () => {
    const text = `*SIMULAÇÃO DE FINANCIAMENTO DIRETO*\n\n` +
      `🏢 *Imóvel:* ${property.title} (Cód. ${property.code})\n` +
      `📍 *Local:* ${property.neighborhood}, ${property.city}\n` +
      `💵 *Valor Base:* ${formatCurrency(property.price || basePrice)}\n` +
      `📥 *Entrada (${downPaymentPercent}%):* ${formatCurrency(downPaymentValue)}\n` +
      `📆 *${monthsCount} Parcelas Mensais de:* ~${formatCurrency(monthlyInstallment)}\n` +
      `🎈 *${balloonCount} Balões Anuais de:* ~${formatCurrency(balloonSingleValue)}\n` +
      `🔑 *Nas Chaves (15%):* ~${formatCurrency(keysPaymentValue)}\n\n` +
      `Olá Daniel! Gostaria de analisar este fluxo de pagamento para o imóvel ${property.code}. É possível adequar à minha realidade?`;

    const url = createWhatsAppUrl(settings.whatsapp || '5548998001744', text);
    window.open(url, '_blank');
  };

  return (
    <div id="financing-simulator-box" className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-[#1F8A4C]/10 border border-[#1F8A4C]/30 text-[#1F8A4C]">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1F8A4C]">
            Condições Especiais
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#111111]">
            Simulador de Financiamento Direto com a Construtora
          </h3>
        </div>
      </div>

      <p className="text-xs text-[#5A5A5A] leading-relaxed">
        Adquira sem burocracia bancária tradicional, com aprovação simplificada e fluxo de desembolso personalizado direto com a construtora.
      </p>

      {/* Sliders and Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F7F3EB] p-5 rounded-2xl border border-[#E5E0D8]">
        {/* Down payment slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#5A5A5A]">Entrada Inicial ({downPaymentPercent}%)</span>
            <span className="font-bold text-[#111111]">{formatCurrency(downPaymentValue)}</span>
          </div>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full accent-[#C9A227] bg-[#E5E0D8] h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#5A5A5A]">
            <span>10% (Facilitada)</span>
            <span>30% (Padrão)</span>
            <span>50%</span>
          </div>
        </div>

        {/* Months Count */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#5A5A5A]">Prazo das Parcelas Diretas</span>
            <span className="font-bold text-[#111111]">{monthsCount} Meses</span>
          </div>
          <input
            type="range"
            min={24}
            max={72}
            step={12}
            value={monthsCount}
            onChange={(e) => setMonthsCount(Number(e.target.value))}
            className="w-full accent-[#C9A227] bg-[#E5E0D8] h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#5A5A5A]">
            <span>24 meses</span>
            <span>48 meses</span>
            <span>72 meses</span>
          </div>
        </div>
      </div>

      {/* Simulation Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] text-center">
          <span className="text-[10px] uppercase text-[#5A5A5A] block">Entrada ({downPaymentPercent}%)</span>
          <span className="text-sm font-bold text-[#C9A227] mt-1 block">
            {formatCurrency(downPaymentValue)}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] text-center">
          <span className="text-[10px] uppercase text-[#5A5A5A] block">{monthsCount}x Parcelas</span>
          <span className="text-sm font-bold text-[#1F8A4C] mt-1 block">
            {formatCurrency(monthlyInstallment)}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] text-center">
          <span className="text-[10px] uppercase text-[#5A5A5A] block">{balloonCount}x Reforços Anuais</span>
          <span className="text-sm font-bold text-[#C9A227] mt-1 block">
            {formatCurrency(balloonSingleValue)}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F7F3EB] border border-[#E5E0D8] text-center">
          <span className="text-[10px] uppercase text-[#5A5A5A] block">Entrega das Chaves</span>
          <span className="text-sm font-bold text-[#111111] mt-1 block">
            {formatCurrency(keysPaymentValue)}
          </span>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#F7F3EB] border border-[#C9A227]/40">
        <div className="text-xs text-[#5A5A5A] space-y-0.5 text-center sm:text-left">
          <p className="font-semibold text-[#111111]">Fluxo 100% Flexível e Adaptável</p>
          <p className="text-[11px] text-[#5A5A5A]">
            Aceita veículo, parcelamento de entrada ou permuta conforme análise da construtora.
          </p>
        </div>

        <button
          id="simulate-submit-whatsapp-btn"
          onClick={handleSimulateWhatsApp}
          className="px-5 py-3 rounded-xl bg-[#1F8A4C] hover:bg-[#197A42] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Validar Proposta com Daniel no WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
