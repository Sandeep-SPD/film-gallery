import React, { useEffect, useState, useRef } from 'react';

export type CursorMode = 'default' | 'play' | 'view' | 'touchAndMove' | 'pause' | 'hidden';

interface CustomCursorProps {
  mode: CursorMode;
  customText?: string;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ mode, customText }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [target, setTarget] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const animFrame = useRef<number | null>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setTarget({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const onMouseLeave = () => {
      setVisible(false);
    };

    const onMouseEnter = () => {
      setVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [visible]);

  // Smooth lerp loop
  useEffect(() => {
    const loop = () => {
      setPos((prev) => {
        const dx = target.x - prev.x;
        const dy = target.y - prev.y;
        return {
          x: prev.x + dx * 0.22,
          y: prev.y + dy * 0.22,
        };
      });
      animFrame.current = requestAnimationFrame(loop);
    };
    animFrame.current = requestAnimationFrame(loop);
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [target]);

  if (!visible || mode === 'hidden') return null;

  const isPlay = mode === 'play';
  const isView = mode === 'view';
  const isTouchMove = mode === 'touchAndMove';
  const isPause = mode === 'pause';

  return (
    <div
      className="pointer-events-none fixed z-[9999] top-0 left-0 transition-opacity duration-300 hidden md:block"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        willChange: 'transform',
      }}
    >
      {/* Play/View Bubble state */}
      {isPlay || isView || isPause ? (
        <div className="-translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-[#ff2203] text-white text-[11px] font-bold tracking-widest uppercase rounded-full shadow-2xl flex items-center gap-1.5 animate-in zoom-in-75 duration-200">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>{customText || (isPause ? 'PAUSE' : isPlay ? 'PLAY REEL' : 'VIEW PROJECT')}</span>
        </div>
      ) : isTouchMove ? (
        /* 35mm photo trail mode cursor */
        <div className="-translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
          <div className="w-3 h-3 rounded-full border border-white/80 bg-[#ff2203]/80 animate-ping" />
          <div className="px-3 py-1 bg-black/90 border border-neutral-700 text-neutral-200 text-[9px] font-mono tracking-widest uppercase rounded">
            TOUCH AND MOVE
          </div>
        </div>
      ) : (
        /* Default subtle cursor dot + prompt */
        <div className="-translate-x-1/2 -translate-y-1/2 flex items-center gap-2 group">
          <div className="w-2.5 h-2.5 bg-white rounded-full transition-transform duration-150 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          <div className="px-2 py-0.5 bg-black/70 backdrop-blur-sm border border-white/10 text-[9px] text-neutral-300 uppercase tracking-widest whitespace-nowrap rounded font-mono">
            {customText || 'SCROLL OR DRAG'}
          </div>
        </div>
      )}
    </div>
  );
};
