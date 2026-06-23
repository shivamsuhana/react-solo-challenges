import { useState } from 'react' 
import type { Dispatch, SetStateAction } from 'react'
import type { Task } from './TaskList'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import FilterBar from './FilterBar'  

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

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  // filter 'active' hai to sirf incomplete tasks
  // filter 'completed' hai to sirf complete tasks
  // filter 'all' hai to saare tasks
  const filteredTasks = filter === 'active'
    ? tasks.filter(t => !t.completed)
    : filter === 'completed'
    ? tasks.filter(t => t.completed)
    : tasks

  const countText = props.countFormat === 'completed'
    ? `${tasks.filter(t => t.completed).length} of ${tasks.length} completed`
    : `Showing ${filteredTasks.length} of ${tasks.length} tasks`

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

      {props.showFilterBar && (
        <FilterBar
          filter={filter}              
          onFilterChange={setFilter}  
        />
      )}

      {filteredTasks.length === 0 && (
        <p id="filter-empty-message">No tasks match this filter</p>
      )}

      <TaskList
        tasks={filteredTasks}
        onToggle={handleToggle}
        onDelete={props.onDelete}
      />
    </div>
  )
}