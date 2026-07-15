// useQueryHook: useGetUsersQuery
import { useGetUsersQuery } from '../api/apiSlice'

export default function UsersList() {

  // useQueryHook — RTK Query generated hook
  const { data, isLoading, error } = useGetUsersQuery()

  // LOADING STATE
  if (isLoading) {
    return (
      <div data-testid="users-loading">
        Loading...
      </div>
    )
  }

  // ERROR STATE
  if (error) {
    return (
      <div data-testid="users-error">
        Something went wrong
      </div>
    )
  }

  // DATA STATE
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