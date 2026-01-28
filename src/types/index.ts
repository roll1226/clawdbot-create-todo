import { Priority, Filter } from '../types';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
}

export type ThemeType = 'dark' | 'light' | 'tachyon';
