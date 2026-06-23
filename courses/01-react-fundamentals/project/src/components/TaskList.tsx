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
}

export default function TaskList(props: TaskListProps) {
  const list = props.tasks ?? HARDCODED_TASKS

  return (
    <section id="task-list">
      {list.map(task => (
        <TaskCard
          key={task.id}
          title={task.title}
          description={task.description}
          priority={task.priority}
          completed={task.completed}         
          onToggle={props.onToggle ? () => props.onToggle!(task.id) : undefined}
        />
      ))}
    </section>
  )
}