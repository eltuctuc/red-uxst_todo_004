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
  onToggle: (id: string) => void
}

export function TaskList({
  tasks,
  editingId,
  onStartEdit,
  onUpdate,
  onCancelEdit,
  onDelete,
  onToggle,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <TaskEmpty />
  }

  return (
    <ul className="task-list" role="list">{/* BUG-FEAT1-UX-010 fix: explizite Listenrolle – Safari/VoiceOver entfernt list-Rolle bei list-style:none */}
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isEditing={editingId === task.id}
          onStartEdit={onStartEdit}
          onUpdate={onUpdate}
          onCancelEdit={onCancelEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </ul>
  )
}
