import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { User } from '../../api/mockServer'
import { mockApi } from '../../api/mockServer'

export const fetchUsers = createAsyncThunk<User[]>(
  'users/fetchUsers',
  () => mockApi.getUsers()
)

interface UsersState {
  list: User[]
  loading: boolean
  error: string | null
}

const initialState: UsersState = {
  list: [],
  loading: false,
  error: null,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
        state.error = null
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to fetch users'
      })
  },
})

export default usersSlice.reducer
