import React from 'react';
import { RodeoLogo } from './RodeoLogo';

interface HeaderNavProps {
  activeView: 'grid' | 'trail' | 'index';
  onSelectView: (view: 'grid' | 'trail' | 'index') => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: string[];
  isTilted: boolean;
  onToggleTilt: () => void;
  onOpenMenu: () => void;
  onLogoClick: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeView,
  onSelectView,
  activeCategory,
  onSelectCategory,
  categories,
  isTilted,
  onToggleTilt,
  onOpenMenu,
  onLogoClick,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[500] px-6 py-5 md:px-12 flex items-center justify-between pointer-events-none select-none">
      {/* Left: Brand Logo & Tagline */}
      <div className="flex items-center gap-6 pointer-events-auto">
        <RodeoLogo onClick={onLogoClick} className="h-6 md:h-7" />
        <div className="hidden xl:flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-neutral-500 border-l border-neutral-800 pl-4">
          <span>PARIS</span>
          <span>·</span>
          <span>CREATIVE PRODUCTION</span>
        </div>
      </div>

      {/* Center: View Switcher & Category Filters (Desktop) */}
      <div className="hidden md:flex items-center gap-4 pointer-events-auto">
        {/* View Mode Segmented Control */}
        <div className="flex items-center p-1 bg-black/70 backdrop-blur-md border border-neutral-800/90 rounded-md">
          <button
            onClick={() => onSelectView('grid')}
            className={`px-3 py-1 text-xs font-mono tracking-wider uppercase transition-colors rounded ${
              activeView === 'grid'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            GRID
          </button>
          <button
            onClick={() => onSelectView('trail')}
            className={`px-3 py-1 text-xs font-mono tracking-wider uppercase transition-colors rounded ${
              activeView === 'trail'
                ? 'bg-[#ff2203] text-white font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            35MM TRAIL
          </button>
          <button
            onClick={() => onSelectView('index')}
            className={`px-3 py-1 text-xs font-mono tracking-wider uppercase transition-colors rounded ${
              activeView === 'index'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            INDEX
          </button>
        </div>

        {/* Category Filters (visible when in grid or index view) */}
        {activeView !== 'trail' && (
          <div className="flex items-center gap-1.5 p-1 bg-black/60 backdrop-blur-md border border-neutral-900 rounded-md">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase transition-colors rounded ${
                  activeCategory === cat
                    ? 'text-[#ff2203] font-bold bg-neutral-900'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Controls & Burger Menu */}
      <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto">
        {/* Skew 3° Toggle (Grid only) */}
        {activeView === 'grid' && (
          <button
            onClick={onToggleTilt}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono uppercase tracking-wider backdrop-blur-md transition-colors ${
              isTilted
                ? 'bg-neutral-900/90 text-[#ff2203] border-neutral-800'
                : 'bg-black/60 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
            title="Toggle Rodeo Film 3-degree analog slant perspective"
          >
            <span>TILT 3°</span>
            <span className={`w-1.5 h-1.5 rounded-full ${isTilted ? 'bg-[#ff2203]' : 'bg-neutral-600'}`} />
          </button>
        )}


        {/* Hamburger Menu Trigger */}
        <button
          onClick={onOpenMenu}
          className="flex items-center gap-2.5 px-3.5 py-1.5 bg-black/80 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white text-xs font-mono uppercase tracking-wider rounded backdrop-blur-md transition-all group cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <div className="flex flex-col gap-1 w-4">
            <span className="h-[1.5px] w-full bg-white group-hover:bg-[#ff2203] transition-colors" />
            <span className="h-[1.5px] w-3/4 bg-white group-hover:bg-[#ff2203] transition-colors" />
            <span className="h-[1.5px] w-full bg-white group-hover:bg-[#ff2203] transition-colors" />
          </div>
          <span>OPEN</span>
        </button>
      </div>
    </header>
  );
};
