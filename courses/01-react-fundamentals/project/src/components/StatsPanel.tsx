import { useMemo } from 'react'
import type { Task } from './TaskList'

interface StatsPanelProps {
  tasks?: Task[]  // optional — test bina tasks ke render karta hai
}

export default function StatsPanel(props: StatsPanelProps) {

  const stats = useMemo(() => {
    // ?? [] — agar tasks undefined aaye to empty array use karo
    const taskList = props.tasks ?? []

    const total = taskList.length
    const completed = taskList.filter(t => t.completed).length
    const active = taskList.filter(t => !t.completed).length
    const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const overdue = taskList.filter(t =>
      !t.completed &&
      t.dueDate &&
      new Date(t.dueDate) < today
    ).length

    return { total, completed, active, completedPercent, overdue }

  }, [props.tasks])

  return (
    <div id="stats-panel">
      <p>Total: {stats.total}</p>
      <p>Completed: {stats.completed} ({stats.completedPercent}%)</p>
      <div
        role="progressbar"
        aria-valuenow={stats.completedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ width: '100%', backgroundColor: '#eee', height: '10px' }}
      >
        <div style={{
          width: `${stats.completedPercent}%`,
          backgroundColor: 'green',
          height: '10px',
        }} />
      </div>
      <p>Active: {stats.active}</p>
      <p>Overdue: {stats.overdue}</p>
    </div>
  )
}