import { useSelector } from "react-redux";
import { type RootState } from "../app/store";
import api from "../services/api";
import { DynamicIcon } from "lucide-react/dynamic";
import { motion, AnimatePresence } from "motion/react";

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.34,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.97,
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 1, 1] as const,
    },
  },
};

export default function TodoList() {
  const todos = useSelector((state: RootState) => state.todos);

  interface Todo {
    id: number;
    title: string;
    completed: boolean;
    userId: number;
  }

  const toggleComplete = async (todo: Todo) => {
    const res = await api.put(`/todos/update/${todo.id}`, {
      completed: !todo.completed,
    });
    if (res.status === 200) {
      // Optionally handle success, e.g., show a notification
    } else {
      // Handle error, e.g., show an error message
    }
  };

  const removeTodo = async (id: number) => {
    const res = await api.delete(`/todos/delete/${id}`);
    if (res.status === 200) {
      // Optionally handle success, e.g., show a notification
    } else {
      // Handle error, e.g., show an error message
    }
  };

  if (todos.length === 0) {
    return (
      <motion.div
        className="rounded-[28px] border border-dashed border-slate-300 bg-[linear-gradient(135deg,#f8fafc_0%,#eff6ff_100%)] px-5 py-10 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <motion.div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <DynamicIcon name="sparkles" color="currentColor" size={24} />
        </motion.div>
        <h3 className="mt-4 font-['Space_Grotesk',sans-serif] text-2xl font-semibold tracking-[-0.03em] text-slate-950">
          Nothing here yet
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
          Add your first task above and this space will turn into a clean,
          live-updating task board.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.ul
      className="space-y-3"
      variants={listVariants}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence>
        {todos.map((todo) => (
          <motion.li
            key={todo.id}
            className="group flex items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-white/95 p-3 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition duration-300"
            layout
            variants={itemVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            transition={{
              layout: {
                duration: 0.26,
                ease: [0.22, 1, 0.36, 1] as const,
              },
            }}
            whileHover={{
              y: -2,
              scale: 1.01,
              transition: {
                duration: 0.2,
              },
              boxShadow: "0px 16px 36px rgba(15, 23, 42, 0.12)",
            }}
          >
            <button
              className="flex min-w-0 flex-1 items-center gap-3 text-left cursor-pointer"
              onClick={() => toggleComplete(todo)}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition duration-300 ${
                  todo.completed
                    ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-400 group-hover:border-slate-300"
                }`}
              >
                <DynamicIcon
                  name={todo.completed ? "check" : "circle"}
                  color="currentColor"
                  size={20}
                />
              </span>

              <span className="min-w-0">
                <span
                  className={`block break-words text-base font-medium transition duration-300 ${
                    todo.completed
                      ? "text-slate-400 line-through"
                      : "text-slate-900"
                  }`}
                >
                  {todo.title}
                </span>
                <span
                  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    todo.completed
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {todo.completed ? "Completed" : "In progress"}
                </span>
              </span>
            </button>

            <button
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 transition duration-300 hover:bg-rose-100 cursor-pointer"
              onClick={() => removeTodo(todo.id)}
            >
              <DynamicIcon
                name="trash"
                color="currentColor"
                size={18}
              />
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
