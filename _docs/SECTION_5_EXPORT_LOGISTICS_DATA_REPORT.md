# Section 5: Export & Logistics Intel — Data Mapping & Status Report

**Purpose:** System analysis for revamp; no code modified.  
**Audience:** UI/UX designer (blueprint) and product/engineering.  
**Sources:** `app/weekly/[weekId]/[id]/page.tsx` (SourcingIntel), `types/database.ts`, `PROJECT_2DB_STATUS.md`.

---

## Task 1: Current State Analysis

**Component:** `SourcingIntel` (Section 5: Export & Logistics Intel), lines ~832–977.

The following fields from `scout_final_reports` are **currently rendered** in Section 5:

| DB field | Where / how rendered |
|----------|------------------------|
| **hs_code** | “HS Code & Description” block — monospace code + CopyButton. |
| **hs_description** | Same block — plain text under the code. |
| **hazmat_status** | “Hazmat Check” block — passed to `HazmatBadges` (JSONB parsed as `{ contains_liquid?, contains_powder?, contains_battery?, contains_aerosol? }`). |
| **dimensions_cm** | “Dimensions & Weight” block — “Size: {value} cm”. |
| **billable_weight_g** | Same block — “Billable: {value}g”. |
| **shipping_tier** | Same block — “(shipping_tier)” next to billable weight. |
| **required_certificates** | “Certifications Required” — split by comma, rendered as pill badges. |
| **shipping_notes** | “Detailed Logistics” accordion — raw paragraph. |
| **key_risk_ingredient** | Same accordion — with ⚠️ prefix. |
| **status_reason** | Same accordion — raw paragraph. |
| **actual_weight_g** | Same accordion — “Actual vs volumetric: {actual}g vs {volumetric}g”. |
| **volumetric_weight_g** | Same accordion — same line as above. |
| **sourcing_tip** | Same accordion — raw text (full multi-line; note: same field is also parsed as 5-step strategy in Section 4). |

**Summary:** Section 5 uses **13** distinct DB fields. All of them are logistics/export-related except `sourcing_tip`, which is shared with Section 4.

---

## Task 2: Missing “Golden Data” Check

**Reference:** `types/database.ts` (ScoutFinalReportsRow), `PROJECT_2DB_STATUS.md` (scout_final_reports).

Logistics, shipping, and export compliance fields that **exist in DB / types** and whether they are used in Section 5:

| Field | In DB / types | Used in Section 5? |
|-------|----------------|---------------------|
| actual_weight_g | ✅ | ✅ (accordion) |
| volumetric_weight_g | ✅ | ✅ (accordion) |
| status_reason | ✅ | ✅ (accordion) |
| **export_status** | ✅ | ❌ **Not in Section 5** (only in Section 1 — Product Identity badge) |
| hs_code | ✅ | ✅ |
| hs_description | ✅ | ✅ |
| required_certificates | ✅ | ✅ |
| hazmat_status | ✅ | ✅ |
| key_risk_ingredient | ✅ | ✅ |
| shipping_notes | ✅ | ✅ |
| shipping_tier | ✅ | ✅ |
| billable_weight_g | ✅ | ✅ |
| dimensions_cm | ✅ | ✅ |

**Conclusion:** The only logistics/export field that exists in the DB but is **not** utilized in Section 5 is **`export_status`** (Green/Yellow/Red). It is currently shown only in Section 1 (Product Identity). For a “B2B logistics dashboard” revamp, consider surfacing `export_status` in Section 5 as well (e.g. top-level export readiness badge or summary).

---

## Task 3: “Customs Broker Email Template” Feature

**Planned feature:** Provide `hs_code` + `status_reason` (why this code was chosen / regulatory context) and a “Copy Email Template for Customs Broker” button.

**Current DB structure:**

- **hs_code** — `TEXT | null`. Single code (e.g. `"1234.56"` or `"8471.30"`). Sufficient for one suggested code per product.
- **status_reason** — `TEXT | null`. Described in types as “Regulatory or status reasoning text”. Can hold narrative context (e.g. material, use, country considerations, caveats).

**Assessment:** The current schema is **sufficient** to support this feature:

- The template can concatenate: product identity (e.g. `translated_name`), `hs_code`, and `status_reason`.
- No schema change is strictly required.

**Recommendations for the feature:**

1. **Content shape:** Ensure pipeline/content guidelines populate `status_reason` with broker-friendly copy (e.g. “Suggested HS code XXXX.XX based on [material/use]. Verify for your country of import and product variant.”). Optional: reserve a short “disclaimer” line in the template (e.g. “Seller to confirm with licensed broker.”).
2. **Optional future field:** If you later want a dedicated “customs note” or “broker note” separate from general regulatory reasoning, a field like `customs_broker_note` (TEXT) could be added; for v1, `status_reason` is enough.
3. **Copy behavior:** Button should copy a preformatted email body (subject + body) including at least: product name, `hs_code`, and `status_reason`.

---

## Task 4: Developer Data Mapping Suggestions

### 4.1 Parsing & structure

- **hazmat_status:** Already parsed as a JSON object with four boolean flags; `HazmatBadges` consumes it. No change required. If the pipeline adds more flags later (e.g. `contains_magnet`, `contains_organic`), extend the type and `HazmatBadges` mapping in one place.
- **required_certificates:** Treated as comma-separated text; split in the component. Adequate. If you need structured “cert + expiry” later, consider JSONB or a separate table; for now, TEXT is fine.

### 4.2 Fields to consider adding (for a strong B2B logistics dashboard)

| Suggested field | Type | Purpose |
|-----------------|------|--------|
| **origin_country** | TEXT (e.g. `"KR"`) | Default country of manufacture; useful for customs and broker template. |
| **danger_class** or **un_number** | TEXT / NULL | For dangerous goods (if any); often required for shipping and customs. |
| **billable_weight_source** | TEXT (e.g. `"actual"` / `"volumetric"`) | Clarifies how `billable_weight_g` was derived (actual vs volumetric). |
| **shipping_notes_structured** (optional) | JSONB | If you need carrier-specific or country-specific notes later; otherwise keep a single `shipping_notes` TEXT. |

### 4.3 Fields to consider modifying

- **hs_code:** If you ever need multiple codes (e.g. “primary” vs “alternative”), you could add `hs_code_alt` (TEXT) or move to JSONB `{ primary, alternatives[] }`. For a single suggested code, current TEXT is fine.
- **status_reason:** Keep as TEXT. If it grows long, consider a short “summary” for the broker template and keep full text for the UI (could be same field with clear formatting guidelines).

### 4.4 Fields to consider removing

- None. All fields currently used in Section 5 serve a clear purpose. Avoid removing them; instead, consider **surfacing** underused ones (e.g. `export_status` in Section 5).

### 4.5 UX/data improvements without schema change

1. **Surface `export_status` in Section 5** — e.g. “Export readiness: Green/Yellow/Red” at the top of the section so logistics and compliance are in one place.
2. **Clarify `sourcing_tip` usage** — It is both the 5-step strategy source (Section 4) and raw “Detailed Logistics” content (Section 5). If Section 5 should show only the logistics step, consider:
   - Parsing the same 5-step structure in Section 5 and rendering only the “[물류·배송 전략]” (or equivalent) step, or
   - Adding a dedicated `logistics_tip` or `shipping_tip` field and keeping `sourcing_tip` for the full strategy in Section 4.
3. **Actual vs volumetric** — Already shown in accordion; in a revamp, consider promoting to the main “Dimensions & Weight” block (e.g. “Actual: X g · Volumetric: Y g · Billable: Z g”) for at-a-glance use.
4. **Typing** — Keep `hazmat_status` as a typed JSONB interface (e.g. `HazmatStatus`) in a shared types file so Section 5 and `HazmatBadges` stay in sync.

---

## Summary Table (Section 5 vs DB)

| Category | In Section 5 now | In DB but not in Section 5 | Suggested additions (optional) |
|----------|-------------------|----------------------------|---------------------------------|
| Classification | hs_code, hs_description | — | — |
| Regulatory | status_reason, hazmat_status, key_risk_ingredient, required_certificates | export_status | danger_class / un_number |
| Weights | billable_weight_g, actual_weight_g, volumetric_weight_g | — | billable_weight_source |
| Dimensions / shipping | dimensions_cm, shipping_tier, shipping_notes | — | origin_country |
| Strategy / notes | sourcing_tip (raw in accordion) | — | logistics_tip (or parse sourcing_tip) |

---

*End of report. No code was modified.*
