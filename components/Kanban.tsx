"use client";

import React, { useRef, useState } from "react";
import { Plus, Calendar, Lock, ClipboardList } from "lucide-react";
import { useStore } from "@/lib/store";
import { PRIORITY_STYLES, STATUSES, STATUS_LABELS, Task, TaskStatus } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { Avatar, Badge } from "./ui";
import TaskModal from "./TaskModal";

export default function Kanban({ projectId }: { projectId?: string }) {
  const { data, moveTask, canEditTask, toast } = useStore();
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<TaskStatus | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ task?: Task; status?: TaskStatus } | null>(null);
  const touchGhost = useRef<HTMLElement | null>(null);

  const tasks = projectId ? data.tasks.filter((t) => t.projectId === projectId) : data.tasks;
  const projectName = (id: string) => data.projects.find((p) => p.id === id)?.name ?? "";
  const member = (id: string | null) => data.members.find((m) => m.id === id);

  const drop = (taskId: string, status: TaskStatus) => {
    const ok = moveTask(taskId, status);
    if (ok) {
      setFlashId(taskId);
      setTimeout(() => setFlashId(null), 300);
    }
  };

  const onDragStart = (e: React.DragEvent, task: Task) => {
    if (!canEditTask(task)) {
      e.preventDefault();
      toast("Permission denied: you can only move your own tasks", "error");
      return;
    }
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
    setDragId(task.id);
  };
  const onDragEnd = () => {
    setDragId(null);
    setOverCol(null);
  };

  // Touch support
  const onTouchStart = (e: React.TouchEvent, task: Task) => {
    if (!canEditTask(task)) return;
    const el = e.currentTarget as HTMLElement;
    const timer = setTimeout(() => {
      setDragId(task.id);
      const ghost = el.cloneNode(true) as HTMLElement;
      ghost.style.position = "fixed";
      ghost.style.width = `${el.offsetWidth}px`;
      ghost.style.pointerEvents = "none";
      ghost.style.opacity = "0.9";
      ghost.style.zIndex = "1000";
      ghost.style.transform = "translateY(-2px) rotate(2deg)";
      document.body.appendChild(ghost);
      touchGhost.current = ghost;
    }, 250);
    el.dataset.timer = String(timer);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const t = e.touches[0];
    const el = e.currentTarget as HTMLElement;
    if (!touchGhost.current) {
      clearTimeout(Number(el.dataset.timer));
      return;
    }
    e.preventDefault();
    touchGhost.current.style.left = `${t.clientX - 80}px`;
    touchGhost.current.style.top = `${t.clientY - 30}px`;
    const target = document.elementFromPoint(t.clientX, t.clientY)?.closest<HTMLElement>("[data-col]");
    setOverCol((target?.dataset.col as TaskStatus) ?? null);
  };
  const onTouchEnd = (e: React.TouchEvent, task: Task) => {
    const el = e.currentTarget as HTMLElement;
    clearTimeout(Number(el.dataset.timer));
    if (touchGhost.current) {
      touchGhost.current.remove();
      touchGhost.current = null;
      if (overCol) drop(task.id, overCol);
    }
    setDragId(null);
    setOverCol(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STATUSES.map((status) => {
          const col = tasks.filter((t) => t.status === status);
          return (
            <div
              key={status}
              data-col={status}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (overCol !== status) setOverCol(status);
              }}
              onDragLeave={(e) => {
                if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) setOverCol(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                if (id) drop(id, status);
                setOverCol(null);
                setDragId(null);
              }}
              className={cn(
                "flex min-h-[300px] flex-col rounded-xl border p-3 transition-colors duration-200",
                overCol === status && dragId
                  ? "border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/40"
                  : "border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/60",
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", { backlog: "bg-slate-400", "in-progress": "bg-indigo-500", review: "bg-amber-500", done: "bg-emerald-500" }[status])} />
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {STATUS_LABELS[status]}{" "}
                    <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">{col.length}</span>
                  </h3>
                </div>
                <button
                  onClick={() => setModal({ status })}
                  title="Add task"
                  className="rounded-md p-1 text-slate-500 transition-all hover:scale-110 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                {col.length === 0 && (
                  <div className="flex flex-1 flex-col items-center justify-center py-8 text-center text-slate-400">
                    <ClipboardList className="mb-2 h-6 w-6" />
                    <p className="text-xs">No tasks</p>
                  </div>
                )}
                {col.map((task) => {
                  const a = member(task.assigneeId);
                  const editable = canEditTask(task);
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, task)}
                      onDragEnd={onDragEnd}
                      onTouchStart={(e) => onTouchStart(e, task)}
                      onTouchMove={onTouchMove}
                      onTouchEnd={(e) => onTouchEnd(e, task)}
                      onClick={() => setModal({ task })}
                      className={cn(
                        "group select-none rounded-lg border bg-white p-3 shadow-sm transition-all duration-200 dark:bg-slate-800",
                        editable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
                        dragId === task.id ? "-translate-y-0.5 opacity-60 shadow-lg ring-2 ring-indigo-300" : "hover:-translate-y-0.5 hover:shadow-md",
                        flashId === task.id ? "border-emerald-500 ring-2 ring-emerald-300" : "border-slate-200 dark:border-slate-700",
                      )}
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-snug text-slate-800 dark:text-slate-100">{task.title}</p>
                        {!editable && <Lock className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-label="Read-only" />}
                      </div>
                      {!projectId && (
                        <Badge className="mb-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">{projectName(task.projectId)}</Badge>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={cn("capitalize", PRIORITY_STYLES[task.priority])}>{task.priority}</Badge>
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Calendar className="h-3 w-3" />
                            {formatDate(task.dueDate)}
                          </span>
                        </div>
                        {a ? <Avatar name={a.name} color={a.avatarColor} size="sm" /> : <div className="h-6 w-6 rounded-full border border-dashed border-slate-300" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {modal && <TaskModal task={modal.task} defaultStatus={modal.status} defaultProjectId={projectId} onClose={() => setModal(null)} />}
    </>
  );
}
