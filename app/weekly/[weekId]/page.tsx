import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

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
      <div className="min-h-screen bg-[#F8F7F4] pt-[72px] px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-[#FEE2E2] border border-[#FECACA] rounded-xl p-6 text-[#DC2626]">Failed to load products.</div>
          <Link href="/weekly" className="text-[#16A34A] hover:text-[#15803D] text-sm font-medium mt-4 inline-block">← Back to weekly</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] pt-[72px]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/weekly" className="text-sm text-[#9E9C98] hover:text-[#1A1916] transition-colors flex items-center gap-1 mb-6 inline-block"><ChevronLeft className="w-4 h-4" /> Weekly Reports</Link>
        <h1 className="text-2xl font-bold text-[#1A1916] mb-2">{week.week_label}</h1>
        {week.summary && <p className="text-[#6B6860] text-sm mb-6">{week.summary}</p>}
        <p className="text-sm text-[#6B6860] mb-8">
          {products?.length ?? 0} product{products?.length !== 1 ? "s" : ""} in this week
        </p>

        {!products?.length ? (
          <p className="text-[#9E9C98]">No products in this week.</p>
        ) : (
          <ul className="space-y-4">
            {products.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/weekly/${weekId}/${p.id}`}
                  className="flex gap-4 rounded-2xl border border-[#E8E6E1] bg-white p-5 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] transition-colors hover:border-[#BBF7D0]"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#F8F7F4]">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-[#9E9C98] text-xs">No image</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold text-[#1A1916]">{p.translated_name || p.product_name}</span>
                      {p.is_teaser && (
                        <span className="rounded bg-[#16A34A]/20 px-2 py-0.5 text-xs font-medium text-[#16A34A]">
                          🆓 FREE THIS WEEK
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#6B6860] mt-0.5">{p.category}</p>
                    <p className="text-sm text-[#3D3B36] mt-1 line-clamp-2">{p.viability_reason}</p>
                    <p className="text-xs text-[#9E9C98] uppercase tracking-wider mt-2">Market score: {p.market_viability}</p>
                  </div>
                  <span className="self-center text-[#16A34A]">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Link href="/weekly" className="mt-8 inline-block text-sm font-medium text-[#9E9C98] hover:text-[#1A1916] transition-colors">← Back to weekly</Link>
      </div>
    </div>
  );
}
