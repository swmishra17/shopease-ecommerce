import { createSlice } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    productIds: [],
  },
  reducers: {
    toggleWishlist: (state, action) => {
      if (state.productIds.includes(action.payload)) {
        state.productIds = state.productIds.filter(
          (productId) => productId !== action.payload,
        )
      } else {
        state.productIds.push(action.payload)
      }
    },
  },
})

export const { toggleWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
