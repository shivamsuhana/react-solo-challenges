import Link from 'next/link';
import Image from 'next/image';
import Counter from './components/Counter';

export const metadata = {
  title: 'Home Page',
  description: 'Welcome to the Next.js challenges app',
};

export default function HomePage() {
  return (
    <main style={{ padding: '20px' }}>
      <h1>Welcome to Next.js App Router Challenges</h1>
      <Image 
        src="https://placehold.co/600x400.png" 
        alt="Placeholder image" 
        width={600} 
        height={400} 
        style={{ marginBottom: '20px' }}
      />
      <p>This is the home page.</p>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/about">About</Link>
      </div>
      

      <Counter />
    </main>
  );
}