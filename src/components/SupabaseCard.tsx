import React, { useState } from 'react';
import { Database, HelpCircle, Check, AlertCircle, QrCode, RefreshCw } from 'lucide-react';
import { SupabaseConfig, getSupabaseClient } from '../lib/supabase';

interface SupabaseCardProps {
  config: SupabaseConfig;
  setConfig: (config: SupabaseConfig) => void;
  onOpenHelp: () => void;
  onOpenQR: () => void;
  currentAppTitle?: string;
  isSyncing: boolean;
  syncError?: string;
}

export const SupabaseCard: React.FC<SupabaseCardProps> = ({
  config,
  setConfig,
  onOpenHelp,
  onOpenQR,
  currentAppTitle,
  isSyncing,
  syncError,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  const isConnected = Boolean(config.url && config.anonKey);

  const handleTestConnection = async () => {
    if (!config.url || !config.anonKey) {
      setTestResult({ success: false, msg: 'Ingresa URL y Clave Anon' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const client = getSupabaseClient(config);
      if (!client) throw new Error('Cliente no válido');

      // Test simple query to table or health
      const { error } = await client.from('dc_hazlo_apps').select('id').limit(1);

      if (error && error.code !== 'PGRST116') {
        // Table might not exist yet, or invalid key
        if (error.message.includes('relation "dc_hazlo_apps" does not exist')) {
          setTestResult({
            success: false,
            msg: 'Conectado a Supabase, pero falta ejecutar el SQL para crear la tabla "dc_hazlo_apps". Haz clic en "¿Cómo obtener credenciales?" para ver el código SQL.',
          });
        } else {
          setTestResult({ success: false, msg: `Error: ${error.message}` });
        }
      } else {
        setTestResult({
          success: true,
          msg: '¡Conexión exitosa a Supabase! Tu tabla dc_hazlo_apps está lista.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        msg: `Error de conexión: ${err.message || 'Verifica la URL'}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-[#16161a] border border-[#2a2a35] rounded-[24px] p-5 shadow-xl transition-all space-y-4">
      {/* CARD HEADER / TOGGLE BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 rounded-xl text-[#3ecf8e] flex-shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Sincronización Supabase</h3>
              {isConnected ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#3ecf8e] bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e] animate-pulse" /> Conectado
                </span>
              ) : (
                <span className="text-[10px] font-bold text-[#8888aa] bg-[#1e1e24] border border-[#2a2a35] px-2 py-0.5 rounded-full">
                  No configurado
                </span>
              )}
              {isSyncing && (
                <span className="flex items-center gap-1 text-[10px] text-[#6c63ff] font-medium animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Guardando…
                </span>
              )}
            </div>
            <p className="text-xs text-[#8888aa]">
              Guarda tus apps en tiempo real y escanea un QR para verlo en vivo en tu móvil.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={onOpenHelp}
            className="px-3 py-1.5 text-xs text-[#3ecf8e] hover:text-white bg-[#3ecf8e]/10 hover:bg-[#3ecf8e]/20 border border-[#3ecf8e]/30 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>¿Cómo obtener credenciales?</span>
          </button>

          {isConnected && (
            <button
              type="button"
              onClick={onOpenQR}
              className="px-3 py-1.5 text-xs text-white bg-gradient-to-r from-[#6c63ff] to-[#8b5cf6] hover:opacity-90 rounded-xl font-semibold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Ver QR Celular</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1.5 text-xs text-[#8888aa] hover:text-white bg-[#1e1e24] hover:bg-[#2a2a35] border border-[#2a2a35] rounded-xl font-semibold transition-colors cursor-pointer"
          >
            {isOpen ? 'Ocultar' : 'Configurar'}
          </button>
        </div>
      </div>

      {syncError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Error de sincro: {syncError}</span>
        </div>
      )}

      {/* EXPANDABLE CONFIG FORM */}
      {isOpen && (
        <div className="pt-3 border-t border-[#2a2a35] space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#8888aa] uppercase tracking-wider block">
                Project URL de Supabase
              </label>
              <input
                type="text"
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value.trim() })}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full bg-[#1e1e24] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#3ecf8e] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#8888aa] uppercase tracking-wider block">
                anon public Key (API Key)
              </label>
              <input
                type="password"
                value={config.anonKey}
                onChange={(e) => setConfig({ ...config, anonKey: e.target.value.trim() })}
                placeholder="eyJhY2Nlc3NfdG9rZW4iOi..."
                className="w-full bg-[#1e1e24] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#3ecf8e] transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !config.url || !config.anonKey}
                className="px-4 py-2 bg-[#1e1e24] hover:bg-[#2a2a35] border border-[#2a2a35] text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Probando…</span>
                  </>
                ) : (
                  <span>Probar Conexión</span>
                )}
              </button>
            </div>

            {testResult && (
              <p
                className={`text-xs font-medium ${
                  testResult.success ? 'text-[#3ecf8e]' : 'text-amber-400'
                }`}
              >
                {testResult.msg}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
