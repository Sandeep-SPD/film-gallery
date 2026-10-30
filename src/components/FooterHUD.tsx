import React from 'react';

interface FooterHUDProps {
  activeView: 'grid' | 'trail' | 'index';
  onSelectView: (view: 'grid' | 'trail' | 'index') => void;
  coords: { x: number; y: number };
  onResetCoords?: () => void;
  projectCount: number;
}

export const FooterHUD: React.FC<FooterHUDProps> = ({
  activeView,
  onSelectView,
  coords,
  onResetCoords,
  projectCount,
}) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-[400] px-6 py-4 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none select-none text-[11px] font-mono text-neutral-400">
      {/* Left: Dynamic Rodeo Film Interaction Instruction & Live 2D Coordinates */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ff2203] animate-ping" />
          <span className="text-white font-bold tracking-widest uppercase">
            {activeView === 'trail'
              ? 'TOUCH AND MOVE'
              : activeView === 'grid'
              ? 'SCROLL OR DRAG'
              : 'EXPLORE REELS'}
          </span>
        </div>

        {activeView === 'grid' && (
          <div className="hidden md:flex items-center gap-2 text-neutral-500 border-l border-neutral-800 pl-3">
            <span>
              X: {coords.x > 0 ? `+${coords.x}` : coords.x}
            </span>
            <span>·</span>
            <span>
              Y: {coords.y > 0 ? `+${coords.y}` : coords.y}
            </span>
            {onResetCoords && (
              <button
                onClick={onResetCoords}
                className="ml-2 px-1.5 py-0.5 bg-neutral-900 hover:bg-neutral-800 text-[10px] text-neutral-300 hover:text-white rounded border border-neutral-800 transition-colors cursor-pointer"
                title="Reset Camera Center (Hot-key: C)"
              >
                RESET [C]
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile view switch pills */}
      <div className="flex md:hidden items-center p-1 bg-black/90 border border-neutral-800 rounded pointer-events-auto">
        <button
          onClick={() => onSelectView('grid')}
          className={`px-2.5 py-1 text-[10px] uppercase rounded ${
            activeView === 'grid' ? 'bg-white text-black font-bold' : 'text-neutral-400'
          }`}
        >
          GRID
        </button>
        <button
          onClick={() => onSelectView('trail')}
          className={`px-2.5 py-1 text-[10px] uppercase rounded ${
            activeView === 'trail' ? 'bg-[#ff2203] text-white font-bold' : 'text-neutral-400'
          }`}
        >
          35MM
        </button>
        <button
          onClick={() => onSelectView('index')}
          className={`px-2.5 py-1 text-[10px] uppercase rounded ${
            activeView === 'index' ? 'bg-white text-black font-bold' : 'text-neutral-400'
          }`}
        >
          INDEX
        </button>
      </div>

      {/* Right: Copyright & Credits matching rodeo.film */}
      <div className="hidden sm:flex items-center gap-3 text-neutral-500 pointer-events-auto">
        <span>© 2024 RODEO, ALL RIGHTS RESERVED</span>
        <span>—</span>
        <a
          href="https://troa.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 hover:text-white uppercase transition-colors"
        >
          WEBSITE BY TROA
        </a>
      </div>
    </footer>
  );
};
