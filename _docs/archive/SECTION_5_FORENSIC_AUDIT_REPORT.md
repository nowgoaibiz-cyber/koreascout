# Section 5 포렌식 감사 보고서 (Read-Only)

**파일:** `app/weekly/[weekId]/[id]/page.tsx`  
**감사일:** 2025-03-04  
**원칙:** 코드 수정 없음, 읽기 전용 조사만 수행.

---

## 1. 컴포넌트 위치 & 라인 범위

| 항목 | 값 |
|------|-----|
| **섹션 DOM ID** | `section-5` |
| **컴포넌트 이름** | `SourcingIntel` |
| **함수 정의 시작** | **1112행** (`function SourcingIntel({`) |
| **함수 정의 끝** | **1410행** (`}`) |
| **`<section id="section-5">`** | **1144행** |
| **섹션 제목(UI)** | "Export & Logistics Intel" |

**참고:** 네비게이션에서 Section 4 = "Social Proof", Section 5 = "Export & Logistics".  
"Social Proof & Trend Intelligence"는 **Section 4** (`SocialProofTrendIntelligence`, `id="section-4"`)이며, 본 감사 대상은 **Section 5 = Export & Logistics Intel (SourcingIntel)** 이다.

---

## 2. JSX 구조 요약 (메인 컨테이너 → 서브 블록 계층)

```
<section id="section-5"> (relative, scroll-mt, border, shadow)
├── <h2> Export & Logistics Intel
├── Block 1: Export Readiness (canSeeAlpha ? 상세 : 플레이스홀더)
├── Block 2: HS Code & Classification (canSeeAlpha ? 상세/없음 분기 : 플레이스홀더)
├── Block 3: Broker Email Draft (canSeeAlpha && hs_code ? <BrokerEmailDraft /> : 플레이스홀더 문구)
├── Block 4: Weight & Shipping (canSeeAlpha ? IIFE로 hasActual/hasVol/hasBillable 분기 : 플레이스홀더)
├── Block 5: Hazmat & Compliance (canSeeAlpha ? HazmatBadges + 인증/리스크 : 플레이스홀더)
├── Block 6: Product Specs (조건: composition_info || spec_summary; canSeeAlpha ? ExpandableText : 플레이스홀더)
├── Block 7: Shipping Notes (IIFE: notes 없거나 /tier/i 매칭 시 null, else canSeeAlpha 분기)
├── Block 8: Compliance & Logistics Strategy (IIFE: parseSourcingStrategy → slice(3,5); canSeeAlpha ? 스텝 리스트 : 플레이스홀더)
└── Alpha Lock Overlay (!canSeeAlpha 시 절대 위치 CTA 레이어)
```

- **자식 컴포넌트:** `BrokerEmailDraft`, `HazmatBadges`, `ExpandableText`, `CopyButton`, `Button`, `Lock` (lucide), `CheckCircle`, `AlertTriangle`, `XCircle`, `ArrowRight`.
- **유틸:** `formatHsCode`, `describeShippingTier`, `parseSourcingStrategy`.

---

## 3. DB 필드 매핑 테이블 (UI 요소 → report.* 필드명)

| UI 요소 | report 필드 | 비고 |
|---------|-------------|------|
| Export Readiness 상태/아이콘/라벨 | `report.export_status` | "Green" \| "Yellow" \| 기타(Red) |
| Export 상태 사유 | `report.status_reason` | `.trim()` 체크 후 표시 |
| HS 코드 | `report.hs_code` | `formatHsCode(report.hs_code) \|\| report.hs_code`, CopyButton |
| HS 설명 | `report.hs_description` | optional |
| Broker Email Draft | (BrokerEmailDraft에 report 전체 전달) | `report.hs_code?.trim()` 있을 때만 블록 표시 |
| Actual Weight | `report.actual_weight_g` | 숫자(gram), `!= null` 체크 |
| Volumetric Weight | `report.volumetric_weight_g` | 동일 |
| Billable Weight | `report.billable_weight_g` | 동일, 강조 스타일 |
| Dimensions | `report.dimensions_cm` | `.trim()` 체크 |
| Shipping tier 배지 | `report.shipping_tier` | `describeShippingTier(report.shipping_tier)` |
| Hazmat 배지 | `report.hazmat_status` | JSONB, `HazmatBadges`에 as unknown 전달 |
| Risk Ingredient | `report.key_risk_ingredient` | `.trim()` 체크 |
| Certifications Required | `report.required_certificates` | `split(",").map(...trim)` |
| Ingredients (Product Specs) | `report.composition_info` | `ExpandableText` |
| Specifications | `report.spec_summary` | `ExpandableText` |
| Shipping Notes | `report.shipping_notes` | `.trim()`, `/tier/i` 테스트 시 블록 비표시 |
| Compliance & Logistics Strategy 스텝 | `report.sourcing_tip` | `parseSourcingStrategy(report.sourcing_tip)` → `slice(3, 5)` (Step 4–5) |

---

## 4. Tailwind 클래스 목록 (Section 5 범위, 컨테이너별)

- **섹션 루트:** `scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] relative`
- **h2:** `text-3xl font-bold text-[#1A1916] mb-4 tracking-tight`
- **블록 제목(공통):** `text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2` (또는 mb-3)
- **카드/박스:** `p-4 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4]`, `rounded-lg border px-3 py-2 flex-1`
- **플레이스홀더:** `h-16 w-full rounded-xl bg-[#F2F1EE]`, `h-20`, `h-24`, `h-12` 등
- **아이콘:** `w-5 h-5 text-[#16A34A] shrink-0` (녹색), `text-[#D97706]`, `text-[#DC2626]`, `w-4 h-4 text-[#9E9C98]`
- **텍스트:** `text-sm text-[#6B6860] leading-relaxed`, `text-xs text-[#9E9C98]`, `text-4xl font-mono font-bold text-[#1A1916] tracking-tight`, `text-2xl font-mono font-semibold text-[#1A1916]` / `text-[#16A34A]`
- **Weight 그리드:** `flex flex-col sm:flex-row items-center gap-4 mb-3`, `flex-1 min-w-0 p-4 rounded-xl border ... text-center`
- **Billable 강조 박스:** `border border-[#BBF7D0] bg-[#DCFCE7]`
- **Strategy 스텝:** `space-y-3`, `bg-white rounded-lg border border-[#E8E6E1] p-4`, `whitespace-pre-line`
- **Alpha Lock Overlay:** `absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col items-center justify-end pb-6 gap-3 rounded-2xl`

---

## 5. 하드코딩 컬러 & 간격값 목록

**헥스 컬러 (Section 5 내):**

| 헥스 | 용도 |
|------|------|
| `#1A1916` | 제목/강조 텍스트 |
| `#3D3B36` | 본문 텍스트 |
| `#6B6860` | 보조 텍스트 |
| `#9E9C98` | 레이블/플레이스홀더 텍스트 |
| `#E8E6E1` | 테두리/구분선 |
| `#F8F7F4` | 카드 배경 |
| `#F2F1EE` | 플레이스홀더/블러 영역 배경 |
| `#16A34A` | 성공/Green/Billable 강조 |
| `#DCFCE7`, `#BBF7D0` | Green 배경/테두리 |
| `#D97706` | Yellow 경고 |
| `#FEF3C7`, `#FDE68A` | Yellow 배경/테두리 |
| `#DC2626` | Red/제한 |
| `#FEE2E2`, `#FECACA` | Red 배경/테두리 |

**고정 간격/크기:**  
`scroll-mt-[160px]`, `p-6`, `mb-6`, `mb-4`, `mb-3`, `mb-2`, `mb-1`, `mt-1`, `mt-2`, `gap-3`, `gap-4`, `rounded-2xl`, `rounded-xl`, `rounded-lg`, `shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]`.

---

## 6. Conditional / Defensive 로직 현황

- **tier 분기:** `canSeeAlpha = tier === "alpha" \|\| isTeaser` (1140행). 모든 블록에서 `canSeeAlpha ? 실제 콘텐츠 : 플레이스홀더` 패턴 사용.
- **Optional chaining / null 대비:**  
  `report.status_reason?.trim()`, `report.hs_code?.trim()`, `report.hs_description?.trim()`, `report.dimensions_cm?.trim()`, `report.shipping_tier?.trim()`, `report.key_risk_ingredient?.trim()`, `report.required_certificates?.trim()`, `report.composition_info?.trim()`, `report.spec_summary?.trim()`, `report.shipping_notes?.trim()`.
- **숫자 null 체크:**  
  `report.actual_weight_g != null`, `report.volumetric_weight_g != null`, `report.billable_weight_g != null` (hasActual, hasVol, hasBillable).  
  세 값 모두 있을 때만 배송 문구 표시: `report.volumetric_weight_g > report.actual_weight_g` 비교.
- **Broker 블록:** `canSeeAlpha && report.hs_code?.trim()` 일 때만 BrokerEmailDraft 렌더.
- **Product Specs 블록:** `(report.composition_info?.trim() \|\| report.spec_summary?.trim())` 일 때만 블록 존재.
- **Shipping Notes:** IIFE 내부에서 `const notes = report.shipping_notes?.trim(); if (!notes \|\| /tier/i.test(notes)) return null;`
- **Strategy Block 8:** `parseSourcingStrategy(report.sourcing_tip)` → `allSteps.slice(3, 5)` → `logisticsSteps.length === 0` 이면 `return null`.
- **타입 단언:** `report.hazmat_status as unknown` (HazmatBadges에 전달).

---

## 7. Strategy Steps 파싱 방식

- **함수:** `parseSourcingStrategy(raw)` (140–184행). `raw`는 `report.sourcing_tip` (string \| null \| undefined).
- **동작:**  
  - `raw` 없으면 `[]` 반환.  
  - 5개 정규식 패턴으로 스텝 구간 추출:  
    `[마케팅 전략]`, `[가격/· 마진 전략]`, `[B2B 소싱 전략]`, `[통관/· 규제 전략]`, `[물류/· 배송 전략]`.  
  - 각 매칭 구간의 텍스트를 `content`로, 고정 `label`/`icon`/`color`와 함께 `StrategyStep` 배열로 반환.
- **Section 5에서 사용:**  
  `const allSteps = parseSourcingStrategy(report.sourcing_tip);`  
  `const logisticsSteps = allSteps.slice(3, 5);`  
  → **Step 4(통관/규제)** 와 **Step 5(물류/배송)** 만 "Compliance & Logistics Strategy" 블록에 표시.  
  UI에서는 `Step {i + 4}` 로 "Step 4", "Step 5" 라벨 부여.

---

## 8. LockedSection 조건 (tier 분기)

**페이지 레벨 (Section 5 노출 여부):**

- `hasLogistics` (1925–1938행):  
  `report.hs_code`, `hs_description`, `hazmat_status`, `dimensions_cm`, `billable_weight_g`, `shipping_tier`, `required_certificates`, `shipping_notes`, `key_risk_ingredient`, `status_reason`, `actual_weight_g`, `volumetric_weight_g`, `sourcing_tip` 중 하나라도 값이 있으면 true.
- `canSeeStandard = tier === "standard" \|\| tier === "alpha" \|\| isTeaser` (1921행).
- **렌더링:**  
  `hasLogistics && (canSeeStandard ? <SourcingIntel ... /> : <LockedSection {...SECTION_ALPHA_SOURCING_CTA} />)`  
  → Free tier이고 로직 데이터가 있으면 Section 5 자리에 **LockedSection** (메시지: "You know what sells. Now learn how to ship it.", CTA: "Unlock Logistics Intel — $29/mo →").

**SourcingIntel 내부 (알파 잠금):**

- `canSeeAlpha = tier === "alpha" \|\| isTeaser`.  
  Standard 사용자는 Section 5는 보이지만, 블록별로 **플레이스홀더**만 보이고, 하단 **Alpha Lock Overlay** (absolute CTA)가 노출됨.
- 별도 `LockedSection` 컴포넌트는 Section 5 **내부**에서는 사용하지 않음. Overlay는 인라인 JSX (`!canSeeAlpha && ( ... )`).

---

**감사 완료.** 코드 변경 없이 읽기 전용으로 위 내용만 정리함.
