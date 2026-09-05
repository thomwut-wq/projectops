"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Lock, User, AlertCircle } from "lucide-react";
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
    "w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-[15px] text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/15";

  return (
    <div className="min-h-screen bg-white animate-page-in lg:grid lg:grid-cols-[55%_45%]">
      <aside className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 px-10 py-12 text-white sm:px-16 lg:min-h-screen lg:px-20 lg:py-16">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl animate-float" />

        <div className="relative flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md transition-transform duration-300 hover:scale-105 hover:rotate-3">
            <Briefcase className="h-8 w-8" />
          </span>
          <span className="text-2xl font-extrabold tracking-tight">ProjectOps</span>
        </div>

        <div className="relative my-16 max-w-xl lg:my-0">
          <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold backdrop-blur-md">Built for focused teams</span>
          <h2 className="mt-8 text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">
            Turn ambitious ideas into work that ships.
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-indigo-100">
            Plan projects, move work forward, and keep your entire team aligned from one calm workspace.
          </p>
        </div>

        <div className="relative flex items-center gap-6">
          <div className="flex -space-x-3">
            {["AM", "JL", "TK"].map((i) => (
              <span
                key={i}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-600 bg-white text-xs font-bold text-indigo-700"
              >
                {i}
              </span>
            ))}
          </div>
          <p className="text-base text-indigo-50">Trusted by high-performing teams</p>
        </div>
      </aside>

      <main className="flex items-center justify-center px-6 py-14 sm:px-12 lg:px-16">
        <div className="w-full max-w-[560px]">
          <p className="text-base font-bold uppercase tracking-wide text-indigo-600">Welcome back</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-slate-900">
            Sign in to your
            <br />
            workspace
          </h1>
          <p className="mt-5 text-lg text-slate-500">Enter your credentials to continue to ProjectOps.</p>

          <form onSubmit={submit} className="mt-10 space-y-6">
            <label className="block">
              <span className="mb-2.5 block text-base font-semibold text-slate-800">Username</span>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
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
              <span className="mb-2.5 block text-base font-semibold text-slate-800">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
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
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 animate-fade-in">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? <Spinner className="h-5 w-5 text-white" /> : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
