 import { useState } from 'react'

interface TaskCardProps {
  id: string | number
  title: string
  description: string
  priority: 'Low' | 'Medium' | 'High'
  completed?: boolean
  onToggle?: () => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (id: string | number, updates: { 
    title: string
    description: string
    priority: 'Low' | 'Medium' | 'High'
    dueDate?: string
  }) => void
  editingId?: string | number | null
  onEditStart?: (id: string | number) => void
  onEditEnd?: () => void
  category?: string
  tags?: string[]
  dueDate?: string
}

function getDueDateLabel(dueDate: string, completed: boolean) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)

  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (!completed && diffDays < 0) return 'Overdue'
  if (diffDays === 0) return 'Due Today'
  if (diffDays <= 3) return 'Due Soon'
  return null
}

export default function TaskCard(props: TaskCardProps) {

  const [editTitle, setEditTitle] = useState(props.title)
  const [editDescription, setEditDescription] = useState(props.description)
  const [editPriority, setEditPriority] = useState(props.priority)
  const [editError, setEditError] = useState('')
  const [editDueDate, setEditDueDate] = useState(props.dueDate ?? '')

  // null aur undefined dono check karo — warna test fail hoga
  const isEditing = props.editingId !== null &&
                    props.editingId !== undefined &&
                    props.editingId === props.id

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
        dueDate: editDueDate || undefined,
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

  // EDIT MODE
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

        <input
          type="date"
          value={editDueDate}
          onChange={e => setEditDueDate(e.target.value)}
        />

        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>

      </article>
    )
  }

  // NORMAL MODE
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

      {props.dueDate && (
        <div>
          <p id="task-due-date">
            {new Date(props.dueDate).toLocaleDateString()}
          </p>
          {getDueDateLabel(props.dueDate, props.completed ?? false) && (
            <span
              data-overdue={getDueDateLabel(props.dueDate, props.completed ?? false) === 'Overdue'}
            >
              {getDueDateLabel(props.dueDate, props.completed ?? false)}
            </span>
          )}
        </div>
      )}

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
