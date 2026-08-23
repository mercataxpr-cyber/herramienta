import React, { useState } from 'react';
import { Bot, Plus, Edit2, Trash2, RotateCcw, Check, X, Shield, Sparkles, Terminal, Wrench } from 'lucide-react';
import { AgentInfo } from '../types';

interface AgentsManagerCardProps {
  agents: AgentInfo[];
  onAddAgent: (agent: AgentInfo) => void;
  onEditAgent: (agent: AgentInfo) => void;
  onDeleteAgent: (id: string) => void;
  onResetAgents: () => void;
}

const ALL_AVAILABLE_TOOLS = [
  { id: 'read_file', label: 'Leer Archivos', icon: '📄' },
  { id: 'edit_file', label: 'Editar Código', icon: '✏️' },
  { id: 'run_command', label: 'Ejecutar Comandos Terminal', icon: '💻' },
  { id: 'preview_render', label: 'Actualizar Vista Previa', icon: '👁️' },
  { id: 'git_commit', label: 'Crear Commit Git', icon: '📦' },
  { id: 'git_push', label: 'Push a GitHub', icon: '🚀' },
  { id: 'run_test', label: 'Ejecutar Suite de Pruebas', icon: '🧪' },
  { id: 'lint_code', label: 'Linter & Validaciones', icon: '🔍' },
  { id: 'deploy', label: 'Desplegar a Vercel', icon: '▲' },
  { id: 'database_access', label: 'Acceso a Base de Datos Backend', icon: '🗄️' },
];

const PRESET_EMOJIS = ['⚡', '🎨', '🧪', '🚀', '🤖', '🧠', '🛡️', '🔮', '👾', '🎯', '🧬', '⚙️', '💡', '🔥'];

export const AgentsManagerCard: React.FC<AgentsManagerCardProps> = ({
  agents,
  onAddAgent,
  onEditAgent,
  onDeleteAgent,
  onResetAgents,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [avatar, setAvatar] = useState('🤖');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [allowedTools, setAllowedTools] = useState<string[]>(['read_file', 'edit_file', 'preview_render']);

  const openNewAgentModal = () => {
    setEditingAgentId(null);
    setName('');
    setRole('');
    setAvatar('🤖');
    setDescription('');
    setSystemPrompt('');
    setAllowedTools(['read_file', 'edit_file', 'preview_render']);
    setIsModalOpen(true);
  };

  const openEditAgentModal = (agent: AgentInfo) => {
    setEditingAgentId(agent.id);
    setName(agent.name);
    setRole(agent.role);
    setAvatar(agent.avatar || '🤖');
    setDescription(agent.description || '');
    setSystemPrompt(agent.systemPrompt || '');
    setAllowedTools(agent.allowedTools || ['read_file', 'edit_file']);
    setIsModalOpen(true);
  };

  const toggleTool = (toolId: string) => {
    setAllowedTools((prev) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    if (editingAgentId) {
      // Edit existing agent
      const updatedAgent: AgentInfo = {
        id: editingAgentId,
        name: name.trim().toUpperCase(),
        role: role.trim(),
        avatar: avatar || '🤖',
        description: description.trim() || `Agente especializado en ${role}`,
        allowedTools,
        systemPrompt: systemPrompt.trim(),
        isCustom: true,
      };
      onEditAgent(updatedAgent);
    } else {
      // Create new agent
      const newId = `custom-${Date.now()}`;
      const newAgent: AgentInfo = {
        id: newId,
        name: name.trim().toUpperCase(),
        role: role.trim(),
        avatar: avatar || '🤖',
        description: description.trim() || `Agente especializado en ${role}`,
        allowedTools,
        systemPrompt: systemPrompt.trim(),
        isCustom: true,
      };
      onAddAgent(newAgent);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-4xl bg-[#16161a] border border-[#2a2a35] rounded-[24px] p-6 sm:p-7 shadow-2xl space-y-5 transition-all">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2a2a35] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#6c63ff]/10 border border-[#6c63ff]/30 text-[#6c63ff]">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">PANEL DE AGENTES DE IA</h3>
              <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/30 font-mono font-extrabold">
                {agents.length} Agentes Registrados
              </span>
            </div>
            <p className="text-xs text-[#8888aa]">
              Crea, edita y personaliza la personalidad, rol y herramientas de tus agentes IA orquestadores.
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openNewAgentModal}
            className="px-4 py-2 bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo Agente</span>
          </button>

          <button
            type="button"
            onClick={onResetAgents}
            className="p-2 bg-[#1e1e24] hover:bg-[#2a2a35] text-[#8888aa] hover:text-white rounded-xl border border-[#2a2a35] transition-colors cursor-pointer"
            title="Restablecer Agentes por Defecto"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AGENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {agents.map((ag) => (
          <div
            key={ag.id}
            className="p-4 bg-[#0d0d0f] border border-[#2a2a35] hover:border-[#6c63ff]/50 rounded-2xl space-y-3 transition-all relative group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1a1a20] border border-[#2a2a35] flex items-center justify-center text-xl shadow-inner">
                  {ag.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-white font-mono">{ag.name}</h4>
                    {ag.isCustom ? (
                      <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30 font-mono font-bold">
                        Custom
                      </span>
                    ) : (
                      <span className="text-[9px] text-[#6c63ff] bg-[#6c63ff]/10 px-1.5 py-0.5 rounded border border-[#6c63ff]/30 font-mono">
                        Nativo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#3ecf8e] font-semibold">{ag.role}</p>
                </div>
              </div>

              {/* EDIT / DELETE BUTTONS */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEditAgentModal(ag)}
                  className="p-1.5 text-[#8888aa] hover:text-white bg-[#1e1e24] hover:bg-[#2a2a35] rounded-lg transition-colors cursor-pointer"
                  title="Editar Agente"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {ag.isCustom && (
                  <button
                    type="button"
                    onClick={() => onDeleteAgent(ag.id)}
                    className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar Agente"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-[#8888aa] line-clamp-2">{ag.description}</p>

            {/* TOOLS BADGES */}
            <div className="flex flex-wrap gap-1 pt-1">
              {ag.allowedTools.map((t) => (
                <span
                  key={t}
                  className="text-[9px] font-mono text-[#aaaaaa] bg-[#1a1a20] px-2 py-0.5 rounded border border-[#2a2a35]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT AGENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#16161a] border border-[#2a2a35] rounded-[24px] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2a2a35] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#6c63ff]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  {editingAgentId ? 'Editar Agente IA' : 'Crear Nuevo Agente IA'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#8888aa] hover:text-white bg-[#1e1e24] hover:bg-[#2a2a35] rounded-xl cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
              {/* EMOJI & NAME ROW */}
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1 space-y-1">
                  <label className="text-[11px] font-bold text-[#aaaaaa]">Avatar / Emoji</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    maxLength={4}
                    className="w-full text-center text-lg bg-[#0d0d0f] border border-[#2a2a35] focus:border-[#6c63ff] rounded-xl py-2 text-white outline-none"
                  />
                </div>

                <div className="col-span-3 space-y-1">
                  <label className="text-[11px] font-bold text-[#aaaaaa]">Nombre del Agente</label>
                  <input
                    type="text"
                    placeholder="ej. KRONOS, LUNA, CYBER"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#0d0d0f] border border-[#2a2a35] focus:border-[#6c63ff] rounded-xl px-3 py-2 text-white placeholder-[#555566] outline-none font-mono font-bold uppercase"
                  />
                </div>
              </div>

              {/* EMOJI QUICK PRESETS */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-[10px] text-[#8888aa] whitespace-nowrap">Presets:</span>
                {PRESET_EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setAvatar(em)}
                    className="p-1 bg-[#1e1e24] hover:bg-[#2a2a35] text-xs rounded border border-[#2a2a35] cursor-pointer"
                  >
                    {em}
                  </button>
                ))}
              </div>

              {/* ROLE */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#aaaaaa]">Rol / Especialidad</label>
                <input
                  type="text"
                  placeholder="ej. Especialista en Ciberseguridad & Backend"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full bg-[#0d0d0f] border border-[#2a2a35] focus:border-[#6c63ff] rounded-xl px-3 py-2 text-white placeholder-[#555566] outline-none"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#aaaaaa]">Descripción Corta</label>
                <textarea
                  rows={2}
                  placeholder="Describe brevemente la función de este agente..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0d0d0f] border border-[#2a2a35] focus:border-[#6c63ff] rounded-xl p-3 text-white placeholder-[#555566] outline-none"
                />
              </div>

              {/* SYSTEM PROMPT / INSTRUCTIONS */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#aaaaaa] flex items-center justify-between">
                  <span>Prompt del Sistema / Personalidad</span>
                  <span className="text-[10px] text-[#6c63ff]">Instrucciones especiales de IA</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Instrucciones para la personalidad e inteligencia del agente..."
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full bg-[#0d0d0f] border border-[#2a2a35] focus:border-[#6c63ff] rounded-xl p-3 text-white placeholder-[#555566] outline-none font-mono text-[11px]"
                />
              </div>

              {/* ALLOWED TOOLS */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#aaaaaa] flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5 text-[#6c63ff]" />
                  Herramientas Permitidas para este Agente
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {ALL_AVAILABLE_TOOLS.map((tool) => {
                    const isChecked = allowedTools.includes(tool.id);
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => toggleTool(tool.id)}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-[#6c63ff]/10 border-[#6c63ff] text-white'
                            : 'bg-[#0d0d0f] border-[#2a2a35] text-[#8888aa] hover:text-white'
                        }`}
                      >
                        <span className="text-sm">{tool.icon}</span>
                        <span className="text-[11px] font-medium truncate">{tool.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SUBMIT BUTTONS */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2a2a35]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#1e1e24] hover:bg-[#2a2a35] text-[#8888aa] text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingAgentId ? 'Guardar Cambios' : 'Crear Agente'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
