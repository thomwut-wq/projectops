"use client";

import Kanban from "@/components/Kanban";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tasks</h1>
        <p className="text-sm text-slate-500">All tasks across every project. Drag cards to update their status.</p>
      </div>
      <Kanban />
    </div>
  );
}
