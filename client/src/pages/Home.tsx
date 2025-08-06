import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../app/store";
import api from "../services/api";
import { setTodos } from "../features/todoSlice";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { logout } from "../features/authSlice";
import { DynamicIcon } from "lucide-react/dynamic";
import { showModal } from "../features/modalSlice";



export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    const setTitle = () => {
      document.title = "ToDos | Home";
    }
    const fetchTodos = async () => {
      try {
        const res = await api.get("/todos/get");
  
        dispatch(setTodos(res.data.todos));
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    };
    setTitle();
    fetchTodos();
  }, []);

  const handleLogout = async() => {
    try {
      const res = await api.post("/auth/logout");
      if (res.data.status === "success") {
        dispatch(setTodos([]))
        dispatch(logout())
      }
    }catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-2 bg-gray-200">
      <div className="flex w-full justify-between items-center mb-12 p-2 rounded bg-gray-300 shadow-xl">
        <h1 className="flex flex-row items-center text-md font-bold text-gray-800 gap-x-1">
          <DynamicIcon name="circle-user-round" color="black" size={30}/>
          Welcome, {user.username}!
        </h1>
        <button className="flex justify-center items-center h-8 bg-blue-400 rounded-md w-20 min-w-20 hover:bg-blue-300 cursor-pointer transition-colors duration-300" onClick={() => dispatch(showModal({ title: "Log Out", type: "warning", message: "Are you sure to logout?", confirmAction: (() => {handleLogout()}) }))}>
          <DynamicIcon name="log-out" color="black" size={20} />
        </button>
      </div>
      <div className="w-5/6 max-w-md mx-auto bg-white p-6 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Your Todos</h1>
        <TodoForm />
        <TodoList />
      </div>
    </div>
  );
}
