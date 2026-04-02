# `/weekly` 주간 데이터 페칭·제품 수 표시 스캔

스캔일: 2026-04-02  
범위: `app/weekly/page.tsx` 전체, `app/weekly/**/*.tsx`에서 `product_count` / `week_id` / `weeks` 매칭 파일.

---

## 1. `grep`로 찾은 파일 (`app/weekly/`, `*.tsx`)

| 경로 | 비고 |
|------|------|
| `app/weekly/page.tsx` | 허브 페이지 — `weeks` 조회·월별 아코디언·주 카드 렌더 |
| `app/weekly/MonthAccordion.tsx` | 월별 접이식 래퍼 — **제품 수/DB 필드 없음** |
| `app/weekly/[weekId]/page.tsx` | 개별 주 상세 — 별도 라우트 (허브 목록 아님) |
| `app/weekly/[weekId]/[id]/page.tsx` | 개별 리포트 상세 — 별도 라우트 |

---

## 2. 데이터 페칭 (`app/weekly/page.tsx`)

### 2.1 주 목록 + 중첩 카운트

서버 컴포넌트에서 `createClient()`로 Supabase `weeks`를 조회한다.

- **선택 컬럼**: `week_id`, `week_label`, `start_date`, `end_date`, `published_at`, **`product_count`**, `summary`, 그리고 **`scout_final_reports(count)`** (중첩 집계).
- **필터**: `scout_final_reports.status = 'published'`, `weeks.status = 'published'`.
- **정렬**: `start_date` 내림차순.

```73:78:app/weekly/page.tsx
  const { data: weeks, error } = await supabase
    .from("weeks")
    .select("week_id, week_label, start_date, end_date, published_at, product_count, summary, scout_final_reports(count)")
    .filter("scout_final_reports.status", "eq", "published")
    .eq("status", "published")
    .order("start_date", { ascending: false });
```

### 2.2 최근 3주 ID (유료 접근 로직용)

`published_at` 기준 최근 3개 `week_id`만 조회한다. 제품 수와 무관.

```91:97:app/weekly/page.tsx
  const { data: latest3Weeks } = await supabase
    .from("weeks")
    .select("week_id")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);
  const latest3WeekIds = (latest3Weeks ?? []).map((w) => w.week_id);
```

### 2.3 타입 정의

`WeekRow`에 `product_count`와 `scout_final_reports` 중첩 카운트 타입이 포함된다.

```47:56:app/weekly/page.tsx
type WeekRow = {
  week_id: string;
  week_label: string | null;
  start_date: string | null;
  end_date: string | null;
  published_at: string | null;
  product_count: number | null;
  summary: string | null;
  scout_final_reports?: { count: number }[];
};
```

**요약**: `product_count`는 **SELECT에 포함되지만**, 아래 UI에서는 **사용되지 않는다**. 화면에 나오는 숫자는 **`scout_final_reports`의 `count`** 뿐이다.

---

## 3. 제품 수 표시 로직 (`app/weekly/page.tsx`)

### 3.1 실제로 쓰는 값

각 주 카드에서:

```typescript
const actualCount = week.scout_final_reports?.[0]?.count ?? 0;
```

즉 **해당 주에 연결된 `scout_final_reports` 중 `status = 'published'`인 행 수**(쿼리 필터에 의해 집계됨)를 쓴다. `week.product_count`는 참조하지 않는다.

### 3.2 잠긴 주(locked) 카드

```313:315:app/weekly/page.tsx
                              <p className="text-base text-[#6B6860] mt-1.5">
                                {actualCount} product{actualCount !== 1 ? "s" : ""}
                              </p>
```

### 3.3 잠금 해제된 주 링크 카드

발행일 다음에 `•`로 같은 `actualCount`를 표시한다.

```367:373:app/weekly/page.tsx
                                <p className="text-sm text-[#6B6860] mt-1.5">
                                  {formatPublishedDate(week.published_at) && (
                                    <>Published: {formatPublishedDate(week.published_at)}</>
                                  )}
                                  {formatPublishedDate(week.published_at) && " • "}
                                  {actualCount} product{actualCount !== 1 ? "s" : ""}
                                </p>
```

### 3.4 Featured 블록 (무료 티어)

`featuredWeek`는 라벨·날짜·링크만 보여 주고 **제품 수는 표시하지 않는다** (같은 파일 상단 Featured 섹션).

---

## 4. 주 목록 UI 구조

- **월 그룹**: `weeks`(또는 Vault용 `weeksForVault`)를 `start_date` 기준으로 `monthGroupsForVault`에 넣는다.
- **렌더**: `monthGroupsForVault.map` → 각 그룹마다 **`MonthAccordion`** → 그 **children**으로 주 카드들을 `page.tsx`가 직접 그린다.
- **제품 수 문자열**은 전부 위 3절의 `actualCount`에서만 나온다.

---

## 5. `app/weekly/MonthAccordion.tsx`

접기/펼치기, 월 라벨, `children` 슬롯만 담당한다. **`product_count` / `weeks` / DB 조회 없음.**

```1:47:app/weekly/MonthAccordion.tsx
"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

export function MonthAccordion({
  monthLabel,
  monthKey,
  currentMonthKey,
  defaultOpen,
  children,
}: {
  monthLabel: string;
  monthKey: string;
  currentMonthKey: string;
  /** When true, accordion is open on first render. Use e.g. index === 0 for first item. */
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(
    defaultOpen !== undefined ? defaultOpen : monthKey === currentMonthKey
  );
  return (
    <div className="rounded-none border border-[#E8E6E1] border-t-0 first:border-t first:rounded-t-2xl last:rounded-b-2xl overflow-hidden shadow-[0_1px_4px_0_rgb(26_25_22/0.06)] bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-8 py-5 bg-[#F8F7F4] hover:bg-[#F0EDE8] transition-colors border-b border-[#E8E6E1]"
      >
        <span className="text-xl font-bold text-[#1A1916] tracking-tight uppercase">
          {monthLabel}
        </span>
        <span
          className="text-[#1A1916] transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <ChevronDown className="w-6 h-6" strokeWidth={2.5} />
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6 pt-4 bg-[#F8F7F4] space-y-4 border-b border-[#E8E6E1]">
          {children}
        </div>
      )}
    </div>
  );
}
```

---

## 6. 결론 (동작 요약)

| 항목 | 내용 |
|------|------|
| 페칭 위치 | `app/weekly/page.tsx` — `WeeklyHubPage` 서버 컴포넌트 |
| `weeks` 소스 | Supabase `weeks` 테이블 + 중첩 `scout_final_reports(count)` |
| 화면의 “제품 수” | **`scout_final_reports?.[0]?.count`** (`actualCount`), published 리포트 개수 |
| `weeks.product_count` | SELECT에는 들어가나 **UI에서 미사용** |

참고: 개별 주 페이지 `app/weekly/[weekId]/page.tsx`에서는 `weeks`에 `product_count`를 SELECT하지만, 이번 스캔 범위(허브 `/weekly` 목록)의 카드 수치는 위와 같다.
