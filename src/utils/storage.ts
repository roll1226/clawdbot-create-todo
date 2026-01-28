import { STORAGE_KEYS, PRIORITY, THEME_COLORS } from '../constants';
import type { Todo, ThemeType } from '../types/index';
import { generateId } from './todoUtils';

/**
 * データの不揮発性を担保するためのlocalStorageラッパー
 */
export const storage = {
  getTodos: (): Todo[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TODOS);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // データ構造の整合性を検証しつつ型安全に変換
      return Array.isArray(parsed) ? parsed.map((t: any) => ({
        id: String(t.id || generateId()),
        text: String(t.text || ''),
        completed: Boolean(t.completed),
        priority: (Object.values(PRIORITY).includes(t.priority) ? t.priority : PRIORITY.MEDIUM),
        dueDate: t.dueDate ? String(t.dueDate) : undefined
      })) : [];
    } catch (e) {
      console.error('Failed to load experimental data:', e);
      return [];
    }
  },
  setTodos: (todos: Todo[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
    } catch (e) {
      console.error('Failed to preserve experimental data:', e);
    }
  },
  getTheme: (): ThemeType => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeType;
    return (saved && (THEME_COLORS as any)[saved]) ? saved : 'dark';
  },
  setTheme: (theme: ThemeType) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
};
