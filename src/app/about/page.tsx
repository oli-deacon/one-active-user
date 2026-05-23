import { PageIntro } from "@/components/ui/page-intro";

export default function AboutPage() {
  return (
    <div className="pb-16">
      <PageIntro
        eyebrow="Manifesto"
        title="Software does not need a market to be worth building."
        description="One Active User is a home for personal software: tools, stories, and ideas shaped by lived friction rather than startup ambition."
      />

      <div className="prose max-w-3xl">
        <p>
          Most software spaces reward scale, polish, and startup potential. This one rewards
          specificity, usefulness, honesty, and personal fit.
        </p>
        <p>
          Personal software begins with recurring friction in someone&apos;s actual life. It might be a
          clumsy planning workflow, an annoying gap between existing products, or a daily ritual
          that deserves a tool shaped around it precisely.
        </p>
        <h2>Why now</h2>
        <p>
          More people can build software than ever before. The interesting question is not whether
          they can launch a startup. It is whether they can build something that truly earns its
          keep in their own life.
        </p>
        <h2>What belongs here</h2>
        <ul>
          <li>Tools built in response to lived friction</li>
          <li>Essays and reflections about personal software</li>
          <li>Examples that are specific, useful, and quietly revealing</li>
        </ul>
        <h2>What this is not</h2>
        <ul>
          <li>An AI toy gallery</li>
          <li>A generic indie maker launch board</li>
          <li>A place where scale is the default measure of worth</li>
        </ul>
        <blockquote>
          Before publishing, the editorial test is simple: does this feel like software made in
          response to lived friction?
        </blockquote>
        <p>
          If the answer is yes, it probably belongs. If the answer is no, it may be interesting,
          but it is probably for somewhere else.
        </p>
      </div>
    </div>
  );
}
