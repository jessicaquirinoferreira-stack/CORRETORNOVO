import React from 'react';
import { ArrowLeft, Cookie, ShieldCheck, FileText, Mail, Phone } from 'lucide-react';
import { SiteSettings } from '../types';

interface CookiePolicyPageProps {
  settings: SiteSettings;
  onBack: () => void;
  navigate?: (route: string) => void;
}

export const CookiePolicyPage: React.FC<CookiePolicyPageProps> = ({ settings, onBack, navigate }) => {
  const handleNav = (route: string) => {
    if (navigate) {
      navigate(route);
    } else {
      window.location.hash = route;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="cookie-policy-page" className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Breadcrumb / Back Navigation */}
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
            onClick={() => handleNav('politica-de-privacidade')}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E0D8] text-[#5A5A5A] hover:text-[#111111] hover:border-[#C9A227] transition-all cursor-pointer font-medium"
          >
            Política de Privacidade
          </button>
          <button
            onClick={() => handleNav('termos-de-uso')}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E0D8] text-[#5A5A5A] hover:text-[#111111] hover:border-[#C9A227] transition-all cursor-pointer font-medium"
          >
            Termos de Uso
          </button>
        </div>
      </div>

      {/* Main Document Card */}
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl p-8 sm:p-14 shadow-sm space-y-8">
        <div className="space-y-3 pb-6 border-b border-[#E5E0D8]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 text-xs text-[#C9A227] font-semibold">
            <Cookie className="w-3.5 h-3.5" />
            <span>Documento Legal Oficial</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-[#111111]">
            Política de Cookies
          </h1>
          <p className="text-xs text-[#5A5A5A]">
            Última atualização: 08 de setembro de 2026 • Daniel Pacheco Consultoria Imobiliária
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-[#333333] space-y-6 text-sm leading-relaxed">
          <p className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E5E0D8] text-xs text-[#444444] leading-relaxed">
            Esta Política de Cookies explica o que são cookies, como o site{' '}
            <a href="https://www.corretordanielpacheco.com.br" className="text-[#C9A227] font-bold underline">
              www.corretordanielpacheco.com.br
            </a>{' '}
            os utiliza e como o Usuário pode gerenciá-los.
          </p>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">1</span>
              O que são cookies
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              Cookies são pequenos arquivos de texto armazenados no dispositivo do Usuário quando este visita um site. Eles permitem que o site reconheça o dispositivo, memorize preferências e colete informações sobre a navegação.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">2</span>
              Tipos de cookies utilizados
            </h2>
            <ul className="text-xs text-[#5A5A5A] space-y-2 pl-8 list-disc">
              <li>
                <strong>Cookies estritamente necessários:</strong> essenciais para o funcionamento do Site (ex.: navegação entre páginas, formulários de contato).
              </li>
              <li>
                <strong>Cookies de desempenho e análise:</strong> coletam informações sobre como os Usuários utilizam o Site (páginas visitadas, tempo de permanência), usados para melhorar seu funcionamento.
              </li>
              <li>
                <strong>Cookies de funcionalidade:</strong> memorizam preferências do Usuário, como filtros de busca de imóveis já utilizados.
              </li>
              <li>
                <strong>Cookies de publicidade/terceiros:</strong> podem ser utilizados por ferramentas como Google Analytics ou redes sociais para exibir conteúdo relevante e medir a eficácia de campanhas.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">3</span>
              Cookies de terceiros
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              Alguns cookies podem ser definidos por serviços de terceiros integrados ao Site (por exemplo, mapas, botões de redes sociais, ferramentas de estatística). O tratamento desses dados segue as políticas de privacidade próprias de cada fornecedor.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">4</span>
              Como gerenciar os cookies
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              O Usuário pode, a qualquer momento, gerenciar ou desativar cookies diretamente nas configurações do navegador utilizado. A desativação de determinados cookies pode afetar o funcionamento de algumas áreas do Site.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">5</span>
              Consentimento
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              Ao continuar navegando no Site após ser informado sobre o uso de cookies (por meio de aviso/banner, quando aplicável), o Usuário consente com o uso descrito nesta Política, podendo revogar esse consentimento a qualquer momento.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">6</span>
              Alterações desta Política
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              Esta Política de Cookies pode ser atualizada periodicamente. Recomendamos a consulta periódica desta página.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">7</span>
              Contato
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              Dúvidas sobre o uso de cookies podem ser encaminhadas para:
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
              <p className="font-bold text-[#111111]">Daniel Pacheco — Corretor e Perito Judicial</p>
              <p>CRECI-38.813 • CNAI 34.653</p>
              <p className="text-[#C9A227] font-medium">www.corretordanielpacheco.com.br</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNav('politica-de-privacidade')}
                className="text-xs text-[#C9A227] hover:underline font-semibold"
              >
                Política de Privacidade
              </button>
              <span>•</span>
              <button
                onClick={() => handleNav('termos-de-uso')}
                className="text-xs text-[#C9A227] hover:underline font-semibold"
              >
                Termos de Uso
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
