import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { mockApi } from './mockServer'

// User ka type — name, email, username
interface User {
  id: number
  name: string
  email: string
  username: string
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({

    // getUsers query — User array return karra hai
    getUsers: builder.query<User[], void>({
      queryFn: async () => {
        try {
          const data = await mockApi.getUsers()
          return { data }
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } }
        }
      }
    })

  })
})

export const { useGetUsersQuery } = apiSlice