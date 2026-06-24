import { useState } from 'react'

interface TaskCardProps {
  id: string | number
  title: string
  description: string
  priority: 'Low' | 'Medium' | 'High'
  completed?: boolean
  onToggle?: () => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (id: string | number, updates: { title: string; description: string; priority: 'Low' | 'Medium' | 'High' }) => void
  editingId?: string | number | null     
  onEditStart?: (id: string | number) => void   
  onEditEnd?: () => void  
  category?: string
  tags?: string[]                       
}

export default function TaskCard(props: TaskCardProps) {

  const [editTitle, setEditTitle] = useState(props.title)
  const [editDescription, setEditDescription] = useState(props.description)
  const [editPriority, setEditPriority] = useState(props.priority)
  const [editError, setEditError] = useState('')

  const isEditing = props.editingId === props.id

  function handleEditStart() {
    setEditTitle(props.title)           
    setEditDescription(props.description) 
    setEditPriority(props.priority)     
    setEditError('')                   
    if (props.onEditStart) {
      props.onEditStart(props.id)       
    }
  }

  function handleSave() {
    if (editTitle.trim() === '') {
      setEditError('Title is required')
      return  
    }
    if (props.onUpdateTask) {
      props.onUpdateTask(props.id, {
        title: editTitle,
        description: editDescription,
        priority: editPriority,
      })
    }
    if (props.onEditEnd) {
      props.onEditEnd()
    }
  }

  function handleCancel() {
    setEditError('')  
    if (props.onEditEnd) {
      props.onEditEnd() 
    }
  }

  if (isEditing) {
    return (
      <article id="task-card" data-completed={props.completed}>

        <input
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
        />

        {editError && <p>{editError}</p>}

        <input
          type="text"
          value={editDescription}
          onChange={e => setEditDescription(e.target.value)}
        />

        <select
          value={editPriority}
          onChange={e => setEditPriority(e.target.value as 'Low' | 'Medium' | 'High')}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button onClick={handleSave}>Save</button>

        <button onClick={handleCancel}>Cancel</button>

      </article>
    )
  }

  return (
    <article id="task-card" data-completed={props.completed}>

      {props.onToggle && (
        <input
          type="checkbox"
          checked={props.completed ?? false}
          onChange={props.onToggle}
        />
      )}

      <h2 style={{ textDecoration: props.completed ? 'line-through' : 'none' }}>
        {props.title}
      </h2>

      <p style={{ textDecoration: props.completed ? 'line-through' : 'none' }}>
        {props.description}
      </p>

      <p>Priority: {props.priority}</p>
      


<p id="task-category">{props.category ?? 'General'}</p>


<div id="task-tags">
  {(props.tags ?? []).map(tag => (
   
    <span key={tag} data-tag={tag}>
      {tag}
    </span>
  ))}
</div>



      {props.onUpdateTask && (
        <button onClick={handleEditStart}>Edit</button>
      )}

      {props.onDelete && (
        <button onClick={() => {
          if (props.onDelete && props.id !== undefined) {
            props.onDelete(props.id)
          }
        }}>Delete</button>
      )}

    </article>
  )
}