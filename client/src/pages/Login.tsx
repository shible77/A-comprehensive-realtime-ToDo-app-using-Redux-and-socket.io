import { useState } from "react";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice";

export default function Login({ onSwitch }: { onSwitch: () => void }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      dispatch(setCredentials(res.data));
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-72 mx-auto mt-20">
      <h2 className="text-xl font-bold text-center">Login</h2>
      <input
        className="border p-2"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border p-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2 rounded" onClick={handleLogin}>Login</button>
      <button className="text-sm underline" onClick={onSwitch}>Don't have an account? Register</button>
    </div>
  );
}
