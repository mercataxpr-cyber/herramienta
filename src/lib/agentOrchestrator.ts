import {
  CodexConnectionStatus,
  ChatMessage,
  AgentActivity,
  ModifiedFile,
  PendingApproval,
  ProviderType,
} from '../types';

export interface AgentResponse {
  replyText: string;
  updatedHtml?: string;
  activities?: AgentActivity[];
  modifiedFiles?: ModifiedFile[];
  approvalRequest?: PendingApproval;
  gitStatusUpdate?: {
    changedCount: number;
    testsPassing: boolean;
  };
}

export interface IAgentProvider {
  type: ProviderType;
  name: string;
  sendMessage(
    prompt: string,
    options: {
      currentHtml?: string;
      history?: ChatMessage[];
      agentId?: string;
      agentName?: string;
      agentRole?: string;
      agentPrompt?: string;
    }
  ): Promise<AgentResponse>;
}

/**
 * CodexAgentProvider communicates strictly with our backend orchestrator endpoints.
 * No API key is ever handled or exposed in client-side code.
 */
export class CodexAgentProvider implements IAgentProvider {
  type: ProviderType = 'codex';
  name = 'ChatGPT / Codex Server';

  async sendMessage(
    prompt: string,
    options: {
      currentHtml?: string;
      history?: ChatMessage[];
      agentId?: string;
      agentName?: string;
      agentRole?: string;
      agentPrompt?: string;
    }
  ): Promise<AgentResponse> {
    const response = await fetch('/api/orchestrator/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: 'codex',
        prompt,
        agentId: options.agentId || 'teki',
        agentName: options.agentName,
        agentRole: options.agentRole,
        agentPrompt: options.agentPrompt,
        previousHtml: options.currentHtml,
        history: options.history?.map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        })),
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Error del servidor Codex (${response.status})`);
    }

    const data = await response.json();
    return {
      replyText: data.replyText || 'Proceso completado por Codex.',
      updatedHtml: data.html,
      activities: data.activities || [],
      modifiedFiles: data.modifiedFiles || [],
      approvalRequest: data.approvalRequest,
      gitStatusUpdate: data.gitStatusUpdate,
    };
  }
}

/**
 * GeminiAgentProvider serves as secondary fallback provider using secure server-side execution.
 */
export class GeminiAgentProvider implements IAgentProvider {
  type: ProviderType = 'gemini';
  name = 'Google Gemini 3.6 Flash';

  async sendMessage(
    prompt: string,
    options: {
      currentHtml?: string;
      history?: ChatMessage[];
      agentId?: string;
      agentName?: string;
      agentRole?: string;
      agentPrompt?: string;
    }
  ): Promise<AgentResponse> {
    const response = await fetch('/api/orchestrator/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: 'gemini',
        prompt,
        agentId: options.agentId || 'teki',
        agentName: options.agentName,
        agentRole: options.agentRole,
        agentPrompt: options.agentPrompt,
        previousHtml: options.currentHtml,
        history: options.history?.map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        })),
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Error de Gemini API (${response.status})`);
    }

    const data = await response.json();
    return {
      replyText: data.replyText || 'Actualización realizada por Gemini.',
      updatedHtml: data.html,
      activities: data.activities || [],
      modifiedFiles: data.modifiedFiles || [],
      approvalRequest: data.approvalRequest,
      gitStatusUpdate: data.gitStatusUpdate,
    };
  }
}

/**
 * ClaudeAgentProvider communicates with Anthropic Claude models via our server orchestrator.
 */
export class ClaudeAgentProvider implements IAgentProvider {
  type: ProviderType = 'claude';
  name = 'Anthropic Claude 3.5 / 3.7';

  async sendMessage(
    prompt: string,
    options: {
      currentHtml?: string;
      history?: ChatMessage[];
      agentId?: string;
      agentName?: string;
      agentRole?: string;
      agentPrompt?: string;
    }
  ): Promise<AgentResponse> {
    const response = await fetch('/api/orchestrator/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: 'claude',
        prompt,
        agentId: options.agentId || 'teki',
        agentName: options.agentName,
        agentRole: options.agentRole,
        agentPrompt: options.agentPrompt,
        previousHtml: options.currentHtml,
        history: options.history?.map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        })),
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Error de Claude API (${response.status})`);
    }

    const data = await response.json();
    return {
      replyText: data.replyText || 'Proceso completado por Anthropic Claude.',
      updatedHtml: data.html,
      activities: data.activities || [],
      modifiedFiles: data.modifiedFiles || [],
      approvalRequest: data.approvalRequest,
      gitStatusUpdate: data.gitStatusUpdate,
    };
  }
}

export const getAgentProvider = (providerType: ProviderType): IAgentProvider => {
  if (providerType === 'codex') {
    return new CodexAgentProvider();
  }
  if (providerType === 'claude') {
    return new ClaudeAgentProvider();
  }
  return new GeminiAgentProvider();
};
