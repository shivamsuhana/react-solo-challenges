import React from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
}

export default async function PostsPage() {
  let posts: Post[] = [];
  let error: string | null = null;

  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }
    posts = await res.json();
  } catch (e) {
    error = 'Error fetching posts.';
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!posts || posts.length === 0) {
    return <div>No posts found.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: '10px' }}>
            <strong>{post.title}</strong>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
