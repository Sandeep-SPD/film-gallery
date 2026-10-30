import React, { useState, useCallback } from 'react';
import { PROJECTS, Project } from './data/rodeoData';
import { Loader } from './components/Loader';
import { CursorMode } from './components/CustomCursor';
import { HeaderNav } from './components/HeaderNav';
import { FooterHUD } from './components/FooterHUD';
import { InfiniteGridGallery } from './components/InfiniteGridGallery';
import { PhotoTrailGallery } from './components/PhotoTrailGallery';
import { EditorialIndex } from './components/EditorialIndex';
import { ProjectModal } from './components/ProjectModal';
import { OverlayMenu } from './components/OverlayMenu';

const CATEGORIES = ['ALL', 'DIGITAL', 'DOCUMENTARY', 'COMMERCIAL', '35 MM'];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'grid' | 'trail' | 'index'>('grid');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setCursorModeState] = useState<CursorMode>('default');
  const [, setCursorText] = useState<string | undefined>(undefined);
  const [isTilted, setIsTilted] = useState(true);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const setCursorMode = useCallback((mode: CursorMode, text?: string) => {
    setCursorModeState(mode);
    setCursorText(text);
  }, []);

  const handleCoordsChange = useCallback((x: number, y: number) => {
    setCoords({ x, y });
  }, []);

  const handleResetCoords = () => {
    const event = new KeyboardEvent('keydown', { key: 'c' });
    window.dispatchEvent(event);
  };

  return (
    <div className="relative w-screen h-screen bg-[#070707] text-white overflow-hidden font-sans">
      {/* Intro Preloader */}
      {isLoading && (
        <Loader onLoaded={() => setIsLoading(false)} />
      )}

      {/* Atmospheric Analog VHS Scanlines & Film Grain */}
      <div className="vhs-overlay pointer-events-none" />
      <div className="film-grain pointer-events-none" />

      {/* Header Navigation */}
      <HeaderNav
        activeView={activeView}
        onSelectView={(v) => {
          setActiveView(v);
          if (v === 'trail') {
            setCursorMode('touchAndMove', 'TOUCH AND MOVE');
          } else {
            setCursorMode('default', 'SCROLL OR DRAG');
          }
        }}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        categories={CATEGORIES}
        isTilted={isTilted}
        onToggleTilt={() => setIsTilted(!isTilted)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onLogoClick={() => {
          setActiveView('grid');
          setActiveCategory('ALL');
        }}
      />

      {/* Active Gallery View Area */}
      <main className="w-full h-full">
        {activeView === 'grid' && (
          <InfiniteGridGallery
            projects={PROJECTS}
            activeCategory={activeCategory}
            onSelectProject={(proj) => setSelectedProject(proj)}
            setCursorMode={setCursorMode}
            onCoordsChange={handleCoordsChange}
            isTilted={isTilted}
          />
        )}

        {activeView === 'trail' && (
          <PhotoTrailGallery
            setCursorMode={setCursorMode}
            onClose={() => setActiveView('grid')}
          />
        )}

        {activeView === 'index' && (
          <EditorialIndex
            projects={PROJECTS}
            activeCategory={activeCategory}
            onSelectProject={(proj) => setSelectedProject(proj)}
            setCursorMode={setCursorMode}
          />
        )}
      </main>

      {/* Bottom Status & Info Bar */}
      <FooterHUD
        activeView={activeView}
        onSelectView={setActiveView}
        coords={coords}
        onResetCoords={handleResetCoords}
        projectCount={PROJECTS.length}
      />

      {/* Full Cinematic Video & Case Study Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          allProjects={PROJECTS}
          onClose={() => setSelectedProject(null)}
          onSelectProject={(p) => setSelectedProject(p)}
        />
      )}

      {/* Full-bleed Rodeo Navigation Menu */}
      <OverlayMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectView={(v) => {
          setActiveView(v);
          setIsMenuOpen(false);
        }}
        onSelectProject={(p) => {
          setSelectedProject(p);
          setIsMenuOpen(false);
        }}
        projects={PROJECTS}
      />
    </div>
  );
}
