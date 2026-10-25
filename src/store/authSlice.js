import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.status = 'succeeded'
      state.error = null
    },
    clearUser: (state) => {
      state.user = null
      state.status = 'idle'
      state.error = null
    },
    setAuthError: (state, action) => {
      state.status = 'failed'
      state.error = action.payload
    },
  },
})

export const { setUser, clearUser, setAuthError } = authSlice.actions
export default authSlice.reducer
