import { useGetUsersQuery } from '../api/apiSlice'
import ErrorDisplay from './ErrorDisplay'

export default function UsersList() {
  const { data, isLoading, isError, error, refetch } = useGetUsersQuery()

  if (isLoading) {
    return (
      <div data-testid="users-list" id="users-list">
        <p data-testid="users-loading">Loading users...</p>
      </div>
    )
  }

  if (isError && error) {
    return (
      <div data-testid="users-list" id="users-list">
        <ErrorDisplay error={error} onRetry={refetch} />
      </div>
    )
  }

  return (
    <div data-testid="users-list" id="users-list">
      <ul>
        {data?.map((user) => (
          <li key={user.id}>
            {user.name} – {user.email} ({user.username})
          </li>
        ))}
      </ul>
    </div>
  )
}
