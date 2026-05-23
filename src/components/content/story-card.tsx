import Link from "next/link";

import { formatPublishedDate } from "@/lib/content";
import type { Story } from "@/lib/types";
import { TagChip } from "@/components/ui/tag-chip";

export function StoryCard({ story, featured = false }: { story: Story; featured?: boolean }) {
  return (
    <article
      className={`rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] backdrop-blur ${
        featured ? "p-8 sm:p-10" : "p-6"
      }`}
    >
      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
        <span>{formatPublishedDate(story.publishedAt)}</span>
        <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
        <span>{story.author}</span>
      </div>
      <h2 className={`mt-5 text-[var(--foreground)] ${featured ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
        <Link href={story.url} className="transition hover:text-[var(--accent)]">
          {story.title}
        </Link>
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">{story.excerpt}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {story.tags.map((tag) => (
          <TagChip key={tag} tag={tag} />
        ))}
      </div>
    </article>
  );
}
