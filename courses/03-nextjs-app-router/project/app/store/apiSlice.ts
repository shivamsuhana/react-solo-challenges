import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Post {
  id: number;
  title: string;
  body: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
    }),
    addPost: builder.mutation<Post, Partial<Post>>({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: initialPost,
      }),
    }),
  }),
});

export const { useGetPostsQuery, useAddPostMutation } = apiSlice;
