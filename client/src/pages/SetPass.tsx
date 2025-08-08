import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { DynamicIcon } from "lucide-react/dynamic";
import OTPInput from "../components/OTPInput";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { showModal } from "../features/modalSlice";

function SetPass() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  interface LocalStorageObject {
    otpId: number;
    userId: number;
  }
  const [localObject, setLocalObject] = useState<LocalStorageObject>();

  useEffect(() => {
    const getLocal = () => {
      const storedData: LocalStorageObject = localStorage.getItem("optInfo")
        ? JSON.parse(localStorage.getItem("optInfo")!)
        : null;
      if (storedData) {
        setLocalObject(storedData);
      }
    };
    getLocal();
  }, []);

  const handleSave = async () => {
    try {
      const res = await api.post("/auth/changePass", {
        token: otp,
        password,
        userId: localObject!.userId,
        otpId: localObject!.otpId,
      });
      if (res.data.status === "failed") {
        dispatch(
          showModal({
            title: "Error",
            message: res.data.message,
            type: "error",
          })
        );
      } else {
        dispatch(
          showModal({
            title: "Success",
            message: "Password changed successfully",
            type: "info",
          })
        );
        localStorage.removeItem("otpInfo");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 bg-gray-200 overflow-hidden">
      <motion.div
        className="flex flex-col space-y-3 bg-white/30 p-5 backdrop-blur-lg rounded-lg shadow-md w-5/6 max-w-full md:w-1/2"
        initial={{ x: "200vw" }}
        animate={{ x: 0 }}
        transition={{
          delay: 0.4,
          type: "spring",
          stiffness: 120,
        }}
      >
        <h1 className="text-3xl font-bold text-center  text-gray-500 mb-5">
          Set Password
        </h1>
        <div className="w-full flex flex-col space-y-4 justify-center mt-5 mb-8">
          <h2 className="text-2xl font-bold text-gray-400 text-center">
            Provide the OTP:
          </h2>
          <OTPInput length={6} onChangeOTP={setOtp} />
        </div>

        <h2 className="text-md font-bold text-gray-400">Set a new password:</h2>
        <div className="flex w-full border h-10 rounded p-2 focus-within:border-blue-400 focus-within:rounded focus-within:border-1">
          <input
            type={showPassword ? "text" : "password"}
            id="password-input"
            className="w-11/12 justify-center focus:outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="flex w-1/12 justify-center items-center focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <DynamicIcon
                name="eye-off"
                color="black"
                size={20}
                className="cursor-pointer"
              />
            ) : (
              <DynamicIcon
                name="eye"
                color="black"
                size={20}
                className="cursor-pointer"
              />
            )}
          </button>
        </div>
        <motion.button
          className="h-10 w-full bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600 transition-colors duration-300 mt-5"
          whileHover={{
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
          }}
          onClick={handleSave}
        >
          Save
        </motion.button>
      </motion.div>
    </div>
  );
}

export default SetPass;
