import Link from 'next/link';
import { Inter } from 'next/font/google';
import StoreProvider from './providers/StoreProvider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <nav>
            <Link href="/">Home</Link>
          </nav>
          <hr />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}