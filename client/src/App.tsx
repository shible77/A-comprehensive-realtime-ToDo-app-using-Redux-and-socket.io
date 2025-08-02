import { useEffect, useState } from "react";
import { socket } from "./services/socket";
import { useDispatch, useSelector} from "react-redux";
import { addTodo, updateTodo, deleteTodo } from "./features/todoSlice";
import { type RootState } from "./app/store";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
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
  }, []);

  const token = useSelector((state: RootState) => state.auth.token);
  const [showRegister, setShowRegister] = useState(false);

  if (!token) {
    return showRegister
      ? <Register onSwitch={() => setShowRegister(false)} />
      : <Login onSwitch={() => setShowRegister(true)} />;
  }

  return (
    <Home />
  );
}

export default App;
