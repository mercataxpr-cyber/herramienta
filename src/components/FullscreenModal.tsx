import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, Copy, Check, Code, Eye, X } from 'lucide-react';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  title: string;
}

export const FullscreenModal: React.FC<FullscreenModalProps> = ({
  isOpen,
  onClose,
  html,
  title,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'app'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div
      id="modalOverlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 animate-fade-in"
    >
      <div className="w-full h-[calc(100vh-48px)] max-w-[1100px] max-h-[820px] bg-[#16161a] rounded-2xl border border-[#2a2a35] overflow-hidden shadow-[0_32px_120px_rgba(0,0,0,0.8)] flex flex-col animate-modal-in">
        {/* MODAL TITLEBAR */}
        <div className="bg-[#1e1e24] px-4 py-3 flex items-center justify-between border-b border-[#2a2a35] flex-shrink-0 flex-wrap gap-2">
          {/* DOTS & CLOSE */}
          <div className="flex items-center gap-2">
            <button
              id="closeModal"
              onClick={onClose}
              className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] hover:opacity-80 transition-opacity flex items-center justify-center group relative cursor-pointer"
              title="Cerrar modal"
            >
              <X className="w-2.5 h-2.5 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#28ca41]" />
          </div>

          {/* TITLE */}
          <span
            id="modalTitle"
            className="text-xs md:text-sm text-[#e8e8f0] font-medium truncate max-w-[280px] md:max-w-[400px]"
            title={title}
          >
            {title}
          </span>

          {/* VIEW TAB & ACTIONS */}
          <div className="flex items-center gap-2">
            {/* VIEW MODE TOGGLE */}
            <div className="flex bg-[#16161a] p-0.5 rounded-lg border border-[#2a2a35]">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                  activeTab === 'preview'
                    ? 'bg-[#6c63ff] text-white'
                    : 'text-[#8888aa] hover:text-[#e8e8f0]'
                }`}
              >
                <Eye className="w-3 h-3" /> Vista
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                  activeTab === 'code'
                    ? 'bg-[#6c63ff] text-white'
                    : 'text-[#8888aa] hover:text-[#e8e8f0]'
                }`}
              >
                <Code className="w-3 h-3" /> Código
              </button>
            </div>

            {/* COPY */}
            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 text-xs bg-[#16161a] hover:bg-[#2a2a35] text-[#e8e8f0] border border-[#2a2a35] rounded-lg transition-colors flex items-center gap-1"
              title="Copiar HTML completo"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-[#4ade80]" /> ¡Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#6c63ff]" /> Copiar
                </>
              )}
            </button>

            {/* DOWNLOAD */}
            <button
              onClick={handleDownload}
              className="px-2.5 py-1 text-xs bg-[#16161a] hover:bg-[#2a2a35] text-[#e8e8f0] border border-[#2a2a35] rounded-lg transition-colors flex items-center gap-1"
              title="Descargar archivo app.html"
            >
              <Download className="w-3 h-3 text-[#6c63ff]" /> Descargar
            </button>

            {/* OPEN IN NEW TAB */}
            <button
              onClick={handleOpenNewTab}
              className="p-1.5 text-xs bg-[#16161a] hover:bg-[#2a2a35] text-[#e8e8f0] border border-[#2a2a35] rounded-lg transition-colors"
              title="Abrir en ventana independiente"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#6c63ff]" />
            </button>
          </div>
        </div>

        {/* MODAL CONTENT */}
        <div className="flex-1 w-full overflow-hidden bg-white relative">
          {activeTab === 'preview' ? (
            <iframe
              id="modalIframe"
              srcDoc={html}
              title={title}
              sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
              className="w-full h-full border-none bg-white"
            />
          ) : (
            <div className="w-full h-full bg-[#0d0d0f] p-4 overflow-auto font-mono text-xs text-[#e8e8f0] leading-relaxed">
              <pre>
                <code>{html}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
