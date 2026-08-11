'use client';

import React from 'react';
import { addPostAction } from '../actions';

export default function AddPostForm() {
  return (
    <form action={addPostAction} style={{ marginBottom: '20px' }}>
      <h3>Add a New Post</h3>
      <div style={{ marginBottom: '10px' }}>
        <input 
          type="text" 
          name="title" 
          placeholder="Title" 
          required 
          style={{ marginRight: '10px' }} 
        />
        <input 
          type="text" 
          name="body" 
          placeholder="Body" 
          required 
          style={{ marginRight: '10px' }} 
        />
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}
