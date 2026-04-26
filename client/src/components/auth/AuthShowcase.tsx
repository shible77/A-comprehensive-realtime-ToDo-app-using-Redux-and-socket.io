import { motion } from "motion/react";
import { SparkIcon } from "../icons/AuthIcons";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const highlights = [
  "Cleanly manage tasks and priorities",
  "Stay synced with live updates",
  "Focus on work without UI clutter",
];

export default function AuthShowcase() {
  return (
    <motion.section
      className="relative hidden overflow-hidden rounded-[28px] bg-slate-950 p-8 text-white lg:flex lg:min-h-[620px] lg:flex-col lg:justify-between"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(14,165,233,0.18),transparent_42%,rgba(16,185,129,0.18))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_30%),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:auto,32px_32px,32px_32px]" />

      <motion.div
        className="relative z-10 space-y-5"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100 backdrop-blur"
        >
          <SparkIcon className="h-4 w-4 text-emerald-300" />
          Productive by design
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-3">
          <h1 className="max-w-md text-4xl font-semibold tracking-tight text-white">
            Welcome back to a calmer way to manage tasks.
          </h1>
          <p className="max-w-md text-sm leading-6 text-slate-300">
            Sign in to continue with your real-time to-do workspace and pick up
            right where you left off.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-10 space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {highlights.map((highlight) => (
          <motion.div
            key={highlight}
            variants={itemVariants}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-emerald-300">
              <SparkIcon className="h-5 w-5" />
            </span>
            <p className="text-sm text-slate-100">{highlight}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
