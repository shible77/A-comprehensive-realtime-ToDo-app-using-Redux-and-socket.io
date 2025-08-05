import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "../services/api";
import { setTodos } from "../features/todoSlice";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { logout } from "../features/authSlice";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await api.get("/todos/get");
  
        dispatch(setTodos(res.data.todos));
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    };
    fetchTodos();
  }, []);

  const handleLogout = async() => {
    try {
      const res = await api.post("/auth/logout");
      if (res.data.status === "success") {
        dispatch(logout())
      }
    }catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-200">
      <div className="flex w-full justify-end mb-4">
        <button className="h-8 bg-cyan-500 rounded-md w-20 min-w-20 hover:bg-cyan-700 hover:text-white" onClick={handleLogout}>Log out</button>
      </div>
      <div className="w-5/6 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">📝 Real-Time Todo App</h1>
        <TodoForm />
        <TodoList />
      </div>
    </div>
  );
}
