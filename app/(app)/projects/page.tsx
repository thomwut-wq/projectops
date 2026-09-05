"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, FolderKanban, ListTodo } from "lucide-react";
import { useStore } from "@/lib/store";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_STYLES } from "@/lib/types";
import { Avatar, Badge, Button, Card, EmptyState, Field, Modal, ProgressBar, inputCls } from "@/components/ui";

export default function ProjectsPage() {
  const { data, isAdmin, addProject, visibleProjects } = useStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", startDate: new Date().toISOString().slice(0, 10), endDate: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addProject(form)) {
      setOpen(false);
      setForm({ name: "", description: "", startDate: new Date().toISOString().slice(0, 10), endDate: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Projects</h1>
          <p className="text-sm text-slate-500">{visibleProjects.length} {isAdmin ? "projects in your workspace" : "projects assigned to you"}</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> New Project
          </Button>
        )}
      </div>

      {visibleProjects.length === 0 ? (
        <EmptyState icon={FolderKanban} title={isAdmin ? "No projects yet" : "No assigned projects"} message={isAdmin ? "Create your first project to get started." : "You will see projects here once an admin adds you to a team."} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((p) => {
            const tasks = data.tasks.filter((t) => t.projectId === p.id);
            const done = tasks.filter((t) => t.status === "done").length;
            const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
            const members = data.members.filter((m) => p.memberIds.includes(m.id));
            return (
              <Card key={p.id} hover className="flex flex-col p-5" onClick={() => router.push(`/projects/${p.id}`)}>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{p.name}</h3>
                  <Badge className={PROJECT_STATUS_STYLES[p.status]}>{PROJECT_STATUS_LABELS[p.status]}</Badge>
                </div>
                <p className="mb-4 line-clamp-2 flex-1 text-sm text-slate-500">{p.description}</p>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                  <span>Progress</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{pct}%</span>
                </div>
                <ProgressBar value={pct} className="mb-4" />
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <ListTodo className="h-3.5 w-3.5" /> {tasks.length} tasks
                  </span>
                  <div className="flex -space-x-2">
                    {members.slice(0, 4).map((m) => (
                      <Avatar key={m.id} name={m.name} color={m.avatarColor} size="sm" />
                    ))}
                    {members.length === 0 && <span className="text-xs text-slate-400">No members</span>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New project">
        <form onSubmit={submit} className="space-y-3">
          <Field label="Name">
            <input className={inputCls} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Project name" />
          </Field>
          <Field label="Description">
            <textarea className={inputCls} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What is this project about?" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date">
              <input type="date" className={inputCls} required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </Field>
            <Field label="End date">
              <input type="date" className={inputCls} required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </Field>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create project</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
