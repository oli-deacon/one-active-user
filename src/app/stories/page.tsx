import { StoryCard } from "@/components/content/story-card";
import { PageIntro } from "@/components/ui/page-intro";
import { getAllStories } from "@/lib/content";

export default async function StoriesPage() {
  const stories = await getAllStories();

  return (
    <div className="pb-16">
      <PageIntro
        eyebrow="Stories"
        title="Essays, reflections, and arguments for more personal software."
        description="These pieces establish the editorial lens: specific over broad, useful over polished, reflective over hypey."
      />

      <div className="grid gap-6">
        {stories.map((story) => (
          <StoryCard key={story.slug} story={story} />
        ))}
      </div>
    </div>
  );
}
