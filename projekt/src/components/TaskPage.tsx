import { useState } from 'react'
import type { Task } from '../types'
import { TaskCreate } from './TaskCreate'
import { TaskList } from './TaskList'
import './TaskPage.css'

export function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleAdd = (title: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      createdAt: Date.now(),
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

  const handleStartEdit = (id: string) => {
    setEditingId(id)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  return (
    <div className="task-page">
      <div className="task-page__card">
        <header className="task-page__header">
          <h1 className="task-page__title">Aufgaben</h1>
        </header>
        <TaskCreate onAdd={handleAdd} />
        <TaskList
          tasks={tasks}
          editingId={editingId}
          onStartEdit={handleStartEdit}
          onUpdate={handleUpdate}
          onCancelEdit={handleCancelEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
