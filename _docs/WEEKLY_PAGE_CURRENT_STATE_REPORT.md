# Individual Week Report Page — Current State Report

**Target:** `app/weekly/[weekId]/page.tsx` and related behavior  
**Scope:** Factual audit only. No code changes.

---

## 1. DATA FETCHING & SCHEMA

### How the page fetches data

- **Week:** Fetched from table `weeks` with:
  - `supabase.from("weeks").select("week_id, week_label, product_count, summary, published_at").eq("week_id", weekId).eq("status", "published").single()`
- **Products:** Fetched only when `canAccess` is true, from table `scout_final_reports` with:
  - `supabase.from("scout_final_reports").select("id, product_name, translated_name, image_url, category, viability_reason, market_viability, is_teaser").eq("week_id", weekId).eq("status", "published").order("market_viability", { ascending: false })`
- Comment in code states: *"RLS filters by tier and free_list_at; we get only rows the user is allowed to see."*

### Exact DB column → product card UI mapping

| UI element | Database column | Notes |
|------------|-----------------|--------|
| Product image | `image_url` | Used in `<Image src={p.image_url} />`. No image → placeholder (see §2). |
| Product title | `translated_name` with fallback to `product_name` | Rendered as `p.translated_name \|\| p.product_name`. |
| Category line | `category` | Rendered as `p.category` (raw string). |
| “Why it’s trending” / reason text | `viability_reason` | Rendered as `p.viability_reason` with `line-clamp-2`. |
| Market score label | `market_viability` | Rendered as `Market score: {p.market_viability}`. |
| “FREE THIS WEEK” badge | `is_teaser` | Badge shown when `p.is_teaser` is truthy. |
| Link to detail | `id` | Link href: `/weekly/${weekId}/${p.id}`. |

Other columns (e.g. `ai_image_url`, `summary`, `consumer_insight`, `competition_level`, etc.) are **not** selected or used on this page.

---

## 2. MISSING DATA & EDGE CASES

### Missing image

- **Handling:** If `p.image_url` is falsy, the card shows a placeholder:
  - `<div className="h-full w-full flex items-center justify-center text-[#9E9C98] text-xs">No image</div>` inside the same 80×80 container.

### Missing market score / empty category

- **market_viability:** Rendered as `Market score: {p.market_viability}` with no null/undefined check. If the value is `null` or `undefined`, the UI would show “Market score: ” or “Market score: undefined”. Schema defines `market_viability: number`; no explicit fallback in the component.
- **category:** Rendered as `p.category` with no empty-state handling. Empty string would show an empty line; no “Uncategorized” or similar fallback.

### Week with 0 products

- **Handling:** There is an explicit fallback:
  - `if (!products?.length)` → render `<p className="text-[#9E9C98]">No products in this week.</p>`.
  - Else render the list. So a week with exactly 0 products shows that message and no list.

### Products query error

- If `productsError` is set (query failed), the page renders an error state: red box “Failed to load products.” and a “← Back to weekly” link. No product list is shown.

---

## 3. UI/UX STRUCTURE

### List layout

- **Container:** `<ul className="space-y-4">` — vertical stack with 4-unit spacing between items (effectively a single column, not a grid).
- **Each item:** `<li>` wrapping a single `<Link>` that acts as the card.

### Product cards

- **Location:** Inline in `app/weekly/[weekId]/page.tsx` (lines ~140–178). There is **no** separate product-card component file for this list; the card is the `<Link>` with inner layout.
- **Card structure:**
  - One row: `flex gap-4` (image | content | arrow).
  - Left: 80×80 image (or “No image” placeholder), `rounded-lg`, `object-cover`.
  - Center: `min-w-0 flex-1` — title (with optional teaser badge), category, viability_reason (2-line clamp), “Market score: …”.
  - Right: `→` arrow, `self-center`.

---

## 4. AUTHENTICATION & SECURITY (CRITICAL)

### How the dynamic route is protected

1. **Auth:** `getAuthTier()` returns `userId`, `tier`, `subscriptionStartAt`. If `!userId`, the page calls `redirect("/login")` — so the route is login-required.
2. **Access flag:** `canAccess` is computed **before** any product fetch:
   - **Paid** (`tier === "standard"` or `tier === "alpha"`):
     - `canAccess = isLatestWeek || isAfterSub`
     - `isLatestWeek` = `weekId` is in the latest 3 published weeks (by `published_at` desc).
     - `isAfterSub` = `subscriptionStartAt` and `week.published_at` exist and `week.published_at >= subscriptionStartAt`.
   - **Free** (else):
     - `freeOpenWeekId` = among published weeks, the one whose `published_at + 14 days <= now`, sorted by `published_at` desc, first; if none, null.
     - `canAccess = (weekId === freeOpenWeekId)` — only that single “free” week is accessible.
3. **Lock screen:** If `!canAccess`, the page returns the lock UI (🔒, “This week is in your archive.” / “Upgrade to access this week.”, CTA to pricing). **The products query is never executed** in this branch (it is after the `if (!canAccess) { … return; }` block).

### Free user typing a locked week URL (e.g. `/weekly/2026-W10`)

- **Behavior:** Server runs the same logic. For a free user, `canAccess` is false for any week other than `freeOpenWeekId`. The server returns the lock screen and **does not** run the `scout_final_reports` query. **Products are not leaked.**
- **Defense in depth:** RLS policy `report_access` on `scout_final_reports` allows SELECT only when:
  - `status = 'published'` and
  - either:
    - `(SELECT tier FROM public.profiles WHERE id = auth.uid()) IN ('alpha', 'standard')`, or
    - `(free_list_at IS NOT NULL AND free_list_at <= NOW() AND is_premium = FALSE)`, or
    - `is_teaser = TRUE`.
- So even if the app mistakenly ran the products query for a locked week, the database would not return rows the free user is not allowed to see. Tier is read from `profiles` via `auth.uid()` in the policy; the app does not pass tier into the query.

### Exact tier-checking logic on this page (summary)

- **Step 1:** Require login (`redirect("/login")` if no `userId`).
- **Step 2:** Load week by `weekId` and `status = 'published'`; if missing → `notFound()`.
- **Step 3:** Compute “latest 3 weeks” and `isLatestWeek`.
- **Step 4:** Set `canAccess` from tier and week rules (as above).
- **Step 5:** If `!canAccess` → return lock screen and stop (no products fetch).
- **Step 6:** If `canAccess` → fetch products from `scout_final_reports` (RLS applies), then render list or error/empty state.

---

## 5. INTERNATIONALIZATION (i18n) BUGS

- **Translation layer:** There is **no** frontend translation or i18n layer on this page. No `useTranslation`, locale-based maps, or translation keys for category or other text.
- **Category (and other) strings:** The UI renders **raw DB strings**: `p.category`, `p.viability_reason`, `p.translated_name`, `p.product_name`. Mixed English (e.g. “Beauty > Skincare”) and Korean (e.g. “화장품/미용>선케어”) are therefore **as stored in the database**, not chosen or translated by the frontend.
- **Conclusion:** Inconsistent category language is a **data/content** issue (or upstream pipeline), not a frontend i18n implementation. The page is “language-agnostic”: it displays whatever is in the DB.

---

## OUTPUT SUMMARY

| Pillar | Finding |
|--------|--------|
| **Data & schema** | Week from `weeks`; products from `scout_final_reports` with 8 columns; mapping to card is as in the table above; image = `image_url`, reason = `viability_reason`. |
| **Missing / edge** | Image: “No image” placeholder; market score/category: no fallback; 0 products: “No products in this week.”; query error: dedicated error UI. |
| **UI structure** | Single-column list (`ul` + `space-y-4`); cards inline in page, no separate card component. |
| **Auth & security** | Login required; `canAccess` blocks product fetch for locked weeks; Free user with locked URL sees lock screen only; RLS enforces tier on `scout_final_reports`. |
| **i18n** | No frontend translation; category and related text are raw DB values; mixed language is from data, not UI i18n. |
