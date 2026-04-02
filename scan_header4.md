# Scan: `HeaderShellClient.tsx` + `Header.tsx` (read-only)

---

## 1. `components/layout/HeaderShellClient.tsx` — ENTIRE file

```tsx
"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Logo } from "@/components/Logo";
import { HeaderNavClient } from "./HeaderNavClient";

const THRESHOLD_ACTIVATE = 150;
const THRESHOLD_DEACTIVATE = 120;

let cachedScrolled = false;

function getScrollSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }
  return cachedScrolled;
}

function subscribeToScroll(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  let ticking = false;

  const notify = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      const y = window.scrollY;
      const next = cachedScrolled
        ? y >= THRESHOLD_DEACTIVATE
        : y >= THRESHOLD_ACTIVATE;
      if (next !== cachedScrolled) {
        cachedScrolled = next;
        callback();
      }
      ticking = false;
    });
  };

  window.addEventListener("scroll", notify, { passive: true });
  cachedScrolled = window.scrollY >= THRESHOLD_ACTIVATE;
  return () => window.removeEventListener("scroll", notify);
}

export function HeaderShellClient({ user, tier }: { user: User | null; tier: string }) {
  const pathname = usePathname();
  const isHomeRoute = pathname === "/";
  const isScrolled = useSyncExternalStore(
    subscribeToScroll,
    getScrollSnapshot,
    () => false,
  );
  const isTransparent = isHomeRoute && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 h-[80px] flex flex-col justify-center ${
        isTransparent
          ? "bg-transparent shadow-none"
          : "bg-[#F8F7F4] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]"
      }`}
      style={{
        contain: "layout",
        transform: "translate3d(0,0,0)",
        backfaceVisibility: "hidden",
        WebkitFontSmoothing: "antialiased",
        transition: "background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        borderBottom: isTransparent ? "1px solid transparent" : "1px solid rgba(232,230,225,0.8)",
      }}
    >
      <div className="mx-auto flex h-[80px] w-full max-w-[1440px] items-center justify-between px-8 sm:px-12">
        <Link
          href="/"
          className="flex h-10 w-auto shrink-0 items-center bg-transparent [background:transparent] [background-color:transparent!important] [background-image:none!important]"
          aria-label="KoreaScout home"
        >
          <Logo
            className="h-full w-auto object-contain"
            style={{
              filter: isTransparent ? "brightness(0) invert(1)" : "none",
              transition: "filter 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </Link>

        <HeaderNavClient user={user} tier={tier} isTransparent={isTransparent} />
      </div>
    </header>
  );
}
```

---

## 2. `components/layout/Header.tsx` — ENTIRE file

```tsx
import { createClient } from "@/lib/supabase/server";
import { HeaderShellClient } from "./HeaderShellClient";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let tier = "free";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("tier")
      .eq("id", user.id)
      .single();
    tier = profile?.tier ?? "free";
  }

  return <HeaderShellClient user={user} tier={tier} />;
}
```
