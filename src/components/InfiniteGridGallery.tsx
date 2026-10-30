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
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth position and target coordinates
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const totalCoordsRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    const list = projects.filter(
      (p) => activeCategory === 'ALL' || p.category === activeCategory
    );
    return list.length > 0 ? list : projects;
  }, [projects, activeCategory]);

  // Precise mathematical dimensions for infinite toroidal wrapping
  const CARD_WIDTH = 480;
  const CARD_HEIGHT = 380;
  const GAP_X = 64; // Tailwind gap-16
  const CARD_SPAN_X = CARD_WIDTH + GAP_X; // 544px

  // Number of columns and items per column
  const COLS = 3;
  const ITEMS_PER_COL = Math.max(4, Math.ceil(filteredProjects.length / COLS));

  // Card total height: 380 media + 14 margin + 80 text = 474px
  const CARD_TOTAL_HEIGHT = 474;
  const GAP_Y = 64; // Tailwind gap-16
  const ITEM_SPAN_Y = CARD_TOTAL_HEIGHT + GAP_Y; // 538px

  // Full single-tile period dimensions
  const TOTAL_WIDTH = COLS * CARD_SPAN_X; // 3 * 544 = 1632px
  const TOTAL_HEIGHT = ITEMS_PER_COL * ITEM_SPAN_Y; // 4 * 538 = 2152px

  // Precompute uniform column items repeating seamlessly
  const columnsData = useMemo(() => {
    return Array.from({ length: COLS }).map((_, colIdx) => {
      // Stagger column vertically (Rodeo Film staggered rhythm)
      const colStagger = colIdx === 0 ? 0 : colIdx === 1 ? 80 : 160;

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
  }, [COLS, ITEMS_PER_COL, filteredProjects]);

  // Animation frame physics loop with toroidal seamless wrapping
  useEffect(() => {
    let animId: number;

    const tick = () => {
      // Smooth lerp movement with inertia
      const dx = (targetRef.current.x - posRef.current.x) * 0.12;
      const dy = (targetRef.current.y - posRef.current.y) * 0.12;

      posRef.current.x += dx;
      posRef.current.y += dy;

      // Track cumulative movement for HUD status counter
      totalCoordsRef.current.x += dx;
      totalCoordsRef.current.y += dy;

      if (!isDraggingRef.current) {
        // Subtle ambient kinetic drift
        targetRef.current.x -= 0.15;
      }

      // Toroidal wrapping: keep posRef centered within [-TOTAL_WIDTH / 2, TOTAL_WIDTH / 2]
      // Because the grid repeats with exact period TOTAL_WIDTH and TOTAL_HEIGHT,
      // adding or subtracting the period produces ZERO visual difference or jump!
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
  }, [TOTAL_WIDTH, TOTAL_HEIGHT, onCoordsChange]);

  // Pointer drag events
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    hasMovedRef.current = false;
    setCursorMode('default', 'DRAGGING');
  }, [setCursorMode]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };

    if (Math.hypot(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y) > 6) {
      hasMovedRef.current = true;
    }

    targetRef.current.x += dx * 1.35;
    targetRef.current.y += dy * 1.35;
    velocityRef.current = { x: dx, y: dy };
  }, []);

  const onPointerUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      // Add throw inertia
      targetRef.current.x += velocityRef.current.x * 4;
      targetRef.current.y += velocityRef.current.y * 4;
      setCursorMode('default', 'SCROLL OR DRAG');
    }
  }, [setCursorMode]);

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
  // This guarantees full coverage for any viewport width up to 8000px,
  // repeating the same pictures endlessly in all directions!
  const repeats = [-2, -1, 0, 1, 2];

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none bg-[#070707] cursor-grab active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Container with Rodeo Film's 3-degree tilted analog skew */}
      <div
        className={`w-full h-full origin-center transition-transform duration-700 ease-out will-change-transform ${
          isTilted ? 'rotate-[3deg] scale-[1.08]' : 'rotate-0 scale-100'
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
                  <div className="flex gap-16">
                    {columnsData.map(({ colIdx, colStagger, items }) => (
                      <div
                        key={colIdx}
                        className="flex flex-col gap-16"
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
}

const ProjectTile: React.FC<ProjectTileProps> = ({
  project,
  onSelect,
  setCursorMode,
  width,
  height,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCursorMode('play', 'PLAY REEL');
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
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
      className="group relative cursor-pointer flex flex-col transition-all duration-500 ease-out hover:-translate-y-2"
      style={{ width }}
    >
      {/* Media Window */}
      <div
        className="relative overflow-hidden bg-neutral-900 border border-neutral-800/80 shadow-2xl transition-all duration-500 group-hover:border-[#ff2203]/70 group-hover:shadow-[0_20px_50px_rgba(255,34,3,0.15)]"
        style={{ height }}
      >
        {/* Poster image */}
        <img
          src={project.cover}
          alt={project.title}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            isHovered && videoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Hover Autoplay Video Loop (only active when hovered for maximum 60fps performance) */}
        {isHovered && project.videoUrl && (
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
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-[10px] font-mono tracking-widest text-neutral-300 border border-white/10 uppercase">
            {project.category}
          </span>
          {project.awards && project.awards.length > 0 && (
            <span className="px-2 py-0.5 bg-[#ff2203]/90 text-[10px] font-mono tracking-widest text-white uppercase">
              AWARD
            </span>
          )}
        </div>

        {/* Hover Scanlines */}
        <div
          className={`absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] transition-opacity duration-300 ${
            isHovered ? 'opacity-60' : 'opacity-0'
          }`}
        />

        {/* Hover Center Indicator */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl">
            <svg className="w-6 h-6 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Bottom runtime duration */}
        <div className="absolute bottom-3 right-3 text-[11px] font-mono text-neutral-400 bg-black/60 px-2 py-0.5 border border-white/10">
          {project.duration}
        </div>
      </div>

      {/* Typography beneath card with fixed 80px height for seamless vertical strides */}
      <div className="mt-3.5 flex flex-col justify-start h-[80px]">
        <div className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase flex items-center justify-between">
          <span>{project.category}</span>
          <span className="text-neutral-500">{project.year}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase group-hover:text-[#ff2203] transition-colors leading-tight line-clamp-1 mt-0.5">
          {project.title}
        </h3>
        <p className="text-xs text-neutral-400 tracking-wide line-clamp-1 mt-0.5">
          {project.client} · Dir. {project.director}
        </p>
      </div>
    </div>
  );
};
