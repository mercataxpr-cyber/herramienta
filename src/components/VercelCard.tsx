import React, { useState, useEffect } from 'react';
import { Triangle, CheckCircle2, AlertCircle, RefreshCw, Key, ExternalLink, Globe, Sparkles, Copy, Check } from 'lucide-react';
import { VercelConfig, VercelDeployment } from '../types';

interface VercelCardProps {
  config: VercelConfig;
  setConfig: (newConfig: VercelConfig) => void;
  currentAppTitle: string;
  currentHtml: string;
}

export const VercelCard: React.FC<VercelCardProps> = ({
  config,
  setConfig,
  currentAppTitle,
  currentHtml,
}) => {
  const [tokenInput, setTokenInput] = useState(config.token || '');
  const [projectInput, setProjectInput] = useState(config.projectName || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const [latestDeployment, setLatestDeployment] = useState<VercelDeployment | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTokenInput(config.token || '');
    setProjectInput(config.projectName || '');
  }, [config]);

  const handleConnect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tokenInput.trim()) {
      const updated: VercelConfig = {
        token: '',
        projectName: projectInput || 'dc-hazlo-app',
        isConnected: true,
      };
      setConfig(updated);
      setStatusMsg('✓ Modo Despliegue Directo Vercel habilitado.');
      setStatusType('success');
      return;
    }

    setIsVerifying(true);
    setStatusMsg('');

    try {
      const res = await fetch('/api/vercel/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput }),
      });

      const data = await res.json();
      if (data.success) {
        const updated: VercelConfig = {
          token: tokenInput,
          projectName: projectInput || 'dc-hazlo-app',
          isConnected: true,
        };
        setConfig(updated);
        setStatusMsg(`✓ Autenticado en Vercel como ${data.username}`);
        setStatusType('success');
      } else {
        setStatusMsg(data.error || 'Error de validación con Vercel');
        setStatusType('error');
      }
    } catch (err: any) {
      setStatusMsg(err.message || 'Error al conectar con Vercel');
      setStatusType('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDeployToVercel = async () => {
    setIsDeploying(true);
    setStatusMsg('Creando build y desplegando en la nube de Vercel...');
    setStatusType('');

    try {
      const res = await fetch('/api/vercel/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: config.token || tokenInput,
          projectName: projectInput || currentAppTitle || 'dc-hazlo-app',
          appTitle: currentAppTitle,
          htmlCode: currentHtml,
        }),
      });

      const data = await res.json();
      if (data.success && data.deployment) {
        setLatestDeployment(data.deployment);
        setStatusMsg(`✓ Despliegue exito en Vercel: ${data.deployment.url}`);
        setStatusType('success');
        if (!config.isConnected) {
          setConfig({
            token: tokenInput,
            projectName: projectInput || 'dc-hazlo-app',
            isConnected: true,
          });
        }
      } else {
        setStatusMsg(data.error || 'Fallo en el despliegue a Vercel');
        setStatusType('error');
      }
    } catch (err: any) {
      setStatusMsg(err.message || 'Error durante el despliegue');
      setStatusType('error');
    } finally {
      setIsDeploying(false);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl bg-[#16161a] border border-[#2a2a35] rounded-[24px] p-6 sm:p-7 shadow-2xl space-y-5 transition-all">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2a2a35] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-black border border-[#2a2a35] text-white">
            <Triangle className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">DESPLIEGUE EN VERCEL</h3>
              <span className="text-[10px] text-black bg-white px-2 py-0.5 rounded-full font-extrabold font-mono">
                Production Edge
              </span>
            </div>
            <p className="text-xs text-[#8888aa]">
              Publica tu aplicación en vivo con URL global HTTPS en la infraestructura Edge de Vercel.
            </p>
          </div>
        </div>

        {/* STATUS BADGE */}
        <div className="flex items-center gap-2">
          {latestDeployment ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold font-mono">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Live en Vercel
            </span>
          ) : config.isConnected ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold font-mono">
              ● Listo para desplegar
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e1e24] border border-[#2a2a35] text-[#8888aa] text-xs font-semibold font-mono">
              ● No desplegado
            </span>
          )}
        </div>
      </div>

      {/* INPUT FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#aaaaaa] flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-white" /> Vercel Access Token (Opcional)
          </label>
          <input
            type="password"
            placeholder="Opcional - Vercel API Token"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="w-full bg-[#0d0d0f] border border-[#2a2a35] focus:border-white rounded-xl px-3 py-2 text-xs text-white placeholder-[#555566] outline-none font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#aaaaaa] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-400" /> Nombre del Proyecto Vercel
          </label>
          <input
            type="text"
            placeholder="dc-hazlo-app"
            value={projectInput}
            onChange={(e) => setProjectInput(e.target.value)}
            className="w-full bg-[#0d0d0f] border border-[#2a2a35] focus:border-white rounded-xl px-3 py-2 text-xs text-white placeholder-[#555566] outline-none font-mono"
          />
        </div>
      </div>

      {/* LATEST DEPLOYMENT BOX */}
      {latestDeployment && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/30 via-[#16161a] to-emerald-950/20 border border-blue-500/30 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>URL en Vivo de Vercel:</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
              Status: {latestDeployment.status}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 bg-[#0d0d0f] p-3 rounded-lg border border-[#2a2a35]">
            <a
              href={latestDeployment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-blue-400 hover:text-blue-300 font-semibold truncate flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 flex-shrink-0" />
              {latestDeployment.url}
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyUrl(latestDeployment.url)}
                className="p-1.5 text-xs text-[#8888aa] hover:text-white bg-[#1e1e24] hover:bg-[#2a2a35] rounded-md transition-colors cursor-pointer"
                title="Copiar URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={latestDeployment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-white text-black hover:bg-slate-200 text-xs font-bold rounded-md flex items-center gap-1 cursor-pointer transition-colors"
              >
                Abrir App <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2a2a35]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDeployToVercel}
            disabled={isDeploying}
            className="px-5 py-2.5 bg-white text-black hover:bg-slate-200 text-xs font-black rounded-xl transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isDeploying ? (
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
            ) : (
              <Triangle className="w-4 h-4 fill-black" />
            )}
            <span>{isDeploying ? 'Desplegando en Vercel...' : '▲ Desplegar Proyecto a Vercel'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleConnect()}
            disabled={isVerifying}
            className="px-3.5 py-2 bg-[#1e1e24] hover:bg-[#2a2a35] text-white border border-[#2a2a35] text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Guardar Config
          </button>
        </div>

        <p className="text-[11px] text-[#8888aa] italic">
          Despliegue automático instantáneo compatible con Vite / React
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 font-mono ${
            statusType === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : statusType === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-300'
              : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
          }`}
        >
          {statusType === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : statusType === 'error' ? (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <RefreshCw className="w-4 h-4 animate-spin flex-shrink-0" />
          )}
          <span>{statusMsg}</span>
        </div>
      )}
    </div>
  );
};
