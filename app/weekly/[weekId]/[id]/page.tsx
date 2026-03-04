import { createClient } from "@/lib/supabase/server";
import { getAuthTier } from "@/lib/auth-server";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ClientLeftNav } from "@/components/layout/ClientLeftNav";
import { LockedSection } from "@/components/LockedSection";
import { DonutGauge } from "@/components/DonutGauge";
import { StatusBadge } from "@/components/StatusBadge";
import { ScrollToIdButton } from "@/components/ScrollToIdButton";
import { CopyButton } from "@/components/CopyButton";
import { HazmatBadges } from "@/components/HazmatBadges";
import { ContactCard, ContactPill } from "@/components/ContactCard";
import { ExpandableText } from "@/components/ExpandableText";
import { BrokerEmailDraft } from "@/components/BrokerEmailDraft";
import { Badge, Button, KeywordPill } from "@/components/ui";
import { AlertTriangle, ArrowRight, Award, CheckCircle, Film, ImageIcon, LayoutTemplate, Lock, TrendingUp, XCircle } from "lucide-react";
import type { ScoutFinalReportsRow } from "@/types/database";

/** Format 6-digit HS code as 3304.99 */
function formatHsCode(raw: string | null | undefined): string {
  const s = raw?.trim().replace(/\D/g, "") ?? "";
  if (s.length === 6) return `${s.slice(0, 4)}.${s.slice(4)}`;
  return raw?.trim() ?? "";
}

const SHIPPING_TIER_TOOLTIP =
  "Tier 1: <500g | Tier 2: 500g–2kg | Tier 3: 2kg+";

function describeShippingTier(
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

const SECTION_3_LOCKED_CTA = {
  message: "The numbers are in. You just can't see them.",
  cta: "Unlock Market Intelligence — $9/mo →",
  href: "/pricing",
  lockedFields: ["Profit multiplier", "Search volume", "Growth", "Global price", "SEO keywords"],
};

const SECTION_STANDARD_CTA = {
  message: "Unlock profit margins, search trends, and global pricing intel.",
  cta: "Start Standard — $9/mo",
  href: "/pricing",
  lockedFields: ["Profit multiplier", "Search volume", "Growth", "Global price", "SEO keywords"],
};

const SECTION_4_LOCKED_CTA = {
  message: "This product is trending on ■ platforms. TikTok alone scored ■■/100.",
  cta: "See What's Trending — $9/mo →",
  href: "/pricing",
  lockedFields: ["Platform scores", "Rising keywords", "Gap analysis", "Entry strategy"],
};

const SECTION_CONSUMER_CTA = {
  message: "See exactly who's buying and which keywords drive sales.",
  cta: "Start Standard — $9/mo",
  href: "/pricing",
  lockedFields: ["Consumer insight", "SEO keywords"],
};

const SECTION_ALPHA_SOURCING_CTA = {
  message: "You know what sells. Now learn how to ship it.",
  cta: "Unlock Logistics Intel — $29/mo →",
  href: "/pricing",
  lockedFields: ["✓ HS codes", "✓ Hazmat checks", "✓ Dimensions", "✓ Certifications"],
};

const SECTION_ALPHA_MEDIA_CTA = {
  message: "See the viral Korean video that started the trend.",
  cta: "Unlock Media Vault — $29/mo →",
  href: "/pricing",
  lockedFields: ["Product video (4K)", "Viral video", "AI product image"],
};

const SECTION_ALPHA_SUPPLIER_CTA = {
  message:
    "The supplier is right here. One upgrade away. 💡 One successful product pays for a full year of Alpha.",
  cta: "Get Supplier Contact — $29/mo →",
  href: "/pricing",
  lockedFields: [
    "Supplier Contact Info",
    "Verified Wholesale Cost",
    "MOQ & Lead Time",
    "Direct Factory Link",
    "B2B Negotiation Script",
  ],
};

function safeParsePlatformScores(raw: unknown): Record<string, { score?: number; sentiment?: string }> | null {
  if (!raw) return null;
  try {
    let parsed = raw;
    if (typeof parsed === "string") parsed = JSON.parse(parsed);
    if (typeof parsed === "string") parsed = JSON.parse(parsed);
    if (typeof parsed === "object" && parsed !== null) return parsed as Record<string, { score?: number; sentiment?: string }>;
    return null;
  } catch {
    return null;
  }
}

function normalizeToArray(raw: unknown): string[] {
  if (!raw) return [];

  let str = "";
  if (Array.isArray(raw)) {
    str = raw.map(String).join(",");
  } else if (typeof raw === "string") {
    str = raw;
  } else {
    return [];
  }

  // 1. THE NUKE: Strip ALL brackets, backslashes, and quotes unconditionally.
  const cleanStr = str.replace(/[\[\]\\"]/g, '');

  // 2. Split by comma, trim, and return pure words.
  return cleanStr.split(',').map(s => s.trim()).filter(Boolean);
}

interface StrategyStep {
  icon: string;
  label: string;
  color: string;
  content: string;
}

function parseSourcingStrategy(raw: string | null | undefined): StrategyStep[] {
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
      steps.push({
        icon: current.icon,
        label: current.label,
        color: current.color,
        content,
      });
    }
  }

  if (steps.length === 0 && raw.trim()) {
    steps.push({ icon: "📋", label: "Strategy Overview", color: "emerald", content: raw.trim() });
  }

  return steps;
}

const EXPORT_STATUS_DISPLAY: Record<string, { variant: "success" | "warning" | "danger"; label: string }> = {
  green: { variant: "success", label: "Ready to Export" },
  yellow: { variant: "warning", label: "Check Regulations" },
  red: { variant: "danger", label: "Export Restricted" },
};

function ProductIdentity({ report }: { report: ScoutFinalReportsRow }) {
  const exportStatus = report.export_status?.toLowerCase() ?? "";
  const exportDisplay = EXPORT_STATUS_DISPLAY[exportStatus];
  const exportLabelFallback = exportStatus ? `Export: ${report.export_status}` : "";

  return (
    <section id="section-1" className="scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
      <h2 className="text-3xl font-bold text-[#1A1916] mb-4 tracking-tight">Product Identity</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative w-full md:w-72 shrink-0 overflow-hidden rounded-xl bg-[#F8F7F4] aspect-[3/4]">
          {report.image_url ? (
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={report.image_url}
                alt={report.translated_name || report.product_name}
                fill
                className="object-contain p-2"
                sizes="(max-width: 640px) 100vw, 288px"
              />
            </div>
          ) : (
            <div className="aspect-[3/4] w-full flex items-center justify-center text-[#9E9C98] text-base">No image</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-2xl font-bold text-[#1A1916] leading-tight">
            {report.translated_name || report.product_name}
          </h3>
          <p className="text-lg text-[#6B6860] leading-relaxed mt-1">{report.product_name}</p>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#9E9C98]">Category:</span>
              <Badge variant="default" className="text-lg font-bold text-[#1A1916]">{report.category}</Badge>
            </div>
            {exportStatus && (exportDisplay || exportLabelFallback) && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#9E9C98]">Export Status:</span>
                {exportDisplay ? (
                  <Badge variant={exportDisplay.variant} className="text-lg font-bold text-[#1A1916]">{exportDisplay.label}</Badge>
                ) : (
                  <Badge variant="default" className="text-lg font-bold text-[#1A1916]">{exportLabelFallback}</Badge>
                )}
              </div>
            )}
          </div>
          {report.kr_price && (
            <div className="mt-3">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-2xl font-mono font-bold text-[#1A1916]">
                  ₩{Number(report.kr_price).toLocaleString()}
                  {report.kr_price_usd && (
                    <span className="text-2xl font-mono font-bold text-[#6B6860]"> (~${report.kr_price_usd})</span>
                  )}
                </span>
                {report.estimated_cost_usd && (
                  <>
                    <span className="text-xl font-mono font-bold text-[#9E9C98]">/</span>
                    <span className="text-base font-bold text-[#9E9C98] uppercase tracking-wide">Est. Wholesale</span>
                    <span className="text-2xl font-mono font-extrabold text-[#16A34A]">~${report.estimated_cost_usd}</span>
                    <span className="inline-flex items-center gap-1 text-base text-[#6B6860]">
                      <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
                      Estimated
                    </span>
                  </>
                )}
              </div>
              {report.estimated_cost_usd && (
                <p className="mt-2 text-base text-[#6B6860] leading-relaxed inline-flex flex-wrap items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#9E9C98] shrink-0" />
                  Alpha members{" "}
                  <a href="#section-6" className="text-[#16A34A] font-bold underline cursor-pointer hover:text-[#15803D] transition-colors">
                    get verified supplier quotes
                  </a>
                </p>
              )}
            </div>
          )}
          {report.viability_reason && (
            <div className="mt-5 min-h-fit h-auto bg-[#F8F7F4] rounded-xl border-l-4 border-l-[#16A34A] border border-[#E8E6E1] p-6">
              <p className="text-sm font-semibold text-[#16A34A] uppercase tracking-widest mb-2">Why It&apos;s Trending</p>
              <p className="text-base text-[#3D3B36] leading-relaxed">
                {report.viability_reason}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function competitionVariant(level: string): "success" | "warning" | "danger" | "default" {
  const v = level.toLowerCase().trim();
  if (v === "low") return "success";
  if (v === "medium") return "warning";
  if (v === "high") return "danger";
  return "default";
}

function opportunityVariant(status: string): "success" | "default" {
  const v = status.toLowerCase().trim();
  if (v === "blue ocean" || v === "emerging") return "success";
  return "default";
}

function TrendSignalDashboard({ report }: { report: ScoutFinalReportsRow }) {
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

      {/* Authority blurb — frames the entire dashboard */}
      <div className="bg-[#F8F7F4]/50 text-base italic text-[#6B6860] py-3 px-4 border-l-2 border-[#16A34A] mb-8 mt-4">
        Every week, KoreaScout screens <span className="font-semibold not-italic text-[#1A1916]">500+ Korean products</span>
        {" "}and curates only those scoring above 50.{" "}
        <span className="font-semibold not-italic text-[#1A1916]">It&apos;s worth your attention.</span>
      </div>

      {/* Tier 1 — The Verdict: 3-column grid (titles level, values proportionate) */}
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

      {/* Tier 2 — The Channels: full-width Platform Breakdown (left wall pl-12) */}
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

      {/* Tier 3 — The Velocity: full-width Growth Momentum (left wall pl-10, title + signal stacked) */}
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

/** Returns true if growth string suggests positive (e.g. +25%, +8). */
function isPositiveGrowth(s: string | null | undefined): boolean {
  if (!s || typeof s !== "string") return false;
  const t = s.trim();
  return t.startsWith("+") || /^\d/.test(t);
}

const GLOBAL_REGIONS = [
  { key: "us", flag: "🇺🇸", label: "US" },
  { key: "uk", flag: "🇬🇧", label: "UK" },
  { key: "sea", flag: "🇸🇬", label: "SEA" },
  { key: "au", flag: "🇦🇺", label: "AU" },
  { key: "india", flag: "🇮🇳", label: "IN" },
] as const;

type RegionPriceRow = { flag: string; label: string; priceDisplay: string | null; platform?: string | null; isBlueOcean: boolean };

function parseGlobalPricesForGrid(globalPrices: unknown, globalPriceText: string | Record<string, unknown> | null | undefined): RegionPriceRow[] {
  const out: RegionPriceRow[] = [];
  let parsed: Record<string, { price_usd?: number; price_original?: string | number; platform?: string }> | null = null;
  if (globalPrices != null) {
    try {
      let p: unknown = globalPrices;
      if (typeof p === "string") p = JSON.parse(p);
      if (typeof p === "string") p = JSON.parse(p);
      if (p && typeof p === "object" && !Array.isArray(p)) parsed = p as Record<string, { price_usd?: number; price_original?: string | number; platform?: string }>;
    } catch {
      // ignore
    }
  }
  if (parsed) {
    for (const r of GLOBAL_REGIONS) {
      const data = parsed[r.key] ?? parsed[r.key === "au" ? "australia" : r.key];
      const priceUsd = data?.price_usd;
      const priceOrig = data?.price_original != null ? String(data.price_original).replace(/[$,]/g, "") : "";
      const num = priceUsd != null ? priceUsd : (priceOrig ? parseFloat(priceOrig) : NaN);
      const isBlueOcean = Number.isNaN(num) || num === 0;
      const priceDisplay = !isBlueOcean ? (typeof data?.price_original === "string" ? data.price_original : priceUsd != null ? `$${priceUsd}` : priceOrig ? `$${priceOrig}` : null) : null;
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

function MarketIntelligence({
  report,
  tier,
  isTeaser,
}: {
  report: ScoutFinalReportsRow
  tier: "free" | "standard" | "alpha"
  isTeaser: boolean
}) {
  // ── 데이터 준비 ──────────────────────────────────────
  const estimatedCost = report.estimated_cost_usd ?? null
  const krPriceUsd    = report.kr_price_usd ?? null
  const profitMultiplier = report.profit_multiplier ?? null
  const hasProfitBlock = profitMultiplier || estimatedCost || krPriceUsd

  const rows = parseGlobalPricesForGrid(report.global_prices, report.global_price as string | Record<string, unknown> | null | undefined)

  const searchVolume = report.search_volume?.trim() || null
  const momGrowth    = report.mom_growth?.trim()    || null
  const wowRate      = report.wow_rate?.trim()      || null
  const hasSearchGrowth = searchVolume || momGrowth || wowRate

  const winningFeature = report.top_selling_point?.trim()  || null
  const painPoint      = report.common_pain_point?.trim()  || null

  return (
    <section
      id="section-3"
      className="scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]"
    >
      {/* 섹션 타이틀 */}
      <h2 className="text-3xl font-bold text-[#1A1916] tracking-tight mb-6">
        Market Intelligence
      </h2>

      <div className="space-y-6">

        {/* ── TIER 1: THE MONEY ───────────────────────── */}
        {hasProfitBlock && (
          <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6">
            {/* 상단: 배지 + 서브텍스트 */}
            <div className="flex flex-col items-start gap-2 mb-6">
              <span className="text-[#16A34A] bg-[#F0FDF4] border border-[#BBF7D0] rounded-full px-4 py-1 text-sm font-bold tracking-tight">
                🔥 UP TO {profitMultiplier}× MARGIN POTENTIAL
              </span>
              <p className="text-xs text-[#9E9C98] tracking-wide">
                Estimated margin: KR wholesale vs global retail
              </p>
            </div>

            {/* 양분할 */}
            <div className="grid grid-cols-2 gap-4">
              {/* 좌: Acquisition */}
              <div className="bg-white rounded-xl border border-[#E8E6E1] px-6 py-5">
                <p className="text-[10px] tracking-[0.2em] text-[#9E9C98] uppercase mb-3">
                  Acquisition Cost
                </p>
                <p className="text-4xl font-extrabold text-[#1A1916] tracking-tight">
                  {estimatedCost ? `~$${estimatedCost}` : "—"}
                </p>
                <p className="text-xs text-[#9E9C98] mt-2">Est. KR Wholesale</p>
              </div>

              {/* 우: Valuation */}
              <div className="bg-white rounded-xl border border-[#BBF7D0] px-6 py-5">
                <p className="text-[10px] tracking-[0.2em] text-[#16A34A] uppercase mb-3">
                  Global Valuation
                </p>
                <p className="text-4xl font-extrabold text-[#16A34A] tracking-tight">
                  {krPriceUsd ? `~$${krPriceUsd}` : "—"}
                </p>
                <p className="text-xs text-[#16A34A]/60 mt-2">Avg. Global Retail</p>
              </div>
            </div>
          </div>
        )}

        {/* ── TIER 2: THE OPPORTUNITY ─────────────────── */}
        {rows.length > 0 && (
          <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] tracking-[0.2em] text-[#9E9C98] uppercase">
                Global Market Availability
              </p>
              <p className="text-[10px] text-[#9E9C98]">
                {rows.length} markets analyzed
              </p>
            </div>

            {/* 5개국 그리드 */}
            <div className="grid grid-cols-5 gap-3">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="bg-white rounded-xl border border-[#E8E6E1] px-3 py-4 text-center"
                >
                  <p className="text-xs font-bold text-[#6B6860] uppercase tracking-widest mb-3">
                    {row.label}
                  </p>
                  {row.isBlueOcean ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-[#16A34A] mx-auto mb-2" />
                      <p className="text-[10px] text-[#16A34A] font-semibold tracking-widest">
                        UNTAPPED
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-[#9E9C98] mx-auto mb-2" />
                      <p className="text-sm font-bold text-[#1A1916]">
                        {row.priceDisplay}
                      </p>
                      {row.platform && (
                        <p className="text-[10px] text-[#9E9C98] mt-1">
                          {row.platform}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* 푸터 */}
            <div className="mt-4 pt-4 border-t border-[#E8E6E1]">
              <p className="text-xs text-[#9E9C98] text-center">
                ● Untapped = No established sellers detected.{" "}
                <span className="text-[#9E9C98]/60">
                  * Data may vary based on real-time market changes.
                </span>
              </p>
              <ScrollToIdButton
                sectionId="section-6"
                className="mt-2 text-xs text-[#16A34A] hover:text-[#15803D] underline underline-offset-2 block text-center transition-colors"
              >
                View source links &amp; supplier contact ↓
              </ScrollToIdButton>
            </div>
          </div>
        )}

        {/* ── TIER 3: THE DATA & INTEL ─────────────────── */}
        {(hasSearchGrowth || winningFeature || painPoint) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* 좌: Search & Growth */}
            {hasSearchGrowth && (
              <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6">
                <p className="text-[10px] tracking-[0.2em] text-[#9E9C98] uppercase mb-6">
                  Search &amp; Growth
                </p>

                <div className="space-y-6">
                  {searchVolume && (
                    <div>
                      <p className="text-[10px] tracking-[0.2em] text-[#9E9C98] uppercase mb-2">
                        Search Volume
                      </p>
                      <p className="text-3xl font-extrabold text-[#1A1916] tracking-tight">
                        {searchVolume}
                      </p>
                    </div>
                  )}

                  {momGrowth && (
                    <div>
                      <p className="text-[10px] tracking-[0.2em] text-[#9E9C98] uppercase mb-2">
                        MoM Growth
                      </p>
                      <p className={`text-3xl font-extrabold tracking-tight ${
                        isPositiveGrowth(momGrowth)
                          ? "text-[#16A34A]"
                          : "text-[#DC2626]"
                      }`}>
                        {momGrowth}{" "}
                        <span className="text-2xl">
                          {isPositiveGrowth(momGrowth) ? "↑" : "↓"}
                        </span>
                      </p>
                    </div>
                  )}

                  {wowRate && wowRate !== "N/A" && (
                    <div>
                      <p className="text-[10px] tracking-[0.2em] text-[#9E9C98] uppercase mb-2">
                        WoW Growth
                      </p>
                      <p className={`text-3xl font-extrabold tracking-tight ${
                        isPositiveGrowth(wowRate)
                          ? "text-[#16A34A]"
                          : "text-[#DC2626]"
                      }`}>
                        {wowRate}{" "}
                        <span className="text-2xl">
                          {isPositiveGrowth(wowRate) ? "↑" : "↓"}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 우: Analyst Brief */}
            {(winningFeature || painPoint) && (
              <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 border-l-2 border-l-[#16A34A]">
                <p className="text-[10px] tracking-[0.2em] text-[#9E9C98] uppercase mb-6">
                  Analyst Brief
                </p>

                <div className="space-y-6">
                  {winningFeature && (
                    <div>
                      <p className="text-[10px] tracking-[0.2em] text-[#16A34A] uppercase mb-3">
                        Competitive Edge
                      </p>
                      <p className="text-sm text-[#3D3B36] leading-[1.8]">
                        {winningFeature}
                      </p>
                    </div>
                  )}

                  {winningFeature && painPoint && (
                    <div className="border-t border-dashed border-[#E8E6E1]" />
                  )}

                  {painPoint && (
                    <div>
                      <p className="text-[10px] tracking-[0.2em] text-[#9E9C98] uppercase mb-3">
                        Risk Factor
                      </p>
                      <p className="text-sm text-[#3D3B36] leading-[1.8]">
                        {painPoint}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  )
}

function SocialProofTrendIntelligence({
  report,
  tier,
  isTeaser,
}: {
  report: ScoutFinalReportsRow;
  tier: "free" | "standard" | "alpha";
  isTeaser: boolean;
}) {
  const canSeeAlpha = tier === "alpha" || isTeaser;

  return (
    <section id="section-4" className="scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
      <h2 className="text-3xl font-bold text-[#1A1916] mb-4 tracking-tight">Social Proof & Trend Intelligence</h2>

      {/* Block 1 — Social Buzz */}
      {report.buzz_summary?.trim() && (
        <div className="bg-[#F8F7F4] rounded-xl border-l-4 border-l-[#16A34A] border border-[#E8E6E1] p-4">
          <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-widest mb-2">Social Buzz</p>
          <p className="text-sm text-[#3D3B36] leading-relaxed italic">
            &quot;{report.buzz_summary}&quot;
          </p>
        </div>
      )}

      {/* Block 2 — Market Gap Analysis */}
      <div className="mt-6">
        <p className="text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-3">Market Gap Analysis</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6B6860]">🇰🇷 Korean Traction</span>
              <span className="text-2xl font-mono font-bold text-[#16A34A]">{report.kr_local_score ?? "—"}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E8E6E1] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#16A34A] transition-all"
                style={{ width: `${Math.min(report.kr_local_score || 0, 100)}%` }}
              />
            </div>
            {report.kr_evidence?.trim() && (
              <p className="mt-2 text-xs text-[#6B6860] leading-relaxed">{report.kr_evidence}</p>
            )}
            {report.kr_source_used?.trim() && (
              <p className="mt-1 text-xs text-[#9E9C98]">Source: {report.kr_source_used}</p>
            )}
          </div>

          <div className="p-4 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6B6860]">🌍 Global Presence</span>
              <span className="text-2xl font-mono font-bold text-[#2563EB]">{report.global_trend_score ?? "—"}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E8E6E1] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#2563EB] transition-all"
                style={{ width: `${Math.min(report.global_trend_score || 0, 100)}%` }}
              />
            </div>
            {report.global_evidence?.trim() && (
              <p className="mt-2 text-xs text-[#6B6860] leading-relaxed">{report.global_evidence}</p>
            )}
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl border border-[#BBF7D0] bg-[#DCFCE7] text-center">
          <p className="text-xs text-[#9E9C98] mb-1">Gap Index</p>
          <p className="text-3xl font-mono font-bold text-[#16A34A]">{report.gap_index ?? "—"}</p>
          {report.gap_status && (
            <Badge variant={report.gap_status === "Blue Ocean" || report.gap_status === "Emerging" ? "success" : "warning"} className="mt-2">
              {report.gap_status}
            </Badge>
          )}
          {report.opportunity_reasoning?.trim() && (
            <p className="mt-3 text-sm text-[#3D3B36] leading-relaxed max-w-xl mx-auto">
              {report.opportunity_reasoning}
            </p>
          )}
        </div>
      </div>

      {/* Block 3 — Trending Signals */}
      {(() => {
        const risingKw = normalizeToArray(report.rising_keywords);
        const seoKw = normalizeToArray(report.seo_keywords);
        const viralHt = normalizeToArray(report.viral_hashtags);
        const hasAnyTrending =
          risingKw.length > 0 ||
          seoKw.length > 0 ||
          viralHt.length > 0;
        if (!hasAnyTrending) return null;

        return (
          <div className="mt-6">
            <p className="text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-3">Trending Signals</p>

            {risingKw.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-[#6B6860] mb-2">Rising Keywords (KR)</p>
                <div className="flex flex-wrap gap-2">
                  {risingKw.map((kw, i) => (
                    <KeywordPill key={i} variant="trending" keyword={kw} />
                  ))}
                </div>
              </div>
            )}

            <div className="relative">
              {seoKw.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-[#6B6860] mb-2">Global SEO Keywords</p>
                  {canSeeAlpha ? (
                    <div className="flex flex-wrap gap-2">
                      {seoKw.map((kw, i) => (
                        <KeywordPill key={i} variant="default" keyword={kw} />
                      ))}
                    </div>
                  ) : (
                    <div className="h-10 w-full rounded-lg bg-[#F2F1EE]" />
                  )}
                </div>
              )}

              {viralHt.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-[#6B6860] mb-2">Viral Hashtags</p>
                  {canSeeAlpha ? (
                    <div className="flex flex-wrap gap-2">
                      {viralHt.map((tag, i) => (
                        <KeywordPill key={i} variant="default" keyword={tag} />
                      ))}
                    </div>
                  ) : (
                    <div className="h-10 w-full rounded-lg bg-[#F2F1EE]" />
                  )}
                </div>
              )}

              {!canSeeAlpha && (seoKw.length > 0 || viralHt.length > 0) && (
                <div className="mt-4 flex flex-col items-center justify-center pb-6 gap-3 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4] px-4 py-4">
                  <Lock className="w-5 h-5 text-[#9E9C98]" />
                  <p className="text-sm font-semibold text-[#3D3B36]">Unlock Global SEO Targets & Viral Hashtags</p>
                  <a href="/pricing">
                    <Button variant="primary" size="sm">Go Alpha $29/mo →</Button>
                  </a>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Block 5 — Scout Strategy Report */}
      {(() => {
        const allSteps = parseSourcingStrategy(report.sourcing_tip);
        const steps = allSteps.slice(0, 3); // Only Marketing, Pricing, B2B
        if (steps.length === 0) return null;

        return (
          <div className="mt-6">
            <p className="text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-3">Scout Strategy Report</p>

            {canSeeAlpha ? (
              <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-4 space-y-3">
                {steps.map((step, i) => (
                  <div key={i} className="bg-white rounded-lg border border-[#E8E6E1] p-4">
                    <Badge variant="success" className="mb-2">Step {i + 1}</Badge>
                    <p className="text-sm font-semibold text-[#1A1916] mb-1">{step.label}</p>
                    <p className="text-sm text-[#6B6860] leading-relaxed whitespace-pre-line">{step.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="h-32 w-full rounded-xl bg-[#F2F1EE]" />
                <div className="mt-4 flex flex-col items-center justify-center gap-3 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4] px-4 py-4">
                  <Lock className="w-5 h-5 text-[#9E9C98]" />
                  <p className="text-sm font-semibold text-[#3D3B36] text-center px-4">
                    Premium Strategy Report — Unlock the complete 5-Step B2B Sourcing & Marketing Strategy.
                  </p>
                  <a href="/pricing">
                    <Button variant="primary" size="sm">Go Alpha $29/mo →</Button>
                  </a>
                </div>
              </>
            )}
          </div>
        );
      })()}
    </section>
  );
}

function SourcingIntel({
  report,
  tier,
  isTeaser,
}: {
  report: ScoutFinalReportsRow;
  tier: string;
  isTeaser: boolean;
}) {
  const canSeeAlpha = tier === "alpha" || isTeaser;

  return (
    <section id="section-5" className="scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] relative">
      <h2 className="text-3xl font-bold text-[#1A1916] mb-4 tracking-tight">Export & Logistics Intel</h2>

      {/* Block 1: Export Readiness */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2">Export Readiness</p>
        {canSeeAlpha ? (
          <div className="p-4 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4]">
            <div className="flex items-center gap-3">
              {report.export_status === "Green" ? (
                <CheckCircle className="w-5 h-5 text-[#16A34A] shrink-0" />
              ) : report.export_status === "Yellow" ? (
                <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-[#DC2626] shrink-0" />
              )}
              <div className={`rounded-lg border px-3 py-2 flex-1 ${
                report.export_status === "Green"
                  ? "bg-[#DCFCE7] border-[#BBF7D0]"
                  : report.export_status === "Yellow"
                    ? "bg-[#FEF3C7] border-[#FDE68A]"
                    : "bg-[#FEE2E2] border-[#FECACA]"
              }`}>
                <p className={`text-sm font-semibold ${
                  report.export_status === "Green"
                    ? "text-[#16A34A]"
                    : report.export_status === "Yellow"
                      ? "text-[#D97706]"
                      : "text-[#DC2626]"
                }`}>
                  {report.export_status === "Green"
                    ? "Ready to Export"
                    : report.export_status === "Yellow"
                      ? "Check Regulations"
                      : "Export Restricted"}
                </p>
                {report.status_reason?.trim() && (
                  <p className="text-sm text-[#6B6860] leading-relaxed mt-1">{report.status_reason}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-16 w-full rounded-xl bg-[#F2F1EE]" />
        )}
      </div>

      {/* Block 2: HS Code & Classification */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2">HS Code & Classification</p>
        {canSeeAlpha ? (
          <div className="p-4 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4]">
            {report.hs_code?.trim() ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
                  <code className="text-4xl font-mono font-bold text-[#1A1916] tracking-tight">
                    {formatHsCode(report.hs_code) || report.hs_code}
                  </code>
                  <CopyButton value={report.hs_code} variant="primary" />
                </div>
                {report.hs_description?.trim() && (
                  <p className="text-sm text-[#6B6860] leading-relaxed mb-3">{report.hs_description}</p>
                )}
                <p className="text-xs text-[#9E9C98] italic leading-relaxed">
                  Compiled from Korean sources by AI. Verify with a licensed customs broker before export.
                </p>
              </>
            ) : (
              <div>
                <p className="text-sm text-[#6B6860]">HS Code not available</p>
                <p className="text-xs text-[#9E9C98] mt-1">
                  AI could not determine a classification. Consult your customs broker directly.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-20 w-full rounded-xl bg-[#F2F1EE]" />
        )}
      </div>

      {/* Block 3: Broker Email Draft */}
      {canSeeAlpha && report.hs_code?.trim() && (
        <div className="mb-6 p-4 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4]">
          <BrokerEmailDraft report={report} />
        </div>
      )}
      {!canSeeAlpha && (
        <div className="mb-6 p-4 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4]">
          <p className="text-xs text-[#9E9C98] italic">Broker Email Draft — available on Alpha Plan</p>
        </div>
      )}

      {/* Block 4: Weight & Shipping */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2">Weight & Shipping</p>
        {canSeeAlpha ? (
          <div>
            {(() => {
              const hasActual = report.actual_weight_g != null;
              const hasVol = report.volumetric_weight_g != null;
              const hasBillable = report.billable_weight_g != null;
              if (!hasActual && !hasVol && !hasBillable) return null;

              return (
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-3">
                  {hasActual && (
                    <div className="flex-1 min-w-0 p-4 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4] text-center">
                      <p className="text-xs text-[#9E9C98] uppercase tracking-widest mb-1">Actual Weight</p>
                      <p className="text-2xl font-mono font-semibold text-[#1A1916]">{report.actual_weight_g}g</p>
                    </div>
                  )}
                  {hasActual && hasVol && (
                    <ArrowRight className="w-4 h-4 text-[#9E9C98] shrink-0" />
                  )}
                  {hasVol && (
                    <div className="flex-1 min-w-0 p-4 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4] text-center">
                      <p className="text-xs text-[#9E9C98] uppercase tracking-widest mb-1">Volumetric Weight</p>
                      <p className="text-2xl font-mono font-semibold text-[#1A1916]">{report.volumetric_weight_g}g</p>
                    </div>
                  )}
                  {hasBillable && (hasActual || hasVol) && (
                    <ArrowRight className="w-4 h-4 text-[#9E9C98] shrink-0" />
                  )}
                  {hasBillable && (
                    <div className="flex-1 min-w-0 p-4 rounded-xl border border-[#BBF7D0] bg-[#DCFCE7] text-center">
                      <p className="text-xs text-[#9E9C98] uppercase tracking-widest mb-1">Billable Weight</p>
                      <p className="text-2xl font-mono font-semibold text-[#16A34A]">{report.billable_weight_g}g</p>
                    </div>
                  )}
                </div>
              );
            })()}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B6860] leading-relaxed">
              {report.dimensions_cm?.trim() && <span>{report.dimensions_cm}</span>}
              {report.shipping_tier?.trim() && (() => {
                const { description } = describeShippingTier(report.shipping_tier);
                return (
                  <span><Badge variant="default">{description || report.shipping_tier}</Badge></span>
                );
              })()}
            </div>
            {report.actual_weight_g != null &&
              report.volumetric_weight_g != null &&
              report.billable_weight_g != null && (
                <p className="text-xs text-[#9E9C98] mt-2">
                  {report.volumetric_weight_g > report.actual_weight_g
                    ? "Volumetric weight exceeds actual — carriers will charge based on volumetric."
                    : "Actual weight is used as the billing basis."}
                </p>
              )}
          </div>
        ) : (
          <div className="h-24 w-full rounded-xl bg-[#F2F1EE]" />
        )}
      </div>

      {/* Block 5: Hazmat & Compliance */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2">Hazmat & Compliance</p>
        {canSeeAlpha ? (
          <div className="p-4 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4] space-y-3">
            <HazmatBadges status={report.hazmat_status as unknown} />
            {report.key_risk_ingredient?.trim() && (
              <p className="text-sm text-[#3D3B36] leading-relaxed">
                <Badge variant="warning" className="mr-1.5">Risk Ingredient</Badge>
                {report.key_risk_ingredient}
              </p>
            )}
            {report.required_certificates?.trim() && (
              <div>
                <p className="text-xs text-[#9E9C98] mb-2">Certifications Required:</p>
                <div className="flex flex-wrap gap-2">
                  {report.required_certificates.split(",").map((cert, i) => (
                    <Badge key={i} variant="info">{cert.trim()}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-20 w-full rounded-xl bg-[#F2F1EE]" />
        )}
      </div>

      {/* Block 6: Product Specs */}
      {(report.composition_info?.trim() || report.spec_summary?.trim()) && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2">Product Specs</p>
          {report.composition_info?.trim() && (
            <p className="text-xs text-[#9E9C98] italic mt-0 mb-2">
              *Ingredients may be truncated. Always verify full INCI list via the provided product image link.
            </p>
          )}
          {canSeeAlpha ? (
            <div className="p-4 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4]">
              {report.composition_info?.trim() && (
                <ExpandableText text={report.composition_info} label="Ingredients" />
              )}
              {report.spec_summary?.trim() && (
                <ExpandableText text={report.spec_summary} label="Specifications" />
              )}
            </div>
          ) : (
            <div className="h-20 w-full rounded-xl bg-[#F2F1EE]" />
          )}
        </div>
      )}

      {/* Block 7: Shipping Notes */}
      {(() => {
        const notes = report.shipping_notes?.trim();
        if (!notes || /tier/i.test(notes)) return null;
        return (
          <div className="mb-6">
            <p className="text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2">Shipping Notes</p>
            {canSeeAlpha ? (
              <p className="text-sm text-[#3D3B36] leading-relaxed">{report.shipping_notes}</p>
            ) : (
              <div className="h-12 w-full rounded-xl bg-[#F2F1EE]" />
            )}
          </div>
        );
      })()}

      {/* Block 8: Compliance & Logistics Strategy (Steps 4-5) */}
      {(() => {
        const allSteps = parseSourcingStrategy(report.sourcing_tip);
        const logisticsSteps = allSteps.slice(3, 5);
        if (logisticsSteps.length === 0) return null;

        return (
          <div className="mb-6">
            <p className="text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2">
              Compliance & Logistics Strategy
            </p>
            {canSeeAlpha ? (
              <div className="space-y-3">
                {logisticsSteps.map((step, i) => (
                  <div key={i} className="bg-white rounded-lg border border-[#E8E6E1] p-4">
                    <Badge variant="success" className="mb-2">Step {i + 4}</Badge>
                    <p className="text-sm font-semibold text-[#1A1916] mb-1">{step.label}</p>
                    <p className="text-sm text-[#6B6860] leading-relaxed whitespace-pre-line">{step.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-24 w-full rounded-xl bg-[#F2F1EE]" />
            )}
          </div>
        );
      })()}

      {/* Alpha Lock Overlay — prominent CTA for Standard users */}
      {!canSeeAlpha && (
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col items-center justify-end pb-6 gap-3 rounded-2xl">
          <Lock className="w-5 h-5 text-[#9E9C98]" />
          <p className="text-sm font-semibold text-[#3D3B36] text-center px-4">
            HS codes, weight specs, hazmat checks, broker email templates, compliance strategy & more.
          </p>
          <a href="/pricing">
            <Button variant="primary" size="sm">Go Alpha $29/mo →</Button>
          </a>
        </div>
      )}
    </section>
  );
}

/** Parse global_prices: nested object e.g. {"us": {"url": "https...", "platform": "..."}}. Returns region key -> URL. */
function parseGlobalPrices(
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
      if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://")))
        out[k] = url;
    }
  }
  return Object.keys(out).length ? out : null;
}

/** Single URL or stringified array; returns first URL. Handles JSONB (Array/Object) from Supabase. */
function getAiDetailUrl(raw: string | unknown[] | Record<string, unknown> | null | undefined): string | null {
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

function formatVerifiedAt(iso: string | null | undefined): string | null {
  if (!iso?.trim()) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

function SupplierContact({
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
  const globalPricesLinks = parseGlobalPrices(
    typeof report.global_prices === "string"
      ? report.global_prices
      : (report.global_prices as Record<string, { url?: string; platform?: string }> | null) ?? null
  );
  const hasGlobalPrices = globalPricesLinks && Object.keys(globalPricesLinks).length > 0;

  const viralUrl = report.viral_video_url?.trim() || null;
  const videoUrl = report.video_url?.trim() || null;
  const aiDetailUrl = getAiDetailUrl(report.ai_detail_page_links as string | unknown[] | Record<string, unknown> | null);
  const marketingUrl = report.marketing_assets_url?.trim() || null;
  const aiImageUrl = report.ai_image_url?.trim() || null;
  const assetCount = [viralUrl, videoUrl, aiDetailUrl, marketingUrl, aiImageUrl].filter(Boolean).length;
  const showExecutionGallery = assetCount > 0;

  const gridCols =
    assetCount === 1
      ? "grid-cols-1 sm:grid-cols-1 lg:grid-cols-1"
      : assetCount === 2
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
        : assetCount === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : assetCount === 4
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5";

  return (
    <section className="bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
      {canSeeAlpha && (
        <>
          <div>
            <h2 className="text-3xl font-bold text-[#1A1916] mb-4 tracking-tight">
              Launch & Execution Kit
            </h2>
            <p className="text-sm text-[#6B6860] leading-relaxed mt-1">
              From product discovery to live campaign — everything you need.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mt-6 items-stretch">
            {/* Block 1 Left: Sourcing Economics */}
            <div className="bg-[#F8F7F4] border border-[#E8E6E1] rounded-xl p-6 flex-1 flex flex-col gap-4 min-h-0">
              {verifiedCostUsd != null && verifiedCostUsd !== "" && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] w-fit">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                  <span className="text-xs font-semibold text-[#16A34A]">
                    Scout Verified
                  </span>
                </div>
              )}

              {hasVerifiedPrice && !isUndisclosed && (
                <>
                  <p className="text-5xl font-mono font-bold text-[#16A34A]">
                    ${costNum.toFixed(2)}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-[#9E9C98]">
                    COST PER UNIT
                  </p>
                  <div className="flex gap-6 flex-wrap">
                    {report.moq?.trim() && (
                      <div>
                        <p className="text-2xl font-semibold font-mono tabular-nums text-[#1A1916]">
                          {report.moq}
                        </p>
                        <p className="text-xs text-[#9E9C98]">MOQ</p>
                      </div>
                    )}
                    {report.lead_time?.trim() && (
                      <div>
                        <p className="text-2xl font-semibold font-mono tabular-nums text-[#1A1916]">
                          {report.lead_time}
                        </p>
                        <p className="text-xs text-[#9E9C98]">LEAD TIME</p>
                      </div>
                    )}
                  </div>
                  {formatVerifiedAt(report.verified_at) && (
                    <p className="text-xs text-[#C4C2BE] italic">
                      Verified by Scout on{" "}
                      {formatVerifiedAt(report.verified_at)}
                    </p>
                  )}
                  {report.sample_policy?.trim() && (
                    <Badge variant="info">{report.sample_policy.trim()}</Badge>
                  )}
                  {report.export_cert_note?.trim() && (
                    <Badge variant="warning">{report.export_cert_note.trim()}</Badge>
                  )}
                </>
              )}

              {verifiedCostUsd != null && verifiedCostUsd !== "" && isUndisclosed && (
                <>
                  <p className="text-sm text-[#6B6860] leading-relaxed italic">
                    Pricing verified and on file. Contact the manufacturer
                    directly or use the broker email in Section 5.
                  </p>
                  <div className="flex gap-6 flex-wrap">
                    {report.moq?.trim() && (
                      <div>
                        <p className="text-2xl font-semibold font-mono tabular-nums text-[#1A1916]">
                          {report.moq}
                        </p>
                        <p className="text-xs text-[#9E9C98]">MOQ</p>
                      </div>
                    )}
                    {report.lead_time?.trim() && (
                      <div>
                        <p className="text-2xl font-semibold font-mono tabular-nums text-[#1A1916]">
                          {report.lead_time}
                        </p>
                        <p className="text-xs text-[#9E9C98]">LEAD TIME</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {(!verifiedCostUsd || verifiedCostUsd === "") && (
                <p className="text-sm text-[#9E9C98] leading-relaxed flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E9C98] animate-pulse" />
                  Scout team is currently verifying pricing for this product.
                </p>
              )}
            </div>

            {/* Block 1 Right: Manufacturer Contact */}
            <div className="bg-[#F8F7F4] border border-[#E8E6E1] rounded-xl p-6 flex-1 flex flex-col gap-4 min-h-0">
              {report.m_name?.trim() && (
                <h2 className="text-xl font-bold text-[#1A1916]">
                  {report.m_name.trim()}
                </h2>
              )}
              {report.corporate_scale?.trim() && (
                <Badge variant="default">{report.corporate_scale.trim()}</Badge>
              )}
              {report.contact_email?.trim() && (
                <ContactPill
                  icon="📧"
                  label={report.contact_email.trim()}
                  value={report.contact_email.trim()}
                  action="copy"
                />
              )}
              {report.contact_phone?.trim() && (
                <ContactPill
                  icon="📞"
                  label={report.contact_phone.trim()}
                  value={report.contact_phone.trim()}
                  action="copy"
                />
              )}
              {report.m_homepage?.trim() && (
                <ContactPill
                  icon="🌐"
                  label="Website"
                  value={report.m_homepage.trim()}
                  action="link"
                />
              )}
              {report.wholesale_link?.trim() && (
                <ContactPill
                  icon="🛒"
                  label="Wholesale Portal"
                  value={report.wholesale_link.trim()}
                  action="link"
                />
              )}

              {(() => {
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

                const regions = [
                  { id: "us", flag: "🇺🇸", name: "US" },
                  { id: "uk", flag: "🇬🇧", name: "UK" },
                  { id: "sea", flag: "🇸🇬", name: "SEA" },
                  { id: "australia", flag: "🇦🇺", name: "AU" },
                  { id: "india", flag: "🇮🇳", name: "IN" },
                ];

                if (!report.global_prices) return null;

                return (
                  <div className="mt-auto pt-3 border-t border-[#E8E6E1]">
                    <p className="text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-3 text-center">
                      Global Market Proof
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {regions.map((region, index) => {
                        const data = rawPrices[region.id];
                        const hasUrl = data?.url?.startsWith("http");
                        const isLastOdd = index === regions.length - 1 && regions.length % 2 !== 0;
                        const spanClass = isLastOdd ? " col-span-2 justify-self-center" : "";

                        if (hasUrl) {
                          return (
                            <a
                              key={region.id}
                              href={data!.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#E8E6E1] text-xs text-[#3D3B36] hover:bg-[#DCFCE7] hover:text-[#16A34A] hover:border-[#BBF7D0] transition-all${spanClass}`}
                            >
                              {region.flag} {region.name}: {data?.platform || "Link"} ↗
                            </a>
                          );
                        }

                        return (
                          <span
                            key={region.id}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#DBEAFE] border border-[#BFDBFE] text-xs text-[#2563EB] cursor-default${spanClass}`}
                          >
                            {region.flag} {region.name}: 🔵 Blue Ocean
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Block 2: Execution Gallery */}
          {showExecutionGallery && (
            <>
              <div className="flex items-center justify-between mt-8">
                <h3 className="text-sm font-semibold text-[#9E9C98] uppercase tracking-widest">
                  Creative Assets
                </h3>
                <span className="text-xs text-[#16A34A]">
                  {assetCount} assets ready to deploy
                </span>
              </div>
              <div className={`grid ${gridCols} gap-4 mt-4`}>
                {viralUrl && (
                  <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] overflow-hidden flex flex-col hover:border-[#BBF7D0] transition-colors group">
                    <div className="h-36 bg-gradient-to-br from-[#F2F1EE] to-[#E8E6E1] flex items-center justify-center">
                      <TrendingUp className="w-10 h-10 text-[#6B6860] opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <p className="text-sm font-semibold text-[#1A1916]">
                        Viral Reference
                      </p>
                      <p className="text-xs text-[#9E9C98]">
                        Korean TikTok/Reels success case. Study the hook.
                      </p>
                      <a
                        href={viralUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto text-xs text-[#16A34A] hover:text-[#15803D] underline underline-offset-2"
                      >
                        Watch Original ↗
                      </a>
                    </div>
                  </div>
                )}
                {videoUrl && (
                  <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] overflow-hidden flex flex-col hover:border-[#BBF7D0] transition-colors group">
                    <div className="h-36 bg-gradient-to-br from-[#F2F1EE] to-[#E8E6E1] flex items-center justify-center">
                      <Film className="w-10 h-10 text-[#6B6860] opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <p className="text-sm font-semibold text-[#1A1916]">
                        Raw Ad Footage
                      </p>
                      <p className="text-xs text-[#9E9C98]">
                        Unedited footage ready for your market adaptation.
                      </p>
                      <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto text-xs text-[#16A34A] hover:text-[#15803D] underline underline-offset-2"
                      >
                        Watch & Download ↗
                      </a>
                    </div>
                  </div>
                )}
                {aiDetailUrl && (
                  <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] overflow-hidden flex flex-col hover:border-[#BBF7D0] transition-colors group">
                    <div className="h-36 bg-gradient-to-br from-[#F2F1EE] to-[#E8E6E1] flex items-center justify-center">
                      <LayoutTemplate className="w-10 h-10 text-[#6B6860] opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <p className="text-sm font-semibold text-[#1A1916]">
                        AI Landing Page
                      </p>
                      <p className="text-xs text-[#9E9C98]">
                        Opal-generated A/B product page drafts.
                      </p>
                      <a
                        href={aiDetailUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto text-xs text-[#16A34A] hover:text-[#15803D] underline underline-offset-2"
                      >
                        Open Page ↗
                      </a>
                    </div>
                  </div>
                )}
                {marketingUrl && (
                  <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] overflow-hidden flex flex-col hover:border-[#BBF7D0] transition-colors group">
                    <div className="h-36 bg-gradient-to-br from-[#F2F1EE] to-[#E8E6E1] flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-[#6B6860] opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <p className="text-sm font-semibold text-[#1A1916]">
                        Brand Asset Kit
                      </p>
                      <p className="text-xs text-[#9E9C98]">
                        High-res model shots and product imagery from the
                        manufacturer.
                      </p>
                      <a
                        href={marketingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto text-xs text-[#16A34A] hover:text-[#15803D] underline underline-offset-2"
                      >
                        Access Assets ↗
                      </a>
                    </div>
                  </div>
                )}
                {aiImageUrl && (
                  <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] overflow-hidden flex flex-col hover:border-[#BBF7D0] transition-colors group">
                    <div className="h-36 bg-gradient-to-br from-[#F2F1EE] to-[#E8E6E1] flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-[#6B6860] opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <p className="text-sm font-semibold text-[#1A1916]">
                        AI Product Image
                      </p>
                      <p className="text-xs text-[#9E9C98]">
                        AI-generated product image. Open or download.
                      </p>
                      <a
                        href={aiImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto text-xs text-[#16A34A] hover:text-[#15803D] underline underline-offset-2"
                      >
                        Open / Download ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ weekId: string; id: string }>;
}) {
  const { weekId, id } = await params;
  const supabase = await createClient();
  const { tier } = await getAuthTier();

  const [{ data: report, error }, { data: weekReports }, { data: week }] = await Promise.all([
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
  ]);

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
    { id: 'section-1', label: 'Product Identity', icon: null },
    { id: 'section-2', label: 'Trend Signals', icon: null },
    { id: 'section-3', label: 'Market Intelligence', icon: null },
    { id: 'section-4', label: 'Social Proof', icon: null },
    { id: 'section-5', label: 'Export & Logistics', icon: null },
    { id: 'section-6', label: 'Launch Kit', icon: null },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F7F4]">
      <ClientLeftNav sections={sections} />
      <div className="flex-1 pl-[18rem]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-10 pb-[60vh]">
          <div className="space-y-6 mt-10">
        <Link href={`/weekly/${weekId}`} className="text-sm font-medium text-[#9E9C98] hover:text-[#1A1916] inline-block">← Back to week</Link>

        {isTeaser && (
          <div className="rounded-lg bg-[#DCFCE7] border border-[#BBF7D0] px-4 py-2 text-sm text-[#16A34A]">
            🆓 FREE THIS WEEK — Full report unlocked for everyone.
          </div>
        )}

        {/* Section 1–2: All tiers */}
        <ProductIdentity report={report as ScoutFinalReportsRow} />
        <TrendSignalDashboard report={report as ScoutFinalReportsRow} />

        {/* Section 3–4: Standard+ or locked */}
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

        {/* Section 5: Export & Logistics Intel (Standard+ visible; values blurred for non-Alpha) */}
        {hasLogistics && (
          canSeeStandard ? (
            <SourcingIntel
              report={report as ScoutFinalReportsRow}
              tier={tier as string}
              isTeaser={isTeaser}
            />
          ) : (
            <LockedSection {...SECTION_ALPHA_SOURCING_CTA} />
          )
        )}

        {/* Section 6: Launch Kit — Supplier & Contact (Alpha only or locked) */}
        {hasSupplier && (
          <div id="section-6" className="scroll-mt-[160px]">
            {canSeeAlpha ? (
              <SupplierContact report={report as ScoutFinalReportsRow} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
            ) : (
              <LockedSection {...SECTION_ALPHA_SUPPLIER_CTA} />
            )}
          </div>
        )}

        {/* Section 8: Navigation (all tiers) — dark footer anchor */}
        <section className="rounded-2xl border border-[#3D3B36] bg-[#1A1916] p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            {prevId ? (
              <Link
                href={`/weekly/${weekId}/${prevId}`}
                className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] transition-colors"
              >
                ← Previous Product
              </Link>
            ) : (
              <span />
            )}
            {nextId ? (
              <Link
                href={`/weekly/${weekId}/${nextId}`}
                className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] ml-auto transition-colors"
              >
                Next Product →
              </Link>
            ) : (
              <span />
            )}
          </div>
          <p className="mb-6">
            <Link
              href={`/weekly/${weekId}`}
              className="text-[#F8F7F4] hover:text-[#16A34A] font-medium text-sm inline-flex items-center gap-2 transition-colors"
            >
              Back to {weekLabel} Product List
            </Link>
          </p>
          <div className="rounded-lg border border-[#3D3B36] bg-[#3D3B36]/30 px-4 py-3 text-center">
            {tier === "free" && (
              <Link
                href="/pricing"
                className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] underline transition-colors"
              >
                Unlock Full Market Intelligence — Start at $9/mo →
              </Link>
            )}
            {tier === "standard" && (
              <Link
                href="/pricing"
                className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] underline transition-colors"
              >
                Go Alpha — Get Supplier Contacts for $29/mo →
              </Link>
            )}
            {tier === "alpha" && (
              <p className="text-sm font-medium text-[#16A34A]">You have full access</p>
            )}
          </div>
        </section>
          </div>
        </div>
      </div>
    </div>
  );
}
