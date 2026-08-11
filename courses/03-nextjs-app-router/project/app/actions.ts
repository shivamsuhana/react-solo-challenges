'use server';

import { revalidatePath } from 'next/cache';

export async function addPostAction(formData: FormData) {
  const title = formData.get('title') as string;
  const body = formData.get('body') as string;

  // In a real app, you would save this to a database
  console.log('Adding post:', { title, body });

  // Revalidate the posts page
  revalidatePath('/posts');
}
