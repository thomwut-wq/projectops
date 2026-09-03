export type Role = "admin" | "user";
export type TaskStatus = "backlog" | "in-progress" | "review" | "done";
export type Priority = "low" | "medium" | "high" | "urgent";
export type ProjectStatus = "active" | "completed" | "on-hold";
export type Presence = "online" | "away" | "offline";

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: Role;
  avatarColor: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  memberIds: string[];
  createdBy: string;
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assigneeId: string | null;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  createdBy: string;
  createdAt: string;
  comments: Comment[];
}

export interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarColor: string;
  presence: Presence;
}

export interface Activity {
  id: string;
  text: string;
  timestamp: string;
  userId: string;
}

export interface Preferences {
  darkMode: boolean;
  emailNotifications: boolean;
}

export interface AppData {
  users: User[];
  projects: Project[];
  tasks: Task[];
  members: Member[];
  activity: Activity[];
  preferences: Preferences;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: "Backlog",
  "in-progress": "In Progress",
  review: "Review",
  done: "Done",
};

export const STATUSES: TaskStatus[] = ["backlog", "in-progress", "review", "done"];

export const PRIORITY_STYLES: Record<Priority, string> = {
  low: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
};

export const PROJECT_STATUS_STYLES: Record<ProjectStatus, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  completed: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
  "on-hold": "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  active: "Active",
  completed: "Completed",
  "on-hold": "On Hold",
};

export const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-sky-500",
  "bg-violet-500",
];
