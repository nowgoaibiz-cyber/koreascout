# KoreaScout 상품 상세 페이지(Product Detail Page) — UI ↔ DB 원자 단위 매핑 보고서

**작성:** 지금행컴퍼니 시니어 풀스택 엔지니어 / 데이터 아키텍트  
**범위:** Frontend(상세 페이지 컴포넌트), Database(scout_final_reports), Data Fetching  
**참고:** 본 프로젝트에는 `scout_products` 테이블이 없으며, 상품 리포트는 **scout_final_reports** 단일 테이블**로 관리됩니다.

---

## 1. 데이터 페칭 요약

| 항목 | 내용 |
| :--- | :--- |
| **페이지** | `app/weekly/[weekId]/[id]/page.tsx` |
| **쿼리** | `supabase.from("scout_final_reports").select("*").eq("id", id).eq("week_id", weekId).eq("status", "published").single()` |
| **변수 매핑** | `report` 한 건이 `ScoutFinalReportsRow` 타입으로 하위 컴포넌트에 전달됨. 별도 변환 없이 `report as ScoutFinalReportsRow`로 전달. |

---

## 2. UI 섹션별 표시 항목 ↔ DB 컬럼 매핑 표

| UI 섹션 | 표시 항목명 | 코드 변수명 | 매핑된 DB 컬럼 | 데이터 타입 | 특이사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Product Identity (Section 1)** | 상품 이미지 | `report.image_url` | `image_url` | TEXT | 메인 썸네일 |
| Product Identity | 상품명(한글) | `report.product_name` | `product_name` | TEXT | 제목 1순위 |
| Product Identity | 상품명(영문) | `report.translated_name` | `translated_name` | TEXT | 부제 또는 alt |
| Product Identity | 카테고리 뱃지 | `report.category` | `category` | TEXT | |
| Product Identity | 수출 적합성 뱃지 | `report.export_status` | `export_status` | TEXT | Green/Yellow/Red → EXPORT_STATUS_DISPLAY로 라벨 매핑 |
| Product Identity | 즐겨찾기 | (reportId/weekId) | `id`, `week_id` | UUID, TEXT | user_favorites 조회용 |
| Product Identity | 소매가(한국 시장) | `report.kr_price` | `kr_price` | TEXT | KRW 포맷(예: 12000); 클라이언트에서 Number() 변환 후 toLocaleString |
| Product Identity | 소매가(USD) | 클라이언트 계산 | — | 파생 | `Number(report.kr_price) / exchangeRate` (Frankfurter API 실시간 환율). DB `kr_price_usd`는 사용하지 않음 |
| Product Identity | Est. Wholesale | `report.estimated_cost_usd` | `estimated_cost_usd` | NUMERIC | DB 트리거로 kr_price 기반 자동 계산(약 60%) |
| Product Identity | Alpha 멤버 CTA | (고정 문구) | — | — | Section 6 링크 |
| Product Identity | Why It's Trending | `report.viability_reason` | `viability_reason` | TEXT | |
| **Trend Signal Dashboard (Section 2)** | Market Score | `report.market_viability` | `market_viability` | INTEGER | DonutGauge 0–100 |
| Trend Signal Dashboard | Competition Level | `report.competition_level` | `competition_level` | TEXT | Low/Medium/High 색상 분기 |
| Trend Signal Dashboard | Opportunity Status | `report.gap_status` | `gap_status` | TEXT | Blue Ocean / Emerging / Saturated 등 |
| Trend Signal Dashboard | Platform Breakdown (TikTok, Instagram, YouTube, Reddit) | `report.platform_scores` 파싱 | `platform_scores` | JSONB | `safeParsePlatformScores()` → `score`, `sentiment` (Reddit) |
| Trend Signal Dashboard | Growth Momentum 텍스트 | `report.growth_signal` | `growth_signal` | string \| null | |
| Trend Signal Dashboard | Growth Evidence | `report.growth_evidence` | `growth_evidence` | string \| null | |
| Trend Signal Dashboard | New Content Volume | `report.new_content_volume` | `new_content_volume` | string \| null | |
| **Market Intelligence (Section 3)** | 마진 배수 | `report.profit_multiplier` | `profit_multiplier` | NUMERIC | "UP TO N× MARGIN POTENTIAL" |
| Market Intelligence | Est. Wholesale | `report.estimated_cost_usd` | `estimated_cost_usd` | NUMERIC | Section 1과 동일 소스 |
| Market Intelligence | Global Valuation | 파생 | — | 계산 | `global_prices`/`global_price`에서 파싱한 가격 평균; 없으면 `estimated_cost_usd * profit_multiplier` |
| Market Intelligence | 6개 시장 가격/Untapped | `report.global_prices`, `report.global_price` | `global_prices` (JSONB), `global_price` (JSONB/레거시) | Json, Json | `parseGlobalPricesForGrid()` — US, UK, SEA 등 region별 priceDisplay, platform, isBlueOcean |
| Market Intelligence | Search Volume | `report.search_volume` | `search_volume` | TEXT | |
| Market Intelligence | MoM Growth | `report.mom_growth` | `mom_growth` | TEXT | isPositiveGrowth()로 ↑/↓ 표시 |
| Market Intelligence | WoW Growth | `report.wow_rate` | `wow_rate` | string \| null | |
| Market Intelligence | Competitive Edge | `report.top_selling_point` | `top_selling_point` | string \| null | Analyst Brief |
| Market Intelligence | Risk Factor | `report.common_pain_point` | `common_pain_point` | string \| null | Analyst Brief |
| **Social Proof & Trend (Section 4)** | Social Buzz 인용문 | `report.buzz_summary` | `buzz_summary` | string \| null | |
| Social Proof | Korean Traction 점수 | `report.kr_local_score` | `kr_local_score` | number \| null | 0–100, 프로그레스 바 |
| Social Proof | Global Presence 점수 | `report.global_trend_score` | `global_trend_score` | number \| null | 0–100 |
| Social Proof | KR Evidence / Source | `report.kr_evidence`, `report.kr_source_used` | `kr_evidence`, `kr_source_used` | string \| null | |
| Social Proof | Global Evidence | `report.global_evidence` | `global_evidence` | string \| null | |
| Social Proof | Gap Index 숫자 | `report.gap_index` | `gap_index` | number \| null | 대형 숫자 |
| Social Proof | Gap Status 뱃지 | `report.gap_status` | `gap_status` | TEXT | Section 2와 동일 컬럼 |
| Social Proof | Opportunity Reasoning | `report.opportunity_reasoning` | `opportunity_reasoning` | string \| null | |
| Social Proof | Rising Keywords (KR) | `report.rising_keywords` | `rising_keywords` | string[] \| null | normalizeToArray() |
| Social Proof | Global SEO Keywords | `report.seo_keywords` | `seo_keywords` | string \| string[] \| null | Alpha에서만 풀 표시 |
| Social Proof | Viral Hashtags | `report.viral_hashtags` | `viral_hashtags` | string[] \| null | Alpha에서만 풀 표시 |
| Social Proof | Scout Strategy Report (Step 1–3) | `report.sourcing_tip` 파싱 | `sourcing_tip` | TEXT | parseSourcingStrategy() → [마케팅 전략], [가격/마진], [B2B 소싱] 블록 |
| **Export & Logistics (Section 5)** | Export Readiness 라벨/아이콘 | `report.export_status` | `export_status` | TEXT | Green/Yellow/그 외 → Ready / Conditional / Restricted |
| Export & Logistics | Status Reason | `report.status_reason` | `status_reason` | string \| null | 규제·분류 근거 |
| Export & Logistics | HS Code | `report.hs_code` | `hs_code` | TEXT \| null | formatHsCode()로 0000.00 형식 |
| Export & Logistics | HS Description | `report.hs_description` | `hs_description` | string \| null | HS 코드 아래 설명 |
| Export & Logistics | Broker Email Draft | (report 전체) | 다수 컬럼 | — | BrokerEmailDraft에 report 전달; hs_code, hs_description, status_reason, composition_info, key_risk_ingredient, hazmat_status, required_certificates, dimensions_cm, actual_weight_g 등 사용 |
| Export & Logistics | Actual Weight | `report.actual_weight_g` | `actual_weight_g` | number \| null | 그램 단위 |
| Export & Logistics | Volumetric Weight | `report.volumetric_weight_g` | `volumetric_weight_g` | number \| null | 그램 |
| Export & Logistics | Dimensions | `report.dimensions_cm` | `dimensions_cm` | string \| null | 예: "15 × 8 × 5" |
| Export & Logistics | Billable Weight | `report.billable_weight_g` | `billable_weight_g` | number \| null | 배송 비용 산정용 |
| Export & Logistics | Volumetric/Dead weight 적용 문구 | 파생 | `actual_weight_g`, `volumetric_weight_g` | 비교 | `volumetric_weight_g > actual_weight_g` → "Volumetric applies" |
| Export & Logistics | Shipping Tier | `report.shipping_tier` | `shipping_tier` | string \| null | describeShippingTier()로 Tier 1/2/3 설명문 |
| Export & Logistics | Hazmat 뱃지 (Liquid, Powder, Battery, Aerosol) | `report.hazmat_status` | `hazmat_status` | JSONB | contains_liquid, contains_powder, contains_battery, contains_aerosol |
| Export & Logistics | Risk Ingredient | `report.key_risk_ingredient` | `key_risk_ingredient` | string \| null | |
| Export & Logistics | Certifications Required | `report.required_certificates` | `required_certificates` | string \| null | 쉼표 구분 파싱 후 pills |
| Export & Logistics | Ingredients | `report.composition_info` | `composition_info` | string \| null | ExpandableText |
| Export & Logistics | Specifications | `report.spec_summary` | `spec_summary` | string \| null | ExpandableText |
| Export & Logistics | Compliance & Logistics Strategy (Step 4–5) | `report.sourcing_tip` 파싱 | `sourcing_tip` | TEXT | [통관/규제], [물류/배송] 블록 |
| Export & Logistics | Shipping Notes | `report.shipping_notes` | `shipping_notes` | string \| null | "tier" 포함 시 노출 제외 로직 있음 |
| **Launch Kit / Supplier (Section 6)** | Cost Per Unit (Verified) | `report.verified_cost_usd` | `verified_cost_usd` | TEXT | 숫자 파싱 후 $ 표시; "undisclosed" 시 문구만 |
| Launch Kit | Verified at 날짜 | `report.verified_at` | `verified_at` | string \| null | ISO 날짜 → toLocaleDateString |
| Launch Kit | MOQ | `report.moq` | `moq` | string \| null | |
| Launch Kit | Est. Production Lead Time | `report.lead_time` | `lead_time` | string \| null | |
| Launch Kit | Supplier/Brand 이름 | `report.m_name` | `m_name` | string \| null | |
| Launch Kit | Contact (Email, Phone, Website, Wholesale) | `report.contact_email`, `contact_phone`, `m_homepage`, `wholesale_link` | 동일 컬럼 | TEXT \| null | 링크/버튼; **naver_link는 연락처 카드에 없음** |
| Launch Kit | Sample Policy | `report.sample_policy` | `sample_policy` | string \| null | |
| Launch Kit | Compliance Note | `report.export_cert_note` | `export_cert_note` | string \| null | |
| Launch Kit | Global Market Proof 카드 | `report.global_prices` | `global_prices` | JSONB | region별 url, platform; US/UK/SEA/AU/IN |
| Launch Kit | Creative Assets (Viral, Video, AI Page, Brand Kit, AI Image) | `report.viral_video_url`, `video_url`, `ai_detail_page_links`, `marketing_assets_url`, `ai_image_url` | 동일 컬럼 | TEXT / Json | getAiDetailUrl(ai_detail_page_links) |
| **공통/네비** | 이전/다음 상품 링크 | prevId, nextId | — | 파생 | weekReports에서 id 리스트로 인덱스 계산 |
| **공통** | Teaser 배너 | `report.is_teaser` | `is_teaser` | boolean | "FREE THIS WEEK" 표시 |
| **공통** | Section 5 노출 여부 | hasLogistics | 다수 컬럼 | 파생 | hs_code, hs_description, hazmat_status, dimensions_cm, billable_weight_g, shipping_tier, required_certificates, shipping_notes, key_risk_ingredient, status_reason, actual_weight_g, volumetric_weight_g, sourcing_tip 조합 |
| **공통** | Section 6 노출 여부 | hasSupplier | m_name, corporate_scale, contact_*, m_homepage, naver_link, wholesale_link, sourcing_tip | 파생 | 하나라도 있으면 Launch Kit 섹션 렌더 |

---

## 3. 계산/파생 로직 정리

| 표시값 | 계산 방식 | 비고 |
| :--- | :--- | :--- |
| USD 소매가 (Product Identity) | `Number(report.kr_price) / exchangeRate` (Frankfurter API) | DB `kr_price_usd` 미사용 |
| Global Valuation (Section 3) | `global_prices` 파싱 가격 평균; 없으면 `estimated_cost_usd * profit_multiplier` | |
| Volumetric vs Dead weight 문구 | `volumetric_weight_g > actual_weight_g` 비교 | DB에는 없음 |
| Export 라벨/색상 | `export_status` → Green/Yellow/그 외 → 상수 매핑 | EXPORT_STATUS_DISPLAY |
| Shipping Tier 설명 | `describeShippingTier(shipping_tier)` — Tier 1/2/3 또는 원문 | SHIPPING_TIER_TOOLTIP 참고 |
| Strategy Steps (Section 4, 5) | `parseSourcingStrategy(sourcing_tip)` — 정규식으로 [마케팅 전략], [가격/마진] 등 블록 분리 | |
| Global Market 6개 시장 | `parseGlobalPricesForGrid(global_prices, global_price)` — US, UK, SEA, AU, IN 등 | 레거시 global_price 텍스트 폴백 지원 |

---

## 4. 불일치(Mismatch) 리포트

### 4.1 DB에는 있으나 UI에 노출되지 않는 데이터 (죽은 데이터)

| DB 컬럼 | 타입 | 비고 |
| :--- | :--- | :--- |
| `summary` | TEXT | 상세 페이지 어디에도 미노출. (리스트 카드 등 다른 화면에서만 사용 가능성 있음) |
| `consumer_insight` | TEXT | 상세 페이지에서 미사용 |
| `manufacturer_check` | TEXT | UI 전역 미참조 |
| `best_platform` | string \| null | UI 전역 미참조 |
| `trend_entry_strategy` | string \| null | UI 전역 미참조 |
| `competitor_analysis_pdf` | TEXT | 상세 페이지에서 미사용 (다운로드 링크 등 없음) |
| `kr_price_usd` | number \| null | 트리거로 계산되나, 프론트는 kr_price + 실시간 환율로 USD 표시하여 미사용 |
| `corporate_scale` | string \| null | Section 6 노출 여부(hasSupplier) 판단에만 사용, **텍스트로 표시되는 UI 없음** |
| `naver_link` | string \| null | Section 6 노출 여부·Broker 이메일 본문에만 사용. **PDP 상에는 "네이버 스토어" 링크 버튼/칸 없음** (연락처 카드는 email, phone, website, wholesale만 표시) |

### 4.2 UI에는 칸/레이블이 있지만 DB에서 제대로 못 채우면 빈 껍데기

| UI 위치 | 표시 항목 | DB 컬럼 | 위험 요소 |
| :--- | :--- | :--- | :--- |
| Product Identity | Est. Wholesale | `estimated_cost_usd` | `kr_price` 없으면 트리거가 NULL 반환 → "—" 또는 미표시 |
| Section 3 | Global Valuation | `global_prices` / `estimated_cost_usd`·`profit_multiplier` | global_prices·global_price 모두 비면 계산된 valuation만 가능; 둘 다 없으면 "—" |
| Section 3 | 6개 시장 가격 | `global_prices` / `global_price` | 파이프라인에서 채우지 않으면 전부 "Untapped" |
| Section 4 | Gap Index / 점수들 | `gap_index`, `kr_local_score`, `global_trend_score` | null이면 해당 블록 자체 미렌더 |
| Section 5 | HS Code & Broker | `hs_code`, `hs_description` | 비어 있으면 "No HS code available" / "Available once HS code is confirmed" |
| Section 5 | 무게 3종 | `actual_weight_g`, `volumetric_weight_g`, `billable_weight_g` | 없으면 "—"; 배송 비용 추정 불가 |
| Section 6 | Cost Per Unit | `verified_cost_usd` | Alpha 수동 입력; 없으면 "Not available" |
| Section 6 | MOQ / Lead Time | `moq`, `lead_time` | 없으면 해당 블록 비표시 |
| Section 6 | Global Market Proof | `global_prices` 내 url | url 없으면 카드 없음 |

---

## 5. 신규 물류/소싱 지표(Export Posture, OEM, Hazmat 등) UI 배치 제안

- **Export Posture (수출 자세/등급)**  
  - **최적 위치:** Section 5 "Export Readiness" 블록 직후 또는 "Export Readiness"와 "HS Code & Broker Weapon" 사이.  
  - **이유:** 이미 `export_status`(Green/Yellow/Red)와 `status_reason`이 같은 맥락이므로, "Export Posture"를 더 세분화된 등급/설명으로 두면 일관됨.  
  - **DB:** `export_posture` TEXT 또는 JSONB(세부 플래그) 추가 후, 기존 `export_status`와 함께 표시.

- **OEM (OEM 가능 여부/조건)**  
  - **최적 위치:** Section 6 "Supplier & Brand Intel" 안, MOQ/Lead Time 근처 또는 "Sample Policy" 위.  
  - **이유:** 제조·소싱 조건과 함께 두는 것이 자연스럽고, Alpha 대상 정보와 성격이 같음.  
  - **DB:** `oem_available` boolean 또는 `oem_note` TEXT 추가.

- **Hazmat**  
  - **현재:** `hazmat_status` JSONB로 Liquid/Powder/Battery/Aerosol 플래그가 Section 5 "Hazmat & Compliance"에 이미 노출됨.  
  - **추가 시:** Hazmat 등급(예: UN 클래스)이나 "Fully hazmat / Partial / None" 같은 요약 필드를 넣을 경우, **Section 5 "Export Readiness" 바로 아래** 또는 "Hazmat & Compliance" 제목 옆에 뱃지/한 줄 요약으로 두는 것을 권장.  
  - **DB:** `hazmat_summary` TEXT 또는 `hazmat_class` TEXT 추가 후, 기존 `hazmat_status`와 함께 표시.

요약 표:

| 신규 지표 | 권장 UI 위치 | 권장 DB 추가 |
| :--- | :--- | :--- |
| Export Posture | Section 5, Export Readiness 근처 | `export_posture` TEXT or JSONB |
| OEM | Section 6, MOQ/Lead Time 또는 Sample Policy 근처 | `oem_available` boolean or `oem_note` TEXT |
| Hazmat (요약/등급) | Section 5, Hazmat & Compliance 블록 | `hazmat_summary` or `hazmat_class` (기존 hazmat_status 보완) |

---

## 6. 참고 파일 목록

- **페이지:** `app/weekly/[weekId]/[id]/page.tsx`  
- **컴포넌트:** `ProductIdentity.tsx`, `report/TrendSignalDashboard.tsx`, `report/MarketIntelligence.tsx`, `report/SocialProofTrendIntelligence.tsx`, `report/SourcingIntel.tsx`, `report/SupplierContact.tsx`, `GroupBBrokerSection.tsx`, `HazmatBadges.tsx`, `BrokerEmailDraft.tsx`  
- **타입/스키마:** `types/database.ts` (ScoutFinalReportsRow), `supabase/migrations/001_phase2_schema.sql`, `002_product_identity_pricing.sql`, `003_sync_from_live_audit.sql`  
- **유틸/상수:** `components/report/utils.ts`, `components/report/constants.ts`
