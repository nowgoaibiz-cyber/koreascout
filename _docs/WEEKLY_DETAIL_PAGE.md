```text
L1:import { createClient } from "@/lib/supabase/server";
L2:import { getAuthTier, maskReportByTier } from "@/lib/auth-server";
L3:import Link from "next/link";
L4:import { notFound } from "next/navigation";
L5:import { PRICING } from "@/src/config/pricing";
L6:import { ClientLeftNav } from "@/components/layout/ClientLeftNav";
L7:import ProductIdentity from "@/components/ProductIdentity";
L8:import {
L9:  TrendSignalDashboard,
L10:  MarketIntelligence,
L11:  SocialProofTrendIntelligence,
L12:  SourcingIntel,
L13:  SupplierContact,
L14:  EXPORT_STATUS_DISPLAY,
L15:} from "@/components/report";
L16:import type { ScoutFinalReportsRow } from "@/types/database";
L17:
L18:export default async function ProductDetailPage({
L19:  params,
L20:}: {
L21:  params: Promise<{ weekId: string; id: string }>;
L22:}) {
L23:  const { weekId, id } = await params;
L24:  const supabase = await createClient();
L25:  const { userId, userEmail, tier, subscriptionStartAt } = await getAuthTier();
L26:
L27:  const [{ data: report, error }, { data: weekReports }, { data: week }, { data: favoriteRow }] = await Promise.all([
L28:    supabase
L29:      .from("scout_final_reports")
L30:      .select("*")
L31:      .eq("id", id)
L32:      .eq("week_id", weekId)
L33:      .eq("status", "published")
L34:      .single(),
L35:    supabase
L36:      .from("scout_final_reports")
L37:      .select("id")
L38:      .eq("week_id", weekId)
L39:      .eq("status", "published")
L40:      .order("created_at", { ascending: true }),
L41:    supabase.from("weeks").select("week_label").eq("week_id", weekId).single(),
L42:    userId
L43:      ? supabase
L44:          .from("user_favorites")
L45:          .select("report_id")
L46:          .eq("user_id", userId)
L47:          .eq("report_id", id)
L48:          .maybeSingle()
L49:      : Promise.resolve({ data: null }),
L50:  ]);
L51:  const isFavorited = !!favoriteRow?.report_id;
L52:
L53:  if (error || !report) notFound();
L54:
L55:  const isTeaser = report.is_teaser === true;
L56:
L57:  const canAccessThisWeek = (() => {
L58:    if (tier === "standard" || tier === "alpha") {
L59:      if (isTeaser) return true;
L60:      if (!subscriptionStartAt) return false;
L61:      const subDate = new Date(subscriptionStartAt);
L62:      const weekDate = week?.published_at ? new Date(week.published_at) : null;
L63:      if (!weekDate) return false;
L64:      return weekDate >= subDate;
L65:    }
L66:    if (tier === "free") {
      return isTeaser === true;
L68:    }
L69:    return false;
L70:  })();
L71:
L72:  if (!canAccessThisWeek) {
L73:    const { redirect } = await import("next/navigation");
L74:    redirect(`/weekly/${weekId}`);
L75:  }
L76:
L77:  const idList = (weekReports ?? []).map((r) => r.id);
L78:  const currentIndex = idList.indexOf(id);
L79:  const prevId = currentIndex > 0 ? idList[currentIndex - 1] : null;
L80:  const nextId = currentIndex >= 0 && currentIndex < idList.length - 1 ? idList[currentIndex + 1] : null;
L81:  const weekLabel = week?.week_label?.trim() || weekId;
L82:  const canSeeAlpha = tier === "alpha" || isTeaser;
L83:  const maskedReport = maskReportByTier(report as ScoutFinalReportsRow, tier as "free" | "standard" | "alpha");
L84:
L85:  const hazmatStatus = report.hazmat_status as Record<string, unknown> | null;
L86:  const hasLogistics =
L87:    (report.hs_code && report.hs_code.trim()) ||
L88:    (report.hs_description && report.hs_description.trim()) ||
L89:    (hazmatStatus && typeof hazmatStatus === "object") ||
L90:    (report.dimensions_cm && report.dimensions_cm.trim()) ||
L91:    report.billable_weight_g != null ||
L92:    (report.shipping_tier && report.shipping_tier.trim()) ||
L93:    (report.required_certificates && report.required_certificates.trim()) ||
L94:    (report.shipping_notes && report.shipping_notes.trim()) ||
L95:    (report.key_risk_ingredient && report.key_risk_ingredient.trim()) ||
L96:    (report.status_reason && report.status_reason.trim()) ||
L97:    report.actual_weight_g != null ||
L98:    report.volumetric_weight_g != null ||
L99:    (report.sourcing_tip && report.sourcing_tip.trim());
L100:  const hasSupplier =
L101:    (report.m_name && report.m_name.trim()) ||
L102:    (report.corporate_scale && report.corporate_scale.trim()) ||
L103:    (report.contact_email && report.contact_email.trim()) ||
L104:    (report.contact_phone && report.contact_phone.trim()) ||
L105:    (report.m_homepage && report.m_homepage.trim()) ||
L106:    (report.naver_link && report.naver_link.trim()) ||
L107:    (report.wholesale_link && report.wholesale_link.trim()) ||
L108:    (report.sourcing_tip && report.sourcing_tip.trim());
L109:
L110:  const sections = [
L111:    { id: "section-1", label: "Product Identity", icon: null },
L112:    { id: "section-2", label: "Trend Signals", icon: null },
L113:    { id: "section-3", label: "Market Intelligence", icon: null },
L114:    { id: "section-4", label: "Social Proof", icon: null },
L115:    { id: "section-5", label: "Export & Logistics", icon: null },
L116:    { id: "section-6", label: "Launch Kit", icon: null },
L117:  ];
L118:
L119:  return (
L120:    <div className="flex min-h-screen bg-[#F8F7F4]">
L121:      <ClientLeftNav sections={sections} userEmail={userEmail} tier={tier as "free" | "standard" | "alpha"} />
L122:      <div className="flex-1 pl-[18rem]">
L123:        <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-10 pb-[60vh]">
L124:          <div className="space-y-6 mt-10">
L125:            <Link href={`/weekly/${weekId}`} className="text-base font-medium text-[#6B6860] hover:text-[#1A1916] transition-colors inline-block">
L126:              ← Back to week
L127:            </Link>
L128:
L129:            {isTeaser && (
L130:              <div className="rounded-lg bg-[#DCFCE7] border border-[#BBF7D0] px-4 py-2 text-sm text-[#16A34A]">
L131:                🆓 FREE THIS WEEK — Full report unlocked for everyone.
L132:              </div>
L133:            )}
L134:
L135:            <ProductIdentity
L136:              report={report as ScoutFinalReportsRow}
L137:              tier={tier as "free" | "standard" | "alpha"}
L138:              isTeaser={isTeaser}
L139:              EXPORT_STATUS_DISPLAY={EXPORT_STATUS_DISPLAY}
L140:              reportId={report.id}
L141:              weekId={weekId}
L142:              isFavorited={isFavorited}
L143:            />
L144:            <TrendSignalDashboard report={report as ScoutFinalReportsRow} />
L145:
L146:            <>
L147:              <MarketIntelligence report={maskedReport} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
L148:              <SocialProofTrendIntelligence report={maskedReport} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
L149:            </>
L150:
L151:            {hasLogistics && <SourcingIntel report={maskedReport} tier={tier as string} isTeaser={isTeaser} />}
L152:
L153:            <div id="section-6" className="scroll-mt-[160px]">
L154:              <SupplierContact report={maskedReport} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
L155:            </div>
L156:
L157:            <section className="rounded-2xl border border-[#E8E6E1] bg-[#F8F7F4] p-6">
L158:              <div className="flex items-center justify-between gap-4 mb-6">
L159:                {prevId ? (
L160:                  <Link href={`/weekly/${weekId}/${prevId}`} className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] transition-colors">
L161:                    ← Previous Product
L162:                  </Link>
L163:                ) : (
L164:                  <span />
L165:                )}
L166:                {nextId ? (
L167:                  <Link href={`/weekly/${weekId}/${nextId}`} className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] ml-auto transition-colors">
L168:                    Next Product →
L169:                  </Link>
L170:                ) : (
L171:                  <span />
L172:                )}
L173:              </div>
L174:              <p className="mb-6">
L175:                <Link href={`/weekly/${weekId}`} className="text-[#1A1916] hover:text-[#16A34A] font-medium text-sm inline-flex items-center gap-2 transition-colors">
L176:                  Back to {weekLabel} Product List
L177:                </Link>
L178:              </p>
L179:              <div className="rounded-lg border border-[#E8E6E1] bg-[#F2F1EE] px-4 py-3 text-center">
L180:                {tier === "free" && (
L181:                  <Link href="/pricing" className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] underline transition-colors">
L182:                    Unlock Full Market Intelligence — Start at {PRICING.CURRENCY}{PRICING.STANDARD.monthly}/mo →
L183:                  </Link>
L184:                )}
L185:                {tier === "standard" && (
L186:                  <Link href="/pricing" className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] underline transition-colors">
L187:                    Go Alpha — Get Supplier Contacts for {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo →
L188:                  </Link>
L189:                )}
L190:                {tier === "alpha" && <p className="text-sm font-medium text-[#16A34A]">You have full access</p>}
L191:              </div>
L192:            </section>
L193:          </div>
L194:        </div>
L195:      </div>
L196:    </div>
L197:  );
L198:}
L199:```

