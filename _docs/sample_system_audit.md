# Sample system audit — exact code excerpts

스캔 전용. 소스 파일은 수정하지 않음.

---

## 1. `app/sample-report/page.tsx` (전체)

```tsx
import Link from "next/link";
import ProductIdentity from "@/components/ProductIdentity";
import {
  TrendSignalDashboard,
  MarketIntelligence,
  SocialProofTrendIntelligence,
  SourcingIntel,
  SupplierContact,
  EXPORT_STATUS_DISPLAY,
} from "@/components/report";
import { sampleReportData } from "@/data/sampleReportData";

export default function SampleReportPage() {
  const report = sampleReportData;
  const tier = "alpha" as const;
  const isTeaser = true;

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Sticky premium banner */}
      <div className="sticky top-0 z-50 w-full border-b border-[#E8E6E1] bg-[#1A1916] shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/95 text-sm sm:text-base font-medium text-center sm:text-left">
            This is a curated sample report. Get full access to our weekly intelligence.
          </p>
          <Link
            href="/pricing"
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#15803D] transition-colors shadow-[0_2px_8px_rgba(22,163,74,0.35)]"
          >
            Subscribe to Alpha
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-10 pb-[60vh]">
        <div className="space-y-6 mt-6">
          <Link
            href="/"
            className="text-base font-medium text-[#6B6860] hover:text-[#1A1916] transition-colors inline-block"
          >
            ← Back to home
          </Link>

          <ProductIdentity
            report={report}
            tier={tier}
            isTeaser={isTeaser}
            EXPORT_STATUS_DISPLAY={EXPORT_STATUS_DISPLAY}
            isSample={true}
          />
          <TrendSignalDashboard report={report} />
          <MarketIntelligence report={report} tier={tier} isTeaser={isTeaser} />
          <SocialProofTrendIntelligence report={report} tier={tier} isTeaser={isTeaser} />
          <SourcingIntel report={report} tier={tier} isTeaser={isTeaser} />
          <div id="section-6" className="scroll-mt-[160px]">
            <SupplierContact report={report} tier={tier} isTeaser={isTeaser} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 2. `components/Hero.tsx` (전체)

```tsx
"use client";

import { useRef, useEffect } from "react";
import HeroCTA from "@/components/HeroCTA";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const play = () => {
      video.play().catch(() => {});
    };
    play();
    video.addEventListener("loadeddata", play);
    return () => video.removeEventListener("loadeddata", play);
  }, []);

  return (
    <section
      className="relative w-full h-screen min-h-[640px] flex flex-col items-center justify-end overflow-hidden bg-[#0A0908]"
      style={{ marginTop: 0, paddingTop: 0, width: "100%", maxWidth: "100vw" }}
    >
      {/* Video BG — z-0, starts at viewport top */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ opacity: 0.6 }}
          src="/videos/hero.mp4"
        />
      </div>

      {/* Overlay: bg-black/30 for readability without hiding video — z-10 */}
      <div
        className="absolute inset-0 pointer-events-none bg-black/30"
        style={{ zIndex: 10 }}
        aria-hidden
      />

      {/* Gradient fade to black at bottom — z-10 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 10,
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(10,9,8,0.25) 50%, #0A0908 100%)",
        }}
        aria-hidden
      />

      {/* Center content — Pre-headline + Headline + Buttons — z-20 */}
      <div
        className="relative text-center px-6 max-w-7xl mx-auto flex flex-col items-center justify-center"
        style={{ zIndex: 20, paddingBottom: "clamp(60px, 10vh, 120px)" }}
      >
        <h1
          className="font-black text-[#FFFFFF]"
          style={{
            margin: 0,
            fontSize: "clamp(1.4rem, 3.2vw, 3.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            textAlign: "center",
            lineHeight: 1.1,
            padding: "0 20px",
            whiteSpace: "nowrap",
          }}
        >
          The K-Beauty Trend Pipeline.<br />Before Your Feed Knows It Exists.
        </h1>

        <div className="mt-20 flex flex-col items-center justify-center">
          <HeroCTA />
        </div>
      </div>
    </section>
  );
}
```

---

## 3. `app/pricing/page.tsx` — lines 1–80

> 참고: 이 구간에는 메타데이터·체크아웃 URL·`getAlphaMemberCount`·`FEATURE_GROUPS` 초반이 포함되어 있으며, **Free 티어 카드 UI는 이 범위에 없음** (카드는 아래 §3b).

```tsx
import type { Metadata } from "next";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { PRICING } from "@/src/config/pricing";
import CheckoutButton from "@/components/CheckoutButton";

export const metadata: Metadata = {
  title: "Pricing — KoreaScout",
  description: `Compare Free, Standard ${PRICING.CURRENCY}${PRICING.STANDARD.monthly}, and Alpha ${PRICING.CURRENCY}${PRICING.ALPHA.monthly}. Choose your intelligence level.`,
};

const STANDARD_CHECKOUT_URL =
  "https://getkoreascout.lemonsqueezy.com/checkout/buy/e9701b40-aad3-446e-b00a-617d0159d501";
const ALPHA_CHECKOUT_URL =
  "https://getkoreascout.lemonsqueezy.com/checkout/buy/936321c8-fba1-4f88-bb30-8865c8006fac";
const ALPHA_MAX_SPOTS = 3000;

async function getAlphaMemberCount(): Promise<number> {
  try {
    const supabase = createServiceRoleClient();
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("tier", "alpha");
    if (error || count === null) return 0;
    return count;
  } catch {
    return 0;
  }
}

type FeatureRow = {
  feature: string;
  free: string;
  standard: string;
  alpha: string;
};
type FeatureGroup = {
  label: string;
  rows: FeatureRow[];
};

const FEATURE_GROUPS: FeatureGroup[] = [
  {
    label: "Product Identity",
    rows: [
      { feature: "Product Profile & Selective Tier Badges", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Strategic Viability & Trend Insights", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Real-time Retail Price & FX Tracker", free: "✓", standard: "✓", alpha: "✓" },
    ],
  },
  {
    label: "Trend Signal Dashboard",
    rows: [
      { feature: "Proprietary Market Score", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Competition Level Indicator", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Opportunity Status", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Real-time Growth Momentum", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Cross-Platform Vitality (TikTok, IG, YT)", free: "✓", standard: "✓", alpha: "✓" },
    ],
  },
  {
    label: "Market Intelligence",
    rows: [
      { feature: "Global Market Availability (6 Regions)", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Search Volume & Growth (MoM/WoW)", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Margin Potential Multiplier", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Strategic Valuation & Global Price Benchmarks", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Analyst Brief (Edge & Risk Factors)", free: "—", standard: "✓", alpha: "✓" },
    ],
  },
  {
    label: "Social Proof & Trend Intelligence",
    rows: [
      { feature: "Korea Gap Index™", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Social Buzz & Sentiment Analysis", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Rising Korean Keywords (KR)", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Global SEO Actionable Keywords", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Viral Hashtag Strategy", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Scout Strategy Report", free: "—", standard: "—", alpha: "✓" },
    ],
```

### 3b. Free 티어 카드 (동일 파일, lines 156–195 — 주석 `{/* FREE */}`부터 Standard 카드 직전까지)

```tsx
            {/* FREE */}
            <div className="bg-white border border-[#E8E6E1] rounded-2xl flex flex-col h-full p-8 md:p-12">
              <div className="min-h-[100px]">
                <p className="text-3xl md:text-4xl font-black text-[#1A1916] tracking-tighter leading-none mb-8">
                  Scout Free
                </p>
                <div className="mb-1">
                  <span className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                    {PRICING.CURRENCY}{PRICING.FREE.monthly}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-1">
                  Forever Free
                </p>
              </div>
              <div className="w-8 h-px bg-[#E8E6E1] my-5" />
              <div className="bg-[#F8F7F4] border border-[#E8E6E1] rounded-xl px-4 py-3 min-h-[120px] flex items-center">
                <p className="text-sm text-[#1A1916] leading-relaxed">
                  <span className="font-black uppercase">INSTANT ACCESS:</span>{" "}
                  <span className="font-medium">10+ products unlocked immediately. (1 week · 14-day delay)</span>
                </p>
              </div>
              <div className="flex-grow my-8">
                <p className="text-base font-medium text-[#6B6860] leading-relaxed">
                  See what KoreaScout finds.
                  Before you commit.
                </p>
              </div>
              <div className="mt-auto">
                <a
                  href="/signup"
                  className="block w-full text-center py-3 rounded-xl border-2 border-[#1A1916] text-sm font-black text-[#1A1916] hover:bg-[#1A1916] hover:text-white transition-all"
                >
                  Unlock Free Intelligence
                </a>
                <p className="text-xs text-[#9E9C98] text-center mt-3">
                  10+ products · 1 week unlocked · 14-day delay
                </p>
              </div>
            </div>
```

---

## 4. `app/weekly/page.tsx` — lines 150–220 (요청 그대로)

> 참고: `FREE_DELAY_DAYS`, `freeOpenWeekId`, `canAccessWeek`는 **이 구간에 없음**. 정의부는 아래 §4b.

```tsx
  for (const week of weeksForVault) {
    const d = new Date(week.start_date ?? 0);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const monthLabel = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const existing = monthGroupsForVault.find((g) => g.monthKey === monthKey);
    if (existing) {
      existing.weeks.push(week);
    } else {
      monthGroupsForVault.push({ monthKey, monthLabel, weeks: [week] });
    }
  }

  const tierLabel = tier === "alpha" ? "Alpha" : tier === "standard" ? "Standard" : "Free";
  const tierBadgeClass =
    tier === "alpha"
      ? "bg-[#16A34A]/20 border-[#16A34A]/40 text-[#16A34A]"
      : tier === "standard"
        ? "bg-[#16A34A]/10 border-[#16A34A]/30 text-[#15803D]"
        : "bg-white/10 border-white/20 text-[#9E9C98]";

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <div
        id="prelaunch-popup"
        className="fixed inset-0 z-[1000] hidden items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        aria-hidden="true"
      >
        <div className="bg-[#0A0908] border border-[#1A1916] rounded-2xl shadow-xl w-full max-w-sm mx-auto p-6">
          <h2 className="text-[#F8F7F4] font-bold text-xl">
            🔍 Beta Launch: April 25
          </h2>
          <p className="mt-4 text-[#9E9C98] text-sm leading-relaxed whitespace-pre-line">
            {"KoreaScout is in the final stages of curating this week's K-beauty intelligence reports.\n\nBeta access opens April 25, 2026."}
          </p>
          <button
            id="prelaunch-popup-close"
            type="button"
            className="mt-6 bg-[#16A34A] text-white rounded-xl px-6 py-3 hover:bg-[#15803D] transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
      <Script id="weekly-prelaunch-popup" strategy="afterInteractive">
        {`
          (function () {
            var cutoff = new Date('2026-04-25');
            if (new Date() >= cutoff) return;
            var tier = ${JSON.stringify(tier)};
            if (!tier) return;
            var key = 'ks:prelaunch:dismissed';
            if (window.localStorage.getItem(key) === '1') return;
            var popup = document.getElementById('prelaunch-popup');
            var close = document.getElementById('prelaunch-popup-close');
            if (!popup || !close) return;
            popup.classList.remove('hidden');
            popup.classList.add('flex');
            popup.setAttribute('aria-hidden', 'false');
            var dismiss = function () {
              window.localStorage.setItem(key, '1');
              popup.classList.remove('flex');
              popup.classList.add('hidden');
              popup.setAttribute('aria-hidden', 'true');
            };
            close.addEventListener('click', dismiss, { once: true });
            popup.addEventListener('click', function (e) {
              if (e.target === popup) dismiss();
            });
          })();
        `}
      </Script>
```

### 4b. `FREE_DELAY_DAYS`, `freeOpenWeekId`, `canAccessWeek`

요청한 150–220행에는 위 심볼 정의가 없음. 파일 상 해당 로직은 대략 **lines 10–36**, **lines 100–133**. 아래는 컴포넌트 시작부터 **`canAccessWeek` 직후**(line 133까지)까지 원본 순서 발췌.

```tsx
const FREE_DELAY_DAYS = 14;

function formatAvailableDate(publishedAt: string): string {
  const d = new Date(publishedAt);
  d.setDate(d.getDate() + FREE_DELAY_DAYS);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPublishedDate(publishedAt: string | null): string {
  if (!publishedAt) return "";
  const d = new Date(publishedAt);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function isWeekAvailableForFree(publishedAt: string | null): boolean {
  if (!publishedAt) return false;
  const freeAt = new Date(publishedAt);
  freeAt.setDate(freeAt.getDate() + FREE_DELAY_DAYS);
  return new Date() >= freeAt;
}

/** True if published in the past and within the last N days. */
function isWithinLastNDays(publishedAtString: string | null, days: number): boolean {
  if (!publishedAtString) return false;
  const publishDate = new Date(publishedAtString);
  const today = new Date();
  const diffTime = today.getTime() - publishDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= days;
}

type WeekRow = {
  week_id: string;
  week_label: string | null;
  start_date: string | null;
  end_date: string | null;
  published_at: string | null;
  product_count: number | null;
  summary: string | null;
  scout_final_reports?: { count: number }[];
};
type MonthGroup = {
  monthKey: string;
  monthLabel: string;
  weeks: WeekRow[];
};

export default async function WeeklyHubPage() {
  const supabase = await createClient();
  const { userId, tier, subscriptionStartAt } = await getAuthTier();

  if (!userId) {
    redirect("/login");
  }

  const isPaid = tier === "standard" || tier === "alpha";

  const { data: weeks, error } = await supabase
    .from("weeks")
    .select("week_id, week_label, start_date, end_date, published_at, product_count, summary, scout_final_reports(count)")
    .filter("scout_final_reports.status", "eq", "published")
    .eq("status", "published")
    .order("start_date", { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] pt-8 px-4 py-12">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-lg text-[#DC2626]">Failed to load weeks.</p>
          <Link href="/" className="text-[#16A34A] hover:text-[#15803D] text-base font-medium mt-4 inline-block">← Back to home</Link>
        </div>
      </div>
    );
  }

  const { data: latest3Weeks } = await supabase
    .from("weeks")
    .select("week_id")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);
  const latest3WeekIds = (latest3Weeks ?? []).map((w) => w.week_id);

  const freeOpenWeekId =
    weeks
      ?.filter((w) => isWeekAvailableForFree(w.published_at))
      .sort(
        (a, b) =>
          new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime()
      )[0]?.week_id ?? null;

  const monthGroups: MonthGroup[] = [];
  for (const week of weeks ?? []) {
    const d = new Date(week.start_date ?? 0);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const monthLabel = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const existing = monthGroups.find((g) => g.monthKey === monthKey);
    if (existing) {
      existing.weeks.push(week);
    } else {
      monthGroups.push({ monthKey, monthLabel, weeks: [week] });
    }
  }

  const currentMonthKey = (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  })();

  function canAccessWeek(week: WeekRow): boolean {
    const isLatestWeek = latest3WeekIds.includes(week.week_id);
    const isAfterSub =
      subscriptionStartAt && week.published_at
        ? new Date(week.published_at) >= new Date(subscriptionStartAt)
        : false;
    return isPaid ? isLatestWeek || isAfterSub : week.week_id === freeOpenWeekId;
  }
```

---

*생성 시점 워크스페이스 기준 줄 번호.*
