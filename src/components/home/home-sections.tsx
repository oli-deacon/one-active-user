import Link from "next/link";

type ButtonProps = {
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
};

type SectionHeaderProps = {
  title: string;
  description: string;
};

type CategoryCardProps = {
  title: string;
  description: string;
};

type HomeBuildCardProps = {
  tag: string;
  title: string;
  description: string;
};

export function Button({ href, variant = "primary", children }: ButtonProps) {
  const className =
    variant === "primary"
      ? "bg-[var(--accent)] text-white hover:opacity-95"
      : "border border-[var(--line)] bg-white/75 text-[var(--foreground)] hover:border-[rgba(31,27,24,0.28)] hover:bg-white";

  return (
    <Link
      href={href}
      className={`focus-ring inline-flex items-center justify-center rounded-full px-6 py-3 text-sm transition ${className}`}
    >
      {children}
    </Link>
  );
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      <h2 className="text-3xl leading-tight text-[var(--foreground)] sm:text-4xl">{title}</h2>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">{description}</p>
    </div>
  );
}

export function FeaturedBuildCard() {
  return (
    <aside className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-8 shadow-[0_18px_45px_rgba(50,38,26,0.05)] backdrop-blur sm:p-10 lg:mt-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
        Featured build
      </p>
      <p className="mt-5 text-2xl leading-10 text-[var(--foreground)]">
        A tiny app for planning weekly meals around school nights, late meetings, and the food
        already in the fridge.
      </p>
      <p className="mt-6 text-sm uppercase tracking-[0.18em] text-[var(--muted)]">
        Built by one active user
      </p>
    </aside>
  );
}

export function CategoryCard({ title, description }: CategoryCardProps) {
  return (
    <article className="rounded-[2rem] border border-[var(--line)] bg-white/55 p-7 backdrop-blur sm:p-8">
      <h3 className="text-2xl text-[var(--foreground)]">{title}</h3>
      <p className="mt-4 text-base leading-7 text-[var(--muted)]">{description}</p>
    </article>
  );
}

export function HomeBuildCard({ tag, title, description }: HomeBuildCardProps) {
  return (
    <article className="rounded-[2rem] border border-[var(--line)] bg-white/68 p-7 shadow-[0_20px_60px_rgba(50,38,26,0.05)] backdrop-blur sm:p-8">
      <p className="inline-flex rounded-full border border-[var(--line)] bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[rgba(31,27,24,0.72)]">
        {tag}
      </p>
      <h3 className="mt-5 text-2xl text-[var(--foreground)]">{title}</h3>
      <p className="mt-4 text-base leading-7 text-[var(--muted)]">{description}</p>
    </article>
  );
}

export function SubmissionPanel() {
  return (
    <section className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] px-8 py-10 shadow-[0_18px_45px_rgba(50,38,26,0.04)] sm:px-10">
      <SectionHeader
        title="Built something small for yourself?"
        description="Share the tool, workflow, or story behind it. It does not need to be polished. It just needs to be useful to you."
      />
      <div className="mt-8">
        <Button href="/submit">Submit your tool</Button>
      </div>
    </section>
  );
}
