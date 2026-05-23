import { PageIntro } from "@/components/ui/page-intro";
import { SubmitForm } from "@/components/submit/submit-form";

export default function SubmitPage() {
  return (
    <div className="pb-16">
      <PageIntro
        eyebrow="Submit"
        title="Send a build or story for editorial review."
        description="This is a curated submission process, not instant self-publishing. Clear thinking beats polished language."
      />

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-[var(--line)] bg-white/65 p-6">
            <h2 className="text-2xl text-[var(--foreground)]">What we are looking for</h2>
            <ul className="mt-5 space-y-3 text-base leading-7 text-[var(--muted)]">
              <li>Specific tools that arose from recurring personal friction</li>
              <li>Reflections or essays that deepen the idea of personal software</li>
              <li>Grounded examples rather than polished product narratives</li>
            </ul>
          </section>
          <section className="rounded-[2rem] border border-[var(--line)] bg-white/65 p-6">
            <h2 className="text-2xl text-[var(--foreground)]">Before you send</h2>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              Ask the editorial question: does this feel like software made in response to lived
              friction? If yes, it is likely a fit.
            </p>
          </section>
        </div>
        <SubmitForm />
      </div>
    </div>
  );
}
