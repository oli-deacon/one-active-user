import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TagChip } from "@/components/ui/tag-chip";
import { formatPublishedDate, getAllBuilds, getBuildBySlug } from "@/lib/content";
import { MdxContent } from "@/lib/mdx";

export async function generateStaticParams() {
  const builds = await getAllBuilds();
  return builds.map((build) => ({ slug: build.slug }));
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.6rem] border border-[var(--line)] bg-white/65 p-6">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--muted)]">{title}</p>
      <div className="mt-4 text-base leading-7 text-[var(--foreground)]">{children}</div>
    </section>
  );
}

export default async function BuildPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const build = await getBuildBySlug(slug);

  if (!build) {
    notFound();
  }

  return (
    <article className="pb-16 pt-10">
      <div className="max-w-4xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Build</p>
        <h1 className="mt-5 text-4xl leading-tight text-[var(--foreground)] sm:text-6xl">
          {build.name}
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-9 text-[var(--muted)]">{build.summary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
          <span>{formatPublishedDate(build.publishedAt)}</span>
          <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
          <span>{build.author}</span>
          <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
          <span>{build.currentStatus}</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {build.tags.map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <DetailSection title="What it is">{build.summary}</DetailSection>
        <DetailSection title="Friction">{build.friction}</DetailSection>
        <DetailSection title="Why existing tools were not enough">
          {build.whyExistingToolsWereNotEnough}
        </DetailSection>
        <DetailSection title="Who it is for">{build.whoItIsFor}</DetailSection>
        <DetailSection title="How it was built">{build.howItWasBuilt}</DetailSection>
        <DetailSection title="How it is used now">{build.howItIsUsedNow}</DetailSection>
      </div>

      <div className="mt-6">
        <DetailSection title="Current status">{build.currentStatus}</DetailSection>
      </div>

      {build.screenshots && build.screenshots.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl text-[var(--foreground)]">Screenshots</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {build.screenshots.map((image, index) => (
              <div
                key={image}
                className="overflow-hidden rounded-[1.6rem] border border-[var(--line)] bg-white/75"
              >
                <Image
                  src={image}
                  alt={`${build.name} screenshot ${index + 1}`}
                  width={1200}
                  height={800}
                  className="h-auto w-full"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {build.externalLink ? (
        <div className="mt-10">
          <Link
            href={build.externalLink}
            className="inline-flex rounded-full bg-[var(--foreground)] px-6 py-3 text-sm text-[var(--background)]"
          >
            Visit the project
          </Link>
        </div>
      ) : null}

      <div className="prose mt-12 max-w-3xl">
        <MdxContent source={build.body} />
      </div>
    </article>
  );
}
