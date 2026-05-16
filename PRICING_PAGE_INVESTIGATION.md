# KoreaScout Pricing System Investigation Report

**Generated:** 2026-05-14 (workspace `user_info` authoritative date)

**조사 방식:** 터미널 명령 없이 워크스페이스 내 `Glob` / `Grep` / `Read`로만 스캔·분석. 애플리케이션 소스(`app/`, `components/`, `lib/`, `src/`, `types/`, `supabase/migrations/`) 및 저장소에 포함된 보조 텍스트(`env_check.txt` 등)를 인용.

---

## Executive Summary

| 항목 | 값 |
|------|-----|
| **Pricing 전용 라우트 파일** | `app/pricing/page.tsx` **1개** (`app/pricing/layout.*` 없음) |
| **`components/pricing/*` 디렉터리** | **없음** (Glob 결과 0) |
| **가격 상수 단일 소스** | `src/config/pricing.ts` |
| **DB `profiles.tier` 허용값 (001 마이그레이션)** | `'free' \| 'standard' \| 'alpha'` (CHECK 제약) |
| **LemonSqueezy 웹훅 핸들러** | `app/api/webhooks/lemonsqueezy/route.ts` (+ `app/api/webhook/route.ts`에서 동일 핸들러 re-export) |
| **미들웨어의 티어 검사** | **없음** — 세션 갱신 + `/admin` 쿠키 가드만 |
| **애플리케이션 소스에서 식별한 티어/가격 관련 파일(대략)** | **약 40개** (중복 문서 `_docs/` 제외 시 약 30개+) |
| **치명적 발견** | (1) UI 체크아웃 URL의 variant UUID와 웹훅 내장 UUID가 **서로 다름**. (2) `PRICING.STANDARD.monthly`(79) vs 웹훅 주석 “Standard $69” vs FAQ “$79/mo” **가격 불일치**. (3) 웹훅 Alpha 주석 “$129” vs `PRICING.ALPHA.monthly`(199) **불일치**. |

---

## 1. PRICING PAGE FILES

### 1.1 `app/pricing/page.tsx`

**Path:** `app/pricing/page.tsx`

**전용 레이아웃:** `app/pricing/layout.tsx` **없음** — 루트 `app/layout.tsx` 등 상위 레이아웃만 적용.

**현재 티어 구조 (UI):**

- **3컬럼 마케팅 카드:** `Scout Free` ($0) · `Standard` (`PRICING.STANDARD`) · `Alpha` (`PRICING.ALPHA`).
- **결제 가능 티:** Standard / Alpha만 `CheckoutButton` + LemonSqueezy 고정 URL.
- **Alpha 정원:** DB `profiles`에서 `tier === "alpha"` 카운트, 상한 `ALPHA_MAX_SPOTS = 3000`.

**하드코딩 문자열 (Standard / Alpha / 가격 외 카피 일부):**

- 히어로: `"THE GLOBAL STANDARD FOR KOREAN PRODUCT INTELLIGENCE"` (여기서 Standard는 **브랜드 문구**).
- 카드 타이틀: `"Scout Free"`, `"Standard"`, `"Alpha"`.
- 기능 비교표 헤더: `"Free"`, `"Standard"`, `"Alpha"` 열.
- Alpha 노트: `"Certain supplier information in the Alpha tier..."`.
- FOMO: `"Alpha spots remaining"`, `"Join the Waiting List"`, `"Join Alpha Waiting List"`.

**가격 표시:**

- 모두 `PRICING` 객체에서 (`FREE.monthly`, `STANDARD.monthly` / `daily`, `ALPHA.monthly` / `daily`, `ALPHA.marketingDailyLimit`).

**LemonSqueezy 체크아웃 URL (파일 상수, env 아님):**

```ts
STANDARD_CHECKOUT_URL = "https://getkoreascout.lemonsqueezy.com/checkout/buy/e9701b40-aad3-446e-b00a-617d0159d501"
ALPHA_CHECKOUT_URL    = "https://getkoreascout.lemonsqueezy.com/checkout/buy/936321c8-fba1-4f88-bb30-8865c8006fac"
```

**조건부 렌더링:**

- `isMembershipFull` → Alpha 자리에 `Join the Waiting List` (`/waitlist`), 하단 CTA도 동일.
- 그 외 카드/표는 데이터 주입형(`FEATURE_GROUPS`의 `free` / `standard` / `alpha` 열).

**의존성 / import:**

- `next` `Metadata`
- `@/lib/supabase/admin` `createServiceRoleClient`
- `@/src/config/pricing` `PRICING`
- `@/components/CheckoutButton`

**데이터 쿼리:**

- `getAlphaMemberCount()`: `profiles` count where `tier = 'alpha'` (service role).

---

### 1.2 `components/pricing/*`

**결과:** 해당 경로 **존재하지 않음**. 가격 UI는 `app/pricing/page.tsx`, `app/page.tsx`, FAQ, 리포트 CTAs 등에 분산.

---

### 1.3 기타 “Pricing 페이지 시스템”에 직접 연결된 컴포넌트

| 파일 | 역할 |
|------|------|
| `components/CheckoutButton.tsx` | 클릭 시 Supabase `getUser()` → `checkout[email]`, `checkout[custom][user_id]` 쿼리스트링 부착 후 `window.open(checkoutUrl)` |
| `components/ui/LockedValue.tsx` | 잠금 시 CTA `"Unlock with Standard →"` 또는 `"Unlock with Alpha →"`, 링크 **`/pricing`** 고정 |
| `components/report/constants.ts` | 섹션별 잠금 CTA 문구 + 전부 `href: "/pricing"` + `PRICING` 삽입 |
| `components/LockedSection.tsx` | 티어 문자열 없음; `message` / `cta` / `href` props (주간 뷰에서 `/pricing`으로 연결 가능) |

---

## 2. PRICING DATA & CONSTANTS

### 2.1 `src/config/pricing.ts` (단일 설정)

```ts
export const PRICING = {
  FREE: { monthly: 0, daily: 0 },
  STANDARD: { monthly: 79, daily: 2.63 },
  ALPHA: { monthly: 199, daily: 6.63, marketingDailyLimit: 6.7 },
  CURRENCY: "$",
} as const;
```

- **`$69` / `$99`:** 앱 TS/TSX 내 **리터럴 미발견** (검색 기준).
- **`$199`:** `PRICING.ALPHA.monthly` 및 `components/FaqAccordion.tsx` 본문.
- **`$79`:** FAQ 본문 “Standard at $79/mo” 등 (`FaqAccordion.tsx`).

### 2.2 “Standard” / “Alpha” 키워드 — 애플리케이션 소스 하이라이트

| 영역 | 파일 | 요약 |
|------|------|------|
| 타입 | `types/database.ts` | `Tier = "free" \| "standard" \| "alpha"` |
| 마스킹 | `lib/auth-server.ts` | `maskReportByTier(..., tier)` — `alpha`만 전체 필드, `standard`/`free`는 필드 null 처리 분기 |
| 주간 허브 | `app/weekly/page.tsx`, `app/weekly/[weekId]/page.tsx` | `isPaid = tier === "standard" \|\| tier === "alpha"` |
| PDP | `app/weekly/[weekId]/[id]/page.tsx` | `canSeeAlpha`, `maskReportByTier`, 업그레이드 링크 카피 |
| 계정 | `app/account/page.tsx` | `STANDARD ACCESS` / `ALPHA ACCESS`, Standard일 때 Alpha 업그레이드 |
| 헤더 | `components/layout/HeaderNavClient.tsx` | `tier === "standard"` → 네비에 `"Upgrade"` |
| 좌측 네비 | `components/layout/ClientLeftNav.tsx` | `NavTier`, 배지 텍스트 `Free` / `Standard` / `Alpha` |
| 리포트 | `MarketIntelligence.tsx`, `SocialProofTrendIntelligence.tsx`, `SupplierContact.tsx`, `SourcingIntel.tsx`, `ProductIdentity.tsx`, `GroupBBrokerSection.tsx` | `canSeeStandard` / `canSeeAlpha` 및 `LockedValue tier="standard"\|"alpha"` |
| UI | `components/ui/PaywallOverlay.tsx` | `PaywallTier = 'standard' \| 'alpha'`, CTA 가격 문자열 |
| UI | `components/ui/Badge.tsx` | `tier-standard`, `tier-alpha` 스타일 키 |
| 랜딩 | `components/AlphaVaultPreview.tsx`, `LandingTimeWidget.tsx`, `FaqAccordion.tsx`, `IntelligencePipeline.tsx` | 마케팅/FAQ 카피 |
| 고아 컴포넌트 | `components/GlobalPricingTable.tsx` | 파일 주석: **ORPHAN**, `canSeeLinks = tier === "alpha" \|\| isTeaser` |

### 2.3 홈페이지와 가격 페이지 URL 중복

`app/page.tsx`가 **`app/pricing/page.tsx`와 동일한** `STANDARD_CHECKOUT_URL` / `ALPHA_CHECKOUT_URL` / `ALPHA_MAX`(3000) / `getAlphaCount()` 패턴을 복제함 → **유지보수 시 이중 수정 위험**.

---

## 3. DATABASE SCHEMA

### 3.1 `profiles`

| 출처 | 내용 |
|------|------|
| `supabase/migrations/001_phase2_schema.sql` | `tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'standard', 'alpha'))` |
| `types/database.ts` | `export type Tier = "free" \| "standard" \| "alpha"` — `ProfilesRow.tier: Tier` |
| `003_sync_from_live_audit.sql` | `subscription_start_at`, `subscription_reset_at` 컬럼 추가 (레퍼런스 마이그레이션, 주석상 라이브 정렬용) |

**LemonSqueezy 연동 컬럼 (001):** `ls_customer_id`, `ls_subscription_id`, `tier_updated_at`.

### 3.2 RLS — `scout_final_reports` (`report_access` 정책, 001)

- **Paid:** `(SELECT tier FROM profiles WHERE id = auth.uid()) IN ('alpha','standard')` 이면 published 행 접근.
- **Free:** `free_list_at <= NOW()` AND `is_premium = FALSE`.
- **Teaser:** `is_teaser = TRUE` 전원.

→ 새 티어 **`alpha_plus`**(가칭) 도입 시 **정책식과 앱 마스킹 로직을 동시에** 맞춰야 함.

### 3.3 `scout_final_reports` 기타

- `shipping_tier` 등은 **물류 티어 라벨** (구독 티어와 별개). `components/report/utils.ts` `describeShippingTier`가 `"standard"` **단어**를 무게 구간 매칭에 사용 (구독과 무관).

---

## 4. AUTHENTICATION & MIDDLEWARE

### 4.1 `lib/auth-server.ts`

- `getAuthTier()`: `supabase.auth.getUser()` 후 `profiles`에서 `tier`, `subscription_start_at` 선택.
- 비로그인 → `tier: "free"`.
- `maskReportByTier`: DB RLS와 별도로 **클라이언트/서버 렌더용 필드 마스킹**.

### 4.2 `middleware.ts` + `lib/supabase/middleware.ts`

- **구독 티어 검사 없음.**
- `/admin` 경로는 쿠키 기반 리다이렉트.
- 그 외 `updateSession()`으로 Supabase 세션 갱신만 수행.

### 4.3 `components/layout/Header.tsx`

- 서버에서 `profiles.tier` 조회 후 `HeaderShellClient`에 `tier` 문자열 전달.

---

## 5. COMPONENTS WITH TIER LOGIC

| 파일 | 티어 판별 | 게이트 내용 / CTA |
|------|-----------|-------------------|
| `LockedValue.tsx` | prop `tier` (`standard` 기본) | 블러 오버레이; 링크 `/pricing`; `"Unlock with Standard→"` / `"Unlock with Alpha→"` |
| `LockedSection.tsx` | 티어 비교 없음 | props `href` / `cta` — 보통 `/pricing` |
| `PaywallOverlay.tsx` | prop `PaywallTier` | 버튼 라벨 Standard vs Alpha 가격; **다른 TSX에서 import 사용처는 검색상 없음**(배럴 export만) |
| 리포트 섹션들 | `tier === "alpha"`, `canSeeStandard = standard \|\| alpha \|\| teaser` 등 | 시장/소셜/소싱/공급자 블록 잠금 |
| `ClientLeftNav.tsx` | `NavTier` | 배지 색 + 라벨 |
| `HeaderNavClient.tsx` | `tier === "free"`, `"standard"` | Pricing vs Upgrade 노출 |
| `GlobalPricingTable.tsx` | `tier === "alpha"` | 글로벌 가격 링크 컬럼 잠금 (컴포넌트 고아) |

---

## 6. API ROUTES & SERVER ACTIONS

| 경로 | 티어 검증 | 설명 |
|------|-----------|------|
| `app/api/webhooks/lemonsqueezy/route.ts` | `variantIdToTier` → `profiles.tier` 업데이트 | `subscription_created` / `subscription_updated`; 취소·만료 시 `tier: "free"`, `ls_subscription_id: null` |
| `app/api/webhook/route.ts` | 동일 | `export { POST } from "../webhooks/lemonsqueezy/route"` |
| `app/api/billing/portal/route.ts` | **없음** | `ls_subscription_id`로 LemonSqueezy 구독 API 호출 → 고객 포털 URL 반환 |
| `app/actions/favorites.ts` | **없음** | 인증만 |

**`_actions.ts` 패턴:** 검색 결과 **0건**.

---

## 7. LEMONSQUEEZY INTEGRATION

### 7.1 웹훅 — `app/api/webhooks/lemonsqueezy/route.ts`

**서명:** `LEMONSQUEEZY_WEBHOOK_SECRET`, 헤더 `x-signature` / `X-Signature`.

**Variant → tier 매핑:**

| 구분 | Standard | Alpha |
|------|----------|-------|
| **하드코딩 UUID** (문자열 variant_id 대응) | `141f6710-c704-4ab3-b7c7-f30b2c587587` | `41bb4d4b-b9d6-4a60-8e19-19287c35516d` |
| **환경변수 숫자 ID** | `LEMONSQUEEZY_VARIANT_ID_STANDARD` | `LEMONSQUEEZY_VARIANT_ID_ALPHA` |

**주석의 가격 (코드와 불일치 가능):**

- Standard 주석: **$69**
- Alpha 주석: **$129**

**프로필 업데이트 필드:** `tier`, `ls_subscription_id`, `tier_updated_at`, (있을 경우) `subscription_start_at`, `subscription_reset_at`.

**식별자 우선순위:** `meta.custom_data.user_id` → 없으면 `user_email`로 `profiles` 업데이트.

**성공/실패 리다이렉트:** 이 라우트는 **웹훅 POST**만 처리. 결제 완료 후 브라우저 리다이렉트 URL은 **LemonSqueezy 대시보드(체크아웃 링크 설정)** 쪽 — **본 저장소에 하드코딩 없음**.

### 7.2 체크아웃 링크 (UI) vs 웹훅 UUID — 불일치

| 구분 | Standard | Alpha |
|------|----------|-------|
| `app/pricing/page.tsx` / `app/page.tsx` 의 `checkout/buy/...` UUID | `e9701b40-aad3-446e-b00a-617d0159d501` | `936321c8-fba1-4f88-bb30-8865c8006fac` |
| 웹훅 `*_VARIANT_UUID` | `141f6710-c704-4ab3-b7c7-f30b2c587587` | `41bb4d4b-b9d6-4a60-8e19-19287c35516d` |

→ 웹훅이 **문자열 UUID**로만 매칭하는 경우, 실제 결제 링크의 variant와 **다르면** `Unknown variant_id`로 **400** 가능. 숫자 `LEMONSQUEEZY_VARIANT_ID_*`가 실제 결제 variant와 일치하면 정상 동작할 수 있으나, **이중 정의는 리스크**.

### 7.3 저장소 내 env 예시 (민감값 마스킹 전제)

`env_check.txt`(저장소 추적 파일)에 따르면 예시로:

- `LEMONSQUEEZY_VARIANT_ID_STANDARD=1441570`
- `LEMONSQUEEZY_VARIANT_ID_ALPHA=1441563`

**워크스페이스 루트에 `.env.example` / `.env.local`은 Glob 미검출** — 신규 티어용 env 템플릿은 문서화가 필요.

---

## 8. LANDING PAGE & CTA

### 8.1 `app/page.tsx`

- `PRICING` 기반 **3티어 섹션** (주석: `S8: PRICING (3-tier from pricing page, v5 copy)`).
- `CheckoutButton` + **pricing 페이지와 동일한** LemonSqueezy URL.
- `/pricing` 링크 다수 (예: 섹션 내 `href="/pricing"`).
- Alpha 멤버 수: `profiles` where `tier = 'alpha'` (service role).

### 8.2 기타 마케팅 / FAQ

- `components/FaqAccordion.tsx`: Standard/Alpha 설명, **$79**, **$199**, 업그레이드 크레딧 등 **장문 하드코딩**.
- `components/LandingTimeWidget.tsx`: `"KoreaScout Standard"` vs `"KoreaScout Alpha"` 라벨 + `PRICING` 금액.
- `components/AlphaVaultPreview.tsx`: Standard vs Alpha 필드 비교 + `/pricing` 링크.
- `app/sample-report/page.tsx`: 티어 `"alpha"` 고정 데모, `"Subscribe to Alpha"` 등.

### 8.3 내비 / 사이트맵

- `HeaderNavClient.tsx`: 비로그인 `Pricing`; 로그인 + free `Pricing`; 로그인 + standard `Upgrade` → `/pricing`.
- `app/sitemap.ts`: `https://koreascout.com/pricing` 엔트리.

---

## 9. TYPE DEFINITIONS

| 파일 | 정의 |
|------|------|
| `types/database.ts` | `Tier = "free" \| "standard" \| "alpha"`; `ProfilesRow.tier` |
| `components/layout/ClientLeftNav.tsx` | `NavTier = 'free' \| 'standard' \| 'alpha'` |
| `components/ui/PaywallOverlay.tsx` | `PaywallTier = 'standard' \| 'alpha'` (**paid만**) |
| `components/GlobalPricingTable.tsx` | 로컬 `type Tier = "free" \| "standard" \| "alpha"` |
| 다수 리포트 컴포넌트 | props로 `"free" \| "standard" \| "alpha"` 유니온 반복 |

**Zod 스키마:** 본 조사 범위 grep에서 **티어용 `z.enum` 미발견**.

---

## 10. ENVIRONMENT VARIABLES

| 변수 | 사용처 |
|------|--------|
| `LEMONSQUEEZY_WEBHOOK_SECRET` | `app/api/webhooks/lemonsqueezy/route.ts` HMAC |
| `LEMONSQUEEZY_VARIANT_ID_STANDARD` | 웹훅 숫자 variant 매핑 |
| `LEMONSQUEEZY_VARIANT_ID_ALPHA` | 웹훅 숫자 variant 매핑 |
| `LEMONSQUEEZY_API_KEY` | `app/api/billing/portal/route.ts` |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 미들웨어 / 클라이언트 |
| 서비스 롤 키 | `lib/supabase/admin.ts` (가격 페이지 Alpha 카운트 등) |

**가격 숫자 자체는 env가 아닌** `src/config/pricing.ts`.

---

## 11. CHANGE IMPACT ANALYSIS (Free / Alpha / Alpha+ 전환 준비)

### 11.1 우선순위가 높은 수정 대상

1. **`types/database.ts` + `supabase/migrations` (001 CHECK + RLS)** — `Tier` 문자열 및 `report_access`의 `IN ('standard','alpha')` 전면 재설계. **`alpha_plus`를 DB가 거부**하면 웹훅/앱 모두 실패.
2. **`app/api/webhooks/lemonsqueezy/route.ts`** — variant 매핑, 다운그레이드 시 기본 티어(`free` 유지 vs 새 무료 티어 정책).
3. **`src/config/pricing.ts` + 모든 `PRICING.*` 소비처** — 열 이름이 `STANDARD`에서 바뀌면 타입 깨짐.
4. **`lib/auth-server.ts` `maskReportByTier`** — 현재 이진 구조(`alpha` vs 그 외) + `free` 전용 null. **Alpha vs Alpha+ 필드 분리** 시 핵심 난이도.
5. **`app/pricing/page.tsx` + `app/page.tsx`** — 카드 수, FAQ, 중복 URL 상수, Alpha 카운트 쿼리(티어 값 변경 시 `.eq("tier", "alpha")` 의미 재정의).
6. **리포트 컴포넌트 다수** — `canSeeStandard` 명명·로직이 **“구 Standard = 신 Alpha 베이스?”** 같은 제품 결정에 묶임.
7. **`components/ui/LockedValue.tsx` / `report/constants.ts` / `PaywallOverlay.tsx`** — CTA 티어 라벨 2분기 → 3분기 이상.
8. **`components/layout/HeaderNavClient.tsx` / `app/account/page.tsx`** — 네비 “Upgrade” 분기, 플랜 배지 문자열.

### 11.2 DB 마이그레이션 필요 여부

**Yes (거의 확정)**

- `profiles.tier` CHECK 확장 또는 TEXT+앱층 검증으로 전환.
- 기존 `standard` 사용자를 **`alpha`로 rename**할지, **`alpha_plus`만 신규**할지에 따라 **일괄 UPDATE** 스크립트 필요.
- RLS `report_access` 조건 업데이트.

### 11.3 LemonSqueezy 구성

- **신규 variant / checkout 링크** (Alpha+).
- 웹훅 `variantIdToTier` 확장 및 **환경변수 네이밍** (`LEMONSQUEEZY_VARIANT_ID_ALPHA_PLUS` 등).
- **체크아웃 URL UUID vs 웹훅 UUID 불일치**를 먼저 정리하지 않으면, 새 티어 추가 시 디버깅 비용 증가.

### 11.4 Breaking changes (예상)

- 기존 `standard` 구독자 권한 범위: 제품상 “신 Alpha”에 흡수되면 **UI 잠금 해제 범위 증가** 가능; 반대로 축소 시 **환불/CS 리스크**.
- `isPaid = standard || alpha` 패턴 전역 치환 필요.
- Alpha 3000 캡: **`alpha_plus`까지 동일 캡인지** 별도 정책 필요.

---

## 12. RECOMMENDATIONS

1. **단일 소스화:** LemonSqueezy checkout URL, variant ID(숫자/UUID), 웹훅 매핑을 **한 모듈**로 모으고 pricing/landing에서 import — 지금은 **pricing ≈ homepage 이중 정의 + 웹훅 별도 UUID**.
2. **가격·카피 동기화:** `PRICING` 수치, FAQ `$79`, 웹훅 주석 `$69`/`$129`를 **하나의 진실**로 맞춘 뒤 티어 이름 변경.
3. **DB-first:** RLS와 `Tier` 타입을 먼저 확정하고 앱을 따라가게 하면 역주행 방지.
4. **`maskReportByTier` 리팩터:** 필드 그룹을 “티어별 capability 플래그”로 추상화하면 3티어 이상에서 조건 폭발을 줄일 수 있음.
5. **테스트 체크리스트 (샘플):**
   - [ ] 각 variant 구매 → `profiles.tier` 기대값
   - [ ] 구독 취소/만료 → `free` 및 `ls_subscription_id` null
   - [ ] RLS: free / alpha / alpha+ 각각에서 **동일 주차** `scout_final_reports` 행 수 비교
   - [ ] `/weekly` `canAccessWeek` 슬라이딩 윈도우 + `subscription_start_at` 경계
   - [ ] 잠금 CTA 전부 `/pricing` 또는 신규 비교 페이지로 일관성

---

## 부록 A — 본 조사에서 식별한 주요 애플리케이션 파일 목록 (티어/가격/결제 연관)

`app/pricing/page.tsx`, `app/page.tsx`, `app/account/page.tsx`, `app/weekly/page.tsx`, `app/weekly/[weekId]/page.tsx`, `app/weekly/[weekId]/[id]/page.tsx`, `app/sample-report/page.tsx`, `app/sitemap.ts`, `app/api/webhooks/lemonsqueezy/route.ts`, `app/api/webhook/route.ts`, `app/api/billing/portal/route.ts`, `src/config/pricing.ts`, `lib/auth-server.ts`, `middleware.ts`, `lib/supabase/middleware.ts`, `components/CheckoutButton.tsx`, `components/ManageBillingButton.tsx`, `components/FaqAccordion.tsx`, `components/LandingTimeWidget.tsx`, `components/LandingPipelineSneakPeek.tsx`, `components/AlphaVaultPreview.tsx`, `components/GlobalPricingTable.tsx`, `components/IntelligencePipeline.tsx`, `components/ProductIdentity.tsx`, `components/GroupBBrokerSection.tsx`, `components/BrokerEmailDraft.tsx`, `components/layout/Header.tsx`, `components/layout/HeaderNavClient.tsx`, `components/layout/ClientLeftNav.tsx`, `components/ui/LockedValue.tsx`, `components/ui/PaywallOverlay.tsx`, `components/ui/Badge.tsx`, `components/LockedSection.tsx`, `components/report/constants.ts`, `components/report/MarketIntelligence.tsx`, `components/report/SocialProofTrendIntelligence.tsx`, `components/report/SourcingIntel.tsx`, `components/report/SupplierContact.tsx`, `components/report/utils.ts`, `types/database.ts`, `supabase/migrations/001_phase2_schema.sql`, `supabase/migrations/003_sync_from_live_audit.sql` (+ 법무/프라이버시의 LemonSqueezy 언급 페이지 등)

**총 파일 수(대략):** 위 목록 기준 **약 40개** (문서 `_docs/**` 제외).

---

*End of report.*
