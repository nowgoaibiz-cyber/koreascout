# URL_ACCESS_AUDIT.md

## 1. cat -n "app/weekly/[weekId]/[id]/page.tsx"

```
     1|import { createClient } from "@/lib/supabase/server";
     2|import { getAuthTier, maskReportByTier } from "@/lib/auth-server";
     3|import Link from "next/link";
     4|import { notFound } from "next/navigation";
     5|import { PRICING } from "@/src/config/pricing";
     6|import { ClientLeftNav } from "@/components/layout/ClientLeftNav";
     7|import ProductIdentity from "@/components/ProductIdentity";
     8|import {
     9|  TrendSignalDashboard,
    10|  MarketIntelligence,
    11|  SocialProofTrendIntelligence,
    12|  SourcingIntel,
    13|  SupplierContact,
    14|  EXPORT_STATUS_DISPLAY,
    15|} from "@/components/report";
    16|import type { ScoutFinalReportsRow } from "@/types/database";
    17|
    18|export default async function ProductDetailPage({
    19|  params,
    20|}: {
    21|  params: Promise<{ weekId: string; id: string }>;
    22|}) {
    23|  const { weekId, id } = await params;
    24|  const supabase = await createClient();
    25|  const { userId, userEmail, tier, subscriptionStartAt } = await getAuthTier();
    26|
    27|  const [
    28|    { data: report, error },
    29|    { data: weekReports },
    30|    { data: week },
    31|    { data: favoriteRow },
    32|  ] = await Promise.all([
    33|    supabase
    34|      .from("scout_final_reports")
    35|      .select("*")
    36|      .eq("id", id)
    37|      .eq("week_id", weekId)
    38|      .eq("status", "published")
    39|      .single(),
    40|    supabase
    41|      .from("scout_final_reports")
    42|      .select("id")
    43|      .eq("week_id", weekId)
    44|      .eq("status", "published")
    45|      .order("created_at", { ascending: true }),
    46|    supabase.from("weeks").select("week_label, published_at").eq("week_id", weekId).single(),
    47|    userId
    48|      ? supabase
    49|          .from("user_favorites")
    50|          .select("report_id")
    51|          .eq("user_id", userId)
    52|          .eq("report_id", id)
    53|          .maybeSingle()
    54|      : Promise.resolve({ data: null }),
    55|  ]);
    56|  const { data: freeWeek } = await supabase
    57|    .from("weeks")
    58|    .select("week_id, published_at")
    59|    .eq("status", "published")
    60|    .lt("published_at", new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
    61|    .order("published_at", { ascending: false })
    62|    .limit(1)
    63|    .single();
    64|  const isFavorited = !!favoriteRow?.report_id;
    65|
    66|  if (error || !report) notFound();
    67|
    68|  const isTeaser = report.is_teaser === true;
    69|
    70|  const canAccessThisWeek = (() => {
    71|    if (tier === "free") {
    72|      return freeWeek?.week_id === weekId;
    73|    }
    74|    if (tier === "standard" || tier === "alpha") {
    75|      if (isTeaser) return true;
    76|      if (!subscriptionStartAt) return false;
    77|      const subDate = new Date(subscriptionStartAt);
    78|      const weekDate = week?.published_at ? new Date(week.published_at) : null;
    79|      if (!weekDate) return true; // published_at 없으면 허용 (데이터 누락 방어)
    80|      return weekDate >= subDate;
    81|    }
    82|    return false;
    83|  })();
    84|
    85|  if (!canAccessThisWeek) {
    86|    const { redirect } = await import("next/navigation");
    87|    redirect(`/weekly/${weekId}`);
    88|  }
    88|
    89|  const idList = (weekReports ?? []).map((r) => r.id);
    90|  const currentIndex = idList.indexOf(id);
    91|  const prevId = currentIndex > 0 ? idList[currentIndex - 1] : null;
    92|  const nextId = currentIndex >= 0 && currentIndex < idList.length - 1 ? idList[currentIndex + 1] : null;
    93|  const weekLabel = week?.week_label?.trim() || weekId;
    94|  const canSeeAlpha = tier === "alpha" || isTeaser;
    95|  const maskedReport = maskReportByTier(report as ScoutFinalReportsRow, tier as "free" | "standard" | "alpha");
    96|
    97|  const hazmatStatus = report.hazmat_status as Record<string, unknown> | null;
    98|  const hasLogistics =
    99|    (report.hs_code && report.hs_code.trim()) ||
   100|    (report.hs_description && report.hs_description.trim()) ||
   101|    (hazmatStatus && typeof hazmatStatus === "object") ||
   102|    (report.dimensions_cm && report.dimensions_cm.trim()) ||
   103|    report.billable_weight_g != null ||
   104|    (report.shipping_tier && report.shipping_tier.trim()) ||
   105|    (report.required_certificates && report.required_certificates.trim()) ||
   106|    (report.shipping_notes && report.shipping_notes.trim()) ||
   107|    (report.key_risk_ingredient && report.key_risk_ingredient.trim()) ||
   108|    (report.status_reason && report.status_reason.trim()) ||
   109|    report.actual_weight_g != null ||
   110|    report.volumetric_weight_g != null ||
   111|    (report.sourcing_tip && report.sourcing_tip.trim());
    112|  const hasSupplier =
    113|    (report.m_name && report.m_name.trim()) ||
    114|    (report.corporate_scale && report.corporate_scale.trim()) ||
    115|    (report.contact_email && report.contact_email.trim()) ||
    116|    (report.contact_phone && report.contact_phone.trim()) ||
    117|    (report.m_homepage && report.m_homepage.trim()) ||
    118|    (report.naver_link && report.naver_link.trim()) ||
    119|    (report.wholesale_link && report.wholesale_link.trim()) ||
    120|    (report.sourcing_tip && report.sourcing_tip.trim());
    121|
    122|  const sections = [
    123|    { id: "section-1", label: "Product Identity", icon: null },
    124|    { id: "section-2", label: "Trend Signals", icon: null },
    125|    { id: "section-3", label: "Market Intelligence", icon: null },
    126|    { id: "section-4", label: "Social Proof", icon: null },
    127|    { id: "section-5", label: "Export & Logistics", icon: null },
    128|    { id: "section-6", label: "Launch Kit", icon: null },
    129|  ];
    130|
    131|  return (
    132|    <div className="flex min-h-screen bg-[#F8F7F4]">
    133|      <ClientLeftNav sections={sections} userEmail={userEmail} tier={tier as "free" | "standard" | "alpha"} />
    134|      <div className="flex-1 pl-[18rem]">
    135|        <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-10 pb-[60vh]">
    136|          <div className="space-y-6 mt-10">
    137|            <Link href={`/weekly/${weekId}`} className="text-base font-medium text-[#6B6860] hover:text-[#1A1916] transition-colors inline-block">
    138|              ← Back to week
    139|            </Link>
    140|
    141|            {isTeaser && (
    142|              <div className="rounded-lg bg-[#DCFCE7] border border-[#BBF7D0] px-4 py-2 text-sm text-[#16A34A]">
    143|                🆓 FREE THIS WEEK — Full report unlocked for everyone.
    144|              </div>
    145|            )}
    146|
    147|            <ProductIdentity
    148|              report={report as ScoutFinalReportsRow}
    149|              tier={tier as "free" | "standard" | "alpha"}
    150|              isTeaser={isTeaser}
    151|              EXPORT_STATUS_DISPLAY={EXPORT_STATUS_DISPLAY}
    152|              reportId={report.id}
    153|              weekId={weekId}
    154|              isFavorited={isFavorited}
    155|            />
    156|            <TrendSignalDashboard report={report as ScoutFinalReportsRow} />
    157|
    158|            <>
    159|              <MarketIntelligence report={maskedReport} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
    160|              <SocialProofTrendIntelligence report={maskedReport} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
    161|            </>
    162|
    163|            {hasLogistics && <SourcingIntel report={maskedReport} tier={tier as string} isTeaser={isTeaser} />}
    164|
    165|            <div id="section-6" className="scroll-mt-[160px]">
    166|              <SupplierContact report={maskedReport} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
    167|            </div>
    168|
    169|            <section className="rounded-2xl border border-[#E8E6E1] bg-[#F8F7F4] p-6">
    170|              <div className="flex items-center justify-between gap-4 mb-6">
    171|                {prevId ? (
    172|                  <Link href={`/weekly/${weekId}/${prevId}`} className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] transition-colors">
    173|                    ← Previous Product
    174|                  </Link>
    175|                ) : (
    176|                  <span />
    177|                )}
    178|                {nextId ? (
    179|                  <Link href={`/weekly/${weekId}/${nextId}`} className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] ml-auto transition-colors">
    180|                    Next Product →
    181|                  </Link>
    182|                ) : (
    183|                  <span />
    184|                )}
    185|              </div>
    186|              <p className="mb-6">
    187|                <Link href={`/weekly/${weekId}`} className="text-[#1A1916] hover:text-[#16A34A] font-medium text-sm inline-flex items-center gap-2 transition-colors">
    188|                  Back to {weekLabel} Product List
    189|                </Link>
    190|              </p>
    191|              <div className="rounded-lg border border-[#E8E6E1] bg-[#F2F1EE] px-4 py-3 text-center">
    192|                {tier === "free" && (
    193|                  <Link href="/pricing" className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] underline transition-colors">
    194|                    Unlock Full Market Intelligence — Start at {PRICING.CURRENCY}{PRICING.STANDARD.monthly}/mo →
    195|                  </Link>
    196|                )}
    197|                {tier === "standard" && (
    198|                  <Link href="/pricing" className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] underline transition-colors">
    199|                    Go Alpha — Get Supplier Contacts for {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo →
    200|                  </Link>
    201|                )}
    202|                {tier === "alpha" && <p className="text-sm font-medium text-[#16A34A]">You have full access</p>}
    203|              </div>
    204|            </section>
    205|          </div>
    206|        </div>
    207|      </div>
    208|    </div>
    209|  );
    210|}
```

---

## 2. cat -n "app/weekly/page.tsx" | grep -A 10 -B 5 "canAccessWeek|freeOpenWeekId|latest3WeekIds|subscriptionStartAt|isPaid"

```
    58|type MonthGroup = {
    59|  monthKey: string;
    60|  monthLabel: string;
    61|  weeks: WeekRow[];
    62|};
    63|
    64|export default async function WeeklyHubPage() {
    65|  const supabase = await createClient();
    66:  const { userId, tier, subscriptionStartAt } = await getAuthTier();
    67|
    68|  if (!userId) {
    69|    redirect("/login");
    70|  }
    71|
    72:  const isPaid = tier === "standard" || tier === "alpha";
    73|
    74|  const { data: weeks, error } = await supabase
    75|    .from("weeks")
    76|    .select("week_id, week_label, start_date, end_date, published_at, product_count, summary, scout_final_reports(count)")
    77|    .filter("scout_final_reports.status", "eq", "published")
    78|    .eq("status", "published")
    79|    .order("start_date", { ascending: false });
    80|
    81|  if (error) {
    82|    return (
    83|      <div className="min-h-screen bg-[#F8F7F4] pt-8 px-4 py-12">
    84|        <div className="max-w-5xl mx-auto text-center">
    85|          <p className="text-lg text-[#DC2626]">Failed to load weeks.</p>
    86|          <Link href="/" className="text-[#16A34A] hover:text-[#15803D] text-base font-medium mt-4 inline-block">← Back to home</Link>
    87|        </div>
    88|    );
    89|  }
    90|
    91|  const { data: latest3Weeks } = await supabase
    92|    .from("weeks")
    93|    .select("week_id")
    94|    .eq("status", "published")
    95|    .order("published_at", { ascending: false })
    96|    .limit(3);
    97:  const latest3WeekIds = (latest3Weeks ?? []).map((w) => w.week_id);
    98|
    99:  const freeOpenWeekId =
   100|    weeks
   101|      ?.filter((w) => isWeekAvailableForFree(w.published_at))
   102|      .sort(
   103|        (a, b) =>
   104|          new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime()
   105|      )[0]?.week_id ?? null;
   106|
    107|  const monthGroups: MonthGroup[] = [];
   108|  for (const week of weeks ?? []) {
   109|    const d = new Date(week.start_date ?? 0);
   110|    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
   111|    const monthLabel = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
   112|    const existing = monthGroups.find((g) => g.monthKey === monthKey);
   113|    if (existing) {
   114|      existing.weeks.push(week);
   115|    } else {
   116|      monthGroups.push({ monthKey, monthLabel, weeks: [week] });
   117|    }
   118|  }
   119|
   120|  const currentMonthKey = (() => {
   121|    const now = new Date();
   122|    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
   123|  })();
   124|
   125:  function canAccessWeek(week: WeekRow): boolean {
   126:    const isLatestWeek = latest3WeekIds.includes(week.week_id);
   127|    const isAfterSub =
   128|      subscriptionStartAt && week.published_at
   129|        ? new Date(week.published_at) >= new Date(subscriptionStartAt)
   130|        : false;
   131:    return isPaid ? isLatestWeek || isAfterSub : week.week_id === freeOpenWeekId;
   132|  }
   133|
   134:  const unlockedWeeks = (weeks ?? []).filter(canAccessWeek);
   135|  const featuredWeek =
   136|    unlockedWeeks.sort(
   137|      (a, b) =>
   138|        new Date(b.published_at ?? 0).getTime() -
   139|        new Date(a.published_at ?? 0).getTime()
   140|    )[0] ?? null;
   141|
   142|  // Only remove the featured week from the vault when user is free tier. Paid users see all accessible weeks.
   143|  const weeksForVault =
   144|    tier === "free" && featuredWeek
   145|      ? (weeks ?? []).filter((w) => w.week_id !== featuredWeek.week_id)
   146|      : weeks ?? [];
   147|
   148|  const monthGroupsForVault: MonthGroup[] = [];
   149|  for (const week of weeksForVault) {
   150|    const d = new Date(week.start_date ?? 0);
   151|    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
   152|    const monthLabel = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
   153|    const existing = monthGroupsForVault.find((g) => g.monthKey === monthKey);
   154|    if (existing) {
   155|      existing.weeks.push(week);
   156|    } else {
   157|      monthGroupsForVault.push({ monthKey, monthLabel, weeks: [week] });
   158|    }
   159|  }
   160|
   161|
   282|                <MonthAccordion
   283|                  key={group.monthKey}
   284|                  monthLabel={group.monthLabel}
   285|                  monthKey={group.monthKey}
   286|                  currentMonthKey={currentMonthKey}
   287|                  defaultOpen={index === 0}
   288|                >
   289|                  {group.weeks.map((week, weekIndex) => {
   290:                    const canAccess = canAccessWeek(week);
   291:                    const isLocked = !canAccess;
   292|                    const actualCount = week.scout_final_reports?.[0]?.count ?? 0;
   293|                    const isFirstItemInVault = index === 0 && weekIndex === 0;
   294|                    const withinThreeDays = isWithinLastNDays(week.published_at, 3);
   295:                    const showJustReleased = isPaid && (isFirstItemInVault || withinThreeDays);
   296|
   297|                    return (
   298|                      <div key={week.week_id}>
   299|                        {isLocked ? (
   300|                          <div className="relative rounded-xl border border-[#E8E6E1] bg-white overflow-hidden">
   301|                            <div className="p-6 opacity-90">
   302|                              <div className="flex items-center justify-between gap-2">
   303|                                <span className="text-lg font-semibold text-[#1A1916]">
   304|                                  {week.week_label}
   305|                                </span>
   306|                                <span className="text-sm text-[#9E9C98]">
   307:                                  {!isPaid && week.published_at
   308|                                    ? `Available ${formatAvailableDate(week.published_at)}`
   309|                                    : "Archive"}
   310|                              </span>
   311|                            </div>
   312|                            <p className="text-base text-[#6B6860] mt-1.5">
   313|                              {actualCount} product{actualCount !== 1 ? "s" : ""}
   314|                            </p>
   315|                          </div>
   316|
   317|
   318|   354|                                <div className="flex flex-wrap items-center gap-2">
   319|                                  <span className="text-lg font-semibold text-[#1A1916]">
   320|                                    {week.week_label}
   321|                                  </span>
   322|                                  {showJustReleased && (
   323|                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
   323|                                      Just released
   324|                                    </span>
   325|                                  )}
   326:                                  {!isPaid && (
   327|                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
   328|                                      Free access
   329|                                    </span>
   330|                                  )}
   331|                                </div>
   332|                                <p className="text-sm text-[#6B6860] mt-1.5">
   333|                                  {formatPublishedDate(week.published_at) && (
   334|                                    <>Published: {formatPublishedDate(week.published_at)}</>
   335|                                  )}
   336|                                  {formatPublishedDate(week.published_at) && " • "}
   337|                                  {actualCount} product{actualCount !== 1 ? "s" : ""}
   338|                                </p>
```

---

## 3. cat -n "lib/auth-server.ts"

```
     1|import { createClient } from "@/lib/supabase/server";
     2|import type { ScoutFinalReportsRow, Tier } from "@/types/database";
     3|
     4|export interface AuthResult {
     5|  userId: string | null;
     6|  userEmail: string | null;
     7|  tier: Tier;
     8|  subscriptionStartAt: string | null;
     9|}
    10|
    11|/**
    12| * Get current user id and tier for server components.
    13| * Guests and unauthenticated users get tier 'free'.
    13| * RLS uses this tier for report_access on scout_final_reports.
    14| */
    15|export async function getAuthTier(): Promise<AuthResult> {
    16|  const supabase = await createClient();
    17|  const {
    18|    data: { user },
    19|  } = await supabase.auth.getUser();
    20|  if (!user) {
    21|    return { userId: null, userEmail: null, tier: "free", subscriptionStartAt: null };
    22|  }
    23|  const { data: profile } = await supabase
    24|    .from("profiles")
    25|    .select("tier, subscription_start_at")
    26|    .eq("id", user.id)
    27|    .single();
    28|  const tier = (profile?.tier as Tier) ?? "free";
    29|  return {
    30|    userId: user.id,
    31|    userEmail: user.email ?? null,
    32|    tier,
    33|    subscriptionStartAt: profile?.subscription_start_at ?? null,
    34|  };
    35|}
    36|
    37|export function maskReportByTier(
    37|  report: ScoutFinalReportsRow,
    38|  tier: "free" | "standard" | "alpha"
    39|): ScoutFinalReportsRow {
    40|  if (tier === "alpha") return report;
    41|
    42|  const masked = { ...report };
    43|
    44|  // Fields nulled for BOTH free and standard
    45|  const nullForFreeAndStandard = [
    46|    "export_status",
    47|    "status_reason",
    48|    "actual_weight_g",
    49|    "volumetric_weight_g",
    50|    "billable_weight_g",
    51|    "dimensions_cm",
    52|    "shipping_tier",
    53|    "required_certificates",
    54|    "shipping_notes",
    55|    "hazmat_status",
    56|    "key_risk_ingredient",
    57|    "composition_info",
    58|    "spec_summary",
    59|    "hazmat_summary",
    60|    "sourcing_tip",
    61|    "hs_code",
    62|    "hs_description",
    63|    "verified_cost_usd",
    64|    "verified_cost_note",
    65|    "verified_at",
    66|    "moq",
    67|    "lead_time",
    68|    "can_oem",
    69|    "m_name",
    70|    "translated_name",
    71|    "corporate_scale",
    72|    "contact_email",
    73|    "contact_phone",
    74|    "m_homepage",
    75|    "naver_link",
    76|    "wholesale_link",
    77|    "global_site_url",
    78|    "b2b_inquiry_url",
    79|    "sample_policy",
    80|    "export_cert_note",
    81|    "viral_video_url",
    82|    "video_url",
    83|    "ai_detail_page_links",
    84|    "marketing_assets_url",
    85|    "ai_image_url",
    87|  ] as const;
    88|
    89|  // Additional fields nulled for FREE only (not standard)
    90|  const nullForFreeOnly = [
    90|    "profit_multiplier",
    91|    "estimated_cost_usd",
    92|    "global_prices",
    93|    "search_volume",
    94|    "mom_growth",
    95|    "wow_rate",
    96|    "top_selling_point",
    97|    "common_pain_point",
    98|    "best_platform",
    99|    "gap_index",
    100|    "gap_status",
    101|    "buzz_summary",
    102|    "rising_keywords",
    103|    "seo_keywords",
    104|    "viral_hashtags",
    105|    "trend_entry_strategy",
    106|    "opportunity_reasoning",
    107|    "kr_local_score",
    108|    "global_trend_score",
    109|    "kr_evidence",
    110|    "global_evidence",
    111|    "kr_source_used",
    112|  ] as const;
    113|
    114|  for (const key of nullForFreeAndStandard) {
    115|    (masked as Record<string, unknown>)[key] = null;
    116|  }
    117|
    118|  if (tier === "free") {
    119|    for (const key of nullForFreeOnly) {
    120|      (masked as Record<string, unknown>)[key] = null;
    121|    }
    122|  }
    123|
    124|  return masked;
    125|}
    126|
```
