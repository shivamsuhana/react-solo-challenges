interface TaskCardProps {
  title: string
  description: string
  priority: 'Low' | 'Medium' | 'High'
  completed?: boolean
  onToggle?: () => void
  onDelete?: (id: string | number) => void 
  id?: string | number                      
}

export default function TaskCard(props: TaskCardProps) {

  
  function handleDelete() {
   
    const confirmed = window.confirm("Are you sure?")

    if (confirmed && props.onDelete && props.id !== undefined) {
      props.onDelete(props.id)
    }
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

      {props.onDelete && (
        <button onClick={handleDelete}>Delete</button>
      )}

    </article>
  )
}