type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <section className="max-w-3xl py-10 sm:py-16">
      {eyebrow ? (
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-4 text-4xl leading-tight font-medium text-[var(--foreground)] sm:text-6xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">{description}</p>
    </section>
  );
}
