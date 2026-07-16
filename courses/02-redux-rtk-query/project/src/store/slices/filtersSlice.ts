import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface FiltersState {
  sortBy: 'newest' | 'oldest'  
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState: { sortBy: 'newest' } as FiltersState,
  reducers: {
    setSortBy: (state, action: PayloadAction<'newest' | 'oldest'>) => {
      state.sortBy = action.payload
    }
  }
})

export const { setSortBy } = filtersSlice.actions
export default filtersSlice.reducer