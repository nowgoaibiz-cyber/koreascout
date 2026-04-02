# Weekly pages: `scout_final_reports` fetch & `.order()` audit

Generated from source reads of `app/weekly/[weekId]/page.tsx` and `app/weekly/page.tsx`.

---

## `app/weekly/[weekId]/page.tsx`

### `scout_final_reports` fetch

- **Table:** `scout_final_reports`
- **`.select(...)`:**  
  `"id, product_name, translated_name, image_url, category, viability_reason, market_viability, is_teaser"`
- **Filters:** `.eq("week_id", weekId)`, `.eq("status", "published")`
- **Sort:** `.order("market_viability", { ascending: false })` — **descending** by `market_viability`

### All `.order()` calls in this file (any table)

| Table            | Field           | `ascending` | Meaning        |
|------------------|-----------------|-------------|----------------|
| `weeks`          | `published_at`  | `false`     | descending     |
| `scout_final_reports` | `market_viability` | `false` | descending |

*(First query on `weeks` uses `.single()` — no `.order()`.)*

---

## `app/weekly/page.tsx`

### `scout_final_reports` usage

- This file does **not** list or sort `scout_final_reports` rows.
- It only embeds an aggregate in the `weeks` query:  
  `scout_final_reports(count)`  
  with `.filter("scout_final_reports.status", "eq", "published")`.
- **No** `.order()` applies to individual `scout_final_reports` records here.

### Main `weeks` list query

- **`.select(...)`:** includes `scout_final_reports(count)` (nested count, not row fetch).
- **`.order(...)`:** `.order("start_date", { ascending: false })` — **descending** by `start_date` (on `weeks`).

### All `.order()` calls in this file

| Query context              | Table   | Field           | `ascending` | Meaning    |
|----------------------------|---------|-----------------|-------------|------------|
| Published weeks list       | `weeks` | `start_date`    | `false`     | descending |
| Latest 3 weeks (sidebar) | `weeks` | `published_at`  | `false`     | descending |

---

## Summary: exact `.order()` field names and direction

| File                         | `.order()` expression                                      |
|-----------------------------|------------------------------------------------------------|
| `[weekId]/page.tsx`         | `.order("published_at", { ascending: false })` on `weeks`  |
| `[weekId]/page.tsx`         | `.order("market_viability", { ascending: false })` on `scout_final_reports` |
| `page.tsx`                  | `.order("start_date", { ascending: false })` on `weeks`   |
| `page.tsx`                  | `.order("published_at", { ascending: false })` on `weeks` |
