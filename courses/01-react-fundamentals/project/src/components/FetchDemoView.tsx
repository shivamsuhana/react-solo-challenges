import { useState, useEffect } from 'react'

interface TodoItem {
  id: number   
  title: string
}

export default function FetchDemoView() {

  const [items, setItems] = useState<TodoItem[]>([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {

    const controller = new AbortController()

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch('/api/todos.json', {
          signal: controller.signal
        })


        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`)
        }

        const data = await res.json() as TodoItem[]

        setItems(data)

      } catch (err) {

        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => controller.abort()

  }, [])  
  if (loading) {
    return (
      <div id="fetch-loading">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div id="fetch-error">
        {error}
      </div>
    )
  }

  return (
    <ul id="fetch-list">
      {items.map(item => (
        <li key={item.id}>
          {item.title}
        </li>
      ))}
    </ul>
  )
}