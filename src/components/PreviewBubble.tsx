import React from 'react';
import { Maximize2, FileCode2 } from 'lucide-react';

interface PreviewBubbleProps {
  html: string;
  onExpand: () => void;
  isVisible: boolean;
}

export const PreviewBubble: React.FC<PreviewBubbleProps> = ({
  html,
  onExpand,
}) => {
  return (
    <div
      id="previewBubble"
      onClick={onExpand}
      title={html ? 'Haz clic para expandir la app en pantalla completa' : 'Genera una app para ver la vista previa'}
      className="fixed bottom-8 right-8 w-64 h-48 bg-[#16161a] border border-[#6c63ff]/30 hover:border-[#6c63ff] rounded-2xl shadow-2xl overflow-hidden flex flex-col group cursor-pointer transition-all z-30 animate-bubble-in"
    >
      {/* PREVIEW BUBBLE BAR */}
      <div className="bg-[#1e1e24] px-4 py-2 border-b border-[#2a2a35] flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28ca41]" />
        <span className="ml-2 text-[10px] text-[#8888aa] font-medium">Vista previa</span>
        <span className="ml-auto text-[9px] text-[#6c63ff] opacity-80 group-hover:opacity-100 flex items-center gap-0.5">
          <Maximize2 className="w-2.5 h-2.5" /> ↗ expandir
        </span>
      </div>

      {/* CONTENT: EITHER GENERATED IFRAME OR ELEGANT EMPTY STATE */}
      {html ? (
        <div className="w-full h-full relative overflow-hidden bg-white/5 pointer-events-none">
          <iframe
            id="previewIframe"
            srcDoc={html}
            title="Vista previa mini app"
            sandbox="allow-scripts allow-forms allow-same-origin"
            className="w-[300%] h-[300%] scale-[0.333] origin-top-left border-none pointer-events-none"
          />
        </div>
      ) : (
        <div className="flex-1 bg-white/5 flex items-center justify-center p-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#6c63ff]/20 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
              <FileCode2 className="w-5 h-5 text-[#6c63ff]" />
            </div>
            <p className="text-[11px] text-[#555577] font-medium">Sin contenido generado aún</p>
          </div>
        </div>
      )}
    </div>
  );
};
