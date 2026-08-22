import React from 'react';
import { Cpu, FileText, Code2, Terminal, CheckCircle2, Loader2, TestTube, Play } from 'lucide-react';
import { AgentActivity } from '../types';

interface AgentActivityStreamProps {
  activities: AgentActivity[];
}

export const AgentActivityStream: React.FC<AgentActivityStreamProps> = ({ activities }) => {
  if (!activities || activities.length === 0) return null;

  const getActivityIcon = (type: AgentActivity['type']) => {
    switch (type) {
      case 'thinking':
        return <Cpu className="w-3.5 h-3.5 text-[#6c63ff]" />;
      case 'read_file':
        return <FileText className="w-3.5 h-3.5 text-sky-400" />;
      case 'edit_file':
        return <Code2 className="w-3.5 h-3.5 text-amber-400" />;
      case 'command':
        return <Terminal className="w-3.5 h-3.5 text-purple-400" />;
      case 'test':
        return <TestTube className="w-3.5 h-3.5 text-emerald-400" />;
      case 'preview_update':
        return <Play className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <Cpu className="w-3.5 h-3.5 text-[#6c63ff]" />;
    }
  };

  return (
    <div className="bg-[#131317] border border-[#2a2a35] rounded-xl p-3 space-y-2 text-xs font-mono my-2">
      <div className="flex items-center justify-between text-[11px] text-[#8888aa] font-sans border-b border-[#2a2a35] pb-1.5 font-bold uppercase tracking-wider">
        <span>Actividad del Agente en Tiempo Real</span>
        <span className="text-[10px] text-[#6c63ff]">{activities.length} eventos</span>
      </div>

      <div className="space-y-1.5 pt-0.5">
        {activities.map((act) => (
          <div key={act.id} className="flex items-center justify-between gap-2 text-[11px] text-[#cccccc]">
            <div className="flex items-center gap-2 overflow-hidden">
              {getActivityIcon(act.type)}
              <span className="truncate">{act.text}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 text-[10px] text-[#8888aa]">
              <span>{act.timestamp}</span>
              {act.status === 'in_progress' ? (
                <Loader2 className="w-3 h-3 text-[#6c63ff] animate-spin" />
              ) : (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
