import { SHIPPING_TIER_TOOLTIP } from "./constants";

const GLOBAL_REGIONS = [
  { key: "us",  flag: "🇺🇸", label: "US",  fullLabel: "North America" },
  { key: "uk",  flag: "🇬🇧", label: "UK",  fullLabel: "United Kingdom" },
  { key: "eu",  flag: "🇪🇺", label: "EU",  fullLabel: "European Union" },
  { key: "jp",  flag: "🇯🇵", label: "JP",  fullLabel: "Japan" },
  { key: "sea", flag: "🇸🇬", label: "SEA", fullLabel: "Southeast Asia" },
  { key: "uae", flag: "🇦🇪", label: "UAE", fullLabel: "Middle East" },
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
  url?: string | null;
  official_url?: string | null;
  official_price_usd?: number | null;
  official_platform?: string | null;
  price_local?: number | null;
  currency?: string | null;
  listings?: Array<{
    platform?: string | null;
    title?: string | null;
    price_usd?: number | null;
    price_local?: number | null;
    currency?: string | null;
    url?: string | null;
  }> | null;
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
    type MarketData = {
      price_usd?: number;
      price_original?: string | number;
      platform?: string;
      review_data?: string | null;
      seller_type?: string | null;
      url?: string | null;
      official_url?: string | null;
      price_local?: number | null;
      currency?: string | null;
      listings?: Array<{ platform?: string | null; title?: string | null; price_usd?: number | null; price_local?: number | null; currency?: string | null; url?: string | null }> | null;
    };
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
    // shopee_lazada 데이터를 SEA에 병합
    const shopeeLazada = (parsed as Record<string, unknown>)["shopee_lazada"] as MarketData | undefined;
    if (shopeeLazada?.listings?.length) {
      const seaData = flat["sea"];
      const mergedListings = [...(seaData?.listings ?? []), ...shopeeLazada.listings];
      const withPrice = mergedListings.filter((l): l is typeof l & { price_usd: number } =>
        typeof (l as { price_usd?: number }).price_usd === "number" && (l as { price_usd: number }).price_usd > 0
      );
      const minEntry = withPrice.length
        ? withPrice.reduce((best, l) => ((l as { price_usd?: number }).price_usd! < (best as { price_usd?: number }).price_usd! ? l : best))
        : null;
      flat["sea"] = {
        ...seaData,
        listings: mergedListings,
        ...(minEntry
          ? {
              price_usd: (minEntry as { price_usd?: number }).price_usd,
              url: (minEntry as { url?: string | null }).url ?? seaData?.url ?? shopeeLazada.url,
            }
          : {}),
      };
    }
    for (const r of GLOBAL_REGIONS) {
      const data = flat[r.key];
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
        url: data?.url ?? null,
        official_url: data?.official_url ?? null,
        official_price_usd: (() => {
          if (!data?.official_url || !data?.listings) return null;
          const found = (data.listings as Array<{ url?: string | null; price_usd?: number | null }>)
            .find(l => l.url === data.official_url);
          return (found?.price_usd && found.price_usd > 0) ? found.price_usd : null;
        })(),
        official_platform: (() => {
          if (!data?.official_url || !data?.listings) return null;
          const found = (data.listings as Array<{ url?: string | null; platform?: string | null }>)
            .find(l => l.url === data.official_url);
          return found?.platform ?? null;
        })(),
        price_local: data?.price_local ?? null,
        currency: data?.currency ?? null,
        listings: (data?.listings ?? null) as RegionPriceRow["listings"],
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
  return out.length > 0 ? out : GLOBAL_REGIONS.map((r) => ({ flag: r.flag, label: r.label, priceDisplay: null, platform: null, isBlueOcean: true, url: null, official_url: null, official_price_usd: null, official_platform: null, price_local: null, currency: null, listings: null }));
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
