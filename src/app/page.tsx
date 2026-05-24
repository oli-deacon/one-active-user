import {
  Button,
  CategoryCard,
  FeaturedBuildCard,
  HomeBuildCard,
  SectionHeader,
  SubmissionPanel,
} from "@/components/home/home-sections";
import { siteConfig } from "@/lib/site";

const categories = [
  {
    title: "Tiny tools",
    description:
      "Personal apps and workflows built to remove small pieces of everyday friction.",
  },
  {
    title: "Build stories",
    description:
      "Notes from people who made something useful for themselves and what they learned along the way.",
  },
  {
    title: "Practical ideas",
    description:
      "Patterns, prompts, and approaches others can borrow, adapt, or build on.",
  },
] as const;

const latestBuilds = [
  {
    tag: "Personal utility",
    title: "A running kit tracker",
    description:
      "A simple way to remember what worked on long runs, wet trails, cold starts, and race days.",
  },
  {
    tag: "Home life",
    title: "A family logistics dashboard",
    description:
      "A lightweight view of school events, meals, pickups, and the week ahead.",
  },
  {
    tag: "Travel",
    title: "A travel briefing app",
    description:
      "A personal guide for useful phrases, airport transfers, etiquette, and practical arrival details.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="pb-16">
      <section className="py-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.95fr)] lg:items-start lg:gap-14">
          <div className="max-w-4xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Personal software, curated carefully
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl leading-[1.02] text-[var(--foreground)] sm:text-7xl">
              {siteConfig.tagline}
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-[var(--muted)]">
              Small tools, practical stories, and ideas from people making software for the lives
              they actually live.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/about">Read the manifesto</Button>
              <Button href="/builds" variant="secondary">
                Browse builds
              </Button>
            </div>
          </div>
          <FeaturedBuildCard />
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <SectionHeader
          title="What lives here"
          description="A calm place for software shaped by real routines, useful constraints, and the details of everyday life."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              description={category.description}
            />
          ))}
        </div>
      </section>

      <section id="builds" className="py-10 sm:py-12">
        <SectionHeader
          title="Latest builds"
          description="A small selection of personal software people are building for themselves."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestBuilds.map((build) => (
            <HomeBuildCard
              key={build.title}
              tag={build.tag}
              title={build.title}
              description={build.description}
            />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <SubmissionPanel />
      </section>
    </div>
  );
}
