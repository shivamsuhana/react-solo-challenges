import React, { Suspense } from 'react';
import AddPostForm from '../components/AddPostForm';

interface Post {
  id: number;
  title: string;
  body: string;
}

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  let posts: Post[] = [];
  let error: string | null = null;

  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', { next: { revalidate: 60 } });
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
      <AddPostForm />
      <Suspense fallback={<div>Loading posts stream...</div>}>
        <ul>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: '10px' }}>
              <strong>{post.title}</strong>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      </Suspense>
    </div>
  );
}
