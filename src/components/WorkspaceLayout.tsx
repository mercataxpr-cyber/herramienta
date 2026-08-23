import React, { useState } from 'react';
import { Bot, Play, Code2 } from 'lucide-react';
import {
  ChatMessage,
  ModifiedFile,
  GitStatus,
  PendingApproval,
  AgentInfo,
} from '../types';
import { AgentChatPanel } from './AgentChatPanel';
import { LivePreviewPanel } from './LivePreviewPanel';
import { GitStatusBar } from './GitStatusBar';
import { DiffViewerModal } from './DiffViewerModal';

interface WorkspaceLayoutProps {
  appTitle: string;
  currentHtml: string;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  agents: AgentInfo[];
  onOpenAgentsManager?: () => void;
  modifiedFiles: ModifiedFile[];
  gitStatus: GitStatus;
  onApproveRequest: (approvalId: string) => void;
  onRejectRequest: (approvalId: string) => void;
  onRequestCommit: () => void;
  onRequestPush: () => void;
  onRequestPR: () => void;
  onOpenFullscreen: () => void;
  onDeployVercel?: () => void;
  onOpenGitHubConfig?: () => void;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  appTitle,
  currentHtml,
  messages,
  onSendMessage,
  isGenerating,
  selectedAgentId,
  onSelectAgent,
  agents,
  onOpenAgentsManager,
  modifiedFiles,
  gitStatus,
  onApproveRequest,
  onRejectRequest,
  onRequestCommit,
  onRequestPush,
  onRequestPR,
  onOpenFullscreen,
  onDeployVercel,
  onOpenGitHubConfig,
}) => {
  const [activeTabMobile, setActiveTabMobile] = useState<'agent' | 'preview'>('agent');
  const [selectedDiffFile, setSelectedDiffFile] = useState<ModifiedFile | null>(null);

  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col bg-[#0e0e11] overflow-hidden">
      {/* MOBILE TAB BAR TOGGLE (Visible on small screens) */}
      <div className="md:hidden flex items-center bg-[#131317] border-b border-[#2a2a35] p-1.5">
        <button
          onClick={() => setActiveTabMobile('agent')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTabMobile === 'agent'
              ? 'bg-[#6c63ff] text-white shadow-md'
              : 'text-[#8888aa] hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Agente & Chat</span>
        </button>
        <button
          onClick={() => setActiveTabMobile('preview')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTabMobile === 'preview'
              ? 'bg-[#6c63ff] text-white shadow-md'
              : 'text-[#8888aa] hover:text-white'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Live Preview</span>
        </button>
      </div>

      {/* MAIN SPLIT WORKSPACE BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: AGENT CHAT */}
        <div
          className={`w-full md:w-[450px] lg:w-[480px] xl:w-[520px] flex-shrink-0 h-full ${
            activeTabMobile === 'agent' ? 'block' : 'hidden md:block'
          }`}
        >
          <AgentChatPanel
            messages={messages}
            onSendMessage={onSendMessage}
            isGenerating={isGenerating}
            selectedAgentId={selectedAgentId}
            onSelectAgent={onSelectAgent}
            agents={agents}
            onOpenAgentsManager={onOpenAgentsManager}
            onOpenFileDiff={(file) => setSelectedDiffFile(file)}
            onApproveRequest={onApproveRequest}
            onRejectRequest={onRejectRequest}
          />
        </div>

        {/* RIGHT PANEL: LIVE PREVIEW */}
        <div
          className={`flex-1 h-full ${
            activeTabMobile === 'preview' ? 'block' : 'hidden md:block'
          }`}
        >
          <LivePreviewPanel
            html={currentHtml}
            appTitle={appTitle}
            onOpenFullscreen={onOpenFullscreen}
          />
        </div>
      </div>

      {/* BOTTOM GIT STATUS BAR */}
      <GitStatusBar
        gitStatus={gitStatus}
        modifiedFiles={modifiedFiles}
        onOpenDiffs={() => {
          if (modifiedFiles.length > 0) {
            setSelectedDiffFile(modifiedFiles[0]);
          }
        }}
        onRequestCommit={onRequestCommit}
        onRequestPush={onRequestPush}
        onRequestPR={onRequestPR}
        onDeployVercel={onDeployVercel}
        onOpenGitHubConfig={onOpenGitHubConfig}
      />

      {/* FILE DIFF VIEWER MODAL */}
      <DiffViewerModal
        file={selectedDiffFile}
        onClose={() => setSelectedDiffFile(null)}
      />
    </div>
  );
};
