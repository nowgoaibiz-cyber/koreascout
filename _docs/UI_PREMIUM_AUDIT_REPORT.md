# UI Final Polish & Global Design Audit Report

**Date:** 2025-03-06  
**Scope:** All public-facing routes under `/app` (Admin excluded)  
**Reference identity:** KoreaScout Premium — Dark hero (`#1A1916` / `#0A0908`), Green `#16A34A`, `rounded-2xl` cards, high-end typography.

---

## 1. Login page final touch ✅

- **Location:** `app/login/page.tsx` — "← Back to home" link at bottom.
- **Change applied:** Font size increased from `text-xs` (12px) to `text-sm` (14px) for better readability.

---

## 2. Comprehensive UI audit (public routes only)

### Routes scanned (Admin excluded)

| Route | File | Status |
|-------|------|--------|
| `/` | `app/page.tsx` | ✅ Premium (dark hero, green, CTA) |
| `/login` | `app/login/page.tsx` | ✅ Premium (redesigned) |
| `/signup` | `app/signup/page.tsx` | ⚠️ **Needs Premium Touch** |
| `/pricing` | `app/pricing/page.tsx` | ✅ Premium (dark hero, 3-tier cards) |
| `/account` | `app/account/page.tsx` | ✅ Premium (dark hero, vault) |
| `/weekly` | `app/weekly/page.tsx` | ✅ Premium (dark hero, rounded-2xl) |
| `/weekly/[weekId]` | `app/weekly/[weekId]/page.tsx` | ✅ On-brand (inherits system) |
| `/weekly/[weekId]/[id]` | `app/weekly/[weekId]/[id]/page.tsx` | ✅ Report detail (on-brand) |
| `/sample-report` | `app/sample-report/page.tsx` | ⚠️ **Needs Premium Touch** |

### Special files (App Router conventions)

| File | Exists? | Status |
|------|---------|--------|
| `app/error.tsx` | **No** | ⚠️ **Missing** — Errors use Next.js default (unbranded). |
| `app/not-found.tsx` | **No** | ⚠️ **Missing** — 404 uses Next.js default (unbranded). |
| `app/loading.tsx` | **No** | ⚠️ **Missing** — No global loading UI (blank/default during nav). |

---

## 3. Per-page audit notes

### `/signup` — **Needs Premium Touch**

- **Current:** Light background `#F8F7F4`, text-only "KoreaScout" (no Logo), light card with `border-[#E8E6E1]`, old input/button styles.
- **Gap vs login:** No dark hero, no `<Logo />`, no radial gradient, no upgraded inputs (`rounded-xl`, `focus:ring-2 focus:ring-[#16A34A]/20`), no black primary CTA.
- **Recommendation:** Align with login redesign: same dark container, gradient blur, white card, `<Logo />`, upgraded form styles, `?next=` support for redirect after signup.

### `/pricing` — **High-conversion & premium**

- Dark hero, green accent, 3-tier cards with `rounded-2xl`, Alpha highlight with green border. No change required for "Premium Touch" list; optional micro-copy or CTA polish only.

### `/sample-report` — **Needs Premium Touch**

- **Current:** Minimal placeholder: `min-h-screen bg-[#1A1916]` + single line "Sample Report — Coming Soon".
- **Gap:** No KoreaScout branding (Logo, tagline), no card, no clear CTA (e.g. back to home / pricing). Feels like a stub.
- **Recommendation:** Add Logo, short copy, and primary/secondary CTAs (e.g. "Go to Pricing", "Back to Home") in a simple card or centered block.

### `error.tsx` / `not-found.tsx` — **Branded 404 & Error**

- **Current:** Not present; Next.js uses built-in default pages (generic, unbranded).
- **Recommendation:** Add `app/not-found.tsx` and `app/error.tsx` with KoreaScout Premium Identity: dark background, Logo or wordmark, green accent, `rounded-2xl` card for message and "Back to home" / "Try again" CTAs.

### `loading.tsx` — **Premium loading experience**

- **Current:** No `app/loading.tsx`; route transitions show blank or default behavior.
- **Recommendation:** Add `app/loading.tsx` with a minimal premium skeleton or branded spinner (e.g. centered Logo + subtle pulse or bar) so transitions feel intentional, not blank.

---

## 4. Pages that still need a "Premium Touch" (summary)

Before moving to the Landing Page (root `/`) redesign, the following are recommended for a Premium Touch:

| Priority | Page / File | Action |
|----------|-------------|--------|
| **High** | `/signup` (`app/signup/page.tsx`) | Align with login: dark hero, Logo, white card, upgraded inputs/CTA, `?next=` support. |
| **High** | `app/not-found.tsx` | Create branded 404 (dark bg, Logo/green, card, "Back to home"). |
| **High** | `app/error.tsx` | Create branded error boundary (dark bg, message, "Try again" / "Back to home"). |
| **Medium** | `/sample-report` (`app/sample-report/page.tsx`) | Replace stub with minimal premium placeholder: Logo, copy, CTAs. |
| **Medium** | `app/loading.tsx` | Add global loading UI (e.g. Logo + skeleton or spinner). |

**Already premium (no action required for this pass):** `/`, `/login`, `/pricing`, `/account`, `/weekly`, `/weekly/[weekId]`, `/weekly/[weekId]/[id]`.

---

## 5. Next step

Proceed to **Landing Page (Root `/`) redesign** once the above Premium Touch items are scheduled or completed. The current `/` page already uses a dark hero and green accents; the redesign can focus on conversion and content hierarchy without foundational style changes.
