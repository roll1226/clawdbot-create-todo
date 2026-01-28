import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import styled from 'styled-components';
import { PRIORITY_COLORS, PRIORITY } from '../constants';
import type { Todo, Priority } from '../types/index';
import { isOverdue } from '../utils/todoUtils';

const ItemLi = styled.li<{ $priority: Priority; $isOverdue: boolean; $isDragging: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--container-bg);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  border-left: 6px solid ${({ $priority }) => PRIORITY_COLORS[$priority]};
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.4 : 1)};
  z-index: ${({ $isDragging }) => ($isDragging ? 100 : 1)};
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  ${({ $isOverdue }) => $isOverdue && `
    border-right: 5px solid var(--danger-color);
    background: rgba(239, 68, 68, 0.03);
  `}

  &:hover {
    border-color: var(--primary-solid);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  }
`;

const DragHandle = styled.div`
  display: flex;
  align-items: center;
  cursor: grab;
  color: var(--text-color);
  opacity: 0.2;
  transition: opacity 0.2s;
  &:active { cursor: grabbing; }
  &:hover { opacity: 0.5; }
`;

const TodoContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TodoText = styled.span<{ $completed: boolean }>`
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--text-color);
  transition: all 0.3s;
  ${({ $completed }) => $completed && `
    text-decoration: line-through;
    opacity: 0.4;
    filter: grayscale(1);
  `}
`;

const DateDisplay = styled.span<{ $overdue: boolean }>`
  font-size: 0.75rem;
  font-weight: 700;
  opacity: 0.5;
  color: ${({ $overdue }) => ($overdue ? 'var(--danger-color)' : 'inherit')};
`;

const EditInput = styled.input`
  background: rgba(0, 0, 0, 0.1);
  border: 2px solid var(--primary-solid);
  border-radius: 0.4rem;
  color: var(--text-color);
  padding: 0.3rem 0.6rem;
  width: 100%;
  outline: none;
  font-size: 1rem;
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const PrioritySelect = styled.select<{ $val: Priority }>`
  background: none;
  border: none;
  color: ${({ $val }) => PRIORITY_COLORS[$val]};
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  outline: none;
  padding: 0.25rem;
  border-radius: 0.4rem;
  &:hover { background: rgba(255, 255, 255, 0.05); }
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
    if (isEditing && editText.trim() !== '' && editText.trim() !== todo.text) {
      updateTodo(todo.id, editText);
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  };

  return (
    <ItemLi ref={setNodeRef} style={style} $priority={todo.priority} $isOverdue={overdue} $isDragging={isDragging}>
      <DragHandle {...attributes} {...listeners}>
        <GripVertical size={20} />
      </DragHandle>
      
      <button
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
        onClick={() => toggleTodo(todo.id)}
        aria-label={`toggle-${todo.id}`}
      >
        {todo.completed ? (
          <CheckCircle2 size={24} color="var(--primary-solid)" />
        ) : (
          <Circle size={24} color="var(--border-color)" />
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
        {todo.dueDate && <DateDisplay $overdue={overdue}>DEADLINE: {todo.dueDate}</DateDisplay>}
      </TodoContent>

      <ActionGroup>
        <input
          type="date"
          value={todo.dueDate || ''}
          onChange={(e) => updateDueDate(todo.id, e.target.value)}
          style={{ background: 'none', border: 'none', color: 'inherit', fontSize: '0.75rem', opacity: 0.4, cursor: 'pointer', colorScheme: 'dark' }}
        />

        <PrioritySelect
          $val={todo.priority}
          value={todo.priority}
          onChange={(e) => updatePriority(todo.id, e.target.value as Priority)}
        >
          <option value={PRIORITY.HIGH}>HIGH</option>
          <option value={PRIORITY.MEDIUM}>MID</option>
          <option value={PRIORITY.LOW}>LOW</option>
        </PrioritySelect>

        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-color)', opacity: 0.4, display: 'flex' }}
          onClick={() => deleteTodo(todo.id)}
        >
          <Trash2 size={18} />
        </button>
      </ActionGroup>
    </ItemLi>
  );
}
