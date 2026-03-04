# KoreaScout Design Constitution v2.0
# Last Updated: Phase 16-A (Post Report Pixel Polish)
# Authority: CEO + CTO Gemini + Claude CTO
# Status: RATIFIED — Zero Tolerance Enforcement

---

## ARTICLE 1: THE BRAND DNA (UNIVERSAL — ALL PAGES)

These rules apply to EVERY page without exception.
Violation = immediate revert.

### 1-1. Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Signature Black | `#1A1916` | Primary text, headings, high-contrast elements |
| Signature Green | `#16A34A` | Accent, CTA, success states, brand identity |
| Green Hover | `#15803D` | Hover state for green elements |
| Premium Cream | `#F8F7F4` | Section backgrounds, card fills, footer |
| Border Default | `#E8E6E1` | All borders, dividers |
| Border Light | `#D5D3CE` | Subtle separators |
| Text Secondary | `#6B6860` | Supporting text, subtitles |
| Text Muted | `#9E9C98` | Labels, metadata, disclaimers |
| Text Ghost | `#3D3B36` | Body copy in content blocks |

**FORBIDDEN:**
- `emerald-*` / `green-*` / `gray-*` Tailwind semantic colors
- Any hex not in the above table
- `text-white` on non-dark backgrounds
- `bg-black` for footer or section backgrounds

### 1-2. Shadow System (Single Luxury Shadow Only)
```css
/* Standard card shadow */
shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]

/* Elevated hover shadow */
shadow-[0_4px_20px_0_rgb(22_163_74/0.1)]

/* Premium hover (dark) */
shadow-[0_2px_8px_0_rgb(26_25_22/0.08)]
```

**FORBIDDEN:** Multiple layered shadows, `drop-shadow`, heavy box-shadows.

### 1-3. Border Radius

| Context | Class |
|---------|-------|
| Section containers | `rounded-2xl` |
| Cards | `rounded-xl` or `rounded-2xl` |
| Badges/Pills | `rounded-md` or `rounded-full` |
| Buttons | `rounded-xl` or `rounded-md` |

### 1-4. Footer Rule (Cream Shutter — Universal)
```tsx
// ALL footers across ALL pages
className="bg-[#F8F7F4] border-t border-[#E8E6E1]"

// Footer text hierarchy
Primary text:  text-[#1A1916]
Secondary text: text-[#6B6860]
CTA links:     text-[#1A1916] hover:text-[#16A34A] transition-colors
Brand logo:    text-[#1A1916] font-bold
Dividers:      border-[#E8E6E1]

// FORBIDDEN: bg-black / bg-gray-900 / text-white in footer
```

---

## ARTICLE 2: TYPOGRAPHY SYSTEM

### 2-1. Label / Badge DNA (Wide Tracking — Universal)

All metadata labels, sub-labels, category badges, and section headers
MUST follow this rule regardless of page type:
```tsx
// Constitution Sub-Label (standard)
"text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3"

// Micro Sub-Label (tighter contexts)
"text-[10px] font-bold text-[#9E9C98] uppercase tracking-[0.3em] mb-2"

// Badge (Category / Status)
"text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-md border"

// HazmatBadge / Product Type Tag
"text-[13px] font-black uppercase tracking-[0.25em] text-[#1A1916]"
```

**FORBIDDEN:** `tracking-tight` on labels. Labels must breathe.

### 2-2. Vertical Spacing (Breathing Room)
```tsx
// Pricing / data blocks
space-y-3 or gap-3

// Strategy / content blocks
space-y-16 (Bloomberg style)

// Section internal padding
p-8 (standard) / p-10 (premium)

// Section gaps
mb-6 (standard) / mb-8 (generous) / mb-10 (breathing)
```

### 2-3. Fluid Typography (Titles — Container-Aware)
```tsx
// Report page product title (fluid, container-based)
style={{
  fontSize: "clamp(1.5rem, 4cqw, 2.25rem)",
  textWrap: "balance",
}}
// Requires @container on parent div

// Text wrapping (never truncate titles)
className="break-words leading-tight"
// Use line-clamp-2 for Korean subtitles
```

---

## ARTICLE 3: DUAL-HERO PRICING STANDARD

Applies wherever KRW/USD pricing is displayed.

### 3-1. Format Rules
```tsx
// Format (NO tildes, NO parentheses)
KRW {price.toLocaleString()} | USD {calculatedPrice}

// Divider
<span className="font-light text-[#D5D3CE] mx-4 leading-none">|</span>

// Disclaimer (mandatory below every price)
"Ex. Rate: {rate} KRW/USD (Daily fixed at {date} 09:00 KST)"
className="text-[10px] text-[#9E9C98] font-semibold mt-2"
```

### 3-2. Exchange Rate Engine
```tsx
// Always fetch live rate with safe fallback
const FALLBACK_RATE = 1430
// API: https://api.frankfurter.app/latest?from=USD&to=KRW
// Timeout: 4000ms AbortController
// On fail: silently use FALLBACK_RATE
```

### 3-3. Pricing Hierarchy (Report Pages)
```
TIER 1 (Hero):     Retail Price KRW | USD  →  text-2xl md:text-3xl font-black
TIER 2 (Demoted):  Est. Wholesale           →  text-sm font-medium text-[#9E9C98]
TIER 3 (CTA):      Alpha verified quotes    →  pill button → #section-6
```

**FORBIDDEN:** Making estimated wholesale massive or green. It destroys trust.

---

## ARTICLE 4: SCALE DIFFERENTIATION (CRITICAL)

### 4-1. REPORT / DASHBOARD PAGES (Data Mode)

**Philosophy:** Bloomberg Terminal. Every pixel serves information.
```
Font range:    text-xs → text-base (data labels to body)
Hero numbers:  text-4xl → text-[80px] (financial figures only)
Max-width:     max-w-[480px] for titles (editorial balance)
Layout:        High density, precise grid, editorial columns
Padding:       p-6 → p-10 (generous but not wasteful)
```

**Examples from codebase:**
- Section 6 Block A: `$2.80` at `fontSize: "80px"` (financial hero)
- Section 1 title: `clamp(1.5rem, 4cqw, 2.25rem)` (fluid, restrained)
- Labels: `text-xs` with `tracking-[0.2em]` (precise, authoritative)

### 4-2. HOME / PRICING / MARKETING PAGES (Impact Mode)

**Philosophy:** Apple product page × Nike campaign. Conversion first.
```
Hero headline:   text-5xl → text-7xl font-black
Sub-headline:    text-xl → text-3xl font-medium
CTA buttons:     Large, full-width options, bold
Padding:         Generous whitespace (py-24 → py-32 sections)
Layout:          Single focal point per section, cinematic
Animation:       Subtle entrance animations permitted
```

**SAME DNA, BIGGER SCALE:**
- Colors: identical (#1A1916, #16A34A, #F8F7F4)
- Tracking: identical (wide tracking on labels)
- Shadows: identical system
- Footer: identical cream shutter

**FORBIDDEN on marketing pages:**
- Dense data tables
- Small `text-xs` body copy
- Report-style grid layouts
- Making it look like a dashboard

### 4-3. Decision Matrix
```
Page Type         | Font Scale | Density | Primary Goal
------------------|------------|---------|------------------
Weekly Report     | xs→base    | High    | Information clarity
Product Dashboard | xs→[80px]  | High    | Data authority
Home Page         | xl→7xl     | Low     | First impression
Pricing Page      | lg→5xl     | Medium  | Conversion
Landing Sections  | 2xl→6xl    | Low     | Emotional impact
```

---

## Enforcement

- **Zero tolerance:** Any PR that violates Article 1–4 must be reverted before merge.
- **New components:** Use this document as the single source of truth for colors, shadows, typography, and footer.
- **Updates:** Constitution changes require CEO + CTO approval. Archive previous version in `_docs/archive/` before overwriting.

---

*Last updated: Phase 16-A. Do not ship UI that contradicts this Constitution.*
