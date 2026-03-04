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
import { GroupBBrokerSection } from "@/components/GroupBBrokerSection";
import { Badge, Button, KeywordPill } from "@/components/ui";
import { AlertTriangle, ArrowRight, Award, CheckCircle, Download, ExternalLink, Film, FolderOpen, Globe, ImageIcon, LayoutTemplate, Lock, Mail, Phone, Play, ShoppingBag, TrendingUp, XCircle } from "lucide-react";
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
  // ── 데이터 준비 ─────────────────────────────────────
  const estimatedCost    = report.estimated_cost_usd ?? null
  const profitMultiplier = report.profit_multiplier  ?? null
  const rows = parseGlobalPricesForGrid(report.global_prices, report.global_price as string | Record<string, unknown> | null | undefined)

  // ── Global Valuation 3단계 계산 로직 ────────────────
  const pricedRows = rows.filter((r) => !r.isBlueOcean && r.priceDisplay)
  const parsedPrices = pricedRows
    .map((r) => parseFloat(r.priceDisplay?.replace(/[^0-9.]/g, "") ?? ""))
    .filter((n) => !isNaN(n) && n > 0)

  let globalValuation: number | null = null
  let globalValuationLabel = "Avg. Global Retail"

  if (parsedPrices.length === 1) {
    globalValuation = parsedPrices[0]
    globalValuationLabel = "Avg. Global Retail"
  } else if (parsedPrices.length >= 2) {
    globalValuation = parsedPrices.reduce((a, b) => a + b, 0) / parsedPrices.length
    globalValuationLabel = "Avg. Global Retail"
  } else if (estimatedCost && profitMultiplier) {
    globalValuation = estimatedCost * profitMultiplier
    globalValuationLabel = "Estimated Retail Value"
  }

  const globalValuationDisplay = globalValuation
    ? `~$${globalValuation.toFixed(2)}`
    : "—"

  const hasProfitBlock = profitMultiplier || estimatedCost || globalValuation

  const searchVolume    = report.search_volume?.trim() || null
  const momGrowth       = report.mom_growth?.trim()    || null
  const wowRate         = report.wow_rate?.trim()      || null
  const hasSearchGrowth = searchVolume || momGrowth || wowRate

  const winningFeature = report.top_selling_point?.trim() || null
  const painPoint      = report.common_pain_point?.trim() || null

  const isAlpha = tier === "alpha"

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

        {/* ── TIER 1: THE MONEY ──────────────────────────── */}
        {hasProfitBlock && (
          <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 mb-6">

            {/* Badge + Disclaimer */}
            <div style={{ marginBottom: "1.2cm" }}>
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 inline-flex items-center mb-2">
                <p className="text-3xl font-extrabold text-[#16A34A] tracking-tight">
                  🔥 UP TO {profitMultiplier}× MARGIN POTENTIAL
                </p>
              </div>
              <p className="text-base italic text-[#6B6860]">
                *Projected margin based on estimated KR wholesale cost and global market analysis.
              </p>
            </div>

            {/* Split columns */}
            <div className="grid grid-cols-2">

              {/* Left: EST. WHOLESALE */}
              <div className="pr-8 border-r border-[#E8E6E1]">
                <p
                  className="text-lg font-bold text-[#6B6860] uppercase tracking-widest"
                  style={{ marginTop: "0.8cm" }}
                >
                  Est. Wholesale
                </p>
                <p
                  className="text-5xl font-extrabold text-[#1A1916] tracking-tighter"
                  style={{ marginTop: "0.4cm" }}
                >
                  {estimatedCost ? `~$${estimatedCost}` : "—"}
                </p>
                <p className="text-xs text-[#9E9C98] mt-2">
                  Est. KR Wholesale
                </p>

                {/* CTA */}
                <div style={{ marginTop: "0.6cm" }}>
                  {isAlpha ? (
                    <ScrollToIdButton
                      sectionId="section-6"
                      className="text-base font-bold text-[#16A34A] hover:underline transition-colors"
                    >
                      ✓ View Verified Supplier Cost ↓
                    </ScrollToIdButton>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center gap-2 text-base font-bold text-[#9E9C98] cursor-not-allowed"
                    >
                      🔒 View Verified Supplier Cost
                      <span className="text-[10px] font-bold text-white bg-[#16A34A] rounded-full px-2 py-0.5">
                        Alpha
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Right: GLOBAL VALUATION */}
              <div className="pl-8">
                <p
                  className="text-lg font-bold text-[#6B6860] uppercase tracking-widest"
                  style={{ marginTop: "0.8cm" }}
                >
                  Global Valuation
                </p>
                <p
                  className="text-5xl font-extrabold text-[#16A34A] tracking-tighter"
                  style={{ marginTop: "0.4cm" }}
                >
                  {globalValuationDisplay}
                </p>
                {parsedPrices.length >= 1 ? (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-[#16A34A]/80">
                      Verified Market Price
                    </p>
                    <p className="text-xs italic text-[#9E9C98] mt-0.5">
                      Based on real-time commerce data.
                    </p>
                  </div>
                ) : (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-[#16A34A]/80">
                      Estimated Strategic Valuation
                    </p>
                    <p className="text-xs italic text-[#9E9C98] mt-0.5">
                      Calculated via KoreaScout Margin Multiplier.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TIER 2: THE OPPORTUNITY ────────────────────── */}
        {(() => {
          const findRow = (label: string) =>
            rows.find((r) => r.label.toLowerCase() === label.toLowerCase())

          const sixMarkets: {
            code: string
            label: string
            row: typeof rows[number] | null
          }[] = [
            { code: "US",  label: "North America",   row: findRow("US")  ?? null },
            { code: "UK",  label: "United Kingdom",  row: findRow("UK")  ?? null },
            { code: "EU",  label: "European Union",  row: null },
            { code: "JP",  label: "Japan",           row: null },
            { code: "SEA", label: "Southeast Asia",  row: findRow("SEA") ?? null },
            { code: "UAE", label: "Middle East",     row: null },
          ]

          return (
            <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 mb-6">

              {/* Header */}
              <div className="flex items-baseline">
                <h3 className="text-xl font-bold text-[#1A1916]">
                  Global Market Availability
                </h3>
                <span className="text-sm text-[#6B6860] font-normal ml-3">
                  6 Strategic Markets for K-Products
                </span>
              </div>

              {/* 6-Grid */}
              <div
                className="grid grid-cols-2 gap-x-16"
                style={{ marginTop: "1.2cm", rowGap: "1.2cm" }}
              >
                {sixMarkets.map((market) => {
                  const isUntapped = !market.row || market.row.isBlueOcean

                  return (
                    <div
                      key={market.code}
                      className="border-l-4 border-[#16A34A] pl-8 py-6 min-h-[150px]"
                    >
                      {/* Country code + full name */}
                      <p className="text-2xl font-extrabold text-[#6B6860] uppercase tracking-widest mb-3">
                        {market.code}
                        <span className="text-sm font-normal normal-case tracking-normal text-[#9E9C98] ml-2">
                          {market.label}
                        </span>
                      </p>

                      {/* Status — mt-[0.6cm] from label */}
                      <div style={{ marginTop: "0.6cm" }}>
                        {isUntapped ? (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
                              <p className="text-sm font-semibold text-[#16A34A] tracking-widest uppercase">
                                Untapped
                              </p>
                            </div>
                            <p className="text-xs italic text-[#9E9C98]">
                              No established sellers detected.
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 rounded-full bg-[#9E9C98]" />
                              <p className="text-xl font-extrabold text-[#1A1916]">
                                {market.row!.priceDisplay}
                              </p>
                            </div>
                            {market.row!.platform && (
                              <p className="text-xs text-[#9E9C98] mt-1">
                                via {market.row!.platform}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Footer — mt-[2.5cm] breathing room */}
              <div style={{ marginTop: "2.5cm" }}>
                <div className="border-t border-[#E8E6E1] pt-6">
                  <p className="text-base italic text-[#6B6860]">
                    ● Untapped = No established sellers detected.{" "}
                    <span className="text-sm">
                      * Data may vary based on real-time market changes.
                    </span>
                  </p>
                  <ScrollToIdButton
                    sectionId="section-6"
                    className="text-base font-bold text-[#16A34A] hover:underline transition-colors block mt-[0.6cm]"
                  >
                    Analyze Pricing Sources &amp; Entry Points ↓
                  </ScrollToIdButton>
                </div>
              </div>

            </div>
          )
        })()}

        {/* ── TIER 3: THE DATA & INTEL ───────────────────── */}
        {(hasSearchGrowth || winningFeature || painPoint) && (
          <div className="bg-[#F8F7F4] rounded-3xl p-12">
            <div className="grid grid-cols-2 gap-x-24 mt-6">

            {/* LEFT: Search & Growth */}
            {hasSearchGrowth && (
              <div>
                <h3 className="text-xl font-bold text-[#1A1916] mb-12">
                  Search &amp; Growth
                </h3>

                {/* Search Volume */}
                {searchVolume && (
                  <div className="mb-16">
                    <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">
                      SEARCH VOLUME
                    </p>
                    <p className="text-4xl font-extrabold text-[#1A1916]">
                      {searchVolume}
                    </p>
                  </div>
                )}

                {/* MoM Growth — Defensive Typography */}
                {momGrowth && (
                  <div className="mb-16">
                    <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">
                      MoM GROWTH
                    </p>
                    {momGrowth.length <= 10 ? (
                      <p className={`text-4xl font-extrabold ${
                        isPositiveGrowth(momGrowth)
                          ? "text-[#16A34A]"
                          : "text-[#DC2626]"
                      }`}>
                        {momGrowth}{" "}
                        <span className="text-3xl">
                          {isPositiveGrowth(momGrowth) ? "↑" : "↓"}
                        </span>
                      </p>
                    ) : (
                      <p className={`text-lg font-medium leading-relaxed ${
                        isPositiveGrowth(momGrowth)
                          ? "text-[#16A34A]"
                          : "text-[#DC2626]"
                      }`}>
                        {momGrowth}
                      </p>
                    )}
                  </div>
                )}

                {/* WoW Growth — Defensive Typography + Conditional Render */}
                {wowRate && wowRate !== "N/A" && (
                  <div className="mb-16">
                    <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">
                      WoW GROWTH
                    </p>
                    {wowRate.length <= 10 ? (
                      <p className={`text-4xl font-extrabold ${
                        isPositiveGrowth(wowRate)
                          ? "text-[#16A34A]"
                          : "text-[#DC2626]"
                      }`}>
                        {wowRate}{" "}
                        <span className="text-3xl">
                          {isPositiveGrowth(wowRate) ? "↑" : "↓"}
                        </span>
                      </p>
                    ) : (
                      <p className={`text-lg font-medium leading-relaxed ${
                        isPositiveGrowth(wowRate)
                          ? "text-[#16A34A]"
                          : "text-[#DC2626]"
                      }`}>
                        {wowRate}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* RIGHT: Analyst Brief */}
            {(winningFeature || painPoint) && (
              <div>
                <h3 className="text-xl font-bold text-[#1A1916] mb-12">
                  Analyst Brief
                </h3>

                <div className="border-l-4 border-[#16A34A] pl-8 py-2">

                  {winningFeature && (
                    <div>
                      <p className="text-sm font-bold text-[#6B6860] uppercase tracking-widest mb-4">
                        Competitive Edge
                      </p>
                      <p className="text-lg text-[#1A1916] leading-relaxed mb-16">
                        {winningFeature}
                      </p>
                    </div>
                  )}

                  {painPoint && (
                    <div>
                      <p className="text-sm font-bold text-[#6B6860] uppercase tracking-widest mb-4 mt-8">
                        Risk Factor
                      </p>
                      <p className="text-lg text-[#1A1916] leading-relaxed mb-16">
                        {painPoint}
                      </p>
                    </div>
                  )}

                </div>
              </div>
            )}

            </div>

            {/* Authority blurb */}
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

  // ── Trending Signals ────────────────────────────────
  const risingKw = normalizeToArray(report.rising_keywords);
  const seoKw = normalizeToArray(report.seo_keywords);
  const viralHt = normalizeToArray(report.viral_hashtags);
  const hasAnyTrending = risingKw.length > 0 || seoKw.length > 0 || viralHt.length > 0;

  // ── Strategy Steps 1–3 ──────────────────────────────
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

      {/* ── BLOCK 1: SOCIAL BUZZ ─────────────────────── */}
      {report.buzz_summary?.trim() && (
        <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-12">
          <p className="text-xl font-bold text-[#1A1916] mb-6">
            Social Buzz
          </p>
          <span className="block text-6xl font-serif text-[#16A34A] leading-none mb-6">
            &ldquo;
          </span>
          <p className="text-3xl italic font-medium text-[#1A1916] leading-tight max-w-4xl">
            {report.buzz_summary}
          </p>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#9E9C98] mt-8">
            KoreaScout Intelligence Engine
          </p>
        </div>
      )}

      {/* ── BLOCK 2: MARKET GAP ANALYSIS ─────────────── */}
      {(report.kr_local_score != null || report.global_trend_score != null) && (
        <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-12">
          <p className="text-xl font-bold text-[#1A1916] mb-10">
            Market Gap Analysis
          </p>

          <div className="grid grid-cols-2">

            {/* KR Traction */}
            <div className="pr-12 border-r border-[#E8E6E1]">
              <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">
                Korean Traction
              </p>
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
                <p className="text-lg text-[#1A1916] leading-relaxed mt-4">
                  {report.kr_evidence}
                </p>
              )}
              {report.kr_source_used?.trim() && (
                <p className="text-xs text-[#9E9C98] mt-3">
                  Source: {report.kr_source_used}
                </p>
              )}
            </div>

            {/* Global Presence */}
            <div className="pl-12">
              <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">
                Global Presence
              </p>
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
                <p className="text-lg text-[#1A1916] leading-relaxed mt-4">
                  {report.global_evidence}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── BLOCK 3: GAP INDEX HERO ───────────────────── */}
      {report.gap_index != null && (
        <div className="mt-32 mb-32 text-center">

          {/* Label — REF A 클래스 적용 */}
          <p className="text-xl font-bold text-[#1A1916] mb-6">
            Gap Index
          </p>

          {/* Hero Number — 140px */}
          <p
            className="font-black text-[#16A34A] leading-none tracking-tighter"
            style={{ fontSize: "140px" }}
          >
            {report.gap_index}
          </p>

          {/* Status Badge — REF B 폰트 사이즈 적용 */}
          {report.gap_status && (
            <div className="mt-4 mb-6 flex justify-center">
              <span
                className={`
                  inline-flex items-center px-3 py-1 rounded-full font-semibold
                  text-sm
                  ${
                    report.gap_status === "Blue Ocean" ||
                    report.gap_status === "Emerging"
                      ? "bg-[#DCFCE7] text-[#16A34A]"
                      : "bg-[#FEF3C7] text-[#D97706]"
                  }
                `}
              >
                {report.gap_status}
              </span>
            </div>
          )}

          {/* Opportunity Reasoning */}
          {report.opportunity_reasoning?.trim() && (
            <p className="text-base italic text-[#6B6860] max-w-lg mx-auto leading-relaxed mt-4">
              {report.opportunity_reasoning}
            </p>
          )}

        </div>
      )}

      {/* ── BLOCK 4: TRENDING SIGNALS ────────────────── */}
      {hasAnyTrending && (
        <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-12">

          {/* Header — REF A */}
          <p className="text-xl font-bold text-[#1A1916] mb-10">
            Trending Signals
          </p>

          {/* Rising Keywords — all tiers */}
          {risingKw.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">
                Rising Keywords (KR)
              </p>
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

          {/* Global SEO Keywords — Alpha only */}
          {seoKw.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">
                Global SEO Keywords
              </p>
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

          {/* Viral Hashtags — Alpha only */}
          {viralHt.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">
                Viral Hashtags
              </p>
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

          {/* Alpha Lock CTA */}
          {!canSeeAlpha && (seoKw.length > 0 || viralHt.length > 0) && (
            <div className="mt-6 flex flex-col items-center justify-center py-8 gap-3 rounded-xl border border-[#E8E6E1] bg-white px-4">
              <Lock className="w-4 h-4 text-[#9E9C98]" />
              <p className="text-sm text-[#6B6860] text-center">
                SEO keywords &amp; viral hashtags are available on Alpha.
              </p>
              <a href="/pricing">
                <Button variant="secondary" size="sm">Go Alpha $29/mo →</Button>
              </a>
            </div>
          )}

        </div>
      )}

      {/* ── BLOCK 5: SCOUT STRATEGY REPORT ───────────── */}
      {steps.length > 0 && (
        <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-12">

          {/* Header — REF A */}
          <p className="text-xl font-bold text-[#1A1916] mb-10">
            Scout Strategy Report
          </p>

          {canSeeAlpha ? (
            <div className="space-y-16">
              {steps.map((step, i) => (
                <div key={i} className="relative flex gap-6">

                  {/* Ghost background number */}
                  <span
                    className="absolute -top-4 -left-2 text-[80px] font-black leading-none select-none pointer-events-none opacity-[0.03]"
                    style={{ color: "#1A1916" }}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Long Green accent bar — full step height */}
                  <div className="w-1 bg-[#16A34A] rounded-full shrink-0 self-stretch" />

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2">
                      Step {i + 1}
                    </p>
                    <p className="text-base font-extrabold text-[#1A1916] mb-3">
                      {step.label}
                    </p>
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
                <p className="text-sm text-[#6B6860] text-center">
                  Full entry strategy is available on Alpha.
                </p>
                <a href="/pricing">
                  <Button variant="secondary" size="sm">Go Alpha $29/mo →</Button>
                </a>
              </div>
            </div>
          )}

        </div>
      )}
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

        {/* ── GROUP A: EXPORT READINESS ───────────────── */}
        <div className="bg-[#F8F7F4] rounded-2xl p-10">
          <p className="text-xl font-bold text-[#1A1916] mb-8">
            Export Readiness
          </p>

          {canSeeAlpha ? (
            <div className={`rounded-xl border-2 ${exportConfig.border} ${exportConfig.bg} px-8 py-6`}>

              {/* Status row */}
              <div className="flex items-center gap-4 mb-4">
                {report.export_status === "Green" && (
                  <CheckCircle className={`w-8 h-8 shrink-0 ${exportConfig.color}`} />
                )}
                {report.export_status === "Yellow" && (
                  <AlertTriangle className={`w-8 h-8 shrink-0 ${exportConfig.color}`} />
                )}
                {report.export_status !== "Green" && report.export_status !== "Yellow" && (
                  <XCircle className={`w-8 h-8 shrink-0 ${exportConfig.color}`} />
                )}
                <p className={`text-2xl font-black tracking-tighter ${exportConfig.color}`}>
                  {exportConfig.label}
                </p>
              </div>

              {/* Status reason */}
              {report.status_reason?.trim() && (
                <p className="text-lg text-[#1A1916] leading-relaxed">
                  {report.status_reason}
                </p>
              )}

              {/* Pro-Tip */}
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

        {/* ── GROUP B: HS CODE + BROKER EMAIL ─────────── */}
        <GroupBBrokerSection report={report} canSeeAlpha={canSeeAlpha} />

        {/* ── GROUP C: LOGISTICS DASHBOARD ────────────── */}
        <div className="bg-[#F8F7F4] rounded-2xl p-10">
          <p className="text-xl font-bold text-[#1A1916] mb-8">
            Logistics Dashboard
          </p>

          {canSeeAlpha ? (
            <>
              {/* ── Weight 3카드 + 화살표 ──────────────────── */}
              {hasWeight && (
                <div className="flex items-center gap-3 mb-12">

                  {/* Actual Weight */}
                  <div className="flex-1 bg-white border border-[#E8E6E1] rounded-xl p-5 text-center">
                    <p className="text-lg font-bold text-[#6B6860] uppercase tracking-widest mb-3">Actual Weight</p>
                    <p className="text-4xl font-black tracking-tighter text-[#1A1916]">
                      {hasActual ? `${report.actual_weight_g}g` : "—"}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="w-5 h-5 text-[#9E9C98] shrink-0" />

                  {/* Volumetric Weight */}
                  <div className="flex-1 bg-white border border-[#E8E6E1] rounded-xl p-5 text-center">
                    <p className="text-lg font-bold text-[#6B6860] uppercase tracking-widest mb-3">Volumetric Weight</p>
                    <p className="text-4xl font-black tracking-tighter text-[#1A1916]">
                      {hasVol ? `${report.volumetric_weight_g}g` : "—"}
                    </p>
                    {report.dimensions_cm?.trim() && (
                      <span className="inline-block mt-2 bg-[#F2F1EE] text-[#9E9C98] rounded px-2 py-0.5 text-[10px] font-medium">
                        {report.dimensions_cm}
                      </span>
                    )}
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="w-5 h-5 text-[#9E9C98] shrink-0" />

                  {/* Billable Weight — green highlight */}
                  <div className="flex-1 bg-[#DCFCE7] border border-[#BBF7D0] rounded-xl p-5 text-center">
                    <p className="text-lg font-bold text-[#6B6860] uppercase tracking-widest mb-3 text-[#16A34A]">Billable Weight</p>
                    <p className="text-4xl font-black tracking-tighter text-[#16A34A]">
                      {hasBillable ? `${report.billable_weight_g}g` : "—"}
                    </p>
                    {hasVol && hasActual && (
                      <p className="text-xs font-bold text-[#16A34A]/70 mt-2">
                        {report.volumetric_weight_g! > report.actual_weight_g!
                          ? "Volumetric applies"
                          : "Dead weight applies"}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ── Shipping Tier ─────────────────────────── */}
              {report.shipping_tier?.trim() && (
                <div className="mb-10">
                  <p className="text-xl font-bold text-[#1A1916] mb-4">Shipping Tier</p>
                  <p className="text-lg text-[#1A1916] leading-relaxed">
                    {describeShippingTier(report.shipping_tier).description}
                  </p>
                </div>
              )}

              {/* ── Hazmat & Compliance ───────────────────── */}
              <div className="border-t border-[#E8E6E1] pt-8 mt-4">
                <p className="text-xl font-bold text-[#1A1916] mb-6">Hazmat &amp; Compliance</p>

                {/* HazmatBadges */}
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

                {/* Certifications — Luxury Pills */}
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

              {/* ── Product Specs ─────────────────────────── */}
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

        {/* ── GROUP D: COMPLIANCE STRATEGY ────────────── */}
        {(() => {
          const notes = report.shipping_notes?.trim();
          const hasNotes = notes && !/tier/i.test(notes);
          if (logisticsSteps.length === 0 && !hasNotes) return null;

          return (
            <div className="bg-[#F8F7F4] rounded-2xl p-10">
              <p className="text-xl font-bold text-[#1A1916] mb-10">
                Compliance &amp; Logistics Strategy
              </p>

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
                          {/* Long Green accent bar — full step height */}
                          <div className="w-1 bg-[#16A34A] rounded-full shrink-0 self-stretch" />
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2">
                              Step {i + 4}
                            </p>
                            <p className="text-base font-extrabold text-[#1A1916] mb-3">
                              {step.label}
                            </p>
                            <p className="text-lg text-[#1A1916] leading-relaxed whitespace-pre-line">
                              {step.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {hasNotes && (
                    <div className="border-t border-dashed border-[#E8E6E1] pt-8">
                      <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-3">Shipping Notes</p>
                      <p className="text-sm italic text-[#6B6860] leading-relaxed">
                        {notes}
                      </p>
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

      {/* ── ALPHA LOCK OVERLAY (절대 건드리지 않음) ──── */}
      {!canSeeAlpha && (
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col items-center justify-end pb-6 gap-3 rounded-2xl">
          <Lock className="w-5 h-5 text-[#9E9C98]" />
          <p className="text-sm text-[#6B6860] text-center max-w-xs">
            Unlock full logistics intelligence with Alpha.
          </p>
          <a href="/pricing">
            <Button variant="secondary" size="sm">Go Alpha $29/mo →</Button>
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
            <h2 className="text-3xl font-bold text-[#1A1916] mb-4 tracking-tight">
              Launch & Execution Kit
            </h2>
            <p className="text-sm text-[#6B6860] leading-relaxed mt-1">
              From product discovery to live campaign — everything you need.
            </p>
          </div>

          {/* BLOCK A: Financials & Trade Terms */}
          <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-6 mt-6">
            <p className={refA}>Financial Briefing</p>
            <div className="grid grid-cols-2">
              <div className="pr-10 border-r border-[#E8E6E1]">
                <p className={refB}>Cost Per Unit</p>
                {hasVerifiedPrice && !isUndisclosed ? (
                  <>
                    <p
                      className="font-black tracking-tighter text-[#1A1916] leading-none"
                      style={{ fontSize: "80px" }}
                    >
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
              <div className="pl-10 space-y-8">
                {report.moq?.trim() && (
                  <div>
                    <p className={refB}>MOQ</p>
                    <p className="text-4xl font-black tracking-tighter text-[#1A1916]">
                      {report.moq}
                    </p>
                  </div>
                )}
                {report.lead_time?.trim() && (
                  <div>
                    <p className={refB}>Lead Time</p>
                    <p className="text-4xl font-black tracking-tighter text-[#1A1916]">
                      {report.lead_time}
                    </p>
                  </div>
                )}
                {(report.sample_policy?.trim() || report.export_cert_note?.trim()) && (
                  <div className="border-t border-[#E8E6E1] pt-6 space-y-4">
                    {report.sample_policy?.trim() && (
                      <div>
                        <p className="text-[10px] font-bold text-[#9E9C98] uppercase tracking-[0.3em] mb-1">
                          Sample Policy
                        </p>
                        <p className="text-sm font-semibold text-[#1A1916] leading-relaxed">
                          {report.sample_policy}
                        </p>
                      </div>
                    )}
                    {report.export_cert_note?.trim() && (
                      <div>
                        <p className="text-[10px] font-bold text-[#9E9C98] uppercase tracking-[0.3em] mb-1">
                          Compliance Note
                        </p>
                        <p className="text-sm font-semibold text-[#1A1916] leading-relaxed">
                          {report.export_cert_note}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BLOCK B: Supplier & Brand Intel */}
          <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-6">
            <p className={refA}>Supplier &amp; Brand Intel</p>
            {report.m_name?.trim() && (
              <div className="mb-8">
                <p className="text-[10px] font-bold text-[#9E9C98] uppercase tracking-[0.3em] mb-2">
                  Manufacturer / Brand
                </p>
                <p className="text-2xl font-black text-[#1A1916]">
                  {report.m_name}
                </p>
              </div>
            )}
            {(() => {
              const contacts = [
                report.contact_email?.trim() && {
                  id: "email",
                  icon: <Mail className="w-5 h-5 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                  label: report.contact_email.trim(),
                  href: `mailto:${report.contact_email.trim()}`,
                  external: false as const,
                },
                report.contact_phone?.trim() && {
                  id: "phone",
                  icon: <Phone className="w-5 h-5 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                  label: report.contact_phone.trim(),
                  href: `tel:${report.contact_phone.trim()}`,
                  external: false as const,
                },
                report.m_homepage?.trim() && {
                  id: "website",
                  icon: <Globe className="w-5 h-5 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                  label: "Website",
                  href: report.m_homepage.trim(),
                  external: true as const,
                },
                report.wholesale_link?.trim() && {
                  id: "wholesale",
                  icon: <ShoppingBag className="w-5 h-5 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                  label: "Wholesale Portal",
                  href: report.wholesale_link.trim(),
                  external: true as const,
                },
              ].filter(Boolean) as Array<{ id: string; icon: React.ReactNode; label: string; href: string; external: boolean }>;

              if (contacts.length === 0) return null;

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {contacts.map((contact, i) => (
                    <a
                      key={contact.id}
                      href={contact.href}
                      target={contact.external ? "_blank" : undefined}
                      rel={contact.external ? "noopener noreferrer" : undefined}
                      className={`
                        flex items-center gap-4 bg-white border border-[#E8E6E1]
                        rounded-xl px-5 py-4
                        hover:border-[#16A34A] transition-colors group
                        ${contacts.length === 3 && i === 2 ? "col-span-1 sm:col-span-2" : ""}
                      `}
                    >
                      {contact.icon}
                      <span className="text-sm font-bold text-[#1A1916] truncate">
                        {contact.label}
                      </span>
                    </a>
                  ))}
                </div>
              );
            })()}
            {globalProofTags.length > 0 && (
              <div>
                <p className={refB}>Global Market Proof</p>
                <div className="flex flex-wrap gap-3">
                  {globalProofTags.map((tag) => (
                    <a
                      key={tag.region}
                      href={tag.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white border border-[#E8E6E1] rounded-lg px-4 py-3 hover:border-[#16A34A] transition-colors"
                    >
                      <span className="font-black text-[#1A1916] text-sm">
                        {tag.region}
                      </span>
                      {tag.platform && (
                        <span className="text-sm text-[#6B6860]">
                          {tag.platform}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* BLOCK C: Cinematic Asset Cards */}
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
                        <div className="w-32 h-32 text-[#1A1916] opacity-5 flex items-center justify-center">
                          {card.icon}
                        </div>
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
                      <p className="text-xl font-bold text-[#1A1916] mb-2">
                        {card.title}
                      </p>
                      <p className={`${refC} mb-6`}>
                        {card.description}
                      </p>
                      <a
                        href={card.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                          w-full flex items-center justify-center gap-2
                          py-3 rounded-xl font-bold text-sm
                          transition-colors duration-200
                          ${card.isPrimary
                            ? "bg-[#1A1916] text-white hover:bg-[#2D2B26]"
                            : "bg-white border border-[#E8E6E1] text-[#1A1916] hover:border-[#1A1916]"
                          }
                        `}
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
