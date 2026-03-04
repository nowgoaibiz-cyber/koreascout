# Section 6 포렌식 감사 보고서

**작성일:** 2025-03-04  
**대상:** `app/weekly/[weekId]/[id]/page.tsx` — Section 6 (Launch Kit / Supplier Contact)  
**원칙:** Read-Only. 코드 변경 없음.

---

## 1. 컴포넌트 위치 & 라인 범위

| 항목 | 라인 | 비고 |
|------|------|------|
| **섹션 DOM** | `id="section-6"` | **2141** |
| **SupplierContact** | `function SupplierContact` | **1619** ~ **2011** (컴포넌트 종료) |
| **Section 6 래퍼 렌더** | `hasSupplier && <div id="section-6">` … `SupplierContact` \| `LockedSection` | **2140** ~ **2151** |
| **formatVerifiedAt** | 보조 함수 | **1604** ~ **1617** |
| **parseGlobalPrices** | 보조 함수 | **1550** ~ **1575** |
| **getAiDetailUrl** | 보조 함수 | **1579** ~ **1601** |

- **LaunchExecution / ExecutionKit / ScoutLab / SupplierHub** 같은 별도 함수명은 없음. Section 6 UI는 **SupplierContact** 한 컴포넌트로 구현됨.
- `grep "^function "` 결과: 파일 내 최상위 함수는 `formatHsCode`(22) ~ `SupplierContact`(1619) 등이며, Section 6 담당은 **SupplierContact** 단일 컴포넌트.

---

## 2. JSX 구조 (3개 메인 블록 계층도)

```
section (루트)
  className="bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]"
  └─ {canSeeAlpha && ( <> ... </> )}

  ├─ [헤더]
  │  ├─ h2 "Launch & Execution Kit"  (text-3xl font-bold text-[#1A1916] mb-4 tracking-tight)
  │  └─ p "From product discovery to live campaign..." (text-sm text-[#6B6860])
  │
  ├─ [Block 1] flex flex-col md:flex-row gap-6 mt-6 items-stretch
  │  ├─ [Block 1 Left] Sourcing Economics (Financial Briefing에 해당)
  │  │  └─ div.bg-[#F8F7F4].rounded-xl.p-6.flex-1
  │  │     ├─ Scout Verified 배지 (verified_cost_usd 있을 때)
  │  │     ├─ Cost Per Unit 금액 + MOQ + Lead Time + verified_at
  │  │     ├─ undisclosed 문구 또는 "검증 중" 문구
  │  │     └─ sample_policy / export_cert_note Badge
  │  │
  │  └─ [Block 1 Right] Manufacturer Contact (Scout Lab / Contact + Market Proof)
  │     └─ div.bg-[#F8F7F4].rounded-xl.p-6.flex-1
  │        ├─ m_name, corporate_scale
  │        ├─ ContactPill (contact_email, contact_phone, m_homepage, wholesale_link)
  │        └─ Global Market Proof (report.global_prices 파싱 → 리전 태그)
  │
  └─ [Block 2] Execution Gallery — Creative Assets (showExecutionGallery 시)
     ├─ h3 "Creative Assets" + assetCount "assets ready to deploy"
     └─ div.grid.${gridCols}.gap-4.mt-4
        └─ 카드 1~5개 (viralUrl, videoUrl, aiDetailUrl, marketingUrl, aiImageUrl)
```

- **페이지 레벨:** `{hasSupplier && ( <div id="section-6"> {canSeeAlpha ? <SupplierContact /> : <LockedSection />} </div> )}`

---

## 3. DB 필드 매핑 테이블 (UI → report.* 100%)

| UI 요소 | report 필드 | 비고 |
|---------|-------------|------|
| Scout Verified 배지 표시 여부 | `verified_cost_usd` | null/"" 아니면 배지 표시 |
| Cost Per Unit 금액 | `verified_cost_usd` | parseFloat → `$costNum.toFixed(2)` |
| COST PER UNIT 라벨 | — | 하드코딩 |
| MOQ 값 | `moq` | trim 후 표시 |
| LEAD TIME 값 | `lead_time` | trim 후 표시 |
| Verified by Scout on [날짜] | `verified_at` | formatVerifiedAt() |
| Undisclosed 처리 | `verified_cost_note` | 소문자 "undisclosed" 시 가격 문구만 변경 |
| Sample policy 배지 | `sample_policy` | Badge variant="info" |
| Export/cert 배지 | `export_cert_note` | Badge variant="warning" |
| 제조사명 | `m_name` | h2 |
| 규모 배지 | `corporate_scale` | Badge variant="default" |
| 이메일 | `contact_email` | ContactPill copy |
| 전화 | `contact_phone` | ContactPill copy |
| 웹사이트 | `m_homepage` | ContactPill link, 라벨 "Website" |
| 도매 포털 | `wholesale_link` | ContactPill link, 라벨 "Wholesale Portal" |
| Global Market Proof 데이터 | `global_prices` | JSONB → region id(us,uk,sea,australia,india)별 url/platform |
| Viral Reference 카드 링크 | `viral_video_url` | viralUrl → "Watch Original ↗" |
| Raw Ad Footage 카드 링크 | `video_url` | videoUrl → "Watch & Download ↗" |
| AI Landing Page 카드 링크 | `ai_detail_page_links` | getAiDetailUrl() → "Open Page ↗" |
| Brand Asset Kit 카드 링크 | `marketing_assets_url` | marketingUrl → "Access Assets ↗" |
| AI Product Image 카드 링크 | `ai_image_url` | aiImageUrl → "Open / Download ↗" |
| 갤러리 표시 여부 | 위 5개 URL | assetCount = filter(Boolean).length; showExecutionGallery = assetCount > 0 |
| 섹션/컴포넌트 노출 | hasSupplierFields | m_name \|\| corporate_scale \|\| contact_* \|\| m_homepage \|\| naver_link \|\| wholesale_link \|\| sourcing_tip |

---

## 4. Financial Briefing 블록 className 전체

- **코드 상 블록명:** Block 1 Left — "Sourcing Economics" (Financial Briefing에 해당).

| 요소 | className |
|------|-----------|
| **블록 루트** | `bg-[#F8F7F4] border border-[#E8E6E1] rounded-xl p-6 flex-1 flex flex-col gap-4 min-h-0` |
| Scout Verified 배지 컨테이너 | `inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] w-fit` |
| 배지 점 | `w-2 h-2 rounded-full bg-[#16A34A] animate-pulse` |
| 배지 텍스트 "Scout Verified" | `text-xs font-semibold text-[#16A34A]` |
| **Cost Per Unit 금액** | `text-5xl font-mono font-bold text-[#16A34A]` |
| **COST PER UNIT 라벨** | `text-xs uppercase tracking-widest text-[#9E9C98]` |
| MOQ/Lead Time 값 | `text-2xl font-semibold font-mono tabular-nums text-[#1A1916]` |
| MOQ / LEAD TIME 라벨 | `text-xs text-[#9E9C98]` |
| MOQ·Lead 래퍼 | `flex gap-6 flex-wrap` 내부 `<div>` |
| Verified by Scout 날짜 | `text-xs text-[#C4C2BE] italic` |
| Undisclosed 문구 | `text-sm text-[#6B6860] leading-relaxed italic` |
| 가격 검증 중 문구 | `text-sm text-[#9E9C98] leading-relaxed flex items-center gap-1` |
| 검증 중 펄스 점 | `w-1.5 h-1.5 rounded-full bg-[#9E9C98] animate-pulse` |

---

## 5. Creative Assets 4-card 구조

- 실제로는 **최대 5종** 카드(viral, video, aiDetail, marketing, aiImage). 1~5개에 따라 그리드 열 수만 변경.

### 그리드 className

- **컨테이너:** `grid ${gridCols} gap-4 mt-4`
- **gridCols** (assetCount 기준):
  - 1 → `grid-cols-1 sm:grid-cols-1 lg:grid-cols-1`
  - 2 → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-2`
  - 3 → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
  - 4 → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
  - 5 → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5`
- **섹션 제목:** `text-sm font-semibold text-[#9E9C98] uppercase tracking-widest`
- **개수 표시:** `text-xs text-[#16A34A]`

### 링크 소스 (DB 필드 vs 하드코딩)

| 카드 제목 | CTA 텍스트 | 링크 소스 | DB 필드 |
|-----------|------------|-----------|---------|
| Viral Reference | Watch Original ↗ | DB | `report.viral_video_url` |
| Raw Ad Footage | Watch & Download ↗ | DB | `report.video_url` |
| AI Landing Page | Open Page ↗ | DB | `report.ai_detail_page_links` (getAiDetailUrl) |
| Brand Asset Kit | Access Assets ↗ | DB | `report.marketing_assets_url` |
| AI Product Image | Open / Download ↗ | DB | `report.ai_image_url` |

- **하드코딩 URL 없음.** 모든 카드 href는 report 필드 또는 getAiDetailUrl 결과.

### 배경 아이콘 & hover 클래스

- **카드 루트:** `hover:border-[#BBF7D0] transition-colors group`
- **썸네일 영역:** `h-36 bg-gradient-to-br from-[#F2F1EE] to-[#E8E6E1]` + 아이콘
  - Viral: `TrendingUp` — `opacity-50 group-hover:opacity-100 transition-opacity`
  - Video: `Film`
  - AI Landing: `LayoutTemplate`
  - Brand Asset / AI Image: `ImageIcon`
- **아이콘 공통:** `w-10 h-10 text-[#6B6860] opacity-50 group-hover:opacity-100 transition-opacity`
- **링크:** `text-xs text-[#16A34A] hover:text-[#15803D] underline underline-offset-2`, `target="_blank"` `rel="noopener noreferrer"`

---

## 6. Scout Lab 블록 (Verified 배지 + Market Proof 파싱)

- **코드 상:** "Scout Verified" 배지는 Block 1 Left(Sourcing Economics)에 있고, Contact + Global Market Proof는 Block 1 Right(Manufacturer Contact). 사용자 용어 "Scout Lab"은 이 둘을 묶어서 지칭한 것으로 보고 정리.

### Verified 배지

- **표시 조건:** `verifiedCostUsd != null && verifiedCostUsd !== ""`
- **마크업:**  
  `inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] w-fit`  
  + `w-2 h-2 rounded-full bg-[#16A34A] animate-pulse`  
  + `text-xs font-semibold text-[#16A34A]` "Scout Verified"
- **날짜:** `formatVerifiedAt(report.verified_at)` → `toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })`.  
  UI: "Verified by Scout on {formatVerifiedAt(report.verified_at)}"

### Market Proof 파싱

- **데이터 소스:** `report.global_prices` (JSONB). **market_proof** 필드는 미사용.
- **파싱:** Block 1 Right 내 IIFE에서 `rawPrices: Record<string, { url?: string; platform?: string }>` 로 파싱.
  - string → `JSON.parse(raw)` 1회, 결과가 string이면 한 번 더 parse.
  - object → 그대로 캐스팅. 예외 시 빈 객체.
- **리전:** 하드코딩 배열 `regions`: us, uk, sea, australia, india (id/flag/name).
- **태그:** `rawPrices[region.id]`로 조회. `data?.url?.startsWith("http")` 이면 `<a>` (href=data.url), 아니면 `<span>` "🔵 Blue Ocean".
- **normalizeToArray / split:** Section 6 Market Proof에서는 미사용. 리전은 고정 배열만 사용.
- **표시 조건:** `if (!report.global_prices) return null` → global_prices 없으면 Global Market Proof 블록 전체 미렌더.

---

## 7. 폰트 사이즈 분포표 (ant-size 위반 목록)

- Section 6 범위(1619–2011) 내에서만 집계.

| 클래스 | 용도(대표) | 비고 |
|--------|------------|------|
| `text-xs` | COST PER UNIT / MOQ / LEAD TIME 라벨, Scout Verified 텍스트, Verified by Scout 날짜, Creative Assets 개수·설명·링크, Global Market Proof 제목·태그 | ant-size 보조 텍스트에 적합 |
| `text-sm` | 서브타이틀, undisclosed/검증 중 문구, Creative Assets 섹션 제목, 카드 제목 | ant-size 보조/캡션에 적합 |
| `text-2xl` | MOQ / Lead Time 값 | |
| `text-3xl` | "Launch & Execution Kit" | |
| `text-5xl` | Cost Per Unit 금액 | |
| `text-xl` | 제조사명 (m_name) | |

- **ant-size 위반:** Section 6 내에는 `text-[10px]` 등 arbitrary font-size 미사용. 디자인 헌법에서 ant-size로 정의한 xs/sm 등과 충돌하는 사용도 없음. **위반 목록: 없음.**

---

## 8. 헥스 컬러 목록 (용도 포함)

- Section 6 범위(1619–2011) 기준.

| 헥스 | 용도 |
|------|------|
| `#1A1916` | 제목·본문 강조 (Launch & Execution Kit, 제조사명, 카드 제목, MOQ/Lead 값) |
| `#3D3B36` | Global Market Proof 링크 텍스트 |
| `#6B6860` | 부가 설명, undisclosed 문구 |
| `#9E9C98` | 라벨, 보조 텍스트, 검증 중 펄스 점 |
| `#C4C2BE` | Verified by Scout 날짜 (italic) |
| `#16A34A` | Scout Verified 배지·Cost 금액·Creative 개수/링크·Primary 강조 |
| `#15803D` | 링크 hover (진한 그린) |
| `#DCFCE7` | Scout Verified 배지 배경, Market Proof 링크 hover 배경 |
| `#BBF7D0` | Scout Verified 배지 테두리, 카드 hover 테두리 |
| `#E8E6E1` | 섹션/카드 테두리, 구분선 |
| `#F8F7F4` | 카드 배경 (Sourcing Economics, Manufacturer Contact, Creative Assets 카드) |
| `#F2F1EE` | Creative 카드 썸네일 그라데이션 시작 |
| `#2563EB` | Blue Ocean 스팬 텍스트 |
| `#DBEAFE` | Blue Ocean 스팬 배경 |
| `#BFDBFE` | Blue Ocean 스팬 테두리 |

- Section 6 내 **emerald / text-green-* / bg-green-*** 사용 없음. 전부 헥스 또는 arbitrary value.

---

## 9. Green Accent Line 현황

- **Section 6 블록(SupplierContact, 1619–2011) 내:**  
  **Green Accent Line 없음.**  
  `border-l`, `border-l-2`, `border-l-4`, `w-1 ... bg-[#16A34A]`, `self-stretch` 등 해당 라인 범위에 없음.

- **같은 파일 내 다른 섹션:**  
  Section 1(271), Section 2(319), Section 3(417, 736, 894), Section 5(1206–1207, 1494–1495) 등에서만 사용.

- **결론:** Section 6에는 Green Accent Line 미적용.

---

## 10. LockedSection & Tier 분기 조건

### 페이지 레벨 (라인 2140–2151)

- **Section 6 렌더 조건:** `hasSupplier` 가 true일 때만 `<div id="section-6">` 렌더.
- **hasSupplier:**  
  `report.m_name` \|\| `report.corporate_scale` \|\| `report.contact_email` \|\| `report.contact_phone` \|\| `report.m_homepage` \|\| `report.naver_link` \|\| `report.wholesale_link` \|\| `report.sourcing_tip` 중 하나라도 trim 후 존재.
- **canSeeAlpha:** `tier === "alpha" || isTeaser`
- **분기:**
  - `canSeeAlpha` → `<SupplierContact report={...} tier={...} isTeaser={...} />`
  - 그 외 → `<LockedSection {...SECTION_ALPHA_SUPPLIER_CTA} />`

### SECTION_ALPHA_SUPPLIER_CTA (라인 86–98)

- message: "The supplier is right here. One upgrade away. …"
- cta: "Get Supplier Contact — $29/mo →"
- href: "/pricing"
- lockedFields: Supplier Contact Info, Verified Wholesale Cost, MOQ & Lead Time, Direct Factory Link, B2B Negotiation Script

### SupplierContact 내부

- `canSeeAlpha = tier === "alpha" || isTeaser`
- `hasSupplierFields` = 위와 동일한 report 필드 중 하나라도 있음.
- `if (!hasSupplierFields && !canSeeAlpha) return null` → Alpha도 아니고 supplier 필드도 없으면 컴포넌트 미렌더.
- Launch & Execution Kit / Manufacturer Contact / Creative Assets 콘텐츠는 전부 `{canSeeAlpha && ( <> ... </> )}` 안에서만 렌더.

### 타입 정의 (types/database.ts)

- Section 6 관련: `verified_cost_usd`, `verified_cost_note`, `moq`, `lead_time`, `global_prices`, `verified_at`, `sample_policy`, `export_cert_note`, `m_name`, `corporate_scale`, `contact_email`, `contact_phone`, `m_homepage`, `wholesale_link`, `viral_video_url`, `video_url`, `marketing_assets_url`, `ai_detail_page_links`, `ai_image_url` 등 `ScoutFinalReportsRow`에 정의됨.  
- `types/supabase.ts`는 없고, `types/database.ts`에 동일 타입 정의 존재.

---

*End of Section 6 Deep Forensic Audit. No code changes were made.*
