import { useState } from "react";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      dispatch(setCredentials(res.data));
      navigate("/");

    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 p-4">
      <div className="flex flex-col w-5/6 max-w-full bg-white p-6 rounded-lg shadow-md space-y-3 md:w-1/2 ">
        <h2 className="text-xl font-bold text-center">Login</h2>
        <input
          type="email"
          id="email-input"
          className="border p-2"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password-input"
          className="border p-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          onClick={handleLogin}
        >
          Login
        </button>
        <p className="text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
