import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../services/api";
import { showModal } from "../features/modalSlice";
import SimpleSpinner from "../components/Spinner";
import AuthShell from "../components/auth/AuthShell";
import AuthInput from "../components/auth/AuthInput";
import {
  ArrowRightIcon,
  MailIcon,
  SparkIcon,
} from "../components/icons/AuthIcons";

const recoverySteps = [
  "Enter the email tied to your account.",
  "We send a one-time passcode to that inbox.",
  "Use the code to create a fresh password securely.",
];

export default function ForgotPass() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ToDos | Password Recovery";
  }, []);

  const handleSend = async () => {
    if (!email.trim()) {
      dispatch(
        showModal({
          title: "Email required",
          message: "Please enter the email connected to your account.",
          type: "warning",
        })
      );
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/sendOTP", { email });

      if (res.data.status === "failed") {
        dispatch(
          showModal({
            title: "User not found",
            message: "Please check your email and try again.",
            type: "warning",
          })
        );
        return;
      }

      dispatch(
        showModal({
          title: "OTP sent",
          message: "Please check your email for the verification code.",
          type: "info",
        })
      );

      localStorage.setItem(
        "optInfo",
        JSON.stringify({ userId: res.data.userId, otpId: res.data.otpId })
      );
      navigate("/setPass");
    } catch {
      dispatch(
        showModal({
          title: "Recovery error",
          message: "We couldn't send the OTP right now. Please try again.",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
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
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
            <SparkIcon className="h-4 w-4" />
            Secure recovery
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              Reset your password without the stress
            </h2>
            <p className="max-w-lg text-sm leading-6 text-slate-600">
              Share the email you signed up with and we&apos;ll guide you
              through a quick, secure reset with a one-time code.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="grid gap-4 rounded-[26px] border border-slate-200/80 bg-[linear-gradient(135deg,rgba(255,251,235,0.95),rgba(255,255,255,0.98))] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
              <MailIcon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">
                Recovery email
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                We&apos;ll send a six-digit OTP to confirm it&apos;s really you.
              </p>
            </div>
          </div>

          <AuthInput
            label="Email address"
            icon={MailIcon}
            type="email"
            id="email-input"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            helperText="Use the same inbox connected to your to-do account."
          />

          <div className="grid gap-3 rounded-2xl bg-slate-950 p-4 text-white sm:grid-cols-3">
            {recoverySteps.map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
                  Step {index + 1}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-100">{step}</p>
              </div>
            ))}
          </div>

          <motion.button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-700"
            disabled={loading}
            onClick={handleSend}
            whileHover={loading ? undefined : { y: -2 }}
            whileTap={loading ? undefined : { scale: 0.99 }}
          >
            {loading ? (
              <>
                <SimpleSpinner
                  size="xs"
                  inline
                  className="text-white flex items-center justify-center"
                />
                Sending OTP
              </>
            ) : (
              <>
                Send recovery code
                <ArrowRightIcon className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </motion.div>

        <motion.div
          className="border-t border-slate-200 pt-6 text-center text-sm text-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.18 }}
        >
          Remembered your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-sky-700 transition hover:text-sky-800"
          >
            Back to login
          </Link>
        </motion.div>
      </div>
    </AuthShell>
  );
}
