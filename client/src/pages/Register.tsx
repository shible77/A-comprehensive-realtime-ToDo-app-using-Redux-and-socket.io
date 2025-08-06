import { useState, useEffect } from "react";
import api from "../services/api";
import { DynamicIcon } from "lucide-react/dynamic";
import { useNavigate, Link } from "react-router-dom";
import { showModal } from "../features/modalSlice";
import { useDispatch } from "react-redux";


export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
      const setTitle = () => {
        document.title = "ToDos | Register";
      }
      setTitle();
    },[])


  const handleRegister = async () => {
    try {
      const res = await api.post("/auth/register", {
        email,
        username,
        password,
      });
      if(res.status === 204) {
        dispatch(showModal({
          title: "Registration Failed",
          message: "User already exists.",
          type: "error",
        }));
      }
      else{
        navigate("/login");
      }
    } catch{
      dispatch(
        showModal({
          title: "Registration Error",
          message: "An error occurred while trying to register. Please try again.",
          type: "error",
        })
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 p-4">
      <div className="flex flex-col w-5/6 max-w-full bg-white p-6 rounded-lg shadow-md space-y-3 md:w-1/2 ">
        <h2 className="text-xl font-bold text-center">Register</h2>
        <input
          type="email"
          id="email-input"
          className="border rounded h-10 p-2 focus:outline-blue-400 focus:rounded focus:outline-1 focus:border-0"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          id="username-input"
          className="border rounded h-10 p-2 focus:outline-blue-400 focus:rounded focus:outline-1 focus:border-0"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          className="bg-green-500 text-white p-2 rounded hover:bg-green-700 cursor-pointer transition-colors duration-300"
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
