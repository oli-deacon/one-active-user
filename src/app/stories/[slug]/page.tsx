import { notFound } from "next/navigation";

import { RelatedStories } from "@/components/content/related-stories";
import { TagChip } from "@/components/ui/tag-chip";
import {
  collectRelatedStories,
  formatPublishedDate,
  getAllStories,
  getStoryBySlug,
} from "@/lib/content";
import { MdxContent } from "@/lib/mdx";

export async function generateStaticParams() {
  const stories = await getAllStories();
  return stories.map((story) => ({ slug: story.slug }));
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [story, stories] = await Promise.all([getStoryBySlug(slug), getAllStories()]);

  if (!story) {
    notFound();
  }

  const relatedStories = collectRelatedStories(stories, story);

  return (
    <article className="pb-16 pt-10">
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
          Story
        </p>
        <h1 className="mt-5 text-4xl leading-tight text-[var(--foreground)] sm:text-6xl">
          {story.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
          <span>{formatPublishedDate(story.publishedAt)}</span>
          <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
          <span>{story.author}</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {story.tags.map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>
        <p className="mt-8 text-xl leading-9 text-[var(--muted)]">{story.excerpt}</p>
      </div>

      <div className="prose mt-12 max-w-3xl">
        <MdxContent source={story.body} />
      </div>

      <RelatedStories stories={relatedStories} />
    </article>
  );
}
