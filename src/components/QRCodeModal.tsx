import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, QrCode, Smartphone, Sparkles, ExternalLink } from 'lucide-react';
import { SupabaseConfig } from '../lib/supabase';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SupabaseConfig;
  currentAppTitle?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  config,
  currentAppTitle,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build mobile live viewer URL
  const liveUrl = `${window.location.origin}/?view=live&url=${encodeURIComponent(
    config.url
  )}&key=${encodeURIComponent(config.anonKey)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#16161a] border border-[#2a2a35] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* MODAL HEADER */}
        <div className="bg-[#1e1e24] px-6 py-4 border-b border-[#2a2a35] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#6c63ff]/10 border border-[#6c63ff]/30 rounded-lg text-[#6c63ff]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Escanear para Celular</h3>
              <p className="text-xs text-[#8888aa]">
                Sincronización en vivo vía Supabase
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
        <div className="p-6 flex flex-col items-center space-y-5 text-center">
          {/* QR CODE CONTAINER */}
          <div className="p-4 bg-white rounded-2xl shadow-xl border border-white/20">
            <QRCodeSVG
              value={liveUrl}
              size={200}
              bgColor="#ffffff"
              fgColor="#0e0e11"
              level="H"
              includeMargin={false}
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-white flex items-center justify-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#3ecf8e]" />
              <span>Escanea este código QR con la cámara de tu teléfono</span>
            </p>
            <p className="text-[11px] text-[#8888aa]">
              Cada cambio que hagas en tu computadora se actualizará instantáneamente en tu móvil.
            </p>
          </div>

          {currentAppTitle && (
            <div className="bg-[#1e1e24] px-3 py-1.5 rounded-lg border border-[#2a2a35] text-[11px] text-[#e8e8f0]">
              <span className="text-[#8888aa]">App actual:</span> <strong>{currentAppTitle}</strong>
            </div>
          )}

          {/* COPYABLE DIRECT LINK */}
          <div className="w-full space-y-1.5 text-left pt-2 border-t border-[#2a2a35]">
            <label className="text-[10px] font-bold text-[#8888aa] uppercase tracking-wider block">
              Enlace directo para móvil:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={liveUrl}
                className="flex-1 bg-[#1e1e24] border border-[#2a2a35] rounded-xl px-3 py-2 text-[10px] font-mono text-[#8888aa] focus:outline-none truncate"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-2 bg-[#6c63ff] hover:bg-[#5b52e0] text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-[#1e1e24] px-6 py-3 border-t border-[#2a2a35] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#2a2a35] hover:bg-[#323242] text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
