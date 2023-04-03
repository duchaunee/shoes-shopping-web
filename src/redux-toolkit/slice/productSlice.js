import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  products: [],
  girlProducts: [],
  boyProducts: [],
  childProducts: [],
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    STORE_PRODUCTS: (state, action) => {
      state.products = action.payload
      // console.log(state.products);
    },
    STORE_GIRL_PRODUCTS: (state, action) => {
      state.girlProducts = action.payload
      // console.log(state.girlProducts);
    },
  }
})

export const { STORE_PRODUCTS, STORE_GIRL_PRODUCTS } = productSlice.actions
export const selectProducts = (state) => state.product.products
export const selectGirlProducts = (state) => state.product.girlProducts
export const selectBoyProducts = (state) => state.product.boyProducts
export const selectChildProducts = (state) => state.product.childProducts
export default productSlice.reducer
