import React from 'react';
import { X, Play, Trash2, Download, Calendar, Cpu, Sparkles } from 'lucide-react';
import { GeneratedApp } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  apps: GeneratedApp[];
  onSelectApp: (app: GeneratedApp) => void;
  onDeleteApp: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  apps,
  onSelectApp,
  onDeleteApp,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-[#16161a] border-l border-[#2a2a35] h-full flex flex-col shadow-2xl animate-modal-in">
        {/* HEADER */}
        <div className="p-4 border-b border-[#2a2a35] flex items-center justify-between bg-[#1e1e24]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#e8e8f0]">
              Historial de Apps ({apps.length})
            </span>
          </div>
          <div className="flex items-center gap-2">
            {apps.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-[#ff6584] hover:underline px-2 py-1"
              >
                Vaciar todo
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#8888aa] hover:text-[#e8e8f0] rounded-lg hover:bg-[#2a2a35] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {apps.length === 0 ? (
            <div className="text-center py-12 text-[#8888aa]">
              <Sparkles className="w-10 h-10 mx-auto opacity-20 mb-3" />
              <p className="text-sm">Aún no has generado mini-apps.</p>
              <p className="text-xs mt-1">Escribe tu idea y presiona "Generar App".</p>
            </div>
          ) : (
            apps.map((app) => (
              <div
                key={app.id}
                className="bg-[#1e1e24] border border-[#2a2a35] hover:border-[#6c63ff] rounded-xl p-3.5 transition-all flex flex-col gap-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-xs text-[#e8e8f0] line-clamp-2">
                    {app.title}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteApp(app.id);
                    }}
                    className="text-[#8888aa] hover:text-[#ff6584] p-1 rounded transition-colors"
                    title="Eliminar del historial"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[0.65rem] text-[#8888aa]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {app.createdAt}
                  </span>
                  <span className="flex items-center gap-1 uppercase bg-[#16161a] px-1.5 py-0.5 rounded border border-[#2a2a35]">
                    <Cpu className="w-2.5 h-2.5 text-[#6c63ff]" /> {app.provider}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      onSelectApp(app);
                      onClose();
                    }}
                    className="flex-1 py-1.5 px-3 bg-[#6c63ff] hover:bg-[#8b5cf6] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" /> Abrir Vista
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
