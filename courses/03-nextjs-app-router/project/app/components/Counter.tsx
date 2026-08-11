'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { increment, decrement } from '../store/store';

export default function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', maxWidth: '200px' }}>
      <h2>Counter (Redux)</h2>
      <p>Count: {count}</p>
      <button 
        onClick={() => dispatch(increment())}
        style={{ padding: '5px 10px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
      >
        +
      </button>
      <button 
        onClick={() => dispatch(decrement())}
        style={{ padding: '5px 10px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        -
      </button>
    </div>
  );
}
