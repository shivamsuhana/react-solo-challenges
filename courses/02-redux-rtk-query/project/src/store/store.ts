import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import uiReducer from './slices/uiSlice'
import usersReducer from './slices/usersSlice'
import { apiSlice } from '../api/apiSlice'  
import filtersReducer from './slices/filtersSlice'  


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    ui: uiReducer,
    users: usersReducer,
    filters: filtersReducer, 

    [apiSlice.reducerPath]: apiSlice.reducer,
  },


  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch