"use client";

import Link from "next/link";
import { FolderKanban, Clock3, CheckCircle2, Users, Activity, BarChart3, TrendingUp, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { STATUSES, STATUS_LABELS, PROJECT_STATUS_LABELS, PROJECT_STATUS_STYLES } from "@/lib/types";
import { cn, timeAgo } from "@/lib/utils";
import { Avatar, Badge, Card, EmptyState, ProgressBar } from "@/components/ui";

export default function DashboardPage() {
  const { data, currentUser, visibleProjects } = useStore();
  const active = data.tasks.filter((t) => t.status !== "done").length;
  const done = data.tasks.filter((t) => t.status === "done").length;
  const completion = data.tasks.length ? Math.round((done / data.tasks.length) * 100) : 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = currentUser?.name.split(" ")[0] ?? "there";

  const stats = [
    { label: "Total Projects", value: data.projects.length, icon: FolderKanban, border: "border-l-indigo-500", color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300", hint: `${data.projects.filter((p) => p.status === "active").length} active` },
    { label: "Active Tasks", value: active, icon: Clock3, border: "border-l-blue-500", color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", hint: `${data.tasks.filter((t) => t.status === "in-progress").length} in progress` },
    { label: "Completed Tasks", value: done, icon: CheckCircle2, border: "border-l-emerald-500", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300", hint: `${completion}% completion rate` },
    { label: "Team Members", value: data.members.length, icon: Users, border: "border-l-violet-500", color: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300", hint: `${data.members.filter((m) => m.presence === "online").length} online now` },
  ];
  const counts = STATUSES.map((s) => ({ s, n: data.tasks.filter((t) => t.status === s).length }));
  const max = Math.max(1, ...counts.map((c) => c.n));
  const barColor = { backlog: "bg-slate-400", "in-progress": "bg-blue-500", review: "bg-amber-500", done: "bg-emerald-500" };
  const recent = data.activity.slice(0, 5);
  const topProjects = visibleProjects.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {greeting}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Here&apos;s what&apos;s happening across your projects today.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          <TrendingUp className="h-3.5 w-3.5" /> {completion}% of all tasks completed
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{ animationDelay: `${i * 70}ms` }}
            className={cn(
              "group rounded-2xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-stagger-in dark:border-y-slate-800 dark:border-r-slate-800 dark:bg-slate-900",
              s.border,
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">{s.label}</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">{s.value}</p>
              </div>
              <div className={cn("rounded-xl p-3 transition-transform duration-300 group-hover:scale-110", s.color)}>
                <s.icon className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Tasks by status</h2>
              <p className="mt-1 text-xs text-slate-500">Current distribution across your workspace</p>
            </div>
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-8 flex h-60 items-end justify-around gap-4 border-b border-slate-200 px-2 dark:border-slate-700">
            {counts.map((c, i) => (
              <div key={c.s} className="flex h-full flex-1 flex-col items-center justify-end">
                <span className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-100">{c.n}</span>
                <div
                  className={cn("w-full max-w-16 rounded-t-lg transition-all duration-700 animate-grow-bar", barColor[c.s])}
                  style={{ height: `${Math.max((c.n / max) * 75, 6)}%`, animationDelay: `${i * 100}ms` }}
                />
                <span className="mt-3 min-h-9 text-center text-[11px] font-semibold text-slate-500">{STATUS_LABELS[c.s]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Recent activity</h2>
              <p className="mt-1 text-xs text-slate-500">Latest updates from your team</p>
            </div>
            <Activity className="h-5 w-5 text-slate-400" />
          </div>
          {recent.length === 0 ? (
            <div className="mt-6">
              <EmptyState icon={Activity} title="No activity yet" />
            </div>
          ) : (
            <ul className="mt-6 space-y-5">
              {recent.map((a, i) => {
                const u = data.users.find((x) => x.id === a.userId);
                return (
                  <li key={a.id} className="flex gap-3">
                    <div className="relative">
                      <Avatar name={u?.name ?? "?"} color={u?.avatarColor ?? "bg-slate-400"} size="sm" className="mt-0.5" />
                      {i < recent.length - 1 && <span className="absolute left-1/2 top-8 h-7 w-px -translate-x-1/2 bg-slate-200 dark:bg-slate-700" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        <span className="font-semibold text-slate-900 dark:text-white">{u?.name ?? "Someone"}</span> {a.text}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{timeAgo(a.timestamp)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <Card className="rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">Project progress</h2>
            <p className="mt-1 text-xs text-slate-500">Completion across your projects</p>
          </div>
          <Link href="/projects" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {topProjects.length === 0 ? (
          <div className="mt-6">
            <EmptyState icon={FolderKanban} title="No projects to show" />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {topProjects.map((p) => {
              const tasks = data.tasks.filter((t) => t.projectId === p.id);
              const pDone = tasks.filter((t) => t.status === "done").length;
              const pct = tasks.length ? Math.round((pDone / tasks.length) * 100) : 0;
              return (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:hover:border-indigo-700"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{p.name}</p>
                    <Badge className={PROJECT_STATUS_STYLES[p.status]}>{PROJECT_STATUS_LABELS[p.status]}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {pDone}/{tasks.length} tasks
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} className="mt-2" />
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
