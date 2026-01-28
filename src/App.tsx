import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'
import './index.css'

interface Todo {
  id: string
  text: string
  completed: boolean
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('tachyon-todos')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

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
    }
    setTodos([...todos, newTodo])
    setInputValue('')
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTodo()
  }

  return (
    <div className="todo-container">
      <h1 className="todo-title">実験的TODOアプリ</h1>
      <div className="todo-input-group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="モルモット君への新しい指令..."
        />
        <button className="add-btn" onClick={addTodo}>
          <Plus size={24} />
        </button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
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
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>

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
      
      {filteredTodos.length === 0 && (
        <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '2rem' }}>
          まだ解析すべきデータが存在しないようだね。
        </p>
      )}
    </div>
  )
}

export default App
