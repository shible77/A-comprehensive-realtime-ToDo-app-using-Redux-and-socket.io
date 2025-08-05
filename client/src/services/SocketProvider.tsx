import { useEffect } from "react";
import { socket } from "../services/socket";
import { useDispatch } from "react-redux";
import { addTodo, updateTodo, deleteTodo } from "../features/todoSlice";

interface Props {
  children: React.ReactNode;
}

export default function SocketProvider({ children }: Props) {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("todo:created", (todo) => dispatch(addTodo(todo)));
    socket.on("todo:updated", (todo) => dispatch(updateTodo(todo)));
    socket.on("todo:deleted", (todo) => dispatch(deleteTodo(todo)));

   
    return () => {
      socket.off("todo:created");
      socket.off("todo:updated");
      socket.off("todo:deleted");
    };
  }, [dispatch]);

  return <>{children}</>;
}
