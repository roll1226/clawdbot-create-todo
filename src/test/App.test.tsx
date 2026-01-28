import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

describe('Experimental TODO App UI', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders the title', () => {
    render(<App />)
    expect(screen.getByText('実験的TODO')).toBeInTheDocument()
  })

  it('can add a new todo', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('新しい指令...')
    const addButton = screen.getByRole('button', { name: /plus/i })

    fireEvent.change(input, { target: { value: 'Buy special coffee beans' } })
    fireEvent.click(addButton)

    expect(screen.getByText('Buy special coffee beans')).toBeInTheDocument()
  })

  it('can toggle todo completion', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('新しい指令...')
    fireEvent.change(input, { target: { value: 'Test completion' } })
    fireEvent.click(screen.getByRole('button', { name: /plus/i }))

    const todoText = screen.getByText('Test completion')
    // Click the toggle button using aria-label
    const checkbox = screen.getByLabelText(/toggle-/i)

    fireEvent.click(checkbox)
    expect(todoText).toHaveStyle('text-decoration: line-through')
  })
})
