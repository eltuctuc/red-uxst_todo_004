import { useState } from 'react'
import './TaskCreate.css'

interface TaskCreateProps {
  onAdd: (title: string) => void
}

export function TaskCreate({ onAdd }: TaskCreateProps) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="task-create">
      <input
        className="task-create__input"
        type="text"
        placeholder="Neue Aufgabe..."
        aria-label="Neue Aufgabe"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
