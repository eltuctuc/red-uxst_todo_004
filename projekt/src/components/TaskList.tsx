import type { Task } from '../types'
import { TaskItem } from './TaskItem'
import { TaskEmpty } from './TaskEmpty'
import './TaskList.css'

interface TaskListProps {
  tasks: Task[]
  editingId: string | null
  onStartEdit: (id: string) => void
  onUpdate: (id: string, newTitle: string) => void
  onCancelEdit: () => void
  onDelete: (id: string) => void
}

export function TaskList({
  tasks,
  editingId,
  onStartEdit,
  onUpdate,
  onCancelEdit,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <TaskEmpty />
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isEditing={editingId === task.id}
          onStartEdit={onStartEdit}
          onUpdate={onUpdate}
          onCancelEdit={onCancelEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
