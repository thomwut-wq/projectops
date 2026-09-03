"use client";

import React, { useState } from "react";
import { Pencil, Trash2, Lock, Send } from "lucide-react";
import { useStore } from "@/lib/store";
import { PRIORITY_STYLES, Priority, STATUSES, STATUS_LABELS, Task, TaskStatus } from "@/lib/types";
import { cn, formatDate, timeAgo } from "@/lib/utils";
import { Avatar, Badge, Button, Field, Modal, inputCls } from "./ui";

interface Props {
  task?: Task;
  defaultStatus?: TaskStatus;
  defaultProjectId?: string;
  onClose: () => void;
}

export default function TaskModal({ task, defaultStatus, defaultProjectId, onClose }: Props) {
  const { data, addTask, updateTask, deleteTask, addComment, canEditTask, toast } = useStore();
  const [editing, setEditing] = useState(!task);
  const [comment, setComment] = useState("");
  const [form, setForm] = useState({
    title: task?.title ?? "",
    description: task?.description ?? "",
    assigneeId: task?.assigneeId ?? "",
    priority: task?.priority ?? ("medium" as Priority),
    status: task?.status ?? defaultStatus ?? ("backlog" as TaskStatus),
    dueDate: task?.dueDate ?? new Date().toISOString().slice(0, 10),
    projectId: task?.projectId ?? defaultProjectId ?? data.projects[0]?.id ?? "",
  });
  const editable = task ? canEditTask(task) : true;
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const payload = { ...form, assigneeId: form.assigneeId || null };
    if (task) {
      if (!editable) {
        toast("Permission denied: you cannot edit this task", "error");
        return;
      }
      if (updateTask(task.id, payload)) onClose();
    } else {
      if (addTask(payload)) onClose();
    }
  };

  const assignee = data.members.find((m) => m.id === task?.assigneeId);
  const project = data.projects.find((p) => p.id === task?.projectId);
  const creator = data.users.find((u) => u.id === task?.createdBy);

  if (task && !editing) {
    return (
      <Modal open onClose={onClose} title="Task details">
        <div className="space-y-4">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{task.title}</h4>
              {!editable && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Lock className="h-3.5 w-3.5" /> Read-only
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{task.description || "No description."}</p>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Status</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{STATUS_LABELS[task.status]}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Priority</dt>
              <dd>
                <Badge className={cn("capitalize", PRIORITY_STYLES[task.priority])}>{task.priority}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Assignee</dt>
              <dd className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-100">
                {assignee ? (
                  <>
                    <Avatar name={assignee.name} color={assignee.avatarColor} size="sm" /> {assignee.name}
                  </>
                ) : (
                  "Unassigned"
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Due date</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{formatDate(task.dueDate)}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Project</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{project?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Created by</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{creator?.name ?? "—"}</dd>
            </div>
          </dl>

          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">Comments ({task.comments.length})</p>
            <div className="space-y-2">
              {task.comments.map((c) => {
                const author = data.users.find((u) => u.id === c.authorId);
                return (
                  <div key={c.id} className="rounded-lg bg-slate-50 p-2.5 text-sm dark:bg-slate-800">
                    <div className="mb-0.5 flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-700 dark:text-slate-200">{author?.name ?? "Unknown"}</span> · {timeAgo(c.createdAt)}
                    </div>
                    <p className="text-slate-700 dark:text-slate-200">{c.text}</p>
                  </div>
                );
              })}
            </div>
            {editable && (
              <form
                className="mt-2 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (comment.trim() && addComment(task.id, comment.trim())) setComment("");
                }}
              >
                <input className={inputCls} placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
                <Button type="submit" variant="secondary" size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>

          {editable && (
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (confirm("Delete this task?") && deleteTask(task.id)) onClose();
                }}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
              <Button size="sm" onClick={() => setEditing(true)}>
                <Pencil className="h-4 w-4" /> Edit
              </Button>
            </div>
          )}
        </div>
      </Modal>
    );
  }

  return (
    <Modal open onClose={onClose} title={task ? "Edit task" : "New task"}>
      <form onSubmit={submit} className="space-y-3">
        <Field label="Title">
          <input className={inputCls} required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Task title" />
        </Field>
        <Field label="Description">
          <textarea className={inputCls} rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Details..." />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Project">
            <select className={inputCls} value={form.projectId} onChange={(e) => set("projectId", e.target.value)} disabled={!!defaultProjectId}>
              {data.projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Assignee">
            <select className={inputCls} value={form.assigneeId} onChange={(e) => set("assigneeId", e.target.value)}>
              <option value="">Unassigned</option>
              {data.members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Priority">
            <select className={inputCls} value={form.priority} onChange={(e) => set("priority", e.target.value as Priority)}>
              {(["low", "medium", "high", "urgent"] as Priority[]).map((p) => (
                <option key={p} value={p} className="capitalize">
                  {p[0].toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value as TaskStatus)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Due date">
            <input type="date" className={inputCls} value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={task ? () => setEditing(false) : onClose}>
            Cancel
          </Button>
          <Button type="submit">{task ? "Save changes" : "Create task"}</Button>
        </div>
      </form>
    </Modal>
  );
}
