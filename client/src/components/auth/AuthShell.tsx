import type { ReactNode } from "react";
import { motion } from "motion/react";
import AuthShowcase from "./AuthShowcase";

type AuthShellProps = {
  children: ReactNode;
};

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef6ff_52%,#f8fafc_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <AuthShowcase />

        <motion.section
          className="flex items-center justify-center"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
        >
          <div className="w-full max-w-xl rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur xl:p-8">
            {children}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
