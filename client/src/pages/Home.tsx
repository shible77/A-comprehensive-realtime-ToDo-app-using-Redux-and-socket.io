import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../app/store";
import api from "../services/api";
import { setTodos } from "../features/todoSlice";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { logout } from "../features/authSlice";
import { DynamicIcon } from "lucide-react/dynamic";
import { showModal } from "../features/modalSlice";
import { motion } from "motion/react";
import { registerModalAction } from "../utils/modalActionRegistry";

export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const todos = useSelector((state: RootState) => state.todos);

  useEffect(() => {
    const setTitle = () => {
      document.title = "ToDos | Home";
    };
    const fetchTodos = async () => {
      try {
        const res = await api.get("/todos/get");

        dispatch(setTodos(res.data.todos));
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    };
    setTitle();
    fetchTodos();
  }, [dispatch]);

  useEffect(() => {
    registerModalAction("logout", handleLogout); // Register once
  }, []);

  const handleLogout = async () => {
    try {
      const res = await api.post("/auth/logout");
      if (res.data.status === "success") {
        dispatch(setTodos([]));
        dispatch(logout());
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const completedTodos = todos.filter((todo) => todo.completed).length;
  const pendingTodos = todos.length - completedTodos;
  const completionRate =
    todos.length === 0 ? 0 : Math.round((completedTodos / todos.length) * 100);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fff7ed_0%,#fffbeb_22%,#f8fafc_56%,#e0f2fe_100%)] px-4 py-3 sm:px-6 lg:px-8">
      <motion.nav
          className="flex items-center mb-5 justify-between rounded-[28px] border border-white/70 bg-white/78 px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_10px_25px_rgba(15,23,42,0.18)]">
              <DynamicIcon name="list-todo" color="currentColor" size={20} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                Task Manager
              </p>
              <h1 className="font-['Space_Grotesk',sans-serif] text-xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-2xl">
                ToDos
              </h1>
            </div>
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
            onClick={() =>
              dispatch(
                showModal({
                  title: "Log Out",
                  type: "warning",
                  message: "Are you sure to logout?",
                  actionId: "logout",
                })
              )
            }
          >
            <DynamicIcon name="log-out" color="currentColor" size={18} />
            Logout
          </button>
        </motion.nav>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-4%] h-48 w-48 rounded-full bg-orange-300/35 blur-3xl sm:h-72 sm:w-72" />
        <div className="absolute right-[-10%] top-[12%] h-56 w-56 rounded-full bg-sky-300/35 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute bottom-[-10%] left-[20%] h-52 w-52 rounded-full bg-emerald-300/20 blur-3xl sm:h-72 sm:w-72" />
      </div>

      <div className="relative mx-auto rounded-[32px] overflow-hidden flex w-full max-w-7xl flex-col gap-6">
        <motion.section
          className="overflow-hidden rounded-[32px] border border-white/70 bg-slate-950 px-5 py-5 text-white shadow-[0_24px_90px_rgba(15,23,42,0.24)] sm:px-7 sm:py-7"
          initial={{ opacity: 0, y: -36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.28),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.24),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_40%)]" />
          <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-200">
                  <DynamicIcon name="sparkles" color="currentColor" size={16} />
                  Personal command center
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="max-w-2xl font-['Space_Grotesk',sans-serif] text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl">
                  Turn scattered tasks into visible momentum.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Keep your day sharp with a workspace that feels calm, live,
                  and easy to scan at a glance.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                    Total tasks
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-white">
                    {todos.length}
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                    Completed
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-emerald-300">
                    {completedTodos}
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                    Pending
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-amber-300">
                    {pendingTodos}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 self-end">
              <div className="rounded-[28px] border border-white/12 bg-white/10 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                      Welcome back
                    </p>
                    <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold text-white">
                      <DynamicIcon
                        name="circle-user-round"
                        color="currentColor"
                        size={22}
                      />
                      {user.username}
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-3 py-2 text-right">
                    <p className="text-xs text-slate-300">Completion</p>
                    <p className="text-2xl font-semibold text-white">
                      {completionRate}%
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Daily progress</span>
                    <span>{completedTodos} done</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#fb923c_0%,#facc15_45%,#2dd4bf_100%)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
                    />
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-slate-300">
                  {pendingTodos === 0 && todos.length > 0
                    ? "Everything is wrapped up. Add a fresh task when you're ready for the next push."
                    : "Add what matters, clear what is done, and let the list show you what deserves attention next."}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr]"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
        >
          <div className="rounded-[30px] border border-slate-200/70 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <DynamicIcon name="list-todo" color="currentColor" size={22} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Focus notes
                </p>
                <h2 className="mt-1 font-['Space_Grotesk',sans-serif] text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  A cleaner way to pace the day
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-[24px] bg-[linear-gradient(135deg,#fff7ed_0%,#ffedd5_100%)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-700">
                  Next step
                </p>
                <p className="mt-2 text-sm leading-6 text-orange-950">
                  Capture a task the moment it appears so your brain can stop
                  holding onto it.
                </p>
              </div>

              <div className="rounded-[24px] bg-[linear-gradient(135deg,#ecfeff_0%,#e0f2fe_100%)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-sky-700">
                  Rhythm
                </p>
                <p className="mt-2 text-sm leading-6 text-sky-950">
                  Use completed items as momentum markers, not just a list of
                  chores behind you.
                </p>
              </div>

              <div className="rounded-[24px] bg-[linear-gradient(135deg,#f0fdf4_0%,#dcfce7_100%)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">
                  Live sync
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-950">
                  Changes show up in real time, so the workspace stays current
                  without extra refreshes.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Task board
                </p>
                <h2 className="mt-1 font-['Space_Grotesk',sans-serif] text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                  Your Todos
                </h2>
              </div>
              <p className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">
                {pendingTodos} pending
              </p>
            </div>

            <div className="mt-5">
              <TodoForm />
            </div>

            <div className="mt-5">
              <TodoList />
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
