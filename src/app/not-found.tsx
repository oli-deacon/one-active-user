import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-start justify-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Not found</p>
      <h1 className="mt-4 text-4xl text-[var(--foreground)]">That page is not part of the published collection.</h1>
      <p className="mt-4 max-w-xl text-lg leading-8 text-[var(--muted)]">
        Try returning to the homepage, browsing the current stories, or exploring the build
        profiles instead.
      </p>
      <Link href="/" className="mt-8 rounded-full bg-[var(--foreground)] px-6 py-3 text-sm text-[var(--background)]">
        Go home
      </Link>
    </div>
  );
}
