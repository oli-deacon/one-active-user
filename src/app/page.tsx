import {
  BuildListCard,
  Button,
  FeaturedBuildShowcase,
  HeroProofPanel,
  PrincipleCard,
  StorySpotlight,
  SubmissionPanel,
} from "@/components/home/home-sections";
import { getAllBuilds, getAllStories, getFeaturedBuilds, getFeaturedStory } from "@/lib/content";

const principles = [
  {
    index: "01",
    title: "Software shaped by a real routine",
    description:
      "The best examples here begin with repeated friction: packing for a run, arriving in a city, reading a training block, or handling some oddly specific household job.",
  },
  {
    index: "02",
    title: "Specificity over product theatre",
    description:
      "We care more about fit than scale. A narrow tool with a clear point of view is more interesting than a generic app pretending to be a category.",
  },
  {
    index: "03",
    title: "Proof over hype",
    description:
      "Real screenshots, real constraints, real habits, and real stories about why existing tools were not enough.",
  },
] as const;

export default async function HomePage() {
  const [allBuilds, allStories, featuredBuilds, featuredStory] = await Promise.all([
    getAllBuilds(),
    getAllStories(),
    getFeaturedBuilds(3),
    getFeaturedStory(),
  ]);

  const [leadBuild, ...supportingBuilds] = featuredBuilds;

  return (
    <div className="pb-16">
      <section className="relative py-10 sm:py-14 lg:py-20">
        <div className="absolute inset-x-0 top-8 -z-10 h-[32rem] rounded-[3rem] bg-[radial-gradient(circle_at_top_left,rgba(164,91,66,0.18),transparent_40%),radial-gradient(circle_at_top_right,rgba(108,126,101,0.16),transparent_28%),linear-gradient(180deg,rgba(255,252,248,0.78),rgba(255,252,248,0))]" />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(19rem,0.8fr)] lg:items-start lg:gap-14">
          <div className="max-w-5xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Personal software, documented like it matters
            </p>
            <h1 className="home-reveal mt-5 max-w-5xl text-5xl leading-[0.96] text-[var(--foreground)] sm:text-7xl lg:text-[5.4rem]">
              Software that fits a life,
              <br />
              not a market.
            </h1>
            <p className="home-reveal mt-6 max-w-3xl text-xl leading-9 text-[var(--muted)]">
              One Active User is a home for tools, essays, and build notes from people making
              software around the routines they actually live with.
            </p>
            <div className="home-reveal mt-10 flex flex-wrap gap-4">
              <Button href="/about">Read the manifesto</Button>
              <Button href="/builds" variant="secondary">
                Browse builds
              </Button>
            </div>
          </div>

          <HeroProofPanel
            buildCount={allBuilds.length}
            storyCount={allStories.length}
            featuredStory={featuredStory}
          />
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-12">
          <div className="home-reveal max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              What belongs here
            </p>
            <h2 className="mt-5 text-4xl leading-tight text-[var(--foreground)] sm:text-5xl">
              A field guide to precise, hand-built software.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
              This is for tools that became useful because they were personal, not despite it. The
              site should feel closer to an editorial notebook than a startup landing page.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-1">
            {principles.map((principle) => (
              <PrincipleCard
                key={principle.index}
                index={principle.index}
                title={principle.title}
                description={principle.description}
              />
            ))}
          </div>
        </div>
      </section>

      {leadBuild ? (
        <section id="builds" className="py-10 sm:py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="home-reveal max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                Build proof
              </p>
              <h2 className="mt-4 text-4xl leading-tight text-[var(--foreground)] sm:text-5xl">
                Real tools with credible texture.
              </h2>
            </div>
            <Button href="/builds" variant="secondary">
              See all builds
            </Button>
          </div>

          <div className="mt-8">
            <FeaturedBuildShowcase build={leadBuild} />
          </div>

          {supportingBuilds.length > 0 ? (
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {supportingBuilds.map((build) => (
                <BuildListCard key={build.slug} build={build} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {featuredStory ? (
        <section className="py-10 sm:py-14">
          <StorySpotlight story={featuredStory} />
        </section>
      ) : null}

      <section className="py-10 sm:py-14">
        <SubmissionPanel />
      </section>
    </div>
  );
}
