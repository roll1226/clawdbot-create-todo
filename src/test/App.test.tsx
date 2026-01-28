import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

describe('Experimental TODO App', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders the title', () => {
    render(<App />)
    expect(screen.getByText('実験的TODOアプリ')).toBeInTheDocument()
  })

  it('can add a new todo', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('モルモット君への新しい指令...')
    const addButton = screen.getByRole('button', { name: /plus/i })

    fireEvent.change(input, { target: { value: 'Buy special coffee beans' } })
    fireEvent.click(addButton)

    expect(screen.getByText('Buy special coffee beans')).toBeInTheDocument()
  })

  it('can toggle todo completion', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('モルモット君への新しい指令...')
    fireEvent.change(input, { target: { value: 'Test completion' } })
    fireEvent.click(screen.getByRole('button', { name: /plus/i }))

    const todoText = screen.getByText('Test completion')
    const checkbox = screen.getAllByRole('button')[3] // Theme buttons(3) + Add button(1) + Checkbox(1) -> Index 4 or similar

    fireEvent.click(checkbox)
    expect(todoText).toHaveClass('completed')
  })

  it('can filter tasks', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('モルモット君への新しい指令...')
    const addBtn = screen.getByRole('button', { name: /plus/i })

    // Add active task
    fireEvent.change(input, { target: { value: 'Active task' } })
    fireEvent.click(addBtn)

    // Add completed task
    fireEvent.change(input, { target: { value: 'Completed task' } })
    fireEvent.click(addBtn)
    
    const checkboxes = screen.getAllByRole('button').filter(b => b.querySelector('svg'))
    // Find specific todo and toggle it (this logic is a bit brittle in test but for demo)
    fireEvent.click(screen.getAllByRole('button').find(b => b.nextSibling?.textContent === 'Completed task')!)

    // Filter by Active
    fireEvent.click(screen.getByText('未完了'))
    expect(screen.queryByText('Completed task')).not.toBeInTheDocument()
    expect(screen.getByText('Active task')).toBeInTheDocument()

    // Filter by Completed
    fireEvent.click(screen.getByText('完了済み'))
    expect(screen.queryByText('Active task')).not.toBeInTheDocument()
    expect(screen.getByText('Completed task')).toBeInTheDocument()
  })
})
