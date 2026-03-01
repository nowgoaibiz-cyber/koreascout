type CountryPrice = {
  platform?: string | null;
  price_original?: string | null;
  url?: string | null;
};

type GlobalPrices =
  | {
      us?: CountryPrice;
      uk?: CountryPrice;
      sea?: CountryPrice;
      au?: CountryPrice;
      india?: CountryPrice;
      [key: string]: CountryPrice | undefined;
    }
  | null
  | undefined;

type Tier = "free" | "standard" | "alpha";

interface GlobalPricingTableProps {
  prices: GlobalPrices;
  tier: Tier;
  isTeaser: boolean;
  sourcingTip?: string | null;
}

function normalizePrice(p?: CountryPrice | null): CountryPrice | null {
  if (!p) return null;
  const platform = p.platform ?? null;
  const price_original = p.price_original ?? null;
  const url = p.url ?? null;
  if (!platform && !price_original && !url) return null;
  return { platform, price_original, url };
}

function isZeroOrNoPrice(price: string | null | undefined): boolean {
  if (!price || typeof price !== "string") return true;
  const t = price.trim();
  return t === "" || t === "$0" || t === "0";
}

export function GlobalPricingTable({ prices, tier, isTeaser, sourcingTip }: GlobalPricingTableProps) {
  if (!prices || typeof prices !== "object") return null;

  const rows = [
    { key: "us", label: "US", flag: "🇺🇸" },
    { key: "uk", label: "UK", flag: "🇬🇧" },
    { key: "sea", label: "SEA", flag: "🇸🇬" },
    { key: "au", label: "AU", flag: "🇦🇺" },
    { key: "india", label: "IN", flag: "🇮🇳" },
  ]
    .map((def) => {
      const raw = (prices as Record<string, CountryPrice | undefined>)[def.key];
      const normalized = normalizePrice(raw ?? null);
      return normalized
        ? {
            ...def,
            ...normalized,
          }
        : null;
    })
    .filter(Boolean) as Array<{
    key: string;
    label: string;
    flag: string;
    platform?: string | null;
    price_original?: string | null;
    url?: string | null;
  }>;

  if (rows.length === 0) return null;

  const canSeeLinks = tier === "alpha" || isTeaser;

  return (
    <section className="rounded-xl border border-white/10 bg-[var(--bg-card)] p-6">
      <h2 className="font-[family-name:var(--font-syne)] text-lg font-bold text-white mb-3">Global Pricing Matrix</h2>

      {sourcingTip?.trim() && (
        <p className="mb-4 text-sm italic text-white/80 flex items-start gap-2">
          <span aria-hidden>💡</span>
          <span>{sourcingTip}</span>
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/30">
        <table className="min-w-full text-sm">
          <thead className="bg-white/[0.03]">
            <tr className="text-left">
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/60">Country</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/60">Platform</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/60">Price</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/60">Link</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.key} className={idx % 2 === 0 ? "bg-white/[0.01]" : ""}>
                <td className="px-3 py-2 whitespace-nowrap text-white/80">
                  <span className="mr-1" aria-hidden>
                    {row.flag}
                  </span>
                  <span>{row.label}</span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-white/80">
                  {row.platform || <span className="text-white/30">—</span>}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-white/80">
                  {!isZeroOrNoPrice(row.price_original) ? (
                    row.price_original
                  ) : (
                    <span className="text-white/70" title="Blue Ocean, no sellers found">🔵</span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.url ? (
                    canSeeLinks ? (
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline text-xs font-medium"
                      >
                        🔗 Visit →
                      </a>
                    ) : (
                      <span className="blur-sm text-gray-500 select-none inline-block">🔒 ██████</span>
                    )
                  ) : (
                    <span className="text-white/30 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-white/40">
        🔵 = Blue Ocean, no sellers found
      </p>
    </section>
  );
}

