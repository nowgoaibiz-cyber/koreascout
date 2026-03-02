# Polishing Audit Report
Generated: 2025-03-02

## AUDIT 1. 여백 & 레이아웃 불일치

### 1-A. 섹션 래퍼 간격

각 섹션(Section 1~6)의 최상위 래퍼는 `<section>`이며, **섹션 간 간격은 상위 컨테이너의 `space-y-6`로 일괄 적용**됨. 개별 섹션에 mb/mt 없음.

| 섹션 | 래퍼 클래스 (padding/margin/gap 관련만) | 섹션 간 mb/mt | 비고 |
|------|----------------------------------------|--------------|------|
| Section 1 | `p-6` | 없음 (상위 `space-y-6` 사용) | Product Identity |
| Section 2 | `p-6` | 없음 | Trend Signal Dashboard |
| Section 3 | `p-6` | 없음 | Market Intelligence |
| Section 4 | `p-6` | 없음 | Social Proof & Trend Intelligence |
| Section 5 | `p-6` | 없음 | Export & Logistics Intel |
| Section 6 | `p-6` | 없음 | Launch & Execution Kit |

- **상위 컨테이너**: `max-w-5xl mx-auto px-6 py-8` → 내부 `<div className="space-y-6">` (라인 1714)로 섹션 간 24px 동일 간격.

### 1-B. 카드 내부 여백 (p-* 클래스)

| 섹션 | 카드 종류 | padding 클래스 | 불일치 여부 |
|------|---------|--------------|------------|
| S1 | 메인 카드 (섹션 래퍼) | p-6 | — |
| S1 | Why It's Trending 카드 | p-4 | 동일 섹션 내 일관 |
| S2 | 3-col 그리드 카드 | p-5 | S1 서브카드(p-4)와 상이 |
| S3 | Profit Multiplier | (래퍼 없음, mb-4 등) | — |
| S3 | Global Prices 4-card (KR/USD/Est/Verified) | p-4 | 일관 |
| S3 | Global Retail Prices 그리드 카드 | p-4 | 일관 |
| S3 | Search & Growth 카드 | p-3 | **불일치** (다른 카드는 p-4/p-5) |
| S3 | Winning Feature / Pain Point | p-4 | 일관 |
| S3 | Viral Hashtags | p-4 | 일관 |
| S4 | Social Buzz 카드 | p-4 | 일관 |
| S4 | Gap Index 2-col 카드 (KR/Global) | p-4 | 일관 |
| S4 | Gap Index 단일 카드 | p-4 | 일관 |
| S4 | Platform 카드들 | p-4 | 일관 |
| S4 | Scout Strategy Report 래퍼 | p-5 | **불일치** (대부분 p-4) |
| S4 | Strategy 내부 스텝 카드 | p-4 | 일관 |
| S5 | Export Readiness 카드 | p-4 | 일관 |
| S5 | HS Code 카드 | p-5 | **불일치** (다른 블록은 p-4) |
| S5 | Broker Email (Alpha) | p-5 | p-5 그룹 |
| S5 | Broker (비Alpha) | p-4 | **불일치** (Alpha와 p-4 vs p-5) |
| S5 | Weight/Shipping 카드 | p-4 | 일관 |
| S5 | Hazmat & Compliance | p-4 | 일관 |
| S5 | Product Specs | p-4 | 일관 |
| S5 | Compliance & Logistics 스텝 | p-4 | 일관 |
| S6 | Launch Kit 메인 카드 (Sourcing Economics / Contact) | p-6 | **불일치** (다른 섹션 서브카드 p-4/p-5) |
| S6 | Execution Gallery 카드 | p-4 | 일관 |

### 1-C. 그리드/플렉스 gap 수치

| 섹션 | 위치 | gap 클래스 | 인접 섹션 gap과 일치? |
|------|------|-----------|---------------------|
| S1 | flex (이미지+텍스트) | gap-6 | S6 flex도 gap-6 — 일치 |
| S2 | 3-col grid | gap-4 | S4 Market Gap grid gap-4 — 일치 |
| S3 | KR/USD/Est 4-card grid | gap-3 | S3 내 Search grid gap-3, S4 Platform gap-3 — 일치 |
| S3 | Global Retail Prices grid | gap-3 | 위와 동일 |
| S3 | Search & Growth grid | gap-3 | 동일 |
| S3 | Winning/Pain 2-col | gap-3 | 동일 |
| S4 | Market Gap 2-col | gap-4 | S2와 일치 |
| S4 | Platform grid | gap-3 | S3와 일치 |
| S5 | Weight flow (flex) | gap-3 (mb-3), flex wrap gap-4 | 내부 gap-3 / gap-4 혼재 |
| S6 | Execution Gallery grid | gap-4 | S2, S4와 일치 |
| 상위 | 섹션 간 | space-y-6 | — |

- **불일치**: S5 내부에 `gap-3`(flex)와 `gap-4`(flex-wrap) 혼재. 전역적으로는 gap-3 / gap-4 / gap-6 혼용.

### 1-D. 불일치 요약

- **섹션 간 mb/mt**: 없음. 모두 `space-y-6`로 통일되어 있음.
- **카드 padding 혼재**:
  - **p-3**: S3 Search & Growth 카드 (3곳).
  - **p-4 vs p-5**: S2 그리드 카드 p-5 vs S1/S3/S4 대부분 p-4; S5 HS Code·Broker(Alpha) p-5 vs 나머지 p-4; S4 Scout Strategy 래퍼 p-5.
  - **p-6**: S6 Launch Kit 좌우 메인 카드 2곳 (다른 섹션 서브카드는 p-4 또는 p-5).
- **gap 혼재**:
  - **gap-2**: S4 Rising Keywords, SEO Keywords, Viral Hashtags (flex-wrap gap-2); S6 Global Market Proof grid gap-2.
  - **gap-3**: S3 여러 grid, S4 Platform, S5 weight flow 등.
  - **gap-4**: S2 3-col, S4 Market Gap, S6 Execution Gallery, S5 flex-wrap gap-4.
  - **gap-6**: S1 flex, S6 상단 flex.
  - 정리: gap-2 / gap-3 / gap-4 / gap-6 혼재.

---

## AUDIT 2. Border & Shadow 찌꺼기

### 2-A. 이상한 보더 색상

- **app/weekly**, **components/** 내 `border-gray`, `border-slate`, `border-zinc`, `border-stone`, `border-neutral`, `border-white`, `border-black`**: **0건** (없음).
- **page.tsx** 내 border: 대부분 `border-[#E8E6E1]`, `border-[#16A34A]`, `border-[#BBF7D0]`, `border-[#FECACA]`, `border-[#FDE68A]`, `border-[#BFDBFE]`, `border-[#3D3B36]` 등 Design System 톤 사용.
- **예외 (크림/잉크 테마 외)**:

| 파일 | 라인 | 클래스 | 현재 색상 | 허용 여부 | 권장 교체값 |
|------|------|--------|---------|---------|-----------|
| app/weekly/[weekId]/[id]/page.tsx | 1718 | border-emerald-500/30, bg-emerald-500/15, text-emerald-300 | Tailwind emerald | ❌ (Design System hex 미사용) | border-[#BBF7D0] 또는 border-[#16A34A] + 배경/텍스트 톤 맞춤 |

- 위는 "FREE THIS WEEK" 티저 배너 1곳뿐임.

### 2-B. 섀도우 불일치

**page.tsx** 내 shadow: 모두 `shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]` (card) — **허용**.

**components/**:

| 파일 | 라인 | 클래스 | 허용 여부 |
|------|------|--------|---------|
| components/ui/Card.tsx | 5 | shadow-[0_1px_3px_0_rgb(26_25_22/0.06),0_1px_2px_-1px_rgb(26_25_22/0.04)] | ⚠️ 복합 shadow (card + 추가 레이어) — Design System 기준 1개 값만 허용 시 불일치 |
| components/ui/Card.tsx | 7 | shadow-[0_4px_6px_-1px_rgb(26_25_22/0.08),0_2px_4px_-2px_rgb(26_25_22/0.05)] | ⚠️ 복합 shadow (elevated + 추가 레이어) |
| components/ui/Card.tsx | 11 | shadow-[0_1px_3px_0_rgb(26_25_22/0.06),0_1px_2px_-1px_rgb(26_25_22/0.04)] | ⚠️ 위와 동일 |

- 허용 기준: `shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]`, `shadow-[0_4px_6px_-1px_rgb(26_25_22/0.08)]` 단일만 허용 시, Card.tsx의 **쉼표로 이어진 복합 shadow**는 불일치로 보고 가능.

### 2-C. rounded 불일치

**page.tsx** 내 사용: `rounded-2xl`, `rounded-xl`, `rounded-lg`, `rounded-md`, `rounded-full` 만 사용. Design System 허용 목록(rounded-2xl, rounded-xl, rounded-lg, rounded-md, rounded-full, rounded-sm)과 일치.

- **불일치 목록**: 없음.

---

## AUDIT 3. 페이월 & 권한 체크 포인트

### 3-A. 구독 티어 체크 로직 전체 매핑

| 파일 | 라인 | 코드 스니펫 | 역할 |
|------|------|------------|------|
| app/weekly/[weekId]/[id]/page.tsx | 2 | `import { getAuthTier } from "@/lib/auth-server"` | 티어 조회 import |
| app/weekly/[weekId]/[id]/page.tsx | 1645 | `const { tier } = await getAuthTier();` | 페이지 티어 결정 |
| app/weekly/[weekId]/[id]/page.tsx | 1672 | `const isTeaser = report.is_teaser === true;` | 티저 여부 |
| app/weekly/[weekId]/[id]/page.tsx | 1673 | `const canSeeStandard = tier === "standard" \|\| tier === "alpha" \|\| isTeaser;` | Standard 이상 콘텐츠 노출 |
| app/weekly/[weekId]/[id]/page.tsx | 1674 | `const canSeeAlpha = tier === "alpha" \|\| isTeaser;` | Alpha 전용 콘텐츠 노출 |
| app/weekly/[weekId]/[id]/page.tsx | 1728–1741 | `canSeeStandard ? (MarketIntelligence + SocialProof...) : (LockedSection x3)` | S3·S4 접근 제어 |
| app/weekly/[weekId]/[id]/page.tsx | 1743–1754 | `hasLogistics && (canSeeStandard ? SourcingIntel : LockedSection)` | S5 접근 제어 |
| app/weekly/[weekId]/[id]/page.tsx | 1756–1763 | `hasSupplier && (canSeeAlpha ? SupplierContact : LockedSection)` | S6 접근 제어 |
| app/weekly/[weekId]/[id]/page.tsx | 1194–1206 | tier별 footer CTA (free/standard/alpha) | 하단 업셀 링크 |
| app/weekly/page.tsx | 2 | `import { getAuthTier } from "@/lib/auth-server"` | 티어 조회 import |
| app/weekly/page.tsx | 26 | `const { tier } = await getAuthTier();` | 목록 페이지 티어 |
| app/weekly/page.tsx | 27 | `const isPaid = tier === "standard" \|\| tier === "alpha";` | 유료 여부 |
| app/weekly/page.tsx | 56–57 | `availableForFree = isWeekAvailableForFree(week.published_at)`, `lockedForFree = !isPaid && !availableForFree` | 주차별 무료 개방 여부 |
| app/api/webhooks/lemonsqueezy/route.ts | 105, 144, 163, 178–198 | subscription_created/updated/cancelled/expired, ls_subscription_id | 구독 동기화 (티어 아님, 백엔드) |

### 3-B. canSeeAlpha / canSeeStandard 선언부 전체 추출

**선언 위치 (page.tsx)**

- **canSeeStandard**  
  - 라인 1673:  
  `const canSeeStandard = tier === "standard" || tier === "alpha" || isTeaser;`  
  - 사용처: 1728 (Section 3·4 노출), 1743 (Section 5 노출).

- **canSeeAlpha**  
  - 라인 1674 (페이지 레벨):  
  `const canSeeAlpha = tier === "alpha" || isTeaser;`  
  - 컴포넌트 내부 로컬 재선언:
    - SocialProofTrendIntelligence (라인 454): `const canSeeAlpha = tier === "alpha" || isTeaser;`
    - SourcingIntel (라인 907): `const canSeeAlpha = tier === "alpha" || isTeaser;`
    - SupplierContact (라인 1244): `const canSeeAlpha = tier === "alpha" || isTeaser;`

**canSeeAlpha 사용 라인 (페이지 + 하위 컴포넌트)**  
454, 809, 820, 828, 867, 878, 907, 916, 958, 988, 993, 1002, 1064, 1096, 1116, 1134, 1150, 1244, 1255, 1293, 1645, 1674, 1757.

**canSeeStandard 사용 라인**  
1673, 1728, 1743.

### 3-C. 데이터 Fetching 로직 위치

| 라인 | 쿼리 스니펫 | 조회 대상 테이블 | 현재 필터 조건 | limit 있음? |
|------|------------|----------------|--------------|------------|
| 1644–1654 | `supabase.from("scout_final_reports").select("*").eq("id", id).eq("week_id", weekId).eq("status", "published").single()` | scout_final_reports | id, week_id, status=published | N (single) |
| 1655–1660 | `supabase.from("scout_final_reports").select("id").eq("week_id", weekId).eq("status", "published").order("created_at", { ascending: true })` | scout_final_reports | week_id, status=published | N |
| 1661 | `supabase.from("weeks").select("week_label").eq("week_id", weekId).single()` | weeks | week_id | N (single) |

**Rule of 3 로직 삽입 포인트 제안**

- **후보**: `weekReports` 쿼리 (라인 1655–1660).  
  `order("created_at", { ascending: true })` **바로 다음**에 `.limit(3)` 추가 시, 해당 주차에서 “최근 3개” id만 가져옴.
- **주의**: 현재 이 결과로 `idList`를 만들어 prev/next 링크에 사용하므로, `.limit(3)`을 넣으면 **해당 주차에서 3개 밖에 안 보이는 경우 prev/next가 잘못 동작**할 수 있음. “목록 자체를 최근 3개로만 제한”하는 요구라면:
  - **옵션 A**: 이 페이지에서는 limit 넣지 않고, **weekly 목록 페이지**에서 “이번 주 최근 3개”만 보여주는 쿼리를 별도로 두고, 상세 페이지는 기존처럼 전체 id로 prev/next 유지.
  - **옵션 B**: 상세 페이지에서 “이 주의 최근 3개만 노출”이 목적이면, **라인 1660 다음**에 `.limit(3)` 추가 (위험: prev/next 범위가 3개로 제한됨).

### 3-D. Weekly 목록 페이지 접근 제어

**getAuthTier 호출**  
- 라인 26: `const { tier } = await getAuthTier();`

**isPaid / locked 판단**  
- 라인 27: `const isPaid = tier === "standard" || tier === "alpha";`  
- 라인 56: `const availableForFree = isWeekAvailableForFree(week.published_at);`  
- 라인 57: `const lockedForFree = !isPaid && !availableForFree;`

**Week 카드 노출 조건**  
- 모든 주차 카드는 렌더링됨.  
- `lockedForFree === true`: 카드 스타일 흐리게 + “🔒 Available {availableDate}”, “Open this week after {availableDate}.” 표시, **링크 없음**.  
- `lockedForFree === false`: 클릭 가능, `Link`로 `/weekly/${week.week_id}` 이동, “View products →” 표시.  
- 서브텍스트: `availableForFree && !isPaid` → “· Free access”, `availableForFree && isPaid` → “· Just released”, `lockedForFree && availableDate` → “· Unlocks {availableDate}”.

**관련 코드 (요약)**  
- 62–67: 카드 div에 `lockedForFree`에 따라 `border-[#E8E6E1] bg-[#F8F7F4] opacity-60` vs `bg-white shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] hover:border-[#BBF7D0] cursor-pointer`.  
- 75–79: locked일 때 “🔒 Available {availableDate}`.  
- 91–101: locked이면 “Open this week after {availableDate}.”, 아니면 `Link` “View products →”.

---

## AUDIT 4. LockedSection.tsx 원본

### 전체 코드

```tsx
"use client";

import Link from "next/link";

export interface LockedSectionProps {
  message: string;
  cta: string;
  href: string;
  lockedFields?: string[];
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function LockedSection({ message, cta, href, lockedFields }: LockedSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#E8E6E1] bg-white p-8">
      {/* Blur overlay to suggest hidden content */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#F8F7F4] to-transparent backdrop-blur-[2px]"
        aria-hidden
      />
      <div className="relative flex flex-col items-center text-center">
        <LockIcon className="mx-auto mb-4 text-[#9E9C98]" />
        {lockedFields && lockedFields.length > 0 && (
          <div className="mb-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-[#9E9C98]">
            {lockedFields.map((field) => (
              <span key={field}>
                🔒 {field}: ■■■■■■
              </span>
            ))}
          </div>
        )}
        <p className="text-lg font-medium text-[#1A1916] mb-6 max-w-md">{message}</p>
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#15803D]"
        >
          {cta}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
```

### 현재 구조 분석

- **Props**: `message`, `cta`, `href`, `lockedFields` (optional string[]).
- **조건 분기**: tier 분기 없음. 부모에서 CTA 객체(SECTION_3_LOCKED_CTA 등)를 넘기고, LockedSection은 받은 props만 렌더.
- **카피라이팅**: 페이지 쪽 상수에서 정의 (SECTION_3_LOCKED_CTA, SECTION_4_LOCKED_CTA, SECTION_CONSUMER_CTA, SECTION_ALPHA_SOURCING_CTA, SECTION_ALPHA_MEDIA_CTA, SECTION_ALPHA_SUPPLIER_CTA). 컴포넌트 내 고정 문구: `"🔒 {field}: ■■■■■■"`.
- **CTA 버튼**: `href={href}` (대부분 `/pricing`), 텍스트는 `cta` prop (예: "Unlock Market Intelligence — $9/mo →", "Go Alpha $29/mo →").
- **디자인 클래스**:  
  - 래퍼: `rounded-xl border border-[#E8E6E1] bg-white p-8`, `overflow-hidden`.  
  - 오버레이: `bg-gradient-to-b from-[#F8F7F4] to-transparent backdrop-blur-[2px]`.  
  - 아이콘: `text-[#9E9C98]`, `mb-4`.  
  - 필드 목록: `text-sm text-[#9E9C98]`, `gap-x-4 gap-y-1`.  
  - 메시지: `text-lg font-medium text-[#1A1916] mb-6 max-w-md`.  
  - 버튼: `rounded-lg bg-[#16A34A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#15803D]`.

---

## 한국어 요약

- **가장 심각한 불일치**
  - **여백**: 카드 padding이 p-3 / p-4 / p-5 / p-6 혼재 (S2 그리드 p-5, S3 Search p-3, S5 HS·Broker p-5, S6 메인 p-6 등).
  - **Border**: 티저 배너 1곳에서만 `border-emerald-500/30` 사용 — Design System hex 미사용.
  - **Shadow**: page.tsx는 모두 허용 shadow. Card.tsx는 복합 shadow 사용 — 단일 허용 기준 시 불일치.

- **즉시 수정 권장 순위**
  1. 티저 배너 보더/배경/텍스트: `emerald-*` → Design System hex (예: border-[#BBF7D0], bg/텍스트 톤 정리).
  2. 카드 padding 통일: 서브카드 기준 p-4 또는 p-5 중 하나로 정하고, p-3/p-6 예외 정리.
  3. gap 통일: gap-2 / gap-3 / gap-4 / gap-6 용도 정의 후, 섹션별로 일관 적용.
  4. Card.tsx shadow: Design System 두 가지 단일 shadow만 쓰도록 정리 (필요 시 디자인 확인).

- **Rule of 3 삽입 권장 위치**
  - “이 주의 최근 3개 리포트만” 제한할 경우: **app/weekly/[weekId]/[id]/page.tsx** 라인 1660, `order("created_at", { ascending: true })` 직후에 `.limit(3)` 추가 가능.
  - 단, 현재 이 쿼리 결과로 prev/next를 만들므로, limit(3) 적용 시 네비게이션 범위가 3개로 줄어듦. 목록만 3개로 보이게 하려면 weekly 목록 페이지에 별도 “최근 3개” 쿼리를 두는 편이 안전함.

---

감사 완료. **코드 변경 없음.** (Read & Report only.)
