import { useSelector } from "react-redux";
import { type RootState } from "../app/store";
import api from "../services/api";
import { DynamicIcon } from "lucide-react/dynamic";
import { motion, AnimatePresence } from "motion/react";

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

  return (
    <ul className="space-y-2">
      <AnimatePresence>
        {todos.map((todo) => (
          <motion.li
            key={todo.id}
            className="flex justify-between items-center border p-2 rounded"
            initial={{x:'200vw'}}
            animate={{x:0}}
            exit={{x:'-200vw'}}
            transition={{
              delay:0.7,
              type:'spring',
              stiffness:120,
            }}
            whileHover={{
              x: [0,10],
              transition: {
                duration: 0.2,
              },
              boxShadow : "0px 10px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div
              className={`cursor-pointer ${
                todo.completed ? "line-through text-gray-400" : ""
              }`}
              onClick={() => toggleComplete(todo)}
            >
              {todo.title}
            </div>
            <button
              className="text-red-500"
              onClick={() => removeTodo(todo.id)}
            >
              <DynamicIcon
                name="trash"
                color="red"
                size={20}
                className="cursor-pointer"
              />
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
