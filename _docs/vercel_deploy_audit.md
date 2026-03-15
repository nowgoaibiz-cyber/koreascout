# Vercel Deploy Audit Report

**Date:** 2025-03-16  
**Context:** Deployment failed at TypeScript checking stage after successful compile.  
**Warning:** "middleware" file convention is deprecated → use "proxy" instead.

---

## TASK 1: TypeScript Error Audit

**Command run:** `npx tsc --noEmit 2>&1`  
**Result:** Exit code 1 (failure). One error reported.

| File path | Line number | Error message | Severity |
|-----------|-------------|---------------|----------|
| `components/report/SourcingIntel.tsx` | 181 | Property 'label' is missing in type `{ text: string; }` but required in type `{ text: string; label: string; }`. | **Blocking deploy** |

### Error detail

- **Location:** `SourcingIntel.tsx` line 181, inside the "Hazmat Summary" block.
- **Cause:** `ExpandableText` is invoked with only `text={report.hazmat_summary}`. The component is defined in `@/components/ExpandableText.tsx` as `ExpandableText({ text, label }: { text: string; label: string })`, so `label` is required.
- **Comparison:** Elsewhere in the same file (e.g. lines 169, 175), `ExpandableText` is correctly called with both `text` and `label` (e.g. `label="Ingredients"`, `label="Specifications"`). Line 181 is missing the `label` prop.
- **Severity:** **Blocking deploy** — `tsc --noEmit` fails, so Vercel TypeScript check will fail until this is fixed.

---

## TASK 2: Middleware → Proxy Migration Impact Analysis

### 2.1 Full contents of middleware files

#### Root: `middleware.ts`

```ts
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/admin")) {
    const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
    const cookie = request.cookies.get(cookieName);
    const isLoginPage = pathname === "/admin/login";
    if (isLoginPage) return await updateSession(request);
    if (cookie?.value === "authenticated") return await updateSession(request);
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

#### Supabase helper: `lib/supabase/middleware.ts`

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if expired; tokens are written via setAll to the response.
  await supabase.auth.getUser();

  return supabaseResponse;
}
```

### 2.2 What the middleware does

| Concern | Handled in middleware? | Where / how |
|--------|------------------------|-------------|
| **Supabase Auth session** | Yes | Every matched request runs `updateSession(request)` in `lib/supabase/middleware.ts`: creates Supabase server client with request cookies, calls `supabase.auth.getUser()` to refresh session, writes cookies back via `setAll` on the response. |
| **Admin route protection** | Yes | In root `middleware.ts`: if `pathname.startsWith("/admin")`, checks cookie `ADMIN_COOKIE_NAME` (default `kps_admin_session`). If path is `/admin/login` or cookie value is `"authenticated"`, continues with `updateSession`; otherwise redirects to `/admin/login`. |
| **LemonSqueezy webhook routing** | No | Webhook is implemented in `app/api/webhooks/lemonsqueezy/route.ts`. Middleware does not route or inspect webhook path; it only runs the same matcher, so `/api/webhooks/lemonsqueezy` requests get `updateSession` then pass through to the route handler. No webhook-specific logic in middleware. |
| **Other security logic** | No | No other path-specific logic (e.g. no CSRF, no rate limiting, no extra headers) in these files. |

### 2.3 Routes/paths currently handled by middleware

- **Matcher:** All request paths **except**:
  - `_next/static`
  - `_next/image`
  - `favicon.ico`
  - Any path ending in `.svg`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`

So middleware runs for (among others):

- All page routes (e.g. `/`, `/admin`, `/admin/login`, `/auth/callback`, app routes).
- All API routes, including:
  - `/api/admin/auth`, `/api/admin/logout`, `/api/admin/reports`, `/api/admin/reports/[id]`
  - `/api/webhooks/lemonsqueezy`
- Any other non-static path.

**Path-specific behavior:**

- **`/admin` (and subpaths except login):** Cookie check; if not `"authenticated"` → redirect to `/admin/login`.
- **`/admin/login`:** No redirect; only `updateSession`.
- **All other matched paths:** Only `updateSession` (Supabase session refresh).

### 2.4 Risk level of migration (middleware → proxy)

**Assessment: HIGH**

**Reasons:**

1. **Auth correctness:** Session refresh and cookie handling must behave the same (same cookies read/written, same order). Any change in how the “proxy” runs (e.g. when it runs, how it sees the request/response) could break Supabase SSR auth or leave stale sessions.
2. **Admin protection:** Redirect to `/admin/login` depends on reading the admin cookie and returning a redirect response. If the proxy convention changes semantics of redirects or cookie visibility, admin pages could be exposed or incorrectly locked.
3. **Uncertainty:** Without official “proxy” docs and a clear migration path for Next.js middleware, replacing the current middleware with a new convention is risky until behavior is documented and tested.
4. **Global scope:** The matcher is broad; almost every non-static request goes through this logic. A mistake affects the whole app.

### 2.5 Safe migration plan (without touching auth or payment logic)

- **Do not** change auth (Supabase `updateSession`) or payment (LemonSqueezy webhook) implementation in this step.
- **Document** current behavior (this audit) and keep it as the contract for any future “proxy” implementation.
- **When migrating:**
  1. Rely on official Next.js/Vercel docs for the new “proxy” file convention and placement.
  2. Replicate behavior in order: (a) run Supabase session refresh (same cookie read/write as `lib/supabase/middleware.ts`), (b) for paths under `/admin`, apply the same cookie check and redirect to `/admin/login` when not authenticated.
  3. Keep the same matcher (or its equivalent in the new system) so the same set of requests is processed.
  4. Do not add or change logic for `/api/webhooks/lemonsqueezy`; it should continue to receive the request after session refresh only.
  5. Test in staging: (i) Supabase login/session refresh and cookie behavior, (ii) admin access with/without cookie, (iii) webhook still receiving and processing events, (iv) no regression on static assets.
- **Rollback:** Keep the current `middleware.ts` and `lib/supabase/middleware.ts` until the proxy version is verified; then remove the old middleware in a separate change.

---

## TASK 3: Report saved

**File:** `_docs/vercel_deploy_audit.md`  
**Status:** Saved.

---

## Summary

- **Deploy blocker:** One TypeScript error in `components/report/SourcingIntel.tsx` at line 181 (missing `label` on `ExpandableText`). Fix required for Vercel TypeScript check to pass.
- **Middleware:** Handles Supabase session refresh for all matched requests and admin cookie-based protection for `/admin`. Does not implement LemonSqueezy webhook routing; webhook is in API route only.
- **Migration risk:** HIGH; migration to “proxy” must preserve session and admin behavior and be tested before switching.
