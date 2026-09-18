import React from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Calculator, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { SiteSettings } from '../types';
import { createWhatsAppUrl } from '../utils/formatters';

interface ComoEscolherPageProps {
  settings: SiteSettings;
  onOpenCuratedModal: () => void;
}

export const ComoEscolherPage: React.FC<ComoEscolherPageProps> = ({
  settings,
  onOpenCuratedModal,
}) => {
  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel! Li o guia "Como Escolher" no seu site e gostaria de tirar algumas dúvidas sobre financiamento direto.'
  );

  return (
    <div id="como-escolher-page" className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E5E0D8] text-xs text-[#C9A227] shadow-sm">
          <BookOpen className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Guia do Comprador & Investidor Inteligente</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#111111]">
          Como Escolher o Imóvel Perfeito
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed">
          Tudo o que você precisa saber sobre financiamento direto com construtoras, segurança jurídica, rentabilidade na planta e escolha de bairros no Sul de SC.
        </p>
      </div>

      {/* Comparative Table: Direto com Construtora vs Bancário */}
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm">
        <div className="space-y-1 text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A227]">
            Comparativo Técnico
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#111111]">
            Financiamento Direto vs Financiamento Bancário
          </h2>
          <p className="text-xs text-[#5A5A5A]">
            Entenda as diferenças práticas de aprovação, custos e flexibilidade.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[#E5E0D8] text-[#5A5A5A] uppercase tracking-wider">
                <th className="py-3 px-4">Critério</th>
                <th className="py-3 px-4 text-[#1F8A4C] bg-[#1F8A4C]/10 rounded-t-xl">
                  Financiamento Direto com Construtora
                </th>
                <th className="py-3 px-4 text-[#5A5A5A]">Financiamento Bancário Tradicional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8] text-[#111111]">
              <tr>
                <td className="py-4 px-4 font-semibold text-[#111111]">Burocracia & Análise</td>
                <td className="py-4 px-4 bg-[#1F8A4C]/5 text-[#111111]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1F8A4C] shrink-0" />
                    <span>Aprovação rápida e simplificada diretamente com a incorporadora</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-[#5A5A5A]">
                  Exigência de farta documentação, comprovação de renda rígida e score bancário
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-semibold text-[#111111]">Flexibilidade de Pagamento</td>
                <td className="py-4 px-4 bg-[#1F8A4C]/5 text-[#111111]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1F8A4C] shrink-0" />
                    <span>Entrada adaptada, balões anuais, chaves e possibilidade de permuta</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-[#5A5A5A]">
                  Tabelas pré-fixadas (SAC ou Price), parcelas fixas sem adaptação sazonal
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-semibold text-[#111111]">Custos Cartorários Iniciais</td>
                <td className="py-4 px-4 bg-[#1F8A4C]/5 text-[#111111]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1F8A4C] shrink-0" />
                    <span>Contrato particular registrado, ITBI e escritura somente na entrega/quitação</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-[#5A5A5A]">
                  ITBI, taxa de avaliação bancária e custos de registro cobrados logo no início
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-semibold text-[#111111]">Correção Monetária</td>
                <td className="py-4 px-4 bg-[#1F8A4C]/5 text-[#111111]">
                  <span>CUB/SC durante a obra; INPC / IPCA + juros brandos após entrega</span>
                </td>
                <td className="py-4 px-4 text-[#5A5A5A]">
                  TR + Taxas de juros de 10% a 12% ao ano desde o primeiro mês
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4 Pillars of Legal Security */}
      <div className="space-y-6">
        <div className="text-left space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A227]">
            Tranquilidade Patrimonial
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#111111]">
            Os 4 Pilares da Segurança Jurídica
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm space-y-3">
            <span className="font-serif-luxury text-3xl font-bold text-[#C9A227]">01</span>
            <h3 className="text-base font-bold text-[#111111]">Registro de Incorporação (R.I.)</h3>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              Garantia de que o projeto foi aprovado pela prefeitura e registrado no Cartório de Registro de Imóveis da comarca.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm space-y-3">
            <span className="font-serif-luxury text-3xl font-bold text-[#C9A227]">02</span>
            <h3 className="text-base font-bold text-[#111111]">Patrimônio de Afetação</h3>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              Blindagem financeira que garante que os recursos pagos pelos compradores sejam usados exclusivamente na própria obra.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm space-y-3">
            <span className="font-serif-luxury text-3xl font-bold text-[#C9A227]">03</span>
            <h3 className="text-base font-bold text-[#111111]">Memorial Descritivo</h3>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              Documento legal que detalha todas as marcas e especificações dos revestimentos, esquadrias e áreas comuns.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E5E0D8] shadow-sm space-y-3">
            <span className="font-serif-luxury text-3xl font-bold text-[#C9A227]">04</span>
            <h3 className="text-base font-bold text-[#111111]">Habite-se & CND</h3>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              Certificado de conclusão da obra e certidões negativas de débitos que autorizam a entrega oficial das chaves.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#0A0A0A] border border-[#C9A227]/40 text-center space-y-5">
        <h3 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#FFFFFF]">
          Deseja uma simulação de compra personalizada?
        </h3>
        <p className="text-xs sm:text-sm text-[#8A8A8A] max-w-xl mx-auto">
          Daniel Pacheco analisa sua capacidade de desembolso e indica exatamente os empreendimentos mais vantajosos para sua meta.
        </p>
        <div className="pt-2 flex justify-center gap-4 flex-wrap">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#1F8A4C] hover:bg-[#197A42] text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Tirar Dúvidas com Daniel no WhatsApp
          </a>
          <button
            onClick={onOpenCuratedModal}
            className="px-6 py-3.5 bg-[#C9A227] hover:bg-[#B8931F] text-[#0A0A0A] font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Preencher Consultoria VIP
          </button>
        </div>
      </div>
    </div>
  );
};
