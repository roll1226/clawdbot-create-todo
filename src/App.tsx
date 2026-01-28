import { useState } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable'
import {
  PRIORITY,
  FILTER,
  ICON_SIZE
} from './constants'
import { useTodos, useTheme } from './hooks/useTodoApp'
import { GlobalStyle } from './styles/GlobalStyle'
import { Container, Title, Button, Input, Select } from './components/StyledElements'
import { SortableTodoItem } from './components/SortableTodoItem'
import styled from 'styled-components'
import type { Priority, Filter, ThemeType } from './types/index'

const HeaderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const Dashboard = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  background: rgba(0, 0, 0, 0.15);
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child { font-size: 0.65rem; font-weight: 800; opacity: 0.5; margin-bottom: 0.25rem; }
  span:last-child { font-size: 1.5rem; font-weight: 700; }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--input-bg);
  padding: 0.75rem 1.25rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s;
  &:focus-within { border-color: var(--primary-solid); background: rgba(0,0,0,0.2); }
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  outline: none;
  color: var(--text-color);
  width: 100%;
  font-size: 1rem;
  &::placeholder { opacity: 0.3; }
`;

const CommandCenter = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1rem;
`;

const ListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterNav = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
`;

function App() {
  const { 
    todos, addTodo, toggleTodo, deleteTodo, 
    updateTodo, updatePriority, updateDueDate, 
    clearCompleted, reorderTodos 
  } = useTodos();
  const { theme, setTheme } = useTheme();

  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputPriority, setInputPriority] = useState<Priority>(PRIORITY.MEDIUM);
  const [inputDueDate, setInputDueDate] = useState('');
  const [filter, setFilter] = useState<Filter>(FILTER.ALL);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredTodos = todos.filter((todo) => {
    const matchesFilter = 
      filter === FILTER.ALL ? true :
      filter === FILTER.ACTIVE ? !todo.completed :
      todo.completed;
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    addTodo(inputValue, inputPriority, inputDueDate || undefined);
    setInputValue('');
    setInputDueDate('');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((t) => t.id === active.id);
      const newIndex = todos.findIndex((t) => t.id === over.id);
      reorderTodos(arrayMove(todos, oldIndex, newIndex));
    }
  };

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.length - todos.filter(t => t.completed).length,
    rate: todos.length === 0 ? 0 : Math.round((todos.filter(t => t.completed).length / todos.length) * 100)
  };

  return (
    <>
      <GlobalStyle themeMode={theme} />
      <Container>
        <HeaderActions>
          {(['dark', 'light', 'tachyon'] as const).map(t => (
            <Button 
              key={t} 
              variant={theme === t ? 'active' : 'small'} 
              onClick={() => setTheme(t as ThemeType)}
            >
              {t.toUpperCase()}
            </Button>
          ))}
        </HeaderActions>

        <Title>AGNES LAB TODO</Title>

        <Dashboard>
          <StatItem><span>TOTAL</span><span>{stats.total}</span></StatItem>
          <StatItem><span>DONE</span><span style={{color: 'var(--primary-solid)'}}>{stats.completed}</span></StatItem>
          <StatItem><span>ACTIVE</span><span style={{color: 'var(--danger-color)'}}>{stats.active}</span></StatItem>
          <StatItem><span>SUCCESS</span><span>{stats.rate}%</span></StatItem>
        </Dashboard>

        <SearchBox>
          <Search size={20} opacity={0.3} />
          <SearchInput 
            placeholder="検体をスキャン..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
          />
        </SearchBox>

        <CommandCenter>
          <Select 
            value={inputPriority} 
            onChange={e => setInputPriority(e.target.value as Priority)}
          >
            <option value={PRIORITY.HIGH}>HIGH</option>
            <option value={PRIORITY.MEDIUM}>MID</option>
            <option value={PRIORITY.LOW}>LOW</option>
          </Select>
          <Input 
            type="date" 
            value={inputDueDate} 
            onChange={e => setInputDueDate(e.target.value)} 
            style={{ width: '45px', padding: '0.75rem 0.5rem' }} 
            title="Deadline"
          />
          <Input 
            placeholder="新しい実験命令を入力..." 
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <Button variant="primary" onClick={handleAdd} aria-label="plus">
            <Plus size={ICON_SIZE.LARGE} />
          </Button>
        </CommandCenter>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredTodos.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <ListContainer>
              {filteredTodos.map(todo => (
                <SortableTodoItem
                  key={todo.id}
                  todo={todo}
                  toggleTodo={toggleTodo}
                  deleteTodo={deleteTodo}
                  updatePriority={updatePriority}
                  updateTodo={updateTodo}
                  updateDueDate={updateDueDate}
                />
              ))}
            </ListContainer>
          </SortableContext>
        </DndContext>

        <FooterNav>
          {(Object.values(FILTER) as Filter[]).map(f => (
            <Button 
              key={f} 
              variant={filter === f ? 'active' : 'ghost'} 
              onClick={() => setFilter(f)}
              aria-label={`filter-${f}`}
              style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
            >
              {f === FILTER.ALL ? 'すべて' : f === FILTER.ACTIVE ? '未完了' : '完了済み'}
            </Button>
          ))}
          {todos.some(t => t.completed) && (
            <Button 
              variant="danger" 
              onClick={clearCompleted} 
              style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', marginLeft: 'auto' }}
            >
              <Trash2 size={14} /> 完了済みを破棄
            </Button>
          )}
        </FooterNav>
      </Container>
    </>
  );
}

export default App;
