import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { mockApi } from './mockServer'

interface User {
  id: number
  name: string
  email: string
  username: string
}

interface Post {
  id: number
  title: string
  body: string
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['User', 'Post'],

  endpoints: (builder) => ({

    getUsers: builder.query<User[], void>({
      queryFn: async () => {
        try {
          const data = await mockApi.getUsers()
          return { data }
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } }
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User' as const, id: 'LIST' },
            ]
          : [{ type: 'User' as const, id: 'LIST' }]
    }),

    addUser: builder.mutation<User, Partial<User>>({
      queryFn: async (newUser) => {
        try {
          const data = { id: Date.now(), name: '', email: '', username: '', ...newUser }
          return { data }
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } }
        }
      },
      invalidatesTags: [{ type: 'User', id: 'LIST' }]
    }),


    getPosts: builder.query<Post[], void>({
      queryFn: async () => {
        try {
          return { data: [] }
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } }
        }
      },
      providesTags: [{ type: 'Post', id: 'LIST' }]
    }),

    addPost: builder.mutation<Post, Omit<Post, 'id'>>({
      queryFn: async (newPost) => {
        try {
          const data: Post = {
            id: Date.now(),
            title: newPost.title,
            body: newPost.body,
          }
          return { data }
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } }
        }
      },
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],


      async onQueryStarted(arg, { dispatch, queryFulfilled }) {


        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {

            draft.push({ ...arg, id: Date.now() })
          })
        )

        try {
          await queryFulfilled
        } catch {

          patchResult.undo()
        }
      }
    })

  })
})

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useGetPostsQuery,
  useAddPostMutation,
} = apiSlice