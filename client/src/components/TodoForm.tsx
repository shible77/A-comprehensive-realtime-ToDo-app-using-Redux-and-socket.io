import { useState } from "react";
import api from "../services/api";
import { DynamicIcon } from "lucide-react/dynamic";
import { showModal } from "../features/modalSlice";
import { useDispatch } from "react-redux";

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch()

  const addTodo = async () => {
    if (!title.trim()){
      dispatch(showModal({title:'Empty Field', type:'warning', message:'Please fill the field'}))
      return;
    };
    await api.post("/todos/create", { title });
    setTitle("");
  };

  return (
      <div className="flex w-full gap-1 mb-4">
        <input
          type="text"
          id="todo-input"
          className="flex w-[90%] border p-2 rounded"
          placeholder="Add new todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="flex w-[10%] justify-center items-center bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer transition-colors duration-300"
          onClick={addTodo}
        >
          <DynamicIcon name="plus" color="white" size={20} />
        </button>
      </div>
  );
}
