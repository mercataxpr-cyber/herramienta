import React, { useState, useEffect } from 'react';
import { GitBranch, Github, CheckCircle2, AlertCircle, RefreshCw, Key, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { GitHubConfig } from '../types';

interface GitHubCardProps {
  config: GitHubConfig;
  setConfig: (newConfig: GitHubConfig) => void;
  onPushNow?: () => void;
  onPRNow?: () => void;
}

export const GitHubCard: React.FC<GitHubCardProps> = ({
  config,
  setConfig,
  onPushNow,
  onPRNow,
}) => {
  const [tokenInput, setTokenInput] = useState(config.token || '');
  const [repoInput, setRepoInput] = useState(config.repo || 'usuario/dc-hazlo-app');
  const [branchInput, setBranchInput] = useState(config.branch || 'main');
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');

  useEffect(() => {
    setTokenInput(config.token || '');
    setRepoInput(config.repo || 'usuario/dc-hazlo-app');
    setBranchInput(config.branch || 'main');
  }, [config]);

  const handleConnect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tokenInput.trim()) {
      // Auto enable simulated/local git repo mode if token empty
      const updated: GitHubConfig = {
        token: '',
        repo: repoInput || 'mi-org/dc-hazlo-app',
        branch: branchInput || 'main',
        isConnected: true,
        username: 'desarrollador',
      };
      setConfig(updated);
      setStatusMsg('✓ Modo Git local / GitHub simulado activo');
      setStatusType('success');
      return;
    }

    setIsVerifying(true);
    setStatusMsg('');

    try {
      const res = await fetch('/api/github/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput, repo: repoInput }),
      });

      const data = await res.json();
      if (data.success) {
        const updated: GitHubConfig = {
          token: tokenInput,
          repo: data.repo || repoInput,
          branch: branchInput || 'main',
          isConnected: true,
          username: data.username,
        };
        setConfig(updated);
        setStatusMsg(`✓ Conectado a GitHub como @${data.username}`);
        setStatusType('success');
      } else {
        setStatusMsg(data.error || 'Error al validar token de GitHub');
        setStatusType('error');
      }
    } catch (err: any) {
      setStatusMsg(err.message || 'Error de conexión con GitHub');
      setStatusType('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisconnect = () => {
    const updated: GitHubConfig = {
      token: '',
      repo: '',
      branch: 'main',
      isConnected: false,
    };
    setConfig(updated);
    setTokenInput('');
    setStatusMsg('Conexión con GitHub desconectada.');
    setStatusType('');
  };

  return (
    <div className="w-full max-w-4xl bg-[#16161a] border border-[#2a2a35] rounded-[24px] p-6 sm:p-7 shadow-2xl space-y-5 transition-all">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2a2a35] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/50 text-white">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">CONEXIÓN GITHUB</h3>
              <span className="text-[10px] text-[#8888aa] bg-[#1e1e24] px-2 py-0.5 rounded-full border border-[#2a2a35] font-mono">
                Git Sync & PRs
              </span>
            </div>
            <p className="text-xs text-[#8888aa]">
              Sincroniza tus commits, ramas y Pull Requests directamente con tu repositorio.
            </p>
          </div>
        </div>

        {/* STATUS BADGE */}
        <div className="flex items-center gap-2">
          {config.isConnected ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {config.username ? `@${config.username}` : 'Conectado'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e1e24] border border-[#2a2a35] text-[#8888aa] text-xs font-semibold font-mono">
              ● No configurado
            </span>
          )}
        </div>
      </div>

      {/* INPUT FORM */}
      <form onSubmit={handleConnect} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#aaaaaa] flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-[#6c63ff]" /> Personal Access Token (PAT)
          </label>
          <input
            type="password"
            placeholder="ghp_xxxxxxxxxxxx"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="w-full bg-[#0d0d0f] border border-[#2a2a35] focus:border-[#6c63ff] rounded-xl px-3 py-2 text-xs text-white placeholder-[#555566] outline-none font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#aaaaaa] flex items-center gap-1.5">
            <Github className="w-3.5 h-3.5 text-[#3ecf8e]" /> Repositorio (usuario/repo)
          </label>
          <input
            type="text"
            placeholder="mi-usuario/mi-proyecto"
            value={repoInput}
            onChange={(e) => setRepoInput(e.target.value)}
            className="w-full bg-[#0d0d0f] border border-[#2a2a35] focus:border-[#6c63ff] rounded-xl px-3 py-2 text-xs text-white placeholder-[#555566] outline-none font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#aaaaaa] flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-amber-400" /> Rama Principal
          </label>
          <input
            type="text"
            placeholder="main"
            value={branchInput}
            onChange={(e) => setBranchInput(e.target.value)}
            className="w-full bg-[#0d0d0f] border border-[#2a2a35] focus:border-[#6c63ff] rounded-xl px-3 py-2 text-xs text-white placeholder-[#555566] outline-none font-mono"
          />
        </div>
      </form>

      {/* ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2a2a35]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleConnect()}
            disabled={isVerifying}
            className="px-4 py-2 bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isVerifying ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5" />
            )}
            <span>{config.isConnected ? 'Actualizar Configuración' : 'Guardar y Conectar GitHub'}</span>
          </button>

          {config.isConnected && (
            <button
              type="button"
              onClick={handleDisconnect}
              className="px-3 py-2 bg-[#1a1a20] hover:bg-red-500/20 text-red-400 border border-[#2a2a35] hover:border-red-500/40 text-xs font-medium rounded-xl transition-all cursor-pointer"
            >
              Desconectar
            </button>
          )}
        </div>

        {config.isConnected && (
          <div className="flex items-center gap-2">
            {onPushNow && (
              <button
                type="button"
                onClick={onPushNow}
                className="px-3 py-1.5 bg-[#1e1e24] hover:bg-[#2a2a35] text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <ArrowUpRight className="w-3.5 h-3.5" /> Push a GitHub
              </button>
            )}
            {onPRNow && (
              <button
                type="button"
                onClick={onPRNow}
                className="px-3 py-1.5 bg-[#1e1e24] hover:bg-[#2a2a35] text-purple-400 border border-purple-500/30 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                Crear Pull Request
              </button>
            )}
          </div>
        )}
      </div>

      {statusMsg && (
        <div
          className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 font-mono ${
            statusType === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {statusType === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{statusMsg}</span>
        </div>
      )}
    </div>
  );
};
