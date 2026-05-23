import Link from "next/link";

import { BuildCard } from "@/components/content/build-card";
import { StoryCard } from "@/components/content/story-card";
import { getFeaturedBuilds, getFeaturedStory } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default async function HomePage() {
  const [featuredStory, featuredBuilds] = await Promise.all([
    getFeaturedStory(),
    getFeaturedBuilds(3),
  ]);

  return (
    <div className="pb-16">
      <section className="grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:py-20">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Personal software, curated carefully
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl leading-[1.02] text-[var(--foreground)] sm:text-7xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-9 text-[var(--muted)]">
            {siteConfig.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/about"
              className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm text-[var(--background)] transition hover:opacity-92"
            >
              Read the manifesto
            </Link>
            <Link
              href="/submit"
              className="rounded-full border border-[var(--line)] bg-white/70 px-6 py-3 text-sm text-[var(--foreground)] transition hover:border-[var(--foreground)]"
            >
              Submit your tool
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,241,231,0.72))] p-8 shadow-[0_25px_90px_rgba(50,38,26,0.08)]">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            What counts here
          </p>
          <ul className="mt-5 space-y-4 text-lg leading-8 text-[var(--foreground)]">
            {siteConfig.whatCounts.map((item) => (
              <li key={item} className="border-b border-[var(--line)] pb-4 last:border-none">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {featuredStory ? (
        <section className="py-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                Featured story
              </p>
              <h2 className="mt-3 text-3xl text-[var(--foreground)]">A philosophy worth building around</h2>
            </div>
            <Link href="/stories" className="text-sm text-[var(--accent)]">
              Browse all stories
            </Link>
          </div>
          <StoryCard story={featuredStory} featured />
        </section>
      ) : null}

      <section className="py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              Featured builds
            </p>
            <h2 className="mt-3 text-3xl text-[var(--foreground)]">
              Specific tools for specific friction
            </h2>
          </div>
          <Link href="/builds" className="text-sm text-[var(--accent)]">
            Explore the builds
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {featuredBuilds.map((build) => (
            <BuildCard key={build.slug} build={build} />
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] px-8 py-10 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
          A clear invitation
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl leading-tight text-[var(--foreground)] sm:text-4xl">
          If you have built something narrow, useful, and personally earned, it probably belongs
          here.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          The point is not scale. The point is fit: software that met recurring friction in a way
          generic tools could not.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/submit" className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm text-white">
            Submit a build or story
          </Link>
          <Link href="/about" className="rounded-full border border-[var(--line)] px-6 py-3 text-sm">
            Learn what belongs here
          </Link>
        </div>
      </section>
    </div>
  );
}
