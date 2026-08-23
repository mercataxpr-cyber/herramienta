export type ProviderType = 'codex' | 'gemini' | 'claude';

export interface GeneratedApp {
  id: string;
  title: string;
  prompt: string;
  html: string;
  createdAt: string;
  provider: ProviderType;
}

export type CodexConnectionStatus = 
  | 'disconnected' 
  | 'connecting' 
  | 'connected' 
  | 'expired' 
  | 'error';

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  allowedTools: string[];
  systemPrompt?: string;
  isCustom?: boolean;
}

export interface AgentActivity {
  id: string;
  timestamp: string;
  type: 'thinking' | 'read_file' | 'edit_file' | 'command' | 'test' | 'preview_update' | 'git';
  text: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  details?: string;
}

export interface ModifiedFile {
  path: string;
  status: 'added' | 'modified' | 'deleted';
  additions: number;
  deletions: number;
  originalContent?: string;
  newContent?: string;
}

export interface PendingApproval {
  id: string;
  action: string;
  reason: string;
  command?: string;
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  agentId?: string;
  text: string;
  timestamp: string;
  activities?: AgentActivity[];
  modifiedFiles?: ModifiedFile[];
  approvalRequest?: PendingApproval;
  htmlOutput?: string;
}

export interface GitStatus {
  branch: string;
  status: 'clean' | 'modified' | 'ahead' | 'syncing';
  changedCount: number;
  lastCommit: string;
  testsPassing: boolean;
  previewReady: boolean;
}

export interface WorkspaceSession {
  id: string;
  title: string;
  activeAgentId: string;
  codexStatus: CodexConnectionStatus;
  gitStatus: GitStatus;
  modifiedFiles: ModifiedFile[];
  pendingApprovals: PendingApproval[];
  activities: AgentActivity[];
  messages: ChatMessage[];
  currentHtml: string;
  previewUrl: string;
}

export interface GitHubConfig {
  token: string;
  repo: string;
  branch: string;
  isConnected: boolean;
  username?: string;
}

export interface VercelConfig {
  token: string;
  projectName: string;
  teamId?: string;
  isConnected: boolean;
}

export interface VercelDeployment {
  id: string;
  url: string;
  status: 'QUEUED' | 'BUILDING' | 'READY' | 'ERROR';
  createdAt: string;
  inspectorUrl?: string;
}
