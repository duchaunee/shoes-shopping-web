import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  products: []
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    STORE_PRODUCTS: (state, action) => {
      state.products = action.payload
      // console.log(state.products);
    },
  }
})

export const { STORE_PRODUCTS } = productSlice.actions
export const selectProducts = (state) => state.product.products
export default productSlice.reducer
