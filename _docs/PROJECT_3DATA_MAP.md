# K-Product Scout — 상세 페이지 데이터 매핑 (v1.3)

> **대상:** 상품 상세 페이지 대공사 — 9개 섹션 ↔ DB 필드 매핑  
> **기준:** 01_CORE_SPEC.md v1.2 + v1.3 신규 컬럼(28개)  
> **용도:** 각 섹션별 컴포넌트 코딩 시 참조

---

## 1. Tier별 접근 제어 (RLS / Frontend)

| Tier | 노출 섹션 | 비고 |
|------|-----------|------|
| **Free** | Section 1–2만 | 14일 딜레이 적용(free_list_at). is_premium=false 또는 is_teaser인 행만 RLS로 노출. |
| **Standard** | Section 1–5 | Section 5(Sourcing Intel) 내 **URL/원본 링크는 잠금**. 데이터(텍스트)만 노출. |
| **Alpha** | Section 1–8 + 원본 링크 전부 | 모든 데이터 및 링크(m_homepage, naver_link, video_url 등) 공개. |
| **공통** | Section 9 Navigation | Tier별 CTA 동적. |

- **is_teaser = TRUE** 인 리포트: Free도 Alpha와 동일하게 전체 섹션·링크 노출.

---

## 2. 9개 섹션 ↔ DB 필드 매핑

### Section 1 — Product Identity

| DB 필드 | 타입 | 비고 |
|---------|------|------|
| product_name | TEXT | 한국어 상품명 |
| translated_name | TEXT | 영어 상품명 |
| image_url | TEXT | 메인 이미지 |
| category | TEXT | 카테고리 |
| viability_reason | TEXT | 트렌드 이유 한 줄 |

**Tier:** Free(14d) / Standard / Alpha

---

### Section 2 — Market Basic

| DB 필드 | 타입 | 비고 |
|---------|------|------|
| market_viability | INTEGER | 0–100 |
| competition_level | TEXT | Low/Medium/High |
| gap_status | TEXT | Blue Ocean / Emerging / Saturated |
| export_status | TEXT | Green/Yellow/Red |

**v1.3 신규(예정):** platform_scores (JSONB) 등 — 섹션 2 확장 시 매핑.

**Tier:** Free(14d) / Standard / Alpha

---

### Section 3 — Market Premium

| DB 필드 | 타입 | 비고 |
|---------|------|------|
| profit_multiplier | NUMERIC | 수익률 |
| search_volume | TEXT | 검색량 |
| mom_growth | TEXT | 성장률 |
| global_price | JSONB | 국가별 가격 |

**v1.3 신규(예정):** kr_price (TEXT/NUMERIC), global_prices (JSONB) — 기존 global_price와 통합/대체 여부는 마이그레이션 확정 후 반영.

**Tier:** 🔒 Free / ✅ Standard / ✅ Alpha

---

### Section 4 — Consumer & SEO

| DB 필드 | 타입 | 비고 |
|---------|------|------|
| summary | TEXT | 짧은 요약 |
| consumer_insight | TEXT | 상세 인사이트 |
| ai_image_url | TEXT | AI 이미지 |
| seo_keywords | TEXT[] | 키워드 배열 |

**Tier:** 🔒 Free / ✅ Standard / ✅ Alpha

---

### Section 5 — Sourcing Intel

| DB 필드 | 타입 | 비고 |
|---------|------|------|
| hs_code | TEXT | 관세 코드 |
| sourcing_tip | TEXT | 소싱팁 |
| manufacturer_check | TEXT | MOQ/리드타임 |
| m_name | TEXT | 제조사명 |
| contact_email | TEXT | 이메일 |
| contact_phone | TEXT | 전화번호 |
| m_homepage | TEXT | 제조사 웹사이트 **(Standard: 링크 잠금)** |
| naver_link | TEXT | 네이버 링크 **(Standard: 링크 잠금)** |

**Tier:** 🔒 Free / ✅ Standard(데이터만, URL 잠금) / ✅ Alpha(전체)

---

### Section 6 — Media Vault

| DB 필드 | 타입 | 비고 |
|---------|------|------|
| video_url | TEXT | 4K 영상 |
| viral_video_url | TEXT | 바이럴 숏폼 (v1.2) |
| competitor_analysis_pdf | TEXT | 경쟁사 분석 PDF (기존 마이그레이션 기준; 스펙 v1.2는 viral_video_url 강조) |

**Tier:** 🔒 Free / 🔒 Standard / ✅ Alpha

---

### Section 7 — (Trend / Platform Intel) — v1.3 확장

**v1.3 신규 필드 예시(매핑 확정 시 반영):** platform_scores, 트렌드 점수, 소셜/플랫폼 지표 등.

**Tier:** 설계 확정 후 Tier 규칙 적용.

---

### Section 8 — (Additional Data) — v1.3 확장

**v1.3 신규 필드:** 28개 신규 컬럼 중 Section 1–6에 미배치된 나머지 (예: 부가 메타데이터, 출처 URL 등).

**Tier:** Alpha 전용 또는 설계 확정 후.

---

### Section 9 — Navigation

| 용도 | 비고 |
|------|------|
| 이전/다음 상품, Weekly 목록 복귀 | DB 필드 없음. week_id + 현재 id 기반 라우팅. |
| Tier별 CTA | Free → Standard $9, Standard → Alpha $29, Alpha → 유지. |

**Tier:** 모든 Tier

---

## 3. v1.3 신규 컬럼 (28개) — 인식 및 타입 가이드

스펙상 `scout_final_reports` 에 추가된 28개 신규 컬럼을 인식하고, `types/database.ts` 및 마이그레이션과 동기화할 것.

- **이미 명시된 예시:** kr_price, global_prices, platform_scores  
- **타입 주의:**  
  - **JSONB** → TypeScript `Json` (또는 구체적 객체 타입)  
  - **TEXT[]** → `string[] | null`  
- **나머지 컬럼:** 마이그레이션 SQL 또는 CTO 제공 목록 확정 후 본 문서와 `types/database.ts` 에 일괄 반영.

---

## 4. RLS / Frontend 로직 요약

- **RLS:** 기존 `report_access` 정책 유지. 행 단위 접근만 제어(Free 14일+is_premium, Teaser 전체, Paid 즉시 전체).  
- **Frontend:**  
  - Section 1–2: Free(14d 적용된 행만) / Standard / Alpha  
  - Section 3–4: Standard / Alpha (또는 is_teaser)  
  - Section 5: Standard(텍스트만, URL 숨김) / Alpha(전체) (또는 is_teaser)  
  - Section 6–8: Alpha (또는 is_teaser)  
  - Section 9: 공통, CTA만 Tier별 분기  

이 문서는 `01_CORE_SPEC.md` 및 실제 마이그레이션과 함께 사용하며, v1.3 마이그레이션 확정 시 필드 목록을 최종 갱신한다.

---

## 5. 구현 전략 (상세 페이지 대공사 전 보고)

### 5-1. 전제

- **01_CORE_SPEC.md:** v1.2 기준. DB 변경 규칙(ADD 자유, ALTER/DROP CEO 컨펌), Tier 매트릭스, RLS, 상세 페이지 섹션(1–7 + Paywall 문구) 확정.
- **PROJECT_3DATA_MAP.md:** 9개 섹션(Product Identity ~ Media Vault, + Navigation) 및 Tier별 노출·URL 잠금 규칙, v1.3 신규 컬럼(28개) 인식·매핑 준비.

### 5-2. DB / 타입

- **마이그레이션:** v1.3 신규 28개 컬럼은 **ADD** 로만 추가. 기존 컬럼명·타입 변경 없음. Make.com 연동 유지.
- **types/database.ts:**  
  - `seo_keywords` → `string[] | null` (TEXT[] 반영).  
  - `viral_video_url` 추가 (v1.2).  
  - v1.3 선반영: `kr_price`, `global_prices`, `platform_scores` (optional). 나머지 25개는 마이그레이션 확정 후 일괄 추가.
- **RLS:** 변경 없음. 행 단위 접근만 제어. 필드/섹션 단위 제어는 전부 프론트엔드.

### 5-3. Tier별 접근 (Frontend)

- **Free:** Section 1–2만 렌더. 14일 딜레이는 이미 RLS로 행이 안 내려오므로, 내려온 행만 1–2 노출.
- **Standard:** Section 1–5 렌더. Section 5에서 `m_homepage`, `naver_link`, `contact_email`(링크), `contact_phone`(클릭 가능) 등 **URL/원본 링크는 마스킹 또는 잠금 UI**(LockedSection 스타일). 텍스트(제조사명, MOQ 등)만 표시.
- **Alpha:** Section 1–8 + 모든 링크 공개. `is_teaser` 이면 Free도 동일 적용.
- **Section 9 Navigation:** 공통. 이전/다음 상품, Weekly 복귀, Tier별 CTA(Free→Standard, Standard→Alpha).

### 5-4. 섹션별 컴포넌트 코딩 순서 제안

1. **Section 1–2 (Product Identity, Market Basic):** 기존 컴포넌트 유지 또는 경미 리팩터. v1.3 필드(platform_scores 등) 추가 시 해당 블록만 확장.
2. **Section 3–4 (Market Premium, Consumer & SEO):** 기존 유지. `global_price` / `global_prices`, `seo_keywords`(배열) 이미 반영.
3. **Section 5 (Sourcing Intel):** Standard일 때 링크만 잠금하는 **하위 컴포넌트** 도입 (예: `SourcingLinkLock` 또는 props로 `hideLinks: boolean`). Alpha / is_teaser일 때는 기존처럼 전부 링크 노출.
4. **Section 6 (Media Vault):** `video_url`, `viral_video_url`, `competitor_analysis_pdf` 매핑. Alpha(또는 is_teaser)만 노출.
5. **Section 7–8:** v1.3 마이그레이션 확정 후 필드 목록 받아 신규 컴포넌트 추가. Tier는 Alpha(또는 is_teaser) 전용으로 시작 후 필요 시 조정.
6. **Section 9 (Navigation):** 공통. Tier별 CTA는 기존 LockedSection/링크 재사용.

### 5-5. 에러 대응 후 진행

- **타입 에러:** `seo_keywords` string[] 전환으로 인한 참조처는 이미 상세 페이지에서 배열 처리로 수정됨. 다른 구간에서 `seo_keywords`를 문자열로 쓰는 부분이 있으면 `Array.isArray` 분기 또는 `join()`으로 통일.
- **DB 미반영 컬럼:** `viral_video_url`, `kr_price`, `global_prices`, `platform_scores` 등은 마이그레이션 전까지 선택 필드(optional)이므로, 쿼리에서 select 목록에 넣지 않으면 에러 없음. 마이그레이션 적용 후 select 확장.

이 전략대로 **에러 해결 후** 섹션별로 실제 컴포넌트 코딩을 진행하면 된다.
