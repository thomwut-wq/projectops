"use client";

import { FolderKanban, ListTodo, CheckCircle2, Users, Activity } from "lucide-react";
import { useStore } from "@/lib/store";
import { STATUSES, STATUS_LABELS } from "@/lib/types";
import { cn, timeAgo } from "@/lib/utils";
import { Avatar, Card, EmptyState } from "@/components/ui";

export default function DashboardPage() {
  const { data } = useStore();
  const active = data.tasks.filter((t) => t.status !== "done").length;
  const done = data.tasks.filter((t) => t.status === "done").length;
  const stats = [
    { label: "Total Projects", value: data.projects.length, icon: FolderKanban, border: "border-l-indigo-500", color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30" },
    { label: "Active Tasks", value: active, icon: ListTodo, border: "border-l-amber-500", color: "text-amber-500 bg-amber-50 dark:bg-amber-900/30" },
    { label: "Completed Tasks", value: done, icon: CheckCircle2, border: "border-l-emerald-500", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30" },
    { label: "Team Members", value: data.members.length, icon: Users, border: "border-l-sky-500", color: "text-sky-500 bg-sky-50 dark:bg-sky-900/30" },
  ];
  const counts = STATUSES.map((s) => ({ s, n: data.tasks.filter((t) => t.status === s).length }));
  const max = Math.max(1, ...counts.map((c) => c.n));
  const barColor = { backlog: "bg-slate-400", "in-progress": "bg-indigo-500", review: "bg-amber-500", done: "bg-emerald-500" };
  const recent = data.activity.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Overview</h1>
        <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening across your workspace.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} hover className={cn("flex items-center gap-4 border-l-4 p-5", s.border)}>
            <div className={cn("rounded-xl p-3", s.color)}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <h2 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">Tasks by status</h2>
          <div className="flex h-48 items-end gap-4">
            {counts.map((c) => (
              <div key={c.s} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{c.n}</span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={cn("w-full rounded-t-lg transition-all duration-700", barColor[c.s])}
                    style={{ height: `${(c.n / max) * 100}%`, minHeight: c.n ? 8 : 2 }}
                  />
                </div>
                <span className="text-xs text-slate-500">{STATUS_LABELS[c.s]}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">Recent activity</h2>
          {recent.length === 0 ? (
            <EmptyState icon={Activity} title="No activity yet" />
          ) : (
            <ul className="space-y-3">
              {recent.map((a) => {
                const u = data.users.find((x) => x.id === a.userId);
                return (
                  <li key={a.id} className="flex items-start gap-3">
                    <Avatar name={u?.name ?? "?"} color={u?.avatarColor ?? "bg-slate-400"} size="sm" className="mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-700 dark:text-slate-200">
                        <span className="font-medium">{u?.name ?? "Someone"}</span> {a.text}
                      </p>
                      <p className="text-xs text-slate-400">{timeAgo(a.timestamp)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
