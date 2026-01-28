import type { Priority, Filter } from '../constants';

export type { Priority, Filter };

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
}

export type ThemeType = 'dark' | 'light' | 'tachyon';
