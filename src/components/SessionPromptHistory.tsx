import React from 'react';
import { History, Play, Maximize2, Sparkles, Clock, Check } from 'lucide-react';
import { GeneratedApp } from '../types';

interface SessionPromptHistoryProps {
  sessionApps: GeneratedApp[];
  currentHtml: string;
  onSelectSessionApp: (app: GeneratedApp) => void;
  onOpenModal: (app: GeneratedApp) => void;
}

export const SessionPromptHistory: React.FC<SessionPromptHistoryProps> = ({
  sessionApps,
  currentHtml,
  onSelectSessionApp,
  onOpenModal,
}) => {
  if (sessionApps.length === 0) return null;

  return (
    <div className="w-full max-w-2xl bg-[#16161a] border border-[#2a2a35] rounded-[24px] p-6 shadow-xl space-y-4 transition-all">
      <div className="flex items-center justify-between border-b border-[#2a2a35] pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#6c63ff]" />
          <h3 className="text-xs font-bold text-[#8888aa] uppercase tracking-widest">
            Prompts de esta sesión ({sessionApps.length})
          </h3>
        </div>
        <span className="text-[10px] text-[#8888aa]">
          Haz clic en cualquier prompt para recargarlo en el preview
        </span>
      </div>

      <div className="flex flex-col gap-2.5 max-h-[280px] overflow-y-auto pr-1">
        {sessionApps.map((app) => {
          const isActive = currentHtml === app.html;

          return (
            <div
              key={app.id}
              onClick={() => onSelectSessionApp(app)}
              className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isActive
                  ? 'bg-[#1e1e24] border-[#6c63ff] shadow-[0_0_0_1px_#6c63ff]'
                  : 'bg-[#131317] border-[#2a2a35] hover:border-[#6c63ff]/60 hover:bg-[#1e1e24]/70'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {isActive && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#4ade80] bg-[#4ade80]/10 px-2 py-0.5 rounded-md border border-[#4ade80]/20">
                      <Check className="w-3 h-3" /> En Preview
                    </span>
                  )}
                  <span className="text-[10px] font-semibold uppercase text-[#8888aa] bg-[#1e1e24] px-2 py-0.5 rounded border border-[#2a2a35]">
                    {app.provider}
                  </span>
                  <span className="text-[10px] text-[#555577] font-mono">
                    {app.createdAt}
                  </span>
                </div>
                <p className="text-xs text-[#e8e8f0] font-medium line-clamp-2 leading-relaxed">
                  «{app.prompt}»
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSessionApp(app);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#6c63ff] text-white'
                      : 'bg-[#1e1e24] text-[#8888aa] group-hover:text-[#e8e8f0] group-hover:bg-[#2a2a35]'
                  }`}
                  title="Cargar prompt y preview"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isActive ? 'Cargado' : 'Cargar'}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModal(app);
                  }}
                  className="p-1.5 text-[#8888aa] hover:text-[#e8e8f0] bg-[#1e1e24] hover:bg-[#2a2a35] border border-[#2a2a35] rounded-lg transition-colors cursor-pointer"
                  title="Ver en pantalla completa"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
