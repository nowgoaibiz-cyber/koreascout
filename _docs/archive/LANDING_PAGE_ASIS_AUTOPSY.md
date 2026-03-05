# KoreaScout Landing Page AS-IS Autopsy Report
# Generated: 2025-03-05

## 1. 파일 구조
- 메인: `app/page.tsx` (단일 파일, "use client" 전면 사용)
- 관련 컴포넌트: **없음** — Hero / Landing / CTA / Banner / Footer 모두 `app/page.tsx` 내 인라인 구현. 별도 Hero, Landing, Home, CTA, Banner 컴포넌트 파일 없음.

## 2. 현재 카피 전수 판정표

| 위치 | 현재 텍스트 | 판정 | 이유 |
|------|------------|------|------|
| Hero Badge | "Alpha Members Active: {n} / 1,000" | ❌ KILL | 숫자 장난감. 럭셔리/정보기관 톤과 불일치 |
| Hero H1 L1 | "Stop Chasing Trends." | ❌ KILL | 클리셰. TO-BE 단일 슬로건으로 대체 |
| Hero H1 L2 | "Scout Them First." | ❌ KILL | 위와 동일 |
| Hero Sub | "[Digital Execution Blueprint]" + 설명 문단 | ❌ KILL | 장황. Hero에는 킬러 한 줄만 |
| CTA 1 | "View Sample Report" | ✅ REWRITE | 유지하되 동작만 OAuth/직행으로 변경 |
| CTA 2 | "Get Sourcing Kit ($29) →" | ❌ KILL | Hero에는 CTA 단일화 |
| Trust 1 | "Instant Digital Download" | ❌ KILL | 쿠팡 느낌. 즉시 삭제 |
| Trust 2 | "Raw Video Assets" | ❌ KILL | 서브텍스트 전부 제거 |
| Trust 3 | "Direct Contacts" | ❌ KILL | 서브텍스트 전부 제거 |
| Benefit 1 | "2 WEEKS" / "Ahead of Global Market" | ❌ KILL | 싸구려. 정보기관은 납기를 광고하지 않는다 |
| Benefit 2 | "REAL DATA" / "Verified Korean Sources" | ❌ KILL | 당연한 말. 권위 있는 기관은 자명한 것을 강조하지 않는다 |
| Benefit 3 | "FULL KIT" / "Video + Supplier Contacts" | ❌ KILL | 3컬럼 Benefits 전체 삭제 |
| Comparison 섹션 | "The Raw Truth", "Stop chasing…", "The Old Way" / "The KoreaScout Way" | — | Hero 외 섹션은 본 리디자인 범위 외 (Hero만 교체) |
| Sourcing Nodes | "How It Gets Made", "We Do The Grunt Work. You Get The Files." 등 | — | 동일 |
| Standard / Alpha / Pricing / FAQ / CTA Bottom / Footer | (전부) | — | PHASE 2에서 Hero만 교체, 하단 섹션 삭제 예정(요청서 기준 Hero + CTA 단일화) |

**요약:** Hero 영역 내 즉시 삭제 대상 — 배지, 기존 H1 두 줄, 서브 문단, 두 번째 CTA, Trust 3줄, Stats 3컬럼 전부. 생존·재사용 — CTA 문구 "View Sample Report" (동작만 OAuth/직행으로 변경).

## 3. 현재 레이아웃 구조 요약
- **전체:** `min-h-screen bg-[#F8F7F4]`, 라이트 크림 배경.
- **Hero:** `section#hero` — pt-24 pb-20, 배지 → H1(2줄) → 서브 → CTAs 2개 → Trust 3아이콘 → Stats 3컬럼.
- **이하 순서:** Comparison → Sourcing Nodes → Standard Detail → Alpha Vault → Founders DNA → Image CTA → Pricing (3-Tier) → FAQ → CTA Bottom → Footer.
- **Footer:** 인라인 푸터 (©, Privacy, Terms, Sample Report, Contact).
- **Navigation:** 상단 고정 네비게이션 없음 (현재 페이지에는 없음).

## 4. 즉시 삭제 대상 목록
- Hero Badge: "Alpha Members Active: … / 1,000"
- Hero H1: "Stop Chasing Trends." / "Scout Them First."
- Hero 서브헤드라인 전체 (Digital Execution Blueprint 문단)
- Hero CTA 2: "Get Sourcing Kit ($29) →"
- Hero Trust: "Instant Digital Download", "Raw Video Assets", "Direct Contacts"
- Hero Stats 3컬럼: "2 WEEKS", "REAL DATA", "FULL KIT" 및 각 라벨
- (TO-BE에서 Hero만 100vh 시네마틱으로 교체하므로, 위 Hero 내 요소들은 코드 상 전부 제거)

## 5. 생존 가능 항목 (수정 후 사용)
- CTA 문구: **"View Sample Report"** — 유지. 동작만 비로그인 시 Google OAuth → `/sample-report`, 로그인 시 `/sample-report` 직행으로 변경.
- 푸터 구조(링크/저작권): TO-BE에서 Hero 섹션만 교체 시, 필요 시 최소 푸터 유지 가능.

---
*저장 위치: _docs/archive/ (standard 아님)*
