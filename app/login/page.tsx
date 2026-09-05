"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layers, Lock, User, AlertCircle, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { LoadingScreen, Spinner } from "@/components/ui";

export default function LoginPage() {
  const { ready, currentUser, login } = useStore();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && currentUser) router.replace("/dashboard");
  }, [ready, currentUser, router]);

  if (!ready) return <LoadingScreen />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (login(username.trim(), password)) router.replace("/dashboard");
      else {
        setError("Invalid username or password");
        setLoading(false);
      }
    }, 400);
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200/80 bg-white/70 py-3 pl-11 pr-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:focus:bg-slate-800";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.4),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.3),_transparent_40%),radial-gradient(circle_at_center,_rgba(15,23,42,1),_rgba(2,6,23,1))]" />
      <div className="pointer-events-none absolute left-[8%] top-[12%] h-56 w-56 rounded-full border border-indigo-400/10 animate-float" />
      <div className="pointer-events-none absolute bottom-[6%] right-[6%] h-80 w-80 rounded-full border border-violet-400/10 animate-float-slow" />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative w-full max-w-md animate-login-in">
        <div className="rounded-3xl border border-white/20 bg-white/85 p-8 shadow-2xl shadow-indigo-950/40 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70 sm:p-10">
          <div className="flex flex-col items-center text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/40 transition-transform duration-300 hover:scale-105 hover:rotate-3">
              <Layers className="h-7 w-7" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Welcome back</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Sign in to ProjectOps</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Enter your credentials to continue to your workspace.</p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Username</span>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                <input
                  className={inputCls}
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  className={inputCls}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </label>
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 animate-fade-in dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/40 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <Spinner className="h-4 w-4 text-white" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-slate-200/70 bg-slate-50/80 p-4 text-xs text-slate-500 dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-400">
            Demo access: <span className="font-bold text-slate-700 dark:text-slate-200">admin / admin123</span> or{" "}
            <span className="font-bold text-slate-700 dark:text-slate-200">user / user123</span>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">© {new Date().getFullYear()} ProjectOps. Built for focused teams.</p>
      </div>
    </div>
  );
}
