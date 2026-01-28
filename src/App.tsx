import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle2, Circle, GripVertical } from 'lucide-react'
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './index.css'

interface Todo {
  id: string
  text: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
}

interface SortableItemProps {
  todo: Todo
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  updatePriority: (id: string, priority: 'high' | 'medium' | 'low') => void
}

function SortableTodoItem({ todo, toggleTodo, deleteTodo, updatePriority }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#3b82f6',
  };

  return (
    <li ref={setNodeRef} style={style} className={`todo-item priority-${todo.priority}`}>
      <div className="drag-handle" {...attributes} {...listeners}>
        <GripVertical size={18} color="rgba(255,255,255,0.2)" />
      </div>
      <button
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
        onClick={() => toggleTodo(todo.id)}
      >
        {todo.completed ? (
          <CheckCircle2 size={20} color="#2dd4bf" />
        ) : (
          <Circle size={20} color="rgba(255,255,255,0.3)" />
        )}
      </button>
      <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
        {todo.text}
      </span>
      <select
        className="priority-select"
        value={todo.priority}
        onChange={(e) => updatePriority(todo.id, e.target.value as any)}
        style={{ color: priorityColors[todo.priority] }}
      >
        <option value="high">高</option>
        <option value="medium">中</option>
        <option value="low">低</option>
      </select>
      <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
        <Trash2 size={18} />
      </button>
    </li>
  );
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('tachyon-todos')
    if (!saved) return []
    const parsed = JSON.parse(saved)
    return parsed.map((t: any) => ({ ...t, priority: t.priority || 'medium' }))
  })
  const [inputValue, setInputValue] = useState('')
  const [inputPriority, setInputPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    localStorage.setItem('tachyon-todos', JSON.stringify(todos))
  }, [todos])

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const addTodo = () => {
    if (!inputValue.trim()) return
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
      priority: inputPriority,
    }
    setTodos([...todos, newTodo])
    setInputValue('')
    setInputPriority('medium')
  }

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const updatePriority = (id: string, priority: 'high' | 'medium' | 'low') => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, priority } : todo
      )
    )
  }

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTodo()
  }

  return (
    <div className="todo-container">
      <h1 className="todo-title">実験的TODOアプリ</h1>
      <div className="todo-input-group">
        <select
          className="priority-input-select"
          value={inputPriority}
          onChange={(e) => setInputPriority(e.target.value as any)}
        >
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="モルモット君への新しい指令..."
        />
        <button className="add-btn" onClick={addTodo}>
          <Plus size={24} />
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredTodos.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <SortableTodoItem
                key={todo.id}
                todo={todo}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
                updatePriority={updatePriority}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <div className="filter-group">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'すべて' : f === 'active' ? '未完了' : '完了済み'}
          </button>
        ))}
      </div>

      {todos.some((t) => t.completed) && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            onClick={clearCompleted}
            className="clear-completed-btn"
          >
            完了済みタスクをすべて削除
          </button>
        </div>
      )}
      
      {filteredTodos.length === 0 && (
        <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '2rem' }}>
          まだ解析すべきデータが存在しないようだね。
        </p>
      )}
    </div>
  )
}

export default App
