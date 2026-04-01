import { useState, useRef, useEffect } from 'react'
import type { Task } from '../types'
import { Checkbox } from './Checkbox'
import './TaskItem.css'

interface TaskItemProps {
  task: Task
  isEditing: boolean
  onStartEdit: (id: string) => void
  onUpdate: (id: string, newTitle: string) => void
  onCancelEdit: () => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
}

export function TaskItem({
  task,
  isEditing,
  onStartEdit,
  onUpdate,
  onCancelEdit,
  onDelete,
  onToggle,
}: TaskItemProps) {
  const [editValue, setEditValue] = useState(task.title)
  const inputRef = useRef<HTMLInputElement>(null)
  const isSavingRef = useRef(false)
  const deleteButtonRef = useRef<HTMLButtonElement>(null)

  // BUG-FEAT1-QA-001 fix: nur beim Wechsel isEditing false→true initialisieren,
  // nicht bei jedem task.title-Update während des Editierens
  useEffect(() => {
    if (isEditing) {
      setEditValue(task.title)
      inputRef.current?.focus()
    }
    // task.title bewusst nicht als Dependency – verhindert Überschreiben des Tipp-Werts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing])

  const handleSave = () => {
    const trimmed = editValue.trim()
    if (!trimmed) return
    // BUG-FEAT1-QA-002 fix: Flag setzen damit handleBlur nach Enter nicht cancelt
    isSavingRef.current = true
    onUpdate(task.id, trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      onCancelEdit()
    }
  }

  // BUG-FEAT1-QA-002 + BUG-FEAT1-QA-004/007 fix: isSavingRef prüfen und
  // Fokus-Wechsel zum Delete-Button desselben Tasks nicht als Cancel werten
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isSavingRef.current) {
      isSavingRef.current = false
      return
    }
    if (
      e.relatedTarget &&
      deleteButtonRef.current &&
      e.relatedTarget === deleteButtonRef.current
    ) {
      return
    }
    onCancelEdit()
  }

  const checkboxLabel = task.completed
    ? `${task.title} als offen markieren`
    : `${task.title} als erledigt markieren`

  return (
    <li className="task-item">
      <Checkbox
        checked={task.completed}
        label={checkboxLabel}
        onChange={() => onToggle(task.id)}
      />
      {isEditing ? (
        <input
          ref={inputRef}
          className="task-item__edit-input"
          type="text"
          name="edit-task"
          value={editValue}
          aria-label="Titel bearbeiten"
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      ) : (
        // BUG-FEAT1-QA-003 fix: aria-label mit Aktions-Kontext für Screen Reader
        <span
          className={`task-item__title${task.completed ? ' task-item__title--completed' : ''}`}
          role="button"
          tabIndex={0}
          aria-label={`${task.title} bearbeiten`}
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
        ref={deleteButtonRef}
        className="task-item__delete"
        type="button"
        aria-label={`${task.title} löschen`}
        onClick={() => onDelete(task.id)}
        onBlur={(e) => {
          // BUG-FEAT1-QA-008 fix: Fokus zurück aufs Edit-Input → nicht abbrechen
          if (e.relatedTarget === inputRef.current) return
          // Fokus geht irgendwo anders hin → Edit-Modus beenden
          onCancelEdit()
        }}
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
