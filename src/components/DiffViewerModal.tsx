import React from 'react';
import { X, FileCode, Check, Copy } from 'lucide-react';
import { ModifiedFile } from '../types';

interface DiffViewerModalProps {
  file: ModifiedFile | null;
  onClose: () => void;
}

export const DiffViewerModal: React.FC<DiffViewerModalProps> = ({ file, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!file) return null;

  const handleCopy = () => {
    if (file.newContent) {
      navigator.clipboard.writeText(file.newContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-[#16161a] border border-[#2a2a35] rounded-[24px] w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-[#2a2a35] flex items-center justify-between bg-[#131317]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#6c63ff]/10 rounded-lg text-[#6c63ff]">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{file.path}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    file.status === 'added'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : file.status === 'deleted'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {file.status === 'added' ? '+ Nuevo' : file.status === 'deleted' ? '- Eliminado' : 'M Modificado'}
                </span>
              </div>
              <p className="text-xs text-[#8888aa] mt-0.5">
                +{file.additions} líneas añadidas, -{file.deletions} líneas eliminadas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {file.newContent && (
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-[#1e1e24] hover:bg-[#2a2a35] text-xs text-[#cccccc] rounded-lg transition-colors flex items-center gap-1.5 border border-[#2a2a35] cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar Nuevo Código'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#2a2a35] text-[#8888aa] hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CODE DIFF CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto font-mono text-xs leading-relaxed space-y-4 bg-[#0e0e11]">
          {file.originalContent && (
            <div>
              <div className="text-[11px] font-sans font-bold text-[#8888aa] mb-1 uppercase tracking-wider">
                Versión Anterior
              </div>
              <pre className="p-4 bg-red-950/20 border border-red-900/30 rounded-xl text-red-300 overflow-x-auto whitespace-pre-wrap">
                {file.originalContent}
              </pre>
            </div>
          )}

          <div>
            <div className="text-[11px] font-sans font-bold text-[#8888aa] mb-1 uppercase tracking-wider">
              {file.originalContent ? 'Versión Modificada' : 'Contenido del Archivo'}
            </div>
            <pre className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-emerald-300 overflow-x-auto whitespace-pre-wrap">
              {file.newContent || 'Contenido actualizado en el repositorio del workspace.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
