import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, FileCode2, User, Loader2, ChevronRight, Eye } from 'lucide-react';
import { ChatMessage, ModifiedFile, PendingApproval, AgentInfo } from '../types';
import { AVAILABLE_AGENTS } from '../lib/agentsConfig';
import { AgentActivityStream } from './AgentActivityStream';
import { HumanApprovalCard } from './HumanApprovalCard';

interface AgentChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
  selectedAgentId: 'teki' | 'nova' | 'baki' | 'dorko';
  onSelectAgent: (id: 'teki' | 'nova' | 'baki' | 'dorko') => void;
  onOpenFileDiff: (file: ModifiedFile) => void;
  onApproveRequest: (approvalId: string) => void;
  onRejectRequest: (approvalId: string) => void;
}

export const AgentChatPanel: React.FC<AgentChatPanelProps> = ({
  messages,
  onSendMessage,
  isGenerating,
  selectedAgentId,
  onSelectAgent,
  onOpenFileDiff,
  onApproveRequest,
  onRejectRequest,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeAgent = AVAILABLE_AGENTS.find((a) => a.id === selectedAgentId) || AVAILABLE_AGENTS[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="h-full flex flex-col bg-[#16161a] border-r border-[#2a2a35] overflow-hidden">
      {/* AGENT SELECTOR HEADER */}
      <div className="p-4 border-b border-[#2a2a35] bg-[#131317] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#6c63ff]" />
            <h2 className="text-sm font-bold text-white tracking-wide">CHAT / AGENTE</h2>
          </div>
          <span className="text-[10px] text-[#3ecf8e] bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
            Orquestador Activo
          </span>
        </div>

        {/* AGENTS TABS */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#1e1e24] rounded-xl border border-[#2a2a35]">
          {AVAILABLE_AGENTS.map((ag) => {
            const isSelected = ag.id === selectedAgentId;
            return (
              <button
                key={ag.id}
                onClick={() => onSelectAgent(ag.id)}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#6c63ff] text-white shadow-md'
                    : 'text-[#8888aa] hover:text-white hover:bg-[#2a2a35]'
                }`}
                title={ag.description}
              >
                <span>{ag.avatar}</span>
                <span className="truncate">{ag.name}</span>
              </button>
            );
          })}
        </div>

        {/* ACTIVE AGENT DESCRIPTION */}
        <div className="text-[11px] text-[#8888aa] bg-[#1a1a20] p-2.5 rounded-xl border border-[#2a2a35] flex items-center justify-between">
          <div>
            <span className="font-bold text-white mr-1.5">{activeAgent.name}:</span>
            <span>{activeAgent.description}</span>
          </div>
        </div>
      </div>

      {/* MESSAGES & ACTIVITIES TIMELINE */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#8888aa] space-y-3">
            <div className="p-4 bg-[#1e1e24] rounded-2xl border border-[#2a2a35] text-[#6c63ff]">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-white">Inicia la conversación con {activeAgent.name}</h3>
            <p className="text-xs max-w-xs leading-relaxed">
              Describe los cambios, refactorizaciones o funcionalidades que deseas añadir a tu proyecto.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col space-y-2 ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* MESSAGE BUBBLE */}
              <div
                className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-[#6c63ff] text-white rounded-br-none shadow-md'
                    : 'bg-[#1e1e24] text-[#e0e0e0] border border-[#2a2a35] rounded-bl-none shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 text-[10px] opacity-75 font-mono mb-1">
                  {msg.sender === 'user' ? (
                    <>
                      <User className="w-3 h-3" /> Tú
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3 text-[#6c63ff]" /> Agente {msg.agentId?.toUpperCase() || 'CODEX'}
                    </>
                  )}
                  <span className="ml-auto">{msg.timestamp}</span>
                </div>

                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>

              {/* AGENT ACTIVITIES STREAM IF PRESENT */}
              {msg.activities && msg.activities.length > 0 && (
                <div className="w-full max-w-[92%]">
                  <AgentActivityStream activities={msg.activities} />
                </div>
              )}

              {/* MODIFIED FILES LIST IF PRESENT */}
              {msg.modifiedFiles && msg.modifiedFiles.length > 0 && (
                <div className="w-full max-w-[92%] bg-[#131317] border border-[#2a2a35] rounded-xl p-3 space-y-2">
                  <div className="text-[11px] font-bold text-[#8888aa] uppercase tracking-wider flex items-center justify-between">
                    <span>Archivos Modificados ({msg.modifiedFiles.length})</span>
                    <span className="text-[10px] text-[#6c63ff] font-normal">Haz clic para ver diff</span>
                  </div>
                  <div className="space-y-1">
                    {msg.modifiedFiles.map((file) => (
                      <button
                        key={file.path}
                        onClick={() => onOpenFileDiff(file)}
                        className="w-full p-2 bg-[#1a1a20] hover:bg-[#22222b] rounded-lg border border-[#2a2a35] text-left transition-colors flex items-center justify-between text-xs font-mono group cursor-pointer"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileCode2 className="w-3.5 h-3.5 text-[#6c63ff] flex-shrink-0" />
                          <span
                            className={
                              file.status === 'added'
                                ? 'text-green-400 font-bold'
                                : file.status === 'deleted'
                                ? 'text-red-400 font-bold'
                                : 'text-amber-300'
                            }
                          >
                            {file.status === 'added' ? '+' : file.status === 'deleted' ? '-' : 'M'}
                          </span>
                          <span className="text-white truncate">{file.path}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 text-[10px] text-[#8888aa]">
                          <span>+{file.additions} -{file.deletions}</span>
                          <Eye className="w-3.5 h-3.5 group-hover:text-white transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PENDING APPROVAL REQUEST CARD IF PRESENT */}
              {msg.approvalRequest && (
                <div className="w-full max-w-[92%]">
                  <HumanApprovalCard
                    approval={msg.approvalRequest}
                    onApprove={onApproveRequest}
                    onReject={onRejectRequest}
                  />
                </div>
              )}
            </div>
          ))
        )}

        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-[#6c63ff] p-3 bg-[#1e1e24] rounded-2xl border border-[#2a2a35] w-fit animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Agente {activeAgent.name} trabajando en el código...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT FORM */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[#2a2a35] bg-[#131317]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Escribe instrucciones para ${activeAgent.name}...`}
            disabled={isGenerating}
            className="w-full py-3.5 pl-4 pr-12 bg-[#1a1a20] border border-[#2a2a35] focus:border-[#6c63ff] rounded-2xl text-xs text-white placeholder-[#666688] outline-none transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isGenerating}
            className="absolute right-2 p-2.5 bg-[#6c63ff] hover:bg-[#5b52e0] disabled:bg-[#2a2a35] text-white rounded-xl transition-all cursor-pointer flex items-center justify-center disabled:cursor-not-allowed shadow-md"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
};
