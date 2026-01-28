import { useState, useEffect } from 'react';
import type { Todo, ThemeType, Priority } from '../types/index';
import { storage } from '../utils/storage';
import { generateId } from '../utils/todoUtils';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(() => storage.getTodos());

  useEffect(() => {
    storage.setTodos(todos);
  }, [todos]);

  const addTodo = (text: string, priority: Priority, dueDate?: string) => {
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      priority,
      dueDate,
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const updateTodo = (id: string, text: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t));
  };

  const updatePriority = (id: string, priority: Priority) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, priority } : t));
  };

  const updateDueDate = (id: string, dueDate: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, dueDate } : t));
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(t => !t.completed));
  };

  const reorderTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    updatePriority,
    updateDueDate,
    clearCompleted,
    reorderTodos,
  };
};

export const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeType>(() => storage.getTheme());

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    storage.setTheme(newTheme);
  };

  return { theme, setTheme };
};
