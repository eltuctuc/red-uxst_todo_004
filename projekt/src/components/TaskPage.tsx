import { useState, useEffect } from 'react'
import type { Task } from '../types'
import { TaskCreate } from './TaskCreate'
import { TaskList } from './TaskList'
import './TaskPage.css'

const STORAGE_KEY = 'ux-stammtisch-tasks'

function loadTasksFromStorage(): { tasks: Task[]; wasReset: boolean } {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === null) return { tasks: [], wasReset: false }
  try {
    const parsed = JSON.parse(raw)
    // BUG-FEAT3-QA-001: JSON.parse can return valid JSON that isn't an array
    if (!Array.isArray(parsed)) {
      localStorage.removeItem(STORAGE_KEY)
      return { tasks: [], wasReset: true }
    }
    // BUG-FEAT3-QA-002: Filter out task objects missing required fields
    const validTasks = parsed.filter(
      (item): item is Task =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.completed === 'boolean'
    )
    // BUG-FEAT3-UX-006: Set wasReset if any tasks were filtered out (partial loss)
    return { tasks: validTasks, wasReset: validTasks.length < parsed.length }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return { tasks: [], wasReset: true }
  }
}

export function TaskPage() {
  const [{ tasks: loadedTasks, wasReset }] = useState(loadTasksFromStorage)
  const [tasks, setTasks] = useState<Task[]>(loadedTasks)
  const [editingId, setEditingId] = useState<string | null>(null)
  // BUG-FEAT3-UX-001: Show notice when localStorage data was unrecoverable
  const [showResetNotice, setShowResetNotice] = useState(wasReset)

  const handleAdd = (title: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      createdAt: Date.now(),
      completed: false,
    }
    setTasks((prev) => [...prev, newTask])
  }

  const handleUpdate = (id: string, newTitle: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title: newTitle } : task))
    )
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
    if (editingId === id) {
      setEditingId(null)
    }
  }

  const handleToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const handleStartEdit = (id: string) => {
    setEditingId(id)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  return (
    <div className="task-page">
      <div className="task-page__card">
        {/* BUG-FEAT3-UX-001: Alert-Banner bei Silent Reset */}
        {showResetNotice && (
          <div className="task-page__reset-notice" role="alert">
            <span className="task-page__reset-notice-text">
              Gespeicherte Aufgaben konnten nicht geladen werden.
            </span>
            <button
              className="task-page__reset-notice-close"
              onClick={() => setShowResetNotice(false)}
              aria-label="Hinweis schließen"
            >
              ×
            </button>
          </div>
        )}
        <header className="task-page__header">
          <h1 className="task-page__title">Aufgaben</h1>
        </header>
        <TaskCreate onAdd={handleAdd} />
        {/* BUG-FEAT1-UX-007 fix: Card-Body-Wrapper gemäß DS-Spec card.md */}
        <div className="task-page__card-body">
          <TaskList
            tasks={tasks}
            editingId={editingId}
            onStartEdit={handleStartEdit}
            onUpdate={handleUpdate}
            onCancelEdit={handleCancelEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        </div>
      </div>
    </div>
  )
}
