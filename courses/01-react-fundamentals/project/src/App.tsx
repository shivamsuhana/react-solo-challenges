import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ChallengeList from './components/ChallengeList'
import UserProfile from './components/UserProfile'
import TodoList from './components/TodoList'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="App">
          <main>
            <Routes>
              <Route path="/" element={<ChallengeList />} />
              <Route path="/challenge/01-user-profile" element={
                <UserProfile name="John Doe" email="john.doe@example.com" />
              } />
              <Route path="/challenge/02-todo-list" element={<TodoList />} />
              <Route path="/challenge/03-state-management" element={<ThemeToggle />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
