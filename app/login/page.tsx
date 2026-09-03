"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layers, Lock, User, AlertCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button, LoadingScreen, Spinner } from "@/components/ui";

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

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-slate-50 to-violet-100 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-300/30 blur-3xl" />
      <div className="w-full max-w-sm rounded-2xl border border-white/60 bg-white/60 p-8 shadow-xl shadow-indigo-500/10 backdrop-blur-xl animate-slide-up dark:border-slate-700/60 dark:bg-slate-900/60">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
            <Layers className="h-6 w-6" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">ProjectOps</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sign in to your workspace</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-lg border border-slate-200 bg-white/80 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              className="w-full rounded-lg border border-slate-200 bg-white/80 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}
          <Button type="submit" className="w-full py-2.5" disabled={loading}>
            {loading ? <Spinner className="h-4 w-4 text-white" /> : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
