import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "../services/api";
import { setTodos } from "../features/todoSlice";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTodos = async () => {
      try{
      const res = await api.get("/todos/get");
      if(res.data.status === "failed") {
        return;
      }
      dispatch(setTodos(res.data.todos));
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    };
    fetchTodos();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">📝 Real-Time Todo App</h1>
      <TodoForm />
      <TodoList />
    </div>
  );
}
