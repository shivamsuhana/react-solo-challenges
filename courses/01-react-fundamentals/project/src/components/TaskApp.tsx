import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { Task } from './TaskList'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import FilterBar from './FilterBar'
import StatsPanel from './StatsPanel'
import { useTheme } from '../contexts/ThemeContext'
import useLocalStorage from '../hooks/useLocalStorage'
import ErrorBoundary from './ErrorBoundary'


interface TaskAppProps {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>
  dispatch?: (action: unknown) => void
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

  const [storedTasks, setStoredTasks] = useLocalStorage<Task[]>('task-app-tasks', [])
  const tasks = useMemo(() => props.tasks ?? storedTasks, [props.tasks, storedTasks])

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [sort, setSort] = useState('recently-added')
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [rawSearch, setRawSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const { theme, toggleTheme } = useTheme()

  const categories = useMemo(
    () => [...new Set(tasks.map(t => t.category).filter(Boolean))],
    [tasks]
  )

  const isSearching = rawSearch !== debouncedSearch

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(rawSearch)
    }, 300)
    return () => clearTimeout(timeout)
  }, [rawSearch])

  // useMemo — filter + search + sort sab ek saath
  // sirf jab koi dependency change ho tab recalculate hoga
  const sortedTasks = useMemo(() => {

    const filtered = filter === 'active'
      ? tasks.filter(t => !t.completed)
      : filter === 'completed'
      ? tasks.filter(t => t.completed)
      : tasks

    const categoryFiltered = categoryFilter === 'all'
      ? filtered
      : filtered.filter(t => t.category === categoryFilter)

    const searched = categoryFiltered.filter(t =>
      t.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      t.description.toLowerCase().includes(debouncedSearch.toLowerCase())
    )

    // sort
    return [...searched].sort((a, b) => {
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

  }, [tasks, filter, categoryFilter, debouncedSearch, sort])

  const countText = props.countFormat === 'completed'
    ? `${tasks.filter(t => t.completed).length} of ${tasks.length} completed`
    : `Showing ${sortedTasks.length} of ${tasks.length} tasks`


  const handleAddTask = useCallback((task: Task) => {
    if (props.dispatch) {
      props.dispatch({ type: 'ADD_TASK', payload: task })
    } else if (props.setTasks) {
      props.setTasks(prev => [...prev, task])
    } else {
      setStoredTasks(prev => [...prev, task])
    }
  }, [props.dispatch, props.setTasks, setStoredTasks])

  const handleToggle = useCallback((id: string | number) => {
    if (props.dispatch) {
      props.dispatch({ type: 'TOGGLE_TASK', payload: id })
    } else if (props.setTasks) {
      props.setTasks(prev => prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ))
    } else {
      setStoredTasks(prev => prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ))
    }
  }, [props.dispatch, props.setTasks, setStoredTasks])

  const handleUpdateTask = useCallback((id: string | number, updates: {
    title: string
    description: string
    priority: 'Low' | 'Medium' | 'High'
    dueDate?: string
  }) => {
    if (props.dispatch) {
      props.dispatch({ type: 'UPDATE_TASK', payload: { id, ...updates } })
    } else if (props.setTasks) {
      props.setTasks(prev => prev.map(t =>
        t.id === id ? { ...t, ...updates } : t
      ))
    } else {
      setStoredTasks(prev => prev.map(t =>
        t.id === id ? { ...t, ...updates } : t
      ))
    }
  }, [props.dispatch, props.setTasks, setStoredTasks])

  return (
    <div data-theme={theme}>

      <button id="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>

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

      <ErrorBoundary>
      <TaskList
        tasks={sortedTasks}
        onToggle={handleToggle}
        onDelete={props.onDelete}
        onUpdateTask={handleUpdateTask}
        editingId={editingId}
        onEditStart={id => setEditingId(id)}
        onEditEnd={() => setEditingId(null)}
      />
      </ErrorBoundary>
    </div>
  )
}