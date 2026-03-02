// ORPHAN COMPONENT — not currently imported. Pending CEO decision on removal.
/**
 * Tag cloud pills for rising_keywords. Display-only, hover brightens.
 * Section 4 Social Proof.
 */
export function TagCloud({ keywords }: { keywords: string[] }) {
  if (!keywords?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((kw) => (
        <span
          key={kw}
          className="rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-400 border border-blue-500/30 transition-colors hover:bg-blue-500/30 hover:text-blue-300 hover:border-blue-500/50"
        >
          {kw.trim()}
        </span>
      ))}
    </div>
  );
}
