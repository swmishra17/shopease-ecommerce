import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getProducts } from '../services/productService'

export const loadProducts = createAsyncThunk(
  'products/loadProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await getProducts()
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unable to load products.',
      )
    }
  },
)

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message
      })
  },
})

export default productsSlice.reducer
