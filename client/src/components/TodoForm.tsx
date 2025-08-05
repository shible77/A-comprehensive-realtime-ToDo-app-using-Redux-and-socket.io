import { useState } from "react";
import api from "../services/api";

export default function TodoForm() {
  const [title, setTitle] = useState("");

  const addTodo = async () => {
    if (!title.trim()) return;
    await api.post("/todos/create", { title });
    setTitle("");
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        id="todo-input"
        className="border p-2 flex-1"
        placeholder="Add new todo..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-4 rounded" onClick={addTodo}>Add</button>
    </div>
  );
}
