import { useState, useEffect } from 'react'


function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {

  //  sirf ek baar chalega pehle render pe
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return initialValue

      return JSON.parse(item) as T
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}

export default useLocalStorage