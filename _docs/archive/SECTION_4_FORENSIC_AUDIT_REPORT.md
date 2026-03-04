# Section 4 포렌식 감사 보고서 (Read-Only)

**파일:** `app/weekly/[weekId]/[id]/page.tsx`  
**감사일:** 2025-03-04  
**원칙:** 코드 수정 없음, 읽기 전용 조사만 수행.

---

## 1. 컴포넌트 위치 & 라인 범위

| 항목 | 값 |
|------|-----|
| **섹션 DOM ID** | `section-4` |
| **컴포넌트 이름** | `SocialProofTrendIntelligence` |
| **함수 정의 시작** | **938행** (`function SocialProofTrendIntelligence({`) |
| **함수 정의 끝** | **1115행** (`}`) |
| **`<section id="section-4">`** | **950행** |
| **섹션 제목(UI)** | "Social Proof & Trend Intelligence" |

**네비게이션:** `{ id: 'section-4', label: 'Social Proof', icon: null }` (1953행).

---

## 2. JSX 구조 요약 (Social Buzz → Market Gap → Gap Index → Trending Signals → Strategy 계층)

```
<section id="section-4">
├── <h2> Social Proof & Trend Intelligence
├── Block 1 — Social Buzz
│   └── report.buzz_summary?.trim() ? 인용문 카드 : 미렌더
├── Block 2 — Market Gap Analysis
│   ├── 서브타이틀 "Market Gap Analysis"
│   ├── grid grid-cols-2
│   │   ├── 카드 1: Korean Traction (kr_local_score, progress bar, kr_evidence, kr_source_used)
│   │   └── 카드 2: Global Presence (global_trend_score, progress bar, global_evidence)
│   └── Gap Index 박스 (초록 배경)
│       ├── gap_index, gap_status Badge, opportunity_reasoning
├── Block 3 — Trending Signals (IIFE)
│   ├── risingKw, seoKw, viralHt = normalizeToArray(rising_keywords|seo_keywords|viral_hashtags)
│   ├── hasAnyTrending ? 블록 렌더 : null
│   ├── Rising Keywords (KR) → KeywordPill variant="trending"
│   ├── Global SEO Keywords → canSeeAlpha ? KeywordPill variant="default" : 플레이스홀더
│   ├── Viral Hashtags → canSeeAlpha ? KeywordPill variant="default" : 플레이스홀더
│   └── !canSeeAlpha && (seoKw|viralHt 있음) → Lock CTA 박스
└── Block 5 — Scout Strategy Report (IIFE)
    ├── allSteps = parseSourcingStrategy(report.sourcing_tip), steps = allSteps.slice(0, 3)
    ├── steps.length === 0 ? null
    └── canSeeAlpha ? Step 1–3 카드 리스트 : 플레이스홀더 + Alpha CTA
```

**자식 컴포넌트:** `Badge`, `Button`, `KeywordPill`, `Lock` (lucide).  
**유틸:** `normalizeToArray`, `parseSourcingStrategy`.

---

## 3. DB 필드 매핑 테이블 (UI 요소 → report.* 필드명)

| UI 요소 | report 필드 | 비고 |
|---------|-------------|------|
| Social Buzz 인용문 | `report.buzz_summary` | `.trim()` 후 있을 때만 블록 표시 |
| Korean Traction 점수 | `report.kr_local_score` | 숫자 0–100, `?? "—"` |
| Korean Traction 증거/설명 | `report.kr_evidence` | optional |
| Korean Traction 출처 | `report.kr_source_used` | optional, "Source: …" |
| Global Presence 점수 | `report.global_trend_score` | 숫자 0–100, `?? "—"` |
| Global Presence 증거 | `report.global_evidence` | optional |
| Gap Index 숫자 | `report.gap_index` | `?? "—"` |
| Gap Status 배지 | `report.gap_status` | "Blue Ocean" \| "Emerging" → success, 그 외 warning |
| Opportunity Reasoning | `report.opportunity_reasoning` | `.trim()` 후 표시 |
| Rising Keywords (KR) | `report.rising_keywords` | normalizeToArray → KeywordPill |
| Global SEO Keywords | `report.seo_keywords` | normalizeToArray, Alpha에서만 표시 |
| Viral Hashtags | `report.viral_hashtags` | normalizeToArray, Alpha에서만 표시 |
| Scout Strategy (Step 1–3) | `report.sourcing_tip` | parseSourcingStrategy → slice(0, 3) |

---

## 4. Trending Signals 파싱 방식 (keywords/hashtags → 배열)

- **공통 함수:** `normalizeToArray(raw: unknown): string[]` (114–131행).
- **동작:**
  1. `raw`가 falsy → `[]` 반환.
  2. 배열이면 `raw.map(String).join(",")` → 하나의 문자열로.
  3. 문자열이면 그대로 사용.
  4. 그 외 타입 → `[]` 반환.
  5. `str`에서 `[ ] \ "` 문자 전부 제거: `str.replace(/[\[\]\\"]/g, '')`.
  6. 쉼표로 split → `map(s => s.trim()).filter(Boolean)` → 문자열 배열 반환.
- **Section 4 사용처:**
  - `risingKw = normalizeToArray(report.rising_keywords)`
  - `seoKw = normalizeToArray(report.seo_keywords)`
  - `viralHt = normalizeToArray(report.viral_hashtags)`
- **표시:**  
  - `hasAnyTrending = risingKw.length > 0 || seoKw.length > 0 || viralHt.length > 0` 이면 "Trending Signals" 블록 렌더.  
  - Rising Keywords는 **모든 tier**에서 `KeywordPill variant="trending"`으로 표시.  
  - SEO Keywords / Viral Hashtags는 **Alpha(또는 isTeaser)** 에서만 실제 필 표시, 그 외는 `h-10` 플레이스홀더 + Lock CTA.

---

## 5. Strategy Steps 1–3 파싱 방식 (parseSourcingStrategy, slice 범위)

- **함수:** `parseSourcingStrategy(raw: string | null | undefined): StrategyStep[]` (140–184행).  
  `raw` = `report.sourcing_tip`.
- **스텝 패턴 (5개):**
  1. `[마케팅 전략]` → Marketing Strategy  
  2. `[가격/· 마진 전략]` → Pricing & Margin  
  3. `[B2B 소싱 전략]` → B2B Sourcing  
  4. `[통관/· 규제 전략]` → Regulation & Compliance  
  5. `[물류/· 배송 전략]` → Logistics & Shipping  
- **동작:** 각 패턴으로 구간 찾아 `content` 추출 → `StrategyStep[]` 반환. 매칭 없고 `raw.trim()` 있으면 단일 "Strategy Overview" 스텝으로 fallback.
- **Section 4에서 사용:**  
  `const allSteps = parseSourcingStrategy(report.sourcing_tip);`  
  `const steps = allSteps.slice(0, 3);`  
  → **Step 1(마케팅), Step 2(가격/마진), Step 3(B2B 소싱)** 만 "Scout Strategy Report" 블록에 표시.  
  UI 라벨: "Step 1", "Step 2", "Step 3".  
  `steps.length === 0` 이면 블록 자체를 렌더하지 않음 (`return null`).

---

## 6. Tailwind 클래스 & 하드코딩 컬러 목록

**Section 4 범위(938–1115) 내 Tailwind 클래스 요약:**

- **섹션 루트:** `scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]`
- **h2:** `text-3xl font-bold text-[#1A1916] mb-4 tracking-tight`
- **블록 제목(소문자 레이블):** `text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2` 또는 `mb-3`
- **Social Buzz 카드:** `bg-[#F8F7F4] rounded-xl border-l-4 border-l-[#16A34A] border border-[#E8E6E1] p-4`
- **Market Gap 카드:** `p-4 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4]`, `grid grid-cols-2 gap-4`
- **Gap Index 박스(초록):** `mt-4 p-4 rounded-xl border border-[#BBF7D0] bg-[#DCFCE7] text-center`
- **프로그레스 바:** `w-full h-2 rounded-full bg-[#E8E6E1] overflow-hidden`, `h-full rounded-full bg-[#16A34A]` / `bg-[#2563EB] transition-all`
- **텍스트:** `text-xs text-[#6B6860]`, `text-2xl font-mono font-bold text-[#16A34A]`, `text-3xl font-mono font-bold text-[#16A34A]`, `text-sm text-[#3D3B36] leading-relaxed`, `max-w-xl mx-auto`
- **Trending Signals:** `mt-6`, `flex flex-wrap gap-2`, `h-10 w-full rounded-lg bg-[#F2F1EE]` (플레이스홀더), Lock CTA: `mt-4 flex flex-col items-center justify-center pb-6 gap-3 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4] px-4 py-4`
- **Strategy 블록:** `bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-4 space-y-3`, `bg-white rounded-lg border border-[#E8E6E1] p-4`, `whitespace-pre-line`, 플레이스홀더 `h-32 w-full rounded-xl bg-[#F2F1EE]`

**Section 4 내 하드코딩 헥스 컬러:**

| 헥스 | 용도 |
|------|------|
| `#1A1916` | 제목/강조 텍스트 |
| `#3D3B36` | 본문 텍스트 |
| `#6B6860` | 보조 텍스트 |
| `#9E9C98` | 레이블/플레이스홀더 텍스트 |
| `#E8E6E1` | 테두리/프로그레스 트랙 |
| `#F8F7F4` | 카드 배경 |
| `#F2F1EE` | 플레이스홀더/블러 영역 배경 |
| `#16A34A` | Social Buzz 강조, Korean Traction, Gap Index, 프로그레스 바 |
| `#2563EB` | Global Presence 점수/프로그레스 바 |
| `#BBF7D0` | Gap Index 박스 테두리 |
| `#DCFCE7` | Gap Index 박스 배경 |

---

## 7. Defensive / Conditional 로직 현황

- **tier 분기:** `canSeeAlpha = tier === "alpha" || isTeaser` (947행).  
  - SEO Keywords / Viral Hashtags: `canSeeAlpha ? 필 표시 : 플레이스홀더` + `!canSeeAlpha && (seoKw|viralHt 있음)` 시 Lock CTA.  
  - Scout Strategy Report: `canSeeAlpha ? Step 1–3 카드 : 플레이스홀더 + Alpha CTA`.
- **Optional chaining / null 대비:**  
  `report.buzz_summary?.trim()`, `report.kr_evidence?.trim()`, `report.kr_source_used?.trim()`, `report.global_evidence?.trim()`, `report.gap_status` (truthy 체크), `report.opportunity_reasoning?.trim()`.
- **기본값:** `report.kr_local_score ?? "—"`, `report.global_trend_score ?? "—"`, `report.gap_index ?? "—"`.  
  프로그레스 width: `Math.min(report.kr_local_score || 0, 100)`, `Math.min(report.global_trend_score || 0, 100)`.
- **블록 존재 조건:**  
  - Social Buzz: `report.buzz_summary?.trim()` 있을 때만.  
  - Trending Signals: `hasAnyTrending` (세 배열 중 하나라도 length > 0).  
  - Scout Strategy: `steps.length === 0` 이면 `return null`.
- **Badge variant:** `report.gap_status === "Blue Ocean" || report.gap_status === "Emerging" ? "success" : "warning"`.

---

## 8. LockedSection 조건 (tier 분기)

**페이지 레벨 (Section 4 노출 여부):**

- **별도 `hasSection4` / `hasSocialProof` 변수 없음.**  
  Section 3(MarketIntelligence)과 Section 4(SocialProofTrendIntelligence)는 **같은 분기**로 렌더됨.
- **조건:** `canSeeStandard = tier === "standard" || tier === "alpha" || isTeaser` (1921행).
- **렌더링 (1976–1988행):**
  - `canSeeStandard === true` → `<MarketIntelligence ... />` + `<SocialProofTrendIntelligence ... />` 표시.
  - `canSeeStandard === false` (Free tier) → Section 3·4·Consumer 자리에 **LockedSection** 3개:
    - `LockedSection {...SECTION_3_LOCKED_CTA}`
    - `LockedSection {...SECTION_4_LOCKED_CTA}`
    - `LockedSection {...SECTION_CONSUMER_CTA}`

**SECTION_4_LOCKED_CTA (59–64행):**

- `message`: "This product is trending on ■ platforms. TikTok alone scored ■■/100."
- `cta`: "See What's Trending — $9/mo →"
- `href`: "/pricing"
- `lockedFields`: ["Platform scores", "Rising keywords", "Gap analysis", "Entry strategy"]

**컴포넌트 내부:**  
Section 4 안에서는 `LockedSection` 컴포넌트를 쓰지 않음. Standard 사용자는 섹션 전체는 보이되, **SEO Keywords / Viral Hashtags**는 플레이스홀더 + Lock CTA, **Scout Strategy Report**는 플레이스홀더 + "Go Alpha $29/mo" CTA로만 표시됨.

---

**감사 완료.** 코드 변경 없이 읽기 전용으로 위 내용만 정리함.
