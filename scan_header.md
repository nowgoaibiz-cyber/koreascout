# HeaderNavClient.tsx — SCAN REPORT

**Source:** `components/layout/HeaderNavClient.tsx`  
**Mode:** Read-only scan (no source files modified)

---

## 1. Full file content

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { LogoutButton } from "@/components/LogoutButton";
import { PRICING } from "@/src/config/pricing";

const NAV_TRANSITION =
  "color 0.4s cubic-bezier(0.4,0,0.2,1), background-color 0.4s cubic-bezier(0.4,0,0.2,1), border-color 0.4s cubic-bezier(0.4,0,0.2,1)";

function getGhostClass(isTransparent: boolean) {
  return `rounded-md border border-solid border-transparent px-3.5 py-2 text-sm font-semibold tracking-tight sm:text-base ${
    isTransparent
      ? "text-white hover:bg-white/10 hover:text-white"
      : "text-[#0A0908] hover:bg-[#F2F1EE] hover:text-[#0A0908]"
  }`;
}

function getPrimaryClass(isTransparent: boolean) {
  return `rounded-md border border-solid px-5 py-2 text-sm font-semibold tracking-tight sm:text-base ${
    isTransparent
      ? "border-white/20 bg-transparent text-white hover:bg-white/10"
      : "border-[#0A0908]/20 bg-[#16A34A] text-white hover:bg-[#15803D]"
  }`;
}

const MOBILE_DRAWER_LINK =
  "block py-4 px-6 text-base font-bold text-[#1A1916] border-b border-[#E8E6E1]";

function MobileMenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#1A1916]"
        aria-hidden
      >
        <path
          d="M6 6L18 18M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#1A1916]"
      aria-hidden
    >
      <path
        d="M4 7H20M4 12H20M4 17H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HeaderNavClient({
  user,
  tier,
  isTransparent,
}: {
  user: User | null;
  tier: string;
  isTransparent: boolean;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ghostClass = getGhostClass(isTransparent);
  const primaryClass = getPrimaryClass(isTransparent);

  const transitionStyle = { transition: NAV_TRANSITION };

  if (!user) {
    return (
      <div className="relative">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 md:hidden"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <MobileMenuIcon open={mobileMenuOpen} />
          </button>
          <div className="hidden items-center gap-2 md:flex md:gap-3">
            <Link href="/login" className={ghostClass} style={transitionStyle} title="Sign in to view weekly reports">
              Weekly Report
            </Link>
            <Link href="/pricing" className={ghostClass} style={transitionStyle}>
              Pricing
            </Link>
          </div>
          <Link href="/login" className={primaryClass} style={transitionStyle}>
            Login
          </Link>
        </div>
        {mobileMenuOpen && (
          <div className="fixed left-0 right-0 top-[80px] z-40 w-full bg-[#F8F7F4] md:hidden">
            <Link
              href="/login"
              className={MOBILE_DRAWER_LINK}
              onClick={() => setMobileMenuOpen(false)}
            >
              Weekly Report
            </Link>
            <Link
              href="/pricing"
              className={MOBILE_DRAWER_LINK}
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="inline-flex items-center justify-center p-2 md:hidden"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <MobileMenuIcon open={mobileMenuOpen} />
        </button>
        <div className="hidden items-center gap-2 md:flex md:gap-3">
          <Link href="/weekly" className={ghostClass} style={transitionStyle}>
            Weekly Report
          </Link>
          {tier === "free" && (
            <Link href="/pricing" className={ghostClass} style={transitionStyle}>
              Pricing
            </Link>
          )}
          {tier === "standard" && (
            <Link href="/pricing" className={ghostClass} style={transitionStyle}>
              Upgrade
            </Link>
          )}
          <Link href="/account" className={ghostClass} style={transitionStyle}>
            Account
          </Link>
        </div>
        <LogoutButton className={primaryClass} style={transitionStyle} />
      </div>
      {mobileMenuOpen && (
        <div className="fixed left-0 right-0 top-[80px] z-40 w-full bg-[#F8F7F4] md:hidden">
          <Link
            href="/weekly"
            className={MOBILE_DRAWER_LINK}
            onClick={() => setMobileMenuOpen(false)}
          >
            Weekly Report
          </Link>
          {tier === "free" && (
            <Link
              href="/pricing"
              className={MOBILE_DRAWER_LINK}
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
          )}
          {tier === "standard" && (
            <Link
              href="/pricing"
              className={MOBILE_DRAWER_LINK}
              onClick={() => setMobileMenuOpen(false)}
            >
              Upgrade
            </Link>
          )}
          <Link
            href="/account"
            className={MOBILE_DRAWER_LINK}
            onClick={() => setMobileMenuOpen(false)}
          >
            Account
          </Link>
        </div>
      )}
    </div>
  );
}
```

---

## 2. Current mobile logic (below `md` breakpoint)

Tailwind `md` = typically 768px. **Below `md`:**

| Element | Behavior |
|--------|----------|
| **Hamburger** | `className` includes `md:hidden` → button is **visible only below md** (hidden at md+). |
| **Inline nav row (Weekly Report, Pricing, …)** | Wrapper uses `hidden … md:flex` → **hidden below md**, shown as flex from md upward. |
| **Login (`!user`)** | **No** `md:hidden` — **Login stays in the top row on all widths**, next to the hamburger on small screens. |
| **Logout (`user`)** | `LogoutButton` uses `primaryClass` only — **same row on all widths**, next to hamburger when narrow. |
| **Drawer panel** | Rendered when `mobileMenuOpen` is true; container has `md:hidden` so the **fixed panel only appears below md** (at md+ the drawer DOM is not shown even if state were open). |

**Logged-out (`!user`), below md:** Hamburger + **Login** in the header row; opening the menu shows the fixed drawer under the header (`top-[80px]`) with links: Weekly Report → `/login`, Pricing → `/pricing`.

**Logged-in, below md:** Hamburger + **Logout** in the row; drawer lists Weekly Report, tier-based Pricing or Upgrade, and Account (same routes as desktop).

**Note:** `PRICING` is imported but **not used** in this file.

---

## 3. Login button — exact `className` and JSX

Only when **`!user`**. `className` is the variable **`primaryClass`** (from `getPrimaryClass(isTransparent)`).

```tsx
<Link href="/login" className={primaryClass} style={transitionStyle}>
  Login
</Link>
```

**`primaryClass` expands to** (via `getPrimaryClass(isTransparent)`):

- If `isTransparent`:  
  `rounded-md border border-solid px-5 py-2 text-sm font-semibold tracking-tight sm:text-base border-white/20 bg-transparent text-white hover:bg-white/10`
- Else:  
  `rounded-md border border-solid px-5 py-2 text-sm font-semibold tracking-tight sm:text-base border-[#0A0908]/20 bg-[#16A34A] text-white hover:bg-[#15803D]`

There is **no** separate string literal on the Login `Link` beyond `className={primaryClass}`.

---

## 4. Hamburger button — exact `className` and JSX

Two copies (logged-out and logged-in branches); **identical** button:

```tsx
<button
  type="button"
  className="inline-flex items-center justify-center p-2 md:hidden"
  onClick={() => setMobileMenuOpen((o) => !o)}
  aria-expanded={mobileMenuOpen}
  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
>
  <MobileMenuIcon open={mobileMenuOpen} />
</button>
```

---

## 5. Drawer — exact `className` and JSX

Outer **drawer container** (both branches when `mobileMenuOpen`):

**className (string, identical both times):**

`fixed left-0 right-0 top-[80px] z-40 w-full bg-[#F8F7F4] md:hidden`

**Logged-out drawer block:**

```tsx
{mobileMenuOpen && (
  <div className="fixed left-0 right-0 top-[80px] z-40 w-full bg-[#F8F7F4] md:hidden">
    <Link href="/login" className={MOBILE_DRAWER_LINK} onClick={() => setMobileMenuOpen(false)}>
      Weekly Report
    </Link>
    <Link href="/pricing" className={MOBILE_DRAWER_LINK} onClick={() => setMobileMenuOpen(false)}>
      Pricing
    </Link>
  </div>
)}
```

**Logged-in drawer block:**

```tsx
{mobileMenuOpen && (
  <div className="fixed left-0 right-0 top-[80px] z-40 w-full bg-[#F8F7F4] md:hidden">
    {/* Link children: weekly, optional pricing/upgrade, account — each MOBILE_DRAWER_LINK */}
  </div>
)}
```

**Drawer link style constant:**

`MOBILE_DRAWER_LINK` =  
`"block py-4 px-6 text-base font-bold text-[#1A1916] border-b border-[#E8E6E1]"`

---

## 6. All `useState` hooks

| Hook | Line | Initial value |
|------|------|----------------|
| `mobileMenuOpen` / `setMobileMenuOpen` | ~81 | `useState(false)` |

**Total:** **1** `useState` call:  
`const [mobileMenuOpen, setMobileMenuOpen] = useState(false);`
