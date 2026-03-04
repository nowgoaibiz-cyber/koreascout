# Section 5 Deep Forensic Audit Report (Read-Only)

**범위:** Export & Logistics Intel (`id="section-5"`)  
**규칙:** 코드 수정 없음, 읽기 전용 감사 결과만 기록.

---

## 1. 컴포넌트 위치 & 라인 범위

| 항목 | 위치 | 비고 |
|------|------|------|
| **섹션 컴포넌트** | `function SourcingIntel` | **L1245–L1525** (`app/weekly/[weekId]/[id]/page.tsx`) |
| **섹션 루트** | `<section id="section-5">` | L1257 |
| **다음 함수** | `parseGlobalPrices` | L1527 시작 → SourcingIntel 종료는 L1525 |

**서브모듈 계층**
- **페이지 내:** `SourcingIntel` 단일 컴포넌트가 Section 5 전체 담당.
- **외부 컴포넌트:**  
  `BrokerEmailDraft` (L15 import, L1341 사용),  
  `ExpandableText` (L14 import, L1454·1457 사용),  
  `HazmatBadges` (L12 import, L1419 사용),  
  `CopyButton` (L11 import, L1315 사용),  
  `Button` (L16 import, L1472 사용),  
  `Lock`, `CheckCircle`, `AlertTriangle`, `XCircle`, `ArrowRight` (L17 lucide-react).

**참고:** `ExportLogistics`라는 별도 함수명은 없음. 모두 `SourcingIntel` 내부에 구현됨.

---

## 2. Broker Email Draft (useState·토글 로직)

**정의 위치:** `components/BrokerEmailDraft.tsx` (페이지가 아닌 별도 파일).

### useState 선언 (L11–13)
```ts
const [open, setOpen] = useState(false);        // 아코디언 열림/닫힘
const [destination, setDestination] = useState("");
const [copied, setCopied] = useState(false);
```

### 아코디언 토글 로직
- **열기/닫기:** 버튼 `onClick={() => setOpen(!open)}` (L119).
- **표시:** `{open ? "▲" : "▼"}` (L124), 본문은 `{open && ( <div>...</div> )}` (L132)로 조건부 렌더.
- **외부 라이브러리 없음.** 단순 boolean 상태로 접기/펼치기만 구현.

### 본문 생성
- `buildEmailBody()`가 `report` 기반으로 이메일 텍스트 생성.
- 사용 필드: `translated_name`, `product_name`, `category`, `hs_code`, `hs_description`, `status_reason`, `composition_info`, `key_risk_ingredient`, `hazmat_status`, `required_certificates`, `dimensions_cm`, `actual_weight_g`, `image_url`, `naver_link`.
- `destination`은 입력값으로, 비어 있으면 `"your destination country"` 사용.

### 페이지에서의 사용 (page.tsx L1339–1347)
- **표시 조건:** `canSeeAlpha && report.hs_code?.trim()` 일 때만 `<BrokerEmailDraft report={report} />` 렌더.
- 비-Alpha 또는 HS 코드 없으면 "Broker Email Draft — available on Alpha Plan" 문구만 표시.

---

## 3. DB 필드 매핑 테이블 (Section 5 UI → report.*)

| UI 요소 / 블록 | report 필드 | 비고 |
|----------------|-------------|------|
| Export Readiness 상태·아이콘·문구 | `report.export_status` | "Green" | "Yellow" | 기타(Red 등) 분기 |
| Export 사유 문구 | `report.status_reason` | trim 시 표시 |
| HS Code 표시·복사 | `report.hs_code` | `formatHsCode(report.hs_code)` 사용 |
| HS 설명 | `report.hs_description` | trim 시 표시 |
| Broker Email Draft | (BrokerEmailDraft 내부에서 다수 필드 사용) | 위 2절 참고 |
| Actual Weight | `report.actual_weight_g` | 단위 `g` |
| Volumetric Weight | `report.volumetric_weight_g` | 단위 `g` |
| Billable Weight | `report.billable_weight_g` | 단위 `g`, 강조 카드 |
| Dimensions | `report.dimensions_cm` | trim 시 텍스트로 표시 |
| Shipping Tier | `report.shipping_tier` | `describeShippingTier(report.shipping_tier).description` → Badge |
| Volumetric vs Actual 안내 문구 | `report.actual_weight_g`, `report.volumetric_weight_g`, `report.billable_weight_g` | 세 값 모두 있을 때만 분기 문구 표시 |
| Hazmat 배지 4종 | `report.hazmat_status` | JSONB → `HazmatBadges`에 `as unknown` 전달 |
| Risk Ingredient | `report.key_risk_ingredient` | trim 시 Badge + 텍스트 |
| Certifications Required | `report.required_certificates` | trim 시 콤마 split 후 Badge 목록 |
| Product Specs 표시 여부 | `report.composition_info`, `report.spec_summary` | 둘 중 하나라도 trim 시 Block 6 렌더 |
| Ingredients | `report.composition_info` | `ExpandableText` |
| Specifications | `report.spec_summary` | `ExpandableText` |
| Shipping Notes | `report.shipping_notes` | trim 있고 `tier` 정규식 미포함 시만 Block 7 렌더 |
| Compliance & Logistics Strategy (Step 4–5) | `report.sourcing_tip` | `parseSourcingStrategy` 후 `slice(3, 5)` |

---

## 4. Weight Tier 계산 로직 (describeShippingTier)

**정의 위치:** `app/weekly/[weekId]/[id]/page.tsx` **L30–L43**.

```ts
const SHIPPING_TIER_TOOLTIP = "Tier 1: <500g | Tier 2: 500g–2kg | Tier 3: 2kg+";

function describeShippingTier(tier: string | null | undefined): { description: string; tooltip: string } {
  const t = tier?.trim().toLowerCase() ?? "";
  const tooltip = SHIPPING_TIER_TOOLTIP;
  if (t.includes("1") || t.includes("light") || t.includes("lightweight") || t.includes("<500"))
    return { description: "Tier 1: Lightweight packet (< 500g)", tooltip };
  if (t.includes("2") || t.includes("500") || t.includes("2kg") || t.includes("standard"))
    return { description: "Tier 2: 500g–2kg", tooltip };
  if (t.includes("3") || t.includes("heavy") || t.includes("2kg+") || t.includes("freight"))
    return { description: "Tier 3: 2kg+", tooltip };
  if (t) return { description: tier!.trim(), tooltip };
  return { description: "", tooltip };
}
```

**동작 요약**
- 입력 `tier`를 소문자 trim한 문자열로 검사.
- **우선순위:** "1/light/lightweight/<500" → "2/500/2kg/standard" → "3/heavy/2kg+/freight" → 그 외 비어 있지 않으면 원문 그대로 description, 없으면 빈 문자열.
- 반환값은 항상 `{ description, tooltip }` (tooltip은 상수 동일).
- Section 5에서는 **L1392–1395**에서만 사용: `describeShippingTier(report.shipping_tier).description`을 Badge에 표시.

**Weight 블록 조건 (L1355–1361)**  
- `hasActual = report.actual_weight_g != null`  
- `hasVol = report.volumetric_weight_g != null`  
- `hasBillable = report.billable_weight_g != null`  
- 셋 다 없으면 Weight 카드 영역 자체를 null 반환(미렌더).  
- Actual → Volumetric → Billable 순서로 카드·화살표 표시.

---

## 5. ExpandableText 로직 (Read More / Show Less)

**정의 위치:** `components/ExpandableText.tsx`.

- **Props:** `text: string`, `label: string`.
- **상태:**  
  - `expanded`: 펼침 여부.  
  - `needsClamp`: 내용이 2줄 넘어가서 "Read More"가 필요한지.
- **측정:** `useRef` + `useEffect`에서 `ref.current.scrollHeight > ref.current.clientHeight + 4`이면 `setNeedsClamp(true)`.
- **렌더:**  
  - 본문 `<p>`에 `!expanded ? "line-clamp-2" : ""` 적용 → 접혀 있을 때 2줄 클램프.  
  - 접혀 있고 `needsClamp`일 때 하단 그라데이션 오버레이 (`from-[#F8F7F4]`).  
  - `needsClamp`일 때만 버튼 노출: `{expanded ? "Show Less ▲" : "Read More ▼"}`, `onClick={() => setExpanded(!expanded)}`.

**Section 5 사용처**
- L1454: `<ExpandableText text={report.composition_info} label="Ingredients" />`
- L1457: `<ExpandableText text={report.spec_summary} label="Specifications" />`

---

## 6. Hazmat 조건부 렌더링

### 6.1 Export Readiness (page.tsx Section 5 내부, L1265–1295)

| 조건 | 아이콘 | 배경/테두리 (동적 클래스) | 텍스트 색 | 표시 문구 |
|------|--------|---------------------------|-----------|-----------|
| `report.export_status === "Green"` | `CheckCircle` | `bg-[#DCFCE7] border-[#BBF7D0]` | `text-[#16A34A]` | "Ready to Export" |
| `report.export_status === "Yellow"` | `AlertTriangle` | `bg-[#FEF3C7] border-[#FDE68A]` | `text-[#D97706]` | "Check Regulations" |
| 그 외 (Red 등) | `XCircle` | `bg-[#FEE2E2] border-[#FECACA]` | `text-[#DC2626]` | "Export Restricted" |

- `report.status_reason?.trim()`이 있으면 같은 블록 안에 추가 문단으로 표시.

### 6.2 HazmatBadges (components/HazmatBadges.tsx)

- **입력:** `status: unknown` (Section 5에서는 `report.hazmat_status as unknown` 전달).
- **파싱:** 문자열이면 JSON.parse(이중 파싱 가능), 객체면 `HazmatStatus` 형태로 사용.  
  `HazmatStatus`: `contains_liquid`, `contains_powder`, `contains_battery`, `contains_aerosol` (각 optional boolean).

| 키 | 라벨 | true 시 스타일 | false 시 스타일 |
|----|------|----------------|-----------------|
| contains_liquid | Liquid | `bg-[#DBEAFE] border-[#BFDBFE] text-[#2563EB]` | `bg-[#F8F7F4] border-[#E8E6E1] text-[#9E9C98]` |
| contains_powder | Powder | `bg-[#6B6860]/80 border-[#9E9C98]/80 text-white` | 동일 false |
| contains_battery | Battery | `bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]` | 동일 false |
| contains_aerosol | Aerosol | `bg-[#FEE2E2] border-[#FECACA] text-[#DC2626]` | 동일 false |

- 4개 배지를 `grid grid-cols-2 sm:grid-cols-4 gap-2`로 렌더.  
- `parsed`가 null/비객체면 컴포넌트는 null 반환(아무것도 안 그림).

---

## 7. Tailwind 클래스 목록 (Section 5 범위 L1245–1525)

- **섹션 루트:**  
  `scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] relative`
- **h2 섹션 타이틀:**  
  `text-3xl font-bold text-[#1A1916] mb-4 tracking-tight` ("Export & Logistics Intel")
- **블록 라벨 (공통):**  
  `text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2`
- **Export Readiness 카드:**  
  `p-4 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4]`, 내부 동적 Green/Yellow/Red (위 6.1 참고).
- **HS Code:**  
  `text-4xl font-mono font-bold text-[#1A1916] tracking-tight`, 설명 문단 `text-sm text-[#6B6860] leading-relaxed`, 면책 `text-xs text-[#9E9C98] italic`.
- **Weight 카드 (Actual/Volumetric):**  
  `flex-1 min-w-0 p-4 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4] text-center`, 라벨 `text-xs text-[#9E9C98] uppercase tracking-widest mb-1`, 숫자 `text-2xl font-mono font-semibold text-[#1A1916]`.
- **Billable Weight 강조 카드:**  
  `border border-[#BBF7D0] bg-[#DCFCE7]`, 숫자 `text-2xl font-mono font-semibold text-[#16A34A]`.
- **Alert 박스 (Check Regulations 등):**  
  동적: Green `rounded-lg border px-3 py-2 flex-1 bg-[#DCFCE7] border-[#BBF7D0]`, Yellow `bg-[#FEF3C7] border-[#FDE68A]`, Red `bg-[#FEE2E2] border-[#FECACA]` + `text-sm font-semibold` + Green `text-[#16A34A]`, Yellow `text-[#D97706]`, Red `text-[#DC2626]`.
- **Product Specs / Broker / Hazmat 등 컨테이너:**  
  `p-4 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4]`.
- **Compliance Strategy 스텝 카드:**  
  `bg-white rounded-lg border border-[#E8E6E1] p-4`, Step 제목 `text-sm font-semibold text-[#1A1916]`, 본문 `text-sm text-[#6B6860] leading-relaxed whitespace-pre-line`.
- **Alpha Lock Overlay:**  
  `absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col items-center justify-end pb-6 gap-3 rounded-2xl`.

---

## 8. 하드코딩 컬러 목록 (Section 5 범위, 용도 포함)

| 헥스 코드 | 용도 |
|-----------|------|
| `#1A1916` | 제목·강조 텍스트 (h2, HS Code, 카드 제목 등) |
| `#3D3B36` | 본문 텍스트 (Shipping Notes, Risk Ingredient, Broker pre 등) |
| `#6B6860` | 보조 텍스트 (HS 설명, dimensions, Step 본문 등) |
| `#9E9C98` | 라벨·뮤트 텍스트, 아이콘, placeholder 톤 |
| `#E8E6E1` | 테두리·구분선, false 상태 Hazmat 배지 |
| `#F8F7F4` | 크림 배경 (카드, Broker 영역, Weight 카드 등) |
| `#F2F1EE` | Non-Alpha placeholder 배경 (h-16, h-20, h-24, h-12 블록) |
| `#16A34A` | Green(성공)·Billable 강조·CTA·아이콘 |
| `#15803D` | Green hover (BrokerEmailDraft Copy 버튼 등) |
| `#DCFCE7`, `#BBF7D0` | Green 배경/테두리 (Export Ready, Billable 카드) |
| `#D97706` | Yellow(경고) 텍스트 |
| `#FEF3C7`, `#FDE68A` | Yellow 배경/테두리 (Check Regulations) |
| `#DC2626` | Red(제한) 텍스트 |
| `#FEE2E2`, `#FECACA` | Red 배경/테두리 (Export Restricted) |
| `#2563EB`, `#DBEAFE`, `#BFDBFE` | Hazmat Liquid true (파랑 계열) |
| `#6B6860` (opacity 80) | Hazmat Powder true 배경 |
| `#C4C2BE` | BrokerEmailDraft input placeholder (BrokerEmailDraft.tsx) |

---

## 9. Alpha Lock 로직

- **조건:** `!canSeeAlpha` (즉, tier !== "alpha" && !isTeaser).
- **구조:**  
  `<div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col items-center justify-end pb-6 gap-3 rounded-2xl">`  
  → 섹션 전체를 덮는 반투명 그라데이션 + 하단 CTA.
- **내용:**  
  Lock 아이콘 (`w-5 h-5 text-[#9E9C98]`),  
  문구 "HS codes, weight specs, hazmat checks, broker email templates, compliance strategy & more.",  
  `<a href="/pricing"><Button variant="primary" size="sm">Go Alpha $29/mo →</Button></a>`.
- **Placeholder (canSeeAlpha false일 때 블록별)**  
  - Block 1 Export Readiness: `h-16 w-full rounded-xl bg-[#F2F1EE]`  
  - Block 2 HS Code: `h-20 w-full rounded-xl bg-[#F2F1EE]`  
  - Block 4 Weight & Shipping: `h-24 w-full rounded-xl bg-[#F2F1EE]`  
  - Block 5 Hazmat: `h-20 w-full rounded-xl bg-[#F2F1EE]`  
  - Block 6 Product Specs: `h-20 w-full rounded-xl bg-[#F2F1EE]`  
  - Block 7 Shipping Notes: `h-12 w-full rounded-xl bg-[#F2F1EE]`  
  - Block 8 Compliance & Logistics: `h-24 w-full rounded-xl bg-[#F2F1EE]`  

**참고:** Broker Email Draft 블록은 컴포넌트 대신 문구만 표시(`!canSeeAlpha` 시 L1344–1347).

---

*감사 완료. 코드 수정 없음.*
