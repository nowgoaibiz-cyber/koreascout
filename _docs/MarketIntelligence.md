# MarketIntelligence Component Documentation

**Source:** `components/report/MarketIntelligence.tsx`

---

## 1. Props and Types

| Prop      | Type                        |
|----------|-----------------------------|
| `report` | `ScoutFinalReportsRow`      |
| `tier`   | `"free" \| "standard" \| "alpha"` |
| `isTeaser` | `boolean`                 |

**Location:** Lines 141–149 (function signature and destructuring).

```ts
export function MarketIntelligence({
  report,
  tier,
  isTeaser,
}: {
  report: ScoutFinalReportsRow;
  tier: "free" | "standard" | "alpha";
  isTeaser: boolean;
}) {
```

---

## 2. ScoutFinalReportsRow Fields Used (with line numbers)

| Field                 | Line(s) | Usage |
|-----------------------|--------|--------|
| `estimated_cost_usd`  | 151, 167, 216 | Read for profit block; shown as "Est. Wholesale" (~$X). |
| `profit_multiplier`   | 152, 167, 201 | Read for profit block; shown in "UP TO X× MARGIN POTENTIAL". |
| `global_prices`       | 154 | Passed to `parseGlobalPricesForGrid`; drives `rows` and all market/listings data. |
| `global_price`        | 154 | Passed to `parseGlobalPricesForGrid` (cast as `string \| Record<string, unknown> \| null \| undefined`). |
| `best_platform`       | 271–272 | Displayed as "Best Entry: {value}". |
| `search_volume`       | 173, 324 | Displayed under "SEARCH VOLUME". |
| `mom_growth`          | 174, 329–335 | Displayed under "MoM GROWTH". |
| `wow_rate`            | 175, 343–351 | Displayed under "WoW GROWTH" (when not "N/A"). |
| `top_selling_point`   | 179, 363–366 | Displayed as "Competitive Edge" in Analyst Brief. |
| `common_pain_point`   | 180, 370–374 | Displayed as "Risk Factor" in Analyst Brief. |

**Note:** `ListingsBlock` receives a `RegionPriceRow` (from `./utils`), which is built from `report.global_prices` / `report.global_price`. So all listing-level data (prices, seller_type, official_price_usd, review_data, listings, etc.) ultimately comes from `global_prices` (and related parsing).

---

## 3. Conditional Renders (tier / isAlpha / isTeaser)

| Line(s)   | Exact condition | Behavior |
|-----------|------------------|----------|
| 182       | `tier === "alpha"` | `isAlpha` set; used only for "View Verified Supplier Cost" CTA. |
| 195       | `hasProfitBlock` (`profitMultiplier \|\| estimatedCost \|\| globalValuation`) | Renders margin/profit block (Est. Wholesale, Global Valuation, CTA). |
| 221–230   | `isAlpha ? ... : ...` | **Alpha:** `ScrollToIdButton` to section-6 "✓ View Verified Supplier Cost ↓". **Non-alpha:** disabled button "🔒 View Verified Supplier Cost" + "Alpha" badge. |
| 240–250   | `parsedPrices.length >= 1` | Label "Verified Market Price" vs "Estimated Strategic Valuation". |
| 256–274   | `report.best_platform?.trim()` | Renders "Best Entry: {report.best_platform}". |
| 276       | `isUntapped = !market.row \|\| market.row.isBlueOcean` | Per-market: untapped vs listings. |
| 284–298   | `isUntapped ? (...) : (!isUntapped && market.row && <ListingsBlock row={market.row} />)` | Untapped: dot + "Untapped" + copy. Else: `ListingsBlock` with that row. |
| 319       | `(hasSearchGrowth \|\| winningFeature \|\| painPoint)` | Renders Search & Growth + Analyst Brief block. |
| 321       | `hasSearchGrowth` | Renders "Search & Growth" column. |
| 324       | `searchVolume` | Renders SEARCH VOLUME value. |
| 329       | `momGrowth` | Renders MoM GROWTH block. |
| 343       | `wowRate && wowRate !== "N/A"` | Renders WoW GROWTH block. |
| 358       | `(winningFeature \|\| painPoint)` | Renders "Analyst Brief" column. |
| 363       | `winningFeature` | Renders "Competitive Edge" text. |
| 370       | `painPoint` | Renders "Risk Factor" text. |

**Note:** This component does **not** use `isTeaser` in any condition; only `tier` is used (via `isAlpha`).

---

## 4. Data Values Displayed to User (line + field/source)

| Line(s) | Field / Source | What user sees |
|---------|----------------|-----------------|
| 192     | Static         | Section title "Market Intelligence". |
| 201     | `profit_multiplier` | "🔥 UP TO {X}× MARGIN POTENTIAL". |
| 206     | Static         | Italic disclaimer (projected margin). |
| 214     | Static         | "Est. Wholesale". |
| 216     | `estimated_cost_usd` | "~${estimatedCost}" or "—". |
| 219     | Static         | "Est. KR Wholesale". |
| 222     | —              | Alpha: "✓ View Verified Supplier Cost ↓". |
| 224–228 | —              | Non-alpha: disabled "🔒 View Verified Supplier Cost" + "Alpha" badge. |
| 234     | Static         | "Global Valuation". |
| 236     | `globalValuation` (from `global_prices` / `estimated_cost_usd` / `profit_multiplier`) | "~$X.XX" or "—". |
| 240–250 | Static         | "Verified Market Price" or "Estimated Strategic Valuation" + caption. |
| 265     | Static         | "Global Market Availability", "6 Strategic Markets for K-Products". |
| 272     | `best_platform` | "Best Entry: {report.best_platform}". |
| 278–280 | From `rows` (from `global_prices`) | Market code + label (e.g. US, North America). |
| 286–291 | From `market.row` (untapped) | "Untapped", "No established sellers detected." |
| 297     | From `market.row` (via ListingsBlock) | Best price, seller type, official store price, more sellers, review_data. |
| 76, 88, 91, 104, 114, 124, 134 | ListingsBlock (from `row` / `global_prices`) | bestPriceDisplay, official_price_usd, platform, listing prices, "Sold Out", reviewDisplay. |
| 311     | Static         | "Analyze Pricing Sources & Entry Points ↓". |
| 322     | Static         | "Search & Growth". |
| 326     | Static         | "SEARCH VOLUME". |
| 324     | `search_volume` | Search volume value. |
| 328     | Static         | "MoM GROWTH". |
| 330, 334 | `mom_growth`   | MoM value + ↑/↓. |
| 342     | Static         | "WoW GROWTH". |
| 344, 348 | `wow_rate`     | WoW value + ↑/↓. |
| 359     | Static         | "Analyst Brief". |
| 364     | Static         | "Competitive Edge". |
| 366     | `top_selling_point` | Winning feature text. |
| 371     | Static         | "Risk Factor". |
| 374     | `common_pain_point` | Pain point text. |
| 381–385 | Static         | Gap Index / sourcing disclaimer. |
| 392–398 | Static         | "Real-time Market Radar" + platform list. |

---

## 5. Blur / Lock Behavior

- **No blur or overlay** in this component.
- **Lock behavior (lines 224–228):** When `!isAlpha` (tier is not `"alpha"`), the "View Verified Supplier Cost" CTA is a **disabled button** with:
  - Text: "🔒 View Verified Supplier Cost"
  - Badge: "Alpha" (green pill).
  - Classes: `inline-flex items-center gap-2 text-base font-bold text-[#9E9C98] cursor-not-allowed`.
- Full Alpha content (e.g. margin block, global markets, search/growth, analyst brief) is **always rendered**; only this one CTA is gated by `isAlpha`. Data from `report` is not masked by tier in this component.
