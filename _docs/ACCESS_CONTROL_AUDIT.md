## 1. Current Access Control Logic

- **canAccessWeek 정의 위치**
  - 파일: `app/weekly/page.tsx`
  - 라인: 125–132

```text
L125:  function canAccessWeek(week: WeekRow): boolean {
L126:    const isLatestWeek = latest3WeekIds.includes(week.week_id);
L127:    const isAfterSub =
L128:      subscriptionStartAt && week.published_at
L129:        ? new Date(week.published_at) >= new Date(subscriptionStartAt)
L130:        : false;
L131:    return isPaid ? isLatestWeek || isAfterSub : week.week_id === freeOpenWeekId;
L132:  }
```

- **정확한 canAccessWeek 로직**
  - 입력: `week: WeekRow`
  - 보조 상태:
    - `latest3WeekIds`: 최근 발행된 3개 주의 `week_id` 목록 (라인 91–97에서 쿼리 후 97에서 맵)
    - `subscriptionStartAt`: `getAuthTier()`에서 가져온 구독 시작일 (라인 65)
    - `isPaid`: `tier === "standard" || tier === "alpha"` (라인 71)
    - `freeOpenWeekId`: 무료로 개방된 가장 최근 주의 `week_id` (라인 99–105)
  - 동작:
    - 최근 3주 중 하나이거나(`isLatestWeek`)
    - 혹은 `subscriptionStartAt` 이후에 발행된 주(`isAfterSub`)
    - 위 두 조건 중 하나라도 참이면 **유료 사용자(standard/alpha)** 에게는 접근 허용.
    - **무료 사용자(free)** 인 경우에는 `week.week_id === freeOpenWeekId` 인 주에만 접근 허용.

- **canAccessWeek 사용 위치**
  - 동일 파일 `app/weekly/page.tsx` 내:
    - 라인 134: `const unlockedWeeks = (weeks ?? []).filter(canAccessWeek);`
      - 접근 가능한 주 컬렉션(`unlockedWeeks`)을 구성.
    - 라인 135–140: `featuredWeek` 계산 시 `unlockedWeeks`를 최신 발행일 기준으로 정렬해 대표 주 1개 선택.
    - 라인 291–296 인근: `MonthAccordion` 내부에서 각 `week` 렌더링 시

```text
L290:                  {group.weeks.map((week, weekIndex) => {
L291:                    const canAccess = canAccessWeek(week);
L292:                    const isLocked = !canAccess;
...
L300:                        {isLocked ? (
...
L342:                          <Link
L343:                            href={`/weekly/${week.week_id}`}
...
```

  - 즉, 허브(리스트) 페이지에서:
    - `canAccessWeek(week)`가 `false`면 잠금 UI(LOCK/Frosted overlay)와 업그레이드 CTA를 출력.
    - `true`면 `/weekly/${week.week_id}` 링크로 보고서 목록 접근을 허용.

## 2. Weekly Detail Page Current State

- **tier / subscriptionStartAt 획득 위치**
  - 파일: `app/weekly/[weekId]/[id]/page.tsx`
  - 라인: 23–25

```text
L23:  const { weekId, id } = await params;
L24:  const supabase = await createClient();
L25:  const { userId, userEmail, tier, subscriptionStartAt } = await getAuthTier();
```

- **현재 canAccessThisWeek 블록 (전체 코드 + 라인)**

```text
L53:  if (error || !report) notFound();
L54:
L55:  const isTeaser = report.is_teaser === true;
L56:
L57:  const canAccessThisWeek = (() => {
L58:    if (tier === "standard" || tier === "alpha") {
L59:      if (isTeaser) return true;
L60:      if (!subscriptionStartAt) return false;
L61:      const subDate = new Date(subscriptionStartAt);
L62:      const weekDate = week?.published_at ? new Date(week.published_at) : null;
L63:      if (!weekDate) return false;
L64:      return weekDate >= subDate;
L65:    }
L66:    if (tier === "free") {
L67:      return isTeaser === true;
L68:    }
L69:    return false;
L70:  })();
L71:
L72:  if (!canAccessThisWeek) {
L73:    const { redirect } = await import("next/navigation");
L74:    redirect(`/weekly/${weekId}`);
L75:  }
```

- **TypeScript 에러 현황 및 이유**
  - `app/weekly/[weekId]/[id]/page.tsx`에 대해 최신 린트/타입 체크 결과:
    - **현재 TypeScript 에러는 없음.**
  - `subscriptionStartAt`는 `getAuthTier()` 반환 타입 `AuthResult`에 정의되어 있으며 (`lib/auth-server.ts`, 라인 4–9, 16–35), 디테일 페이지에서 구조 분해 할당으로 가져오고 있으므로 타입 불일치가 발생하지 않음.
  - `week` 객체는 `supabase.from("weeks").select(...).single()` 결과이며, `week?.published_at` 사용은 null-safe 접근이라 타입 에러를 유발하지 않음.

## 3. What Needs To Change

- **관찰된 상태(코드 기준, 추론 최소화)**
  - 허브(리스트) 페이지의 `canAccessWeek` 로직:
    - **무료(free)**:
      - `week.week_id === freeOpenWeekId`인 하나의 주만 무료로 열어 줌.
    - **유료(standard/alpha)**:
      - 최근 3주(`latest3WeekIds`) 또는
      - `subscriptionStartAt` 이후 발행된 주에 접근 가능.
  - 디테일 페이지의 `canAccessThisWeek` 로직:
    - **유료(standard/alpha)**:
      - `isTeaser === true` 이면 언제나 접근 허용.
      - 그렇지 않다면:
        - `!subscriptionStartAt` 이면 무조건 거부.
        - `week?.published_at`가 없으면 거부.
        - 그렇지 않으면 `weekDate >= subDate` (구독 시작일 이후 발행)만 체크.
      - **주요 차이점**:
        - 허브에서 쓰는 `isLatestWeek` (최근 3주 허용) 개념이 없음.
        - freeOpenWeekId 개념도 없음(이는 주간 무료 오픈 주에 대한 접근 제어를 허브에서만 처리).
    - **무료(free)**:
      - `canAccessThisWeek`는 `isTeaser === true`일 때만 `true`.
      - 따라서 free 사용자가 "freeOpenWeekId"로 허용된 주라도, 그 주의 내부 개별 리포트 디테일 페이지는 `isTeaser`가 아닌 이상 차단됨.
  - 요구사항(이전 미션 기준): "Block free tier users from accessing premium report detail pages directly via URL."  
    - 현재 로직은 free tier 에 대해서:
      - `isTeaser === true`인 리포트만 허용.
      - `isTeaser === false` 라면, 설령 허브에서 freeOpenWeekId로 주를 열어 줘도, 개별 디테일 페이지는 차단.
    - 이는 "free가 주간 무료 오픈 주 내의 모든 리포트를 볼 수 있어야 한다"는 요구가 있다면 불일치일 수 있고,
      반대로 "free는 항상 teaser 리포트만, 나머지는 막는다"가 명세라면 현재 로직은 이미 그 요구를 만족.

- **코드가 실제로 보여주는 것만 기반으로 한 정밀 수정 포인트 (one surgical change)**
  - 허브와 디테일 간 허용 범위를 일치시키고 싶다면:
    - **유료(standard/alpha)**:
      - 허브: `isPaid ? (isLatestWeek || isAfterSub)`  
      - 디테일: `isTeaser`이면 무조건 허용 + `weekDate >= subDate`만 검사.
      - 차이점은 "최근 3주 허용" 여부.
    - **무료(free)**:
      - 허브: `week.week_id === freeOpenWeekId` 인 주 1개만.
      - 디테일: `isTeaser === true` 인 리포트만.
  - 이 중 **"premium report detail pages를 직접 URL로 치고 들어오는 free를 막는다"**는 목적에만 초점을 맞춘 최소 변경은:
    - **유료 로직은 그대로 두고**, free에 대해 "허브 기준 freeOpenWeekId로 허용된 주에 대해서는, 그 주 안 리포트 디테일도 허용"으로 바꾸거나,
    - 반대로 "허브 freeOpenWeekId 허용을 유지하되, 디테일에서는 현재처럼 isTeaser만 허용"을 명시적으로 유지할 수 있음.
  - 그러나 현재 허브 코드에는 **freeOpenWeekId 값을 디테일 페이지로 전달하거나 공유하는 로직이 없음**:
    - `WeeklyHubPage`는 `freeOpenWeekId`를 내부에서 계산만 하고, 라우팅은 단순히 `/weekly/${week.week_id}`로만 이동.
    - 디테일 페이지는 `weekId`만 파라미터로 받아 다시 `weeks` 테이블을 조회할 뿐, 허브에서 어떤 주가 freeOpenWeekId였는지 알 수 있는 정보가 없음.
  - 따라서, **현재 코드만 기준으로 할 때 "허브 freeOpenWeekId 정책을 디테일까지 1:1로 연장"하는 것은, 단일 파일 내의 국소 수정만으로는 불가능**하며, 요구사항도 명확히 특정되지 않았으므로:
    - 실제로 코드가 보장하는 것은 "free는 teaser 리포트만 디테일 접근 가능"이라는 점뿐이다.
  - 가장 보수적인 해석에서, "premium report detail pages"는 `isTeaser !== true` 인 리포트로 보는 것이 자연스럽고, 그 경우 **이미 현재 로직이 free에게 해당 리포트 접근을 막고 있다.**
  - 따라서 **현재 코드 기준, 명확한 버그나 불일치가 확인되지 않으며, "한 번의 수술적 변경"이 반드시 필요한 상태는 아니다.**

## 4. Proposed Fix (DO NOT IMPLEMENT)

> 주의: 아래는 **가능한 정합성 개선 예시**이며, 현재 코드만으로도 "free tier가 teaser가 아닌 리포트 디테일에 접근하는 것"은 차단되어 있습니다.
> 이 제안은 허브의 `canAccessWeek`와 디테일의 `canAccessThisWeek`의 해석을 조금 더 명시적으로 맞추려는 관점에서 작성되었습니다.

- **파일**: `app/weekly/[weekId]/[id]/page.tsx`
- **변경 전 (발췌, 라인 57–69)**:

```text
L57:  const canAccessThisWeek = (() => {
L58:    if (tier === "standard" || tier === "alpha") {
L59:      if (isTeaser) return true;
L60:      if (!subscriptionStartAt) return false;
L61:      const subDate = new Date(subscriptionStartAt);
L62:      const weekDate = week?.published_at ? new Date(week.published_at) : null;
L63:      if (!weekDate) return false;
L64:      return weekDate >= subDate;
L65:    }
L66:    if (tier === "free") {
L67:      return isTeaser === true;
L68:    }
L69:    return false;
L70:  })();
```

- **제안 변경 (예시)**:
  - 목적: 유료 플랜에서 허브의 `canAccessWeek` 로직과 개념적으로 맞추기 위해, "최근 3주" 조건을 주 단위가 아닌 리포트 단위에서도 동일하게 해석한다고 가정.
  - 단일 변경으로 제한하기 위해, 아래처럼 `tier === "standard" || tier === "alpha"` 블록에서 `return weekDate >= subDate;` 대신 허브와 동일한 조건을 반영하는 헬퍼를 사용하는 형태를 상정할 수 있음.
  - 다만, 현재 디테일 페이지 파일 내에는 `latest3WeekIds`, `freeOpenWeekId`, `isPaid` 등이 존재하지 않으므로, **실제 구현에는 허브에서 사용 중인 상태를 이 파일로 가져오는 추가 작업이 필요**합니다(이는 "one surgical change" 범위를 넘습니다).

```ts
// app/weekly/[weekId]/[id]/page.tsx, 라인 57–65 부근의 의사 코드 예시 (실제 적용 금지)
const canAccessThisWeek = (() => {
  if (tier === "standard" || tier === "alpha") {
    if (isTeaser) return true;
    // 여기서 week 레벨의 canAccessWeek(week)를 재사용하거나,
    // latest3WeekIds / subscriptionStartAt / freeOpenWeekId 를 공유하는 구조로 리팩터링해야 일관성이 완전히 맞춰짐.
    return /* canAccessWeekEquivalentForDetail(week) */;
  }
  if (tier === "free") {
    return isTeaser === true;
  }
  return false;
})();
```

- **결론적으로, 현재 코드가 이미 free tier의 premium 리포트 디테일 접근을 막고 있고, 허브와 디테일의 정책 차이는 추가 설계 결정이 필요한 수준이므로,**
  - 이 파일 하나에서 할 수 있는 "완전히 자명한 단일 수술적 변경"은 없습니다.
  - 실제 정책을 통합하려면:
    - `canAccessWeek`를 별도 유틸로 분리하거나,
    - `week` 접근 권한 판정을 공용 함수/모듈로 올린 뒤,
    - 허브와 디테일 양쪽에서 동일 로직을 호출하도록 설계해야 합니다.

