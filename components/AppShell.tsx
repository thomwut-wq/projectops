"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, KanbanSquare, Users, Settings, LogOut, Menu, X, Layers, KeyRound } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Avatar, LoadingScreen } from "./ui";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: KanbanSquare },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/password", label: "Change Password", icon: KeyRound },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { ready, currentUser, logout, isAdmin } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (ready && !currentUser) router.replace("/login");
  }, [ready, currentUser, router]);

  useEffect(() => setOpen(false), [pathname]);

  if (!ready || !currentUser) return <LoadingScreen />;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {open && <div className="fixed inset-0 z-30 bg-slate-900/50 md:hidden" onClick={() => setOpen(false)} />}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200/60 bg-gradient-to-b from-white via-slate-50 to-indigo-50/60 transition-transform duration-300 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30">
              <Layers className="h-4 w-4" />
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">ProjectOps</span>
          </Link>
          <button className="rounded-lg p-1 text-slate-500 md:hidden" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-600 hover:translate-x-0.5 hover:bg-white/70 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800",
                )}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-200/60 p-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Avatar name={currentUser.name} color={currentUser.avatarColor} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{currentUser.name}</p>
              <p className="truncate text-xs text-slate-500">
                <span className={cn("mr-1 inline-block rounded px-1 py-px text-[10px] font-semibold uppercase", isAdmin ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300" : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300")}>
                  {currentUser.role}
                </span>
                {isAdmin ? "Administrator" : "Team member"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/60 bg-gradient-to-r from-white via-white to-indigo-50/60 px-4 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-base font-semibold text-slate-900 dark:text-white md:hidden">ProjectOps</span>
            <span className="hidden text-sm text-slate-500 md:block">{nav.find((n) => pathname.startsWith(n.href))?.label ?? "Project"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar name={currentUser.name} color={currentUser.avatarColor} />
            <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">{currentUser.name}</span>
            <button
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-all hover:scale-[1.02] hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-950/40"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 animate-fade-in" key={pathname}>
          {children}
        </main>
      </div>
    </div>
  );
}
