import { describe, it, expect } from 'vitest';
import { isOverdue } from '../../utils/todoUtils';

describe('todoUtils', () => {
  it('isOverdue should return true for past dates', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const dateStr = pastDate.toISOString().split('T')[0];
    expect(isOverdue(dateStr, false)).toBe(true);
  });
});
