import { useParams } from 'react-router-dom'
import { useGetPostByIdQuery } from '../api/apiSlice'

export default function PostDetail() {
  const { postId } = useParams()


  const id = postId ? Number(postId) : 1

  const { data, isLoading, isError } = useGetPostByIdQuery(
    id,
    { skip: !id }
  )

  if (isLoading) {
    return <div data-testid="post-detail-loading">Loading post...</div>
  }

  if (isError) {
    return <div data-testid="post-detail-error">Failed to load post</div>
  }

  return (
    <div data-testid="post-detail">
      <h1>{data?.title}</h1>
      <p>{data?.body}</p>
    </div>
  )
}