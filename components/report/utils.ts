import { SHIPPING_TIER_TOOLTIP } from "./constants";

const GLOBAL_REGIONS = [
  { key: "us", flag: "🇺🇸", label: "US" },
  { key: "uk", flag: "🇬🇧", label: "UK" },
  { key: "sea", flag: "🇸🇬", label: "SEA" },
  { key: "au", flag: "🇦🇺", label: "AU" },
  { key: "india", flag: "🇮🇳", label: "IN" },
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
  const stepConfig: { pattern: RegExp; icon: string; label: string; color: string }[] = [
    { pattern: /\[마케팅\s*전략\]/i, icon: "📈", label: "Marketing Strategy", color: "emerald" },
    { pattern: /\[가격\s*[\/·]\s*마진\s*전략\]/i, icon: "💰", label: "Pricing & Margin", color: "amber" },
    { pattern: /\[B2B\s*소싱\s*전략\]/i, icon: "🏭", label: "B2B Sourcing", color: "blue" },
    { pattern: /\[통관\s*[\/·]\s*규제\s*전략\]/i, icon: "📋", label: "Regulation & Compliance", color: "red" },
    { pattern: /\[물류\s*[\/·]\s*배송\s*전략\]/i, icon: "📦", label: "Logistics & Shipping", color: "purple" },
  ];
  const steps: StrategyStep[] = [];
  for (let i = 0; i < stepConfig.length; i++) {
    const current = stepConfig[i];
    const match = raw.match(current.pattern);
    if (!match) continue;
    const startIdx = match.index! + match[0].length;
    let endIdx = raw.length;
    for (let j = i + 1; j < stepConfig.length; j++) {
      const nextMatch = raw.match(stepConfig[j].pattern);
      if (nextMatch) {
        endIdx = nextMatch.index!;
        break;
      }
    }
    const content = raw.slice(startIdx, endIdx).trim();
    if (content) {
      steps.push({ icon: current.icon, label: current.label, color: current.color, content });
    }
  }
  if (steps.length === 0 && raw.trim()) {
    steps.push({ icon: "📋", label: "Strategy Overview", color: "emerald", content: raw.trim() });
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
    for (const r of GLOBAL_REGIONS) {
      const data = parsed[r.key] ?? parsed[r.key === "au" ? "australia" : r.key];
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
      out.push({
        flag: r.flag,
        label: r.label,
        priceDisplay: priceDisplay ?? null,
        platform: data?.platform ?? null,
        isBlueOcean,
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
