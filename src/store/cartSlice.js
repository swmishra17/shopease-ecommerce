import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    message: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const { productId, stock } = action.payload
      const item = state.items.find((entry) => entry.productId === productId)

      if (stock < 1) {
        state.message = 'This product is currently out of stock.'
      } else if (item && item.quantity >= stock) {
        state.message = `Only ${stock} of this product are available.`
      } else if (item) {
        item.quantity += 1
        state.message = null
      } else {
        state.items.push({ productId, quantity: 1 })
        state.message = null
      }
    },
    setCartQuantity: (state, action) => {
      const { productId, quantity, stock } = action.payload
      const item = state.items.find((entry) => entry.productId === productId)

      if (!item) return
      if (stock < 1) {
        state.items = state.items.filter(
          (entry) => entry.productId !== productId,
        )
        state.message = 'This product is currently out of stock and was removed.'
        return
      }
      if (quantity <= 0) {
        state.items = state.items.filter(
          (entry) => entry.productId !== productId,
        )
        state.message = null
        return
      }
      if (quantity > stock) {
        item.quantity = stock
        state.message = `Only ${stock} of this product are available.`
        return
      }

      item.quantity = quantity
      state.message = null
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      )
      state.message = null
    },
    clearCartMessage: (state) => {
      state.message = null
    },
  },
})

export const { addToCart, setCartQuantity, removeFromCart, clearCartMessage } =
  cartSlice.actions
export default cartSlice.reducer
