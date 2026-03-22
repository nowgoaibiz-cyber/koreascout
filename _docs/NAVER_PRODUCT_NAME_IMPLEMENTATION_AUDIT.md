# NAVER_PRODUCT_NAME — Ultra Deep Implementation Audit

**생성일:** 2025-03-22  
**범위:** 코드베이스 스캔 전용 (DB 변경 없음, 애플리케이션 소스 변경 없음).  
**트리 제외:** `node_modules/`, `.git/`, `.next/` (빌드 산출물).

---

## 1. Complete File Tree (with markers)

**범례**

| Marker | 의미 |
|--------|------|
| **P** | 해당 파일이 `product_name` 식별자를 **소스에 포함** (주로 `.ts` / `.tsx` / `.sql` / 샘플 데이터). |
| **R** | `scout_final_reports` 조회·갱신, `ScoutFinalReportsRow` 타입, `report` 객체 전달/마스킹, 또는 리포트 샘플 데이터와 직접 연관. |
| **—** | 해당 없음. |

| File | P | R |
|------|---|---|
| .cursorrules | — | — |
| .env.local | — | — |
| .gitignore | — | — |
| _docs/ACCESS_CONTROL_AUDIT.md | — | — |
| _docs/admin_full_code_extract.md | — | — |
| _docs/admin_id_page_full.md | — | — |
| _docs/admin_id_page_raw.md | — | — |
| _docs/admin_middle_section.md | — | — |
| _docs/admin_sync_audit.md | — | — |
| _docs/archive/03_AUDIT_PROJECT_STATE.md | — | — |
| _docs/archive/04_AUDIT_DARK_REMNANTS.md | — | — |
| _docs/archive/05_PHASE7B_HIT_LIST.md | — | — |
| _docs/archive/06_TYPOGRAPHY_AUDIT_REPORT.md | — | — |
| _docs/archive/07_POLISHING_AUDIT_REPORT.md | — | — |
| _docs/archive/08_SECURITY_AUDIT_REPORT.md | — | — |
| _docs/archive/09_PIXEL_POLISH_AUDIT.md | — | — |
| _docs/archive/10_LUXURY_UI_AUDIT.md | — | — |
| _docs/archive/ACCOUNT_PAGE_FAVORITES_READINESS_AUDIT.md | — | — |
| _docs/archive/DESIGN_SYSTEM_SECTIONS_1_2_AUDIT.md | — | — |
| _docs/archive/LANDING_PAGE_ASIS_AUTOPSY.md | — | — |
| _docs/archive/LANDING_TYPO_POLISH_LOG.md | — | — |
| _docs/archive/LANDING_V5_BUILD_LOG.md | — | — |
| _docs/archive/PRICING_ALIGNMENT_LOG.md | — | — |
| _docs/archive/PRICING_PAGE_AUDIT_REPORT.md | — | — |
| _docs/archive/PROJECT_3DATA_MAP.md | — | — |
| _docs/archive/PROJECT_4UI_STRATEGY.md | — | — |
| _docs/archive/PROJECT_CURRENT_DESIGN.md | — | — |
| _docs/archive/SECTION_4_FORENSIC_AUDIT_REPORT.md | — | — |
| _docs/archive/SECTION_5_DEEP_FORENSIC_AUDIT_REPORT.md | — | — |
| _docs/archive/SECTION_5_EXPORT_LOGISTICS_DATA_REPORT.md | — | — |
| _docs/archive/SECTION_5_FORENSIC_AUDIT_REPORT.md | — | — |
| _docs/archive/SECTION_6_FORENSIC_AUDIT_REPORT.md | — | — |
| _docs/archive/SECTION_6_MEDIA_VAULT_DIAGNOSTIC.md | — | — |
| _docs/archive/WEEKLY_PAGE_ARCHITECTURE_AUDIT_REPORT.md | — | — |
| _docs/AUTH_SERVER.md | — | — |
| _docs/CURSOR_WORK2_AUDIT.md | — | — |
| _docs/FULL_CODE_EXTRACT.md | — | — |
| _docs/GLOBAL_MARKET_PROOF_AUDIT.md | — | — |
| _docs/global_prices_full_audit.md | — | — |
| _docs/GLOBAL_PRICING_AUDIT_REPORT.md | — | — |
| _docs/GroupBBrokerSection.md | — | — |
| _docs/LABEL_AUDIT.md | — | — |
| _docs/LOGIN_PAGE_AUTH_AUDIT.md | — | — |
| _docs/MarketIntelligence.md | — | — |
| _docs/PAYWALL_AUDIT.md | — | — |
| _docs/PRODUCT_DETAIL_PAGE_FULL_CODE_EXTRACT.md | — | — |
| _docs/rls_audit.md | — | — |
| _docs/SourcingIntel.md | — | — |
| _docs/standard/01_CORE_SPEC.md | — | — |
| _docs/standard/02_DESIGN_SYSTEM.md | — | — |
| _docs/standard/02_PRICING_STRATEGY.md | — | — |
| _docs/standard/04_ACCESS_CONTROL_LOGIC.md | — | — |
| _docs/standard/10_LUXURY_UI_AUDIT.md | — | — |
| _docs/standard/DATA_SCHEMA_RECON_REPORT.md | — | — |
| _docs/standard/PROJECT_2DB_STATUS.md | — | — |
| _docs/standard/PROJECT_2STATUS.md | — | — |
| _docs/standard/RLS_SECURITY_HARDENING_GUIDE.md | — | — |
| _docs/standard/SAMPLE_REPORT_AUDIT.md | — | — |
| _docs/SupplierContact.md | — | — |
| _docs/UI_PREMIUM_AUDIT_REPORT.md | — | — |
| _docs/URL_ACCESS_AUDIT.md | — | — |
| _docs/vercel_deploy_audit.md | — | — |
| _docs/WATERMARK_AUDIT.md | — | — |
| _docs/WEEKLY_DETAIL_PAGE.md | — | — |
| _docs/WEEKLY_LIST_PAGE.md | — | — |
| _docs/WEEKLY_PAGE_CURRENT_STATE_REPORT.md | — | — |
| _docs/*.png (이미지 자산) | — | — |
| _docs/중복.csv | — | — |
| _docs/중복_비교분석.md | — | — |
| _temp_page.txt | — | — |
| app/account/page.tsx | — | R |
| app/account/password/page.tsx | — | — |
| app/actions/favorites.ts | — | R |
| app/admin/[id]/page.tsx | P | R |
| app/admin/login/page.tsx | — | — |
| app/admin/page.tsx | P | R |
| app/api/admin/auth/route.ts | — | — |
| app/api/admin/logout/route.ts | — | — |
| app/api/admin/reports/[id]/route.ts | — | R |
| app/api/admin/reports/route.ts | P | R |
| app/api/webhooks/lemonsqueezy/route.ts | — | — |
| app/apple-icon.png | — | — |
| app/auth/callback/route.ts | — | — |
| app/ConditionalRootContent.tsx | — | — |
| app/error.tsx | — | — |
| app/favicon.ico | — | — |
| app/forgot-password/page.tsx | — | — |
| app/globals.css | — | — |
| app/icon.png | — | — |
| app/jisun/layout.tsx | — | — |
| app/jisun/page.tsx | — | — |
| app/layout.tsx | — | — |
| app/legal/privacy/page.tsx | — | — |
| app/legal/privacy-kr/page.tsx | — | — |
| app/legal/terms/page.tsx | — | — |
| app/login/page.tsx | — | — |
| app/not-found.tsx | — | — |
| app/page.tsx | — | — |
| app/pricing/page.tsx | — | — |
| app/reset-password/page.tsx | — | — |
| app/sample-report/page.tsx | — | R |
| app/signup/page.tsx | — | — |
| app/signup/verify/page.tsx | — | — |
| app/sitemap.ts | — | — |
| app/weekly/[weekId]/[id]/page.tsx | — | R |
| app/weekly/[weekId]/page.tsx | P | R |
| app/weekly/MonthAccordion.tsx | — | — |
| app/weekly/page.tsx | — | R |
| components/admin/AiPageLinksHelper.tsx | — | — |
| components/admin/GlobalPricesHelper.tsx | — | — |
| components/admin/HazmatCheckboxes.tsx | — | — |
| components/AlphaVaultPreview.tsx | — | — |
| components/BrokerEmailDraft.tsx | P | R |
| components/CheckoutButton.tsx | — | — |
| components/ContactCard.tsx | — | — |
| components/CopyButton.tsx | — | — |
| components/DonutGauge.tsx | — | — |
| components/DynamiteFuseSection.tsx | — | — |
| components/ExpandableText.tsx | — | — |
| components/FaqAccordion.tsx | — | — |
| components/FavoriteButton.tsx | — | — |
| components/GlobalPricingTable.tsx | — | — |
| components/GoogleSignInButton.tsx | — | — |
| components/GrandEntrance.tsx | — | — |
| components/GroupBBrokerSection.tsx | — | R |
| components/HazmatBadges.tsx | — | — |
| components/Hero.tsx | — | — |
| components/HeroCTA.tsx | — | — |
| components/IntelligencePipeline.tsx | — | — |
| components/IntelligenceTicker.tsx | P | R |
| components/LandingPipelineSneakPeek.tsx | — | — |
| components/LandingTimeWidget.tsx | — | — |
| components/LaunchKit.tsx | — | — |
| components/layout/ClientLeftNav.tsx | — | — |
| components/layout/Header.tsx | — | — |
| components/layout/HeaderNavClient.tsx | — | — |
| components/layout/HeaderShellClient.tsx | — | — |
| components/LockedSection.tsx | — | — |
| components/Logo.tsx | — | — |
| components/LogoutButton.tsx | — | — |
| components/ManageBillingButton.tsx | — | — |
| components/PriceComparisonBar.tsx | — | — |
| components/ProductIdentity.tsx | P | R |
| components/RemoveFavoriteButton.tsx | — | — |
| components/report/constants.ts | — | — |
| components/report/index.ts | — | R |
| components/report/MarketIntelligence.tsx | — | R |
| components/report/SocialProofTrendIntelligence.tsx | — | R |
| components/report/SourcingIntel.tsx | — | R |
| components/report/SupplierContact.tsx | — | R |
| components/report/TrendSignalDashboard.tsx | — | R |
| components/report/utils.ts | — | — |
| components/ScrollToIdButton.tsx | — | — |
| components/SplashScreen.tsx | — | — |
| components/StatusBadge.tsx | — | — |
| components/TagCloud.tsx | — | — |
| components/ui/Badge.tsx | — | — |
| components/ui/Button.tsx | — | — |
| components/ui/Card.tsx | — | — |
| components/ui/index.ts | — | — |
| components/ui/Input.tsx | — | — |
| components/ui/KeywordPill.tsx | — | — |
| components/ui/LockedValue.tsx | — | — |
| components/ui/PaywallOverlay.tsx | — | — |
| components/ViralHashtagPills.tsx | — | — |
| components/ZombieWatermark.tsx | — | — |
| data/sampleReportData.ts | P | R |
| docs/63_MASTER_LIST_INTEGRITY_AUDIT_REPORT.md | — | — |
| docs/GLOBAL_MARKET_AVAILABILITY_AUDIT_REPORT.md | — | — |
| docs/LAUNCH_KIT_SUPPLIER_CONTACT_AUDIT_REPORT.md | — | — |
| docs/PDP_FIELD_INSERTION_AUDIT_REPORT.md | — | — |
| docs/PDP_TECHNICAL_AUDIT_REPORT.md | — | — |
| docs/PRODUCT_DETAIL_PAGE_DB_MAPPING_REPORT.md | — | — |
| eslint.config.mjs | — | — |
| KoreaScout_LOGO_V2.png | — | — |
| KoreaScout_LOGO_V3.png | — | — |
| KoreaScout_LOGO-preview.png | — | — |
| lib/auth-server.ts | — | R |
| lib/supabase/admin.ts | — | — |
| lib/supabase/client.ts | — | — |
| lib/supabase/middleware.ts | — | — |
| lib/supabase/server.ts | — | R (주석에 `scout_final_reports` 언급) |
| middleware.ts | — | — |
| next.config.ts | — | — |
| next-env.d.ts | — | — |
| package.json | — | — |
| package-lock.json | — | — |
| postcss.config.mjs | — | — |
| PRINT_CSS_AUDIT.md | — | — |
| project_audit.md | — | — |
| public/** (정적 자산) | — | — |
| README.md | — | — |
| scan_result.md | — | — |
| scan_result2.md | — | — |
| src/config/pricing.ts | — | — |
| supabase/migrations/001_phase2_schema.sql | P | R |
| supabase/migrations/002_product_identity_pricing.sql | — | R |
| supabase/migrations/003_sync_from_live_audit.sql | — | R |
| tsconfig.json | — | — |
| tsconfig.tsbuildinfo | — | — |
| types/database.ts | P | R |
| 중복.csv | — | — |

**참고:** 루트 `중복.csv`, `_docs/중복.csv` 등은 데이터 덤프로 `product_name` **컬럼명**을 포함할 수 있으나 앱 런타임 코드가 아님 → 표에서는 `P` 미표시.

---

## 2. ProductIdentity.tsx — Complete File (every line)

```tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { ScoutFinalReportsRow } from "@/types/database";

const FALLBACK_RATE = 1430;

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
}

type ExportStatusDisplay = Record<string, { variant: "success" | "warning" | "danger"; label: string }>;

export default function ProductIdentity({
  report,
  tier,
  isTeaser,
  EXPORT_STATUS_DISPLAY,
  reportId,
  weekId,
  isFavorited,
  isSample,
}: {
  report: ScoutFinalReportsRow;
  tier: "free" | "standard" | "alpha";
  isTeaser: boolean;
  EXPORT_STATUS_DISPLAY: ExportStatusDisplay;
  reportId?: string;
  weekId?: string;
  isFavorited?: boolean;
  isSample?: boolean;
}) {
  const canSeeAlpha = tier === "alpha" || isTeaser;
  const [exchangeRate, setExchangeRate] = useState<number>(FALLBACK_RATE);
  const [rateDate, setRateDate] = useState<string>(formatDate(new Date()));
  const [rateLoading, setRateLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    fetch("https://api.frankfurter.app/latest?from=USD&to=KRW", {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        const rate = data?.rates?.KRW;
        if (typeof rate === "number" && rate > 0) {
          setExchangeRate(Math.round(rate));
          setRateDate(formatDate(new Date()));
        }
      })
      .catch(() => {
        setExchangeRate(FALLBACK_RATE);
      })
      .finally(() => {
        clearTimeout(timeout);
        setRateLoading(false);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const exportBadge = (() => {
    const s = report.export_status;
    const key = s?.toLowerCase() ?? "";
    const label = (EXPORT_STATUS_DISPLAY[key]?.label ?? s) as string;
    if (!s || !label) return null;
    if (s === "Green" || key === "green") return { label, color: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]" };
    if (s === "Yellow" || key === "yellow") return { label, color: "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]" };
    return { label, color: "bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]" };
  })();

  const usdPrice = report.kr_price != null
    ? (Number(report.kr_price) / exchangeRate).toFixed(2)
    : null;

  return (
    <section
      id="section-1"
      className="scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-8 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]"
    >
      <h2 className="text-3xl font-bold text-[#1A1916] tracking-tight mb-8">
        Product Identity
      </h2>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="relative w-full md:w-80 shrink-0 overflow-hidden rounded-2xl bg-[#F8F7F4] aspect-[3/4]">
          {report.image_url ? (
            <Image
              src={report.image_url}
              alt={report.product_name || report.translated_name || "Product"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-[#9E9C98]">No image</p>
            </div>
          )}
          {isSample && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 pointer-events-none">
              <div className="rotate-[-35deg] border-2 border-white/40 px-6 py-2 rounded-lg backdrop-blur-sm">
                <span className="text-white/70 font-black text-2xl tracking-widest uppercase drop-shadow-md">
                  KoreaScout Sample
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden @container relative">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              {report.category?.trim() && (
                <span className="inline-flex items-center px-3 py-1.5 bg-[#F8F7F4] border border-[#E8E6E1] text-xs font-bold text-[#1A1916] rounded-md uppercase tracking-wide">
                  {report.category}
                </span>
              )}
              {exportBadge && (
                <span className={`inline-flex items-center px-3 py-1.5 border text-xs font-bold rounded-md uppercase tracking-wide ${exportBadge.color}`}>
                  {exportBadge.label}
                </span>
              )}
            </div>
            {reportId != null && weekId != null && (
              <FavoriteButton
                reportId={reportId}
                weekId={weekId}
                isFavorited={isFavorited ?? false}
                className={`shrink-0 ${isFavorited ? "fill-[#16A34A] text-[#16A34A]" : "text-gray-300 hover:text-[#16A34A]"}`}
                iconClassName="w-8 h-8"
              />
            )}
          </div>

          <h1
            className="font-bold text-[#1A1916] leading-tight break-words mb-2"
            style={{
              fontSize: "clamp(1.5rem, 4cqw, 2.25rem)",
              textWrap: "balance",
            } as React.CSSProperties}
          >
            {report.translated_name || report.product_name}
          </h1>

          {report.product_name && (
            <p className="text-lg font-medium text-[#6B6860] line-clamp-2 mb-4">
              {report.product_name}
            </p>
          )}

          {(report.go_verdict?.trim() || report.composite_score != null) && (() => {
            const verdictStyleMap: Record<string, { bg: string; text: string; dot: string }> = {
              "GO":          { bg: "bg-[#F0FDF4] border border-[#16A34A]", text: "text-[#16A34A]", dot: "bg-[#16A34A]" },
              "CAUTIOUS GO": { bg: "bg-[#FFFBEB] border border-[#D97706]", text: "text-[#D97706]", dot: "bg-[#D97706]" },
              "NO GO":       { bg: "bg-[#FEF2F2] border border-[#DC2626]", text: "text-[#DC2626]", dot: "bg-[#DC2626]" },
            };
            const key = report.go_verdict?.trim().toUpperCase() ?? "";
            const style = verdictStyleMap[key] ?? { bg: "bg-[#F8F7F4] border border-[#E8E6E1]", text: "text-[#6B6860]", dot: "bg-[#9E9C98]" };

            return (
              <div className="flex items-center gap-3 mb-6">
                {report.go_verdict?.trim() && (
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-widest ${style.bg} ${style.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                    {report.go_verdict.trim()}
                  </span>
                )}
                {report.composite_score != null && (
                  <span className="text-xs font-bold text-[#9E9C98] tracking-wide">
                    {report.composite_score.toFixed(1)}
                    <span className="font-medium text-[#D5D3CE]"> / 10</span>
                    <span className="ml-2 text-[#9E9C98]">KoreaScout Intelligence Score</span>
                  </span>
                )}
              </div>
            );
          })()}

          <div className="mt-6 bg-[#F8F7F4] rounded-2xl p-6 border border-[#E8E6E1]">
            <div className="flex flex-col space-y-3">
              {report.kr_price != null && (
                <div>
                  <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-2">
                    Retail Price (KR Market)
                  </p>
                  <div className="flex items-baseline flex-wrap">
                    <span className="text-2xl md:text-3xl font-black text-[#1A1916] leading-none tracking-tighter">
                      KRW {Number(report.kr_price).toLocaleString()}
                    </span>
                    {usdPrice && (
                      <>
                        <span className="text-2xl md:text-3xl font-light text-[#D5D3CE] mx-4 leading-none">
                          |
                        </span>
                        <span className="text-2xl md:text-3xl font-black text-[#1A1916] leading-none tracking-tighter">
                          USD {usdPrice}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-[#9E9C98] font-semibold mt-2">
                    {rateLoading
                      ? "Fetching live rate..."
                      : `Ex. Rate: ${exchangeRate.toLocaleString()} KRW/USD (Daily fixed at ${rateDate} 09:00 KST)`}
                  </p>
                </div>
              )}

              {report.estimated_cost_usd != null && (
                <p className="text-sm font-medium text-[#9E9C98]">
                  Est. Wholesale: ~${report.estimated_cost_usd}
                  <span className="text-[#D97706] text-xs ml-1">⚠ Estimated</span>
                </p>
              )}

              <a
                href="#section-6"
                className="inline-flex items-center gap-2 bg-white border border-[#E8E6E1] px-3 py-2 rounded-md hover:border-[#16A34A] transition-colors cursor-pointer group w-fit"
              >
                <Lock className="w-3.5 h-3.5 text-[#9E9C98] group-hover:text-[#16A34A] transition-colors shrink-0" />
                <span className="text-xs font-bold text-[#6B6860] group-hover:text-[#16A34A] transition-colors">
                  Alpha members get verified supplier quotes
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {report.viability_reason?.trim() && (
        <div className="mt-8 bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] border-l-4 border-l-[#16A34A] p-6">
          <p className="text-sm font-semibold text-[#16A34A] uppercase tracking-widest mb-2">
            Why It&apos;s Trending
          </p>
          <p className="text-base text-[#3D3B36] leading-relaxed">
            {report.viability_reason}
          </p>
        </div>
      )}
    </section>
  );
}
```

---

## 3. types/database.ts — Complete `ScoutFinalReportsRow` Interface

```typescript
export interface ScoutFinalReportsRow {
  id: string;
  week_id: string;
  product_name: string;
  translated_name: string;
  image_url: string;
  ai_image_url: string | null;
  summary: string | null;
  consumer_insight: string | null;
  /** v1.3: optional product composition info (Section 1 accordion). May be null or absent on older rows. */
  composition_info?: string | null;
  /** v1.3: optional spec summary text block (Section 1 accordion). */
  spec_summary?: string | null;
  category: string;
  viability_reason: string;
  market_viability: number;
  competition_level: string;
  profit_multiplier: string;
  search_volume: string;
  mom_growth: string;
  gap_status: string;
  /** JSONB — 국가별 가격 { "US": "$24.99", ... } */
  global_price: Json | null;
  /** TEXT[] or comma-separated TEXT from pipeline */
  seo_keywords: string | string[] | null;
  export_status: string;
  hs_code: string | null;
  sourcing_tip: string | null;
  manufacturer_check: string | null;
  m_name: string | null;
  corporate_scale?: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  m_homepage: string | null;
  naver_link: string | null;
  wholesale_link?: string | null;
  global_site_url?: string | null;
  b2b_inquiry_url?: string | null;
  video_url: string | null;
  competitor_analysis_pdf: string | null;
  /** v1.2: 바이럴 숏폼 영상 URL */
  viral_video_url: string | null;
  published_at: string | null;
  free_list_at: string | null;
  is_premium: boolean;
  is_teaser: boolean;
  status: ReportStatus;
  created_at: string;
  /* ----- v1.3 신규 컬럼 (28개 중 선반영; 나머지는 마이그레이션 확정 후 추가) ----- */
  /** 한국 가격 (예: "12,000원") */
  kr_price?: string | null;
  /** Auto-calculated: kr_price in USD (trigger). */
  kr_price_usd?: number | null;
  /** Auto-calculated: estimated wholesale cost USD (trigger). */
  estimated_cost_usd?: number | null;
  /** Alpha: verified unit cost from supplier (admin input). */
  verified_cost_usd?: string | null;
  /** Alpha: note e.g. "undisclosed". */
  verified_cost_note?: string | null;
  /** Alpha: minimum order quantity. */
  moq?: string | null;
  /** Alpha: lead time. */
  lead_time?: string | null;
  /** 국가별 가격 상세 (JSONB). e.g. { us: { price: string }, ... } */
  global_prices?: Json | null;
  /** 플랫폼별 점수/지표 (JSONB) */
  platform_scores?: Json | null;
  /** WoW 성장률 (Section 3) */
  wow_rate?: string | null;
  /** Best platform recommendation (e.g. "Amazon FBA") */
  best_platform?: string | null;
  /** Seller Intelligence accordion */
  top_selling_point?: string | null;
  common_pain_point?: string | null;
  /** Hashtag pills, click to copy */
  viral_hashtags?: string[] | null;
  /* ----- Section 4 Social Proof & Trend Intelligence ----- */
  buzz_summary?: string | null;
  rising_keywords?: string[] | null;
  /** Korea local score 0–100 (Gap Analysis) */
  kr_local_score?: number | null;
  /** Global trend score 0–100 (Gap Analysis) */
  global_trend_score?: number | null;
  /** Gap index (e.g. 47). Can be derived or stored. */
  gap_index?: number | null;
  opportunity_reasoning?: string | null;
  trend_entry_strategy?: string | null;
  new_content_volume?: string | null;
  kr_evidence?: string | null;
  global_evidence?: string | null;
  growth_evidence?: string | null;
  kr_source_used?: string | null;
  growth_signal?: string | null;
  /* ----- Section 6 Export & Logistics Intel ----- */
  /** HS description text shown under hs_code */
  hs_description?: string | null;
  /** Hazmat JSONB status flags */
  hazmat_status?: Json | null;
  /** Dimensions in centimeters, e.g. "15 × 8 × 5" */
  dimensions_cm?: string | null;
  /** Billable weight (grams) used for shipping cost */
  billable_weight_g?: number | null;
  /** Shipping tier label, e.g. "Standard Parcel" */
  shipping_tier?: string | null;
  /** Comma-separated certificates, e.g. "FDA 510K, CE" */
  required_certificates?: string | null;
  /** Freeform logistics notes */
  shipping_notes?: string | null;
  sourcing_tip_logistics?: string | null;
  hazmat_summary?: string | null;
  can_oem?: boolean | null;
  /** Key risky ingredient to highlight */
  key_risk_ingredient?: string | null;
  /** Regulatory or status reasoning text */
  status_reason?: string | null;
  /** Actual physical weight (grams) */
  actual_weight_g?: number | null;
  /** Volumetric weight (grams) */
  volumetric_weight_g?: number | null;
  /* ----- Launch & Execution Kit / Section 6 신규 컬럼 ----- */
  /** Marketing assets (e.g. image pack, banner) URL */
  marketing_assets_url?: string | null;
  /** AI-generated detail/landing page links (URL or JSON array of URLs) */
  ai_detail_page_links?: string | null;
  /** When supplier pricing/contact was verified (ISO timestamp) */
  verified_at?: string | null;
  /** Sample order / sampling policy text */
  sample_policy?: string | null;
  /** Export or certification note for customs/compliance */
  export_cert_note?: string | null;
  /** Admin edit history log: { entries: [{ timestamp, changes: [{ field, before, after }] }] } */
  edit_history?: Json | null;
  composite_score?: number | null;
  go_verdict?: string | null;
}
```

---

## 4. FIELD_LABELS_KO — Complete Object (`app/admin/[id]/page.tsx`)

```typescript
const FIELD_LABELS_KO: Record<string, string> = {
  id: "ID",
  product_name: "제품명",
  translated_name: "번역명",
  category: "카테고리",
  kr_price: "한국가격(₩)",
  kr_price_usd: "USD가격",
  estimated_cost_usd: "추정도매원가",
  export_status: "수출상태",
  viability_reason: "시장성요약",
  image_url: "이미지URL",
  naver_link: "네이버링크",
  week_id: "주차ID",
  m_name: "제조사명",
  corporate_scale: "기업규모",
  contact_email: "문의이메일",
  contact_phone: "문의전화번호",
  m_homepage: "제조사홈페이지",
  wholesale_link: "도매문의링크",
  status: "상태",
  market_viability: "시장성점수",
  competition_level: "경쟁수준",
  gap_status: "갭상태",
  wow_rate: "WoW성장률",
  mom_growth: "MoM성장률",
  growth_evidence: "성장근거",
  profit_multiplier: "마진배수",
  top_selling_point: "핵심강점",
  common_pain_point: "소비자페인포인트",
  new_content_volume: "신규콘텐츠량",
  global_prices: "글로벌가격",
  buzz_summary: "버즈요약",
  kr_local_score: "국내로컬점수",
  global_trend_score: "글로벌트렌드점수",
  gap_index: "갭지수",
  billable_weight_g: "과금중량(g)",
  kr_evidence: "국내근거",
  global_evidence: "글로벌근거",
  kr_source_used: "국내출처",
  opportunity_reasoning: "기회논리",
  rising_keywords: "상승키워드",
  seo_keywords: "SEO키워드",
  viral_hashtags: "바이럴해시태그",
  platform_scores: "플랫폼점수",
  sourcing_tip: "소싱팁",
  hs_code: "HS코드",
  hs_description: "HS설명",
  status_reason: "상태사유",
  composition_info: "성분정보",
  spec_summary: "스펙요약",
  actual_weight_g: "실제중량(g)",
  volumetric_weight_g: "부피중량(g)",
  dimensions_cm: "치수(cm)",
  hazmat_status: "위험물여부",
  required_certificates: "필요인증",
  shipping_notes: "배송메모",
  verified_cost_usd: "검증된원가(USD)",
  verified_cost_note: "검증원가메모",
  verified_at: "검증일시",
  moq: "최소주문수량",
  lead_time: "리드타임",
  sample_policy: "샘플정책",
  export_cert_note: "수출인증메모",
  viral_video_url: "바이럴영상URL",
  video_url: "영상URL",
  marketing_assets_url: "마케팅자산URL",
  ai_detail_page_links: "AI상세페이지링크",
  published_at: "발행일시",
  go_verdict: "GO판정",
  composite_score: "종합점수",
  growth_signal: "성장시그널",
  search_volume: "검색볼륨",
  best_platform: "최적플랫폼",
  trend_entry_strategy: "진입전략",
  shipping_tier: "배송티어",
  key_risk_ingredient: "위험성분",
  hazmat_summary: "위험물요약",
  global_site_url: "글로벌사이트URL",
  b2b_inquiry_url: "B2B문의URL",
  can_oem: "OEM가능여부",
  ai_image_url: "AI이미지URL",
};
```

---

## 5. formKeys — Complete Array (`app/admin/[id]/page.tsx`)

```typescript
  const formKeys = [
    "product_name", "translated_name", "category", "kr_price", "export_status", "viability_reason",
    "image_url", "naver_link", "week_id", "m_name", "corporate_scale", "contact_email", "contact_phone", "m_homepage", "wholesale_link", "status",
    "market_viability", "competition_level", "gap_status", "gap_index", "billable_weight_g",
    "go_verdict", "composite_score", "growth_signal", "search_volume", "best_platform", "trend_entry_strategy",
    "shipping_tier", "key_risk_ingredient", "hazmat_summary", "global_site_url", "b2b_inquiry_url", "can_oem", "ai_image_url",
    "wow_rate", "mom_growth", "growth_evidence", "profit_multiplier", "top_selling_point", "common_pain_point",
    "new_content_volume", "global_prices", "buzz_summary", "kr_local_score", "global_trend_score", "kr_evidence",
    "global_evidence", "kr_source_used", "opportunity_reasoning", "rising_keywords", "seo_keywords", "viral_hashtags",
    "platform_scores", "sourcing_tip", "hs_code", "hs_description", "status_reason", "composition_info", "spec_summary",
    "actual_weight_g", "volumetric_weight_g", "dimensions_cm", "hazmat_status", "required_certificates", "shipping_notes",
    "verified_cost_usd", "verified_cost_note", "verified_at", "moq", "lead_time", "sample_policy", "export_cert_note",
    "viral_video_url", "video_url", "marketing_assets_url", "ai_detail_page_links", "published_at",
  ];
```

---

## 6. API Route — Complete `app/api/admin/reports/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { ScoutFinalReportsRow } from "@/types/database";

function assertAdmin(request: NextRequest): boolean {
  const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
  const cookie = request.cookies.get(cookieName);
  return cookie?.value === "authenticated";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("scout_final_reports")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "Not found" },
        { status: error?.code === "PGRST116" ? 404 : 500 }
      );
    }
    return NextResponse.json(data as ScoutFinalReportsRow);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  let body: Partial<ScoutFinalReportsRow>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id: _id, created_at: _ca, ...updates } = body as Partial<ScoutFinalReportsRow> & { id?: string; created_at?: string };
  if ("kr_price_usd" in updates) delete (updates as Record<string, unknown>).kr_price_usd;
  if ("estimated_cost_usd" in updates) delete (updates as Record<string, unknown>).estimated_cost_usd;

  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("scout_final_reports")
      .update(updates)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const weekId = updates.week_id;
    if (typeof weekId === "string" && weekId) {
      revalidatePath(`/weekly/${weekId}/${id}`);
    }
    revalidatePath("/weekly");
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update" },
      { status: 500 }
    );
  }
}
```

---

## 7. Weekly Page Card — JSX Where `product_name` Appears

`app/weekly/[weekId]/page.tsx` — `product_name`은 아래 `<h2>`의 폴백으로만 사용됩니다.

```tsx
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
```

(원본 파일에서 해당 카드는 `products.map` 내부, 약 150–214행대.)

---

## 8. Impact Analysis — Minimal Code Diffs (if `naver_product_name` Exists in DB)

**전제:** 아래 diff는 **TypeScript/리액트 측 최소 변경**이며, **Supabase에 `naver_product_name` 컬럼이 이미 존재한다**는 가정입니다. 컬럼 추가는 DB 작업이므로 본 문서 범위에서 **코드로 수행하지 않습니다.**

**추가 참고 (마스킹):** `app/weekly/[weekId]/[id]/page.tsx`는 `ProductIdentity`에 **마스킹되지 않은** `report`를 넘깁니다. `maskReportByTier`는 `naver_link` 등은 free/standard에서 null 처리하지만 `product_name`은 건드리지 않습니다. 네이버 상품명을 `naver_link`와 동일한 민감도로 취급하려면 `lib/auth-server.ts`의 `nullForFreeAndStandard`에 `naver_product_name`을 추가하는 **별도 정책 결정**이 필요합니다.

### 8.1 `types/database.ts`

**Before (발췌, `product_name` 직후):**

```typescript
  product_name: string;
  translated_name: string;
```

**After:**

```typescript
  product_name: string;
  /** Naver shopping catalog title (optional). */
  naver_product_name?: string | null;
  translated_name: string;
```

---

### 8.2 `FIELD_LABELS_KO` (`app/admin/[id]/page.tsx`)

**Before:**

```typescript
  product_name: "제품명",
  translated_name: "번역명",
```

**After:**

```typescript
  product_name: "제품명",
  naver_product_name: "네이버상품명",
  translated_name: "번역명",
```

---

### 8.3 `formKeys` (`app/admin/[id]/page.tsx`)

**Before (첫 줄):**

```typescript
    "product_name", "translated_name", "category", "kr_price", "export_status", "viability_reason",
```

**After:**

```typescript
    "product_name", "naver_product_name", "translated_name", "category", "kr_price", "export_status", "viability_reason",
```

---

### 8.4 `components/ProductIdentity.tsx`

**Before (`product_name` 블록 직후):**

```tsx
          {report.product_name && (
            <p className="text-lg font-medium text-[#6B6860] line-clamp-2 mb-4">
              {report.product_name}
            </p>
          )}

          {(report.go_verdict?.trim() || report.composite_score != null) && (() => {
```

**After:**

```tsx
          {report.product_name && (
            <p className="text-lg font-medium text-[#6B6860] line-clamp-2 mb-4">
              {report.product_name}
            </p>
          )}

          {report.naver_product_name?.trim() && (
            <p className="text-sm text-[#9E9C98] mb-4">
              {report.naver_product_name}
            </p>
          )}

          {(report.go_verdict?.trim() || report.composite_score != null) && (() => {
```

---

### 8.5 `app/admin/[id]/page.tsx` — Product Identity 섹션 입력 ( `product_name` 필드 다음 )

**Before:**

```tsx
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Product Name (제품명)</label>
                <input
                  value={formData.product_name ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, product_name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Translated Name (번역명)</label>
```

**After:**

```tsx
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Product Name (제품명)</label>
                <input
                  value={formData.product_name ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, product_name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Naver Product Name (네이버상품명)</label>
                <input
                  value={formData.naver_product_name ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, naver_product_name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Translated Name (번역명)</label>
```

---

### 8.6 `app/api/admin/reports/[id]/route.ts`

**변경 불필요.** GET은 `.select("*")`, PATCH는 `Partial<ScoutFinalReportsRow>` 전체를 업데이트에 전달합니다. DB 컬럼이 존재하면 PostgREST가 처리합니다.

---

### 8.7 (선택) `data/sampleReportData.ts`

샘플 페이지 타입 일치를 위해 `naver_product_name: null` 또는 문자열을 한 줄 추가할 수 있습니다. 필수는 아님(필드가 optional이면).

---

### 8.8 (선택) `app/weekly/[weekId]/page.tsx`

주차 카드에 네이버명을 보여주지 않으면 **select 문자열과 JSX 변경 없음**. 카드 제목 옆에 표시하려면 `.select(...)`에 `naver_product_name` 추가 + JSX 추가가 필요합니다.

---

## 9. Every `supabase.from(...).select(...)` (TypeScript)

| File | Line | `.select(...)` | `naver_product_name` 추가 필요? |
|------|------|----------------|----------------------------------|
| `app/api/admin/reports/route.ts` | 25 | `"id, product_name, week_id, market_viability, status, created_at"` | **선택** — 관리자 목록에 네이버명 컬럼을 넣을 때만 |
| `app/api/admin/reports/[id]/route.ts` | 24 | `"*"` | **아니오** — 컬럼이 DB에 있으면 자동 포함 |
| `app/weekly/[weekId]/[id]/page.tsx` | 36 | `"*"` | **아니오** |
| `app/weekly/[weekId]/[id]/page.tsx` | 43 | `"id"` | **아니오** |
| `app/weekly/[weekId]/[id]/page.tsx` | 47 | `"week_label, published_at"` (`weeks`) | **아니오** |
| `app/weekly/[weekId]/[id]/page.tsx` | 51 | `"report_id"` (`user_favorites`) | **아니오** |
| `app/weekly/[weekId]/[id]/page.tsx` | 59 | `"week_id, published_at"` (`weeks`) | **아니오** |
| `app/weekly/[weekId]/[id]/page.tsx` | 67 | `"week_id"` (`weeks`) | **아니오** |
| `app/weekly/[weekId]/page.tsx` | 24 | 주차 메타 (`weeks`) | **아니오** |
| `app/weekly/[weekId]/page.tsx` | 33 | `"week_id"` | **아니오** |
| `app/weekly/[weekId]/page.tsx` | 50 | `"week_id, published_at"` | **아니오** |
| `app/weekly/[weekId]/page.tsx` | 110 | `"id, product_name, translated_name, image_url, category, viability_reason, market_viability, is_teaser"` | **조건부** — 이 목록에서 `naver_product_name`을 사용할 때만 문자열에 추가 |
| `app/weekly/[weekId]/page.tsx` | 118 | `"report_id"` | **아니오** |
| `app/weekly/page.tsx` | 75 | `weeks` + `scout_final_reports(count)` | **아니오** |
| `app/weekly/page.tsx` | 93 | `"week_id"` | **아니오** |
| `app/account/page.tsx` | 29 | `"*", { count: "exact", head: true }` | **아니오** (카운트만) |
| `app/account/page.tsx` | 34 | `"report_id"` | **아니오** |
| `app/account/page.tsx` | 51 | `"id, week_id, translated_name, image_url, market_viability, category, viability_reason"` | **조건부** — 즐겨찾기 카드에 네이버명 표시 시 |
| `app/page.tsx` | 53 | `"*", { count: "exact", head: true }` | **아니오** |
| `app/pricing/page.tsx` | 22 | `"*", { count: "exact", head: true }` | **아니오** |
| `app/actions/favorites.ts` | 26 | `"report_id"` | **아니오** |
| `components/layout/Header.tsx` | 12 | `"tier"` (`profiles`) | **아니오** |
| `components/IntelligenceTicker.tsx` | 16 | `"translated_name, product_name, market_viability, gap_index, profit_multiplier"` | **조건부** — 티커에 네이버명을 넣을 때만 |
| `lib/auth-server.ts` | 26 | `"tier, subscription_start_at"` (`profiles`) | **아니오** |

**요약:** `select("*")` 또는 리포트와 무관한 테이블만 조회하는 호출은 **코드 변경 없이** 새 컬럼을 받을 수 있습니다(DB에 컬럼이 있을 때). **명시적 컬럼 목록**을 쓰는 곳은, 해당 필드를 **읽어 UI에 쓸 때만** `naver_product_name`을 추가하면 됩니다.

---

## Document integrity

- 본 파일은 요청 시점의 저장소 내용을 반영했습니다.
- `ProductIdentity.tsx` 원본 **254줄 전부**를 섹션 2에 포함했습니다.
- 파일 트리는 `node_modules`, `.git`, `.next`를 제외했습니다.
