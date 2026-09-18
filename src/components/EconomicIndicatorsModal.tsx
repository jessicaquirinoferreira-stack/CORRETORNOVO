import React, { useState, useEffect } from 'react';
import { 
  X, 
  TrendingUp, 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  Info, 
  Calendar, 
  Layers,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';

export type IndicatorTab = 'cub' | 'igpm';

interface EconomicIndicatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: IndicatorTab;
}

export const EconomicIndicatorsModal: React.FC<EconomicIndicatorsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'cub',
}) => {
  const [activeTab, setActiveTab] = useState<IndicatorTab>(initialTab);
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [iframeError, setIframeError] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setIframeLoaded(false);
      setIframeError(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, initialTab, onClose]);

  // Reset iframe state when switching tabs
  const handleTabChange = (tab: IndicatorTab) => {
    setActiveTab(tab);
    setIframeLoaded(false);
    setIframeError(false);
  };

  if (!isOpen) return null;

  const cubOfficialUrl = 'https://sinduscon-fpolis.org.br/';
  const igpmOfficialUrl = 'https://portalibre.fgv.br/temas-de-estudo/indices-e-indicadores/igp-m';

  return (
    <div 
      id="economic-indicators-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="economic-indicators-modal-card"
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#111111] text-[#E5E0D8] border border-[#2A2A2A] rounded-2xl shadow-2xl overflow-hidden animate-scaleUp"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[#2A2A2A] bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#C9A227] font-semibold block">
                Mercado Imobiliário & Construção
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                Indicadores da Construção e Economia
              </h3>
            </div>
          </div>

          <button
            id="close-economic-indicators-btn"
            onClick={onClose}
            className="p-2 rounded-lg bg-[#1A1A1A] hover:bg-[#262626] border border-[#333333] text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Fechar Janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#2A2A2A] bg-[#0E0E0E] px-5 sm:px-7 pt-2 gap-2">
          <button
            id="tab-btn-cub"
            onClick={() => handleTabChange('cub')}
            className={`pb-3 pt-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'cub'
                ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5 rounded-t-lg'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>CUB – Santa Catarina</span>
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#1F8A4C]/20 text-[#1F8A4C] font-mono font-normal">
              Sinduscon
            </span>
          </button>

          <button
            id="tab-btn-igpm"
            onClick={() => handleTabChange('igpm')}
            className={`pb-3 pt-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'igpm'
                ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5 rounded-t-lg'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>IGP-M – Mercado</span>
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono font-normal">
              FGV IBRE
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {activeTab === 'cub' ? (
            /* ==================== CUB CONTENT ==================== */
            <div className="space-y-6">
              {/* Context Card */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#181818] border border-[#2A2A2A] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-[#C9A227]/15 text-[#C9A227] text-xs font-bold font-mono uppercase tracking-wider border border-[#C9A227]/30">
                      Fonte Oficial Sinduscon Florianópolis
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#1F8A4C]" />
                      Base Legal: Lei Federal 4.591/64 & NBR 12.721
                    </span>
                  </div>

                  <a
                    id="cub-open-external-btn"
                    href={cubOfficialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#C9A227] hover:bg-[#B89220] text-black font-semibold text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    <span>Abrir Portal Oficial (sinduscon-fpolis.org.br)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
                  <p>
                    O <strong>Custo Unitário Básico (CUB/SC)</strong> é o principal indicador da evolução dos custos na construção civil no Estado de Santa Catarina. É calculado e divulgado mensalmente pelo <strong>Sindicato da Indústria da Construção Civil (Sinduscon)</strong>.
                  </p>
                  <p className="text-gray-400 text-xs">
                    • <strong>Aplicação em Imóveis na Planta:</strong> É o índice padrão regulamentado por lei utilizado pelas construtoras e incorporadoras para a correção monetária das parcelas e balões durante a fase de obras, refletindo a variação real de materiais, mão de obra e equipamentos.
                  </p>
                </div>
              </div>

              {/* Consultation Guide & Interactive Container */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#C9A227]" />
                    <span>Consulta Integrada do CUB / SC</span>
                  </h4>
                  <span className="text-[11px] text-gray-400">
                    Sindicato da Indústria da Construção Civil da Grande Florianópolis
                  </span>
                </div>

                {/* Embedded Frame View with Graceful Fallback */}
                <div className="relative w-full h-[380px] sm:h-[420px] rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#2A2A2A]">
                  {!iframeLoaded && !iframeError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#111111] z-10 p-6 text-center">
                      <RefreshCw className="w-6 h-6 text-[#C9A227] animate-spin" />
                      <p className="text-xs text-gray-300">Carregando portal oficial do Sinduscon...</p>
                      <p className="text-[11px] text-gray-500 max-w-sm">
                        Caso as políticas de segurança do navegador restrinjam a visualização interna, utilize o botão abaixo para consultar na página oficial.
                      </p>
                    </div>
                  )}

                  <iframe
                    src={cubOfficialUrl}
                    title="Sinduscon Florianópolis - Consulta CUB Santa Catarina"
                    className="w-full h-full border-0"
                    onLoad={() => setIframeLoaded(true)}
                    onError={() => {
                      setIframeError(true);
                      setIframeLoaded(true);
                    }}
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />

                  {/* Fallback Banner at Bottom */}
                  <div className="absolute bottom-0 inset-x-0 bg-[#141414]/95 backdrop-blur-md border-t border-[#2A2A2A] px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 z-20">
                    <div className="flex items-center gap-2 text-[11px] text-gray-300">
                      <Info className="w-4 h-4 text-[#C9A227] shrink-0" />
                      <span>Dados oficiais mantidos e apurados diretamente pelo Sinduscon-FPolis.</span>
                    </div>
                    <a
                      href={cubOfficialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#C9A227] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Acessar sinduscon-fpolis.org.br</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ==================== IGP-M CONTENT ==================== */
            <div className="space-y-6">
              {/* Context Card */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#181818] border border-[#2A2A2A] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-blue-500/15 text-blue-400 text-xs font-bold font-mono uppercase tracking-wider border border-blue-500/30">
                      Fonte Oficial FGV IBRE / Banco Central
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
                      Divulgação Mensal pela Fundação Getulio Vargas
                    </span>
                  </div>

                  <a
                    id="igpm-open-external-btn"
                    href={igpmOfficialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#C9A227] hover:bg-[#B89220] text-black font-semibold text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    <span>Abrir Portal Oficial (FGV IBRE)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
                  <p>
                    O <strong>IGP-M (Índice Geral de Preços – Mercado)</strong> é calculado e divulgado mensalmente pelo <strong>Instituto Brasileiro de Economia da Fundação Getulio Vargas (FGV IBRE)</strong>.
                  </p>
                  <p className="text-gray-400 text-xs">
                    • <strong>Composição do Índice:</strong> Formado pelo IPA-M (Índice de Preços ao Produtor Amplo - 60%), IPC-M (Índice de Preços ao Consumidor - 30%) e INCC-M (Índice Nacional de Custo da Construção - 10%).
                  </p>
                  <p className="text-gray-400 text-xs">
                    • <strong>Aplicação Imobiliária:</strong> Amplamente utilizado na correção de contratos de locação residencial e comercial, bem como em financiamentos imobiliários de longo prazo e tabelas diretas pós-entrega.
                  </p>
                </div>
              </div>

              {/* Consultation Guide & Interactive Container */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#C9A227]" />
                    <span>Consulta ao Portal Oficial FGV IBRE</span>
                  </h4>
                  <span className="text-[11px] text-gray-400">
                    Indicadores Econômicos e Séries Históricas
                  </span>
                </div>

                {/* Embedded Frame View with Graceful Fallback */}
                <div className="relative w-full h-[380px] sm:h-[420px] rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#2A2A2A]">
                  {!iframeLoaded && !iframeError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#111111] z-10 p-6 text-center">
                      <RefreshCw className="w-6 h-6 text-[#C9A227] animate-spin" />
                      <p className="text-xs text-gray-300">Carregando portal oficial FGV IBRE...</p>
                      <p className="text-[11px] text-gray-500 max-w-sm">
                        Caso as políticas de segurança da instituição restrinjam a incorporação, utilize o link de acesso direto abaixo.
                      </p>
                    </div>
                  )}

                  <iframe
                    src={igpmOfficialUrl}
                    title="FGV IBRE - Consulta IGP-M Oficial"
                    className="w-full h-full border-0"
                    onLoad={() => setIframeLoaded(true)}
                    onError={() => {
                      setIframeError(true);
                      setIframeLoaded(true);
                    }}
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />

                  {/* Fallback Banner at Bottom */}
                  <div className="absolute bottom-0 inset-x-0 bg-[#141414]/95 backdrop-blur-md border-t border-[#2A2A2A] px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 z-20">
                    <div className="flex items-center gap-2 text-[11px] text-gray-300">
                      <Info className="w-4 h-4 text-[#C9A227] shrink-0" />
                      <span>Índice calculado e publicado oficialmente pelo Instituto Brasileiro de Economia (FGV IBRE).</span>
                    </div>
                    <a
                      href={igpmOfficialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#C9A227] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Acessar portalibre.fgv.br</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-t border-[#2A2A2A] bg-[#141414] text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1F8A4C]" />
            <span>Consultoria Imobiliária Transparente & Regulamentada</span>
          </div>

          <button
            id="close-economic-modal-bottom-btn"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#222222] hover:bg-[#2E2E2E] text-gray-200 hover:text-white border border-[#333333] transition-colors cursor-pointer text-xs font-semibold"
          >
            Fechar Consulta
          </button>
        </div>
      </div>
    </div>
  );
};
