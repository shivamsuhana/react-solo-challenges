import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { mockApi } from './mockServer'

// User ka type
interface User {
  id: number
  name: string
}

// createApi — RTK Query ka main function
export const apiSlice = createApi({

  // reducerPath = store mein kahan save hoga yeh API ka state
  reducerPath: 'api',

  // baseQuery = har request ka base URL
  // mockApi use kar rahe hain isliye custom baseQuery
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),

  // endpoints = kaunsi API calls available hain
  endpoints: (builder) => ({

    // getUsers = ek query endpoint
    // queryFn = custom function jo data return karta hai
    getUsers: builder.query<User[], void>({
      queryFn: async () => {
        try {
          const data = await mockApi.getUsers()
          return { data }  // RTK Query ko data chahiye is format mein
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } }
        }
      }
    })

  })
})

// hooks export karo — components mein use honge
export const { useGetUsersQuery } = apiSlice