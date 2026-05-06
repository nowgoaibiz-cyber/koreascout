import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductIdentity from "@/components/ProductIdentity";
import {
  TrendSignalDashboard,
  MarketIntelligence,
  SocialProofTrendIntelligence,
  SourcingIntel,
  SupplierContact,
  EXPORT_STATUS_DISPLAY,
} from "@/components/report";

export default async function SampleReportPage() {
  const supabase = await createClient();

  const { data: config } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "sample_product_id")
    .single();

  const sampleId = config?.value ?? null;

  let report = null;
  if (sampleId) {
    const { data } = await supabase
      .from("scout_final_reports")
      .select("*")
      .eq("id", sampleId)
      .single();
    report = data;
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <p className="text-[#9E9C98]">Sample report coming soon.</p>
      </div>
    );
  }

  const tier = "alpha" as const;
  const isTeaser = true;

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Sticky premium banner */}
      <div className="sticky top-0 z-50 w-full border-b border-[#E8E6E1] bg-[#1A1916] shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/95 text-xs sm:text-base font-medium text-center sm:text-left">
            Sample report. Get full access to our weekly intelligence.
          </p>
          <Link
            href="/pricing"
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#15803D] transition-colors shadow-[0_2px_8px_rgba(22,163,74,0.35)]"
          >
            Subscribe to Alpha
          </Link>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-20">
        <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <Link
            href="/"
            className="text-base font-medium text-[#6B6860] hover:text-[#1A1916] transition-colors inline-block"
          >
            ← Back to home
          </Link>

          <ProductIdentity
            report={report}
            tier={tier}
            isTeaser={isTeaser}
            EXPORT_STATUS_DISPLAY={EXPORT_STATUS_DISPLAY}
            isSample={true}
          />
          <TrendSignalDashboard report={report} />
          <MarketIntelligence report={report} tier={tier} isTeaser={isTeaser} />
          <SocialProofTrendIntelligence report={report} tier={tier} isTeaser={isTeaser} />
          <SourcingIntel report={report} tier={tier} isTeaser={isTeaser} />
          <div id="section-6" className="scroll-mt-[160px]">
            <SupplierContact report={report} tier={tier} isTeaser={isTeaser} />
          </div>
        </div>
      </div>
    </div>
  );
}
