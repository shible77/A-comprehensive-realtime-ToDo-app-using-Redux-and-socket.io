import { useState } from "react";
import api from "../services/api";
import { DynamicIcon } from "lucide-react/dynamic";
import { showModal } from "../features/modalSlice";
import { useDispatch } from "react-redux";

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();

  const addTodo = async () => {
    if (!title.trim()) {
      dispatch(
        showModal({
          title: "Empty Field",
          type: "warning",
          message: "Please fill the field",
        })
      );
      return;
    }
    await api.post("/todos/create", { title });
    setTitle("");
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] p-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Add a task
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Keep it short, clear, and easy to complete.
          </p>
        </div>
        <div className="hidden rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 sm:block">
          Press Enter
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <input
          type="text"
          id="todo-input"
          className="min-h-13 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-slate-950"
          placeholder="Write the next task you want off your mind..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTodo();
            }
          }}
        />
        <button
          className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 cursor-pointer"
          onClick={addTodo}
        >
          <DynamicIcon name="plus" color="currentColor" size={18} />
          Create
        </button>
      </div>
    </div>
  );
}
