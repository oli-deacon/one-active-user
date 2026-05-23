import { StoryCard } from "@/components/content/story-card";
import type { Story } from "@/lib/types";

export function RelatedStories({ stories }: { stories: Story[] }) {
  if (stories.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 border-t border-[var(--line)] pt-10">
      <h2 className="text-2xl text-[var(--foreground)]">More to read</h2>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {stories.map((story) => (
          <StoryCard key={story.slug} story={story} />
        ))}
      </div>
    </section>
  );
}
