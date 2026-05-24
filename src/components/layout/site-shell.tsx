import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.75),_transparent_68%)]" />
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-6 sm:px-10">
        <Link href="/" className="max-w-xs">
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
            One Active User
          </div>
          <div className="mt-2 text-lg leading-tight text-[var(--foreground)]">
            {siteConfig.tagline}
          </div>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-4 text-sm text-[var(--muted)]">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10">{children}</main>
    </div>
  );
}
