import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
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

const HeaderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 0.8rem;
`;

const StatItem = styled.div`
  text-align: center;
  span:first-child { font-size: 0.7rem; opacity: 0.6; display: block; }
  span:last-child { font-size: 1.2rem; font-weight: 800; }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--input-bg);
  padding: 0.6rem 1rem;
  border-radius: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
`;

const InputRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const ListWrapper = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FilterRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
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
  const [inputPriority, setInputPriority] = useState<typeof PRIORITY[keyof typeof PRIORITY]>(PRIORITY.MEDIUM);
  const [inputDueDate, setInputDueDate] = useState('');
  const [filter, setFilter] = useState<typeof FILTER[keyof typeof FILTER]>(FILTER.ALL);

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
              variant={theme === t ? 'active' : 'ghost'} 
              onClick={() => setTheme(t)}
              style={{ fontSize: '0.65rem', padding: '0.3rem 0.6rem' }}
            >
              {t.toUpperCase()}
            </Button>
          ))}
        </HeaderActions>

        <Title>実験的TODO</Title>

        <StatsSection>
          <StatItem><span>TOTAL</span><span>{stats.total}</span></StatItem>
          <StatItem><span>DONE</span><span style={{color: 'var(--primary-solid)'}}>{stats.completed}</span></StatItem>
          <StatItem><span>ACTIVE</span><span style={{color: 'var(--danger-color)'}}>{stats.active}</span></StatItem>
          <StatItem><span>RATE</span><span>{stats.rate}%</span></StatItem>
        </StatsSection>

        <SearchBar>
          <Search size={18} opacity={0.5} />
          <input 
            type="text" 
            placeholder="検体を検索..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', color: 'inherit', width: '100%' }}
          />
        </SearchBar>

        <InputRow>
          <Select value={inputPriority} onChange={e => setInputPriority(e.target.value as any)}>
            <option value={PRIORITY.HIGH}>高</option>
            <option value={PRIORITY.MEDIUM}>中</option>
            <option value={PRIORITY.LOW}>低</option>
          </Select>
          <Input 
            type="date" 
            value={inputDueDate} 
            onChange={e => setInputDueDate(e.target.value)} 
            style={{ width: '40px', padding: '0.5rem' }} 
          />
          <Input 
            placeholder="新しい指令..." 
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <Button variant="primary" onClick={handleAdd} aria-label="plus">
            <Plus size={ICON_SIZE.LARGE} />
          </Button>
        </InputRow>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredTodos.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <ListWrapper>
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
            </ListWrapper>
          </SortableContext>
        </DndContext>

        <FilterRow>
          {Object.values(FILTER).map(f => (
            <Button 
              key={f} 
              variant={filter === f ? 'active' : 'ghost'} 
              onClick={() => setFilter(f)}
              aria-label={`filter-${f}`}
            >
              {f === FILTER.ALL ? 'すべて' : f === FILTER.ACTIVE ? '未完了' : '完了済み'}
            </Button>
          ))}
        </FilterRow>

        {todos.some(t => t.completed) && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Button variant="danger" onClick={clearCompleted} style={{ fontSize: '0.8rem', padding: '0.4rem' }}>
              完了済みを削除
            </Button>
          </div>
        )}
      </Container>
    </>
  );
}

export default App;
