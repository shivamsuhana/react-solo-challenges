import { NextResponse } from 'next/server';

interface Post {
  id: number;
  title: string;
}

const staticPosts: Post[] = [
  { id: 1, title: 'Introduction to Next.js API Routes' },
  { id: 2, title: 'Understanding Server Components' }
];

export async function GET() {
  return NextResponse.json(staticPosts);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newPost: Post = {
      id: Date.now(),
      title: body.title || 'Untitled Post',
    };
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid Request Payload' }, { status: 400 });
  }
}
