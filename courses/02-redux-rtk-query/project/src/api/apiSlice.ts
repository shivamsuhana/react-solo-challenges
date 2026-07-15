import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { mockApi } from './mockServer'

interface User {
  id: number
  name: string
  email: string
  username: string
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
    })

  })
})

export const { useGetUsersQuery, useAddUserMutation } = apiSlice