import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  X,
  Send,
  MessageCircle,
  Instagram,
  Star,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award,
  Building2,
  Phone,
  CornerDownLeft,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { SiteSettings, Property } from '../types';
import { createWhatsAppUrl } from '../utils/formatters';

interface AIAssistantFloatingProps {
  settings: SiteSettings;
  properties?: Property[];
  onOpenCuratedModal?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionButtons?: Array<{
    label: string;
    type: 'whatsapp' | 'instagram' | 'google' | 'curated';
    url?: string;
  }>;
}

export const AIAssistantFloating: React.FC<AIAssistantFloatingProps> = ({
  settings,
  properties = [],
  onOpenCuratedModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const realtorName = settings.realtorName || 'Daniel Pacheco';
  const realtorRole = 'Corretor e Perito Judicial';
  const creci = 'CRECI-38.813';
  const cnai = 'CNAI 34.653';
  const phone = '48 9 98001744';
  const email = settings.email || 'Daniel.pacheco@creci.org.br';
  const instagramUrl = settings.instagram || 'https://instagram.com/corretordanielpacheco';
  
  const defaultWhatsAppUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel Pacheco! Falei com a sua Assistente IA no site e gostaria de um atendimento direto com você.'
  );

  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    'Daniel Pacheco Corretor e Perito Judicial CRECI 38813 CNAI 34653 Criciuma SC'
  )}`;

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Olá! Sou a Assistente Virtual de **${realtorName}** (${realtorRole} • ${creci} • ${cnai}).\n\nAtuamos em toda a região da **AMREC** no Sul de Santa Catarina. Como posso te ajudar hoje com terrenos, lançamentos na planta ou avaliações periciais?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionButtons: [
        {
          label: 'Falar no WhatsApp (48 9 98001744)',
          type: 'whatsapp',
          url: defaultWhatsAppUrl,
        },
        {
          label: 'Instagram @corretordanielpacheco',
          type: 'instagram',
          url: instagramUrl,
        },
      ],
    },
  ]);

  // Suggested Quick Question Chips
  const quickQuestions = [
    { label: '👤 Quem é o Daniel Pacheco?', query: 'Quem é o corretor Daniel Pacheco e qual sua trajetória?' },
    { label: '🏢 Imóveis na Planta & Construtora', query: 'Como o Daniel ajuda na compra de imóveis na planta direto da construtora?' },
    { label: '📐 Avaliação de Imóveis (CNAI)', query: 'O Daniel faz avaliação de imóveis com registro CNAI?' },
    { label: '📍 Cidades Atendidas', query: 'Quais cidades e regiões do Sul de Santa Catarina o Daniel atende?' },
    { label: '📲 Redes Sociais & Contato', query: 'Quais são as redes sociais oficiais e WhatsApp do Daniel?' },
    { label: '⭐ Certificado 5.0 Google', query: 'Qual é a reputação e avaliação do Daniel no Google?' },
  ];

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  // Intelligent Knowledge Matching Engine
  const generateAIResponse = (query: string): { text: string; actionButtons: ChatMessage['actionButtons'] } => {
    const q = query.toLowerCase().trim();

    // 1. Quem é o Daniel Pacheco / Trajetória / Experiência
    if (
      q.includes('quem é') ||
      q.includes('quem e') ||
      q.includes('sobre o daniel') ||
      q.includes('trajetoria') ||
      q.includes('trajetória') ||
      q.includes('historia') ||
      q.includes('história') ||
      q.includes('experiencia') ||
      q.includes('experiência') ||
      q.includes('creci') ||
      q.includes('tempo de mercado')
    ) {
      const waUrl = createWhatsAppUrl(
        settings.whatsapp || '5548998001744',
        'Olá Daniel! Gostaria de conversar com você sobre consultoria imobiliária.'
      );
      return {
        text: `O **Daniel Pacheco** é **Corretor e Perito Judicial** com sólida experiência e credibilidade no mercado imobiliário do Sul de Santa Catarina.\n\n` +
          `🔹 **Credenciais Oficiais:** ${creci} • ${cnai} (Perito Avaliador Judicial do COFECI).\n` +
          `🔹 **Contato Direto:** 48 9 98001744.\n` +
          `🔹 **Atuação:** Imóveis prontos, lançamentos na planta e loteamentos em toda a região da AMREC, além de laudos periciais e avaliações mercadológicas de alta precisão.\n\n` +
          `Deseja conversar com ele pessoalmente no WhatsApp ou acompanhar os stories no Instagram?`,
        actionButtons: [
          { label: 'Conversar no WhatsApp', type: 'whatsapp', url: waUrl },
          { label: 'Ver Perfil no Instagram', type: 'instagram', url: instagramUrl },
        ],
      };
    }

    // 2. Redes Sociais / Instagram / Contato / Telefone
    if (
      q.includes('instagram') ||
      q.includes('rede social') ||
      q.includes('redes') ||
      q.includes('social') ||
      q.includes('insta') ||
      q.includes('telefone') ||
      q.includes('whatsapp') ||
      q.includes('whats') ||
      q.includes('zap') ||
      q.includes('contato') ||
      q.includes('email') ||
      q.includes('e-mail')
    ) {
      return {
        text: `Aqui estão todos os canais e redes sociais oficiais de **Daniel Pacheco** (Corretor e Perito Judicial):\n\n` +
          `📱 **WhatsApp / Telefone:** 48 9 98001744\n` +
          `📸 **Instagram Oficial:** @corretordanielpacheco\n` +
          `✉️ **E-mail Corporativo:** Daniel.pacheco@creci.org.br\n` +
          `🆔 **Registros:** ${creci} • ${cnai}\n` +
          `⭐ **Google Meu Negócio:** Avaliação 5.0 Estrelas\n\n` +
          `Toque abaixo para ser direcionado agora mesmo:`,
        actionButtons: [
          { label: 'Abrir WhatsApp (48 9 98001744)', type: 'whatsapp', url: defaultWhatsAppUrl },
          { label: 'Acessar Instagram @corretordanielpacheco', type: 'instagram', url: instagramUrl },
          { label: 'Ver no Google', type: 'google', url: googleSearchUrl },
        ],
      };
    }

    // 3. Imóveis na Planta / Terrenos / Construtora / Financiamento
    if (
      q.includes('planta') ||
      q.includes('construtora') ||
      q.includes('lancamento') ||
      q.includes('lançamento') ||
      q.includes('financiamento direto') ||
      q.includes('parcelamento') ||
      q.includes('cub') ||
      q.includes('terreno') ||
      q.includes('lote') ||
      q.includes('loteamento')
    ) {
      const waUrl = createWhatsAppUrl(
        settings.whatsapp || '5548998001744',
        'Olá Daniel! Gostaria de consultar opções de terrenos e lançamentos na planta com financiamento direto.'
      );
      return {
        text: `O Daniel Pacheco assessora você diretamente com as melhores construtoras e loteadoras do Sul de SC:\n\n` +
          `✨ **Condições para Terrenos e Loteamentos:**\n` +
          `• Parcelamento direto em **até 120 vezes pela variação do CUB**, ou em **até 240 vezes com correções**, com entrada facilitada e sem burocracia bancária.\n\n` +
          `✨ **Apartamentos na Planta:**\n` +
          `• Parcelamento direto durante a obra, entrada reduzida e alto potencial de valorização (20% a 40%+ até a entrega).\n\n` +
          `Deseja que o Daniel te envie as tabelas e opções disponíveis pelo WhatsApp?`,
        actionButtons: [
          { label: 'Solicitar Tabelas no WhatsApp', type: 'whatsapp', url: waUrl },
          { label: 'Ver Loteamentos no Instagram', type: 'instagram', url: instagramUrl },
        ],
      };
    }

    // 4. Avaliação Imobiliária CNAI / Perito
    if (
      q.includes('cnai') ||
      q.includes('avaliacao') ||
      q.includes('avaliação') ||
      q.includes('avaliar') ||
      q.includes('quanto vale') ||
      q.includes('perito') ||
      q.includes('laudo')
    ) {
      const waUrl = createWhatsAppUrl(
        settings.whatsapp || '5548998001744',
        'Olá Daniel! Possuo um imóvel e gostaria de solicitar uma avaliação com registro CNAI.'
      );
      return {
        text: `Sim! Daniel Pacheco é **Corretor e Perito Judicial** credenciado com o registro **${cnai}** no COFECI:\n\n` +
          `📋 **Serviços Periciais e de Avaliação:**\n` +
          `• Elaboração de PTAM (Parecer Técnico de Avaliação Mercadológica).\n` +
          `• Avaliação técnica para inventários, partilhas judiciais, compra, venda e garantias.\n` +
          `• Determinação fundamentada do valor real de mercado com rigor técnico.\n\n` +
          `Você pode solicitar uma consultoria ou orçamento diretamente com ele:`,
        actionButtons: [
          { label: 'Solicitar Avaliação CNAI (48 9 98001744)', type: 'whatsapp', url: waUrl },
          { label: 'Conhecer o Trabalho no Instagram', type: 'instagram', url: instagramUrl },
        ],
      };
    }

    // 5. Cidades / Regiões Atendidas (AMREC 12 Municípios)
    if (
      q.includes('cidade') ||
      q.includes('regiao') ||
      q.includes('região') ||
      q.includes('amrec') ||
      q.includes('criciuma') ||
      q.includes('criciúma') ||
      q.includes('rincao') ||
      q.includes('rincão') ||
      q.includes('balneario') ||
      q.includes('balneário') ||
      q.includes('icara') ||
      q.includes('içara') ||
      q.includes('onde atende')
    ) {
      const waUrl = createWhatsAppUrl(
        settings.whatsapp || '5548998001744',
        'Olá Daniel! Gostaria de consultar opções de imóveis nas cidades atendidas da AMREC.'
      );
      return {
        text: `A consultoria imobiliária atende a região da **AMREC**:\n\n` +
          `📍 **AMREC (Associação dos Municípios da Região Carbonífera) é integrada por 12 municípios localizados no sul de SC:**\n` +
          `1. **Criciúma (sede)**\n` +
          `2. **Balneário Rincão**\n` +
          `3. **Cocal do Sul**\n` +
          `4. **Forquilhinha**\n` +
          `5. **Içara**\n` +
          `6. **Lauro Müller**\n` +
          `7. **Morro da Fumaça**\n` +
          `8. **Nova Veneza**\n` +
          `9. **Orleans**\n` +
          `10. **Siderópolis**\n` +
          `11. **Treviso**\n` +
          `12. **Urussanga**\n\n` +
          `*(Observação: Não atuamos em Tubarão, concentrando nossa total expertise técnica e comercial nos 12 municípios da AMREC).*`,
        actionButtons: [
          { label: 'Consultar Imóveis na AMREC no WhatsApp', type: 'whatsapp', url: waUrl },
          { label: 'Ver Cidades no Instagram', type: 'instagram', url: instagramUrl },
        ],
      };
    }

    // 6. Google Reviews / Certificado 5.0
    if (
      q.includes('google') ||
      q.includes('avaliacao google') ||
      q.includes('estrelas') ||
      q.includes('certificado') ||
      q.includes('reputacao') ||
      q.includes('reputação') ||
      q.includes('confiavel') ||
      q.includes('confiável')
    ) {
      return {
        text: `O Daniel Pacheco é reconhecido com **Certificado de Excelência Máxima de 5.0 Estrelas no Google**! ⭐⭐⭐⭐⭐\n\n` +
          `Todos os clientes destacam a pontualidade, domínio técnico de contratos e o atendimento acolhedor desde o primeiro contato até a entrega das chaves.\n\n` +
          `Você pode checar os depoimentos verificados diretamente no Google ou no Instagram do Daniel:`,
        actionButtons: [
          { label: 'Conferir Avaliações no Google', type: 'google', url: googleSearchUrl },
          { label: 'Ver Depoimentos no Instagram', type: 'instagram', url: instagramUrl },
          { label: 'Falar com Daniel no WhatsApp', type: 'whatsapp', url: defaultWhatsAppUrl },
        ],
      };
    }

    // Default Fallback: helpful overview + directing to socials & WhatsApp
    const dynamicWaUrl = createWhatsAppUrl(
      settings.whatsapp || '5548998001744',
      `Olá Daniel Pacheco! Estava tirando dúvidas com sua IA sobre "${query}" e gostaria de sua ajuda.`
    );

    return {
      text: `Excelente pergunta! O corretor **Daniel Pacheco** (${creci} • ${cnai}) atua de forma personalizada para cada cliente, cuidando de toda a parte burocrática, negociação direta e consultoria exclusiva no Sul de Santa Catarina.\n\n` +
        `Para um atendimento sob medida e detalhes precisos sobre "${query}", recomendo falar diretamente com ele pelo WhatsApp ou conferir os conteúdos recentes no Instagram oficial!`,
      actionButtons: [
        { label: 'Falar com Daniel no WhatsApp', type: 'whatsapp', url: dynamicWaUrl },
        { label: 'Acessar Instagram @danielpacheco.imoveis', type: 'instagram', url: instagramUrl },
        { label: 'Ver Avaliações no Google', type: 'google', url: googleSearchUrl },
      ],
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate natural AI thinking delay
    setTimeout(() => {
      const { text, actionButtons } = generateAIResponse(query);
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButtons,
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-welcome-reset',
        sender: 'ai',
        text: `Chat reiniciado! Olá, como posso te ajudar sobre os imóveis e o trabalho do corretor **${realtorName}**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButtons: [
          { label: 'Falar no WhatsApp', type: 'whatsapp', url: defaultWhatsAppUrl },
          { label: 'Ver Instagram', type: 'instagram', url: instagramUrl },
        ],
      },
    ]);
  };

  return (
    <div className="fixed bottom-12 sm:bottom-14 left-4 sm:left-6 z-40 flex flex-col items-start gap-3 pointer-events-auto select-none">
      {/* Floating AI Button (Left Side, Non-Intrusive) */}
      {!isOpen && (
        <div className="flex items-center gap-2.5">
          <button
            id="ai-floating-trigger-btn"
            onClick={() => {
              setIsOpen(true);
              setShowTooltip(false);
            }}
            className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0A0A0A] hover:bg-[#222222] border border-[#C9A227]/60 text-[#FFFFFF] shadow-xl hover:border-[#C9A227] transition-all group cursor-pointer"
            title="Abrir Assistente Virtual de Imóveis"
          >
            {/* Glowing AI Icon */}
            <div className="relative w-7 h-7 rounded-full bg-[#C9A227] flex items-center justify-center text-[#0A0A0A] shadow-md group-hover:scale-110 transition-transform">
              <Bot className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#1F8A4C] border border-[#0A0A0A] rounded-full" />
            </div>

            <div className="text-left hidden sm:block">
              <span className="text-[11px] font-bold text-[#FFFFFF] block leading-none">
                Assistente IA
              </span>
              <span className="text-[9px] text-[#C9A227] font-semibold tracking-wider uppercase block mt-0.5">
                Imóveis & Loteamentos
              </span>
            </div>

            <Sparkles className="w-3.5 h-3.5 text-[#C9A227] animate-pulse" />
          </button>
        </div>
      )}

      {/* 3. AI Chat Box Modal Window */}
      {isOpen && (
        <div
          id="ai-chat-window"
          className="w-[92vw] sm:w-[400px] md:w-[430px] h-[540px] sm:h-[580px] max-h-[85vh] bg-[#FFFFFF] border border-[#E5E0D8] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 z-50 text-[#111111]"
        >
          {/* Header */}
          <div className="p-4 bg-[#F7F3EB] border-b border-[#E5E0D8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-[#0A0A0A] p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#0A0A0A] rounded-[14px] flex items-center justify-center text-[#C9A227]">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#1F8A4C] border-2 border-[#FFFFFF] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold font-serif-luxury text-[#111111]">
                    Assistente Daniel Pacheco
                  </h4>
                  <span className="px-1.5 py-0.5 rounded bg-[#C9A227]/20 text-[#0A0A0A] text-[9px] font-bold border border-[#C9A227]/40">
                    IA Oficial
                  </span>
                </div>
                <p className="text-[10px] text-[#5A5A5A]">
                  {creci} • {cnai}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-2 text-[#5A5A5A] hover:text-[#C9A227] rounded-xl hover:bg-black/5 transition-colors cursor-pointer"
                title="Reiniciar Conversa"
                aria-label="Reiniciar conversa"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-[#5A5A5A] hover:text-[#111111] rounded-xl hover:bg-black/5 transition-colors cursor-pointer"
                title="Fechar Chat"
                aria-label="Fechar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Social Media & Fast Links Top Bar */}
          <div className="px-3.5 py-2 bg-[#FFFFFF] border-b border-[#E5E0D8] flex items-center justify-between text-[11px]">
            <span className="text-[10px] font-bold text-[#5A5A5A] uppercase tracking-wider">
              Acesso Rápido:
            </span>
            <div className="flex items-center gap-1.5">
              <a
                href={defaultWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-[#1F8A4C]/15 hover:bg-[#1F8A4C] text-[#1F8A4C] hover:text-white font-semibold text-[10px] flex items-center gap-1 transition-colors"
                title="WhatsApp Daniel Pacheco"
              >
                <MessageCircle className="w-3 h-3 fill-current" />
                <span>WhatsApp</span>
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-pink-500/15 hover:bg-pink-600 text-pink-600 hover:text-white font-semibold text-[10px] flex items-center gap-1 transition-colors"
                title="Instagram @danielpacheco.imoveis"
              >
                <Instagram className="w-3 h-3" />
                <span>Instagram</span>
              </a>
              <a
                href={googleSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 rounded-lg bg-[#F7F3EB] hover:bg-[#EAE4D8] text-[#111111] font-semibold text-[10px] flex items-center gap-1 transition-colors border border-[#E5E0D8]"
                title="Avaliações Google 5.0"
              >
                <Star className="w-3 h-3 text-[#C9A227] fill-current" />
                <span>5.0</span>
              </a>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-[#DDD] scrollbar-track-transparent bg-[#FFFFFF]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0A0A0A] text-[#FFFFFF] font-medium rounded-tr-none shadow-sm'
                      : 'bg-[#F7F3EB] border border-[#E5E0D8] text-[#111111] rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {/* Message formatted with markdown bold support */}
                  <div>
                    {msg.text.split('\n').map((line, lIdx) => (
                      <p key={lIdx} className={lIdx > 0 ? 'mt-2' : ''}>
                        {line.split('**').map((chunk, cIdx) =>
                          cIdx % 2 === 1 ? (
                            <strong key={cIdx} className={msg.sender === 'user' ? 'font-bold text-[#FFFFFF]' : 'font-bold text-[#111111]'}>
                              {chunk}
                            </strong>
                          ) : (
                            chunk
                          )
                        )}
                      </p>
                    ))}
                  </div>

                  <span
                    className={`text-[9px] block text-right mt-1.5 ${
                      msg.sender === 'user' ? 'text-white/60' : 'text-[#5A5A5A]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* Optional Action CTA Buttons attached to AI Message */}
                {msg.sender === 'ai' && msg.actionButtons && msg.actionButtons.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 max-w-[88%]">
                    {msg.actionButtons.map((btn, bIdx) => (
                      <a
                        key={bIdx}
                        href={btn.url || defaultWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                          btn.type === 'whatsapp'
                            ? 'bg-[#1F8A4C] hover:bg-[#197A42] text-white'
                            : btn.type === 'instagram'
                            ? 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white hover:opacity-90'
                            : 'bg-[#0A0A0A] hover:bg-[#222222] text-[#FFFFFF]'
                        }`}
                      >
                        {btn.type === 'whatsapp' && <MessageCircle className="w-3.5 h-3.5 fill-current" />}
                        {btn.type === 'instagram' && <Instagram className="w-3.5 h-3.5" />}
                        {btn.type === 'google' && <Star className="w-3.5 h-3.5 text-[#C9A227] fill-current" />}
                        <span>{btn.label}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 p-3 bg-[#F7F3EB] border border-[#E5E0D8] rounded-2xl rounded-tl-none w-fit text-[#5A5A5A] text-xs">
                <Bot className="w-3.5 h-3.5 text-[#C9A227] animate-spin" />
                <span className="text-[11px]">Assistente digitando resposta...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Suggestions Scroll Bar */}
          <div className="px-3 py-2 bg-[#F7F3EB] border-t border-[#E5E0D8] overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.query)}
                className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#0A0A0A] hover:text-[#FFFFFF] border border-[#E5E0D8] text-[#5A5A5A] text-[10px] font-medium transition-colors shrink-0 cursor-pointer shadow-xs"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <div className="p-3 bg-[#F7F3EB] border-t border-[#E5E0D8] flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua dúvida ou peça contato..."
              className="flex-1 bg-[#FFFFFF] border border-[#E5E0D8] focus:border-[#C9A227] text-xs text-[#111111] placeholder-[#5A5A5A] rounded-xl px-3.5 py-2.5 outline-none transition-colors"
            />
            <button
              id="ai-chat-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isTyping}
              className="p-2.5 rounded-xl bg-[#1F8A4C] hover:bg-[#197A42] disabled:opacity-40 text-white font-bold shadow-sm transition-all cursor-pointer"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
