# Admin `[id]` 페이지 리디자인 — 스캔 결과 (Blueprint)

**대상 파일:** `app/admin/[id]/page.tsx`  
**스캔 일자:** 2026-04-06  
**목적:** `page.tsx` 전면 재구성 전, 현재 구조·라인 번호·상태·필드 위치를 고정한 설계용 기록. (애플리케이션 코드는 본 문서 작성 시점 기준 스냅샷.)

---

## STEP 1 — 현재 접이식 섹션 구조

### 1.1 타입·상태 변수명

- **타입:** `OpenSections` — `app/admin/[id]/page.tsx` **12행**
  - `type OpenSections = { s1: boolean; s2: boolean; s2b: boolean; s3: boolean; s4: boolean; s5: boolean; s6: boolean; s7: boolean };`
- **각 섹션 열림 여부:** `openSections.s1` … `openSections.s7` (dot 접근, **별도 boolean state 없음**)

### 1.2 `openSections` 초기값 (정확한 객체)

**위치:** **155–164행**

```ts
const [openSections, setOpenSections] = useState<OpenSections>({
  s1: false,
  s2: false,
  s2b: false,
  s3: false,
  s4: false,
  s5: false,
  s6: true,
  s7: true,
});
```

### 1.3 토글 메커니즘

- **단일 state 객체:** `openSections` 하나로 모든 섹션 관리.
- **토글 함수:** **194–196행** `toggleSection`

```ts
const toggleSection = useCallback((key: keyof OpenSections) => {
  setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
}, []);
```

- 각 섹션 헤더 `onClick`에서 `toggleSection("s1")` … `toggleSection("s7")` 호출.

---

### 1.4 섹션별 라인 번호 (토글 버튼 / 본문 div)

아래에서 **토글** = `<button type="button" … onClick={() => toggleSection("s?")}>` 전체.  
**본문** = `{openSections.s? && (` 다음의 최상위 `<div className="px-6 pb-6 …">` … `</div>`) 블록.

| 섹션 표시 이름 | state 키 | 토글 버튼 (행) | 본문 content div (행) | 비고 |
|----------------|----------|----------------|------------------------|------|
| Product Identity | `s1` | **416–423** | **425–547** | 주석: Section 1 — **414행** |
| Trend Signal Dashboard | `s2` | **553–560** | **562–625** | 주석: Section 2 — **551행** |
| Opportunity Status | `s2b` | **631–638** | **640–697** | 주석: Opportunity Status — **629행** |
| Market Intelligence | `s3` | **703–710** | **712–787** | 주석: Section 3 — **701행** |
| Social Proof & Trend Intelligence | `s4` | **793–800** | **802–1000** | 주석: Section 4 — **791행** |
| Export & Logistics Intel | `s5` | **1006–1013** | **1015–1167** | 주석: Section 5 — **1004행** |
| Launch & Execution Kit | `s6` | **1173–1180** | **1182–1272** | 주석: Section 6 — **1171행**, 기본 열림 |
| CEO Direct Input Zone | `s7` | **1277–1288** | **1290–1396** | **1276행** 래퍼 클래스가 다른 카드 스타일, 기본 열림 |

**래퍼(섹션 최외곽 `div`) 행:**  
- s1: **415–549** | s2: **551–627** | s2b: **629–699** | s3: **701–789** | s4: **791–1002** | s5: **1004–1169** | s6: **1171–1274** | s7: **1276–1398**

---

### 1.5 className 패턴 (EXACT)

| 역할 | 패턴 |
|------|------|
| **일반 섹션 래퍼** | `bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden` |
| **CEO(s7) 전용 래퍼** | `rounded-2xl border-2 border-[#16A34A] bg-white shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden` (**1276행**) |
| **토글 버튼** | `w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors` |
| **접이식 본문 영역** | `px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]` |
| **CEO 본문** | `px-6 pb-6 flex flex-col gap-5 border-t-2 border-[#16A34A]` (**1290행**) |
| **섹션 제목 텍스트 (`span`)** | `text-sm font-semibold text-[#1A1916]` |
| **열림/닫힘 표시** | `text-[#9E9C98] text-xs` — 내용 `{openSections.s? ? "▼" : "▶"}` |

---

### 1.6 참고용: 가장 작은 완전한 섹션 JSX (Opportunity Status, `s2b`)

**행 629–699** — 필드 3개로 접이 블록이 가장 짧음.

```tsx
        {/* Opportunity Status — Trend Signal area (editable) */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s2b")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Opportunity Status</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s2b ? "▼" : "▶"}</span>
          </button>
          {openSections.s2b && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>GAP STATUS (갭 상태)</label>
                <select
                  value={formData.gap_status ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, gap_status: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">—</option>
                  {formData.gap_status &&
                    !GAP_STATUS_OPTIONS.includes(
                      formData.gap_status as (typeof GAP_STATUS_OPTIONS)[number]
                    ) && (
                      <option value={formData.gap_status}>{formData.gap_status}</option>
                    )}
                  {GAP_STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>GO VERDICT (최종 판정)</label>
                <select
                  value={formData.go_verdict ?? ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p!,
                      go_verdict: e.target.value === "" ? null : e.target.value,
                    }))
                  }
                  className={inputClass}
                >
                  <option value="">—</option>
                  {formData.go_verdict &&
                    !GO_VERDICT_OPTIONS.includes(
                      formData.go_verdict as (typeof GO_VERDICT_OPTIONS)[number]
                    ) && (
                      <option value={formData.go_verdict}>{formData.go_verdict}</option>
                    )}
                  {GO_VERDICT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>OPPORTUNITY REASONING (기회 근거)</label>
                <textarea
                  rows={4}
                  value={formData.opportunity_reasoning ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, opportunity_reasoning: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          )}
        </div>
```

**비고 (중복 필드):** 동일 DB 필드가 다른 섹션에도 존재함 — 리디자인 시 정리 필요.

- `gap_status`: **s2b**는 `<select>` (**641–660**). **Social Proof (s4)** 에는 `<input>` 텍스트 (**882–888**).
- `opportunity_reasoning`: **s2b** (**688–696**)와 **s4** (**890–897**) 모두 `<textarea>`, 같은 `formData.opportunity_reasoning`.

---

## STEP 2 — 필드 이동·섹션 변경 (계획과 현재 위치 매핑)

아래는 **현재 코드 기준 라인**과 사용자 제안 **MOVES**를 함께 기록.

### 2.1 이동이 필요한 필드 (현재 위치)

| 필드 | 현재 UI 위치 (섹션 / 대략 행) | 이동 방향 (계획) |
|------|------------------------------|------------------|
| `wow_rate` | Trend (s2) **591–597** | → Market Intelligence |
| `mom_growth` | Trend (s2) **599–605** | → Market Intelligence |
| `new_content_volume` | Market (s3) **746–752** | → Trend Signal Dashboard |
| `platform_scores` | Social Proof (s4) **953–978** | → Trend Signal Dashboard |
| `gap_status` (select) | Opportunity (s2b) **641–660** | → Trend (select만 유지) |
| `go_verdict` (select) | Opportunity (s2b) **662–686** | → Product Identity (읽기 전용 **523–525** 제거·단일 select로) |
| `opportunity_reasoning` | s2b **688–696**, s4 **890–897** (중복) | → Social Proof (s4 한 곳으로 merge) |
| `export_status` | Product Identity **485–495** | 유지 |
| `naver_link` | Product Identity **531–537** | 유지 (Launch에도 표시 예정) |
| `global_prices` | Market (s3) **772–785** (`GlobalPricesHelper`) | → 신규 마지막 섹션 “Global Prices” |

### 2.2 삭제 예정 섹션 (UI)

- **Opportunity Status (`s2b`)** — **629–699행** 블록 전체. 필드는 위 표대로 다른 섹션에 흡수.
- **CEO Direct Input Zone (`s7`)** — **1276–1398행** 블록. **Launch & Execution Kit (`s6`)** 과 단일 **“Launch Kit”** 으로 통합 예정.

### 2.3 병합·신규 (계획 요약)

- **Launch & Execution Kit (`s6`)** + **CEO Direct Input (`s7`)** → 하나의 **Launch Kit**.
- **Social Proof** 하단: **“Scout Strategy Report (Steps 1–3)”** 서브섹션 추가.
- **Export & Logistics** 하단: **“Compliance & Logistics Strategy (Steps 4–5)”** 서브섹션 추가.
- **마지막 신규 섹션:** **Global Prices** (`global_prices` 이동).

### 2.4 리디자인 시 state 키 정리 참고

- 현재 `openSections`는 `s1`…`s7` 및 **`s2b`**. 섹션 삭제·병합 후 `OpenSections` 타입·초기값·`toggleSection` 인자 전부 재정의 필요.

---

## STEP 3 — `sourcing_tip` 처리

### 3.1 현재 위치

- **Social Proof & Trend Intelligence (s4)** 블록 안  
- **라벨 행:** **981행** (`Sourcing Tip (소싱팁)`)  
- **`<textarea>`:** **982–988행**

### 3.2 저장·업데이트

- **State:** `formData` (`useState<Partial<ScoutFinalReportsRow> | null>`), 컬럼 `sourcing_tip` (**149행** 타입은 row 기준).
- **표시:** `value={formData.sourcing_tip ?? ""}`
- **onChange (정확한 코드):** **985행**

```tsx
onChange={(e) => setFormData((p) => ({ ...p!, sourcing_tip: e.target.value }))}
```

- PATCH 저장 시 `formKeys`에 `sourcing_tip` 포함 (**207행**), 별도 변환 없이 `updates`에 포함 (**232행** 근처 스프레드).

### 3.3 향후: 5개 textarea ↔ 단일 컬럼 `[Header]` 포맷

- 단일 문자열 `sourcing_tip`을 **파싱/직렬화**할 때 `components/report/utils.ts`의 **`parseSourcingStrategy`** 로직을 재사용·역함수(serialize) 설계.

---

## `parseSourcingStrategy` — `components/report/utils.ts` (EXACT 로직)

**위치:** **70–103행** (`export function parseSourcingStrategy`)

요약:

1. **입력:** `raw: string | null | undefined`
2. **`null`/빈 문자열:** `[]` 반환
3. **헤더 탐색:** 정규식 `/(?:^|\n)\s*\[([^\n]*?)\]/g`  
   - 줄 시작 또는 개행 뒤, 선택적 공백, `[...]` 한 줄 전체가 **섹션 헤더** (내용은 `]` 안의 캡처 그룹, `trim`).
4. **매치가 하나도 없을 때:**  
   - `raw.trim()` 이 있으면 단일 스텝  
     `{ icon: "📋", label: "Strategy Overview", color: "emerald", content: raw.trim() }`  
   - 없으면 `[]`
5. **매치가 있을 때:**  
   - `iconColorList` 5개 슬롯을 순환 (`i % 5`):  
     `[📈 emerald, 💰 amber, 🏭 blue, 📋 red, 📦 purple]`
   - 각 구간 `i`에 대해: 본문은 **현재 헤더 직후**부터 **다음 헤더 index 전** (`raw.slice(startIdx, endIdx).trim()`).
6. **반환:** `StrategyStep[]` — 각 `{ icon, label: matches[i].title, color, content }`

역직렬화(저장) 시에는 동일한 `[Title]` 줄 경계로 5개 블록을 이어 붙이면 컬럼 하나에 보존 가능 (구체 포맷은 구현 단계에서 헤더 명명 규칙과 함께 고정).

---

## 부록: 접이식이 아닌 하단 블록

- **수정 이력 (Edit History):** **1400–1450행** — `openSections` 없음, 항상 표시되는 카드.

---

*본 문서는 리디자인 구현 시 라인 번호 기준점으로 사용; `page.tsx` 변경 후에는 섹션 행 번호를 다시 스캔할 것.*
