/** Stub: Complete Challenge 09 (Mutations) per README. */
import { useState } from 'react'
import { useAddPostMutation } from '../api/apiSlice'

export default function AddPostForm() {

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  
  const [addPost, { isLoading, isSuccess }] = useAddPostMutation()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    await addPost({ title, body })

    setTitle('')
    setBody('')
  }

  return (
    <form data-testid="add-post-form" onSubmit={handleSubmit}>

      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Post title"
      />

      <input
        type="text"
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Post body"
      />

      <button
        type="submit"
        data-testid="add-post-submit"
        disabled={isLoading} 
      >
        {isLoading ? 'Submitting...' : 'Add Post'}
      </button>

      {isSuccess && <p>Post added successfully!</p>}

    </form>
  )
}
