import { useState } from 'react'
import { useAddPostMutation } from '../api/apiSlice'

export default function AddPostForm() {
  const [addPost, { isLoading }] = useAddPostMutation()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [userId, setUserId] = useState(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addPost({ title, body, userId }).unwrap()
      setTitle('')
      setBody('')
    } catch {
      // error handled by mutation
    }
  }

  return (
    <form
      data-testid="add-post-form"
      id="add-post-form"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      />
      <input
        type="number"
        min={1}
        value={userId}
        onChange={(e) => setUserId(Number(e.target.value))}
      />
      <button type="submit" data-testid="add-post-submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Post'}
      </button>
    </form>
  )
}
