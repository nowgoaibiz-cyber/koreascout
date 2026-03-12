# KoreaScout Product Detail Page (PDP) — Technical Audit Report

**Target route:** `/weekly/[weekId]/[id]`  
**Target URL:** `http://localhost:3000/weekly/2026-W10/105b4afe-2045-4209-a2ef-5835cc5964d5`  
**Scope:** All files related to PDP: page, child components, data-fetching.  
**Audit type:** Investigation and report only. No code modified.

---

## PDP-related files

| File | Role |
|------|------|
| `app/weekly/[weekId]/[id]/page.tsx` | PDP server component; fetches report via `scout_final_reports` select("*"), week, favorites |
| `components/ProductIdentity.tsx` | Section 1: identity, image, H1, price, viability |
| `components/report/TrendSignalDashboard.tsx` | Section 2: market score, competition, gap, platform breakdown, growth |
| `components/report/MarketIntelligence.tsx` | Section 3: margin, global prices, search/growth, analyst brief |
| `components/report/SocialProofTrendIntelligence.tsx` | Section 4: buzz, gap analysis, keywords/hashtags, strategy steps |
| `components/report/SourcingIntel.tsx` | Section 5: export readiness, HS/broker, logistics, hazmat, composition/spec |
| `components/report/SupplierContact.tsx` | Section 6: Launch Kit — cost, MOQ, lead time, supplier, assets |
| `components/report/utils.ts` | safeParsePlatformScores, parseGlobalPricesForGrid, normalizeToArray, parseSourcingStrategy, etc. |
| `components/report/constants.ts` | SHIPPING_TIER_TOOLTIP etc. |
| `components/GroupBBrokerSection.tsx` | HS Code & Broker (used inside SourcingIntel) |
| `components/HazmatBadges.tsx` | Hazmat flags (used inside SourcingIntel) |
| `components/ExpandableText.tsx` | composition_info / spec_summary (used in SourcingIntel) |
| `components/BrokerEmailDraft.tsx` | Email body from report (used in GroupBBrokerSection) |
| `components/LockedSection.tsx`, `components/layout/ClientLeftNav.tsx` | Layout / paywall |
| `types/database.ts` | ScoutFinalReportsRow (no m_address, b2b_inquiry_url, global_site_url, sourcing_tip_logistics, hazmat_summary, min_order_hint, export_posture, can_oem, data_confidence, data_anomaly_alert, go_verdict, customs_confidence, composite_score) |

Data fetching: single `supabase.from("scout_final_reports").select("*").eq("id", id).eq("week_id", weekId).eq("status", "published").single()` in the page. No getServerSideProps/getStaticProps; Next.js App Router server component.

---

## AUDIT TASK 1 — DB-TO-UI SYNCHRONIZATION GAP

For each field of `scout_final_reports` (and audit list), status: **[RENDERED]** / **[MISSING]** / **[PARTIALLY RENDERED]**.

- [RENDERED] **product_name** — ProductIdentity.tsx (alt line 101, H1 fallback line 153, subtitle 156–158), BrokerEmailDraft.tsx (lines 31, 41)
- [RENDERED] **translated_name** — ProductIdentity.tsx (H1 line 153), BrokerEmailDraft.tsx (lines 31, 41)
- [RENDERED] **category** — ProductIdentity.tsx (lines 124–127), BrokerEmailDraft.tsx (line 42)
- [RENDERED] **image_url** — ProductIdentity.tsx (lines 98–101), BrokerEmailDraft.tsx (lines 108–109)
- [RENDERED] **viability_reason** — ProductIdentity.tsx (lines 218–222)
- [RENDERED] **market_viability** — TrendSignalDashboard.tsx (lines 10, 37)
- [RENDERED] **competition_level** — TrendSignalDashboard.tsx (lines 11, 43–50)
- [RENDERED] **gap_status** — TrendSignalDashboard.tsx (lines 12, 57–63), SocialProofTrendIntelligence.tsx (lines 97–108)
- [RENDERED] **growth_signal** — TrendSignalDashboard.tsx (lines 21, 120–122)
- [RENDERED] **growth_evidence** — TrendSignalDashboard.tsx (lines 22, 125–126)
- [RENDERED] **new_content_volume** — TrendSignalDashboard.tsx (lines 23, 128–129)
- [RENDERED] **platform_scores** — TrendSignalDashboard.tsx (lines 13, 74–111) via safeParsePlatformScores
- [RENDERED] **buzz_summary** — SocialProofTrendIntelligence.tsx (lines 36–45)
- [RENDERED] **kr_local_score** — SocialProofTrendIntelligence.tsx (lines 50–62)
- [RENDERED] **global_trend_score** — SocialProofTrendIntelligence.tsx (lines 50, 74–81)
- [RENDERED] **gap_index** — SocialProofTrendIntelligence.tsx (lines 91–96)
- [RENDERED] **opportunity_reasoning** — SocialProofTrendIntelligence.tsx (lines 111–114)
- [RENDERED] **rising_keywords** — SocialProofTrendIntelligence.tsx (lines 20, 124–134) via normalizeToArray
- [RENDERED] **seo_keywords** — SocialProofTrendIntelligence.tsx (lines 21, 142–158) via normalizeToArray
- [RENDERED] **viral_hashtags** — SocialProofTrendIntelligence.tsx (lines 22, 162–178) via normalizeToArray
- [MISSING] **best_platform** — Not rendered anywhere on PDP (present in types/database.ts and data/sampleReportData.ts only)
- [MISSING] **trend_entry_strategy** — Not rendered anywhere on PDP
- [RENDERED] **kr_source_used** — SocialProofTrendIntelligence.tsx (lines 68–69)
- [RENDERED] **kr_evidence** — SocialProofTrendIntelligence.tsx (lines 64–66)
- [RENDERED] **global_evidence** — SocialProofTrendIntelligence.tsx (lines 82–84)
- [PARTIALLY RENDERED] **kr_price** — ProductIdentity.tsx (lines 83–84, 164–178): used with `Number(report.kr_price)` and displayed as KRW. If DB stores formatted string (e.g. `"12,000원"`), Number() yields NaN and display/calculation break
- [MISSING] **kr_price_usd** — Not displayed on PDP (ProductIdentity derives USD from kr_price + live rate)
- [RENDERED] **estimated_cost_usd** — ProductIdentity.tsx (lines 192–196), MarketIntelligence.tsx (lines 16, 78–80)
- [RENDERED] **profit_multiplier** — MarketIntelligence.tsx (lines 17, 65, 33)
- [RENDERED] **search_volume** — MarketIntelligence.tsx (lines 39, 194–198)
- [RENDERED] **mom_growth** — MarketIntelligence.tsx (lines 40, 201–212)
- [RENDERED] **wow_rate** — MarketIntelligence.tsx (lines 41, 214–225)
- [RENDERED] **global_prices** — MarketIntelligence.tsx (line 18 parseGlobalPricesForGrid), SupplierContact.tsx (lines 46–54, 63–69)
- [RENDERED] **top_selling_point** — MarketIntelligence.tsx (lines 44, 232–236)
- [RENDERED] **common_pain_point** — MarketIntelligence.tsx (lines 45, 238–243)
- [RENDERED] **composition_info** — SourcingIntel.tsx (lines 165–170 ExpandableText), BrokerEmailDraft.tsx (line 52)
- [RENDERED] **spec_summary** — SourcingIntel.tsx (lines 172–176 ExpandableText)
- [RENDERED] **actual_weight_g** — SourcingIntel.tsx (lines 26, 94–95), BrokerEmailDraft.tsx (line 88)
- [RENDERED] **volumetric_weight_g** — SourcingIntel.tsx (lines 27, 102–103, 118)
- [RENDERED] **billable_weight_g** — SourcingIntel.tsx (lines 28, 114–115)
- [RENDERED] **dimensions_cm** — SourcingIntel.tsx (lines 104–107), BrokerEmailDraft.tsx (line 87)
- [RENDERED] **shipping_tier** — SourcingIntel.tsx (lines 125–129) via describeShippingTier
- [RENDERED] **shipping_notes** — SourcingIntel.tsx (lines 199–228)
- [RENDERED] **hazmat_status** — page.tsx (line 71 hasLogistics), SourcingIntel.tsx (line 137 HazmatBadges), BrokerEmailDraft.tsx (lines 56–71)
- [MISSING] **hazmat_summary** — Not in ScoutFinalReportsRow; not rendered
- [RENDERED] **sourcing_tip** — SocialProofTrendIntelligence.tsx (parseSourcingStrategy steps 1–3), SourcingIntel.tsx (parseSourcingStrategy steps 4–5, shipping notes), SupplierContact hasSupplierFields
- [MISSING] **sourcing_tip_logistics** — Not in ScoutFinalReportsRow; not rendered
- [RENDERED] **m_name** — page.tsx hasSupplier (line 87), SupplierContact.tsx (lines 19, 203–206)
- [MISSING] **m_address** — Not in ScoutFinalReportsRow; not rendered
- [RENDERED] **m_homepage** — page.tsx (line 91), SupplierContact.tsx (lines 23, 224–229)
- [MISSING] **global_site_url** — Not in ScoutFinalReportsRow; not rendered
- [RENDERED] **contact_email** — SupplierContact.tsx (lines 21, 210–215)
- [RENDERED] **contact_phone** — SupplierContact.tsx (lines 22, 217–222)
- [MISSING] **b2b_inquiry_url** — Not in ScoutFinalReportsRow; not rendered
- [PARTIALLY RENDERED] **corporate_scale** — Used in page.tsx hasSupplier (line 88) and SupplierContact hasSupplierFields (line 20) to show Section 6; value never displayed in UI
- [MISSING] **export_posture** — Not in ScoutFinalReportsRow; not rendered
- [MISSING] **can_oem** — Not in ScoutFinalReportsRow; not rendered
- [MISSING] **min_order_hint** — Not in ScoutFinalReportsRow; not rendered
- [RENDERED] **naver_link** — page.tsx (line 92), BrokerEmailDraft.tsx (lines 108–110); not in SupplierContact contact cards
- [RENDERED] **wholesale_link** — page.tsx (line 93), SupplierContact.tsx (lines 25, 231–236)
- [RENDERED] **export_status** — ProductIdentity.tsx (lines 72–79, 131–134), SourcingIntel.tsx (lines 35–74), BrokerEmailDraft (context)
- [RENDERED] **hs_code** — GroupBBrokerSection.tsx (lines 41–52), BrokerEmailDraft.tsx (lines 46–47), page.tsx hasLogistics
- [RENDERED] **hs_description** — GroupBBrokerSection.tsx (lines 53–56), BrokerEmailDraft.tsx (line 47)
- [RENDERED] **status_reason** — SourcingIntel.tsx (lines 65–67), BrokerEmailDraft.tsx (line 48)
- [RENDERED] **required_certificates** — SourcingIntel.tsx (lines 31–32, 151–161), BrokerEmailDraft.tsx (lines 79–82)
- [RENDERED] **key_risk_ingredient** — SourcingIntel.tsx (lines 139–145), BrokerEmailDraft.tsx (line 53)
- [MISSING] **customs_confidence** — Not in ScoutFinalReportsRow; not rendered
- [MISSING] **composite_score** — Not in ScoutFinalReportsRow; not rendered
- [MISSING] **go_verdict** — Not in ScoutFinalReportsRow; not rendered
- [MISSING] **data_confidence** — Not in ScoutFinalReportsRow; not rendered
- [MISSING] **data_anomaly_alert** — Not in ScoutFinalReportsRow; not rendered
- [RENDERED] **export_cert_note** — SupplierContact.tsx (lines 266–270)
- [RENDERED] **verified_at** — SupplierContact.tsx (lines 164–172)
- [RENDERED] **moq** — SupplierContact.tsx (lines 183–189)
- [RENDERED] **lead_time** — SupplierContact.tsx (lines 190–196)
- [RENDERED] **video_url** — SupplierContact.tsx (lines 39–40, 81–91)
- [RENDERED] **viral_video_url** — SupplierContact.tsx (lines 38–39, 71–79)

---

## AUDIT TASK 2 — DATA TYPE & DOUBLE SERIALIZATION AUDIT

### 2-A: Double serialization (hazmat_status, platform_scores, global_prices)

- **hazmat_status**  
  - **Where used:** `app/weekly/[weekId]/[id]/page.tsx` line 71 (cast to object for hasLogistics); `components/SourcingIntel.tsx` line 137 passed to `HazmatBadges`; `components/HazmatBadges.tsx` `parseHazmatStatus(status)`; `components/BrokerEmailDraft.tsx` lines 56–62.  
  - **Parsing:** HazmatBadges and BrokerEmailDraft: if `typeof raw === "string"` then `JSON.parse(raw)`; if still string, second `JSON.parse`. Page only checks `typeof hazmatStatus === "object"` (no parse).  
  - **Verdict:** [SAFE] — Double-serialized string is parsed in components that use the value; page only uses it for section visibility and does not read properties.

- **platform_scores**  
  - **Where used:** `components/report/TrendSignalDashboard.tsx` line 13: `safeParsePlatformScores(report.platform_scores)`.  
  - **Parsing:** `utils.ts` safeParsePlatformScores: if string, `parsed = JSON.parse(parsed)`; if still string, second `JSON.parse`; then returns object or null.  
  - **Verdict:** [SAFE]

- **global_prices**  
  - **Where used:** `components/report/MarketIntelligence.tsx` line 18 `parseGlobalPricesForGrid(report.global_prices, ...)`; `components/report/SupplierContact.tsx` lines 46–54.  
  - **Parsing:** parseGlobalPricesForGrid: if string, `p = JSON.parse(p)` then again if still string. SupplierContact: `if (typeof raw === "string") { const once = JSON.parse(raw); rawPrices = typeof once === "string" ? JSON.parse(once) : once; }`.  
  - **Verdict:** [SAFE]

### 2-B: Array vs string (rising_keywords, seo_keywords, viral_hashtags)

- **rising_keywords, seo_keywords, viral_hashtags**  
  - **Where used:** `components/report/SocialProofTrendIntelligence.tsx` lines 20–22: `normalizeToArray(report.rising_keywords)` etc., then `.map()` for pills.  
  - **Handling:** `utils.ts` normalizeToArray: if array, `raw.map(String).join(",")` then split; if string, use as-is then split; strips `[]\"` and splits by comma. Always returns string[]; .map() is on that array.  
  - **Verdict:** [ARRAY HANDLED] — Both array and string from DB are normalized to array before .map().

### 2-C: Number type (profit_multiplier, gap_index, composite_score)

- **profit_multiplier**  
  - **Where used:** `components/report/MarketIntelligence.tsx` lines 17, 33, 65, 37: `const profitMultiplier = report.profit_multiplier ?? null`; then `globalValuation = estimatedCost * profitMultiplier`; display `String(profitMultiplier ?? "").replace(/[x×]/gi, "")`.  
  - **Type handling:** No `Number()` or `parseFloat()` before arithmetic. If Supabase returns string (e.g. `"3.2"`), `estimatedCost * profitMultiplier` is numeric * string → NaN.  
  - **Verdict:** [STRING TYPE - will break calculations] when DB returns string.

- **gap_index**  
  - **Where used:** `components/report/SocialProofTrendIntelligence.tsx` lines 91, 95: `report.gap_index != null` and `{report.gap_index}`. Also `style={{ width: `${Math.min(report.kr_local_score || 0, 100)}%` }}` (uses kr_local_score, not gap_index).  
  - **Type handling:** Only displayed as text; no arithmetic. If string, still renders.  
  - **Verdict:** [NUMBER SAFE] for display; no arithmetic on gap_index.

- **composite_score**  
  - **Where used:** Not in ScoutFinalReportsRow and not referenced in PDP code.  
  - **Verdict:** N/A — not used.

---

## AUDIT TASK 3 — CONTENT STRUCTURE INVESTIGATION

### 3-A: composition_info rendering

- **Component:** `components/SourcingIntel.tsx` lines 165–170: `report.composition_info` passed to `ExpandableText text={report.composition_info} label="Ingredients"`.
- **ExpandableText:** `components/ExpandableText.tsx`: renders `<p ref={ref} className={...}> {text} </p>` with line-clamp when collapsed. No split on `\n\n`; no separate blocks for “Korean original / English INCI / Disclaimer”; no `white-space: pre-wrap` (or equivalent) applied.
- **Verdict:** [WALL OF TEXT] — Single block; no 3-part split; newlines not explicitly preserved (browser may collapse whitespace).

### 3-B: sourcing_tip rendering

- **Component:** `components/report/SocialProofTrendIntelligence.tsx` and `SourcingIntel.tsx` use `parseSourcingStrategy(report.sourcing_tip)` from `components/report/utils.ts`.
- **Logic:** parseSourcingStrategy uses fixed Korean regex patterns: `[마케팅\s*전략]`, `[가격\s*[\/·]\s*마진\s*전략]`, `[B2B\s*소싱\s*전략]`, `[통관\s*[\/·]\s*규제\s*전략]`, `[물류\s*[\/·]\s*배송\s*전략]`. Content between matches is extracted as step content. If no match, entire trimmed string becomes a single “Strategy Overview” step. Step content is rendered with `whitespace-pre-line` (SocialProofTrendIntelligence line 221, SourcingIntel line 219).
- **Bracket headers:** Headers are detected only when they match the Korean patterns above. English brackets such as `[Marketing Strategy]` or `[Price / Margin Strategy]` are not matched, so they are not rendered as bold titles.
- **Verdict:** [HEADER PARSED] for Korean bracket headers only; [PLAIN TEXT DUMP] for English bracket headers (no parsing logic for them).

---

## AUDIT TASK 4 — H1 HEADER AUDIT

- **Location:** `components/ProductIdentity.tsx` lines 149–156.
- **Code:** `<h1 ...> {report.translated_name || report.product_name} </h1>`
- **Verdict:** [CORRECT - uses translated_name] — H1 prefers translated_name (English); product_name (Korean) is fallback.

---

## AUDIT TASK 5 — NULL SAFETY & CRASH PREVENTION AUDIT

Findings: file, line, snippet, field, and potential crash.

1. **ProductIdentity.tsx, 83–84**  
   - `const usdPrice = report.kr_price != null ? (Number(report.kr_price) / exchangeRate).toFixed(2) : null;`  
   - **Field:** kr_price (often string e.g. `"12,000원"`).  
   - **Risk:** `Number("12,000원")` → NaN; toFixed(2) → `"NaN"`; no crash but wrong UI.

2. **ProductIdentity.tsx, 171**  
   - `KRW {Number(report.kr_price).toLocaleString()}`  
   - **Field:** kr_price.  
   - **Risk:** Same as above; displays "KRW NaN" when kr_price is formatted string.

3. **MarketIntelligence.tsx, 33**  
   - `globalValuation = estimatedCost * profitMultiplier`  
   - **Field:** profit_multiplier.  
   - **Risk:** If DB returns string, result is NaN; globalValuationDisplay becomes "—" or "~$NaN" (toFixed(2) → "NaN"). Possible confusion; arithmetic is broken.

4. **MarketIntelligence.tsx, 159–161**  
   - `market.row!.priceDisplay`, `market.row!.platform` inside `!isUntapped` block.  
   - **Field:** global_prices (via rows).  
   - **Risk:** findRow can return undefined; row is only used when !isUntapped (market.row truthy). If row exists but priceDisplay/platform missing, optional chaining would be safer; currently non-null assertion. Low crash risk if parseGlobalPricesForGrid always returns consistent shape.

5. **SourcingIntel.tsx, 118**  
   - `report.volumetric_weight_g! > report.actual_weight_g!`  
   - **Field:** volumetric_weight_g, actual_weight_g.  
   - **Risk:** Inside `hasVol && hasActual` so both are truthy; assertion is redundant. Safe in practice.

6. **SocialProofTrendIntelligence.tsx, 60, 79**  
   - `style={{ width: `${Math.min(report.kr_local_score || 0, 100)}%` }}` and same for global_trend_score.  
   - **Field:** kr_local_score, global_trend_score.  
   - **Risk:** If DB returns string (e.g. `"75"`), Math.min("75", 100) coerces to 75; works. If invalid string, could get NaN%; still no throw.

7. **SupplierContact.tsx, 210–235**  
   - `report.contact_email!.trim()`, `report.contact_phone!.trim()`, `report.m_homepage!.trim()`, `report.wholesale_link!.trim()` inside filter(Boolean) branches that already check `.trim()`.  
   - **Field:** contact_email, contact_phone, m_homepage, wholesale_link.  
   - **Risk:** Logic ensures truthy after trim; non-null assertion is redundant. Safe if invariants hold.

8. **page.tsx, 69**  
   - `const hazmatStatus = report.hazmat_status as Record<string, unknown> | null;` then `(hazmatStatus && typeof hazmatStatus === "object")`.  
   - **Field:** hazmat_status.  
   - **Risk:** If hazmat_status is double-serialized string, typeof is "string", so object check fails and section is hidden; no property access on string. Safe.

9. **Direct .map() on DB array/string fields**  
   - rising_keywords, seo_keywords, viral_hashtags: always wrapped in normalizeToArray() then .map() on result. No .map() on raw report field.  
   - platform_scores: only used via safeParsePlatformScores; then platformData ? platforms.map(...) : "No platform data". No .map() on raw value.  
   - global_prices: only used via parseGlobalPricesForGrid or try/catch parse in SupplierContact. No .map() on raw report.global_prices.  
   - **Verdict:** No unsafe .map() on potentially null/non-array fields.

10. **required_certificates**  
    - SourcingIntel.tsx lines 31–32: `report.required_certificates?.trim() ? report.required_certificates.split(",").map(...)` — optional chaining used; split on null would throw without the trim check. Safe.

**Summary:** No definite crash from null/undefined in the audited code. Main issues: kr_price and profit_multiplier used without numeric normalization (wrong display / NaN), and optional use of non-null assertions where optional chaining would be safer.

---

## PRIORITY FIX LIST

1. **Critical – data/display**  
   - **kr_price as number:** ProductIdentity uses `Number(report.kr_price)` and `Number(report.kr_price).toLocaleString()`. If kr_price is `"12,000원"` or `"12,000"`, parsing is wrong or NaN. Normalize (e.g. strip non-digits, use parseFloat or use kr_price_usd when available) and then format.

2. **High – calculations**  
   - **profit_multiplier type:** In MarketIntelligence, use `Number(profitMultiplier)` or `parseFloat(String(profitMultiplier))` before `estimatedCost * profitMultiplier` and before any display of multiplier, so string values from DB do not produce NaN.

3. **Medium – missing UI**  
   - **best_platform, trend_entry_strategy:** In ScoutFinalReportsRow but not rendered on PDP. Add to appropriate section (e.g. Trend Signal or Market Intelligence) if product requires them.
   - **kr_price_usd:** Available in DB (and trigger); not shown. Consider showing alongside or instead of client-side USD from kr_price when available.

4. **Medium – content structure**  
   - **composition_info:** Split on `\n\n` into Korean / INCI / Disclaimer (or equivalent) and render as separate blocks; consider `white-space: pre-wrap` (or equivalent) so newlines are preserved.
   - **sourcing_tip:** If content uses English bracket headers (e.g. [Marketing Strategy]), add parsing for them or a language-agnostic bracket-header pattern so they render as titles.

5. **Lower – schema/UX**  
   - **corporate_scale:** Used only for section visibility; value not displayed. Expose in Section 6 (e.g. “Company size” or similar) if desired.
   - **Fields not in type/DB:** m_address, b2b_inquiry_url, global_site_url, sourcing_tip_logistics, hazmat_summary, min_order_hint, export_posture, can_oem, data_confidence, data_anomaly_alert, go_verdict, customs_confidence, composite_score — add to schema and UI only if/when backend provides them.

6. **Low – defensive code**  
   - Replace non-null assertions (e.g. MarketIntelligence market.row!, SupplierContact report.contact_email!) with optional chaining or explicit null checks where it improves clarity and safety.

---

*End of audit report. No code was modified.*
