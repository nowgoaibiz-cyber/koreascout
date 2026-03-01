# Codebase Diagnostic: Section 6 & Media Vault

**Date:** 2025-03-01  
**Scope:** `app/weekly/[weekId]/[id]/page.tsx`, `components/ContactCard.tsx`  
**No code changes applied.**

---

## 1. Media Vault redundancy

### Data comparison

| Data source | Media Vault (Section 8) | Creative Assets (Section 6, inside SupplierContact) |
|-------------|-------------------------|------------------------------------------------------|
| Product Video | `report.video_url` | `report.video_url` (card "Raw Ad Footage") |
| Viral Video | `report.viral_video_url` | `report.viral_video_url` (card "Viral Reference") |
| AI Product Image | `report.ai_image_url` | **Not used** |
| AI Landing Page | **Not used** | `report.ai_detail_page_links` |
| Brand Asset Kit | **Not used** | `report.marketing_assets_url` |

### Conclusion

- **Product Video** and **Viral Video** are the same fields in both sections. Content is redundant; only presentation differs (Media Vault: YouTube embed + link; Creative Assets: card + link).
- **Media Vault** additionally shows **AI Product Image** (`ai_image_url`). Creative Assets does **not** include this.
- **Creative Assets** additionally shows AI Landing Page and Brand Asset Kit; Media Vault does not.

**Can we safely delete the entire Media Vault block?**

- **Yes**, if you are okay **dropping the "AI Product Image" block** (the image from `report.ai_image_url`). The two video blocks would then only live in Section 6 (Creative Assets).
- **No**, if you want to keep the AI Product Image display. In that case you either keep Media Vault or add an `ai_image_url` card to the Creative Assets gallery and then remove Media Vault.

**Recommendation:** Add an optional 5th card in the Creative Assets gallery for `ai_image_url` (e.g. "AI Product Image"), then remove the Media Vault component and the Section 8 block that renders it.

---

## 2. Missing "AI Landing Page" card

### Where it’s wired

- **Card:** Renders only when `aiDetailUrl` is truthy (lines ~1490–1514).
- **Source:** `aiDetailUrl = getAiDetailUrl(report.ai_detail_page_links)` (line ~1246).

### `getAiDetailUrl` behavior (lines 1175–1188)

```ts
function getAiDetailUrl(raw: string | null | undefined): string | null {
  if (raw == null || typeof raw !== "string") return null;  // ← problem
  const t = raw.trim();
  if (t.startsWith("http")) return t;
  try {
    const parsed = JSON.parse(t) as unknown;
    if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === "string")
      return parsed[0];
    if (typeof parsed === "string") return parsed;
  } catch { /* ignore */ }
  return null;
}
```

### Why the card doesn’t show when data exists

- The function only accepts **string | null | undefined**.
- Supabase **JSONB** columns are returned as **already-parsed** values: **object** or **array**, not string.
- So when `report.ai_detail_page_links` is an **object** (e.g. `{ "url": "https://..." }`) or an **array** (e.g. `["https://..."]`), the first line does:
  - `typeof raw !== "string"` → **true** → returns **null**.
- The code never tries to read a URL from an object or from `parsed[0]` when `raw` is already an object/array. So whenever the API gives parsed JSON, the card will not render.

**Root cause:** Type and handling are string-only. There is no branch for `raw` being an object or array (e.g. take first URL from array or from a known key like `url`/`link`).

---

## 3. Global proof links (bottom of Sourcing Economics block)

### Is there code that maps `report.global_prices` there?

**Yes.** The code is present and used.

- **Location:** Lines 1372–1385, inside the left card of Block 1 (Sourcing Economics).
- **Flow:**
  1. `globalPricesLinks = parseGlobalPrices(...)` (lines 1235–1240). Input is either `report.global_prices` (if string) or `JSON.stringify(report.global_prices)` (if object).
  2. `hasGlobalPrices = globalPricesLinks && Object.keys(globalPricesLinks).length > 0` (line 1241).
  3. When `hasGlobalPrices` is true, a `border-t` block renders and maps `Object.entries(globalPricesLinks!)` to links: `🔗 {key} Ref` with `href={url}` (lines 1372–1385).

### Why links might not appear

- **`parseGlobalPrices`** (lines 1149–1172) only keeps entries whose **value** is a **string that starts with `"http://"` or `"https://"`**. Any other value (number, price string like `"$24.99"`, nested object, etc.) is skipped.
- So:
  - If `global_prices` holds **prices** (e.g. `{ "US": "$24.99", "SG": "S$32" }`) or nested structures (e.g. `{ "us": { "price": "24.99" } }`), **no** links are added → **no** "Global Proof Links" section.
  - The implementation was **not** skipped; it was written for a **“proof links”** shape (country key → URL). If the DB or pipeline stores **prices** in `global_prices` and proof **URLs** elsewhere (or in another shape), the current code would correctly show nothing until the right URL data is passed (or the parser is extended to support your actual schema).

**Summary:** Mapping over `report.global_prices` exists and is correct for “URL-only” values. Missing links are likely due to **data shape** (prices vs URLs), not missing code.

---

## 4. Component alignment and 2-block grid

### ContactCard usage

- **Section 6 (Launch & Execution Kit)** does **not** use `ContactCard`.
- It uses **`ContactPill`** only and builds the right-hand card **inline** (manufacturer name, `corporate_scale` badge, then up to four `ContactPill` buttons for email, phone, website, wholesale).
- **`ContactCard`** is imported in `page.tsx` (line 14) but has **no other reference** in that file; it is **unused** on this page. The doc `PROJECT_4UI_STRATEGY.md` still references ContactCard for Section 7, but the current implementation uses the inline + ContactPill layout instead.

### Layout vs requested 2-block grid

- **Block 1 (top):**  
  - Wrapper: `flex flex-col md:flex-row gap-6 mt-6` (line ~1272).  
  - Left: Sourcing Economics card.  
  - Right: Manufacturer Contact card.  
  - So: **Economics (left) and Contact (right)** on top — **matches** the requested 2-block grid.
- **Block 2 (bottom):**  
  - “Creative Assets” heading and `assetCount` (lines ~1428–1436).  
  - Grid of 1–4 asset cards (lines ~1438–1545).  
  - So: **Gallery below** — **matches**.

**Conclusion:** The layout in `page.tsx` **does** match the requested “2-block grid” (Economics + Contact on top, Gallery on bottom). `ContactCard.tsx` is not used in this page; Section 6 uses inline structure + `ContactPill` only.

---

## Summary table

| Item | Status |
|------|--------|
| Media Vault vs Creative Assets | Same video data; Media Vault adds `ai_image_url`; Creative Assets adds `ai_detail_page_links` and `marketing_assets_url`. |
| Safe to delete Media Vault? | Only if you drop or relocate the AI Product Image block (e.g. add it to Creative Assets). |
| AI Landing Page card missing | `getAiDetailUrl` only handles string input; Supabase JSONB returns object/array → returns null → card never renders. |
| Global proof links | Code exists and maps `report.global_prices` in the Sourcing Economics block; only URL values are shown, so price-only data shows nothing. |
| 2-block grid | Implemented as requested; ContactCard is unused on this page. |

No code has been changed; this is diagnostic only.
