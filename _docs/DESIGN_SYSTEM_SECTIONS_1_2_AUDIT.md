# Design System Forensic Audit — Sections 1 & 2

**Source:** `app/weekly/[weekId]/[id]/page.tsx`  
**Scope:** Section 1 (Product Identity), Section 2 (Trend Signal Dashboard)  
**Purpose:** Extract exact UI patterns so Section 3 can match them. No code changes.

---

## 1. Section 1 — Product Identity

**Location:** `ProductIdentity` component, lines ~194–284.  
**Section wrapper:** `<section id="section-1">` at line 200.

### 1.1 Card / Section Container (main wrapper)

| Property   | Value |
|-----------|--------|
| **Classes** | `scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]` |
| **Background** | `bg-white` |
| **Border** | `border border-[#E8E6E1]` (1px, hex `#E8E6E1`) |
| **Radius** | `rounded-2xl` |
| **Padding** | `p-6` (24px) |
| **Shadow** | `shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]` (soft dark tint) |
| **Scroll margin** | `scroll-mt-[160px]` |

### 1.2 Typography

| Element | Classes | Notes |
|--------|---------|--------|
| **Section title (h2)** | `text-3xl font-bold text-[#1A1916] mb-4 tracking-tight` | “Product Identity” |
| **Product name (h3)** | `text-2xl font-bold text-[#1A1916] leading-tight` | Primary title |
| **Product name subtitle** | `text-lg text-[#6B6860] leading-relaxed mt-1` | Original name |
| **Field labels** | `text-sm font-semibold text-[#9E9C98]` | e.g. “Category:”, “Export Status:” |
| **Badge text** | `text-lg font-bold text-[#1A1916]` | Category / Export badges |
| **Price (primary)** | `text-2xl font-mono font-bold text-[#1A1916]` | KR price |
| **Price (secondary)** | `text-2xl font-mono font-bold text-[#6B6860]` | USD in parens |
| **Est. wholesale label** | `text-base font-bold text-[#9E9C98] uppercase tracking-wide` | “Est. Wholesale” |
| **Est. wholesale value** | `text-2xl font-mono font-extrabold text-[#16A34A]` | Green emphasis |
| **Callout title** | `text-sm font-semibold text-[#16A34A] uppercase tracking-widest mb-2` | “Why It’s Trending” |
| **Callout body** | `text-base text-[#3D3B36] leading-relaxed` | Body copy |
| **Helper / lock line** | `text-base text-[#6B6860] leading-relaxed` | Alpha CTA line |

### 1.3 Spacing

| Context | Classes |
|---------|---------|
| Section internal | `p-6` on section |
| Below section title | `mb-4` on h2 |
| Between main blocks | `gap-6` (flex/grid), `gap-2` (smaller stacks) |
| After product name | `mt-1` on subtitle |
| After labels block | `mt-4` |
| Price block | `mt-3` |
| “Why It’s Trending” | `mt-5`; inner `mb-2` under title |

### 1.4 Nested Cards / Callouts

| Block | Classes |
|-------|--------|
| **Image container** | `rounded-xl bg-[#F8F7F4]` (no border in snippet) |
| **“Why It’s Trending” callout** | `bg-[#F8F7F4] rounded-xl border-l-4 border-l-[#16A34A] border border-[#E8E6E1] p-6` |

### 1.5 Colors (Section 1)

| Role | Value | Usage |
|------|--------|--------|
| **Primary text** | `#1A1916` | Titles, primary copy |
| **Secondary text** | `#6B6860` | Subtitle, captions, helper |
| **Muted / labels** | `#9E9C98` | Field labels, “Est. Wholesale” |
| **Body in callout** | `#3D3B36` | Callout body |
| **Emphasis / success** | `#16A34A` | Green: “Why It’s Trending”, est. wholesale, link |
| **Link hover** | `#15803D` | Green link hover |
| **Warning / amber** | `#D97706` | AlertTriangle icon |
| **Border** | `#E8E6E1` | Section and callout border |
| **Background (soft)** | `#F8F7F4` | Image area, callout background |

---

## 2. Section 2 — Trend Signal Dashboard

**Location:** `TrendSignalDashboard` component, lines ~299–435.  
**Section wrapper:** `<section id="section-2">` at line 316.

### 2.1 Card / Section Container (main wrapper)

| Property | Value |
|----------|--------|
| **Classes** | `scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]` |
| **Background** | `bg-white` |
| **Border** | `border border-[#E8E6E1]` |
| **Radius** | `rounded-2xl` |
| **Padding** | `p-6` |
| **Shadow** | `shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]` |
| **Scroll margin** | `scroll-mt-[160px]` |

*Identical to Section 1.*

### 2.2 Typography

| Element | Classes | Notes |
|--------|---------|--------|
| **Section title (h2)** | `text-3xl font-bold text-[#1A1916] mb-0 tracking-tight` | “Trend Signal Dashboard” (no bottom margin; next block has mt-4) |
| **Authority blurb** | `text-base italic text-[#6B6860]` | Blurb body |
| **Blurb emphasis** | `font-semibold not-italic text-[#1A1916]` | “500+ Korean products”, “It’s worth your attention.” |
| **Tier 1 card title** | `text-xl font-bold text-[#1A1916] text-center h-8 flex items-center justify-center mt-0` | “Market Score”, “Competition Level”, “Opportunity Status” |
| **Tier 1 value (big)** | `text-3xl font-extrabold text-center mt-1 mb-4` | Competition / Opportunity text (+ conditional color) |
| **Tier 1 caption** | `text-sm text-[#6B6860] text-center leading-relaxed` | Under gauge/value |
| **Subsection title (h3)** | `text-xl font-bold text-[#1A1916] mb-4` | “Platform Breakdown” |
| **Platform label** | `text-base font-bold text-[#6B6860] mb-3 uppercase tracking-widest shrink-0` | TikTok, Instagram, etc. |
| **Growth title** | `text-xl font-bold text-[#1A1916] inline-flex items-center gap-2` | “Growth Momentum” + icon |
| **Growth value (hero)** | `text-4xl font-black text-[#16A34A] leading-tight` | Growth signal number |
| **Growth body** | `text-xl leading-relaxed text-[#3D3B36]` | Evidence / content volume |
| **Empty state** | `text-base text-[#9E9C98]` | “No data” / “No growth data” |

### 2.3 Spacing

| Context | Classes |
|---------|---------|
| Section | `p-6` |
| Below h2 | `mb-0` on h2; authority blurb has `mt-4 mb-8` |
| Tier 1 grid | `grid grid-cols-1 md:grid-cols-3 gap-6` |
| Tier 1 card | `p-6 flex flex-col items-center gap-3` |
| Tier 2 block | `mt-8 bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 pl-6 md:pl-10` |
| Tier 3 block | `mt-8 bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 pl-6 md:pl-10` |
| Platform grid | `grid grid-cols-2 sm:grid-cols-4 gap-6 items-start` |
| Growth 2-col | `grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8` |
| Growth right column | `border-l-2 border-[#16A34A] pl-0 md:pl-6`, `space-y-2` |

### 2.4 Inner Cards / Blocks

| Block | Classes |
|-------|--------|
| **Authority blurb** | `bg-[#F8F7F4]/50 text-base italic text-[#6B6860] py-3 px-4 border-l-2 border-[#16A34A] mb-8 mt-4` |
| **Tier 1 card** | `bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 flex flex-col items-center gap-3` |
| **Tier 2 container** | `mt-8 bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 pl-6 md:pl-10` |
| **Tier 3 container** | Same as Tier 2 |

### 2.5 Colors (Section 2)

| Role | Value | Usage |
|------|--------|--------|
| **Primary text** | `#1A1916` | Titles, blurb emphasis |
| **Secondary / caption** | `#6B6860` | Blurb, card captions, platform labels |
| **Muted / empty** | `#9E9C98` | “No data”, “No platform data”, “No growth data” |
| **Body** | `#3D3B36` | Growth evidence, new content volume |
| **Success / positive** | `#16A34A` | Authority border, Competition “Low”, Opportunity “Blue Ocean”/“Emerging”, Growth value & icon |
| **Danger** | `#DC2626` | Competition “High” |
| **Warning / amber** | `#D97706` | Competition “Medium”, Opportunity “Saturated” |
| **Neutral value** | `#6B6860` | Fallback for competition/opportunity |
| **Border** | `#E8E6E1` | Section and cards |
| **Background (soft)** | `#F8F7F4` (and `#F8F7F4/50` for blurb) | Cards, blurb |

---

## 3. Shared Design System Summary (Sections 1 & 2)

Use these when aligning Section 3 with Sections 1 and 2.

### 3.1 Section container (both sections)

```txt
scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]
```

### 3.2 Section title (h2)

- **Section 1:** `text-3xl font-bold text-[#1A1916] mb-4 tracking-tight`
- **Section 2:** `text-3xl font-bold text-[#1A1916] mb-0 tracking-tight` (then next block uses `mt-4`)

### 3.3 Color palette

| Token | Hex | Tailwind (if any) | Use |
|-------|-----|--------------------|-----|
| Primary | `#1A1916` | — | Headings, primary text |
| Secondary | `#6B6860` | — | Captions, labels, secondary text |
| Muted | `#9E9C98` | — | Labels, placeholders, empty state |
| Body | `#3D3B36` | — | Body copy in callouts |
| Success / green | `#16A34A` | green-600 | Emphasis, links, positive, left accent |
| Green hover | `#15803D` | green-700 | Link hover |
| Danger | `#DC2626` | red-600 | Negative / high competition |
| Warning | `#D97706` | amber-600 | Medium / saturated |
| Border | `#E8E6E1` | — | Section and card borders |
| Background soft | `#F8F7F4` | — | Cards, callouts, image area |

### 3.4 Inner card pattern (Section 2 Tier 1–3)

- **Background:** `bg-[#F8F7F4]`
- **Border:** `border border-[#E8E6E1]`
- **Radius:** `rounded-xl`
- **Padding:** `p-6`, with optional `pl-6 md:pl-10` for “left wall” blocks
- **Vertical separation:** `mt-8` between major blocks

### 3.5 Accent strip (left border)

- **Green accent:** `border-l-2 border-[#16A34A]` (blurb) or `border-l-4 border-l-[#16A34A]` (Section 1 callout)

---

*End of audit. No code was modified.*
