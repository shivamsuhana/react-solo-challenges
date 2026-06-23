import { useState } from 'react'

import type { Task } from './TaskList'

interface TaskFormProps {
  onAddTask: (task: Task) => void
}

export default function TaskForm(props: TaskFormProps) {

  const [title, setTitle] = useState('')

  const [description, setDescription] = useState('')

  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low')

  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {

    e.preventDefault()

    if (title.trim() === '') {
      setError('Title is required')
      return 
    }

    setError('')

    const newTask: Task = {
      id: Date.now(),       
      title: title,         
      description: description, 
      priority: priority,
      completed: false,   
    }

    props.onAddTask(newTask)

    setTitle('')
    setDescription('')
    setPriority('Low')
  }

  return (
    <form onSubmit={handleSubmit}>

      <input
        id="task-title"            
        type="text"
        value={title}                
        onChange={e => setTitle(e.target.value)}  
        placeholder="Task title"
      />

      <input
        type="text"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Task description"
      />

      <select
        value={priority}
        onChange={e => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      {error && (
        <p id="task-form-error">{error}</p>
      )}

      <button type="submit">Add Task</button>

    </form>
  )
}