import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

describe('AGNES LAB TODO UI', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders the laboratory title', () => {
    render(<App />)
    expect(screen.getByText('AGNES LAB TODO')).toBeInTheDocument()
  })

  it('can register a new experiment (add todo)', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('新しい実験命令を入力...')
    const addButton = screen.getByRole('button', { name: /plus/i })

    fireEvent.change(input, { target: { value: 'Synthesize caffeine' } })
    fireEvent.click(addButton)

    expect(screen.getByText('Synthesize caffeine')).toBeInTheDocument()
  })

  it('can update experiment status (toggle completion)', async () => {
    render(<App />)
    const input = screen.getByPlaceholderText('新しい実験命令を入力...')
    fireEvent.change(input, { target: { value: 'Analyze sugar' } })
    fireEvent.click(screen.getByRole('button', { name: /plus/i }))

    const todoText = screen.getByText('Analyze sugar')
    const checkbox = screen.getByLabelText(/toggle-/i)

    fireEvent.click(checkbox)
    // Verify completion status
    expect(todoText).toHaveStyle('text-decoration: line-through')
  })
})
