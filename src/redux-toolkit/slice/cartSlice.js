import { createSlice } from "@reduxjs/toolkit"
import { addDoc, collection } from "firebase/firestore"
import { toast } from "react-toastify"
import { db } from "../../firebase/config"

const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    ADD_TO_CART: (state, action) => {
      console.log(action.payload);
      //kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa?
      const productIndex = state.cartItems.findIndex(item => item.id === action.payload.id)
      if (productIndex > 0) { //tìm thấy => đã tồn tại
        state.cartItems[productIndex].cartQuantity += 1
        toast.success(`'${action.payload.name}' đã được thêm vào giỏ hàng`, {
          position: "top-left",
          autoClose: 1200
        })
      }
      else {
        state.cartItems.push({
          ...action.payload,
          cartQuantity: 1
        })
        toast.success(`'${action.payload.name}' đã được thêm vào giỏ hàng`, {
          position: "top-left",
          autoClose: 1200
        })
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },
  }
})

export const { ADD_TO_CART } = cartSlice.actions
export const selectCartItems = (state) => state.cart.cartItems
export const selectCartTotalQuantity = (state) => state.cart.cartTotalQuantity
export const selectCartTotalAmount = (state) => state.cart.cartTotalAmount
export default cartSlice.reducer
