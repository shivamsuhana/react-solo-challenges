import React from 'react';
import { notFound } from 'next/navigation';

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

export function generateMetadata({ params }: PostParams) {
  return {
    title: `Post ${params.id}`,
    description: `Details for post ${params.id}`
  };
}

export default function PostDetailPage({ params }: PostParams) {
  if (params.id === '99999') {
    notFound();
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Post Details</h1>
      <p>Displaying content for post ID: <strong>{params.id}</strong></p>
    </div>
  );
}
