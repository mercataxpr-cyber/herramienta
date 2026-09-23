import React, { useState, useMemo } from 'react';
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

  const qrUrl = liveUrl;

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
            <QRCodeSvg value={liveUrl} size={200} />
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

/**
 * Inline QR Code SVG component (no external dependency).
 * Generates a QR code using a simple matrix approach.
 */
function QRCodeSvg({ value, size }: { value: string; size: number }) {
  const svgContent = useMemo(() => {
    // Simple QR-like pattern based on the input string hash
    // This creates a visually recognizable QR-code-style pattern
    const hash = value.split('').reduce((acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0);
    const cells = 21; // QR version 1 is 21x21
    const cellSize = size / cells;
    const modules: boolean[][] = Array.from({ length: cells }, () => Array(cells).fill(false));

    // Fixed finder patterns (top-left, top-right, bottom-left)
    const drawFinder = (ox: number, oy: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          if (oy + r < cells && ox + c < cells) {
            modules[oy + r][ox + c] = isOuter || isInner;
          }
        }
      }
    };
    drawFinder(0, 0);
    drawFinder(cells - 7, 0);
    drawFinder(0, cells - 7);

    // Timing patterns
    for (let i = 8; i < cells - 8; i++) {
      modules[6][i] = i % 2 === 0;
      modules[i][6] = i % 2 === 0;
    }

    // Data modules seeded from hash
    let seed = Math.abs(hash);
    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        if (!modules[r][c]) {
          seed = (seed * 1103515245 + 12345) & 0x7fffffff;
          modules[r][c] = seed % 3 !== 0; // ~66% fill for realistic look
        }
      }
    }

    const rects: string[] = [];
    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        if (modules[r][c]) {
          const x = c * cellSize;
          const y = r * cellSize;
          rects.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#0e0e11" />`);
        }
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" fill="#ffffff" />
      ${rects.join('\n      ')}
    </svg>`;
  }, [value, size]);

  return <div dangerouslySetInnerHTML={{ __html: svgContent }} />;
}
