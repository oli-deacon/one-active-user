import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.75),_transparent_68%)]" />
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-6 sm:px-10">
        <Link href="/" className="focus-ring max-w-xs rounded-md">
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
            One Active User
          </div>
          <div className="mt-2 text-lg leading-tight text-[var(--foreground)]">
            {siteConfig.tagline}
          </div>
        </Link>
        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center justify-end gap-4 text-sm text-[rgba(31,27,24,0.76)]"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-md px-1 py-1 transition hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 sm:px-10">{children}</main>
      <footer className="mx-auto flex w-full max-w-6xl flex-col gap-6 border-t border-[var(--line)] px-6 py-8 sm:flex-row sm:items-start sm:justify-between sm:px-10">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
            One Active User
          </div>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[rgba(31,27,24,0.72)]"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-md px-1 py-1 transition hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
