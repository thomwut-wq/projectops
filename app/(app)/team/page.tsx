"use client";

import { useState } from "react";
import { Plus, Mail, Trash2, Users, Pencil } from "lucide-react";
import { useStore } from "@/lib/store";
import { Member, Presence } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, Button, Card, EmptyState, Field, Modal, inputCls } from "@/components/ui";

const presenceDot: Record<Presence, string> = { online: "bg-emerald-500", away: "bg-amber-500", offline: "bg-slate-400" };

export default function TeamPage() {
  const { data, isAdmin, addMember, updateMember, deleteMember } = useStore();
  const [modal, setModal] = useState<{ member?: Member } | null>(null);
  const [form, setForm] = useState({ name: "", role: "", email: "" });

  const openNew = () => {
    setForm({ name: "", role: "", email: "" });
    setModal({});
  };
  const openEdit = (m: Member) => {
    setForm({ name: m.name, role: m.role, email: m.email });
    setModal({ member: m });
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = modal?.member ? updateMember(modal.member.id, form) : addMember(form);
    if (ok) setModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Team</h1>
          <p className="text-sm text-slate-500">{data.members.length} members</p>
        </div>
        {isAdmin && (
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> Add Member
          </Button>
        )}
      </div>

      {data.members.length === 0 ? (
        <EmptyState icon={Users} title="No team members" message="Add your first team member." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.members.map((m) => {
            const n = data.tasks.filter((t) => t.assigneeId === m.id).length;
            return (
              <Card key={m.id} hover className="p-5">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar name={m.name} color={m.avatarColor} size="lg" />
                    <span className={cn("absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900", presenceDot[m.presence])} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900 dark:text-white">{m.name}</p>
                    <p className="text-sm text-slate-500">{m.role}</p>
                    <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-500">
                      <Mail className="h-3 w-3" /> {m.email}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(m)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => confirm(`Remove ${m.name} from the team?`) && deleteMember(m.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                  <span className="text-slate-500">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{n}</span> tasks assigned
                  </span>
                  <span className="flex items-center gap-1.5 capitalize text-slate-500">
                    <span className={cn("h-2 w-2 rounded-full", presenceDot[m.presence])} /> {m.presence}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.member ? "Edit member" : "Add member"}>
        <form onSubmit={submit} className="space-y-3">
          <Field label="Name">
            <input className={inputCls} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
          </Field>
          <Field label="Role">
            <input className={inputCls} required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Frontend Engineer" />
          </Field>
          <Field label="Email">
            <input type="email" className={inputCls} required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@company.com" />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(null)}>
              Cancel
            </Button>
            <Button type="submit">{modal?.member ? "Save" : "Add member"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
