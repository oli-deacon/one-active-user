import Link from "next/link";

import { formatPublishedDate } from "@/lib/content";
import type { Build } from "@/lib/types";
import { TagChip } from "@/components/ui/tag-chip";

export function BuildCard({ build }: { build: Build }) {
  return (
    <article className="rounded-[2rem] border border-[var(--line)] bg-white/70 p-6 shadow-[0_20px_60px_rgba(50,38,26,0.06)] backdrop-blur">
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
        <span>{formatPublishedDate(build.publishedAt)}</span>
        <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
        <span>{build.currentStatus}</span>
      </div>
      <h2 className="mt-5 text-2xl text-[var(--foreground)]">
        <Link href={build.url} className="transition hover:text-[var(--accent)]">
          {build.name}
        </Link>
      </h2>
      <p className="mt-3 text-base leading-7 text-[var(--muted)]">{build.summary}</p>
      <div className="mt-5 border-l-2 border-[var(--accent-soft)] pl-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
          Friction
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{build.friction}</p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {build.tags.map((tag) => (
          <TagChip key={tag} tag={tag} />
        ))}
      </div>
    </article>
  );
}
