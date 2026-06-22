import TaskCard from './TaskCard';

export interface Task {
  id: string | number;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
}

export default function TaskList() {
  return (
    <section id="task-list">
      <TaskCard 
        title="Task One" 
        description="First hardcoded task" 
        priority="High" 
      />
      <TaskCard 
        title="Task Two" 
        description="Second hardcoded task" 
        priority="Medium" 
      />
      <TaskCard 
        title="Task Three" 
        description="Third hardcoded task" 
        priority="Low" 
      />
    </section>
  );
}
