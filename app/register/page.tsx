"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, User, Mail, AtSign, AlertCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { LoadingScreen, Spinner } from "@/components/ui";
import { AuthLayout, authInputCls } from "@/components/AuthLayout";

const iconCls = "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400";

export default function RegisterPage() {
  const { ready, currentUser, register, toast } = useStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && currentUser) router.replace("/dashboard");
  }, [ready, currentUser, router]);

  if (!ready) return <LoadingScreen />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const err = register({ name, email, username, password });
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        toast("Account created. Welcome to ProjectOps!");
        router.replace("/dashboard");
      }
    }, 400);
  };

  return (
    <AuthLayout>
      <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">Get started</p>
      <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-slate-900">Create your account</h1>
      <p className="mt-3 text-sm text-slate-500">Join your team and start shipping work together.</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-800">Full name</span>
          <div className="relative">
            <User className={iconCls} />
            <input className={authInputCls} placeholder="Alex Morgan" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
          </div>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-800">Email</span>
          <div className="relative">
            <Mail className={iconCls} />
            <input type="email" className={authInputCls} placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </div>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-800">Username</span>
          <div className="relative">
            <AtSign className={iconCls} />
            <input className={authInputCls} placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
          </div>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-800">Password</span>
            <div className="relative">
              <Lock className={iconCls} />
              <input type="password" className={authInputCls} placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-800">Confirm</span>
            <div className="relative">
              <Lock className={iconCls} />
              <input type="password" className={authInputCls} placeholder="Repeat password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
            </div>
          </label>
        </div>
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700 animate-fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? <Spinner className="h-5 w-5 text-white" /> : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
