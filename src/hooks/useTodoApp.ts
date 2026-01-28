import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';
import { Todo, ThemeType } from '../types';
import { generateId } from '../utils/todoUtils';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TODOS);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, priority: Todo['priority'], dueDate?: string) => {
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      priority,
      dueDate,
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const updateTodo = (id: string, text: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, text } : t));
  };

  const updatePriority = (id: string, priority: Todo['priority']) => {
    setTodos(todos.map(t => t.id === id ? { ...t, priority } : t));
  };

  const updateDueDate = (id: string, dueDate: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, dueDate } : t));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed));
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
  const [theme, setTheme] = useState<ThemeType>(() => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as ThemeType) || 'dark';
  });

  const toggleTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
  };

  return { theme, setTheme: toggleTheme };
};
