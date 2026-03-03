---
````
# ⚠️ AI GOVERNANCE — 2대 절대 법도
## 이 블록은 모든 작업 지시보다 우선한다.

---

### 🛡️ LAW 1: The Git Checkpoint (세이브포인트 강제 확인)

**발동 조건 (아래 중 하나라도 해당되면 즉시 발동):**
- 2개 이상의 파일을 동시에 수정하는 작업
- layout.tsx, globals.css, middleware.ts 등 전역 파일 수정
- DB 쿼리, Supabase Auth, API Route 로직 변경
- 컴포넌트 삭제 또는 폴더 구조 변경

**발동 시 행동:**
코드 작성을 즉시 중단하고 아래 메시지를 출력한 뒤 사용자 응답을 기다린다:

> "⚠️ 대규모 작업이 감지되었습니다.
> 진행 전에 터미널에서 아래 명령어로 현재 상태를 저장해주세요:
> `git add . && git commit -m 'checkpoint: before [작업명]'`
> 완료 후 '확인'이라고 입력하시면 작업을 시작합니다."

사용자가 '확인' 또는 이에 준하는 응답을 보내기 전까지 코드를 작성하지 않는다.

---

### ✋ LAW 2: The Push-back (작업 분할 역제안)

**발동 조건 (아래 중 하나라도 해당되면 즉시 발동):**
- 단일 프롬프트에서 3개 이상 페이지/컴포넌트의 로직을 동시에 변경 요청
- 기존 Auth, 결제, 권한 로직과 UI 변경이 동일 작업에 혼재
- 요청 범위가 불명확하여 의도치 않은 파일이 수정될 가능성이 있음

**발동 시 행동:**
무조건 실행하지 않는다. 아래 형식으로 역제안하고 사용자 응답을 기다린다:

> "✋ 작업 범위가 커서 기존 로직이 파괴될 위험이 감지되었습니다.
> 안전한 진행을 위해 아래와 같이 분할을 제안합니다:
>
> - Phase 1: [첫 번째 작업 범위]
> - Phase 2: [두 번째 작업 범위]
> - Phase 3: [필요시 추가]
>
> 이 순서로 진행할까요? 아니면 다른 분할 방법을 원하시면 말씀해주세요."

사용자 승인 없이 임의로 실행하지 않는다.

---

## 면제 조건
아래 작업은 Law 1, 2 발동 없이 즉시 실행한다:
- CSS 클래스만 변경하는 디자인 작업 (로직 변경 없음)
- 단일 파일 내 텍스트/카피 수정
- 새 파일 생성 (기존 파일 미수정)
- 린트 에러 수정
````

---

# PROJECT_DESIGN_SYSTEM.md
````markdown
# K-Product Scout — Design System v1.0
## Brand: K-SCOUT | Tagline: K-Product Scout

> "Simple is Best. Every pixel earns its place."
> This document is the single source of truth for all UI/UX decisions.
> Claude(둘째), Gemini(첫째), Cursor(셋째) — all must read this before touching any file.

---

## 0. Philosophy & Principles

### 0-1. Core Philosophy
K-SCOUT is a premium B2B intelligence platform for global e-commerce sellers.
The design must communicate: **Trust. Clarity. Action.**
A seller should feel: *"This is worth $29/mo"* within 3 seconds of landing.

### 0-2. The 3 Laws of K-SCOUT Design
1. **Clarity over decoration** — If a UI element doesn't help the user make a sourcing decision, remove it.
2. **Data is the hero** — Typography and layout exist to serve the data, not compete with it.
3. **Simple is Best** — When in doubt, use less. White space is premium.

### 0-3. The Absolute Prohibition List
The following are BANNED across all pages, no exceptions:

| Banned | Reason | Replacement |
|--------|--------|-------------|
| Decorative emoji (🐶💎🔥) | Kills premium feel | Lucide React icons |
| `text-[10px]`, `text-[11px]` | Illegible for B2B readers | `text-xs` (12px) minimum |
| Dark backgrounds (`bg-zinc-900`, `bg-zinc-950`) | Mismatched brand tone | Cream base system |
| `tailwind.config.ts` custom tokens | Tailwind v4 incompatible | `@theme inline` in globals.css |
| Raw JSON in admin inputs | Human error risk | Structured helper UI |
| `gray-*` or `slate-*` color scales | Creates inconsistency | `stone-*` or custom tokens only |

---

## 1. Tailwind v4 Configuration (ABSOLUTE LAW)

### ⚠️ CRITICAL: We use Tailwind v4
There is NO `tailwind.config.ts` file. All custom tokens are declared in `app/globals.css` inside the `@theme inline` block using CSS custom properties.

**Cursor must NEVER create or modify a `tailwind.config.ts` file.**

### 1-1. globals.css — The Single Source of All Tokens
```css
@import "tailwindcss";

@theme inline {
  /* ── BRAND COLORS ── */
  --color-cream-50:  #FDFCFA;
  --color-cream-100: #F8F7F4;
  --color-cream-200: #F2F1EE;
  --color-cream-300: #E8E6E1;
  --color-cream-400: #D4D1CA;

  --color-ink-900:   #1A1916;
  --color-ink-700:   #3D3B36;
  --color-ink-500:   #6B6860;
  --color-ink-300:   #9E9C98;
  --color-ink-200:   #C4C2BE;
  --color-ink-100:   #E4E2DE;

  --color-accent:         #16A34A;
  --color-accent-hover:   #15803D;
  --color-accent-light:   #DCFCE7;
  --color-accent-muted:   #BBF7D0;

  --color-danger:         #DC2626;
  --color-danger-light:   #FEE2E2;
  --color-warning:        #D97706;
  --color-warning-light:  #FEF3C7;
  --color-info:           #2563EB;
  --color-info-light:     #DBEAFE;

  /* ── SEMANTIC ALIASES ── */
  --color-bg-page:        var(--color-cream-100);
  --color-bg-card:        #FFFFFF;
  --color-bg-subcard:     var(--color-cream-200);
  --color-border:         var(--color-cream-300);
  --color-border-strong:  var(--color-cream-400);
  --color-text-primary:   var(--color-ink-900);
  --color-text-secondary: var(--color-ink-500);
  --color-text-tertiary:  var(--color-ink-300);

  /* ── TYPOGRAPHY ── */
  --font-sans:  'Inter', system-ui, -apple-system, sans-serif;
  --font-mono:  'JetBrains Mono', 'Fira Code', monospace;

  /* ── RADIUS ── */
  --radius-sm:  0.375rem;  /* 6px  — badges, pills */
  --radius-md:  0.5rem;    /* 8px  — inputs, buttons */
  --radius-lg:  0.75rem;   /* 12px — small cards */
  --radius-xl:  1rem;      /* 16px — cards */
  --radius-2xl: 1.5rem;    /* 24px — section wrappers */

  /* ── SHADOWS ── */
  --shadow-card:    0 1px 3px 0 rgb(26 25 22 / 0.06), 0 1px 2px -1px rgb(26 25 22 / 0.04);
  --shadow-elevated: 0 4px 6px -1px rgb(26 25 22 / 0.08), 0 2px 4px -2px rgb(26 25 22 / 0.05);
  --shadow-modal:   0 20px 25px -5px rgb(26 25 22 / 0.1);
}

@layer base {
  body {
    background-color: var(--color-bg-page);
    color: var(--color-text-primary);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }

  * {
    border-color: var(--color-border);
  }
}
```

---

## 2. Typography Scale

### 2-1. The Scale (MINIMUM: text-xs / 12px)

| Token | Class | Size | Weight | Color | Usage |
|-------|-------|------|--------|-------|-------|
| Display | `text-3xl font-bold` | 30px | 700 | `text-ink-900` | Product name hero |
| H1 | `text-2xl font-semibold` | 24px | 600 | `text-ink-900` | Page title |
| H2 | `text-xl font-semibold` | 20px | 600 | `text-ink-900` | Section title |
| H3 | `text-lg font-medium` | 18px | 500 | `text-ink-900` | Card title |
| Body-L | `text-base` | 16px | 400 | `text-ink-900` | Primary body |
| Body | `text-sm` | 14px | 400 | `text-ink-500` | Secondary body |
| Label | `text-xs font-medium` | 12px | 500 | `text-ink-300` | Field labels ← MINIMUM |
| Mono-L | `font-mono text-2xl font-bold` | 24px | 700 | `text-accent` | Price data |
| Mono | `font-mono text-sm` | 14px | 400 | `text-ink-700` | HS codes, IDs |

### 2-2. Typography Rules
- **NEVER use** `text-[10px]` or `text-[11px]` — use `text-xs` (12px) at minimum
- Price/cost data: always `font-mono` + `text-accent` color
- UPPERCASE labels: `text-xs font-semibold tracking-widest text-ink-300`
- Long-form report text (summaries, evidence): `text-sm leading-relaxed text-ink-700`

---

## 3. Layout & Spacing System

### 3-1. Page Layout Architecture
````
┌─────────────────────────────────────────────────────┐
│  HEADER (sticky, h-14, bg-white, border-b)          │
│  [K-SCOUT logo] [K-Product Scout]    [Upgrade CTA]  │
└─────────────────────────────────────────────────────┘
┌──────────┬──────────────────────────────────────────┐
│ LEFT NAV │  MAIN CONTENT                            │
│ w-56     │  max-w-5xl mx-auto px-6 py-8             │
│ fixed    │                                          │
│ (client) │  [Section content here]                  │
└──────────┴──────────────────────────────────────────┘
````

### 3-2. ⚠️ CRITICAL ARCHITECTURE RULE — Left Nav Must Be Client Component

The product detail page (`app/weekly/[weekId]/[id]/page.tsx`) is an **async Server Component** and must remain so for SEO.

**The Left Nav uses `IntersectionObserver` (browser API) and therefore MUST be a separate Client Component.**
````
✅ CORRECT STRUCTURE:
app/weekly/[weekId]/[id]/page.tsx    ← Server Component (async, no 'use client')
  └── <ClientLeftNav sections={...} />  ← 'use client', IntersectionObserver here
  └── <Section1 /> <Section2 /> ...    ← Server-rendered content

❌ WRONG:
Adding 'use client' to page.tsx — breaks SSR and SEO
Adding IntersectionObserver directly in page.tsx — crashes server render
````

**File to create:** `components/layout/ClientLeftNav.tsx` with `'use client'` at top.

### 3-3. Container Standards

| Context | Classes |
|---------|---------|
| Page wrapper | `max-w-5xl mx-auto px-6` |
| Section outer | `bg-white rounded-xl border border-cream-300 shadow-card` |
| Section inner | `p-6` (desktop) / `p-4` (mobile) |
| Card grid (2-col) | `grid grid-cols-1 md:grid-cols-2 gap-6` |
| Card grid (3-col) | `grid grid-cols-1 md:grid-cols-3 gap-4` |
| Section gap | `flex flex-col gap-6` |

### 3-4. Spacing Rules
- Between major sections: `gap-6` (24px)
- Inside card: `p-6` padding
- Between card elements: `gap-4` (16px)
- Between label and value: `gap-1.5` (6px)
- Page top padding: `pt-8`

---

## 4. Component Library

### 4-1. Button
````
Primary:   bg-accent text-white font-semibold rounded-md px-4 py-2 
           hover:bg-accent-hover transition-colors text-sm
Secondary: bg-cream-200 text-ink-700 font-medium rounded-md px-4 py-2 
           hover:bg-cream-300 transition-colors text-sm border border-cream-300
Ghost:     text-ink-500 font-medium px-4 py-2 rounded-md 
           hover:bg-cream-200 transition-colors text-sm
Danger:    bg-danger text-white font-semibold rounded-md px-4 py-2 
           hover:bg-red-700 transition-colors text-sm
````

### 4-2. Card
````
Default:   bg-white rounded-xl border border-cream-300 shadow-card p-6
Elevated:  bg-white rounded-xl border border-cream-300 shadow-elevated p-6
Subcard:   bg-cream-100 rounded-lg border border-cream-300 p-4
Accent:    bg-white rounded-xl border-l-4 border-l-accent border border-cream-300 p-6
````

### 4-3. Badge
````
Default:   bg-cream-200 text-ink-500 text-xs font-medium px-2.5 py-1 rounded-full
Success:   bg-accent-light text-accent text-xs font-medium px-2.5 py-1 rounded-full
Warning:   bg-warning-light text-warning text-xs font-medium px-2.5 py-1 rounded-full
Danger:    bg-danger-light text-danger text-xs font-medium px-2.5 py-1 rounded-full
Info:      bg-info-light text-info text-xs font-medium px-2.5 py-1 rounded-full
Tier-Free:     bg-cream-200 text-ink-500 ...
Tier-Standard: bg-info-light text-info ...
Tier-Alpha:    bg-accent-light text-accent ...
````

### 4-4. Input / Textarea
````
Base:     bg-white border border-cream-300 rounded-md px-3 py-2 text-sm text-ink-900
          focus:border-accent focus:ring-1 focus:ring-accent outline-none
          placeholder:text-ink-200 transition-colors w-full
Error:    border-danger focus:border-danger focus:ring-danger
Disabled: bg-cream-100 text-ink-300 cursor-not-allowed
````

### 4-5. Pill (Contact / Tag)
````
Contact:  inline-flex items-center gap-2 bg-cream-100 border border-cream-300 
          rounded-full px-4 py-2 text-sm text-ink-700 
          hover:border-accent hover:text-accent transition-colors w-full
Tag:      inline-flex items-center gap-1.5 bg-cream-100 border border-cream-300 
          rounded-full px-3 py-1 text-xs text-ink-500
````

### 4-6. Paywall Overlay
````
Blur wrapper:  relative overflow-hidden
Blur target:   blur-sm select-none pointer-events-none
Overlay:       absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent
               flex flex-col items-center justify-end pb-6 gap-3
Lock icon:     <Lock className="w-5 h-5 text-ink-300" />
CTA text:      text-sm font-semibold text-ink-700
CTA button:    Primary button style (see 4-1)
````

---

## 5. Iconography Rules

### 5-1. ABSOLUTE LAW: No Decorative Emoji
All icons must use `lucide-react`. Import individually to minimize bundle size.
```tsx
// ✅ CORRECT
import { TrendingUp, Package, Mail } from 'lucide-react'
<TrendingUp className="w-4 h-4 text-ink-500" />

// ❌ WRONG
<span>🔥</span>
<span>📦</span>
```

### 5-2. Icon Size Standards

| Context | Class |
|---------|-------|
| Inline with text | `w-4 h-4` |
| Card header | `w-5 h-5` |
| Section header | `w-5 h-5` |
| Empty state | `w-10 h-10` |
| Button icon | `w-4 h-4` |

### 5-3. Emoji Exception List
The following emoji MAY remain ONLY in Section 6 Creative Asset Gallery cards where they serve as category-feel thumbnails. All others are banned.

- Section 6 gallery card thumbnails only: contextual judgment by CEO

### 5-4. Emoji → Lucide Mapping

| Old Emoji | Lucide Replacement |
|-----------|-------------------|
| 🔥 Trending | `<TrendingUp />` |
| 📦 Product/Export | `<Package />` |
| 📋 Certifications | `<FileCheck />` |
| 📧 Email | `<Mail />` |
| 📞 Phone | `<Phone />` |
| 🌐 Website | `<Globe />` |
| 🛒 Wholesale | `<ShoppingBag />` |
| ⚠️ Warning | `<AlertTriangle />` |
| ✅ Verified | `<BadgeCheck />` |
| 🔒 Locked | `<Lock />` |
| 💰 Pricing | `<DollarSign />` |
| 🏭 Manufacturer | `<Factory />` |
| 📊 Chart/Score | `<BarChart2 />` |
| 🎯 Target | `<Target />` |
| 🚀 Launch | `<Rocket />` |

---

## 6. Data Rendering Standards

### 6-1. ⚠️ Keyword Fields — 5-Box Input Rule (Admin)

Fields: `seo_keywords`, `rising_keywords`, `viral_hashtags`

**In Admin (`/admin/[id]`):** Each field renders as **5 independent text inputs**, never a single comma-separated string input.
````
SEO Keywords:
[__keyword 1__]  [__keyword 2__]  [__keyword 3__]  [__keyword 4__]  [__keyword 5__]
````

Storage: saved to DB as comma-separated string `"keyword1,keyword2,keyword3"`
Parsing: split by comma on read, join by comma on write.

### 6-2. Keyword Pill Rendering (Product Detail Page)

**In product detail page:** Keywords render as styled Pills, never plain text.
```tsx
// Standard Keyword Pill
<span className="inline-flex items-center bg-cream-200 border border-cream-300 
  rounded-full px-3 py-1 text-xs font-medium text-ink-700">
  {keyword}
</span>

// Trending/Rising Pill (with icon)
<span className="inline-flex items-center gap-1.5 bg-accent-light border 
  border-accent-muted rounded-full px-3 py-1 text-xs font-medium text-accent">
  <TrendingUp className="w-3 h-3" />
  {keyword}
</span>
```

---

## 7. Section-by-Section UI Rules

### Section 1 — Product Identity
- Layout: 2-col (image left 40%, details right 60%)
- Image: `aspect-[3/4] object-contain bg-cream-100 rounded-xl`
- Product name: Display token (text-3xl font-bold)
- Price block: `font-mono` + `text-accent` for all monetary values
- Export status: Badge component (color-coded by status)

### Section 2 — Trend Signal Dashboard
- Layout: 3-col card grid
- Score card: DonutGauge component, large number center
- Trust badge: Subcard style, full-width below grid

### Section 3 — Market Intelligence
- Layout: 2-col (Market data left, Seller Intel right)
- Global prices: Card grid, Blue Ocean as info badge

### Section 4 — Social Proof & Trend Intel
- Layout: 3-col (Platform scores), full-width blocks below
- Keywords: Pill rendering (see 6-2)
- Paywall: Standard overlay on seo_keywords + viral_hashtags

### Section 5 — Export & Logistics Intel
- Layout: 2-col (HS Code + Weight left, Hazmat + Compliance right)
- HS Code: `font-mono text-3xl` large display
- Hazmat: Color-coded badge system (blue/gray/orange/red)

### Section 6 — Launch & Execution Kit
- Layout: 2-col Block 1 (Economics + Contact), full-width Block 2 (Gallery)
- Price: `font-mono text-5xl text-accent`
- Gallery: 4-col Netflix-style grid

---

## 8. ⚠️ PAYWALL PRESERVATION — ABSOLUTE RULE

### This is the most critical rule in this document.

**During ANY UI refactor (Phase 3–5), the following must be preserved with 100% fidelity:**

1. `canSeeAlpha` — the Alpha tier permission check variable
2. `canSeeStandard` — the Standard tier permission check
3. All `blur-sm` classes on paywalled content
4. All `<Lock />` overlay components
5. The tier-gating conditional logic (`{canSeeAlpha && (...)}`)

**Cursor instruction for every Phase 3–5 prompt:**
> "Before changing any UI in this section, identify all paywall conditionals (`canSeeAlpha`, `canSeeStandard`, blur overlays). List them. Preserve every single one exactly. If any paywall logic is removed or broken, the entire task has failed regardless of visual output."

---

## 9. Phase-by-Phase Execution Plan

### Phase 0 — Constitution (Current Phase)
**Files:** `app/globals.css` only
**Task:** Add `@theme inline` block with all color and font tokens
**Risk:** Low — no component changes
**Cursor reads:** This document in full before starting

### Phase 1 — Component Foundation
**Files:** `components/ui/` (new folder)
**Task:** Create Button, Card, Badge, Input, Pill, PaywallOverlay components
**Rule:** Do NOT modify any existing files. New files only.
**Risk:** Zero — purely additive

### Phase 2 — Layout Skeleton
**Files:** `app/layout.tsx`, new `components/layout/ClientLeftNav.tsx`
**Task:** Add Header + ClientLeftNav. Change body background to cream.
**⚠️ Rule:** `ClientLeftNav` must be `'use client'`. Page.tsx stays server component.
**Risk:** Medium — touches global layout

### Phase 3 — Section 1 & 2 Rebuild
**Files:** `app/weekly/[weekId]/[id]/page.tsx` (top sections only)
**Task:** Apply new component classes to Section 1 and 2
**⚠️ Paywall check:** Section 1 has tier-gating on price display — preserve exactly
**CEO sign-off required before Phase 4**

### Phase 4 — Section 3 & 4 Rebuild
**Files:** Same page, mid sections
**Task:** Apply 2-col and 3-col grids. Replace emoji with Lucide. Apply Pill rendering.
**⚠️ Paywall check:** Section 4 has blur on seo_keywords + sourcing_tip — preserve exactly

### Phase 5 — Section 5 & 6 Rebuild
**Files:** Same page, bottom sections
**Task:** Export Logistics redesign. Execution Gallery styling.
**⚠️ HIGHEST RISK PHASE — Section 5 & 6 have the most paywall logic**
**Cursor must list ALL canSeeAlpha checks before making any change**

### Phase 6 — Admin Polish
**Files:** `app/admin/page.tsx`, `app/admin/[id]/page.tsx`
**Task:** Apply cream background, fix font sizes, replace emoji
**Risk:** Low — admin is internal only, no paywall logic

---

## 10. Changelog

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-03-01 | Initial constitution. Cream base, Left Nav, Lucide icons, Tailwind v4 tokens. |

---

*This document is law. No deviation without CEO + CTO approval and a new changelog entry.*
````