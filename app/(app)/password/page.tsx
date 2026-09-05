"use client";

import { useState } from "react";
import { KeyRound, ShieldCheck, Eye, EyeOff, Lock } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Avatar, Badge, Button, Card, Field, inputCls } from "@/components/ui";

const MIN_LENGTH = 6;

function PasswordInput({ value, onChange, placeholder, autoComplete }: { value: string; onChange: (v: string) => void; placeholder?: string; autoComplete?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type={show ? "text" : "password"}
        className={cn(inputCls, "pl-9 pr-10")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function validate(newPassword: string, confirm: string): string | null {
  if (newPassword.length < MIN_LENGTH) return `New password must be at least ${MIN_LENGTH} characters`;
  if (newPassword !== confirm) return "Passwords do not match";
  return null;
}

function Strength({ value }: { value: string }) {
  const score = [value.length >= MIN_LENGTH, value.length >= 10, /[A-Z]/.test(value) && /[a-z]/.test(value), /\d/.test(value) || /[^A-Za-z0-9]/.test(value)].filter(Boolean).length;
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-slate-200", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"];
  if (!value) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors duration-300", i <= score ? colors[score] : "bg-slate-200 dark:bg-slate-700")} />
        ))}
      </div>
      <p className="mt-1 text-xs text-slate-500">{labels[score]}</p>
    </div>
  );
}

export default function PasswordPage() {
  const { currentUser, isAdmin, data, changePassword, resetUserPassword, toast } = useStore();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const [targetId, setTargetId] = useState("");
  const [resetPw, setResetPw] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetError, setResetError] = useState("");

  if (!currentUser) return null;
  const others = data.users.filter((u) => u.id !== currentUser.id);

  const submitOwn = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(next, confirm);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    if (changePassword(current, next)) {
      setCurrent("");
      setNext("");
      setConfirm("");
    }
  };

  const submitReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      toast("Permission denied: only admins can reset other users' passwords", "error");
      return;
    }
    if (!targetId) {
      setResetError("Select a user to reset");
      return;
    }
    const err = validate(resetPw, resetConfirm);
    if (err) {
      setResetError(err);
      return;
    }
    setResetError("");
    if (resetUserPassword(targetId, resetPw)) {
      setTargetId("");
      setResetPw("");
      setResetConfirm("");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Change Password</h1>
        <p className="text-sm text-slate-500">Update your password to keep your account secure.</p>
      </div>

      <Card className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Your password</h2>
            <p className="text-xs text-slate-500">
              Signed in as <span className="font-medium text-slate-700 dark:text-slate-200">{currentUser.username}</span>
            </p>
          </div>
        </div>
        <form onSubmit={submitOwn} className="space-y-4">
          <Field label="Current password">
            <PasswordInput value={current} onChange={setCurrent} placeholder="Enter current password" autoComplete="current-password" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="New password">
              <PasswordInput value={next} onChange={setNext} placeholder={`At least ${MIN_LENGTH} characters`} autoComplete="new-password" />
              <Strength value={next} />
            </Field>
            <Field label="Confirm new password">
              <PasswordInput value={confirm} onChange={setConfirm} placeholder="Repeat new password" autoComplete="new-password" />
              {confirm && next !== confirm && <p className="mt-2 text-xs text-red-500">Passwords do not match</p>}
            </Field>
          </div>
          {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">{error}</p>}
          <div className="flex justify-end">
            <Button type="submit">Update password</Button>
          </div>
        </form>
      </Card>

      {isAdmin && (
        <Card className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-950 dark:text-amber-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Reset a user&apos;s password</h2>
              <p className="text-xs text-slate-500">Admin only. The user will sign in with the new password immediately.</p>
            </div>
            <Badge className="ml-auto bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">Admin</Badge>
          </div>
          <form onSubmit={submitReset} className="space-y-4">
            <Field label="User">
              <select className={inputCls} value={targetId} onChange={(e) => setTargetId(e.target.value)} required>
                <option value="">Select a user…</option>
                {others.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} (@{u.username}) — {u.role}
                  </option>
                ))}
              </select>
            </Field>
            {targetId && (
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                {(() => {
                  const u = others.find((x) => x.id === targetId)!;
                  return (
                    <>
                      <Avatar name={u.name} color={u.avatarColor} size="sm" />
                      <div className="text-xs">
                        <p className="font-medium text-slate-800 dark:text-slate-100">{u.name}</p>
                        <p className="text-slate-500">{u.email}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="New password">
                <PasswordInput value={resetPw} onChange={setResetPw} placeholder={`At least ${MIN_LENGTH} characters`} autoComplete="new-password" />
              </Field>
              <Field label="Confirm new password">
                <PasswordInput value={resetConfirm} onChange={setResetConfirm} placeholder="Repeat new password" autoComplete="new-password" />
              </Field>
            </div>
            {resetError && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">{resetError}</p>}
            <div className="flex justify-end">
              <Button type="submit" variant="secondary">
                Reset password
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
