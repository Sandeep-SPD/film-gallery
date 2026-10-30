import React, { useState } from 'react';
import { Project } from '../data/rodeoData';
import { CursorMode } from './CustomCursor';

interface EditorialIndexProps {
  projects: Project[];
  activeCategory: string;
  onSelectProject: (project: Project) => void;
  setCursorMode: (mode: CursorMode, text?: string) => void;
}

export const EditorialIndex: React.FC<EditorialIndexProps> = ({
  projects,
  activeCategory,
  onSelectProject,
  setCursorMode,
}) => {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const filtered = projects.filter(
    (p) => activeCategory === 'ALL' || p.category === activeCategory
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen overflow-y-auto pt-32 pb-24 px-6 md:px-16 bg-[#070707] text-white select-none no-scrollbar"
    >
      <div className="max-w-6xl mx-auto">
        {/* Table Header */}
        <div className="grid grid-cols-12 text-[11px] font-mono tracking-widest uppercase text-neutral-500 pb-4 border-b border-neutral-800">
          <div className="col-span-1">INDEX</div>
          <div className="col-span-4 sm:col-span-5">TITLE / PROJECT</div>
          <div className="col-span-3 sm:col-span-2">CLIENT</div>
          <div className="col-span-2 hidden sm:block">CATEGORY</div>
          <div className="col-span-2 sm:col-span-1 text-right">YEAR</div>
          <div className="col-span-2 sm:col-span-1 text-right">ACTION</div>
        </div>

        {/* Project Rows */}
        <div className="divide-y divide-neutral-900">
          {filtered.map((proj, idx) => {
            const isHovered = hoveredProject?.id === proj.id;

            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj)}
                onMouseEnter={() => {
                  setHoveredProject(proj);
                  setCursorMode('view', 'VIEW PROJECT');
                }}
                onMouseLeave={() => {
                  setHoveredProject(null);
                  setCursorMode('default', 'SCROLL OR DRAG');
                }}
                className={`grid grid-cols-12 items-center py-6 sm:py-7 group cursor-pointer transition-colors ${
                  isHovered ? 'text-[#ff2203]' : 'text-neutral-300 hover:text-white'
                }`}
              >
                <div className="col-span-1 font-mono text-xs text-neutral-500">
                  [{String(idx + 1).padStart(2, '0')}]
                </div>
                <div className="col-span-4 sm:col-span-5 font-bold uppercase text-lg sm:text-2xl tracking-tight transition-transform duration-300 group-hover:translate-x-2">
                  <span>{proj.title}</span>
                </div>
                <div className="col-span-3 sm:col-span-2 text-xs sm:text-sm text-neutral-400 font-mono">
                  {proj.client}
                </div>
                <div className="col-span-2 hidden sm:block text-xs font-mono text-neutral-500 uppercase">
                  {proj.category}
                </div>
                <div className="col-span-2 sm:col-span-1 text-right font-mono text-xs text-neutral-500">
                  {proj.year}
                </div>
                <div className="col-span-2 sm:col-span-1 text-right">
                  <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-1 bg-neutral-900 group-hover:bg-[#ff2203] group-hover:text-white transition-colors">
                    REEL ↗
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Video Preview Card on Hover */}
      {hoveredProject && (
        <div
          className="fixed pointer-events-none z-[100] hidden md:block w-72 h-44 bg-black border border-neutral-700 shadow-2xl overflow-hidden -translate-y-1/2 ml-8 transition-transform duration-75"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        >
          {hoveredProject.videoUrl ? (
            <video
              src={hoveredProject.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={hoveredProject.cover}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-2 left-2 text-[10px] font-mono uppercase text-white font-bold">
            {hoveredProject.title}
          </div>
        </div>
      )}
    </div>
  );
};
