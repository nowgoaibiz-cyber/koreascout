import React from "react";
import { createClient } from "@/lib/supabase/server";
import { getAuthTier } from "@/lib/auth-server";
import Link from "next/link";
import { redirect } from "next/navigation";
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

function isWeekAvailableForFree(publishedAt: string | null): boolean {
  if (!publishedAt) return false;
  const freeAt = new Date(publishedAt);
  freeAt.setDate(freeAt.getDate() + FREE_DELAY_DAYS);
  return new Date() >= freeAt;
}

type WeekRow = {
  week_id: string;
  week_label: string | null;
  start_date: string | null;
  end_date: string | null;
  published_at: string | null;
  product_count: number | null;
  summary: string | null;
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
    .select("week_id, week_label, start_date, end_date, published_at, product_count, summary")
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

  return (
    <div className="min-h-screen bg-[#F8F7F4] pt-8">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 pt-6 pb-10">
        <h1 className="text-4xl font-bold text-[#1A1916] mb-2 tracking-tight">
          Weekly Reports
        </h1>
        <p className="text-xl text-[#6B6860] mb-6 leading-relaxed">
          Week-by-week product intelligence. Open a week to see products.
        </p>

        {!weeks?.length ? (
          <p className="text-lg text-[#9E9C98]">No reports published yet. Check back soon.</p>
        ) : (
          <>
            <div className="rounded-2xl border border-[#BBF7D0] bg-white shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] py-12 sm:py-14 px-8 sm:px-12 mb-10 flex items-center justify-center min-h-[140px] border-l-4 border-l-[#16A34A]">
              <div className="text-center w-full">
                <p className="text-lg font-semibold text-[#9E9C98] uppercase tracking-wider mb-1.5">
                  Breaking News
                </p>
                <p className="text-xl font-bold text-[#16A34A]">
                  📰 Trend News — Coming soon
                </p>
                <p className="text-sm text-[#6B6860] mt-1">
                  Trending Korean product news, weekly highlights
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {monthGroups.map((group) => (
                <MonthAccordion
                  key={group.monthKey}
                  monthLabel={group.monthLabel}
                  monthKey={group.monthKey}
                  currentMonthKey={currentMonthKey}
                >
                  {group.weeks.map((week) => {
                    const isLatestWeek = latest3WeekIds.includes(week.week_id);
                    const isAfterSub =
                      subscriptionStartAt && week.published_at
                        ? new Date(week.published_at) >= new Date(subscriptionStartAt)
                        : false;
                    const canAccess = isPaid
                      ? isLatestWeek || isAfterSub
                      : week.week_id === freeOpenWeekId;
                    const isLocked = !canAccess;

                    return (
                      <div key={week.week_id}>
                        {isLocked ? (
                          <div className="rounded-xl border border-[#E8E6E1] bg-white p-6 opacity-60 cursor-not-allowed">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-lg font-semibold text-[#1A1916]">
                                {week.week_label}
                              </span>
                              <span className="text-sm text-[#9E9C98] flex items-center gap-1">
                                🔒{" "}
                                {!isPaid && week.published_at
                                  ? `Available ${formatAvailableDate(week.published_at)}`
                                  : "Archive"}
                              </span>
                            </div>
                            <p className="text-base text-[#6B6860] mt-1.5">
                              {week.product_count} product{week.product_count !== 1 ? "s" : ""}
                            </p>
                            {!isPaid && (
                              <p className="mt-3 text-sm text-[#9E9C98]">
                                Upgrade to Standard to access immediately →
                              </p>
                            )}
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
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-lg font-semibold text-[#1A1916]">
                                {week.week_label}
                              </span>
                              {isPaid && (
                                <span className="text-sm text-[#16A34A] font-medium">
                                  Just released
                                </span>
                              )}
                              {!isPaid && (
                                <span className="text-sm text-[#16A34A] font-medium">
                                  Free access
                                </span>
                              )}
                            </div>
                            <p className="text-base text-[#6B6860] mt-1.5">
                              {week.product_count} product{week.product_count !== 1 ? "s" : ""}
                            </p>
                            {week.summary && (
                              <p className="text-base text-[#3D3B36] mt-2 line-clamp-1">
                                {week.summary}
                              </p>
                            )}
                            <span className="mt-4 inline-block text-[#16A34A] text-base font-medium">
                              View products →
                            </span>
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
