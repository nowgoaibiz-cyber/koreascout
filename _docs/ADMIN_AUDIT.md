# Admin · 고객 PDP 정렬 감사 보고서

**생성일:** 2026-04-06  
**범위:** 읽기 전용 코드 스캔. `scout_final_reports` 기준 필드·섹션 매핑.  
**목적:** 고객용 주간 상품 상세(`/weekly/[weekId]/[id]`)의 시각적 읽기 순서에 맞춰 관리자 편집(`/admin/[id]`) 필드 순서를 재설계하기 위한 근거 자료.

---

## STEP 1 — 관련 파일 인벤토리

### 1.1 관리자 상품 상세

| 역할 | 경로 | 비고 |
|------|------|------|
| 페이지 (동적 `[id]`) | `app/admin/[id]/page.tsx` | 전체 폼·접이 섹션·헤더 상태·저장 모달 |
| 가져온 컴포넌트 | `components/admin/GlobalPricesHelper.tsx` | `global_prices` JSON 편집 (L773–785 근처에서 사용) |
| | `components/admin/HazmatCheckboxes.tsx` | `hazmat_status` JSON 불리언 4종 |
| | `components/admin/AiPageLinksHelper.tsx` | `ai_detail_page_links` URL 배열 (최대 5) |
| API (데이터) | `app/api/admin/reports/[id]/route.ts` | (본 감사에서 페이지만 상세 추적; PATCH는 동일 리포트 ID) |

**`app/admin/[id]/page.tsx` import 블록 (라인 참조):**

- L6–9: `GlobalPricesHelper`, `HazmatCheckboxes`, `AiPageLinksHelper`

### 1.2 고객용 상품 상세

| 역할 | 경로 | 라인(대략) |
|------|------|------------|
| 페이지 | `app/weekly/[weekId]/[id]/page.tsx` | L1–226 |
| 좌측 사이드바 네비 | `components/layout/ClientLeftNav.tsx` | L25–118 (`sections` prop으로 라벨 전달) |
| 섹션 데이터 정의 | 동일 `page.tsx` 내 `sections` 배열 | L133–140 |

**`app/weekly/[weekId]/[id]/page.tsx` import·컴포넌트 트리 순서:**

| 순서 | import / 사용 | 소스 파일 |
|------|-----------------|-----------|
| 1 | `ClientLeftNav` | `components/layout/ClientLeftNav.tsx` |
| 2 | `ProductIdentity` | `components/ProductIdentity.tsx` |
| 3 | `TrendSignalDashboard` | `components/report/TrendSignalDashboard.tsx` (`components/report/index.ts` L1 재export) |
| 4 | `MarketIntelligence` | `components/report/MarketIntelligence.tsx` |
| 5 | `SocialProofTrendIntelligence` | `components/report/SocialProofTrendIntelligence.tsx` |
| 6 | `SourcingIntel` (조건부) | `components/report/SourcingIntel.tsx` |
| 7 | `SupplierContact` (`id="section-6"` 래퍼) | `components/report/SupplierContact.tsx` |
| 기타 | `ZombieWatermark`, `EXPORT_STATUS_DISPLAY` | `components/report/constants` 등 |

**조건부 렌더:** `hasLogistics`가 true일 때만 `SourcingIntel` 표시 (`page.tsx` L109–122, L179).

**하위·연관 (고객 Export 섹션):** `SourcingIntel` 내부에서 `GroupBBrokerSection` (`components/GroupBBrokerSection.tsx`) 사용.

---

## STEP 2 — 고객 페이지: 시각적 섹션·필드 순서 (위→아래, 좌→우)

아래는 **실제 DOM/레이아웃 순서**를 기준으로 함. DB 컬럼명은 코드에서 확인된 것만 표기.

### Product Identity (`section-1`, 사이드바: "Product Identity")

- **히어로 행 (좌: 이미지 | 우: 메타+텍스트)**
  - **이미지:** `image_url`
  - **배지 행 (좌→우):** `category`, `export_status` (표시명은 `EXPORT_STATUS_DISPLAY`)
  - **제목:** `translated_name` 없으면 `product_name`
  - **부제:** `product_name` (있을 때)
  - **판정·점수:** `go_verdict`, `composite_score` (`ProductIdentity.tsx` L162–187)
- **가격 블록**
  - **KRW / USD:** `kr_price` (USD는 Frankfurter API 환율로 클라이언트 계산, DB의 `kr_price_usd`와 별개)
  - **Est. Wholesale:** `estimated_cost_usd`
- **카피:** Alpha 유도 CTA → 앵커 `#section-6` (필드 아님)
- **Why It's Trending:** `viability_reason`

**이 섹션에서 고객 UI에 직접 안 나오지만 DB에 있는 정체성 필드 (동일 파일/페이지 다른 곳에서 쓰일 수 있음):** `naver_product_name`, `naver_link`, `ai_image_url` 등은 아래 Admin 인벤토리 참고.

---

### Trend Signals (`section-2`, 사이드바: "Trend Signals")

- **인트로** (정적 카피, DB 없음)
- **3열 그리드 (좌→우):**
  - **Market Score:** `market_viability`
  - **Competition Level:** `competition_level`
  - **Opportunity Status:** `gap_status` (라벨 문구 "Opportunity Status", `TrendSignalDashboard.tsx` L71–77)
- **Platform Breakdown:** `platform_scores` (TikTok / Instagram / YouTube / Reddit 등 파싱)
- **Growth Momentum**
  - **강조 숫자/라벨:** `growth_signal`
  - **본문:** `growth_evidence`, `new_content_volume`
- **푸터** (정적 소스 나열)

---

### Market Intelligence (`section-3`, 사이드바: "Market Intelligence")

- **마진·밸류에이션 블록 (있을 때만):** `profit_multiplier`, `estimated_cost_usd`, `global_prices` 파싱 결과 및/또는 추정식 (`MarketIntelligence.tsx` L150–256)
- **Global Market Availability**
  - **Best Entry:** `best_platform`
  - **6개 전략 시장 그리드:** `global_prices` (+ 레거시 `global_price`는 `parseGlobalPricesForGrid`에서 보조)
- **Search & Growth (그리드 왼쪽 열):** `search_volume`, `mom_growth`, `wow_rate`
- **Analyst Brief (그리드 오른쪽 열):** `top_selling_point` (Competitive Edge), `common_pain_point` (Risk Factor)
- **푸터** (정적)

**앵커 이슈:** `MarketIntelligence.tsx` L320에 `ScrollToIdButton sectionId="global-market-proof"` 가 있으나, 현재 `SupplierContact.tsx`에는 `id="global-market-proof"` 요소가 **없음** (grep 기준). 스크롤 타깃 불일치 가능.

---

### Social Proof (`section-4`, 사이드바: "Social Proof", H2는 "Social Proof & Trend Intelligence")

- **Social Buzz:** `buzz_summary`
- **Market Gap Analysis**
  - **Korean Traction (좌):** `kr_local_score`, `kr_evidence`, `kr_source_used`
  - **Global Presence (우):** `global_trend_score`, `global_evidence`
- **Gap Index:** `gap_index`, `gap_status` (배지), `trend_entry_strategy`, `opportunity_reasoning`
- **Trending Signals:** `rising_keywords`, `seo_keywords`, `viral_hashtags`
- **Scout Strategy Report:** `sourcing_tip` 파싱 후 Step 1–3 (마케팅/가격/B2B 소싱)
- **푸터** (정적)

---

### Export & Logistics (`section-5`, 사이드바: "Export & Logistics", H2: "Export & Logistics Intel")

- **Export Readiness:** `export_status`, `status_reason`
- **HS Code & Broker Weapon:** `hs_code`, `hs_description` (+ `BrokerEmailDraft`가 `report` 전달)
- **Logistics Dashboard:** `actual_weight_g`, `volumetric_weight_g`, `dimensions_cm`, `billable_weight_g`, `shipping_tier`, `hazmat_status`, `required_certificates`, `composition_info`, `spec_summary`, `hazmat_summary`
- **Compliance & Logistics Strategy:** `sourcing_tip` 파싱 Step 4–5, `shipping_notes` (조건부 표시)

---

### Launch Kit (`section-6`, 사이드바: "Launch Kit", H2: "Launch & Execution Kit")

`SupplierContact.tsx` — 래퍼는 `page.tsx`에서 `<div id="section-6">` (L181–183).

- **Financial Briefing:** `verified_cost_usd`, `verified_cost_note`(undisclosed 처리), `verified_at`, `moq`, `lead_time`, `can_oem`
- **Supplier & Brand Intel:** `m_name`, `corporate_scale`, `contact_email`, `contact_phone`, `m_homepage`, `wholesale_link`, `global_site_url`, `b2b_inquiry_url`, `translated_name`(헤더 일부), `sample_policy`, `export_cert_note`
- **Global Market Proof:** `global_prices`에서 URL/리스팅 파생 UI
- **Creative Assets:** `viral_video_url`, `video_url`, `ai_detail_page_links`, `marketing_assets_url`, `ai_image_url`

---

### 페이지 하단 (사이드바에 없음)

- 이전/다음 제품, 주간 목록 링크, 티어 업셀 (`page.tsx` L185–219) — DB 컬럼 편집 필드 아님.

---

## STEP 3 — 관리자 페이지: 접이 섹션별 완전 필드 목록

파일: `app/admin/[id]/page.tsx`.  
헤더 전역: **Status** `status` (select published/hidden), **Save** — L342–365.  
**수정 이력** 테이블은 `edit_history` JSON 표시 (L1400–1449); 별도 폼 필드는 아님.

### 헤더 (Sticky, 접이 아님)

| Field Label | DB Column | Field Type | Notes |
|-------------|-----------|------------|-------|
| Status (상태) | `status` | select | `published` / `hidden`; published 시 `published_at` 자동 (L347–352) |

---

### Product Identity (L414–549)

| Field Label | DB Column | Field Type | Notes |
|-------------|-----------|------------|-------|
| id (자동) | `id` | read-only | |
| Product Name | `product_name` | text | |
| Naver Product Name | `naver_product_name` | text | |
| Translated Name | `translated_name` | text | |
| Category | `category` | text | |
| KR Price (₩) | `kr_price` | text | |
| USD Price (자동) | `kr_price_usd` | read-only | PATCH에서 삭제됨 L234 |
| Est. Wholesale Cost (자동) | `estimated_cost_usd` | read-only | PATCH에서 삭제됨 L235 |
| Export Status | `export_status` | select | Green / Yellow / Red |
| Viability Summary | `viability_reason` | textarea | |
| Image URL | `image_url` | text (url) | |
| AI Image URL | `ai_image_url` | text (url) | |
| GO Verdict (자동) | `go_verdict` | read-only 표시 | **동일 컬럼이 Opportunity Status에서 select로도 편집됨 → 불일치** |
| Composite Score (자동) | `composite_score` | read-only | |
| Naver Link | `naver_link` | text (url) | |
| Week ID | `week_id` | text | |

---

### Trend Signal Dashboard (L551–627)

| Field Label | DB Column | Field Type | Notes |
|-------------|-----------|------------|-------|
| Market Score (0–100) | `market_viability` | number | |
| Competition Level | `competition_level` | select | Low / Medium / High |
| WoW Growth | `wow_rate` | text | 고객 PDP에서는 **Market Intelligence** Search & Growth에 표시 |
| MoM Growth | `mom_growth` | text | 동일 |
| Growth Evidence | `growth_evidence` | textarea | 고객 **Trend** Growth Momentum |
| Growth Signal | `growth_signal` | text | 고객 **Trend** Growth Momentum |

---

### Opportunity Status (L629–699) — 별도 접이 블록

| Field Label | DB Column | Field Type | Notes |
|-------------|-----------|------------|-------|
| GAP STATUS | `gap_status` | select | Blue Ocean / Emerging / Competitive / Saturated |
| GO VERDICT | `go_verdict` | select | GO / WATCH / NO-GO; Product Identity의 읽기 전용과 충돌 가능 |
| OPPORTUNITY REASONING | `opportunity_reasoning` | textarea | 고객 **Social Proof** Gap Index 하단 카피 |

**고객 UI 매핑:** `gap_status`는 **Trend Signals** 3번째 카드 제목 "Opportunity Status"에 직접 표시 (`TrendSignalDashboard.tsx` L71). `go_verdict`는 **Product Identity** 히어로 (`ProductIdentity.tsx`).

---

### Market Intelligence (L701–789)

| Field Label | DB Column | Field Type | Notes |
|-------------|-----------|------------|-------|
| Profit Multiplier | `profit_multiplier` | number (step 0.1, 문자열 저장) | |
| Winning Feature | `top_selling_point` | textarea | |
| Pain Point | `common_pain_point` | textarea | |
| New Content Volume | `new_content_volume` | text | 고객 **Trend** Growth Momentum에도 사용 |
| Search Volume | `search_volume` | text | |
| Best Platform | `best_platform` | text | |
| Global Prices | `global_prices` | JSON (헬퍼 내 text/number/url/checkbox) | `GlobalPricesHelper` — 지역별 listing 행 |

---

### Social Proof & Trend Intelligence (L791–1002)

| Field Label | DB Column | Field Type | Notes |
|-------------|-----------|------------|-------|
| Buzz Summary | `buzz_summary` | textarea | |
| KR Local Score | `kr_local_score` | number | onChange 시 `gap_index` 자동 |
| Global Trend Score | `global_trend_score` | number | onChange 시 `gap_index` 자동 |
| Gap Index (자동) | `gap_index` | read-only | |
| KR Evidence | `kr_evidence` | textarea | |
| Global Evidence | `global_evidence` | textarea | |
| KR Source Used | `kr_source_used` | text | |
| Gap Status | `gap_status` | text | **`gap_status` select와 중복 편집 경로** |
| Opportunity Reasoning | `opportunity_reasoning` | textarea | Opportunity Status와 **중복** |
| Rising Keywords ×5 | `rising_keywords` | text×5 | 배열로 저장 |
| SEO Keywords ×5 | `seo_keywords` | text×5 | |
| Viral Hashtags ×5 | `viral_hashtags` | text×5 | |
| Platform Scores (JSON) | `platform_scores` | textarea (JSON) | 고객 **Trend** Platform Breakdown |
| Sourcing Tip | `sourcing_tip` | textarea | 고객 Social(1–3단계) + Export(4–5단계) 파싱 |
| Trend Entry Strategy | `trend_entry_strategy` | textarea | 고객 **Social** Gap Index "Entry Strategy" |

---

### Export & Logistics Intel (L1004–1169)

| Field Label | DB Column | Field Type | Notes |
|-------------|-----------|------------|-------|
| HS Code | `hs_code` | text | |
| HS Description | `hs_description` | text | |
| Status Reason | `status_reason` | textarea | |
| Composition Info | `composition_info` | textarea | |
| Spec Summary | `spec_summary` | textarea | |
| Actual Weight (g) | `actual_weight_g` | number | `billable_weight_g` 연동 |
| Volumetric Weight (g) | `volumetric_weight_g` | number | 동일 |
| Billable Weight (g) (자동) | `billable_weight_g` | read-only | |
| Dimensions (cm) | `dimensions_cm` | text | |
| Hazmat Status | `hazmat_status` | JSON via checkboxes | Liquid/Powder/Battery/Aerosol |
| Required Certificates | `required_certificates` | text | 콤마 구분 |
| Shipping Notes | `shipping_notes` | textarea | |
| Shipping Tier | `shipping_tier` | text | |
| Key Risk Ingredient | `key_risk_ingredient` | text | |
| Hazmat Summary | `hazmat_summary` | textarea | |

**참고:** 고객 페이지에서 `export_status`는 **Export Readiness**에 쓰이나, Admin에서는 **Product Identity**에 있음.

---

### Launch & Execution Kit (L1171–1274)

| Field Label | DB Column | Field Type | Notes |
|-------------|-----------|------------|-------|
| Manufacturer Name | `m_name` | text | |
| Corporate Scale | `corporate_scale` | text | |
| Contact Email | `contact_email` | email | |
| Contact Phone | `contact_phone` | tel | |
| Manufacturer Website | `m_homepage` | url | |
| Wholesale Portal | `wholesale_link` | url | |
| Global Site URL | `global_site_url` | url | |
| B2B Inquiry URL | `b2b_inquiry_url` | url | |
| Can OEM | `can_oem` | select (null/true/false) | |

---

### CEO Direct Input Zone (L1276–1398)

| Field Label | DB Column | Field Type | Notes |
|-------------|-----------|------------|-------|
| Verified Cost (USD) | `verified_cost_usd` | text | |
| Verified Cost Note | `verified_cost_note` | text | |
| Verified At | `verified_at` | date input | ISO로 저장 시 slice 사용 L1316 |
| MOQ | `moq` | text | |
| Lead Time | `lead_time` | text | |
| Sample Policy | `sample_policy` | text | |
| Export Cert Note | `export_cert_note` | text | |
| Viral Video URL | `viral_video_url` | text | |
| Video URL | `video_url` | text | |
| Marketing Assets URL | `marketing_assets_url` | text | |
| AI Detail Page Links | `ai_detail_page_links` | `AiPageLinksHelper` | URL 배열 JSON |

---

### 하위 컴포넌트 세부 (필드 매핑)

**`components/admin/GlobalPricesHelper.tsx`**

- 컬럼: `global_prices` (통째 JSON 문자열로 `onChange`).
- UI: 지역 US, UK(내부 키 `gb`), EU, JP, SEA, UAE별 listing 행 — 각 행 **Platform** (text), **price_usd** (number), **URL** (url), **Sold Out** (checkbox).  
- **Show Raw JSON** 읽기 전용 textarea (L444–451).

**`components/admin/HazmatCheckboxes.tsx`**

- 컬럼: `hazmat_status` — `is_liquid`, `is_powder`, `is_battery`, `is_aerosol` 불리언 JSON.

**`components/admin/AiPageLinksHelper.tsx`**

- 컬럼: `ai_detail_page_links` — 최대 5 URL `input type="url"`.

---

## STEP 4 — 갭 분석

### 4.1 Admin에서 고객 섹션과 어긋난 배치 (misplaced)

| Admin 위치 | 필드 | 고객에서 실제 위치 | 비고 |
|------------|------|-------------------|------|
| Product Identity | `export_status` | Export & Logistics — Export Readiness | 뱃지는 Identity에도 보이나 “수출 준비” 서술은 Export 섹션 |
| Trend Signal Dashboard | `wow_rate`, `mom_growth` | Market Intelligence — Search & Growth | |
| Market Intelligence | `new_content_volume` | Trend — Growth Momentum | |
| Market Intelligence | `global_prices` | Market Intelligence 그리드 + Launch Kit — Global Market Proof | 한 컬럼이 두 UX 블록에 재사용 |
| Social Proof | `platform_scores` | Trend — Platform Breakdown | |
| Social Proof | `gap_status` (text), Opportunity Status (`gap_status` select) | Trend 카드 + Social Gap Index 배지 | 이중 편집 + 타입 불일치 위험 |
| Social Proof | `opportunity_reasoning` ×2 | Social — Gap Index | 동일 필드가 두 블록에 입력됨 |
| Launch Kit 섹션 vs CEO Zone | 제조사·URL·OEM이 “Launch”에, 검증 원가·미디어가 “CEO”에 분리 | 고객 Launch Kit은 한 시트에 통합 | 리디자인 시 Launch Kit 단일 그룹 권장 |

### 4.2 `ScoutFinalReportsRow`에 있으나 Admin 폼에 없는 컬럼 (또는 저장 diff에 없음)

`types/database.ts` 기준, Admin `formKeys` (L198–211) 및 화면에 없는 주요 컬럼:

| 컬럼 | 용도 (타입 주석) |
|------|------------------|
| `summary` | 요약 텍스트 |
| `consumer_insight` | 소비자 인사이트 |
| `global_price` | 레거시 JSON; PDP는 `global_prices`+`global_price` 병행 파싱 (`MarketIntelligence` L152) |
| `manufacturer_check` | 제조사 검증 |
| `competitor_analysis_pdf` | PDF 링크 |
| `free_list_at` | 무료 공개 시각 (RLS/티저) |
| `is_premium` | 플래그 |
| `is_teaser` | 티저 여부 |
| `sourcing_tip_logistics` | 로지스틱 전용 팁 (타입에 존재; 실제 파이프라인 사용 여부는 별도 확인) |
| `edit_history` | Admin이 저장 시 갱신; 편집 필드는 아님 |

*참고:* `id`, `created_at`, `kr_price_usd`, `estimated_cost_usd`는 의도적으로 PATCH에서 제외 또는 읽기 전용.

### 4.3 고객 페이지에만 있고 Admin에 “대응 필드”가 없는 UI (순수 카피/인프라)

- 좌측 네비·워터마크·티어 잠금·Frankfurter 환율 표시.
- `BrokerEmailDraft` UI (HS 기반 이메일 초안) — DB 추가 컬럼이라기보다 컴포넌트 동작.
- **Broken anchor:** `global-market-proof` — `MarketIntelligence.tsx` L320 스크롤 타깃이 현재 `SupplierContact`에 없음.

### 4.4 "Opportunity Status" (Admin 섹션)은 고객 어디에 해당하는가?

- **고객:** `TrendSignalDashboard` 세 번째 카드 제목이 **"Opportunity Status"**이며 값은 **`gap_status`** (`TrendSignalDashboard.tsx` L71–77).
- **추가:** 같은 이름이 Admin에서 독립 섹션(L629)으로 **`gap_status`**, **`go_verdict`**, **`opportunity_reasoning`** 을 묶음. → 라벨은 Trend와 맞지만 **`go_verdict`/`opportunity_reasoning`** 은 고객 기준으로는 Identity·Social 쪽에 가깝다.

### 4.5 "Global Prices" (`global_prices`) Admin 위치

- **`app/admin/[id]/page.tsx`** 의 **Market Intelligence** 접이 섹션 내부 (라벨 "Global Prices", L773–785).
- JSON은 **`GlobalPricesHelper`** 가 편집.

---

## STEP 5 — 고객 읽기 순서에 맞춘 이상적 Admin 그룹 제안

아래는 **고객 PDP** (`page.tsx` 컴포넌트 순서: Identity → Trend → MarketIntel → Social → SourcingIntel → SupplierContact`)를 기준으로 한 **권장 그룹**이다.

### Product Identity

- **포함 권장:** `product_name`, `naver_product_name`, `translated_name`, `category`, `image_url`, `kr_price`, `viability_reason`, `naver_link`, `week_id`, `ai_image_url`, (읽기전용) `id`, `kr_price_usd`, `estimated_cost_usd`
- **이동 검토:** `export_status` → **Export & Logistics** 그룹으로 옮기면 고객 Export Readiness와 인접.
- **판정:** `go_verdict`, `composite_score` — Identity에 표시되므로 Identity 근처 단일 소스(읽기 전용 vs 편집 통일).

### Trend Signals

- **포함 권장:** `market_viability`, `competition_level`, `gap_status` (단일 입력 방식으로 통일), `platform_scores`, `growth_signal`, `growth_evidence`, `new_content_volume`
- **에서 제거 권장:** `wow_rate`, `mom_growth` → **Market Intelligence** 그룹으로 이동.

### Market Intelligence

- **포함 권장:** `profit_multiplier`, `global_prices`, `best_platform`, `search_volume`, `mom_growth`, `wow_rate`, `top_selling_point`, `common_pain_point`
- **내부 순서 권장:** 마진/도매/글로벌 밸류에이션 블록 → 6시장 가격 → Search & Growth → Analyst Brief.

### Social Proof & Trend Intelligence

- **포함 권장:** `buzz_summary`, `kr_local_score`, `global_trend_score`, `gap_index`(자동), `kr_evidence`, `global_evidence`, `kr_source_used`, `trend_entry_strategy`, `rising_keywords`, `seo_keywords`, `viral_hashtags`, `opportunity_reasoning`, `sourcing_tip` (전략 1–3 문단)
- **중복 제거:** `gap_status` text 필드(Social 내) 제거하고 **Trend**의 select만 유지하거나 반대로 하나로 통일.
- **`platform_scores`는 Trend로 이미 이동** (고객 UI 기준).

### Export & Logistics

- **포함 권장:** `export_status`, `status_reason`, `hs_code`, `hs_description`, `actual_weight_g`, `volumetric_weight_g`, `billable_weight_g`, `dimensions_cm`, `hazmat_status`, `required_certificates`, `composition_info`, `spec_summary`, `shipping_tier`, `key_risk_ingredient`, `hazmat_summary`, `shipping_notes`, `sourcing_tip` 내 Step 4–5에 해당하는 콘텐츠(현재는 단일 필드 파싱 — 구조 유지 시 별도 서브블록만 순서 조정)

### Launch Kit (단일 섹션 권장: 현 "Launch & Execution Kit" + "CEO Zone" 병합)

- **Financial:** `verified_cost_usd`, `verified_cost_note`, `verified_at`, `moq`, `lead_time`, `can_oem`, `sample_policy`, `export_cert_note`
- **Supplier:** `m_name`, `corporate_scale`, `contact_email`, `contact_phone`, `m_homepage`, `wholesale_link`, `global_site_url`, `b2b_inquiry_url`
- **Creative / AI:** `viral_video_url`, `video_url`, `marketing_assets_url`, `ai_detail_page_links`
- **`global_prices`는 Market Intelligence에 유지**하되, Launch의 “Global Market Proof” 설명과 인접 배치를 원하면 같은 페이지에서 **섹션 참조 링크** 또는 접이 순서만 조정.

### 신규/보완 필드 (선택)

- **`global_price` 레거시** 마이그레이션 끝나면 Admin에서 제거 또는 읽기 전용 표시.
- **`summary`, `consumer_insight`, `is_teaser`, `free_list_at`** 등 운영 플래그는 별도 "Publishing & Access" 접이 블록을 두면 고객 본문과 분리되어 관리가 쉬움.

---

## 부록: 파일·라인 빠른 색인

| 파일 | 용도 |
|------|------|
| `app/weekly/[weekId]/[id]/page.tsx` | L133–140 `sections`, L163–183 컴포넌트 순서 |
| `components/layout/ClientLeftNav.tsx` | L62–84 네비 버튼 |
| `components/ProductIdentity.tsx` | L88–251 섹션 1 |
| `components/report/TrendSignalDashboard.tsx` | L39–177 섹션 2 |
| `components/report/MarketIntelligence.tsx` | L185–427 섹션 3 |
| `components/report/SocialProofTrendIntelligence.tsx` | L29–234 섹션 4 |
| `components/report/SourcingIntel.tsx` | L41–244 섹션 5 |
| `components/report/SupplierContact.tsx` | L192–438 Launch Kit |
| `components/GroupBBrokerSection.tsx` | HS 브로커 블록 |
| `app/admin/[id]/page.tsx` | L414~ 전체 폼 |
| `types/database.ts` | L35–170 `ScoutFinalReportsRow` |

---

*본 문서는 리디자인 시 단일 출처로 사용할 수 있도록 필드·파일·고객 섹션 매핑을 끝까지 나열함.*
