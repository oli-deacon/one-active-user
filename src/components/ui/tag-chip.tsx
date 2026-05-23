type TagChipProps = {
  tag: string;
};

export function TagChip({ tag }: TagChipProps) {
  return (
    <span className="inline-flex rounded-full border border-[var(--line)] bg-white/65 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
      {tag}
    </span>
  );
}
