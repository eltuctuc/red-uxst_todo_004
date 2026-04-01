import { useState, useRef, useEffect } from 'react'
import type { Task } from '../types'
import './TaskItem.css'

interface TaskItemProps {
  task: Task
  isEditing: boolean
  onStartEdit: (id: string) => void
  onUpdate: (id: string, newTitle: string) => void
  onCancelEdit: () => void
  onDelete: (id: string) => void
}

export function TaskItem({
  task,
  isEditing,
  onStartEdit,
  onUpdate,
  onCancelEdit,
  onDelete,
}: TaskItemProps) {
  const [editValue, setEditValue] = useState(task.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      setEditValue(task.title)
      inputRef.current?.focus()
    }
  }, [isEditing, task.title])

  const handleSave = () => {
    const trimmed = editValue.trim()
    if (!trimmed) return
    onUpdate(task.id, trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      onCancelEdit()
    }
  }

  const handleBlur = () => {
    onCancelEdit()
  }

  return (
    <li className="task-item">
      {isEditing ? (
        <input
          ref={inputRef}
          className="task-item__edit-input"
          type="text"
          value={editValue}
          aria-label="Titel bearbeiten"
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      ) : (
        <span
          className="task-item__title"
          role="button"
          tabIndex={0}
          onClick={() => onStartEdit(task.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onStartEdit(task.id)
            }
          }}
        >
          {task.title}
        </span>
      )}
      <button
        className="task-item__delete"
        type="button"
        aria-label={`${task.title} löschen`}
        onClick={() => onDelete(task.id)}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M11 3.5L3 11.5M3 3.5L11 11.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </li>
  )
}
