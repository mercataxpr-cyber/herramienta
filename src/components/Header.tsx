import React from 'react';
import { History, LayoutGrid, Terminal, Cpu, QrCode } from 'lucide-react';
import { CodexConnectionStatus } from '../types';

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  viewMode: 'home' | 'workspace';
  setViewMode: (mode: 'home' | 'workspace') => void;
  codexStatus: CodexConnectionStatus;
  onOpenQR?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onOpenHistory,
  viewMode,
  setViewMode,
  codexStatus,
  onOpenQR,
}) => {
  return (
    <header className="h-[72px] px-4 sm:px-8 flex items-center justify-between border-b border-[#2a2a35] bg-[#0d0d0f]/95 backdrop-blur-md sticky top-0 z-40">
      {/* BRAND & LOGO */}
      <div className="flex items-center gap-3.5">
        <svg
          className="w-9 h-9 flex-shrink-0"
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="3" y="14" width="16" height="14" rx="3" fill="#6c63ff" />
          <rect x="16" y="18" width="5" height="6" rx="1.5" fill="#6c63ff" />
          <rect
            x="23"
            y="14"
            width="16"
            height="14"
            rx="3"
            fill="#1e1e24"
            stroke="#6c63ff"
            strokeWidth="1.5"
          />
          <rect
            x="21"
            y="18"
            width="5"
            height="6"
            rx="1.5"
            fill="#1e1e24"
            stroke="#6c63ff"
            strokeWidth="1.5"
          />
          <circle cx="21" cy="21" r="2" fill="#6c63ff" />
        </svg>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#e8e8f0]">
            DC-ha<span className="text-[#6c63ff]">Zlo</span>
          </h1>
          <span className="text-[10px] text-[#8888aa] hidden sm:block -mt-1 font-mono">
            Orquestador de Desarrollo AI
          </span>
        </div>
      </div>

      {/* CENTER: VIEW MODE SWITCHER */}
      <div className="flex items-center p-1 bg-[#16161a] border border-[#2a2a35] rounded-xl shadow-inner">
        <button
          onClick={() => setViewMode('workspace')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            viewMode === 'workspace'
              ? 'bg-[#6c63ff] text-white shadow-md'
              : 'text-[#8888aa] hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Workspace</span>
        </button>
        <button
          onClick={() => setViewMode('home')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            viewMode === 'home'
              ? 'bg-[#6c63ff] text-white shadow-md'
              : 'text-[#8888aa] hover:text-white'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Inicio / Proyectos</span>
        </button>
      </div>

      {/* RIGHT: CODEX STATUS & HISTORY */}
      <div className="flex items-center gap-2.5">
        {/* CODEX BADGE */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#16161a] border border-[#2a2a35] rounded-xl text-xs font-mono">
          <Cpu className="w-3.5 h-3.5 text-[#6c63ff]" />
          <span className="text-white font-semibold">ChatGPT / Codex</span>
          {codexStatus === 'connected' ? (
            <span className="flex items-center gap-1 text-[11px] text-[#3ecf8e] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#3ecf8e] animate-pulse" /> ● Conectado
            </span>
          ) : (
            <span className="text-[11px] text-[#8888aa]">● Listo</span>
          )}
        </div>

        {onOpenQR && (
          <button
            onClick={onOpenQR}
            className="p-2 text-[#cccccc] bg-[#16161a] border border-[#2a2a35] hover:border-[#6c63ff] rounded-xl transition-all shadow-sm cursor-pointer hidden sm:flex items-center gap-1 text-xs"
            title="Ver Código QR para Celular"
          >
            <QrCode className="w-4 h-4 text-[#6c63ff]" />
            <span className="hidden xl:inline">QR Celular</span>
          </button>
        )}

        {/* HISTORY BUTTON */}
        <button
          onClick={onOpenHistory}
          className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#e8e8f0] bg-[#16161a] border border-[#2a2a35] hover:border-[#6c63ff] rounded-xl transition-all shadow-sm cursor-pointer"
          title="Ver historial de apps generadas"
        >
          <History className="w-4 h-4 text-[#6c63ff]" />
          <span className="hidden sm:inline">Historial</span>
          {historyCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-[#6c63ff] rounded-full">
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
