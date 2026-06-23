import type { Dispatch, SetStateAction } from 'react'
import type { Task } from './TaskList'
import TaskList from './TaskList'
import TaskForm from './TaskForm'

interface TaskAppProps {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>
  dispatch?: (action: { type: string; payload?: unknown }) => void
  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showStatsPanel?: boolean
  onDelete?: (id: string | number) => void  
  linkToTaskDetail?: boolean
}

export default function TaskApp(props: TaskAppProps) {
  const tasks = props.tasks ?? []

  const completedCount = tasks.filter(t => t.completed).length

  const countText = props.countFormat === 'completed'
    ? `${completedCount} of ${tasks.length} completed`
    : `${tasks.length} Tasks`

  function handleAddTask(task: Task) {
    if (props.setTasks) {
      props.setTasks(prev => [...prev, task])
    }
  }

  function handleToggle(id: string | number) {
    if (props.setTasks) {
      props.setTasks(prev => prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ))
    }
  }

  return (
    <div>
      <p id="task-count">{countText}</p>

      {props.showForm && (
        <TaskForm onAddTask={handleAddTask} />
      )}

      <TaskList
        tasks={tasks}
        onToggle={handleToggle}
        onDelete={props.onDelete}  
      />
    </div>
  )
}