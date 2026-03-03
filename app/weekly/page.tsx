import { createClient } from "@/lib/supabase/server";
import { getAuthTier } from "@/lib/auth-server";
import Link from "next/link";
import { redirect } from "next/navigation";

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
      <div className="min-h-screen bg-[#F8F7F4] pt-20 px-4 py-12">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[#DC2626]">Failed to load weeks.</p>
          <Link href="/" className="text-[#16A34A] hover:text-[#15803D] text-sm font-medium mt-4 inline-block">← Back to home</Link>
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

  return (
    <div className="min-h-screen bg-[#F8F7F4] pt-20">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
        <h1 className="text-3xl font-bold text-[#1A1916] mb-3">Weekly Reports</h1>
        <p className="text-base text-[#6B6860] mb-10">Week-by-week product intelligence. Open a week to see products.</p>

        {!weeks?.length ? (
          <p className="text-[#9E9C98]">No reports published yet. Check back soon.</p>
        ) : (
          <ul className="space-y-4">
            {weeks.map((week) => {
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
                <li key={week.week_id}>
                  {isLocked ? (
                    <div className="rounded-2xl border border-[#E8E6E1] bg-[#F8F7F4] p-6 opacity-60 cursor-not-allowed">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-lg font-semibold text-[#1A1916]">
                          {week.week_label}
                        </span>
                        <span className="text-xs text-[#9E9C98] flex items-center gap-1">
                          🔒
                          {!isPaid && week.published_at
                            ? `Available ${formatAvailableDate(week.published_at)}`
                            : "Archive"}
                        </span>
                      </div>
                      <p className="text-sm text-[#6B6860] mt-1">
                        {week.product_count} product{week.product_count !== 1 ? "s" : ""}
                      </p>
                      {!isPaid && (
                        <p className="mt-3 text-xs text-[#9E9C98]">
                          Upgrade to Standard to access immediately →
                        </p>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={`/weekly/${week.week_id}`}
                      className="rounded-2xl border p-6 transition-colors border-[#E8E6E1] bg-white shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] hover:border-[#BBF7D0] cursor-pointer hover:shadow-[0_4px_16px_-4px_rgb(26_25_22/0.12)] transition-shadow duration-200 block"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-lg font-semibold text-[#1A1916]">
                            {week.week_label}
                          </span>
                        </div>
                        <p className="text-sm text-[#6B6860]">
                          {week.product_count} product{week.product_count !== 1 ? "s" : ""}
                          {!isPaid && " · Free access"}
                          {isPaid && " · Just released"}
                        </p>
                        {week.summary && (
                          <p className="text-sm text-[#3D3B36] mt-1">{week.summary}</p>
                        )}
                      </div>
                      <span className="mt-4 inline-block text-[#16A34A] text-sm font-medium">
                        View products →
                      </span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <Link href="/" className="mt-8 inline-block text-sm font-medium text-[#9E9C98] hover:text-[#1A1916] transition-colors">← Back to home</Link>
      </div>
    </div>
  );
}
