import { useGetUsersQuery } from '../api/apiSlice'
import ErrorDisplay from './ErrorDisplay'

export default function UsersList() {

  const { data, isLoading, isError, refetch } = useGetUsersQuery()

  if (isLoading) {
    return (
      <div data-testid="users-loading">
        Loading users...
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorDisplay
        error="Failed to load users. Please try again."
        onRetry={refetch}  // refetch = retry function
      />
    )
  }

  return (
    <ul data-testid="users-list">
      {Array.isArray(data) && data.map(user => (
        <li key={user.id}>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>{user.username}</p>
        </li>
      ))}
    </ul>
  )
}