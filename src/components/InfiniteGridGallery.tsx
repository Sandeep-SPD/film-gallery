import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Project } from '../data/rodeoData';
import { CursorMode } from './CustomCursor';

interface InfiniteGridGalleryProps {
  projects: Project[];
  activeCategory: string;
  onSelectProject: (project: Project) => void;
  setCursorMode: (mode: CursorMode, text?: string) => void;
  onCoordsChange?: (x: number, y: number) => void;
  isTilted?: boolean;
}

export const InfiniteGridGallery: React.FC<InfiniteGridGalleryProps> = ({
  projects,
  activeCategory,
  onSelectProject,
  setCursorMode,
  onCoordsChange,
  isTilted = true,
}) => {
  const outerWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track window width for responsive sizing
  const [winWidth, setWinWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWinWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = winWidth < 768;

  // Smooth position and target coordinates
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const totalCoordsRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);
  const isTouchRef = useRef(false);
  const hasMovedRef = useRef(false);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    const list = projects.filter(
      (p) => activeCategory === 'ALL' || p.category === activeCategory
    );
    return list.length > 0 ? list : projects;
  }, [projects, activeCategory]);

  // Responsive dimensions:
  // On mobile phone, make cards fit comfortably on screen (~310px width)
  // so a single flick/swipe effortlessly moves between images
  const CARD_WIDTH = isMobile ? Math.min(320, Math.floor(winWidth * 0.82)) : 480;
  const CARD_HEIGHT = isMobile ? 220 : 380;
  const GAP_X = isMobile ? 28 : 64;
  const CARD_SPAN_X = CARD_WIDTH + GAP_X;

  const COLS = 3;
  const ITEMS_PER_COL = Math.max(4, Math.ceil(filteredProjects.length / COLS));

  const CARD_TEXT_HEIGHT = isMobile ? 70 : 80;
  const CARD_TOTAL_HEIGHT = CARD_HEIGHT + 14 + CARD_TEXT_HEIGHT;
  const GAP_Y = isMobile ? 28 : 64;
  const ITEM_SPAN_Y = CARD_TOTAL_HEIGHT + GAP_Y;

  // Full single-tile period dimensions
  const TOTAL_WIDTH = COLS * CARD_SPAN_X;
  const TOTAL_HEIGHT = ITEMS_PER_COL * ITEM_SPAN_Y;

  // Precompute uniform column items repeating seamlessly
  const columnsData = useMemo(() => {
    return Array.from({ length: COLS }).map((_, colIdx) => {
      // Subtle stagger column vertically
      const colStagger = isMobile
        ? colIdx === 0 ? 0 : colIdx === 1 ? 40 : 80
        : colIdx === 0 ? 0 : colIdx === 1 ? 80 : 160;

      // Fill column with exactly ITEMS_PER_COL projects in cyclic order
      const items = Array.from({ length: ITEMS_PER_COL }).map((_, itemIdx) => {
        const globalIndex = (itemIdx * COLS + colIdx) % filteredProjects.length;
        return filteredProjects[globalIndex];
      });

      return {
        colIdx,
        colStagger,
        items,
      };
    });
  }, [COLS, ITEMS_PER_COL, filteredProjects, isMobile]);

  // Animation frame physics loop with toroidal seamless wrapping
  useEffect(() => {
    let animId: number;

    const tick = () => {
      // Smooth lerp movement with inertia
      const lerpFactor = isMobile ? 0.15 : 0.12;
      const dx = (targetRef.current.x - posRef.current.x) * lerpFactor;
      const dy = (targetRef.current.y - posRef.current.y) * lerpFactor;

      posRef.current.x += dx;
      posRef.current.y += dy;

      // Track cumulative movement for HUD status counter
      totalCoordsRef.current.x += dx;
      totalCoordsRef.current.y += dy;

      if (!isDraggingRef.current) {
        // Subtle ambient kinetic drift
        targetRef.current.x -= 0.12;
      }

      // Toroidal wrapping: keep posRef centered within [-TOTAL_WIDTH / 2, TOTAL_WIDTH / 2]
      while (posRef.current.x < -TOTAL_WIDTH / 2) {
        posRef.current.x += TOTAL_WIDTH;
        targetRef.current.x += TOTAL_WIDTH;
      }
      while (posRef.current.x > TOTAL_WIDTH / 2) {
        posRef.current.x -= TOTAL_WIDTH;
        targetRef.current.x -= TOTAL_WIDTH;
      }

      while (posRef.current.y < -TOTAL_HEIGHT / 2) {
        posRef.current.y += TOTAL_HEIGHT;
        targetRef.current.y += TOTAL_HEIGHT;
      }
      while (posRef.current.y > TOTAL_HEIGHT / 2) {
        posRef.current.y -= TOTAL_HEIGHT;
        targetRef.current.y -= TOTAL_HEIGHT;
      }

      // Report live coords to HUD
      if (onCoordsChange) {
        onCoordsChange(
          Math.round(totalCoordsRef.current.x),
          Math.round(totalCoordsRef.current.y)
        );
      }

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [TOTAL_WIDTH, TOTAL_HEIGHT, onCoordsChange, isMobile]);

  // Handle Drag Start
  const handleStart = useCallback((clientX: number, clientY: number, isTouch: boolean) => {
    isDraggingRef.current = true;
    isTouchRef.current = isTouch;
    dragStartRef.current = { x: clientX, y: clientY };
    lastMouseRef.current = { x: clientX, y: clientY };
    lastTimeRef.current = performance.now();
    velocityRef.current = { x: 0, y: 0 };
    hasMovedRef.current = false;
    setCursorMode('default', 'DRAGGING');
  }, [setCursorMode]);

  // Handle Drag Move with high mobile touch sensitivity
  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;

    const dx = clientX - lastMouseRef.current.x;
    const dy = clientY - lastMouseRef.current.y;
    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);

    lastMouseRef.current = { x: clientX, y: clientY };
    lastTimeRef.current = now;

    if (Math.hypot(clientX - dragStartRef.current.x, clientY - dragStartRef.current.y) > 8) {
      hasMovedRef.current = true;
    }

    // High sensitivity on mobile so gentle finger motion moves the gallery directly
    const sensitivity = isTouchRef.current ? 2.5 : 1.35;
    targetRef.current.x += dx * sensitivity;
    targetRef.current.y += dy * sensitivity;

    // Smooth instantaneous velocity calculation
    velocityRef.current = {
      x: (dx / dt) * 16,
      y: (dy / dt) * 16,
    };
  }, []);

  // Handle Drag End with momentum flick throw
  const handleEnd = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      // High throw multiplier on mobile so a single swipe glides across 1 to 2 images easily
      const throwMultiplier = isTouchRef.current ? 16 : 4;
      targetRef.current.x += velocityRef.current.x * throwMultiplier;
      targetRef.current.y += velocityRef.current.y * throwMultiplier;
      setCursorMode('default', 'SCROLL OR DRAG');
    }
  }, [setCursorMode]);

  // Native non-passive touch event listeners to guarantee 100% fluid mobile swiping
  useEffect(() => {
    const el = outerWrapperRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleStart(e.touches[0].clientX, e.touches[0].clientY, true);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        // Prevent browser from canceling touch or refreshing page
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = () => {
      handleEnd();
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [handleStart, handleMove, handleEnd]);

  // Trackpad / Wheel scroll handling
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const deltaX = e.shiftKey ? e.deltaY : e.deltaX;
      const deltaY = e.shiftKey ? 0 : e.deltaY;

      targetRef.current.x -= deltaX * 1.1;
      targetRef.current.y -= deltaY * 1.1;
    };

    const node = window;
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
  }, []);

  // Keyboard navigation & centering
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') targetRef.current.x -= 260;
      if (e.key === 'ArrowLeft') targetRef.current.x += 260;
      if (e.key === 'ArrowDown') targetRef.current.y -= 260;
      if (e.key === 'ArrowUp') targetRef.current.y += 260;
      if (e.key === 'c' || e.key === 'C') {
        targetRef.current = { x: 0, y: 0 };
        totalCoordsRef.current = { x: 0, y: 0 };
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Repeats across a 5x5 toroidal block matrix
  const repeats = [-2, -1, 0, 1, 2];

  return (
    <div
      ref={outerWrapperRef}
      className="relative w-screen h-screen overflow-hidden select-none bg-[#070707] cursor-grab active:cursor-grabbing touch-none"
      onMouseDown={(e) => handleStart(e.clientX, e.clientY, false)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      {/* Container with Rodeo Film's 3-degree tilted analog skew */}
      <div
        className={`w-full h-full origin-center transition-transform duration-700 ease-out will-change-transform ${
          isTilted ? (isMobile ? 'rotate-[2deg] scale-[1.04]' : 'rotate-[3deg] scale-[1.08]') : 'rotate-0 scale-100'
        }`}
      >
        <div
          ref={containerRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
        >
          {repeats.map((repeatY) =>
            repeats.map((repeatX) => {
              const offsetX = repeatX * TOTAL_WIDTH;
              const offsetY = repeatY * TOTAL_HEIGHT;

              return (
                <div
                  key={`${repeatX}-${repeatY}`}
                  className="absolute top-0 left-0"
                  style={{
                    transform: `translate3d(${offsetX}px, ${offsetY}px, 0)`,
                  }}
                >
                  <div className={`flex ${isMobile ? 'gap-7' : 'gap-16'}`}>
                    {columnsData.map(({ colIdx, colStagger, items }) => (
                      <div
                        key={colIdx}
                        className={`flex flex-col ${isMobile ? 'gap-7' : 'gap-16'}`}
                        style={{
                          marginTop: `${colStagger}px`,
                          width: `${CARD_WIDTH}px`,
                        }}
                      >
                        {items.map((project, itemIdx) => (
                          <ProjectTile
                            key={`${project.id}-${repeatX}-${repeatY}-${colIdx}-${itemIdx}`}
                            project={project}
                            onSelect={() => {
                              if (!hasMovedRef.current) {
                                onSelectProject(project);
                              }
                            }}
                            setCursorMode={setCursorMode}
                            width={CARD_WIDTH}
                            height={CARD_HEIGHT}
                            isMobile={isMobile}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

interface ProjectTileProps {
  project: Project;
  onSelect: () => void;
  setCursorMode: (mode: CursorMode, text?: string) => void;
  width: number;
  height: number;
  isMobile: boolean;
}

const ProjectTile: React.FC<ProjectTileProps> = ({
  project,
  onSelect,
  setCursorMode,
  width,
  height,
  isMobile,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsHovered(true);
    setCursorMode('play', 'PLAY REEL');
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovered(false);
    setCursorMode('default', 'SCROLL OR DRAG');
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div
      onClick={onSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer flex flex-col transition-all duration-300 ease-out active:scale-[0.98] md:hover:-translate-y-2"
      style={{ width }}
    >
      {/* Media Window */}
      <div
        className="relative overflow-hidden bg-neutral-900 border border-neutral-800/80 shadow-2xl transition-all duration-300 group-hover:border-[#ff2203]/70"
        style={{ height }}
      >
        {/* Poster image */}
        <img
          src={project.cover}
          alt={project.title}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out md:group-hover:scale-105 ${
            isHovered && videoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Hover Autoplay Video Loop (desktop only for mobile performance) */}
        {!isMobile && isHovered && project.videoUrl && (
          <video
            ref={videoRef}
            src={project.videoUrl}
            playsInline
            loop
            muted
            preload="auto"
            onLoadedData={() => setVideoLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-300"
          />
        )}

        {/* Cinematic Film Vignette overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {/* Top subtle format tag */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 flex items-center gap-1.5 md:gap-2">
          <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-[9px] md:text-[10px] font-mono tracking-widest text-neutral-300 border border-white/10 uppercase">
            {project.category}
          </span>
          {project.awards && project.awards.length > 0 && (
            <span className="px-1.5 py-0.5 bg-[#ff2203]/90 text-[9px] md:text-[10px] font-mono tracking-widest text-white uppercase">
              AWARD
            </span>
          )}
        </div>

        {/* Hover Center Play Button for desktop */}
        {!isMobile && (
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl">
              <svg className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Bottom runtime duration */}
        <div className="absolute bottom-2.5 right-2.5 md:bottom-3 md:right-3 text-[10px] md:text-[11px] font-mono text-neutral-400 bg-black/70 px-2 py-0.5 border border-white/10">
          {project.duration}
        </div>
      </div>

      {/* Typography beneath card with fixed height for seamless vertical strides */}
      <div
        className="mt-2.5 md:mt-3.5 flex flex-col justify-start"
        style={{ height: isMobile ? '70px' : '80px' }}
      >
        <div className="text-[10px] md:text-[11px] font-mono tracking-widest text-neutral-400 uppercase flex items-center justify-between">
          <span>{project.category}</span>
          <span className="text-neutral-500">{project.year}</span>
        </div>
        <h3 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-white uppercase group-hover:text-[#ff2203] transition-colors leading-tight line-clamp-1 mt-0.5">
          {project.title}
        </h3>
        <p className="text-[11px] md:text-xs text-neutral-400 tracking-wide line-clamp-1 mt-0.5">
          {project.client} · Dir. {project.director}
        </p>
      </div>
    </div>
  );
};
