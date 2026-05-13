# ROUND 1 Investigation Report

Date: 2026-05-13  
Target: Simple Deletions (조사 전용 — 코드 변경 없음)

---

## 실행 방법 (명령 대응)

요청하신 bash 명령은 Git Bash에서 **순서대로** 실행되도록 `_round1_run.sh`로 일괄 수행한 뒤, 동일 출력을 `round1_*.txt`에 저장했습니다. `grep`/`find`는 **`node_modules`**, **`.git`** 을 제외하여 원본 명령과 동등한 앱 소스 트리만 대상으로 했습니다. (조사 완료 후 실행 스크립트는 제거함.)

산출 텍스트 파일 (프로젝트 루트 `c:\k-productscout\`):

- `round1_verified_cost.txt`
- `round1_financial.txt`
- `round1_code_context.txt`

---

## TARGET 1: View Verified Supplier Cost Button

### Location

**File:** `c:\k-productscout\components\report\MarketIntelligence.tsx`  
**Lines:** **265**–**274** (`isAlpha` 분기 전체: `ScrollToIdButton` 활성 버튼 **267**–**268**, 비활성 `button` **270**–**273**; 감싸는 `div`는 **264**–**275**)

grep 원문 (`round1_verified_cost.txt`):

```text
=== VIEW VERIFIED SUPPLIER COST BUTTON ===
./components/report/MarketIntelligence.tsx:267:                      ✓ View Verified Supplier Cost ↓
./components/report/MarketIntelligence.tsx:271:                      🔒 View Verified Supplier Cost
```

### Code Context

`sed -n '260,280p'` 결과 (`round1_code_context.txt` 및 소스 기준, 파일 내 실제 라인 번호 **260**–**280**):

```260:280:c:\k-productscout\components\report\MarketIntelligence.tsx
                    {estimatedCost ? `~$${estimatedCost}` : "—"}
                  </p>
                </LockedValue>
                <p className="text-xs text-[#9E9C98] mt-2">Est. KR Wholesale</p>
                <div style={{ marginTop: "0.6cm" }}>
                  {isAlpha ? (
                    <ScrollToIdButton sectionId="section-6" className="text-base font-bold text-[#16A34A] hover:underline transition-colors">
                      ✓ View Verified Supplier Cost ↓
                    </ScrollToIdButton>
                  ) : (
                    <button disabled className="inline-flex items-center gap-2 text-base font-bold text-[#9E9C98] cursor-not-allowed">
                      🔒 View Verified Supplier Cost
                      <span className="text-[10px] font-bold text-white bg-[#16A34A] rounded-full px-2 py-0.5">Alpha</span>
                    </button>
                  )}
                </div>
              </div>
              <div className={strategicTarget ? "px-8 border-r border-[#E8E6E1]" : "pl-8"}>
                <p className="text-lg font-bold text-[#6B6860] uppercase tracking-widest" style={{ marginTop: "0.8cm" }}>
                  Global Valuation
                </p>
```

### `verified_cost_usd` 관련 TSX (`round1_verified_cost.txt` 전체 발췌)

PDP 버튼 문자열 외 TSX 매치:

- `c:\k-productscout\app\admin\[id]\page.tsx` — **78**, **287**, **1414**–**1415** (어드민 폼; PDP와 별개)
- `c:\k-productscout\components\report\SupplierContact.tsx` — **43** (Financial Briefing 블록에서 사용)

### Deletion Strategy

- [ ] Remove button rendering logic (`c:\k-productscout\components\report\MarketIntelligence.tsx` **264**–**275** 또는 **265**–**274** 블록)
- [ ] Remove any associated state/props — `isAlpha`는 동일 파일 내 다른 UI에 쓰일 수 있으므로 **파일 전역 검색 후** 미사용 시에만 정리
- [ ] Check for any conditional rendering dependencies — `ScrollToIdButton`의 `sectionId="section-6"` 은 `c:\k-productscout\app\weekly\[weekId]\[id]\page.tsx` **139**행 네비 `{ id: "section-6", label: "Launch Kit", ... }` 와 연결됨

---

## TARGET 2: Financial Briefing Section

### Location

**File:** `c:\k-productscout\components\report\SupplierContact.tsx`  
**Section boundaries (권장 삭제 블록):** **215**–**277** (닫는 `</div>`까지 — 회색 카드 `Financial Briefing` + Cost/MOQ/Lead/OEM 열 전체)  
**제목 줄:** **216**

grep (`round1_financial.txt`):

```text
./components/report/SupplierContact.tsx:216:          <p className="text-xl font-bold text-[#1A1916] mb-10">Financial Briefing</p>
```

**Parent:** 동일 파일 **206**행부터 `<section>` — 그 안 **208**–**213**이 "Launch & Execution Kit" 헤더; Financial Briefing은 그 하위 **215**–**277** `div` 블록.

### Fields to Remove

1. **Cost Per Unit**
   - **File:** `c:\k-productscout\components\report\SupplierContact.tsx`
   - **Label:** **219**–**221**
   - **Value / `LockedValue`:** **222**–**244**

2. **MOQ**
   - **File:** `c:\k-productscout\components\report\SupplierContact.tsx`
   - **Column 헤더:** **249**
   - **값:** **250**–**254** (`LockedValue` 포함)

3. **Lead Time** (카피: "Est. Production Lead Time")
   - **File:** `c:\k-productscout\components\report\SupplierContact.tsx`
   - **라벨 줄:** **257**–**259**
   - **값:** **260**–**264**

4. **OEM/ODM**
   - **File:** `c:\k-productscout\components\report\SupplierContact.tsx`
   - **라벨 줄:** **267**–**269**
   - **값:** **270**–**274**

### Code Context (전체 Financial Briefing 카드)

```215:277:c:\k-productscout\components\report\SupplierContact.tsx
        <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-6 mt-6">
          <p className="text-xl font-bold text-[#1A1916] mb-10">Financial Briefing</p>

          <div className="mb-6">
            <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">
              Cost Per Unit
            </p>
            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="80px">
              {hasVerifiedPrice && !isUndisclosed ? (
                <div>
                  <p className="text-5xl font-black tracking-tighter text-[#1A1916]">
                    ${costNum.toFixed(2)}
                  </p>
                  {report.verified_at && (
                    <p className="text-xs text-[#9E9C98] mt-2">
                      Verified by KoreaScout on{" "}
                      {new Date(report.verified_at).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              ) : verifiedCostUsd != null && isUndisclosed ? (
                <p className="text-sm italic text-[#6B6860] leading-relaxed">
                  Pricing verified and on file. Contact the manufacturer directly.
                </p>
              ) : (
                <p className="text-sm italic text-[#9E9C98]">Not available</p>
              )}
            </LockedValue>
          </div>

          <div className="flex gap-32 mt-10">
            <div>
              <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">MOQ</p>
              <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
                <p className="text-4xl font-black tracking-tighter text-[#1A1916]">
                  {report.moq?.trim() || "—"}
                </p>
              </LockedValue>
            </div>
            <div>
              <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">
                Est. Production Lead Time
              </p>
              <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
                <p className="text-4xl font-black tracking-tighter text-[#1A1916]">
                  {report.lead_time?.trim() || "—"}
                </p>
              </LockedValue>
            </div>
            <div>
              <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">
                OEM / ODM
              </p>
              <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
                <p className="text-2xl font-black tracking-tighter text-[#1A1916]">
                  {report.can_oem == null ? "—" : report.can_oem ? "Available" : "Not Available"}
                </p>
              </LockedValue>
            </div>
          </div>
        </div>
```

### Deletion Strategy

- [ ] Remove entire "Financial Briefing" section — **권장:** **215**–**277** 단일 `div` 블록 제거
- [ ] OR comment out the section
- [ ] Check if section has conditional rendering — `LockedValue` + `canSeeAlpha`; 별도 `if`로 섹션 전체가 감싸져 있지는 않음
- [ ] Verify no other components depend on these fields — 동일 파일에서 `report.moq` / `report.lead_time` / `report.can_oem` / `verifiedCostUsd` / `costNum` / `hasVerifiedPrice` / `isUndisclosed` 는 **본 섹션에서만** 사용됨 (grep 기준). 삭제 후 **43**–**50**행 부근 파생 변수가 미사용이면 정리 검토

---

## 원시 스캔 붙여넣기

### `round1_verified_cost.txt` (전체)

```
=== VIEW VERIFIED SUPPLIER COST BUTTON ===
./components/report/MarketIntelligence.tsx:267:                      ✓ View Verified Supplier Cost ↓
./components/report/MarketIntelligence.tsx:271:                      🔒 View Verified Supplier Cost

=== VERIFIED_COST_USD RENDERING LOGIC ===
./app/admin/[id]/page.tsx-75-  hazmat_status: "위험물여부",
./app/admin/[id]/page.tsx-76-  required_certificates: "필요인증",
./app/admin/[id]/page.tsx-77-  shipping_notes: "배송메모",
./app/admin/[id]/page.tsx:78:  verified_cost_usd: "검증된원가(USD)",
./app/admin/[id]/page.tsx-79-  verified_cost_note: "검증원가메모",
./app/admin/[id]/page.tsx-80-  verified_at: "검증일시",
./app/admin/[id]/page.tsx-81-  moq: "최소주문수량",
--
./app/admin/[id]/page.tsx-284-    "global_evidence", "kr_source_used", "opportunity_reasoning", "rising_keywords", "seo_keywords", "viral_hashtags",
./app/admin/[id]/page.tsx-285-    "platform_scores", "sourcing_tip", "hs_code", "hs_description", "status_reason", "composition_info", "spec_summary",
./app/admin/[id]/page.tsx-286-    "actual_weight_g", "volumetric_weight_g", "dimensions_cm", "hazmat_status", "required_certificates", "shipping_notes",
./app/admin/[id]/page.tsx:287:    "verified_cost_usd", "verified_cost_note", "verified_at", "moq", "lead_time", "sample_policy", "export_cert_note",
./app/admin/[id]/page.tsx-288-    "viral_video_url", "video_url", "marketing_assets_url", "ai_detail_page_links", "published_at",
./app/admin/[id]/page.tsx-289-  ];
./app/admin/[id]/page.tsx-290-
--
./app/admin/[id]/page.tsx-1411-                <label className={labelClass}>Verified Cost (USD) (검증된 원가)</label>
./app/admin/[id]/page.tsx-1412-                <input
./app/admin/[id]/page.tsx-1413-                  type="text"
./app/admin/[id]/page.tsx:1414:                  value={formData.verified_cost_usd ?? ""}
./app/admin/[id]/page.tsx:1415:                  onChange={(e) => setFormData((p) => ({ ...p!, verified_cost_usd: e.target.value }))}
./app/admin/[id]/page.tsx-1416-                  className={inputClass}
./app/admin/[id]/page.tsx-1417-                />
./app/admin/[id]/page.tsx-1418-              </div>
--
./components/report/SupplierContact.tsx-40-  // Always render the section so labels are visible to all tiers.
./components/report/SupplierContact.tsx-41-  // hasSupplierFields is kept for potential future use but no longer gates rendering.
./components/report/SupplierContact.tsx-42-
./components/report/SupplierContact.tsx:43:  const verifiedCostUsd = report.verified_cost_usd ?? null;
./components/report/SupplierContact.tsx-44-  const verifiedCostNote = report.verified_cost_note?.trim()?.toLowerCase() ?? null;
./components/report/SupplierContact.tsx-45-  const isUndisclosed = verifiedCostNote === "undisclosed";
./components/report/SupplierContact.tsx-46-  const costNum =

=== COMPONENT FILE LOCATION ===
./components/report/MarketIntelligence.tsx
```

### `round1_financial.txt` (전체, `c:\k-productscout\round1_financial.txt`와 동일)

```
=== FINANCIAL BRIEFING SECTION ===
./components/report/SupplierContact.tsx:216:          <p className="text-xl font-bold text-[#1A1916] mb-10">Financial Briefing</p>

=== COST PER UNIT ===
./app/pricing/page.tsx:97:      { feature: "Verified Cost Per Unit & MOQ", free: "—", standard: "—", alpha: "✓" },
./components/report/SupplierContact.tsx:220:              Cost Per Unit

=== MOQ FIELD ===
./app/admin/[id]/page.tsx:81:  moq: "최소주문수량",
./app/admin/[id]/page.tsx:287:    "verified_cost_usd", "verified_cost_note", "verified_at", "moq", "lead_time", "sample_policy", "export_cert_note",
./app/admin/[id]/page.tsx:1438:                <label className={labelClass}>MOQ (최소주문수량)</label>
./app/admin/[id]/page.tsx:1440:                  value={formData.moq ?? ""}
./app/admin/[id]/page.tsx:1441:                  onChange={(e) => setFormData((p) => ({ ...p!, moq: e.target.value }))}
./app/page.tsx:167:                    { text: "Verified Factory Cost ($) & MOQ", lock: false },
./app/page.tsx:312:                    d: "Verified manufacturer name, MOQ, and direct contact email. Our Seoul team checks it. Not scraped. Human-verified.",
./app/page.tsx:393:                        "Verified MOQ & Factory Price (EXW)",
./app/pricing/page.tsx:97:      { feature: "Verified Cost Per Unit & MOQ", free: "—", standard: "—", alpha: "✓" },
./components/AlphaVaultPreview.tsx:13:  "MOQ: ███ units (est.) †",
./components/FaqAccordion.tsx:53:        a: "No. Standard at $79/mo is built exactly for creators. Alpha adds factory contacts, MOQ pricing, HS Codes, and logistics data — tools for sellers who want to source and ship. If your goal is to grow your channel, Standard is all you need.",
./components/FaqAccordion.tsx:68:        a: "Alpha reports include manufacturer name, contact information, and sourcing reference links sourced from Korean B2B databases and verified product listings. We provide the lead — direct outreach and negotiation is yours to own. Supplier responsiveness and MOQ terms vary by manufacturer and are subject to change.",
./components/FaqAccordion.tsx:83:        a: "This is a structural decision, not a marketing gimmick. Each Alpha product report includes direct factory contacts and MOQ pricing. If 10,000 sellers receive the same supplier contact simultaneously, the factory gets overwhelmed, MOQs increase, and pricing negotiation leverage disappears. 3,000 is the ceiling at which our intelligence retains its commercial value. When that ceiling is hit, Alpha closes. This protects your investment, not ours.",
./components/FaqAccordion.tsx:87:        a: "Standard gives you the full trend intelligence layer: Gap Index, Margin Multiplier, Platform Velocity, Growth Signal. That alone replaces 58 hours of manual sourcing research per month. Alpha adds the action layer: verified factory contacts, MOQ + EXW pricing, HS Code reference, compliance flags, 4K On-Site Sourcing Footage (Raw), SEO keywords, and a broker email draft. The $120 difference buys you a complete sourcing brief — ready to act on, not just read. If your average margin is $8/unit and you source 200 units from one Alpha-sourced product, that's $1,600 gross from a $199 subscription. The math works on the first product.",
./components/IntelligencePipeline.tsx:18:  { main: "Exact MOQ & Unit Cost", sub: "— EXW price locked" },
./components/LandingTimeWidget.tsx:187:              † HS Code classifications, MOQ figures, and compliance data provided by
./components/report/SupplierContact.tsx:249:              <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">MOQ</p>
./components/report/SupplierContact.tsx:252:                  {report.moq?.trim() || "—"}

=== LEAD TIME ===
./app/admin/[id]/page.tsx:82:  lead_time: "리드타임",
./app/admin/[id]/page.tsx:287:    "verified_cost_usd", "verified_cost_note", "verified_at", "moq", "lead_time", "sample_policy", "export_cert_note",
./app/admin/[id]/page.tsx:1446:                <label className={labelClass}>Lead Time (리드타임)</label>
./app/admin/[id]/page.tsx:1448:                  value={formData.lead_time ?? ""}
./app/admin/[id]/page.tsx:1449:                  onChange={(e) => setFormData((p) => ({ ...p!, lead_time: e.target.value }))}
./app/legal/privacy/page.tsx:31:          <p className="text-[#4A4845] leading-relaxed">You have the right to request access to, correction of, or deletion of your personal data at any time. To submit a data deletion request, contact us at <a href="mailto:support@koreascout.com" className="text-[#16A34A] underline">support@koreascout.com</a>.</p>
./app/legal/terms/page.tsx:20:          <p className="text-[#4A4845] leading-relaxed">Subscriptions are automatically renewed on a monthly basis. By subscribing, you acknowledge and consent to recurring charges until you cancel. Subscribers may cancel at any time. Upon cancellation, full access to the subscribed tier is retained through the end of the current billing cycle. No partial refunds will be issued for unused days.</p>
./app/legal/terms/page.tsx:25:          <p className="text-[#4A4845] leading-relaxed">KoreaScout targets weekly delivery of curated intelligence reports. The exact number of featured products per issue may vary based on market conditions and our quality standards. KoreaScout does not guarantee a fixed number of reports per issue, and fluctuations in report volume do not constitute grounds for a refund. KoreaScout does not guarantee 100% uptime and shall not be liable for temporary service interruptions caused by technical issues, maintenance, or factors beyond our control.</p>
./app/page.tsx:170:                    { text: "Production & Lead Time Data", lock: false },
./app/pricing/page.tsx:98:      { feature: "Est. Production Lead Time", free: "—", standard: "—", alpha: "✓" },
./components/AlphaVaultPreview.tsx:14:  "Lead Time: ██ days †",
./components/report/SupplierContact.tsx:258:                Est. Production Lead Time
./components/report/SupplierContact.tsx:262:                  {report.lead_time?.trim() || "—"}

=== OEM/ODM ===
./app/admin/[id]/page.tsx:101:  can_oem: "OEM가능여부",
./app/admin/[id]/page.tsx:281:    "shipping_tier", "key_risk_ingredient", "hazmat_summary", "global_site_url", "b2b_inquiry_url", "can_oem", "ai_image_url",
./app/admin/[id]/page.tsx:1390:                <label className={labelClass}>Can OEM (OEM가능여부)</label>
./app/admin/[id]/page.tsx:1392:                  value={formData.can_oem === true ? "true" : formData.can_oem === false ? "false" : ""}
./app/admin/[id]/page.tsx:1395:                    can_oem: e.target.value === "true" ? true : e.target.value === "false" ? false : null
./components/report/SupplierContact.tsx:268:                OEM / ODM
./components/report/SupplierContact.tsx:272:                  {report.can_oem == null ? "—" : report.can_oem ? "Available" : "Not Available"}

=== LAUNCH KIT COMPONENT ===
./components/LaunchKit.tsx
./app/admin/[id]/page.tsx:1274:        {/* Section 7 — Global Market Prices (before Launch Kit) */}
./app/admin/[id]/page.tsx:1303:        {/* Section 6 — Launch & Execution Kit (default open) */}
./app/admin/[id]/page.tsx:1310:            <span className="text-sm font-semibold text-[#1A1916]">Launch & Execution Kit</span>
./app/page.tsx:317:                    t: "Launch Kit",
./app/pricing/page.tsx:95:    label: "Launch & Execution Kit",
./app/weekly/[weekId]/[id]/page.tsx:139:    { id: "section-6", label: "Launch Kit", icon: null },
./components/LaunchKit.tsx:13:export default function LaunchKit() {
./components/report/SupplierContact.tsx:209:          Launch &amp; Execution Kit
```

### `round1_code_context.txt` (전체, `c:\k-productscout\round1_code_context.txt`와 동일)

```
=== MARKETINTELLIGENCE.TSX CONTEXT ===
                    {estimatedCost ? `~$${estimatedCost}` : "—"}
                  </p>
                </LockedValue>
                <p className="text-xs text-[#9E9C98] mt-2">Est. KR Wholesale</p>
                <div style={{ marginTop: "0.6cm" }}>
                  {isAlpha ? (
                    <ScrollToIdButton sectionId="section-6" className="text-base font-bold text-[#16A34A] hover:underline transition-colors">
                      ✓ View Verified Supplier Cost ↓
                    </ScrollToIdButton>
                  ) : (
                    <button disabled className="inline-flex items-center gap-2 text-base font-bold text-[#9E9C98] cursor-not-allowed">
                      🔒 View Verified Supplier Cost
                      <span className="text-[10px] font-bold text-white bg-[#16A34A] rounded-full px-2 py-0.5">Alpha</span>
                    </button>
                  )}
                </div>
              </div>
              <div className={strategicTarget ? "px-8 border-r border-[#E8E6E1]" : "pl-8"}>
                <p className="text-lg font-bold text-[#6B6860] uppercase tracking-widest" style={{ marginTop: "0.8cm" }}>
                  Global Valuation
                </p>

=== FINANCIAL BRIEFING COMPONENT CONTEXT ===
File: ./components/report/SupplierContact.tsx, Lines: 206-246
    <section className="bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
      <>
        <h2 className="text-3xl font-bold text-[#1A1916] mb-4 tracking-tight">
          Launch &amp; Execution Kit
        </h2>
        <p className="text-sm text-[#6B6860] mb-8">
          From product discovery to live campaign — everything you need.
        </p>

        <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-6 mt-6">
          <p className="text-xl font-bold text-[#1A1916] mb-10">Financial Briefing</p>

          <div className="mb-6">
            <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">
              Cost Per Unit
            </p>
            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="80px">
              {hasVerifiedPrice && !isUndisclosed ? (
                <div>
                  <p className="text-5xl font-black tracking-tighter text-[#1A1916]">
                    ${costNum.toFixed(2)}
                  </p>
                  {report.verified_at && (
                    <p className="text-xs text-[#9E9C98] mt-2">
                      Verified by KoreaScout on{" "}
                      {new Date(report.verified_at).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              ) : verifiedCostUsd != null && isUndisclosed ? (
                <p className="text-sm italic text-[#6B6860] leading-relaxed">
                  Pricing verified and on file. Contact the manufacturer directly.
                </p>
              ) : (
                <p className="text-sm italic text-[#9E9C98]">Not available</p>
              )}
            </LockedValue>
          </div>

```

참고: Step 3B `sed` 루프 산출은 **라인 246에서 잘림**; Financial Briefing 블록 **전체**는 본 보고서 **TARGET 2 → Code Context**의 `215:277` 코드 인용을 기준으로 함.

---

## CRITICAL FINDINGS

### Dependencies to Check

| 항목 | 경로 / 위치 | 설명 |
|------|----------------|------|
| 앵커 스크롤 | `c:\k-productscout\components\report\MarketIntelligence.tsx` **266**–**268** | `ScrollToIdButton` → `sectionId="section-6"` |
| 섹션 ID | `c:\k-productscout\app\weekly\[weekId]\[id]\page.tsx` **139** | `{ id: "section-6", label: "Launch Kit", ... }` — 버튼 제거 후에도 네비/앵커는 유지됨 |
| `LaunchKit.tsx` | `c:\k-productscout\components\LaunchKit.tsx` | 별도 마케팅용 컴포넌트; PDP `SupplierContact` 와는 다른 파일 |
| 랜딩/가격 카피 | `c:\k-productscout\app\pricing\page.tsx` **97**–**98**, `c:\k-productscout\app\page.tsx` 등 | "Cost Per Unit & MOQ", "Lead Time" **문구**는 PDP 외에도 존재 — **이번 Round 1 PDP 삭제와 무관할 수 있음** |
| 어드민 | `c:\k-productscout\app\admin\[id]\page.tsx` | `moq`, `lead_time`, `can_oem`, `verified_cost_usd` 편집 필드 — PDP 섹션 삭제와 독립 |

### Recommended Deletion Order

1. `c:\k-productscout\components\report\SupplierContact.tsx` **215**–**277** (`Financial Briefing` 카드 전체)
2. 동일 파일 **43**–**50** (및 **44** `verifiedCostNote`가 다른 곳에 미사용이면) 미사용 변수·import 정리
3. `c:\k-productscout\components\report\MarketIntelligence.tsx` **264**–**275** (버튼 `div` 및 `ScrollToIdButton` / disabled `button`)
4. `ScrollToIdButton` import가 `MarketIntelligence.tsx` 내 다른 사용처가 없으면 import 제거

---

## READY FOR EXECUTION

- ✅ File locations confirmed  
- ✅ Line numbers identified  
- ✅ Code context reviewed (소스 인용 + `round1_*.txt`)  
- ⚠️ Dependencies: 위 표 참고 — **"의존성 없음"은 아님** (`section-6` 연결, 미사용 변수 정리)

**STATUS:** Round 1 삭제 실행 프롬프트 작성 가능 (코드 변경은 본 문서 범위 외)

---

## END OF REPORT
