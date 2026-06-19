import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice.js";
import chatReducer from "../features/chat/chatSlice.js"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat:chatReducer
  },
});
