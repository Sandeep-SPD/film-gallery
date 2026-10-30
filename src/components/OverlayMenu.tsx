import React, { useState } from 'react';
import { AWARDS_LIST, PLAYLISTS_DATA, Project } from '../data/rodeoData';

interface OverlayMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: 'grid' | 'trail' | 'index') => void;
  onSelectProject: (p: Project) => void;
  projects: Project[];
}

export const OverlayMenu: React.FC<OverlayMenuProps> = ({
  isOpen,
  onClose,
  onSelectView,
  onSelectProject,
  projects,
}) => {
  const [activeTab, setActiveTab] = useState<'none' | 'projects' | 'awards' | 'playlist' | 'about'>('none');
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[700] bg-black text-white flex flex-col justify-between overflow-y-auto p-6 md:p-14 animate-in fade-in duration-300">
      {/* Top Header inside Menu */}
      <div className="flex justify-between items-center border-b border-neutral-900 pb-6">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">
          RODEO FILM · CREATIVE COLLECTIVE · PARIS
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-3 text-sm font-mono uppercase tracking-widest text-neutral-300 hover:text-[#ff2203] transition-colors cursor-pointer"
        >
          <span>CLOSE</span>
          <span className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center text-xs">
            ✕
          </span>
        </button>
      </div>

      {/* Main Menu Grid */}
      <div className="my-auto py-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Navigation list */}
        <nav className="lg:col-span-6 flex flex-col gap-2 sm:gap-4">
          {/* Projects Button */}
          <button
            onMouseEnter={() => setActiveTab('projects')}
            onClick={() => {
              onSelectView('grid');
              onClose();
            }}
            className="text-left text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-white hover:text-[#ff2203] transition-colors vhs-glitch group flex items-baseline gap-4"
          >
            <span>PROJECTS</span>
            <span className="text-sm sm:text-lg font-mono text-neutral-600 group-hover:text-[#ff2203]">
              ({projects.length})
            </span>
          </button>

          {/* Awards Button */}
          <button
            onMouseEnter={() => setActiveTab('awards')}
            className={`text-left text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight transition-colors vhs-glitch group flex items-baseline gap-4 ${
              activeTab === 'awards' ? 'text-[#ff2203]' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>AWARDS</span>
            <span className="text-sm sm:text-lg font-mono text-neutral-600 group-hover:text-[#ff2203]">
              (05)
            </span>
          </button>

          {/* Gallery 35mm Button */}
          <button
            onMouseEnter={() => setActiveTab('none')}
            onClick={() => {
              onSelectView('trail');
              onClose();
            }}
            className="text-left text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-neutral-400 hover:text-[#ff2203] transition-colors vhs-glitch group flex items-baseline gap-4"
          >
            <span>35MM GALLERY</span>
            <span className="text-xs sm:text-sm font-mono px-2 py-0.5 bg-[#ff2203] text-white">
              INTERACTIVE
            </span>
          </button>

          {/* Playlist Button */}
          <button
            onMouseEnter={() => setActiveTab('playlist')}
            className={`text-left text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight transition-colors vhs-glitch group flex items-baseline gap-4 ${
              activeTab === 'playlist' ? 'text-[#ff2203]' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>PLAYLIST</span>
            <span className="text-sm sm:text-lg font-mono text-neutral-600 group-hover:text-[#ff2203]">
              (03)
            </span>
          </button>

          {/* About Button */}
          <button
            onMouseEnter={() => setActiveTab('about')}
            className={`text-left text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight transition-colors vhs-glitch group flex items-baseline gap-4 ${
              activeTab === 'about' ? 'text-[#ff2203]' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>ABOUT</span>
          </button>
        </nav>

        {/* Dynamic Context Panel depending on hovered item */}
        <div className="lg:col-span-6 bg-neutral-950/80 border border-neutral-900 p-6 md:p-8 min-h-[380px] flex flex-col justify-center">
          {activeTab === 'projects' && (
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase text-[#ff2203] tracking-widest">
                RECENT FEATURED REELS
              </span>
              <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
                {projects.slice(0, 6).map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj);
                      onClose();
                    }}
                    onMouseEnter={() => setHoveredProject(proj)}
                    className="flex justify-between items-center py-2 border-b border-neutral-900 hover:border-neutral-700 cursor-pointer group"
                  >
                    <span className="text-sm font-bold uppercase group-hover:text-[#ff2203]">
                      {proj.title}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">
                      {proj.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'awards' && (
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase text-[#ff2203] tracking-widest">
                RECOGNITIONS & TROPHIES
              </span>
              <div className="space-y-3">
                {AWARDS_LIST.map((aw, i) => (
                  <div key={i} className="border-b border-neutral-900 pb-2">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold uppercase text-white">{aw.title}</h4>
                      <span className="text-xs font-mono text-neutral-500">{aw.date}</span>
                    </div>
                    <div className="text-xs text-neutral-400 font-mono mt-0.5">
                      {aw.project} · <span className="text-[#ff2203]">{aw.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'playlist' && (
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase text-[#ff2203] tracking-widest">
                CURATED SOUNDTRACKS
              </span>
              <div className="space-y-3">
                {PLAYLISTS_DATA.map((pl, i) => (
                  <a
                    key={i}
                    href={pl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-neutral-900/60 border border-neutral-800 hover:border-[#ff2203] transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold uppercase text-white">{pl.title}</span>
                      <span className="text-xs font-mono text-[#ff2203]">{pl.trackCount}</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">{pl.description}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase text-[#ff2203] tracking-widest">
                MANIFESTO
              </span>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Rodeo Film is a collective based on the association of diverse talents. Comprising directors, photographers, editors, designers, and composers, we believe in the power of compelling visual stories that touch the heart and leave a lasting impression.
              </p>
              <p className="text-sm text-neutral-400 leading-relaxed">
                We believe that every ordinary life holds an extraordinary story. We are convinced that the simplest moments can be transformed into captivating narratives, uncovering beauty in everyday life and revealing the exceptional in the ordinary.
              </p>
              <div className="pt-4 border-t border-neutral-900 flex justify-between items-center text-xs font-mono">
                <span className="text-neutral-500">PARIS, FRANCE</span>
                <a
                  href="mailto:contact@rodeo.film"
                  className="text-white hover:text-[#ff2203] font-bold"
                >
                  CONTACT@RODEO.FILM
                </a>
              </div>
            </div>
          )}

          {activeTab === 'none' && (
            <div className="text-center py-10">
              <span className="text-xs font-mono tracking-widest uppercase text-neutral-600">
                HOVER OVER NAVIGATION TO EXPLORE ARCHIVES
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer inside Menu */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-neutral-900 pt-6 text-xs font-mono text-neutral-500">
        <div>
          © 2024 RODEO FILM · ALL RIGHTS RESERVED
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://instagram.com/rodeo_film"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white uppercase transition-colors"
          >
            INSTAGRAM ↗
          </a>
          <a
            href="https://vimeo.com/rodeofilm"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white uppercase transition-colors"
          >
            VIMEO ↗
          </a>
          <a
            href="https://troa.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white uppercase transition-colors"
          >
            WEBSITE BY TROA ↗
          </a>
        </div>
      </div>
    </div>
  );
};
