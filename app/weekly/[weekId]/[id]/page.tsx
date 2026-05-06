import { createClient } from "@/lib/supabase/server";
import { getAuthTier, maskReportByTier } from "@/lib/auth-server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRICING } from "@/src/config/pricing";
import { ClientLeftNav } from "@/components/layout/ClientLeftNav";
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

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ weekId: string; id: string }>;
}) {
  const { weekId, id } = await params;
  const supabase = await createClient();
  const { userId, userEmail, tier, subscriptionStartAt } = await getAuthTier();

  const [
    { data: report, error },
    { data: weekReports },
    { data: week },
    { data: favoriteRow },
  ] = await Promise.all([
    supabase
      .from("scout_final_reports")
      .select("*")
      .eq("id", id)
      .eq("week_id", weekId)
      .eq("status", "published")
      .single(),
    supabase
      .from("scout_final_reports")
      .select("id")
      .eq("week_id", weekId)
      .eq("status", "published")
      .order("created_at", { ascending: true }),
    supabase.from("weeks").select("week_label, published_at").eq("week_id", weekId).single(),
    userId
      ? supabase
          .from("user_favorites")
          .select("report_id")
          .eq("user_id", userId)
          .eq("report_id", id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const { data: freeWeek } = await supabase
    .from("weeks")
    .select("week_id, published_at")
    .eq("status", "published")
    .lt("published_at", new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
    .order("published_at", { ascending: false })
    .limit(1)
    .single();
  const { data: latest3Weeks } = await supabase
    .from("weeks")
    .select("week_id")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);
  const latest3WeekIds = (latest3Weeks ?? []).map((w) => w.week_id);
  const isFavorited = !!favoriteRow?.report_id;

  if (error || !report) notFound();

  const isTeaser = report.is_teaser === true;

  const canAccessThisWeek = (() => {
    if (tier === "free") {
      return freeWeek?.week_id === weekId;
    }
    if (tier === "standard" || tier === "alpha") {
      if (isTeaser) return true;
      const isLatestWeek = latest3WeekIds.includes(weekId);
      if (isLatestWeek) return true;
      if (!subscriptionStartAt) return false;
      const subDate = new Date(subscriptionStartAt);
      const weekDate = week?.published_at ? new Date(week.published_at) : null;
      if (!weekDate) return true;
      return weekDate >= subDate;
    }
    return false;
  })();

  if (!canAccessThisWeek) {
    const { redirect } = await import("next/navigation");
    redirect(`/weekly/${weekId}`);
  }

  const idList = (weekReports ?? []).map((r) => r.id);
  const currentIndex = idList.indexOf(id);
  const prevId = currentIndex > 0 ? idList[currentIndex - 1] : null;
  const nextId = currentIndex >= 0 && currentIndex < idList.length - 1 ? idList[currentIndex + 1] : null;
  const weekLabel = week?.week_label?.trim() || weekId;
  const canSeeAlpha = tier === "alpha" || isTeaser;
  const maskedReport = maskReportByTier(report as ScoutFinalReportsRow, tier as "free" | "standard" | "alpha");

  const hazmatStatus = report.hazmat_status as Record<string, unknown> | null;
  const hasLogistics =
    (report.hs_code && report.hs_code.trim()) ||
    (report.hs_description && report.hs_description.trim()) ||
    (hazmatStatus && typeof hazmatStatus === "object") ||
    (report.dimensions_cm && report.dimensions_cm.trim()) ||
    report.billable_weight_g != null ||
    (report.shipping_tier && report.shipping_tier.trim()) ||
    (report.required_certificates && report.required_certificates.trim()) ||
    (report.shipping_notes && report.shipping_notes.trim()) ||
    (report.key_risk_ingredient && report.key_risk_ingredient.trim()) ||
    (report.status_reason && report.status_reason.trim()) ||
    report.actual_weight_g != null ||
    report.volumetric_weight_g != null ||
    (report.sourcing_tip && report.sourcing_tip.trim());
  const hasSupplier =
    (report.m_name && report.m_name.trim()) ||
    (report.corporate_scale && report.corporate_scale.trim()) ||
    (report.contact_email && report.contact_email.trim()) ||
    (report.contact_phone && report.contact_phone.trim()) ||
    (report.m_homepage && report.m_homepage.trim()) ||
    (report.naver_link && report.naver_link.trim()) ||
    (report.wholesale_link && report.wholesale_link.trim()) ||
    (report.sourcing_tip && report.sourcing_tip.trim());

  const sections = [
    { id: "section-1", label: "Product Identity", icon: null },
    { id: "section-2", label: "Trend Signals", icon: null },
    { id: "section-3", label: "Market Intelligence", icon: null },
    { id: "section-4", label: "Social Proof", icon: null },
    { id: "section-5", label: "Export & Logistics", icon: null },
    { id: "section-6", label: "Launch Kit", icon: null },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F7F4]">
      {userEmail && (
        <ZombieWatermark email={userEmail} />
      )}
      <div className="print-hide hidden md:flex">
        <ClientLeftNav sections={sections} userEmail={userEmail} tier={tier as "free" | "standard" | "alpha"} />
      </div>
      <div className="flex-1 pl-0 md:pl-56">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-20">
          <div className="space-y-6 mt-10">
            <Link href={`/weekly/${weekId}`} className="text-base font-medium text-[#6B6860] hover:text-[#1A1916] transition-colors inline-block">
              ← Back to week
            </Link>

            {isTeaser && (
              <div className="rounded-lg bg-[#DCFCE7] border border-[#BBF7D0] px-4 py-2 text-sm text-[#16A34A]">
                🆓 FREE THIS WEEK — Full report unlocked for everyone.
              </div>
            )}

            <ProductIdentity
              report={report as ScoutFinalReportsRow}
              tier={tier as "free" | "standard" | "alpha"}
              isTeaser={isTeaser}
              EXPORT_STATUS_DISPLAY={EXPORT_STATUS_DISPLAY}
              reportId={report.id}
              weekId={weekId}
              isFavorited={isFavorited}
            />
            <TrendSignalDashboard report={report as ScoutFinalReportsRow} />

            <>
              <MarketIntelligence report={maskedReport} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
              <SocialProofTrendIntelligence report={maskedReport} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
            </>

            {hasLogistics && <SourcingIntel report={maskedReport} tier={tier as string} isTeaser={isTeaser} />}

            <div id="section-6" className="scroll-mt-[160px]">
              <SupplierContact report={maskedReport} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
            </div>

            <section className="rounded-2xl border border-[#E8E6E1] bg-[#F8F7F4] p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                {prevId ? (
                  <Link href={`/weekly/${weekId}/${prevId}`} className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] transition-colors">
                    ← Previous Product
                  </Link>
                ) : (
                  <span />
                )}
                {nextId ? (
                  <Link href={`/weekly/${weekId}/${nextId}`} className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] ml-auto transition-colors">
                    Next Product →
                  </Link>
                ) : (
                  <span />
                )}
              </div>
              <p className="mb-6">
                <Link href={`/weekly/${weekId}`} className="text-[#1A1916] hover:text-[#16A34A] font-medium text-sm inline-flex items-center gap-2 transition-colors">
                  Back to {weekLabel} Product List
                </Link>
              </p>
              <div className="rounded-lg border border-[#E8E6E1] bg-[#F2F1EE] px-4 py-3 text-center">
                {tier === "free" && (
                  <Link href="/pricing" className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] underline transition-colors">
                    Unlock Full Market Intelligence — Start at {PRICING.CURRENCY}{PRICING.STANDARD.monthly}/mo →
                  </Link>
                )}
                {tier === "standard" && (
                  <Link href="/pricing" className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] underline transition-colors">
                    Go Alpha — Get Supplier Contacts for {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo →
                  </Link>
                )}
                {tier === "alpha" && <p className="text-sm font-medium text-[#16A34A]">You have full access</p>}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
