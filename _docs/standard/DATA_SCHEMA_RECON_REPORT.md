# KoreaScout 데이터 필드 전수조사 보고서

> **조사일:** 2026-03-05  
> **규칙:** 코드 수정 없음(Read-Only).  
> **목적:** DB·상세페이지 필드·티어 게이팅·14일 로직·Pricing FEATURES 정리. 프라이싱 페이지 피처 리스트 확정용.

---

## 1. DB 필드 완전 매핑 테이블

`types/database.ts`의 `ScoutFinalReportsRow` 및 상세페이지(`app/weekly/[weekId]/[id]/page.tsx`)·하위 컴포넌트에서 실제 사용되는 필드만 정리. 접근 등급은 **해당 필드가 노출되는 최소 티어** 기준.

| 필드명 | UI 표시 위치 | 현재 접근 등급 | 설명 |
|--------|-------------|--------------|------|
| id | 라우팅·네비게이션 | Free | 리포트 PK |
| week_id | 라우팅·Back to week | Free | 주차 FK |
| product_name | Section 1 (Product Identity) | Free | 한국어 상품명 |
| translated_name | Section 1, Broker 이메일 | Free | 영어 상품명 |
| image_url | Section 1, Broker 이메일 | Free | 메인 이미지 URL |
| category | Section 1, Broker 이메일 | Free | 카테고리 |
| viability_reason | Section 1 | Free | 트렌드 이유 한 줄 |
| export_status | Section 1 뱃지, Section 5, Broker | Free(뱃지) / Alpha(상세) | Green/Yellow/Red |
| kr_price | Section 1 (Dual-hero KRW\|USD) | Free | 한국 소비자 가격 |
| estimated_cost_usd | Section 1(일부), Section 3 | Free(Section1) / Standard+(Section3) | 추정 도매가 USD |
| market_viability | Section 2 (Trend Signal Dashboard) | Free | 시장성 점수 0–100 |
| competition_level | Section 2 | Free | Low/Medium/High |
| gap_status | Section 2, Section 4 | Free | Blue Ocean / Emerging / Saturated |
| platform_scores | Section 2 (Platform Breakdown) | Free | JSONB 플랫폼별 점수 |
| growth_signal | Section 2 | Free | 성장 시그널 텍스트 |
| growth_evidence | Section 2 | Free | 성장 증거 |
| new_content_volume | Section 2 | Free | 신규 콘텐츠 볼륨 |
| global_prices | Section 3, Section 6 (Global Proof) | Standard+ | JSONB 국가별 가격 상세 |
| global_price | Section 3 (파싱 폴백) | Standard+ | 레거시 가격 텍스트/JSON |
| profit_multiplier | Section 3 | Standard+ | 수익 배수 |
| search_volume | Section 3 | Standard+ | 검색량 |
| mom_growth | Section 3 | Standard+ | 전월 대비 성장률 |
| wow_rate | Section 3 | Standard+ | 주간 성장률 |
| top_selling_point | Section 3 (Analyst Brief) | Standard+ | 경쟁 우위 포인트 |
| common_pain_point | Section 3 (Analyst Brief) | Standard+ | 리스크 요인 |
| buzz_summary | Section 4 (Social Buzz) | Standard+ | 소셜 버즈 요약 |
| kr_local_score | Section 4 (Gap Analysis) | Standard+ | 한국 트랙션 점수 |
| global_trend_score | Section 4 (Gap Analysis) | Standard+ | 글로벌 존재도 점수 |
| kr_evidence | Section 4 | Standard+ | 한국 시장 증거 |
| kr_source_used | Section 4 | Standard+ | 한국 출처 |
| global_evidence | Section 4 | Standard+ | 글로벌 증거 |
| gap_index | Section 4 (Hero 숫자) | Standard+ | 갭 인덱스 |
| opportunity_reasoning | Section 4 | Standard+ | 기회 논리 |
| rising_keywords | Section 4 (Trending Signals) | Standard+ | 상승 키워드(KR) |
| seo_keywords | Section 4 (Trending Signals) | Alpha | 글로벌 SEO 키워드 |
| viral_hashtags | Section 4 (Trending Signals) | Alpha | 바이럴 해시태그 |
| sourcing_tip | Section 4(Step 1–3), Section 5(Step 4–5), Broker | Standard+(일부) / Alpha(전체) | 5단계 소싱 전략 텍스트 |
| export_status | Section 5 (Export Readiness) | Alpha | 상세 상태·사유 |
| status_reason | Section 5, Broker | Alpha | 규제/상태 사유 |
| actual_weight_g | Section 5 (Logistics) | Alpha | 실제 무게(g) |
| volumetric_weight_g | Section 5 | Alpha | 부피 무게(g) |
| billable_weight_g | Section 5 | Alpha | 청구 무게(g) |
| dimensions_cm | Section 5 | Alpha | 치수(cm) |
| shipping_tier | Section 5 | Alpha | 배송 티어 라벨 |
| required_certificates | Section 5, Broker | Alpha | 필요 인증(쉼표 구분) |
| shipping_notes | Section 5 | Alpha | 배송 메모 |
| key_risk_ingredient | Section 5, Broker | Alpha | 주요 위험 성분 |
| hazmat_status | Section 5, Broker | Alpha | JSONB 위험물 상태 |
| composition_info | Section 5, Broker | Alpha | 성분 정보 |
| spec_summary | Section 5 | Alpha | 스펙 요약 |
| hs_code | Section 5 (Group B), Broker | Alpha | HS 코드 |
| hs_description | Section 5, Broker | Alpha | HS 설명 |
| m_name | Section 6, hasSupplier | Alpha | 제조사명 |
| corporate_scale | Section 6 | Alpha | 기업 규모 |
| contact_email | Section 6 | Alpha | 연락 이메일 |
| contact_phone | Section 6 | Alpha | 연락 전화 |
| m_homepage | Section 6 | Alpha | 제조사 홈페이지 |
| naver_link | Section 6, Broker | Alpha | 네이버 링크 |
| wholesale_link | Section 6 | Alpha | 도매 포털 링크 |
| verified_cost_usd | Section 6 (Financial Briefing) | Alpha | 검증 단가 USD |
| verified_cost_note | Section 6 | Alpha | 단가 메모(예: undisclosed) |
| verified_at | Section 6 | Alpha | 검증일 ISO |
| moq | Section 6 | Alpha | 최소 주문 수량 |
| lead_time | Section 6 | Alpha | 리드타임 |
| sample_policy | Section 6 | Alpha | 샘플 정책 |
| export_cert_note | Section 6 | Alpha | 통관/인증 메모 |
| viral_video_url | Section 6 (Creative Assets) | Alpha | 바이럴 숏폼 영상 URL |
| video_url | Section 6 (Creative Assets) | Alpha | 4K/원본 영상 URL |
| ai_detail_page_links | Section 6 (Creative Assets) | Alpha | AI 랜딩 URL(들) |
| marketing_assets_url | Section 6 (Creative Assets) | Alpha | 브랜드 에셋 URL |
| ai_image_url | Section 6 (Creative Assets) | Alpha | AI 제품 이미지 URL |
| published_at | RLS·주차 노출 | — | 발행일 |
| free_list_at | RLS (14일 후 Free 접근) | — | published_at + 14일 |
| is_premium | RLS | — | 유료 전용 여부 |
| is_teaser | Section 1 배너, 게이팅 | Free | 미끼 리포트 시 전체 공개 |
| status | 쿼리·RLS | — | draft/published/archived |
| created_at | 정렬 등 | — | 생성일 |

**미사용(상세페이지에서 미참조):** `summary`, `consumer_insight`, `manufacturer_check`, `competitor_analysis_pdf`, `trend_entry_strategy`, `edit_history`, `best_platform` 등 — 타입에는 있으나 현재 상세 페이지 컴포넌트에서 직접 사용하지 않음.

---

## 2. 티어별 게이팅 현황

### Free 접근 가능

- id, week_id, product_name, translated_name, image_url, category, viability_reason  
- export_status(뱃지만), kr_price, estimated_cost_usd(Section 1 요약 수준)  
- Section 2 전부: market_viability, competition_level, gap_status, platform_scores, growth_signal, growth_evidence, new_content_volume  
- is_teaser === true 이면 **해당 리포트 전체** Standard/Alpha와 동일 노출(실제 게이팅은 `canSeeStandard` / `canSeeAlpha` + isTeaser로 처리).

### Standard 필요 (Standard 또는 Alpha일 때 노출)

- Section 3: global_prices, global_price, profit_multiplier, search_volume, mom_growth, wow_rate, top_selling_point, common_pain_point  
- Section 4: buzz_summary, kr_local_score, global_trend_score, kr_evidence, kr_source_used, global_evidence, gap_index, opportunity_reasoning, rising_keywords, sourcing_tip(Step 1–3)  
- Section 5: **구조는 보이되** 내부 값은 Alpha에서만 상세 노출(Export Readiness, HS Code, Logistics Dashboard, Compliance Strategy). Standard는 SourcingIntel 진입 가능하나 `canSeeAlpha`가 false면 플레이스홀더/락 오버레이.

### Alpha 전용

- seo_keywords, viral_hashtags (Section 4 블록)  
- sourcing_tip Step 4–5 (Section 5)  
- Section 5 전체 값: export_status 상세, status_reason, actual_weight_g, volumetric_weight_g, billable_weight_g, dimensions_cm, shipping_tier, required_certificates, shipping_notes, key_risk_ingredient, hazmat_status, composition_info, spec_summary, hs_code, hs_description  
- Section 6 전부: m_name, corporate_scale, contact_*, m_homepage, naver_link, wholesale_link, verified_cost_usd, verified_cost_note, verified_at, moq, lead_time, sample_policy, export_cert_note, viral_video_url, video_url, ai_detail_page_links, marketing_assets_url, ai_image_url, global_prices(Global Market Proof)

**로직 요약:** `canSeeStandard = tier === "standard" || tier === "alpha" || isTeaser`  
`canSeeAlpha = tier === "alpha" || isTeaser`  
Section 3·4는 canSeeStandard일 때만 실제 컴포넌트 렌더, 아니면 LockedSection 3개.  
Section 5는 hasLogistics && (canSeeStandard ? SourcingIntel : LockedSection).  
Section 6은 hasSupplier && (canSeeAlpha ? SupplierContact : LockedSection).

---

## 3. 14일 슬라이딩 윈도우 로직

- **적용 위치:** `app/weekly/[weekId]/page.tsx` (주차별 상품 목록). 상세 페이지(`[id]/page.tsx`)에서는 **직접 계산 없음** — RLS로 이미 접근 가능한 행만 조회.
- **작동 방식:**  
  - 주차의 `published_at`에 **+14일**을 더한 날짜를 계산.  
  - `new Date() >= published_at + 14일` 인 주차는 Free 사용자도 접근 가능(`canAccess = true`).  
  - 그 외 주차는 유료(Standard/Alpha)만 접근.  
- **DB:** `scout_final_reports.free_list_at`은 트리거로 `published_at + 14일` 설정. RLS 정책에서 `free_list_at IS NOT NULL AND free_list_at <= NOW()`로 Free 사용자 읽기 허용.
- **영향받는 섹션:** 14일 로직은 **주차 단위 접근**(해당 주차 리스트/상세 진입 여부)에만 영향. 한 번 상세 페이지에 들어온 뒤에는 티어별 게이팅(Section 3–6)만 적용.

---

## 4. 기존 FEATURES 배열 (Pricing Page)

`app/pricing/page.tsx`의 `FEATURES` 상수 전체. 타입: `FeatureRow` (feature: string, free/standard/alpha: boolean | string).

```ts
const FEATURES: FeatureRow[] = [
  { feature: "접근 시점", free: "14일 딜레이", standard: "즉시", alpha: "즉시" },
  { feature: "주간 상품 수", free: "절반 (~5)", standard: "전체 (~10)", alpha: "전체 (~10)" },
  { feature: "시장성 점수", free: true, standard: true, alpha: true },
  { feature: "경쟁 강도", free: true, standard: true, alpha: true },
  { feature: "블루오션", free: true, standard: true, alpha: true },
  { feature: "수익률", free: false, standard: true, alpha: true },
  { feature: "검색량", free: false, standard: true, alpha: true },
  { feature: "성장률", free: false, standard: true, alpha: true },
  { feature: "글로벌 가격", free: false, standard: true, alpha: true },
  { feature: "SEO 키워드", free: false, standard: true, alpha: true },
  { feature: "소비자 인사이트", free: false, standard: true, alpha: true },
  { feature: "AI 이미지", free: false, standard: true, alpha: true },
  { feature: "HS Code", free: false, standard: false, alpha: true },
  { feature: "소싱팁", free: false, standard: false, alpha: true },
  { feature: "MOQ/리드타임", free: false, standard: false, alpha: true },
  { feature: "소싱처 연락처", free: false, standard: false, alpha: true },
  { feature: "제조사 웹사이트", free: false, standard: false, alpha: true },
  { feature: "마켓플레이스 링크", free: false, standard: false, alpha: true },
  { feature: "4K 영상", free: false, standard: false, alpha: true },
  { feature: "바이럴 숏폼 영상", free: false, standard: false, alpha: true },
];
```

---

## 5. 피처 그루핑 제안 (Claude 가이드 기반)

각 DB 필드(및 Pricing 피처)를 아래 5개 그룹으로 분류.

| 그룹 | 포함 필드/피처 | 비고 |
|------|----------------|------|
| **Market Intelligence** | market_viability, competition_level, gap_status, profit_multiplier, search_volume, mom_growth, wow_rate, global_prices, global_price, estimated_cost_usd, top_selling_point, common_pain_point | Section 2–3. 시장성·경쟁·수익·검색·성장·글로벌 가격·애널리스트 브리프. Pricing: 시장성 점수, 경쟁 강도, 블루오션, 수익률, 검색량, 성장률, 글로벌 가격, 소비자 인사이트. |
| **Sourcing & Logistics** | sourcing_tip, export_status, status_reason, hs_code, hs_description, actual_weight_g, volumetric_weight_g, billable_weight_g, dimensions_cm, shipping_tier, required_certificates, shipping_notes, key_risk_ingredient, hazmat_status, composition_info, spec_summary | Section 5. HS, 무게, 배송, 인증, 성분/스펙. Pricing: HS Code, 소싱팁, MOQ/리드타임. |
| **Premium Media** | ai_image_url, video_url, viral_video_url, marketing_assets_url, ai_detail_page_links | Section 6 Creative Assets. Pricing: AI 이미지, 4K 영상, 바이럴 숏폼 영상. |
| **Global Proof** | platform_scores, kr_local_score, global_trend_score, kr_evidence, global_evidence, gap_index, opportunity_reasoning, rising_keywords, buzz_summary, global_prices(Proof 링크) | Section 2·4·6. 갭 분석, 트렌드 시그널, 글로벌 시장 증거. Pricing: SEO 키워드(Standard+에서 일부). |
| **Alpha Exclusive** | seo_keywords, viral_hashtags, m_name, contact_email, contact_phone, m_homepage, naver_link, wholesale_link, verified_cost_usd, verified_at, moq, lead_time, sample_policy, export_cert_note | Section 4(SEO/해시태그)·Section 6(연락처·검증 단가·MOQ·리드타임·정책). Pricing: 소싱처 연락처, 제조사 웹사이트, 마켓플레이스 링크 등 Alpha 행 전부. |

---

## 6. 헌법 위반 사항

- **blur/opacity로 실제 데이터 가리기:** **없음.**  
  - 상세 페이지에서는 게이팅 시 **LockedSection**으로 대체(가짜 플레이스홀더 + CTA) 또는 **Alpha 전용 섹션 미렌더**(Section 6).  
  - `opacity-[0.03]` / `opacity-5` / `opacity-0 group-hover:opacity-100` 사용처는 **장식용**(고스트 넘버, 카드 호버)이며, 실제 리포트 값을 blur/opacity로 숨기는 패턴은 없음.  
- **LockedSection:** `opacity-40`은 **가짜 데이터 행**(회색 바)에만 적용. 실제 DB 값을 블러/반투명 처리하는 “Golden Handcuffs” 스타일 게이팅은 미사용.

---

## 7. LockedSection 컴포넌트 요약

- **위치:** `components/LockedSection.tsx`  
- **역할:** Free/Standard가 접근할 수 없는 섹션 대신 표시. 메시지 + lockedFields 체크리스트 + CTA(`href`, 기본 `/pricing`).  
- **사용처:** Section 3·4 락(3종), Section 5 락(소싱 CTA), Section 6 락(Supplier CTA). 각각 `SECTION_*_LOCKED_CTA` / `SECTION_*_CTA` 상수로 메시지·CTA·lockedFields 전달.

---

대표님, 데이터베이스 및 상세페이지 항목 전수조사가 완료되었습니다.  
이 실제 데이터를 바탕으로 프라이싱 페이지 피처 리스트를 확정하시겠습니까?
