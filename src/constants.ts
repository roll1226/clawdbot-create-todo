export const STORAGE_KEY = 'tachyon-todos';

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

export const PRIORITY_COLORS = {
  [PRIORITY.HIGH]: '#ef4444',
  [PRIORITY.MEDIUM]: '#f59e0b',
  [PRIORITY.LOW]: '#3b82f6',
} as const;

export const THEME_COLORS = {
  PRIMARY: '#2dd4bf',
  TEXT_MUTED: 'rgba(255,255,255,0.3)',
  DRAG_HANDLE: 'rgba(255,255,255,0.2)',
  DANGER: '#ef4444',
} as const;

export const ICON_SIZE = {
  LARGE: 24,
  MEDIUM: 20,
  SMALL: 18,
} as const;
