//confidureStore.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterSlice, { increment } from "./counter";

const reducer = combineReducers({
  counter: counterSlice,
  // counter1: counterReducer1
});

// const loggerMiddleware = (store) => (next) => (action) => {
//   console.log(action);
//   //call next(action) to transfer action to reducer to update state and re-rennder
//   next(action)
// }

const store = configureStore({
  reducer,
  // middleware: (gDM) => gDM().concat(loggerMiddleware)
})

// store.subscribe(() => {
//   console.log(`current state ${store.getState().counter.count}`);
// })

// store.dispatch(increment(1))
// store.dispatch(increment(4))
// store.dispatch(increment(5))

export default store;