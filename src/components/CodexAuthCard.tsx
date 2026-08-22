import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, LogOut, ShieldCheck, Sparkles, RefreshCw, AlertCircle, Key, Server, Bot } from 'lucide-react';
import { CodexConnectionStatus, ProviderType } from '../types';

interface CodexAuthCardProps {
  status: CodexConnectionStatus;
  setStatus: (status: CodexConnectionStatus) => void;
  activeProvider: ProviderType;
  setActiveProvider: (provider: ProviderType) => void;
}

export const CodexAuthCard: React.FC<CodexAuthCardProps> = ({
  status,
  setStatus,
  activeProvider,
  setActiveProvider,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch status on mount
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/auth/codex/status');
      if (res.ok) {
        const data = await res.json();
        if (data.status) {
          setStatus(data.status as CodexConnectionStatus);
        }
      }
    } catch (err) {
      console.error('Error verificando estado de Codex:', err);
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/auth/codex/connect', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('connected');
        setActiveProvider('codex');
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'No se pudo conectar con el servidor Codex');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Error de red al conectar con ChatGPT / Codex');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/codex/disconnect', { method: 'POST' });
      setStatus('disconnected');
    } catch (err) {
      console.error('Error desconectando Codex:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-[#16161a] border border-[#2a2a35] rounded-[24px] p-6 sm:p-7 shadow-2xl space-y-5 transition-all">
      {/* CARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2a2a35] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#6c63ff]/10 border border-[#6c63ff]/30 rounded-xl text-[#6c63ff]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">CHATGPT / CODEX, GEMINI & CLAUDE</h3>
              <span className="text-[10px] text-[#8888aa] bg-[#1e1e24] px-2 py-0.5 rounded-full border border-[#2a2a35] font-mono">
                Multi-Model Server Engine
              </span>
            </div>
            <p className="text-xs text-[#8888aa]">
              Autenticación segura basada en servidor. Intercambia entre modelos de IA sin exponer claves API.
            </p>
          </div>
        </div>

        {/* STATUS BADGE */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {status === 'connected' && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/30 px-3 py-1 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" /> Conectado
            </span>
          )}
          {status === 'connecting' && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#6c63ff] bg-[#6c63ff]/10 border border-[#6c63ff]/30 px-3 py-1 rounded-full">
              <RefreshCw className="w-3 h-3 animate-spin" /> Conectando…
            </span>
          )}
          {status === 'disconnected' && (
            <span className="text-xs font-semibold text-[#8888aa] bg-[#1e1e24] border border-[#2a2a35] px-3 py-1 rounded-full">
              No conectado
            </span>
          )}
          {status === 'expired' && (
            <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full">
              Sesión expirada
            </span>
          )}
          {status === 'error' && (
            <span className="text-xs font-semibold text-red-400 bg-red-400/10 border border-red-400/30 px-3 py-1 rounded-full">
              Error de conexión
            </span>
          )}
        </div>
      </div>

      {/* PROVIDER SELECTION & CONNECTION ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CODEX CARD OPTION */}
        <div
          onClick={() => status === 'connected' && setActiveProvider('codex')}
          className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 cursor-pointer ${
            activeProvider === 'codex'
              ? 'bg-[#1e1e24] border-[#6c63ff] shadow-[0_0_16px_rgba(108,99,255,0.15)]'
              : 'bg-[#131317] border-[#2a2a35] hover:border-[#6c63ff]/40'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">ChatGPT / Codex</span>
                {activeProvider === 'codex' && (
                  <span className="text-[10px] font-bold text-[#6c63ff] bg-[#6c63ff]/10 px-2 py-0.5 rounded border border-[#6c63ff]/30">
                    Principal
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8888aa]">
                Orquestador nativo con agentes multi-tarea y ejecución en sandbox.
              </p>
            </div>
            {status === 'connected' && (
              <CheckCircle2 className="w-4 h-4 text-[#4ade80] flex-shrink-0" />
            )}
          </div>

          <div className="pt-2 border-t border-[#2a2a35]">
            {status === 'connected' ? (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#4ade80] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Sesión activa
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDisconnect();
                  }}
                  disabled={loading}
                  className="text-[11px] text-[#8888aa] hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3 h-3" /> Desconectar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleConnect();
                }}
                disabled={loading}
                className="w-full py-2 bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Conectar ChatGPT</span>
              </button>
            )}
          </div>
        </div>

        {/* GEMINI CARD OPTION */}
        <div
          onClick={() => setActiveProvider('gemini')}
          className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 cursor-pointer ${
            activeProvider === 'gemini'
              ? 'bg-[#1e1e24] border-[#6c63ff] shadow-[0_0_16px_rgba(108,99,255,0.15)]'
              : 'bg-[#131317] border-[#2a2a35] hover:border-[#6c63ff]/40'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Google Gemini 3.6</span>
                {activeProvider === 'gemini' && (
                  <span className="text-[10px] font-bold text-[#6c63ff] bg-[#6c63ff]/10 px-2 py-0.5 rounded border border-[#6c63ff]/30">
                    Activo
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8888aa]">
                Proveedor secundario de alta velocidad alojado en servidor.
              </p>
            </div>
            <Server className="w-4 h-4 text-[#6c63ff] flex-shrink-0" />
          </div>

          <div className="pt-2 border-t border-[#2a2a35] flex items-center justify-between">
            <span className="text-[11px] text-[#3ecf8e] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Servidor listo
            </span>
            <button
              type="button"
              onClick={() => setActiveProvider('gemini')}
              className="text-[11px] text-[#6c63ff] font-semibold hover:underline"
            >
              Usar Gemini
            </button>
          </div>
        </div>

        {/* ANTHROPIC CLAUDE OPTION */}
        <div
          onClick={() => setActiveProvider('claude')}
          className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 cursor-pointer ${
            activeProvider === 'claude'
              ? 'bg-[#1e1e24] border-[#d97706] shadow-[0_0_16px_rgba(217,119,6,0.15)]'
              : 'bg-[#131317] border-[#2a2a35] hover:border-[#d97706]/40'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Anthropic Claude 3.5 / 3.7</span>
                {activeProvider === 'claude' && (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                    Activo
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8888aa]">
                Modelo de razonamiento y código de alta calidad en servidor.
              </p>
            </div>
            <Bot className="w-4 h-4 text-amber-400 flex-shrink-0" />
          </div>

          <div className="pt-2 border-t border-[#2a2a35] flex items-center justify-between">
            <span className="text-[11px] text-[#3ecf8e] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Servidor listo
            </span>
            <button
              type="button"
              onClick={() => setActiveProvider('claude')}
              className="text-[11px] text-amber-400 font-semibold hover:underline"
            >
              Usar Claude
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECURITY NOTICE */}
      <div className="bg-[#1e1e24] p-3 rounded-xl border border-[#2a2a35] text-[11px] text-[#8888aa] flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[#3ecf8e] flex-shrink-0" />
        <span>
          Garantía de Seguridad: No se almacenan claves ni secretos sensibles en tu navegador. La orquestación se procesa en entorno aislado.
        </span>
      </div>
    </div>
  );
};
