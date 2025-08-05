import { useState } from "react";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { DynamicIcon } from 'lucide-react/dynamic';


export default function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
          className="border rounded h-10 p-2 focus:outline-blue-400 focus:rounded focus:outline-1 focus:border-0"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex w-full border h-10 rounded p-2 focus-within:border-blue-400 focus-within:rounded focus-within:border-1">
          <input
            type={showPassword ? "text" : "password"}
            id="password-input"
            className="w-11/12 justify-center focus:outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="flex w-1/12 justify-center items-center focus:outline-none" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <DynamicIcon name="eye-off" color="black" size={20} className="cursor-pointer"/> : <DynamicIcon name="eye" color="black" size={20} className="cursor-pointer"/>}
          </button>
        </div>
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 cursor-pointer"
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
