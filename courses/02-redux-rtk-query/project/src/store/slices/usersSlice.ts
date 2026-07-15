import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { mockApi } from '../../api/mockServer'

interface User {
  id: number
  name: string
}

interface UsersState {
  list: User[]       
  loading: boolean    
  error: string | null  
}


export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  () => mockApi.getUsers()
)

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loading: false,
    error: null
  } as UsersState,
  reducers: {},  

  extraReducers: (builder) => {

 
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true
      state.error = null
    })


    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false
      state.list = action.payload  
    })


    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? 'Something went wrong'
    })
  }
})

export default usersSlice.reducer