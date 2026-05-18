# Sample Report Mobile Responsive - Forensic Analysis

**Investigation date:** 2026-05-18  
**Scope:** `app/sample-report/page.tsx` vs `app/weekly/[weekId]/[id]/page.tsx`  
**Mode:** Read-only forensic analysis — no code was modified.

---

## Executive Summary

The Sample Report and Real Report **page files are thin wrappers** (~89 vs ~226 lines). All eight report sections (Product Identity through Supplier Contact) are rendered by **the same shared components** under `components/report/` and `components/ProductIdentity.tsx`. There is **no duplicate JSX** for Billable Weight, Global Market Prices, or other section bodies inside either `page.tsx`.

**Why Sample looks broken on mobile while Real may appear better:**

1. **Page-level smoking gun (Sample only):** `w-screen` on the root container (`page.tsx` line 46) forces `100vw` width, which commonly causes **horizontal overflow** (scrollbar width + nested padding). Real Report uses `flex min-h-screen` + `flex-1` without `w-screen`.
2. **Amplified shared component bugs:** Billable Weight (`SourcingIntel.tsx` L113), Global Market Prices (`MarketIntelligence.tsx` L252–366), and Market Gap (`SocialProofTrendIntelligence.tsx` L87–128) lack mobile-first flex/grid patterns. These affect **both** routes, but Sample’s `w-screen` + sticky banner + missing `min-w-0` flex containment make overflow **more visible** on Sample.
3. **Perceived “working” Real Report:** Real Report’s `flex-1` content column (`page.tsx` L150) participates in a flex shrink context; left nav is `hidden md:flex` on mobile. Users may also test Real on wider viewports or notice less overflow if flex containment clips children differently.

**Primary fix targets (in priority order):**
- Remove/replace `w-screen` → `w-full` on Sample root (page L46).
- Add `overflow-x-hidden` or `min-w-0` on Sample content wrapper.
- Fix shared components: Billable Weight row, profit grid borders, Global Market grid gaps, Social Proof `pr-12`/`border-r` on mobile.

---

## Execution Command Outputs

### Line counts

```
Sample Report (app/sample-report/page.tsx):     89 lines
Real Report (app/weekly/[weekId]/[id]/page.tsx): 226 lines
```

### className attribute counts (page files only)

```
Sample Report className= occurrences: 11
Real Report className= occurrences:     18
```

### Responsive prefix counts (page files only)

| Prefix | Sample Report | Real Report |
|--------|---------------|-------------|
| `sm:`  | 8 matches     | 2 matches   |
| `md:`  | 0             | 2 matches   |
| `lg:`  | 1 (`lg:px-8`) | 0           |
| `xl:`  | 0             | 0           |

### flex-wrap (page files)

```
Sample Report: (none)
Real Report:   (none)
```

### grid-cols (page files)

```
Sample Report: (none)
Real Report:   (none)
```

*All section-level `flex`/`grid` patterns live in shared components, not in `page.tsx`.*

---

## Part 1: File Structure Comparison

### A. Main Container Analysis

#### 1. Root container wrapper classes

| | Sample Report | Real Report |
|---|---------------|-------------|
| **Root** | `min-h-screen w-screen bg-[#F8F7F4]` (L46) | `flex min-h-screen bg-[#F8F7F4]` (L143) |
| **Extra chrome** | Sticky premium banner (L48–59) | `ZombieWatermark`, `ClientLeftNav` (hidden mobile) |
| **Content wrapper** | `w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-10 pb-20` (L62) | `flex-1 pl-0 md:pl-56` → inner `max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-20` (L150–151) |
| **Section stack** | `space-y-4 sm:space-y-6 mt-4 sm:mt-6` (L63) | `space-y-6 mt-10` (L152) |

#### 2. Max-width settings

**Sample Report (`grep max-w`):**
```
L49: max-w-6xl mx-auto (banner inner)
L62: max-w-6xl mx-auto (main content)
```

**Real Report (`grep max-w`):**
```
L151: max-w-6xl mx-auto (main content only)
```

Both cap content at `max-w-6xl` (72rem). Sample adds `w-screen` **outside** this constraint, which can break the cap on mobile.

#### 3. Padding/Margin classes

**Sample Report:**
```
L49: px-6 sm:px-8 py-4
L55: px-5 py-2.5 (CTA button)
L62: px-3 sm:px-6 lg:px-8 pt-4 sm:pt-10 pb-20
L63: space-y-4 sm:space-y-6 mt-4 sm:mt-6
```

**Real Report:**
```
L151: px-4 sm:px-6 pt-6 sm:pt-10 pb-20
L152: space-y-6 mt-10
L158: px-4 py-2 (teaser badge)
L185–207: p-6, px-4 py-3 (footer nav section only)
```

**Difference:** Sample uses **tighter mobile padding** (`px-3`) but **`w-screen`** negates benefit. Sample banner uses `px-6 sm:px-8`; Real has no equivalent sticky strip.

### B. Component Import Comparison

#### Sample Report imports
```tsx
Link from "next/link"
createClient from "@/lib/supabase/server"
ProductIdentity from "@/components/ProductIdentity"
TrendSignalDashboard, MarketIntelligence, SocialProofTrendIntelligence,
SourcingIntel, SupplierContact, EXPORT_STATUS_DISPLAY from "@/components/report"
```

#### Real Report imports (additional)
```tsx
getAuthTier, maskReportByTier from "@/lib/auth-server"
notFound from "next/navigation"
PRICING from "@/src/config/pricing"
ClientLeftNav from "@/components/layout/ClientLeftNav"
ZombieWatermark from "@/components/ZombieWatermark"
ScoutFinalReportsRow from "@/types/database"
```

#### Shared components (identical usage)
| Component | Sample | Real |
|-----------|--------|------|
| `ProductIdentity` | ✓ | ✓ |
| `TrendSignalDashboard` | ✓ | ✓ |
| `MarketIntelligence` | ✓ | ✓ |
| `SocialProofTrendIntelligence` | ✓ | ✓ |
| `SourcingIntel` | ✓ (always) | ✓ (if `hasLogistics`) |
| `SupplierContact` | ✓ | ✓ |

#### Unique props / behavior
| Prop / behavior | Sample | Real |
|-----------------|--------|------|
| `isSample={true}` | ✓ | — |
| `reportId`, `weekId`, `isFavorited` | — | ✓ |
| `maskedReport` vs raw `report` | raw | tier-masked |
| `tier` | hardcoded `"alpha"` | dynamic from auth |
| Sticky subscribe banner | ✓ | — |
| Prev/Next product footer | — | ✓ |

**Conclusion:** No alternate component *versions* per route. Layout differences in sections are **100% shared component code**, except `ProductIdentity` watermark overlay when `isSample={true}`.

---

## Part 2: Responsive Breakpoint Audit

### Page-level responsive classes

#### Sample Report — all `sm:` / `lg:` tokens
| Class | Count | Lines |
|-------|-------|-------|
| `sm:px-8` | 1 | 49 |
| `sm:flex-row` | 1 | 49 |
| `sm:text-base` | 1 | 50 |
| `sm:text-left` | 1 | 50 |
| `sm:px-6` | 1 | 62 |
| `lg:px-8` | 1 | 62 |
| `sm:pt-10` | 1 | 62 |
| `sm:space-y-6` | 1 | 63 |
| `sm:mt-6` | 1 | 63 |

#### Real Report — all `sm:` / `md:` tokens
| Class | Count | Lines |
|-------|-------|-------|
| `hidden md:flex` | 1 | 147 |
| `md:pl-56` | 1 | 150 |
| `sm:px-6` | 1 | 151 |
| `sm:pt-10` | 1 | 151 |

### Comparison table (page files)

| Breakpoint Class | Sample Count | Real Count | Difference |
|------------------|--------------|------------|------------|
| `sm:px-*` | 2 | 1 | Sample +1; also has `lg:px-8` |
| `sm:flex-row` | 1 | 0 | Sample only (banner) |
| `sm:text-*` | 2 | 0 | Sample only |
| `sm:space-y-*` | 1 | 0 | Sample only |
| `sm:pt-*` | 1 | 1 | Equal |
| `md:flex` | 0 | 1 | Real only (left nav) |
| `md:pl-56` | 0 | 1 | Real only |
| `lg:px-*` | 1 | 0 | Sample only |

**Shared components** (`components/report/`): ~14 `sm:`/`md:` usages total — section bodies are far richer than either page wrapper.

---

## Part 3: Flex/Grid Layout Analysis

### A. Flex containers in Sample Report `page.tsx`

```
L36: flex items-center justify-center (empty state)
L49: flex flex-col sm:flex-row items-center justify-between gap-3 (banner)
L55: inline-flex items-center justify-center gap-2 (CTA)
```

| Line | Classes | flex-wrap? | Responsive direction? | Responsive gap? |
|------|---------|------------|----------------------|-----------------|
| 36 | `flex items-center justify-center` | No | No | No |
| 49 | `flex flex-col sm:flex-row ... gap-3` | No | **Yes** `flex-col sm:flex-row` | No |
| 55 | `inline-flex ... gap-2` | No | No | No |

### B. Grid containers in Sample Report `page.tsx`

**None.**

### C. Real Report `page.tsx` flex (for comparison)

```
L143: flex min-h-screen
L150: flex-1 pl-0 md:pl-56
L186: flex items-center justify-between gap-4 (prev/next footer)
L203: inline-flex items-center gap-2
```

### D. Critical shared-component flex (affects both routes)

#### === SECTION: Export & Logistics — Billable Weight ===

**SHARED (`components/report/SourcingIntel.tsx`):**

```
SAMPLE & REAL (identical — L113):
<div className="flex items-center gap-3 mb-12">
  <motion.card flex-1> Actual Weight </motion.card>
  <ArrowRight />
  <motion.card flex-1> Volumetric Weight </motion.card>
  <ArrowRight />
  <motion.card flex-1> Billable Weight </motion.card>
</motion.div>
```

**DIFFERENCE vs ideal responsive pattern:**
```
EXPECTED (not present):
<div className="flex flex-col sm:flex-row flex-wrap items-stretch gap-3 ...">
```

| Issue | Detail |
|-------|--------|
| No `flex-wrap` | Three `flex-1` cards forced in one row on 320px screens |
| No `flex-col md:flex-row` | Never stacks on mobile |
| Large typography | `text-4xl`, `text-lg` labels inside fixed `p-5` cards |
| Parent padding | `p-10` on wrapper (L109) — 40px each side eats ~80px |

**MOBILE BREAKAGE RISK: HIGH**

#### === SECTION: Export — Group B Broker ===

**`components/GroupBBrokerSection.tsx` L30–33:**
```tsx
className={isEmailOpen ? "flex flex-col gap-4" : "grid grid-cols-2 gap-6"}
```
`grid-cols-2` with **no** `grid-cols-1 sm:grid-cols-2` — two columns on all widths when email closed.

**MOBILE BREAKAGE RISK: MEDIUM–HIGH**

---

## Part 4: Specific Problem Areas

### A. Export & Logistics — Billable Weight Section

**Location:** `components/report/SourcingIntel.tsx` L107–144 (not in `page.tsx`)

```tsx
// Parent (L109)
<div className="bg-[#F8F7F4] rounded-2xl p-10">

// Billable Weight row (L113)
<div className="flex items-center gap-3 mb-12">
  <motion.card className="flex-1 ... p-5 text-center">  // Actual
  <ArrowRight className="w-5 h-5 shrink-0" />
  <motion.card className="flex-1 ...">                  // Volumetric
  <ArrowRight className="w-5 h-5 shrink-0" />
  <motion.card className="flex-1 ... bg-[#DCFCE7]">     // Billable (L133-137)
```

| Check | Result |
|-------|--------|
| Parent `flex-wrap`? | **No** |
| Responsive breakpoints? | **None** on L113 |
| `overflow-x-auto`? | **No** |

**Sample vs Real:** Identical markup when `SourcingIntel` renders. Real gates on `hasLogistics` (L179); Sample always mounts it (L81).

**Suggested class replacement (for fix phase):**
```diff
- <motion.div className="flex items-center gap-3 mb-12">
+ <motion.div className="flex flex-col sm:flex-row items-stretch gap-3 mb-12 overflow-x-auto sm:overflow-visible">
```
Optional per-card: `min-w-0 sm:flex-1 w-full sm:w-auto`

---

### B. Global Market Prices Section

**Location:** `components/report/MarketIntelligence.tsx` (subsection “Global Market Availability”, L323–366)

Not a `<table>` — uses CSS grid of market cards.

```tsx
// Profit block (L252) — borders persist at mobile
<div className="grid grid-cols-1 sm:grid-cols-3">
  <div className="pr-8 border-r border-[#E8E6E1]">...</motion.div>
  <div className="px-8 border-r ...">...</motion.div>
  <motion.div className="pl-8">...</motion.div>

// Global markets (L333)
<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16" style={{ rowGap: "1.2cm" }}>
  <motion.div className="border-l-4 pl-8 py-6 min-h-[150px]">
```

| Check | Result |
|-------|--------|
| Table wrapper / `overflow-x-auto` | **No** — grid only |
| Column responsive behavior | `grid-cols-1 sm:grid-cols-2` ✓ at `sm` |
| Mobile issues | `gap-x-16` (64px), `pl-8`/`pr-8`, `border-r` on single-column stack, inline `cm` margins |
| Horizontal scroll handling | **None** |

**Sample vs Real:** Identical component.

**Suggested fixes:**
```diff
- <div className="pr-8 border-r border-[#E8E6E1]">
+ <motion.div className="pr-0 sm:pr-8 border-0 sm:border-r border-[#E8E6E1] pb-6 sm:pb-0">

- <div className="grid ... gap-x-16" style={{ marginTop: "1.2cm", rowGap: "1.2cm" }}>
+ <div className="grid ... gap-x-4 sm:gap-x-16 gap-y-6" style={{ marginTop: "1rem" }}>
```

---

### C. Section Wrappers (`<section>` tags)

**Neither `page.tsx` defines report `<section>` elements.** All live in components:

| Section | File | Padding on `<section>` |
|---------|------|------------------------|
| Product Identity | `ProductIdentity.tsx` L88–90 | `p-8` (fixed) |
| Trend Signals | `TrendSignalDashboard.tsx` L39 | `p-6` |
| Market Intelligence | `MarketIntelligence.tsx` L227–229 | `p-6` |
| Social Proof | `SocialProofTrendIntelligence.tsx` L62–64 | `p-8` (fixed) |
| Export & Logistics | `SourcingIntel.tsx` L70–72 | `p-8` (fixed) |
| Launch Kit | `SupplierContact.tsx` L214 | `p-6` |
| Supplier Contact | (same section) | `p-6` |

**Ideal responsive pattern (missing everywhere):**
`p-4 sm:p-6 lg:p-8`

Inner blocks commonly use **`p-10` / `p-12`** without breakpoints — adds to overflow on narrow viewports.

**Real Report-only `<section>`:** Footer prev/next block `p-6` (`page.tsx` L185).

---

## Part 5: Font Size Analysis

### Page files — text size tokens

**Sample Report:**
```
text-[#9E9C98], text-white/95, text-xs, sm:text-base, text-sm, text-base
```

**Real Report:**
```
text-base, text-sm, text-[#16A34A], text-[#1A1916], etc.
```

### Responsive font sizes (`text-* sm:text-*` / `md:text-*`)

**Page files:** Sample has `text-xs sm:text-base` (L50). Real has **none**.

**Shared components:** `ProductIdentity.tsx` L198–207 uses `text-2xl md:text-3xl` for prices. **No other report components** use responsive text size utilities (grep returned empty for `components/report/`).

### Shared components — dominant fixed sizes (overflow risk)

| Token | Example locations |
|-------|-------------------|
| `text-3xl` | Section H2s (all report components) |
| `text-4xl` / `text-5xl` / `text-7xl` | SourcingIntel weights, MarketIntelligence valuation, SocialProof scores |
| Inline `fontSize: "140px"` | SocialProof Gap Index (L136) |

**MOBILE BREAKAGE RISK: MEDIUM** (large fixed headings + no `text-* sm:text-*` scaling in report sections)

---

## Part 6: Section-by-Section Comparison

> Because both pages render the **same components**, each subsection shows one shared JSX source. Differences note **page-wrapper** or **prop** effects only.

---

### Product Identity

**Source:** `components/ProductIdentity.tsx` L87–251  
**Rendered by:** Sample L71–77, Real L163–171

**Key JSX (responsive-positive):**
```tsx
<section className="... p-8 ...">
  <div className="flex flex-col md:flex-row gap-10">
    <div className="relative w-full md:w-80 shrink-0 ...">
    <motion.div className="flex-1 min-w-0 ... overflow-hidden @container">
      <div className="flex flex-wrap items-center justify-between gap-2">
```

**Responsive classes present:**
- `md:flex-row`, `md:w-80`, `md:text-3xl`, `flex-wrap`, `min-w-0`, `clamp()` on H1

**Sample-only:** `isSample` watermark overlay (L110–118) — no layout break.

**MOBILE BREAKAGE RISK: LOW** (best-in-class responsive patterns in codebase)

**Page-wrapper impact:** Sample `w-screen` can still cause page-level horizontal scroll.

---

### Trend Signal Dashboard

**Source:** `components/report/TrendSignalDashboard.tsx` L38–177

**Key layouts:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">           // L48
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">            // L88
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"> // L138
```

**MOBILE BREAKAGE RISK: LOW–MEDIUM** (`grid-cols-2` platform row at 320px may be tight)

---

### Market Intelligence (incl. Global Market Prices)

**Source:** `components/report/MarketIntelligence.tsx` L226–495

**Issues:** See Part 4B — `pr-8 border-r`, `gap-x-16`, `pl-8`, `text-5xl` in profit grid.

**MOBILE BREAKAGE RISK: HIGH** (confirmed problem area)

---

### Social Proof

**Source:** `components/report/SocialProofTrendIntelligence.tsx`

**Key issue (L87–110):**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2">
  <div className="pr-12 border-r border-[#E8E6E1]">  // Korean Traction
  <div className="pl-12">                           // Global Presence
```
At `grid-cols-1` (mobile), **right border + asymmetric padding remain** — wastes horizontal space.

**Gap Index:** `fontSize: "140px"` inline (L136).

**MOBILE BREAKAGE RISK: HIGH**

---

### Export & Logistics

**Source:** `components/report/SourcingIntel.tsx` + `GroupBBrokerSection.tsx`

**Issues:** Billable Weight row (Part 4A), `p-10` inner blocks, `grid-cols-2` broker grid.

**MOBILE BREAKAGE RISK: HIGH** (confirmed problem area)

---

### Global Market Prices

*Subsection of Market Intelligence* — see Part 4B.

---

### Launch & Execution Kit / Supplier Contact

**Source:** `components/report/SupplierContact.tsx`

Uses `grid grid-cols-1 sm:grid-cols-2` in places (L360, L455). Some `flex` rows with `min-w-0` (L408). Generally better than SourcingIntel.

**MOBILE BREAKAGE RISK: MEDIUM**

---

## Critical Issues Found

### Page-level (Sample only — explains differential breakage)

| # | Issue | File:Line | Fix suggestion |
|---|-------|-----------|----------------|
| 1 | **`w-screen` causes 100vw overflow** | `app/sample-report/page.tsx:46` | Replace with `w-full` or remove; add `overflow-x-hidden` on root or `<main>` child |
| 2 | No `min-w-0` flex containment | Sample L62 vs Real L150 `flex-1` | Wrap content: `className="flex-1 min-w-0 w-full"` |
| 3 | Sticky banner + `scroll-mt-[160px]` | Sample banner L48 + components | Verify anchor scroll under double-fixed headers (Header + banner) |
| 4 | Tighter `px-3` but overshadowed by `w-screen` | Sample L62 | Align with Real `px-4 sm:px-6` after fixing width |

### Shared components (both routes — Sample shows worse)

| # | Issue | File:Line | Fix suggestion |
|---|-------|-----------|----------------|
| 5 | Billable Weight 3-column flex, no wrap | `SourcingIntel.tsx:113` | `flex-col sm:flex-row`, optional `overflow-x-auto` |
| 6 | Broker HS grid always 2 cols | `GroupBBrokerSection.tsx:32` | `grid-cols-1 sm:grid-cols-2` |
| 7 | Profit grid borders on mobile | `MarketIntelligence.tsx:253-286` | `border-0 sm:border-r`, responsive padding |
| 8 | Global market `gap-x-16`, `pl-8` | `MarketIntelligence.tsx:333-337` | `gap-x-4 sm:gap-x-16`, `pl-4 sm:pl-8` |
| 9 | Social Proof `pr-12 border-r` on mobile | `SocialProofTrendIntelligence.tsx:88-110` | `sm:pr-12 sm:border-r`, remove on mobile |
| 10 | Fixed `p-8`/`p-10` section padding | Multiple components | `p-4 sm:p-6 lg:p-8` pattern |
| 11 | No responsive text on section headings | All report `h2` `text-3xl` | `text-2xl sm:text-3xl` |
| 12 | Gap Index 140px font | `SocialProofTrendIntelligence.tsx:136` | `clamp()` or `text-7xl sm:text-9xl` |

---

## Recommended Fix Strategy

### Phase 1 — Sample page wrapper (highest ROI, smallest diff)

1. **`app/sample-report/page.tsx:46`** — `w-screen` → `w-full max-w-[100%]`.
2. **L62** — Add `min-w-0 overflow-x-hidden` to content wrapper.
3. **L62** — Match Real padding: `px-4 sm:px-6` (drop `px-3` / optional `lg:px-8` unless needed).

### Phase 2 — Confirmed broken sections (shared components)

4. **`SourcingIntel.tsx:113`** — Stack weight cards on mobile; reduce label size `text-lg sm:text-lg` → `text-xs sm:text-lg`.
5. **`GroupBBrokerSection.tsx:32`** — Responsive grid columns.
6. **`MarketIntelligence.tsx:252-337`** — Responsive borders/gaps/padding on profit + global grids.
7. **`SocialProofTrendIntelligence.tsx:87-110`** — Remove side borders/padding below `sm`.

### Phase 3 — Systematic hardening

8. Standardize section padding: `p-4 sm:p-6 lg:p-8` on all `<section>` in report components.
9. Add `overflow-x-auto` only where horizontal scroll is intentional (e.g. wide data tables).
10. Retest Sample and Real at **320px, 375px, 390px** with Chrome DevTools; compare horizontal scroll width on `<body>`.

### Verification checklist

- [ ] No horizontal scrollbar on Sample at 320px width
- [ ] Billable Weight cards stack or scroll without clipping
- [ ] Global Market Availability cards readable without off-screen content
- [ ] Social Proof Market Gap: no stray right border on mobile
- [ ] Real Report regression-tested at same breakpoints

---

## Answers to Success Criteria

| # | Question | Answer |
|---|----------|--------|
| 1 | className strings **MISSING** in Sample vs Real page? | Page-level: Real has `flex-1`, `md:pl-56`, `hidden md:flex`; Sample has `w-screen`, sticky banner, more `sm:` on wrapper. **Sections share one codebase** — missing patterns are in **components**, not Sample page. |
| 2 | Flex containers lacking `flex-wrap` / responsive direction? | **Yes:** `SourcingIntel.tsx:113` (critical), `GroupBBrokerSection.tsx:32`, export status row `L84`. |
| 3 | Hardcoded desktop padding? | **Yes:** `p-8`, `p-10`, `p-12` throughout report components; Sample page `px-3` is actually smaller but `w-screen` dominates. |
| 4 | Text without responsive sizes? | **Yes:** Most report headings/metrics; only ProductIdentity prices use `md:text-3xl`. |
| 5 | Exact line numbers? | Documented in Critical Issues table above. |
| 6 | Exact className replacements? | Documented in Part 4 and Recommended Fix Strategy. |

---

## Appendix: Sample Report `page.tsx` full structure (reference)

```tsx
// L46-87 — entire successful render path
<div className="min-h-screen w-screen bg-[#F8F7F4]">          {/* ⚠ w-screen */}
  <div className="sticky top-0 z-50 w-full ...">            {/* banner */}
    <motion.div className="max-w-6xl mx-auto px-6 sm:px-8 ... flex flex-col sm:flex-row ...">
  <motion.div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 ...">
    <motion.div className="space-y-4 sm:space-y-6 ...">
      <ProductIdentity isSample={true} ... />
      <TrendSignalDashboard />
      <MarketIntelligence />
      <SocialProofTrendIntelligence />
      <SourcingIntel />
      <SupplierContact />
```

```tsx
// Real Report L143-183 — content shell
<div className="flex min-h-screen bg-[#F8F7F4]">
  <div className="print-hide hidden md:flex"><ClientLeftNav /></motion.div>
  <div className="flex-1 pl-0 md:pl-56">                      {/* ✓ flex shrink context */}
    <motion.div className="max-w-6xl mx-auto px-4 sm:px-6 ...">
      {/* same report components */}
```

---

*End of forensic analysis.*
