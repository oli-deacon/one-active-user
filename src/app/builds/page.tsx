import { BuildCard } from "@/components/content/build-card";
import { PageIntro } from "@/components/ui/page-intro";
import { getAllBuilds } from "@/lib/content";

export default async function BuildsPage() {
  const builds = await getAllBuilds();

  return (
    <div className="pb-16">
      <PageIntro
        eyebrow="Builds"
        title="Practical examples of personal software in the wild."
        description="A small collection of tools shaped by specific routines, constraints, and repeated use."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {builds.map((build) => (
          <BuildCard key={build.slug} build={build} />
        ))}
      </div>
    </div>
  );
}
