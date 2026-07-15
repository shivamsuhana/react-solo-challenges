import { createSlice } from '@reduxjs/toolkit'

// UI state ka shape
interface UiState {
  sidebarOpen: boolean  // sidebar open hai ya band
}

const uiSlice = createSlice({
  name: 'ui',                           // slice ka naam
  initialState: { sidebarOpen: false } as UiState,  // starting state
  reducers: {
    // toggleSidebar — sidebarOpen ko ulta karo
    // true → false, false → true
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    }
  }
})

// action export karo
export const { toggleSidebar } = uiSlice.actions

// reducer export karo
export default uiSlice.reducer