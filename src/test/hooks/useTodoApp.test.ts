import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTodos, useTheme } from '../../hooks/useTodoApp';

describe('Custom Hooks', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('useTodos', () => {
    it('should add a todo and save to localStorage', () => {
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('Refinement Task', 'high');
      });
      
      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe('Refinement Task');
      // Use exact string to avoid import issues in test runtime
      expect(localStorage.getItem('tachyon-todos')).not.toBeNull();
    });

    it('should toggle todo status', () => {
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('Toggle Task', 'medium');
      });
      const id = result.current.todos[0].id;
      act(() => {
        result.current.toggleTodo(id);
      });
      expect(result.current.todos[0].completed).toBe(true);
    });
  });

  describe('useTheme', () => {
    it('should change theme and persist to localStorage', () => {
      const { result } = renderHook(() => useTheme());
      act(() => {
        result.current.setTheme('tachyon');
      });
      expect(result.current.theme).toBe('tachyon');
      expect(localStorage.getItem('tachyon-theme')).toBe('tachyon');
    });
  });
});
