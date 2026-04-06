# Admin · PDP 필드 감사 보고서 V2 (Definitive)

**생성일:** 2026-04-06  
**범위:** 읽기 전용 코드 스캔. `types/database.ts`의 `ScoutFinalReportsRow` 전 컬럼과 `app/admin/[id]/page.tsx` 전 필드 대조.

---

## STEP 1 — 고객 PDP 컴포넌트별 `report.*` 참조 (전수)

아래는 지정된 TSX에서 **JSX/표현식에 나타나는** `report.` / `report?.` 참조를 추린 것이다.  
*(같은 컬럼이 한 파일에 여러 번 나오면 한 행으로 묶고, 대표 UI만 적는다.)*

### ProductIdentity — `components/ProductIdentity.tsx`

| DB Column | Where displayed in UI | Section in customer PDP |
|-----------|----------------------|-------------------------|
| `report.export_status` | Export 뱃지 (Green/Yellow/Red 스타일) | Product Identity |
| `report.kr_price` | "Retail Price (KR Market)" KRW / USD | Product Identity |
| `report.image_url` | 히어로 이미지 `Image` src | Product Identity |
| `report.product_name` | 부제 / alt 텍스트 | Product Identity |
| `report.translated_name` | 메인 타이틀 (`\|\|` 폴백) / alt | Product Identity |
| `report.category` | 카테고리 칩 | Product Identity |
| `report.go_verdict` | 판정 뱃지 | Product Identity |
| `report.composite_score` | "KoreaScout Intelligence Score" | Product Identity |
| `report.estimated_cost_usd` | "Est. Wholesale" | Product Identity |
| `report.viability_reason` | "Why It's Trending" 블록 본문 | Product Identity |

### TrendSignalDashboard — `components/report/TrendSignalDashboard.tsx`

| DB Column | Where displayed in UI | Section in customer PDP |
|-----------|----------------------|-------------------------|
| `report.market_viability` | DonutGauge "Market Score" | Trend Signal Dashboard |
| `report.competition_level` | "Competition Level" 대형 텍스트 | Trend Signal Dashboard |
| `report.gap_status` | 세 번째 카드 "Opportunity Status" | Trend Signal Dashboard |
| `report.platform_scores` | `safeParsePlatformScores` → Platform Breakdown (TikTok/IG/YT/Reddit) | Trend Signal Dashboard |
| `report.growth_signal` | Growth Momentum 큰 숫자/라벨 | Trend Signal Dashboard |
| `report.growth_evidence` | Growth Momentum 본문 | Trend Signal Dashboard |
| `report.new_content_volume` | Growth Momentum 본문 (추가 줄) | Trend Signal Dashboard |

### MarketIntelligence — `components/report/MarketIntelligence.tsx`

| DB Column | Where displayed in UI | Section in customer PDP |
|-----------|----------------------|-------------------------|
| `report.estimated_cost_usd` | "Est. Wholesale", 마진 블록 | Market Intelligence |
| `report.profit_multiplier` | "UP TO …× MARGIN POTENTIAL" | Market Intelligence |
| `report.global_prices` | `parseGlobalPricesForGrid` → 6개 시장 그리드 | Market Intelligence |
| `report.global_price` | 동 함수 두 번째 인자 (레거시 폴백) | Market Intelligence |
| `report.best_platform` | "Best Entry: …" | Market Intelligence |
| `report.search_volume` | "SEARCH VOLUME" | Market Intelligence |
| `report.mom_growth` | "MoM GROWTH" | Market Intelligence |
| `report.wow_rate` | "WoW GROWTH" | Market Intelligence |
| `report.top_selling_point` | Analyst Brief "Competitive Edge" | Market Intelligence |
| `report.common_pain_point` | Analyst Brief "Risk Factor" | Market Intelligence |

### SocialProofTrendIntelligence — `components/report/SocialProofTrendIntelligence.tsx`

| DB Column | Where displayed in UI | Section in customer PDP |
|-----------|----------------------|-------------------------|
| `report.rising_keywords` | `normalizeToArray` → Rising Keywords 칩 | Social Proof & Trend Intelligence |
| `report.seo_keywords` | Global SEO Keywords 칩 | Social Proof & Trend Intelligence |
| `report.viral_hashtags` | Viral Hashtags 칩 | Social Proof & Trend Intelligence |
| `report.sourcing_tip` | `parseSourcingStrategy` → Scout Strategy Step **1–3** 본문 | Social Proof & Trend Intelligence |
| `report.buzz_summary` | Social Buzz 인용 블록 | Social Proof & Trend Intelligence |
| `report.kr_local_score` | Korean Traction 점수 + 바 | Social Proof & Trend Intelligence |
| `report.kr_evidence` | Korean Traction 설명 | Social Proof & Trend Intelligence |
| `report.kr_source_used` | "Source: …" | Social Proof & Trend Intelligence |
| `report.global_trend_score` | Global Presence 점수 + 바 | Social Proof & Trend Intelligence |
| `report.global_evidence` | Global Presence 설명 | Social Proof & Trend Intelligence |
| `report.gap_index` | Gap Index 대형 숫자 | Social Proof & Trend Intelligence |
| `report.gap_status` | Gap Index 아래 배지 | Social Proof & Trend Intelligence |
| `report.trend_entry_strategy` | "Entry Strategy" | Social Proof & Trend Intelligence |
| `report.opportunity_reasoning` | Gap Index 하단 이탤릭 문단 | Social Proof & Trend Intelligence |

### SourcingIntel — `components/report/SourcingIntel.tsx`

| DB Column | Where displayed in UI | Section in customer PDP |
|-----------|----------------------|-------------------------|
| `report.sourcing_tip` | `parseSourcingStrategy` → Step **4–5** (slice 3–5) | Export & Logistics Intel |
| `report.export_status` | Export Readiness 아이콘/라벨/카피 | Export & Logistics Intel |
| `report.status_reason` | Export Readiness 본문 | Export & Logistics Intel |
| `report.actual_weight_g` | Logistics "Actual Weight" | Export & Logistics Intel |
| `report.volumetric_weight_g` | "Volumetric Weight" | Export & Logistics Intel |
| `report.dimensions_cm` | 부피중량 아래 칩 | Export & Logistics Intel |
| `report.billable_weight_g` | "Billable Weight" | Export & Logistics Intel |
| `report.shipping_tier` | `describeShippingTier` 설명 문장 | Export & Logistics Intel |
| `report.hazmat_status` | `HazmatBadges` | Export & Logistics Intel |
| `report.required_certificates` | Certifications 칩 | Export & Logistics Intel |
| `report.composition_info` | Ingredients `ExpandableText` | Export & Logistics Intel |
| `report.spec_summary` | Specifications `ExpandableText` | Export & Logistics Intel |
| `report.hazmat_summary` | Hazmat Summary | Export & Logistics Intel |
| `report.shipping_notes` | Compliance 블록 하단 (조건: `!/tier/i.test`) | Export & Logistics Intel |

### SupplierContact — `components/report/SupplierContact.tsx`

| DB Column | Where displayed in UI | Section in customer PDP |
|-----------|----------------------|-------------------------|
| `report.m_name` | Supplier 헤더, `hasSupplierFields` 판별 | Launch & Execution Kit |
| `report.corporate_scale` | SME 등 배지 / `hasSupplierFields` | Launch & Execution Kit |
| `report.contact_email` | 연락 카드 | Launch & Execution Kit |
| `report.contact_phone` | 연락 카드 | Launch & Execution Kit |
| `report.m_homepage` | Website 카드 | Launch & Execution Kit |
| `report.naver_link` | `hasSupplierFields`만 (카드 배열에는 없음) | Launch & Execution Kit |
| `report.wholesale_link` | Wholesale Portal 카드 | Launch & Execution Kit |
| `report.global_site_url` | Global Site 카드 | Launch & Execution Kit |
| `report.b2b_inquiry_url` | B2B Inquiry 카드 | Launch & Execution Kit |
| `report.sourcing_tip` | `hasSupplierFields` 조건 | Launch & Execution Kit |
| `report.verified_cost_usd` | Financial Briefing 가격 | Launch & Execution Kit |
| `report.verified_cost_note` | `undisclosed` 분기 (문구/가격 숨김) | Launch & Execution Kit |
| `report.verified_at` | "Verified by KoreaScout on …" | Launch & Execution Kit |
| `report.moq` | MOQ | Launch & Execution Kit |
| `report.lead_time` | Est. Production Lead Time | Launch & Execution Kit |
| `report.can_oem` | OEM / ODM Available | Launch & Execution Kit |
| `report.translated_name` | Supplier 헤더 일부 | Launch & Execution Kit |
| `report.viral_video_url` | Creative Assets 카드 | Launch & Execution Kit |
| `report.video_url` | Creative Assets 카드 | Launch & Execution Kit |
| `report.ai_detail_page_links` | `getAiDetailUrl` → AI Landing 카드 | Launch & Execution Kit |
| `report.marketing_assets_url` | Brand Asset Kit 카드 | Launch & Execution Kit |
| `report.ai_image_url` | AI Product Image 카드 | Launch & Execution Kit |
| `report.global_prices` | Global Market Proof 아코디언 데이터 | Launch & Execution Kit |
| `report.sample_policy` | Sample Policy | Launch & Execution Kit |
| `report.export_cert_note` | Compliance Note | Launch & Execution Kit |

### GroupBBrokerSection — `components/GroupBBrokerSection.tsx`

| DB Column | Where displayed in UI | Section in customer PDP |
|-----------|----------------------|-------------------------|
| `report.hs_code` | HS Code 표시 + 복사 | Export & Logistics Intel (HS Code & Broker Weapon) |
| `report.hs_description` | HS 설명 (이메일 패널 닫힘 시) | Export & Logistics Intel |

### PDP에 포함되나 위 7개 목록 밖 — `components/BrokerEmailDraft.tsx` (GroupBBrokerSection이 사용)

| DB Column | Where displayed in UI | Section in customer PDP |
|-----------|----------------------|-------------------------|
| `report.translated_name` / `report.product_name` | 이메일 제목/본문 | Export (Broker 모달) |
| `report.category` | 본문 | Export (Broker 모달) |
| `report.hs_code` / `report.hs_description` | 본문 | Export (Broker 모달) |
| `report.status_reason` | Classification Basis | Export (Broker 모달) |
| `report.composition_info` | Key Ingredients | Export (Broker 모달) |
| `report.key_risk_ingredient` | Risk Ingredients | Export (Broker 모달) |
| `report.hazmat_status` | 위험물 줄 (파싱) | Export (Broker 모달) |
| `report.required_certificates` | Required | Export (Broker 모달) |
| `report.dimensions_cm` / `report.actual_weight_g` | Specifications | Export (Broker 모달) |
| `report.image_url` / `report.naver_link` | Product Image / Reference Site | Export (Broker 모달) |

### 서버 페이지 — `app/weekly/[weekId]/[id]/page.tsx` (컴포넌트 외 `report` 사용)

| DB Column | Where used | Section / 비고 |
|-----------|------------|----------------|
| `report.is_teaser` | 무료 티저 배너 | 페이지 상단 |
| `report.hazmat_status` 등 | `hasLogistics` 계산 | SourcingIntel 조건부 렌더 |
| `report.*` (다수) | `hasSupplier` / `hasLogistics` 보조 | 섹션 노출 여부 |
| `report.id` | `ProductIdentity` `reportId` | Product Identity |

---

## STEP 2 — `sourcing_tip` 파싱 및 노출 위치

### 파싱 함수 위치

- **파일:** `components/report/utils.ts`
- **함수:** `parseSourcingStrategy(raw: string | null | undefined): StrategyStep[]` (L70–103)

### 정확한 로직

1. **헤더 탐지 정규식:** `/(?:^|\n)\s*\[([^\n]*?)\]/g`  
   - 줄 시작(또는 문자열 시작)에서 **대괄호만 있는 줄** `[ ... ]` 을 섹션 제목으로 본다. 언어 비종속 주석.
2. 매치가 **하나도 없으면:**
   - 문자열이 비어 있지 않으면 단일 스텝 `{ label: "Strategy Overview", content: 전체 trim }` 반환.
   - 빈 문자열이면 `[]`.
3. 매치가 있으면:
   - 각 매치 사이의 텍스트를 **해당 섹션 본문** `content`로 자른다.
   - `label`은 대괄호 안 문자열 `title` (trim).
   - 아이콘/색은 순서에 따라 `iconColorList`에서 순환 할당 (최대 정의는 5개 슬롯: 📈💰🏭📋📦).

**고정 레이블 "Marketing / Price / B2B / Customs / Logistics"는 DB에 없다.**  
제목은 전적으로 `[ ... ]` 안의 텍스트다.

### Social Proof — Step 1–3

- **컴포넌트:** `SocialProofTrendIntelligence.tsx` L25: `parseSourcingStrategy(report.sourcing_tip)`  
- **사용:** `const steps = allSteps.slice(0, 3)` (L25–26 근처 로직과 동일 패턴; 파일상 L25–26)  
- **UI:** "Scout Strategy Report" (L186–222). 각 블록은 **"Step 1" … "Step 3"** 라벨 (L207–208).  
- **플레이스홀더 제목 (데이터 없을 때):** L191–193 — `"Marketing Strategy"`, `"Price / Margin Strategy"`, `"B2B Sourcing Strategy"` (스텝 객체가 비었을 때만).

### Export & Logistics — Step 4–5

- **컴포넌트:** `SourcingIntel.tsx` L22–23: `parseSourcingStrategy(report.sourcing_tip)` 후 `logisticsSteps = allSteps.slice(3, 5)`  
- **UI:** "Compliance & Logistics Strategy" (L184–230). 번호는 **Step 4**, **Step 5** (L204: `Step {i + 4}`).

### 요약

| 구간 | slice | 고객 PDP 섹션 |
|------|--------|----------------|
| 스텝 1–3 | `[0:3]` | Social Proof — Scout Strategy Report |
| 스텝 4–5 | `[3:5]` | Export & Logistics — Compliance & Logistics Strategy |

스텝이 5개 미만이면 해당 슬롯은 "—" 또는 빈 스텝으로 렌더된다.

---

## STEP 3 — `app/admin/[id]/page.tsx` 필드 전부 (라벨 · 컬럼 · 타입 · 라인 · 접이 섹션)

접이 섹션 키: **s1** Product Identity, **s2** Trend Signal Dashboard, **s2b** Opportunity Status, **s3** Market Intelligence, **s4** Social Proof & Trend Intelligence, **s5** Export & Logistics Intel, **s6** Launch & Execution Kit, **s7** CEO Direct Input Zone.

추가: **헤더** (접이 아님), **수정 이력** (표시만).

| Label (정확히) | DB column | Field type | Lines | Section |
|----------------|-----------|------------|-------|---------|
| Status (sr-only) / 옵션 published·hidden | `status` (+ 연동 `published_at`) | select | 342–358 | Header |
| id (ID) (자동) | `id` | read-only div | 427–430 | s1 |
| Product Name (제품명) | `product_name` | text input | 433–437 | s1 |
| Naver Product Name (네이버 상품명) | `naver_product_name` | text input | 441–445 | s1 |
| Translated Name (번역명) | `translated_name` | text input | 449–453 | s1 |
| Category (카테고리) | `category` | text input | 457–461 | s1 |
| KR Price (₩) (한국가격) | `kr_price` | text input | 465–470 | s1 |
| USD Price (USD가격) (자동계산) | `kr_price_usd` | read-only | 474–477 | s1 |
| Est. Wholesale Cost (추정도매원가) (자동계산) | `estimated_cost_usd` | read-only | 480–483 | s1 |
| Export Status (수출상태) | `export_status` | select | 486–495 | s1 |
| Viability Summary (시장성요약) | `viability_reason` | textarea | 498–504 | s1 |
| Image URL (이미지URL) | `image_url` | text input | 507–512 | s1 |
| AI Image URL (AI이미지URL) | `ai_image_url` | text input | 515–521 | s1 |
| GO Verdict (GO판정) (자동) | `go_verdict` | read-only | 524–525 | s1 |
| Composite Score (종합점수) (자동) | `composite_score` | read-only | 528–529 | s1 |
| Naver Link (네이버링크) | `naver_link` | text input | 532–536 | s1 |
| Week ID (주차ID) | `week_id` | text input | 540–544 | s1 |
| Market Score (0–100) (시장성점수) | `market_viability` | number input | 564–577 | s2 |
| Competition Level (경쟁수준) | `competition_level` | select | 580–589 | s2 |
| WoW Growth (WoW성장률) | `wow_rate` | text input | 592–596 | s2 |
| MoM Growth (MoM성장률) | `mom_growth` | text input | 599–603 | s2 |
| Growth Evidence (성장근거) | `growth_evidence` | textarea | 608–614 | s2 |
| Growth Signal (성장시그널) | `growth_signal` | text input | 617–623 | s2 |
| GAP STATUS (갭 상태) | `gap_status` | select | 642–660 | s2b |
| GO VERDICT (최종 판정) | `go_verdict` | select | 663–686 | s2b |
| OPPORTUNITY REASONING (기회 근거) | `opportunity_reasoning` | textarea | 689–695 | s2b |
| Profit Multiplier (마진배수) | `profit_multiplier` | number input | 714–726 | s3 |
| Winning Feature (핵심강점) | `top_selling_point` | textarea | 729–735 | s3 |
| Pain Point (소비자페인포인트) | `common_pain_point` | textarea | 738–744 | s3 |
| New Content Volume (신규콘텐츠량) | `new_content_volume` | text input | 747–752 | s3 |
| Search Volume (검색볼륨) | `search_volume` | text input | 755–760 | s3 |
| Best Platform (최적플랫폼) | `best_platform` | text input | 764–769 | s3 |
| Global Prices (글로벌가격) | `global_prices` | `GlobalPricesHelper` (내부 text/number/url/checkbox) | 773–785 | s3 |
| Buzz Summary (버즈요약) | `buzz_summary` | textarea | 805–810 | s4 |
| KR Local Score (0–100) (국내로컬점수) | `kr_local_score` | number | 814–828 | s4 |
| Global Trend Score (0–100) (글로벌트렌드점수) | `global_trend_score` | number | 832–847 | s4 |
| Gap Index (갭지수) (자동) | `gap_index` | read-only | 851–854 | s4 |
| KR Evidence (국내근거) | `kr_evidence` | textarea | 857–862 | s4 |
| Global Evidence (글로벌근거) | `global_evidence` | textarea | 866–871 | s4 |
| KR Source Used (국내출처) | `kr_source_used` | text input | 875–879 | s4 |
| Gap Status (갭상태) | `gap_status` | text input | 883–887 | s4 |
| Opportunity Reasoning (기회논리) | `opportunity_reasoning` | textarea | 891–897 | s4 |
| Rising Keywords 1–5 | `rising_keywords` | text inputs ×5 | 900–914 | s4 |
| SEO Keywords 1–5 | `seo_keywords` | text inputs ×5 | 918–932 | s4 |
| Viral Hashtags 1–5 | `viral_hashtags` | text inputs ×5 | 936–950 | s4 |
| Platform Scores (JSON) | `platform_scores` | textarea | 954–978 | s4 |
| Sourcing Tip (소싱팁) | `sourcing_tip` | textarea | 981–988 | s4 |
| Trend Entry Strategy (진입전략) | `trend_entry_strategy` | textarea | 991–998 | s4 |
| HS Code (HS코드) | `hs_code` | text input | 1017–1021 | s5 |
| HS Description (HS설명) | `hs_description` | text input | 1025–1029 | s5 |
| Status Reason (상태사유) | `status_reason` | textarea | 1033–1038 | s5 |
| Composition Info (성분정보) | `composition_info` | textarea | 1041–1047 | s5 |
| Spec Summary (스펙요약) | `spec_summary` | textarea | 1051–1056 | s5 |
| Actual Weight (g) (실제중량) | `actual_weight_g` | number | 1060–1074 | s5 |
| Volumetric Weight (g) (부피중량) | `volumetric_weight_g` | number | 1077–1091 | s5 |
| Billable Weight (g) (과금중량) (자동) | `billable_weight_g` | read-only | 1094–1097 | s5 |
| Dimensions (cm) (치수) | `dimensions_cm` | text input | 1100–1104 | s5 |
| Hazmat Status (위험물여부) | `hazmat_status` | `HazmatCheckboxes` (4× checkbox JSON) | 1108–1119 | s5 |
| Required Certificates (필요인증) | `required_certificates` | text input | 1123–1128 | s5 |
| Shipping Notes (배송메모) | `shipping_notes` | textarea | 1132–1137 | s5 |
| Shipping Tier (배송티어) | `shipping_tier` | text input | 1140–1146 | s5 |
| Key Risk Ingredient (위험성분) | `key_risk_ingredient` | text input | 1149–1155 | s5 |
| Hazmat Summary (위험물요약) | `hazmat_summary` | textarea | 1159–1165 | s5 |
| Manufacturer Name (제조사명) | `m_name` | text input | 1187–1191 | s6 |
| Corporate Scale (기업 규모 e.g. SME) | `corporate_scale` | text input | 1195–1200 | s6 |
| Contact Email (문의 이메일) | `contact_email` | email | 1204–1209 | s6 |
| Contact Phone (문의 전화번호) | `contact_phone` | tel | 1213–1218 | s6 |
| Manufacturer Website (제조사 홈페이지) | `m_homepage` | url | 1222–1227 | s6 |
| Wholesale Portal (도매 문의 링크) | `wholesale_link` | url | 1231–1236 | s6 |
| Global Site URL (글로벌사이트URL) | `global_site_url` | url | 1240–1245 | s6 |
| B2B Inquiry URL (B2B문의URL) | `b2b_inquiry_url` | url | 1248–1254 | s6 |
| Can OEM (OEM가능여부) | `can_oem` | select | 1258–1270 | s6 |
| Verified Cost (USD) (검증된 원가) | `verified_cost_usd` | text | 1295–1300 | s7 |
| Verified Cost Note (검증원가메모) | `verified_cost_note` | text | 1303–1309 | s7 |
| Verified At (검증일시) | `verified_at` | date | 1313–1318 | s7 |
| MOQ (최소주문수량) | `moq` | text | 1322–1326 | s7 |
| Lead Time (리드타임) | `lead_time` | text | 1329–1334 | s7 |
| Sample Policy (샘플정책) | `sample_policy` | text | 1337–1342 | s7 |
| Export Cert Note (수출인증메모) | `export_cert_note` | text | 1345–1350 | s7 |
| Viral Video URL (바이럴영상URL) | `viral_video_url` | text | 1356–1360 | s7 |
| Video URL (영상URL) | `video_url` | text | 1363–1368 | s7 |
| Marketing Assets URL (마케팅자산URL) | `marketing_assets_url` | text | 1371–1375 | s7 |
| AI Detail Page Links | `ai_detail_page_links` | `AiPageLinksHelper` | 1381–1394 | s7 |

**직접 입력 없이 저장에만 관여:** `published_at` — 헤더 Status 변경 시 setState (L347–352), `formKeys`/PATCH L237–238.

**수정 이력:** `edit_history` — 테이블 표시만 (L1400–1449), 입력 위젯 없음.

---

## STEP 4 — 마스터 비교표 (`ScoutFinalReportsRow` 전 컬럼)

| DB Column | Used in PDP? | Where in PDP | In Admin? | Admin Section | Status |
|-----------|--------------|--------------|-----------|---------------|--------|
| `id` | ✅ | `reportId` / 페이지 | ✅ read-only | s1 | ✅ OK |
| `week_id` | ⚠️ | URL·라우팅 중심; 컴포넌트에서 `report.week_id` 표시는 없음 | ✅ | s1 | ⚠️ PDP 본문 미표시 |
| `product_name` | ✅ | ProductIdentity, Broker draft | ✅ | s1 | ✅ OK |
| `naver_product_name` | ❌ | 지정 PDP 컴포넌트 JSX에 없음 | ✅ | s1 | ⚠️ ADMIN ONLY (PDP 미노출) |
| `translated_name` | ✅ | ProductIdentity, SupplierContact, Broker | ✅ | s1 | ✅ OK |
| `image_url` | ✅ | ProductIdentity, Broker | ✅ | s1 | ✅ OK |
| `ai_image_url` | ✅ | SupplierContact | ✅ | s1 | ✅ OK |
| `summary` | ❌ | — | ❌ | — | ⚪ PDP·Admin 미사용 |
| `consumer_insight` | ❌ | — | ❌ | — | ⚪ PDP·Admin 미사용 |
| `composition_info` | ✅ | SourcingIntel, Broker | ✅ | s5 | ✅ OK |
| `spec_summary` | ✅ | SourcingIntel | ✅ | s5 | ✅ OK |
| `category` | ✅ | ProductIdentity, Broker | ✅ | s1 | ✅ OK |
| `viability_reason` | ✅ | ProductIdentity | ✅ | s1 | ✅ OK |
| `market_viability` | ✅ | TrendSignalDashboard | ✅ | s2 | ✅ OK |
| `competition_level` | ✅ | TrendSignalDashboard | ✅ | s2 | ✅ OK |
| `profit_multiplier` | ✅ | MarketIntelligence | ✅ | s3 | ✅ OK |
| `search_volume` | ✅ | MarketIntelligence | ✅ | s3 | ✅ OK |
| `mom_growth` | ✅ | MarketIntelligence | ✅ | s2 | ⚠️ MISPLACED (Admin은 Trend; PDP는 Market) |
| `gap_status` | ✅ | Trend + Social | ✅ | s2b + s4 text + s2b select | ⚠️ DUPLICATE / 경로 3곳 |
| `global_price` | ✅ | MarketIntelligence 폴백 | ❌ | — | 🔴 MISSING FROM ADMIN (레거시 보조) |
| `seo_keywords` | ✅ | SocialProof | ✅ | s4 | ✅ OK |
| `export_status` | ✅ | SourcingIntel | ✅ | s1 | ⚠️ MISPLACED vs PDP Export 섹션 |
| `hs_code` | ✅ | GroupBBroker, Broker | ✅ | s5 | ✅ OK |
| `sourcing_tip` | ✅ | Social (1–3) + Export (4–5) | ✅ | s4 단일 textarea | ⚠️ SPLIT DISPLAY (편집은 한 덩어리) |
| `manufacturer_check` | ❌ | — | ❌ | — | ⚪ 미사용 |
| `m_name` | ✅ | SupplierContact | ✅ | s6 | ✅ OK |
| `corporate_scale` | ✅ | SupplierContact | ✅ | s6 | ✅ OK |
| `contact_email` | ✅ | SupplierContact | ✅ | s6 | ✅ OK |
| `contact_phone` | ✅ | SupplierContact | ✅ | s6 | ✅ OK |
| `m_homepage` | ✅ | SupplierContact | ✅ | s6 | ✅ OK |
| `naver_link` | ✅ | SupplierContact 조건 | ✅ | s1 | ⚠️ MISPLACED (Launch에서 쓰임) |
| `wholesale_link` | ✅ | SupplierContact | ✅ | s6 | ✅ OK |
| `global_site_url` | ✅ | SupplierContact | ✅ | s6 | ✅ OK |
| `b2b_inquiry_url` | ✅ | SupplierContact | ✅ | s6 | ✅ OK |
| `video_url` | ✅ | SupplierContact | ✅ | s7 | ✅ OK |
| `competitor_analysis_pdf` | ❌ | — | ❌ | — | ⚪ 미사용 |
| `viral_video_url` | ✅ | SupplierContact | ✅ | s7 | ✅ OK |
| `published_at` | ❌ | PDP UI에 `report`로 표시 안 함 | ⚠️ | Header 간접 | ⚠️ 직접 필드 없음 |
| `free_list_at` | ❌ | RLS/비즈니스 로직 (표시 없음) | ❌ | — | ⚪ |
| `is_premium` | ❌ | — | ❌ | — | ⚪ |
| `is_teaser` | ✅ | page | ❌ | — | ⚠️ PDP만 (어드민 플래그 없음) |
| `status` | ❌ | 쿼리로만 published | ✅ | Header | ✅ OK (어드민 전용) |
| `created_at` | ❌ | — | ❌ | — | ⚪ |
| `kr_price` | ✅ | ProductIdentity | ✅ | s1 | ✅ OK |
| `kr_price_usd` | ⚠️ | PDP는 API 환율로 계산 표시; DB 컬럼 직접 표시 아님 | read-only | s1 | ✅ OK |
| `estimated_cost_usd` | ✅ | ProductIdentity, MarketIntel | read-only | s1 | ✅ OK |
| `verified_cost_usd` | ✅ | SupplierContact | ✅ | s7 | ✅ OK |
| `verified_cost_note` | ✅ | SupplierContact 로직 | ✅ | s7 | ✅ OK |
| `moq` | ✅ | SupplierContact | ✅ | s7 | ✅ OK |
| `lead_time` | ✅ | SupplierContact | ✅ | s7 | ✅ OK |
| `global_prices` | ✅ | MarketIntel + SupplierContact | ✅ | s3 | ⚠️ MISPLACED vs 요구사항 "맨 아래" |
| `platform_scores` | ✅ | TrendSignalDashboard | ✅ | s4 | ⚠️ MISPLACED (PDP는 Trend) |
| `wow_rate` | ✅ | MarketIntelligence | ✅ | s2 | ⚠️ MISPLACED |
| `best_platform` | ✅ | MarketIntelligence | ✅ | s3 | ✅ OK |
| `top_selling_point` | ✅ | MarketIntelligence | ✅ | s3 | ✅ OK |
| `common_pain_point` | ✅ | MarketIntelligence | ✅ | s3 | ✅ OK |
| `viral_hashtags` | ✅ | SocialProof | ✅ | s4 | ✅ OK |
| `buzz_summary` | ✅ | SocialProof | ✅ | s4 | ✅ OK |
| `rising_keywords` | ✅ | SocialProof | ✅ | s4 | ✅ OK |
| `kr_local_score` | ✅ | SocialProof | ✅ | s4 | ✅ OK |
| `global_trend_score` | ✅ | SocialProof | ✅ | s4 | ✅ OK |
| `gap_index` | ✅ | SocialProof | read-only | s4 | ✅ OK |
| `opportunity_reasoning` | ✅ | SocialProof | ✅ | s2b+s4 | ⚠️ DUPLICATE |
| `trend_entry_strategy` | ✅ | SocialProof | ✅ | s4 | ✅ OK |
| `new_content_volume` | ✅ | TrendSignalDashboard | ✅ | s3 | ⚠️ MISPLACED |
| `kr_evidence` | ✅ | SocialProof | ✅ | s4 | ✅ OK |
| `global_evidence` | ✅ | SocialProof | ✅ | s4 | ✅ OK |
| `growth_evidence` | ✅ | TrendSignalDashboard | ✅ | s2 | ✅ OK |
| `kr_source_used` | ✅ | SocialProof | ✅ | s4 | ✅ OK |
| `growth_signal` | ✅ | TrendSignalDashboard | ✅ | s2 | ✅ OK |
| `hs_description` | ✅ | GroupBBroker | ✅ | s5 | ✅ OK |
| `hazmat_status` | ✅ | SourcingIntel, Broker | ✅ | s5 | ✅ OK |
| `dimensions_cm` | ✅ | SourcingIntel, Broker | ✅ | s5 | ✅ OK |
| `billable_weight_g` | ✅ | SourcingIntel | read-only | s5 | ✅ OK |
| `shipping_tier` | ✅ | SourcingIntel | ✅ | s5 | ✅ OK |
| `required_certificates` | ✅ | SourcingIntel, Broker | ✅ | s5 | ✅ OK |
| `shipping_notes` | ✅ | SourcingIntel | ✅ | s5 | ✅ OK |
| `sourcing_tip_logistics` | ❌ | 코드베이스 TSX에서 미참조 (타입만) | ❌ | — | ⚪ 데드 컬럼 후보 |
| `hazmat_summary` | ✅ | SourcingIntel | ✅ | s5 | ✅ OK |
| `can_oem` | ✅ | SupplierContact | ✅ | s6 | ✅ OK |
| `key_risk_ingredient` | ✅ | Broker draft | ✅ | s5 | ✅ OK |
| `status_reason` | ✅ | SourcingIntel, Broker | ✅ | s5 | ✅ OK |
| `actual_weight_g` | ✅ | SourcingIntel, Broker | ✅ | s5 | ✅ OK |
| `volumetric_weight_g` | ✅ | SourcingIntel | ✅ | s5 | ✅ OK |
| `marketing_assets_url` | ✅ | SupplierContact | ✅ | s7 | ✅ OK |
| `ai_detail_page_links` | ✅ | SupplierContact | ✅ | s7 | ✅ OK |
| `verified_at` | ✅ | SupplierContact | ✅ | s7 | ✅ OK |
| `sample_policy` | ✅ | SupplierContact | ✅ | s7 | ✅ OK |
| `export_cert_note` | ✅ | SupplierContact | ✅ | s7 | ✅ OK |
| `edit_history` | ❌ | PDP | ❌ | 표시만 (저장 시 갱신) | ✅ OK |
| `composite_score` | ✅ | ProductIdentity | read-only | s1 | ✅ OK |
| `go_verdict` | ✅ | ProductIdentity | read-only s1 + select s2b | ⚠️ DUPLICATE |

---

## STEP 5 — `sourcing_tip` 리디자인 제안

**현재:** 단일 TEXT 컬럼 + `[제목]` 헤더 파싱으로 5개 논리 스텝. Social은 1–3, Export는 4–5.

**옵션 A — DB 분리 (`sourcing_tip_social` + `sourcing_tip_logistics` 등)**  
- 장점: 마이그레이션 후 Admin에서 섹션별 독립 편집, 파싱 깨짐 위험 감소.  
- 단점: 기존 파이프라인/Make.com 한 필드 출력 수정, 백필, PDP `parseSourcingStrategy`를 두 필드 concat 또는 병렬 렌더로 변경 필요.

**옵션 B — 단일 컬럼 유지 + Admin UI만 분리**  
- 장점: 스키마 변경 없음; PDP 파서 그대로.  
- 단점: 저장 시 두 편집기를 올바른 순서로 `[Header]\n` 형식으로 **조합**해야 함 (구현 시 검증 규칙 필요).

**옵션 C — `sourcing_tip_logistics` 활성화**  
- 타입에 이미 `sourcing_tip_logistics`가 있으나 **어디에서도 읽지 않음**. 여기에 Step 4–5만 넣고 PDP에서 `parseSourcingStrategy(sourcing_tip + sourcing_tip_logistics)` 식으로 합치면 분리 효과를 DB로 얻을 수 있음 (마이그레이션·백필 필요).

**권장 (가장 깔끔한 절충):**  
- **단기:** 옵션 B — 한 컬럼 유지, Admin에서 **Step 1–3용** / **Step 4–5용** 서브폼 + 저장 시 단일 문자열로 직렬화 (템플릿은 기존 `[Title]` 규칙 준수).  
- **중기:** 트래픽·에디터 요구가 커지면 옵션 A 또는 C로 스키마 분리.

---

## STEP 6 — 제안 Admin 최종 레이아웃 (PDP 읽기 순서 + 특수 요구사항 반영)

요구사항 반영:  
- Opportunity Status 필드 → **Trend Signals**에 통합  
- **sourcing_tip** Step 1–3 → **Social Proof 바로 다음**  
- Step 4–5 → **Export & Logistics 바로 다음**  
- **global_prices** → **전체 폼 맨 마지막** 섹션  
- **CEO Direct Input Zone + Launch & Execution Kit** → **단일 "Launch Kit"**

### 1. Product Identity

| 순서 | Label | DB column | Input | Move note |
|------|-------|-----------|-------|-----------|
| 1 | id | `id` | read-only | — |
| 2 | Week ID | `week_id` | text | — |
| 3 | Product Name | `product_name` | text | — |
| 4 | Naver Product Name | `naver_product_name` | text | — |
| 5 | Translated Name | `translated_name` | text | — |
| 6 | Category | `category` | text | — |
| 7 | Image URL | `image_url` | url/text | — |
| 8 | KR Price | `kr_price` | text | — |
| 9 | USD / Est. wholesale (자동) | `kr_price_usd`, `estimated_cost_usd` | read-only | — |
| 10 | Viability Summary | `viability_reason` | textarea | — |
| 11 | Naver Link | `naver_link` | text | **MOVE** Launch에서 Identity로 이미 있음—PDP는 Launch 조건에 사용, 유지하되 Launch와 중복 표시 방지는 UX 선택 |
| 12 | AI Image URL | `ai_image_url` | text | — |
| 13 | GO Verdict | `go_verdict` | **단일** select 또는 read-only | **MERGE** s2b 중복 제거 |
| 14 | Composite Score | `composite_score` | read-only | — |

*(선택) `export_status`는 PDP Export와 맞추려면 **섹션 5로 이동**.*

### 2. Trend Signals (Opportunity Status 통합)

| 순서 | Label | DB column | Input | Move note |
|------|-------|-----------|-------|-----------|
| 1 | Market Score | `market_viability` | number | — |
| 2 | Competition Level | `competition_level` | select | — |
| 3 | GAP STATUS (Opportunity Status 카드) | `gap_status` | select | **MERGE** 기존 s2b; s4의 `gap_status` **text** 필드는 삭제·단일화 |
| 4 | GO VERDICT | `go_verdict` | select | **MERGE** s2b; s1 읽기전용과 충돌 해소(한곳만 편집) |
| 5 | Platform Scores (JSON) | `platform_scores` | textarea/json | **MOVE** 현 s4 → PDP Trend와 동일 |
| 6 | Growth Signal | `growth_signal` | text | — |
| 7 | Growth Evidence | `growth_evidence` | textarea | — |
| 8 | New Content Volume | `new_content_volume` | text | **MOVE** 현 s3 → PDP Trend Growth Momentum과 동일 |

**PDP와 정렬:** `wow_rate`, `mom_growth`는 고객 **Market Intelligence**에만 나오므로 아래 **섹션 3**으로 두는 것이 맞다 (현 Admin s2에 있음 → **이동**).

### 3. Market Intelligence *(global_prices 제외)*

| 순서 | Label | DB column | Input | Move note |
|------|-------|-----------|-------|-----------|
| 1 | Profit Multiplier | `profit_multiplier` | number | — |
| 2 | Winning Feature | `top_selling_point` | textarea | — |
| 3 | Pain Point | `common_pain_point` | textarea | — |
| 4 | Search Volume | `search_volume` | text | — |
| 5 | MoM Growth | `mom_growth` | text | **MOVE** s2→here |
| 6 | WoW Growth | `wow_rate` | text | **MOVE** s2→here |
| 7 | Best Platform | `best_platform` | text | — |
| 8 | *(NEW read-only)* Legacy Global Price | `global_price` | optional | **NEW** Admin 노출—레거시 보정용 |

### 4. Social Proof & Trend Intelligence

| 순서 | Label | DB column | Input | Move note |
|------|-------|-----------|-------|-----------|
| 1 | Buzz Summary | `buzz_summary` | textarea | — |
| 2–3 | KR / Global scores + evidence | `kr_local_score`, `global_trend_score`, `kr_evidence`, `global_evidence`, `kr_source_used` | mixed | — |
| 4 | Gap Index | `gap_index` | read-only | — |
| 5 | Opportunity Reasoning | `opportunity_reasoning` | textarea | **MERGE** s2b에서만 편집하도록 단일화 |
| 6 | Trend Entry Strategy | `trend_entry_strategy` | textarea | — |
| 7 | Keywords ×3 | `rising_keywords`, `seo_keywords`, `viral_hashtags` | 5×3 | — |
| 8 | **Scout Strategy — Steps 1–3** | `sourcing_tip` (파생) | **3개 서브 textarea** 또는 템플릿 | **NEW UI** — 동일 컬럼, 편집기만 분할 |

### 5. Export & Logistics Intel

| 순서 | Label | DB column | Input | Move note |
|------|-------|-----------|-------|-----------|
| 1 | Export Status | `export_status` | select | **MOVE** s1→here (PDP 일치) |
| 2–… | HS, 물류, 하자드 등 | `hs_code` … `hazmat_summary` | 기존 s5와 동일 | — |
| 마지막 하위 블록 | **Compliance Strategy — Steps 4–5** | `sourcing_tip` (파생) | **2개 서브 textarea** | **NEW UI** |

### 6. Launch Kit (CEO 병합)

s6 + s7 필드를 한 섹션으로: **Financial** → **Supplier** → **Creative** 순 (PDP `SupplierContact` 순서에 맞춤).

| Label | DB column | Input |
|-------|-----------|-------|
| Verified Cost / Note / At | `verified_cost_usd`, `verified_cost_note`, `verified_at` | text / text / date |
| MOQ, Lead Time, Can OEM | `moq`, `lead_time`, `can_oem` | text / text / select |
| Sample Policy, Export Cert Note | `sample_policy`, `export_cert_note` | text |
| Manufacturer block | `m_name`, `corporate_scale`, `contact_email`, `contact_phone`, `m_homepage`, `wholesale_link`, `global_site_url`, `b2b_inquiry_url` | mixed |
| Media | `viral_video_url`, `video_url`, `marketing_assets_url` | text |
| AI Detail Links | `ai_detail_page_links` | helper |

### 7. Global Market Prices *(맨 마지막 — 필수)*

| Label | DB column | Input |
|-------|-----------|-------|
| Global Prices | `global_prices` | `GlobalPricesHelper` |

### 8. (선택) Publishing / 메타

| Label | DB column | Input | Note |
|-------|-----------|-------|------|
| Status | `status` | header select | — |
| Published at | `published_at` | 자동 | — |
| Teaser / Free list (운영) | `is_teaser`, `free_list_at` | **NEW** | 현재 Admin 없음 |

---

*본 문서는 Admin 리디자인의 단일 근거 문서로 사용 가능하다.*
