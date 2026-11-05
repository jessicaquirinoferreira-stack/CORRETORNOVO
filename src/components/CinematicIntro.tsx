import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Building2, ShieldCheck, Key, Compass, Star } from 'lucide-react';

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
  const [activeStage, setActiveStage] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 3-Second Cinematic Timer Loop (Completely Silent)
  useEffect(() => {
    const totalDurationMs = 3000;
    const intervalMs = 20;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsed / totalDurationMs) * 100);
      const remainingSecs = Math.max(0, Math.ceil((totalDurationMs - elapsed) / 1000));

      setProgress(currentProgress);
      setSecondsLeft(remainingSecs);

      if (elapsed >= 900 && elapsed < 1800) {
        setActiveStage(2);
      } else if (elapsed >= 1800 && elapsed < 2700) {
        setActiveStage(3);
      } else if (elapsed >= 2700) {
        setActiveStage(4);
      }

      if (elapsed >= totalDurationMs) {
        clearInterval(timer);
        onComplete();
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Cinematic Gold Dust & Light Rays Canvas Animation
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

    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.8 + 0.6,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.8 - 0.2,
      opacity: Math.random() * 0.85 + 0.15,
      pulse: Math.random() * 0.05 + 0.01,
      color: Math.random() > 0.35 ? '#C9A227' : '#D4AF37',
    }));

    let rotationAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep Sophisticated Luxury Gradient Background
      const bgGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        40,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      bgGradient.addColorStop(0, 'rgba(255, 252, 245, 0.98)');
      bgGradient.addColorStop(0.5, 'rgba(244, 239, 230, 0.95)');
      bgGradient.addColorStop(1, '#EAE3D5');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Rotating Cinematic Gold Rays
      rotationAngle += 0.0015;
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(rotationAngle);
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const a1 = (i * Math.PI) / 3;
        const a2 = a1 + 0.3;
        const r = Math.max(width, height);
        ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
        ctx.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
        ctx.closePath();
        ctx.fillStyle = 'rgba(201, 162, 39, 0.045)';
        ctx.fill();
      }
      ctx.restore();

      // Floating Gold Dust Particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += Math.sin(Date.now() * p.pulse) * 0.015;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 162, 39, ${Math.max(0.2, Math.min(0.9, p.opacity))})`;
        ctx.shadowBlur = 10;
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
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(12px)' }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-12 bg-[#F4EFE6] text-[#111111] overflow-hidden select-none"
    >
      {/* Background Canvas Effect */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Cinematic Orbital Gold Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="w-[560px] h-[560px] sm:w-[780px] sm:h-[780px] rounded-full border border-dashed border-[#C9A227]/40 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
            className="w-[420px] h-[420px] sm:w-[580px] sm:h-[580px] rounded-full border border-[#C9A227]/30 flex items-center justify-center"
          >
            <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full border border-dotted border-[#C9A227]/50" />
          </motion.div>
        </motion.div>
      </div>

      {/* Top Navigation / Brand Tag */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between relative z-20">
        <div className="flex items-center gap-2.5 text-xs uppercase tracking-[0.3em] text-[#111111] font-bold">
          <Sparkles className="w-4 h-4 text-[#C9A227] animate-pulse" />
          <span>Experiência Imobiliária de Luxo</span>
        </div>

        <button
          id="intro-skip-btn"
          onClick={onComplete}
          className="px-6 py-2.5 rounded-full bg-[#111111] hover:bg-[#C9A227] text-white hover:text-[#0A0A0A] border border-[#111111] hover:border-[#C9A227] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 cursor-pointer shadow-xl hover:scale-105"
        >
          <span>Entrar no Site</span>
          <ArrowRight className="w-4 h-4 text-[#C9A227] group-hover:text-[#0A0A0A]" />
        </button>
      </header>

      {/* Center Cinematic Stage - Logo in Original Natural Colors */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center my-auto max-w-5xl w-full px-4">
        {/* Glowing Ambient Core */}
        <div className="absolute w-[400px] h-[400px] sm:w-[650px] sm:h-[650px] bg-gradient-to-r from-[#C9A227]/25 via-amber-200/30 to-[#C9A227]/25 rounded-full blur-[110px] pointer-events-none animate-pulse" />

        {/* Logo Container - Natural Original Colors */}
        <motion.div
          initial={{ scale: 0.78, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative group w-full flex flex-col items-center justify-center my-4"
        >
          <div className="relative w-full max-w-xl sm:max-w-2xl lg:max-w-3xl flex items-center justify-center p-6 sm:p-10 bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-[#E5E0D8] shadow-[0_20px_50px_rgba(201,162,39,0.18)]">
            <img
              src={OFFICIAL_LOGO_URL}
              alt="Daniel Pacheco Consultoria Imobiliária - Logo Oficial"
              className="w-full h-auto max-h-[240px] sm:max-h-[310px] lg:max-h-[350px] object-contain filter brightness-0 contrast-200 transition-transform duration-700 hover:scale-105 drop-shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
            />

            {/* Cinematic Light Sweep Across Logo */}
            <motion.div
              animate={{ x: ['-200%', '250%'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-25 pointer-events-none"
            />
          </div>
        </motion.div>

        {/* Cinematic Subtitle & Region Details */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-3 mt-6"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-16 sm:w-32 bg-gradient-to-r from-transparent to-[#C9A227]" />
            <span className="text-xs sm:text-sm uppercase tracking-[0.4em] text-[#111111] font-bold">
              Imóveis de Alto Padrão & Lançamentos
            </span>
            <span className="h-[1px] w-16 sm:w-32 bg-gradient-to-l from-transparent to-[#C9A227]" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs sm:text-sm text-[#555555] font-semibold tracking-wider">
            <span>Criciúma</span>
            <span className="text-[#C9A227]">•</span>
            <span>Balneário Rincão</span>
            <span className="text-[#C9A227]">•</span>
            <span>Içara</span>
            <span className="text-[#C9A227]">•</span>
            <span>Sul de Santa Catarina</span>
          </div>
        </motion.div>

        {/* Feature Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs"
        >
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 ${
            activeStage >= 1 ? 'border-[#C9A227] text-[#111111] bg-white shadow-md font-bold' : 'border-[#E5E0D8] text-[#777777] bg-white/60'
          }`}>
            <Building2 className="w-4 h-4 text-[#C9A227]" />
            <span className="text-xs tracking-wider">Portfólio Exclusivo</span>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 ${
            activeStage >= 2 ? 'border-[#C9A227] text-[#111111] bg-white shadow-md font-bold' : 'border-[#E5E0D8] text-[#777777] bg-white/60'
          }`}>
            <Key className="w-4 h-4 text-[#C9A227]" />
            <span className="text-xs tracking-wider">Financiamento Direto</span>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 ${
            activeStage >= 3 ? 'border-[#1F8A4C] text-[#111111] bg-white shadow-md font-bold' : 'border-[#E5E0D8] text-[#777777] bg-white/60'
          }`}>
            <ShieldCheck className="w-4 h-4 text-[#1F8A4C]" />
            <span className="text-xs tracking-wider">{creci}</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer: Progress & Timer */}
      <footer className="w-full max-w-4xl mx-auto relative z-20 space-y-3">
        <div className="flex items-center justify-between text-xs text-[#555555] font-mono">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#1F8A4C] animate-ping" />
            <span className="text-[#111111] font-semibold">Preparando ambiente imobiliário exclusivo...</span>
          </div>

          <div className="flex items-center gap-2 bg-white border border-[#E5E0D8] px-4 py-1.5 rounded-full shadow-md">
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

        <div className="w-full h-2 bg-[#E5E0D8] rounded-full overflow-hidden border border-[#E5E0D8] p-[1px]">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C9A227] via-amber-500 to-[#1F8A4C] rounded-full shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
      </footer>
    </motion.div>
  );
};
