import React from 'react';
import { Sparkles, Terminal, FolderGit2, PlusCircle, Wrench, Lightbulb, Play } from 'lucide-react';
import { ProviderType } from '../types';

interface PromptCardProps {
  prompt: string;
  setPrompt: (value: string) => void;
  provider: ProviderType;
  setProvider: (provider: ProviderType) => void;
  onStartWorkspace: (mode: 'new' | 'repo') => void;
  isLoading: boolean;
  statusMessage: string;
  statusType: 'error' | 'success' | 'info' | '';
  isIterating: boolean;
  setIsIterating: (val: boolean) => void;
  currentAppTitle?: string;
  onNewApp: () => void;
}

const NEW_PROJECT_PRESETS = [
  'Dashboard con gráficos interactivos y tabla de usuarios en tiempo real',
  'Aplicación de gestión de proyectos tipo Kanban con arrastrar y soltar',
  'Plataforma SaaS con autenticación, facturación y panel de administración',
  'Buscador de clima con mapas interactivos y pronóstico de 7 días',
  'Editor de código web en vivo con resaltado de sintaxis y vista previa',
  'Tienda e-commerce con carrito de compras, filtros y checkout',
];

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  setPrompt,
  provider,
  setProvider,
  onStartWorkspace,
  isLoading,
  statusMessage,
  statusType,
  isIterating,
  setIsIterating,
  currentAppTitle,
  onNewApp,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading) {
        onStartWorkspace('new');
      }
    }
  };

  return (
    <div className="w-full max-w-3xl bg-[#16161a] border border-[#2a2a35] rounded-[24px] p-6 sm:p-8 shadow-2xl space-y-6 transition-all">
      {/* ACTION LAUNCHPAD CTA BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            onNewApp();
            setIsIterating(false);
          }}
          className={`p-4 rounded-2xl border transition-all flex items-center gap-3.5 text-left cursor-pointer ${
            !isIterating
              ? 'bg-[#6c63ff]/10 border-[#6c63ff] text-white shadow-lg'
              : 'bg-[#1a1a20] border-[#2a2a35] text-[#8888aa] hover:border-[#6c63ff]/50 hover:text-white'
          }`}
        >
          <div className="p-3 bg-[#6c63ff] text-white rounded-xl shadow-md">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">NUEVO PROYECTO</h3>
            <p className="text-xs text-[#8888aa] mt-0.5">Crear workspace y dev server desde cero</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            onStartWorkspace('repo');
          }}
          className="p-4 rounded-2xl border bg-[#1a1a20] border-[#2a2a35] hover:border-[#6c63ff]/50 text-[#8888aa] hover:text-white transition-all flex items-center gap-3.5 text-left cursor-pointer"
        >
          <div className="p-3 bg-[#1e1e24] border border-[#2a2a35] text-[#3ecf8e] rounded-xl shadow-md">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">CONECTAR REPOSITORIO</h3>
            <p className="text-xs text-[#8888aa] mt-0.5">Clonar proyecto GitHub existente en sandbox</p>
          </div>
        </button>
      </div>

      {/* ITERATION ACTIVE CONTEXT BADGE */}
      {isIterating && currentAppTitle && (
        <div className="bg-[#6c63ff]/10 border border-[#6c63ff]/30 rounded-xl p-3 flex items-center justify-between text-xs text-[#e8e8f0]">
          <div className="flex items-center gap-2 truncate mr-2">
            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse flex-shrink-0" />
            <span className="text-[#8888aa]">Continuar trabajando en:</span>
            <strong className="text-white truncate">{currentAppTitle}</strong>
          </div>
          <button
            type="button"
            onClick={onNewApp}
            className="text-[11px] text-[#6c63ff] hover:underline flex-shrink-0 font-medium"
          >
            Nuevo proyecto
          </button>
        </div>
      )}

      {/* PROMPT TEXTAREA */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-[#8888aa] uppercase tracking-widest block flex items-center justify-between">
          <span>{isIterating ? 'Instrucciones para el Agente' : 'Descripción del Proyecto'}</span>
          <span className="text-[10px] text-[#555577] font-mono font-normal">CMD + ENTER</span>
        </label>
        <div className="relative group">
          <textarea
            id="promptInput"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isIterating
                ? `Escribe las instrucciones para el agente...\nEj: «Añade un módulo de análisis de datos con exportación a PDF»`
                : `Describe lo que deseas construir con el orquestador...\nEj: «Un dashboard con visualizaciones en tiempo real, gestión de usuarios y modo oscuro»`
            }
            className="w-full h-36 sm:h-40 bg-[#1e1e24] border border-[#2a2a35] rounded-xl p-4 text-[#e8e8f0] text-sm leading-relaxed placeholder:text-[#555577] focus:outline-none focus:border-[#6c63ff] transition-all resize-none font-sans"
          />
        </div>

        {/* PRESETS */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[10px] font-bold text-[#8888aa] uppercase tracking-wider flex items-center gap-1 mr-1">
            <Lightbulb className="w-3.5 h-3.5 text-[#6c63ff]" />
            Sugerencias:
          </span>
          {NEW_PROJECT_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPrompt(preset)}
              className="text-xs bg-[#1e1e24] hover:bg-[#2a2a35] text-[#8888aa] hover:text-[#e8e8f0] px-2.5 py-1 rounded-lg border border-[#2a2a35] transition-colors truncate max-w-[240px] cursor-pointer"
              title={preset}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* START WORKSPACE BUTTON */}
      <button
        id="generateBtn"
        type="button"
        disabled={isLoading || !prompt.trim()}
        onClick={() => onStartWorkspace('new')}
        className="w-full py-4 bg-gradient-to-r from-[#6c63ff] to-[#8b5cf6] rounded-xl text-white font-bold text-base sm:text-lg shadow-[0_8px_24px_rgba(108,99,255,0.3)] hover:shadow-[0_12px_32px_rgba(108,99,255,0.45)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none transition-all flex items-center justify-center gap-2.5 cursor-pointer"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Inicializando Workspace de Desarrollo…</span>
          </>
        ) : (
          <>
            <Terminal className="w-5 h-5" />
            <span>ABRIR WORKSPACE Y AGENTE DE DESARROLLO</span>
          </>
        )}
      </button>

      {/* STATUS BAR */}
      {statusMessage && (
        <p
          className={`text-center text-xs font-medium ${
            statusType === 'error'
              ? 'text-[#ff6584]'
              : statusType === 'success'
              ? 'text-[#4ade80]'
              : 'text-[#8888aa]'
          }`}
        >
          {statusMessage}
        </p>
      )}
    </div>
  );
};
