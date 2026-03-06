# [COMPREHENSIVE AUDIT] /weekly PAGE — Current State Report

**Target:** `app/weekly/page.tsx` and all related components/hooks  
**Audit type:** Read-only analysis (no code changes)  
**Date:** 2026-03-06

---

## 1. DATABASE & DATA FETCHING

### 1.1 Supabase tables queried by `/weekly`

| Table | Used in | Purpose |
|-------|--------|--------|
| **`weeks`** | `app/weekly/page.tsx` | Hub: list all published weeks (week_id, week_label, start_date, end_date, published_at, product_count, summary). Also used to get "latest 3 weeks" by published_at. |
| **`profiles`** | Via `getAuthTier()` (used by page) | Not queried directly in weekly page; tier and subscription_start_at come from `lib/auth-server.ts`, which reads `profiles` by `auth.users.id`. |

**Note:** The child route `app/weekly/[weekId]/page.tsx` additionally queries `weeks` (single week) and `scout_final_reports` (products for that week). The hub page itself only hits `weeks`.

### 1.2 Expected data structure for reports (weeks)

The page expects each row from `weeks` to match this shape (and types in `types/database.ts` / `WeeksRow`):

| Field | Type | Used in UI |
|-------|------|------------|
| `week_id` | string (PK) | Key, link target `/weekly/{week_id}` |
| `week_label` | string | Card title |
| `start_date` | string (DATE) | Grouping into month (monthKey/monthLabel) |
| `end_date` | string (DATE) | Selected but not displayed on hub |
| `published_at` | string \| null (TIMESTAMPTZ) | Free delay (14 days), tier access, "Available {date}" |
| `product_count` | number | "X product(s)" on card |
| `summary` | string \| null | One-line summary on unlocked card |
| `status` | string | Filter: only `published` rows are fetched |

Schema source: `supabase/migrations/001_phase2_schema.sql` (weeks table).

### 1.3 How data is fetched

- **Pattern:** Server Components only. No client-side data hooks, no React Query.
- **Flow:**
  1. `WeeklyHubPage` is an **async Server Component**.
  2. `createClient()` from `@/lib/supabase/server` and `getAuthTier()` from `@/lib/auth-server` are awaited on the server.
  3. Two Supabase queries run on the server:
     - `from("weeks").select(...).eq("status", "published").order("start_date", { ascending: false })`
     - Same table again: `from("weeks").select("week_id").eq("status", "published").order("published_at", { ascending: false }).limit(3)` for latest 3 week IDs.
  4. Month grouping and free-week calculation are done in server-side JS. Rendered HTML is sent to the client.
- **Client component:** Only `MonthAccordion` is a client component (`"use client"`); it manages accordion open/close state only and receives pre-rendered children (week cards) as props.

---

## 2. TIER-BASED ACCESS LOGIC (Free vs. Standard vs. Alpha)

### 2.1 How the page identifies the user's tier

- **Source:** `getAuthTier()` from `@/lib/auth-server`.
- **Returns:** `{ userId, tier, subscriptionStartAt }`.
  - `tier`: from `profiles.tier` — type `Tier` = `"free" | "standard" | "alpha"`.
  - `subscriptionStartAt`: from `profiles.subscription_start_at` (used for paid “archive” access).
- **Auth guard:** If `!userId`, the page calls `redirect("/login")` before any week content is shown. Logged-in users only see the hub.

### 2.2 What each tier sees

- **Paid (`isPaid = tier === "standard" || tier === "alpha"`):**
  - **Unlocked weeks:** (1) Any week in the **latest 3 weeks** (by `published_at`), OR (2) any week whose `published_at >= subscriptionStartAt` (“archive”).
  - Unlocked weeks render as clickable cards with link to `/weekly/{week_id}`; label can show “Just released”.
- **Free:**
  - **Unlocked:** Exactly **one** week — the single “free open” week: the most recent week (by `published_at`) that is at least **14 days** after its `published_at` (i.e. `published_at + 14 days <= today`). Implemented as `freeOpenWeekId`; constant `FREE_DELAY_DAYS = 14`.
  - That week’s card is a normal link with “Free access” text.
  - All other weeks are **locked**.

### 2.3 Lock UI and gated content

- **Locked week card (hub):**
  - Rendered when `isLocked = !canAccess`.
  - Styling: `rounded-xl border border-[#E8E6E1] bg-white p-6 opacity-60 cursor-not-allowed` (no link).
  - Content shown: `week_label`, product count, and:
    - **Free user:** 🔒 + “Available {formatAvailableDate(published_at)}” and CTA “Upgrade to Standard to access immediately →”.
    - **Paid user (archive lock):** 🔒 + “Archive” (no date).
  - No blur; content is visible but not clickable.
- **No lock icons on the page header or nav** — only on individual week cards.
- **Child route `/weekly/[weekId]`:** If the user opens a week they cannot access, that page shows a full-page lock screen (🔒, “This week is in your archive” for paid / “Upgrade to access this week” for free) with CTA to `/pricing`, instead of the product list.

---

## 3. UI STATE & NAVIGATION (Month → Week logic)

### 3.1 Month card to weekly list

- **No URL parameters** for month or week on the hub. The hub URL is always `/weekly` (no `?month=...` or `?week=...`).
- **Structure:** Weeks are grouped by month in memory (`monthGroups`). Each group is rendered inside a **MonthAccordion** that shows:
  - A **header button** with `monthLabel` (e.g. “March 2026”) and a toggle chevron.
  - When open, a **list of week cards** (either locked div or `Link` to `/weekly/{week_id}`).
- **State:** Accordion open/closed is **internal React state** in `MonthAccordion`: `useState(monthKey === currentMonthKey)`. So the **current month** (derived from `new Date()`) opens by default; others start closed. No URL or global client state.

### 3.2 Selecting a week and visual transition

- **Action:** User clicks an **unlocked** week card, which is a Next.js `<Link href={/weekly/${week.week_id}}>`. This is a full **navigation** to `/weekly/[weekId]`, not in-page state.
- **Transition:** Standard Next.js route transition (full page load / RSC navigation). No SPA-style “expand in place” or modal; the hub is left and the week detail page is shown.
- **Back:** Week detail page and lock screen both provide “← Back to weekly” / “← Weekly Reports” links to `/weekly`.

---

## 4. PLACEHOLDERS & FUTURE FEATURES (Trend News)

### 4.1 Top “Trend News” section

- **Implementation:** **Hardcoded HTML** in `app/weekly/page.tsx` (lines 115–127). No DB table, no props, no CMS.
- **Structure:**
  - Wrapper: `rounded-2xl border border-[#BBF7D0] bg-white ... border-l-4 border-l-[#16A34A]` with fixed padding and min-height.
  - Content:
    - “Breaking News” (small uppercase label).
    - “📰 Trend News — Coming soon” (bold green).
    - “Trending Korean product news, weekly highlights” (subtext).
- **Data:** Static copy only. **Not** wired to any API or Supabase table; ready to be replaced later with dynamic content when a source exists.

### 4.2 Other placeholders / “Coming soon”

- **Trend News** is the only explicit “Coming soon” block on the page.
- **Empty state:** If `!weeks?.length`, the page shows: “No reports published yet. Check back soon.” (No other placeholder sections found.)

---

## 5. DESIGN & STYLING TO-DOs (vs. /pricing “Elite” aesthetic)

### 5.1 Current palette and patterns on `/weekly`

- **Background:** `bg-[#F8F7F4]` (cream) for page and accordion body.
- **Text:** `#1A1916` (headings), `#6B6860` / `#3D3B36` (body), `#9E9C98` (muted).
- **Accent:** `#16A34A` (green) for links, “View products →”, “Free access”, “Just released”, and Trend News title; `#15803D` on hover.
- **Borders:** `#E8E6E1`, `#BBF7D0` (green tint for Trend News and hover).
- **Cards:** White background, light shadow, rounded corners (xl/2xl). Locked cards use `opacity-60`.

### 5.2 Comparison with `/pricing` “high-end” treatment

- **Pricing page:** Dark hero (`bg-[#1A1916]`), large typography (`font-black`, `tracking-tighter`), uppercase labels with letter-spacing, clear section hierarchy, green accent used sparingly for emphasis (e.g. Alpha tier, CTA). “Elite Intelligence Agency” feel via contrast and weight.
- **Weekly page:** No dark hero; light-only layout. Typography is smaller and less dramatic (e.g. `text-4xl` for “Weekly Reports” vs. pricing’s larger hero). No uppercase “brand” strip or strong section dividers. Green is used more generically (links, badges, borders).

### 5.3 Gaps and misalignments (to match branding)

1. **No dark hero or strong entry moment** — Pricing uses a full-width dark section and bold tagline; weekly jumps straight into cream background and a single H1. No “Weekly Intelligence” or similar hero block.
2. **Weaker typographic hierarchy** — Less use of `font-black`, `tracking-tighter`, and uppercase labels; weekly feels more “dashboard” than “premium report”.
3. **Trend News block** — Styling is consistent with green/cream but reads as a simple CTA card rather than a premium “intel brief” (e.g. no dark variant, no strong typography).
4. **Accordion chrome** — MonthAccordion uses a plain “▾” character for toggle; pricing uses more refined UI (e.g. borders, dividers). Could align with a shared design system (e.g. ChevronDown icon, consistent border/radius).
5. **Back link** — Single text link at bottom (“← Back to home”); placement and style are functional but not elevated to match pricing’s CTAs.
6. **Error state** — Red text and link on load error; could use a card or layout closer to pricing’s error/empty treatment.
7. **No global “lock” or tier indicator** — Header/nav doesn’t show tier or “X weeks unlocked”; all tier info is per-card. Optional for consistency with an “intelligence level” narrative.

---

## Summary table

| Pillar | Finding |
|--------|--------|
| **DB & fetching** | Single table `weeks` on hub; Server Components only; no React Query. |
| **Tier logic** | Tier from `getAuthTier()` (profiles). Free: 1 week (14-day delay). Paid: latest 3 + archive (published_at ≥ subscription_start_at). Lock UI on cards and full-page lock on forbidden week. |
| **Month → week** | Month = accordion (client state). Week = navigation to `/weekly/[weekId]`. No URL params on hub. |
| **Placeholders** | Trend News: hardcoded “Coming soon”; no DB. One empty state for no weeks. |
| **Design** | Cream/green/black palette present but no dark hero, lighter typography, and less “elite” treatment than pricing; several UI details could be aligned. |

---

*End of report. No code was modified.*
