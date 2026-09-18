import React from 'react';
import { ArrowLeft, ShieldCheck, FileText, Cookie, Mail, Phone, ExternalLink } from 'lucide-react';
import { SiteSettings } from '../types';

interface TermsPageProps {
  settings: SiteSettings;
  onBack: () => void;
  navigate?: (route: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ settings, onBack, navigate }) => {
  const handleNav = (route: string) => {
    if (navigate) {
      navigate(route);
    } else {
      window.location.hash = route;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="terms-page" className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 text-xs text-[#C9A227] font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Documento Legal Oficial</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-[#111111]">
            Termos de Uso
          </h1>
          <p className="text-xs text-[#5A5A5A]">
            Última atualização: 08 de setembro de 2026 • Foro da Comarca de Criciúma - SC
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-[#333333] space-y-6 text-sm leading-relaxed">
          <p className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E5E0D8] text-xs text-[#444444] leading-relaxed">
            Estes Termos de Uso regulam o acesso e a utilização do site{' '}
            <a href="https://www.corretordanielpacheco.com.br" className="text-[#C9A227] font-bold underline">
              www.corretordanielpacheco.com.br
            </a>{' '}
            (&quot;Site&quot;), de titularidade de <strong>Daniel Pacheco</strong>, corretor de imóveis inscrito no <strong>CRECI nº 38.813</strong> e <strong>CNAI nº 34.653</strong> (&quot;nós&quot;). Ao acessar ou utilizar o Site, você (&quot;Usuário&quot;) declara ter lido, compreendido e aceitado integralmente estes Termos.
          </p>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">1</span>
              Sobre o Site
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              O Site tem como finalidade divulgar imóveis para venda e/ou locação, prestar informações sobre os serviços de intermediação imobiliária e viabilizar o contato entre o Usuário e o corretor responsável.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">2</span>
              Cadastro e uso do Site
            </h2>
            <ul className="text-xs text-[#5A5A5A] space-y-2 pl-8 list-disc">
              <li>O Usuário compromete-se a fornecer informações verdadeiras, completas e atualizadas em eventuais formulários de contato ou cadastro.</li>
              <li>É vedado utilizar o Site para fins ilícitos, fraudulentos ou que violem direitos de terceiros.</li>
              <li>Reservamo-nos o direito de recusar, suspender ou cancelar o acesso de Usuários que descumprirem estes Termos.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">3</span>
              Informações sobre os imóveis
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              As informações, fotos, valores, metragens e condições dos imóveis anunciados têm caráter meramente informativo e podem ser alteradas sem aviso prévio, estando sempre sujeitas a confirmação junto ao corretor responsável antes da formalização de qualquer negócio.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">4</span>
              Propriedade intelectual
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              Todos os textos, imagens, marcas, logotipos e demais conteúdos disponibilizados no Site são de propriedade de seus respectivos titulares, sendo vedada a reprodução, distribuição ou utilização sem autorização prévia.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">5</span>
              Limitação de responsabilidade
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              Envidamos esforços para manter as informações do Site atualizadas e corretas, mas não garantimos a ausência de erros, interrupções ou indisponibilidades. O uso do Site é de responsabilidade do Usuário.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">6</span>
              Links para sites de terceiros
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              O Site pode conter links para sites de terceiros. Não nos responsabilizamos pelo conteúdo, práticas de privacidade ou funcionamento desses sites externos.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">7</span>
              Alterações destes Termos
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              Estes Termos podem ser atualizados a qualquer momento, sendo a versão vigente sempre a publicada no Site. Recomenda-se a consulta periódica desta página.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">8</span>
              Legislação e foro
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de <strong>Criciúma-SC</strong>, para dirimir eventuais controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F7F3EB] text-[#C9A227] text-xs flex items-center justify-center font-bold">9</span>
              Contato
            </h2>
            <p className="text-xs text-[#5A5A5A] leading-relaxed pl-8">
              Dúvidas sobre estes Termos podem ser encaminhadas para:
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('politica-de-privacidade')}
                className="text-xs text-[#C9A227] hover:underline font-semibold"
              >
                Política de Privacidade →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
