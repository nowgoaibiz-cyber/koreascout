# Global Market Availability — Technical Audit Report (KoreaScout PDP)

**Date:** 2025-03-12  
**Scope:** "Global Market Availability" section (6 market cards: US, UK, EU, JP, SEA, UAE).  
**Finding:** All 6 cards show "UNTAPPED / No established sellers detected" even when DB has real price data.

---

## AUDIT TASK 1 — DATA FLOW TRACE

### 1.1 Where `global_prices` is fetched from Supabase

- **File:** `app/weekly/[weekId]/[id]/page.tsx`
- **Code:**
  ```ts
  const [{ data: report, error }, ...] = await Promise.all([
    supabase
      .from("scout_final_reports")
      .select("*")
      .eq("id", id)
      .eq("week_id", weekId)
      .eq("status", "published")
      .single(),
    ...
  ]);
  ```
- `report` includes `report.global_prices` (and `report.global_price`) from the `scout_final_reports` row. No dedicated data-fetch layer; the page fetches the full row and passes `report` to children.

### 1.2 Utility that parses `global_prices`

- **File:** `components/report/utils.ts`
- **Function:** `parseGlobalPricesForGrid(globalPrices, globalPriceText)`
- **Invoked from:** `components/report/MarketIntelligence.tsx` line 18:
  ```ts
  const rows = parseGlobalPricesForGrid(report.global_prices, report.global_price as string | Record<string, unknown> | null | undefined);
  ```

### 1.3 EXACT current implementation of `parseGlobalPricesForGrid`

**File:** `components/report/utils.ts` (lines 3–9, 109–115, 117–214)

```ts
const GLOBAL_REGIONS = [
  { key: "us", flag: "🇺🇸", label: "US" },
  { key: "uk", flag: "🇬🇧", label: "UK" },
  { key: "sea", flag: "🇸🇬", label: "SEA" },
  { key: "au", flag: "🇦🇺", label: "AU" },
  { key: "india", flag: "🇮🇳", label: "IN" },
] as const;

export type RegionPriceRow = {
  flag: string;
  label: string;
  priceDisplay: string | null;
  platform?: string | null;
  isBlueOcean: boolean;
};

export function parseGlobalPricesForGrid(
  globalPrices: unknown,
  globalPriceText: string | Record<string, unknown> | null | undefined
): RegionPriceRow[] {
  const out: RegionPriceRow[] = [];
  let parsed: Record<string, { price_usd?: number; price_original?: string | number; platform?: string }> | null = null;
  if (globalPrices != null) {
    try {
      let p: unknown = globalPrices;
      if (typeof p === "string") p = JSON.parse(p);
      if (typeof p === "string") p = JSON.parse(p);
      if (p && typeof p === "object" && !Array.isArray(p))
        parsed = p as Record<string, { price_usd?: number; price_original?: string | number; platform?: string }>;
    } catch {
      // ignore
    }
  }
  if (parsed) {
    for (const r of GLOBAL_REGIONS) {
      const data = parsed[r.key] ?? parsed[r.key === "au" ? "australia" : r.key];
      const priceUsd = data?.price_usd;
      const priceOrig = data?.price_original != null ? String(data.price_original).replace(/[$,]/g, "") : "";
      const num = priceUsd != null ? priceUsd : priceOrig ? parseFloat(priceOrig) : NaN;
      const isBlueOcean = Number.isNaN(num) || num === 0;
      const priceDisplay = !isBlueOcean
        ? (typeof data?.price_original === "string"
            ? data.price_original
            : priceUsd != null
              ? `$${priceUsd}`
              : priceOrig
                ? `$${priceOrig}`
                : null)
        : null;
      out.push({
        flag: r.flag,
        label: r.label,
        priceDisplay: priceDisplay ?? null,
        platform: data?.platform ?? null,
        isBlueOcean,
      });
    }
    return out;
  }
  // ... fallbacks: globalPriceText string (e.g. "US($22) | UK($26)"), globalPriceText object, then default isBlueOcean: true
  return out.length > 0 ? out : GLOBAL_REGIONS.map((r) => ({ flag: r.flag, label: r.label, priceDisplay: null, platform: null, isBlueOcean: true }));
}
```

- **Note:** `RegionPriceRow` has **no `url` field**. The parser never reads or passes `url`.

### 1.4 Component that renders the 6 market cards

- **File:** `components/report/MarketIntelligence.tsx`

### 1.5 EXACT code that renders each market card (isUntapped, priceDisplay, url)

**File:** `components/report/MarketIntelligence.tsx` (lines 118–171)

```ts
const findRow = (label: string) => rows.find((r) => r.label.toLowerCase() === label.toLowerCase());
const sixMarkets: { code: string; label: string; row: (typeof rows)[number] | null }[] = [
  { code: "US", label: "North America", row: findRow("US") ?? null },
  { code: "UK", label: "United Kingdom", row: findRow("UK") ?? null },
  { code: "EU", label: "European Union", row: null },
  { code: "JP", label: "Japan", row: null },
  { code: "SEA", label: "Southeast Asia", row: findRow("SEA") ?? null },
  { code: "UAE", label: "Middle East", row: null },
];

return (
  // ...
  {sixMarkets.map((market) => {
    const isUntapped = !market.row || market.row.isBlueOcean;
    return (
      <div key={market.code} className="...">
        <p className="...">{market.code} <span className="...">{market.label}</span></p>
        <div style={{ marginTop: "0.6cm" }}>
          {isUntapped ? (
            <>
              <div className="...">
                <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
                <p className="...">Untapped</p>
              </div>
              <p className="text-xs italic text-[#9E9C98]">No established sellers detected.</p>
            </>
          ) : (
            <>
              <div className="...">
                <div className="w-2 h-2 rounded-full bg-[#9E9C98]" />
                <p className="text-xl font-extrabold text-[#1A1916]">{market.row!.priceDisplay}</p>
              </div>
              {market.row!.platform && (
                <p className="text-xs text-[#9E9C98] mt-1">via {market.row!.platform}</p>
              )}
            </>
          )}
        </div>
      </div>
    );
  })}
);
```

- **isUntapped:** `const isUntapped = !market.row || market.row.isBlueOcean;`
- **priceDisplay:** Rendered only when `!isUntapped` as `{market.row!.priceDisplay}`.
- **url:** **Not used anywhere.** There is no `<a href={...}>` or similar; `RegionPriceRow` has no `url`, and the card does not render a link.

---

## AUDIT TASK 2 — DB VALUE INSPECTION

### 2.1 Double-serialized string

- **Handled:** Yes. The parser does:
  ```ts
  if (typeof p === "string") p = JSON.parse(p);
  if (typeof p === "string") p = JSON.parse(p);
  ```
  So a double-serialized string is correctly parsed to an object.

### 2.2 Nested structure (us_uk_eu.us → us, jp_sea.jp → jp, uae.uae → uae)

- **Not handled.** After parsing, the code assumes **flat** top-level keys:
  ```ts
  const data = parsed[r.key] ?? parsed[r.key === "au" ? "australia" : r.key];
  ```
  So it looks for `parsed["us"]`, `parsed["uk"]`, `parsed["sea"]`, `parsed["au"]`, `parsed["india"]`.
- **DB shape (as described):** Top-level keys are `us_uk_eu`, `jp_sea`, `uae`, with nested keys inside (e.g. `us_uk_eu.us`, `us_uk_eu.uk`, `us_uk_eu.eu`, `jp_sea.jp`, `jp_sea.sea`, `uae.uae`).
- **Result:** `parsed["us"]` is `undefined` (data lives under `parsed.us_uk_eu.us`). Same for uk, eu, jp, sea, uae. So **no row gets real data**; every region falls back to `data = undefined`, `num = NaN`, `isBlueOcean = true`. The parser never flattens the nested structure.

### 2.3 Exact parsed shape passed to the render component

- When the DB uses the **nested** structure, `parsed` has keys `us_uk_eu`, `jp_sea`, `uae` only. The loop only reads `parsed[r.key]` (and `parsed["australia"]` for AU). So for every `r` in `GLOBAL_REGIONS`, `data` is `undefined`.
- **Shape passed to UI:** `RegionPriceRow[]` with 5 items (US, UK, SEA, AU, IN), each with `priceDisplay: null`, `platform: null`, `isBlueOcean: true`. No EU, JP, UAE in `rows` at all (they are not in `GLOBAL_REGIONS`).

### 2.4 Is the url field extracted and passed to the card renderer?

- **No.** The parser’s type is `Record<string, { price_usd?: number; price_original?: string | number; platform?: string }>`. It does not read or pass `url`. `RegionPriceRow` has no `url`. So **url is dropped in the parser** and never reaches the card.

### 2.5 Where data is lost or ignored

| Issue | Location | What happens |
|-------|----------|--------------|
| Nested structure not flattened | `utils.ts` `parseGlobalPricesForGrid` | Looks for `parsed["us"]` etc.; real data is under `parsed.us_uk_eu.us`, `parsed.jp_sea.sea`, `parsed.uae.uae`. All lookups yield `undefined` → all rows get `isBlueOcean: true`, no price/platform. |
| EU, JP, UAE hardcoded to null | `MarketIntelligence.tsx` `sixMarkets` | `row: null` for EU, JP, UAE. So `findRow("EU")` is never used; EU/JP/UAE always show Untapped even if data existed in a flattened structure. |
| Parser only has 5 regions | `utils.ts` `GLOBAL_REGIONS` | Only us, uk, sea, au, india. No eu, jp, uae. So even with flattening, the grid would not produce rows for EU, JP, UAE unless regions are extended. |
| url never read or passed | `utils.ts` `parseGlobalPricesForGrid` + `RegionPriceRow` | `url` is not in the parsed type or in `RegionPriceRow`. Dropped in parser; card has no url to render. |

---

## AUDIT TASK 3 — URL RENDERING AUDIT

| Market | Where url is used in render | Clickable link when url present? | Status |
|--------|-----------------------------|----------------------------------|--------|
| US | Not used | No | **[URL DROPPED IN PARSER]** — not in RegionPriceRow; not rendered. |
| UK | Not used | No | **[URL DROPPED IN PARSER]** |
| EU | Not used (row always null) | No | **[URL DROPPED IN PARSER]** (and row hardcoded null) |
| JP | Not used (row always null) | No | **[URL DROPPED IN PARSER]** (and row hardcoded null) |
| SEA | Not used | No | **[URL DROPPED IN PARSER]** |
| UAE | Not used (row always null) | No | **[URL DROPPED IN PARSER]** (and row hardcoded null) |

- **Conclusion:** For all 6 cards, url is **never** passed from the parser to the component and **never** rendered. So the correct classification is **[URL DROPPED IN PARSER]** for all. There is no “parsed but not displayed” path because the parser does not include url.

---

## AUDIT TASK 4 — ISUNTAPPED LOGIC AUDIT

### 4.1 Exact isUntapped condition

```ts
const isUntapped = !market.row || market.row.isBlueOcean;
```

- So: Untapped if there is no row for that market, or if the row is considered “blue ocean” (no/zero price).

### 4.2 Does price_usd === 0 trigger Untapped when url exists?

- **Yes.** In the parser, `isBlueOcean = Number.isNaN(num) || num === 0`. So `price_usd === 0` → `isBlueOcean = true` → card shows Untapped. The card does not consider `url` (and url is not passed). So even with a valid url and `price_usd === 0`, the card would show Untapped.

### 4.3 Does null url trigger Untapped when price_usd > 0?

- **No.** The card does not look at url for isUntapped. It only uses `!market.row || market.row.isBlueOcean`. So if `market.row` exists and `isBlueOcean === false` (e.g. price_usd > 0), the card shows the price and is not Untapped, regardless of url.

### 4.4 Cases where real data exists but isUntapped = true (flawed logic / data path)

1. **Nested DB structure:** Real data in `us_uk_eu.us`, `jp_sea.sea`, `uae.uae` etc. is never read because the parser only looks at flat `parsed["us"]`, `parsed["sea"]`, etc. So all 5 parsed rows get `data = undefined` → `isBlueOcean = true` → all show Untapped.
2. **EU, JP, UAE hardcoded:** `sixMarkets` sets `row: null` for EU, JP, UAE. So `isUntapped = !market.row` is always true for these three, regardless of DB content (and the parser does not produce rows for eu/jp/uae anyway).
3. **price_usd === 0 but url present:** Treated as blue ocean, so Untapped. Business-wise one might want “has link, no price” to not be Untapped; current logic does not account for url.

---

## FINAL DELIVERABLE — EXACT FIX RECOMMENDATION

### What needs to change

#### A. `components/report/utils.ts` — `parseGlobalPricesForGrid`

1. **Flatten nested structure** after parsing (and after double-parse):
   - If top-level keys are only `us_uk_eu`, `jp_sea`, `uae` (or similar group keys), iterate those and merge inner objects into a single flat map keyed by market (e.g. `us`, `uk`, `eu`, `jp`, `sea`, `uae`). Use a fixed mapping (e.g. `us_uk_eu` → take `us`, `uk`, `eu`; `jp_sea` → `jp`, `sea`; `uae` → `uae`) so that `parsed["us"]` etc. resolve to the nested object.
2. **Support all 6 UI markets:** Ensure the flattened map (or the iteration) includes keys for `us`, `uk`, `eu`, `jp`, `sea`, `uae` (and optionally `au`, `india` if still needed elsewhere). Extend `GLOBAL_REGIONS` (or a separate list for the 6-card UI) to include `eu`, `jp`, `uae` so that rows are produced for EU, JP, UAE.
3. **Include `url` in parsed type and in `RegionPriceRow`:** When reading each market’s object, read `url` (string) and pass it through. Add `url?: string | null` to `RegionPriceRow` and set it in the `out.push({ ... })` so the card can show a link.

#### B. `components/report/MarketIntelligence.tsx` — card renderer

1. **Stop hardcoding EU, JP, UAE as null:** Build `sixMarkets` from the same 6 codes (US, UK, EU, JP, SEA, UAE) but set `row: findRow("EU") ?? null`, `row: findRow("JP") ?? null`, `row: findRow("UAE") ?? null`, so that when the parser returns rows for EU, JP, UAE (after A.2), they are used. Ensure `findRow` matches the labels returned by the parser for those regions (e.g. "EU", "JP", "UAE").
2. **Render url when present:** In the non-Untapped branch, when `market.row!.url` is a non-empty string (and e.g. starts with `http`), render a clickable link (e.g. `<a href={market.row!.url} target="_blank" rel="noopener noreferrer">View listing</a>` or similar) so the url is both passed and displayed.

No other files need to be modified for this flow; the data flow (Supabase → page → MarketIntelligence → parseGlobalPricesForGrid → rows → sixMarkets → cards) remains the same aside from the parser output shape and the card’s use of `row.url` and of rows for EU, JP, UAE.

---

**End of report. No code was modified; investigation and reporting only.**
