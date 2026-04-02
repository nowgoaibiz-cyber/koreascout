# Header / Logo scan (read-only)

Generated from repo state. No source files were modified.

---

## 1. Logo import in `HeaderShellClient.tsx`

**Exact import line:**

```tsx
import { Logo } from "@/components/Logo";
```

**Path (resolved):** `@/components/Logo` → `components/Logo.tsx` (Next/TS alias).

---

## 2. `grep`-style: `Logo` in `components/layout/*.tsx`

```
components\layout\HeaderNavClient.tsx
  6:import { LogoutButton } from "@/components/LogoutButton";
  149:          <LogoutButton className={primaryClass} style={transitionStyle} />
  214:            <LogoutButton

components\layout\HeaderShellClient.tsx
  7:import { Logo } from "@/components/Logo";
  82:          <Logo
```

(`HeaderNavClient.tsx` matches are for `LogoutButton`, not `Logo`.)

---

## 3. `HeaderNavClient.tsx` — drawer JSX (full)

### Logged-out branch — drawer container (full JSX block)

```tsx
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-[#F8F7F4] md:hidden flex flex-col"
            style={{
              animation: "slideDown 0.25s cubic-bezier(0.4,0,0.2,1) forwards",
            }}
          >
            <style>{`
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-16px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>

            {/* Header row */}
            <div className="flex items-center justify-between px-6 h-[80px] border-b border-[#E8E6E1] shrink-0">
              <span className="font-black text-[#0A0908] text-xl tracking-tight">KoreaScout</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#1A1916]"
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Links */}
            <div className="flex flex-col px-6 pt-8 gap-0">
              <Link href="/login" className="block py-5 text-2xl font-black text-[#1A1916] border-b border-[#E8E6E1] tracking-tight" onClick={() => setMobileMenuOpen(false)}>Weekly Report</Link>
              <Link href="/pricing" className="block py-5 text-2xl font-black text-[#1A1916] border-b border-[#E8E6E1] tracking-tight" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link href="/login" className="block py-5 text-2xl font-black text-[#16A34A] border-b border-[#E8E6E1] tracking-tight" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            </div>
          </div>
        )}
```

### Logged-in branch — drawer container (full JSX block)

```tsx
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#F8F7F4] md:hidden flex flex-col"
          style={{
            animation: "slideDown 0.25s cubic-bezier(0.4,0,0.2,1) forwards",
          }}
        >
          <style>{`
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-16px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>

          {/* Header row */}
          <div className="flex items-center justify-between px-6 h-[80px] border-b border-[#E8E6E1] shrink-0">
            <span className="font-black text-[#0A0908] text-xl tracking-tight">KoreaScout</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#1A1916]"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col px-6 pt-8 gap-0">
            <Link
              href="/weekly"
              className="block py-5 text-2xl font-black text-[#1A1916] border-b border-[#E8E6E1] tracking-tight"
              onClick={() => setMobileMenuOpen(false)}
            >
              Weekly Report
            </Link>
            {tier === "free" && (
              <Link
                href="/pricing"
                className="block py-5 text-2xl font-black text-[#1A1916] border-b border-[#E8E6E1] tracking-tight"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
            )}
            {tier === "standard" && (
              <Link
                href="/pricing"
                className="block py-5 text-2xl font-black text-[#1A1916] border-b border-[#E8E6E1] tracking-tight"
                onClick={() => setMobileMenuOpen(false)}
              >
                Upgrade
              </Link>
            )}
            <Link
              href="/account"
              className="block py-5 text-2xl font-black text-[#1A1916] border-b border-[#E8E6E1] tracking-tight"
              onClick={() => setMobileMenuOpen(false)}
            >
              Account
            </Link>
            <LogoutButton
              className="block w-full text-left py-5 text-2xl font-black text-[#1A1916] border-b border-[#E8E6E1] tracking-tight"
            />
          </div>
        </div>
      )}
```

### KoreaScout text in drawer (both branches — identical)

```tsx
<span className="font-black text-[#0A0908] text-xl tracking-tight">KoreaScout</span>
```

### Drawer outer `div` — exact `className`

Both logged-out and logged-in drawer roots use:

```
fixed inset-0 z-50 bg-[#F8F7F4] md:hidden flex flex-col
```

---

## 4. Logo component file existence (`find`-style)

- **Present:** `components/Logo.tsx` — exports `Logo` (Next `Image` for `/images/KoreaScout_LOGO_V3.png`).
- **Not a Logo component:** `components/LogoutButton.tsx` (name similarity only; separate file).

Equivalent search note: filename prefix `Logo*` under `components` resolves to **`components/Logo.tsx`** only.
