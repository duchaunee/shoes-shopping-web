import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  isLoggedIn: false,
  email: "",
  userName: "",
  userID: "",
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    SET_ACTIVE_USER: (state, action) => {
      state.isLoggedIn = true;
      const { email, userName, userID } = action.payload;
      state.email = email;
      state.userName = userName;
      state.userID = userID;
      // console.log(action.payload);
    },
    REMOVE_ACTIVE_USER: (state, action) => {
      state.isLoggedIn = false;
      state.email = "";
      state.userName = "";
      state.userID = "";
    },
  }
})

export const { SET_ACTIVE_USER, REMOVE_ACTIVE_USER } = authSlice.actions
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn
export const selectEmail = (state) => state.auth.email
export const selectUserName = (state) => state.auth.userName
export const selectUserID = (state) => state.auth.userID
export default authSlice.reducer
