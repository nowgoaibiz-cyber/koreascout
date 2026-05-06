# KoreaScout Codebase Full Audit

---

## SECTION 1: lib/auth-server.ts — Full File

```ts
import { createClient } from "@/lib/supabase/server";
import type { ScoutFinalReportsRow, Tier } from "@/types/database";

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

export function maskReportByTier(
  report: ScoutFinalReportsRow,
  tier: "free" | "standard" | "alpha"
): ScoutFinalReportsRow {
  if (tier === "alpha") return report;

  const masked = { ...report };

  // Fields nulled for BOTH free and standard
  const nullForFreeAndStandard = [
    "export_status",
    "status_reason",
    "actual_weight_g",
    "volumetric_weight_g",
    "billable_weight_g",
    "dimensions_cm",
    "shipping_tier",
    "required_certificates",
    "shipping_notes",
    "hazmat_status",
    "key_risk_ingredient",
    "composition_info",
    "spec_summary",
    "hazmat_summary",
    "sourcing_tip",
    "hs_code",
    "hs_description",
    "verified_cost_usd",
    "verified_cost_note",
    "verified_at",
    "moq",
    "lead_time",
    "can_oem",
    "m_name",
    "translated_name",
    "corporate_scale",
    "contact_email",
    "contact_phone",
    "m_homepage",
    "naver_link",
    "wholesale_link",
    "global_site_url",
    "b2b_inquiry_url",
    "sample_policy",
    "export_cert_note",
    "viral_video_url",
    "video_url",
    "ai_detail_page_links",
    "marketing_assets_url",
    "ai_image_url",
  ] as const;

  // Additional fields nulled for FREE only (not standard)
  const nullForFreeOnly = [
    "profit_multiplier",
    "estimated_cost_usd",
    "global_prices",
    "search_volume",
    "mom_growth",
    "wow_rate",
    "top_selling_point",
    "common_pain_point",
    "best_platform",
    "gap_index",
    "gap_status",
    "buzz_summary",
    "rising_keywords",
    "seo_keywords",
    "viral_hashtags",
    "trend_entry_strategy",
    "opportunity_reasoning",
    "kr_local_score",
    "global_trend_score",
    "kr_evidence",
    "global_evidence",
    "kr_source_used",
  ] as const;

  for (const key of nullForFreeAndStandard) {
    (masked as Record<string, unknown>)[key] = null;
  }

  if (tier === "free") {
    for (const key of nullForFreeOnly) {
      (masked as Record<string, unknown>)[key] = null;
    }
  }

  return masked;
}
```

---

## SECTION 2: app/weekly/page.tsx — Full File

```tsx
import React from "react";
import { createClient } from "@/lib/supabase/server";
import { getAuthTier } from "@/lib/auth-server";
import Link from "next/link";
import { redirect } from "next/navigation";
import Script from "next/script";
import { ChevronLeft, ChevronRight, FileText, Lock } from "lucide-react";
import { MonthAccordion } from "./MonthAccordion";

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

  const unlockedWeeks = (weeks ?? []).filter(canAccessWeek);
  const featuredWeek =
    unlockedWeeks.sort(
      (a, b) =>
        new Date(b.published_at ?? 0).getTime() -
        new Date(a.published_at ?? 0).getTime()
    )[0] ?? null;

  // Only remove the featured week from the vault when user is free tier. Paid users see all accessible weeks.
  const weeksForVault =
    tier === "free" && featuredWeek
      ? (weeks ?? []).filter((w) => w.week_id !== featuredWeek.week_id)
      : weeks ?? [];

  const monthGroupsForVault: MonthGroup[] = [];
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
      {/* 1. DARK HERO — section label + tier badge only */}
      <section className="bg-[#1A1916] pt-24 pb-6 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm font-bold tracking-[0.3em] uppercase text-[#16A34A]">
              Weekly Intelligence
            </p>
            <span
              className={`inline-flex items-center px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase w-fit ${tierBadgeClass}`}
            >
              {tierLabel}
            </span>
          </div>
        </div>
      </section>

      {/* 2. TREND NEWS — Massive rolling hero banner */}
      <section className="bg-[#1A1916] px-6 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden min-h-[320px] md:min-h-[400px] border border-[#BBF7D0]/20 flex items-end group cursor-pointer">
            {/* Placeholder background (replace with dynamic image later) */}
            <div
              className="absolute inset-0 bg-[#0A0908] bg-cover bg-center opacity-50 group-hover:opacity-60 transition-opacity"
              style={{
                backgroundImage: "url(https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1200)",
              }}
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1916] via-[#1A1916]/80 to-transparent" />
            {/* Carousel nav — left */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur border border-white/10 text-white/90 hover:bg-black/50 transition-colors">
              <ChevronLeft className="w-5 h-5" strokeWidth={2.5} aria-hidden />
            </div>
            {/* Carousel nav — right */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur border border-white/10 text-white/90 hover:bg-black/50 transition-colors">
              <ChevronRight className="w-5 h-5" strokeWidth={2.5} aria-hidden />
            </div>
            {/* Pagination dots — bottom center */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" aria-current="true" />
              <span className="w-2 h-2 rounded-full bg-white/40" />
              <span className="w-2 h-2 rounded-full bg-white/40" />
            </div>
            {/* Content */}
            <div className="relative z-10 p-6 md:p-8 w-full">
              <span className="inline-block px-3 py-1 bg-[#16A34A] text-white text-xs font-bold uppercase tracking-wider rounded-sm mb-3">
                HOT ISSUE
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight group-hover:text-[#BBF7D0] transition-colors">
                Coming Soon
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 pt-12 pb-10 bg-[#F8F7F4]">
        {!weeks?.length ? (
          <p className="text-lg text-[#9E9C98]">No reports published yet. Check back soon.</p>
        ) : (
          <>
            {/* 3. FEATURED REPORT (Unlocked Intel) — only for free tier; paid users go straight to The Vault */}
            {tier === "free" && featuredWeek && (
              <div className="mb-12">
                <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#16A34A] mb-3">
                  UNLOCKED INTEL
                </p>
                <Link
                  href={`/weekly/${featuredWeek.week_id}`}
                  className="block rounded-2xl border-2 border-[#16A34A]/30 bg-[#16A34A]/10 p-8 sm:p-10
                    shadow-[0_4px_24px_-4px_rgb(22_163_74/0.2)]
                    hover:border-[#16A34A] hover:shadow-[0_8px_32px_-4px_rgb(22_163_74/0.25)]
                    transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-[#16A34A]/15 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#16A34A]" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black tracking-[0.25em] uppercase text-[#16A34A] mb-2">
                        Featured Report
                      </p>
                      <h2 className="text-2xl sm:text-3xl font-black text-[#1A1916] tracking-tight mb-1">
                        {featuredWeek.week_label}
                      </h2>
                      {formatPublishedDate(featuredWeek.published_at) && (
                        <p className="text-sm text-[#9E9C98] mb-4">
                          Published: {formatPublishedDate(featuredWeek.published_at)}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-5 py-2.5 text-sm font-bold text-white shadow-[0_2px_8px_-2px_rgb(22_163_74/0.4)] hover:bg-[#15803D] transition-colors">
                        Open report
                        <span aria-hidden>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* 4. THE VAULT (Classified Folders) */}
            <div className="mt-16 mb-6">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#9E9C98] mb-2">
                The Vault
              </p>
              <h2 className="text-xl font-black text-[#1A1916] tracking-tight uppercase">
                Archive by month
              </h2>
            </div>
            <div className="space-y-0">
              {monthGroupsForVault.map((group, index) => (
                <MonthAccordion
                  key={group.monthKey}
                  monthLabel={group.monthLabel}
                  monthKey={group.monthKey}
                  currentMonthKey={currentMonthKey}
                  defaultOpen={index === 0}
                >
                  {group.weeks.map((week, weekIndex) => {
                    const canAccess = canAccessWeek(week);
                    const isLocked = !canAccess;
                    const actualCount = week.scout_final_reports?.[0]?.count ?? 0;
                    const isFirstItemInVault = index === 0 && weekIndex === 0;
                    const withinThreeDays = isWithinLastNDays(week.published_at, 3);
                    const showJustReleased = isPaid && (isFirstItemInVault || withinThreeDays);

                    return (
                      <div key={week.week_id}>
                        {isLocked ? (
                          <div className="relative rounded-xl border border-[#E8E6E1] bg-white overflow-hidden">
                            <div className="p-6 opacity-90">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-lg font-semibold text-[#1A1916]">
                                  {week.week_label}
                                </span>
                                <span className="text-sm text-[#9E9C98]">
                                  {!isPaid && week.published_at
                                    ? `Available ${formatAvailableDate(week.published_at)}`
                                    : "Archive"}
                                </span>
                              </div>
                              <p className="text-base text-[#6B6860] mt-1.5">
                                {actualCount} product{actualCount !== 1 ? "s" : ""}
                              </p>
                            </div>
                            {/* Frosted overlay + CTA */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[6px] rounded-xl">
                              <Lock className="w-10 h-10 text-[#6B6860] mb-3" strokeWidth={2} aria-hidden />
                              <p className="text-sm font-bold text-[#1A1916] uppercase tracking-wider mb-2">
                                Classified
                              </p>
                              {tier === "free" ? (
                                <Link
                                  href="/pricing"
                                  className="inline-flex items-center rounded-lg bg-[#1A1916] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#16A34A] transition-colors"
                                >
                                  UPGRADE TO UNLOCK
                                </Link>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  className="inline-flex items-center rounded-lg bg-[#F8F7F4] text-[#9E9C98] border border-[#E8E6E1] cursor-not-allowed px-5 py-2.5 text-sm font-bold"
                                >
                                  ARCHIVE LOCKED
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <Link
                            href={`/weekly/${week.week_id}`}
                            className="rounded-xl border border-[#E8E6E1] bg-white p-6 block
                              shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]
                              hover:border-[#BBF7D0]
                              hover:shadow-[0_4px_16px_-4px_rgb(26_25_22/0.12)]
                              transition-all duration-200"
                          >
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-lg font-semibold text-[#1A1916]">
                                    {week.week_label}
                                  </span>
                                  {showJustReleased && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
                                      Just released
                                    </span>
                                  )}
                                  {!isPaid && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
                                      Free access
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-[#6B6860] mt-1.5">
                                  {formatPublishedDate(week.published_at) && (
                                    <>Published: {formatPublishedDate(week.published_at)}</>
                                  )}
                                  {formatPublishedDate(week.published_at) && " • "}
                                  {actualCount} product{actualCount !== 1 ? "s" : ""}
                                </p>
                                {week.summary && (
                                  <p className="text-base text-[#3D3B36] mt-2 line-clamp-1">
                                    {week.summary}
                                  </p>
                                )}
                              </div>
                              <span className="shrink-0 bg-[#16A34A] text-white px-4 py-2 rounded-md font-medium text-sm inline-flex items-center hover:bg-[#15803D] transition-colors">
                                Open report →
                              </span>
                            </div>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </MonthAccordion>
              ))}
            </div>
          </>
        )}

        <Link href="/" className="mt-10 inline-block text-base font-medium text-[#9E9C98] hover:text-[#1A1916] transition-colors">← Back to home</Link>
      </div>
    </div>
  );
}
```

---

## SECTION 3: app/weekly/[weekId]/page.tsx — Full File

```tsx
import { createClient } from "@/lib/supabase/server";
import { getAuthTier } from "@/lib/auth-server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ImageOff, ArrowRight } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";

export default async function ProductListPage({
  params,
}: {
  params: Promise<{ weekId: string }>;
}) {
  const { weekId } = await params;
  const supabase = await createClient();
  const { userId, tier, subscriptionStartAt } = await getAuthTier();

  if (!userId) redirect("/login");

  const isPaid = tier === "standard" || tier === "alpha";

  const { data: week, error: weekError } = await supabase
    .from("weeks")
    .select("week_id, week_label, product_count, summary, published_at")
    .eq("week_id", weekId)
    .eq("status", "published")
    .single();

  if (weekError || !week) notFound();

  const { data: latest3Weeks } = await supabase
    .from("weeks")
    .select("week_id")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);
  const latest3WeekIds = (latest3Weeks ?? []).map((w) => w.week_id);
  const isLatestWeek = latest3WeekIds.includes(weekId);

  let canAccess = false;
  if (isPaid) {
    const isAfterSub =
      subscriptionStartAt && week.published_at
        ? new Date(week.published_at) >= new Date(subscriptionStartAt)
        : false;
    canAccess = isLatestWeek || isAfterSub;
  } else {
    const { data: allWeeks } = await supabase
      .from("weeks")
      .select("week_id, published_at")
      .eq("status", "published");
    const freeOpenWeekId =
      allWeeks
        ?.filter((w) => {
          if (!w.published_at) return false;
          const freeAt = new Date(w.published_at);
          freeAt.setDate(freeAt.getDate() + 14);
          return new Date() >= freeAt;
        })
        .sort(
          (a, b) =>
            new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime()
        )[0]?.week_id ?? null;
    canAccess = weekId === freeOpenWeekId;
  }

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] pt-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
          <Link
            href="/weekly"
            className="text-sm text-[#9E9C98] hover:text-[#1A1916] transition-colors flex items-center gap-1 mb-6"
          >
            ← Weekly Reports
          </Link>
          <h1 className="text-2xl font-bold text-[#1A1916] mb-2">
            {week.week_label}
          </h1>
          <div className="rounded-2xl border border-[#E8E6E1] bg-white p-10 text-center mt-8">
            <div className="text-5xl mb-4">🔒</div>
            <p className="text-lg font-semibold text-[#1A1916] mb-2">
              {isPaid
                ? "This week is in your archive."
                : "Upgrade to access this week."}
            </p>
            <p className="text-sm text-[#6B6860] leading-relaxed mb-6 max-w-sm mx-auto">
              {isPaid
                ? "Your access covers weeks published after you subscribed, plus the 3 most recent weeks."
                : "Subscribe to Standard or Alpha to unlock this week immediately."}
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#15803D] shadow-[0_2px_8px_0_rgb(22_163_74/0.3)]"
            >
              {isPaid ? "View Current Plan →" : "See Plans →"}
            </Link>
            <p className="mt-3 text-xs text-[#9E9C98]">
              Cancel anytime · New weeks unlock every Monday.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // RLS filters by tier and free_list_at; we get only rows the user is allowed to see.
  const { data: products, error: productsError } = await supabase
    .from("scout_final_reports")
    .select("id, product_name, translated_name, image_url, category, viability_reason, market_viability, is_teaser")
    .eq("week_id", weekId)
    .eq("status", "published")
    .order("market_viability", { ascending: false })
    .order("naver_product_name", { ascending: true });

  const productIds = (products ?? []).map((p) => p.id);
  const { data: favorites } = await supabase
    .from("user_favorites")
    .select("report_id")
    .eq("user_id", userId)
    .in("report_id", productIds);
  const favoriteReportIds = new Set((favorites ?? []).map((f) => f.report_id));

  if (productsError) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] pt-20 px-4 py-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-[#FEE2E2] border border-[#FECACA] rounded-xl p-6 text-[#DC2626]">Failed to load products.</div>
          <Link href="/weekly" className="text-[#16A34A] hover:text-[#15803D] text-sm font-medium mt-4 inline-block">← Back to weekly</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] pt-10">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
        <Link href="/weekly" className="text-base text-[#9E9C98] hover:text-[#1A1916] transition-colors flex items-center gap-1 mb-6 inline-block"><ChevronLeft className="w-4 h-4" /> Weekly Reports</Link>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-[#1A1916]">
          {week.week_label}
        </h1>
        <p className="text-base text-[#6B6860] mt-2">
          {products?.length ?? 0} product{products?.length !== 1 ? "s" : ""} in this week
        </p>
        {week.summary && <p className="text-[#6B6860] text-base mt-4">{week.summary}</p>}

        {!products?.length ? (
          <p className="text-[#9E9C98]">No products in this week.</p>
        ) : (
          <ul className="space-y-6 mt-10">
            {products.map((p) => {
              const categoryTags = (p.category ?? "")
                .split(/[>/]/)
                .map((s: string) => s.trim())
                .filter(Boolean);
              return (
                <li key={p.id}>
                  <Link
                    href={`/weekly/${weekId}/${p.id}`}
                    className="group relative flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-[#E8E6E1] hover:border-[#16A34A]/40 hover:shadow-lg transition-all"
                  >
                    <FavoriteButton
                      reportId={p.id}
                      weekId={weekId}
                      isFavorited={favoriteReportIds.has(p.id)}
                    />
                    {/* Zone 1: The Visual */}
                    <div className="relative h-32 w-32 md:h-40 md:w-40 shrink-0 overflow-hidden rounded-xl border border-[#E8E6E1] bg-[#F8F7F4] shadow-sm">
                      {p.image_url ? (
                        <Image
                          src={p.image_url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 128px, 160px"
                        />
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-[#9E9C98] gap-1">
                          <ImageOff className="h-8 w-8 md:h-10 md:w-10" strokeWidth={1.5} />
                          <span className="text-[10px] font-medium">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Zone 2: The Intel */}
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-[#1A1916]">
                          {p.translated_name || p.product_name}
                        </h2>
                        {p.is_teaser && (
                          <span className="rounded bg-[#16A34A]/20 px-2.5 py-1 text-xs font-medium text-[#16A34A]">
                            🆓 FREE THIS WEEK
                          </span>
                        )}
                      </div>
                      {categoryTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {categoryTags.map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="bg-[#F8F7F4] border border-[#E8E6E1] text-[#6B6860] text-[11px] px-2 py-0.5 rounded-md font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-[#16A34A] tracking-wider uppercase mb-1 block mt-3">
                        ⚡ Trend Insight
                      </span>
                      <p className="text-[#3D3B36] leading-relaxed line-clamp-2">
                        {p.viability_reason}
                      </p>
                    </div>

                    {/* Zone 3: Metrics & Action */}
                    <div className="flex flex-col items-end justify-center shrink-0 gap-3">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-medium text-[#9E9C98] uppercase tracking-wider">
                          Market Score
                        </span>
                        <span className="text-4xl font-black text-[#1A1916] tabular-nums">
                          {p.market_viability ?? "—"}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#16A34A] group-hover:gap-2 transition-all">
                        View Intel
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <Link href="/weekly" className="mt-8 inline-block text-sm font-medium text-[#9E9C98] hover:text-[#1A1916] transition-colors">← Back to weekly</Link>
      </div>
    </div>
  );
}
```

---

## SECTION 4: app/weekly/[weekId]/[id]/page.tsx — Full File

```tsx
import { createClient } from "@/lib/supabase/server";
import { getAuthTier, maskReportByTier } from "@/lib/auth-server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRICING } from "@/src/config/pricing";
import { ClientLeftNav } from "@/components/layout/ClientLeftNav";
import ProductIdentity from "@/components/ProductIdentity";
import {
  TrendSignalDashboard,
  MarketIntelligence,
  SocialProofTrendIntelligence,
  SourcingIntel,
  SupplierContact,
  EXPORT_STATUS_DISPLAY,
} from "@/components/report";
import ZombieWatermark from "@/components/ZombieWatermark";
import type { ScoutFinalReportsRow } from "@/types/database";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ weekId: string; id: string }>;
}) {
  const { weekId, id } = await params;
  const supabase = await createClient();
  const { userId, userEmail, tier, subscriptionStartAt } = await getAuthTier();

  const [
    { data: report, error },
    { data: weekReports },
    { data: week },
    { data: favoriteRow },
  ] = await Promise.all([
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
    supabase.from("weeks").select("week_label, published_at").eq("week_id", weekId).single(),
    userId
      ? supabase
          .from("user_favorites")
          .select("report_id")
          .eq("user_id", userId)
          .eq("report_id", id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const { data: freeWeek } = await supabase
    .from("weeks")
    .select("week_id, published_at")
    .eq("status", "published")
    .lt("published_at", new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
    .order("published_at", { ascending: false })
    .limit(1)
    .single();
  const { data: latest3Weeks } = await supabase
    .from("weeks")
    .select("week_id")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);
  const latest3WeekIds = (latest3Weeks ?? []).map((w) => w.week_id);
  const isFavorited = !!favoriteRow?.report_id;

  if (error || !report) notFound();

  const isTeaser = report.is_teaser === true;

  const canAccessThisWeek = (() => {
    if (tier === "free") {
      return freeWeek?.week_id === weekId;
    }
    if (tier === "standard" || tier === "alpha") {
      if (isTeaser) return true;
      const isLatestWeek = latest3WeekIds.includes(weekId);
      if (isLatestWeek) return true;
      if (!subscriptionStartAt) return false;
      const subDate = new Date(subscriptionStartAt);
      const weekDate = week?.published_at ? new Date(week.published_at) : null;
      if (!weekDate) return true;
      return weekDate >= subDate;
    }
    return false;
  })();

  if (!canAccessThisWeek) {
    const { redirect } = await import("next/navigation");
    redirect(`/weekly/${weekId}`);
  }

  const idList = (weekReports ?? []).map((r) => r.id);
  const currentIndex = idList.indexOf(id);
  const prevId = currentIndex > 0 ? idList[currentIndex - 1] : null;
  const nextId = currentIndex >= 0 && currentIndex < idList.length - 1 ? idList[currentIndex + 1] : null;
  const weekLabel = week?.week_label?.trim() || weekId;
  const canSeeAlpha = tier === "alpha" || isTeaser;
  const maskedReport = maskReportByTier(report as ScoutFinalReportsRow, tier as "free" | "standard" | "alpha");

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
      {userEmail && (
        <ZombieWatermark email={userEmail} />
      )}
      <div className="print-hide">
        <ClientLeftNav sections={sections} userEmail={userEmail} tier={tier as "free" | "standard" | "alpha"} />
      </div>
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

            <>
              <MarketIntelligence report={maskedReport} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
              <SocialProofTrendIntelligence report={maskedReport} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
            </>

            {hasLogistics && <SourcingIntel report={maskedReport} tier={tier as string} isTeaser={isTeaser} />}

            <div id="section-6" className="scroll-mt-[160px]">
              <SupplierContact report={maskedReport} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
            </div>

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

## SECTION 5: app/sample-report/page.tsx — Full File

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

## SECTION 6: data/sampleReportData.ts — Full File

```ts
/**
 * Sample report: SKIN1004 Madagascar Centella Hyalu-Cica Brightening Toner — hyper-realistic B2B data.
 * Matches ScoutFinalReportsRow. Used for public /sample-report page.
 * Full overwrite: Launch Kit (Section 6) and all identity/metrics populated.
 */
import type { ScoutFinalReportsRow } from "@/types/database";

export const sampleReportData: ScoutFinalReportsRow = {
  id: "sample-skin1004-toner-01",
  week_id: "sample-week-01",
  product_name: "SKIN1004 Madagascar Centella Hyalu-Cica Brightening Toner (210ml)",
  translated_name: "스킨1004 마다가스카르 센텔라 히알루-시카 광채 토너",
  image_url: "/images/skin1004.png",
  ai_image_url: null,
  summary:
    "KFDA-certified dual-action (Brightening & Anti-aging) toner. Features a signature 'Hyalu-Cica' formula for ultimate soothing and 'K-Glass Skin' hydration.",
  consumer_insight:
    "Centella and Hyalu-Cica positioning resonates with K-beauty hydration and barrier-care trends; brightening claim supports routine staple placement.",
  composition_info:
    "Key Ingredients: Centella Asiatica Leaf Water, Niacinamide, Hyaluronic Acid Complex, Ceramide NP.",
  spec_summary: "210ml bottle. Suitable for all skin types. Centella asiatica, hyaluronic acid, cica complex.",
  category: "Beauty > Skincare > Toner",
  viability_reason:
    "Glass Skin and centella trends are spiking globally; SKIN1004's Hyalu-Cica formula has strong KFDA credentials and viral TikTok traction.",
  market_viability: 87,
  competition_level: "Medium",
  profit_multiplier: "3.0",
  search_volume: "215,000+",
  mom_growth: "+34%",
  gap_status: "Blue Ocean",
  global_price: {
    US: "$22.50",
    UK: "£26.50",
    SEA: "$15.00",
    AU: "$18.50",
  },
  seo_keywords: [
    "centella toner",
    "brightening toner",
    "Korean skincare toner",
    "hyalu-cica toner",
    "SKIN1004 toner",
  ],
  export_status: "Green",
  hs_code: "3304.99",
  hs_description: "Beauty or make-up preparations; skin-care preparations (other).",
  sourcing_tip:
    "[마케팅 전략] Capitalize on the viral TikTok 'Glass Skin' trend. [가격/마진 전략] Retail positioning at $24. Direct B2B sourcing yields a strong 3.2x margin. [B2B 소싱 전략] Secure bulk inventory before summer when soothing toners spike 300%.",
  manufacturer_check: "Verified OEM/ODM for K-beauty skincare; SKIN1004 brand owner.",
  m_name: "Craver Corporation",
  corporate_scale: "Mid-size Enterprise",
  contact_email: "sales@skin1004korea.com",
  contact_phone: "1644-9968",
  m_homepage: "https://www.cravercorp.com/",
  naver_link: "https://smartstore.naver.com/top_beauty/products/11427850374",
  wholesale_link: "https://skin1004.com/pages/b2b-inquiry",
  video_url: null,
  competitor_analysis_pdf: null,
  viral_video_url: "https://tiktok.com/@skin1004_official",
  published_at: "2025-03-01T00:00:00Z",
  free_list_at: null,
  is_premium: true,
  is_teaser: false,
  status: "published",
  created_at: "2025-02-28T12:00:00Z",

  kr_price: "12000",
  kr_price_usd: 8.4,
  estimated_cost_usd: 6.67,
  verified_cost_usd: null,
  verified_cost_note: null,
  moq: "500 Units",
  lead_time: "14 Days",
  global_prices: {
    us: {
      price_usd: 22.5,
      price_original: "$22.50",
      platform: "Amazon US",
      url: "https://www.amazon.com/-/ko/dp/B09927S7W6",
    },
    uk: {
      price_usd: 26.5,
      price_original: "£26.50",
      platform: "Amazon UK",
      url: "https://www.amazon.co.uk/dp/B09927S7W6",
    },
    au: {
      price_usd: 18.5,
      price_original: "$18.50",
      platform: "Amazon AU",
      url: "https://www.amazon.com.au/dp/B09927S7W6",
    },
    sea: {
      price_usd: 15.0,
      price_original: "$15.00",
      platform: "Shopee SG",
      url: "https://shopee.sg/SKIN1004-Madagascar-Centella-Hyalu-Cica-Brightening-Toner-210ml-i.1241071836.56954689944",
    },
    india: {
      price_usd: 0,
      price_original: null,
      platform: null,
      url: null,
    },
  },
  platform_scores: {
    tiktok: { score: 91 },
    instagram: { score: 84 },
    youtube: { score: 76 },
  },
  wow_rate: "+34%",
  best_platform: "TikTok & Instagram for DTC; Amazon US and Shopee for volume.",
  top_selling_point:
    "Glass Skin and centella positioning drive repeat purchase; KFDA brightening + anti-aging dual claim supports premium pricing.",
  common_pain_point:
    "Ensure inventory ahead of summer peak; educate on Hyalu-Cica vs. single-ingredient centella to maximize margin.",
  viral_hashtags: ["#GlassSkinRoutine", "#CentellaAsiatica", "#KBeautyHolyGrail"],
  buzz_summary:
    "The toner that rides the Glass Skin wave. Centella + Hyalu-Cica formula with KFDA brightening and anti-aging certification.",
  rising_keywords: ["Centella Asiatica", "Korean Glass Skin", "Hyalu-Cica", "Skin1004"],
  kr_local_score: 87,
  global_trend_score: 68,
  gap_index: 19,
  opportunity_reasoning:
    "High demand in KR and surging global search volume; Blue Ocean in premium centella toners with dual KFDA claims.",
  trend_entry_strategy: null,
  new_content_volume: "3.2x WoW creator uploads in centella/glass-skin segment.",
  kr_evidence: "Top 5 in Olive Young toner category; 4.8+ star reviews.",
  global_evidence: "Amazon US, TikTok Shop UK, Shopee Premium distribution.",
  growth_evidence: "Search volume and social mentions up sharply; centella and glass skin queries leading.",
  kr_source_used: "Olive Young, Naver Shopping, Kakao.",
  growth_signal: "+34% MoM",

  hazmat_status: {
    contains_liquid: true,
    contains_powder: false,
    contains_battery: false,
    contains_aerosol: false,
  },
  dimensions_cm: "8 × 5 × 22",
  billable_weight_g: 280,
  shipping_tier: "Tier 2: 500g–2kg",
  required_certificates: "FDA Cosmetic Registration, CPNP (EU)",
  shipping_notes: "0.28 kg (280g) total package weight. Liquid; pack to prevent leakage. Tier 2 applies to single-bottle and small case.",
  key_risk_ingredient: null,
  status_reason: "Full clearance. Cosmetic registration in place for key markets.",
  actual_weight_g: 280,
  volumetric_weight_g: 280,

  marketing_assets_url: "https://koreascout.com/assets/skin1004-guide",
  ai_detail_page_links: "https://koreascout.com/ai/skin1004-sample",
  verified_at: "2025-03-01T00:00:00Z",
  sample_policy: "Available via B2B Inquiry",
  export_cert_note: "FDA Cosmetic Registration and CPNP held.",
  edit_history: null,
};
```

---

## SECTION 7: supabase/migrations/001_phase2_schema.sql — Lines 60–180

```sql
  mom_growth TEXT NOT NULL,
  gap_status TEXT NOT NULL,
  global_price JSONB,
  seo_keywords TEXT[],
  -- Sourcing & logistics
  export_status TEXT NOT NULL,
  hs_code TEXT,
  sourcing_tip TEXT,
  manufacturer_check TEXT,
  -- Manufacturer/contact (Alpha only)
  m_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  m_homepage TEXT,
  naver_link TEXT,
  -- Media (Alpha only)
  video_url TEXT,
  competitor_analysis_pdf TEXT,
  -- Access control
  published_at TIMESTAMPTZ,
  free_list_at TIMESTAMPTZ,
  is_premium BOOLEAN NOT NULL DEFAULT TRUE,
  is_teaser BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.scout_final_reports IS 'Product reports; access controlled by RLS and tier';

-- Optional: index for common filters
CREATE INDEX IF NOT EXISTS idx_scout_final_reports_week_id ON public.scout_final_reports(week_id);
CREATE INDEX IF NOT EXISTS idx_scout_final_reports_status ON public.scout_final_reports(status);
CREATE INDEX IF NOT EXISTS idx_scout_final_reports_free_list_at ON public.scout_final_reports(free_list_at) WHERE status = 'published';

-- -----------------------------------------------------------------------------
-- 4. TRIGGER: handle_new_user
-- Creates a profile row when a new user signs up (auth.users INSERT).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, tier)
  VALUES (NEW.id, NEW.email, 'free');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 5. TRIGGER: set_free_list_at
-- Sets free_list_at = published_at + 14 days on INSERT/UPDATE of published_at.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_free_list_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.published_at IS NOT NULL THEN
    NEW.free_list_at := NEW.published_at + INTERVAL '14 days';
  ELSE
    NEW.free_list_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_set_free_list_at ON public.scout_final_reports;
CREATE TRIGGER trigger_set_free_list_at
  BEFORE INSERT OR UPDATE OF published_at
  ON public.scout_final_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.set_free_list_at();

-- -----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scout_final_reports ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read and update their own row
CREATE POLICY "users_read_own_profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Weeks: only published weeks are visible
CREATE POLICY "weeks_public_read"
  ON public.weeks FOR SELECT
  USING (status = 'published');

-- Reports: tier-based row access (anon = free)
CREATE POLICY "report_access"
  ON public.scout_final_reports FOR SELECT
  USING (
    status = 'published'
    AND (
      -- Paid (Standard/Alpha): full access
      (SELECT tier FROM public.profiles WHERE id = auth.uid()) IN ('alpha', 'standard')
      -- Free (or anon when auth.uid() is null): 14-day delay + non-premium only
      OR (free_list_at IS NOT NULL AND free_list_at <= NOW() AND is_premium = FALSE)
      -- Teaser: everyone
      OR is_teaser = TRUE
    )
  );

-- -----------------------------------------------------------------------------
-- 7. SERVICE ROLE / BACKEND
-- Webhooks and admin need to write to profiles (e.g. tier updates).
```

---

## SECTION 8: types/database.ts — Lines 70–100

```ts
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
```

---

## SECTION 9: Summary Table

| File | Key Logic Found | Notes |
|------|-----------------|-------|
| `lib/auth-server.ts` | `getAuthTier` loads `profiles.tier` / `subscription_start_at`; unauthenticated → `tier: "free"`. `maskReportByTier` returns unmasked for `alpha`; nulls many fields for standard+free; extra nulls for `free` only. | Comment references RLS `report_access`; app-side masking is separate from DB RLS. |
| `app/weekly/page.tsx` | Logged-in only; `isPaid` from tier; free “open” week = latest published week whose `published_at` + 14 days ≤ now; paid access = latest 3 weeks OR week published on/after `subscriptionStartAt`; vault lock UI by tier. | Free window uses `weeks.published_at` + 14, not `scout_final_reports.free_list_at`. |
| `app/weekly/[weekId]/page.tsx` | Same paid vs free week gate as hub; product query selects `is_teaser`; comment cites RLS + `free_list_at`. | `free_list_at` not read in TS; list UI uses `p.is_teaser` for badge. |
| `app/weekly/[weekId]/[id]/page.tsx` | `isTeaser = report.is_teaser === true`; `canAccessThisWeek`: free = single `freeWeek` (strictest `published_at` < now−14d); paid allows teaser any week, else latest-3 or post-subscription; `maskReportByTier` on sections below identity; `TrendSignalDashboard` / `ProductIdentity` use unmasked `report`. | `canSeeAlpha` assigned but unused in this file. Free “archive” week query differs from hub’s “newest week past 14d” ordering logic. |
| `app/sample-report/page.tsx` | Public page; `tier = "alpha"`, `isTeaser = true` hardcoded; renders same report components with `sampleReportData`. | No auth; effective teaser flag is page constant, not DB `sampleReportData.is_teaser`. |
| `data/sampleReportData.ts` | Static `ScoutFinalReportsRow` for `/sample-report`; includes `free_list_at: null`, `is_teaser: false`, `is_premium: true`. | Object `is_teaser` is `false` while sample page forces `isTeaser = true`. |
| `supabase/migrations/001_phase2_schema.sql` (60–180) | Table columns `free_list_at`, `is_teaser`, `is_premium`; trigger sets `free_list_at` from `published_at`; RLS `report_access`: standard/alpha full rows; free path uses `free_list_at` + `is_premium = FALSE`; `is_teaser = TRUE` bypass. | RLS free branch does not mirror app’s `weeks`-based gating. |
| `types/database.ts` (70–100) | `ScoutFinalReportsRow` typings include `free_list_at`, `is_premium`, `is_teaser`, `status`, v1.3 optional fields. | Type-only; no runtime logic. |
