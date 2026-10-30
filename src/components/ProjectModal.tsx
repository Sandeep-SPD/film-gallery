import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../data/rodeoData';

interface ProjectModalProps {
  project: Project | null;
  allProjects: Project[];
  onClose: () => void;
  onSelectProject: (p: Project) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  allProjects,
  onClose,
  onSelectProject,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' && videoRef.current) {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'ArrowRight' && project) {
        const currIdx = allProjects.findIndex((p) => p.id === project.id);
        const next = allProjects[(currIdx + 1) % allProjects.length];
        onSelectProject(next);
      }
      if (e.key === 'ArrowLeft' && project) {
        const currIdx = allProjects.findIndex((p) => p.id === project.id);
        const prev = allProjects[(currIdx - 1 + allProjects.length) % allProjects.length];
        onSelectProject(prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, project, allProjects, onSelectProject]);

  if (!project) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(cur);
    setDuration(dur);
    setProgress((cur / dur) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * (videoRef.current.duration || 1);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentIdx = allProjects.findIndex((p) => p.id === project.id);
  const nextProject = allProjects[(currentIdx + 1) % allProjects.length];
  const prevProject = allProjects[(currentIdx - 1 + allProjects.length) % allProjects.length];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[600] bg-black text-white flex flex-col justify-between overflow-hidden animate-in fade-in duration-300"
    >
      {/* Top Header Bar */}
      <div className="relative z-30 px-6 py-6 md:px-12 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono tracking-widest text-[#ff2203] uppercase">
            RODEO FILM ARCHIVE
          </span>
          <span className="text-neutral-600">/</span>
          <span className="text-xs font-mono uppercase text-neutral-400">
            {project.category}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded border transition-colors ${
              showInfo
                ? 'bg-white text-black border-white'
                : 'bg-black/60 text-neutral-300 border-neutral-700 hover:text-white'
            }`}
          >
            {showInfo ? 'HIDE INFOS' : 'INFOS'}
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center hover:bg-[#ff2203] transition-colors"
            aria-label="Close Project"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main Video View Area */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {project.videoUrl ? (
          <video
            ref={videoRef}
            src={project.videoUrl}
            autoPlay
            loop
            playsInline
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />
        ) : (
          <img
            src={project.cover}
            alt={project.title}
            className="w-full h-full object-contain"
          />
        )}

        {/* Big play/pause overlay when paused */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full bg-[#ff2203] text-white flex items-center justify-center shadow-2xl pl-1 animate-in zoom-in-75">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Side Nav Arrows */}
        <button
          onClick={() => onSelectProject(prevProject)}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-[#ff2203] border border-white/10 rounded-full text-white backdrop-blur-md transition-colors"
          title={`Previous: ${prevProject.title}`}
        >
          ←
        </button>
        <button
          onClick={() => onSelectProject(nextProject)}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-[#ff2203] border border-white/10 rounded-full text-white backdrop-blur-md transition-colors"
          title={`Next: ${nextProject.title}`}
        >
          →
        </button>

        {/* Info Slide-in Drawer */}
        {showInfo && (
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-neutral-950/95 border-l border-neutral-800 p-8 z-40 overflow-y-auto backdrop-blur-md animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-start pb-4 border-b border-neutral-800">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#ff2203] uppercase">
                  PROJECT CREDITS
                </span>
                <h4 className="text-xl font-bold uppercase text-white mt-1">
                  {project.title}
                </h4>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="text-neutral-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed mt-6">
              {project.description}
            </p>

            <div className="mt-8 space-y-4 font-mono text-xs border-t border-neutral-800 pt-6">
              <div className="flex justify-between">
                <span className="text-neutral-500">CLIENT</span>
                <span className="text-white font-medium">{project.client}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">DIRECTOR</span>
                <span className="text-white font-medium">{project.director}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">DOP</span>
                <span className="text-white font-medium">{project.cinematography}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">FORMAT</span>
                <span className="text-white font-medium">{project.format}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">YEAR</span>
                <span className="text-white font-medium">{project.year}</span>
              </div>
            </div>

            {/* Stills Gallery */}
            {project.stills && project.stills.length > 0 && (
              <div className="mt-8 border-t border-neutral-800 pt-6">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                  35MM BEHIND THE SCENES
                </span>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {project.stills.map((still, idx) => (
                    <img
                      key={idx}
                      src={still}
                      alt="Still"
                      className="w-full h-24 object-cover border border-neutral-800 hover:border-[#ff2203] transition-colors"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Video Controls & Title */}
      <div className="relative z-30 px-6 py-6 md:px-12 bg-gradient-to-t from-black/95 to-transparent flex flex-col gap-3">
        {/* Scrubber Progress Bar */}
        <div
          onClick={handleSeek}
          className="w-full h-2 bg-neutral-800 hover:h-3 cursor-pointer transition-all relative rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-[#ff2203] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          {/* Title & Category */}
          <div>
            <h2 className="text-xl sm:text-3xl font-bold uppercase tracking-tight text-white">
              {project.title}
            </h2>
            <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 uppercase mt-0.5">
              <span>{project.category}</span>
              <span>·</span>
              <span>{project.client}</span>
              <span>·</span>
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-[#ff2203] text-xs font-mono uppercase tracking-wider text-white transition-colors"
            >
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </button>
            <button
              onClick={toggleMute}
              className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-[#ff2203] text-xs font-mono uppercase tracking-wider text-white transition-colors"
            >
              {isMuted ? 'UNMUTE 🔈' : 'MUTE 🔊'}
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-[#ff2203] text-xs font-mono uppercase tracking-wider text-white transition-colors hidden sm:block"
            >
              FULLSCREEN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
