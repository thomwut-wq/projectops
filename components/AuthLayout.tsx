import { Briefcase } from "lucide-react";

export const authInputCls =
  "w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/15";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070a1f] bg-gradient-to-b from-[#0e1240] via-[#070a1f] to-[#05071a] px-4 py-10 animate-page-in">
      <div className="pointer-events-none absolute left-[8%] top-[12%] h-40 w-40 rounded-full border border-white/5 animate-float-slow" />
      <div className="pointer-events-none absolute bottom-[8%] right-[6%] h-56 w-56 rounded-full border border-white/5 animate-float" />

      <div className="relative grid w-full max-w-[1000px] overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/50 animate-login-in lg:grid-cols-[55%_45%]">
        <aside className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 px-8 py-8 text-white sm:px-12 sm:py-10 lg:min-h-[640px]">
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />

          <div className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <Briefcase className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">ProjectOps</span>
          </div>

          <div className="relative my-12 max-w-md lg:my-0">
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">Built for focused teams</span>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl">Turn ambitious ideas into work that ships.</h2>
            <p className="mt-5 text-sm leading-relaxed text-indigo-100 sm:text-base">
              Plan projects, move work forward, and keep your entire team aligned from one calm workspace.
            </p>
          </div>

          <div className="relative flex items-center gap-4">
            <div className="flex -space-x-2">
              {["AM", "JL", "TK"].map((i) => (
                <span key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white text-[10px] font-bold text-indigo-700">
                  {i}
                </span>
              ))}
            </div>
            <p className="text-sm text-indigo-50">Trusted by high-performing teams</p>
          </div>
        </aside>

        <main className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-sm">{children}</div>
        </main>
      </div>
    </div>
  );
}
