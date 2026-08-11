import Link from 'next/link';
import Counter from './components/Counter';

export default function HomePage() {
  return (
    <main style={{ padding: '20px' }}>
      <h1>Home Page</h1>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/about">About</Link>
      </div>
      

      <Counter />
    </main>
  );
}