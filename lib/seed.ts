import { AppData } from "./types";

const daysFromNow = (d: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().slice(0, 10);
};
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

export const seedData: AppData = {
  users: [
    {
      id: "u-admin",
      username: "admin",
      password: "admin123",
      name: "Alex Morgan",
      email: "alex@projectops.io",
      role: "admin",
      avatarColor: "bg-indigo-500",
    },
    {
      id: "u-user",
      username: "user",
      password: "user123",
      name: "Jamie Chen",
      email: "jamie@projectops.io",
      role: "user",
      avatarColor: "bg-emerald-500",
    },
  ],
  members: [
    { id: "m1", name: "Alex Morgan", role: "Product Lead", email: "alex@projectops.io", avatarColor: "bg-indigo-500", presence: "online" },
    { id: "m2", name: "Jamie Chen", role: "Frontend Engineer", email: "jamie@projectops.io", avatarColor: "bg-emerald-500", presence: "online" },
    { id: "m3", name: "Priya Patel", role: "Backend Engineer", email: "priya@projectops.io", avatarColor: "bg-rose-500", presence: "away" },
    { id: "m4", name: "Marcus Lee", role: "UI/UX Designer", email: "marcus@projectops.io", avatarColor: "bg-amber-500", presence: "offline" },
    { id: "m5", name: "Sofia Garcia", role: "QA Engineer", email: "sofia@projectops.io", avatarColor: "bg-sky-500", presence: "online" },
  ],
  projects: [
    {
      id: "p1",
      name: "Website Redesign",
      description: "Complete overhaul of the marketing site with a new design system and improved performance.",
      startDate: daysFromNow(-30),
      endDate: daysFromNow(30),
      status: "active",
      memberIds: ["m1", "m2", "m4"],
      createdBy: "u-admin",
    },
    {
      id: "p2",
      name: "Mobile App Launch",
      description: "Ship the iOS and Android apps with core features, onboarding and analytics.",
      startDate: daysFromNow(-45),
      endDate: daysFromNow(60),
      status: "active",
      memberIds: ["m2", "m3", "m5"],
      createdBy: "u-admin",
    },
    {
      id: "p3",
      name: "API Migration",
      description: "Migrate legacy REST endpoints to the new GraphQL gateway with zero downtime.",
      startDate: daysFromNow(-90),
      endDate: daysFromNow(-5),
      status: "on-hold",
      memberIds: ["m3", "m1"],
      createdBy: "u-admin",
    },
  ],
  tasks: [
    { id: "t1", projectId: "p1", title: "Design new homepage hero", description: "Create hi-fi mockups for the homepage hero section.", assigneeId: "m4", priority: "high", status: "done", dueDate: daysFromNow(-3), createdBy: "u-admin", createdAt: hoursAgo(120), comments: [] },
    { id: "t2", projectId: "p1", title: "Implement design tokens", description: "Set up Tailwind theme with the new color and spacing tokens.", assigneeId: "m2", priority: "medium", status: "in-progress", dueDate: daysFromNow(4), createdBy: "u-user", createdAt: hoursAgo(96), comments: [] },
    { id: "t3", projectId: "p1", title: "Optimize image loading", description: "Use next/image and lazy loading across all pages.", assigneeId: "m2", priority: "low", status: "backlog", dueDate: daysFromNow(14), createdBy: "u-user", createdAt: hoursAgo(80), comments: [] },
    { id: "t4", projectId: "p1", title: "Accessibility audit", description: "Run axe audit and fix all critical issues.", assigneeId: "m5", priority: "medium", status: "review", dueDate: daysFromNow(2), createdBy: "u-admin", createdAt: hoursAgo(70), comments: [] },
    { id: "t5", projectId: "p2", title: "Set up push notifications", description: "Integrate FCM and APNs for push delivery.", assigneeId: "m3", priority: "urgent", status: "in-progress", dueDate: daysFromNow(1), createdBy: "u-admin", createdAt: hoursAgo(60), comments: [] },
    { id: "t6", projectId: "p2", title: "Onboarding flow screens", description: "Build the 4-step onboarding carousel.", assigneeId: "m2", priority: "high", status: "backlog", dueDate: daysFromNow(10), createdBy: "u-user", createdAt: hoursAgo(55), comments: [] },
    { id: "t7", projectId: "p2", title: "App store listing assets", description: "Prepare screenshots and descriptions for both stores.", assigneeId: "m4", priority: "medium", status: "backlog", dueDate: daysFromNow(21), createdBy: "u-admin", createdAt: hoursAgo(50), comments: [] },
    { id: "t8", projectId: "p2", title: "Crash reporting integration", description: "Add Sentry SDK to both platforms.", assigneeId: "m3", priority: "high", status: "done", dueDate: daysFromNow(-7), createdBy: "u-admin", createdAt: hoursAgo(45), comments: [] },
    { id: "t9", projectId: "p2", title: "E2E test suite", description: "Write Detox tests for the critical paths.", assigneeId: "m5", priority: "medium", status: "review", dueDate: daysFromNow(3), createdBy: "u-user", createdAt: hoursAgo(30), comments: [] },
    { id: "t10", projectId: "p3", title: "Map REST endpoints to schema", description: "Document each endpoint and its GraphQL equivalent.", assigneeId: "m3", priority: "high", status: "done", dueDate: daysFromNow(-20), createdBy: "u-admin", createdAt: hoursAgo(24), comments: [] },
    { id: "t11", projectId: "p3", title: "Gateway rate limiting", description: "Implement per-client rate limits at the gateway.", assigneeId: "m1", priority: "urgent", status: "in-progress", dueDate: daysFromNow(-1), createdBy: "u-admin", createdAt: hoursAgo(12), comments: [] },
    { id: "t12", projectId: "p3", title: "Deprecation notices", description: "Send deprecation emails to API consumers.", assigneeId: null, priority: "low", status: "backlog", dueDate: daysFromNow(30), createdBy: "u-user", createdAt: hoursAgo(5), comments: [] },
  ],
  activity: [
    { id: "a1", text: "created task \"Deprecation notices\"", timestamp: hoursAgo(5), userId: "u-user" },
    { id: "a2", text: "moved \"Gateway rate limiting\" to In Progress", timestamp: hoursAgo(12), userId: "u-admin" },
    { id: "a3", text: "completed \"Map REST endpoints to schema\"", timestamp: hoursAgo(24), userId: "u-admin" },
    { id: "a4", text: "created task \"E2E test suite\"", timestamp: hoursAgo(30), userId: "u-user" },
    { id: "a5", text: "added Sofia Garcia to the team", timestamp: hoursAgo(40), userId: "u-admin" },
    { id: "a6", text: "created project \"Mobile App Launch\"", timestamp: hoursAgo(48), userId: "u-admin" },
  ],
  preferences: { darkMode: false, emailNotifications: true },
};
