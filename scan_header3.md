# Header / Nav scan (read-only) — `scan_header3.md`

Sources: `components/layout/HeaderNavClient.tsx`, `components/layout/HeaderShellClient.tsx`, `components/Logo.tsx` (path: `components/Logo.tsx`, imported as `@/components/Logo`).

---

## 1. EXACT full `className` on both drawer container `<div>`s

Both branches (logged-out `!user` block and logged-in `return` block) use the **same** string:

```
fixed inset-0 z-50 bg-[#F8F7F4] md:hidden flex flex-col
```

- Logged-out drawer: `HeaderNavClient.tsx` lines 80–81 (`className=` on the conditional drawer `<div>`).
- Logged-in drawer: `HeaderNavClient.tsx` lines 156–157 (same).

---

## 2. Is there `md:hidden` on the drawer container?

**Yes.** The drawer container includes `md:hidden` in its `className` (same string as above).

---

## 3. Computed z-index / stacking context (static code analysis)

**Drawer**

- `className` includes `z-50` (`z-index: 50` in Tailwind terms).
- Inline `style` includes `isolation: "isolate"` → creates a **new stacking context** on the drawer element itself.
- Inline `style` uses CSS `animation` referencing `@keyframes slideDown` where `from`/`to` use **`transform: translateY(...)`** → during the animation, `transform` is non-`none`, which also contributes to stacking/isolation behavior for that element.

**Ancestors in `HeaderNavClient`**

- Wrapper `<div className="relative">` — `position: relative` only; no `transform` / `filter` / `will-change` in the source for that node.

**`HeaderShellClient` parent `<header>` (see Q4)**

- The `<header>` sets **`transform: translate3d(0,0,0)`** in its `style` prop.
- In browsers, a non-`none` **`transform` on an ancestor**:
  - Creates a **new stacking context** for that header subtree.
  - Makes **`position: fixed`** descendants use that ancestor as their **containing block** (fixed positioning is relative to the transformed ancestor, not necessarily the full viewport).

So: **yes**, there is an ancestor (`<header>`) with **`transform`**, which affects both stacking and how `fixed inset-0` on the drawer is laid out relative to the viewport.

---

## 4. `HeaderShellClient.tsx` — `transform`, `will-change`, `filter` on the header?

From the `<header>` element’s **`style` object** (and `className`):

- **`transform`:** present — `transform: "translate3d(0,0,0)"`.
- **`will-change`:** **not** set on `<header>`.
- **`filter`:** **not** set on `<header>`.

Note: The **Logo** inside the header uses `filter` in its own `style` (`brightness(0) invert(1)` when transparent, else `"none"`); that is on the **Logo** / image, not on `<header>`.

---

## 5. `HeaderShellClient.tsx` — exact `style` prop on `<header>`

```tsx
style={{
  contain: "layout",
  transform: "translate3d(0,0,0)",
  backfaceVisibility: "hidden",
  WebkitFontSmoothing: "antialiased",
  transition: "background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  borderBottom: isTransparent ? "1px solid transparent" : "1px solid rgba(232,230,225,0.8)",
}}
```

---

## 6. `Logo.tsx` — full file

```tsx
import Image from "next/image";
import type { CSSProperties } from "react";

type LogoProps = {
  className?: string;
  style?: CSSProperties;
};

export function Logo({ className, style }: LogoProps) {
  return (
    <Image
      src="/images/KoreaScout_LOGO_V3.png"
      alt="KoreaScout Logo"
      width={320}
      height={80}
      priority
      className={className}
      style={style}
    />
  );
}
```
