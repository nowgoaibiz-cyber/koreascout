# Launch & Execution Kit (Section 6) — SupplierContact.tsx Audit Report

**Date:** 2025-03-12  
**Scope:** `components/report/SupplierContact.tsx` — "Launch & Execution Kit" section on the PDP (Section 6).  
**Rule:** No code modified; investigation and reporting only.

---

## AUDIT TASK 1 — CURRENT STATE OF global_prices URLs IN SupplierContact.tsx

### 1.1 EXACT full implementation of SupplierContact.tsx

The file is **363 lines**. Full content as of audit:

```tsx
"use client";

import { Button } from "@/components/ui";
import { ArrowRight, ArrowUpRight, Download, ExternalLink, Film, Globe, ImageIcon, LayoutTemplate, Mail, Phone, Play, ShoppingBag } from "lucide-react";
import type { ScoutFinalReportsRow } from "@/types/database";
import { getAiDetailUrl } from "./utils";

export function SupplierContact({
  report,
  tier,
  isTeaser,
}: {
  report: ScoutFinalReportsRow;
  tier: "free" | "standard" | "alpha";
  isTeaser: boolean;
}) {
  const canSeeAlpha = tier === "alpha" || isTeaser;
  const hasSupplierFields =
    (report.m_name && report.m_name.trim()) ||
    (report.corporate_scale && report.corporate_scale.trim()) ||
    (report.contact_email && report.contact_email.trim()) ||
    (report.contact_phone && report.contact_phone.trim()) ||
    (report.m_homepage && report.m_homepage.trim()) ||
    (report.naver_link && report.naver_link.trim()) ||
    (report.wholesale_link && report.wholesale_link?.trim()) ||
    (report.sourcing_tip && report.sourcing_tip.trim());

  if (!hasSupplierFields && !canSeeAlpha) return null;

  const verifiedCostUsd = report.verified_cost_usd ?? null;
  const verifiedCostNote = report.verified_cost_note?.trim()?.toLowerCase() ?? null;
  const isUndisclosed = verifiedCostNote === "undisclosed";
  const costNum = ...
  const hasVerifiedPrice = !Number.isNaN(costNum);

  const viralUrl = report.viral_video_url?.trim() || null;
  const videoUrl = report.video_url?.trim() || null;
  const aiDetailUrl = getAiDetailUrl(...);
  const marketingUrl = report.marketing_assets_url?.trim() || null;
  const aiImageUrl = report.ai_image_url?.trim() || null;

  let rawPrices: Record<string, { url?: string; platform?: string }> = {};
  try {
    const raw = report.global_prices;
    if (typeof raw === "string") {
      const once = JSON.parse(raw);
      rawPrices = typeof once === "string" ? JSON.parse(once) : (once as typeof rawPrices);
    } else if (raw && typeof raw === "object") {
      rawPrices = raw as typeof rawPrices;
    }
  } catch {
    // ignore
  }
  const regionsList = [
    { id: "us", name: "US" },
    { id: "uk", name: "UK" },
    { id: "sea", name: "SEA" },
    { id: "australia", name: "AU" },
    { id: "india", name: "IN" },
  ];
  const globalProofTags: Array<{ region: string; url: string; platform?: string }> = regionsList
    .map((r) => ({
      region: r.name,
      url: rawPrices[r.id]?.url,
      platform: rawPrices[r.id]?.platform?.trim() || undefined,
    }))
    .filter((t): t is { region: string; url: string; platform: string | undefined } => typeof t.url === "string" && t.url.startsWith("http"));

  // ... assetCards from viralUrl, videoUrl, aiDetailUrl, marketingUrl, aiImageUrl ...

  return (
    <section ...>
      {canSeeAlpha && (
        <>
          <div>
            <h2 ...>Launch & Execution Kit</h2>
            ...
          </div>
          <div ...>Financial Briefing ...</div>
          <div ...>Supplier & Brand Intel ... contacts ... sample_policy ... export_cert_note ...
            {globalProofTags.length > 0 && (
              <div id="global-market-proof" ...>
                <p ...>Global Market Proof</p>
                { ... globalProofTags.map -> <a href={tag.url} target="_blank" ...> ... </a> ... }
              </div>
            )}
          </div>
          {assetCards.length > 0 && ( ... Creative Assets ... )}
        </>
      )}
    </section>
  );
}
```

(Above is a condensed summary; the exact 363-line file is the single source of truth.)

### 1.2 Every place where global_prices is accessed or referenced

| Location | Code | Purpose |
|----------|------|--------|
| **Lines 45–54** | `const raw = report.global_prices;` then parse into `rawPrices` | Read `report.global_prices` (raw from report). If string, double JSON.parse; if object, cast to `Record<string, { url?: string; platform?: string }>`. Result stored in `rawPrices`. |
| **Lines 62–68** | `rawPrices[r.id]?.url` and `rawPrices[r.id]?.platform` inside `regionsList.map(...)` | Build `globalProofTags` from `rawPrices` for keys `us`, `uk`, `sea`, `australia`, `india`. Only entries with `url` that is a string and starts with `http` are kept. |

So: **global_prices** is used only via `report.global_prices` (not a separate prop). It is read once and parsed into `rawPrices`; then URLs are derived in `globalProofTags`.

### 1.3 Every place where any URL from global_prices is rendered or linked

| Location | Code | Behavior |
|----------|------|----------|
| **Lines 276–315** | `{globalProofTags.length > 0 && ( <div id="global-market-proof" ...> ... )}` | When `globalProofTags` has at least one item, a "Global Market Proof" block is rendered. Each `globalProofTags` entry is rendered as a clickable card: `<a href={tag.url} target="_blank" rel="noopener noreferrer" ...>`, with `tag.region` (US, UK, SEA, AU, IN) and optional `tag.platform`. So **URLs from global_prices are rendered here** when (1) parsing produces flat keys (`us`, `uk`, `sea`, `australia`, `india`) and (2) each has a valid `url` string starting with `http`. |

There are no other uses of global_prices URLs in this component. The asset cards use other report fields (viral_video_url, video_url, ai_detail_page_links, etc.), not global_prices.

### 1.4 Does the component receive global_prices as a prop or read from report?

- **Read from `report` directly.** `global_prices` is not a separate prop; it is accessed as `report.global_prices` (inside the `report: ScoutFinalReportsRow` prop).

### 1.5 Report: [URL RENDERED] / [URL REFERENCED BUT NOT DISPLAYED] / [URL NOT USED AT ALL]

- **Verdict: [URL RENDERED]** for the "Global Market Proof" subsection.
- **Caveat:** URLs are only rendered when:
  1. `report.global_prices` parses to a **flat** structure with top-level keys `us`, `uk`, `sea`, `australia`, `india` (and each value has `url`/`platform`). If the DB stores a **nested** structure (e.g. `us_uk_eu.us`, `jp_sea.sea`, `uae.uae`), `rawPrices["us"]` etc. are `undefined`, so `globalProofTags` is empty and no URLs are shown. So with the current nested DB shape, this component would effectively show **no** global_prices URLs (same root cause as in the Global Market Availability audit).

---

## AUDIT TASK 2 — CURRENT PROPS & DATA AVAILABLE

### 2.1 Props that SupplierContact currently accepts

- **report:** `ScoutFinalReportsRow` (full report row from DB)
- **tier:** `"free" | "standard" | "alpha"`
- **isTeaser:** `boolean`

### 2.2 Is global_prices in the props type definition?

- **No.** The props type does not list `global_prices` explicitly. `global_prices` is a field on `report` (from `ScoutFinalReportsRow`), so it is available as `report.global_prices`.

### 2.3 Parsed vs raw global_prices

- **Raw `report.global_prices`** is used. The component does **not** receive the result of `parseGlobalPricesForGrid`. It parses `report.global_prices` internally (lines 44–54) into `rawPrices` and then builds `globalProofTags` from that. So: **raw** `report.global_prices` is passed (via `report`), and parsing is done inside SupplierContact.

### 2.4 Exact prop type definition

```ts
{
  report: ScoutFinalReportsRow;
  tier: "free" | "standard" | "alpha";
  isTeaser: boolean;
}
```

(From the function signature lines 8–15.)

---

## AUDIT TASK 3 — ALPHA PAYWALL CHECK

### 3.1 Is there any existing paywall/locked section logic inside SupplierContact.tsx?

- **Yes.** The entire visible content of the "Launch & Execution Kit" (heading, Financial Briefing, Supplier & Brand Intel, Global Market Proof, Creative Assets) is wrapped in `{canSeeAlpha && ( <> ... </> )}` (lines 145–358). When `canSeeAlpha` is false, the section container still exists (parent controls that), but the inner content is not rendered and the component returns the same section with nothing inside the conditional.

### 3.2 LockedSection or isPremium / isAlpha check

- **No `LockedSection`** inside SupplierContact. The parent page (`app/weekly/[weekId]/[id]/page.tsx`) renders either `<SupplierContact ... />` or `<LockedSection {...SECTION_ALPHA_SUPPLIER_CTA} />` depending on `canSeeAlpha` and `hasSupplier`. So the "locked" state is a **parent-level** swap to LockedSection; inside SupplierContact the only gate is `canSeeAlpha`.

### 3.3 Condition that gates Alpha-only content in this section

- **Inside SupplierContact:** `canSeeAlpha` (line 16).
- **On parent page:** Section 6 is rendered only when `hasSupplier` is true; then either `SupplierContact` (when `canSeeAlpha`) or `LockedSection` (when `!canSeeAlpha`).

### 3.4 Exact gating condition

**Inside SupplierContact.tsx (line 16):**

```ts
const canSeeAlpha = tier === "alpha" || isTeaser;
```

**Usage (lines 145–358):**

```tsx
{canSeeAlpha && (
  <>
    <div>... Launch & Execution Kit title ...</div>
    <div>... Financial Briefing ...</div>
    <div>... Supplier & Brand Intel ... Global Market Proof ...</div>
    {assetCards.length > 0 && ( ... Creative Assets ... )}
  </>
)}
```

So: if `tier !== "alpha"` and `!isTeaser`, the whole Launch Kit body (including Global Market Proof and any future "6 market URLs" block) is hidden.

---

## AUDIT TASK 4 — LAUNCH KIT STRUCTURE AUDIT

### 4.1 Every sub-section or card currently rendered inside SupplierContact.tsx

| # | Sub-section / block | Description |
|---|----------------------|-------------|
| 1 | **Section header** | "Launch & Execution Kit" + short description. |
| 2 | **Financial Briefing** | Cost per unit (verified_cost_usd, verified_at), MOQ (moq), Lead time (lead_time). Optional undisclosed message. |
| 3 | **Supplier & Brand Intel** | Manufacturer name (m_name), contact links (contact_email, contact_phone, m_homepage, wholesale_link), Sample Policy (sample_policy), Compliance Note (export_cert_note), and **Global Market Proof** (global_prices → globalProofTags). |
| 4 | **Global Market Proof** (nested under Supplier & Brand Intel) | Only if `globalProofTags.length > 0`. Renders clickable cards per region (US, UK, SEA, AU, IN) with url and platform from global_prices. |
| 5 | **Creative Assets** | Only if `assetCards.length > 0`. Cards for: Viral Reference (viral_video_url), Raw Ad Footage (video_url), AI Landing Page (ai_detail_page_links), Brand Asset Kit (marketing_assets_url), AI Product Image (ai_image_url). |

### 4.2 DB fields used per sub-section

| Sub-section | DB fields |
|-------------|-----------|
| Financial Briefing | `verified_cost_usd`, `verified_cost_note`, `verified_at`, `moq`, `lead_time` |
| Supplier & Brand Intel | `m_name`, `contact_email`, `contact_phone`, `m_homepage`, `wholesale_link`, `sample_policy`, `export_cert_note`, `global_prices` |
| Global Market Proof | `global_prices` (parsed to rawPrices → globalProofTags) |
| Creative Assets | `viral_video_url`, `video_url`, `ai_detail_page_links`, `marketing_assets_url`, `ai_image_url` |

### 4.3 Is there a dedicated "Global Market URLs" or "Where to Buy" sub-section?

- **Yes, in effect.** "Global Market Proof" (id `global-market-proof`) is the dedicated block that shows global market URLs as clickable links. It currently uses 5 regions (US, UK, SEA, AU, IN) and only shows entries that have a valid `url` after parsing `report.global_prices` with a **flat** key assumption. There is no separate "Where to Buy" title; the label is "Global Market Proof".

### 4.4 Where to insert 6 market URLs (US, UK, EU, JP, SEA, UAE) as clickable links

- **Most logical place:** Reuse and extend the existing **"Global Market Proof"** block (lines 276–315).
  - **Option A:** Extend `regionsList` (and any parsing) to include EU, JP, UAE; flatten nested `global_prices` (e.g. `us_uk_eu`, `jp_sea`, `uae`) so that `rawPrices["eu"]`, `rawPrices["jp"]`, `rawPrices["uae"]` are populated; then the same `globalProofTags` + card grid will show up to 6 links when data exists.
  - **Option B:** Add a **new** sub-section (e.g. "Where to Buy" or "Global Market Links") immediately after "Global Market Proof" (or after Supplier & Brand Intel, before Creative Assets), dedicated to exactly 6 markets (US, UK, EU, JP, SEA, UAE), fed by a shared parsed list (e.g. from a flattened global_prices or from a prop that already has 6 rows with URLs).

Both options should live inside the same `canSeeAlpha` wrapper so they remain Alpha-only.

---

## FINAL DELIVERABLE — EXACT INSERTION RECOMMENDATION

### What to add

- **6 market URLs (US, UK, EU, JP, SEA, UAE)** as clickable links, consistent with the existing "Global Market Proof" style (or a dedicated "Where to Buy" block).

### Component / line to add them

- **Preferred:** Reuse the existing **Global Market Proof** block in **SupplierContact.tsx** at **lines 276–315** (the `{globalProofTags.length > 0 && ( <div id="global-market-proof" ...> ... )}` block).
  - **Change 1 (data):** Extend `regionsList` to include `{ id: "eu", name: "EU" }`, `{ id: "jp", name: "JP" }`, `{ id: "uae", name: "UAE" }` (so 6 regions total: US, UK, EU, JP, SEA, UAE). If the DB stores nested `global_prices` (e.g. `us_uk_eu`, `jp_sea`, `uae`), **flatten** it inside this component (or in a shared util) so that `rawPrices` has keys `us`, `uk`, `eu`, `jp`, `sea`, `uae` (and optionally `australia`, `india` if still desired). Then `globalProofTags` will include up to 6 entries when URLs exist.
  - **Change 2 (UI):** Adjust the grid layout (the `n === 1`, `n === 2`, … branches) so 6 cards are laid out cleanly (e.g. 2×3 or 3×2), or keep the existing logic and add a branch for `n === 6`.
- **Alternative:** Add a **new** sub-section block **after** the closing `</div>` of "Supplier & Brand Intel" (after line 316, before line 318) and **before** `{assetCards.length > 0 && (...)}`. Title it e.g. "Where to Buy" or "Global Market Links", and render 6 fixed cards (US, UK, EU, JP, SEA, UAE) that each show a link when the corresponding URL exists in the parsed data.

### What data needs to be passed as props

- **No new props required** if the fix is confined to SupplierContact and the existing `report` prop.
- **Data source:** Continue using `report.global_prices` and parse it inside SupplierContact. To support the nested DB shape, either:
  - **Option 1:** In SupplierContact, after reading `report.global_prices`, run a small flatten step so that `rawPrices` gets entries for `us`, `uk`, `eu`, `jp`, `sea`, `uae` from the nested object (e.g. from `us_uk_eu.us`, `us_uk_eu.uk`, `us_uk_eu.eu`, `jp_sea.jp`, `jp_sea.sea`, `uae.uae`), then keep using `globalProofTags` as today; or
  - **Option 2:** Have the parent (or a util) produce a pre-flattened list of 6 markets with `{ region, url, platform }` and pass it as a new prop, e.g. `globalMarketLinks?: Array<{ region: string; url: string | null; platform?: string | null }>`. Then SupplierContact would render the 6 cards from this prop when `canSeeAlpha` is true.

So: either **no new props** (flatten inside SupplierContact and extend `regionsList`), or **one new optional prop** (e.g. `globalMarketLinks`) with a pre-computed list of 6 markets.

### How the Alpha gate should wrap it

- **Current behavior:** The entire Launch & Execution Kit content, including Global Market Proof, is already inside `{canSeeAlpha && ( <> ... </> )}` (lines 145–358). So any new or extended "6 market URLs" block must remain **inside** this same `canSeeAlpha` block.
- **Recommendation:** Do **not** add a separate LockedSection or tier check for the 6 links. Keep them inside the existing `canSeeAlpha` wrapper so that:
  - When `tier === "alpha"` or `isTeaser === true`, users see the full Launch Kit including the 6 market URLs (or the extended Global Market Proof).
  - When `tier !== "alpha"` and `!isTeaser`, the parent already shows `LockedSection {...SECTION_ALPHA_SUPPLIER_CTA}` instead of SupplierContact, so the user never sees Section 6 content at all.

No additional Alpha gating logic is required inside SupplierContact for the 6 market URLs.

---

**End of report. No code was modified.**
