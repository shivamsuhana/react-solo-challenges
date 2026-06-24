import { useState, useEffect, useMemo  } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { Task } from './TaskList'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import FilterBar from './FilterBar'
import StatsPanel from './StatsPanel'

interface TaskAppProps {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>
  dispatch?: (action: { type: string; payload?: unknown }) => void
  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showStatsPanel?: boolean
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

const priorityOrder: Record<string, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
}

export default function TaskApp(props: TaskAppProps) {
const tasks = useMemo(() => props.tasks ?? [], [props.tasks])

  useEffect(() => {
    localStorage.setItem('task-app-tasks', JSON.stringify(tasks))
  }, [tasks])

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [sort, setSort] = useState('recently-added')
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [rawSearch, setRawSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const categories = [...new Set(tasks.map(t => t.category).filter(Boolean))]
  const isSearching = rawSearch !== debouncedSearch

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(rawSearch)
    }, 300)
    return () => clearTimeout(timeout)
  }, [rawSearch])

  // status filter
  const filteredTasks = filter === 'active'
    ? tasks.filter(t => !t.completed)
    : filter === 'completed'
    ? tasks.filter(t => t.completed)
    : tasks

  // category filter
  const categoryFiltered = categoryFilter === 'all'
    ? filteredTasks
    : filteredTasks.filter(t => t.category === categoryFilter)

  // search filter
  const searchedTasks = categoryFiltered.filter(t =>
    t.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    t.description.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  // sort
  const sortedTasks = [...searchedTasks].sort((a, b) => {
    if (sort === 'priority-high-low') return priorityOrder[b.priority] - priorityOrder[a.priority]
    if (sort === 'priority-low-high') return priorityOrder[a.priority] - priorityOrder[b.priority]
    if (sort === 'alphabetical') return a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    if (sort === 'due-date') {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    return 0
  })

  const countText = props.countFormat === 'completed'
    ? `${tasks.filter(t => t.completed).length} of ${tasks.length} completed`
    : `Showing ${sortedTasks.length} of ${tasks.length} tasks`

  function handleAddTask(task: Task) {
    if (props.setTasks) {
      props.setTasks(prev => [...prev, task])
    }
  }

  function handleToggle(id: string | number) {
    if (props.setTasks) {
      props.setTasks(prev => prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ))
    }
  }

  function handleUpdateTask(id: string | number, updates: {
    title: string
    description: string
    priority: 'Low' | 'Medium' | 'High'
    dueDate?: string
  }) {
    if (props.setTasks) {
      props.setTasks(prev => prev.map(t =>
        t.id === id ? { ...t, ...updates } : t
      ))
    }
  }

  return (
    <div>
      <p id="task-count">{countText}</p>

      {props.showStatsPanel && (
        <StatsPanel tasks={tasks} />
      )}

      {isSearching && (
        <p id="searching-indicator">Searching...</p>
      )}

      {props.showForm && (
        <TaskForm onAddTask={handleAddTask} />
      )}

      {props.showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sort={sort}
          onSortChange={setSort}
          search={rawSearch}
          onSearchChange={setRawSearch}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          categories={categories}
        />
      )}

      {sortedTasks.length === 0 && (
        <p id="filter-empty-message">No tasks found</p>
      )}

      <TaskList
        tasks={sortedTasks}
        onToggle={handleToggle}
        onDelete={props.onDelete}
        onUpdateTask={handleUpdateTask}
        editingId={editingId}
        onEditStart={id => setEditingId(id)}
        onEditEnd={() => setEditingId(null)}
      />
    </div>
  )
}