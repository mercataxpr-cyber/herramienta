import React from 'react';
import { GitBranch, GitCommit, GitPullRequest, CheckCircle2, ShieldCheck, Play, Eye, Triangle, Github } from 'lucide-react';
import { GitStatus, ModifiedFile } from '../types';

interface GitStatusBarProps {
  gitStatus: GitStatus;
  modifiedFiles: ModifiedFile[];
  onOpenDiffs: () => void;
  onRequestCommit: () => void;
  onRequestPush: () => void;
  onRequestPR: () => void;
  onDeployVercel?: () => void;
  onOpenGitHubConfig?: () => void;
}

export const GitStatusBar: React.FC<GitStatusBarProps> = ({
  gitStatus,
  modifiedFiles,
  onOpenDiffs,
  onRequestCommit,
  onRequestPush,
  onRequestPR,
  onDeployVercel,
  onOpenGitHubConfig,
}) => {
  return (
    <div className="w-full bg-[#131317] border-t border-[#2a2a35] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#8888aa] font-mono">
      {/* STATUS ITEMS */}
      <div className="flex items-center gap-3.5 flex-wrap">
        {/* GITHUB ICON & STATUS */}
        <button
          onClick={onOpenGitHubConfig}
          className="flex items-center gap-1.5 text-white font-semibold hover:text-[#3ecf8e] transition-colors cursor-pointer bg-[#1a1a20] px-2.5 py-1 rounded-lg border border-[#2a2a35]"
          title="Configurar GitHub"
        >
          <Github className="w-3.5 h-3.5 text-[#3ecf8e]" />
          <span>GitHub ✓</span>
        </button>

        {/* BRANCH */}
        <div className="flex items-center gap-1.5 text-[#cccccc] bg-[#1a1a20] px-2.5 py-1 rounded-lg border border-[#2a2a35]">
          <GitBranch className="w-3.5 h-3.5 text-[#6c63ff]" />
          <span>{gitStatus.branch}</span>
        </div>

        {/* CHANGED FILES COUNT */}
        <button
          onClick={onOpenDiffs}
          className="flex items-center gap-1.5 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Cambios: {modifiedFiles.length} archivos</span>
        </button>

        {/* TESTS */}
        <div className="flex items-center gap-1 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Tests: ✓</span>
        </div>

        {/* PREVIEW STATUS */}
        <div className="flex items-center gap-1 text-[#6c63ff]">
          <Play className="w-3.5 h-3.5" />
          <span>Dev Server Live</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onRequestCommit}
          className="px-2.5 py-1 bg-[#1e1e24] hover:bg-[#2a2a35] text-white rounded-lg border border-[#2a2a35] transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
        >
          <GitCommit className="w-3 h-3 text-[#6c63ff]" /> Commit
        </button>
        <button
          onClick={onRequestPush}
          className="px-2.5 py-1 bg-[#1e1e24] hover:bg-[#2a2a35] text-white rounded-lg border border-[#2a2a35] transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
        >
          <ShieldCheck className="w-3 h-3 text-[#3ecf8e]" /> Push
        </button>
        <button
          onClick={onRequestPR}
          className="px-2.5 py-1 bg-[#1e1e24] hover:bg-[#2a2a35] text-purple-300 rounded-lg border border-purple-500/30 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
        >
          <GitPullRequest className="w-3 h-3 text-purple-400" /> Pull Request
        </button>
        {onDeployVercel && (
          <button
            onClick={onDeployVercel}
            className="px-3 py-1 bg-white hover:bg-slate-200 text-black font-extrabold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-[11px] shadow-sm"
          >
            <Triangle className="w-3 h-3 fill-black" /> Deploy Vercel
          </button>
        )}
      </div>
    </div>
  );
};

