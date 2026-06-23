import TaskCard from './TaskCard'

export interface Task {
  id: string | number
  title: string
  description: string
  priority: 'Low' | 'Medium' | 'High'
  completed: boolean
}

const HARDCODED_TASKS: Task[] = [
  { id: 'h1', title: 'Task One',   description: 'First hardcoded task',  priority: 'High',   completed: false },
  { id: 'h2', title: 'Task Two',   description: 'Second hardcoded task', priority: 'Medium', completed: false },
  { id: 'h3', title: 'Task Three', description: 'Third hardcoded task',  priority: 'Low',    completed: false },
]

interface TaskListProps {
  tasks?: Task[]
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (id: string | number, updates: { title: string; description: string; priority: 'Low' | 'Medium' | 'High' }) => void
  editingId?: string | number | null   
  onEditStart?: (id: string | number) => void 
  onEditEnd?: () => void                        
}

export default function TaskList(props: TaskListProps) {
  const list = props.tasks ?? HARDCODED_TASKS

  return (
    <section id="task-list">
      {list.map(task => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description}
          priority={task.priority}
          completed={task.completed}
          onToggle={props.onToggle ? () => props.onToggle!(task.id) : undefined}
          onDelete={props.onDelete}
          onUpdateTask={props.onUpdateTask} 
          editingId={props.editingId}        
          onEditStart={props.onEditStart}    
          onEditEnd={props.onEditEnd}       
        />
      ))}
    </section>
  )
}