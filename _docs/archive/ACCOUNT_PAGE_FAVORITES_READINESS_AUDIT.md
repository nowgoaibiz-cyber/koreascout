# [COMPREHENSIVE AUDIT] /account PAGE & FAVORITES READINESS — Current State Report

**Scope:** `app/account/page.tsx` and all related profile/billing components.  
**Purpose:** Factual baseline before transforming into "Premium Sourcing Vault" with "My Picks" (Favorite Products).  
**Date:** 2025-03-06. **No code was changed.**

---

## 1. AUTH & USER IDENTITY (The Foundation)

| Question | Finding |
|----------|---------|
| **How is the page fetching user data (Email, Tier, Subscription Start Date)?** | **Email only.** The account page uses `createClient()` (server) and `supabase.auth.getUser()`. It reads **only** `user` from Auth (and displays `user.email`). It does **not** call `getAuthTier()` and does **not** query the `profiles` table. Therefore **Tier** and **Subscription Start Date** are not fetched or displayed on `/account`. |
| **Reliance on `getAuthTier()` or additional `profiles` queries?** | **Neither.** The account page does not use `getAuthTier()`. It does not perform any `profiles` query. Other pages (e.g. `/weekly`, `/weekly/[weekId]`, `/weekly/[weekId]/[id]`) use `getAuthTier()`, which itself queries `profiles` for `tier` and `subscription_start_at` by `auth.users.id`. |
| **Unauthenticated user accessing `/account`?** | **Redirect to `/login`.** The page checks `if (!user) redirect("/login");` immediately after `getUser()`. No account content is rendered for unauthenticated users. |

**Schema note (identity):** `lib/auth-server.ts` selects `subscription_start_at` from `profiles`. The Phase 2 migration `001_phase2_schema.sql` defines `profiles` with `tier_updated_at` only; there is **no** `subscription_start_at` column in the migration files. The LemonSqueezy webhook updates only `tier`, `ls_subscription_id`, and `tier_updated_at`. So either the column exists only in the live DB (added manually) or `subscriptionStartAt` is effectively always `null` where `getAuthTier()` is used.

---

## 2. BILLING & SUBSCRIPTION (LemonSqueezy)

| Question | Finding |
|----------|---------|
| **UI or logic for the user to manage their subscription?** | **No.** There is no subscription management UI or logic on the account page. No upgrade/downgrade, no plan display, no renewal date. |
| **Customer Portal link for LemonSqueezy?** | **No.** There is no Customer Portal URL generated or linked anywhere. The codebase uses fixed LemonSqueezy **checkout** URLs on `/` and `/pricing` for Standard and Alpha; there is no reference to a LemonSqueezy customer portal or billing portal endpoint. |
| **Where billing is referenced on `/account`** | A single **placeholder** message: *"Subscription management and LemonSqueezy customer portal will be available after Phase 4."* inside a light gray info box. |

Backend: LemonSqueezy webhook at `app/api/webhooks/lemonsqueezy/route.ts` handles `subscription_created`, `subscription_updated`, `subscription_cancelled`, `subscription_expired` and updates `profiles` (tier, `ls_subscription_id`, `tier_updated_at`). No customer-facing billing UI or portal link is built.

---

## 3. UI/UX CURRENT STATE

| Aspect | Finding |
|--------|---------|
| **Layout** | Single column: title "My Account", one white card with "Signed in as" + email, an info box (placeholder text), a Logout button, and a "← Back to home" link. No sections, no tabs, no sidebar. |
| **Background / container** | `min-h-screen bg-[#F8F7F4]`, `max-w-3xl mx-auto`, `pt-20`, `px-6 sm:px-8 py-16`. Card: `bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]`. |
| **Typography / palette** | Muted neutrals: `#1A1916` (headings/text), `#6B6860`, `#9E9C98` (labels), `#E8E6E1` (borders). Single green usage: the "Back to home" link (`text-[#16A34A]`). |
| **Match to "Elite Intelligence Agency" dark/green branding?** | **No.** `/pricing` and `/weekly` use a dark hero (`bg-[#1A1916]`), bold green accents (`#16A34A`), uppercase tracking, and a high-end tone. The account page is a light, minimal form-style page (cream background, white card, no dark sections, no green hero or tier badges). It does not match the established premium dark/green branding. |

---

## 4. "MY PICKS" (FAVORITES) INFRASTRUCTURE — CRITICAL

### 4.1 DB Schema

| Check | Result |
|-------|--------|
| **Tables in `types/database.ts`** | `profiles`, `weeks`, `scout_final_reports` only. |
| **Tables in migrations** | `001_phase2_schema.sql`: `profiles`, `weeks`, `scout_final_reports`. `002_product_identity_pricing.sql`: only alters `scout_final_reports`. |
| **Table named `user_favorites`, `saved_products`, or similar linking `user_id` to `scout_final_reports(id)`?** | **No.** No such table exists in the codebase or migrations. |

**Conclusion (DB):** There is no favorites table. No schema exists that links a user to `scout_final_reports(id)` for "My Picks."

### 4.2 API Routes & Server Actions

| Check | Result |
|-------|--------|
| **API routes under `app/api/`** | `webhooks/lemonsqueezy`, `admin/auth`, `admin/logout`, `admin/reports`, `admin/reports/[id]`. No account-specific or favorites-related routes. |
| **Server Actions ("use server")** | Grep for `"use server"` / server actions: **no matches**. No Server Actions defined for toggling favorites. |

**Conclusion (API/actions):** No API route or Server Action exists to add/remove a favorite product.

### 4.3 Explicit Statement

**No favorites infrastructure exists.** There is no table for user–report favorites, no API or Server Action to toggle favorites, and no UI for "My Picks" on `/account` or elsewhere.

---

## 5. MISSING FEATURES & BLIND SPOTS

| Item | Status |
|------|--------|
| **Placeholder / "Coming Soon" sections** | Yes. One explicit placeholder: the info box stating *"Subscription management and LemonSqueezy customer portal will be available after Phase 4."* No other "Coming Soon" text on the page. |
| **Logout button** | **Implemented and functioning.** The page uses `<LogoutButton className="…" />` from `@/components/LogoutButton`. The component is client-side: on click it calls `supabase.auth.signOut()`, then `router.push("/")` and `router.refresh()`. Styled with red border/text (`border-[#FECACA]`, `text-[#DC2626]`, `hover:bg-[#FEE2E2]`). |
| **Related profile/billing components** | No dedicated account subcomponents. `LogoutButton` is the only shared component used on the account page. No separate "ProfileCard," "BillingCard," or "SubscriptionPanel" components. |
| **Navigation / entry to `/account`** | Not audited in this pass; at least one entry point (e.g. header/footer link) can be assumed or verified separately. |

---

## Summary Table

| Pillar | One-line summary |
|--------|------------------|
| **1. Auth & Identity** | Email from Auth only; no `getAuthTier()`, no `profiles` query; unauthenticated → redirect to `/login`. |
| **2. Billing** | No subscription UI, no Customer Portal link; placeholder text only; webhook updates backend only. |
| **3. UI/UX** | Light, minimal single-card layout; does not match dark/green "Elite Intelligence Agency" branding of `/pricing` and `/weekly`. |
| **4. My Picks** | **No favorites infrastructure:** no DB table, no API/Server Action, no UI. |
| **5. Gaps** | One "Phase 4" placeholder; Logout present and working; no other account-specific components. |

---

*End of Current State Report. No code was modified.*
