import Image from "next/image";
import Link from "next/link";

import { formatPublishedDate } from "@/lib/content";
import type { Build, Story } from "@/lib/types";

type ButtonProps = {
  href: string;
  variant?: "primary" | "secondary" | "light";
  children: React.ReactNode;
};

type HeroProofPanelProps = {
  buildCount: number;
  storyCount: number;
  featuredStory: Story | null;
};

type PrincipleCardProps = {
  index: string;
  title: string;
  description: string;
};

type FeaturedBuildShowcaseProps = {
  build: Build;
};

type BuildListCardProps = {
  build: Build;
};

type StorySpotlightProps = {
  story: Story;
};

export function Button({ href, variant = "primary", children }: ButtonProps) {
  const className =
    variant === "primary"
      ? "border border-[rgba(123,96,75,0.18)] bg-[rgba(124,99,78,0.82)] text-[rgba(255,248,240,0.98)] shadow-[0_14px_40px_rgba(74,52,37,0.12)] hover:bg-[rgba(124,99,78,0.92)]"
      : variant === "light"
        ? "bg-[var(--background)] text-[var(--foreground)] hover:bg-[rgba(246,241,232,0.92)]"
      : "border border-[var(--line-strong)] bg-white/70 text-[var(--foreground)] hover:border-[rgba(23,20,17,0.34)] hover:bg-white";

  return (
    <Link
      href={href}
      className={`focus-ring inline-flex items-center justify-center rounded-full px-6 py-3 text-sm transition ${className}`}
    >
      {children}
    </Link>
  );
}

export function HeroProofPanel({
  buildCount,
  storyCount,
  featuredStory,
}: HeroProofPanelProps) {
  return (
    <aside className="home-reveal rounded-[2rem] border border-[var(--line)] bg-[rgba(255,250,244,0.78)] p-7 shadow-[0_24px_80px_rgba(48,34,24,0.08)] backdrop-blur sm:p-8 lg:mt-8">
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
            Builds published
          </p>
          <p className="mt-2 text-3xl leading-none text-[var(--foreground)]">{buildCount}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
            Essays and stories
          </p>
          <p className="mt-2 text-3xl leading-none text-[var(--foreground)]">{storyCount}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
            Standard
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
            One active user is already enough to make software consequential.
          </p>
        </div>
      </div>

      {featuredStory ? (
        <div className="mt-8 border-t border-[var(--line)] pt-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
            Featured reading
          </p>
          <p className="mt-4 text-2xl leading-9 text-[var(--foreground)]">
            “{featuredStory.excerpt}”
          </p>
          <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            <span>{formatPublishedDate(featuredStory.publishedAt)}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
            <span>{featuredStory.author}</span>
          </div>
          <Link
            href={featuredStory.url}
            className="mt-6 inline-flex text-sm text-[var(--accent)] transition hover:text-[var(--foreground)]"
          >
            Read the editorial →
          </Link>
        </div>
      ) : null}
    </aside>
  );
}

export function PrincipleCard({ index, title, description }: PrincipleCardProps) {
  return (
    <article className="home-reveal rounded-[1.75rem] border border-[var(--line)] bg-white/58 p-6 shadow-[0_18px_60px_rgba(48,34,24,0.05)] backdrop-blur sm:p-7">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
        {index}
      </p>
      <h3 className="mt-6 text-2xl leading-tight text-[var(--foreground)]">{title}</h3>
      <p className="mt-4 text-base leading-7 text-[var(--muted)]">{description}</p>
    </article>
  );
}

export function FeaturedBuildShowcase({ build }: FeaturedBuildShowcaseProps) {
  const [leadScreenshot, supportingScreenshot] = build.screenshots ?? [];

  return (
    <article className="home-reveal overflow-hidden rounded-[2.2rem] border border-[rgba(245,232,214,0.12)] bg-[var(--foreground)] text-[var(--background)] shadow-[0_28px_120px_rgba(31,27,24,0.2)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)]">
        <div className="p-7 sm:p-10">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-[rgba(246,241,232,0.64)]">
            <span>Featured build</span>
            <span className="h-1 w-1 rounded-full bg-[rgba(246,241,232,0.4)]" />
            <span>{formatPublishedDate(build.publishedAt)}</span>
          </div>
          <h2 className="mt-5 max-w-xl text-4xl leading-[1.02] sm:text-5xl">{build.name}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[rgba(246,241,232,0.76)]">
            {build.summary}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[rgba(245,232,214,0.14)] bg-[rgba(255,255,255,0.04)] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[rgba(246,241,232,0.56)]">
                Friction
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgba(246,241,232,0.82)]">
                {build.friction}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[rgba(245,232,214,0.14)] bg-[rgba(255,255,255,0.04)] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[rgba(246,241,232,0.56)]">
                Why it matters
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgba(246,241,232,0.82)]">
                {build.whoItIsFor}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href={build.url} variant="light">
              Open the build
            </Button>
            <p className="text-sm text-[rgba(246,241,232,0.64)]">{build.currentStatus}</p>
          </div>
        </div>

        <div className="border-t border-[rgba(245,232,214,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.08))] p-4 sm:p-5 lg:border-t-0 lg:border-l">
          {leadScreenshot ? (
            <div className="overflow-hidden rounded-[1.5rem] border border-[rgba(245,232,214,0.12)] bg-black/20">
              <Image
                src={leadScreenshot}
                alt={`${build.name} screenshot`}
                width={1280}
                height={900}
                className="h-full w-full object-cover object-top"
                priority
              />
            </div>
          ) : (
            <div className="flex min-h-[18rem] items-end rounded-[1.5rem] border border-[rgba(245,232,214,0.12)] bg-[radial-gradient(circle_at_top_left,rgba(186,114,90,0.5),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6">
              <p className="max-w-xs text-sm leading-6 text-[rgba(246,241,232,0.78)]">
                A narrow tool can still deserve careful design when it gets opened again
                tomorrow.
              </p>
            </div>
          )}

          {supportingScreenshot ? (
            <div className="mt-4 overflow-hidden rounded-[1.35rem] border border-[rgba(245,232,214,0.12)] bg-black/15">
              <Image
                src={supportingScreenshot}
                alt={`${build.name} supporting screenshot`}
                width={1280}
                height={900}
                className="h-auto w-full object-cover object-top"
              />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function BuildListCard({ build }: BuildListCardProps) {
  return (
    <article className="home-reveal rounded-[1.6rem] border border-[var(--line)] bg-[rgba(255,250,244,0.7)] p-6 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(48,34,24,0.08)]">
      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
        <span>{formatPublishedDate(build.publishedAt)}</span>
        <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
        <span>{build.tags.slice(0, 2).join(" / ")}</span>
      </div>
      <h3 className="mt-4 text-2xl leading-tight text-[var(--foreground)]">
        <Link href={build.url} className="transition hover:text-[var(--accent)]">
          {build.name}
        </Link>
      </h3>
      <p className="mt-3 text-base leading-7 text-[var(--muted)]">{build.summary}</p>
      <p className="mt-5 border-l-2 border-[var(--accent-soft)] pl-4 text-sm leading-6 text-[var(--foreground)]">
        {build.friction}
      </p>
    </article>
  );
}

export function StorySpotlight({ story }: StorySpotlightProps) {
  return (
    <section className="home-reveal grid gap-8 rounded-[2.2rem] border border-[var(--line)] bg-[rgba(255,252,248,0.74)] p-8 shadow-[0_18px_60px_rgba(48,34,24,0.06)] backdrop-blur lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-12 sm:p-10">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
          From the manifesto
        </p>
        <h2 className="mt-5 text-3xl leading-tight text-[var(--foreground)] sm:text-4xl">
          The site is not just cataloguing tools. It is arguing for a different threshold of what
          software is worth making.
        </h2>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          <span>{formatPublishedDate(story.publishedAt)}</span>
          <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
          <span>{story.author}</span>
        </div>
        <h3 className="mt-4 text-3xl leading-tight text-[var(--foreground)]">{story.title}</h3>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{story.excerpt}</p>
        <Link
          href={story.url}
          className="mt-6 inline-flex text-sm text-[var(--accent)] transition hover:text-[var(--foreground)]"
        >
          Read the essay →
        </Link>
      </div>
    </section>
  );
}

export function SubmissionPanel() {
  return (
    <section className="home-reveal overflow-hidden rounded-[2.2rem] border border-[var(--line-strong)] bg-[linear-gradient(135deg,rgba(255,249,242,0.92),rgba(243,232,219,0.96))] px-8 py-10 shadow-[0_24px_90px_rgba(48,34,24,0.08)] sm:px-10 sm:py-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
            Contribute
          </p>
          <h2 className="mt-4 max-w-2xl text-4xl leading-tight text-[var(--foreground)] sm:text-5xl">
            Built something precise, useful, and a little bit personal?
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Share the tool, workflow, or story behind it. It does not need polish or scale. It
            needs a real fit with someone&apos;s life.
          </p>
        </div>

        <div className="rounded-[1.6rem] border border-[rgba(31,27,24,0.12)] bg-white/55 p-6">
          <p className="text-sm leading-7 text-[var(--foreground)]">
            We are especially interested in builds that solved recurring friction, encoded a
            personal rule set, or made a narrow routine feel lighter.
          </p>
          <div className="mt-6">
            <Button href="/submit">Submit your tool</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
