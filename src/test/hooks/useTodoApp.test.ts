import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useTodos } from '../../hooks/useTodoApp';
import { PRIORITY } from '../../constants';

describe('useTodos hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize with empty todos', () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it('should add a todo', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo('Test Task', PRIORITY.HIGH);
    });
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Test Task');
    expect(result.current.todos[0].priority).toBe(PRIORITY.HIGH);
  });
});
