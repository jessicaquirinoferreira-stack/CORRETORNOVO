import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, Cookie, FileText, Mail, Phone } from 'lucide-react';
import { SiteSettings } from '../types';

interface PrivacyPolicyPageProps {
  settings: SiteSettings;
  onBack: () => void;
  navigate?: (route: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ settings, onBack, navigate }) => {
  const handleNav = (route: string) => {
    if (navigate) {
      navigate(route);
    } else {
      window.location.hash = route;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="privacy-policy-page" className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A5A5A] hover:text-[#111111] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Início</span>
        </button>

        {/* Cross-linking navigation bar */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => handleNav('termos-de-uso')}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E0D8] text-[#5A5A5A] hover:text-[#111111] hover:border-[#C9A227] transition-all cursor-pointer font-medium"
          >
            Termos de Uso
          </button>
          <button
            onClick={() => handleNav('cookie-policy')}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E0D8] text-[#5A5A5A] hover:text-[#111111] hover:border-[#C9A227] transition-all cursor-pointer font-medium"
          >
            Política de Cookies
          </button>
        </div>
      </div>

      {/* Main Document Card */}
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-8 sm:p-14 shadow-sm space-y-8">
        <div className="space-y-3 pb-6 border-b border-[#E5E0D8]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F8A4C]/10 border border-[#1F8A4C]/30 text-xs text-[#1F8A4C] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>LGPD • Lei nº 13.709/2018</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-[#111111]">
            Política de Privacidade
          </h1>
          <p className="text-xs text-[#5A5A5A]">
            Última atualização: 08 de setembro de 2026 • Daniel Pacheco Consultoria Imobiliária
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-[#333333] space-y-6 text-sm leading-relaxed">
          <p className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E5E0D8] text-xs text-[#444444] leading-relaxed">
            Esta Política de Privacidade descreve como <strong>Daniel Pacheco</strong>, corretor de imóveis responsável pelo site{' '}
            <a href="https://www.corretordanielpacheco.com.br" className="text-[#C9A227] font-bold underline">
              www.corretordanielpacheco.com.br
            </a>{' '}
            (&quot;nós&quot;), coleta, usa, armazena e protege os dados pessoais dos Usuários, em conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais – LGPD).
          </p>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">1</span>
              Dados que coletamos
            </h2>
            <ul className="text-xs text-[#5A5A5A] space-y-2 pl-8 list-disc">
              <li>Dados de identificação e contato fornecidos em formulários (nome, e-mail, telefone/WhatsApp).</li>
              <li>Dados sobre o imóvel de interesse e preferências de busca (tipo, localização, faixa de preço).</li>
              <li>Dados de navegação coletados automaticamente por cookies e tecnologias similares (ver <button onClick={() => handleNav('cookie-policy')} className="text-[#C9A227] underline font-semibold">Política de Cookies</button>).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">2</span>
              Finalidade do tratamento
            </h2>
            <ul className="text-xs text-[#5A5A5A] space-y-2 pl-8 list-disc">
              <li>Responder a solicitações de contato, agendamento de visitas e propostas.</li>
              <li>Enviar informações sobre imóveis compatíveis com o interesse do Usuário.</li>
              <li>Melhorar a experiência de navegação e o desempenho do Site.</li>
              <li>Cumprir obrigações legais e regulatórias aplicáveis à atividade de corretagem imobiliária.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">3</span>
              Base legal
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              O tratamento de dados pessoais é realizado com base no consentimento do titular, na execução de procedimentos preliminares e de contratos relacionados à intermediação imobiliária, e no legítimo interesse, nos termos dos artigos 7º e 10 da LGPD.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">4</span>
              Compartilhamento de dados
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              Os dados poderão ser compartilhados com proprietários de imóveis, imobiliárias parceiras, instituições financeiras (em caso de financiamento) e prestadores de serviços que auxiliam na operação do Site (como provedores de hospedagem e ferramentas de comunicação), sempre na medida necessária para a finalidade pretendida. <strong>Não vendemos dados pessoais a terceiros.</strong>
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">5</span>
              Armazenamento e segurança
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              Adotamos medidas técnicas e administrativas razoáveis para proteger os dados pessoais contra acessos não autorizados, perda, alteração ou divulgação indevida. Os dados são mantidos pelo tempo necessário ao cumprimento das finalidades descritas ou conforme exigido por lei.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">6</span>
              Direitos do titular
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              Nos termos da LGPD, o Usuário pode solicitar, a qualquer momento:
            </p>
            <ul className="text-xs text-[#5A5A5A] space-y-1.5 pl-8 list-disc">
              <li>Confirmação da existência de tratamento e acesso aos dados;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a lei;</li>
              <li>Portabilidade dos dados a outro fornecedor de serviço;</li>
              <li>Revogação do consentimento e eliminação dos dados tratados com base nele;</li>
              <li>Informação sobre entidades públicas e privadas com as quais os dados foram compartilhados.</li>
            </ul>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8 pt-1">
              As solicitações podem ser feitas pelo e-mail{' '}
              <a href="mailto:Daniel.pacheco@creci.org.br" className="text-[#C9A227] underline font-semibold">
                Daniel.pacheco@creci.org.br
              </a>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">7</span>
              Cookies
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              O Site utiliza cookies para funcionamento e melhoria da experiência do Usuário. Detalhes sobre os tipos de cookies utilizados e como geri-los estão na{' '}
              <button
                onClick={() => handleNav('cookie-policy')}
                className="text-[#C9A227] underline font-semibold hover:text-[#111111]"
              >
                Política de Cookies
              </button>
              , parte integrante deste documento.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">8</span>
              Alterações desta Política
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              Esta Política pode ser atualizada periodicamente para refletir melhorias no Site ou mudanças na legislação. A versão vigente será sempre a publicada nesta página.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">9</span>
              Contato / Encarregado de Dados (DPO)
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de dados pessoais, entre em contato:
            </p>
            <div className="pl-8 pt-2 space-y-1.5 text-xs text-[#333333]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C9A227]" />
                <a href="mailto:Daniel.pacheco@creci.org.br" className="hover:text-[#C9A227] underline">
                  Daniel.pacheco@creci.org.br
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
                <a href="tel:+5548998001744" className="hover:text-[#C9A227]">
                  +55 48 998001744
                </a>
              </div>
            </div>
          </section>

          {/* Footer Card with Signature */}
          <div className="pt-8 border-t border-[#E5E0D8] text-xs text-[#5A5A5A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-[#111111]">Daniel Pacheco — Corretor de Imóveis</p>
              <p>CRECI-38.813 • CNAI 34.653</p>
              <p className="text-[#C9A227] font-medium">www.corretordanielpacheco.com.br</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNav('termos-de-uso')}
                className="text-xs text-[#C9A227] hover:underline font-semibold"
              >
                Termos de Uso
              </button>
              <span>•</span>
              <button
                onClick={() => handleNav('cookie-policy')}
                className="text-xs text-[#C9A227] hover:underline font-semibold"
              >
                Política de Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
