import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { showModal } from "../features/modalSlice";
import { useDispatch } from "react-redux";
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
  UserIcon,
} from "../components/icons/AuthIcons";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "ToDos | Register";
  }, []);

  const handleRegister = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post("/auth/register", {
        email,
        username,
        password,
      });

      if (res.data.message === "User already exists") {
        dispatch(
          showModal({
            title: "Registration Failed",
            message: "User already exists.",
            type: "error",
          })
        );
        return;
      }

      navigate("/login");
    } catch {
      dispatch(
        showModal({
          title: "Registration Error",
          message:
            "An error occurred while trying to register. Please try again.",
          type: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
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
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <SparkIcon className="h-4 w-4" />
            Create account
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              Start your workspace
            </h2>
            <p className="max-w-md text-sm leading-6 text-slate-600">
              Set up your account to organize tasks, stay synced in real time,
              and keep your day moving with less friction.
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
            label="Username"
            icon={UserIcon}
            type="text"
            id="username-input"
            name="username"
            autoComplete="username"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <AuthInput
            label="Password"
            icon={LockIcon}
            type={showPassword ? "text" : "password"}
            id="password-input"
            name="password"
            autoComplete="new-password"
            placeholder="Create a secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Use something memorable to you and hard to guess for everyone else."
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

          <motion.button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
            onClick={handleRegister}
            disabled={isSubmitting}
            whileHover={isSubmitting ? undefined : { y: -2 }}
            whileTap={isSubmitting ? undefined : { scale: 0.99 }}
          >
            {isSubmitting ? "Creating account..." : "Register"}
            <ArrowRightIcon className="h-4 w-4" />
          </motion.button>
        </motion.div>

        <motion.div
          className="border-t border-slate-200 pt-6 text-center text-sm text-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.18 }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-sky-700 transition hover:text-sky-800"
          >
            Log in
          </Link>
        </motion.div>
      </div>
    </AuthShell>
  );
}
