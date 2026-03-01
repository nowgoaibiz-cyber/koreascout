import { createClient } from "@/lib/supabase/server";
import { getAuthTier } from "@/lib/auth-server";
import Link from "next/link";

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
  const { tier } = await getAuthTier();
  const isPaid = tier === "standard" || tier === "alpha";

  const { data: weeks, error } = await supabase
    .from("weeks")
    .select("week_id, week_label, start_date, end_date, published_at, product_count, summary")
    .eq("status", "published")
    .order("start_date", { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-[#030303] text-white pt-[72px] px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-red-400">Failed to load weeks.</p>
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium mt-4 inline-block">← Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-[72px] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-white mb-2">Weekly Reports</h1>
        <p className="text-white/60 mb-8">Week-by-week product intelligence. Open a week to see products.</p>

        {!weeks?.length ? (
          <p className="text-white/50">No reports published yet. Check back soon.</p>
        ) : (
          <ul className="space-y-4">
            {weeks.map((week) => {
              const availableForFree = isWeekAvailableForFree(week.published_at);
              const lockedForFree = !isPaid && !availableForFree;
              const availableDate = week.published_at ? formatAvailableDate(week.published_at) : null;

              return (
                <li key={week.week_id}>
                  <div
                    className={`rounded-xl border p-5 transition-colors ${
                      lockedForFree
                        ? "border-white/10 bg-white/[0.02]"
                        : "border-white/10 bg-[var(--bg-card)] hover:border-white/20"
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-white">
                          {week.week_label}
                        </span>
                        {lockedForFree && (
                          <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                            🔒 Available {availableDate}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/50">
                        {week.product_count} product{week.product_count !== 1 ? "s" : ""}
                        {availableForFree && !isPaid && " · Free access"}
                        {availableForFree && isPaid && " · Just released"}
                        {lockedForFree && availableDate && ` · Unlocks ${availableDate}`}
                      </p>
                      {week.summary && (
                        <p className="text-sm text-white/70 mt-1">{week.summary}</p>
                      )}
                    </div>
                    {lockedForFree ? (
                      <p className="mt-3 text-sm text-white/40">Open this week after {availableDate}.</p>
                    ) : (
                      <Link
                        href={`/weekly/${week.week_id}`}
                        className="mt-4 inline-block text-sm font-medium text-indigo-400 hover:text-indigo-300"
                      >
                        View products →
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <Link href="/" className="mt-8 inline-block text-sm font-medium text-white/60 hover:text-white">← Back to home</Link>
      </div>
    </div>
  );
}
