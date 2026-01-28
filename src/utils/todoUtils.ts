export const generateId = () => {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const isOverdue = (dueDate?: string, completed?: boolean) => {
  if (!dueDate || completed) return false;
  return new Date(dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
};
