import React, { Suspense } from 'react';
import Link from 'next/link';
import AddPostForm from '../components/AddPostForm';
import { addPost } from '../actions';

interface Post {
  id: number;
  title: string;
}

export const dynamic = 'force-dynamic';

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const query = searchParams?.q || '';
  const page = parseInt(searchParams?.page || '1', 10);
  const limit = 10;
  
  let posts: Post[] = [];
  let error: string | null = null;

  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }
    posts = await res.json();
  } catch (err: any) {
    error = err.message;
  }

  let filteredPosts = posts;
  if (query) {
    filteredPosts = posts.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));
  }

  const startIndex = (page - 1) * limit;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Posts</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <form action="/posts" method="GET">
          <input 
            name="q" 
            defaultValue={query} 
            placeholder="Search posts..." 
            style={{ padding: '5px', marginRight: '5px' }}
          />
          <button type="submit" style={{ padding: '5px 10px' }}>Search</button>
        </form>
      </div>

      <AddPostForm action={addPost} />
      
      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <Suspense fallback={<div>Loading posts...</div>}>
          <ul>
            {paginatedPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/posts/${post.id}`}>
                  {post.id}: {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </Suspense>
      )}

      <div style={{ marginTop: '20px' }}>
         <Link href={`/posts?page=${Math.max(1, page - 1)}&q=${query}`}>Previous</Link>
         {' | '}
         <Link href={`/posts?page=${page + 1}&q=${query}`}>Next</Link>
      </div>
    </div>
  );
}
