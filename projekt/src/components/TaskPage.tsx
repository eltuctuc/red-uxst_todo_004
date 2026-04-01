import { useState, useEffect } from 'react'
import type { Task } from '../types'
import { TaskCreate } from './TaskCreate'
import { TaskList } from './TaskList'
import './TaskPage.css'

const STORAGE_KEY = 'ux-stammtisch-tasks'

function loadTasksFromStorage(): Task[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === null) return []
  try {
    return JSON.parse(raw) as Task[]
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

export function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>(loadTasksFromStorage)
  const [editingId, setEditingId] = useState<string | null>(null)

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
