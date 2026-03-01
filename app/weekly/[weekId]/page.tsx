import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function ProductListPage({
  params,
}: {
  params: Promise<{ weekId: string }>;
}) {
  const { weekId } = await params;
  const supabase = await createClient();

  const { data: week, error: weekError } = await supabase
    .from("weeks")
    .select("week_id, week_label, product_count, summary")
    .eq("week_id", weekId)
    .eq("status", "published")
    .single();

  if (weekError || !week) notFound();

  // RLS filters by tier and free_list_at; we get only rows the user is allowed to see.
  const { data: products, error: productsError } = await supabase
    .from("scout_final_reports")
    .select("id, product_name, translated_name, image_url, category, viability_reason, market_viability, is_teaser")
    .eq("week_id", weekId)
    .eq("status", "published")
    .order("market_viability", { ascending: false });

  if (productsError) {
    return (
      <div className="min-h-screen bg-[#030303] text-white pt-[72px] px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-red-400">Failed to load products.</p>
          <Link href="/weekly" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium mt-4 inline-block">← Back to weekly</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-[72px] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/weekly" className="text-sm font-medium text-white/60 hover:text-white mb-6 inline-block">← Weekly Reports</Link>
        <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-white mb-2">{week.week_label}</h1>
        {week.summary && <p className="text-white/70 mb-6">{week.summary}</p>}
        <p className="text-white/50 text-sm mb-8">
          {products?.length ?? 0} product{products?.length !== 1 ? "s" : ""} in this week
        </p>

        {!products?.length ? (
          <p className="text-white/50">No products in this week.</p>
        ) : (
          <ul className="space-y-4">
            {products.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/weekly/${weekId}/${p.id}`}
                  className="flex gap-4 rounded-xl border border-white/10 bg-[var(--bg-card)] p-4 transition-colors hover:border-white/20"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white/5">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-white/30 text-xs">No image</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-white">{p.translated_name || p.product_name}</span>
                      {p.is_teaser && (
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                          🆓 FREE THIS WEEK
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/60 mt-0.5">{p.category}</p>
                    <p className="text-sm text-white/70 mt-1 line-clamp-2">{p.viability_reason}</p>
                    <p className="text-xs text-white/40 mt-2">Market score: {p.market_viability}</p>
                  </div>
                  <span className="self-center text-white/40">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Link href="/weekly" className="mt-8 inline-block text-sm font-medium text-white/60 hover:text-white">← Back to weekly</Link>
      </div>
    </div>
  );
}
