# ROUND 2 Investigation Report

Date: Wednesday May 13, 2026

Target: Conditional Rendering & Button Functionality

**Method note:** 요청된 `grep`/`sed`/`bash` 루프는 Windows PowerShell에서 `Select-String` 및 라인 슬라이스로 **동일 순서**로 실행했습니다. 중간 산출물: `c:\k-productscout\round2_compliance.txt`, `round2_pricing_button.txt`, `round2_code_context.txt`.

---

## TARGET 1: Compliance Note Conditional Rendering

### Location

**File:** `c:\k-productscout\components\report\SupplierContact.tsx`

**Section Lines:** **385–394** (바깥 컨테이너 `div` 포함: 제목 "Compliance Note" ~ `LockedValue` 종료)

### Current Code

```385:394:c:\k-productscout\components\report\SupplierContact.tsx
          <div className="mt-6">
            <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">
              Compliance Note
            </p>
            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="50px">
              <p className="text-sm text-[#3D3B36] leading-relaxed">
                {report.export_cert_note?.trim() || "—"}
              </p>
            </LockedValue>
          </div>
```

### DB Field for Conditional Check

**Field name:** `export_cert_note` (리포트 객체 `report`에서 사용; 스네이크 케이스)

**추가 참조 (관리 UI, 동일 필드):** `c:\k-productscout\app\admin\[id]\page.tsx` — 예: 라인 **1464–1465** (`formData.export_cert_note`), 스키마/필드 나열 **287** 근처.

**Check logic:** 현재는 값이 비어도 섹션은 항상 렌더되고, 본문만 `export_cert_note?.trim()`이 없을 때 `"—"`로 표시됨. DB가 null/빈 문자열이면 **섹션 자체를 숨기려면** `export_cert_note?.trim()` truthy 여부로 바깥 `div`를 감싸는 조건이 필요함.

**CGMP / ISO 22716 / HALAL:** 프로젝트 `*.tsx` 전역 검색에서 **문자열 일치 없음** (정적 UI에 하드코딩되어 있지 않음; 인증 문구는 DB 노트 등에만 있을 수 있음).

### Implementation Strategy

- [ ] Add conditional: `{report.export_cert_note?.trim() && ( ... )}` (또는 `Boolean(report.export_cert_note?.trim())`)
- [ ] OR check multiple fields: `{(field1 || field2 || field3) && ( ... )}` — *현재 코드베이스에서는 Compliance 블록이 `export_cert_note`만 사용*
- [ ] Verify section disappears when DB value is null/empty

---

## TARGET 2: Analyze Pricing Sources Button

### Location

**File:** `c:\k-productscout\components\report\MarketIntelligence.tsx`

**Lines:** **375–377** (`ScrollToIdButton` 래퍼), 라벨 텍스트는 **376**

### Current Code

```375:377:c:\k-productscout\components\report\MarketIntelligence.tsx
                  <ScrollToIdButton sectionId="global-market-proof" className="text-base font-bold text-[#16A34A] hover:underline transition-colors block mt-[0.6cm]">
                    Analyze Pricing Sources &amp; Entry Points ↓
                  </ScrollToIdButton>
```

### Current onClick Handler

별도 `onClick` prop은 없음. `ScrollToIdButton` 내부에서 `button`의 `onClick`이 `document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })`로 동작함.

```13:16:c:\k-productscout\components\ScrollToIdButton.tsx
    <button
      type="button"
      onClick={() => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })}
      className={className}
```

### Target Scroll Section

**의도된 Section ID:** `global-market-proof` (`sectionId`와 일치해야 스크롤 동작)

**"Global Market Proof" UI 위치:** `c:\k-productscout\components\report\SupplierContact.tsx` **396–407** (제목 및 `LockedValue` 블록)

```396:407:c:\k-productscout\components\report\SupplierContact.tsx
          <div className="mt-8">
            <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-6">
              Global Market Proof
            </p>
            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="100px">
              {globalProofTags.length > 0 ? (
                <GlobalProofAccordion tags={globalProofTags} />
              ) : (
                <p className="text-sm italic text-[#9E9C98]">No global listings found.</p>
              )}
            </LockedValue>
          </div>
```

**중요:** `SupplierContact.tsx` 내 `Global Market Proof` 구간에 **`id="global-market-proof"` 요소가 없음** (`id=` 검색은 Google 썸네일 URL용 `id` 파라미터 한 건만 매칭). 따라서 버튼은 이미 `ScrollToIdButton`을 쓰지만, **스크롤 앵커가 DOM에 없으면 `getElementById`가 null**이 되어 스크롤이 실행되지 않을 수 있음. (과거/문서 예시: `_docs/*.md` 등에만 `id="global-market-proof"` 마크업이 등장)

### Implementation Strategy

- [x] Wrap in ScrollToIdButton component — **이미 적용됨** (375–377)
- [ ] OR add onClick handler with smooth scroll — *컴포넌트 내부에 이미 존재; 필요 시 앵커 추가가 우선*
- [ ] Verify scroll works to correct section — **`SupplierContact.tsx`에 `id="global-market-proof"`(및 권장 시 `scroll-mt-*`) 추가 검증 필요**

### Available Components

**ScrollToIdButton:** **Yes** — `MarketIntelligence.tsx` 라인 **5**에서 import.

**Usage example:** 앱 내 `*.tsx`에서는 **본 파일(`MarketIntelligence.tsx`)이 유일 사용처**(정의 파일 `ScrollToIdButton.tsx` 제외).

---

## CRITICAL FINDINGS

### Compliance Note Dependencies

- `report.export_cert_note` (리포트 타입/쿼리에서 로드되는 필드)
- `LockedValue`, `canSeeAlpha` (티어 게이팅; 조건부 표시와는 별개로 알파 잠금 UI 유지 여부 결정)
- 컴포넌트: `c:\k-productscout\components\report\SupplierContact.tsx`

### Pricing Button Dependencies

- **ScrollToIdButton import:** 있음 (`MarketIntelligence.tsx:5`)
- **Target section ID:** `global-market-proof` — **현재 리포트 UI의 해당 섹션에 동일 `id` 부재**로 스크롤 타겟 불일치 가능성이 핵심 리스크

---

## READY FOR EXECUTION

- File locations confirmed
- Line numbers identified
- Code context reviewed
- Implementation strategy clear

**STATUS:** Ready for ROUND 2 execution prompt

---

## END OF REPORT
