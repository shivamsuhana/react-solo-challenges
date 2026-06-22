interface TaskCardProps {
  title: string
  description: string
  priority:'Low' | 'Medium' | 'High'
}

export default function TaskCard(props: TaskCardProps) {
  return (
       <article id="task-card">
      <h2>{props.title}</h2>
      <p>{props.description}</p>
      <p>Priority: {props.priority}</p>
    </article>


      
    
  )
}
