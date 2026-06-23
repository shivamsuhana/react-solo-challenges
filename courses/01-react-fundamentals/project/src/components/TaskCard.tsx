interface TaskCardProps {
  title: string
  description: string
  priority: 'Low' | 'Medium' | 'High'
  completed?: boolean                    
  onToggle?: () => void             
}

export default function TaskCard(props: TaskCardProps) {
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

    </article>
  )
}