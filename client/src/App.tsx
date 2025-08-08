import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "./app/store";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ForgotPass from "./pages/ForgotPass";
import SetPass from "./pages/SetPass";
import { Routes, Route, Navigate } from "react-router-dom";
import { setCredentials, logout } from "./features/authSlice";
import api from "./services/api";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await api.get("/auth/user");
        dispatch(setCredentials(res.data));
      } catch {
        dispatch(logout());
      }
    };
    if (document.cookie.includes("token")) {
      verifySession();
    }
  }, []);

  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Routes>
      <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPass />} />
      <Route path="/setPass" element={<SetPass />} />
    </Routes>
  );
}

export default App;
