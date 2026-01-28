import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import styled from 'styled-components';
import { ICON_SIZE, PRIORITY_COLORS, PRIORITY } from '../constants';
import { Todo, Priority } from '../types';
import { isOverdue } from '../utils/todoUtils';

const ItemLi = styled.li<{ $priority: Priority; $isOverdue: boolean; $isDragging: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--input-bg);
  border-radius: 0.8rem;
  border: 1px solid var(--border-color);
  border-left: 5px solid ${({ $priority }) => (PRIORITY_COLORS as any)[$priority] || '#ccc'};
  transition: transform 0.2s, border-color 0.2s;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
  z-index: ${({ $isDragging }) => ($isDragging ? 10 : 1)};
  position: relative;

  ${({ $isOverdue }) => $isOverdue && `
    background: rgba(239, 68, 68, 0.05);
    border-right: 4px solid var(--danger-color);
  `}

  &:hover {
    transform: translateX(4px);
    border-color: rgba(45, 212, 191, 0.3);
  }
`;

const DragHandle = styled.div`
  display: flex;
  align-items: center;
  cursor: grab;
  opacity: 0.3;
  &:active { cursor: grabbing; }
  &:hover { opacity: 0.6; }
`;

const TodoContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

const TodoText = styled.span<{ $completed: boolean }>`
  font-size: 1rem;
  color: var(--text-color);
  ${({ $completed }) => $completed && `
    text-decoration: line-through;
    opacity: 0.5;
  `}
`;

const DueDate = styled.span<{ $overdue: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.6;
  color: ${({ $overdue }) => ($overdue ? 'var(--danger-color)' : 'inherit')};
`;

const EditInput = styled.input`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--primary-solid);
  border-radius: 0.4rem;
  color: white;
  padding: 0.2rem 0.4rem;
  width: 100%;
  outline: none;
`;

interface Props {
  todo: Todo;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updatePriority: (id: string, priority: Priority) => void;
  updateTodo: (id: string, text: string) => void;
  updateDueDate: (id: string, date: string) => void;
}

export function SortableTodoItem({ todo, toggleTodo, deleteTodo, updatePriority, updateTodo, updateDueDate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const overdue = isOverdue(todo.dueDate, todo.completed);

  const handleEdit = () => {
    if (isEditing && editText.trim() !== todo.text) {
      updateTodo(todo.id, editText);
    }
    setIsEditing(false);
  };

  return (
    <ItemLi ref={setNodeRef} style={style} $priority={todo.priority} $isOverdue={overdue} $isDragging={isDragging}>
      <DragHandle {...attributes} {...listeners}>
        <GripVertical size={18} />
      </DragHandle>
      
      <button
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        onClick={() => toggleTodo(todo.id)}
        aria-label={`toggle-${todo.id}`}
      >
        {todo.completed ? (
          <CheckCircle2 size={20} color="var(--primary-solid)" />
        ) : (
          <Circle size={20} color="rgba(255,255,255,0.2)" />
        )}
      </button>

      <TodoContent>
        {isEditing ? (
          <EditInput
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
            autoFocus
          />
        ) : (
          <TodoText $completed={todo.completed} onDoubleClick={() => setIsEditing(true)}>
            {todo.text}
          </TodoText>
        )}
        {todo.dueDate && <DueDate $overdue={overdue}>{todo.dueDate}</DueDate>}
      </TodoContent>

      <select
        value={todo.priority}
        onChange={(e) => updatePriority(todo.id, e.target.value as Priority)}
        style={{ background: 'none', border: 'none', color: (PRIORITY_COLORS as any)[todo.priority] || '#ccc', fontWeight: 'bold', cursor: 'pointer' }}
      >
        <option value={PRIORITY.HIGH}>高</option>
        <option value={PRIORITY.MEDIUM}>中</option>
        <option value={PRIORITY.LOW}>低</option>
      </select>

      <button
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-color)', opacity: 0.6 }}
        onClick={() => deleteTodo(todo.id)}
      >
        <Trash2 size={ICON_SIZE.SMALL} />
      </button>
    </ItemLi>
  );
}
