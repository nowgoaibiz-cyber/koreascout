# KoreaScout Tier System Investigation Report

Date: 2026-05-13  
Investigated By: Cursor AI

---

## 실행 방법 및 범위 (Methodology)

요청하신 bash 명령 세트는 **Git Bash**에서 동일한 `grep` / `find` 논리로 **한 스크립트에 순차 합쳐** 실행했습니다. 최초 전체 트리(`node_modules` 포함) `find`는 **30초 이상 지연(사실상 중단)**되어, 이후 스캔은 앱 소스만 대상으로 **`./node_modules`**, **`./.git`**, **`./.next`**, **`./dist`** 를 `grep --exclude-dir` 및 `find -prune`으로 제외했습니다.

- **산출물 텍스트** (프로젝트 루트 `c:\k-productscout\`): `tier_scan.txt`, `tier_vars.txt`, `locked_components.txt`, `lemonsqueezy.txt`, `pdp_files.txt`, `sourcing_tip.txt`, `verified_cost.txt`, `landing_pricing.txt`, `pricing_files.txt`, `tier_labels.txt`, `type_defs.txt`, `env_check.txt`
- **민감 정보**: `env_check.txt` 및 본 보고서의 `.env` 관련 값은 **API 키·웹훅 시크릿을 마스킹**했습니다. Variant ID 숫자는 비밀이 아닌 설정값으로 그대로 두었습니다.
- **명령 1A 한계**: `tier.*===.*'standard'` 패턴은 **작은따옴표 리터럴만** 매칭합니다. 코드베이스에는 `tier === "standard"`(큰따옴표)가 다수 있으나 **아래 Section 1.1 붙여넣기 결과(`tier_scan.txt`)에는 나타나지 않습니다.** 전체 표준 티어 참조는 **CRITICAL FINDINGS**의 보충 목록을 참고하세요.
- **명령 1D `LEMONSQUEEZY TIER MAPPING`**: `grep "lemon"`이 **대소문자 구분**이라 `LemonSqueezy` 주석/문자열이 1차 `grep`에서 걸리지 않아 `lemonsqueezy.txt` 해당 절이 비어 있습니다. Variant/티어 매핑은 동일 파일의 **VARIANT_ID MAPPING** 절에 있습니다.

---

## Executive Summary

KoreaScout는 **`"free" | "standard" | "alpha"`** 3단 티어를 `types/database.ts`, 서버 인증(`lib/auth-server.ts`), 주간 리포트 PDP(`app/weekly/[weekId]/[id]/page.tsx`), 리포트 컴포넌트(`MarketIntelligence`, `SocialProofTrendIntelligence`, `SupplierContact` 등)에서 일관되게 사용합니다. **LemonSqueezy**는 `c:\k-productscout\app\api\webhooks\lemonsqueezy\route.ts`에서 `variant_id` → `standard` / `alpha` 매핑을 수행합니다. **가격 상수**는 `c:\k-productscout\src\config\pricing.ts`(Standard $79, Alpha $199)와 랜딩/FAQ 카피가 함께 존재합니다. **`LockedSection` / `PaywallOverlay`**는 파일로 존재하나, 현재 **`PaywallOverlay`는 다른 TSX에서 import 사용처가 검색되지 않음**(배럴 `components/ui/index.ts` export만 확인). **`GlobalPricingTable`**은 파일 주석상 orphan입니다.

---

## SECTION 1: Tier Logic Analysis

### 1.1 Tier Comparison Code

`c:\k-productscout\tier_scan.txt` 전체 내용:

```
=== TIER COMPARISON: 'standard' ===
./components/layout/ClientLeftNav.tsx:132:                    {tier === 'alpha' ? 'Alpha' : tier === 'standard' ? 'Standard' : 'Free'}

=== TIER COMPARISON: 'alpha' ===
./components/layout/ClientLeftNav.tsx:127:                      tier === 'alpha'
./components/layout/ClientLeftNav.tsx:132:                    {tier === 'alpha' ? 'Alpha' : tier === 'standard' ? 'Standard' : 'Free'}
./components/ui/PaywallOverlay.tsx:25:    tier === 'alpha' ? `Go Alpha ${PRICING.CURRENCY}${PRICING.ALPHA.monthly}/mo →` : `Go Standard ${PRICING.CURRENCY}${PRICING.STANDARD.monthly}/mo →`
```

### 1.2 Tier Variable References

`c:\k-productscout\tier_vars.txt` 전체 내용:

```
=== SUBSCRIPTION_TIER References ===

=== USER_TIER References ===

=== TIER ENUM/TYPE DEFINITIONS ===
./components/GlobalPricingTable.tsx:21:type Tier = "free" | "standard" | "alpha";
./components/layout/ClientLeftNav.tsx:7:export type NavTier = 'free' | 'standard' | 'alpha'
./components/ui/index.ts:12:export type { PaywallOverlayProps, PaywallTier } from './PaywallOverlay'
./components/ui/PaywallOverlay.tsx:7:export type PaywallTier = 'standard' | 'alpha'
./lib/auth-server.ts:2:import type { ScoutFinalReportsRow, Tier } from "@/types/database";
./types/database.ts:10:export type Tier = "free" | "standard" | "alpha";
```

### 1.3 LockedSection & Paywall Components

`c:\k-productscout\locked_components.txt` 전체 내용:

```
=== LOCKED SECTION & PAYWALL FILES ===
./components/LockedSection.tsx
./components/ui/PaywallOverlay.tsx
./locked_components.txt

=== LOCKED/PAYWALL COMPONENT USAGE ===
./components/LockedSection.tsx:5:export interface LockedSectionProps {
./components/LockedSection.tsx:51:export function LockedSection({
./components/LockedSection.tsx:56:}: LockedSectionProps) {
./components/ui/PaywallOverlay.tsx:7:export type PaywallTier = 'standard' | 'alpha'
./components/ui/PaywallOverlay.tsx:9:export interface PaywallOverlayProps {
./components/ui/PaywallOverlay.tsx:10:  tier: PaywallTier
./components/ui/PaywallOverlay.tsx:17:export function PaywallOverlay({
./components/ui/PaywallOverlay.tsx:23:}: PaywallOverlayProps) {
```

**Files Found:**

- `c:\k-productscout\components\LockedSection.tsx`
- `c:\k-productscout\components\ui\PaywallOverlay.tsx`
- (스캔 산출물) `c:\k-productscout\locked_components.txt` — 파일명에 `locked` 포함으로 `find *locked*`에 매칭된 항목

**보충 (요청 grep은 `*.tsx`만)**: `LockedSection` 문자열은 위 정의 파일 외 **추가 TSX/TS import 사용처 없음**(프로젝트 전체 `*.ts`,`*.tsx` 검색). `Paywall` 문자열은 `PaywallOverlay.tsx` 및 `c:\k-productscout\components\ui\index.ts` export만 존재.

### 1.4 LemonSqueezy Integration Points

`c:\k-productscout\lemonsqueezy.txt` 전체 내용:

```
=== VARIANT_ID MAPPING ===
./app/api/webhooks/lemonsqueezy/route.ts:7:/** Standard $69 — checkout URL UUID (LemonSqueezy 웹훅은 variant_id를 숫자로 보낼 수 있음) */
./app/api/webhooks/lemonsqueezy/route.ts:11:/** Standard/Alpha 숫자 variant_id (.env: LEMONSQUEEZY_VARIANT_ID_STANDARD / _ALPHA) — 일치 시 tier 업데이트 */
./app/api/webhooks/lemonsqueezy/route.ts:34:function variantIdToTier(variantId: string | number): "standard" | "alpha" | null {
./app/api/webhooks/lemonsqueezy/route.ts:36:    typeof variantId === "number"
./app/api/webhooks/lemonsqueezy/route.ts:37:      ? variantId
./app/api/webhooks/lemonsqueezy/route.ts:38:      : typeof variantId === "string" && /^\d+$/.test(variantId)
./app/api/webhooks/lemonsqueezy/route.ts:39:        ? parseInt(variantId, 10)
./app/api/webhooks/lemonsqueezy/route.ts:46:  const id = String(variantId).toLowerCase();
./app/api/webhooks/lemonsqueezy/route.ts:92:          variant_id?: number | string;
./app/api/webhooks/lemonsqueezy/route.ts:111:    if (attrs?.variant_id !== undefined) {
./app/api/webhooks/lemonsqueezy/route.ts:112:      console.log("[lemonsqueezy] variant_id:", attrs.variant_id, "typeof:", typeof attrs.variant_id);
./app/api/webhooks/lemonsqueezy/route.ts:116:      const variantId = attrs?.variant_id;
./app/api/webhooks/lemonsqueezy/route.ts:117:      if (variantId == null) {
./app/api/webhooks/lemonsqueezy/route.ts:118:        console.warn("[lemonsqueezy] 400: Missing variant_id. attrs:", JSON.stringify(attrs ?? {}));
./app/api/webhooks/lemonsqueezy/route.ts:120:          { error: "Missing variant_id" },
./app/api/webhooks/lemonsqueezy/route.ts:124:      const tier = variantIdToTier(variantId);
./app/api/webhooks/lemonsqueezy/route.ts:127:          "[lemonsqueezy] 400: Unknown variant_id. received:",
./app/api/webhooks/lemonsqueezy/route.ts:128:          variantId,
./app/api/webhooks/lemonsqueezy/route.ts:130:          typeof variantId,
./app/api/webhooks/lemonsqueezy/route.ts:131:          typeof variantId === "number"
./app/api/webhooks/lemonsqueezy/route.ts:132:            ? "→ LemonSqueezy는 웹훅에 숫자 variant_id를 보냅니다. .env에 LEMONSQUEEZY_VARIANT_ID_STANDARD, LEMONSQUEEZY_VARIANT_ID_ALPHA (숫자) 설정 후 재시도."
./app/api/webhooks/lemonsqueezy/route.ts:136:          { error: "Unknown variant_id" },

=== LEMONSQUEEZY TIER MAPPING ===

=== SUBSCRIPTION WEBHOOK HANDLER ===
./app/api/webhook/route.ts
./app/api/webhooks/lemonsqueezy/route.ts
```

**Webhook Handler Location:**

- `c:\k-productscout\app\api\webhooks\lemonsqueezy\route.ts`
- `c:\k-productscout\app\api\webhook\route.ts`

---

## SECTION 2: PDP Component Analysis

### 2.1 PDP Page File Locations

`c:\k-productscout\pdp_files.txt` 전체 내용:

```
=== WEEKLY REPORT PDP ===
./app/weekly/page.tsx
./app/weekly/[weekId]/page.tsx
./app/weekly/[weekId]/[id]/page.tsx

=== REPORTS PDP ===

=== ALL REPORT-RELATED PAGES ===
./app/sample-report/page.tsx
```

**Main PDP File:**

- `c:\k-productscout\app\weekly\[weekId]\[id]\page.tsx` (단일 제품 리포트 PDP; `MarketIntelligence` 등 연결)

### 2.2 sourcing_tip Field Rendering

`c:\k-productscout\sourcing_tip.txt` 전체 내용:

```
=== SOURCING_TIP RENDERING ===
./app/admin/[id]/page.tsx:66:  sourcing_tip: "소싱팁",
./app/admin/[id]/page.tsx:285:    "platform_scores", "sourcing_tip", "hs_code", "hs_description", "status_reason", "composition_info", "spec_summary",
./app/admin/[id]/page.tsx:1053:                  const steps = parseTipToSteps(formData.sourcing_tip);
./app/admin/[id]/page.tsx:1061:                          const current = parseTipToSteps(formData.sourcing_tip);
./app/admin/[id]/page.tsx:1063:                          setFormData((p) => ({ ...p!, sourcing_tip: serializeSourcingTip(current) }));
./app/admin/[id]/page.tsx:1252:                  const steps = parseTipToSteps(formData.sourcing_tip);
./app/admin/[id]/page.tsx:1260:                          const current = parseTipToSteps(formData.sourcing_tip);
./app/admin/[id]/page.tsx:1262:                          setFormData((p) => ({ ...p!, sourcing_tip: serializeSourcingTip(current) }));
./app/weekly/[weekId]/[id]/page.tsx:122:    (report.sourcing_tip && report.sourcing_tip.trim());
./app/weekly/[weekId]/[id]/page.tsx:131:    (report.sourcing_tip && report.sourcing_tip.trim());
./components/report/SocialProofTrendIntelligence.tsx:26:  const allSteps = parseSourcingStrategy(report.sourcing_tip);
./components/report/SourcingIntel.tsx:23:  const allSteps = parseSourcingStrategy(report.sourcing_tip);
./components/report/SupplierContact.tsx:38:    (report.sourcing_tip && report.sourcing_tip.trim());

=== B2B SOURCING STRATEGY SECTION ===
./app/admin/[id]/page.tsx:216:      "B2B Sourcing Strategy",
./app/admin/[id]/page.tsx:1052:                {["Marketing Strategy", "Price / Margin Strategy", "B2B Sourcing Strategy"].map((header, i) => {
./components/report/SocialProofTrendIntelligence.tsx:222:            { label: "B2B Sourcing Strategy" },

=== SCOUT STRATEGY REPORT COMPONENT ===
./app/admin/[id]/page.tsx:1049:              {/* Scout Strategy Report - Steps 1-3 */}
./app/admin/[id]/page.tsx:1051:                <p className="text-sm font-semibold text-[#1A1916]">📋 Scout Strategy Report (Steps 1–3)</p>
./app/pricing/page.tsx:79:      { feature: "Scout Strategy Report", free: "—", standard: "—", alpha: "✓" },
./components/report/SocialProofTrendIntelligence.tsx:7:import { normalizeToArray, parseSourcingStrategy } from "./utils";
./components/report/SocialProofTrendIntelligence.tsx:26:  const allSteps = parseSourcingStrategy(report.sourcing_tip);
./components/report/SocialProofTrendIntelligence.tsx:216:        <p className="text-xl font-bold text-[#1A1916] mb-10">Scout Strategy Report</p>
./components/report/SourcingIntel.tsx:10:import { describeShippingTier, parseSourcingStrategy } from "./utils";
./components/report/SourcingIntel.tsx:23:  const allSteps = parseSourcingStrategy(report.sourcing_tip);
```

**Components Displaying sourcing_tip:**

- `c:\k-productscout\components\report\SocialProofTrendIntelligence.tsx` (라인 26 등)
- `c:\k-productscout\components\report\SourcingIntel.tsx` (라인 23)
- `c:\k-productscout\components\report\SupplierContact.tsx` (라인 38 — 존재 여부 체크)
- `c:\k-productscout\app\weekly\[weekId]\[id]\page.tsx` (라인 122, 131)
- (어드민 편집기) `c:\k-productscout\app\admin\[id]\page.tsx`

### 2.3 verified_cost_usd Button Implementation

`c:\k-productscout\verified_cost.txt` 전체 내용:

```
=== VERIFIED SUPPLIER COST BUTTON ===
./components/report/MarketIntelligence.tsx:267:                      ✓ View Verified Supplier Cost ↓
./components/report/MarketIntelligence.tsx:271:                      🔒 View Verified Supplier Cost

=== VERIFIED_COST_USD FIELD USAGE ===
./app/admin/[id]/page.tsx:78:  verified_cost_usd: "검증된원가(USD)",
./app/admin/[id]/page.tsx:287:    "verified_cost_usd", "verified_cost_note", "verified_at", "moq", "lead_time", "sample_policy", "export_cert_note",
./app/admin/[id]/page.tsx:1414:                  value={formData.verified_cost_usd ?? ""}
./app/admin/[id]/page.tsx:1415:                  onChange={(e) => setFormData((p) => ({ ...p!, verified_cost_usd: e.target.value }))}
./components/report/SupplierContact.tsx:43:  const verifiedCostUsd = report.verified_cost_usd ?? null;
./data/sampleReportData.ts:70:  verified_cost_usd: null,
./lib/auth-server.ts:65:    "verified_cost_usd",
./types/database.ts:92:  verified_cost_usd?: string | null;

=== ALPHA MEMBERS MESSAGE ===
./components/FaqAccordion.tsx:34:        a: "Every week, KoreaScout publishes 10+ curated K-products. Standard and Alpha members get instant access to the latest 3 weeks — that's 30+ verified products from day one. Free members get access to one unlocked week with a 14-day delay. Every product in your report has cleared our Margin Multiplier threshold and passed multi-source Korean demand verification.",
./components/LandingPipelineSneakPeek.tsx:87:                  Alpha members get verified supplier quotes
./components/ProductIdentity.tsx:233:                  Alpha members get verified supplier quotes
```

**Button Component Location:**

- `c:\k-productscout\components\report\MarketIntelligence.tsx` — 라인 **267**, **271** (`View Verified Supplier Cost` 카피)

---

## SECTION 3: Landing & Pricing Pages

### 3.1 Landing Page Structure

`c:\k-productscout\landing_pricing.txt` 전체 내용:

```
=== LANDING PAGE MAIN FILE ===
./app/page.tsx

=== LANDING PAGE COMPONENTS ===
./components/Hero.tsx
./components/HeroCTA.tsx
./components/LandingPipelineSneakPeek.tsx
./components/LandingTimeWidget.tsx
```

**Main Landing Page:**

- `c:\k-productscout\app\page.tsx`

### 3.2 Pricing Components

`c:\k-productscout\pricing_files.txt` 전체 내용:

```
=== PRICING PAGE/SECTION FILES ===
./app/pricing
./components/GlobalPricingTable.tsx
./landing_pricing.txt
./pricing_files.txt
./src/config/pricing.ts
./supabase/migrations/002_product_identity_pricing.sql

=== PRICING COMPONENT USAGE ===
./app/account/page.tsx:220:              href="/pricing"
./app/account/page.tsx:230:                href="/pricing"
./app/page.tsx:10:import { PRICING } from "@/src/config/pricing";
./app/page.tsx:403:                    <p className="mt-3 text-xs text-white/40 italic">More details available on Pricing page</p>
./app/page.tsx:411:                        href="/pricing"
./app/page.tsx:414:                        View Pricing & Access →
./app/page.tsx:425:        {/* ══ S8: PRICING (3-tier from pricing page, v5 copy) ═══════════════════════════════════ */}
./app/page.tsx:426:        <section id="pricing-cards" className="bg-white py-24 px-6">
./app/page.tsx:429:              Pricing
./app/page.tsx:605:        {/* ══ S8b: INSTITUTIONAL POLICY (Alpha Moat) — synced from pricing page ═══════════════ */}
./app/page.tsx:753:                href="#pricing-cards"
./app/page.tsx:781:                href="/pricing"
./app/page.tsx:784:                Pricing
./app/pricing/page.tsx:3:import { PRICING } from "@/src/config/pricing";
./app/pricing/page.tsx:7:  title: "Pricing — KoreaScout",
./app/pricing/page.tsx:109:export default async function PricingPage() {
./app/pricing/page.tsx:136:      <section id="pricing-cards" className="bg-white py-24 px-6">
./app/sample-report/page.tsx:54:            href="/pricing"
./app/weekly/page.tsx:296:                                  href="/pricing"
./app/weekly/[weekId]/page.tsx:93:              href="/pricing"
./app/weekly/[weekId]/[id]/page.tsx:5:import { PRICING } from "@/src/config/pricing";
./app/weekly/[weekId]/[id]/page.tsx:209:                  <Link href="/pricing" className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] underline transition-colors">
./app/weekly/[weekId]/[id]/page.tsx:214:                  <Link href="/pricing" className="text-sm font-medium text-[#16A34A] hover:text-[#15803D] underline transition-colors">
./components/AlphaVaultPreview.tsx:107:          href="/pricing"
./components/FaqAccordion.tsx:53:        a: "No. Standard at $79/mo is built exactly for creators. Alpha adds factory contacts, MOQ pricing, HS Codes, and logistics data — tools for sellers who want to source and ship. If your goal is to grow your channel, Standard is all you need.",
./components/FaqAccordion.tsx:83:        a: "This is a structural decision, not a marketing gimmick. Each Alpha product report includes direct factory contacts and MOQ pricing. If 10,000 sellers receive the same supplier contact simultaneously, the factory gets overwhelmed, MOQs increase, and pricing negotiation leverage disappears. 3,000 is the ceiling at which our intelligence retains its commercial value. When that ceiling is hit, Alpha closes. This protects your investment, not ours.",
./components/FaqAccordion.tsx:87:        a: "Standard gives you the full trend intelligence layer: Gap Index, Margin Multiplier, Platform Velocity, Growth Signal. That alone replaces 58 hours of manual sourcing research per month. Alpha adds the action layer: verified factory contacts, MOQ + EXW pricing, HS Code reference, compliance flags, 4K On-Site Sourcing Footage (Raw), SEO keywords, and a broker email draft. The $120 difference buys you a complete sourcing brief — ready to act on, not just read. If your average margin is $8/unit and you source 200 units from one Alpha-sourced product, that's $1,600 gross from a $199 subscription. The math works on the first product.",
./components/GlobalPricingTable.tsx:23:interface GlobalPricingTableProps {
./components/GlobalPricingTable.tsx:45:export function GlobalPricingTable({ prices, tier, isTeaser, sourcingTip }: GlobalPricingTableProps) {
./components/GlobalPricingTable.tsx:80:      <h2 className="text-lg font-bold text-[#1A1916] mb-3">Global Pricing Matrix</h2>
./components/LandingPipelineSneakPeek.tsx:68:            {/* 중단: Pricing & Alpha Lock */}
./components/LandingTimeWidget.tsx:5:import { PRICING } from "@/src/config/pricing";
./components/layout/HeaderNavClient.tsx:6:import { PRICING } from "@/src/config/pricing";
./components/layout/HeaderNavClient.tsx:68:            <Link href="/pricing" className={ghostClass} style={transitionStyle}>
./components/layout/HeaderNavClient.tsx:69:              Pricing
./components/layout/HeaderNavClient.tsx:98:            <Link href="/pricing" className={ghostClass} style={transitionStyle}>
./components/layout/HeaderNavClient.tsx:99:              Pricing
./components/layout/HeaderNavClient.tsx:103:            <Link href="/pricing" className={ghostClass} style={transitionStyle}>
./components/layout/HeaderNavClient.tsx:147:          <Link href="/pricing" className="block py-5 text-2xl font-black text-[#1A1916] border-b border-[#E8E6E1] tracking-tight" onClick={onClose}>Pricing</Link>
./components/layout/HeaderNavClient.tsx:168:        {tier === "free" && <Link href="/pricing" className="block py-5 text-2xl font-black text-[#1A1916] border-b border-[#E8E6E1] tracking-tight" onClick={onClose}>Pricing</Link>}
./components/layout/HeaderNavClient.tsx:169:        {tier === "standard" && <Link href="/pricing" className="block py-5 text-2xl font-black text-[#1A1916] border-b border-[#E8E6E1] tracking-tight" onClick={onClose}>Upgrade</Link>}
./components/report/MarketIntelligence.tsx:389:                    Analyze Pricing Sources &amp; Entry Points ↓
./components/report/SupplierContact.tsx:239:                  Pricing verified and on file. Contact the manufacturer directly.
./components/ui/LockedValue.tsx:23:  const ctaHref = "/pricing";
./components/ui/PaywallOverlay.tsx:4:import { PRICING } from '@/src/config/pricing'
```

**Pricing Section File:**

- `c:\k-productscout\app\pricing\page.tsx` (디렉터리 `./app/pricing` 내 페이지)
- **가격 상수**: `c:\k-productscout\src\config\pricing.ts`

### 3.3 Tier Label Locations

`c:\k-productscout\tier_labels.txt` 전체 내용:

```
=== STANDARD TIER REFERENCES ===
./components/FaqAccordion.tsx:87:        a: "Standard gives you the full trend intelligence layer: Gap Index, Margin Multiplier, Platform Velocity, Growth Signal. That alone replaces 58 hours of manual sourcing research per month. Alpha adds the action layer: verified factory contacts, MOQ + EXW pricing, HS Code reference, compliance flags, 4K On-Site Sourcing Footage (Raw), SEO keywords, and a broker email draft. The $120 difference buys you a complete sourcing brief — ready to act on, not just read. If your average margin is $8/unit and you source 200 units from one Alpha-sourced product, that's $1,600 gross from a $199 subscription. The math works on the first product.",

=== ALPHA TIER REFERENCES ===
./components/FaqAccordion.tsx:86:        q: "Why does Alpha cost $199/mo when Standard is $79/mo?",
./components/FaqAccordion.tsx:87:        a: "Standard gives you the full trend intelligence layer: Gap Index, Margin Multiplier, Platform Velocity, Growth Signal. That alone replaces 58 hours of manual sourcing research per month. Alpha adds the action layer: verified factory contacts, MOQ + EXW pricing, HS Code reference, compliance flags, 4K On-Site Sourcing Footage (Raw), SEO keywords, and a broker email draft. The $120 difference buys you a complete sourcing brief — ready to act on, not just read. If your average margin is $8/unit and you source 200 units from one Alpha-sourced product, that's $1,600 gross from a $199 subscription. The math works on the first product.",

=== EARLY BIRD PRICING ===
```

**Files Containing "Standard $99":**

- (해당 정규식 `Standard.*\$99\|Standard.*99` 매치) — **`tier_labels.txt` 기준 TSX 내 `Standard`+`$99` 조합 없음**. (가격 카피는 **$79** 중심: `FaqAccordion.tsx` 라인 53, 86 등 및 `src/config/pricing.ts`의 `79`.)

**Files Containing "Alpha $199":**

- `c:\k-productscout\components\FaqAccordion.tsx` — 라인 **86** (`$199/mo`), 라인 **87** (`$199`)

---

## SECTION 4: Type Definitions & Configuration

### 4.1 TypeScript Types

`c:\k-productscout\type_defs.txt` 전체 내용:

```
=== TIER TYPE DEFINITIONS ===
./next-env.d.ts

=== SUBSCRIPTION TYPES ===
```

(`find`가 `types.ts` 정확 파일명만 검색하여 `types/database.ts` 등은 이 절에 포함되지 않음 — 티어 정의 실제 위치는 **Section 1.2** 및 `c:\k-productscout\types\database.ts` 라인 **10**.)

### 4.2 Environment Configuration

`c:\k-productscout\env_check.txt` 전체 내용 (민감 값 마스킹):

```
=== ENV VARIABLES - LEMONSQUEEZY ===
./.env.local:8:LEMONSQUEEZY_API_KEY=[REDACTED — 민감 정보; 원본은 로컬 .env.local 참고]
./.env.local:9:LEMONSQUEEZY_WEBHOOK_SECRET=[REDACTED — 민감 정보]
./.env.local:12:LEMONSQUEEZY_VARIANT_ID_STANDARD=1441570
./.env.local:13:LEMONSQUEEZY_VARIANT_ID_ALPHA=1441563
./app/api/billing/portal/route.ts:34:          Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
./app/api/webhooks/lemonsqueezy/route.ts:5:const LEMONSQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
./app/api/webhooks/lemonsqueezy/route.ts:11:/** Standard/Alpha 숫자 variant_id (.env: LEMONSQUEEZY_VARIANT_ID_STANDARD / _ALPHA) — 일치 시 tier 업데이트 */
./app/api/webhooks/lemonsqueezy/route.ts:12:const STANDARD_VARIANT_NUMERIC = process.env.LEMONSQUEEZY_VARIANT_ID_STANDARD
./app/api/webhooks/lemonsqueezy/route.ts:13:  ? parseInt(process.env.LEMONSQUEEZY_VARIANT_ID_STANDARD, 10)
./app/api/webhooks/lemonsqueezy/route.ts:15:const ALPHA_VARIANT_NUMERIC = process.env.LEMONSQUEEZY_VARIANT_ID_ALPHA
./app/api/webhooks/lemonsqueezy/route.ts:16:  ? parseInt(process.env.LEMONSQUEEZY_VARIANT_ID_ALPHA, 10)
./app/api/webhooks/lemonsqueezy/route.ts:20:  if (!LEMONSQUEEZY_WEBHOOK_SECRET || !signature) return false;
./app/api/webhooks/lemonsqueezy/route.ts:21:  const hmac = crypto.createHmac("sha256", LEMONSQUEEZY_WEBHOOK_SECRET);
./app/api/webhooks/lemonsqueezy/route.ts:132:            ? "→ LemonSqueezy는 웹훅에 숫자 variant_id를 보냅니다. .env에 LEMONSQUEEZY_VARIANT_ID_STANDARD, LEMONSQUEEZY_VARIANT_ID_ALPHA (숫자) 설정 후 재시도."
```

---

## CRITICAL FINDINGS

### ⚠️ Standard Tier References

- **명령 1A 결과**: 작은따옴표 `tier === 'standard'`만 — `c:\k-productscout\components\layout\ClientLeftNav.tsx` **라인 132**; `PaywallOverlay` CTA는 Standard/Alpha 분기 **라인 25**.
- **큰따옴표 `tier === "standard"` 등 (보충 전체 검색, 라인 번호 포함)**  
  - `c:\k-productscout\app\weekly\page.tsx`: **52**, **151**, **155**  
  - `c:\k-productscout\app\weekly\[weekId]\page.tsx`: **20**  
  - `c:\k-productscout\app\weekly\[weekId]\[id]\page.tsx`: **82**, **106**, **148**, **165**, **175**, **176**, **182**, **213**  
  - `c:\k-productscout\app\account\page.tsx`: **13**, **227**  
  - `c:\k-productscout\components\layout\HeaderNavClient.tsx`: **102**, **169**  
  - `c:\k-productscout\components\report\SocialProofTrendIntelligence.tsx`: **15**, **19**, **20**, **68**, **86**, **108**, **130**, **168**, **184**, **200** (`LockedValue`의 `tier="standard"` prop)  
  - `c:\k-productscout\components\report\MarketIntelligence.tsx`: **147**, **225**, **242**, **258**, **281**, **358**, **406**, **427**, **443**, **465**, **473**  
  - `c:\k-productscout\components\report\SupplierContact.tsx`: **26**  
  - `c:\k-productscout\components\ui\LockedValue.tsx`: **9**, **16**  
  - `c:\k-productscout\components\ProductIdentity.tsx`: **31**  
  - `c:\k-productscout\lib\auth-server.ts`: **40**  
  - `c:\k-productscout\types\database.ts`: **10**  
  - `c:\k-productscout\app\api\webhooks\lemonsqueezy\route.ts`: **34**, **42**, **47** (문자열 `"standard"`)  
  - `c:\k-productscout\components\GlobalPricingTable.tsx`: **21** (로컬 타입; **라인 76** `tier === "alpha"`만 링크 노출과 직접 연관)  
- **의미 없는 문자열 매치 주의**: `c:\k-productscout\components\report\utils.ts` **라인 25** — `t.includes("standard")`는 **배송/무게 텍스트** 등 일반 단어 “standard” 포함 검사로, 구독 티어와 무관할 수 있음.

### ⚠️ B2B Information Display Points

- **`sourcing_tip` / Scout Strategy / B2B 라벨**: `SocialProofTrendIntelligence.tsx`, `SourcingIntel.tsx`, `SupplierContact.tsx`, `app\weekly\[weekId]\[id]\page.tsx`, `app\admin\[id]\page.tsx`, `app\pricing\page.tsx` (기능 표 행) — 상세 라인은 **Section 2.2** 붙여넣기 참고.
- **`verified_cost_usd` / 검증 원가 UI**: `SupplierContact.tsx` **라인 43**; 어드민 폼 `app\admin\[id]\page.tsx` **라인 78, 287, 1414–1415**; `lib\auth-server.ts` **라인 65**; `types\database.ts` **라인 92**; 샘플 데이터 `data\sampleReportData.ts` **라인 70**.
- **Verified Supplier Cost 버튼 카피**: `MarketIntelligence.tsx` **라인 267, 271**.
- **Alpha 전용 카피**: `LandingPipelineSneakPeek.tsx` **라인 87**, `ProductIdentity.tsx` **라인 233**, `FaqAccordion.tsx` **라인 34** 등.

### ⚠️ Pricing Page Modifications Needed

- **단일 가격 소스**: `c:\k-productscout\src\config\pricing.ts` — `STANDARD.monthly` **79**, `ALPHA.monthly` **199**.
- **랜딩 중복 카드/카피**: `c:\k-productscout\app\page.tsx` (PRICING import 및 `#pricing-cards` 섹션; 라인 참고 **Section 3.2** `pricing_files.txt` 절).
- **전용 가격 페이지**: `c:\k-productscout\app\pricing\page.tsx`.
- **FAQ 하드코피 가격**: `c:\k-productscout\components\FaqAccordion.tsx` **라인 53, 86, 87** 등 (`$79`, `$199`).
- **기타 `/pricing` 링크**: `HeaderNavClient.tsx`, `account/page.tsx`, `weekly` 계열, `AlphaVaultPreview.tsx`, `sample-report/page.tsx` 등 — **Section 3.2** 목록 전체.

---

## RECOMMENDED ACTION ITEMS

1. **Tier Logic:**
   - [ ] `tier === "standard"` / `"alpha"` 분기가 흩어져 있으므로, PDP·주간 목록·헤더·마스킹(`maskReportByTier` 등)을 **한 레퍼런스(유틸 또는 DB `Tier`)**로 정리할지 검토.
   - [ ] LemonSqueezy `variant_id` ↔ 티어 매핑( `c:\k-productscout\app\api\webhooks\lemonsqueezy\route.ts` )과 `.env` variant ID가 **스테이징/프로덕션**에서 일치하는지 검증.
   - [ ] `grep "lemon"` 파이프라인으로 티어 매핑을 찾을 경우 **`-i`** 또는 `LemonSqueezy` 패턴 사용.

2. **PDP Modifications:**
   - [ ] `MarketIntelligence`, `SocialProofTrendIntelligence`, `SupplierContact`의 **`LockedValue` / 티어 가드**를 제품 정책(표준 vs 알파) 변경 시 함께 수정.
   - [ ] `GlobalPricingTable`은 orphan이므로 **삭제 또는 PDP 재도입** 결정.

3. **Landing/Pricing Updates:**
   - [ ] 가격/카피 변경 시 **`src/config/pricing.ts` + `app/page.tsx` + `app/pricing/page.tsx` + `FaqAccordion.tsx`**를 동기화.
   - [ ] `PaywallOverlay` 미사용이면 **제거 또는 실제 결제 플로우에 연결**.

---

## 분석 규모

- Git 추적 `*.ts` / `*.tsx` 파일 수: **105** (명령: `git ls-files "*.ts" "*.tsx"` | `Measure-Object`).

---

## END OF REPORT
