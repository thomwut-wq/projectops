# ProjectOps

A professional team project management web app — projects, project-scoped and global Kanban boards with native HTML5 drag-and-drop, team management, settings, and role-based access control. All data persists in `localStorage`; there is no backend.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (class-based dark mode)
- lucide-react icons
- localStorage persistence (seeded on first run)

## Features

- Centered split-card login page with role-based access (admin and regular user roles)
- Self-service account creation (`/register`) with username/email uniqueness and password validation; new accounts get the `user` role
- Change Password page: users change their own password; admins can also reset other users' passwords (validated, persisted to localStorage)
- Dashboard with stat cards, recent activity feed and tasks-by-status chart
- Projects grid with progress, task counts, team avatars and status badges
- Project detail page with Overview / Tasks (Kanban) / Team tabs
- Global Kanban across all projects with native HTML5 drag-and-drop (mouse + touch): tilt/lift/scale on drag, dashed source placeholder, glowing target column, settle animation on drop
- RBAC: admins manage projects, team and any task; regular users see only assigned projects and edit/move only their own tasks, with permission-denied toasts
- Task detail modal with edit / delete / comments, permission-aware
- Team directory with presence indicators and admin-only management
- Settings: profile, avatar color, dark mode and notification toggles
- Toast notifications, empty states, loading states, responsive layout

## Demo accounts

Or create your own account via **Create account** on the login page.

- `admin` / `admin123` (role: admin)
- `user` / `user123` (role: user)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The workspace is seeded with sample projects, tasks and team members on first load. To reset, clear the site's localStorage.

## Deploy

```bash
npm run build
```

Deploys as a standard Next.js app on Vercel with no environment variables required.
