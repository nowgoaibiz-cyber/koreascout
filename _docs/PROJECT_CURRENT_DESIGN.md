# PROJECT CURRENT DESIGN — Complete UI/UX Baseline Audit

**Audit date:** Design extraction only. No code was modified.  
**Scope:** Next.js app + `components/`. Tailwind v4. Single output: this file.

---

## SECTION 1: Project & Config Baseline

### 1-1. Tailwind Version & Config

- **Tailwind version:** v4 (from `package.json`: `"tailwindcss": "^4"`, `"@tailwindcss/postcss": "^4"`).
- **Config file:** **File not found.** No `tailwind.config.ts` or `tailwind.config.js`. Tailwind v4 uses CSS-first configuration.
- **Content paths:** Not defined in a JS config; v4 uses default content detection (e.g. `./app/**/*.{js,ts,jsx,tsx}`, `./components/**/*.{js,ts,jsx,tsx}`) unless overridden in PostCSS/CSS.
- **Custom theme:** Defined in `app/globals.css` via `@theme inline`:
  - `--color-background: var(--background);`
  - `--color-foreground: var(--foreground);`
  - `--font-sans: var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif;`
  - `--font-display: var(--font-syne), ui-sans-serif, system-ui, sans-serif;`
- **Plugins:** None referenced in the codebase (no typography, scrollbar, etc.).
- **darkMode:** Not set in config (no `darkMode: 'class'` or `'media'`). Theme is effectively always dark via CSS variables.

### 1-2. CSS Custom Properties

**Variables in `app/globals.css`:**

| Variable       | Value                        |
|----------------|------------------------------|
| `--background` | `#030303`                    |
| `--foreground` | `#ffffff`                    |
| `--indigo`     | `#6366f1`                    |
| `--purple`     | `#a855f7`                    |
| `--amber`      | `#f59e0b`                    |
| `--bg-card`    | `#0d0d0f`                    |
| `--border`     | `rgba(255, 255, 255, 0.08)`  |
| `--text-muted` | `rgba(255, 255, 255, 0.45)`  |
| `--text-mid`    | `rgba(255, 255, 255, 0.7)`   |

**Layers:** No `@layer base`, `@layer components`, or `@layer utilities` blocks in `globals.css`.

**@font-face:** None. Fonts are loaded via `next/font/google` in `app/layout.tsx`.

**Global overrides:**
- `html { scroll-behavior: smooth; }`
- `body { background: var(--background); color: var(--foreground); font-family: var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif; }`
- No global `*` reset beyond Tailwind’s preflight.

### 1-3. Color Palette In Use

Scanned `app/` and `components/` for color utility classes.

**Background colors:**
- `bg-[#030303]` [DOMINANT — home, product detail, login]
- `bg-[#0d0d0f]` [DOMINANT — cards, login card, pricing]
- `bg-[var(--bg-card)]` [DOMINANT — product detail sections]
- `bg-zinc-950`, `bg-zinc-900`, `bg-zinc-800`, `bg-zinc-800/50`, `bg-zinc-700` (admin only)
- `bg-white`, `bg-white/5`, `bg-white/[0.02]`, `bg-white/[0.03]`, `bg-white/[0.025]`, `bg-white/10`, `bg-black`, `bg-black/30`, `bg-black/60`
- `bg-indigo-500`, `bg-indigo-500/10`, `bg-indigo-600`
- `bg-emerald-500`, `bg-emerald-500/10`, `bg-emerald-500/15`, `bg-emerald-500/20`, `bg-emerald-600`
- `bg-amber-500/5`, `bg-amber-500/10`, `bg-amber-500/15`, `bg-amber-500/20`
- `bg-red-500/10`, `bg-rose-500/15`, `bg-blue-500/5`, `bg-blue-500/10`, `bg-blue-500/20`
- `bg-purple-500/15`, `bg-green-500/10`
- `bg-gray-500/80` (HazmatBadges), `bg-gray-100` (GoogleSignInButton)
- Gradients: `bg-gradient-to-br`, `bg-gradient-to-b`, `bg-gradient-to-r`, `bg-gradient-to-t`
- Hex/gradient combos: `#08080e`, `#070c18`, `#0d0e1a`, `#0a0a10`, `#0d0e1f`, `#030712`, `#06060f`, `#0a0a0a`

**Text colors:**
- `text-white` [DOMINANT]
- `text-white/70`, `text-white/60`, `text-white/50`, `text-white/45`, `text-white/40`, `text-white/35`, `text-white/30`, `text-white/25`, `text-white/20`, `text-white/15`
- `text-zinc-200`, `text-zinc-300`, `text-zinc-400`, `text-zinc-500`, `text-zinc-600` (admin, product detail Launch section)
- `text-indigo-400`, `text-indigo-200`, `text-indigo-200/80`
- `text-emerald-400`, `text-emerald-300`, `text-emerald-200`
- `text-amber-400`, `text-amber-200`, `text-amber-300`
- `text-red-400`, `text-red-300`, `text-rose-400`
- `text-blue-400`, `text-blue-300`, `text-blue-400/70`, `text-blue-400/50`
- `text-purple-300`, `text-green-400`, `text-green-300`
- `text-gray-800` (GoogleSignInButton)

**Border colors:**
- `border-white/10` [DOMINANT]
- `border-white/15`, `border-white/20`, `border-white/5`, `border-white/35`, `border-white/40`
- `border-zinc-800`, `border-zinc-700`, `border-zinc-700/50`, `border-zinc-600`
- `border-indigo-500`, `border-indigo-500/30`, `border-indigo-500/25`, `border-indigo-400`
- `border-emerald-500/30`, `border-emerald-500/50`, `border-emerald-500/20`
- `border-amber-500/10`, `border-amber-500/15`, `border-amber-500/20`, `border-amber-500/25`, `border-amber-500/30`, `border-amber-500/40`
- `border-red-500/20`, `border-rose-500/30`, `border-blue-500/20`, `border-blue-500/30`, `border-purple-500/30`
- `border-white/80` (GoogleSignInButton)

**Ring/Shadow colors:**
- `shadow-[0_0_24px_rgba(99,102,241,.35)]`, `shadow-[0_0_36px_rgba(99,102,241,.55)]`
- `shadow-[0_0_60px_rgba(99,102,241,.12)]`, `shadow-[0_0_40px_rgba(99,102,241,.1)]`
- `shadow-[0_8px_28px_rgba(245,158,11,.35)]`, `shadow-[0_14px_40px_rgba(245,158,11,.5)]`
- `shadow-[0_0_60px_rgba(245,158,11,.18)]`, `shadow-[0_0_100px_rgba(245,158,11,.3)]`
- `shadow-[0_4px_20px_rgba(99,102,241,.4)]`, `shadow-[0_6px_28px_rgba(99,102,241,.5)]`
- `shadow-lg`, `shadow-xl`, `shadow-md`, `shadow-emerald-500/20`
- `focus:ring-2 focus:ring-indigo-500`, `focus:ring-2 focus:ring-white/50`
- `focus:border-emerald-500`

**Accent/Brand colors:**
- **Primary accent (marketing/product):** `indigo-500` / `indigo-400` (CTAs, nav, pricing highlight, gradients).
- **Secondary accent (success/verified/Alpha):** `emerald-500` / `emerald-400` (badges, buttons, links, Scout Verified).
- **Tier/secondary (Alpha/price ladder):** `amber-500` / `amber-400` (Alpha vault, price ladder, warnings).
- **Admin accent:** `emerald-500` (focus, confirm, links); `indigo-600` (Save button).

**Mixing of scales:** Public/member-facing UI uses **white opacity** (`white/10`, `white/50`) and **indigo/emerald/amber** on dark `#030303` / `#0d0d0f`. Admin uses **zinc** (950, 900, 800, 700) for backgrounds and borders. So: **zinc** is used only in admin; **gray** appears in HazmatBadges and GoogleSignInButton; **slate** is not used. Same semantic (e.g. “muted text”) is **white/45** or **white/50** in app vs **text-zinc-500** in admin — different scales for same purpose.

---

## SECTION 2: Typography Audit

### 2-1. Heading Scale

| Level              | Exact classes                                                                 | Found in |
|--------------------|-------------------------------------------------------------------------------|----------|
| Page titles (h1)   | `font-[family-name:var(--font-syne)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight` | app/page.tsx (hero) |
|                    | `font-[family-name:var(--font-syne)] text-2xl font-bold text-white`           | app/weekly/[weekId]/page.tsx |
|                    | `font-[family-name:var(--font-syne)] text-2xl font-bold text-white mb-1`      | app/login/page.tsx |
| Section titles (h2) | `font-[family-name:var(--font-syne)] text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white` | app/page.tsx (comparison, pricing, FAQ, etc.) |
|                    | `font-[family-name:var(--font-syne)] text-lg font-bold text-white`           | app/weekly/[weekId]/[id]/page.tsx (Product Identity, Trend Signal, Market Intelligence) |
|                    | `font-[family-name:var(--font-syne)] text-xl font-bold text-white`           | app/weekly/[weekId]/[id]/page.tsx (Export & Logistics, Social Proof block) |
|                    | `text-xl font-bold text-white`                                                | app/weekly/[weekId]/[id]/page.tsx (Launch & Execution Kit) |
| Card titles (h3)   | `font-[family-name:var(--font-syne)] text-sm font-bold text-white`           | app/page.tsx, app/weekly/[weekId]/[id]/page.tsx |
|                    | `text-2xl font-bold text-white leading-tight`                                | app/weekly/[weekId]/[id]/page.tsx (product name) |
| Sub-labels         | `text-[11px] uppercase tracking-wider text-white/50 font-semibold`           | app/weekly/[weekId]/[id]/page.tsx |
|                    | `text-[11px] uppercase tracking-[0.14em] text-indigo-400 font-semibold`       | app/page.tsx |
|                    | `text-[10px] uppercase tracking-widest text-white/20 font-semibold`          | app/page.tsx |
|                    | `text-[11px] font-semibold text-zinc-400 uppercase tracking-wider`           | app/admin/[id]/page.tsx (labels) |

### 2-2. Body Text

| Role                | Classes |
|---------------------|--------|
| Primary body        | `text-sm text-white/70`, `text-sm text-white/80`, `text-base text-white/45`, `text-sm text-white` |
| Secondary/muted     | `text-white/45`, `text-white/50`, `text-white/40`, `text-zinc-500`, `text-zinc-400` |
| Caption/hint        | `text-xs text-white/40`, `text-xs text-white/30`, `text-[10px] text-white/30`, `text-[11px] text-white/40`, `text-xs text-zinc-500` |
| Monospace/data      | `font-mono text-xs`, `text-2xl md:text-3xl font-mono font-black text-white tracking-tight`, `text-5xl font-mono font-bold text-emerald-400` |

### 2-3. Font Family

- **Loaded:** Syne (weights 400, 600, 700, 800), DM Sans (300, 400, 500, normal + italic) via `next/font/google` in `app/layout.tsx`.
- **Variables:** `--font-syne`, `--font-dm-sans` (applied to `<body>` via `className={`${syne.variable} ${dmSans.variable} font-sans antialiased`}`).
- **Usage:** Body uses `font-sans` (DM Sans). Headings use `font-[family-name:var(--font-syne)]` (Syne) in app/page.tsx and product detail; some headings use only `font-bold`/`font-semibold` without Syne.
- **Fallbacks:** `ui-sans-serif, system-ui, sans-serif` in CSS and Tailwind.

### 2-4. Typography Inconsistencies

- Section titles: product detail uses both `text-lg font-bold` and `text-xl font-bold` for section headings (e.g. “Market Intelligence” vs “Export & Logistics Intel”).
- Muted text: `text-white/45` vs `text-white/50` vs `text-zinc-500` used for similar “secondary” text (member app vs admin).
- Micro labels: mix of `text-[11px]`, `text-[10px]`, `text-xs` for similar label types (e.g. “COST PER UNIT”, “LEAD TIME”, section labels).
- Font weight: section headers in product detail use `font-bold`; admin accordion headers use `font-semibold`; home uses `font-extrabold` for hero. Inconsistent weight for “title” level.

---

## SECTION 3: Layout & Spacing System

### 3-1. Page Container Pattern

| Page                    | Container classes |
|-------------------------|-------------------|
| Home (app/page.tsx)     | No single wrapper; sections use `max-w-[820px] mx-auto`, `max-w-[900px] mx-auto`, `max-w-[1100px] mx-auto`, `max-w-[960px] mx-auto`, `max-w-[720px] mx-auto`, `max-w-[1000px] mx-auto`, etc. Main: `pt-[72px]`, sections `px-4 sm:px-6`, `py-16 sm:py-24`. |
| Product detail (weekly/[weekId]/[id]) | `min-h-screen bg-[#030303] text-white pt-[72px] px-4 py-12` → inner `max-w-2xl mx-auto space-y-6`. |
| Product list (weekly/[weekId])        | `min-h-screen bg-[#030303] text-white pt-[72px] px-4 py-12` → inner `max-w-2xl mx-auto`. |
| Admin list (admin/page.tsx)          | `bg-zinc-950 min-h-screen`; content `px-6 py-4`, table wrapper `mx-6 ... rounded-2xl border border-zinc-800 bg-zinc-900`. No max-width container. |
| Admin edit (admin/[id]/page.tsx)     | `bg-zinc-950 min-h-screen`; main `max-w-4xl mx-auto px-6 pt-20 pb-8 flex flex-col gap-4`. |

**Notes:** Max-widths vary by page (2xl on product, 4xl on admin edit). Horizontal padding: `px-4 sm:px-6` or `px-6`. Centering: `mx-auto` where a max-width is set.

### 3-2. Section Spacing (Product Detail)

- **Gap between major sections:** `space-y-6` on the main column.
- **Card/section padding:** `p-6` [DOMINANT] on all main sections (`rounded-xl border border-white/10 bg-[var(--bg-card)] p-6`).
- **Internal card padding:** `p-4`, `p-3`, `px-4 py-3`, `px-5 py-3.5`, `p-8` (e.g. LockedSection, BrokerEmailDraft).
- **Divider style:** `border-t border-white/10`, `border-b border-white/10`, `divide-y divide-white/10`, `border-t border-zinc-800` (admin).

### 3-3. Grid & Flex Patterns

| Pattern | Classes | Use | Found in |
|--------|--------|-----|----------|
| 1 | `grid grid-cols-1 md:grid-cols-3 gap-4` | Trend Signal 3-column | weekly/[weekId]/[id]/page.tsx |
| 2 | `grid grid-cols-2 md:grid-cols-4 gap-3` | Market intel price cards | weekly/[weekId]/[id]/page.tsx |
| 3 | `grid grid-cols-2 gap-4` | Market gap (KR / Global) | weekly/[weekId]/[id]/page.tsx |
| 4 | `grid grid-cols-4 gap-3` | Platform breakdown | weekly/[weekId]/[id]/page.tsx |
| 5 | `flex flex-col md:flex-row gap-6` | Product Identity, Supplier blocks | weekly/[weekId]/[id]/page.tsx |
| 6 | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5` (dynamic) | Execution gallery | weekly/[weekId]/[id]/page.tsx |
| 7 | `grid grid-cols-2 sm:grid-cols-4 gap-2` | Hazmat badges | HazmatBadges.tsx |
| 8 | `flex flex-wrap gap-2` | Pills, tags, keywords | ViralHashtagPills, TagCloud, etc. |
| 9 | `flex flex-col gap-4`, `flex flex-col gap-2` | Contact cards, form groups | ContactCard, admin forms |
| 10 | `flex items-center justify-between` | Headers, nav, row actions | Navigation, admin header, product nav |
| 11 | `grid grid-cols-1 md:grid-cols-2 gap-6` | Home comparison, pricing-style blocks | app/page.tsx |
| 12 | `grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12` | Home “How It Gets Made” | app/page.tsx |

### 3-4. Responsive Breakpoints

**Used in codebase:** `sm:`, `md:`, `lg:`, `xl:` (all four appear).  
**Examples:** `sm:px-6`, `md:grid-cols-2`, `lg:text-5xl`, `xl:grid-cols-5`, `sm:grid-cols-2`, `md:flex-row`, `lg:gap-12`.  
**Not used:** `2xl:` not observed. Breakpoints are used for typography, grid, padding, and visibility (`hidden md:flex`).

---

## SECTION 4: Component Inventory

### Navigation (`components/Navigation.tsx`)

- **Purpose:** Global fixed nav with logo and auth links.
- **Root:** `fixed top-0 left-0 right-0 z-[9998] flex items-center justify-between px-4 sm:px-8 md:px-12 h-[72px] bg-[#030303]/70 backdrop-blur-xl border-b border-white/10`
- **Internal:** Logo link `font-[family-name:var(--font-syne)] font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent`; nav links `text-sm font-medium text-white/70 hover:text-white transition-colors`; Sign Up `rounded-lg bg-indigo-500 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-400 transition-colors`
- **Props:** None (async server component, reads auth).
- **Used in:** app/layout.tsx

---

### DonutGauge (`components/DonutGauge.tsx`)

- **Purpose:** 0–100 score ring; color by zone (red ≤40, yellow 41–70, green 71–100).
- **Root:** `relative inline-flex items-center justify-center` with `style={{ width: size, height: size }}`
- **Internal:** SVG circle (bg `rgba(255,255,255,0.1)`), progress circle (inline RGB: red-500, amber-400, emerald-400); center text `font-[family-name:var(--font-syne)] text-2xl font-bold tabular-nums text-white`, `text-xs text-white/50` for “/100”
- **Props:** `value`, `size`, `strokeWidth`
- **Used in:** app/weekly/[weekId]/[id]/page.tsx (Trend Signal Dashboard, Platform Breakdown)

---

### StatusBadge (`components/StatusBadge.tsx`)

- **Purpose:** Competition level (Low/Medium/High) or gap status (Blue Ocean/Emerging/Saturated) pill.
- **Variants:** competition → emerald/amber/rose; gap → blue/purple/white.
- **Root:** `inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium` + variant classes (e.g. `bg-emerald-500/15 text-emerald-300 border-emerald-500/30`)
- **Props:** `variant`, `value`, `label?`
- **Used in:** app/weekly/[weekId]/[id]/page.tsx

---

### LockedSection (`components/LockedSection.tsx`)

- **Purpose:** Paywall/locked content block with message, CTA link, optional locked field list.
- **Root:** `relative overflow-hidden rounded-xl border border-white/10 bg-[var(--bg-card)] p-8`
- **Internal:** Blur overlay `absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-[2px]`; lock icon `text-white/40`; message `text-lg font-medium text-white/90`; link `rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-400`
- **Props:** `message`, `cta`, `href`, `lockedFields?`
- **Used in:** app/weekly/[weekId]/[id]/page.tsx

---

### ContactCard (`components/ContactCard.tsx`)

- **Purpose:** Wrapper for manufacturer name, scale, and contact pills.
- **Root:** `bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4`
- **Internal:** Name `text-xl font-bold text-white`; scale pill `text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full`; ContactPill (see below)
- **Props:** name, corporateScale, contactEmail, contactPhone, homepage, naverLink, wholesaleLink
- **Used in:** app/weekly/[weekId]/[id]/page.tsx (SupplierContact uses ContactPill directly; ContactCard is exported for reuse)

---

### ContactPill (`components/ContactCard.tsx`)

- **Root (shared):** `bg-white/5 border border-white/10 hover:border-emerald-500/40 text-sm text-zinc-300 px-4 py-2 rounded-full flex items-center gap-2 w-full transition-colors`
- **Props:** icon, label, value, action (`"copy"` | `"link"`)
- **Used in:** ContactCard and SupplierContact in weekly/[weekId]/[id]/page.tsx

---

### CopyButton (`components/CopyButton.tsx`)

- **Variants:** default: `ml-2 inline-flex items-center rounded-md border border-white/20 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10`; primary: `inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition-colors shrink-0`
- **Props:** `value`, `variant?`
- **Used in:** weekly/[weekId]/[id]/page.tsx (HS code, etc.)

---

### ExpandableText (`components/ExpandableText.tsx`)

- **Purpose:** Clamped text with “Read More” / “Show Less”.
- **Root:** `mb-3`; label `text-xs text-white/40 mb-1`; paragraph `text-sm text-white/60 leading-relaxed` + `line-clamp-2` when collapsed; gradient fade `absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#0a0a0a] to-transparent`; button `text-xs text-emerald-400 hover:text-emerald-300 mt-1`
- **Props:** `text`, `label`
- **Used in:** app/weekly/[weekId]/[id]/page.tsx (SourcingIntel specs/composition)

---

### ScrollToIdButton (`components/ScrollToIdButton.tsx`)

- **Purpose:** Button that scrolls to `sectionId`; no default styling.
- **Root:** receives `className` from parent (e.g. `p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 ...` or `text-xs text-white/40 hover:text-white/60 ...`)
- **Props:** `sectionId`, `className`, `children`
- **Used in:** app/weekly/[weekId]/[id]/page.tsx

---

### PriceComparisonBar (`components/PriceComparisonBar.tsx`)

- **Purpose:** KR price → US price with arrow and gradient bar.
- **Root:** `rounded-lg border border-white/10 bg-white/[0.02] p-4`
- **Internal:** Labels `text-[11px] uppercase tracking-wider text-white/50 font-semibold`; values `text-lg font-semibold text-white tabular-nums`; bar `bg-gradient-to-r from-white/20 via-emerald-500/50 to-white/20`; arrow `text-emerald-400`
- **Props:** `krPrice`, `usPrice`
- **Used in:** app/weekly/[weekId]/[id]/page.tsx (Market Intelligence)

---

### ViralHashtagPills (`components/ViralHashtagPills.tsx`)

- **Purpose:** Clickable hashtag pills; copy on click.
- **Root:** `flex flex-wrap gap-2`
- **Internal:** Button: default `rounded-full border px-3 py-1.5 text-xs font-medium ... border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/10 hover:text-white`; copied `border-emerald-500/50 bg-emerald-500/20 text-emerald-300`
- **Props:** `tags` (string[])
- **Used in:** app/weekly/[weekId]/[id]/page.tsx (Market Intelligence, Social Proof)

---

### HazmatBadges (`components/HazmatBadges.tsx`)

- **Purpose:** Grid of Liquid/Powder/Battery/Aerosol badges from hazmat status.
- **Root:** `grid grid-cols-2 sm:grid-cols-4 gap-2`
- **Internal:** Each badge `inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium border` + trueClass/falseClass (e.g. `bg-blue-600/80 border-blue-500/80 text-white` vs `bg-white/10 border-white/20 text-white/50`; gray, orange, red for other items)
- **Props:** `status` (unknown)
- **Used in:** app/weekly/[weekId]/[id]/page.tsx (SourcingIntel)

---

### BrokerEmailDraft (`components/BrokerEmailDraft.tsx`)

- **Purpose:** Collapsible broker email draft with destination input and copy.
- **Root:** wrapper `div`; trigger button `w-full text-left p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors flex flex-col items-start`; title `text-lg font-bold text-emerald-400`; hint `text-[11px] text-white/40 mt-1`
- **Internal (expanded):** container `mt-3 p-4 rounded-xl border border-white/10 bg-white/[0.03]`; input `w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-white/30`; pre `text-xs text-white/50 ... p-3 bg-black/30 rounded-lg`; copy button `px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition-colors`
- **Props:** `report` (ScoutFinalReportsRow)
- **Used in:** app/weekly/[weekId]/[id]/page.tsx (SourcingIntel)

---

### GlobalPricingTable (`components/GlobalPricingTable.tsx`)

- **Purpose:** Table of global prices by country (US, UK, SEA, AU, IN).
- **Root:** `rounded-xl border border-white/10 bg-[var(--bg-card)] p-6`
- **Internal:** Title `font-[family-name:var(--font-syne)] text-lg font-bold text-white mb-3`; table wrapper `overflow-x-auto rounded-lg border border-white/10 bg-black/30`; th `px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/60`; td `px-3 py-2 ... text-white/80`; link `text-blue-400 hover:text-blue-300 hover:underline text-xs font-medium`
- **Props:** prices, tier, isTeaser, sourcingTip?
- **Used in:** Not imported in the files scanned; likely used elsewhere or legacy.

---

### TagCloud (`components/TagCloud.tsx`)

- **Purpose:** Display-only keyword pills.
- **Root:** `flex flex-wrap gap-2`
- **Internal:** `rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-400 border border-blue-500/30 transition-colors hover:bg-blue-500/30 hover:text-blue-300 hover:border-blue-500/50`
- **Props:** `keywords` (string[])
- **Used in:** Referenced in audit as “Section 4”; may be used in product detail or other pages.

---

### LogoutButton (`components/LogoutButton.tsx`)

- **Root:** `text-sm font-medium text-white/60 hover:text-white transition-colors`
- **Props:** none
- **Used in:** Navigation.tsx

---

### GoogleSignInButton (`components/GoogleSignInButton.tsx`)

- **Root:** `w-full flex items-center justify-center gap-3 rounded-xl bg-white text-gray-800 py-3 px-4 text-sm font-medium border border-white/80 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#0d0d0f] transition`
- **Props:** none
- **Used in:** app/login/page.tsx

---

### GlobalPricesHelper (`components/admin/GlobalPricesHelper.tsx`)

- **Purpose:** Admin form for editing global_prices JSON (region platform/url).
- **Root:** `flex flex-col gap-2` (and region rows)
- **Internal:** Inputs use same `inputClass` as admin edit page: `bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none`; labels `text-zinc-400 text-sm`; raw textarea `bg-zinc-950 text-zinc-500 text-[10px] font-mono rounded-lg px-3 py-2 border border-zinc-800 resize-none w-full`
- **Props:** value, onChange
- **Used in:** app/admin/[id]/page.tsx

---

### HazmatCheckboxes (`components/admin/HazmatCheckboxes.tsx`)

- **Purpose:** Checkboxes for hazmat flags (liquid, powder, battery, aerosol).
- **Root:** `grid grid-cols-2 gap-3`
- **Internal:** Label `flex items-center gap-2 cursor-pointer text-sm text-zinc-300`; checkbox `appearance-none w-4 h-4 rounded border border-zinc-600 bg-zinc-800 checked:bg-emerald-600 checked:border-emerald-500 focus:border-emerald-500 outline-none`
- **Props:** value, onChange
- **Used in:** app/admin/[id]/page.tsx

---

### AiPageLinksHelper (`components/admin/AiPageLinksHelper.tsx`)

- **Purpose:** Admin list of AI detail page URLs.
- **Root:** `flex flex-col gap-2`
- **Internal:** Input `bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none flex-1 min-w-0`; label `text-zinc-500 text-xs w-14`; remove button `text-zinc-600 hover:text-red-400`
- **Props:** value, onChange
- **Used in:** app/admin/[id]/page.tsx

---

### BlurredValue (inline in `app/weekly/[weekId]/[id]/page.tsx`)

- **Purpose:** Wraps content; when `canSee` is false, applies `blur-sm select-none pointer-events-none`.
- **Root:** `div` with conditional class
- **Props:** canSee, children
- **Used in:** Same file (Market Intelligence, SourcingIntel, etc.)

---

## SECTION 5: Page-by-Page Section Audit

### 5-1. Product Detail Page (`app/weekly/[weekId]/[id]/page.tsx`)

**Page wrapper:** `min-h-screen bg-[#030303] text-white pt-[72px] px-4 py-12` → `max-w-2xl mx-auto space-y-6`.

**Section 1: Product Identity**

- **Outer:** `rounded-xl border border-white/10 bg-[var(--bg-card)] p-6`
- **Inner:** `flex flex-col md:flex-row gap-6`; image container `rounded-xl bg-white`; text block with `text-2xl font-bold text-white`, `text-sm text-white/50`, `text-xs text-white/40`, pills `rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80`; export badge uses emerald/amber/rose by status
- **Background:** Solid `var(--bg-card)` (#0d0d0f)
- **Border:** `border border-white/10`; radius `rounded-xl`
- **Padding:** `p-6`
- **Accent:** emerald (price, verified), amber (est. wholesale), rose/amber/emerald for export status
- **Paywall:** None
- **Special:** Image aspect 3/4, category/export pills, viability_reason border-l emerald

**Section 2: Trend Signal Dashboard**

- **Outer:** `rounded-xl border border-white/10 bg-[var(--bg-card)] p-6`
- **Inner:** `grid grid-cols-1 md:grid-cols-3 gap-4`; each card `rounded-lg border border-white/10 bg-white/[0.02] p-4`; footer strip `rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3`
- **Background:** Card bg `var(--bg-card)`; inner cells glassmorphism-like `bg-white/[0.02]`
- **Border:** `border-white/10`, `border-white/5`
- **Padding:** `p-6`, inner `p-4`
- **Typography:** `text-[11px] uppercase tracking-wider text-white/50 font-semibold`, `text-xs text-white/30`
- **Accent:** DonutGauge (red/amber/emerald by value), StatusBadge (emerald/amber/rose, blue/purple/white)
- **Paywall:** None
- **Special:** DonutGauge, StatusBadge

**Section 3: Market Intelligence**

- **Outer:** `rounded-xl border border-white/10 bg-[var(--bg-card)] p-6`
- **Inner:** Subsections with `rounded-lg border border-white/10 bg-white/[0.02] p-3` or `p-4`; PriceComparisonBar; grid `grid-cols-2 md:grid-cols-4`, `grid-cols-2 sm:grid-cols-3 md:grid-cols-5`; CTA block `border border-emerald-500/30 bg-emerald-500/10`
- **Background:** Same as Section 1–2; inner cells `bg-white/[0.02]`
- **Border:** `border-white/10`, `border-emerald-500/30` for CTA
- **Padding:** `p-6`, inner `p-3`/`p-4`
- **Typography:** `text-[11px] uppercase tracking-wider text-white/50`, `text-4xl font-black text-emerald-400`, `text-xs text-white/40`, etc.
- **Accent:** emerald (profit, CTA), amber (pain point), blue (hashtags, Blue Ocean)
- **Paywall:** LockedSection used when not canSeeStandard; BlurredValue for Alpha-only fields
- **Special:** PriceComparisonBar, ViralHashtagPills, Global price cards, Blue Ocean cells

**Section 4: Social Proof & Trend Intelligence**

- **Outer:** `rounded-xl border border-white/10 bg-[var(--bg-card)] p-6`
- **Inner:** `border-l-2 border-emerald-500/50` for buzz; grid `grid-cols-2` for KR/Global; `rounded-lg border border-white/10 bg-white/[0.02]`; gap index card `p-4 rounded-lg border border-white/10 bg-white/[0.03]`; platform grid `grid-cols-4`; strategy steps with `border-l-4` + color (emerald/amber/blue/red/purple)
- **Background:** Same card + inner glassmorphism
- **Border:** `border-white/10`, `border-emerald-500/50`, colored left borders
- **Padding:** `p-6`, inner `p-4`, `p-3`
- **Typography:** `text-xs font-semibold text-white/40 uppercase tracking-wider`, `text-sm text-white/70`, `text-3xl font-black text-white`
- **Accent:** emerald, red (global bar), blue/amber/red for gap status; emerald/amber/blue/red/purple for strategy steps
- **Paywall:** BlurredValue + overlay CTA for strategy report (“Go Alpha $29/mo”); blur on SEO/viral hashtags when !canSeeAlpha
- **Special:** DonutGauge (platform), progress bars (inline style width), strategy step cards

**Section 5: Export & Logistics Intel (SourcingIntel)**

- **Outer:** `rounded-xl border border-white/10 bg-[var(--bg-card)] p-6`
- **Inner:** Subsections with `p-4 rounded-lg border border-white/10 bg-white/[0.02]` or `p-6 rounded-xl ...`; HS code block `rounded-xl`; weight cards `rounded-xl`, billable `border-2 border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]`; BrokerEmailDraft; HazmatBadges; ExpandableText
- **Background:** Same; inner `bg-white/[0.02]` or `bg-white/[0.03]`
- **Border:** `border-white/10`, `border-emerald-500/50` for billable
- **Padding:** `p-6`, inner `p-4`/`p-6`
- **Typography:** `text-xl font-bold`, `text-xs font-semibold text-white/40 uppercase tracking-wider`, `text-2xl md:text-3xl font-mono font-black text-white`
- **Accent:** emerald (export green, billable, Broker CTA), amber (yellow/risk), red (restricted)
- **Paywall:** BlurredValue for Alpha-only fields; bottom CTA strip `mt-6 p-8 rounded-xl border border-white/15 bg-gradient-to-b from-white/[0.06] to-white/[0.02]` with “Go Alpha $29/mo”
- **Special:** BlurredValue, CopyButton (HS), BrokerEmailDraft, HazmatBadges, ExpandableText

**Section 6 (Supplier) / Launch & Execution Kit (SupplierContact)**

- **Outer:** `rounded-xl border border-white/10 bg-[var(--bg-card)] p-6`
- **Inner:** Two-column `flex flex-col md:flex-row gap-6`; left “Sourcing Economics” `bg-white/5 border border-white/10 rounded-2xl p-6`; right “Manufacturer Contact” same; Scout Verified pill `rounded-full bg-emerald-500/10 border border-emerald-500/30`; execution gallery `grid` with cards `bg-white/5 border border-white/10 rounded-2xl ... hover:border-emerald-500/30`; card image area `h-36 bg-gradient-to-br from-zinc-800 to-zinc-900`
- **Background:** Card bg; inner `bg-white/5`; gallery thumb `from-zinc-800 to-zinc-900`
- **Border:** `border-white/10`, `border-emerald-500/30` on hover
- **Padding:** `p-6`
- **Typography:** `text-5xl font-mono font-bold text-emerald-400`, `text-[10px] uppercase tracking-widest text-zinc-500`, `text-2xl font-semibold text-zinc-200`, `text-sm font-semibold text-white`, `text-xs text-zinc-500`
- **Accent:** emerald (verified, cost, links); zinc for labels/secondary
- **Paywall:** Section only visible when hasSupplier; content when canSeeAlpha; otherwise LockedSection (SECTION_ALPHA_SUPPLIER_CTA)
- **Special:** ContactPill, global market proof links (emerald hover), execution asset cards

**Section 8 (Nav / CTA strip)**

- **Outer:** `rounded-xl border border-white/10 bg-[var(--bg-card)] p-6`
- **Inner:** Links `text-sm font-medium text-indigo-400 hover:text-indigo-300`; strip `rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-center`; tier CTAs `text-indigo-400` / `text-emerald-400`
- **Background:** Same card; inner strip `bg-white/5`
- **Border:** `border-white/10`
- **Special:** Prev/Next product, Back to list, pricing upsell by tier

---

### 5-2. Admin Pages

**admin/page.tsx**

- **Table row:** `hover:bg-zinc-800 cursor-pointer transition-colors border-t border-zinc-800`
- **Badge/pill:** Week pill `bg-zinc-700 text-zinc-300 text-xs px-2 py-0.5 rounded`; status text `text-xs text-emerald-400` (Live) or `text-xs text-red-400` (Draft)
- **Header:** `bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between`; title `text-white font-bold`; Logout `text-xs text-zinc-500 hover:text-white transition-colors`
- **Filter dropdowns:** `bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none`
- **Table wrapper:** `mx-6 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900`; thead `bg-zinc-800/50 text-[10px] uppercase tracking-widest text-zinc-500`

**admin/[id]/page.tsx**

- **Sticky header:** `fixed top-0 left-0 w-full z-[100] bg-zinc-900 border-b border-zinc-700 px-6 py-3 flex items-center justify-between`
- **Accordion section:** `bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden`; button `w-full flex items-center justify-between px-6 py-4 hover:bg-zinc-800 transition-colors`; content `px-6 pb-6 flex flex-col gap-5 border-t border-zinc-800`
- **Input field:** `bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none`
- **Label:** `text-[11px] font-semibold text-zinc-400 uppercase tracking-wider`
- **Save/Publish:** Save button `bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl border-2 border-indigo-400 shadow-lg hover:shadow-xl transition-all min-w-[180px]`; Confirm in modal `px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors`; Cancel `px-4 py-2 rounded-lg text-zinc-400 hover:text-white border border-zinc-600 hover:border-zinc-500 transition-colors text-sm`
- **Modal:** Overlay `fixed inset-0 z-[1000] ... bg-black/60 backdrop-blur-sm`; panel `bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh]`
- **FAB area:** `fixed bottom-8 right-8 ... z-[999]`; Back link `bg-zinc-800 text-zinc-300 border border-zinc-600 hover:bg-zinc-700 py-2.5 px-4 rounded-xl shadow-md text-sm font-semibold`; status select `bg-zinc-800 border border-zinc-600 rounded-xl ... focus:ring-2 focus:ring-indigo-500`

---

## SECTION 6: Inconsistency & Debt Report

### Inconsistency #1: Zinc vs white/opacity for “same” surfaces

- **Problem:** Member-facing product detail uses `bg-[var(--bg-card)]` and `border-white/10`; admin uses `bg-zinc-900`, `border-zinc-800`/`border-zinc-700`. Two different systems for “dark card” and “border.”
- **Evidence:** weekly/[weekId]/[id]/page.tsx sections use `bg-[var(--bg-card)]`; admin/page.tsx and admin/[id]/page.tsx use `bg-zinc-900`, `border-zinc-800`.
- **Impact:** Visual/maintenance — two palettes to maintain; theming or design tokens would need to reconcile both.
- **Suggested fix:** Pick one system (e.g. CSS vars or zinc) for “app” vs “admin” and document; or unify under a single token set.

### Inconsistency #2: Muted text — white opacity vs zinc

- **Problem:** Muted/secondary text uses `text-white/45` or `text-white/50` in app and `text-zinc-500`/`text-zinc-400` in admin and in product detail (Launch section).
- **Evidence:** app/page.tsx, weekly/[weekId]/[id]/page.tsx use `text-white/40`–`text-white/50`; admin and SupplierContact use `text-zinc-500`, `text-zinc-400`.
- **Impact:** Visual — slightly different gray tone; maintenance — no single “muted” token.
- **Suggested fix:** Standardize on one muted token (e.g. `--text-muted` or one Tailwind scale) across app and admin.

### Inconsistency #3: Card border radius (rounded-lg vs rounded-xl vs rounded-2xl)

- **Problem:** Cards and panels use `rounded-lg`, `rounded-xl`, and `rounded-2xl` without a clear hierarchy.
- **Evidence:** Product sections use `rounded-xl` for main card; inner blocks use `rounded-lg`; ContactCard and some home blocks use `rounded-2xl`; admin accordions use `rounded-2xl`; admin modal uses `rounded-2xl`.
- **Impact:** Visual — mixed roundness for similar “card” surfaces.
- **Suggested fix:** Define “section card” vs “inner card” vs “modal” and assign one radius each (e.g. section=rounded-xl, inner=rounded-lg, modal=rounded-2xl) and apply consistently.

### Inconsistency #4: Section heading size (text-lg vs text-xl)

- **Problem:** Product detail section titles alternate between `text-lg font-bold` and `text-xl font-bold` with no clear rule.
- **Evidence:** Product Identity, Trend Signal, Market Intelligence use `text-lg font-bold`; Export & Logistics and Social Proof block use `text-xl font-bold`; Launch & Execution uses `text-xl font-bold` in one place and `text-sm font-semibold` for “Creative Assets.”
- **Impact:** Visual hierarchy inconsistency.
- **Suggested fix:** Use one class for “main section title” (e.g. `text-lg font-bold` or `text-xl font-bold`) across all 6 sections.

### Inconsistency #5: Micro label font size (text-xs vs text-[11px] vs text-[10px])

- **Problem:** Small labels use `text-xs`, `text-[11px]`, and `text-[10px]` interchangeably.
- **Evidence:** app/page.tsx uses `text-[11px]`, `text-[10px]`; product detail uses `text-[11px] uppercase tracking-wider`, `text-[10px]`; admin uses `text-[11px]` for labels and `text-[10px]` for table header.
- **Impact:** Slight size/readability variance; no single “micro” token.
- **Suggested fix:** Pick one size (e.g. `text-xs` or `text-[11px]`) for all micro labels and apply globally.

### Inconsistency #6: Border for cards (border-white/10 vs border-zinc-800)

- **Problem:** Same “card” concept uses `border-white/10` in app and `border-zinc-800` in admin.
- **Evidence:** weekly/[weekId]/[id]/page.tsx: `border border-white/10`; admin: `border border-zinc-800`.
- **Impact:** Visual and token debt.
- **Suggested fix:** Unify card border under one token or scale (e.g. `--border-card`).

### Inconsistency #7: Padding on same-level cards (p-4 vs p-5 vs p-6)

- **Problem:** Inner cards or blocks use `p-3`, `p-4`, `p-5`, `p-6`, `p-8` without a clear rule.
- **Evidence:** Product detail: section outer `p-6`; inner cells `p-3` or `p-4`; LockedSection `p-8`; BrokerEmailDraft trigger `p-5`; admin accordion content `px-6 pb-6`.
- **Impact:** Spacing feels inconsistent for similar “content block” level.
- **Suggested fix:** Define “section padding,” “card padding,” “tight block padding” (e.g. p-6, p-4, p-3) and use consistently.

### Inconsistency #8: Hover states on interactive elements

- **Problem:** Some links/buttons have hover (e.g. `hover:text-white`, `hover:bg-indigo-400`); others have no hover or only partial (e.g. table row has hover, some admin buttons do not).
- **Evidence:** Nav links have `hover:text-white`; FAQ button has no explicit hover; admin table row has `hover:bg-zinc-800`; some admin secondary buttons have hover.
- **Impact:** UX — not all interactive elements feel clickable.
- **Suggested fix:** Audit all interactive elements and add consistent hover (and focus) styles.

### Inconsistency #9: transition-colors / transition-all

- **Problem:** Some buttons/links use `transition-colors`, others `transition-all`; some have no transition.
- **Evidence:** LockedSection CTA `transition-colors`; home CTAs `transition-all`; CopyButton primary `transition-colors`; admin Save `transition-all`.
- **Impact:** Minor; animation consistency.
- **Suggested fix:** Standardize on `transition-colors` for color-only changes and `transition-all` only where transform/opacity change, and apply to all interactive elements.

### Inconsistency #10: Glassmorphism (bg-white/5, bg-white/[0.02]) vs solid (bg-zinc-900)

- **Problem:** Product detail uses semi-transparent whites (`bg-white/5`, `bg-white/[0.02]`, `bg-white/[0.03]`) for inner blocks; admin uses solid `bg-zinc-900`/`bg-zinc-800`. No clear rule for when to use which.
- **Evidence:** weekly/[weekId]/[id]/page.tsx many `bg-white/[0.02]`; admin always solid zinc.
- **Impact:** Visual — two different “secondary surface” treatments; glassmorphism only in member app.
- **Suggested fix:** Document when to use “glass” vs “solid” (e.g. glass on same page as var(--bg-card), solid in admin) or unify to one approach.

### Inconsistency #11: Hardcoded hex vs Tailwind

- **Problem:** Several backgrounds use hardcoded hex (`#030303`, `#0d0d0f`, `#08080e`, `#070c18`, etc.) instead of Tailwind or CSS variables.
- **Evidence:** app/page.tsx and layout/globals use `#030303`, `#0d0d0f`; globals.css has `--background`, `--bg-card` but pages also use `bg-[#030303]`, `bg-[#0d0d0f]`.
- **Impact:** Theming and maintenance — changing “page bg” or “card bg” requires multiple edits.
- **Suggested fix:** Use `var(--background)` / `var(--bg-card)` or Tailwind theme colors everywhere; remove duplicate hex.

### Inconsistency #12: style={{}} inline styles instead of Tailwind

- **Problem:** Some dimensions and colors use inline `style` instead of Tailwind classes.
- **Evidence:** DonutGauge: `style={{ width: size, height: size }}` (acceptable for dynamic size); progress bars: `style={{ width: `${...}%` }}`; DonutGauge SVG stroke uses inline RGB for red/amber/emerald.
- **Impact:** Harder to theme; some values could be Tailwind (e.g. width/height if fixed).
- **Suggested fix:** Keep dynamic width/height where needed; move fixed colors to Tailwind or CSS variables where possible.

### Inconsistency #13: Gray vs zinc in components

- **Problem:** Most of app uses zinc (admin) or white opacity (member); one component uses `gray` (HazmatBadges: `bg-gray-500/80`, `border-gray-400/80`; GoogleSignInButton: `text-gray-800`, `hover:bg-gray-100`).
- **Evidence:** HazmatBadges.tsx, GoogleSignInButton.tsx.
- **Impact:** Palette mix (gray vs zinc) for same “neutral” intent.
- **Suggested fix:** Use zinc (or a single neutral scale) in HazmatBadges for dark context; keep Google button light-on-dark (could stay gray for contrast) but document as intentional.

### Inconsistency #14: Border radius on buttons (rounded-lg vs rounded-xl vs rounded-full)

- **Problem:** Buttons use `rounded-lg`, `rounded-xl`, and `rounded-full` without a rule.
- **Evidence:** Home CTAs `rounded-xl`; LockedSection CTA `rounded-lg`; CopyButton primary `rounded-lg`; admin Save `rounded-xl`; pricing “Apply for Alpha” `rounded-full` in one place; nav Sign Up `rounded-lg`.
- **Impact:** Inconsistent button shape.
- **Suggested fix:** Define primary vs secondary button radius (e.g. primary=rounded-xl, pill CTA=rounded-full) and apply consistently.

---

## SECTION 7: Design Tokens Summary

### Current De Facto Design Tokens

**Colors**

| Token               | Current value |
|---------------------|---------------|
| Primary background  | `#030303` / `bg-[#030303]` [DOMINANT] |
| Secondary background (card) | `#0d0d0f` / `bg-[var(--bg-card)]` [DOMINANT] |
| Border default      | `border-white/10` [DOMINANT] (app); `border-zinc-800` (admin) |
| Text primary        | `text-white` [DOMINANT] |
| Text muted          | `text-white/45` or `text-white/50` [DOMINANT] (app); `text-zinc-500` (admin) |
| Text disabled       | `text-white/30`, `text-zinc-500` (readonly inputs) |
| Accent primary      | `indigo-500` / `indigo-400` (CTAs, nav, pricing) |
| Accent secondary    | `emerald-500` / `emerald-400` (success, verified, Alpha) |
| Danger/Error        | `red-400` / `red-500`, `rose-400` / `rose-500` |
| Warning             | `amber-400` / `amber-500` |
| Success             | `emerald-400` / `emerald-500` |

**Spacing**

| Token               | Current value |
|---------------------|---------------|
| Base card padding   | `p-6` [DOMINANT] |
| Section gap         | `space-y-6` (product detail); `py-16 sm:py-24` (home sections) |
| Page horizontal pad| `px-4 sm:px-6` (home); `px-4` (product); `px-6` (admin) |

**Borders**

| Token               | Current value |
|---------------------|---------------|
| Card border         | `border border-white/10` [DOMINANT] (app); `border border-zinc-800` (admin) |
| Divider             | `border-t border-white/10`, `divide-y divide-white/10` |
| Border radius (card)| `rounded-xl` [DOMINANT] (sections); `rounded-2xl` (admin accordion, some home cards) |
| Border radius (button) | `rounded-xl` or `rounded-lg` (mixed) |
| Border radius (badge)| `rounded-full` [DOMINANT] for pills; `rounded-lg` for some badges |

**Typography**

| Token               | Current value |
|---------------------|---------------|
| Page title          | `font-[family-name:var(--font-syne)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight` (hero); `text-2xl font-bold` (inner pages) |
| Section title       | `font-[family-name:var(--font-syne)] text-lg font-bold text-white` or `text-xl font-bold text-white` (inconsistent) |
| Card title          | `font-[family-name:var(--font-syne)] text-sm font-bold text-white` |
| Body text           | `text-sm text-white/70` or `text-sm text-white/80` |
| Muted text          | `text-white/45`–`text-white/50`, `text-xs text-white/40` |
| Micro label         | `text-[11px] uppercase tracking-wider text-white/50 font-semibold` or `text-xs` (mixed) |
| Monospace data      | `font-mono text-xs`, `text-2xl md:text-3xl font-mono font-black text-white` |

**Shadows & Effects**

| Token               | Current value |
|---------------------|---------------|
| Card shadow         | None on most cards; admin modal `shadow-xl` |
| Glassmorphism      | `bg-white/5`, `bg-white/[0.02]`, `bg-white/[0.03]`; overlay `backdrop-blur-[2px]`, `backdrop-blur-xl` (nav) |
| Glow effect         | Indigo: `shadow-[0_0_24px_rgba(99,102,241,.35)]`; amber: `shadow-[0_0_60px_rgba(245,158,11,.18)]`; Scout Verified: `shadow-[0_0_20px_rgba(16,185,129,0.15)]` |
| Blur/Paywall overlay | `blur-sm select-none pointer-events-none` (BlurredValue); modal `bg-black/60 backdrop-blur-sm`; LockedSection `backdrop-blur-[2px]` |

---

*End of design audit. No code was modified.*
