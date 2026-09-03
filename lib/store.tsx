"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { seedData } from "./seed";
import { Activity, AppData, Member, Preferences, Project, Task, TaskStatus, User, STATUS_LABELS } from "./types";
import { uid } from "./utils";

const DATA_KEY = "projectops:data";
const SESSION_KEY = "projectops:session";

type ToastKind = "success" | "error" | "info";
export interface Toast {
  id: string;
  message: string;
  kind: ToastKind;
}

interface StoreContextValue {
  data: AppData;
  ready: boolean;
  currentUser: User | null;
  isAdmin: boolean;
  toasts: Toast[];
  toast: (message: string, kind?: ToastKind) => void;
  dismissToast: (id: string) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  canEditTask: (task: Task) => boolean;
  addProject: (p: Omit<Project, "id" | "createdBy" | "status" | "memberIds">) => boolean;
  updateProject: (id: string, patch: Partial<Project>) => boolean;
  deleteProject: (id: string) => boolean;
  addTask: (t: Omit<Task, "id" | "createdBy" | "createdAt" | "comments">) => Task | null;
  updateTask: (id: string, patch: Partial<Task>) => boolean;
  moveTask: (id: string, status: TaskStatus) => boolean;
  deleteTask: (id: string) => boolean;
  addComment: (taskId: string, text: string) => boolean;
  addMember: (m: Omit<Member, "id" | "avatarColor" | "presence">) => boolean;
  updateMember: (id: string, patch: Partial<Member>) => boolean;
  deleteMember: (id: string) => boolean;
  updateProfile: (patch: Partial<Pick<User, "name" | "email" | "avatarColor">>) => void;
  updatePreferences: (patch: Partial<Preferences>) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(seedData);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DATA_KEY);
      if (raw) setData({ ...seedData, ...(JSON.parse(raw) as AppData) });
      else localStorage.setItem(DATA_KEY, JSON.stringify(seedData));
      setSessionUserId(localStorage.getItem(SESSION_KEY));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }, [data, ready]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", data.preferences.darkMode);
  }, [data.preferences.darkMode, ready]);

  const currentUser = useMemo(
    () => data.users.find((u) => u.id === sessionUserId) ?? null,
    [data.users, sessionUserId],
  );
  const isAdmin = currentUser?.role === "admin";

  const dismissToast = useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback(
    (message: string, kind: ToastKind = "success") => {
      const id = uid();
      setToasts((t) => [...t, { id, message, kind }]);
      setTimeout(() => dismissToast(id), 3000);
    },
    [dismissToast],
  );

  const log = useCallback(
    (text: string): Activity => ({ id: uid(), text, timestamp: new Date().toISOString(), userId: currentUser?.id ?? "" }),
    [currentUser],
  );

  const denied = useCallback(() => {
    toast("Permission denied: you are not allowed to do that", "error");
    return false;
  }, [toast]);

  const login = (username: string, password: string) => {
    const u = data.users.find((x) => x.username === username && x.password === password);
    if (!u) return false;
    localStorage.setItem(SESSION_KEY, u.id);
    setSessionUserId(u.id);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSessionUserId(null);
  };

  const canEditTask = useCallback(
    (task: Task) => !!currentUser && (isAdmin || task.createdBy === currentUser.id),
    [currentUser, isAdmin],
  );

  const addProject: StoreContextValue["addProject"] = (p) => {
    if (!isAdmin) return denied();
    const project: Project = { ...p, id: uid(), status: "active", memberIds: [], createdBy: currentUser!.id };
    setData((d) => ({ ...d, projects: [project, ...d.projects], activity: [log(`created project "${p.name}"`), ...d.activity] }));
    toast("Project created");
    return true;
  };

  const updateProject: StoreContextValue["updateProject"] = (id, patch) => {
    if (!isAdmin) return denied();
    setData((d) => ({ ...d, projects: d.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
    toast("Project updated");
    return true;
  };

  const deleteProject: StoreContextValue["deleteProject"] = (id) => {
    if (!isAdmin) return denied();
    setData((d) => {
      const p = d.projects.find((x) => x.id === id);
      return {
        ...d,
        projects: d.projects.filter((x) => x.id !== id),
        tasks: d.tasks.filter((t) => t.projectId !== id),
        activity: [log(`deleted project "${p?.name ?? ""}"`), ...d.activity],
      };
    });
    toast("Project deleted");
    return true;
  };

  const addTask: StoreContextValue["addTask"] = (t) => {
    if (!currentUser) return null;
    const task: Task = { ...t, id: uid(), createdBy: currentUser.id, createdAt: new Date().toISOString(), comments: [] };
    setData((d) => ({ ...d, tasks: [task, ...d.tasks], activity: [log(`created task "${t.title}"`), ...d.activity] }));
    toast("Task created");
    return task;
  };

  const updateTask: StoreContextValue["updateTask"] = (id, patch) => {
    const task = data.tasks.find((t) => t.id === id);
    if (!task) return false;
    if (!canEditTask(task)) return denied();
    setData((d) => ({
      ...d,
      tasks: d.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      activity: [log(`updated task "${task.title}"`), ...d.activity],
    }));
    toast("Task updated");
    return true;
  };

  const moveTask: StoreContextValue["moveTask"] = (id, status) => {
    const task = data.tasks.find((t) => t.id === id);
    if (!task) return false;
    if (!canEditTask(task)) return denied();
    if (task.status === status) return false;
    setData((d) => ({
      ...d,
      tasks: d.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
      activity: [log(`moved "${task.title}" to ${STATUS_LABELS[status]}`), ...d.activity],
    }));
    toast(`Task moved to ${STATUS_LABELS[status]}`);
    return true;
  };

  const deleteTask: StoreContextValue["deleteTask"] = (id) => {
    const task = data.tasks.find((t) => t.id === id);
    if (!task) return false;
    if (!canEditTask(task)) return denied();
    setData((d) => ({
      ...d,
      tasks: d.tasks.filter((t) => t.id !== id),
      activity: [log(`deleted task "${task.title}"`), ...d.activity],
    }));
    toast("Task deleted");
    return true;
  };

  const addComment: StoreContextValue["addComment"] = (taskId, text) => {
    const task = data.tasks.find((t) => t.id === taskId);
    if (!task || !currentUser) return false;
    if (!canEditTask(task)) return denied();
    setData((d) => ({
      ...d,
      tasks: d.tasks.map((t) =>
        t.id === taskId
          ? { ...t, comments: [...t.comments, { id: uid(), authorId: currentUser.id, text, createdAt: new Date().toISOString() }] }
          : t,
      ),
    }));
    toast("Comment added");
    return true;
  };

  const addMember: StoreContextValue["addMember"] = (m) => {
    if (!isAdmin) return denied();
    const colors = ["bg-indigo-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500", "bg-sky-500", "bg-violet-500"];
    const member: Member = { ...m, id: uid(), avatarColor: colors[Math.floor(Math.random() * colors.length)], presence: "offline" };
    setData((d) => ({ ...d, members: [...d.members, member], activity: [log(`added ${m.name} to the team`), ...d.activity] }));
    toast("Member added");
    return true;
  };

  const updateMember: StoreContextValue["updateMember"] = (id, patch) => {
    if (!isAdmin) return denied();
    setData((d) => ({ ...d, members: d.members.map((m) => (m.id === id ? { ...m, ...patch } : m)) }));
    toast("Member updated");
    return true;
  };

  const deleteMember: StoreContextValue["deleteMember"] = (id) => {
    if (!isAdmin) return denied();
    setData((d) => {
      const m = d.members.find((x) => x.id === id);
      return {
        ...d,
        members: d.members.filter((x) => x.id !== id),
        tasks: d.tasks.map((t) => (t.assigneeId === id ? { ...t, assigneeId: null } : t)),
        projects: d.projects.map((p) => ({ ...p, memberIds: p.memberIds.filter((x) => x !== id) })),
        activity: [log(`removed ${m?.name ?? "a member"} from the team`), ...d.activity],
      };
    });
    toast("Member removed");
    return true;
  };

  const updateProfile: StoreContextValue["updateProfile"] = (patch) => {
    if (!currentUser) return;
    setData((d) => ({ ...d, users: d.users.map((u) => (u.id === currentUser.id ? { ...u, ...patch } : u)) }));
  };

  const updatePreferences: StoreContextValue["updatePreferences"] = (patch) => {
    setData((d) => ({ ...d, preferences: { ...d.preferences, ...patch } }));
  };

  const value: StoreContextValue = {
    data,
    ready,
    currentUser,
    isAdmin,
    toasts,
    toast,
    dismissToast,
    login,
    logout,
    canEditTask,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    addComment,
    addMember,
    updateMember,
    deleteMember,
    updateProfile,
    updatePreferences,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
