import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user.slice";

export const store = configureStore({
  reducer: {
    auth: userReducer,
  },
});
