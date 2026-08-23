import { AgentInfo } from '../types';

export const DEFAULT_AGENTS: AgentInfo[] = [
  {
    id: 'teki',
    name: 'TEKI',
    role: 'Orquestador & Lead Architect',
    avatar: '⚡',
    description: 'Gestiona la arquitectura global del proyecto, coordina tareas y refactoriza componentes.',
    allowedTools: ['read_file', 'edit_file', 'run_command', 'git_commit'],
    systemPrompt: 'Eres TEKI, el Arquitecto Principal del proyecto DC-haZlo. Tu enfoque es la arquitectura sólida, modularidad y liderazgo técnico.',
    isCustom: false,
  },
  {
    id: 'nova',
    name: 'NOVA',
    role: 'Especialista UI/UX & Frontend',
    avatar: '🎨',
    description: 'Diseña interfaces pulidas, paletas de colores, animaciones y sistemas de componentes responsive.',
    allowedTools: ['read_file', 'edit_file', 'preview_render'],
    systemPrompt: 'Eres NOVA, la Especialista UI/UX de DC-haZlo. Te enfocas en un diseño visual hermoso, accesible, moderno y fluido.',
    isCustom: false,
  },
  {
    id: 'baki',
    name: 'BAKI',
    role: 'Ingeniero QA & Test Automation',
    avatar: '🧪',
    description: 'Verifica la funcionalidad, detecta errores, ejecuta suite de pruebas y asegura calidad de código.',
    allowedTools: ['read_file', 'run_test', 'lint_code'],
    systemPrompt: 'Eres BAKI, el Ingeniero de Automatización y QA de DC-haZlo. Tu obsesión es la calidad de código, pruebas sin fallos e integridad.',
    isCustom: false,
  },
  {
    id: 'dorko',
    name: 'DORKO',
    role: 'DevOps & Git Manager',
    avatar: '🚀',
    description: 'Administra repositorios, ramas, commits, integraciones CI/CD, Supabase y despliegues.',
    allowedTools: ['git_push', 'git_branch', 'create_pr', 'deploy'],
    systemPrompt: 'Eres DORKO, el Especialista DevOps y Git de DC-haZlo. Te encargas de despliegues en Vercel, Supabase y flujos de trabajo Git impecables.',
    isCustom: false,
  },
];

export const AVAILABLE_AGENTS: AgentInfo[] = DEFAULT_AGENTS;

export const getStoredAgents = (): AgentInfo[] => {
  if (typeof window === 'undefined') return DEFAULT_AGENTS;
  try {
    const saved = localStorage.getItem('dcHazloCustomAgents');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error al cargar agentes personalizados:', e);
  }
  return DEFAULT_AGENTS;
};

export const saveAgentsToStorage = (agents: AgentInfo[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('dcHazloCustomAgents', JSON.stringify(agents));
  } catch (e) {
    console.error('Error al guardar agentes:', e);
  }
};

export const resetAgentsStorage = (): AgentInfo[] => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('dcHazloCustomAgents');
  }
  return DEFAULT_AGENTS;
};

