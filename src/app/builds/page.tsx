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
        description="Each build profile makes the friction explicit: what problem kept showing up, why existing tools were not enough, and how the resulting software earns its keep."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {builds.map((build) => (
          <BuildCard key={build.slug} build={build} />
        ))}
      </div>
    </div>
  );
}
