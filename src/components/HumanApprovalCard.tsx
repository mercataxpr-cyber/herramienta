import React from 'react';
import { ShieldAlert, Check, X, Terminal, ArrowRight } from 'lucide-react';
import { PendingApproval } from '../types';

interface HumanApprovalCardProps {
  approval: PendingApproval;
  onApprove: (approvalId: string) => void;
  onReject: (approvalId: string) => void;
}

export const HumanApprovalCard: React.FC<HumanApprovalCardProps> = ({
  approval,
  onApprove,
  onReject,
}) => {
  return (
    <div className="bg-[#1e1e24] border-2 border-amber-500/50 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5 my-3 animate-pulse-subtle">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Codex Solicita Autorización
            </h4>
            <p className="text-sm font-bold text-white mt-0.5">{approval.action}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
          Humano en el Bucle
        </span>
      </div>

      {/* REASON */}
      <p className="text-xs text-[#cccccc] bg-[#131317] p-2.5 rounded-xl border border-[#2a2a35]">
        {approval.reason}
      </p>

      {/* COMMAND IF APPLICABLE */}
      {approval.command && (
        <div className="space-y-1">
          <span className="text-[10px] text-[#8888aa] font-mono flex items-center gap-1">
            <Terminal className="w-3 h-3" /> Comando propuesto:
          </span>
          <div className="p-2.5 bg-[#0e0e11] rounded-xl border border-[#2a2a35] font-mono text-xs text-amber-300 overflow-x-auto">
            $ {approval.command}
          </div>
        </div>
      )}

      {/* BUTTON ACTIONS */}
      <div className="flex items-center justify-end gap-2.5 pt-1">
        <button
          onClick={() => onReject(approval.id)}
          className="px-4 py-2 bg-[#2a2a35] hover:bg-[#32323f] text-xs text-red-400 font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <X className="w-3.5 h-3.5" /> Cancelar
        </button>
        <button
          onClick={() => onApprove(approval.id)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
        >
          <Check className="w-3.5 h-3.5" /> Aprobar y Ejecutar <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
