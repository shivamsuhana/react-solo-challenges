'use client';

import React, { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Something went wrong!</h2>
      <p>We encountered an unexpected error.</p>
      <button 
        onClick={() => reset()}
        style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '10px' }}
      >
        Try again
      </button>
    </div>
  );
}
