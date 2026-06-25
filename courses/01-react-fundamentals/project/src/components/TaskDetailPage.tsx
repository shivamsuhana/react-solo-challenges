import { useParams, useNavigate } from 'react-router-dom'
import type { Task } from './TaskList'

export default function TaskDetailPage() {

  const { id } = useParams()

  // back button ke liye
  const navigate = useNavigate()

  //  same key jo TaskApp use karta hai
  const tasks: Task[] = (() => {
    try {
      const saved = localStorage.getItem('task-app-tasks')
      if (!saved) return []
      return JSON.parse(saved) as Task[]
    } catch {
      return []
    }
  })()

 
  const task = tasks.find(t => String(t.id) === String(id))

  function handleBack() {
    navigate('/challenge/21-react-router')
  }

  if (!task) {
    return (
      <div id="task-detail-page">
        <p>Task not found</p>
        <button id="task-detail-back" onClick={handleBack}>
          Back to list
        </button>
      </div>
    )
  }

  return (
    <div id="task-detail-page">

      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.completed ? 'Completed' : 'Active'}</p>

      {task.category && <p>Category: {task.category}</p>}
      {task.tags && task.tags.length > 0 && (
        <p>Tags: {task.tags.join(', ')}</p>
      )}

      <button id="task-detail-back" onClick={handleBack}>
        Back to list
      </button>

    </div>
  )
}