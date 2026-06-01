# KoreaScout Codebase Scan Report

**Scan date:** 2026-06-01  
**Project:** k-productscout (KoreaScout)  
**Framework:** Next.js 16 App Router + React 19 + Supabase  
**Mode:** Read-only scan — no source files modified

---

## Table of Contents

1. [Full Project Structure](#1-full-project-structure)
2. [Admin Page](#2-admin-page)
3. [All API Routes](#3-all-api-routes)
4. [Dependencies](#4-dependencies-packagejson)
5. [Design System](#5-design-system)
6. [Database](#6-database)
7. [Existing Features in Admin](#7-existing-features-in-admin)

---


## 1. FULL PROJECT STRUCTURE

### 1.1 Key Directory Locations

| Expected path | Actual location | Notes |
|---------------|-----------------|-------|
| pp/ | c:\k-productscout\app\ | Next.js App Router — all routes/pages |
| components/ | c:\k-productscout\components\ | Shared React components (NOT under app/) |
| pages/ | **Does not exist** | Legacy Pages Router not used |
| pi/ | c:\k-productscout\app\api\ | API route handlers (Next.js Route Handlers) |
| lib/ | c:\k-productscout\lib\ | Server utilities, Supabase clients |
| 	ypes/ | c:\k-productscout\types\ | TypeScript DB types |
| supabase/ | c:\k-productscout\supabase\migrations\ | SQL migrations |
| src/ | c:\k-productscout\src\config\ | Minimal — only pricing config |
| data/ | c:\k-productscout\data\ | Static sample report data |
| public/ | c:\k-productscout\public\ | Static assets |
| scripts/ | c:\k-productscout\scripts\ | **Empty directory** |

### 1.2 Complete Directory Tree

> Excludes: 
ode_modules/, .git/, .next/

    .cursorrules
    .env.local
    .git
    .gitignore
    .next
    _docs
    _docs\_file_tree_naver_audit.txt
    _docs\ACCESS_CONTROL_AUDIT.md
    _docs\ADMIN_AUDIT.md
    _docs\ADMIN_AUDIT_V2.md
    _docs\admin_full_code_extract.md
    _docs\admin_id_page_full.md
    _docs\admin_id_page_raw.md
    _docs\admin_middle_section.md
    _docs\ADMIN_REDESIGN_PLAN.md
    _docs\admin_sync_audit.md
    _docs\archive
    _docs\archive\03_AUDIT_PROJECT_STATE.md
    _docs\archive\04_AUDIT_DARK_REMNANTS.md
    _docs\archive\05_PHASE7B_HIT_LIST.md
    _docs\archive\06_TYPOGRAPHY_AUDIT_REPORT.md
    _docs\archive\07_POLISHING_AUDIT_REPORT.md
    _docs\archive\08_SECURITY_AUDIT_REPORT.md
    _docs\archive\09_PIXEL_POLISH_AUDIT.md
    _docs\archive\10_LUXURY_UI_AUDIT.md
    _docs\archive\ACCOUNT_PAGE_FAVORITES_READINESS_AUDIT.md
    _docs\archive\DESIGN_SYSTEM_SECTIONS_1_2_AUDIT.md
    _docs\archive\LANDING_PAGE_ASIS_AUTOPSY.md
    _docs\archive\LANDING_TYPO_POLISH_LOG.md
    _docs\archive\LANDING_V5_BUILD_LOG.md
    _docs\archive\PRICING_ALIGNMENT_LOG.md
    _docs\archive\PRICING_PAGE_AUDIT_REPORT.md
    _docs\archive\PROJECT_3DATA_MAP.md
    _docs\archive\PROJECT_4UI_STRATEGY.md
    _docs\archive\PROJECT_CURRENT_DESIGN.md
    _docs\archive\SECTION_4_FORENSIC_AUDIT_REPORT.md
    _docs\archive\SECTION_5_DEEP_FORENSIC_AUDIT_REPORT.md
    _docs\archive\SECTION_5_EXPORT_LOGISTICS_DATA_REPORT.md
    _docs\archive\SECTION_5_FORENSIC_AUDIT_REPORT.md
    _docs\archive\SECTION_6_FORENSIC_AUDIT_REPORT.md
    _docs\archive\SECTION_6_MEDIA_VAULT_DIAGNOSTIC.md
    _docs\archive\WEEKLY_PAGE_ARCHITECTURE_AUDIT_REPORT.md
    _docs\audit_report.md
    _docs\AUTH_SERVER.md
    _docs\cleanup_audit.md
    _docs\CURSOR_WORK2_AUDIT.md
    _docs\DESIGN_SECTION_AUDIT.md
    _docs\faq-audit.md
    _docs\FOOTER_LEGAL_SCAN_REPORT.md
    _docs\FULL_CODE_EXTRACT.md
    _docs\GLOBAL_MARKET_PROOF_AUDIT.md
    _docs\GLOBAL_PRICES_AUDIT.md
    _docs\global_prices_full_audit.md
    _docs\GLOBAL_PRICING_AUDIT_REPORT.md
    _docs\GroupBBrokerSection.md
    _docs\HERO_COPY_MOBILE_AUDIT.md
    _docs\intelligence-pipeline-audit.md
    _docs\LABEL_AUDIT.md
    _docs\launch_audit.md
    _docs\LOGIN_PAGE_AUTH_AUDIT.md
    _docs\LOGOUT_BUG_AUDIT.md
    _docs\MarketIntelligence.md
    _docs\NAVER_PRODUCT_NAME_IMPLEMENTATION_AUDIT.md
    _docs\PAYWALL_AUDIT.md
    _docs\pipeline-css-audit.md
    _docs\PRODUCT_DETAIL_PAGE_FULL_CODE_EXTRACT.md
    _docs\rls_audit.md
    _docs\sample_system_audit.md
    _docs\SECTION_FULL_AUDIT.md
    _docs\section-order-audit.md
    _docs\section-order-audit2.md
    _docs\SourcingIntel.md
    _docs\standard
    _docs\standard\01_CORE_SPEC.md
    _docs\standard\02_DESIGN_SYSTEM.md
    _docs\standard\02_PRICING_STRATEGY.md
    _docs\standard\04_ACCESS_CONTROL_LOGIC.md
    _docs\standard\10_LUXURY_UI_AUDIT.md
    _docs\standard\DATA_SCHEMA_RECON_REPORT.md
    _docs\standard\PROJECT_2DB_STATUS.md
    _docs\standard\PROJECT_2STATUS.md
    _docs\standard\RLS_SECURITY_HARDENING_GUIDE.md
    _docs\standard\SAMPLE_REPORT_AUDIT.md
    _docs\SupplierContact.md
    _docs\thumbnail_audit.md
    _docs\timewidget-audit.md
    _docs\timewidget-mobile-audit.md
    _docs\UI_PREMIUM_AUDIT_REPORT.md
    _docs\URL_ACCESS_AUDIT.md
    _docs\vercel_deploy_audit.md
    _docs\WATERMARK_AUDIT.md
    _docs\WEEKLY_DETAIL_PAGE.md
    _docs\WEEKLY_LIST_PAGE.md
    _docs\WEEKLY_PAGE_CURRENT_STATE_REPORT.md
    _docs\섹션1 최종.png
    _docs\섹션2최종.png
    _docs\섹션3최종.png
    _docs\섹션4 최종.png
    _docs\섹션5 최종.png
    _docs\중복.csv
    _docs\중복_비교분석.md
    _temp_page.txt
    ADMIN_REORGANIZATION_PLAN.md
    app
    app\account
    app\account\page.tsx
    app\account\password
    app\account\password\page.tsx
    app\actions
    app\actions\favorites.ts
    app\admin
    app\admin\[id]
    app\admin\[id]\page.tsx
    app\admin\login
    app\admin\login\page.tsx
    app\admin\page.tsx
    app\api
    app\api\admin
    app\api\admin\auth
    app\api\admin\auth\route.ts
    app\api\admin\logout
    app\api\admin\logout\route.ts
    app\api\admin\reports
    app\api\admin\reports\[id]
    app\api\admin\reports\[id]\route.ts
    app\api\admin\reports\route.ts
    app\api\admin\site-config
    app\api\admin\site-config\route.ts
    app\api\billing
    app\api\billing\portal
    app\api\billing\portal\route.ts
    app\api\landing
    app\api\landing\ticker
    app\api\webhook
    app\api\webhook\route.ts
    app\api\webhooks
    app\api\webhooks\lemonsqueezy
    app\api\webhooks\lemonsqueezy\route.ts
    app\apple-icon.png
    app\auth
    app\auth\callback
    app\auth\callback\route.ts
    app\ConditionalRootContent.tsx
    app\error.tsx
    app\favicon.ico
    app\forgot-password
    app\forgot-password\page.tsx
    app\globals.css
    app\icon.png
    app\jisun
    app\jisun\layout.tsx
    app\jisun\page.tsx
    app\layout.tsx
    app\legal
    app\legal\privacy
    app\legal\privacy\page.tsx
    app\legal\privacy-kr
    app\legal\privacy-kr\page.tsx
    app\legal\terms
    app\legal\terms\page.tsx
    app\login
    app\login\page.tsx
    app\not-found.tsx
    app\page.tsx
    app\pricing
    app\pricing\page.tsx
    app\reset-password
    app\reset-password\page.tsx
    app\sample-report
    app\sample-report\page.tsx
    app\signup
    app\signup\page.tsx
    app\signup\verify
    app\signup\verify\page.tsx
    app\sitemap.ts
    app\weekly
    app\weekly\[weekId]
    app\weekly\[weekId]\[id]
    app\weekly\[weekId]\[id]\page.tsx
    app\weekly\[weekId]\page.tsx
    app\weekly\latest
    app\weekly\latest\page.tsx
    app\weekly\MonthAccordion.tsx
    app\weekly\page.tsx
    components
    components\admin
    components\admin\AiPageLinksHelper.tsx
    components\admin\GlobalPricesHelper.tsx
    components\admin\HazmatCheckboxes.tsx
    components\AlphaPlusJoinWaitlist.tsx
    components\AlphaPlusWaitlistModal.tsx
    components\AlphaVaultPreview.tsx
    components\BrokerEmailDraft.tsx
    components\CheckoutButton.tsx
    components\ContactCard.tsx
    components\CopyButton.tsx
    components\DonutGauge.tsx
    components\DynamiteFuseSection.tsx
    components\ExpandableText.tsx
    components\FaqAccordion.tsx
    components\FavoriteButton.tsx
    components\GlobalPricingTable.tsx
    components\GoogleSignInButton.tsx
    components\GrandEntrance.tsx
    components\GroupBBrokerSection.tsx
    components\HazmatBadges.tsx
    components\Hero.tsx
    components\HeroCTA.tsx
    components\IntelligencePipeline.tsx
    components\IntelligenceTicker.tsx
    components\landing
    components\LandingPipelineSneakPeek.tsx
    components\LandingTimeWidget.tsx
    components\LaunchKit.tsx
    components\layout
    components\layout\ClientLeftNav.tsx
    components\layout\Header.tsx
    components\layout\HeaderNavClient.tsx
    components\layout\HeaderShellClient.tsx
    components\LockedSection.tsx
    components\Logo.tsx
    components\LogoutButton.tsx
    components\ManageBillingButton.tsx
    components\modals
    components\modals\ContactModal.tsx
    components\PriceComparisonBar.tsx
    components\ProductIdentity.tsx
    components\RemoveFavoriteButton.tsx
    components\report
    components\report\constants.ts
    components\report\index.ts
    components\report\MarketIntelligence.tsx
    components\report\SocialProofTrendIntelligence.tsx
    components\report\SourcingIntel.tsx
    components\report\SupplierContact.tsx
    components\report\TrendSignalDashboard.tsx
    components\report\utils.ts
    components\ScrollToIdButton.tsx
    components\SplashScreen.tsx
    components\StatusBadge.tsx
    components\TagCloud.tsx
    components\ui
    components\ui\Badge.tsx
    components\ui\Button.tsx
    components\ui\Card.tsx
    components\ui\index.ts
    components\ui\Input.tsx
    components\ui\KeywordPill.tsx
    components\ui\LockedValue.tsx
    components\ui\PaywallOverlay.tsx
    components\ViralHashtagPills.tsx
    components\ZombieWatermark.tsx
    DAILY_PRICE_INVESTIGATION.md
    data
    data\sampleReportData.ts
    docs
    docs\63_MASTER_LIST_INTEGRITY_AUDIT_REPORT.md
    docs\GLOBAL_MARKET_AVAILABILITY_AUDIT_REPORT.md
    docs\global_prices_code_investigation.md
    docs\LAUNCH_KIT_SUPPLIER_CONTACT_AUDIT_REPORT.md
    docs\PDP_FIELD_INSERTION_AUDIT_REPORT.md
    docs\PDP_TECHNICAL_AUDIT_REPORT.md
    docs\PRODUCT_DETAIL_PAGE_DB_MAPPING_REPORT.md
    env_check.txt
    eslint.config.mjs
    KoreaScout_LOGO_V2.png
    KoreaScout_LOGO_V3.png
    KoreaScout_LOGO-preview.png
    LANDING_PAGE_INVESTIGATION.md
    landing_pricing.txt
    lemonsqueezy.txt
    lib
    lib\auth-server.ts
    lib\supabase
    lib\supabase\admin.ts
    lib\supabase\client.ts
    lib\supabase\middleware.ts
    lib\supabase\server.ts
    lib\week-access.ts
    locked_components.txt
    middleware.ts
    next.config.ts
    next-env.d.ts
    node_modules
    package.json
    package-lock.json
    pdp_files.txt
    postcss.config.mjs
    pricing_files.txt
    PRICING_PAGE_INVESTIGATION.md
    PRINT_CSS_AUDIT.md
    project_audit.md
    public
    public\file.svg
    public\globe.svg
    public\images
    public\images\capture.png
    public\images\Gemini_Generated_Image_x9yjm1x9yjm1x9yj.png
    public\images\Gemini_Generated_Image_yqwjs9yqwjs9yqwj.png
    public\images\k_symbol.png
    public\images\k_symbol_v2.png
    public\images\KoreaScout.png
    public\images\KoreaScout_LOGO.png
    public\images\KoreaScout_LOGO_V3.png
    public\images\KoreaScout_Logo원본.png
    public\images\noise-search.png
    public\images\skin1004.png
    public\images\제목 없는 디자인 (1).png
    public\images\제목 없는 디자인.png
    public\next.svg
    public\og-image.png
    public\robots.txt
    public\vercel.svg
    public\videos
    public\videos\hero.mp4
    public\videos\hero_final.mp4
    public\videos\hero_탈락.mp4
    public\videos\hero_텍스트위치수정본.mp4
    public\videos\hero이전버전.mp4
    public\videos\soldout.mp4
    public\window.svg
    README.md
    round1_code_context.txt
    round1_financial.txt
    ROUND1_INVESTIGATION.md
    round1_verified_cost.txt
    round2_code_context.txt
    round2_compliance.txt
    ROUND2_INVESTIGATION.md
    round2_pricing_button.txt
    round3_context.txt
    ROUND3_INVESTIGATION.md
    round3_sample.txt
    round4_assets.txt
    round4_context.txt
    round4_db_fields.txt
    ROUND4_INVESTIGATION.md
    sample-report-forensic-analysis.md
    scan_account.md
    scan_admin_full.md
    scan_auth.md
    scan_db.md
    scan_header.md
    scan_header2.md
    scan_header3.md
    scan_header4.md
    scan_report.md
    scan_result.md
    scan_result2.md
    scan_weekly.md
    scan_weekly_order.md
    scripts
    sourcing_tip.txt
    src
    src\config
    src\config\pricing.ts
    supabase
    supabase\.temp
    supabase\.temp\cli-latest
    supabase\migrations
    supabase\migrations\001_phase2_schema.sql
    supabase\migrations\002_product_identity_pricing.sql
    supabase\migrations\003_sync_from_live_audit.sql
    TIER_INVESTIGATION_REPORT.md
    tier_labels.txt
    tier_scan.txt
    tier_vars.txt
    tsconfig.json
    tsconfig.tsbuildinfo
    type_defs.txt
    types
    types\database.ts
    verified_cost.txt

---

## 2. ADMIN PAGE

### 2.1 Admin-Related Files (path + content search)

#### Files with "admin" in path

| File | Role |
|------|------|
| pp/admin/page.tsx | Admin dashboard — report list |
| pp/admin/login/page.tsx | Password login gate |
| pp/admin/[id]/page.tsx | Report edit form (1656 lines) |
| pp/api/admin/auth/route.ts | POST password auth → cookie |
| pp/api/admin/logout/route.ts | POST logout → clear cookie |
| pp/api/admin/reports/route.ts | GET report list |
| pp/api/admin/reports/[id]/route.ts | GET/PATCH single report |
| pp/api/admin/site-config/route.ts | GET/POST site_config keys |
| components/admin/GlobalPricesHelper.tsx | Global prices JSON editor |
| components/admin/HazmatCheckboxes.tsx | Hazmat flags editor |
| components/admin/AiPageLinksHelper.tsx | YouTube reference URLs editor |
| lib/supabase/admin.ts | Service-role Supabase client |
| middleware.ts | Protects /admin/* routes |

#### Other files referencing admin (content)

- middleware.ts — cookie gate for /admin
- 	ypes/database.ts — edit_history, erified_cost_usd admin fields
- pp/api/billing/portal/route.ts — uses createServiceRoleClient from admin lib
- pp/api/webhooks/lemonsqueezy/route.ts — uses service role client
- Multiple _docs/* audit files

### 2.2 Admin Routes (URLs)

| URL | File | Component |
|-----|------|-----------|
| /admin/login | pp/admin/login/page.tsx | AdminLoginPage |
| /admin | pp/admin/page.tsx | AdminPage |
| /admin/[id] | pp/admin/[id]/page.tsx | AdminEditPage |

**Auth:** Cookie kps_admin_session (or ADMIN_COOKIE_NAME env). Value must be "authenticated". Set by POST /api/admin/auth with ADMIN_PASSWORD.

### 2.3 Navigation / Tabs Structure

Admin has **no tab bar**. Navigation flow:

`
/admin/login  →  (password)  →  /admin  →  (click row)  →  /admin/[id]
                     ↑                              │
                     └──────── Logout ──────────────┘
`

**List page (/admin):**
- Header: "KoreaScout Admin" + Logout button
- Filters: Week dropdown, Status dropdown (All / Draft / Live)
- Table columns: ID, Week, Product Name, Score, Status, Action (Edit →)

**Edit page (/admin/[id]):**
- Sticky header: Back to List | Product name | Sample toggle | Status select | Save Changes
- **Collapsible accordion sections** (all default closed):
  - **s1** — Product Identity
  - **s2** — Trend Signal Dashboard
  - **s3** — Market Intelligence
  - **s4** — Social Proof & Trend Intelligence
  - **s5** — Export & Logistics Intel
  - **s7** — Global Market Prices (rendered before s6a in DOM)
  - **s6a** — Launch & Execution Kit
  - **s6b** — Brand Intel
  - **s6c** — Media & Reference Assets
- **Edit History** table (always visible, not collapsible)
- **Save confirmation modal** (overlay dialog with diff list)

### 2.4 Imports by Admin Page

#### pp/admin/page.tsx
```tsx
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
```

#### pp/admin/login/page.tsx
```tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
```

#### pp/admin/[id]/page.tsx
```tsx
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { ScoutFinalReportsRow } from "@/types/database";
import { GlobalPricesHelper } from "@/components/admin/GlobalPricesHelper";
import { HazmatCheckboxes } from "@/components/admin/HazmatCheckboxes";
import { AiPageLinksHelper } from "@/components/admin/AiPageLinksHelper";
```

#### components/admin/GlobalPricesHelper.tsx
```tsx
import { useState, useEffect, useCallback } from "react";
```

#### components/admin/HazmatCheckboxes.tsx
```tsx
import { useState, useEffect } from "react";
```

#### components/admin/AiPageLinksHelper.tsx
```tsx
import { useState, useEffect } from "react";
```

### 2.5 Edit Page — All Sections & Fields Rendered

#### Section s1 — Product Identity
- id (read-only), image_url (+ preview), ai_image_url (+ preview)
- product_name, naver_product_name, translated_name, category
- kr_price, kr_price_usd (read-only auto), estimated_cost_usd (read-only auto)
- export_status (Green/Yellow/Red), viability_reason, go_verdict, composite_score (read-only)
- naver_link, week_id

#### Section s2 — Trend Signal Dashboard
- market_viability (0–100), competition_level (Low/Medium/High)
- growth_evidence, growth_signal
- gap_status (Blue Ocean/Emerging/Competitive/Saturated)
- platform_scores (JSON textarea), new_content_volume, opportunity_reasoning

#### Section s3 — Market Intelligence
- profit_multiplier, strategy_price, top_selling_point, common_pain_point
- search_volume, mom_growth, wow_rate, best_platform

#### Section s4 — Social Proof & Trend Intelligence
- buzz_summary, kr_local_score, global_trend_score, gap_index (auto)
- kr_evidence, global_evidence, kr_source_used
- rising_keywords (5 inputs), seo_keywords (5 inputs), viral_hashtags (5 inputs)
- Scout Strategy Report Steps 1–3 (sourcing_tip partial edit)
- trend_entry_strategy

#### Section s5 — Export & Logistics Intel
- hs_code, hs_description, status_reason, composition_info, spec_summary
- actual_weight_g, volumetric_weight_g, billable_weight_g (auto max)
- dimensions_cm, hazmat_status (HazmatCheckboxes), required_certificates
- shipping_notes, shipping_tier, key_risk_ingredient, hazmat_summary
- Compliance & Logistics Strategy Steps 4–5 (sourcing_tip partial edit)

#### Section s7 — Global Market Prices
- global_prices via GlobalPricesHelper (US/UK/EU/JP/SEA/UAE regions)

#### Section s6a — Launch & Execution Kit
- m_name, corporate_scale, contact_email, contact_phone, m_homepage
- wholesale_link, global_site_url, b2b_inquiry_url

#### Section s6b — Brand Intel
- naver_link, sample policy URL auto-generator (Daiso → Delivered.co.kr)
- sample_policy, export_cert_note, can_oem
- CEO Direct Input: verified_cost_usd, verified_cost_note, verified_at, moq, lead_time

#### Section s6c — Media & Reference Assets
- ai_detail_page_links (AiPageLinksHelper, max 5 YouTube URLs)
- video_url, video_url_2, video_url_3

#### Edit History
- Table from edit_history.entries JSONB: timestamp, field (KO label), before, after

#### Header controls (outside sections)
- SampleToggle → site_config sample_product_id
- status select: published | hidden
- Save Changes → diff modal → PATCH

### 2.6 Complete Source Code — Admin Files


#### `app\admin\page.tsx`

```tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ReportRow = {
  id: string;
  product_name: string | null;
  week_id: string;
  market_viability: number | null;
  status: string | null;
  created_at: string;
};

function formatWeek(weekId: string): string {
  const m = weekId.match(/^(\d{4})-W?(\d+)$/i);
  if (m) return `W${m[2]}-${m[1]}`;
  return weekId;
}

export default function AdminPage() {
  const router = useRouter();
  const [list, setList] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekFilter, setWeekFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/reports", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setList(Array.isArray(data) ? data : []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const weeks = useMemo(() => {
    const set = new Set(list.map((r) => r.week_id).filter(Boolean));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [list]);

  const filtered = useMemo(() => {
    return list.filter((row) => {
      if (weekFilter && row.week_id !== weekFilter) return false;
      if (statusFilter === "Draft") return row.status !== "published";
      if (statusFilter === "Live") return row.status === "published";
      return true;
    });
  }, [list, weekFilter, statusFilter]);

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
      redirect: "manual",
    });
    window.location.href = "/admin/login";
  }

  return (
    <div className="bg-[#F8F7F4] min-h-screen">
      <header className="bg-white border-b border-[#E8E6E1] px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#1A1916]">KoreaScout Admin</span>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-[#9E9C98] hover:text-[#1A1916] transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="px-6 py-3 flex items-center gap-4">
        <select
          value={weekFilter}
          onChange={(e) => setWeekFilter(e.target.value)}
          className="bg-white border border-[#E8E6E1] rounded-md px-3 py-2 text-sm text-[#1A1916] focus:border-[#16A34A] outline-none"
        >
          <option value="">All Weeks</option>
          {weeks.map((w) => (
            <option key={w} value={w}>
              {formatWeek(w)}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-[#E8E6E1] rounded-md px-3 py-2 text-sm text-[#1A1916] focus:border-[#16A34A] outline-none"
        >
          <option value="">All</option>
          <option value="Draft">Draft</option>
          <option value="Live">Live</option>
        </select>
      </div>

      <div className="mx-6 bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#6B6860] text-sm">Loading…</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F7F4] border-b border-[#E8E6E1]">
                <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">ID</th>
                <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">Week</th>
                <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">Product Name</th>
                <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">Score</th>
                <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => router.push(`/admin/${row.id}`)}
                  className="border-b border-[#E8E6E1] hover:bg-[#F8F7F4] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-[#9E9C98]">
                    {row.id.slice(0, 6)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-[#F2F1EE] text-[#6B6860] text-xs font-medium px-2 py-0.5 rounded">
                      {formatWeek(row.week_id)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-[#1A1916]">
                    {row.product_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#3D3B36] font-mono">
                    {row.market_viability != null ? row.market_viability : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        row.status === "published"
                          ? "bg-[#DCFCE7] text-[#16A34A] text-xs font-medium px-2.5 py-1 rounded-full"
                          : "bg-[#FEE2E2] text-[#DC2626] text-xs font-medium px-2.5 py-1 rounded-full"
                      }
                    >
                      {row.status === "published" ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/${row.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-[#16A34A] hover:text-[#15803D] font-medium transition-colors"
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
          <div className="p-8 text-center text-[#6B6860] text-sm">
            No reports match the filters.
          </div>
        )}
      </div>
    </div>
  );
}

```

#### `app\admin\login\page.tsx`

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Incorrect password. Try again.");
        return;
      }
      router.push("/admin");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#F8F7F4] min-h-screen flex items-start justify-center pt-40">
      <div className="max-w-sm mx-auto w-full px-4">
        <div className="bg-white border border-[#E8E6E1] rounded-2xl p-8 flex flex-col gap-6">
          <h1 className="text-xl font-bold text-[#1A1916] text-center">
            🔐 KoreaScout Admin
          </h1>
          <p className="text-xs text-[#9E9C98] text-center">
            Internal use only
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-[#F2F1EE] border border-[#E8E6E1] rounded-lg px-4 py-2.5 text-[#1A1916] text-sm focus:border-[#16A34A] outline-none w-full"
              autoComplete="current-password"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold rounded-lg py-2.5 transition-colors disabled:opacity-60"
            >
              {loading ? "Checking..." : "Enter Dashboard →"}
            </button>
          </form>
          {error && (
            <p className="text-[#DC2626] text-sm text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

```

#### `app\admin\[id]\page.tsx`

```tsx

```

#### `components\admin\GlobalPricesHelper.tsx`

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";

// ——— Types ———
type ListingItem = {
  platform?: string;
  price_usd?: number;
  url?: string;
  sold_out?: boolean;
  is_official?: boolean;
  [k: string]: unknown;
};

type RegionDataLike = {
  price_usd?: number;
  url?: string | null;
  official_url?: string;
  seller_type?: string;
  listings?: ListingItem[];
  [k: string]: unknown;
};

type GlobalPricesLike = {
  us_uk_eu?: { us?: RegionDataLike; uk?: RegionDataLike; eu?: RegionDataLike; [k: string]: unknown };
  jp_sea?: { jp?: RegionDataLike; sea?: RegionDataLike; [k: string]: unknown };
  uae?: { uae?: RegionDataLike; [k: string]: unknown };
  shopee_lazada?: RegionDataLike;
  [k: string]: unknown;
};

const REGIONS: Array<{ key: string; flag: string; name: string }> = [
  { key: "us", flag: "🇺🇸", name: "US" },
  { key: "gb", flag: "🇬🇧", name: "UK" },
  { key: "eu", flag: "🇪🇺", name: "EU" },
  { key: "jp", flag: "🇯🇵", name: "Japan" },
  { key: "sea", flag: "🇸🇬", name: "SEA" },
  { key: "uae", flag: "🇦🇪", name: "UAE" },
];

const inputCls =
  "bg-white border border-[#E8E6E1] rounded-md px-2 py-1.5 text-sm text-[#1A1916] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] outline-none";

function parseValue(value: string | null): GlobalPricesLike {
  if (value == null || value === "") return {};
  try {
    let raw: unknown = JSON.parse(value);
    if (typeof raw === "string") raw = JSON.parse(raw);
    if (typeof raw !== "object" || raw === null) return {};
    return raw as GlobalPricesLike;
  } catch {
    return {};
  }
}

function getRegionData(data: GlobalPricesLike, regionKey: string): RegionDataLike | undefined {
  if (regionKey === "shopee_lazada") return data.shopee_lazada;
  if (regionKey === "us") return data.us_uk_eu?.us;
  if (regionKey === "gb") return data.us_uk_eu?.uk;
  if (regionKey === "eu") return data.us_uk_eu?.eu;
  if (regionKey === "jp") return data.jp_sea?.jp;
  if (regionKey === "sea") return data.jp_sea?.sea;
  if (regionKey === "uae") return data.uae?.uae;
  return undefined;
}

function normalizeListing(l: unknown, source?: "sea" | "shopee_lazada"): ListingItem {
  if (l && typeof l === "object" && !Array.isArray(l)) {
    const o = l as Record<string, unknown>;
    const price_usd_val = typeof o.price_usd === "number" ? o.price_usd : 0;
    const sold_out = o.sold_out === true || price_usd_val === 0;
    const item: ListingItem = {
      platform: typeof o.platform === "string" ? o.platform : "",
      price_usd: price_usd_val,
      url: typeof o.url === "string" ? o.url : "",
      sold_out,
      is_official: o.is_official === true,
    };
    if (source) item.source = source;
    return item;
  }
  const item: ListingItem = { platform: "", price_usd: 0, url: "", sold_out: true };
  if (source) item.source = source;
  return item;
}

function getRegionListings(data: GlobalPricesLike, regionKey: string): ListingItem[] {
  if (regionKey === "sea") {
    const seaList = getRegionData(data, "sea")?.listings;
    const shopeeList = data.shopee_lazada?.listings;
    const seaItems = Array.isArray(seaList) ? seaList.map((l) => normalizeListing(l, "sea")) : [];
    const shopeeItems = Array.isArray(shopeeList) ? shopeeList.map((l) => normalizeListing(l, "shopee_lazada")) : [];
    return [...seaItems, ...shopeeItems];
  }
  const region = getRegionData(data, regionKey);
  const list = region?.listings;
  if (!Array.isArray(list)) return [];
  return list.map((l) => normalizeListing(l));
}

/** Minimum price_usd > 0 is the Best price for the badge. */
function getBestPrice(listings: ListingItem[]): number | null {
  const prices = listings.map((l) => l.price_usd ?? 0).filter((p) => p > 0);
  if (prices.length === 0) return null;
  return Math.min(...prices);
}

function getBestListingIndex(listings: ListingItem[]): number {
  let bestIdx = -1;
  let best = Infinity;
  listings.forEach((l, i) => {
    const p = l.price_usd ?? 0;
    if (p > 0 && p < best) {
      best = p;
      bestIdx = i;
    }
  });
  return bestIdx;
}

function sortListings(listings: ListingItem[]): ListingItem[] {
  return [...listings].sort((a, b) => {
    const pa = a.price_usd ?? 0;
    const pb = b.price_usd ?? 0;
    if (pa > 0 && pb > 0) return pa - pb;
    if (pa > 0) return -1;
    if (pb > 0) return 1;
    return 0;
  });
}

function stripSource(listing: ListingItem): Omit<ListingItem, "source"> {
  const { source: _s, ...rest } = listing;
  return rest;
}

function setRegionListings(
  data: GlobalPricesLike,
  regionKey: string,
  listings: ListingItem[]
): GlobalPricesLike {
  const activePrices = listings
    .filter((l) => !l.sold_out && (l.price_usd ?? 0) > 0)
    .map((l) => l.price_usd as number);
  const next = JSON.parse(JSON.stringify(data)) as GlobalPricesLike;
  if (regionKey === "sea") {
    const seaListings = listings
      .filter((l) => (l as ListingItem & { source?: string }).source !== "shopee_lazada")
      .map(stripSource);
    const shopeeListings = listings
      .filter((l) => (l as ListingItem & { source?: string }).source === "shopee_lazada")
      .map(stripSource);
    if (!next.jp_sea) next.jp_sea = {};
    if (!next.jp_sea.sea) next.jp_sea.sea = {};
    next.jp_sea.sea.listings = seaListings;
    if (activePrices.length === 0) {
      next.jp_sea.sea.price_usd = 0;
      next.jp_sea.sea.url = null;
    } else {
      next.jp_sea.sea.price_usd = Math.min(...activePrices);
    }
    if (!next.shopee_lazada) next.shopee_lazada = {};
    next.shopee_lazada.listings = shopeeListings;
    return next;
  }
  if (regionKey === "shopee_lazada") {
    if (!next.shopee_lazada) next.shopee_lazada = {};
    next.shopee_lazada.listings = listings.map(stripSource);
    return next;
  }
  if (regionKey === "us") {
    if (!next.us_uk_eu) next.us_uk_eu = {};
    if (!next.us_uk_eu.us) next.us_uk_eu.us = {};
    next.us_uk_eu.us.listings = listings.map(stripSource);
    if (activePrices.length === 0) {
      next.us_uk_eu.us.price_usd = 0;
      next.us_uk_eu.us.url = null;
    } else {
      next.us_uk_eu.us.price_usd = Math.min(...activePrices);
    }
    return next;
  }
  if (regionKey === "gb") {
    if (!next.us_uk_eu) next.us_uk_eu = {};
    if (!next.us_uk_eu.uk) next.us_uk_eu.uk = {};
    next.us_uk_eu.uk.listings = listings.map(stripSource);
    if (activePrices.length === 0) {
      next.us_uk_eu.uk.price_usd = 0;
      next.us_uk_eu.uk.url = null;
    } else {
      next.us_uk_eu.uk.price_usd = Math.min(...activePrices);
    }
    return next;
  }
  if (regionKey === "eu") {
    if (!next.us_uk_eu) next.us_uk_eu = {};
    if (!next.us_uk_eu.eu) next.us_uk_eu.eu = {};
    next.us_uk_eu.eu.listings = listings.map(stripSource);
    if (activePrices.length === 0) {
      next.us_uk_eu.eu.price_usd = 0;
      next.us_uk_eu.eu.url = null;
    } else {
      next.us_uk_eu.eu.price_usd = Math.min(...activePrices);
    }
    return next;
  }
  if (regionKey === "jp") {
    if (!next.jp_sea) next.jp_sea = {};
    if (!next.jp_sea.jp) next.jp_sea.jp = {};
    next.jp_sea.jp.listings = listings.map(stripSource);
    if (activePrices.length === 0) {
      next.jp_sea.jp.price_usd = 0;
      next.jp_sea.jp.url = null;
    } else {
      next.jp_sea.jp.price_usd = Math.min(...activePrices);
    }
    return next;
  }
  if (regionKey === "uae") {
    if (!next.uae) next.uae = {};
    if (!next.uae.uae) next.uae.uae = {};
    next.uae.uae.listings = listings.map(stripSource);
    if (activePrices.length === 0) {
      next.uae.uae.price_usd = 0;
      next.uae.uae.url = null;
    } else {
      next.uae.uae.price_usd = Math.min(...activePrices);
    }
    return next;
  }
  return next;
}

function setRegionSellerType(
  data: GlobalPricesLike,
  regionKey: string,
  sellerType: string
): GlobalPricesLike {
  const next = JSON.parse(JSON.stringify(data)) as GlobalPricesLike;
  if (regionKey === "us") {
    if (!next.us_uk_eu) next.us_uk_eu = {};
    if (!next.us_uk_eu.us) next.us_uk_eu.us = {};
    next.us_uk_eu.us.seller_type = sellerType;
  } else if (regionKey === "gb") {
    if (!next.us_uk_eu) next.us_uk_eu = {};
    if (!next.us_uk_eu.uk) next.us_uk_eu.uk = {};
    next.us_uk_eu.uk.seller_type = sellerType;
  } else if (regionKey === "eu") {
    if (!next.us_uk_eu) next.us_uk_eu = {};
    if (!next.us_uk_eu.eu) next.us_uk_eu.eu = {};
    next.us_uk_eu.eu.seller_type = sellerType;
  } else if (regionKey === "jp") {
    if (!next.jp_sea) next.jp_sea = {};
    if (!next.jp_sea.jp) next.jp_sea.jp = {};
    next.jp_sea.jp.seller_type = sellerType;
  } else if (regionKey === "sea") {
    if (!next.jp_sea) next.jp_sea = {};
    if (!next.jp_sea.sea) next.jp_sea.sea = {};
    next.jp_sea.sea.seller_type = sellerType;
  } else if (regionKey === "uae") {
    if (!next.uae) next.uae = {};
    if (!next.uae.uae) next.uae.uae = {};
    next.uae.uae.seller_type = sellerType;
  }
  return next;
}

function getRegionSellerType(data: GlobalPricesLike, regionKey: string): string {
  const region = getRegionData(data, regionKey);
  return (region?.seller_type as string) ?? "";
}

export function GlobalPricesHelper({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (newJsonString: string) => void;
}) {
  const [data, setData] = useState<GlobalPricesLike>(() => parseValue(value));
  const [rawOpen, setRawOpen] = useState(false);
  const [openRegions, setOpenRegions] = useState<Record<string, boolean>>(() =>
    REGIONS.reduce((acc, r) => ({ ...acc, [r.key]: true }), {})
  );
  const [pendingDelete, setPendingDelete] = useState<{ regionKey: string; index: number } | null>(null);

  useEffect(() => {
    setData(parseValue(value));
  }, [value]);

  const emit = useCallback(
    (next: GlobalPricesLike) => {
      setData(next);
      onChange(JSON.stringify(next));
    },
    [onChange]
  );

  const updateRegionListings = useCallback(
    (regionKey: string, updater: (prev: ListingItem[]) => ListingItem[]) => {
      const prev = getRegionListings(data, regionKey);
      const nextListings = updater(prev);
      const nextData = setRegionListings(data, regionKey, nextListings);
      emit(nextData);
    },
    [data, emit]
  );

  const setListing = useCallback(
    (regionKey: string, index: number, listing: ListingItem) => {
      updateRegionListings(regionKey, (list) => {
        const next = [...list];
        next[index] = listing;
        return next;
      });
      // Official 체크 시 region official_url 자동 반영
      setData((prev) => {
        const next = JSON.parse(JSON.stringify(prev)) as GlobalPricesLike;

        // 해당 region의 official_url 업데이트
        const setOfficialUrl = (regionObj: Record<string, unknown> | undefined, url: string | null) => {
          if (regionObj) regionObj.official_url = url;
        };

        if (listing.is_official && listing.url) {
          // Official 체크 ON → 이 URL을 official_url로 설정
          if (regionKey === "us") setOfficialUrl(next.us_uk_eu?.us as Record<string, unknown>, listing.url);
          else if (regionKey === "gb") setOfficialUrl(next.us_uk_eu?.uk as Record<string, unknown>, listing.url);
          else if (regionKey === "eu") setOfficialUrl(next.us_uk_eu?.eu as Record<string, unknown>, listing.url);
          else if (regionKey === "jp") setOfficialUrl(next.jp_sea?.jp as Record<string, unknown>, listing.url);
          else if (regionKey === "sea") setOfficialUrl(next.jp_sea?.sea as Record<string, unknown>, listing.url);
          else if (regionKey === "uae") setOfficialUrl(next.uae?.uae as Record<string, unknown>, listing.url);
        } else if (!listing.is_official) {
          // Official 체크 OFF → 다른 Official 체크된 listing이 없으면 official_url 제거
          const updatedListings = getRegionListings(next, regionKey);
          const hasOtherOfficial = updatedListings.some((l, i) => i !== index && l.is_official);
          if (!hasOtherOfficial) {
            if (regionKey === "us") setOfficialUrl(next.us_uk_eu?.us as Record<string, unknown>, null);
            else if (regionKey === "gb") setOfficialUrl(next.us_uk_eu?.uk as Record<string, unknown>, null);
            else if (regionKey === "eu") setOfficialUrl(next.us_uk_eu?.eu as Record<string, unknown>, null);
            else if (regionKey === "jp") setOfficialUrl(next.jp_sea?.jp as Record<string, unknown>, null);
            else if (regionKey === "sea") setOfficialUrl(next.jp_sea?.sea as Record<string, unknown>, null);
            else if (regionKey === "uae") setOfficialUrl(next.uae?.uae as Record<string, unknown>, null);
          }
        }
        onChange(JSON.stringify(next));
        return next;
      });
    },
    [updateRegionListings, getRegionListings, onChange]
  );

  const addListing = useCallback(
    (regionKey: string) => {
      updateRegionListings(regionKey, (list) => {
        const newItem: ListingItem = { platform: "", price_usd: 0, url: "", sold_out: false };
        if (regionKey === "sea") (newItem as ListingItem & { source?: string }).source = "sea";
        return [...list, newItem];
      });
    },
    [updateRegionListings]
  );

  const deleteListing = useCallback(
    (regionKey: string, index: number) => {
      updateRegionListings(regionKey, (list) => list.filter((_, i) => i !== index));
    },
    [updateRegionListings]
  );

  const openUrl = useCallback((url: string) => {
    const u = (url ?? "").trim();
    if (u) window.open(u, "_blank");
  }, []);

  const currentJson = JSON.stringify(data, null, 2);

  return (
    <div className="flex flex-col gap-2">
      {REGIONS.map((r) => {
        const regionKey = r.key;
        const listings = getRegionListings(data, regionKey);
        const sorted = sortListings(listings);
        const bestPrice = getBestPrice(listings);
        const bestIdx = getBestListingIndex(sorted);
        const hasAnyPrice = listings.some((l) => (l.price_usd ?? 0) > 0);

        return (
          <div
            key={regionKey}
            className="bg-white border border-[#E8E6E1] rounded-xl overflow-hidden"
          >
            {/* Region header */}
            <button
              type="button"
              onClick={() => setOpenRegions((prev) => ({ ...prev, [regionKey]: !prev[regionKey] }))}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-[#F8F7F4] border-b border-[#E8E6E1] text-left hover:bg-[#F0EDE8] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-[15px]">{r.flag}</span>
                <span className="text-sm font-bold text-[#1A1916]">{r.name}</span>
                {hasAnyPrice && bestPrice != null ? (
                  <span
                    className="text-[11px] px-2 py-0.5 rounded-md border border-[#BBF7D0] font-medium"
                    style={{
                      color: "#16A34A",
                      background: "#F0FDF4",
                      borderWidth: "1px",
                      borderRadius: "6px",
                    }}
                  >
                    Best ${Number(bestPrice).toFixed(2)}
                  </span>
                ) : (
                  <span className="text-xs text-[#9E9C98]">No data</span>
                )}
              </div>
              <span className="text-[#9E9C98] text-sm shrink-0">
                {openRegions[regionKey] !== false ? "▼" : "▶"}
              </span>
            </button>

            {/* Listings — expand when open */}
            {openRegions[regionKey] !== false && (
              <div className="flex items-center gap-2 px-4 py-2 border-b border-[#E8E6E1] bg-[#FAFAF9]">
                <span className="text-xs text-[#9E9C98] whitespace-nowrap w-[100px]">Seller Type</span>
                <input
                  type="text"
                  placeholder="e.g. 3rd Party Reseller"
                  value={getRegionSellerType(data, regionKey)}
                  onChange={(e) => {
                    const next = setRegionSellerType(data, regionKey, e.target.value);
                    emit(next);
                  }}
                  className={`${inputCls} flex-1`}
                />
              </div>
            )}
            {openRegions[regionKey] !== false && sorted.map((listing, idx) => {
              const price = listing.price_usd ?? 0;
              const isBest = hasAnyPrice && idx === bestIdx;
              const isZero = price === 0;
              const originalIndex = listings.findIndex((l) => l === listing);
              const isPendingDelete = pendingDelete?.regionKey === regionKey && pendingDelete?.index === originalIndex;

              if (isPendingDelete) {
                return (
                  <div
                    key={`del-${regionKey}-${originalIndex}`}
                    className="flex items-center gap-2 px-4 py-2 border-b border-[#E8E6E1] last:border-b-0 bg-[#FEE2E2]"
                  >
                    <span className="text-sm text-[#1A1916] flex-1">이 항목을 삭제하시겠습니까?</span>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(null)}
                      className="text-sm px-3 py-1.5 rounded border border-[#E8E6E1] bg-white text-[#1A1916] hover:bg-[#F8F7F4] transition-colors"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteListing(regionKey, originalIndex);
                        setPendingDelete(null);
                      }}
                      className="text-sm px-3 py-1.5 rounded border border-[#DC2626] bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FECACA] transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={originalIndex >= 0 ? originalIndex : idx}
                  className={`flex items-center gap-2 px-4 py-2 border-b border-[#E8E6E1] last:border-b-0 ${isBest ? "bg-[#F0FDF4]" : ""} ${isZero ? "opacity-70" : ""}`}
                >
                  <input
                    type="text"
                    placeholder="Platform"
                    value={listing.platform ?? ""}
                    onChange={(e) =>
                      setListing(regionKey, originalIndex, {
                        ...listing,
                        platform: e.target.value,
                      })
                    }
                    className={`${inputCls} w-[100px]`}
                  />
                  <input
                    type="number"
                    step={0.01}
                    min={0}
                    value={price === 0 ? "" : price}
                    onChange={(e) => {
                      const v = e.target.value;
                      const num = v === "" ? 0 : Number(v);
                      setListing(regionKey, originalIndex, {
                        ...listing,
                        price_usd: num,
                      });
                    }}
                    className={`${inputCls} w-[70px]`}
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    value={listing.url ?? ""}
                    onChange={(e) =>
                      setListing(regionKey, originalIndex, {
                        ...listing,
                        url: e.target.value,
                      })
                    }
                    className={`${inputCls} flex-1 min-w-0`}
                  />
                  <label className="flex items-center gap-1 text-xs text-[#9E9C98] whitespace-nowrap cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={listing.sold_out === true}
                      onChange={(e) =>
                        setListing(regionKey, originalIndex, {
                          ...listing,
                          sold_out: e.target.checked,
                        })
                      }
                      className="rounded border-[#E8E6E1] text-[#16A34A] focus:ring-[#16A34A]"
                    />
                    Sold Out
                  </label>
                  <label className="flex items-center gap-1 text-xs text-[#16A34A] whitespace-nowrap cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={listing.is_official === true}
                      onChange={(e) =>
                        setListing(regionKey, originalIndex, {
                          ...listing,
                          is_official: e.target.checked,
                        })
                      }
                      className="appearance-none w-4 h-4 rounded border border-[#E8E6E1] bg-white checked:bg-[#16A34A] checked:border-[#16A34A] focus:border-[#16A34A] outline-none"
                    />
                    Official
                  </label>
                  <button
                    type="button"
                    onClick={() => openUrl(listing.url ?? "")}
                    className="text-[#9E9C98] hover:text-[#1A1916] text-sm px-1.5 py-1 rounded transition-colors bg-transparent border-none cursor-pointer flex-shrink-0"
                    aria-label="Open URL"
                  >
                    🔗
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete({ regionKey, index: originalIndex })}
                    className="text-[#9E9C98] hover:text-[#1A1916] text-sm px-1.5 py-1 rounded transition-colors bg-transparent border-none cursor-pointer flex-shrink-0"
                    aria-label="Delete"
                  >
                    🗑
                  </button>
                </div>
              );
            })}

            {openRegions[regionKey] !== false && (
              <button
                type="button"
                onClick={() => addListing(regionKey)}
                className="text-xs text-[#16A34A] hover:text-[#15803D] px-4 py-2 text-left bg-transparent border-none cursor-pointer w-full"
              >
                + Add listing
              </button>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => setRawOpen((o) => !o)}
        className="text-xs text-[#C4C2BE] hover:text-[#9E9C98] cursor-pointer bg-transparent border-none mt-1"
      >
        {rawOpen ? "▼ Hide Raw JSON" : "▶ Show Raw JSON"}
      </button>
      {rawOpen && (
        <textarea
          readOnly
          value={currentJson}
          rows={10}
          className="mt-1 w-full bg-[#F8F7F4] border border-[#E8E6E1] rounded-md px-2 py-1.5 text-xs font-mono text-[#1A1916] resize-none"
        />
      )}
      <p className="text-xs text-[#9E9C98] italic mt-1">
        Leave URL empty to show Blue Ocean badge on the product page.
      </p>
    </div>
  );
}

```

#### `components\admin\HazmatCheckboxes.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";

type HazmatState = {
  contains_liquid: boolean;
  contains_powder: boolean;
  contains_battery: boolean;
  contains_aerosol: boolean;
};

function parseValue(value: string | null): HazmatState {
  const def: HazmatState = {
    contains_liquid: false,
    contains_powder: false,
    contains_battery: false,
    contains_aerosol: false,
  };
  if (!value?.trim()) return def;
  try {
    const p = JSON.parse(value);
    if (typeof p !== "object" || p === null) return def;
    return {
      contains_liquid: Boolean(p.contains_liquid),
      contains_powder: Boolean(p.contains_powder),
      contains_battery: Boolean(p.contains_battery),
      contains_aerosol: Boolean(p.contains_aerosol),
    };
  } catch {
    return def;
  }
}

export function HazmatCheckboxes({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (newJsonString: string) => void;
}) {
  const [state, setState] = useState<HazmatState>(() => parseValue(value));

  useEffect(() => {
    setState(parseValue(value));
  }, [value]);

  function toggle(key: keyof HazmatState) {
    const newState = { ...state, [key]: !state[key] };
    setState(newState);
    onChange(
      JSON.stringify({
        contains_liquid: newState.contains_liquid,
        contains_powder: newState.contains_powder,
        contains_battery: newState.contains_battery,
        contains_aerosol: newState.contains_aerosol,
      })
    );
  }

  const items: { key: keyof HazmatState; icon: string; label: string }[] = [
    { key: "contains_liquid", icon: "💧", label: "Liquid" },
    { key: "contains_powder", icon: "🧪", label: "Powder" },
    { key: "contains_battery", icon: "🔋", label: "Battery" },
    { key: "contains_aerosol", icon: "💨", label: "Aerosol" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 bg-[#F8F7F4] p-4 rounded-lg">
      {items.map(({ key, icon, label }) => (
        <label
          key={key}
          className="flex items-center gap-2 cursor-pointer text-sm text-[#3D3B36]"
        >
          <input
            type="checkbox"
            checked={state[key]}
            onChange={() => toggle(key)}
            className="appearance-none w-4 h-4 rounded border border-[#E8E6E1] bg-white checked:bg-[#16A34A] checked:border-[#16A34A] focus:border-[#16A34A] outline-none"
          />
          <span>
            {icon} {label}
          </span>
        </label>
      ))}
    </div>
  );
}

```

#### `components\admin\AiPageLinksHelper.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";

const MAX_LINKS = 5;

function parseValue(value: string | null): string[] {
  if (value == null || value === "") return [""];
  try {
    const p = JSON.parse(value);
    if (Array.isArray(p)) {
      const arr = p.map((x) => (typeof x === "string" ? x : "")).slice(0, MAX_LINKS);
      return arr.length ? arr : [""];
    }
    if (typeof p === "string" && p.trim()) return [p.trim()];
  } catch {
    if (typeof value === "string" && value.trim()) return [value.trim()];
  }
  return [""];
}

export function AiPageLinksHelper({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (newJsonString: string) => void;
}) {
  const [links, setLinks] = useState<string[]>(() => parseValue(value));

  useEffect(() => {
    setLinks(parseValue(value));
  }, [value]);

  function updateLink(i: number, v: string) {
    const newLinks = [...links];
    newLinks[i] = v;
    setLinks(newLinks);
    const filtered = newLinks.filter((s) => s.trim());
    onChange(JSON.stringify(filtered.length ? filtered : []));
  }

  function removeLink(i: number) {
    const newLinks = links.filter((_, idx) => idx !== i);
    setLinks(newLinks);
    const filtered = newLinks.filter((s) => s.trim());
    onChange(JSON.stringify(filtered.length ? filtered : []));
  }

  function addLink() {
    if (links.length >= MAX_LINKS) return;
    const newLinks = [...links, ""];
    setLinks(newLinks);
    const filtered = newLinks.filter((s) => s.trim());
    onChange(JSON.stringify(filtered.length ? filtered : []));
  }

  const inputClass =
    "bg-white border border-[#E8E6E1] rounded-lg px-3 py-2 text-sm text-[#1A1916] placeholder:text-[#C4C2BE] focus:border-[#16A34A] outline-none flex-1 min-w-0";

  return (
    <div className="flex flex-col gap-2 bg-[#F8F7F4] border border-[#E8E6E1] rounded-lg p-4">
      {links.map((link, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-[#9E9C98] text-xs w-14">Link {i + 1}:</span>
          <input
            type="url"
            value={link}
            onChange={(e) => updateLink(i, e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => removeLink(i)}
            className="text-[#9E9C98] hover:text-[#DC2626] p-1 shrink-0"
            aria-label="Remove"
          >
            🗑
          </button>
        </div>
      ))}
      {links.length < MAX_LINKS && (
        <button
          type="button"
          onClick={addLink}
          className="text-xs text-[#16A34A] hover:text-[#15803D] w-fit"
        >
          + Add Link
        </button>
      )}
    </div>
  );
}

```

#### `lib\supabase\admin.ts`

```tsx
import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service_role key.
 * Bypasses RLS. Use only in trusted server code (e.g. webhooks, cron).
 * Never expose this key to the client.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL for admin client"
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

```

#### `middleware.ts`

```tsx
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const response = pathname.startsWith("/admin")
    ? (() => {
        const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
        const cookie = request.cookies.get(cookieName);
        const isLoginPage = pathname === "/admin/login";
        if (isLoginPage || cookie?.value === "authenticated") return null;
        return NextResponse.redirect(new URL("/admin/login", request.url));
      })()
    : null;

  if (response) return response;

  const res = await updateSession(request);
  res.headers.set("x-pathname", pathname);
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

```
\n\n### app/admin/[id]/page.tsx (full source)\n\n`	sx\n"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { ScoutFinalReportsRow } from "@/types/database";
import { GlobalPricesHelper } from "@/components/admin/GlobalPricesHelper";
import { HazmatCheckboxes } from "@/components/admin/HazmatCheckboxes";
import { AiPageLinksHelper } from "@/components/admin/AiPageLinksHelper";

type SaveStatus = "idle" | "saved" | "error";
type OpenSections = { s1: boolean; s2: boolean; s3: boolean; s4: boolean; s5: boolean; s6a: boolean; s6b: boolean; s6c: boolean; s7: boolean };
type DiffItem = { field: string; fieldKo: string; before: string; after: string };

const EXPORT_STATUS_OPTIONS = ["Green", "Yellow", "Red"];
const COMPETITION_OPTIONS = ["Low", "Medium", "High"];
const GAP_STATUS_OPTIONS = ["Blue Ocean", "Emerging", "Competitive", "Saturated"] as const;
const GO_VERDICT_OPTIONS = ["GO", "CAUTIOUS GO", "WATCH", "NO GO"] as const;

/** Korean labels for every DB field (for diff modal & edit history) */
const FIELD_LABELS_KO: Record<string, string> = {
  id: "ID",
  product_name: "제품명",
  naver_product_name: "네이버 상품명",
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
  video_url_2: "비디오URL2(추가영상)",
  video_url: "영상URL",
  video_url_3: "비디오URL3(추가영상)",
  ai_detail_page_links: "YouTube참조URL",
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

/** Normalizes value for display: parses JSON array strings so we don't show escaped slashes. */
function toCommaStr(v: string | string[] | null | undefined): string {
  if (v == null) return "";
  let target: unknown = v;
  if (typeof v === "string" && v.trim().startsWith("[")) {
    try {
      target = JSON.parse(v);
    } catch {
      target = v;
    }
  }
  if (Array.isArray(target)) return target.filter(Boolean).map(String).join(", ");
  return String(target);
}

function fromCommaStr(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

/** Indestructible parser: handles deeply corrupted JSON strings, always returns exactly 5 slots. */
function ensureLength5(val: unknown): string[] {
  let arr: string[] = [];
  if (Array.isArray(val)) arr = val.map(String);
  else if (typeof val === "string") {
    const clean = val.replace(/[\[\]\\"]/g, "");
    arr = clean.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [...arr, "", "", "", "", ""].slice(0, 5);
}

function toDisplayVal(v: unknown): string {
  if (v == null) return "—";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function SampleToggle({ reportId }: { reportId: string }) {
  const [isSample, setIsSample] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/site-config?key=sample_product_id", {
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json();
      setIsSample(data.value === reportId);
    })();
  }, [reportId]);

  async function toggle() {
    setLoading(true);
    try {
      const newValue = isSample ? null : reportId;
      const res = await fetch("/api/admin/site-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ key: "sample_product_id", value: newValue }),
      });
      if (res.ok) setIsSample(!isSample);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-60 ${
        isSample
          ? "bg-[#16A34A] text-white hover:bg-[#15803D]"
          : "bg-[#F2F1EE] text-[#6B6860] hover:bg-[#E8E6E1]"
      }`}
    >
      {isSample ? "✓ Sample Report" : "Set as Sample"}
    </button>
  );
}

export default function AdminEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [formData, setFormData] = useState<Partial<ScoutFinalReportsRow> | null>(null);
  const [originalData, setOriginalData] = useState<Partial<ScoutFinalReportsRow> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveDiff, setSaveDiff] = useState<DiffItem[]>([]);
  const [openSections, setOpenSections] = useState<OpenSections>({
    s1: false,
    s2: false,
    s3: false,
    s4: false,
    s5: false,
    s6a: false,
    s6b: false,
    s6c: false,
    s7: false,
  });

  const serializeSourcingTip = (steps: string[]): string => {
    const headers = [
      "Marketing Strategy",
      "Price / Margin Strategy",
      "B2B Sourcing Strategy",
      "Customs / Compliance Strategy",
      "Logistics / Shipping Strategy",
    ];
    return steps
      .map((content, i) => `[${headers[i]}]\n${content ?? ""}`)
      .join("\n\n");
  };

  const parseTipToSteps = (raw: string | null | undefined): string[] => {
    if (!raw) return ["", "", "", "", ""];
    const regex = /(?:^|\n)\s*\[([^\n]*?)\]/g;
    const matches: { title: string; index: number }[] = [];
    let m;
    while ((m = regex.exec(raw)) !== null) {
      matches.push({ title: m[1].trim(), index: m.index });
    }
    if (matches.length === 0) return [raw.trim(), "", "", "", ""];
    const steps: string[] = [];
    for (let i = 0; i < 5; i++) {
      if (!matches[i]) { steps.push(""); continue; }
      const start = raw.indexOf("]", matches[i].index) + 1;
      const end = matches[i + 1] ? matches[i + 1].index : raw.length;
      steps.push(raw.slice(start, end).trim());
    }
    return steps;
  };

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/reports/${id}`, { credentials: "include" });
        if (!res.ok) {
          if (!cancelled) setFormData(null);
          return;
        }
        const row = (await res.json()) as ScoutFinalReportsRow;
        if (!cancelled) {
          const initial = {
            ...row,
            seo_keywords: ensureLength5(row.seo_keywords),
            rising_keywords: ensureLength5(row.rising_keywords ?? null),
            viral_hashtags: ensureLength5(row.viral_hashtags ?? null),
          } as unknown as Partial<ScoutFinalReportsRow>;
          setFormData(initial);
          setOriginalData(JSON.parse(JSON.stringify(initial)));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const toggleSection = useCallback((key: keyof OpenSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const formKeys = [
    "product_name", "naver_product_name", "translated_name", "category", "kr_price", "export_status", "viability_reason",
    "image_url", "naver_link", "week_id", "m_name", "corporate_scale", "contact_email", "contact_phone", "m_homepage", "wholesale_link", "status",
    "market_viability", "competition_level", "gap_status", "gap_index", "billable_weight_g",
    "go_verdict", "composite_score", "growth_signal", "search_volume", "best_platform", "trend_entry_strategy",
    "shipping_tier", "key_risk_ingredient", "hazmat_summary", "global_site_url", "b2b_inquiry_url", "can_oem", "ai_image_url",
    "wow_rate", "mom_growth", "growth_evidence", "profit_multiplier", "strategy_price", "top_selling_point", "common_pain_point",
    "new_content_volume", "global_prices", "buzz_summary", "kr_local_score", "global_trend_score", "kr_evidence",
    "global_evidence", "kr_source_used", "opportunity_reasoning", "rising_keywords", "seo_keywords", "viral_hashtags",
    "platform_scores", "sourcing_tip", "hs_code", "hs_description", "status_reason", "composition_info", "spec_summary",
    "actual_weight_g", "volumetric_weight_g", "dimensions_cm", "hazmat_status", "required_certificates", "shipping_notes",
    "verified_cost_usd", "verified_cost_note", "verified_at", "moq", "lead_time", "sample_policy", "export_cert_note",
    "video_url_2", "video_url", "video_url_3", "ai_detail_page_links", "published_at",
  ];

  function getDiff(orig: Partial<ScoutFinalReportsRow> | null, current: Partial<ScoutFinalReportsRow> | null): DiffItem[] {
    if (!orig || !current) return [];
    const out: DiffItem[] = [];
    for (const key of formKeys) {
      const a = toDisplayVal(orig[key as keyof ScoutFinalReportsRow]);
      const b = toDisplayVal(current[key as keyof ScoutFinalReportsRow]);
      if (a !== b) out.push({ field: key, fieldKo: FIELD_LABELS_KO[key] ?? key, before: a, after: b });
    }
    return out;
  }

  function openSaveModal() {
    if (!formData || !originalData) return;
    setSaveDiff(getDiff(originalData, formData));
    setSaveModalOpen(true);
  }

  const handleConfirmSave = async () => {
    if (!formData || !id || !originalData) return;
    const updates: Record<string, unknown> = { ...formData };
    delete updates.id;
    delete updates.kr_price_usd;
    delete updates.estimated_cost_usd;
    delete updates.created_at;
    if (updates.status === "published") {
      updates.published_at = updates.published_at || new Date().toISOString();
    }
    const seoArr = ensureLength5(updates.seo_keywords).filter(Boolean);
    updates.seo_keywords = seoArr.length ? seoArr : null;
    const risingArr = ensureLength5(updates.rising_keywords).filter(Boolean);
    updates.rising_keywords = risingArr.length ? risingArr : null;
    const viralArr = ensureLength5(updates.viral_hashtags).filter(Boolean);
    updates.viral_hashtags = viralArr.length ? viralArr : null;
    if (typeof updates.platform_scores === "string" && updates.platform_scores) {
      try {
        updates.platform_scores = JSON.parse(updates.platform_scores as string);
      } catch {
        /* leave as string */
      }
    }
    const changes = saveDiff.map((d) => ({ field: d.field, before: d.before, after: d.after }));
    const newEntry = { timestamp: new Date().toISOString(), changes };
    const existing = formData.edit_history as { entries?: { timestamp: string; changes: { field: string; before: string; after: string }[] }[] } | null | undefined;
    const entries = Array.isArray(existing?.entries) ? [...existing.entries, newEntry] : [newEntry];
    updates.edit_history = { entries };

    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        setSaveStatus("error");
        setSaveModalOpen(false);
        return;
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
      const nextForm = { ...formData, edit_history: { entries } };
      setFormData(nextForm);
      setOriginalData(JSON.parse(JSON.stringify(nextForm)));
      setSaveModalOpen(false);
      router.refresh();
    } catch {
      setSaveStatus("error");
      setSaveModalOpen(false);
    }
  };

  function handleCancelSave() {
    setSaveModalOpen(false);
  }

  /* Un saved changes warning: prompt before leaving if formData !== originalData */
  useEffect(() => {
    if (!formData || !originalData) return;
    const handler = (e: BeforeUnloadEvent) => {
      try {
        const a = JSON.stringify(formData);
        const b = JSON.stringify(originalData);
        if (a !== b) {
          e.preventDefault();
          e.returnValue = "";
        }
      } catch {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [formData, originalData]);

  if (loading || !formData) {
    return (
      <div className="bg-[#F8F7F4] min-h-screen flex items-center justify-center">
        <p className="text-[#6B6860] text-sm">{loading ? "Loading…" : "Report not found."}</p>
      </div>
    );
  }

  const inputClass =
    "bg-white border border-[#E8E6E1] rounded-md px-3 py-2 text-sm text-[#1A1916] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] outline-none placeholder:text-[#C4C2BE] w-full transition-colors";
  const readOnlyClass =
    "bg-[#F8F7F4] border border-[#E8E6E1] rounded-md px-3 py-2 text-sm text-[#9E9C98] cursor-not-allowed w-full";
  const labelClass = "text-xs font-medium text-[#9E9C98] uppercase tracking-wider";

  return (
    <div className="bg-[#F8F7F4] min-h-screen">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E8E6E1] px-6 py-3 flex items-center justify-between">
        <Link
          href="/admin"
          className="text-sm text-[#9E9C98] hover:text-[#1A1916] transition-colors"
        >
          ← Back to List
        </Link>
        <span className="text-sm font-semibold text-[#1A1916] truncate max-w-[200px] mx-2">
          {formData.product_name ?? "—"}
        </span>
        {/* Sample Report Toggle */}
        <SampleToggle reportId={id} />
        <div className="flex items-center gap-2">
          {saveStatus === "saved" && (
            <span className="text-xs text-[#16A34A]">Saved!</span>
          )}
          {saveStatus === "error" && (
            <span className="text-xs text-[#DC2626]">Save failed</span>
          )}
          <label className="sr-only" htmlFor="admin-status-select">Status (상태)</label>
          <select
            id="admin-status-select"
            value={formData.status === "published" ? "published" : "hidden"}
            onChange={(e) => {
              const v = e.target.value as "published" | "hidden";
              setFormData((p) => ({
                ...p!,
                status: v,
                published_at: v === "published" ? new Date().toISOString() : null,
              }));
            }}
            className="bg-[#F2F1EE] text-[#3D3B36] border border-[#E8E6E1] text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-[#E8E6E1] transition-colors"
          >
            <option value="published">published (공개)</option>
            <option value="hidden">hidden (숨김)</option>
          </select>
          <button
            type="button"
            onClick={openSaveModal}
            className="bg-[#16A34A] text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-[#15803D] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </header>

      {/* Save confirmation modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="bg-white border border-[#E8E6E1] rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col">
            <div className="px-6 py-4 border-b border-[#E8E6E1]">
              <h2 className="text-lg font-semibold text-[#1A1916]">
                Save Changes — 변경 사항 확인
              </h2>
              <p className="text-xs text-[#9E9C98] mt-1">다음 필드가 변경됩니다.</p>
            </div>
            <div className="px-6 py-4 overflow-y-auto flex-1">
              {saveDiff.length === 0 ? (
                <p className="text-[#6B6860] text-sm">변경된 필드가 없습니다.</p>
              ) : (
                <ul className="space-y-2">
                  {saveDiff.map((d, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium text-[#3D3B36]">{d.fieldKo} ({d.field}):</span>{" "}
                      <span className="text-[#9E9C98]">[{d.before}]</span> → <span className="text-[#16A34A]">[{d.after}]</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="px-6 py-4 border-t border-[#E8E6E1] flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelSave}
                className="px-4 py-2 rounded-lg text-[#6B6860] hover:text-[#1A1916] border border-[#E8E6E1] hover:border-[#E8E6E1] transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="px-4 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-medium transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-4">
        {/* Section 1 — Product Identity */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s1")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Product Identity</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s1 ? "▼" : "▶"}</span>
          </button>
          {openSections.s1 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>id (ID) <span className="text-[#9E9C98] normal-case font-normal">(자동)</span></label>
                <div className={readOnlyClass}>
                  {formData.id ?? "—"}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Image URL (이미지URL)</label>
                {formData.image_url && (
                  <div className="rounded-xl overflow-hidden border border-[#E8E6E1] w-48 h-48 flex items-center justify-center bg-[#F8F7F4]">
                    <img
                      src={formData.image_url}
                      alt="product"
                      className="object-contain w-full h-full"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
                <input
                  type="text"
                  value={formData.image_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, image_url: e.target.value }))}
                  className={inputClass}
                  placeholder="이미지 URL을 붙여넣으세요"
                />
                <p className="text-xs text-[#9E9C98]">⚠️ 이미지가 깨진 경우 네이버 상품 페이지에서 이미지 URL을 복사해 교체하세요.</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>AI Image URL (AI이미지URL)</label>
                {formData.ai_image_url && (
                  <div className="rounded-xl overflow-hidden border border-[#E8E6E1] w-48 h-48 flex items-center justify-center bg-[#F8F7F4]">
                    <img
                      src={formData.ai_image_url}
                      alt="ai product"
                      className="object-contain w-full h-full"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
                <input
                  type="text"
                  value={formData.ai_image_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, ai_image_url: e.target.value }))}
                  className={inputClass}
                  placeholder="AI 생성 이미지 URL"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Product Name (제품명)</label>
                <input
                  value={formData.product_name ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, product_name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Naver Product Name (네이버 상품명)</label>
                <input
                  value={formData.naver_product_name ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, naver_product_name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Translated Name (번역명)</label>
                <input
                  value={formData.translated_name ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, translated_name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Category (카테고리)</label>
                <input
                  value={formData.category ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, category: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>KR Price (₩) (한국가격)</label>
                <input
                  type="text"
                  value={formData.kr_price ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, kr_price: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>USD Price (USD가격) <span className="text-[#9E9C98] normal-case font-normal">(자동계산)</span></label>
                <div className={readOnlyClass}>
                  {formData.kr_price_usd ?? "—"}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Est. Wholesale Cost (추정도매원가) <span className="text-[#9E9C98] normal-case font-normal">(자동계산)</span></label>
                <div className={readOnlyClass}>
                  {formData.estimated_cost_usd ?? "—"}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Export Status (수출상태)</label>
                <select
                  value={formData.export_status ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, export_status: e.target.value }))}
                  className={inputClass}
                >
                  {EXPORT_STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Viability Summary (시장성요약)</label>
                <textarea
                  rows={3}
                  value={formData.viability_reason ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, viability_reason: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>GO Verdict (GO판정)</label>
                <select
                  value={formData.go_verdict ?? ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p!,
                      go_verdict: e.target.value === "" ? null : e.target.value,
                    }))
                  }
                  className={inputClass}
                >
                  <option value="">—</option>
                  {GO_VERDICT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Composite Score (종합점수) <span className="text-[#9E9C98] normal-case font-normal">(자동)</span></label>
                <div className={readOnlyClass}>{formData.composite_score ?? "—"}</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Naver Link (네이버링크)</label>
                <input
                  value={formData.naver_link ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, naver_link: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Week ID (주차ID)</label>
                <input
                  value={formData.week_id ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, week_id: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 2 — Trend Signal Dashboard */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s2")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Trend Signal Dashboard</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s2 ? "▼" : "▶"}</span>
          </button>
          {openSections.s2 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Market Score (0–100) (시장성점수)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.market_viability ?? ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p!,
                      market_viability: e.target.value === "" ? 0 : Number(e.target.value),
                    }))
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Competition Level (경쟁수준)</label>
                <select
                  value={formData.competition_level ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, competition_level: e.target.value }))}
                  className={inputClass}
                >
                  {COMPETITION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Growth Evidence (성장근거)</label>
                <textarea
                  rows={3}
                  value={formData.growth_evidence ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, growth_evidence: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Growth Signal (성장시그널)</label>
                <input
                  value={formData.growth_signal ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, growth_signal: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Stable, Rising, Viral"
                />
              </div>
              {/* gap_status — moved from Opportunity Status */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>GAP STATUS / Opportunity Status (갭 상태)</label>
                <select
                  value={formData.gap_status ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, gap_status: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">—</option>
                  {formData.gap_status &&
                    !GAP_STATUS_OPTIONS.includes(
                      formData.gap_status as (typeof GAP_STATUS_OPTIONS)[number]
                    ) && (
                      <option value={formData.gap_status}>{formData.gap_status}</option>
                    )}
                  {GAP_STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {/* platform_scores — moved from Social Proof */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Platform Scores JSON (플랫폼점수)</label>
                <textarea
                  rows={6}
                  value={typeof formData.platform_scores === "string" ? formData.platform_scores : JSON.stringify(formData.platform_scores ?? {}, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setFormData((p) => ({ ...p!, platform_scores: parsed }));
                    } catch {
                      setFormData((p) => ({
                        ...p!,
                        platform_scores: e.target.value as unknown as ScoutFinalReportsRow["platform_scores"],
                      }));
                    }
                  }}
                  className={`${inputClass} resize-none font-mono text-xs`}
                />
              </div>
              {/* new_content_volume — moved from Market Intelligence */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>New Content Volume (신규콘텐츠량)</label>
                <input
                  type="text"
                  value={formData.new_content_volume ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, new_content_volume: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>OPPORTUNITY REASONING (기회 근거)</label>
                <textarea
                  rows={4}
                  value={formData.opportunity_reasoning ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, opportunity_reasoning: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 3 — Market Intelligence */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s3")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Market Intelligence</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s3 ? "▼" : "▶"}</span>
          </button>
          {openSections.s3 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Profit Multiplier (마진배수)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.profit_multiplier ?? ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p!,
                      profit_multiplier: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>
                  Strategic Target Price (전략적 목표가 USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={
                    (formData as Record<string, unknown>).strategy_price != null
                      ? String((formData as Record<string, unknown>).strategy_price)
                      : ""
                  }
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p!,
                      strategy_price: e.target.value === "" ? null : e.target.value,
                    }))
                  }
                  placeholder="예: 18.50 — 비우면 자동계산 표시"
                  className={inputClass}
                />
                <p className="text-xs text-[#9E9C98]">
                  입력 시 PDP에 Strategic Target Price로 표시. 비우면 숨김.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Winning Feature (핵심강점)</label>
                <textarea
                  rows={3}
                  value={formData.top_selling_point ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, top_selling_point: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Pain Point (소비자페인포인트)</label>
                <textarea
                  rows={3}
                  value={formData.common_pain_point ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, common_pain_point: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Search Volume (검색볼륨)</label>
                <input
                  value={formData.search_volume ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, search_volume: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Rising (18,100/mo)"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>MoM Growth (MoM성장률)</label>
                <input
                  type="text"
                  value={formData.mom_growth ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, mom_growth: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>WoW Growth (WoW성장률)</label>
                <input
                  type="text"
                  value={formData.wow_rate ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, wow_rate: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Best Platform (최적플랫폼)</label>
                <input
                  value={formData.best_platform ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, best_platform: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Amazon US, TikTok Shop"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 4 — Social Proof & Trend Intelligence */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s4")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Social Proof & Trend Intelligence</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s4 ? "▼" : "▶"}</span>
          </button>
          {openSections.s4 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Buzz Summary (버즈요약)</label>
                <textarea
                  rows={4}
                  value={formData.buzz_summary ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, buzz_summary: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>KR Local Score (0–100) (국내로컬점수)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.kr_local_score ?? ""}
                  onChange={(e) => {
                    const newKr = e.target.value === "" ? null : Number(e.target.value);
                    setFormData((p) => {
                      if (!p) return null;
                      const gt = p.global_trend_score;
                      const gap = (newKr != null && gt != null) ? newKr - gt : null;
                      return { ...p, kr_local_score: newKr, gap_index: gap };
                    });
                  }}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Global Trend Score (0–100) (글로벌트렌드점수)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.global_trend_score ?? ""}
                  onChange={(e) => {
                    const newGt = e.target.value === "" ? null : Number(e.target.value);
                    setFormData((p) => {
                      if (!p) return null;
                      const kr = p.kr_local_score;
                      const gap = (kr != null && newGt != null) ? kr - newGt : null;
                      return { ...p, global_trend_score: newGt, gap_index: gap };
                    });
                  }}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Gap Index (갭지수) <span className="text-[#9E9C98] normal-case font-normal">(자동: 국내점수 − 글로벌점수)</span></label>
                <div className={readOnlyClass}>
                  {formData.gap_index != null ? formData.gap_index : "—"}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>KR Evidence (국내근거)</label>
                <textarea
                  rows={3}
                  value={formData.kr_evidence ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, kr_evidence: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Global Evidence (글로벌근거)</label>
                <textarea
                  rows={3}
                  value={formData.global_evidence ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, global_evidence: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>KR Source Used (국내출처)</label>
                <input
                  value={formData.kr_source_used ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, kr_source_used: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Rising Keywords (상승키워드)</label>
                <div className="grid grid-cols-5 gap-2">
                  {ensureLength5(formData.rising_keywords).map((kw, i) => (
                    <input
                      key={i}
                      value={kw}
                      onChange={(e) => {
                        const next = [...ensureLength5(formData.rising_keywords)];
                        next[i] = e.target.value;
                        setFormData((p) => ({ ...p!, rising_keywords: next } as unknown as Partial<ScoutFinalReportsRow>));
                      }}
                      className={inputClass}
                      placeholder={`Keyword ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>SEO Keywords (SEO키워드)</label>
                <div className="grid grid-cols-5 gap-2">
                  {ensureLength5(formData.seo_keywords).map((kw, i) => (
                    <input
                      key={i}
                      value={kw}
                      onChange={(e) => {
                        const next = [...ensureLength5(formData.seo_keywords)];
                        next[i] = e.target.value;
                        setFormData((p) => ({ ...p!, seo_keywords: next } as unknown as Partial<ScoutFinalReportsRow>));
                      }}
                      className={inputClass}
                      placeholder={`Keyword ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Viral Hashtags (바이럴해시태그)</label>
                <div className="grid grid-cols-5 gap-2">
                  {ensureLength5(formData.viral_hashtags).map((tag, i) => (
                    <input
                      key={i}
                      value={tag}
                      onChange={(e) => {
                        const next = [...ensureLength5(formData.viral_hashtags)];
                        next[i] = e.target.value;
                        setFormData((p) => ({ ...p!, viral_hashtags: next } as unknown as Partial<ScoutFinalReportsRow>));
                      }}
                      className={inputClass}
                      placeholder={`Hashtag ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
              {/* Scout Strategy Report - Steps 1-3 */}
              <div className="flex flex-col gap-3 border border-[#E8E6E1] rounded-xl p-4">
                <p className="text-sm font-semibold text-[#1A1916]">📋 Scout Strategy Report (Steps 1–3)</p>
                {["Marketing Strategy", "Price / Margin Strategy", "B2B Sourcing Strategy"].map((header, i) => {
                  const steps = parseTipToSteps(formData.sourcing_tip);
                  return (
                    <div key={i} className="flex flex-col gap-1.5">
                      <label className={labelClass}>Step {i + 1}: {header}</label>
                      <textarea
                        rows={4}
                        value={steps[i] ?? ""}
                        onChange={(e) => {
                          const current = parseTipToSteps(formData.sourcing_tip);
                          current[i] = e.target.value;
                          setFormData((p) => ({ ...p!, sourcing_tip: serializeSourcingTip(current) }));
                        }}
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Trend Entry Strategy (진입전략)</label>
                <textarea
                  rows={3}
                  value={formData.trend_entry_strategy ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, trend_entry_strategy: e.target.value }))}
                  className={`${inputClass} resize-none`}
                  placeholder="AI-generated. Edit if needed."
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 5 — Export & Logistics Intel */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s5")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Export & Logistics Intel</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s5 ? "▼" : "▶"}</span>
          </button>
          {openSections.s5 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>HS Code (HS코드)</label>
                <input
                  value={formData.hs_code ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, hs_code: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>HS Description (HS설명)</label>
                <input
                  value={formData.hs_description ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, hs_description: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Status Reason (상태사유)</label>
                <textarea
                  rows={3}
                  value={formData.status_reason ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, status_reason: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Composition Info (성분정보)</label>
                <textarea
                  rows={3}
                  value={formData.composition_info ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, composition_info: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Spec Summary (스펙요약)</label>
                <textarea
                  rows={3}
                  value={formData.spec_summary ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, spec_summary: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Actual Weight (g) (실제중량)</label>
                <input
                  type="number"
                  value={formData.actual_weight_g ?? ""}
                  onChange={(e) => {
                    const newAw = e.target.value === "" ? null : Number(e.target.value);
                    setFormData((p) => {
                      if (!p) return null;
                      const vw = p.volumetric_weight_g;
                      const billable = (newAw != null || vw != null) ? Math.max(newAw ?? 0, vw ?? 0) : null;
                      return { ...p, actual_weight_g: newAw, billable_weight_g: billable };
                    });
                  }}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Volumetric Weight (g) (부피중량)</label>
                <input
                  type="number"
                  value={formData.volumetric_weight_g ?? ""}
                  onChange={(e) => {
                    const newVw = e.target.value === "" ? null : Number(e.target.value);
                    setFormData((p) => {
                      if (!p) return null;
                      const aw = p.actual_weight_g;
                      const billable = (aw != null || newVw != null) ? Math.max(aw ?? 0, newVw ?? 0) : null;
                      return { ...p, volumetric_weight_g: newVw, billable_weight_g: billable };
                    });
                  }}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Billable Weight (g) (과금중량) <span className="text-[#9E9C98] normal-case font-normal">(자동: max(실제, 부피))</span></label>
                <div className={readOnlyClass}>
                  {formData.billable_weight_g != null ? formData.billable_weight_g : "—"}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Dimensions (cm) (치수)</label>
                <input
                  value={formData.dimensions_cm ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, dimensions_cm: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Hazmat Status (위험물여부)</label>
                <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-4">
                  <HazmatCheckboxes
                    value={
                      typeof formData.hazmat_status === "string"
                        ? formData.hazmat_status
                        : formData.hazmat_status != null
                          ? JSON.stringify(formData.hazmat_status)
                          : null
                    }
                    onChange={(s) => setFormData((p) => ({ ...p!, hazmat_status: s as unknown as ScoutFinalReportsRow["hazmat_status"] }))}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Required Certificates (필요인증)</label>
                <input
                  value={formData.required_certificates ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, required_certificates: e.target.value }))}
                  className={inputClass}
                  placeholder="Comma-separated"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Shipping Notes (배송메모)</label>
                <textarea
                  rows={3}
                  value={formData.shipping_notes ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, shipping_notes: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Shipping Tier (배송티어)</label>
                <input
                  value={formData.shipping_tier ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, shipping_tier: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Tier 1"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Key Risk Ingredient (위험성분)</label>
                <input
                  value={formData.key_risk_ingredient ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, key_risk_ingredient: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Retinol, Aerosol"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Hazmat Summary (위험물요약)</label>
                <textarea
                  rows={2}
                  value={formData.hazmat_summary ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, hazmat_summary: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              {/* Compliance & Logistics Strategy - Steps 4-5 */}
              <div className="flex flex-col gap-3 border border-[#E8E6E1] rounded-xl p-4">
                <p className="text-sm font-semibold text-[#1A1916]">📦 Compliance & Logistics Strategy (Steps 4–5)</p>
                {["Customs / Compliance Strategy", "Logistics / Shipping Strategy"].map((header, i) => {
                  const steps = parseTipToSteps(formData.sourcing_tip);
                  return (
                    <div key={i} className="flex flex-col gap-1.5">
                      <label className={labelClass}>Step {i + 4}: {header}</label>
                      <textarea
                        rows={4}
                        value={steps[i + 3] ?? ""}
                        onChange={(e) => {
                          const current = parseTipToSteps(formData.sourcing_tip);
                          current[i + 3] = e.target.value;
                          setFormData((p) => ({ ...p!, sourcing_tip: serializeSourcingTip(current) }));
                        }}
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Section 7 — Global Market Prices (before Launch Kit) */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s7")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">🌍 Global Market Prices</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s7 ? "▼" : "▶"}</span>
          </button>
          {openSections.s7 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Global Prices (글로벌가격 — US/UK/EU/JP/SEA/UAE)</label>
                <GlobalPricesHelper
                  value={
                    typeof formData.global_prices === "string"
                      ? formData.global_prices
                      : formData.global_prices != null
                        ? JSON.stringify(formData.global_prices)
                        : null
                  }
                  onChange={(s) => setFormData((p) => ({ ...p!, global_prices: s as unknown as ScoutFinalReportsRow["global_prices"] }))}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 6A — Launch & Execution Kit */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s6a")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Launch & Execution Kit</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s6a ? "▼" : "▶"}</span>
          </button>
          {openSections.s6a && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest pt-2">
                📋 제조사·연락처 (Manufacturer & Contact)
              </p>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Manufacturer Name (제조사명)</label>
                <input
                  value={formData.m_name ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, m_name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Corporate Scale (기업 규모 e.g. SME)</label>
                <input
                  value={formData.corporate_scale ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, corporate_scale: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. SME"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Contact Email (문의 이메일)</label>
                <input
                  type="email"
                  value={formData.contact_email ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, contact_email: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Contact Phone (문의 전화번호)</label>
                <input
                  type="tel"
                  value={formData.contact_phone ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, contact_phone: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Manufacturer Website (제조사 홈페이지)</label>
                <input
                  type="url"
                  value={formData.m_homepage ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, m_homepage: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Wholesale Portal (도매 문의 링크)</label>
                <input
                  type="url"
                  value={formData.wholesale_link ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, wholesale_link: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Global Site URL (글로벌사이트URL)</label>
                <input
                  type="url"
                  value={formData.global_site_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, global_site_url: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>B2B Inquiry URL (B2B문의URL)</label>
                <input
                  type="url"
                  value={formData.b2b_inquiry_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, b2b_inquiry_url: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 6B — Brand Intel */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s6b")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">
              Brand Intel <span className="text-xs text-[#9E9C98] font-normal ml-2">(샘플, 수출메모만 확인)</span>
            </span>
            <span className="text-[#9E9C98] text-xs">{openSections.s6b ? "▼" : "▶"}</span>
          </button>
          {openSections.s6b && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <h3 className="text-lg font-semibold mb-4 text-[#1A1916]">
                Brand Intel <span className="text-xs text-[#9E9C98] font-normal ml-2">(샘플, 수출메모만 확인)</span>
              </h3>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Naver Link (네이버링크)</label>
                <input
                  type="url"
                  value={formData.naver_link ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, naver_link: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex items-center gap-2 mt-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    const naverUrl = formData.naver_link;
                    if (!naverUrl) {
                      alert("네이버 링크를 먼저 입력해주세요.");
                      return;
                    }

                    // Support both Daiso URL patterns
                    let match = naverUrl.match(/\/products\/(\d+)/);
                    if (!match) {
                      match = naverUrl.match(/pdNo=(\d+)/);
                    }

                    if (!match) {
                      alert(
                        "올바른 다이소 URL이 아닙니다.\n\n지원 형식:\n1. https://brand.naver.com/daiso/products/12345\n2. https://www.daisomall.co.kr/...?pdNo=12345"
                      );
                      return;
                    }

                    const productId = match[1];
                    const deliveredUrl = `https://delivered.co.kr/ko/stores/daiso-korea/products/${productId}`;

                    setFormData((p) => ({ ...p!, sample_policy: deliveredUrl }));

                    alert(`✅ 샘플정책 URL 자동 생성 완료!\n${deliveredUrl}`);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
                >
                  🔗 샘플정책 URL 자동생성
                </button>
                <span className="text-xs text-[#9E9C98]">
                  네이버 다이소 링크에서 자동으로 Delivered 코리아 URL 생성
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Sample Policy (샘플정책)</label>
                <input
                  type="url"
                  value={formData.sample_policy ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, sample_policy: e.target.value }))}
                  className={inputClass}
                  placeholder="https://delivered.co.kr/ko/stores/daiso-korea/products/..."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Export Cert Note (수출인증메모)</label>
                <input
                  value={formData.export_cert_note ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, export_cert_note: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Can OEM (OEM가능여부)</label>
                <select
                  value={formData.can_oem === true ? "true" : formData.can_oem === false ? "false" : ""}
                  onChange={(e) => setFormData((p) => ({
                    ...p!,
                    can_oem: e.target.value === "true" ? true : e.target.value === "false" ? false : null
                  }))}
                  className={inputClass}
                >
                  <option value="">— 미확인 —</option>
                  <option value="true">Yes (가능)</option>
                  <option value="false">No (불가)</option>
                </select>
              </div>
              <div className="border-t border-[#E8E6E1] pt-5">
                <p className="text-sm font-semibold text-[#1A1916] mb-4">🎯 CEO Direct Input</p>
              </div>
              <p className="text-xs text-[#9E9C98]">이 구역은 대표님이 브랜드와 직접 협의하거나 발품 팔아 확인한 정보만 입력합니다. Make.com이 자동으로 채우지 않습니다.</p>

              <div className="border-t border-[#E8E6E1] pt-5 flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Verified Cost (USD) (검증된 원가)</label>
                  <input
                    type="text"
                    value={formData.verified_cost_usd ?? ""}
                    onChange={(e) => setFormData((p) => ({ ...p!, verified_cost_usd: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Verified Cost Note (검증원가메모)</label>
                  <input
                    value={formData.verified_cost_note ?? ""}
                    onChange={(e) => setFormData((p) => ({ ...p!, verified_cost_note: e.target.value }))}
                    className={inputClass}
                    placeholder="Type 'undisclosed' to hide price"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Verified At (검증일시)</label>
                  <input
                    type="date"
                    value={formData.verified_at ? String(formData.verified_at).slice(0, 10) : ""}
                    onChange={(e) => setFormData((p) => ({ ...p!, verified_at: e.target.value ? e.target.value : null }))}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>MOQ (최소주문수량)</label>
                  <input
                    value={formData.moq ?? ""}
                    onChange={(e) => setFormData((p) => ({ ...p!, moq: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Lead Time (리드타임)</label>
                  <input
                    value={formData.lead_time ?? ""}
                    onChange={(e) => setFormData((p) => ({ ...p!, lead_time: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 6C — Media & Reference Assets */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s6c")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Media & Reference Assets</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s6c ? "▼" : "▶"}</span>
          </button>
          {openSections.s6c && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5 pt-2">
                <label className={labelClass}>YouTube Reference URLs (AI 참고용)</label>
                <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-4">
                  <AiPageLinksHelper
                    value={
                      typeof formData.ai_detail_page_links === "string"
                        ? formData.ai_detail_page_links
                        : formData.ai_detail_page_links != null
                          ? JSON.stringify(formData.ai_detail_page_links)
                          : null
                    }
                    onChange={(s) => setFormData((p) => ({ ...p!, ai_detail_page_links: s as unknown as ScoutFinalReportsRow["ai_detail_page_links"] }))}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Video URL (영상URL)</label>
                <input
                  value={formData.video_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, video_url: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Video URL 2 (Additional Footage)</label>
                <input
                  value={formData.video_url_2 ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, video_url_2: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Video URL 3 (Additional Footage)</label>
                <input
                  value={formData.video_url_3 ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, video_url_3: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>

        {/* Edit History */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden mt-8">
          <h2 className="px-6 py-4 border-b border-[#E8E6E1] text-sm font-semibold text-[#1A1916]">
            수정 이력 (Edit History)
          </h2>
          <div className="overflow-x-auto">
            {(() => {
              const hist = formData.edit_history as { entries?: { timestamp: string; changes: { field: string; before: string; after: string }[] }[] } | null | undefined;
              const entries = Array.isArray(hist?.entries) ? hist.entries : [];
              if (entries.length === 0) {
                return (
                  <div className="px-6 py-8 text-center text-[#6B6860] text-sm">
                    아직 수정 이력이 없습니다.
                  </div>
                );
              }
              return (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#F8F7F4] border-b border-[#E8E6E1] text-xs font-semibold text-[#9E9C98] uppercase tracking-widest">
                      <th className="px-4 py-3">일시</th>
                      <th className="px-4 py-3">필드 (한글)</th>
                      <th className="px-4 py-3">변경 전</th>
                      <th className="px-4 py-3">변경 후</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...entries].reverse().map((entry, ei) =>
                      entry.changes?.map((c, ci) => (
                        <tr key={`${ei}-${ci}`} className="border-t border-[#E8E6E1] text-sm">
                          <td className="px-4 py-2 text-[#6B6860] font-mono text-xs whitespace-nowrap">
                            {entry.timestamp ? new Date(entry.timestamp).toLocaleString("ko-KR") : "—"}
                          </td>
                          <td className="px-4 py-2 text-[#3D3B36]">
                            {FIELD_LABELS_KO[c.field] ?? c.field}
                          </td>
                          <td className="px-4 py-2 text-[#6B6860] max-w-[200px] truncate" title={c.before}>
                            {c.before}
                          </td>
                          <td className="px-4 py-2 text-[#16A34A] max-w-[200px] truncate" title={c.after}>
                            {c.after}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              );
            })()}
          </div>
        </div>
      </main>
    </div>
  );
}
\n`\n

---

## 3. ALL API ROUTES

All route handlers under `app/api/`:

| HTTP | Path | File | Purpose |
|------|------|------|---------|
| POST | `/api/admin/auth` | `app/api/admin/auth/route.ts` | Validates `ADMIN_PASSWORD`, sets httpOnly admin session cookie (`kps_admin_session=authenticated`, 7 days) |
| POST | `/api/admin/logout` | `app/api/admin/logout/route.ts` | Clears admin cookie, redirects to `/admin/login` |
| GET | `/api/admin/reports` | `app/api/admin/reports/route.ts` | Lists reports from `scout_final_reports`. Requires admin cookie |
| GET | `/api/admin/reports/[id]` | `app/api/admin/reports/[id]/route.ts` | Fetches full report row by UUID. Requires admin cookie |
| PATCH | `/api/admin/reports/[id]` | `app/api/admin/reports/[id]/route.ts` | Updates report fields. Revalidates `/weekly` paths. Requires admin cookie |
| GET | `/api/admin/site-config?key=` | `app/api/admin/site-config/route.ts` | Reads `site_config.value` by key. Requires admin cookie |
| POST | `/api/admin/site-config` | `app/api/admin/site-config/route.ts` | Upserts `site_config`; special `sample_product_id` / `is_teaser` logic |
| GET | `/api/billing/portal` | `app/api/billing/portal/route.ts` | LemonSqueezy customer portal URL for logged-in subscriber |
| POST | `/api/webhook` | `app/api/webhook/route.ts` | Re-exports POST from lemonsqueezy webhook (alias) |
| POST | `/api/webhooks/lemonsqueezy` | `app/api/webhooks/lemonsqueezy/route.ts` | Subscription webhook → updates `profiles.tier` |

**Notes:**
- `app/api/landing/ticker/` directory exists but contains **no route file**.
- Related: `app/auth/callback/route.ts` — Supabase OAuth (not under `app/api/`).

---

## 4. DEPENDENCIES (package.json)

### 4.1 Full dependencies

**dependencies:**
- `@supabase/ssr`: ^0.8.0
- `@supabase/supabase-js`: ^2.98.0
- `framer-motion`: ^12.35.0
- `lucide-react`: ^0.575.0
- `next`: 16.1.6
- `react`: 19.2.3
- `react-dom`: 19.2.3

**devDependencies:**
- `@tailwindcss/postcss`: ^4
- `@types/node`: ^20
- `@types/react`: ^19
- `@types/react-dom`: ^19
- `eslint`: ^9
- `eslint-config-next`: 16.1.6
- `sharp`: ^0.34.5
- `tailwindcss`: ^4
- `typescript`: ^5

### 4.2 @anthropic-ai/sdk installed?

**No.** Not in `package.json` dependencies.

### 4.3 UI library

| Library | Present? | Notes |
|---------|----------|-------|
| shadcn/ui | No | Custom `components/ui/*` only |
| Radix UI | No | — |
| Tailwind CSS v4 | Yes | Tokens in `globals.css` `@theme inline` |
| lucide-react | Yes | Icons on public pages |
| framer-motion | Yes | Landing animations |

Admin pages use inline Tailwind hex classes, not `components/ui/*`.

### 4.4 Existing AI integrations

| Integration | In codebase? |
|-------------|--------------|
| @anthropic-ai/sdk | **No** |
| OpenAI SDK | **No** |
| Gemini API | **No** (static image filenames only) |
| Make.com | Referenced in UI copy only; no SDK |
| AI fields | `ai_image_url`, `ai_detail_page_links`, `trend_entry_strategy` — stored/edited, not generated in-app |

---

## 5. DESIGN SYSTEM

### 5.1 tailwind.config.ts

**Does not exist.** Tailwind v4 uses `postcss.config.mjs` + `app/globals.css` `@theme inline`.

### 5.2 Global CSS — full content

Full 564-line `app/globals.css` is in **[Appendix: globals.css full content](#appendix-globalcss-full-content)** at the end of this report.

Key `@theme inline` tokens (Tailwind v4 equivalent of `tailwind.config.ts`):

| Token | Value |
|-------|-------|
| `--color-cream-50` … `--color-cream-400` | `#FDFCFA` → `#D4D1CA` |
| `--color-ink-900` … `--color-ink-100` | `#1A1916` → `#E4E2DE` |
| `--color-accent` / `--color-accent-hover` | `#16A34A` / `#15803D` |
| `--color-accent-light` / `--color-accent-muted` | `#DCFCE7` / `#BBF7D0` |
| `--color-danger` / `--color-danger-light` | `#DC2626` / `#FEE2E2` |
| `--radius-sm` … `--radius-2xl` | 6px → 24px |
| `--shadow-card`, `--shadow-elevated`, `--shadow-modal` | Card elevation shadows |

**postcss.config.mjs** (Tailwind entry):

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### 5.3 Admin color tokens (hardcoded)

- Page: `#F8F7F4` | Border: `#E8E6E1` | Text: `#1A1916`, `#3D3B36`, `#6B6860`, `#9E9C98`
- Accent: `#16A34A` / hover `#15803D` | Success bg: `#DCFCE7`
- Danger: `#DC2626` / bg `#FEE2E2`

### 5.4 Admin component patterns

Accordion cards, shared inputClass constants, HTML tables, modal overlay, specialized JSON helpers (GlobalPrices, Hazmat, AiLinks).

---

## 6. DATABASE

### 6.1 Supabase tables referenced in Admin

| Table | Operations | Fields / keys touched |
|-------|------------|------------------------|
| `scout_final_reports` | SELECT list, SELECT by id, UPDATE | All editable report columns; `is_teaser` when sample toggled |
| `site_config` | SELECT, UPSERT | Key `sample_product_id` → report UUID or null |

Admin uses `createServiceRoleClient()` from `lib/supabase/admin.ts` — **service role bypasses RLS**.

### 6.2 All known tables (repo schema)

| Table | Migration | Used in admin? |
|-------|-----------|----------------|
| `profiles` | 001 | No |
| `weeks` | 001 | No (FK on reports) |
| `scout_final_reports` | 001, 002, 003 | **Yes** |
| `user_favorites` | 003 (reference) | No |
| `site_config` | Not in migrations | **Yes** (live/production) |

### 6.3 Content / script related columns

| Column | Format | Admin section |
|--------|--------|---------------|
| `sourcing_tip` | TEXT with `[Step Name]` headers | s4 (steps 1–3), s5 (steps 4–5) |
| `buzz_summary` | TEXT | s4 |
| `growth_evidence`, `kr_evidence`, `global_evidence` | TEXT | s2, s4 |
| `opportunity_reasoning`, `trend_entry_strategy` | TEXT | s2, s4 |
| `top_selling_point`, `common_pain_point`, `viability_reason` | TEXT | s1, s3 |
| `seo_keywords`, `rising_keywords`, `viral_hashtags` | TEXT[] (5 slots in UI) | s4 |
| `platform_scores` | JSONB | s2 |
| `global_prices` | JSONB (regional listings) | s7 |
| `hazmat_status` | JSONB | s5 |
| `ai_detail_page_links` | JSON array | s6c |
| `ai_image_url` | TEXT URL | s1 |
| `edit_history` | JSONB `{ entries: [...] }` | Written on save; displayed in Edit History table |

---

## 7. EXISTING FEATURES IN ADMIN

### 7.1 What admin currently does

1. **Password gate** — Shared password via env `ADMIN_PASSWORD`; cookie session (not Supabase auth)
2. **Report inventory** — All rows from `scout_final_reports`, sorted by `market_viability` desc
3. **Full PDP-aligned editor** — 9 accordion sections mapping to product detail page sections
4. **Publish workflow** — `published` vs `hidden`; sets `published_at` on publish
5. **Sample report** — One report flagged via `site_config.sample_product_id` + `is_teaser=true`
6. **Audit trail** — Pre-save diff modal; persists to `edit_history` JSONB
7. **Complex field UIs** — GlobalPricesHelper, HazmatCheckboxes, AiPageLinksHelper
8. **CEO workflow** — Brand Intel manual fields; Daiso URL → Delivered sample link generator
9. **Client-side computed previews** — `gap_index`, `billable_weight_g`
10. **Navigation guard** — `beforeunload` when unsaved changes exist

### 7.2 What data it shows

| View | Data |
|------|------|
| **List** (`/admin`) | id prefix, week_id, product_name, market_viability, status (Live/Draft) |
| **Edit** (`/admin/[id]`) | Full `scout_final_reports` row (~80+ fields), image previews, edit history table |

### 7.3 What actions it allows

| Action | API / mechanism |
|--------|-----------------|
| Login | `POST /api/admin/auth` |
| Logout | `POST /api/admin/logout` |
| Filter list | Client: week dropdown, status (All/Draft/Live) |
| Open editor | Navigate to `/admin/[uuid]` |
| Edit fields | React local state |
| Set sample report | `GET/POST /api/admin/site-config` |
| Change status | Header `<select>` → PATCH on save |
| Save | Diff modal → `PATCH /api/admin/reports/[id]` |
| Manage global prices | Add/edit/delete regional listings |
| Manage YouTube refs | Up to 5 URLs |
| Toggle hazmat | Four boolean flags → JSON |
| Auto sample URL | Parse Naver Daiso product ID → Delivered.co.kr link |

### 7.4 What admin does NOT do

- User or subscription tier management
- Week batch create/publish UI
- File/image upload (URL strings only)
- In-app AI/LLM calls
- Analytics or dashboards
- Bulk edit/delete
- Create new report records (edit-only)

---

*End of scan report.*


## Appendix: globals.css full content

```css
@import "tailwindcss";

@theme inline {
  /* ── BRAND COLORS ── */
  --color-cream-50:  #FDFCFA;
  --color-cream-100: #F8F7F4;
  --color-cream-200: #F2F1EE;
  --color-cream-300: #E8E6E1;
  --color-cream-400: #D4D1CA;

  --color-ink-900:   #1A1916;
  --color-ink-700:   #3D3B36;
  --color-ink-500:   #6B6860;
  --color-ink-300:   #9E9C98;
  --color-ink-200:   #C4C2BE;
  --color-ink-100:   #E4E2DE;

  --color-accent:         #16A34A;
  --color-accent-hover:   #15803D;
  --color-accent-light:   #DCFCE7;
  --color-accent-muted:   #BBF7D0;

  --color-danger:         #DC2626;
  --color-danger-light:   #FEE2E2;
  --color-warning:        #D97706;
  --color-warning-light:  #FEF3C7;
  --color-info:           #2563EB;
  --color-info-light:     #DBEAFE;

  /* ── SEMANTIC ALIASES ── */
  --color-bg-page:        var(--color-cream-100);
  --color-bg-card:        #FFFFFF;
  --color-bg-subcard:     var(--color-cream-200);
  --color-border:         var(--color-cream-300);
  --color-border-strong:  var(--color-cream-400);
  --color-text-primary:   var(--color-ink-900);
  --color-text-secondary: var(--color-ink-500);
  --color-text-tertiary:  var(--color-ink-300);

  /* ── TYPOGRAPHY ── */
  --font-sans:  'Inter', system-ui, -apple-system, sans-serif;
  --font-mono:  'JetBrains Mono', 'Fira Code', monospace;

  /* ── RADIUS ── */
  --radius-sm:  0.375rem;  /* 6px  — badges, pills */
  --radius-md:  0.5rem;    /* 8px  — inputs, buttons */
  --radius-lg:  0.75rem;   /* 12px — small cards */
  --radius-xl:  1rem;      /* 16px — cards */
  --radius-2xl: 1.5rem;    /* 24px — section wrappers */

  /* ── SHADOWS ── */
  --shadow-card:    0 1px 3px 0 rgb(26 25 22 / 0.06), 0 1px 2px -1px rgb(26 25 22 / 0.04);
  --shadow-elevated: 0 4px 6px -1px rgb(26 25 22 / 0.08), 0 2px 4px -2px rgb(26 25 22 / 0.05);
  --shadow-modal:   0 20px 25px -5px rgb(26 25 22 / 0.1);
}

@layer base {
  body {
    background-color: var(--color-bg-page);
    color: var(--color-text-primary);
    font-family: var(--font-sans);
    font-size: 1.0625rem; /* ~17px — global UI scale-up for 100% zoom */
    -webkit-font-smoothing: antialiased;
  }

  * {
    border-color: var(--color-border);
  }
}

:root {
  --background: #030303;
  --foreground: #ffffff;
  --indigo: #6366f1;
  --purple: #a855f7;
  --amber: #f59e0b;
  --bg-card: #0d0d0f;
  --border: rgba(255, 255, 255, 0.08);
  --text-muted: rgba(255, 255, 255, 0.45);
  --text-mid: rgba(255, 255, 255, 0.7);
}

html {
  scroll-behavior: smooth;
}

@keyframes hero-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-hero-fade-in {
  animation: hero-fade-in 0.8s ease-out both;
}

@keyframes s2-scale-noise {
  to {
    opacity: 1;
  }
}

@keyframes s2-scale-alpha {
  to {
    opacity: 1;
  }
}

@keyframes floatDrift {
  0%   { transform: translateY(0px) rotate(var(--r, 0deg)); }
  100% { transform: translateY(-6px) rotate(var(--r, 0deg)); }
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.5; transform: scale(0.85); }
}

/* ── S6 Pipeline ── */
@keyframes floatDrift {
  0%   { transform: translateY(0px); }
  100% { transform: translateY(-8px); }
}
@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.8); }
}

.s6-section {
  background: #F8F7F4;
  padding: clamp(80px, 10vw, 140px) clamp(32px, 6vw, 100px);
}

.s6-headline {
  text-align: center;
  margin-bottom: 80px;
}
.s6-headline h2 {
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #0A0908;
  line-height: 1.05;
  margin-bottom: 16px;
}
.s6-headline p {
  font-size: 14px;
  color: rgba(10,9,8,0.4);
  font-weight: 400;
}

/* ── 데스크탑: 가로 flex (max-w-6xl 정렬) ── */
.s6-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  max-width: 72rem; /* 1152px, max-w-6xl */
  margin: 0 auto;
  gap: 0;
}

.s6-step {
  flex: 0 0 auto;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.s6-arrow-wrap {
  flex: 0 0 auto;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0;
  color: rgba(10,9,8,0.18);
  font-size: 1.2rem;
  font-weight: 300;
}

.s6-label {
  font-size: 12px;
  font-weight: 900;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #16A34A;
  line-height: 1;
  margin-bottom: 18px;
  display: block;
  text-align: left;
}

/* ── PILL CLOUD ── */
.s6-pill-cloud {
  position: relative;
  width: 200px;
  height: 200px;
}
.s6-pill {
  position: absolute;
  background: #FFFFFF;
  border: 1px solid rgba(10,9,8,0.07);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 500;
  color: #0A0908;
  box-shadow: 0 2px 8px rgba(10,9,8,0.06);
  white-space: nowrap;
  animation: floatDrift 4s ease-in-out infinite alternate;
}

/* ── KILL ROW ── */
.s6-kill-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}
.s6-kill-tag {
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #B91C1C;
  background: rgba(185,28,28,0.07);
  border-radius: 4px;
  padding: 2px 6px;
  flex-shrink: 0;
}
.s6-kill-text {
  font-size: 12px;
  color: rgba(10,9,8,0.5);
  font-weight: 400;
  text-decoration: line-through;
  text-decoration-color: rgba(185,28,28,0.35);
  white-space: nowrap;
}
.s6-filter-desc {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.s6-filter-desc p {
  font-size: 12px;
  color: rgba(10,9,8,0.4);
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

/* ── VERIFY ROW ── */
.s6-verify-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 9px 0;
}
.s6-verify-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  min-width: 20px;
  border-radius: 50%;
  background: #16A34A;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 900;
  flex-shrink: 0;
  margin-top: 3px;
}
.s6-v-main {
  font-size: 14px;
  color: #0A0908;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}
.s6-v-sub {
  font-size: 11px;
  color: rgba(10,9,8,0.4);
  font-weight: 400;
  white-space: nowrap;
  margin-top: 1px;
}

/* ── OUTPUT ── */
.s6-output-num {
  font-size: clamp(4rem, 7vw, 6rem);
  font-weight: 900;
  color: #16A34A;
  letter-spacing: -0.02em;
  line-height: 1;
  margin: 4px 0 8px;
  text-align: left;
  -webkit-font-smoothing: antialiased;
}
.s6-output-desc {
  font-size: 13px;
  color: rgba(10,9,8,0.45);
  line-height: 1.7;
  text-align: left;
}
.s6-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  padding: 4px 12px;
  border: 1px solid rgba(22,163,74,0.25);
  border-radius: 999px;
  background: rgba(22,163,74,0.05);
}
.s6-badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #16A34A;
  animation: pulseDot 2s infinite;
}
.s6-badge span {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #16A34A;
}

/* ── 모바일 (768px 이하) ── */
@media (max-width: 768px) {
  .s6-row {
    flex-direction: column;
    gap: 0;
    align-items: stretch;
  }
  .s6-step {
    width: 100%;
    padding: 28px 0;
    border-bottom: 1px solid rgba(10,9,8,0.07);
  }
  .s6-step:last-child {
    border-bottom: none;
  }
  .s6-arrow-wrap {
    display: none;
  }
  .s6-pill-cloud {
    width: 100%;
    height: 200px;
  }
}

@media print {

  /* ── 1. HIDE ALL WEB UI CHROME ── */

  /* Hide top header / navigation bar */
  header,
  [class*="header"],
  [class*="Header"],
  nav,
  [class*="navbar"],
  [class*="NavBar"] {
    display: none !important;
  }

  /* Hide left sidebar (ClientLeftNav) */
  /* Target: the aside or nav wrapper rendered by ClientLeftNav */
  /* Also target common sidebar wrapper patterns */
  aside,
  [class*="sidebar"],
  [class*="left-nav"],
  [class*="ClientLeftNav"],
  [class*="leftnav"],
  [class*="side-nav"] {
    display: none !important;
  }

  /* Hide bottom account/tier/logout area inside sidebar */
  [class*="logout"],
  [class*="Logout"],
  [class*="tier-badge"],
  [class*="account-info"] {
    display: none !important;
  }

  /* Hide "Back to week" navigation link */
  a[href*="/weekly"]:first-of-type {
    display: none !important;
  }

  /* Hide any sticky banners, overlays, toasts */
  [class*="sticky"],
  [class*="toast"],
  [class*="modal"],
  [class*="overlay"],
  [class*="PaywallOverlay"],
  [class*="banner"] {
    display: none !important;
  }

  /* Hide upgrade CTA buttons at bottom of report */
  [class*="upgrade"],
  [class*="cta"],
  [class*="upsell"] {
    display: none !important;
  }

  /* Force full-width layout when sidebar is hidden */
  .print-hide + * {
    width: 100% !important;
    max-width: 100% !important;
    margin-left: 0 !important;
    padding-left: 0 !important;
    flex: 1 1 100% !important;
  }

  /* Also target the parent flex container */
  .print-hide {
    display: none !important;
    width: 0 !important;
    min-width: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    flex: 0 0 0 !important;
  }

  /* ── 2. MAIN CONTENT EXPANDS TO FULL WIDTH ── */

  /* Reset body and html */
  html, body {
    background: #FFFFFF !important;
    color: #1A1916 !important;
    font-size: 11pt !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
  }

  h1 { font-size: 18pt !important; }
  h2 { font-size: 14pt !important; }
  h3 { font-size: 12pt !important; }

  /* Make main content fill the full page width since sidebar is gone */
  main,
  [class*="main-content"],
  [class*="content-area"],
  [class*="report-body"] {
    margin-left: 0 !important;
    padding-left: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  /* Page wrapper — remove sidebar offset */
  .max-w-6xl,
  .max-w-5xl,
  .max-w-4xl {
    max-width: 100% !important;
    margin: 0 auto !important;
    padding: 0 24px !important;
  }

  /* ── 3. PAGE BREAK — PREVENT CARD SLICING ── */

  /* Only prevent breaks inside small cards, not entire sections */
  section,
  article {
    break-inside: auto !important;
    page-break-inside: auto !important;
  }

  /* Only avoid breaks inside small individual cards */
  [class*="rounded-2xl"],
  [class*="rounded-xl"] {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }

  /* Force page break before each major report section */
  [id*="section"],
  [class*="report-section"] {
    break-before: auto;
    page-break-before: auto;
  }

  /* Reduce excessive spacing between sections for print */
  .space-y-6 > * + * {
    margin-top: 12px !important;
  }
  .space-y-8 > * + * {
    margin-top: 16px !important;
  }
  .mb-6, .mb-8, .mb-10, .mb-12 {
    margin-bottom: 12px !important;
  }
  .pb-6, .pb-8, .pb-10, .pb-12 {
    padding-bottom: 12px !important;
  }
  .pt-6, .pt-8, .pt-10 {
    padding-top: 12px !important;
  }
  .py-6, .py-8, .py-10 {
    padding-top: 12px !important;
    padding-bottom: 12px !important;
  }

  /* ── 4. PRINT COLOR & LINK ADJUSTMENTS ── */

  /* Ensure colors print correctly */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Hide URLs that appear after links when printing */
  a[href]::after {
    content: none !important;
  }

  /* ── 5. PAGE MARGINS (A4 B2B REPORT STYLE) ── */
  @page {
    size: A4;
    margin: 16mm 20mm 16mm 20mm;
  }

  /* Kill the 60vh bottom padding that creates blank pages */
  .pb-\[60vh\] {
    padding-bottom: 0 !important;
  }

  /* Kill min-h-screen that forces full viewport height */
  .min-h-screen {
    min-height: 0 !important;
  }

  /* Kill sidebar left padding on main column */
  .pl-\[18rem\] {
    padding-left: 0 !important;
  }

  /* Kill top margin on content stack */
  .mt-10 {
    margin-top: 8px !important;
  }

  /* Kill top padding on content wrapper */
  .pt-10 {
    padding-top: 8px !important;
  }
}

```
