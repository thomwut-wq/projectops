"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, User, AlertCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { LoadingScreen, Spinner } from "@/components/ui";
import { AuthLayout, authInputCls } from "@/components/AuthLayout";

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
    <AuthLayout>
      <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">Welcome back</p>
      <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-slate-900">
        Sign in to your
        <br />
        workspace
      </h1>
      <p className="mt-3 text-sm text-slate-500">Enter your credentials to continue to ProjectOps.</p>

      <form onSubmit={submit} className="mt-7 space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-800">Username</span>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className={authInputCls} placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
          </div>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-800">Password</span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="password" className={authInputCls} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          </div>
        </label>
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700 animate-fade-in">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? <Spinner className="h-5 w-5 text-white" /> : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}
