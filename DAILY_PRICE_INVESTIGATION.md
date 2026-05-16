# Daily Price & “For less than $X.XX a day” Investigation

**Scope:** Application source (`app/`, `components/`, `src/`) plus repo docs that duplicate literals.  
**Note:** There is **no runtime formula** (e.g. `monthly / 30`) in TypeScript; `daily` values are **hand-authored** in `src/config/pricing.ts`.

---

## 1. How the daily amount is determined

### 1.1 Source of truth: `src/config/pricing.ts`

| Line | Code | Display (with `CURRENCY` + `toFixed(2)`) |
|------|------|---------------------------------------------|
| 6–8 | `STANDARD: { monthly: 79, daily: 2.63 }` | **$2.63**/day |
| 10–13 | `ALPHA: { monthly: 199, daily: 6.63, marketingDailyLimit: 6.7 }` | **$6.63**/day (daily) · **$6.70** (marketing cap) |

- **`daily` is not derived** from `monthly` in code. Changing `monthly` alone does **not** auto-update `daily`.
- **Empirical check:** \(199 / 30 \approx 6.6333\) → rounded to two decimals → **$6.63** (same pattern for Standard: \(79/30 \approx 2.633\) → **$2.63**). So the intended math is effectively **“monthly ÷ 30 days”**, but it is **duplicated as literals**, not computed.

### 1.2 Secondary Alpha figure: `marketingDailyLimit`

| Line | Value | Usage |
|------|-------|--------|
| 13 | `6.7` | “For **under** $X.XX a day” on **pricing page FOMO block only** (see §3). Comment in file still says `"under $4.50 a day"` — **stale vs current numbers**. |

---

## 2. Search: `"$6.63"` literal string

**Result:** The string **`"$6.63"`** does **not** appear in `.ts` / `.tsx` files.

The value **6.63** appears only as a **numeric literal** here:

| File | Line | Context |
|------|------|---------|
| `src/config/pricing.ts` | 12 | `daily: 6.63` inside `ALPHA` |

**Documentation / audit copies** (not runtime):

| File | Line (approx.) | Note |
|------|----------------|------|
| `_docs/launch_audit.md` | 1473 | Snippet of `pricing` config |
| `_docs/timewidget-audit.md` | 15 | Snippet |
| `PRICING_PAGE_INVESTIGATION.md` | 100 | Prior investigation quote |

---

## 3. “For less than … a day” (exact hero phrase)

Rendered from **`PRICING.CURRENCY` + `PRICING.ALPHA.daily.toFixed(2)`** — i.e. **Alpha tier daily**, not Standard.

| File | Line | Snippet |
|------|------|---------|
| `app/pricing/page.tsx` | 147 | `For less than` … `{PRICING.CURRENCY}{PRICING.ALPHA.daily.toFixed(2)}` … `a day.` |
| `app/page.tsx` | 440 | Same pattern (pricing S8-style section on homepage) |

**Conclusion:** The same hero line exists in **`app/pricing/page.tsx` and `app/page.tsx`** (both).

---

## 4. Related “less than” / per-day Alpha copy (same `ALPHA.daily`)

| File | Line | Text / pattern |
|------|------|----------------|
| `app/page.tsx` | 682 | `A perfect synergy for less than` … `{PRICING.ALPHA.daily.toFixed(2)}` … `a day.` |

---

## 5. “For under … a day” (uses `marketingDailyLimit`, not `daily`)

| File | Line | Snippet |
|------|------|---------|
| `app/pricing/page.tsx` | 433 | `For under {PRICING.CURRENCY}{PRICING.ALPHA.marketingDailyLimit.toFixed(2)} a day.` |

**`app/page.tsx`:** No `marketingDailyLimit` usage in grep — homepage uses **`ALPHA.daily`** only for per-day Alpha numbers in the pricing section.

---

## 6. “Approx. $X.XX / day” (Standard & Alpha cards)

### `app/pricing/page.tsx`

| Line | Tier | Expression |
|------|------|--------------|
| 210 | Standard | `Approx. {PRICING.CURRENCY}{PRICING.STANDARD.daily.toFixed(2)} / day` |
| 268 | Alpha | `Approx. {PRICING.CURRENCY}{PRICING.ALPHA.daily.toFixed(2)} / day` |

### `app/page.tsx`

| Line | Tier | Expression |
|------|------|--------------|
| 502 | Standard | `Approx. … {PRICING.STANDARD.daily.toFixed(2)} / day` |
| 558 | Alpha | `Approx. … {PRICING.ALPHA.daily.toFixed(2)} / day` |

---

## 7. Other Alpha-related `/day` copy (homepage only)

| File | Line | Notes |
|------|------|--------|
| `app/page.tsx` | 514 | Embeds `{PRICING.STANDARD.daily.toFixed(2)}/day` (Standard, not Alpha) |
| `app/page.tsx` | 570 | `{PRICING.ALPHA.daily.toFixed(2)}/day` in body copy |

---

## 8. Files that reference `PRICING.ALPHA.daily` or `STANDARD.daily` (TS/TSX only)

| File | Lines |
|------|--------|
| `src/config/pricing.ts` | 7–8 (`STANDARD.daily`), 11–12 (`ALPHA.daily`) |
| `app/pricing/page.tsx` | 147, 210, 268 |
| `app/page.tsx` | 440, 502, 514, 558, 570, 682 |

**`PRICING.ALPHA.marketingDailyLimit`:**

| File | Lines |
|------|--------|
| `src/config/pricing.ts` | 13 |
| `app/pricing/page.tsx` | 433 |

---

## 9. Summary table (Alpha daily UX)

| UX string | Value source | Shown as | Files / lines |
|-----------|----------------|----------|----------------|
| “For less than … a day” | `PRICING.ALPHA.daily` → `$6.63` | `toFixed(2)` | `app/pricing/page.tsx:147`, `app/page.tsx:440` |
| “Approx. … / day” (Alpha card) | `PRICING.ALPHA.daily` | `$6.63` | `app/pricing/page.tsx:268`, `app/page.tsx:558` |
| Closing “synergy … less than … a day” | `PRICING.ALPHA.daily` | `$6.63` | `app/page.tsx:682` |
| “For under … a day” (FOMO) | `PRICING.ALPHA.marketingDailyLimit` | `$6.70` | `app/pricing/page.tsx:433` **only** |

---

## 10. Maintenance recommendations

1. **Single derivation:** e.g. `daily: round2(monthly / 30)` or `Math.ceil` policy — avoid drift between `monthly` and `daily`.
2. **Align `marketingDailyLimit`:** Either derive from `daily` or document why “under” uses a **higher** number ($6.70 vs $6.63).
3. **Deduplicate copy:** `app/pricing/page.tsx` and `app/page.tsx` duplicate large blocks; changing daily messaging requires **two files** today.

---

*End of report.*
