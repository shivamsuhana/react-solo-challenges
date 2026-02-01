import { useGetPostsQuery } from '../api/apiSlice'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setSortBy, setFilterUserId } from '../store/slices/filtersSlice'

export default function PostsWithFilters() {
  const { data: posts = [] } = useGetPostsQuery()
  const filters = useAppSelector((state) => state.filters)
  const dispatch = useAppDispatch()

  const filtered = filters.filterUserId
    ? posts.filter((p) => p.userId === filters.filterUserId)
    : posts

  const sorted = [...filtered].sort((a, b) =>
    filters.sortBy === 'newest' ? b.id - a.id : a.id - b.id
  )

  return (
    <div data-testid="posts-with-filters" id="posts-with-filters">
      <div data-testid="filter-controls">
        <label>
          Sort:{' '}
          <select
            value={filters.sortBy}
            onChange={(e) =>
              dispatch(setSortBy(e.target.value as 'newest' | 'oldest'))
            }
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
        <label>
          User:{' '}
          <select
            value={filters.filterUserId ?? ''}
            onChange={(e) =>
              dispatch(
                setFilterUserId(
                  e.target.value === '' ? null : Number(e.target.value)
                )
              )
            }
          >
            <option value="">All</option>
            <option value="1">User 1</option>
            <option value="2">User 2</option>
          </select>
        </label>
      </div>
      <ul>
        {sorted.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong> – {post.body}
          </li>
        ))}
      </ul>
    </div>
  )
}
