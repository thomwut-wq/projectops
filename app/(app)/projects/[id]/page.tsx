"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Trash2, UserPlus, UserMinus, Activity, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_STYLES, ProjectStatus, STATUSES, STATUS_LABELS } from "@/lib/types";
import { cn, formatDate, timeAgo } from "@/lib/utils";
import { Avatar, Badge, Button, Card, EmptyState, ProgressBar, inputCls } from "@/components/ui";
import Kanban from "@/components/Kanban";

type Tab = "overview" | "tasks" | "team";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isAdmin, updateProject, deleteProject, canViewProject } = useStore();
  const [tab, setTab] = useState<Tab>("overview");
  const project = data.projects.find((p) => p.id === id);

  if (!project || !canViewProject(project)) {
    return (
      <div className="space-y-4">
        <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>
        <EmptyState icon={Activity} title={project ? "Access restricted" : "Project not found"} message={project ? "You are not assigned to this project." : undefined} />
      </div>
    );
  }

  const tasks = data.tasks.filter((t) => t.projectId === project.id);
  const done = tasks.filter((t) => t.status === "done").length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const members = data.members.filter((m) => project.memberIds.includes(m.id));
  const nonMembers = data.members.filter((m) => !project.memberIds.includes(m.id));
  const activity = data.activity.filter((a) => tasks.some((t) => a.text.includes(`"${t.title}"`)) || a.text.includes(`"${project.name}"`)).slice(0, 5);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "tasks", label: `Tasks (${tasks.length})` },
    { id: "team", label: `Team (${members.length})` },
  ];

  return (
    <div className="space-y-6">
      <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600">
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>

      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{project.name}</h1>
              {isAdmin ? (
                <select
                  className={cn("rounded-full border-0 px-2 py-0.5 text-xs font-medium", PROJECT_STATUS_STYLES[project.status])}
                  value={project.status}
                  onChange={(e) => updateProject(project.id, { status: e.target.value as ProjectStatus })}
                >
                  {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {PROJECT_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              ) : (
                <Badge className={PROJECT_STATUS_STYLES[project.status]}>{PROJECT_STATUS_LABELS[project.status]}</Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">{project.description}</p>
            <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {formatDate(project.startDate)} – {formatDate(project.endDate)}
              </span>
              <div className="flex -space-x-2">
                {members.map((m) => (
                  <Avatar key={m.id} name={m.name} color={m.avatarColor} size="sm" />
                ))}
              </div>
            </div>
          </div>
          <div className="w-full md:w-64">
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>Progress</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">{pct}%</span>
            </div>
            <ProgressBar value={pct} />
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                onClick={() => {
                  if (confirm("Delete this project and all its tasks?") && deleteProject(project.id)) router.push("/projects");
                }}
              >
                <Trash2 className="h-4 w-4" /> Delete project
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-200",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">Tasks by status</h2>
            <div className="space-y-3">
              {STATUSES.map((s) => {
                const n = tasks.filter((t) => t.status === s).length;
                return (
                  <div key={s}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-300">{STATUS_LABELS[s]}</span>
                      <span className="font-medium text-slate-800 dark:text-slate-100">{n}</span>
                    </div>
                    <ProgressBar value={tasks.length ? (n / tasks.length) * 100 : 0} />
                  </div>
                );
              })}
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
              <div>
                <dt className="text-xs text-slate-500">Start date</dt>
                <dd className="font-medium text-slate-800 dark:text-slate-100">{formatDate(project.startDate)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">End date</dt>
                <dd className="font-medium text-slate-800 dark:text-slate-100">{formatDate(project.endDate)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Total tasks</dt>
                <dd className="font-medium text-slate-800 dark:text-slate-100">{tasks.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Completed</dt>
                <dd className="font-medium text-slate-800 dark:text-slate-100">{done}</dd>
              </div>
            </dl>
          </Card>
          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">Recent activity</h2>
            {activity.length === 0 ? (
              <EmptyState icon={Activity} title="No activity yet" />
            ) : (
              <ul className="space-y-3">
                {activity.map((a) => {
                  const u = data.users.find((x) => x.id === a.userId);
                  return (
                    <li key={a.id} className="flex items-start gap-3">
                      <Avatar name={u?.name ?? "?"} color={u?.avatarColor ?? "bg-slate-400"} size="sm" className="mt-0.5" />
                      <div>
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
      )}

      {tab === "tasks" && <Kanban projectId={project.id} />}

      {tab === "team" && (
        <div className="space-y-4">
          {isAdmin && nonMembers.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                className={cn(inputCls, "max-w-xs")}
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) updateProject(project.id, { memberIds: [...project.memberIds, e.target.value] });
                  e.target.value = "";
                }}
              >
                <option value="">Add a team member...</option>
                {nonMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <UserPlus className="h-4 w-4 text-slate-400" />
            </div>
          )}
          {members.length === 0 ? (
            <EmptyState icon={Users} title="No team members" message="Assign members to this project." />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {members.map((m) => {
                const n = tasks.filter((t) => t.assigneeId === m.id).length;
                return (
                  <Card key={m.id} className="flex items-center gap-4 p-4">
                    <Avatar name={m.name} color={m.avatarColor} size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900 dark:text-white">{m.name}</p>
                      <p className="truncate text-xs text-slate-500">{m.role}</p>
                      <p className="mt-1 text-xs text-slate-500">{n} tasks in this project</p>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => updateProject(project.id, { memberIds: project.memberIds.filter((x) => x !== m.id) })}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                        title="Remove from project"
                      >
                        <UserMinus className="h-4 w-4" />
                      </button>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
