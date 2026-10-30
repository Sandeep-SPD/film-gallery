import React, { useEffect, useState } from 'react';

interface LoaderProps {
  onLoaded: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onLoaded }) => {
  const [percent, setPercent] = useState(0);
  const [isHiding, setIsHiding] = useState(false);
  const [currentStage, setCurrentStage] = useState('TUNING AMPLIFIERS');

  const STAGES = [
    'CONNECTING TO KHARAGPUR',
    'IGNITING THE FLAME',
    'TUNING ARENA ACOUSTICS',
    'PREPARING MAIN STAGE REELS',
    'SPRING FEST UNLEASHED',
  ];

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // realistic loading pacing with crimson vibe
      const increment = Math.floor(Math.random() * 6) + 3;
      current = Math.min(100, current + increment);
      setPercent(current);

      // cycle stages based on percentage
      const stageIdx = Math.min(
        STAGES.length - 1,
        Math.floor((current / 100) * STAGES.length)
      );
      setCurrentStage(STAGES[stageIdx]);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsHiding(true);
          setTimeout(() => {
            onLoaded();
          }, 850);
        }, 400);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onLoaded]);

  return (
    <div
      className={`fixed inset-0 z-[900] text-white flex flex-col justify-between overflow-hidden transition-all duration-800 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        isHiding ? 'opacity-0 pointer-events-none scale-105 blur-sm' : 'opacity-100'
      }`}
      style={{
        background:
          'radial-gradient(ellipse 90% 70% at 50% 40%, #2b0409 0%, #150204 55%, #070102 100%)',
      }}
    >
      {/* Background Ambient Crimson Glow Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-crimson-600/15 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#99001A]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle Crimson Grid Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#ff2a4b_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Top Header Information Bar */}
      <div className="relative z-10 p-6 md:p-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-crimson-900/30">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#dc143c] shadow-[0_0_12px_#dc143c] animate-ping" />
          <span className="text-[11px] sm:text-xs font-mono tracking-[0.25em] text-neutral-300 uppercase">
            INDIAN INSTITUTE OF TECHNOLOGY KHARAGPUR
          </span>
        </div>
        <div className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-[#ff4d6d] uppercase flex items-center gap-2">
          <span>ANNUAL SOCIAL & CULTURAL EXTRAVAGANZA</span>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-400">ESTD. 1960</span>
        </div>
      </div>

      {/* Center Cinematic Display: IIT KGP SPRING FEST */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 my-auto">
        {/* Emblem / Fest Torch Motif SVG */}
        <div className="mb-6 relative group">
          <div className="absolute inset-0 bg-[#dc143c]/30 blur-xl rounded-full scale-125 animate-pulse" />
          <svg
            className="w-16 h-16 sm:w-20 sm:h-20 text-[#ff2a4b] relative z-10 drop-shadow-[0_0_18px_rgba(220,20,60,0.8)]"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer flame petals */}
            <path
              d="M50 5C50 5 62 25 62 42C62 55 52 64 50 64C48 64 38 55 38 42C38 25 50 5 50 5Z"
              fill="url(#crimsonGrad)"
            />
            {/* Winged cultural crest */}
            <path
              d="M15 65C30 60 42 70 50 85C58 70 70 60 85 65C72 78 58 92 50 95C42 92 28 78 15 65Z"
              fill="#dc143c"
              opacity="0.9"
            />
            {/* Inner golden-crimson spark core */}
            <circle cx="50" cy="50" r="7" fill="#ffffff" />
            <circle cx="50" cy="50" r="14" stroke="#ff4d6d" strokeWidth="2" strokeDasharray="3 3" />
            <defs>
              <linearGradient id="crimsonGrad" x1="50" y1="5" x2="50" y2="64" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ff4d6d" />
                <stop offset="0.6" stopColor="#dc143c" />
                <stop offset="1" stopColor="#800010" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Presenting Subtitle */}
        <p className="text-xs sm:text-sm font-mono tracking-[0.35em] uppercase text-[#ff6b85] mb-2 font-semibold flex items-center gap-3">
          <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#dc143c]" />
          <span>IIT KGP PRESENTS</span>
          <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#dc143c]" />
        </p>

        {/* Grand Festival Typography */}
        <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight uppercase leading-[0.95] select-none">
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#ff6b85] to-[#dc143c] drop-shadow-[0_0_35px_rgba(220,20,60,0.5)]">
            SPRING FEST
          </span>
        </h1>

        {/* Festival Motto */}
        <div className="mt-4 sm:mt-5 flex items-center gap-3">
          <span className="text-sm sm:text-lg font-serif italic text-neutral-300 tracking-wider">
            "The True Spirit of Youth"
          </span>
        </div>

        {/* Festival Categories Bar */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-mono tracking-widest text-neutral-400 uppercase">
          <span className="px-2.5 py-1 bg-[#200508] border border-[#dc143c]/40 text-[#ff8da1] rounded">
            MUSIC
          </span>
          <span>·</span>
          <span className="px-2.5 py-1 bg-[#200508] border border-[#dc143c]/40 text-[#ff8da1] rounded">
            DRAMATICS
          </span>
          <span>·</span>
          <span className="px-2.5 py-1 bg-[#200508] border border-[#dc143c]/40 text-[#ff8da1] rounded">
            DANCE
          </span>
          <span>·</span>
          <span className="px-2.5 py-1 bg-[#200508] border border-[#dc143c]/40 text-[#ff8da1] rounded">
            LITERARY
          </span>
          <span>·</span>
          <span className="px-2.5 py-1 bg-[#200508] border border-[#dc143c]/40 text-[#ff8da1] rounded">
            FILM & PHOTOGRAPHY
          </span>
        </div>
      </div>

      {/* Bottom Status & Percentage Counter */}
      <div className="relative z-10 p-6 md:p-12 flex justify-between items-end text-sm tracking-wider uppercase border-t border-crimson-900/30">
        {/* Left: Dynamic Progress counter */}
        <div className="flex flex-col gap-1">
          <div className="font-mono text-2xl sm:text-4xl font-bold tracking-tight text-white flex items-baseline gap-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#ff6b85]">
              {percent}%
            </span>
            <span className="text-xs font-mono text-neutral-500 font-normal">
              / LOADED
            </span>
          </div>
          <div className="text-[11px] font-mono text-[#ff4d6d] tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc143c] animate-pulse" />
            <span>{currentStage}</span>
          </div>
        </div>

        {/* Right: Location & Heritage */}
        <div className="text-right flex flex-col gap-1">
          <div className="text-xs font-mono text-neutral-300 font-bold tracking-widest">
            KHARAGPUR · WEST BENGAL
          </div>
          <div className="text-[10px] font-mono text-[#ff8da1]/80 tracking-wider">
            66TH EDITION ARCHIVES
          </div>
        </div>
      </div>

      {/* Dual Crimson Neon Glowing Progress Bar on Bottom Edge */}
      <div className="fixed bottom-0 left-0 w-full h-[3px] bg-[#1a0205] overflow-hidden z-20">
        <div
          className="h-full bg-gradient-to-r from-[#800010] via-[#dc143c] to-[#ff4d6d] shadow-[0_0_20px_#dc143c,0_0_8px_#ff4d6d] transition-all duration-150 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
