import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CodexAuthCard } from './components/CodexAuthCard';
import { PromptCard } from './components/PromptCard';
import { PreviewBubble } from './components/PreviewBubble';
import { FullscreenModal } from './components/FullscreenModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SessionPromptHistory } from './components/SessionPromptHistory';
import { SupabaseCard } from './components/SupabaseCard';
import { SupabaseHelpModal } from './components/SupabaseHelpModal';
import { QRCodeModal } from './components/QRCodeModal';
import { MobileLiveViewer } from './components/MobileLiveViewer';
import { WorkspaceLayout } from './components/WorkspaceLayout';
import { GitHubCard } from './components/GitHubCard';
import { VercelCard } from './components/VercelCard';

import { SupabaseConfig, saveAppToSupabase } from './lib/supabase';
import { getAgentProvider } from './lib/agentOrchestrator';
import {
  GeneratedApp,
  ProviderType,
  CodexConnectionStatus,
  ChatMessage,
  ModifiedFile,
  GitStatus,
  GitHubConfig,
  VercelConfig,
} from './types';

export default function App() {
  // Check if current route is the Mobile Live Viewer (scanned via QR)
  const isLiveViewerRoute = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'live';
  }, []);

  if (isLiveViewerRoute) {
    return <MobileLiveViewer />;
  }

  // View state: 'workspace' or 'home'
  const [viewMode, setViewMode] = useState<'home' | 'workspace'>('workspace');

  // Orchestrator & Codex connection states
  const [codexStatus, setCodexStatus] = useState<CodexConnectionStatus>('connected');
  const [activeProvider, setActiveProvider] = useState<ProviderType>('codex');
  const [selectedAgentId, setSelectedAgentId] = useState<'teki' | 'nova' | 'baki' | 'dorko'>('teki');

  // Workspace Chat & App states
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'error' | 'success' | 'info' | ''>('');

  const [generatedHTML, setGeneratedHTML] = useState('');
  const [appTitle, setAppTitle] = useState('Nuevo Proyecto DC-haZlo');
  const [isIterating, setIsIterating] = useState(false);

  // Repository & Git status
  const [modifiedFiles, setModifiedFiles] = useState<ModifiedFile[]>([]);
  const [gitStatus, setGitStatus] = useState<GitStatus>({
    branch: 'feature/main',
    status: 'clean',
    changedCount: 0,
    lastCommit: 'init: workspace creado',
    testsPassing: true,
    previewReady: true,
  });

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [appsHistory, setAppsHistory] = useState<GeneratedApp[]>([]);
  const [sessionApps, setSessionApps] = useState<GeneratedApp[]>([]);

  // Supabase state
  const [supabaseConfig, setSupabaseConfigState] = useState<SupabaseConfig>({ url: '', anonKey: '' });
  const [isSupabaseHelpOpen, setIsSupabaseHelpOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [supabaseSyncError, setSupabaseSyncError] = useState('');

  // GitHub & Vercel states
  const [githubConfig, setGithubConfigState] = useState<GitHubConfig>({
    token: '',
    repo: 'usuario/dc-hazlo-app',
    branch: 'main',
    isConnected: true,
    username: 'desarrollador',
  });

  const [vercelConfig, setVercelConfigState] = useState<VercelConfig>({
    token: '',
    projectName: 'dc-hazlo-app',
    isConnected: true,
  });

  // Load saved configurations on startup
  useEffect(() => {
    const savedSupabase = localStorage.getItem('dcHazloSupabaseConfig');
    if (savedSupabase) {
      try {
        setSupabaseConfigState(JSON.parse(savedSupabase));
      } catch (e) {
        console.error('Error al cargar configuración de Supabase:', e);
      }
    }

    const savedGitHub = localStorage.getItem('dcHazloGitHubConfig');
    if (savedGitHub) {
      try {
        setGithubConfigState(JSON.parse(savedGitHub));
      } catch (e) {
        console.error('Error al cargar configuración de GitHub:', e);
      }
    }

    const savedVercel = localStorage.getItem('dcHazloVercelConfig');
    if (savedVercel) {
      try {
        setVercelConfigState(JSON.parse(savedVercel));
      } catch (e) {
        console.error('Error al cargar configuración de Vercel:', e);
      }
    }

    const savedHistory = localStorage.getItem('dcHazloHistory');
    if (savedHistory) {
      try {
        setAppsHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing saved history:', e);
      }
    }

    // Default welcome message in Agent chat
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'agent',
        agentId: 'teki',
        text: '¡Hola! Soy TEKI, tu agente orquestador principal. Describe tu idea o las modificaciones que deseas realizar en el proyecto.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, []);

  const handleSetSupabaseConfig = (newConfig: SupabaseConfig) => {
    setSupabaseConfigState(newConfig);
    localStorage.setItem('dcHazloSupabaseConfig', JSON.stringify(newConfig));
  };

  const handleSetGitHubConfig = (newConfig: GitHubConfig) => {
    setGithubConfigState(newConfig);
    localStorage.setItem('dcHazloGitHubConfig', JSON.stringify(newConfig));
  };

  const handleSetVercelConfig = (newConfig: VercelConfig) => {
    setVercelConfigState(newConfig);
    localStorage.setItem('dcHazloVercelConfig', JSON.stringify(newConfig));
  };

  const handlePushToGitHub = async () => {
    try {
      const res = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubConfig.token,
          repo: githubConfig.repo,
          branch: githubConfig.branch,
        }),
      });
      const data = await res.json();
      const sysMessage: ChatMessage = {
        id: `sys-${Date.now()}`,
        sender: 'system',
        text: data.message || `✓ Push completado a GitHub (${githubConfig.repo}:${githubConfig.branch})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, sysMessage]);
      setGitStatus((prev) => ({ ...prev, status: 'clean', changedCount: 0 }));
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCreateGitHubPR = async () => {
    try {
      const res = await fetch('/api/github/pull-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: githubConfig.repo }),
      });
      const data = await res.json();
      const sysMessage: ChatMessage = {
        id: `sys-${Date.now()}`,
        sender: 'system',
        text: data.message || `✓ Pull Request #${data.prNumber} creado en GitHub`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, sysMessage]);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDeployVercelDirect = async () => {
    try {
      const res = await fetch('/api/vercel/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: vercelConfig.token,
          projectName: vercelConfig.projectName || appTitle,
          appTitle,
          htmlCode: generatedHTML,
        }),
      });
      const data = await res.json();
      if (data.success && data.deployment) {
        const sysMessage: ChatMessage = {
          id: `sys-${Date.now()}`,
          sender: 'system',
          text: `🚀 Despliegue en Vercel completado: ${data.deployment.url}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, sysMessage]);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const syncToSupabase = async (title: string, promptText: string, htmlCode: string) => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) return;
    setIsSyncingSupabase(true);
    setSupabaseSyncError('');

    const result = await saveAppToSupabase(supabaseConfig, {
      id: 'live-app',
      title,
      prompt: promptText,
      html: htmlCode,
    });

    setIsSyncingSupabase(false);
    if (!result.success) {
      setSupabaseSyncError(result.error || 'Error al guardar en Supabase');
    }
  };

  const saveToHistory = (title: string, promptText: string, htmlCode: string, providerUsed: ProviderType) => {
    const newApp: GeneratedApp = {
      id: Date.now().toString(),
      title,
      prompt: promptText,
      html: htmlCode,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      provider: providerUsed,
    };

    const updated = [newApp, ...appsHistory];
    setAppsHistory(updated);
    localStorage.setItem('dcHazloHistory', JSON.stringify(updated));

    setSessionApps((prev) => [newApp, ...prev]);
    syncToSupabase(title, promptText, htmlCode);
  };

  // SEND MESSAGE TO AGENT ORCHESTRATOR
  const handleSendMessage = async (userPromptText: string) => {
    if (!userPromptText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userPromptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    setViewMode('workspace');

    try {
      const providerInstance = getAgentProvider(activeProvider);
      const result = await providerInstance.sendMessage(userPromptText, {
        currentHtml: generatedHTML,
        history: updatedMessages,
        agentId: selectedAgentId,
      });

      if (result.updatedHtml) {
        setGeneratedHTML(result.updatedHtml);
        const derivedTitle =
          userPromptText.slice(0, 45) + (userPromptText.length > 45 ? '…' : '');
        setAppTitle(derivedTitle);
        saveToHistory(derivedTitle, userPromptText, result.updatedHtml, activeProvider);
      }

      if (result.modifiedFiles) {
        setModifiedFiles(result.modifiedFiles);
      }

      if (result.gitStatusUpdate) {
        setGitStatus((prev) => ({
          ...prev,
          changedCount: result.gitStatusUpdate?.changedCount || prev.changedCount,
          testsPassing: result.gitStatusUpdate?.testsPassing ?? prev.testsPassing,
        }));
      }

      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        agentId: selectedAgentId,
        text: result.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        activities: result.activities,
        modifiedFiles: result.modifiedFiles,
        approvalRequest: result.approvalRequest,
        htmlOutput: result.updatedHtml,
      };

      setMessages((prev) => [...prev, agentMessage]);
      setStatusMessage('✓ Cambios compilados e integrados en Live Preview.');
      setStatusType('success');
    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'system',
        text: `Error procesando orden: ${err.message || 'Fallo de orquestador.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setStatusMessage(err.message || 'Error con el orquestador');
      setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartWorkspaceFromLaunchpad = (mode: 'new' | 'repo') => {
    setViewMode('workspace');
    if (prompt.trim()) {
      handleSendMessage(prompt);
      setPrompt('');
    }
  };

  const handleApproveRequest = async (approvalId: string) => {
    try {
      await fetch('/api/orchestrator/approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalId, decision: 'approved' }),
      });

      const sysMessage: ChatMessage = {
        id: `sys-${Date.now()}`,
        sender: 'system',
        text: '✓ Acción autorizada por el usuario y ejecutada por el agente.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, sysMessage]);
      setGitStatus((prev) => ({ ...prev, status: 'clean', changedCount: 0 }));
    } catch (err) {
      console.error('Error aprobando acción:', err);
    }
  };

  const handleRejectRequest = async (approvalId: string) => {
    try {
      await fetch('/api/orchestrator/approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalId, decision: 'rejected' }),
      });

      const sysMessage: ChatMessage = {
        id: `sys-${Date.now()}`,
        sender: 'system',
        text: '✕ Acción cancelada por el usuario.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, sysMessage]);
    } catch (err) {
      console.error('Error rechazando acción:', err);
    }
  };

  const handleSelectSessionApp = (app: GeneratedApp) => {
    setGeneratedHTML(app.html);
    setAppTitle(app.title);
    setViewMode('workspace');
    syncToSupabase(app.title, app.prompt, app.html);
  };

  const handleOpenModalForApp = (app: GeneratedApp) => {
    setGeneratedHTML(app.html);
    setAppTitle(app.title);
    setIsModalOpen(true);
    syncToSupabase(app.title, app.prompt, app.html);
  };

  const handleSelectHistoryApp = (app: GeneratedApp) => {
    setGeneratedHTML(app.html);
    setAppTitle(app.title);
    setViewMode('workspace');
    syncToSupabase(app.title, app.prompt, app.html);
  };

  const handleDeleteHistoryApp = (id: string) => {
    const updated = appsHistory.filter((a) => a.id !== id);
    setAppsHistory(updated);
    localStorage.setItem('dcHazloHistory', JSON.stringify(updated));
    setSessionApps((prev) => prev.filter((a) => a.id !== id));
  };

  const handleClearHistory = () => {
    if (window.confirm('¿Seguro que quieres borrar todo el historial?')) {
      setAppsHistory([]);
      setSessionApps([]);
      localStorage.removeItem('dcHazloHistory');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-[#e8e8f0] flex flex-col font-sans">
      {/* HEADER */}
      <Header
        historyCount={appsHistory.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        codexStatus={codexStatus}
        onOpenQR={() => setIsQROpen(true)}
      />

      {/* VIEW: WORKSPACE VS LAUNCHPAD (HOME) */}
      {viewMode === 'workspace' ? (
        <WorkspaceLayout
          appTitle={appTitle}
          currentHtml={generatedHTML}
          messages={messages}
          onSendMessage={handleSendMessage}
          isGenerating={isLoading}
          selectedAgentId={selectedAgentId}
          onSelectAgent={setSelectedAgentId}
          modifiedFiles={modifiedFiles}
          gitStatus={gitStatus}
          onApproveRequest={handleApproveRequest}
          onRejectRequest={handleRejectRequest}
          onRequestCommit={() => handleSendMessage('Crear commit con los últimos cambios')}
          onRequestPush={handlePushToGitHub}
          onRequestPR={handleCreateGitHubPR}
          onDeployVercel={handleDeployVercelDirect}
          onOpenGitHubConfig={() => setViewMode('home')}
          onOpenFullscreen={() => setIsModalOpen(true)}
        />
      ) : (
        <main className="flex-1 p-6 md:p-10 flex flex-col items-center justify-start gap-8 overflow-y-auto">
          {/* CHATGPT / CODEX CONNECTION CARD */}
          <CodexAuthCard
            status={codexStatus}
            setStatus={setCodexStatus}
            activeProvider={activeProvider}
            setActiveProvider={setActiveProvider}
          />

          {/* LAUNCHPAD PROMPT CARD */}
          <PromptCard
            prompt={prompt}
            setPrompt={setPrompt}
            provider={activeProvider}
            setProvider={setActiveProvider}
            onStartWorkspace={handleStartWorkspaceFromLaunchpad}
            isLoading={isLoading}
            statusMessage={statusMessage}
            statusType={statusType}
            isIterating={isIterating}
            setIsIterating={setIsIterating}
            currentAppTitle={appTitle}
            onNewApp={() => {
              setIsIterating(false);
              setPrompt('');
            }}
          />

          {/* GITHUB INTEGRATION CARD */}
          <GitHubCard
            config={githubConfig}
            setConfig={handleSetGitHubConfig}
            onPushNow={handlePushToGitHub}
            onPRNow={handleCreateGitHubPR}
          />

          {/* VERCEL DEPLOYMENT CARD */}
          <VercelCard
            config={vercelConfig}
            setConfig={handleSetVercelConfig}
            currentAppTitle={appTitle}
            currentHtml={generatedHTML}
          />

          {/* SUPABASE CONNECTION CARD */}
          <SupabaseCard
            config={supabaseConfig}
            setConfig={handleSetSupabaseConfig}
            onOpenHelp={() => setIsSupabaseHelpOpen(true)}
            onOpenQR={() => setIsQROpen(true)}
            currentAppTitle={appTitle}
            isSyncing={isSyncingSupabase}
            syncError={supabaseSyncError}
          />

          {/* SESSION PROMPT HISTORY */}
          <SessionPromptHistory
            sessionApps={sessionApps}
            currentHtml={generatedHTML}
            onSelectSessionApp={handleSelectSessionApp}
            onOpenModal={handleOpenModalForApp}
          />
        </main>
      )}

      {/* FLOATING PREVIEW BUBBLE (When in Home view) */}
      {viewMode === 'home' && (
        <PreviewBubble
          html={generatedHTML}
          onExpand={() => setIsModalOpen(true)}
          isVisible={Boolean(generatedHTML)}
        />
      )}

      {/* FULLSCREEN MODAL */}
      <FullscreenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        html={generatedHTML}
        title={appTitle || 'App Generada'}
      />

      {/* HISTORY DRAWER */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        apps={appsHistory}
        onSelectApp={handleSelectHistoryApp}
        onDeleteApp={handleDeleteHistoryApp}
        onClearHistory={handleClearHistory}
      />

      {/* SUPABASE HELP MODAL */}
      <SupabaseHelpModal
        isOpen={isSupabaseHelpOpen}
        onClose={() => setIsSupabaseHelpOpen(false)}
      />

      {/* QR CODE MODAL FOR MOBILE REALTIME SYNC */}
      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        config={supabaseConfig}
        currentAppTitle={appTitle}
      />
    </div>
  );
}
