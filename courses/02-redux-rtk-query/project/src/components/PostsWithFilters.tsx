/** Stub: Complete Challenge 11 (API and Local State) per README. */
import { useGetPostsQuery } from '../api/apiSlice'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setSortBy } from '../store/slices/filtersSlice'

// interface Post {
//   id: number
//   title: string
//   body: string
// }

export default function PostsWithFilters() {

  const { data: posts, isLoading, error } = useGetPostsQuery()

  const { sortBy } = useAppSelector(state => state.filters)
  const dispatch = useAppDispatch()

  const displayedPosts = [...(posts ?? [])].sort((a, b) => {
    if (sortBy === 'newest') return b.id - a.id  
    return a.id - b.id                           
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading posts</div>

  return (
    <div data-testid="posts-with-filters">

      <div data-testid="filter-controls">
        <select
          value={sortBy}
          onChange={e => dispatch(setSortBy(e.target.value as 'newest' | 'oldest'))}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <ul>
        {displayedPosts.map(post => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>

    </div>
  )
}
