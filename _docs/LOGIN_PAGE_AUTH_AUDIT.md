# [SYSTEM AUDIT] Login Page & Auth Flow

**Audit date:** 2025-03-06  
**Scope:** `http://localhost:3000/login` and related auth flow

---

## 1. File location

| Item | Path |
|------|------|
| **Login page** | `app/login/page.tsx` |
| **Auth callback (OAuth)** | `app/auth/callback/route.ts` |
| **Supabase client** | `lib/supabase/client.ts` (browser) |
| **Supabase server** | `lib/supabase/server.ts` (used in callback) |

---

## 2. Component structure

- **Framework:** Next.js App Router; login page is a Client Component (`"use client"`).
- **UI:** Custom markup only — **no Shadcn UI** on the login page (plain `<input>`, `<button>`, `<form>`, Tailwind classes).
- **External component:** `GoogleSignInButton` from `@/components/GoogleSignInButton` (Google SVG icon is inline in that file, not Lucide).
- **Icons:** No Lucide icons on the login page.
- **Layout:** Centered card on `min-h-screen`, background `#F8F7F4`, card with border `#E8E6E1`, green primary `#16A34A`.

---

## 3. Auth logic

### Email/password (login page)

- **Where:** `app/login/page.tsx` → `handleSubmit`.
- **How:** **Client-side only.**  
  `createClient()` from `@/lib/supabase/client` → `supabase.auth.signInWithPassword({ email, password })`.  
  No Server Actions; no server-side login handler.

### OAuth (Google)

- **Where:** `GoogleSignInButton` (`components/GoogleSignInButton.tsx`).
- **How:** **Client-side.**  
  `supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } })`.  
  `redirectTo` = `window.location.origin + "/auth/callback"` (no `?next=` on login page).
- **Callback:** `app/auth/callback/route.ts` (Route Handler GET):
  - Reads `code` and `next` from URL.
  - `supabase.auth.exchangeCodeForSession(code)` (server Supabase client).
  - Success → redirect to `next` or `"/"`.
  - No code / error → redirect to `origin + "/login?error=auth"`.

**Summary:** All sign-in is client-side Supabase Auth; callback is the only server-side auth step (code exchange). **No Server Actions** for login.

---

## 4. Branding elements

- **Current login branding:** In `app/login/page.tsx` (lines 40–51), text only:
  - Link to `/`: **"KoreaScout"** (bold, `text-2xl`, `#1A1916`).
  - Span: **"Intelligence"** (lighter, `text-sm`, `#9E9C98`).
  - No image, no shared Logo component here.
- **Global logo usage:** `components/layout/Header.tsx` uses:
  - `<Image src="/images/KoreaScout_LOGO_V3.png" alt="KoreaScout Logo" />` (fixed width 320, height 80).
- **Logo component:** There is **no** reusable `Logo` component in the repo. Header uses `Image` + path directly. Login page does **not** use the same asset; it only shows "KoreaScout" + "Intelligence" as text.  
  **Recommendation for redesign:** Extract a small `Logo` component (e.g. from Header) and reuse on login so branding matches.

---

## 5. Redirection logic

| Scenario | Destination |
|----------|-------------|
| **Email/password success** | `router.push("/")` then `router.refresh()` → **Home (`/`)**. |
| **OAuth success** | Callback redirects to `next` query param; login page does not set `next`, so callback uses default `"/"` → **Home (`/`)**. |
| **OAuth/callback failure** | Callback redirects to **`/login?error=auth`**; login page reads `error=auth` and shows: *"Authentication failed. Please try again."* |
| **Other pages (e.g. weekly, account)** | If not authenticated → `redirect("/login")`. |

**Summary:** Successful login (email or Google) always sends the user to **`/`**. There is no "redirect back to original URL" or configurable post-login target on the login page itself; the callback supports `?next=` but the login page does not pass it.

---

## 6. Concise summary for CEO / redesign prompt

- **Login route:** `app/login/page.tsx` (client component).
- **UI:** Custom form + Tailwind; no Shadcn; one shared piece: `GoogleSignInButton`.
- **Auth:** Supabase only — email/password and Google OAuth both run in the browser; OAuth finishes in `app/auth/callback/route.ts`.
- **Branding:** "KoreaScout" + "Intelligence" as text on login; main site uses `/images/KoreaScout_LOGO_V3.png` in the header; no shared Logo component yet.
- **After login:** User is always sent to **`/`** (home). Callback supports `?next=` but login page doesn’t use it.

Use this document to align the redesign prompt (copy, layout, logo usage, and post-login redirect behavior).
