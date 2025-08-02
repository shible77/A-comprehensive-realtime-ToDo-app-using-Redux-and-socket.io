import { useState } from "react";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice";

export default function Register({ onSwitch }: { onSwitch: () => void }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await api.post("/auth/register", { email, username, password });
      console.log(res.data)
      dispatch(setCredentials(res.data));
    } catch( error) {
      console.error("Registration failed:", error);
      alert("Registration failed");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-72 mx-auto mt-20">
      <h2 className="text-xl font-bold text-center">Register</h2>
      <input
        className="border p-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        className="border p-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-green-500 text-white p-2 rounded" onClick={handleRegister}>Register</button>
      <button className="text-sm underline" onClick={onSwitch}>Already have an account? Login</button>
    </div>
  );
}
