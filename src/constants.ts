export const STORAGE_KEYS = {
  TODOS: 'tachyon-todos',
  THEME: 'tachyon-theme',
} as const;

export const PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export type Priority = typeof PRIORITY[keyof typeof PRIORITY];

export const FILTER = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

export type Filter = typeof FILTER[keyof typeof FILTER];

export const PRIORITY_COLORS: Record<Priority, string> = {
  [PRIORITY.HIGH]: '#ef4444',
  [PRIORITY.MEDIUM]: '#f59e0b',
  [PRIORITY.LOW]: '#3b82f6',
} as const;

export const THEME_COLORS = {
  dark: {
    bg: '#0f172a',
    containerBg: 'rgba(30, 41, 59, 0.7)',
    text: '#f1f5f9',
    border: 'rgba(255, 255, 255, 0.1)',
    inputBg: 'rgba(15, 23, 42, 0.5)',
    primary: '#2dd4bf',
    secondary: '#3b82f6',
    danger: '#ef4444',
    warning: '#f59e0b',
  },
  light: {
    bg: '#f1f5f9',
    containerBg: 'rgba(255, 255, 255, 0.9)',
    text: '#0f172a',
    border: 'rgba(0, 0, 0, 0.1)',
    inputBg: 'rgba(255, 255, 255, 1)',
    primary: '#0d9488',
    secondary: '#2563eb',
    danger: '#dc2626',
    warning: '#d97706',
  },
  tachyon: {
    bg: '#000000',
    containerBg: 'rgba(20, 20, 20, 0.8)',
    text: '#00ffcc',
    border: 'rgba(0, 255, 204, 0.2)',
    inputBg: 'rgba(0, 40, 40, 0.5)',
    primary: '#00ffcc',
    secondary: '#0099ff',
    danger: '#ff3366',
    warning: '#ffcc00',
  }
} as const;

export const ICON_SIZE = {
  LARGE: 24,
  MEDIUM: 20,
  SMALL: 18,
} as const;
