import React, { useState } from 'react';
import {
  Smartphone,
  Tablet,
  Monitor,
  RotateCw,
  ExternalLink,
  Maximize2,
  Globe,
  Sparkles,
} from 'lucide-react';

interface LivePreviewPanelProps {
  html: string;
  appTitle: string;
  onOpenFullscreen: () => void;
}

export const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({
  html,
  appTitle,
  onOpenFullscreen,
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'w-full';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0e0e11] overflow-hidden">
      {/* HEADER CONTROLS */}
      <div className="px-4 py-3 bg-[#131317] border-b border-[#2a2a35] flex flex-wrap items-center justify-between gap-3">
        {/* TITLE & DEV SERVER BADGE */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3ecf8e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3ecf8e]"></span>
            </span>
            <span className="text-xs font-bold text-white tracking-wide truncate max-w-[180px]">
              {appTitle || 'App Live Preview'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-[#8888aa] bg-[#1a1a20] px-2.5 py-1 rounded-lg border border-[#2a2a35]">
            <Globe className="w-3 h-3 text-[#6c63ff]" />
            <span>localhost:3000/preview/live-app</span>
          </div>
        </div>

        {/* CONTROLS: VIEWPORT + ACTIONS */}
        <div className="flex items-center gap-3">
          {/* VIEWPORT TOGGLES */}
          <div className="flex items-center p-1 bg-[#1e1e24] rounded-lg border border-[#2a2a35]">
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewport === 'mobile'
                  ? 'bg-[#6c63ff] text-white shadow-sm'
                  : 'text-[#8888aa] hover:text-white'
              }`}
              title="Vista Móvil (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewport === 'tablet'
                  ? 'bg-[#6c63ff] text-white shadow-sm'
                  : 'text-[#8888aa] hover:text-white'
              }`}
              title="Vista Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewport === 'desktop'
                  ? 'bg-[#6c63ff] text-white shadow-sm'
                  : 'text-[#8888aa] hover:text-white'
              }`}
              title="Vista Desktop (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRefresh}
              className="p-1.5 bg-[#1e1e24] hover:bg-[#2a2a35] text-[#8888aa] hover:text-white rounded-lg border border-[#2a2a35] transition-colors cursor-pointer"
              title="Refrescar Dev Server"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleOpenNewTab}
              className="p-1.5 bg-[#1e1e24] hover:bg-[#2a2a35] text-[#8888aa] hover:text-white rounded-lg border border-[#2a2a35] transition-colors cursor-pointer"
              title="Abrir en Nueva Pestana"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenFullscreen}
              className="p-1.5 bg-[#6c63ff] hover:bg-[#5b52e0] text-white rounded-lg transition-colors cursor-pointer shadow-sm"
              title="Expandir Pantalla Completa"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* IFRAME PREVIEW CONTAINER */}
      <div className="flex-1 bg-[#09090b] p-4 flex items-center justify-center overflow-auto">
        {!html ? (
          <div className="text-center p-8 text-[#8888aa] space-y-3">
            <div className="p-4 bg-[#16161a] rounded-2xl border border-[#2a2a35] inline-block text-[#6c63ff]">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-sm font-bold text-white">Dev Server Inicializándose</h3>
            <p className="text-xs max-w-sm">
              Escribe una instrucción en el panel de agente para compilar la primera versión en vivo de tu aplicación.
            </p>
          </div>
        ) : (
          <div
            className={`h-full w-full ${getViewportWidth()} transition-all duration-300 bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#2a2a35] relative`}
          >
            <iframe
              key={key}
              srcDoc={html}
              title={appTitle || 'App Preview'}
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
            />
          </div>
        )}
      </div>
    </div>
  );
};
