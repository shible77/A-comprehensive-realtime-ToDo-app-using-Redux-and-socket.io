import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../app/store";
import { hideModal } from "../features/modalSlice";
import { motion, AnimatePresence } from "motion/react";
import { runModalAction } from "../utils/modalActionRegistry";
import { DynamicIcon } from "lucide-react/dynamic";

export default function GlobalModal() {
  const { isOpen, title, message, type, actionId } = useSelector(
    (state: RootState) => state.modal
  );
  const dispatch = useDispatch();

  const accentStyles = {
    info: {
      badge: "bg-sky-100 text-sky-700",
      ring: "from-sky-200/80 via-cyan-100/70 to-white",
      button:
        "bg-sky-600 text-white hover:bg-sky-500 shadow-[0_14px_30px_rgba(2,132,199,0.28)]",
      icon: "sparkles",
    },
    warning: {
      badge: "bg-amber-100 text-amber-700",
      ring: "from-amber-200/80 via-orange-100/70 to-white",
      button:
        "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_14px_30px_rgba(245,158,11,0.28)]",
      icon: "triangle-alert",
    },
    error: {
      badge: "bg-rose-100 text-rose-700",
      ring: "from-rose-200/80 via-orange-50/70 to-white",
      button:
        "bg-rose-600 text-white hover:bg-rose-500 shadow-[0_14px_30px_rgba(225,29,72,0.26)]",
      icon: "circle-alert",
    },
  } as const;

  const activeAccent = accentStyles[type];

  const handleConfirm = () => {
    runModalAction(actionId);
    dispatch(hideModal());
  };

  const handleClose = () => dispatch(hideModal());

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/28 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-white/70 bg-white/88 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:p-7"
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className={`absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${activeAccent.ring}`}
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-[22px] ${activeAccent.badge}`}
                  >
                    <DynamicIcon
                      name={activeAccent.icon}
                      color="currentColor"
                      size={24}
                    />
                  </div>
                  <div>
                    <p
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] ${activeAccent.badge}`}
                    >
                      {type}
                    </p>
                    <h2 className="mt-2 font-['Space_Grotesk',sans-serif] text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                      {title}
                    </h2>
                  </div>
                </div>

                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-slate-500 transition duration-300 hover:bg-white hover:text-slate-900"
                  onClick={handleClose}
                >
                  <DynamicIcon name="x" color="currentColor" size={18} />
                </button>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">{message}</p>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition duration-300 hover:border-slate-300 hover:bg-slate-50"
                  onClick={handleClose}
                >
                  {actionId ? "Cancel" : "Close"}
                </button>
                {actionId && (
                  <button
                    className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium transition duration-300 hover:-translate-y-0.5 ${activeAccent.button}`}
                    onClick={handleConfirm}
                  >
                    Confirm
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
