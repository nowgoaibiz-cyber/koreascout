# 63번 통합 JSON 마스터 리스트 × 프론트엔드 무결성 검수 보고서

**검수일:** 2025-03-11  
**범위:** `app/weekly/[weekId]/[id]/page.tsx` 및 해당 페이지에서 호출하는 모든 섹션·하위 컴포넌트  
**마스터 리스트:** Group A~F 76개 필드

---

## 1. 스캔 대상 파일

| 파일 | 용도 |
|------|------|
| `app/weekly/[weekId]/[id]/page.tsx` | 상세 페이지 진입점, report fetch, 섹션 분기 |
| `components/ProductIdentity.tsx` | Section 1 – Product Identity |
| `components/report/TrendSignalDashboard.tsx` | Section 2 – Trend Signals |
| `components/report/MarketIntelligence.tsx` | Section 3 – Market Intelligence |
| `components/report/SocialProofTrendIntelligence.tsx` | Section 4 – Social Proof |
| `components/report/SourcingIntel.tsx` | Section 5 – Export & Logistics |
| `components/report/SupplierContact.tsx` | Section 6 – Launch Kit & Supplier |
| `components/GroupBBrokerSection.tsx` | HS Code & Broker (SourcingIntel 하위) |
| `components/BrokerEmailDraft.tsx` | 브로커 이메일 초안 (GroupBBrokerSection 하위) |
| `components/report/utils.ts` | parseGlobalPricesForGrid 등 (global_price 사용) |

---

## 2. 매치 완료 (마스터 리스트와 1:1 대응되는 항목)

아래 항목은 **마스터 리스트에 있고**, **해당 페이지·하위 컴포넌트에서 실제로 사용**되고 있습니다.

- **Group A:** product_name, translated_name, category, image_url, viability_reason, is_teaser  
  (product_id → `report.id`로 사용, is_premium → 아래 “미노출” 참고)
- **Group B:** market_viability, competition_level, gap_status, growth_signal, growth_evidence, new_content_volume, platform_scores, buzz_summary, kr_local_score, global_trend_score, gap_index, opportunity_reasoning, rising_keywords, seo_keywords, viral_hashtags, kr_source_used
- **Group C:** kr_price, profit_multiplier, estimated_cost_usd, verified_cost_usd, verified_cost_note, verified_at, global_prices, search_volume, mom_growth, wow_rate, top_selling_point, common_pain_point
- **Group D:** export_status, status_reason, hs_code, hs_description, required_certificates, key_risk_ingredient, composition_info, spec_summary, actual_weight_g, volumetric_weight_g, billable_weight_g, dimensions_cm, shipping_tier, shipping_notes, hazmat_status
- **Group E:** m_name, m_homepage, contact_email, contact_phone, corporate_scale, moq, lead_time, sample_policy, export_cert_note, sourcing_tip, naver_link
- **Group F:** video_url, viral_video_url, marketing_assets_url, ai_image_url, ai_detail_page_links

**매치 완료 수:** 마스터 76개 중 **UI에서 실제 사용** 70개 수준 (아래 누락·미노출 반영 시 66개 완전 매치 + 4개 마스터 미포함 UI 필드).

---

## 3. ⚠️ 누락 및 불일치 항목

### 3.1 UI에는 있는데 마스터 리스트(63번)에 없는 항목

| 항목명 (UI/기능) | 코드 변수명 | 사용 위치 | 비고 |
|------------------|-------------|-----------|------|
| Wholesale Portal / 도매 포탈 링크 | `wholesale_link` | `page.tsx` (hasSupplier), `SupplierContact.tsx` (연락처 카드) | Section 6에서 “Wholesale Portal” 버튼으로 노출. 마스터 Group E에 없음. |
| 한국 인기 근거 텍스트 | `kr_evidence` | `SocialProofTrendIntelligence.tsx` | “Korean Traction” 점수 아래 설명 문단. 마스터 Group B에 없음. |
| 글로벌 트렌드 근거 텍스트 | `global_evidence` | `SocialProofTrendIntelligence.tsx` | “Global Presence” 점수 아래 설명 문단. 마스터 Group B에 없음. |
| 레거시/텍스트형 6국가 가격 | `global_price` | `MarketIntelligence.tsx` → `parseGlobalPricesForGrid(report.global_prices, report.global_price)` | `global_prices` JSON이 없을 때 fallback. DB 타입에는 있음. 마스터에는 `global_prices`만 있고 `global_price` 없음. |

**정리:**  
- **반드시 63번에 추가 권장:** `wholesale_link`, `kr_evidence`, `global_evidence`  
- **63번 스키마 설계 시 참고:** `global_price` (레거시 텍스트/객체형 – 마스터에 “6개국 가격 정보”가 `global_prices` 하나로 통합되어 있다면, fallback 컬럼으로 유지할지 여부만 결정하면 됨)

---

### 3.2 마스터 리스트에는 있는데 해당 상세 페이지 UI에 노출되지 않는 항목

| 마스터 항목명 | 코드 변수명 | 현재 상황 |
|---------------|-------------|-----------|
| product_id (ID) | — | UI에서는 `report.id`만 사용 (FavoriteButton, 링크 등). 마스터의 “product_id”와 동일 식별자로 매핑 가능. |
| is_premium | `report.is_premium` | DB/타입에는 존재. 상세 페이지·하위 컴포넌트에서 **렌더링/분기 로직 없음**. |
| best_platform (추천 플랫폼) | `report.best_platform` | DB/샘플 데이터에 있음. 상세 페이지 UI **미노출**. |
| trend_entry_strategy (진입 전략) | `report.trend_entry_strategy` | DB/타입에 있음. 상세 페이지 UI **미노출**. (진입 전략은 `sourcing_tip` 파싱으로 일부 사용) |
| m_address (제조사 주소) | `report.m_address` | 마스터 Group E에 있음. DB 타입·상세 UI 모두 **미사용**. |
| global_site_url (영문 사이트) | `report.global_site_url` | 마스터 Group E에 있음. DB 타입·상세 UI 모두 **미사용**. |
| b2b_inquiry_url (문의 폼/포탈) | `report.b2b_inquiry_url` | 마스터 Group E에 있음. DB 타입·상세 UI 모두 **미사용**. |
| export_posture (수출 준비 등급) | `report.export_posture` | 마스터 Group E에 있음. DB 타입·상세 UI 모두 **미사용**. |
| can_oem (OEM 가능 여부) | `report.can_oem` | 마스터 Group E에 있음. DB 타입·상세 UI 모두 **미사용**. |
| min_order_hint (내부 참고용 MOQ 힌트) | `report.min_order_hint` | 마스터 Group E에 있음. DB 타입·상세 UI 모두 **미사용**. |
| hazmat_summary (물류 경고 문구) | `report.hazmat_summary` | 마스터 Group D에 있음. UI는 `hazmat_status` JSON만 사용. **미노출**. |

---

## 4. 로직 검토 (하드코딩·더미·fallback)

- **환율:** `ProductIdentity.tsx`에서 USD 환산 시 `api.frankfurter.app` 라이브 환율 사용, 실패 시 `FALLBACK_RATE = 1430` 하드코딩.
- **Export 상태 문구:** `SourcingIntel.tsx`에서 Green/Yellow/그 외에 대한 설명 문구가 컴포넌트 내 하드코딩 (DB 값 아님).
- **Shipping Tier 설명:** `report/utils.ts`의 `describeShippingTier()`가 tier 문자열 패턴으로 “Tier 1/2/3” 설명 하드코딩.
- **Global prices:** `MarketIntelligence.tsx`에서 `global_prices` 우선, 없으면 `global_price`(문자열/객체) fallback 사용. DB 값 없으면 그리드만 “Untapped” 등으로 표시.
- **Platform breakdown:** `TrendSignalDashboard`에서 tiktok/instagram/youtube/reddit 키 고정; `platform_scores` JSON 구조에 의존.
- **Favorite / report.id:** 상세 페이지에서 `report.id`를 그대로 사용 (product_id와 동일 개념으로 매핑 가능).

---

## 5. 최종 제언 (63번 모듈에 넣어야 할 ‘숨겨진 변수’)

1. **마스터 리스트에 추가 권장 (UI에 이미 사용 중)**  
   - `wholesale_link` — 도매 포탈/문의 링크 (Group E 소싱·연락처 블록에 포함 권장)  
   - `kr_evidence` — 한국 인기 근거 텍스트 (Group B)  
   - `global_evidence` — 글로벌 트렌드 근거 텍스트 (Group B)  

2. **스키마·파이프라인 일관성**  
   - `global_price`: 현재 `global_prices`(JSON) 보조용으로 사용 중. 63번에서 “6개국 가격”을 `global_prices` 하나로만 정의했다면, `global_price`는 레거시/fallback 필드로 명시하고, 채우지 않아도 동작하도록 유지하는 방안 권장.  

3. **마스터에는 있으나 UI 미노출**  
   - `best_platform`, `trend_entry_strategy`, `hazmat_summary`, `m_address`, `global_site_url`, `b2b_inquiry_url`, `export_posture`, `can_oem`, `min_order_hint`, `is_premium`  
   - 63번 데이터는 그대로 두고, 추후 UI에 “추천 플랫폼”, “진입 전략 요약”, “물류 경고 문구”, “제조사 주소” 등으로 노출할 계획이 있으면 마스터 리스트 유지 권장.  
   - 단기적으로 UI에 쓸 계획이 없다면, 63번 출력 스펙에서 “선택(optional)”으로 표기해 두어도 됨.  

4. **Claude 등 다운스트림에 넘기기 전**  
   - 위 3개(`wholesale_link`, `kr_evidence`, `global_evidence`)를 63번 통합 JSON 스키마에 포함하면, 현재 상세 페이지에 노출되는 데이터와 단일 소스가 맞춰져 누락이 없음.  
   - `product_id`는 실제 DB/API의 `id`와 동일 값으로 매핑하면 됨.

---

## 6. 요약 표

| 구분 | 개수 | 비고 |
|------|------|------|
| 마스터 리스트 항목 수 | 76 | Group A~F |
| UI에서 사용·매치되는 항목 | 66 | product_id↔id, hazmat_summary 등 미노출 제외 |
| 마스터 없음 + UI 사용 | 4 | wholesale_link, kr_evidence, global_evidence, global_price |
| 마스터 있음 + UI 미노출 | 10 | is_premium, best_platform, trend_entry_strategy, m_address, global_site_url, b2b_inquiry_url, export_posture, can_oem, min_order_hint, hazmat_summary |

— **검수 완료**
