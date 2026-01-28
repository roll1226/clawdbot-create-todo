import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
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
    const listItem = todoText.closest('li')!
    const checkbox = within(listItem).getByRole('button', { name: /toggle-/i })

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

    // Add another task and toggle it to completed
    fireEvent.change(input, { target: { value: 'Completed task' } })
    fireEvent.click(addBtn)
    
    const completedTaskText = screen.getByText('Completed task')
    const listItem = completedTaskText.closest('li')!
    const checkbox = within(listItem).getByRole('button', { name: /toggle-/i })
    fireEvent.click(checkbox)

    // Filter by Active
    fireEvent.click(screen.getByLabelText('filter-active'))
    expect(screen.queryByText('Completed task')).not.toBeInTheDocument()
    expect(screen.getByText('Active task')).toBeInTheDocument()

    // Filter by Completed
    fireEvent.click(screen.getByLabelText('filter-completed'))
    expect(screen.queryByText('Active task')).not.toBeInTheDocument()
    expect(screen.getByText('Completed task')).toBeInTheDocument()

    // Filter by All
    fireEvent.click(screen.getByLabelText('filter-all'))
    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.getByText('Completed task')).toBeInTheDocument()
  })
})
