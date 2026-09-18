import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Volume2, VolumeX, ArrowRight, Compass, Building2, ShieldCheck, Key } from 'lucide-react';

export const OFFICIAL_LOGO_URL = 'https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png';

interface CinematicIntroProps {
  onComplete: () => void;
  realtorName?: string;
  creci?: string;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onComplete,
  realtorName = 'Daniel Pacheco',
  creci = 'CRECI: 38 813 • CNAI: 34 653',
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(3);
  const [progress, setProgress] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activePhase, setActivePhase] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play luxury harmonic sound using Web Audio API
  const playHarmonicChime = (freq = 440, type: OscillatorType = 'sine', duration = 1.2) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      // Soft pitch bend upward for luxury shimmer
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not supported or blocked, graceful fallback
    }
  };

  // 3-Second Timer Loop
  useEffect(() => {
    const totalDurationMs = 3000;
    const intervalMs = 25;
    const startTime = Date.now();

    // Trigger initial chime
    playHarmonicChime(329.63, 'sine', 1.0); // E4 note

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsed / totalDurationMs) * 100);
      const remainingSecs = Math.max(0, Math.ceil((totalDurationMs - elapsed) / 1000));

      setProgress(currentProgress);
      setSecondsLeft(remainingSecs);

      // Phase transitions with sound cues
      if (elapsed >= 800 && elapsed < 900) {
        setActivePhase(2);
        playHarmonicChime(493.88, 'triangle', 1.0); // B4 note
      } else if (elapsed >= 1700 && elapsed < 1800) {
        setActivePhase(3);
        playHarmonicChime(659.25, 'sine', 1.0); // E5 note
      } else if (elapsed >= 2500 && elapsed < 2600) {
        setActivePhase(4);
        playHarmonicChime(987.77, 'sine', 0.8); // B5 high shimmer
      }

      if (elapsed >= totalDurationMs) {
        clearInterval(timer);
        onComplete();
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [onComplete, soundEnabled]);

  // Gold luxury star/particle background on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle definition
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      pulse: number;
      color: string;
    }

    const particles: Particle[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.8 - 0.2, // Drift upward
      opacity: Math.random() * 0.7 + 0.3,
      pulse: Math.random() * 0.05 + 0.01,
      color: Math.random() > 0.4 ? '#C9A227' : '#111111',
    }));

    // Floating rays
    let rayAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radial warm gold ambient glow in center
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        20,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.65
      );
      gradient.addColorStop(0, 'rgba(201, 162, 39, 0.18)');
      gradient.addColorStop(0.45, 'rgba(247, 243, 235, 0.92)');
      gradient.addColorStop(1, '#F7F3EB');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Rotating subtle golden light sweep rays
      rayAngle += 0.0025;
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(rayAngle);
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const a1 = (i * Math.PI) / 3;
        const a2 = a1 + 0.25;
        const r = Math.max(width, height);
        ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
        ctx.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
        ctx.closePath();
        ctx.fillStyle = 'rgba(201, 162, 39, 0.035)';
        ctx.fill();
      }
      ctx.restore();

      // Render gold sparkles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += Math.sin(Date.now() * p.pulse) * 0.02;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color === '#C9A227' 
          ? `rgba(201, 162, 39, ${Math.max(0.2, Math.min(0.9, p.opacity))})` 
          : `rgba(17, 17, 17, ${Math.max(0.1, Math.min(0.35, p.opacity * 0.4))})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#C9A227';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <motion.div
      id="cinematic-intro-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-[#F7F3EB] text-[#111111] overflow-hidden select-none"
    >
      {/* Background Interactive Star & Ray Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Rotating Background Gold Concentric Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          className="w-[500px] h-[500px] sm:w-[680px] sm:h-[680px] rounded-full border border-dashed border-[#C9A227]/30 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] rounded-full border border-[#C9A227]/25 flex items-center justify-center"
          >
            <div className="w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] rounded-full border border-dotted border-[#C9A227]/35" />
          </motion.div>
        </motion.div>
      </div>

      {/* Top Bar Controls */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between relative z-20">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#0A0A0A] font-semibold">
          <Sparkles className="w-4 h-4 text-[#C9A227] animate-spin" style={{ animationDuration: '6s' }} />
          <span>Consultoria Imobiliária</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            id="intro-sound-toggle"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-full bg-white hover:bg-[#EAE4D8] border border-[#E5E0D8] text-[#111111] transition-colors cursor-pointer shadow-sm"
            title={soundEnabled ? 'Silenciar Áudio' : 'Ativar Efeitos Sonoros'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#C9A227]" /> : <VolumeX className="w-4 h-4 text-[#8A8A8A]" />}
          </button>

          {/* Skip Intro Button */}
          <button
            id="intro-skip-btn"
            onClick={onComplete}
            className="px-4 py-2 rounded-full bg-[#0A0A0A] hover:bg-[#222222] text-white border border-[#0A0A0A] hover:border-[#C9A227] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <span>Pular Entrada</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C9A227]" />
          </button>
        </div>
      </header>

      {/* Center Stage: The 6-Second Multi-Effect Reveal */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center my-auto max-w-4xl w-full px-4">
        {/* Cinematic Multi-Layer Gold Core Glow */}
        <div className="absolute w-[340px] h-[340px] sm:w-[540px] sm:h-[540px] bg-gradient-to-r from-[#C9A227]/25 via-amber-300/30 to-[#C9A227]/25 rounded-full blur-[90px] pointer-events-none animate-pulse" />
        <div className="absolute w-[220px] h-[220px] sm:w-[380px] sm:h-[380px] bg-[#C9A227]/20 rounded-full blur-[50px] pointer-events-none" />

        {/* 1. Official Logo Container - Large, Complete & Uncropped with Metallic Shimmer */}
        <motion.div
          initial={{ scale: 0.82, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative group w-full flex flex-col items-center justify-center my-2"
        >
          {/* Subtle Ambient Golden Accent Frame & Corner Accents */}
          <div className="relative w-full max-w-xl sm:max-w-2xl lg:max-w-3xl flex items-center justify-center p-4 sm:p-6 bg-white/70 backdrop-blur-md rounded-3xl border border-[#E5E0D8] shadow-xl">
            <img
              src={OFFICIAL_LOGO_URL}
              alt="Daniel Pacheco Consultoria Imobiliária - Logo Oficial Completa"
              className="w-full h-auto max-h-[240px] sm:max-h-[300px] lg:max-h-[340px] object-contain brightness-0 contrast-200 transition-transform duration-700 hover:scale-[1.02]"
            />

            {/* Metallic Light Sweep Animation Across the Full Logo */}
            <motion.div
              animate={{ x: ['-200%', '250%'] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-25 pointer-events-none"
            />
          </div>
        </motion.div>

        {/* 2. Sub-Tagline & Regional Authority */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-2 mt-4"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-[#C9A227]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-[#0A0A0A] font-bold">
              Alto Padrão & Lançamentos Exclusivos
            </span>
            <span className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-[#C9A227]" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-[#5A5A5A] font-medium tracking-wider">
            <span>Criciúma</span>
            <span className="text-[#C9A227]">•</span>
            <span>Balneário Rincão</span>
            <span className="text-[#C9A227]">•</span>
            <span>Içara</span>
            <span className="text-[#C9A227]">•</span>
            <span>Sul Catarinense</span>
          </div>
        </motion.div>

        {/* 3. Real-Time Phase Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 text-xs"
        >
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all duration-500 ${
            activePhase >= 1 ? 'border-[#C9A227] text-[#111111] bg-white shadow-sm font-semibold' : 'border-[#E5E0D8] text-[#5A5A5A] bg-white/50'
          }`}>
            <Building2 className="w-3.5 h-3.5 text-[#C9A227]" />
            <span className="text-[10px] sm:text-xs tracking-wider">Empreendimentos Oficiais</span>
          </div>

          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all duration-500 ${
            activePhase >= 2 ? 'border-[#C9A227] text-[#111111] bg-white shadow-sm font-semibold' : 'border-[#E5E0D8] text-[#5A5A5A] bg-white/50'
          }`}>
            <Key className="w-3.5 h-3.5 text-[#C9A227]" />
            <span className="text-[10px] sm:text-xs tracking-wider">Financiamento Direto</span>
          </div>

          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all duration-500 ${
            activePhase >= 3 ? 'border-[#1F8A4C] text-[#111111] bg-white shadow-sm font-semibold' : 'border-[#E5E0D8] text-[#5A5A5A] bg-white/50'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5 text-[#1F8A4C]" />
            <span className="text-[10px] sm:text-xs tracking-wider">{creci}</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar: 6-Second Radial Countdown & Linear Progress Bar */}
      <footer className="w-full max-w-4xl mx-auto relative z-20 space-y-3">
        <div className="flex items-center justify-between text-xs text-[#5A5A5A] font-mono">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#1F8A4C] animate-ping" />
            <span className="text-[#111111] font-medium">Iniciando experiência imobiliária...</span>
          </div>

          {/* 6-Second Circular Countdown Badge */}
          <div className="flex items-center gap-2 bg-white border border-[#E5E0D8] px-3 py-1 rounded-full shadow-sm">
            <div className="relative w-5 h-5 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#E5E0D8]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#C9A227] transition-all duration-100 ease-linear"
                  strokeDasharray={`${progress}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
            <span className="text-[#0A0A0A] font-bold">{secondsLeft}s</span>
          </div>
        </div>

        {/* Glowing Linear Progress Bar */}
        <div className="w-full h-1.5 bg-[#E5E0D8] rounded-full overflow-hidden border border-[#E5E0D8] p-[1px]">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C9A227] via-amber-500 to-[#1F8A4C] rounded-full shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
      </footer>
    </motion.div>
  );
};
