import { createSlice } from "@reduxjs/toolkit"

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    count: 0
  },
  reducers: {
    increment: (state, action) => {
      console.log(action);
      return ({
        ...state,
        count: state.count + action.payload
      })
    },
    decrement: (state, action) => {
      return ({
        ...state,
        count: state.count - action.payload
      })
    }
  }
})

export const { increment, decrement } = counterSlice.actions
export const count = (state) => state.counter.count
export default counterSlice.reducer
