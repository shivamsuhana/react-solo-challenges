import { useState } from 'react'

import type { Task } from './TaskList'

const CATEGORIES = ['General', 'Work', 'Personal']


interface TaskFormProps {
  onAddTask: (task: Task) => void
}

export default function TaskForm(props: TaskFormProps) {

  const [title, setTitle] = useState('')

  const [description, setDescription] = useState('')

  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low')

  const [error, setError] = useState('')

  const [category, setCategory] = useState('General')  
  const [tagsInput, setTagsInput] = useState('')

  const [dueDate, setDueDate] = useState('')


  function handleSubmit(e: React.FormEvent) {

    e.preventDefault()

    if (title.trim() === '') {
      setError('Title is required')
      return 
    }

    setError('')

    const tags = tagsInput
      .split(',')           
      .map(t => t.trim())  
      .filter(t => t !== '') 

    const newTask: Task = {
      id: Date.now(),       
      title: title,         
      description: description, 
      priority: priority,
      completed: false,  
      category: category, 
      tags: tags, 
      dueDate: dueDate || undefined, 
    }

    props.onAddTask(newTask)

    setTitle('')
    setDescription('')
    setPriority('Low')
    setCategory('General')
    setTagsInput('')
    setDueDate('')
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

      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        {CATEGORIES.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <input
        type="text"
        value={tagsInput}
        onChange={e => setTagsInput(e.target.value)}
        placeholder="Tags (comma separated: urgent, work)"
      />

      <input
        type="date"               // browser ka date picker dikhega
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
      />

      {error && (
        <p id="task-form-error">{error}</p>
      )}

      <button type="submit">Add Task</button>

    </form>
  )
}