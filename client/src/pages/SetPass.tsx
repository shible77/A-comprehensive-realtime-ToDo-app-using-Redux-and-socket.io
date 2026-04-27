import { useState, useEffect } from "react";
import { motion } from "motion/react";
import OTPInput from "../components/OTPInput";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { showModal } from "../features/modalSlice";
import AuthShell from "../components/auth/AuthShell";
import AuthInput from "../components/auth/AuthInput";
import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  SparkIcon,
} from "../components/icons/AuthIcons";

const passwordTips = [
  "Enter the six-digit code from your inbox.",
  "Choose a password you have not used here before.",
  "Save it somewhere safe so you can sign in quickly next time.",
];

function SetPass() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  interface LocalStorageObject {
    otpId: number;
    userId: number;
  }
  const [localObject, setLocalObject] = useState<LocalStorageObject>();

  useEffect(() => {
    document.title = "ToDos | Set Password";

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
    if (isSaving) {
      return;
    }

    if (otp.length !== 6) {
      dispatch(
        showModal({
          title: "OTP required",
          message: "Please enter the full six-digit code from your email.",
          type: "warning",
        })
      );
      return;
    }

    if (!password.trim()) {
      dispatch(
        showModal({
          title: "Password required",
          message: "Please choose a new password before continuing.",
          type: "warning",
        })
      );
      return;
    }

    if (!localObject) {
      dispatch(
        showModal({
          title: "Session expired",
          message: "Please request a new recovery code and try again.",
          type: "warning",
        })
      );
      navigate("/forgot");
      return;
    }

    try {
      setIsSaving(true);
      const res = await api.post("/auth/changePass", {
        token: otp,
        password,
        userId: localObject.userId,
        otpId: localObject.otpId,
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
        localStorage.removeItem("optInfo");
        navigate("/login");
      }
    } catch {
      dispatch(
        showModal({
          title: "Update failed",
          message:
            "We couldn't update your password right now. Please try again.",
          type: "error",
        })
      );
    } finally {
      setIsSaving(false);
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
            Final recovery step
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              Create your new password
            </h2>
            <p className="max-w-lg text-sm leading-6 text-slate-600">
              Enter the one-time passcode from your email, then choose a fresh
              password to secure your workspace again.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="grid gap-5 rounded-[26px] border border-slate-200/80 bg-[linear-gradient(145deg,rgba(239,246,255,0.88),rgba(255,255,255,0.98))] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
              <LockIcon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">
                Verify and reset
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                Your recovery code confirms it&apos;s you before the password is
                changed.
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                One-time passcode
              </h3>
              <p className="text-sm text-slate-500">
                Paste the full code or type each digit manually.
              </p>
            </div>
            <OTPInput length={6} onChangeOTP={setOtp} />
          </div>

          <AuthInput
            label="New password"
            icon={LockIcon}
            type={showPassword ? "text" : "password"}
            id="password-input"
            name="password"
            autoComplete="new-password"
            placeholder="Create a secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Pick something memorable to you and difficult for someone else to guess."
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

          <div className="grid gap-3 rounded-2xl bg-slate-950 p-4 text-white sm:grid-cols-3">
            {passwordTips.map((tip, index) => (
              <div
                key={tip}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                  Tip {index + 1}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-100">{tip}</p>
              </div>
            ))}
          </div>

          <motion.button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-700"
            whileHover={isSaving ? undefined : { y: -2 }}
            whileTap={isSaving ? undefined : { scale: 0.99 }}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving new password..." : "Save new password"}
            <ArrowRightIcon className="h-4 w-4" />
          </motion.button>
        </motion.div>

        <motion.div
          className="border-t border-slate-200 pt-6 text-center text-sm text-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.18 }}
        >
          Need another code?{" "}
          <Link
            to="/forgot"
            className="font-semibold text-sky-700 transition hover:text-sky-800"
          >
            Start recovery again
          </Link>
        </motion.div>
      </div>
    </AuthShell>
  );
}

export default SetPass;
