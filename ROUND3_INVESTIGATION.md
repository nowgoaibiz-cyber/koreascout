# ROUND 3 Investigation Report

Date: Wednesday May 13, 2026

Target: Sample Policy → Retail Purchase Link (conditional URL section)

**Method note:** 요청된 `grep`/`find`/`bash` 루프는 Windows PowerShell에서 `Select-String`·`Get-ChildItem`으로 **순차 실행**했습니다. 중간 산출물: `c:\k-productscout\round3_sample.txt`, `c:\k-productscout\round3_context.txt`.

---

## Location

**File:** `c:\k-productscout\components\report\SupplierContact.tsx`

**Section Lines:** **374–383** (바깥 `div className="mt-8"` 포함, 제목 "Sample Policy" ~ `LockedValue` 종료)

---

## Current Code

```374:383:c:\k-productscout\components\report\SupplierContact.tsx
          <div className="mt-8">
            <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">
              Sample Policy
            </p>
            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="50px">
              <p className="text-sm text-[#3D3B36] leading-relaxed">
                {report.sample_policy?.trim() || "—"}
              </p>
            </LockedValue>
          </div>
```

---

## DB Field

**필드명 (현재 코드·타입):** `sample_policy` — 자유 텍스트 (`string | null`). 리포트 행 타입: `c:\k-productscout\types\database.ts` **라인 162–163** 주석 및 정의 참고.

**조사한 URL 전용 필드:** `sample_policy_url` / `samplePolicyUrl` — 프로젝트 `*.tsx`·`*.ts`에서 **일치 없음** (신규 컬럼·타입·폼 추가가 선행될 수 있음).

**관련 참조 위치 (동일 `sample_policy` 텍스트 필드):**

| 경로 | 라인 (대략) | 용도 |
|------|----------------|------|
| `c:\k-productscout\app\admin\[id]\page.tsx` | **287** (필드 나열), **1454–1457** (라벨·폼 `value`/`onChange`) | 관리자 편집 |
| `c:\k-productscout\data\sampleReportData.ts` | **153** | 샘플 데이터 |
| `c:\k-productscout\lib\auth-server.ts` | **81** | 허용/노출 필드 목록 |

**Current label:** `"Sample Policy"` (`SupplierContact.tsx` **376**)

**Current rendering:** 알파 티어 `LockedValue` 안에서 단락 `<p>`로 `report.sample_policy`를 표시하고, 비어 있으면 **대시** `"—"` 표시. **항상** 바깥 `div`가 렌더됨(값이 없어도 섹션 제목·플레이스홀더 영역 유지).

---

## Required Changes

### 1. Label Change

- FROM: `"Sample Policy"`
- TO: `"🛒 Sample Purchase Available"`

### 2. Link Text

- FROM: 본문이 **정책 문장 전체**를 `sample_policy` 문자열로 그대로 출력 (링크 아님)
- TO: `"Delivered Korea"` (클릭 시 `sample_policy_url` 등 **URL 필드**로 이동하는 앵커 텍스트로 가정)

### 3. Disclaimer Text

Add below the link:

```
*We don't sell products directly. This link is provided 
for your convenience to purchase samples for testing.*
```

### 4. Conditional Rendering

- Show section **ONLY** if `sample_policy_url?.trim()` exists (미션 기준).
- Hide entire section if URL is null/empty.

**조사 메모:** 현재 저장소에는 `sample_policy_url`이 없으므로, 위 조건을 쓰려면 **DB·`types/database.ts`·조회·관리 폼**에 URL 컬럼을 추가한 뒤 `report`에 매핑하는 작업이 **ROUND 3 구현 전제**가 됨. 대안으로 기존 `sample_policy`를 URL로만 쓰는 것은 스키마 의미와 충돌할 수 있어 권장되지 않음(조사 의견).

---

## Implementation Strategy

- [ ] Wrap section in conditional: `{sample_policy_url?.trim() && ( ... )}` (필드 추가 후)
- [ ] Change label to `"🛒 Sample Purchase Available"` (또는 미션명에 맞춘 "Retail Purchase Link" 문구와 통일 — 스펙은 위 **Required Changes** 기준)
- [ ] Add 🛒 emoji (라벨 문자열에 포함)
- [ ] Render `<a href={...}>` (또는 `next/link`) with link text `"Delivered Korea"`
- [ ] Add disclaimer paragraph below link
- [ ] Test: section disappears when URL is null

---

## CRITICAL FINDING

- **리포트 UI의 "Sample Policy" 블록은 오직 `c:\k-productscout\components\report\SupplierContact.tsx` **374–383** 한 곳**이 핵심 구현 위치임.
- **`sample_policy_url`은 코드베이스에 없음.** 조건부 URL 섹션으로 바꾸려면 필드 도입·타입·시드·admin·API 경로를 함께 정의해야 함.

---

## END OF REPORT
