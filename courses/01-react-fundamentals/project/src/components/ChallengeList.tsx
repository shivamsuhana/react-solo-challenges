import { Link } from 'react-router-dom'

const challenges = [
  { id: '01-user-profile', name: 'User Profile', route: '/challenge/01-user-profile' },
  { id: '02-todo-list', name: 'Todo List', route: '/challenge/02-todo-list' },
  { id: '03-state-management', name: 'State Management (Context)', route: '/challenge/03-state-management' },
]

export default function ChallengeList() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Challenges</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
        {challenges.map((c) => (
          <li key={c.id} style={{ marginBottom: '0.75rem' }}>
            <span>{c.name}</span>
            {' — '}
            <Link to={c.route}>View Output</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
