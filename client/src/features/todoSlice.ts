import { createSlice } from "@reduxjs/toolkit";

type Todo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

const todoSlice = createSlice({
  name: "todos",
  initialState: [] as Todo[],
  reducers: {
    setTodos: (_, action) => action.payload,
    addTodo: (state, action) => { state.push(action.payload); },
    updateTodo: (state, action) => {
      const idx = state.findIndex(t => t.id === action.payload.id);
      if (idx >= 0) state[idx] = action.payload;
    },
    deleteTodo: (state, action) => state.filter(t => t.id !== action.payload.id),
  },
});

export const { setTodos, addTodo, updateTodo, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;
