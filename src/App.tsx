import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle2, Circle, GripVertical, Search } from 'lucide-react'
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  STORAGE_KEY,
  PRIORITY,
  type Priority,
  FILTER,
  type Filter,
  PRIORITY_COLORS,
  THEME_COLORS,
  ICON_SIZE
} from './constants'
import './index.css'

interface Todo {
  id: string
  text: string
  completed: boolean
  priority: Priority
  dueDate?: string
}

interface SortableItemProps {
  todo: Todo
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  updatePriority: (id: string, priority: Priority) => void
  updateTodo: (id: string, text: string) => void
  updateDueDate: (id: string, date: string) => void
}

function SortableTodoItem({ todo, toggleTodo, deleteTodo, updatePriority, updateTodo, updateDueDate }: SortableItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

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

  const handleEdit = () => {
    if (isEditing && editText.trim() !== todo.text) {
      updateTodo(todo.id, editText)
    }
    setIsEditing(!isEditing)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleEdit()
    if (e.key === 'Escape') {
      setEditText(todo.text)
      setIsEditing(false)
    }
  }

  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date(new Date().setHours(0,0,0,0))

  return (
    <li ref={setNodeRef} style={style} className={`todo-item priority-${todo.priority} ${isOverdue ? 'overdue' : ''}`}>
      <div className="drag-handle" {...attributes} {...listeners}>
        <GripVertical size={ICON_SIZE.SMALL} color={THEME_COLORS.DRAG_HANDLE} />
      </div>
      <button
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
        onClick={() => toggleTodo(todo.id)}
        aria-label={`toggle-${todo.id}`}
      >
        {todo.completed ? (
          <CheckCircle2 size={ICON_SIZE.MEDIUM} color={THEME_COLORS.PRIMARY} />
        ) : (
          <Circle size={ICON_SIZE.MEDIUM} color={THEME_COLORS.TEXT_MUTED} />
        )}
      </button>
      
      <div className="todo-content">
        {isEditing ? (
          <input
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleEdit}
            autoFocus
          />
        ) : (
          <span 
            className={`todo-text ${todo.completed ? 'completed' : ''}`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.text}
          </span>
        )}
        {todo.dueDate && (
          <div className={`due-date-badge ${isOverdue ? 'overdue' : ''}`}>
            {todo.dueDate}
          </div>
        )}
      </div>

      <div className="todo-actions">
        <input
          type="date"
          className="date-input"
          value={todo.dueDate || ''}
          onChange={(e) => updateDueDate(todo.id, e.target.value)}
        />
        <select
          className="priority-select"
          value={todo.priority}
          onChange={(e) => updatePriority(todo.id, e.target.value as Priority)}
          style={{ color: PRIORITY_COLORS[todo.priority] }}
        >
          <option value={PRIORITY.HIGH}>高</option>
          <option value={PRIORITY.MEDIUM}>中</option>
          <option value={PRIORITY.LOW}>低</option>
        </select>
        <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
          <Trash2 size={ICON_SIZE.SMALL} />
        </button>
      </div>
    </li>
  );
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []
    const parsed = JSON.parse(saved)
    return parsed.map((t: any) => ({ 
      ...t, 
      priority: t.priority || PRIORITY.MEDIUM,
      dueDate: t.dueDate || undefined
    }))
  })
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [inputPriority, setInputPriority] = useState<Priority>(PRIORITY.MEDIUM)
  const [inputDueDate, setInputDueDate] = useState('')
  const [filter, setFilter] = useState<Filter>(FILTER.ALL)
  const [theme, setTheme] = useState<'dark' | 'light' | 'tachyon'>(() => {
    return (localStorage.getItem('tachyon-theme') as any) || 'dark'
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('tachyon-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const filteredTodos = todos.filter((todo) => {
    const matchesFilter = 
      filter === FILTER.ALL ? true :
      filter === FILTER.ACTIVE ? !todo.completed :
      todo.completed
    
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const addTodo = () => {
    if (!inputValue.trim()) return
    const newTodo: Todo = {
      id: typeof crypto.randomUUID === 'function' 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2) + Date.now().toString(36),
      text: inputValue,
      completed: false,
      priority: inputPriority,
      dueDate: inputDueDate || undefined
    }
    setTodos([...todos, newTodo])
    setInputValue('')
    setInputPriority(PRIORITY.MEDIUM)
    setInputDueDate('')
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

  const updateTodo = (id: string, text: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text } : todo
      )
    )
  }

  const updatePriority = (id: string, priority: Priority) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, priority } : todo
      )
    )
  }

  const updateDueDate = (id: string, date: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, dueDate: date } : todo
      )
    )
  }

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  // 統計データの計算
  const totalCount = todos.length
  const completedCount = todos.filter((t) => t.completed).length
  const activeCount = totalCount - completedCount
  const completionRate = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

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
      <div className="theme-switcher">
        {(['dark', 'light', 'tachyon'] as const).map((t) => (
          <button
            key={t}
            className={`theme-btn ${theme === t ? 'active' : ''}`}
            onClick={() => setTheme(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>
      <h1 className="todo-title">実験的TODOアプリ</h1>
      
      <div className="stats-dashboard">
        <div className="stats-grid">
          <div className="stats-item">
            <span className="stats-label">全タスク</span>
            <span className="stats-value">{totalCount}</span>
          </div>
          <div className="stats-item">
            <span className="stats-label">完了済み</span>
            <span className="stats-value" style={{ color: THEME_COLORS.PRIMARY }}>{completedCount}</span>
          </div>
          <div className="stats-item">
            <span className="stats-label">未完了</span>
            <span className="stats-value" style={{ color: PRIORITY_COLORS[PRIORITY.HIGH] }}>{activeCount}</span>
          </div>
          <div className="stats-item">
            <span className="stats-label">完了率</span>
            <span className="stats-value">{completionRate}%</span>
          </div>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      <div className="search-group">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="検体を検索..."
          className="search-input"
        />
      </div>

      <div className="todo-input-group">
        <select
          className="priority-input-select"
          value={inputPriority}
          onChange={(e) => setInputPriority(e.target.value as Priority)}
        >
          <option value={PRIORITY.HIGH}>高</option>
          <option value={PRIORITY.MEDIUM}>中</option>
          <option value={PRIORITY.LOW}>低</option>
        </select>
        <input
          type="date"
          className="date-input-field"
          value={inputDueDate}
          onChange={(e) => setInputDueDate(e.target.value)}
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="モルモット君への新しい指令..."
        />
        <button className="add-btn" onClick={addTodo} aria-label="plus">
          <Plus size={ICON_SIZE.LARGE} />
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
                updateTodo={updateTodo}
                updateDueDate={updateDueDate}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <div className="filter-group">
        {(Object.values(FILTER)).map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
            aria-label={`filter-${f}`}
          >
            {f === FILTER.ALL ? 'すべて' : f === FILTER.ACTIVE ? '未完了' : '完了済み'}
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
