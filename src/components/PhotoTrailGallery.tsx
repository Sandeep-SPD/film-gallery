import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ALL_35MM_IMAGES, FilmStill } from '../data/rodeoData';
import { CursorMode } from './CustomCursor';

interface SpawnedPhoto {
  id: string;
  image: FilmStill;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  timestamp: number;
}

interface PhotoTrailGalleryProps {
  setCursorMode: (mode: CursorMode, text?: string) => void;
  onClose?: () => void;
}

export const PhotoTrailGallery: React.FC<PhotoTrailGalleryProps> = ({
  setCursorMode,
  onClose,
}) => {
  const [photos, setPhotos] = useState<SpawnedPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<FilmStill | null>(null);
  const [viewMode, setViewMode] = useState<'trail' | 'archive'>('trail');
  const [isTouchActive, setIsTouchActive] = useState(false);

  const lastSpawnRef = useRef({ x: 0, y: 0, time: 0 });
  const photoIndexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const holdIntervalRef = useRef<number | null>(null);

  // Set cursor mode
  useEffect(() => {
    setCursorMode('touchAndMove', 'TOUCH AND MOVE');
    return () => setCursorMode('default', 'SCROLL OR DRAG');
  }, [setCursorMode]);

  // Core function to spawn photo at coordinates
  const spawnPhoto = useCallback((x: number, y: number) => {
    const nextImg = ALL_35MM_IMAGES[photoIndexRef.current % ALL_35MM_IMAGES.length];
    photoIndexRef.current += 1;

    const newPhoto: SpawnedPhoto = {
      id: `${Date.now()}-${Math.random()}`,
      image: nextImg,
      x,
      y,
      rotation: (Math.random() - 0.5) * 16,
      scale: 0.9 + Math.random() * 0.2,
      timestamp: Date.now(),
    };

    setPhotos((prev) => {
      // Keep up to 28 active photos for clean visibility & 60fps performance
      const updated = [...prev, newPhoto];
      if (updated.length > 28) {
        return updated.slice(updated.length - 28);
      }
      return updated;
    });
  }, []);

  // 1. PC (DESKTOP) HOVER SPAWNING:
  // Moving the mouse across the screen spawns photos along the path smoothly without clicking
  const handleMouseMovePC = useCallback((e: React.MouseEvent) => {
    if (viewMode !== 'trail') return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    const dx = clientX - lastSpawnRef.current.x;
    const dy = clientY - lastSpawnRef.current.y;
    const dist = Math.hypot(dx, dy);
    const now = performance.now();

    // Trigger on PC mouse movement: ~50px distance or steady movement
    if (dist > 50 || (dist > 18 && now - lastSpawnRef.current.time > 85)) {
      spawnPhoto(clientX, clientY);
      lastSpawnRef.current = { x: clientX, y: clientY, time: now };
    }
  }, [viewMode, spawnPhoto]);

  // 2. MOBILE PHONE (TOUCH) HOLD & DRAG SPAWNING:
  // Calibrated slower so each photo is clearly visible as the user holds & drags
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      if (viewMode !== 'trail') return;
      if (e.touches.length > 0) {
        setIsTouchActive(true);
        const touch = e.touches[0];
        const clientX = touch.clientX;
        const clientY = touch.clientY;

        // Spawn first photo immediately on touch
        spawnPhoto(clientX, clientY);
        lastSpawnRef.current = { x: clientX, y: clientY, time: performance.now() };

        // Paced hold-to-stream interval for phones:
        // Spawns with gentle 420ms pacing so images do not overwhelm and each is visible
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = window.setInterval(() => {
          const now = performance.now();
          if (now - lastSpawnRef.current.time > 380) {
            const jitterX = (Math.random() - 0.5) * 18;
            const jitterY = (Math.random() - 0.5) * 18;
            spawnPhoto(lastSpawnRef.current.x + jitterX, lastSpawnRef.current.y + jitterY);
            lastSpawnRef.current = {
              x: lastSpawnRef.current.x + jitterX,
              y: lastSpawnRef.current.y + jitterY,
              time: now,
            };
          }
        }, 420);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (viewMode !== 'trail') return;
      if (e.touches.length > 0) {
        e.preventDefault(); // Stop mobile browser pull-to-refresh
        const touch = e.touches[0];
        const clientX = touch.clientX;
        const clientY = touch.clientY;

        const dx = clientX - lastSpawnRef.current.x;
        const dy = clientY - lastSpawnRef.current.y;
        const dist = Math.hypot(dx, dy);
        const now = performance.now();

        // Phone dragging: requires at least 58px travel AND 250ms interval
        // This ensures each image is individually visible and appreciated as you drag
        if (dist > 58 && now - lastSpawnRef.current.time > 250) {
          spawnPhoto(clientX, clientY);
          lastSpawnRef.current = { x: clientX, y: clientY, time: now };
        }
      }
    };

    const onTouchEnd = () => {
      setIsTouchActive(false);
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
      }
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
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [viewMode, spawnPhoto]);

  // Initial greeting scatter
  useEffect(() => {
    if (photos.length === 0) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const initialPositions = [
        { x: cx - 120, y: cy - 70 },
        { x: cx, y: cy },
        { x: cx + 120, y: cy + 70 },
      ];
      initialPositions.forEach((pos, idx) => {
        setTimeout(() => {
          spawnPhoto(pos.x, pos.y);
        }, idx * 120);
      });
    }
  }, [spawnPhoto, photos.length]);

  const clearCanvas = () => {
    setPhotos([]);
  };

  const autoScatter = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < 9; i++) {
      setTimeout(() => {
        const rx = 60 + Math.random() * (w - 140);
        const ry = 100 + Math.random() * (h - 220);
        spawnPhoto(rx, ry);
      }, i * 90);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMovePC}
      className="relative w-screen h-screen overflow-hidden bg-[#050505] select-none touch-none"
    >
      {/* Background ambient texture and grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Floating Mode Switcher & Controls */}
      <div className="absolute top-20 sm:top-24 left-4 sm:left-12 z-30 flex flex-wrap items-center gap-2 sm:gap-3 pointer-events-auto">
        <div className="flex bg-neutral-900/90 border border-neutral-800 rounded-md p-1 backdrop-blur-md">
          <button
            onClick={() => setViewMode('trail')}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-mono tracking-wider uppercase transition-colors rounded ${
              viewMode === 'trail'
                ? 'bg-[#ff2203] text-white font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            TRAIL SPAWNER
          </button>
          <button
            onClick={() => setViewMode('archive')}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-mono tracking-wider uppercase transition-colors rounded ${
              viewMode === 'archive'
                ? 'bg-[#ff2203] text-white font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ALL 35MM ({ALL_35MM_IMAGES.length})
          </button>
        </div>

        {viewMode === 'trail' && (
          <div className="flex items-center gap-2">
            <button
              onClick={autoScatter}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white transition-colors backdrop-blur-md rounded"
            >
              AUTO SCATTER
            </button>
            <button
              onClick={clearCanvas}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors backdrop-blur-md rounded"
            >
              CLEAR ({photos.length})
            </button>
          </div>
        )}
      </div>

      {/* Center Prompt when empty in trail mode */}
      {viewMode === 'trail' && photos.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4 text-center">
          <p className="text-lg sm:text-2xl font-bold tracking-widest uppercase text-neutral-500 animate-pulse">
            <span className="hidden md:inline">MOVE YOUR CURSOR TO SPAWN PHOTOS</span>
            <span className="md:hidden">HOLD & DRAG TO SPAWN PHOTOS</span>
          </p>
          <span className="text-[11px] sm:text-xs font-mono text-neutral-600 tracking-widest mt-2 uppercase">
            35MM ANALOG CONTINUOUS RIBBON
          </span>
        </div>
      )}

      {/* TRAIL VIEW: Render spawned film photo cards */}
      {viewMode === 'trail' && (
        <div className="absolute inset-0 pointer-events-none">
          {photos.map((item, index) => {
            const age = photos.length - index;
            // Higher opacity so each image stays crisp and visible
            const opacity = Math.max(0.55, 1 - age * 0.018);

            return (
              <div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(item.image);
                }}
                className={`absolute cursor-pointer transition-transform duration-300 ease-out active:scale-95 ${
                  isTouchActive
                    ? 'pointer-events-none'
                    : 'pointer-events-auto hover:scale-110 hover:z-[70]'
                }`}
                style={{
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
                  opacity,
                  zIndex: index + 5,
                }}
              >
                {/* Responsive 35mm Polaroid/film frame */}
                <div className="bg-white p-2 pb-4 sm:p-2.5 sm:pb-6 shadow-[0_15px_35px_rgba(0,0,0,0.85)] border border-neutral-300 w-36 sm:w-52 group">
                  <div className="relative overflow-hidden aspect-[4/3] bg-neutral-900">
                    <img
                      src={item.image.url}
                      alt={item.image.caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-1.5 flex justify-between items-center text-[8px] sm:text-[9px] font-mono tracking-wider text-neutral-800">
                    <span className="font-bold truncate">{item.image.caption}</span>
                    <span className="text-neutral-500 ml-1">{item.image.location}</span>
                  </div>
                  <div className="text-[7px] sm:text-[8px] font-mono tracking-widest text-[#ff2203] uppercase">
                    {item.image.format}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ARCHIVE VIEW: Full masonry grid of all 70 stills */}
      {viewMode === 'archive' && (
        <div className="absolute inset-0 pt-32 pb-20 px-4 md:px-12 overflow-y-auto no-scrollbar pointer-events-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 border-b border-neutral-800 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                35MM FILM ROLLS ARCHIVE
              </h2>
              <span className="text-xs font-mono text-neutral-400">
                KODAK PORTRA 400 · TRI-X · ARLES & PARIS
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {ALL_35MM_IMAGES.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedPhoto(img)}
                  className="group bg-neutral-950 border border-neutral-800 p-2 hover:border-[#ff2203] transition-all cursor-pointer hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-900">
                    <img
                      src={img.url}
                      alt={img.caption}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-2 flex justify-between items-center text-[10px] font-mono text-neutral-400">
                    <span className="text-white font-medium">{img.caption}</span>
                    <span>{img.location}</span>
                  </div>
                  <div className="text-[9px] font-mono text-neutral-500 uppercase mt-0.5">
                    {img.format} · {img.iso}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Photo Inspection */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 pointer-events-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-neutral-950 border border-neutral-800 p-4 sm:p-6 shadow-2xl flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/80 border border-neutral-700 text-white flex items-center justify-center hover:bg-[#ff2203] transition-colors"
            >
              ✕
            </button>

            {/* Photo preview */}
            <div className="flex-1 bg-black flex items-center justify-center overflow-hidden border border-neutral-900 min-h-[260px]">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="max-h-[60vh] sm:max-h-[75vh] w-auto object-contain"
              />
            </div>

            {/* EXIF / Film metadata */}
            <div className="w-full md:w-72 flex flex-col justify-between py-2">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#ff2203] uppercase">
                  ANALOG ARCHIVE
                </span>
                <h3 className="text-xl sm:text-2xl font-bold uppercase text-white mt-1">
                  {selectedPhoto.caption}
                </h3>
                <div className="mt-4 sm:mt-6 space-y-2.5 font-mono text-xs border-t border-neutral-800 pt-4">
                  <div className="flex justify-between text-neutral-400">
                    <span>EMULSION:</span>
                    <span className="text-white">{selectedPhoto.format}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>LOCATION:</span>
                    <span className="text-white">{selectedPhoto.location}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>SENSITIVITY:</span>
                    <span className="text-white">{selectedPhoto.iso}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>CAPTURE:</span>
                    <span className="text-white">Leica M6 / 35mm</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>STATUS:</span>
                    <span className="text-emerald-400">ARCHIVED</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-800 flex justify-between items-center text-xs font-mono text-neutral-500 mt-4 md:mt-0">
                <span>© RODEO COLLECTIVE</span>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-white hover:text-[#ff2203] uppercase font-bold"
                >
                  CLOSE [✕]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
