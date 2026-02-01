import { createSlice } from '@reduxjs/toolkit'

type SortBy = 'newest' | 'oldest'

interface FiltersState {
  sortBy: SortBy
  filterUserId: number | null
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState: { sortBy: 'newest' as SortBy, filterUserId: null } as FiltersState,
  reducers: {
    setSortBy(state, action: { payload: SortBy }) {
      state.sortBy = action.payload
    },
    setFilterUserId(state, action: { payload: number | null }) {
      state.filterUserId = action.payload
    },
  },
})

export const { setSortBy, setFilterUserId } = filtersSlice.actions
export default filtersSlice.reducer
