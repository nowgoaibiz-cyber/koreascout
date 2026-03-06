# Sample Report Data Structure & Auth Bypass Audit

> **목적:** `/sample-report` 퍼블릭 페이지 구축 — 프리미엄 주간 상세 UI 재사용, 인증 없이 하드코딩 mock 데이터로 렌더.

---

## 1. DB SCHEMA & TYPE AUDIT

### 1.1 단일 리포트 타입

- **정의 위치:** `types/database.ts` → `ScoutFinalReportsRow`
- **필수 스칼라:** `id`, `week_id`, `product_name`, `translated_name`, `image_url`, `category`, `viability_reason`, `market_viability`, `competition_level`, `profit_multiplier`, `search_volume`, `mom_growth`, `gap_status`, `export_status`, `is_premium`, `is_teaser`, `status`, `created_at`
- **nullable 스칼라:** `summary`, `consumer_insight`, `composition_info`, `spec_summary`, `global_price`, `seo_keywords`, `hs_code`, `sourcing_tip`, `manufacturer_check`, `m_name`, `corporate_scale`, `contact_email`, `contact_phone`, `m_homepage`, `naver_link`, `wholesale_link`, `video_url`, `competitor_analysis_pdf`, `viral_video_url`, `published_at`, `free_list_at`, `ai_image_url` 외 다수 v1.3 옵션 필드.

### 1.2 Array / JSONB 섹션별 기대 타입

| 섹션 | 필드 | 기대 타입 | UI 사용처 |
|------|------|-----------|-----------|
| **Strategy** | `sourcing_tip` | `string \| null` | Section 4 (Step 1–3), Section 5 (Step 4–5). 파서 `parseSourcingStrategy()`가 `[마케팅 전략]`, `[가격/마진 전략]`, `[B2B 소싱 전략]`, `[통관/규제 전략]`, `[물류/배송 전략]` 구간을 파싱해 `StrategyStep[]` (icon, label, color, content) 생성. |
| **Trend Signals** | `platform_scores` | `Json \| null` → `Record<string, { score?: number; sentiment?: string }>` | Section 2 Platform Breakdown. 키: `tiktok`, `instagram`, `youtube` (score 0–100), `reddit` (sentiment: "positive" \| "negative" 등). |
| **Market Intelligence** | `global_prices` | `Json \| null` → `Record<string, { price_usd?: number; price_original?: string \| number; platform?: string }>` | Section 3 Global Market. 키: `us`, `uk`, `sea`, `au`, `india` (또는 `australia`). `parseGlobalPricesForGrid()` 사용. |
| | `global_price` | `Json \| null` (레거시) | 폴백: `"US($24.99) \| UK($19.99)"` 형태 문자열 또는 객체. |
| **Social Proof** | `rising_keywords` | `string[] \| string \| null` | Section 4 Trending Signals. `normalizeToArray()`로 항상 `string[]`로 정규화. |
| | `seo_keywords` | `string[] \| string \| null` | Section 4 Global SEO Keywords (Alpha). |
| | `viral_hashtags` | `string[] \| null` | Section 4 Viral Hashtags (Alpha). `#` 없이 저장해도 UI에서 `#` 붙여 표시. |
| **Export & Logistics** | `required_certificates` | `string \| null` (쉼표 구분) | Section 5. `split(",").map(trim).filter(Boolean)` → `string[]`. |
| | `hazmat_status` | `Json \| null` → `{ contains_liquid?, contains_powder?, contains_battery?, contains_aerosol? }` | Section 5 HazmatBadges. boolean 플래그. |
| **Launch Kit** | `global_prices` | 동일 JSONB. `url` 포함 시 Section 6 Global Market Proof 링크로 사용. | `parseGlobalPrices()`: `region → url` 추출. |
| | `ai_detail_page_links` | `string \| string[] \| Record<string, unknown> \| null` | URL 단일/배열/객체. `getAiDetailUrl()`로 첫 URL 추출. |

### 1.3 기타 타입 요약

- **StrategyStep** (파서 출력): `{ icon: string; label: string; color: string; content: string }`
- **RegionPriceRow** (파서 출력): `{ flag: string; label: string; priceDisplay: string \| null; platform?: string \| null; isBlueOcean: boolean }`
- **Export status:** `"Green"` \| `"Yellow"` \| 그 외(Red). `EXPORT_STATUS_DISPLAY`로 라벨/variant 매핑.
- **competition_level:** `"Low"` \| `"Medium"` \| `"High"` (대소문자 주의).
- **gap_status:** `"Blue Ocean"` \| `"Emerging"` \| `"Saturated"` 등.

---

## 2. AUTHENTICATION BYPASS AUDIT

### 2.1 현재 주간 상세 페이지 동작

- **파일:** `app/weekly/[weekId]/[id]/page.tsx`
- **인증:** `getAuthTier()` 호출 → `{ userId, userEmail, tier }` 반환. **로그인 없으면 `tier === "free"`**, 리다이렉트 없음.
- **데이터:** `supabase.from("scout_final_reports").select("*").eq("id", id).eq("week_id", weekId).eq("status", "published").single()` → RLS/세션에 따라 행이 없을 수 있음 → `notFound()`.
- **결론:** 상세 페이지 자체는 “비로그인 시 로그인 페이지로 리다이렉트”를 하지 않음. 다만 비로그인 시 DB에서 해당 리포트를 읽지 못해 404가 나는 구조일 수 있음.

### 2.2 로그인 강제 구간

- **리다이렉트 발생:** `app/weekly/page.tsx`, `app/weekly/[weekId]/page.tsx` → `if (!userId) redirect("/login")`.
- **리다이렉트 없음:** `app/weekly/[weekId]/[id]/page.tsx` (상세) — 여기서는 `userId`로 리다이렉트하지 않음.

### 2.3 `/sample-report`에서 UI만 재사용하는 방법

1. **데이터 분리**  
   - 상세 페이지는 “Supabase에서 report 조회”와 “같은 UI 컴포넌트에 report + tier 전달”이 한 페이지 안에 있음.  
   - `/sample-report`에서는 **DB 조회 없이** 하드코딩된 `sampleReportData`만 사용.

2. **인증 우회가 아닌 “공개 라우트”**  
   - `/sample-report`는 인증을 “우회”하는 것이 아니라, **원래부터 공개 라우트**로 두고,  
   - `getAuthTier()`를 호출해도 되고(비로그인 시 tier `"free"`), **렌더 시에는 `tier="alpha"`와 mock report를 넘겨** 모든 섹션이 잠기지 않고 보이게 하면 됨.

3. **컴포넌트 재사용**  
   - 현재 Section 컴포넌트(`TrendSignalDashboard`, `MarketIntelligence`, `SocialProofTrendIntelligence`, `SourcingIntel`, `SupplierContact`)와 `ProductIdentity`는 **모두 `report: ScoutFinalReportsRow` + `tier` (+ `isTeaser`)를 props로 받음.**  
   - 따라서 **동일한 컴포넌트를 그대로 쓰고**,  
     - 페이지 데이터 소스만 “Supabase single report” → “`sampleReportData`”로 바꾸고,  
     - `tier="alpha"`, `isTeaser=true`(또는 false)로 고정하면, 인증 없이 풀 UI를 노출할 수 있음.

4. **구현 옵션**  
   - **A)** `app/sample-report/page.tsx`를 새로 만들고, 상세 페이지와 **동일한 JSX 트리**를 사용하되 `report={sampleReportData}`, `tier="alpha"`, 주간 네비(prev/next) 제거.  
   - **B)** “Report View”용 공통 컴포넌트(예: `ReportDetailView`)를 추출해 `app/weekly/[weekId]/[id]/page.tsx`와 `app/sample-report/page.tsx` 둘 다에서 사용.  
   - 현재 Section 컴포넌트는 상세 페이지 파일 **내부**에 정의되어 있으므로, 재사용을 위해 **해당 컴포넌트들을 별도 파일로 추출**한 뒤 두 페이지에서 import하는 방식이 유지보수에 유리함.

---

## 3. OUTPUT: MOCK TEMPLATE

- 아래 **완전한 TypeScript mock 객체**는 `ScoutFinalReportsRow`와 호환되도록 모든 필드를 포함함.
- Array/JSONB 필드는 위 섹션 1.2에 맞춰 구성.
- placeholder 문자열(`SAMPLE_*`)은 실제 베스트 데이터로 교체 가능.

Mock 데이터 파일: **`data/sampleReportData.ts`** (동일 디렉터리 내 생성).
