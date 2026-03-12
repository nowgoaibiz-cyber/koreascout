# Product Detail Page — 전체 코드 추출 (의존성 포함)

상세 페이지 `app/weekly/[weekId]/[id]/page.tsx` 및 이를 구성하는 모든 하위 컴포넌트, 훅, 유틸, 타입 정의의 **원본 코드 전체**를 추적한 문서입니다.  
데이터 연동 구조 기획용으로 사용하세요.

---

## 1. 타입 정의

### types/database.ts

```ts
// 파일경로: types/database.ts
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

## 2. 설정

### src/config/pricing.ts

```ts
// 파일경로: src/config/pricing.ts
export const PRICING = {
  FREE: {
    monthly: 0,
    daily: 0,
  },
  STANDARD: {
    monthly: 69,
    daily: 2.3,
  },
  ALPHA: {
    monthly: 129,
    daily: 4.3,
    marketingDailyLimit: 4.5, // For "under $4.50 a day" copy
  },
  CURRENCY: "$",
} as const;
```

---

## 3. 라이브러리 (서버)

### lib/supabase/server.ts

```ts
// 파일경로: lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server Supabase client. Use for Server Components, Route Handlers, Server Actions.
 * RLS applies: profiles (own row), weeks (published only), scout_final_reports (tier-based).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component; middleware will refresh the session.
          }
        },
      },
    }
  );
}
```

### lib/auth-server.ts

```ts
// 파일경로: lib/auth-server.ts
import { createClient } from "@/lib/supabase/server";
import type { Tier } from "@/types/database";

export interface AuthResult {
  userId: string | null;
  userEmail: string | null;
  tier: Tier;
  subscriptionStartAt: string | null;
}

/**
 * Get current user id and tier for server components.
 * Guests and unauthenticated users get tier 'free'.
 * RLS uses this tier for report_access on scout_final_reports.
 */
export async function getAuthTier(): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { userId: null, userEmail: null, tier: "free", subscriptionStartAt: null };
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier, subscription_start_at")
    .eq("id", user.id)
    .single();
  const tier = (profile?.tier as Tier) ?? "free";
  return {
    userId: user.id,
    userEmail: user.email ?? null,
    tier,
    subscriptionStartAt: profile?.subscription_start_at ?? null,
  };
}
```

---

## 4. 서버 액션

### app/actions/favorites.ts

```ts
// 파일경로: app/actions/favorites.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Toggle a product report in the current user's favorites.
 * If the report is already favorited, remove it; otherwise add it.
 * Revalidates /weekly/[weekId] and /account so the UI updates immediately.
 * @param weekId Optional; when provided, revalidates that week's page.
 */
export async function toggleFavorite(
  reportId: string,
  weekId?: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Not authenticated" };
  }

  const { data: existing } = await supabase
    .from("user_favorites")
    .select("report_id")
    .eq("user_id", user.id)
    .eq("report_id", reportId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("report_id", reportId);
    if (error) {
      console.error("[favorites] delete error:", error);
      return { ok: false, error: error.message };
    }
  } else {
    const { error } = await supabase.from("user_favorites").insert({
      user_id: user.id,
      report_id: reportId,
    });
    if (error) {
      console.error("[favorites] insert error:", error);
      return { ok: false, error: error.message };
    }
  }

  revalidatePath("/account");
  if (weekId) revalidatePath(`/weekly/${weekId}`);
  return { ok: true };
}
```

---

## 5. 리포트 상수·유틸

### components/report/constants.ts

```ts
// 파일경로: components/report/constants.ts
import { PRICING } from "@/src/config/pricing";

/** Locked section CTA configs for weekly detail page. */
export const SECTION_3_LOCKED_CTA = {
  message: "The numbers are in. You just can't see them.",
  cta: `Unlock Market Intelligence — ${PRICING.CURRENCY}${PRICING.STANDARD.monthly}/mo →`,
  href: "/pricing",
  lockedFields: ["Profit multiplier", "Search volume", "Growth", "Global price", "SEO keywords"],
};

export const SECTION_STANDARD_CTA = {
  message: "Unlock profit margins, search trends, and global pricing intel.",
  cta: `Start Standard — ${PRICING.CURRENCY}${PRICING.STANDARD.monthly}/mo`,
  href: "/pricing",
  lockedFields: ["Profit multiplier", "Search volume", "Growth", "Global price", "SEO keywords"],
};

export const SECTION_4_LOCKED_CTA = {
  message: "This product is trending on ■ platforms. TikTok alone scored ■■/100.",
  cta: `See What's Trending — ${PRICING.CURRENCY}${PRICING.STANDARD.monthly}/mo →`,
  href: "/pricing",
  lockedFields: ["Platform scores", "Rising keywords", "Gap analysis", "Entry strategy"],
};

export const SECTION_CONSUMER_CTA = {
  message: "See exactly who's buying and which keywords drive sales.",
  cta: `Start Standard — ${PRICING.CURRENCY}${PRICING.STANDARD.monthly}/mo`,
  href: "/pricing",
  lockedFields: ["Consumer insight", "SEO keywords"],
};

export const SECTION_ALPHA_SOURCING_CTA = {
  message: "You know what sells. Now learn how to ship it.",
  cta: `Unlock Logistics Intel — ${PRICING.CURRENCY}${PRICING.ALPHA.monthly}/mo →`,
  href: "/pricing",
  lockedFields: ["✓ HS codes", "✓ Hazmat checks", "✓ Dimensions", "✓ Certifications"],
};

export const SECTION_ALPHA_MEDIA_CTA = {
  message: "See the viral Korean video that started the trend.",
  cta: `Unlock Media Vault — ${PRICING.CURRENCY}${PRICING.ALPHA.monthly}/mo →`,
  href: "/pricing",
  lockedFields: ["Product video (4K)", "Viral video", "AI product image"],
};

export const SECTION_ALPHA_SUPPLIER_CTA = {
  message:
    "The supplier is right here. One upgrade away. 💡 One successful product pays for a full year of Alpha.",
  cta: `Get Supplier Contact — ${PRICING.CURRENCY}${PRICING.ALPHA.monthly}/mo →`,
  href: "/pricing",
  lockedFields: [
    "Supplier Contact Info",
    "Verified Wholesale Cost",
    "MOQ & Lead Time",
    "Direct Factory Link",
    "B2B Negotiation Script",
  ],
};

export const EXPORT_STATUS_DISPLAY: Record<
  string,
  { variant: "success" | "warning" | "danger"; label: string }
> = {
  green: { variant: "success", label: "Ready to Export" },
  yellow: { variant: "warning", label: "Check Regulations" },
  red: { variant: "danger", label: "Export Restricted" },
};

export const SHIPPING_TIER_TOOLTIP =
  "Tier 1: <500g | Tier 2: 500g–2kg | Tier 3: 2kg+";
```

### components/report/utils.ts

```ts
// 파일경로: components/report/utils.ts
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
```

---

## 6. UI·공통 컴포넌트

### components/ui/Badge.tsx

```tsx
// 파일경로: components/ui/Badge.tsx
'use client'

const baseClasses =
  'inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full'

const variantClasses = {
  default: 'bg-[#F2F1EE] text-[#6B6860]',
  success: 'bg-[#DCFCE7] text-[#16A34A]',
  warning: 'bg-[#FEF3C7] text-[#D97706]',
  danger: 'bg-[#FEE2E2] text-[#DC2626]',
  info: 'bg-[#DBEAFE] text-[#2563EB]',
  'tier-free': 'bg-[#F2F1EE] text-[#6B6860]',
  'tier-standard': 'bg-[#DBEAFE] text-[#2563EB]',
  'tier-alpha': 'bg-[#DCFCE7] text-[#16A34A]',
} as const

export type BadgeVariant = keyof typeof variantClasses

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  className?: string
  children?: React.ReactNode
}

export function Badge({
  variant = 'default',
  className = '',
  children,
  ...rest
}: BadgeProps) {
  const variantClass = variantClasses[variant]
  return (
    <span
      className={`${baseClasses} ${variantClass} ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  )
}
```

### components/ui/Button.tsx

```tsx
// 파일경로: components/ui/Button.tsx
'use client'

import { forwardRef } from 'react'

const variantClasses = {
  primary:
    'bg-[#16A34A] text-white font-semibold hover:bg-[#15803D] transition-colors disabled:opacity-50',
  secondary:
    'bg-[#F2F1EE] text-[#3D3B36] font-medium border border-[#E8E6E1] hover:bg-[#E8E6E1] transition-colors',
  ghost:
    'text-[#6B6860] font-medium hover:bg-[#F2F1EE] transition-colors',
  danger:
    'bg-[#DC2626] text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50',
} as const

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
} as const

export type ButtonVariant = keyof typeof variantClasses
export type ButtonSize = keyof typeof sizeClasses

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  disabled?: boolean
  className?: string
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      className = '',
      children,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const base = 'rounded-md inline-flex items-center justify-center gap-2'
    const sizeClass = sizeClasses[size]
    const variantClass = variantClasses[variant]
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`${base} ${sizeClass} ${variantClass} ${className}`.trim()}
        {...rest}
      >
        {isLoading ? (
          <>
            <Spinner />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

### components/ui/index.ts

```ts
// 파일경로: components/ui/index.ts
export { Button } from './Button'
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button'
export { Card } from './Card'
export type { CardProps, CardVariant } from './Card'
export { Badge } from './Badge'
export type { BadgeProps, BadgeVariant } from './Badge'
export { Input, Textarea } from './Input'
export type { InputProps, TextareaProps } from './Input'
export { KeywordPill } from './KeywordPill'
export type { KeywordPillProps, KeywordPillVariant } from './KeywordPill'
export { PaywallOverlay } from './PaywallOverlay'
export type { PaywallOverlayProps, PaywallTier } from './PaywallOverlay'
```

### components/CopyButton.tsx

```tsx
// 파일경로: components/CopyButton.tsx
"use client";

import { useState } from "react";

interface CopyButtonProps {
  value: string;
  variant?: "default" | "primary";
}

export function CopyButton({ value, variant = "default" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // noop
    }
  }

  if (!value) return null;

  if (variant === "primary") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D] transition-colors shrink-0"
      >
        <span aria-hidden>📋</span>
        {copied ? "Copied!" : "Copy Code"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="ml-2 inline-flex items-center rounded-md border border-[#E8E6E1] bg-[#F8F7F4] px-2 py-1 text-xs text-[#3D3B36] hover:bg-[#F2F1EE]"
    >
      <span aria-hidden>📋</span>
      <span className="sr-only">Copy</span>
      {copied && <span className="ml-2 text-xs text-[#16A34A]">Copied!</span>}
    </button>
  );
}
```

### components/BrokerEmailDraft.tsx

```tsx
// 파일경로: components/BrokerEmailDraft.tsx
"use client";

import { useState } from "react";
import type { ScoutFinalReportsRow } from "@/types/database";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function BrokerEmailDraft({
  report,
  onOpenChange,
}: {
  report: ScoutFinalReportsRow;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [destination, setDestination] = useState("");
  const [copied, setCopied] = useState(false);

  const handleToggle = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  const dest = destination.trim() || "your destination country";

  function buildEmailBody(): string {
    const lines: string[] = [];

    lines.push(`Subject: HS Code Verification Request — ${report.translated_name || report.product_name}`);
    lines.push("");
    lines.push("Dear Customs Broker,");
    lines.push("");
    lines.push(
      `I am planning to import the following product from South Korea and would appreciate your help verifying the classification and compliance requirements for import to ${dest}.`
    );
    lines.push("");

    lines.push("── PRODUCT INFORMATION ──");
    lines.push(`Product: ${report.translated_name || report.product_name}`);
    if (report.category?.trim()) lines.push(`Category: ${report.category}`);
    lines.push("");

    lines.push("── SUGGESTED CLASSIFICATION ──");
    lines.push(`HS Code: ${report.hs_code}`);
    if (report.hs_description?.trim()) lines.push(`Description: ${report.hs_description}`);
    if (report.status_reason?.trim()) lines.push(`Classification Basis: ${report.status_reason}`);
    lines.push("");

    const compLines: string[] = [];
    if (report.composition_info?.trim()) compLines.push(`Key Ingredients: ${report.composition_info}`);
    if (report.key_risk_ingredient?.trim()) compLines.push(`Risk Ingredients: ${report.key_risk_ingredient}`);

    let hazmatParsed: Record<string, boolean> | null = null;
    try {
      let h = report.hazmat_status;
      if (typeof h === "string") h = JSON.parse(h);
      if (typeof h === "string") h = JSON.parse(h);
      if (typeof h === "object" && h !== null) hazmatParsed = h as Record<string, boolean>;
    } catch {
      // ignore
    }

    if (hazmatParsed) {
      const flags: string[] = [];
      if (hazmatParsed.contains_liquid) flags.push("Liquid");
      if (hazmatParsed.contains_powder) flags.push("Powder");
      if (hazmatParsed.contains_battery) flags.push("Battery");
      if (hazmatParsed.contains_aerosol) flags.push("Aerosol/Pressurized");
      if (flags.length > 0) compLines.push(`Hazmat Flags: Contains ${flags.join(", ")}`);
    }

    if (compLines.length > 0) {
      lines.push("── COMPOSITION & HAZMAT ──");
      compLines.forEach((l) => lines.push(l));
      lines.push("");
    }

    if (report.required_certificates?.trim()) {
      lines.push("── CERTIFICATIONS ──");
      lines.push(`Required: ${report.required_certificates}`);
      lines.push("");
    }

    const specLines: string[] = [];
    if (report.dimensions_cm?.trim()) specLines.push(`Dimensions: ${report.dimensions_cm}`);
    if (report.actual_weight_g) specLines.push(`Weight: ${report.actual_weight_g}g`);
    if (specLines.length > 0) {
      lines.push("── PHYSICAL SPECS ──");
      specLines.forEach((l) => lines.push(l));
      lines.push("");
    }

    lines.push("Could you please confirm:");
    lines.push(`1. Is this HS code correct for import to ${dest}?`);
    lines.push("2. Are additional certifications or permits needed?");
    lines.push("3. Any duties or restrictions I should be aware of?");
    lines.push("");
    lines.push("Thank you for your assistance.");
    lines.push("");
    lines.push("---");
    lines.push(
      "⚠️ This data was compiled and translated from Korean sources by AI. Final verification by a licensed customs broker is legally required before export."
    );
    lines.push("");
    lines.push("Generated by KoreaScout");
    if (report.image_url?.trim() || report.naver_link?.trim()) lines.push("");
    if (report.image_url?.trim()) lines.push(`Product Image: ${report.image_url}`);
    if (report.naver_link?.trim()) lines.push(`Reference Site: ${report.naver_link}`);

    return lines.join("\n");
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(buildEmailBody());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const bodyText = buildEmailBody();
  const highlightTerm = dest;
  const parts =
    highlightTerm === ""
      ? [bodyText]
      : bodyText.split(new RegExp(`(${escapeRegex(highlightTerm)})`, "gi"));

  return (
    <div>
      <button
        onClick={() => handleToggle(!open)}
        className="w-full text-left p-4 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] hover:bg-[#DCFCE7] transition-colors flex flex-col items-start"
      >
        <div className="flex w-full justify-between items-center">
          <span className="text-lg font-bold text-[#16A34A]">Broker Email Draft</span>
          <span className="text-[#16A34A]/70 shrink-0">{open ? "▲" : "▼"}</span>
        </div>
        <p className="text-xs text-[#9E9C98] mt-1">
          *Includes English drafts for HS Code, Hazmat, and INCI lists for your broker.
        </p>
      </button>

      {open && (
        <div className="mt-3 p-4 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4]">
          <div className="mb-4">
            <label className="text-sm font-medium text-[#6B6860] block mb-2">Destination Country</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. United States, Germany, Japan..."
              className="w-full bg-white border border-[#E8E6E1] rounded-lg px-4 py-3 text-base text-[#1A1916] placeholder:text-[#C4C2BE] focus:outline-none focus:border-[#16A34A]"
            />
          </div>
          <pre className="text-sm font-medium text-[#1A1916] leading-relaxed whitespace-pre-wrap font-sans max-h-64 overflow-y-auto mb-3 p-3 bg-[#F2F1EE] rounded-lg">
            {parts.map((segment, i) =>
              i % 2 === 1 ? (
                <mark key={i} className="bg-amber-400/40 text-[#1A1916] font-bold rounded px-0.5">
                  {segment}
                </mark>
              ) : (
                segment
              )
            )}
          </pre>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D] transition-colors"
          >
            {copied ? "✅ Copied!" : "📋 Copy Email Draft"}
          </button>
        </div>
      )}
    </div>
  );
}
```

### components/ExpandableText.tsx

```tsx
// 파일경로: components/ExpandableText.tsx
"use client";

import { useState, useRef, useEffect } from "react";

export function ExpandableText({ text, label }: { text: string; label: string }) {
  const [expanded, setExpanded] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (ref.current && !expanded) {
      setNeedsClamp(ref.current.scrollHeight > ref.current.clientHeight + 4);
    }
  }, [text, expanded]);

  return (
    <div className="mb-3" aria-label={label}>
      <div className="relative">
        <p
          ref={ref}
          className={`text-sm text-[#6B6860] leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}
        >
          {text}
        </p>
        {!expanded && needsClamp && (
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#F8F7F4] to-transparent" />
        )}
      </div>
      {needsClamp && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-[#16A34A] hover:text-[#15803D] mt-1"
        >
          {expanded ? "Show Less ▲" : "Read More ▼"}
        </button>
      )}
    </div>
  );
}
```

### components/ScrollToIdButton.tsx

```tsx
// 파일경로: components/ScrollToIdButton.tsx
"use client";

export function ScrollToIdButton({
  sectionId,
  className,
  children,
}: {
  sectionId: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })}
      className={className}
    >
      {children}
    </button>
  );
}
```

### components/DonutGauge.tsx

```tsx
// 파일경로: components/DonutGauge.tsx
"use client";

/**
 * Donut gauge for 0–100 score. Color zones: 0–40 red, 41–70 yellow, 71–100 green.
 * Used in Section 2 (Trend Signal Dashboard) for market_viability.
 */
export function DonutGauge({
  value,
  size = 120,
  strokeWidth = 10,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const clamped = Math.min(100, Math.max(0, Number(value)));
  const normalized = clamped / 100;

  const color =
    clamped <= 40
      ? "rgb(239, 68, 68)" // red-500
      : clamped <= 70
        ? "rgb(234, 179, 8)" // amber-400 / yellow
        : "#16A34A"; // Design System green

  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const strokeDasharray = `${normalized * circumference} ${circumference}`;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        {/* background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#E8E6E1"
          strokeWidth={strokeWidth}
        />
        {/* progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={0}
          className="transition-[stroke-dasharray] duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none leading-none">
        <span
          className={`font-mono font-bold tabular-nums text-[#1A1916] ${
            size >= 150 ? "text-4xl" : size >= 80 ? "text-3xl" : "text-lg"
          }`}
        >
          {Math.round(clamped)}
        </span>
        <span className={`text-[#9E9C98] ${size >= 150 ? "text-sm" : "text-xs"}`}>/100</span>
      </div>
    </div>
  );
}
```

### components/FavoriteButton.tsx

```tsx
// 파일경로: components/FavoriteButton.tsx
"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleFavorite } from "@/app/actions/favorites";

type Props = {
  reportId: string;
  weekId?: string;
  isFavorited: boolean;
  className?: string;
  iconClassName?: string;
};

export function FavoriteButton({ reportId, weekId, isFavorited: initial, className, iconClassName }: Props) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(initial);
  const [pending, setPending] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;
    setPending(true);
    const prev = isFavorited;
    setIsFavorited(!prev);
    const { ok } = await toggleFavorite(reportId, weekId);
    if (!ok) setIsFavorited(prev);
    router.refresh();
    setPending(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={
        className ??
        `absolute top-4 right-4 transition-colors hover:opacity-90 cursor-pointer disabled:opacity-50 ${
          isFavorited ? "fill-[#16A34A] text-[#16A34A]" : "text-gray-300 hover:text-[#16A34A]"
        }`
      }
      aria-label={isFavorited ? "Remove from My Picks" : "Add to My Picks"}
    >
      <Bookmark
        className={iconClassName ?? "h-5 w-5"}
        strokeWidth={1.5}
        fill={isFavorited ? "currentColor" : "none"}
      />
    </button>
  );
}
```

### components/LockedSection.tsx

```tsx
// 파일경로: components/LockedSection.tsx
"use client";

import Link from "next/link";

export interface LockedSectionProps {
  message: string;
  cta: string;
  href: string;
  lockedFields?: string[];
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function LockedSection({
  message,
  cta,
  href,
  lockedFields,
}: LockedSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E8E6E1] bg-white">

      {/* ── ZONE 1: Teaser — 블러된 가짜 데이터 배경 ── */}
      <div
        className="px-6 pt-6 pb-0 select-none pointer-events-none"
        aria-hidden
      >
        {/* 가짜 데이터 행들 */}
        <div className="space-y-3 opacity-40">
          <div className="flex items-center justify-between">
            <div className="h-3 w-36 rounded-full bg-[#C4C2BE]" />
            <div className="h-3 w-24 rounded-full bg-[#16A34A]/30" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 w-52 rounded-full bg-[#C4C2BE]" />
            <div className="h-3 w-16 rounded-full bg-[#C4C2BE]" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 w-44 rounded-full bg-[#C4C2BE]" />
            <div className="h-5 w-20 rounded-md bg-[#DCFCE7]" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 w-32 rounded-full bg-[#C4C2BE]" />
            <div className="h-3 w-28 rounded-full bg-[#C4C2BE]" />
          </div>
        </div>
      </div>

      {/* ── ZONE 2: "What's locked inside" 티징 체크리스트 ── */}
      {lockedFields && lockedFields.length > 0 && (
        <div
          className="relative px-6 pt-5 pb-4 select-none pointer-events-none"
          aria-hidden
        >
          {/* 섹션 헤더 */}
          <p className="text-xs font-semibold uppercase tracking-widest text-[#9E9C98] mb-3">
            What&apos;s locked inside
          </p>

          {/* 필드 체크리스트 뱃지 */}
          <div className="flex flex-wrap gap-2">
            {lockedFields.map((field) => (
              <div
                key={field}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8E6E1] bg-[#F8F7F4] px-3 py-1.5"
              >
                {/* 자물쇠 도트 */}
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#E8E6E1]">
                  <LockIcon className="text-[#9E9C98]" />
                </span>
                <span className="text-sm font-medium text-[#6B6860]">
                  {field}
                </span>
              </div>
            ))}
          </div>

          {/* "결제 후엔 체크마크로 바뀐다" 암시 */}
          <p className="mt-3 text-xs text-[#C4C2BE]">
            🔓 Unlock → each item above becomes instantly available
          </p>
        </div>
      )}

      {/* ── 그라데이션 페이드 오버레이 ── */}
      <div
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/0 to-white/0 pointer-events-none"
        aria-hidden
      />

      {/* ── ZONE 3: CTA 블록 ── */}
      <div className="relative border-t border-[#F2F1EE] bg-white px-6 py-6 flex flex-col items-center text-center">

        {/* 메시지 */}
        <p className="text-base font-semibold text-[#1A1916] mb-1 max-w-sm leading-snug">
          {message}
        </p>

        {/* Rule of 3 서브카피 */}
        <p className="text-sm text-[#6B6860] mb-5 max-w-xs leading-relaxed">
          Active subscribers see the{" "}
          <span className="font-semibold text-[#1A1916]">3 most recent reports</span>
          {" "}— live data, every Monday.
        </p>

        {/* CTA 버튼 */}
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#15803D] shadow-[0_2px_8px_0_rgb(22_163_74/0.3)]"
        >
          {cta}
          <span aria-hidden>→</span>
        </Link>

        {/* 심리적 앵커 */}
        <p className="mt-3 text-xs text-[#9E9C98]">
          Cancel anytime · The window closes every Monday.
        </p>

      </div>
    </div>
  );
}
```

### components/layout/ClientLeftNav.tsx

```tsx
// 파일경로: components/layout/ClientLeftNav.tsx
'use client'

import { useEffect, useState } from 'react'

export type Section = { id: string; label: string; icon: React.ReactNode }

export type NavTier = 'free' | 'standard' | 'alpha'

export interface ClientLeftNavProps {
  sections: Section[]
  /** When provided, shows a User Profile block at the bottom instead of placeholder. */
  userEmail?: string | null
  tier?: NavTier
}

function truncateEmail(email: string, maxLen = 24): string {
  if (email.length <= maxLen) return email
  const local = email.split('@')[0] ?? ''
  const domain = email.split('@')[1] ?? ''
  if (local.length + domain.length + 1 <= maxLen) return email
  const keep = maxLen - domain.length - 4 // "...@"
  return keep > 0 ? `${local.slice(0, keep)}...@${domain}` : `...@${domain}`
}

export function ClientLeftNav({ sections, userEmail, tier }: ClientLeftNavProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting)
        if (intersecting.length === 0) return
        const byTop = [...intersecting].sort(
          (a, b) =>
            (a.target as HTMLElement).getBoundingClientRect().top -
            (b.target as HTMLElement).getBoundingClientRect().top
        )
        setActiveId(byTop[0].target.id)
      },
      {
        threshold: 0.1,
        rootMargin: '-15% 0px -45% 0px',
      }
    )

    const ids = sections.map((s) => s.id)
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className="fixed left-0 top-[72px] h-[calc(100vh-4.5rem)] w-56 z-40 bg-[#F8F7F4] border-r border-[#E8E6E1] flex flex-col"
      aria-label="Page sections"
    >
      <div className="flex-1 overflow-y-auto py-5">
        {sections.map(({ id, label, icon }) => {
          const isActive = activeId === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleClick(id)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-base rounded-lg mx-2 text-left transition-colors ${
                isActive
                  ? 'font-semibold text-[#16A34A] bg-[#DCFCE7]'
                  : 'text-[#6B6860] hover:bg-[#F2F1EE] hover:text-[#1A1916]'
              }`}
            >
              {icon}
              <span>{label}</span>
            </button>
          )
        })}
      </div>
      <div className="border-t border-[#E8E6E1] bg-[#F2F1EE]/80 p-4 shrink-0">
        {userEmail != null && userEmail !== '' ? (
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: '#16A34A' }}
              aria-hidden
            >
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 flex flex-col gap-1">
              <p className="text-sm font-medium text-[#1A1916] truncate" title={userEmail}>
                {truncateEmail(userEmail)}
              </p>
              {tier != null && (
                <span
                  className={
                    tier === 'alpha'
                      ? 'w-fit rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-[#16A34A]/10 text-[#16A34A]'
                      : 'w-fit rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-gray-100 text-gray-600 border border-gray-200'
                  }
                >
                  {tier === 'alpha' ? 'Alpha' : tier === 'standard' ? 'Standard' : 'Free'}
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#9E9C98]">KoreaScout</p>
        )}
      </div>
    </nav>
  )
}
```

### components/HazmatBadges.tsx

```tsx
// 파일경로: components/HazmatBadges.tsx
import { Droplets, Sparkles, BatteryCharging, Wind } from "lucide-react";

type HazmatStatus = {
  contains_liquid?: boolean;
  contains_powder?: boolean;
  contains_battery?: boolean;
  contains_aerosol?: boolean;
};

interface HazmatBadgesProps {
  status: unknown;
}

function parseHazmatStatus(raw: unknown): HazmatStatus | null {
  if (raw == null) return null;
  if (typeof raw === "number" || typeof raw === "boolean") return null;
  let hazmat: unknown = raw;
  if (typeof hazmat === "string") {
    try {
      hazmat = JSON.parse(hazmat);
    } catch {
      return null;
    }
  }
  if (typeof hazmat === "string") {
    try {
      hazmat = JSON.parse(hazmat);
    } catch {
      return null;
    }
  }
  if (typeof hazmat === "object" && hazmat !== null) return hazmat as HazmatStatus;
  return null;
}

const ITEMS: Array<{
  key: keyof HazmatStatus;
  label: string;
  icon: string;
  trueClass: string;
  falseClass: string;
}> = [
  { key: "contains_liquid", label: "Liquid", icon: "💧", trueClass: "bg-[#DBEAFE] border-[#BFDBFE] text-[#2563EB]", falseClass: "bg-[#F8F7F4] border-[#E8E6E1] text-[#9E9C98]" },
  { key: "contains_powder", label: "Powder", icon: "🧪", trueClass: "bg-[#6B6860]/80 border-[#9E9C98]/80 text-white", falseClass: "bg-[#F8F7F4] border-[#E8E6E1] text-[#9E9C98]" },
  { key: "contains_battery", label: "Battery", icon: "🔋", trueClass: "bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]", falseClass: "bg-[#F8F7F4] border-[#E8E6E1] text-[#9E9C98]" },
  { key: "contains_aerosol", label: "Aerosol", icon: "💨", trueClass: "bg-[#FEE2E2] border-[#FECACA] text-[#DC2626]", falseClass: "bg-[#F8F7F4] border-[#E8E6E1] text-[#9E9C98]" },
];

export function HazmatBadges({ status }: HazmatBadgesProps) {
  const parsed = parseHazmatStatus(status);
  if (!parsed || typeof parsed !== "object") return null;

  const badges = ITEMS.map((item) => {
    const active = Boolean(parsed[item.key]);
    return {
      label: item.label,
      icon: item.icon,
      active,
      activeClass: active ? item.trueClass : item.falseClass,
    };
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className={`flex items-center justify-center gap-3 p-3 rounded-xl border min-w-0 ${
            badge.active ? badge.activeClass : "bg-[#F8F7F4] border-[#E8E6E1]"
          }`}
        >
          {badge.label === "Liquid" && <Droplets className="w-3.5 h-3.5 text-blue-500 shrink-0" aria-hidden />}
          {badge.label === "Powder" && <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden />}
          {badge.label === "Battery" && <BatteryCharging className="w-3.5 h-3.5 text-green-500 shrink-0" aria-hidden />}
          {badge.label === "Aerosol" && <Wind className="w-3.5 h-3.5 text-purple-400 shrink-0" aria-hidden />}
          <span className="text-[13px] font-black uppercase tracking-[0.25em] text-[#1A1916] truncate min-w-0">
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  );
}
```

### components/GroupBBrokerSection.tsx

```tsx
// 파일경로: components/GroupBBrokerSection.tsx
"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { BrokerEmailDraft } from "@/components/BrokerEmailDraft";
import type { ScoutFinalReportsRow } from "@/types/database";

function formatHsCode(raw: string | null | undefined): string {
  const s = raw?.trim().replace(/\D/g, "") ?? "";
  if (s.length === 6) return `${s.slice(0, 4)}.${s.slice(4)}`;
  return raw?.trim() ?? "";
}

export function GroupBBrokerSection({
  report,
  canSeeAlpha,
}: {
  report: ScoutFinalReportsRow;
  canSeeAlpha: boolean;
}) {
  const [isEmailOpen, setIsEmailOpen] = useState(false);

  return (
    <div className="bg-[#F8F7F4] rounded-2xl p-10">
      <p className="text-xl font-bold text-[#1A1916] mb-8">
        HS Code &amp; Broker Weapon
      </p>

      {canSeeAlpha ? (
        <div
          className={`transition-all duration-300 ease-in-out ${
            isEmailOpen
              ? "flex flex-col w-full gap-8"
              : "grid grid-cols-2"
          }`}
        >
          <div className={
            isEmailOpen
              ? "w-full pb-6 border-b border-[#E8E6E1]"
              : "pr-10 border-r border-[#E8E6E1]"
          }>
            <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-3">HS Code</p>
            {report.hs_code?.trim() ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <p className={`font-extrabold font-mono text-[#1A1916] tracking-tight transition-all duration-300 ${
                    isEmailOpen ? "text-2xl" : "text-4xl"
                  }`}>
                    {formatHsCode(report.hs_code) || report.hs_code}
                  </p>
                  <CopyButton
                    value={formatHsCode(report.hs_code) || report.hs_code || ""}
                  />
                </div>
                {!isEmailOpen && report.hs_description?.trim() && (
                  <p className="text-lg text-[#1A1916] leading-relaxed">
                    {report.hs_description}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-[#9E9C98] italic">
                No HS code available.
              </p>
            )}
          </div>

          <div className={isEmailOpen ? "w-full" : "pl-10"}>
            <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">Broker Email Draft</p>
            {report.hs_code?.trim() ? (
              <BrokerEmailDraft
                report={report}
                onOpenChange={setIsEmailOpen}
              />
            ) : (
              <p className="text-sm text-[#9E9C98] italic">
                Available once HS code is confirmed.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <div className="h-24 rounded-xl bg-[#F2F1EE]" />
          <div className="h-24 rounded-xl bg-[#F2F1EE]" />
        </div>
      )}
    </div>
  );
}
```

---

## 7. 상세 페이지 전용 컴포넌트

### components/ProductIdentity.tsx

```tsx
// 파일경로: components/ProductIdentity.tsx
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
            {report.product_name || report.translated_name}
          </h1>

          {report.translated_name && (
            <p className="text-lg font-medium text-[#6B6860] line-clamp-2 mb-6">
              {report.translated_name}
            </p>
          )}

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

## 8. 리포트 섹션 컴포넌트

### components/report/index.ts

```ts
// 파일경로: components/report/index.ts
export { TrendSignalDashboard } from "./TrendSignalDashboard";
export { MarketIntelligence } from "./MarketIntelligence";
export { SocialProofTrendIntelligence } from "./SocialProofTrendIntelligence";
export { SourcingIntel } from "./SourcingIntel";
export { SupplierContact } from "./SupplierContact";

export {
  SECTION_3_LOCKED_CTA,
  SECTION_STANDARD_CTA,
  SECTION_4_LOCKED_CTA,
  SECTION_CONSUMER_CTA,
  SECTION_ALPHA_SOURCING_CTA,
  SECTION_ALPHA_MEDIA_CTA,
  SECTION_ALPHA_SUPPLIER_CTA,
  EXPORT_STATUS_DISPLAY,
  SHIPPING_TIER_TOOLTIP,
} from "./constants";

export type { StrategyStep, RegionPriceRow } from "./utils";
```

### components/report/TrendSignalDashboard.tsx

```tsx
// 파일경로: components/report/TrendSignalDashboard.tsx
"use client";

import { DonutGauge } from "@/components/DonutGauge";
import { Badge } from "@/components/ui";
import { TrendingUp } from "lucide-react";
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
    </section>
  );
}
```

### components/report/MarketIntelligence.tsx

```tsx
// 파일경로: components/report/MarketIntelligence.tsx
"use client";

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
            { code: "EU", label: "European Union", row: null },
            { code: "JP", label: "Japan", row: null },
            { code: "SEA", label: "Southeast Asia", row: findRow("SEA") ?? null },
            { code: "UAE", label: "Middle East", row: null },
          ];

          return (
            <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 mb-6">
              <div className="flex items-baseline">
                <h3 className="text-xl font-bold text-[#1A1916]">Global Market Availability</h3>
                <span className="text-sm text-[#6B6860] font-normal ml-3">6 Strategic Markets for K-Products</span>
              </div>
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
    </section>
  );
}
```

### components/report/SocialProofTrendIntelligence.tsx

```tsx
// 파일경로: components/report/SocialProofTrendIntelligence.tsx
"use client";

import { Button } from "@/components/ui";
import { PRICING } from "@/src/config/pricing";
import { Lock } from "lucide-react";
import type { ScoutFinalReportsRow } from "@/types/database";
import { normalizeToArray, parseSourcingStrategy } from "./utils";

export function SocialProofTrendIntelligence({
  report,
  tier,
  isTeaser,
}: {
  report: ScoutFinalReportsRow;
  tier: "free" | "standard" | "alpha";
  isTeaser: boolean;
}) {
  const canSeeAlpha = tier === "alpha" || isTeaser;

  const risingKw = normalizeToArray(report.rising_keywords);
  const seoKw = normalizeToArray(report.seo_keywords);
  const viralHt = normalizeToArray(report.viral_hashtags);
  const hasAnyTrending = risingKw.length > 0 || seoKw.length > 0 || viralHt.length > 0;

  const allSteps = parseSourcingStrategy(report.sourcing_tip);
  const steps = allSteps.slice(0, 3);

  return (
    <section
      id="section-4"
      className="scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-8 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]"
    >
      <h2 className="text-3xl font-bold text-[#1A1916] tracking-tight mb-12">
        Social Proof &amp; Trend Intelligence
      </h2>

      {report.buzz_summary?.trim() && (
        <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-12">
          <p className="text-xl font-bold text-[#1A1916] mb-6">Social Buzz</p>
          <span className="block text-6xl font-serif text-[#16A34A] leading-none mb-6">&ldquo;</span>
          <p className="text-3xl italic font-medium text-[#1A1916] leading-tight max-w-4xl">
            {report.buzz_summary}
          </p>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#9E9C98] mt-8">
            KoreaScout Intelligence Engine
          </p>
        </div>
      )}

      {(report.kr_local_score != null || report.global_trend_score != null) && (
        <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-12">
          <p className="text-xl font-bold text-[#1A1916] mb-10">Market Gap Analysis</p>
          <div className="grid grid-cols-2">
            <div className="pr-12 border-r border-[#E8E6E1]">
              <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">Korean Traction</p>
              <p className="text-7xl font-extrabold text-[#16A34A] tracking-tighter leading-none">
                {report.kr_local_score ?? "—"}
              </p>
              <div className="w-full h-1 rounded-full bg-[#E8E6E1] overflow-hidden mt-4 mb-6">
                <div
                  className="h-full rounded-full bg-[#16A34A] transition-all"
                  style={{ width: `${Math.min(report.kr_local_score || 0, 100)}%` }}
                />
              </div>
              {report.kr_evidence?.trim() && (
                <p className="text-lg text-[#1A1916] leading-relaxed mt-4">{report.kr_evidence}</p>
              )}
              {report.kr_source_used?.trim() && (
                <p className="text-xs text-[#9E9C98] mt-3">Source: {report.kr_source_used}</p>
              )}
            </div>
            <div className="pl-12">
              <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">Global Presence</p>
              <p className="text-7xl font-extrabold text-[#2563EB] tracking-tighter leading-none">
                {report.global_trend_score ?? "—"}
              </p>
              <div className="w-full h-1 rounded-full bg-[#E8E6E1] overflow-hidden mt-4 mb-6">
                <div
                  className="h-full rounded-full bg-[#2563EB] transition-all"
                  style={{ width: `${Math.min(report.global_trend_score || 0, 100)}%` }}
                />
              </div>
              {report.global_evidence?.trim() && (
                <p className="text-lg text-[#1A1916] leading-relaxed mt-4">{report.global_evidence}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {report.gap_index != null && (
        <div className="mt-32 mb-32 text-center">
          <p className="text-xl font-bold text-[#1A1916] mb-6">Gap Index</p>
          <p className="font-black text-[#16A34A] leading-none tracking-tighter" style={{ fontSize: "140px" }}>
            {report.gap_index}
          </p>
          {report.gap_status && (
            <div className="mt-4 mb-6 flex justify-center">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full font-semibold text-sm ${
                  report.gap_status === "Blue Ocean" || report.gap_status === "Emerging"
                    ? "bg-[#DCFCE7] text-[#16A34A]"
                    : "bg-[#FEF3C7] text-[#D97706]"
                }`}
              >
                {report.gap_status}
              </span>
            </div>
          )}
          {report.opportunity_reasoning?.trim() && (
            <p className="text-base italic text-[#6B6860] max-w-lg mx-auto leading-relaxed mt-4">
              {report.opportunity_reasoning}
            </p>
          )}
        </div>
      )}

      {hasAnyTrending && (
        <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-12">
          <p className="text-xl font-bold text-[#1A1916] mb-10">Trending Signals</p>

          {risingKw.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">Rising Keywords (KR)</p>
              <div className="flex flex-wrap gap-3 w-full">
                {risingKw.map((kw) => (
                  <span
                    key={kw}
                    className="flex-1 min-w-max text-center bg-[#DCFCE7] text-[#16A34A] rounded-full px-6 py-3 text-sm font-bold tracking-tight hover:bg-[#BBF7D0] transition-colors cursor-default"
                  >
                    ↗ {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {seoKw.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">Global SEO Keywords</p>
              {canSeeAlpha ? (
                <div className="flex flex-wrap gap-3 w-full">
                  {seoKw.map((kw) => (
                    <span
                      key={kw}
                      className="flex-1 min-w-max text-center bg-white border border-[#E8E6E1] text-[#1A1916] rounded-full px-6 py-3 text-sm font-bold tracking-tight hover:bg-[#F1F0ED] transition-colors cursor-default"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="h-12 w-full rounded-full bg-[#E8E6E1]/50" />
              )}
            </div>
          )}

          {viralHt.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">Viral Hashtags</p>
              {canSeeAlpha ? (
                <div className="flex flex-wrap gap-3 w-full">
                  {viralHt.map((ht) => (
                    <span
                      key={ht}
                      className="flex-1 min-w-max text-center bg-white border border-[#E8E6E1] text-[#1A1916] rounded-full px-6 py-3 text-sm font-black hover:bg-[#F1F0ED] transition-colors cursor-default"
                    >
                      #{ht.startsWith("#") ? ht.slice(1) : ht}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="h-12 w-full rounded-full bg-[#E8E6E1]/50" />
              )}
            </div>
          )}

          {!canSeeAlpha && (seoKw.length > 0 || viralHt.length > 0) && (
            <div className="mt-6 flex flex-col items-center justify-center py-8 gap-3 rounded-xl border border-[#E8E6E1] bg-white px-4">
              <Lock className="w-4 h-4 text-[#9E9C98]" />
              <p className="text-sm text-[#6B6860] text-center">
                SEO keywords &amp; viral hashtags are available on Alpha.
              </p>
              <a href="/pricing">
                <Button variant="secondary" size="sm">Go Alpha {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo →</Button>
              </a>
            </div>
          )}
        </div>
      )}

      {steps.length > 0 && (
        <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-12">
          <p className="text-xl font-bold text-[#1A1916] mb-10">Scout Strategy Report</p>

          {canSeeAlpha ? (
            <div className="space-y-16">
              {steps.map((step, i) => (
                <div key={i} className="relative flex gap-6">
                  <span
                    className="absolute -top-4 -left-2 text-[80px] font-black leading-none select-none pointer-events-none opacity-[0.03]"
                    style={{ color: "#1A1916" }}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-1 bg-[#16A34A] rounded-full shrink-0 self-stretch" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2">Step {i + 1}</p>
                    <p className="text-base font-extrabold text-[#1A1916] mb-3">{step.label}</p>
                    <p className="text-lg text-[#1A1916] leading-relaxed mb-16 font-medium whitespace-pre-line">
                      {step.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-32 w-full rounded-xl bg-[#E8E6E1]/50" />
              <div className="flex flex-col items-center justify-center py-8 gap-3 rounded-xl border border-[#E8E6E1] bg-white px-4">
                <Lock className="w-4 h-4 text-[#9E9C98]" />
                <p className="text-sm text-[#6B6860] text-center">Full entry strategy is available on Alpha.</p>
                <a href="/pricing">
                  <Button variant="secondary" size="sm">Go Alpha {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo →</Button>
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
```

### components/report/SourcingIntel.tsx

```tsx
// 파일경로: components/report/SourcingIntel.tsx
"use client";

import { GroupBBrokerSection } from "@/components/GroupBBrokerSection";
import { HazmatBadges } from "@/components/HazmatBadges";
import { ExpandableText } from "@/components/ExpandableText";
import { Button } from "@/components/ui";
import { PRICING } from "@/src/config/pricing";
import { AlertTriangle, ArrowRight, CheckCircle, Lock, XCircle } from "lucide-react";
import type { ScoutFinalReportsRow } from "@/types/database";
import { describeShippingTier, parseSourcingStrategy } from "./utils";

export function SourcingIntel({
  report,
  tier,
  isTeaser,
}: {
  report: ScoutFinalReportsRow;
  tier: string;
  isTeaser: boolean;
}) {
  const canSeeAlpha = tier === "alpha" || isTeaser;

  const allSteps = parseSourcingStrategy(report.sourcing_tip);
  const logisticsSteps = allSteps.slice(3, 5);

  const hasActual = report.actual_weight_g != null;
  const hasVol = report.volumetric_weight_g != null;
  const hasBillable = report.billable_weight_g != null;
  const hasWeight = hasActual || hasVol || hasBillable;

  const certs = report.required_certificates?.trim()
    ? report.required_certificates.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

  const exportConfig = (() => {
    const s = report.export_status;
    if (s === "Green") return { icon: "✓", label: "Ready for Export", color: "text-[#16A34A]", bg: "bg-[#DCFCE7]", border: "border-[#BBF7D0]" };
    if (s === "Yellow") return { icon: "⚠", label: "Conditional Export", color: "text-[#D97706]", bg: "bg-[#FEF3C7]", border: "border-[#FDE68A]" };
    return { icon: "✗", label: "Export Restricted", color: "text-[#DC2626]", bg: "bg-[#FEE2E2]", border: "border-[#FECACA]" };
  })();

  return (
    <section
      id="section-5"
      className="scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-8 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] relative"
    >
      <h2 className="text-3xl font-bold text-[#1A1916] tracking-tight mb-12">
        Export &amp; Logistics Intel
      </h2>

      <div className="space-y-6">

        <div className="bg-[#F8F7F4] rounded-2xl p-10">
          <p className="text-xl font-bold text-[#1A1916] mb-8">Export Readiness</p>

          {canSeeAlpha ? (
            <div className={`rounded-xl border-2 ${exportConfig.border} ${exportConfig.bg} px-8 py-6`}>
              <div className="flex items-center gap-4 mb-4">
                {report.export_status === "Green" && <CheckCircle className={`w-8 h-8 shrink-0 ${exportConfig.color}`} />}
                {report.export_status === "Yellow" && <AlertTriangle className={`w-8 h-8 shrink-0 ${exportConfig.color}`} />}
                {report.export_status !== "Green" && report.export_status !== "Yellow" && (
                  <XCircle className={`w-8 h-8 shrink-0 ${exportConfig.color}`} />
                )}
                <p className={`text-2xl font-black tracking-tighter ${exportConfig.color}`}>{exportConfig.label}</p>
              </div>
              {report.status_reason?.trim() && (
                <p className="text-lg text-[#1A1916] leading-relaxed">{report.status_reason}</p>
              )}
              <p className="text-sm font-semibold italic text-[#3D3B36] mt-4 pt-4 border-t border-black/5">
                {report.export_status === "Green" &&
                  "Full clearance. Market dominance is within reach. Immediate high-velocity sourcing recommended."}
                {report.export_status === "Yellow" &&
                  "Strategic entry point. Success depends on precise compliance handling. Navigate with care for smooth export."}
                {report.export_status !== "Green" && report.export_status !== "Yellow" &&
                  "A high-entry barrier is your competitive moat. Overcoming this hurdle ensures market exclusivity. Verify local compliance status."}
              </p>
            </div>
          ) : (
            <div className="h-20 w-full rounded-xl bg-[#F2F1EE]" />
          )}
        </div>

        <GroupBBrokerSection report={report} canSeeAlpha={canSeeAlpha} />

        <div className="bg-[#F8F7F4] rounded-2xl p-10">
          <p className="text-xl font-bold text-[#1A1916] mb-8">Logistics Dashboard</p>

          {canSeeAlpha ? (
            <>
              {hasWeight && (
                <div className="flex items-center gap-3 mb-12">
                  <div className="flex-1 bg-white border border-[#E8E6E1] rounded-xl p-5 text-center">
                    <p className="text-lg font-bold text-[#6B6860] uppercase tracking-widest mb-3">Actual Weight</p>
                    <p className="text-4xl font-black tracking-tighter text-[#1A1916]">
                      {hasActual ? `${report.actual_weight_g}g` : "—"}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#9E9C98] shrink-0" />
                  <div className="flex-1 bg-white border border-[#E8E6E1] rounded-xl p-5 text-center">
                    <p className="text-lg font-bold text-[#6B6860] uppercase tracking-widest mb-3">Volumetric Weight</p>
                    <p className="text-4xl font-black tracking-tighter text-[#1A1916]">
                      {hasVol ? `${report.volumetric_weight_g}g` : "—"}
                    </p>
                    {report.dimensions_cm?.trim() && (
                      <span className="inline-block mt-2 bg-[#F2F1EE] text-[#9E9C98] rounded px-2 py-0.5 text-xs font-medium">
                        {report.dimensions_cm}
                      </span>
                    )}
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#9E9C98] shrink-0" />
                  <div className="flex-1 bg-[#DCFCE7] border border-[#BBF7D0] rounded-xl p-5 text-center">
                    <p className="text-lg font-bold text-[#6B6860] uppercase tracking-widest mb-3 text-[#16A34A]">Billable Weight</p>
                    <p className="text-4xl font-black tracking-tighter text-[#16A34A]">
                      {hasBillable ? `${report.billable_weight_g}g` : "—"}
                    </p>
                    {hasVol && hasActual && (
                      <p className="text-xs font-bold text-[#16A34A]/70 mt-2">
                        {report.volumetric_weight_g! > report.actual_weight_g! ? "Volumetric applies" : "Dead weight applies"}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {report.shipping_tier?.trim() && (
                <div className="mb-10">
                  <p className="text-xl font-bold text-[#1A1916] mb-4">Shipping Tier</p>
                  <p className="text-lg text-[#1A1916] leading-relaxed">
                    {describeShippingTier(report.shipping_tier).description}
                  </p>
                </div>
              )}

              <div className="border-t border-[#E8E6E1] pt-8 mt-4">
                <p className="text-xl font-bold text-[#1A1916] mb-6">Hazmat &amp; Compliance</p>
                <div className="w-full mb-10">
                  <HazmatBadges status={report.hazmat_status as unknown} />
                </div>
                {report.key_risk_ingredient?.trim() && (
                  <div className="flex items-start gap-2 mt-4">
                    <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#DC2626] leading-relaxed font-medium">
                      Risk Ingredient: {report.key_risk_ingredient}
                    </p>
                  </div>
                )}
                {certs.length > 0 && (
                  <div className="mt-8">
                    <p className="text-xl font-bold text-[#1A1916] mb-4">Certifications Required</p>
                    <div className="flex flex-wrap gap-3">
                      {certs.map((cert) => (
                        <span
                          key={cert}
                          className="bg-white border border-[#E8E6E1] text-[#1A1916] rounded-full px-5 py-2 text-sm font-bold hover:bg-[#F1F0ED] transition-colors cursor-default"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {(report.composition_info?.trim() || report.spec_summary?.trim()) && (
                <div className="border-t border-[#E8E6E1] pt-8 mt-8 space-y-8">
                  {report.composition_info?.trim() && (
                    <div>
                      <p className="text-xl font-bold text-[#1A1916] mb-4">Ingredients</p>
                      <ExpandableText text={report.composition_info} label="Ingredients" />
                    </div>
                  )}
                  {report.spec_summary?.trim() && (
                    <div>
                      <p className="text-xl font-bold text-[#1A1916] mb-4">Specifications</p>
                      <ExpandableText text={report.spec_summary} label="Specifications" />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="h-16 w-full rounded-xl bg-[#F2F1EE]" />
              <div className="h-24 w-full rounded-xl bg-[#F2F1EE]" />
              <div className="h-20 w-full rounded-xl bg-[#F2F1EE]" />
            </div>
          )}
        </div>

        {(() => {
          const notes = report.shipping_notes?.trim();
          const hasNotes = notes && !/tier/i.test(notes);
          if (logisticsSteps.length === 0 && !hasNotes) return null;

          return (
            <div className="bg-[#F8F7F4] rounded-2xl p-10">
              <p className="text-xl font-bold text-[#1A1916] mb-10">Compliance &amp; Logistics Strategy</p>

              {canSeeAlpha ? (
                <>
                  {logisticsSteps.length > 0 && (
                    <div className="space-y-16 mb-10">
                      {logisticsSteps.map((step, i) => (
                        <div key={i} className="relative flex gap-6">
                          <span
                            className="absolute -top-4 -left-2 text-[80px] font-black leading-none select-none pointer-events-none opacity-[0.03]"
                            style={{ color: "#1A1916" }}
                            aria-hidden="true"
                          >
                            {String(i + 4).padStart(2, "0")}
                          </span>
                          <div className="w-1 bg-[#16A34A] rounded-full shrink-0 self-stretch" />
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2">Step {i + 4}</p>
                            <p className="text-base font-extrabold text-[#1A1916] mb-3">{step.label}</p>
                            <p className="text-lg text-[#1A1916] leading-relaxed whitespace-pre-line">{step.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {hasNotes && (
                    <div className="border-t border-dashed border-[#E8E6E1] pt-8">
                      <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-3">Shipping Notes</p>
                      <p className="text-sm italic text-[#6B6860] leading-relaxed">{notes}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="h-24 w-full rounded-xl bg-[#F2F1EE]" />
                  <div className="h-16 w-full rounded-xl bg-[#F2F1EE]" />
                </div>
              )}
            </div>
          );
        })()}

      </div>

      {!canSeeAlpha && (
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col items-center justify-end pb-6 gap-3 rounded-2xl">
          <Lock className="w-5 h-5 text-[#9E9C98]" />
          <p className="text-sm text-[#6B6860] text-center max-w-xs">
            Unlock full logistics intelligence with Alpha.
          </p>
          <a href="/pricing">
            <Button variant="secondary" size="sm">Go Alpha {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo →</Button>
          </a>
        </div>
      )}
    </section>
  );
}
```

### components/report/SupplierContact.tsx

```tsx
// 파일경로: components/report/SupplierContact.tsx
"use client";

import { Button } from "@/components/ui";
import { ArrowRight, ArrowUpRight, Download, ExternalLink, Film, Globe, ImageIcon, LayoutTemplate, Mail, Phone, Play, ShoppingBag } from "lucide-react";
import type { ScoutFinalReportsRow } from "@/types/database";
import { getAiDetailUrl } from "./utils";

export function SupplierContact({
  report,
  tier,
  isTeaser,
}: {
  report: ScoutFinalReportsRow;
  tier: "free" | "standard" | "alpha";
  isTeaser: boolean;
}) {
  const canSeeAlpha = tier === "alpha" || isTeaser;
  const hasSupplierFields =
    (report.m_name && report.m_name.trim()) ||
    (report.corporate_scale && report.corporate_scale.trim()) ||
    (report.contact_email && report.contact_email.trim()) ||
    (report.contact_phone && report.contact_phone.trim()) ||
    (report.m_homepage && report.m_homepage.trim()) ||
    (report.naver_link && report.naver_link.trim()) ||
    (report.wholesale_link && report.wholesale_link?.trim()) ||
    (report.sourcing_tip && report.sourcing_tip.trim());

  if (!hasSupplierFields && !canSeeAlpha) return null;

  const verifiedCostUsd = report.verified_cost_usd ?? null;
  const verifiedCostNote = report.verified_cost_note?.trim()?.toLowerCase() ?? null;
  const isUndisclosed = verifiedCostNote === "undisclosed";
  const costNum =
    verifiedCostUsd != null && verifiedCostUsd !== ""
      ? parseFloat(String(verifiedCostUsd))
      : NaN;
  const hasVerifiedPrice = !Number.isNaN(costNum);

  const viralUrl = report.viral_video_url?.trim() || null;
  const videoUrl = report.video_url?.trim() || null;
  const aiDetailUrl = getAiDetailUrl(report.ai_detail_page_links as string | unknown[] | Record<string, unknown> | null);
  const marketingUrl = report.marketing_assets_url?.trim() || null;
  const aiImageUrl = report.ai_image_url?.trim() || null;

  let rawPrices: Record<string, { url?: string; platform?: string }> = {};
  try {
    const raw = report.global_prices;
    if (typeof raw === "string") {
      const once = JSON.parse(raw);
      rawPrices = typeof once === "string" ? JSON.parse(once) : (once as typeof rawPrices);
    } else if (raw && typeof raw === "object") {
      rawPrices = raw as typeof rawPrices;
    }
  } catch {
    // ignore
  }
  const regionsList = [
    { id: "us", name: "US" },
    { id: "uk", name: "UK" },
    { id: "sea", name: "SEA" },
    { id: "australia", name: "AU" },
    { id: "india", name: "IN" },
  ];
  const globalProofTags: Array<{ region: string; url: string; platform?: string }> = regionsList
    .map((r) => ({
      region: r.name,
      url: rawPrices[r.id]?.url,
      platform: rawPrices[r.id]?.platform?.trim() || undefined,
    }))
    .filter((t): t is { region: string; url: string; platform: string | undefined } => typeof t.url === "string" && t.url.startsWith("http"));

  const assetCards = [
    viralUrl && {
      id: "viral",
      platform: "Viral" as const,
      title: "Viral Reference",
      description: "Korean TikTok/Reels success case. Study the hook.",
      href: viralUrl,
      ctaText: "Watch Original",
      isPrimary: true,
      icon: <Play className="w-32 h-32 text-[#1A1916]" />,
      hoverIcon: <Play className="w-5 h-5 text-[#1A1916]" />,
    },
    videoUrl && {
      id: "video",
      platform: "Video" as const,
      title: "Raw Ad Footage",
      description: "Unedited footage ready for your market adaptation.",
      href: videoUrl,
      ctaText: "Watch & Download",
      isPrimary: false,
      icon: <Film className="w-32 h-32 text-[#1A1916]" />,
      hoverIcon: <Download className="w-5 h-5 text-[#1A1916]" />,
    },
    aiDetailUrl && {
      id: "ai-landing",
      platform: "AI Page" as const,
      title: "AI Landing Page",
      description: "Opal-generated A/B product page drafts.",
      href: aiDetailUrl,
      ctaText: "Open Page",
      isPrimary: false,
      icon: <LayoutTemplate className="w-32 h-32 text-[#1A1916]" />,
      hoverIcon: <ExternalLink className="w-5 h-5 text-[#1A1916]" />,
    },
    marketingUrl && {
      id: "brand-asset",
      platform: "Assets" as const,
      title: "Brand Asset Kit",
      description: "High-res model shots and product imagery from the manufacturer.",
      href: marketingUrl,
      ctaText: "Access Assets",
      isPrimary: false,
      icon: <ImageIcon className="w-32 h-32 text-[#1A1916]" />,
      hoverIcon: <ArrowRight className="w-5 h-5 text-[#1A1916]" />,
    },
    aiImageUrl && {
      id: "ai-image",
      platform: "AI Image" as const,
      title: "AI Product Image",
      description: "AI-generated product image. Open or download.",
      href: aiImageUrl,
      ctaText: "Open / Download",
      isPrimary: false,
      icon: <ImageIcon className="w-32 h-32 text-[#1A1916]" />,
      hoverIcon: <Download className="w-5 h-5 text-[#1A1916]" />,
    },
  ].filter(Boolean) as Array<{
    id: string;
    platform: string;
    title: string;
    description: string;
    href: string;
    ctaText: string;
    isPrimary: boolean;
    icon: React.ReactNode;
    hoverIcon: React.ReactNode;
  }>;

  const refA = "text-xl font-bold text-[#1A1916] mb-10";
  const refB = "text-sm font-bold text-[#6B6860] tracking-widest mb-4";
  const refC = "text-base text-[#3D3B36] leading-relaxed opacity-90";

  return (
    <section className="bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
      {canSeeAlpha && (
        <>
          <div>
            <h2 className="text-3xl font-bold text-[#1A1916] mb-4 tracking-tight">Launch & Execution Kit</h2>
            <p className="text-sm text-[#6B6860] leading-relaxed mt-1">
              From product discovery to live campaign — everything you need.
            </p>
          </div>

          <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-6 mt-6">
            <p className={refA}>Financial Briefing</p>
            <div className="mb-10">
              <p className={refB}>Cost Per Unit</p>
              {hasVerifiedPrice && !isUndisclosed ? (
                <>
                  <p className="font-black tracking-tighter text-[#1A1916] leading-none" style={{ fontSize: "80px" }}>
                    ${costNum.toFixed(2)}
                  </p>
                  {report.verified_at && (
                    <p className="text-xs italic text-[#9E9C98] mt-3">
                      Verified by KoreaScout on{" "}
                      {new Date(report.verified_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </>
              ) : verifiedCostUsd != null && verifiedCostUsd !== "" && isUndisclosed ? (
                <p className="text-sm italic text-[#6B6860]">
                  Pricing verified and on file. Contact the manufacturer directly or use the broker email in Section 5.
                </p>
              ) : (
                <p className="text-sm italic text-[#9E9C98]">Not available</p>
              )}
            </div>
            {(report.moq?.trim() || report.lead_time?.trim()) && (
              <div className="flex gap-32 mt-10">
                {report.moq?.trim() && (
                  <div>
                    <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">MOQ</p>
                    <p className="text-4xl font-black tracking-tighter text-[#1A1916]">{report.moq}</p>
                  </div>
                )}
                {report.lead_time?.trim() && (
                  <div>
                    <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">Est. Production Lead Time</p>
                    <p className="text-4xl font-black tracking-tighter text-[#1A1916]">{report.lead_time}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-6">
            <p className={refA}>Supplier &amp; Brand Intel</p>
            {report.m_name?.trim() && (
              <p className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter break-words mb-8">
                {report.m_name}
              </p>
            )}
            {(() => {
              const contacts = [
                report.contact_email?.trim() && {
                  id: "email",
                  icon: <Mail className="w-8 h-8 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                  label: report.contact_email!.trim(),
                  href: `mailto:${report.contact_email!.trim()}`,
                  external: false as const,
                },
                report.contact_phone?.trim() && {
                  id: "phone",
                  icon: <Phone className="w-8 h-8 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                  label: report.contact_phone!.trim(),
                  href: `tel:${report.contact_phone!.trim()}`,
                  external: false as const,
                },
                report.m_homepage?.trim() && {
                  id: "website",
                  icon: <Globe className="w-8 h-8 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                  label: "Website",
                  href: report.m_homepage!.trim(),
                  external: true as const,
                },
                report.wholesale_link?.trim() && {
                  id: "wholesale",
                  icon: <ShoppingBag className="w-8 h-8 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                  label: "Wholesale Portal",
                  href: report.wholesale_link!.trim(),
                  external: true as const,
                },
              ].filter(Boolean) as Array<{ id: string; icon: React.ReactNode; label: string; href: string; external: boolean }>;

              if (contacts.length === 0) return null;
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {contacts.map((contact, i) => (
                    <a
                      key={contact.id}
                      href={contact.href}
                      target={contact.external ? "_blank" : undefined}
                      rel={contact.external ? "noopener noreferrer" : undefined}
                      className={`flex items-center gap-5 bg-white border-2 border-[#E8E6E1] rounded-2xl p-8 hover:border-[#16A34A] transition-colors group ${contacts.length === 3 && i === 2 ? "col-span-1 sm:col-span-2" : ""}`}
                    >
                      {contact.icon}
                      <span className="text-xl font-bold text-[#1A1916] truncate">{contact.label}</span>
                    </a>
                  ))}
                </div>
              );
            })()}
            {(report.sample_policy?.trim() || report.export_cert_note?.trim()) && (
              <div className="border-t border-[#E8E6E1] pt-8 space-y-5">
                {report.sample_policy?.trim() && (
                  <div>
                    <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">Sample Policy</p>
                    <p className="text-sm font-medium text-[#1A1916] leading-relaxed">{report.sample_policy}</p>
                  </div>
                )}
                {report.export_cert_note?.trim() && (
                  <div>
                    <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">Compliance Note</p>
                    <p className="text-sm font-medium text-[#1A1916] leading-relaxed">{report.export_cert_note}</p>
                  </div>
                )}
              </div>
            )}
            {globalProofTags.length > 0 && (
              <div id="global-market-proof" className="border-t border-[#E8E6E1] pt-8 mt-8 scroll-mt-[160px]">
                <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-6">Global Market Proof</p>
                {(() => {
                  const n = globalProofTags.length;
                  const renderCard = (
                    tag: { region: string; platform?: string; url: string },
                    borderClass: string,
                    paddingClass: string,
                    colClass: string = ""
                  ) => (
                    <a
                      key={tag.region}
                      href={tag.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-between bg-white rounded-xl ${borderClass} ${paddingClass} ${colClass} transition-all cursor-pointer group hover:border-[#1A1916] hover:shadow-md`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="bg-[#1A1916] text-white px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-widest shrink-0">
                          {tag.region}
                        </span>
                        {tag.platform && (
                          <span className="text-sm md:text-base font-bold text-[#1A1916] truncate">{tag.platform}</span>
                        )}
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-[#9E9C98] group-hover:text-[#1A1916] transition-colors shrink-0 ml-3" />
                    </a>
                  );
                  if (n === 1) return <div className="grid grid-cols-1">{renderCard(globalProofTags[0], "border-2 border-[#E8E6E1]", "p-6")}</div>;
                  if (n === 2) return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{globalProofTags.map((tag) => renderCard(tag, "border-2 border-[#E8E6E1]", "p-5"))}</div>;
                  if (n === 3) return <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{globalProofTags.map((tag) => renderCard(tag, "border border-[#E8E6E1]", "p-4"))}</div>;
                  if (n === 4) return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{globalProofTags.map((tag) => renderCard(tag, "border border-[#E8E6E1]", "p-4"))}</div>;
                  if (n === 5) return <div className="grid grid-cols-6 gap-3">{globalProofTags.map((tag, i) => renderCard(tag, "border border-[#E8E6E1]", "p-4", i < 2 ? "col-span-3" : "col-span-2"))}</div>;
                  return <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{globalProofTags.map((tag) => renderCard(tag, "border border-[#E8E6E1]", "p-4"))}</div>;
                })()}
              </div>
            )}
          </div>

          {assetCards.length > 0 && (
            <div className="bg-[#F8F7F4] rounded-2xl p-10">
              <p className={refA}>Creative Assets</p>
              <div className="grid grid-cols-2 gap-6">
                {assetCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white rounded-2xl border border-[#E8E6E1] overflow-hidden group hover:border-[#16A34A] transition-all duration-300 hover:shadow-[0_4px_20px_0_rgb(22_163_74/0.1)]"
                  >
                    <div className="aspect-video bg-[#F8F7F4] relative flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 text-[#1A1916] opacity-5 flex items-center justify-center">{card.icon}</div>
                      </div>
                      {card.platform && (
                        <span className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold rounded px-2 py-1 uppercase tracking-wide z-10">
                          {card.platform}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-[#16A34A]/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                          {card.hoverIcon}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-xl font-bold text-[#1A1916] mb-2">{card.title}</p>
                      <p className={`${refC} mb-6`}>{card.description}</p>
                      <a
                        href={card.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors duration-200 ${
                          card.isPrimary ? "bg-[#1A1916] text-white hover:bg-[#2D2B26]" : "bg-white border border-[#E8E6E1] text-[#1A1916] hover:border-[#1A1916]"
                        }`}
                      >
                        {card.ctaText}
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
```

---

## 9. 페이지 (진입점)

### app/weekly/[weekId]/[id]/page.tsx

```tsx
// 파일경로: app/weekly/[weekId]/[id]/page.tsx
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

## 파일 목록 (의존성 트리)

| 구분 | 경로 |
|------|------|
| **페이지** | `app/weekly/[weekId]/[id]/page.tsx` |
| **서버 액션** | `app/actions/favorites.ts` |
| **타입** | `types/database.ts` |
| **설정** | `src/config/pricing.ts` |
| **라이브러리** | `lib/supabase/server.ts`, `lib/auth-server.ts` |
| **리포트** | `components/report/index.ts`, `components/report/constants.ts`, `components/report/utils.ts` |
| **리포트 섹션** | `TrendSignalDashboard.tsx`, `MarketIntelligence.tsx`, `SocialProofTrendIntelligence.tsx`, `SourcingIntel.tsx`, `SupplierContact.tsx` |
| **공통 컴포넌트** | `ProductIdentity.tsx`, `LockedSection.tsx`, `ClientLeftNav.tsx`, `FavoriteButton.tsx`, `DonutGauge.tsx`, `ScrollToIdButton.tsx`, `CopyButton.tsx`, `BrokerEmailDraft.tsx`, `GroupBBrokerSection.tsx`, `HazmatBadges.tsx`, `ExpandableText.tsx` |
| **UI** | `components/ui/index.ts`, `components/ui/Badge.tsx`, `components/ui/Button.tsx` |

위 목록의 모든 파일은 본 문서에 **전체 코드 무생략**으로 수록되어 있습니다.
