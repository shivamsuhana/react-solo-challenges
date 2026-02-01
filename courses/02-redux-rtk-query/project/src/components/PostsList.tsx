import { useGetPostsQuery } from '../api/apiSlice'

export default function PostsList() {
  const { data, isLoading, isError, error } = useGetPostsQuery()

  if (isLoading) {
    return (
      <div data-testid="posts-list" id="posts-list">
        <p>Loading posts...</p>
      </div>
    )
  }

  if (isError && error) {
    return (
      <div data-testid="posts-list" id="posts-list">
        <p>Error: {String(error)}</p>
      </div>
    )
  }

  return (
    <div data-testid="posts-list" id="posts-list">
      <ul>
        {data?.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong> – {post.body}
          </li>
        ))}
      </ul>
    </div>
  )
}
