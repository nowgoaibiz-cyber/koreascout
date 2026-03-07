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
    .order("market_viability", { ascending: false });

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
                    className="group relative flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#16A34A]/40 hover:shadow-lg transition-all"
                  >
                    <FavoriteButton
                      reportId={p.id}
                      weekId={weekId}
                      isFavorited={favoriteReportIds.has(p.id)}
                    />
                    {/* Zone 1: The Visual */}
                    <div className="relative h-32 w-32 md:h-40 md:w-40 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
                      {p.image_url ? (
                        <Image
                          src={p.image_url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 128px, 160px"
                        />
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 gap-1">
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
                              className="bg-gray-50 border border-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded-md font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-[#16A34A] tracking-wider uppercase mb-1 block mt-3">
                        ⚡ Trend Insight
                      </span>
                      <p className="text-gray-700 leading-relaxed line-clamp-2">
                        {p.viability_reason}
                      </p>
                    </div>

                    {/* Zone 3: Metrics & Action */}
                    <div className="flex flex-col items-end justify-center shrink-0 gap-3">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
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
