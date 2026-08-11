import React from 'react';

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

export default function PostDetailPage({ params }: PostParams) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Post Details</h1>
      <p>Displaying content for post ID: <strong>{params.id}</strong></p>
    </div>
  );
}
