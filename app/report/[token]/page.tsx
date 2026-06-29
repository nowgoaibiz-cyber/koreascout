import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowRight, ImageOff } from "lucide-react";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { Logo } from "@/components/Logo";
import type { ScoutFinalReportsRow } from "@/types/database";

type ClientOrderRow = {
  id: string;
  buyer_name: string;
  package_tier: string;
  platform: string;
};

type ShareTokenRow = {
  token: string;
  expires_at: string;
  order_id: string;
  client_orders: ClientOrderRow | ClientOrderRow[] | null;
};

const PACKAGE_LABELS: Record<string, string> = {
  starter: "Starter",
  pro: "Pro",
  elite: "Elite",
};

function formatExpiry(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function loadShareData(token: string) {
  const supabase = createServiceRoleClient();
  const now = new Date().toISOString();

  const { data: tokenRow, error: tokenError } = await supabase
    .from("share_tokens")
    .select(
      `
      token,
      expires_at,
      order_id,
      client_orders (
        id,
        buyer_name,
        package_tier,
        platform
      )
    `
    )
    .eq("token", token)
    .eq("is_active", true)
    .gt("expires_at", now)
    .maybeSingle();

  if (tokenError || !tokenRow) return null;

  const row = tokenRow as ShareTokenRow;
  const order = Array.isArray(row.client_orders)
    ? row.client_orders[0] ?? null
    : row.client_orders;
  if (!order) return null;

  const { data: orderProducts } = await supabase
    .from("order_products")
    .select("report_id")
    .eq("order_id", order.id);

  const reportIds = (orderProducts ?? []).map((op) => op.report_id as string);
  if (reportIds.length === 0) return null;

  const { data: reports } = await supabase
    .from("scout_final_reports")
    .select(
      "id, product_name, translated_name, image_url, category, viability_reason, market_viability"
    )
    .in("id", reportIds);

  const reportMap = new Map(
    (reports ?? []).map((r) => [r.id as string, r as ScoutFinalReportsRow])
  );
  const orderedReports = reportIds
    .map((id) => reportMap.get(id))
    .filter((r): r is ScoutFinalReportsRow => r != null);

  return {
    expiresAt: row.expires_at,
    order,
    reports: orderedReports,
  };
}

export default async function SharedReportPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await loadShareData(token);

  if (!data) {
    redirect(`/report/${token}/expired`);
  }

  const { order, reports, expiresAt } = data;
  const packageTier = order.package_tier.toLowerCase();

  if (packageTier === "starter" && reports.length >= 1) {
    redirect(`/report/${token}/${reports[0].id}`);
  }

  const packageLabel = PACKAGE_LABELS[packageTier] ?? order.package_tier;

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <header className="px-6 sm:px-8 pt-8 pb-4">
        <Link href="https://koreascout.com" aria-label="KoreaScout home">
          <Logo className="h-8 w-auto" />
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-6 pb-20">
        <p className="text-xs font-bold text-[#16A34A] uppercase tracking-widest mb-2">
          {packageLabel} Package
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1A1916]">
          Your KoreaScout Reports
        </h1>
        <p className="text-lg text-[#6B6860] mt-2">
          {reports.length} product{reports.length !== 1 ? "s" : ""} included
        </p>
        <p className="text-sm text-[#9E9C98] mt-1">
          Link expires {formatExpiry(expiresAt)}
        </p>

        <ul className="space-y-6 mt-10">
          {reports.map((p) => {
            const categoryTags = (p.category ?? "")
              .split(/[>/]/)
              .map((s: string) => s.trim())
              .filter(Boolean);

            return (
              <li key={p.id}>
                <Link
                  href={`/report/${token}/${p.id}`}
                  className="group relative flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] hover:border-[#16A34A]/40 hover:shadow-lg transition-all"
                >
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

                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <h2 className="text-xl font-bold text-[#1A1916]">
                      {p.translated_name || p.product_name}
                    </h2>
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
                      Trend Insight
                    </span>
                    <p className="text-[#3D3B36] leading-relaxed line-clamp-2">
                      {p.viability_reason}
                    </p>
                  </div>

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
      </div>
    </div>
  );
}
