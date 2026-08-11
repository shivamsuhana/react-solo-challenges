'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', maxWidth: '200px' }}>
      <h2>Counter</h2>
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{ padding: '5px 10px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Increment
      </button>
    </div>
  );
}
