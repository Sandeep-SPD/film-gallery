import React, { useEffect, useState } from 'react';

interface LoaderProps {
  onLoaded: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onLoaded }) => {
  const [percent, setPercent] = useState(0);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // simulate realistic asset preloading speed
      const increment = Math.floor(Math.random() * 8) + 3;
      current = Math.min(100, current + increment);
      setPercent(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsHiding(true);
          setTimeout(() => {
            onLoaded();
          }, 800);
        }, 300);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onLoaded]);

  return (
    <div
      className={`fixed inset-0 z-[800] bg-black text-white flex flex-col justify-between transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        isHiding ? 'opacity-0 pointer-events-none -translate-y-6' : 'opacity-100'
      }`}
    >
      {/* Top subtle badge */}
      <div className="p-8 md:p-12 text-xs tracking-widest text-neutral-500 uppercase">
        <span>ARCHIVE & REELS · 2024</span>
      </div>

      {/* Center 4-word typography */}
      <div className="flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight uppercase leading-[1.08] select-none">
          <span className="block text-[#ff2203] transition-transform duration-500 hover:scale-105">
            RODEO
          </span>
          <span className="block text-white">CREATIVE</span>
          <span className="block text-white">PRODUCTION</span>
          <span className="block text-white">COLLECTIVE</span>
        </h1>
      </div>

      {/* Bottom status and percentage counter */}
      <div className="p-8 md:p-12 flex justify-between items-end text-sm tracking-wider uppercase">
        <div className="font-mono text-xs sm:text-sm text-neutral-400">
          <span className="text-white font-bold">{percent}%</span>
          <span className="hidden sm:inline text-neutral-600 ml-3">/ LOADING ASSETS & REELS</span>
        </div>
        <div className="text-xs text-neutral-500 tracking-widest">
          PARIS · WORLDWIDE
        </div>
      </div>

      {/* Red progress line along the bottom border */}
      <div className="fixed bottom-0 left-0 w-full h-[2px] bg-neutral-900 overflow-hidden">
        <div
          className="h-full bg-[#ff2203] transition-all duration-150 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
