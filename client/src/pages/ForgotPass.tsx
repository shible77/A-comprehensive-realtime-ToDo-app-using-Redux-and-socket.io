import { useState } from "react";
import { motion } from "motion/react";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { showModal } from "../features/modalSlice";
import { useNavigate } from "react-router-dom";
import SimpleSpinner from '../components/Spinner'

function ForgotPass() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    try {
      setLoading(true)
      const res = await api.post("/auth/sendOTP", { email });
      if (res.data.status === "failed") {
        dispatch(
          showModal({
            title: "User not found",
            message: "Please check your email and try again",
            type: "warning",
          })
        );
        setLoading(false)
      } else {
        dispatch(
          showModal({
            title: "OTP sent",
            message: "Please check your email for OTP",
            type: "info",
          })
        );
        setLoading(false)
        localStorage.setItem("optInfo", JSON.stringify({userId : res.data.userId, otpId : res.data.otpId}) )
        navigate("/setPass");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 p-4 overflow-hidden">
      <motion.div
        className="flex flex-col w-5/6 max-w-full shadow-md space-y-3 rounded-lg p-4 bg-white/30 backdrop-blur-lg md:w-1/2"
        initial={{ x: "200vw" }}
        animate={{ x: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
      >
        <motion.h1
          className="text-center font-bold text-3xl mb-5"
          whileHover={{
            textShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          Password Recovery
        </motion.h1>
        <input
          type="email"
          id="email-input"
          className="border rounded h-10 p-2 focus:outline-blue-400 focus:rounded focus:outline-1 focus:border-0"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex flex-row text-sm">
          <h5 className="text-red-500">*</h5>Note : An OTP will send to the email.
        </div>
        <motion.button
          className="rounded h-10 bg-blue-500 hover:bg-blue-700 cursor-pointer"
          disabled={loading}
          whileHover={{
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
          }}
          onClick={handleSend}
        >
         {loading ? <SimpleSpinner /> : 'Send'}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default ForgotPass;
