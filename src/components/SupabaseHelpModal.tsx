import React, { useState } from 'react';
import { X, Copy, Check, Database, Key, Sparkles, ExternalLink, Terminal } from 'lucide-react';

interface SupabaseHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SQL_SETUP_SCRIPT = `
-- 1. Crear la tabla de aplicaciones
create table if not exists dc_hazlo_apps (
  id text primary key,
  title text,
  prompt text,
  html text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Activar sincronización en Tiempo Real (Realtime)
alter publication supabase_realtime add table dc_hazlo_apps;

-- 3. Habilitar seguridad RLS y permitir lectura/escritura pública
alter table dc_hazlo_apps enable row level security;
drop policy if exists "Acceso publico total" on dc_hazlo_apps;
create policy "Acceso publico total" on dc_hazlo_apps for all using (true) with check (true);
`.trim();

export const SupabaseHelpModal: React.FC<SupabaseHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SETUP_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#16161a] border border-[#2a2a35] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* MODAL HEADER */}
        <div className="bg-[#1e1e24] px-6 py-4 border-b border-[#2a2a35] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 rounded-lg text-[#3ecf8e]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Cómo conectar Supabase a DC-haZlo
              </h3>
              <p className="text-xs text-[#8888aa]">
                Guía rápida paso a paso para habilitar sincro en tiempo real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8888aa] hover:text-white bg-[#131317] hover:bg-[#2a2a35] border border-[#2a2a35] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#e8e8f0] leading-relaxed">
          {/* STEP 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="w-5 h-5 rounded-full bg-[#3ecf8e] text-[#16161a] flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>Crea un proyecto gratuito en Supabase</span>
            </div>
            <p className="text-[#8888aa] ml-7">
              Ingresa a{' '}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#3ecf8e] hover:underline font-medium inline-flex items-center gap-1"
              >
                supabase.com <ExternalLink className="w-3 h-3" />
              </a>{' '}
              y crea un proyecto (tarda unos 30 segundos).
            </p>
          </div>

          {/* STEP 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="w-5 h-5 rounded-full bg-[#3ecf8e] text-[#16161a] flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>Obtén tu URL y Clave Anon (API Key)</span>
            </div>
            <p className="text-[#8888aa] ml-7">
              En tu panel de Supabase, ve a <strong>Project Settings → API</strong>:
            </p>
            <ul className="list-disc list-inside ml-9 space-y-1 text-[#8888aa]">
              <li>
                <strong>Project URL:</strong> Ej. <code className="text-[#3ecf8e] bg-[#1e1e24] px-1.5 py-0.5 rounded font-mono">https://xyz.supabase.co</code>
              </li>
              <li>
                <strong>anon public Key:</strong> Clave larga que empieza por <code className="text-[#3ecf8e] bg-[#1e1e24] px-1.5 py-0.5 rounded font-mono">eyJ...</code>
              </li>
            </ul>
          </div>

          {/* STEP 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="w-5 h-5 rounded-full bg-[#3ecf8e] text-[#16161a] flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>Ejecuta este código SQL en Supabase</span>
            </div>
            <p className="text-[#8888aa] ml-7">
              Ve al menú <strong>SQL Editor</strong> en Supabase, pega el siguiente script y haz clic en <strong>RUN</strong>:
            </p>

            <div className="ml-7 relative bg-[#0e0e11] border border-[#2a2a35] rounded-xl p-4 font-mono text-[11px] text-[#3ecf8e] overflow-x-auto">
              <button
                type="button"
                onClick={handleCopySql}
                className="absolute top-3 right-3 bg-[#1e1e24] hover:bg-[#2a2a35] text-white px-2.5 py-1.5 rounded-lg border border-[#2a2a35] flex items-center gap-1.5 text-[10px] font-sans font-semibold transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#4ade80]" />
                    <span className="text-[#4ade80]">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar SQL</span>
                  </>
                )}
              </button>
              <pre className="pr-20 whitespace-pre">{SQL_SETUP_SCRIPT}</pre>
            </div>
          </div>

          {/* TIP */}
          <div className="bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 rounded-xl p-4 flex items-start gap-3 text-[#e8e8f0]">
            <Sparkles className="w-5 h-5 text-[#3ecf8e] flex-shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              <strong>¡Listo!</strong> Al conectar tus credenciales, cada app que generes o modifiques en DC-haZlo se guardará en tiempo real en tu base de datos y tu teléfono actualizará la pantalla automáticamente al escanear el código QR.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-[#1e1e24] px-6 py-3 border-t border-[#2a2a35] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
