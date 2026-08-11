import React from 'react';
import { notFound } from 'next/navigation';
import LikeButton from '../../components/LikeButton';

interface PostParams {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
  ];
}

export async function generateMetadata({ params }: PostParams) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`);
  if (!res.ok) {
    return { title: 'Post Not Found', description: 'This post could not be found' };
  }
  const post = await res.json();
  return {
    title: post.title,
    description: `Details for post ${params.id}`
  };
}

export default async function PostDetailPage({ params }: PostParams) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`);
  
  if (!res.ok || params.id === '99999') {
    notFound();
  }
  
  const post = await res.json();

  return (
    <div style={{ padding: '20px' }}>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <LikeButton />
    </div>
  );
}
