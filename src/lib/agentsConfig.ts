import { AgentInfo } from '../types';

export const AVAILABLE_AGENTS: AgentInfo[] = [
  {
    id: 'teki',
    name: 'TEKI',
    role: 'Orquestador & Lead Architect',
    avatar: '⚡',
    description: 'Gestiona la arquitectura global del proyecto, coordina tareas y refactoriza componentes.',
    allowedTools: ['read_file', 'edit_file', 'run_command', 'git_commit'],
  },
  {
    id: 'nova',
    name: 'NOVA',
    role: 'Especialista UI/UX & Frontend',
    avatar: '🎨',
    description: 'Diseña interfaces pulidas, paletas de colores, animaciones y sistemas de componentes responsive.',
    allowedTools: ['read_file', 'edit_file', 'preview_render'],
  },
  {
    id: 'baki',
    name: 'BAKI',
    role: 'Ingeniero QA & Test Automation',
    avatar: '🧪',
    description: 'Verifica la funcionalidad, detecta errores, ejecuta suite de pruebas y asegura calidad de código.',
    allowedTools: ['read_file', 'run_test', 'lint_code'],
  },
  {
    id: 'dorko',
    name: 'DORKO',
    role: 'DevOps & Git Manager',
    avatar: '🚀',
    description: 'Administra repositorios, ramas, commits, integraciones CI/CD, Supabase y despliegues.',
    allowedTools: ['git_push', 'git_branch', 'create_pr', 'deploy'],
  },
];
