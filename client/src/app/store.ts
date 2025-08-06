import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import todoReducer from "../features/todoSlice";
import modalReducer from "../features/modalSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
