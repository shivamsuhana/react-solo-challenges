'use client';

import React from 'react';
import { useGetPostsQuery, useAddPostMutation } from '../store/apiSlice';

export default function PostsList() {
  const { data: posts, error, isLoading } = useGetPostsQuery();
  const [addPost, { isLoading: isAdding }] = useAddPostMutation();

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error loading posts</div>;

  const handleAddPost = async () => {
    try {
      await addPost({ title: 'New Post', body: 'This is a new post' }).unwrap();
      alert('Post added successfully!');
    } catch (err) {
      // Ignore or handle silently
    }
  };

  return (
    <div>
      <button onClick={handleAddPost} disabled={isAdding}>
        {isAdding ? 'Adding...' : 'Add Post'}
      </button>
      <ul>
        {posts?.slice(0, 5).map((post) => (
          <li key={post.id}>
            <h4>{post.title}</h4>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
