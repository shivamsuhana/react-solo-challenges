import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {

    // check kiye local storage pahle jo theme already hai wo gain karne ke liye 
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('task-app-theme')
      if (saved === 'dark' || saved === 'light') return saved
      return 'light'  
    } catch {
      return 'light'
    }
  })

  //  theme change hone pe localStorage mein save karo
  //  aur document pe data-theme attribute lagaya— CSS ke liye
  useEffect(() => {
    localStorage.setItem('task-app-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}