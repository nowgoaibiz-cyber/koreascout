import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Lock, Video } from "lucide-react";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { Logo } from "@/components/Logo";
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

type ClientOrderRow = {
  id: string;
  buyer_name: string;
  package_tier: string;
  platform: string;
  notes: string | null;
};

type ShareTokenRow = {
  token: string;
  expires_at: string;
  order_id: string;
  client_orders: ClientOrderRow | ClientOrderRow[] | null;
};

const DISPLAY_TIER = "alpha" as const;

const PACKAGE_LABELS: Record<string, string> = {
  starter: "Starter",
  pro: "Pro",
  elite: "Elite",
};

function watermarkEmail(buyerName: string, token: string): string {
  const slug = buyerName.trim().toLowerCase().replace(/\s+/g, ".") || "guest";
  return `${slug}.${token.slice(0, 8)}@shared.koreascout.com`;
}

function stripVideoFields(report: ScoutFinalReportsRow): ScoutFinalReportsRow {
  return {
    ...report,
    video_url: null,
    video_url_2: null,
    video_url_3: null,
  };
}

async function loadShareDetail(token: string, reportId: string) {
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
        platform,
        notes
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
  if (!reportIds.includes(reportId)) return { invalidReport: true as const };

  const { data: report, error: reportError } = await supabase
    .from("scout_final_reports")
    .select("*")
    .eq("id", reportId)
    .maybeSingle();

  if (reportError || !report) return { invalidReport: true as const };

  return {
    order,
    report: report as ScoutFinalReportsRow,
    reportIds,
    expiresAt: row.expires_at,
  };
}

export default async function SharedReportDetailPage({
  params,
}: {
  params: Promise<{ token: string; reportId: string }>;
}) {
  const { token, reportId } = await params;
  const data = await loadShareDetail(token, reportId);

  if (!data) {
    redirect(`/report/${token}/expired`);
  }

  if ("invalidReport" in data) {
    notFound();
  }

  const { order, report, reportIds, expiresAt } = data;
  const packageTier = order.package_tier.toLowerCase();
  const showSupplier = packageTier === "pro" || packageTier === "elite";
  const showVideos = packageTier === "elite";

  const supplierReport = showSupplier
    ? showVideos
      ? report
      : stripVideoFields(report)
    : null;

  const currentIndex = reportIds.indexOf(reportId);
  const prevId = currentIndex > 0 ? reportIds[currentIndex - 1] : null;
  const nextId =
    currentIndex >= 0 && currentIndex < reportIds.length - 1
      ? reportIds[currentIndex + 1]
      : null;
  const isMultiProduct = packageTier !== "starter" && reportIds.length > 1;
  const packageLabel = PACKAGE_LABELS[packageTier] ?? order.package_tier;

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <ZombieWatermark email={watermarkEmail(order.buyer_name, token)} />

      <header className="px-4 sm:px-6 pt-8 pb-4">
        <Link href="https://koreascout.com" aria-label="KoreaScout home">
          <Logo className="h-8 w-auto" />
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-2 pb-20">
        <div className="space-y-6">
          {isMultiProduct && (
            <Link
              href={`/report/${token}`}
              className="text-base font-medium text-[#6B6860] hover:text-[#1A1916] transition-colors inline-block"
            >
              ← Back to products
            </Link>
          )}

          {packageTier === "starter" && (
            <div>
              <p className="text-2xl font-bold tracking-widest text-[#16A34A] uppercase mb-4">
                {packageLabel} Package
              </p>
              <h1 className="text-6xl font-bold text-[#1A1916] mb-4">
                Hi, {order.buyer_name}! 👋
              </h1>
              <p className="text-2xl text-[#6B6860] mb-3">
                Your K-beauty intelligence report is ready — sourced directly from Korea.
              </p>
              {order.notes && (
                <p className="text-2xl text-[#6B6860] mb-3">
                  &ldquo;{order.notes}&rdquo;
                </p>
              )}
              <p className="text-xl text-[#6B6860] mb-6">
                {reportIds.length} product{reportIds.length !== 1 ? "s" : ""} · Prepared exclusively for you
              </p>
            </div>
          )}

          <ProductIdentity
            report={report}
            tier={DISPLAY_TIER}
            isTeaser={false}
            EXPORT_STATUS_DISPLAY={EXPORT_STATUS_DISPLAY}
          />

          <TrendSignalDashboard report={report} />

          <MarketIntelligence report={report} tier={DISPLAY_TIER} isTeaser={false} />
          <SocialProofTrendIntelligence report={report} tier={DISPLAY_TIER} isTeaser={false} />

          <SourcingIntel report={report} tier={DISPLAY_TIER} isTeaser={false} />

          {showSupplier && supplierReport && (
            <div id="section-6" className="scroll-mt-[160px]">
              <SupplierContact
                report={supplierReport}
                tier={DISPLAY_TIER}
                isTeaser={false}
              />
            </div>
          )}

          {showSupplier && !showVideos && (
            <div className="bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
              <p className="text-sm font-semibold text-[#9E9C98] uppercase tracking-widest mb-3">
                Creative Assets
              </p>
              <div className="flex items-start gap-3">
                <Video className="w-7 h-7 text-[#9E9C98] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xl font-semibold text-[#1A1916] mb-1">4K Field Footage</p>
                  <p className="text-base text-[#6B6860]">
                    Available in Elite Scout package only.
                    <br />
                    Upgrade to access raw footage filmed inside Korean beauty stores — ready to use as ads or social content.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!showSupplier && !showVideos && (
            <>
              <div className="bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
                <p className="text-sm font-semibold text-[#9E9C98] uppercase tracking-widest mb-3">
                  Supplier & Brand Intel
                </p>
                <div className="flex items-start gap-3">
                  <Lock className="w-7 h-7 text-[#9E9C98] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xl font-semibold text-[#1A1916] mb-1">Manufacturer Contact</p>
                    <p className="text-base text-[#6B6860]">
                      Not included in Starter Scout.
                      <br />
                      Upgrade to Pro Scout to access verified manufacturer B2B contacts, email, phone, and sourcing details.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
                <p className="text-sm font-semibold text-[#9E9C98] uppercase tracking-widest mb-3">
                  Creative Assets
                </p>
                <div className="flex items-start gap-3">
                  <Video className="w-7 h-7 text-[#9E9C98] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xl font-semibold text-[#1A1916] mb-1">4K Field Footage</p>
                    <p className="text-base text-[#6B6860]">
                      Available in Elite Scout package only.
                      <br />
                      Upgrade to access raw footage filmed inside Korean beauty stores — ready to use as ads or social content.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {isMultiProduct && (
            <section className="bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
              <div className="flex items-center justify-between gap-4">
                {prevId ? (
                  <Link
                    href={`/report/${token}/${prevId}`}
                    className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] transition-colors"
                  >
                    ← Previous Product
                  </Link>
                ) : (
                  <span />
                )}
                {nextId ? (
                  <Link
                    href={`/report/${token}/${nextId}`}
                    className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] ml-auto transition-colors"
                  >
                    Next Product →
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            </section>
          )}

          <section className="bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
            <p className="text-base text-[#9E9C98] mb-4">
              Link expires{" "}
              {new Date(expiresAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              · Need more time? Contact{" "}
              <a
                href="mailto:support@koreascout.com"
                className="text-[#16A34A] hover:underline"
              >
                support@koreascout.com
              </a>
            </p>
            <hr className="border-[#E8E6E1] mb-4" />
            <p className="text-xl font-semibold text-[#1A1916] mb-1">
              Want to stay ahead of K-beauty trends every week?
            </p>
            <p className="text-base text-[#6B6860] mb-4">
              KoreaScout publishes weekly intelligence reports for global sellers — new products, new opportunities, every week.
            </p>
            <a
              href="https://koreascout.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#16A34A] hover:bg-[#15803D] text-white text-base font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Explore KoreaScout →
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
