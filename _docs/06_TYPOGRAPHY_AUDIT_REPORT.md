# Typography Audit Report
Generated: 2025-03-02

---

## Section 1. 섹션별 현황 매핑

| 섹션 | 레이어 | 텍스트 내용 (예시) | 현재 클래스 | font-mono 여부 |
|------|--------|-------------------|-------------|----------------|
| Section 1 | 대제목 | Product Identity | `font-[family-name:var(--font-syne)] text-lg font-bold text-[#1A1916]` | no |
| Section 1 | 대제목 | 상품명 | `text-3xl font-bold text-[#1A1916] leading-tight` | no |
| Section 1 | 핵심 데이터 | 가격 (₩, $) | `text-xl font-mono font-semibold text-[#1A1916]`, `text-base font-mono text-[#6B6860]` | yes |
| Section 1 | 핵심 데이터 | Est. Wholesale (~$x) | `text-lg font-mono font-semibold text-[#16A34A]` | yes |
| Section 1 | 보조 라벨 | "EST. WHOLESALE" | `text-xs font-medium text-[#9E9C98] uppercase tracking-widest` | no |
| Section 1 | 보조 라벨 | "Why It's Trending" | `text-xs font-semibold text-[#16A34A] uppercase tracking-widest mb-1` | no |
| Section 1 | 본문 | viability_reason | `text-sm text-[#3D3B36] leading-relaxed` | no |
| Section 2 | 대제목 | "Trend Signal Dashboard" | `font-[family-name:var(--font-syne)] text-lg font-bold text-[#1A1916] mb-4` | no |
| Section 2 | 핵심 데이터 | Market Score 숫자 (DonutGauge 내부) | `font-mono text-2xl font-bold tabular-nums text-[#1A1916]` | yes |
| Section 2 | 핵심 데이터 | Market Score 숫자 (아래 중복) | `text-2xl font-bold font-mono text-[#1A1916]` | yes |
| Section 2 | 핵심 데이터 | Competition Level 값 (Low/Medium/High) | Badge: `text-xs font-medium` + variant | no |
| Section 2 | 핵심 데이터 | Opportunity Status 값 | Badge: `text-xs font-medium` + variant | no |
| Section 2 | 보조 라벨 | "MARKET SCORE" | `text-xs uppercase tracking-widest text-[#6B6860] font-semibold` | no |
| Section 2 | 보조 라벨 | "COMPETITION LEVEL" | `text-xs uppercase tracking-widest text-[#6B6860] font-semibold` | no |
| Section 2 | 보조 라벨 | "OPPORTUNITY STATUS" | `text-xs uppercase tracking-widest text-[#6B6860] font-semibold` | no |
| Section 3 | 대제목 | "Market Intelligence" | `text-xl font-semibold text-[#1A1916] mb-4` | no |
| Section 3 | 핵심 데이터 | Profit Multiplier (2.8x) | `text-3xl font-mono font-bold text-[#16A34A] tabular-nums` | yes |
| Section 3 | 핵심 데이터 | Blue Ocean 표시 | Badge variant="info" | no |
| Section 3 | 핵심 데이터 | 글로벌 가격 수치 (KR Retail, USD, Est. Wholesale) | `text-lg font-mono font-semibold text-[#1A1916]` 등 | yes |
| Section 3 | 핵심 데이터 | Search Volume / MoM / WoW 값 | `text-lg font-semibold text-[#1A1916] mt-1` (또는 color variant) | no |
| Section 3 | 보조 라벨 | "PROFIT POTENTIAL" | `text-xs font-medium text-[#9E9C98] uppercase tracking-widest mb-3` | no |
| Section 3 | 보조 라벨 | "GLOBAL RETAIL EVIDENCE" | `text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2` | no |
| Section 3 | 보조 라벨 | "SEARCH & GROWTH" | `text-xs uppercase tracking-widest text-[#9E9C98] font-semibold` | no |
| Section 4 | 핵심 데이터 | Gap Index 숫자 | `text-3xl font-mono font-bold text-[#16A34A]` | yes |
| Section 4 | 핵심 데이터 | KR Local / Global 점수 | `text-2xl font-mono font-bold text-[#16A34A]`, `text-2xl font-mono font-bold text-[#2563EB]` | yes |
| Section 4 | 핵심 데이터 | Platform 수치들 (TikTok 등) | `text-lg font-bold text-[#1A1916]` | no |
| Section 4 | 보조 라벨 | "Gap Index" | `text-xs text-[#9E9C98] mb-1` | no |
| Section 4 | 보조 라벨 | "PLATFORM BREAKDOWN" | `text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-3` | no |
| Section 5 | 핵심 데이터 | HS Code 숫자 | `text-4xl font-mono font-bold text-[#1A1916] tracking-tight` | yes |
| Section 5 | 핵심 데이터 | 중량/운임 수치 (Actual/Volumetric/Billable) | `text-2xl font-mono font-semibold text-[#1A1916]` 등 | yes |
| Section 5 | 핵심 데이터 | Export Readiness 상태값 | `text-sm font-semibold` + color | no |
| Section 5 | 보조 라벨 | "EXPORT READINESS", "HS CODE & CLASSIFICATION" 등 | `text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2` | no |
| Section 6 | 핵심 데이터 | 도매가 ($) | `text-5xl font-mono font-bold text-[#16A34A]` | yes |
| Section 6 | 핵심 데이터 | MOQ 수치 | `text-2xl font-semibold text-[#1A1916]` | no |
| Section 6 | 핵심 데이터 | Lead Time 수치 | `text-2xl font-semibold text-[#1A1916]` | no |
| Section 6 | 보조 라벨 | "COST PER UNIT", "MOQ", "LEAD TIME" | `text-xs uppercase tracking-widest text-[#9E9C98]` 또는 `text-xs text-[#9E9C98]` | no |

---

## Section 2-A. 현미경 사이즈 위반

### 금지 사이즈 스캔 (text-[10px], text-[11px], text-[9px], text-[8px])
**결과: 0건** — 프로젝트 전체에서 위 클래스 미사용.

### text-xs 사용처 분류 (데이터 영역 vs 라벨/뱃지)

| 파일 | 라인 | 클래스 | 주변 텍스트/컨텍스트 | 데이터 영역? | 위반 여부 |
|------|------|--------|---------------------|-------------|----------|
| app/weekly/[weekId]/[id]/page.tsx | 227 | text-xs | "Category:" | NO (라벨) | ✅ 허용 |
| app/weekly/[weekId]/[id]/page.tsx | 232 | text-xs | "Export Status:" | NO (라벨) | ✅ 허용 |
| app/weekly/[weekId]/[id]/page.tsx | 254 | text-xs | "Est. Wholesale" | NO (라벨) | ✅ 허용 |
| app/weekly/[weekId]/[id]/page.tsx | 307,315,322 | text-xs | "Market Score", "Competition Level", "Opportunity Status" | NO (라벨) | ✅ 허용 |
| app/weekly/[weekId]/[id]/page.tsx | 310,317,324 | text-xs | 카드 설명 본문 | NO (보조 설명) | ✅ 허용 |
| app/weekly/[weekId]/[id]/page.tsx | 498,510,516 | text-xs | "KR Retail", "USD", "Est. Wholesale" | NO (라벨) | ✅ 허용 |
| app/weekly/[weekId]/[id]/page.tsx | 548 | text-xs | row.platform (플랫폼명) | YES (데이터) | 🔴 위반 |
| app/weekly/[weekId]/[id]/page.tsx | 1026 | text-xs | dimensions_cm, shipping_tier Badge 래퍼 | YES (데이터) | 🔴 위반 |
| app/weekly/[weekId]/[id]/page.tsx | 1317,1325,1356,1364 | text-xs | "MOQ", "LEAD TIME" | NO (라벨) | ✅ 허용 |
| components/ui/Badge.tsx | 4 | text-xs | Low/Medium/High, Blue Ocean 등 | YES (상태값) | 🔴 위반 |
| components/HazmatBadges.tsx | 55 | text-xs | Liquid, Powder 등 배지 텍스트 | 경계 (배지 라벨) | 🟡 판단 |
| components/DonutGauge.tsx | 66 | text-xs | "/100" | NO (단위) | ✅ 허용 |
| components/PriceComparisonBar.tsx | 18,27 | text-xs | "KR Price", "US Price" | NO (라벨) | ✅ 허용 |
| components/ui/KeywordPill.tsx | 7,9 | text-xs | 키워드 텍스트 | 경계 (태그) | ✅ 허용 |

**요약:**  
- 🔴 위반: **3건** — S3 글로벌 카드 내 `row.platform`(548), S5 dimensions/shipping 영역(1026), Badge 내 상태값(Competition/Opportunity) 전반.  
- 🟡 판단: HazmatBadges 배지 텍스트는 배지 라벨 성격으로 허용 가능.

---

## Section 2-B. 위계 붕괴 구간

| 섹션 | 라벨 텍스트 | 라벨 크기 | 데이터 텍스트 | 데이터 크기 | 붕괴 심각도 |
|------|------------|----------|--------------|------------|------------|
| S2 | "COMPETITION LEVEL" | text-xs | "Low" / "Medium" / "High" (Badge) | text-xs | 🔴 CRITICAL |
| S2 | "OPPORTUNITY STATUS" | text-xs | "Blue Ocean" / "Emerging" 등 (Badge) | text-xs | 🔴 CRITICAL |
| S3 | "PROFIT POTENTIAL" | text-xs | "2.8x Profit Multiplier" | text-3xl | 🟢 OK |
| S3 | "Search Volume" | text-xs | search_volume 값 | text-lg | 🟢 OK |
| S3 | "MoM Growth" / "WoW Growth" | text-xs | growth 값 | text-lg | 🟢 OK |
| S4 | "Market Gap Analysis" | text-xs | Gap Index, KR/Global 점수 | text-3xl / text-2xl | 🟢 OK |
| S4 | "Gap Index" | text-xs | gap_index 값 | text-3xl | 🟢 OK |
| S4 | "TikTok" / "Instagram" 등 | text-xs | 플랫폼 점수 | text-lg | 🟡 WARNING (1단계 차이) |
| S5 | "EXPORT READINESS" | text-xs | "Ready to Export" 등 | text-sm | 🟡 WARNING |
| S5 | "Actual Weight" 등 | text-xs | 중량 값 (g) | text-2xl | 🟢 OK |
| S6 | "COST PER UNIT" | text-xs | $ 가격 | text-5xl | 🟢 OK |
| S6 | "MOQ" / "LEAD TIME" | text-xs | MOQ/Lead Time 값 | text-2xl | 🟢 OK |

**집계:**  
- 🔴 CRITICAL: **2건** (Section 2 Competition Level, Opportunity Status — 라벨과 값 모두 text-xs).  
- 🟡 WARNING: **2건** (S4 플랫폼 라벨 vs text-lg 점수, S5 Export Readiness 라벨 vs text-sm 상태).

---

## Section 2-C. font-mono 누락

| 라인 | 코드 스니펫 | 데이터 유형 | font-mono 필요? |
|------|------------|------------|-----------------|
| ~573 | `text-lg font-semibold text-[#1A1916] mt-1` | Search Volume 값 | YES → 🔴 누락 |
| ~579 | `text-lg font-semibold mt-1` (MoM Growth) | 성장률 수치 | YES → 🔴 누락 |
| ~590 | `text-lg font-semibold mt-1` (WoW Growth) | 성장률 수치 | YES → 🔴 누락 |
| ~737 | `text-lg font-bold text-[#1A1916]` | Platform score (TikTok 등) | YES → 🔴 누락 |
| ~1314 | `text-2xl font-semibold text-[#1A1916]` | MOQ 값 | YES → 🔴 누락 |
| ~1322 | `text-2xl font-semibold text-[#1A1916]` | Lead Time 값 | YES → 🔴 누락 |
| ~1353, 1361 | 동일 | MOQ / Lead Time (undisclosed 블록) | YES → 🔴 누락 |

**집계:** font-mono 누락 **7건** (Search Volume 1, MoM/WoW 2, Platform score 1, MOQ/Lead Time 3).

---

## Section 3. 컴포넌트 실태

| 컴포넌트 | 요소 | 현재 클래스 | font-mono | 가시성 문제 |
|---------|------|------------|-----------|------------|
| DonutGauge | 중앙 숫자 | `font-mono text-2xl font-bold tabular-nums text-[#1A1916]` | yes | 없음 |
| DonutGauge | '/100' 라벨 | `text-xs text-[#9E9C98]` | no | 없음 (단위) |
| StatusBadge | 상태값 (Low/Medium/High 등) | `text-sm font-medium` + variant 색상 | no | 있음 — 라벨과 동일 text-xs가 아님 but Badge는 text-xs라 페이지 내 라벨과 동급 |
| StatusBadge | (Badge 사용 시) | ui/Badge: `text-xs font-medium` | no | 위계 붕괴 (라벨=text-xs, 값=text-xs) |
| PriceComparisonBar | KR/US 가격 수치 | `text-lg font-mono font-semibold text-[#1A1916] tabular-nums` | yes | 없음 |
| PriceComparisonBar | 라벨 "KR Price" / "US Price" | `text-xs uppercase tracking-widest text-[#9E9C98] font-semibold` | no | 없음 |
| KeywordPill | 키워드 텍스트 | `text-xs font-medium text-[#3D3B36]` / `text-[#16A34A]` | no | 없음 (태그) |
| HazmatBadges | 배지 텍스트 (Liquid, Powder 등) | `text-xs font-medium` + trueClass/falseClass | no | 없음 (배지) |

**참고:** Section 2에서 Competition Level / Opportunity Status **값**은 **Badge** 컴포넌트로 렌더되며, Badge는 `text-xs font-medium`을 사용. 해당 섹션 라벨도 `text-xs`라 라벨과 데이터 크기가 동일하여 위계 붕괴에 해당함.

---

## Section 4. DAMAGE REPORT

```
총 위반 항목:
  🔴 현미경 사이즈 (text-xs 이하 데이터 영역): 0건 (금지 px 사용 0건)
  🔴 데이터 영역에 text-xs 적용 (핵심 정보): 3건 (platform, dimensions/shipping, Badge 상태값)
  🔴 위계 붕괴 CRITICAL (라벨 >= 데이터): 2건
  🟡 위계 붕괴 WARNING (1단계 차이): 2건
  🔴 font-mono 누락 (숫자 데이터): 7건

가장 심각한 섹션: Section 2 (Competition Level / Opportunity Status — 라벨과 값 동일 text-xs, font-mono 없음, 위계 붕괴 CRITICAL)
가장 깨끗한 섹션: Section 1 (가격·라벨·본문 위계 명확, 가격 font-mono 적용)

수정 예상 파일 수: 4~5개 (app/weekly/[weekId]/[id]/page.tsx, components/ui/Badge.tsx, 필요 시 KeywordPill/HazmatBadges)
수정 예상 소요 시간: 2~3시간
```

---

## 한국어 요약

- **섹션별 현황:** 주간 상세 6개 섹션의 대제목·핵심 데이터·보조 라벨·본문 클래스를 매핑함. 가격·HS코드·중량·Gap/점수 등 대부분 숫자에 font-mono 적용됐으나, Search/MoM/WoW, 플랫폼 점수, MOQ/Lead Time은 font-mono 미적용.
- **현미경 사이즈:** `text-[10px]` 등 금지 사이즈는 **0건**. 다만 데이터 영역에 `text-xs`만 쓰인 곳은 **3건** (글로벌 카드 플랫폼명, dimensions/shipping, Badge 상태값).
- **위계 붕괴:** **CRITICAL 2건** — Section 2의 Competition Level·Opportunity Status는 라벨과 값 모두 text-xs(Badge). **WARNING 2건** — S4 플랫폼 라벨 vs text-lg 점수, S5 Export Readiness 라벨 vs text-sm.
- **font-mono 누락:** 숫자/비율 데이터인데 font-mono가 없는 곳 **7건** (Search Volume, MoM/WoW, 플랫폼 점수, MOQ·Lead Time).
- **컴포넌트:** DonutGauge·PriceComparisonBar는 숫자에 font-mono 적용됨. StatusBadge는 text-sm이지만, 페이지에서 Badge로 쓰일 때는 text-xs라 Section 2에서 위계 붕괴 원인.
- **수정 권장:** (1) Section 2 Competition/Opportunity 값을 Badge가 아닌 더 큰 크기로 표시하거나, Badge 내부를 text-sm으로 상향. (2) Search/MoM/WoW, 플랫폼 점수, MOQ/Lead Time에 font-mono 추가. (3) platform·dimensions 등 데이터에 text-xs 대신 text-sm 이상 적용 검토.

---

*본 감사는 읽기 전용으로 수행되었으며, 코드 변경 없이 기록만 반영하였습니다.*
