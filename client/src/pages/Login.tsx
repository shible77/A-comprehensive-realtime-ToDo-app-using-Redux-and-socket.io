import { useEffect, useState } from "react";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { showModal } from "../features/modalSlice";
import { motion } from "motion/react";
import AuthShell from "../components/auth/AuthShell";
import AuthInput from "../components/auth/AuthInput";
import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  SparkIcon,
} from "../components/icons/AuthIcons";

export default function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const setTitle = () => {
      document.title = "ToDos | Login";
    };
    setTitle();
  }, []);
  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.status !== "success") {
        dispatch(
          showModal({
            title: "Login Failed",
            message: res.data.message || "Incorrect email or password.",
            type: "error",
          })
        );
        return;
      }

      dispatch(setCredentials(res.data));
      navigate("/");
    } catch {
      dispatch(
        showModal({
          title: "Login Error",
          message:
            "An error occurred while trying to log in. Please try again.",
          type: "error",
        })
      );
    }
  };

  return (
    <AuthShell>
      <div className="space-y-8">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
            <SparkIcon className="h-4 w-4" />
            Sign in
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              Welcome back
            </h2>
            <p className="max-w-md text-sm leading-6 text-slate-600">
              Log in to access your tasks, keep up with live updates, and stay
              on top of what matters today.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
        >
          <AuthInput
            label="Email"
            icon={MailIcon}
            type="email"
            id="email-input"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AuthInput
            label="Password"
            icon={LockIcon}
            type={showPassword ? "text" : "password"}
            id="password-input"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            trailing={
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            }
          />

          <div className="flex items-center justify-end">
            <Link
              to="/forgot"
              className="text-sm font-medium text-sky-700 transition hover:text-sky-800"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800"
            onClick={handleLogin}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
          >
            Login
            <ArrowRightIcon className="h-4 w-4" />
          </motion.button>
        </motion.div>

        <motion.div
          className="border-t border-slate-200 pt-6 text-center text-sm text-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.18 }}
        >
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            Create one
          </Link>
        </motion.div>
      </div>
    </AuthShell>
  );
}
