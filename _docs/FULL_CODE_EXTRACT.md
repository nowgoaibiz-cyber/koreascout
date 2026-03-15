# Full Code Extract

아래 7개 파일의 전체 코드를 한 글자도 빠짐없이 추출한 문서입니다.

---

### components/report/utils.ts

```ts
import { SHIPPING_TIER_TOOLTIP } from "./constants";

const GLOBAL_REGIONS = [
  { key: "us", flag: "🇺🇸", label: "US" },
  { key: "uk", flag: "🇬🇧", label: "UK" },
  { key: "sea", flag: "🇸🇬", label: "SEA" },
  { key: "eu", flag: "🇪🇺", label: "EU" },
  { key: "jp", flag: "🇯🇵", label: "JP" },
  { key: "uae", flag: "🇦🇪", label: "UAE" },
] as const;

export function formatHsCode(raw: string | null | undefined): string {
  const s = raw?.trim().replace(/\D/g, "") ?? "";
  if (s.length === 6) return `${s.slice(0, 4)}.${s.slice(4)}`;
  return raw?.trim() ?? "";
}

export function describeShippingTier(
  tier: string | null | undefined
): { description: string; tooltip: string } {
  const t = tier?.trim().toLowerCase() ?? "";
  const tooltip = SHIPPING_TIER_TOOLTIP;
  if (t.includes("1") || t.includes("light") || t.includes("lightweight") || t.includes("<500"))
    return { description: "Tier 1: Lightweight packet (< 500g)", tooltip };
  if (t.includes("2") || t.includes("500") || t.includes("2kg") || t.includes("standard"))
    return { description: "Tier 2: 500g–2kg", tooltip };
  if (t.includes("3") || t.includes("heavy") || t.includes("2kg+") || t.includes("freight"))
    return { description: "Tier 3: 2kg+", tooltip };
  if (t) return { description: tier!.trim(), tooltip };
  return { description: "", tooltip };
}

export function safeParsePlatformScores(
  raw: unknown
): Record<string, { score?: number; sentiment?: string }> | null {
  if (!raw) return null;
  try {
    let parsed = raw;
    if (typeof parsed === "string") parsed = JSON.parse(parsed);
    if (typeof parsed === "string") parsed = JSON.parse(parsed);
    if (typeof parsed === "object" && parsed !== null)
      return parsed as Record<string, { score?: number; sentiment?: string }>;
    return null;
  } catch {
    return null;
  }
}

export function normalizeToArray(raw: unknown): string[] {
  if (!raw) return [];
  let str = "";
  if (Array.isArray(raw)) {
    str = raw.map(String).join(",");
  } else if (typeof raw === "string") {
    str = raw;
  } else {
    return [];
  }
  const cleanStr = str.replace(/[\[\]\\"]/g, "");
  return cleanStr.split(",").map((s) => s.trim()).filter(Boolean);
}

export interface StrategyStep {
  icon: string;
  label: string;
  color: string;
  content: string;
}

export function parseSourcingStrategy(
  raw: string | null | undefined
): StrategyStep[] {
  if (!raw) return [];
  // Language-agnostic: any line that is entirely [ ... ] is a section header
  const headerRegex = /(?:^|\n)\s*\[([^\n]*?)\]/g;
  const matches: { index: number; fullMatch: string; title: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = headerRegex.exec(raw)) !== null) {
    matches.push({ index: m.index, fullMatch: m[0], title: m[1].trim() });
  }
  if (matches.length === 0) {
    if (raw.trim()) {
      return [{ icon: "📋", label: "Strategy Overview", color: "emerald", content: raw.trim() }];
    }
    return [];
  }
  const iconColorList: { icon: string; color: string }[] = [
    { icon: "📈", color: "emerald" },
    { icon: "💰", color: "amber" },
    { icon: "🏭", color: "blue" },
    { icon: "📋", color: "red" },
    { icon: "📦", color: "purple" },
  ];
  const steps: StrategyStep[] = [];
  for (let i = 0; i < matches.length; i++) {
    const startIdx = matches[i].index + matches[i].fullMatch.length;
    const endIdx = matches[i + 1] ? matches[i + 1].index : raw.length;
    const content = raw.slice(startIdx, endIdx).trim();
    const { icon, color } = iconColorList[i % iconColorList.length];
    steps.push({ icon, label: matches[i].title, color, content });
  }
  return steps;
}

export function isPositiveGrowth(s: string | null | undefined): boolean {
  if (!s || typeof s !== "string") return false;
  const t = s.trim();
  return t.startsWith("+") || /^\d/.test(t);
}

export type RegionPriceRow = {
  flag: string;
  label: string;
  priceDisplay: string | null;
  platform?: string | null;
  isBlueOcean: boolean;
  review_data?: string | null;
  seller_type?: string | null;
};

export function parseGlobalPricesForGrid(
  globalPrices: unknown,
  globalPriceText: string | Record<string, unknown> | null | undefined
): RegionPriceRow[] {
  const out: RegionPriceRow[] = [];
  let parsed: Record<string, { price_usd?: number; price_original?: string | number; platform?: string }> | null = null;
  if (globalPrices != null) {
    try {
      let p: unknown = globalPrices;
      if (typeof p === "string") p = JSON.parse(p);
      if (typeof p === "string") p = JSON.parse(p);
      if (p && typeof p === "object" && !Array.isArray(p))
        parsed = p as Record<string, { price_usd?: number; price_original?: string | number; platform?: string }>;
    } catch {
      // ignore
    }
  }
  if (parsed) {
    type MarketData = { price_usd?: number; price_original?: string | number; platform?: string; review_data?: string | null; seller_type?: string | null };
    const hasGroupKeys = "us_uk_eu" in parsed || "jp_sea" in parsed || "uae" in parsed;
    const flat: Record<string, MarketData | undefined> = hasGroupKeys
      ? {
          us: (parsed as Record<string, { us?: MarketData; uk?: MarketData; eu?: MarketData }>)["us_uk_eu"]?.us,
          uk: (parsed as Record<string, { us?: MarketData; uk?: MarketData; eu?: MarketData }>)["us_uk_eu"]?.uk,
          eu: (parsed as Record<string, { us?: MarketData; uk?: MarketData; eu?: MarketData }>)["us_uk_eu"]?.eu,
          jp: (parsed as Record<string, { jp?: MarketData; sea?: MarketData }>)["jp_sea"]?.jp,
          sea: (parsed as Record<string, { jp?: MarketData; sea?: MarketData }>)["jp_sea"]?.sea,
          uae: (parsed as Record<string, { uae?: MarketData }>)["uae"]?.uae,
        }
      : (parsed as Record<string, MarketData>);
    for (const r of GLOBAL_REGIONS) {
      const data = flat[r.key] ?? flat[r.key === "au" ? "australia" : r.key];
      const priceUsd = data?.price_usd;
      const priceOrig = data?.price_original != null ? String(data.price_original).replace(/[$,]/g, "") : "";
      const num = priceUsd != null ? priceUsd : priceOrig ? parseFloat(priceOrig) : NaN;
      const isBlueOcean = Number.isNaN(num) || num === 0;
      const priceDisplay = !isBlueOcean
        ? (typeof data?.price_original === "string"
            ? data.price_original
            : priceUsd != null
              ? `$${priceUsd}`
              : priceOrig
                ? `$${priceOrig}`
                : null)
        : null;
      const review_data = data?.review_data ?? null;
      const seller_type = data?.seller_type ?? null;
      out.push({
        flag: r.flag,
        label: r.label,
        priceDisplay: priceDisplay ?? null,
        platform: data?.platform ?? null,
        isBlueOcean,
        review_data,
        seller_type,
      });
    }
    return out;
  }
  if (typeof globalPriceText === "string" && globalPriceText.trim()) {
    const priceByRegion: Record<string, { priceStr: string; num: number }> = {};
    const segments = globalPriceText.split(" | ");
    for (const segment of segments) {
      const match = segment.trim().match(/(\w+)\(\$(.+)\)/);
      if (!match) continue;
      const [, region, priceStr] = match;
      const num = parseFloat(priceStr);
      const key = region.toUpperCase();
      priceByRegion[key] = { priceStr, num };
    }
    if (Object.keys(priceByRegion).length > 0) {
      for (const r of GLOBAL_REGIONS) {
        const key = r.label.toUpperCase();
        const data = priceByRegion[key] ?? priceByRegion[r.key.toUpperCase()];
        const isBlueOcean = !data || Number.isNaN(data.num) || data.num === 0;
        out.push({
          flag: r.flag,
          label: r.label,
          priceDisplay: !isBlueOcean && data ? `$${data.priceStr}` : null,
          platform: null,
          isBlueOcean,
        });
      }
      return out;
    }
  }
  if (globalPriceText && typeof globalPriceText === "object" && !Array.isArray(globalPriceText)) {
    const gp = globalPriceText as Record<string, string>;
    for (const r of GLOBAL_REGIONS) {
      const v = gp[r.label] ?? gp[r.key] ?? gp[r.key.toUpperCase()];
      const s = typeof v === "string" ? v.trim().replace(/[$,]/g, "") : "";
      const num = s ? parseFloat(s) : NaN;
      const isBlueOcean = Number.isNaN(num) || num === 0;
      out.push({
        flag: r.flag,
        label: r.label,
        priceDisplay: !isBlueOcean && s ? `$${s}` : null,
        platform: null,
        isBlueOcean,
      });
    }
  }
  return out.length > 0 ? out : GLOBAL_REGIONS.map((r) => ({ flag: r.flag, label: r.label, priceDisplay: null, platform: null, isBlueOcean: true }));
}

export function parseGlobalPrices(
  raw: string | Record<string, { url?: string; platform?: string }> | null | undefined
): Record<string, string> | null {
  let obj: Record<string, unknown> | null = null;
  if (raw == null) return null;
  if (typeof raw === "string") {
    try {
      let parsed: unknown = JSON.parse(raw);
      if (typeof parsed === "string") parsed = JSON.parse(parsed);
      obj = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  } else if (typeof raw === "object" && !Array.isArray(raw)) {
    obj = raw as Record<string, unknown>;
  }
  if (!obj) return null;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === "object" && !Array.isArray(v) && "url" in v) {
      const url = (v as { url?: string }).url;
      if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) out[k] = url;
    }
  }
  return Object.keys(out).length ? out : null;
}

export function getAiDetailUrl(
  raw: string | unknown[] | Record<string, unknown> | null | undefined
): string | null {
  if (raw == null) return null;
  if (Array.isArray(raw) && raw.length > 0) {
    const first = raw[0];
    if (typeof first === "string" && (first.startsWith("http://") || first.startsWith("https://"))) return first;
    if (first && typeof first === "object" && "url" in first && typeof (first as { url: string }).url === "string")
      return (first as { url: string }).url;
    return null;
  }
  if (typeof raw === "object" && !Array.isArray(raw) && "url" in raw && typeof (raw as { url: string }).url === "string")
    return (raw as { url: string }).url;
  if (typeof raw === "string") {
    const t = raw.trim();
    if (t.startsWith("http")) return t;
    try {
      const parsed = JSON.parse(t) as unknown;
      if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === "string") return parsed[0];
      if (typeof parsed === "string") return parsed;
    } catch {
      // ignore
    }
  }
  return null;
}

export function formatVerifiedAt(iso: string | null | undefined): string | null {
  if (!iso?.trim()) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return null;
  }
}
```

---

### components/report/MarketIntelligence.tsx

```tsx
"use client";

import { LineChart } from "lucide-react";
import { ScrollToIdButton } from "@/components/ScrollToIdButton";
import { isPositiveGrowth, parseGlobalPricesForGrid } from "./utils";
import type { ScoutFinalReportsRow } from "@/types/database";

export function MarketIntelligence({
  report,
  tier,
  isTeaser,
}: {
  report: ScoutFinalReportsRow;
  tier: "free" | "standard" | "alpha";
  isTeaser: boolean;
}) {
  const estimatedCost = report.estimated_cost_usd ?? null;
  const profitMultiplier = report.profit_multiplier ?? null;
  const rows = parseGlobalPricesForGrid(report.global_prices, report.global_price as string | Record<string, unknown> | null | undefined);

  const pricedRows = rows.filter((r) => !r.isBlueOcean && r.priceDisplay);
  const parsedPrices = pricedRows
    .map((r) => parseFloat(r.priceDisplay?.replace(/[^0-9.]/g, "") ?? ""))
    .filter((n) => !isNaN(n) && n > 0);

  let globalValuation: number | null = null;
  const globalValuationLabel = "Avg. Global Retail";

  if (parsedPrices.length === 1) {
    globalValuation = parsedPrices[0];
  } else if (parsedPrices.length >= 2) {
    globalValuation = parsedPrices.reduce((a, b) => a + b, 0) / parsedPrices.length;
  } else if (estimatedCost && profitMultiplier) {
    globalValuation = estimatedCost * profitMultiplier;
  }

  const globalValuationDisplay = globalValuation ? `~$${globalValuation.toFixed(2)}` : "—";
  const hasProfitBlock = profitMultiplier || estimatedCost || globalValuation;

  const searchVolume = report.search_volume?.trim() || null;
  const momGrowth = report.mom_growth?.trim() || null;
  const wowRate = report.wow_rate?.trim() || null;
  const hasSearchGrowth = searchVolume || momGrowth || wowRate;

  const winningFeature = report.top_selling_point?.trim() || null;
  const painPoint = report.common_pain_point?.trim() || null;

  const isAlpha = tier === "alpha";

  return (
    <section
      id="section-3"
      className="scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]"
    >
      <h2 className="text-3xl font-bold text-[#1A1916] tracking-tight mb-6">
        Market Intelligence
      </h2>

      <div className="space-y-6">

        {hasProfitBlock && (
          <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 mb-6">
            <div style={{ marginBottom: "1.2cm" }}>
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 inline-flex items-center mb-2">
                <p className="text-3xl font-extrabold text-[#16A34A] tracking-tight">
                  🔥 UP TO {String(profitMultiplier ?? "").replace(/[x×]/gi, "")}× MARGIN POTENTIAL
                </p>
              </div>
              <p className="text-base italic text-[#6B6860]">
                *Projected margin based on estimated KR wholesale cost and global market analysis.
              </p>
            </div>

            <div className="grid grid-cols-2">
              <div className="pr-8 border-r border-[#E8E6E1]">
                <p className="text-lg font-bold text-[#6B6860] uppercase tracking-widest" style={{ marginTop: "0.8cm" }}>
                  Est. Wholesale
                </p>
                <p className="text-5xl font-extrabold text-[#1A1916] tracking-tighter" style={{ marginTop: "0.4cm" }}>
                  {estimatedCost ? `~$${estimatedCost}` : "—"}
                </p>
                <p className="text-xs text-[#9E9C98] mt-2">Est. KR Wholesale</p>
                <div style={{ marginTop: "0.6cm" }}>
                  {isAlpha ? (
                    <ScrollToIdButton sectionId="section-6" className="text-base font-bold text-[#16A34A] hover:underline transition-colors">
                      ✓ View Verified Supplier Cost ↓
                    </ScrollToIdButton>
                  ) : (
                    <button disabled className="inline-flex items-center gap-2 text-base font-bold text-[#9E9C98] cursor-not-allowed">
                      🔒 View Verified Supplier Cost
                      <span className="text-[10px] font-bold text-white bg-[#16A34A] rounded-full px-2 py-0.5">Alpha</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="pl-8">
                <p className="text-lg font-bold text-[#6B6860] uppercase tracking-widest" style={{ marginTop: "0.8cm" }}>
                  Global Valuation
                </p>
                <p className="text-5xl font-extrabold text-[#16A34A] tracking-tighter" style={{ marginTop: "0.4cm" }}>
                  {globalValuationDisplay}
                </p>
                {parsedPrices.length >= 1 ? (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-[#16A34A]/80">Verified Market Price</p>
                    <p className="text-xs italic text-[#9E9C98] mt-0.5">Based on real-time commerce data.</p>
                  </div>
                ) : (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-[#16A34A]/80">Estimated Strategic Valuation</p>
                    <p className="text-xs italic text-[#9E9C98] mt-0.5">Calculated via KoreaScout Margin Multiplier.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {(() => {
          const findRow = (label: string) => rows.find((r) => r.label.toLowerCase() === label.toLowerCase());
          const sixMarkets: { code: string; label: string; row: (typeof rows)[number] | null }[] = [
            { code: "US", label: "North America", row: findRow("US") ?? null },
            { code: "UK", label: "United Kingdom", row: findRow("UK") ?? null },
            { code: "EU", label: "European Union", row: findRow("EU") ?? null },
            { code: "JP", label: "Japan", row: findRow("JP") ?? null },
            { code: "SEA", label: "Southeast Asia", row: findRow("SEA") ?? null },
            { code: "UAE", label: "Middle East", row: findRow("UAE") ?? null },
          ];

          return (
            <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 mb-6">
              <div className="flex items-baseline">
                <h3 className="text-xl font-bold text-[#1A1916]">Global Market Availability</h3>
                <span className="text-sm text-[#6B6860] font-normal ml-3">6 Strategic Markets for K-Products</span>
              </div>
              {report.best_platform?.trim() && (
                <p className="text-xs text-[#9E9C98] mt-1">
                  Best Entry: <span className="font-bold text-[#1A1916]">{report.best_platform}</span>
                </p>
              )}
              <div className="grid grid-cols-2 gap-x-16" style={{ marginTop: "1.2cm", rowGap: "1.2cm" }}>
                {sixMarkets.map((market) => {
                  const isUntapped = !market.row || market.row.isBlueOcean;
                  return (
                    <div key={market.code} className="border-l-4 border-[#16A34A] pl-8 py-6 min-h-[150px]">
                      <p className="text-2xl font-extrabold text-[#6B6860] uppercase tracking-widest mb-3">
                        {market.code}
                        <span className="text-sm font-normal normal-case tracking-normal text-[#9E9C98] ml-2">{market.label}</span>
                      </p>
                      <div style={{ marginTop: "0.6cm" }}>
                        {isUntapped ? (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
                              <p className="text-sm font-semibold text-[#16A34A] tracking-widest uppercase">Untapped</p>
                            </div>
                            <p className="text-xs italic text-[#9E9C98]">No established sellers detected.</p>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 rounded-full bg-[#9E9C98]" />
                              <p className="text-xl font-extrabold text-[#1A1916]">{market.row!.priceDisplay}</p>
                            </div>
                            {market.row!.platform && (
                              <p className="text-xs text-[#9E9C98] mt-1">via {market.row!.platform}</p>
                            )}
                            {market.row!.seller_type && market.row!.seller_type.trim() && market.row!.seller_type.trim() !== "Untapped" && (
                              <p className="text-xs text-[#9E9C98] mt-1">{market.row!.seller_type}</p>
                            )}
                            {market.row!.review_data && market.row!.review_data.trim() && market.row!.review_data.trim() !== "Untapped" && (
                              <p className="text-xs text-[#9E9C98] mt-1">{market.row!.review_data}</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: "2.5cm" }}>
                <div className="border-t border-[#E8E6E1] pt-6">
                  <p className="text-base italic text-[#6B6860]">
                    ● Untapped = No established sellers detected. <span className="text-sm">* Data may vary based on real-time market changes.</span>
                  </p>
                  <ScrollToIdButton sectionId="global-market-proof" className="text-base font-bold text-[#16A34A] hover:underline transition-colors block mt-[0.6cm]">
                    Analyze Pricing Sources &amp; Entry Points ↓
                  </ScrollToIdButton>
                </div>
              </div>
            </div>
          );
        })()}

        {(hasSearchGrowth || winningFeature || painPoint) && (
          <div className="bg-[#F8F7F4] rounded-3xl p-12">
            <div className="grid grid-cols-2 gap-x-24 mt-6">
              {hasSearchGrowth && (
                <div>
                  <h3 className="text-xl font-bold text-[#1A1916] mb-12">Search &amp; Growth</h3>
                  {searchVolume && (
                    <div className="mb-16">
                      <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">SEARCH VOLUME</p>
                      <p className="text-4xl font-extrabold text-[#1A1916]">{searchVolume}</p>
                    </div>
                  )}
                  {momGrowth && (
                    <div className="mb-16">
                      <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">MoM GROWTH</p>
                      {momGrowth.length <= 10 ? (
                        <p className={`text-4xl font-extrabold ${isPositiveGrowth(momGrowth) ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                          {momGrowth} <span className="text-3xl">{isPositiveGrowth(momGrowth) ? "↑" : "↓"}</span>
                        </p>
                      ) : (
                        <p className={`text-lg font-medium leading-relaxed ${isPositiveGrowth(momGrowth) ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                          {momGrowth}
                        </p>
                      )}
                    </div>
                  )}
                  {wowRate && wowRate !== "N/A" && (
                    <div className="mb-16">
                      <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">WoW GROWTH</p>
                      {wowRate.length <= 10 ? (
                        <p className={`text-4xl font-extrabold ${isPositiveGrowth(wowRate) ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                          {wowRate} <span className="text-3xl">{isPositiveGrowth(wowRate) ? "↑" : "↓"}</span>
                        </p>
                      ) : (
                        <p className={`text-lg font-medium leading-relaxed ${isPositiveGrowth(wowRate) ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                          {wowRate}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
              {(winningFeature || painPoint) && (
                <div>
                  <h3 className="text-xl font-bold text-[#1A1916] mb-12">Analyst Brief</h3>
                  <div className="border-l-4 border-[#16A34A] pl-8 py-2">
                    {winningFeature && (
                      <div>
                        <p className="text-sm font-bold text-[#6B6860] uppercase tracking-widest mb-4">Competitive Edge</p>
                        <p className="text-lg text-[#1A1916] leading-relaxed mb-16">{winningFeature}</p>
                      </div>
                    )}
                    {painPoint && (
                      <div>
                        <p className="text-sm font-bold text-[#6B6860] uppercase tracking-widest mb-4 mt-8">Risk Factor</p>
                        <p className="text-lg text-[#1A1916] leading-relaxed mb-16">{painPoint}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-[#E8E6E1] pt-6 mt-8" />
            <p className="text-sm italic text-[#6B6860] text-center w-full mt-2">
              Powered by KoreaScout&apos;s proprietary Gap Index engine, synthesizing 50+ cross-border signals across 12 demand variables.
              <br />
              Your sourcing decisions are backed by live market calculations, not a hunch.
            </p>
          </div>
        )}

      </div>

      <div className="mt-6 pt-4 border-t border-[#E8E6E1]/50 flex flex-wrap items-start gap-1.5">
        <LineChart className="w-3 h-3 text-[#9E9C98]/60 shrink-0" />
        <span className="text-[10px] text-[#9E9C98]/60 uppercase tracking-widest font-medium">
          Real-time Market Radar:
        </span>
        <span className="w-full text-[10px] text-[#9E9C98]/50 tracking-wide">
          Americas & Europe — Amazon (US · UK · DE · FR) · Sephora · YesStyle · Stylevana · StyleKorean
        </span>
        <span className="w-full text-[10px] text-[#9E9C98]/50 tracking-wide">
          Japan & Southeast Asia — Qoo10 · Rakuten · @cosme · Shopee · Lazada · Tokopedia
        </span>
        <span className="w-full text-[10px] text-[#9E9C98]/50 tracking-wide">
          Middle East — Amazon AE · Noon · Namshi · Boutiqaat · Carrefour UAE · Olive Young Global · Lamise Beauty
        </span>
      </div>
    </section>
  );
}
```

---

### components/report/TrendSignalDashboard.tsx

```tsx
"use client";

import { DonutGauge } from "@/components/DonutGauge";
import { Badge } from "@/components/ui";
import { Radar, TrendingUp } from "lucide-react";
import type { ScoutFinalReportsRow } from "@/types/database";
import { safeParsePlatformScores } from "./utils";

export function TrendSignalDashboard({ report }: { report: ScoutFinalReportsRow }) {
  const score = typeof report.market_viability === "number" ? report.market_viability : 0;
  const competitionLevel = report.competition_level?.trim() || "—";
  const gapStatus = report.gap_status?.trim() || "—";
  const platformData = safeParsePlatformScores(report.platform_scores);
  const platforms = [
    { key: "tiktok", label: "TikTok" },
    { key: "instagram", label: "Instagram" },
    { key: "youtube", label: "YouTube" },
  ] as const;
  const reddit = platformData?.["reddit"];
  const hasGrowthMomentum =
    report.growth_signal?.trim() ||
    report.growth_evidence?.trim() ||
    report.new_content_volume?.trim();

  return (
    <section id="section-2" className="scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
      <h2 className="text-3xl font-bold text-[#1A1916] mb-0 tracking-tight">Trend Signal Dashboard</h2>

      <div className="bg-[#F8F7F4]/50 text-base italic text-[#6B6860] py-3 px-4 border-l-2 border-[#16A34A] mb-8 mt-4">
        Every week, KoreaScout screens <span className="font-semibold not-italic text-[#1A1916]">500+ Korean products</span>
        {" "}and curates only those scoring above 50.{" "}
        <span className="font-semibold not-italic text-[#1A1916]">It&apos;s worth your attention.</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 flex flex-col items-center gap-3">
          <p className="text-xl font-bold text-[#1A1916] text-center h-8 flex items-center justify-center mt-0">Market Score</p>
          <DonutGauge value={score} size={180} strokeWidth={14} />
          <p className="text-sm text-[#6B6860] text-center leading-relaxed mt-4">
            Product-market fit based on demand, margin & trend signals
          </p>
        </div>
        <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 flex flex-col items-center justify-center gap-3">
          <p className="text-xl font-bold text-[#1A1916] text-center h-8 flex items-center justify-center mt-0">Competition Level</p>
          <p className={`text-3xl font-extrabold text-center mt-1 mb-4 ${
            competitionLevel === "Low" ? "text-[#16A34A]" :
            competitionLevel === "High" ? "text-[#DC2626]" :
            competitionLevel === "Medium" ? "text-[#D97706]" :
            "text-[#6B6860]"
          }`}>
            {competitionLevel}
          </p>
          <p className="text-sm text-[#6B6860] text-center leading-relaxed">
            How crowded this niche is on global marketplaces
          </p>
        </div>
        <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 flex flex-col items-center justify-center gap-3">
          <p className="text-xl font-bold text-[#1A1916] text-center h-8 flex items-center justify-center mt-0">Opportunity Status</p>
          <p className={`text-3xl font-extrabold text-center mt-1 mb-4 whitespace-nowrap ${
            gapStatus === "Blue Ocean" || gapStatus === "Emerging" ? "text-[#16A34A]" :
            gapStatus === "Saturated" ? "text-[#D97706]" :
            "text-[#6B6860]"
          }`}>
            {gapStatus}
          </p>
          <p className="text-sm text-[#6B6860] text-center leading-relaxed">
            Gap between Korean buzz and global availability
          </p>
        </div>
      </div>

      <div className="mt-8 bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 pl-6 md:pl-10">
        <h3 className="text-xl font-bold text-[#1A1916] mb-4">Platform Breakdown</h3>
        {platformData ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-start">
            {platforms.map(({ key, label }) => {
              const data = platformData[key];
              const platformScore = data?.score ?? 0;
              return (
                <div key={key} className="flex flex-col items-center">
                  <p className="text-base font-bold text-[#6B6860] mb-3 uppercase tracking-widest shrink-0">{label}</p>
                  <DonutGauge value={platformScore} size={100} strokeWidth={8} />
                </div>
              );
            })}
            <div className="flex flex-col items-center">
              <p className="text-base font-bold text-[#6B6860] mb-3 uppercase tracking-widest shrink-0">Reddit</p>
              <div className="w-[100px] h-[100px] flex items-center justify-center">
                {reddit?.sentiment ? (
                  <Badge
                    variant={
                      reddit.sentiment.toLowerCase() === "positive"
                        ? "success"
                        : reddit.sentiment.toLowerCase() === "negative"
                          ? "danger"
                          : "default"
                    }
                  >
                    {reddit.sentiment}
                  </Badge>
                ) : (
                  <span className="text-sm text-[#9E9C98]">No data</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-base text-[#9E9C98]">No platform data</p>
        )}
      </div>

      <div className="mt-8 bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 pl-6 md:pl-10">
        {hasGrowthMomentum ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="md:col-span-1 flex flex-col justify-center gap-1">
              <p className="text-xl font-bold text-[#1A1916] inline-flex items-center gap-2">
                Growth Momentum
                <TrendingUp className="w-5 h-5 text-[#16A34A] shrink-0" />
              </p>
              {report.growth_signal?.trim() && (
                <p className="text-4xl font-black text-[#16A34A] leading-tight">{report.growth_signal}</p>
              )}
            </div>
            <div className="md:col-span-2 border-l-0 md:border-l-2 border-[#16A34A] pl-0 md:pl-6 flex flex-col justify-center space-y-2">
              {report.growth_evidence?.trim() && (
                <p className="text-xl leading-relaxed text-[#3D3B36]">{report.growth_evidence}</p>
              )}
              {report.new_content_volume?.trim() && (
                <p className="text-xl leading-relaxed text-[#3D3B36]">{report.new_content_volume}</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <p className="text-xl font-bold text-[#1A1916] mb-4 inline-flex items-center gap-2">
              Growth Momentum
              <TrendingUp className="w-5 h-5 text-[#16A34A] shrink-0" />
            </p>
            <p className="text-base text-[#9E9C98]">No growth data</p>
          </>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-[#E8E6E1]/50 flex flex-wrap items-center gap-2">
        <Radar className="w-3 h-3 text-[#9E9C98]/60 shrink-0" />
        <span className="text-[10px] text-[#9E9C98]/60 uppercase tracking-widest font-medium">
          Verified Local Demand via:
        </span>
        <span className="text-[10px] text-[#9E9C98]/50 tracking-wide">
          Hwahae · Glowpick · Olive Young · Chicor · Naver Data Lab
        </span>
      </div>
    </section>
  );
}
```

---

### components/ProductIdentity.tsx

```tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { ScoutFinalReportsRow } from "@/types/database";

const FALLBACK_RATE = 1430;

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
}

type ExportStatusDisplay = Record<string, { variant: "success" | "warning" | "danger"; label: string }>;

export default function ProductIdentity({
  report,
  tier,
  isTeaser,
  EXPORT_STATUS_DISPLAY,
  reportId,
  weekId,
  isFavorited,
  isSample,
}: {
  report: ScoutFinalReportsRow;
  tier: "free" | "standard" | "alpha";
  isTeaser: boolean;
  EXPORT_STATUS_DISPLAY: ExportStatusDisplay;
  reportId?: string;
  weekId?: string;
  isFavorited?: boolean;
  isSample?: boolean;
}) {
  const canSeeAlpha = tier === "alpha" || isTeaser;
  const [exchangeRate, setExchangeRate] = useState<number>(FALLBACK_RATE);
  const [rateDate, setRateDate] = useState<string>(formatDate(new Date()));
  const [rateLoading, setRateLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    fetch("https://api.frankfurter.app/latest?from=USD&to=KRW", {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        const rate = data?.rates?.KRW;
        if (typeof rate === "number" && rate > 0) {
          setExchangeRate(Math.round(rate));
          setRateDate(formatDate(new Date()));
        }
      })
      .catch(() => {
        setExchangeRate(FALLBACK_RATE);
      })
      .finally(() => {
        clearTimeout(timeout);
        setRateLoading(false);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const exportBadge = (() => {
    const s = report.export_status;
    const key = s?.toLowerCase() ?? "";
    const label = (EXPORT_STATUS_DISPLAY[key]?.label ?? s) as string;
    if (!s || !label) return null;
    if (s === "Green" || key === "green") return { label, color: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]" };
    if (s === "Yellow" || key === "yellow") return { label, color: "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]" };
    return { label, color: "bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]" };
  })();

  const usdPrice = report.kr_price != null
    ? (Number(report.kr_price) / exchangeRate).toFixed(2)
    : null;

  return (
    <section
      id="section-1"
      className="scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-8 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]"
    >
      <h2 className="text-3xl font-bold text-[#1A1916] tracking-tight mb-8">
        Product Identity
      </h2>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="relative w-full md:w-80 shrink-0 overflow-hidden rounded-2xl bg-[#F8F7F4] aspect-[3/4]">
          {report.image_url ? (
            <Image
              src={report.image_url}
              alt={report.product_name || report.translated_name || "Product"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-[#9E9C98]">No image</p>
            </div>
          )}
          {isSample && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 pointer-events-none">
              <div className="rotate-[-35deg] border-2 border-white/40 px-6 py-2 rounded-lg backdrop-blur-sm">
                <span className="text-white/70 font-black text-2xl tracking-widest uppercase drop-shadow-md">
                  KoreaScout Sample
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden @container relative">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              {report.category?.trim() && (
                <span className="inline-flex items-center px-3 py-1.5 bg-[#F8F7F4] border border-[#E8E6E1] text-xs font-bold text-[#1A1916] rounded-md uppercase tracking-wide">
                  {report.category}
                </span>
              )}
              {exportBadge && (
                <span className={`inline-flex items-center px-3 py-1.5 border text-xs font-bold rounded-md uppercase tracking-wide ${exportBadge.color}`}>
                  {exportBadge.label}
                </span>
              )}
            </div>
            {reportId != null && weekId != null && (
              <FavoriteButton
                reportId={reportId}
                weekId={weekId}
                isFavorited={isFavorited ?? false}
                className={`shrink-0 ${isFavorited ? "fill-[#16A34A] text-[#16A34A]" : "text-gray-300 hover:text-[#16A34A]"}`}
                iconClassName="w-8 h-8"
              />
            )}
          </div>

          <h1
            className="font-bold text-[#1A1916] leading-tight break-words mb-2"
            style={{
              fontSize: "clamp(1.5rem, 4cqw, 2.25rem)",
              textWrap: "balance",
            } as React.CSSProperties}
          >
            {report.translated_name || report.product_name}
          </h1>

          {report.product_name && (
            <p className="text-lg font-medium text-[#6B6860] line-clamp-2 mb-4">
              {report.product_name}
            </p>
          )}

          {(report.go_verdict?.trim() || report.composite_score != null) && (() => {
            const verdictStyleMap: Record<string, { bg: string; text: string; dot: string }> = {
              "GO":          { bg: "bg-[#F0FDF4] border border-[#16A34A]", text: "text-[#16A34A]", dot: "bg-[#16A34A]" },
              "CAUTIOUS GO": { bg: "bg-[#FFFBEB] border border-[#D97706]", text: "text-[#D97706]", dot: "bg-[#D97706]" },
              "NO GO":       { bg: "bg-[#FEF2F2] border border-[#DC2626]", text: "text-[#DC2626]", dot: "bg-[#DC2626]" },
            };
            const key = report.go_verdict?.trim().toUpperCase() ?? "";
            const style = verdictStyleMap[key] ?? { bg: "bg-[#F8F7F4] border border-[#E8E6E1]", text: "text-[#6B6860]", dot: "bg-[#9E9C98]" };

            return (
              <div className="flex items-center gap-3 mb-6">
                {report.go_verdict?.trim() && (
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-widest ${style.bg} ${style.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                    {report.go_verdict.trim()}
                  </span>
                )}
                {report.composite_score != null && (
                  <span className="text-xs font-bold text-[#9E9C98] tracking-wide">
                    {report.composite_score.toFixed(1)}
                    <span className="font-medium text-[#D5D3CE]"> / 10</span>
                    <span className="ml-2 text-[#9E9C98]">KoreaScout Intelligence Score</span>
                  </span>
                )}
              </div>
            );
          })()}

          <div className="mt-6 bg-[#F8F7F4] rounded-2xl p-6 border border-[#E8E6E1]">
            <div className="flex flex-col space-y-3">
              {report.kr_price != null && (
                <div>
                  <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-2">
                    Retail Price (KR Market)
                  </p>
                  <div className="flex items-baseline flex-wrap">
                    <span className="text-2xl md:text-3xl font-black text-[#1A1916] leading-none tracking-tighter">
                      KRW {Number(report.kr_price).toLocaleString()}
                    </span>
                    {usdPrice && (
                      <>
                        <span className="text-2xl md:text-3xl font-light text-[#D5D3CE] mx-4 leading-none">
                          |
                        </span>
                        <span className="text-2xl md:text-3xl font-black text-[#1A1916] leading-none tracking-tighter">
                          USD {usdPrice}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-[#9E9C98] font-semibold mt-2">
                    {rateLoading
                      ? "Fetching live rate..."
                      : `Ex. Rate: ${exchangeRate.toLocaleString()} KRW/USD (Daily fixed at ${rateDate} 09:00 KST)`}
                  </p>
                </div>
              )}

              {report.estimated_cost_usd != null && (
                <p className="text-sm font-medium text-[#9E9C98]">
                  Est. Wholesale: ~${report.estimated_cost_usd}
                  <span className="text-[#D97706] text-xs ml-1">⚠ Estimated</span>
                </p>
              )}

              <a
                href="#section-6"
                className="inline-flex items-center gap-2 bg-white border border-[#E8E6E1] px-3 py-2 rounded-md hover:border-[#16A34A] transition-colors cursor-pointer group w-fit"
              >
                <Lock className="w-3.5 h-3.5 text-[#9E9C98] group-hover:text-[#16A34A] transition-colors shrink-0" />
                <span className="text-xs font-bold text-[#6B6860] group-hover:text-[#16A34A] transition-colors">
                  Alpha members get verified supplier quotes
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {report.viability_reason?.trim() && (
        <div className="mt-8 bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] border-l-4 border-l-[#16A34A] p-6">
          <p className="text-sm font-semibold text-[#16A34A] uppercase tracking-widest mb-2">
            Why It&apos;s Trending
          </p>
          <p className="text-base text-[#3D3B36] leading-relaxed">
            {report.viability_reason}
          </p>
        </div>
      )}
    </section>
  );
}
```

---

### app/weekly/[weekId]/[id]/page.tsx

```tsx
import { createClient } from "@/lib/supabase/server";
import { getAuthTier } from "@/lib/auth-server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRICING } from "@/src/config/pricing";
import { ClientLeftNav } from "@/components/layout/ClientLeftNav";
import { LockedSection } from "@/components/LockedSection";
import ProductIdentity from "@/components/ProductIdentity";
import {
  TrendSignalDashboard,
  MarketIntelligence,
  SocialProofTrendIntelligence,
  SourcingIntel,
  SupplierContact,
  EXPORT_STATUS_DISPLAY,
  SECTION_3_LOCKED_CTA,
  SECTION_4_LOCKED_CTA,
  SECTION_CONSUMER_CTA,
  SECTION_ALPHA_SOURCING_CTA,
  SECTION_ALPHA_SUPPLIER_CTA,
} from "@/components/report";
import type { ScoutFinalReportsRow } from "@/types/database";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ weekId: string; id: string }>;
}) {
  const { weekId, id } = await params;
  const supabase = await createClient();
  const { userId, userEmail, tier } = await getAuthTier();

  const [{ data: report, error }, { data: weekReports }, { data: week }, { data: favoriteRow }] = await Promise.all([
    supabase
      .from("scout_final_reports")
      .select("*")
      .eq("id", id)
      .eq("week_id", weekId)
      .eq("status", "published")
      .single(),
    supabase
      .from("scout_final_reports")
      .select("id")
      .eq("week_id", weekId)
      .eq("status", "published")
      .order("created_at", { ascending: true }),
    supabase.from("weeks").select("week_label").eq("week_id", weekId).single(),
    userId
      ? supabase
          .from("user_favorites")
          .select("report_id")
          .eq("user_id", userId)
          .eq("report_id", id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const isFavorited = !!favoriteRow?.report_id;

  if (error || !report) notFound();

  const idList = (weekReports ?? []).map((r) => r.id);
  const currentIndex = idList.indexOf(id);
  const prevId = currentIndex > 0 ? idList[currentIndex - 1] : null;
  const nextId = currentIndex >= 0 && currentIndex < idList.length - 1 ? idList[currentIndex + 1] : null;
  const weekLabel = week?.week_label?.trim() || weekId;

  const isTeaser = report.is_teaser === true;
  const canSeeStandard = tier === "standard" || tier === "alpha" || isTeaser;
  const canSeeAlpha = tier === "alpha" || isTeaser;

  const hazmatStatus = report.hazmat_status as Record<string, unknown> | null;
  const hasLogistics =
    (report.hs_code && report.hs_code.trim()) ||
    (report.hs_description && report.hs_description.trim()) ||
    (hazmatStatus && typeof hazmatStatus === "object") ||
    (report.dimensions_cm && report.dimensions_cm.trim()) ||
    report.billable_weight_g != null ||
    (report.shipping_tier && report.shipping_tier.trim()) ||
    (report.required_certificates && report.required_certificates.trim()) ||
    (report.shipping_notes && report.shipping_notes.trim()) ||
    (report.key_risk_ingredient && report.key_risk_ingredient.trim()) ||
    (report.status_reason && report.status_reason.trim()) ||
    report.actual_weight_g != null ||
    report.volumetric_weight_g != null ||
    (report.sourcing_tip && report.sourcing_tip.trim());
  const hasSupplier =
    (report.m_name && report.m_name.trim()) ||
    (report.corporate_scale && report.corporate_scale.trim()) ||
    (report.contact_email && report.contact_email.trim()) ||
    (report.contact_phone && report.contact_phone.trim()) ||
    (report.m_homepage && report.m_homepage.trim()) ||
    (report.naver_link && report.naver_link.trim()) ||
    (report.wholesale_link && report.wholesale_link.trim()) ||
    (report.sourcing_tip && report.sourcing_tip.trim());

  const sections = [
    { id: "section-1", label: "Product Identity", icon: null },
    { id: "section-2", label: "Trend Signals", icon: null },
    { id: "section-3", label: "Market Intelligence", icon: null },
    { id: "section-4", label: "Social Proof", icon: null },
    { id: "section-5", label: "Export & Logistics", icon: null },
    { id: "section-6", label: "Launch Kit", icon: null },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F7F4]">
      <ClientLeftNav sections={sections} userEmail={userEmail} tier={tier as "free" | "standard" | "alpha"} />
      <div className="flex-1 pl-[18rem]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-10 pb-[60vh]">
          <div className="space-y-6 mt-10">
            <Link href={`/weekly/${weekId}`} className="text-base font-medium text-[#6B6860] hover:text-[#1A1916] transition-colors inline-block">
              ← Back to week
            </Link>

            {isTeaser && (
              <div className="rounded-lg bg-[#DCFCE7] border border-[#BBF7D0] px-4 py-2 text-sm text-[#16A34A]">
                🆓 FREE THIS WEEK — Full report unlocked for everyone.
              </div>
            )}

            <ProductIdentity
              report={report as ScoutFinalReportsRow}
              tier={tier as "free" | "standard" | "alpha"}
              isTeaser={isTeaser}
              EXPORT_STATUS_DISPLAY={EXPORT_STATUS_DISPLAY}
              reportId={report.id}
              weekId={weekId}
              isFavorited={isFavorited}
            />
            <TrendSignalDashboard report={report as ScoutFinalReportsRow} />

            {canSeeStandard ? (
              <>
                <MarketIntelligence report={report as ScoutFinalReportsRow} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
                <SocialProofTrendIntelligence report={report as ScoutFinalReportsRow} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
              </>
            ) : (
              <>
                <LockedSection {...SECTION_3_LOCKED_CTA} />
                <LockedSection {...SECTION_4_LOCKED_CTA} />
                <LockedSection {...SECTION_CONSUMER_CTA} />
              </>
            )}

            {hasLogistics &&
              (canSeeStandard ? (
                <SourcingIntel report={report as ScoutFinalReportsRow} tier={tier as string} isTeaser={isTeaser} />
              ) : (
                <LockedSection {...SECTION_ALPHA_SOURCING_CTA} />
              ))}

            {hasSupplier && (
              <div id="section-6" className="scroll-mt-[160px]">
                {canSeeAlpha ? (
                  <SupplierContact report={report as ScoutFinalReportsRow} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
                ) : (
                  <LockedSection {...SECTION_ALPHA_SUPPLIER_CTA} />
                )}
              </div>
            )}

            <section className="rounded-2xl border border-[#E8E6E1] bg-[#F8F7F4] p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                {prevId ? (
                  <Link href={`/weekly/${weekId}/${prevId}`} className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] transition-colors">
                    ← Previous Product
                  </Link>
                ) : (
                  <span />
                )}
                {nextId ? (
                  <Link href={`/weekly/${weekId}/${nextId}`} className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] ml-auto transition-colors">
                    Next Product →
                  </Link>
                ) : (
                  <span />
                )}
              </div>
              <p className="mb-6">
                <Link href={`/weekly/${weekId}`} className="text-[#1A1916] hover:text-[#16A34A] font-medium text-sm inline-flex items-center gap-2 transition-colors">
                  Back to {weekLabel} Product List
                </Link>
              </p>
              <div className="rounded-lg border border-[#E8E6E1] bg-[#F2F1EE] px-4 py-3 text-center">
                {tier === "free" && (
                  <Link href="/pricing" className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] underline transition-colors">
                    Unlock Full Market Intelligence — Start at {PRICING.CURRENCY}{PRICING.STANDARD.monthly}/mo →
                  </Link>
                )}
                {tier === "standard" && (
                  <Link href="/pricing" className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] underline transition-colors">
                    Go Alpha — Get Supplier Contacts for {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo →
                  </Link>
                )}
                {tier === "alpha" && <p className="text-sm font-medium text-[#16A34A]">You have full access</p>}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### types/database.ts

```ts
/**
 * Database types for Supabase tables (Phase 2 + v1.3 확장).
 * Use with createClient() for typed CRUD when needed:
 *   const supabase = createClient() as SupabaseClient<Database>
 * Or pass to createServerClient/createBrowserClient options.
 * JSONB → Json; TEXT[] → string[] | null.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Tier = "free" | "standard" | "alpha";
export type WeekStatus = "draft" | "published" | "archived";
export type ReportStatus = "draft" | "published" | "archived" | "hidden";

export interface ProfilesRow {
  id: string;
  email: string;
  tier: Tier;
  ls_customer_id: string | null;
  ls_subscription_id: string | null;
  tier_updated_at: string | null;
  created_at: string;
}

export interface WeeksRow {
  week_id: string;
  week_label: string;
  start_date: string;
  end_date: string;
  published_at: string | null;
  product_count: number;
  summary: string | null;
  status: WeekStatus;
}

export interface ScoutFinalReportsRow {
  id: string;
  week_id: string;
  product_name: string;
  translated_name: string;
  image_url: string;
  ai_image_url: string | null;
  summary: string | null;
  consumer_insight: string | null;
  /** v1.3: optional product composition info (Section 1 accordion). May be null or absent on older rows. */
  composition_info?: string | null;
  /** v1.3: optional spec summary text block (Section 1 accordion). */
  spec_summary?: string | null;
  category: string;
  viability_reason: string;
  market_viability: number;
  competition_level: string;
  profit_multiplier: number;
  search_volume: string;
  mom_growth: string;
  gap_status: string;
  /** JSONB — 국가별 가격 { "US": "$24.99", ... } */
  global_price: Json | null;
  /** TEXT[] or comma-separated TEXT from pipeline */
  seo_keywords: string | string[] | null;
  export_status: string;
  hs_code: string | null;
  sourcing_tip: string | null;
  manufacturer_check: string | null;
  m_name: string | null;
  corporate_scale?: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  m_homepage: string | null;
  naver_link: string | null;
  wholesale_link?: string | null;
  global_site_url?: string | null;
  b2b_inquiry_url?: string | null;
  video_url: string | null;
  competitor_analysis_pdf: string | null;
  /** v1.2: 바이럴 숏폼 영상 URL */
  viral_video_url: string | null;
  published_at: string | null;
  free_list_at: string | null;
  is_premium: boolean;
  is_teaser: boolean;
  status: ReportStatus;
  created_at: string;
  /* ----- v1.3 신규 컬럼 (28개 중 선반영; 나머지는 마이그레이션 확정 후 추가) ----- */
  /** 한국 가격 (예: "12,000원") */
  kr_price?: string | null;
  /** Auto-calculated: kr_price in USD (trigger). */
  kr_price_usd?: number | null;
  /** Auto-calculated: estimated wholesale cost USD (trigger). */
  estimated_cost_usd?: number | null;
  /** Alpha: verified unit cost from supplier (admin input). */
  verified_cost_usd?: string | null;
  /** Alpha: note e.g. "undisclosed". */
  verified_cost_note?: string | null;
  /** Alpha: minimum order quantity. */
  moq?: string | null;
  /** Alpha: lead time. */
  lead_time?: string | null;
  /** 국가별 가격 상세 (JSONB). e.g. { us: { price: string }, ... } */
  global_prices?: Json | null;
  /** 플랫폼별 점수/지표 (JSONB) */
  platform_scores?: Json | null;
  /** WoW 성장률 (Section 3) */
  wow_rate?: string | null;
  /** Best platform recommendation (e.g. "Amazon FBA") */
  best_platform?: string | null;
  /** Seller Intelligence accordion */
  top_selling_point?: string | null;
  common_pain_point?: string | null;
  /** Hashtag pills, click to copy */
  viral_hashtags?: string[] | null;
  /* ----- Section 4 Social Proof & Trend Intelligence ----- */
  buzz_summary?: string | null;
  rising_keywords?: string[] | null;
  /** Korea local score 0–100 (Gap Analysis) */
  kr_local_score?: number | null;
  /** Global trend score 0–100 (Gap Analysis) */
  global_trend_score?: number | null;
  /** Gap index (e.g. 47). Can be derived or stored. */
  gap_index?: number | null;
  opportunity_reasoning?: string | null;
  trend_entry_strategy?: string | null;
  new_content_volume?: string | null;
  kr_evidence?: string | null;
  global_evidence?: string | null;
  growth_evidence?: string | null;
  kr_source_used?: string | null;
  growth_signal?: string | null;
  /* ----- Section 6 Export & Logistics Intel ----- */
  /** HS description text shown under hs_code */
  hs_description?: string | null;
  /** Hazmat JSONB status flags */
  hazmat_status?: Json | null;
  /** Dimensions in centimeters, e.g. "15 × 8 × 5" */
  dimensions_cm?: string | null;
  /** Billable weight (grams) used for shipping cost */
  billable_weight_g?: number | null;
  /** Shipping tier label, e.g. "Standard Parcel" */
  shipping_tier?: string | null;
  /** Comma-separated certificates, e.g. "FDA 510K, CE" */
  required_certificates?: string | null;
  /** Freeform logistics notes */
  shipping_notes?: string | null;
  sourcing_tip_logistics?: string | null;
  hazmat_summary?: string | null;
  can_oem?: boolean | null;
  /** Key risky ingredient to highlight */
  key_risk_ingredient?: string | null;
  /** Regulatory or status reasoning text */
  status_reason?: string | null;
  /** Actual physical weight (grams) */
  actual_weight_g?: number | null;
  /** Volumetric weight (grams) */
  volumetric_weight_g?: number | null;
  /* ----- Launch & Execution Kit / Section 6 신규 컬럼 ----- */
  /** Marketing assets (e.g. image pack, banner) URL */
  marketing_assets_url?: string | null;
  /** AI-generated detail/landing page links (URL or JSON array of URLs) */
  ai_detail_page_links?: string | null;
  /** When supplier pricing/contact was verified (ISO timestamp) */
  verified_at?: string | null;
  /** Sample order / sampling policy text */
  sample_policy?: string | null;
  /** Export or certification note for customs/compliance */
  export_cert_note?: string | null;
  /** Admin edit history log: { entries: [{ timestamp, changes: [{ field, before, after }] }] } */
  edit_history?: Json | null;
  composite_score?: number | null;
  go_verdict?: string | null;
}

export interface UserFavoritesRow {
  user_id: string;
  report_id: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: ProfilesRow; Insert: Omit<ProfilesRow, "created_at"> & { created_at?: string }; Update: Partial<ProfilesRow> };
      weeks: { Row: WeeksRow; Insert: Omit<WeeksRow, "product_count"> & { product_count?: number }; Update: Partial<WeeksRow> };
      scout_final_reports: { Row: ScoutFinalReportsRow; Insert: Omit<ScoutFinalReportsRow, "id" | "created_at"> & { id?: string; created_at?: string }; Update: Partial<ScoutFinalReportsRow> };
      user_favorites: { Row: UserFavoritesRow; Insert: Omit<UserFavoritesRow, "created_at"> & { created_at?: string }; Update: Partial<UserFavoritesRow> };
    };
  };
}
```

---

### app/globals.css

```css
@import "tailwindcss";

@theme inline {
  /* ── BRAND COLORS ── */
  --color-cream-50:  #FDFCFA;
  --color-cream-100: #F8F7F4;
  --color-cream-200: #F2F1EE;
  --color-cream-300: #E8E6E1;
  --color-cream-400: #D4D1CA;

  --color-ink-900:   #1A1916;
  --color-ink-700:   #3D3B36;
  --color-ink-500:   #6B6860;
  --color-ink-300:   #9E9C98;
  --color-ink-200:   #C4C2BE;
  --color-ink-100:   #E4E2DE;

  --color-accent:         #16A34A;
  --color-accent-hover:   #15803D;
  --color-accent-light:   #DCFCE7;
  --color-accent-muted:   #BBF7D0;

  --color-danger:         #DC2626;
  --color-danger-light:   #FEE2E2;
  --color-warning:        #D97706;
  --color-warning-light:  #FEF3C7;
  --color-info:           #2563EB;
  --color-info-light:     #DBEAFE;

  /* ── SEMANTIC ALIASES ── */
  --color-bg-page:        var(--color-cream-100);
  --color-bg-card:        #FFFFFF;
  --color-bg-subcard:     var(--color-cream-200);
  --color-border:         var(--color-cream-300);
  --color-border-strong:  var(--color-cream-400);
  --color-text-primary:   var(--color-ink-900);
  --color-text-secondary: var(--color-ink-500);
  --color-text-tertiary:  var(--color-ink-300);

  /* ── TYPOGRAPHY ── */
  --font-sans:  'Inter', system-ui, -apple-system, sans-serif;
  --font-mono:  'JetBrains Mono', 'Fira Code', monospace;

  /* ── RADIUS ── */
  --radius-sm:  0.375rem;  /* 6px  — badges, pills */
  --radius-md:  0.5rem;    /* 8px  — inputs, buttons */
  --radius-lg:  0.75rem;   /* 12px — small cards */
  --radius-xl:  1rem;      /* 16px — cards */
  --radius-2xl: 1.5rem;    /* 24px — section wrappers */

  /* ── SHADOWS ── */
  --shadow-card:    0 1px 3px 0 rgb(26 25 22 / 0.06), 0 1px 2px -1px rgb(26 25 22 / 0.04);
  --shadow-elevated: 0 4px 6px -1px rgb(26 25 22 / 0.08), 0 2px 4px -2px rgb(26 25 22 / 0.05);
  --shadow-modal:   0 20px 25px -5px rgb(26 25 22 / 0.1);
}

@layer base {
  body {
    background-color: var(--color-bg-page);
    color: var(--color-text-primary);
    font-family: var(--font-sans);
    font-size: 1.0625rem; /* ~17px — global UI scale-up for 100% zoom */
    -webkit-font-smoothing: antialiased;
  }

  * {
    border-color: var(--color-border);
  }
}

:root {
  --background: #030303;
  --foreground: #ffffff;
  --indigo: #6366f1;
  --purple: #a855f7;
  --amber: #f59e0b;
  --bg-card: #0d0d0f;
  --border: rgba(255, 255, 255, 0.08);
  --text-muted: rgba(255, 255, 255, 0.45);
  --text-mid: rgba(255, 255, 255, 0.7);
}

html {
  scroll-behavior: smooth;
}

@keyframes hero-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-hero-fade-in {
  animation: hero-fade-in 0.8s ease-out both;
}

@keyframes s2-scale-noise {
  to {
    opacity: 1;
  }
}

@keyframes s2-scale-alpha {
  to {
    opacity: 1;
  }
}

@keyframes floatDrift {
  0%   { transform: translateY(0px) rotate(var(--r, 0deg)); }
  100% { transform: translateY(-6px) rotate(var(--r, 0deg)); }
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.5; transform: scale(0.85); }
}

/* ── S6 Pipeline ── */
@keyframes floatDrift {
  0%   { transform: translateY(0px); }
  100% { transform: translateY(-8px); }
}
@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.8); }
}

.s6-section {
  background: #F8F7F4;
  padding: clamp(80px, 10vw, 140px) clamp(32px, 6vw, 100px);
}

.s6-headline {
  text-align: center;
  margin-bottom: 80px;
}
.s6-headline h2 {
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #0A0908;
  line-height: 1.05;
  margin-bottom: 16px;
}
.s6-headline p {
  font-size: 14px;
  color: rgba(10,9,8,0.4);
  font-weight: 400;
}

/* ── 데스크탑: 가로 flex (max-w-6xl 정렬) ── */
.s6-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  max-width: 72rem; /* 1152px, max-w-6xl */
  margin: 0 auto;
  gap: 0;
}

.s6-step {
  flex: 0 0 auto;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.s6-arrow-wrap {
  flex: 0 0 auto;
  width: 40px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-top: 2px;
  color: rgba(10,9,8,0.18);
  font-size: 1.2rem;
  font-weight: 300;
}

.s6-label {
  font-size: 12px;
  font-weight: 900;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #16A34A;
  line-height: 1;
  margin-bottom: 18px;
  display: block;
  text-align: left;
}

/* ── PILL CLOUD ── */
.s6-pill-cloud {
  position: relative;
  width: 200px;
  height: 180px;
}
.s6-pill {
  position: absolute;
  background: #FFFFFF;
  border: 1px solid rgba(10,9,8,0.07);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 500;
  color: #0A0908;
  box-shadow: 0 2px 8px rgba(10,9,8,0.06);
  white-space: nowrap;
  animation: floatDrift 4s ease-in-out infinite alternate;
}

/* ── KILL ROW ── */
.s6-kill-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}
.s6-kill-tag {
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #B91C1C;
  background: rgba(185,28,28,0.07);
  border-radius: 4px;
  padding: 2px 6px;
  flex-shrink: 0;
}
.s6-kill-text {
  font-size: 12px;
  color: rgba(10,9,8,0.5);
  font-weight: 400;
  text-decoration: line-through;
  text-decoration-color: rgba(185,28,28,0.35);
  white-space: nowrap;
}
.s6-filter-desc {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.s6-filter-desc p {
  font-size: 12px;
  color: rgba(10,9,8,0.4);
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

/* ── VERIFY ROW ── */
.s6-verify-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 9px 0;
}
.s6-verify-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  min-width: 20px;
  border-radius: 50%;
  background: #16A34A;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 900;
  flex-shrink: 0;
  margin-top: 3px;
}
.s6-v-main {
  font-size: 14px;
  color: #0A0908;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}
.s6-v-sub {
  font-size: 11px;
  color: rgba(10,9,8,0.4);
  font-weight: 400;
  white-space: nowrap;
  margin-top: 1px;
}

/* ── OUTPUT ── */
.s6-output-num {
  font-size: clamp(4rem, 7vw, 6rem);
  font-weight: 900;
  color: #16A34A;
  letter-spacing: -0.02em;
  line-height: 1;
  margin: 4px 0 8px;
  text-align: left;
  -webkit-font-smoothing: antialiased;
}
.s6-output-desc {
  font-size: 13px;
  color: rgba(10,9,8,0.45);
  line-height: 1.7;
  text-align: left;
}
.s6-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  padding: 4px 12px;
  border: 1px solid rgba(22,163,74,0.25);
  border-radius: 999px;
  background: rgba(22,163,74,0.05);
}
.s6-badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #16A34A;
  animation: pulseDot 2s infinite;
}
.s6-badge span {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #16A34A;
}

/* ── 모바일 (768px 이하) ── */
@media (max-width: 768px) {
  .s6-row {
    flex-direction: column;
    gap: 0;
    align-items: stretch;
  }
  .s6-step {
    width: 100%;
    padding: 28px 0;
    border-bottom: 1px solid rgba(10,9,8,0.07);
  }
  .s6-step:last-child {
    border-bottom: none;
  }
  .s6-arrow-wrap {
    display: none;
  }
  .s6-pill-cloud {
    width: 100%;
    height: 160px;
  }
}
```
