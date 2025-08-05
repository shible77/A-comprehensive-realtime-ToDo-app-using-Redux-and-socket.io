import { useState } from "react";
import api from "../services/api";

import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", {
        email,
        username,
        password,
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 p-4">
      <div className="flex flex-col w-5/6 max-w-full bg-white p-6 rounded-lg shadow-md space-y-3 md:w-1/2 ">
        <h2 className="text-xl font-bold text-center">Register</h2>
        <input
          type="email"
          id="email-input"
          className="border p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          id="username-input"
          className="border p-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          className="bg-green-500 text-white p-2 rounded hover:bg-green-700"
          onClick={handleRegister}
        >
          Register
        </button>
        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
