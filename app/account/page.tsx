import { createClient } from "@/lib/supabase/server";
import { getAuthTier } from "@/lib/auth-server";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { ManageBillingButton } from "@/components/ManageBillingButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ImageOff, Bookmark } from "lucide-react";

function tierBadgeLabel(tier: string): string {
  if (tier === "alpha") return "ALPHA ACCESS";
  if (tier === "standard") return "STANDARD ACCESS";
  return "FREE ACCESS";
}

type AccountPageProps = { searchParams: Promise<{ updated?: string }> };

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const supabase = await createClient();
  const params = await searchParams;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { tier } = await getAuthTier();

  const { count: accessibleProductCount } = await supabase
    .from("scout_final_reports")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const { data: favRows } = await supabase
    .from("user_favorites")
    .select("report_id")
    .eq("user_id", user.id);

  const reportIds = (favRows ?? []).map((r) => r.report_id);
  let picks: Array<{
    id: string;
    week_id: string;
    translated_name: string | null;
    image_url: string;
    market_viability: number | null;
    category: string | null;
    viability_reason: string | null;
  }> = [];

  if (reportIds.length > 0) {
    const { data: reports } = await supabase
      .from("scout_final_reports")
      .select("id, week_id, translated_name, image_url, market_viability, category, viability_reason")
      .in("id", reportIds)
      .eq("status", "published");
    picks = (reports ?? []).map((r) => ({
      id: r.id,
      week_id: r.week_id,
      translated_name: r.translated_name ?? null,
      image_url: r.image_url,
      market_viability: r.market_viability ?? null,
      category: r.category ?? null,
      viability_reason: r.viability_reason ?? null,
    }));
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* DARK HERO */}
      <section className="bg-[#1A1916] pt-20 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#16A34A] mb-2">
            Premium Sourcing Vault
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#F8F7F4] mb-3">
            My Account
          </h1>
          <p className="text-[#F8F7F4]/80 text-sm font-medium mb-4">{user.email}</p>
          <span className="inline-block rounded-md bg-[#16A34A]/20 px-3 py-1.5 text-xs font-bold tracking-wider text-[#16A34A] uppercase">
            {tierBadgeLabel(tier)}
          </span>
          {params?.updated === "password" && (
            <p className="mt-4 text-sm text-[#16A34A] font-medium">
              Password updated successfully.
            </p>
          )}
          <div className="flex items-center gap-3 mt-6 text-sm font-medium tracking-tight">
            <Link
              href="/account/password"
              className="text-[#F8F7F4]/80 hover:text-[#F8F7F4] transition-colors"
            >
              Change Password
            </Link>
            <span className="text-[#F8F7F4]/50 select-none" aria-hidden>|</span>
            <LogoutButton className="text-[#F8F7F4]/80 hover:text-[#F8F7F4] transition-colors font-medium" />
          </div>
        </div>
      </section>

      {/* SINGLE COLUMN: MY PICKS FIRST, THEN BILLING */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
        {/* MY PICKS (main focus) */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-[#1A1916] tracking-tight mb-1">
            My Picks
          </h2>
          <p className="text-sm text-[#6B6860] mb-6">
            Your saved products. Unbookmark from the report page or remove below.
          </p>

          {picks.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-2xl p-12 text-center flex flex-col items-center justify-center bg-gray-50/50">
              <Bookmark className="text-gray-300 w-12 h-12 mb-4" strokeWidth={1.5} />
              <p className="text-lg font-medium text-gray-900">Your vault is empty.</p>
              <p className="text-gray-500 mt-1 mb-6">
                Save products from the weekly reports to build your sourcing list.
              </p>
              <Link
                href="/weekly"
                className="inline-flex items-center justify-center rounded-xl bg-[#16A34A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#15803D] shadow-[0_2px_8px_0_rgb(22_163_74/0.3)] transition-colors"
              >
                Browse Weekly Reports →
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {picks.map((p) => {
                const categoryTags = (p.category ?? "")
                  .split(/[>/]/)
                  .map((s) => s.trim())
                  .filter(Boolean);
                return (
                  <li key={p.id}>
                    <div className="relative flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#16A34A]/40 hover:shadow-lg transition-all">
                      {/* Bookmark: absolute top-right of card */}
                      <FavoriteButton
                        reportId={p.id}
                        weekId={p.week_id}
                        isFavorited={true}
                        className="absolute top-6 right-6 fill-[#16A34A] text-[#16A34A] hover:opacity-90 disabled:opacity-50"
                        iconClassName="w-6 h-6"
                      />
                      {/* Left: Image */}
                      <div className="relative h-24 w-24 md:h-32 md:w-32 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
                        {p.image_url ? (
                          <Image
                            src={p.image_url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 96px, 128px"
                          />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 gap-1">
                            <ImageOff className="h-8 w-8" strokeWidth={1.5} />
                            <span className="text-[10px] font-medium">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Center: Title, categories, market score */}
                      <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <h3 className="text-xl font-bold text-[#1A1916]">
                          {p.translated_name || "Product"}
                        </h3>
                        {categoryTags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {categoryTags.map((tag, i) => (
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
                          {p.viability_reason || "—"}
                        </p>
                        <div className="flex flex-col mt-2">
                          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                            Market Score
                          </span>
                          <span className="text-3xl font-black text-[#1A1916] tabular-nums">
                            {p.market_viability ?? "—"}
                          </span>
                        </div>
                      </div>

                      {/* Right: View Report link (bottom-right of content flow) */}
                      <div className="flex flex-col items-end justify-end shrink-0">
                        <Link
                          href={`/weekly/${p.week_id}/${p.id}`}
                          className="text-sm font-semibold text-[#16A34A] hover:text-[#15803D]"
                        >
                          View Report →
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* SUBSCRIPTION & BILLING (tier-based) */}
        <div className="mt-16 bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
          <h2 className="text-lg font-bold text-[#1A1916] tracking-tight mb-1">
            Subscription & Billing
          </h2>
          <p className="text-sm text-[#6B6860] mb-4">
            Current plan: <span className="font-semibold text-[#1A1916]">{tierBadgeLabel(tier)}</span>
          </p>

          {tier === "free" && (
            <Link
              href="/pricing"
              className="bg-[#16A34A] text-white w-full py-2 rounded-lg text-center font-medium block hover:bg-[#15803D] transition-colors"
            >
              Upgrade to Premium
            </Link>
          )}

          {tier === "standard" && (
            <>
              <Link
                href="/pricing"
                className="bg-[#16A34A] text-white w-full py-2 rounded-lg text-center font-medium block hover:bg-[#15803D] transition-colors"
              >
                Upgrade to Alpha Access
              </Link>
              <ManageBillingButton
                accessibleProductCount={accessibleProductCount ?? 0}
                className="text-gray-500 border border-gray-200 mt-3 w-full py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              />
            </>
          )}

          {tier === "alpha" && (
            <ManageBillingButton
              accessibleProductCount={accessibleProductCount ?? 0}
              className="w-full py-2 rounded-lg border-2 border-[#1A1916] text-[#1A1916] text-sm font-semibold hover:bg-[#1A1916] hover:text-white transition-colors"
            />
          )}

          <p className="text-xs text-[#9E9C98] mt-3">
            Billing portal will be available in Phase 4.
          </p>
        </div>

        <p className="mt-8">
          <Link
            href="/"
            className="text-sm font-medium text-[#16A34A] hover:text-[#15803D]"
          >
            ← Back to home
          </Link>
        </p>
      </section>
    </div>
  );
}
