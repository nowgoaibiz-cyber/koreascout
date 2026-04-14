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
