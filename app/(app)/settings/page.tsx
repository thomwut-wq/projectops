"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { AVATAR_COLORS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, Button, Card, Field, inputCls } from "@/components/ui";

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200", checked ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700")}
      >
        <span className={cn("block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200", checked ? "translate-x-5" : "translate-x-0")} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { currentUser, data, updateProfile, updatePreferences, toast } = useStore();
  const [name, setName] = useState(currentUser?.name ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [color, setColor] = useState(currentUser?.avatarColor ?? AVATAR_COLORS[0]);
  const prefs = data.preferences;

  if (!currentUser) return null;

  const setPref = (patch: Partial<typeof prefs>) => {
    updatePreferences(patch);
    if (patch.darkMode !== undefined) toast(patch.darkMode ? "Dark mode enabled" : "Dark mode disabled", "info");
    if (patch.emailNotifications !== undefined) toast(patch.emailNotifications ? "Email notifications on" : "Email notifications off", "info");
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, avatarColor: color });
    toast("Settings saved");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500">Manage your profile and preferences.</p>
      </div>
      <form onSubmit={save} className="space-y-6">
        <Card className="p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">Profile</h2>
          <div className="mb-5 flex items-center gap-4">
            <Avatar name={name || "?"} color={color} size="lg" />
            <div className="flex gap-2">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn("flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110", c, color === c && "ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-slate-900")}
                  aria-label={c}
                >
                  {color === c && <Check className="h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            <Field label="Email">
              <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Field>
          </div>
        </Card>
        <Card className="px-6 py-3">
          <h2 className="mb-1 mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">Preferences</h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <Toggle checked={prefs.darkMode} onChange={(v) => setPref({ darkMode: v })} label="Dark mode" description="Use a darker color palette across the app." />
            <Toggle checked={prefs.emailNotifications} onChange={(v) => setPref({ emailNotifications: v })} label="Email notifications" description="Receive updates about task activity by email." />
          </div>
        </Card>
        <div className="flex justify-end">
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </div>
  );
}
