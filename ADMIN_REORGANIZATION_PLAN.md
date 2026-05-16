# Admin Page Reorganization Plan

> **Analysis date:** 2026-05-16  
> **Route:** `/admin/[id]`  
> **Scope:** Read-only structure audit for reorganization planning (no code changed during analysis)

---

## Current File Structure

| Item | Value |
|------|-------|
| **Main component** | `app/admin/[id]/page.tsx` |
| **Default export** | `AdminEditPage` (line 192) |
| **Line count** | **1,571** lines |
| **Related helpers** | `components/admin/GlobalPricesHelper.tsx`, `components/admin/HazmatCheckboxes.tsx`, `components/admin/AiPageLinksHelper.tsx` |
| **Types** | `types/database.ts` → `ScoutFinalReportsRow` |
| **IntelligenceEngine.tsx** | **Does not exist** |
| **IntelligencePipeline.tsx** | Landing S6 only — **not used on admin page** |

### Other admin routes

| Path | Purpose |
|------|---------|
| `app/admin/page.tsx` | Admin list |
| `app/admin/login/page.tsx` | Login |

---

## Collapsible Section Pattern (NOT `CollapsibleSection`)

There is **no** shared `CollapsibleSection` component. Each section uses the same inline pattern:

```tsx
type OpenSections = { s1: boolean; s2: boolean; s3: boolean; s4: boolean; s5: boolean; s6: boolean; s7: boolean };

// State (lines 202–210) — all default to false (including s6; comment says "default open" but state is false)
const [openSections, setOpenSections] = useState<OpenSections>({ s1: false, ... s7: false });

const toggleSection = useCallback((key: keyof OpenSections) => {
  setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
}, []);

// Per section:
<div className="bg-white rounded-2xl border ...">
  <button type="button" onClick={() => toggleSection("sN")} ...>
    <span>Section Title</span>
    <span>{openSections.sN ? "▼" : "▶"}</span>
  </button>
  {openSections.sN && (
    <motion.div className="px-6 pb-6 flex flex-col gap-5 border-t ...">
      {/* fields */}
    </motion.div>
  )}
</div>
```

**Field rendering pattern:**

- Wrapper: `<div className="flex flex-col gap-1.5">`
- Label: `<label className={labelClass}>` (`text-xs font-medium text-[#9E9C98] uppercase tracking-wider`)
- Control: `<input>`, `<textarea>`, `<select>`, read-only `<motion.div className={readOnlyClass}>`, or helper component
- `formData` bound via `setFormData((p) => ({ ...p!, field: value }))`

**Sub-group headers inside Section 6** are plain `<p>` tags — **not** separate collapsibles.

---

## Current Section Order (UI top → bottom)

| # | Toggle key | English title | Korean / notes | Line range |
|---|------------|---------------|----------------|------------|
| — | — | Header (sticky) | Status, Sample toggle, Save | 403–448 |
| 1 | `s1` | Product Identity | 제품 식별 | 494–669 |
| 2 | `s2` | Trend Signal Dashboard | 트렌드 시그널 | 671–792 |
| 3 | `s3` | Market Intelligence | 시장 인텔리전스 | 794–902 |
| 4 | `s4` | Social Proof & Trend Intelligence | 소셜·트렌드 | 904–1083 |
| 5 | `s5` | Export & Logistics Intel | 수출·물류 | 1085–1272 |
| 7 | `s7` | 🌍 Global Market Prices | 글로벌 가격 (renders **before** s6) | 1274–1301 |
| 6 | `s6` | Launch & Execution Kit | 런치·실행 (see sub-groups below) | 1303–1514 |
| — | — | Edit History | 수정 이력 (always visible, not collapsible) | 1516–1566 |

> **Note:** Section keys are `s1`–`s7` but **display order** is s1→s5→**s7**→**s6**.

---

## Section 1: Product Identity

**Line range:** 494–669  
**Component:** Inline in `AdminEditPage` (`toggleSection("s1")`)

| # | Label (EN / KO) | DB column | Type |
|---|-----------------|-----------|------|
| 1 | id (ID) (자동) | `id` | read-only |
| 2 | Image URL (이미지URL) | `image_url` | text + image preview |
| 3 | AI Image URL (AI이미지URL) | `ai_image_url` | text + image preview |
| 4 | Product Name (제품명) | `product_name` | text |
| 5 | Naver Product Name (네이버 상품명) | `naver_product_name` | text |
| 6 | Translated Name (번역명) | `translated_name` | text |
| 7 | Category (카테고리) | `category` | text |
| 8 | KR Price (₩) (한국가격) | `kr_price` | text |
| 9 | USD Price (USD가격) (자동계산) | `kr_price_usd` | read-only |
| 10 | Est. Wholesale Cost (추정도매원가) (자동계산) | `estimated_cost_usd` | read-only |
| 11 | Export Status (수출상태) | `export_status` | select (`Green/Yellow/Red`) |
| 12 | Viability Summary (시장성요약) | `viability_reason` | textarea |
| 13 | GO Verdict (GO판정) | `go_verdict` | select |
| 14 | Composite Score (종합점수) (자동) | `composite_score` | read-only |
| 15 | Naver Link (네이버링크) | `naver_link` | text |
| 16 | Week ID (주차ID) | `week_id` | text |

---

## Section 2: Trend Signal Dashboard

**Line range:** 671–792  
**Component:** Inline (`toggleSection("s2")`)

| # | Label | DB column | Type |
|---|-------|-----------|------|
| 1 | Market Score (0–100) (시장성점수) | `market_viability` | number |
| 2 | Competition Level (경쟁수준) | `competition_level` | select |
| 3 | Growth Evidence (성장근거) | `growth_evidence` | textarea |
| 4 | Growth Signal (성장시그널) | `growth_signal` | text |
| 5 | GAP STATUS / Opportunity Status (갭 상태) | `gap_status` | select |
| 6 | Platform Scores JSON (플랫폼점수) | `platform_scores` | textarea (JSON) |
| 7 | New Content Volume (신규콘텐츠량) | `new_content_volume` | text |
| 8 | OPPORTUNITY REASONING (기회 근거) | `opportunity_reasoning` | textarea |

---

## Section 3: Market Intelligence

**Line range:** 794–902  
**Component:** Inline (`toggleSection("s3")`)

| # | Label | DB column | Type |
|---|-------|-----------|------|
| 1 | Profit Multiplier (마진배수) | `profit_multiplier` | number |
| 2 | Strategic Target Price (전략적 목표가 USD) | `strategy_price` | number (not in FIELD_LABELS_KO) |
| 3 | Winning Feature (핵심강점) | `top_selling_point` | textarea |
| 4 | Pain Point (소비자페인포인트) | `common_pain_point` | textarea |
| 5 | Search Volume (검색볼륨) | `search_volume` | text |
| 6 | MoM Growth (MoM성장률) | `mom_growth` | text |
| 7 | WoW Growth (WoW성장률) | `wow_rate` | text |
| 8 | Best Platform (최적플랫폼) | `best_platform` | text |

---

## Section 4: Social Proof & Trend Intelligence

**Line range:** 904–1083  
**Component:** Inline (`toggleSection("s4")`)

| # | Label | DB column | Type |
|---|-------|-----------|------|
| 1 | Buzz Summary (버즈요약) | `buzz_summary` | textarea |
| 2 | KR Local Score (0–100) | `kr_local_score` | number (auto-updates `gap_index`) |
| 3 | Global Trend Score (0–100) | `global_trend_score` | number (auto-updates `gap_index`) |
| 4 | Gap Index (갭지수) (자동) | `gap_index` | read-only |
| 5 | KR Evidence (국내근거) | `kr_evidence` | textarea |
| 6 | Global Evidence (글로벌근거) | `global_evidence` | textarea |
| 7 | KR Source Used (국내출처) | `kr_source_used` | text |
| 8 | Rising Keywords (상승키워드) | `rising_keywords` | 5× text grid (`ensureLength5`) |
| 9 | SEO Keywords (SEO키워드) | `seo_keywords` | 5× text grid |
| 10 | Viral Hashtags (바이럴해시태그) | `viral_hashtags` | 5× text grid |
| 11 | Scout Strategy Report Steps 1–3 | `sourcing_tip` | 3× textarea (parsed via `parseTipToSteps` / `serializeSourcingTip`) |
| 12 | Trend Entry Strategy (진입전략) | `trend_entry_strategy` | textarea |

**Scout Strategy sub-steps (stored in `sourcing_tip`):**

1. Marketing Strategy  
2. Price / Margin Strategy  
3. B2B Sourcing Strategy  

---

## Section 5: Export & Logistics Intel

**Line range:** 1085–1272  
**Component:** Inline (`toggleSection("s5")`)

| # | Label | DB column | Type |
|---|-------|-----------|------|
| 1 | HS Code (HS코드) | `hs_code` | text |
| 2 | HS Description (HS설명) | `hs_description` | text |
| 3 | Status Reason (상태사유) | `status_reason` | textarea |
| 4 | Composition Info (성분정보) | `composition_info` | textarea |
| 5 | Spec Summary (스펙요약) | `spec_summary` | textarea |
| 6 | Actual Weight (g) | `actual_weight_g` | number (auto `billable_weight_g`) |
| 7 | Volumetric Weight (g) | `volumetric_weight_g` | number |
| 8 | Billable Weight (g) (자동) | `billable_weight_g` | read-only |
| 9 | Dimensions (cm) | `dimensions_cm` | text |
| 10 | Hazmat Status | `hazmat_status` | `HazmatCheckboxes` helper |
| 11 | Required Certificates | `required_certificates` | text |
| 12 | Shipping Notes | `shipping_notes` | textarea |
| 13 | Shipping Tier | `shipping_tier` | text |
| 14 | Key Risk Ingredient | `key_risk_ingredient` | text |
| 15 | Hazmat Summary | `hazmat_summary` | textarea |
| 16 | Compliance & Logistics Strategy Steps 4–5 | `sourcing_tip` | 2× textarea |

**Compliance sub-steps:**

4. Customs / Compliance Strategy  
5. Logistics / Shipping Strategy  

---

## Section 7: Global Market Prices

**Line range:** 1274–1301  
**Component:** Inline (`toggleSection("s7")`)

| # | Label | DB column | Type |
|---|-------|-----------|------|
| 1 | Global Prices (US/UK/EU/JP/SEA/UAE) | `global_prices` | `GlobalPricesHelper` (JSON string) |

---

## Section 6: Launch & Execution Kit (contains all target sub-sections)

**Line range:** 1303–1514  
**Collapsible title:** `Launch & Execution Kit` (English only — **no Korean "런치키트" in UI**)  
**Component:** Inline (`toggleSection("s6")`)

This single collapsible contains **five visual sub-groups**:

### Sub-group A: 📋 제조사·연락처 (Manufacturer & Contact)

**Lines:** 1315–1403

| # | Label | DB column | Type |
|---|-------|-----------|------|
| 1 | Manufacturer Name (제조사명) | `m_name` | text |
| 2 | Corporate Scale (기업 규모) | `corporate_scale` | text |
| 3 | Contact Email (문의 이메일) | `contact_email` | email |
| 4 | Contact Phone (문의 전화번호) | `contact_phone` | tel |
| 5 | Manufacturer Website | `m_homepage` | url |
| 6 | Wholesale Portal (도매 문의 링크) | `wholesale_link` | url |
| 7 | Global Site URL | `global_site_url` | url |
| 8 | B2B Inquiry URL | `b2b_inquiry_url` | url |
| 9 | Can OEM (OEM가능여부) | `can_oem` | select (true/false/null) |

### Sub-group B: 🎯 CEO Direct Input

**Lines:** 1404–1407 (divider + disclaimer only)

- Divider: `🎯 CEO Direct Input` (line 1405)
- Note (line 1407): *"이 구역은 대표님이 브랜드와 직접 협의하거나..."*

**No dedicated fields** under this heading today — B2B/Media/AI fields follow immediately after.

### Sub-group C: B2B 소싱 원가 & 조건

**Lines:** 1409–1468  
**Header:** `B2B 소싱 원가 & 조건` (green, line 1409)

| # | Label | DB column | Type |
|---|-------|-----------|------|
| 1 | Verified Cost (USD) (검증된 원가) | `verified_cost_usd` | text |
| 2 | Verified Cost Note (검증원가메모) | `verified_cost_note` | text |
| 3 | Verified At (검증일시) | `verified_at` | date (`type="date"`) |
| 4 | MOQ (최소주문수량) | `moq` | text |
| 5 | Lead Time (리드타임) | `lead_time` | text |
| 6 | Sample Policy (샘플정책) | `sample_policy` | text |
| 7 | Export Cert Note (수출인증메모) | `export_cert_note` | text |

### Sub-group D: 미디어 & 마케팅 자산

**Lines:** 1470–1494  
**Header:** `미디어 & 마케팅 자산` (blue, line 1470)

| # | Label | DB column | Type | **Current UI order** |
|---|-------|-----------|------|----------------------|
| 1 | Video URL 2 (Additional Footage) | `video_url_2` | text | **1st** |
| 2 | Video URL (영상URL) | `video_url` | text | **2nd** |
| 3 | Video URL 3 (Additional Footage) | `video_url_3` | text | **3rd** |

### Sub-group E: AI 자산

**Lines:** 1496–1511  
**Header:** `AI 자산` (purple, line 1496)

| # | Label | DB column | Type |
|---|-------|-----------|------|
| 1 | YouTube Reference URLs (comma-separated) | `ai_detail_page_links` | `AiPageLinksHelper` (JSON array, max 5 URLs) |

**`AiPageLinksHelper` props:**

```tsx
{ value: string | null; onChange: (newJsonString: string) => void }
```

Parses/stores JSON string array; renders dynamic URL inputs + add/remove (max 5).

---

## Target Section Search Results

| Search term | Found in `app/admin/[id]/page.tsx`? | Location |
|-------------|-------------------------------------|----------|
| 런치키트 | **No** | Only `Launch & Execution Kit` (line 1310) |
| Launch Kit | **Partial** | Comment line 1274; section title uses full name |
| CEO Direct Input | **Yes** | Line 1405 (header only) |
| B2B 소싱 원가 & 조건 | **Yes** | Line 1409 |
| 미디어 & 마케팅 자산 | **Yes** | Line 1470 |
| AI 자산 | **Yes** | Line 1496 |
| ALPHA ONLY — EXECUTION LAYER | **No** | (landing page only) |

---

## Specific Fields — Exact Locations

### B2B fields (all in Section 6, lines 1410–1467)

| Field | Line | DB column | Input type |
|-------|------|-----------|------------|
| Verified Cost (USD) | 1411–1417 | `verified_cost_usd` | text |
| Verified Cost Note | 1420–1426 | `verified_cost_note` | text |
| Verified At | 1429–1435 | `verified_at` | date |
| MOQ | 1438–1443 | `moq` | text |
| Lead Time | 1446–1451 | `lead_time` | text |
| Sample Policy | 1454–1459 | `sample_policy` | text |
| Export Cert Note | 1462–1467 | `export_cert_note` | text |

### Media fields (lines 1471–1493)

| Field | Line | DB column | UI order |
|-------|------|-----------|----------|
| Video URL 2 | 1472–1477 | `video_url_2` | 1 |
| Video URL | 1480–1485 | `video_url` | 2 |
| Video URL 3 | 1488–1493 | `video_url_3` | 3 |

### AI fields (lines 1497–1510)

| Field | Line | DB column | Component |
|-------|------|-----------|-----------|
| YouTube Reference URLs | 1498–1509 | `ai_detail_page_links` | `AiPageLinksHelper` |

### `published_at`

- In `FIELD_LABELS_KO` (line 89) and `formKeys` (line 288)
- **No form field in Section 6** — set via header **Status** dropdown when status = `published` (lines 431, 316)

---

## Edit History (non-collapsible)

**Line range:** 1516–1566  
Reads `formData.edit_history` JSON; table of timestamp / field (Korean via `FIELD_LABELS_KO`) / before / after.

---

## Target Reorganization

### NEW Section 1: 런치키트 (Launch Kit)

**Action:** Split out of current Section 6 — manufacturer/contact + URLs only  
**Proposed toggle key:** `s6a` or rename current `s6` → launch-only  

**Fields to keep here (from Sub-group A, lines 1318–1403):**

1. Manufacturer Name — `m_name` — text  
2. Corporate Scale — `corporate_scale` — text  
3. Contact Email — `contact_email` — email  
4. Contact Phone — `contact_phone` — tel  
5. Manufacturer Website — `m_homepage` — url  
6. Wholesale Portal — `wholesale_link` — url  
7. Global Site URL — `global_site_url` — url  
8. B2B Inquiry URL — `b2b_inquiry_url` — url  
9. Can OEM — `can_oem` — select  

**Optional:** Move `Global Market Prices` (s7) adjacent to Launch Kit for sourcing workflow.

---

### NEW Section 2: CEO 다이렉트 인풋 (CEO Direct Input)

**Action:** Own collapsible; move B2B cost fields from separate sub-header into bottom of this section  

**Fields (proposed order):**

*Top — placeholder for future CEO-only narrative fields (none today except disclaimer)*

*Bottom — moved from "B2B 소싱 원가 & 조건":*

1. Verified Cost (USD) — `verified_cost_usd`  
2. Verified Cost Note — `verified_cost_note`  
3. Verified At — `verified_at`  
4. MOQ — `moq`  
5. Lead Time — `lead_time`  
6. Sample Policy — `sample_policy`  
7. Export Cert Note — `export_cert_note`  

Keep disclaimer: *"이 구역은 대표님이 브랜드와 직접 협의..."* (line 1407)

---

### NEW Section 3: 미디어 & AI 자산 (Media & AI Assets)

**Action:** Merge sub-groups D + E; reorder video fields logically  

**Fields (proposed order):**

1. YouTube Reference URLs — `ai_detail_page_links` — **Suggested rename:** `YouTube Reference URLs (트렌드 참조 영상)` or `Trend Reference Videos (YouTube)`  
2. Video URL (영상URL) — `video_url` — primary footage  
3. Video URL 2 (Additional Footage) — `video_url_2`  
4. Video URL 3 (Additional Footage) — `video_url_3`  

**Note:** Current UI order is 2 → 1 → 3; reorganization should fix to 1 → 2 → 3.

---

## Code Changes Required

1. **Extend `OpenSections` type** — add keys for split sections (e.g. `s6_launch`, `s6_ceo`, `s6_media`) or increase section count; update `toggleSection` usage.

2. **Split Section 6 JSX block (lines 1303–1514)** into 2–3 separate collapsible `<div>` wrappers, each with own `toggleSection` key and title (Korean + English in header).

3. **Move B2B field blocks (1410–1467)** under CEO Direct Input collapsible; remove or repurpose green sub-header `B2B 소싱 원가 & 조건` (line 1409).

4. **Merge Media + AI blocks (1470–1511)** into one collapsible; reorder fields: YouTube → `video_url` → `video_url_2` → `video_url_3`.

5. **Update section comments** — fix "default open" vs `s6: false` if Launch Kit should open by default (`s6: true`).

6. **No DB migration required** — all columns already exist in `ScoutFinalReportsRow`; reorganization is UI-only.

7. **Verify save/diff** — `formKeys` (lines 276–288) already includes all moved fields; order-independent.

8. **Update `FIELD_LABELS_KO`** if any labels renamed (optional).

9. **Consider extracting `CollapsibleSection`** helper to reduce ~1,500-line page duplication (optional refactor).

10. **PDP/report components** — confirm display order for `video_url*` and `ai_detail_page_links` in `components/report/*` if admin order changes.

---

## Helper Components Reference

| Component | File | Used in section |
|-----------|------|-----------------|
| `GlobalPricesHelper` | `components/admin/GlobalPricesHelper.tsx` | s7 |
| `HazmatCheckboxes` | `components/admin/HazmatCheckboxes.tsx` | s5 |
| `AiPageLinksHelper` | `components/admin/AiPageLinksHelper.tsx` | s6 (AI sub-group) |
| `SampleToggle` | inline `page.tsx` line 145 | header |

---

## Appendix: Save pipeline

- **Diff keys:** `formKeys` array lines 276–288  
- **PATCH:** `POST /api/admin/reports/${id}` via `handleConfirmSave`  
- **B2B + media fields in save list:** `verified_cost_usd`, `verified_cost_note`, `verified_at`, `moq`, `lead_time`, `sample_policy`, `export_cert_note`, `video_url_2`, `video_url`, `video_url_3`, `ai_detail_page_links`, `published_at`
