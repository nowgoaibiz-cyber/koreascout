"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Logo } from "@/components/Logo";
import { HeaderNavClient } from "./HeaderNavClient";

function subscribeToScroll(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  let ticking = false;

  const notify = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(() => {
      callback();
      ticking = false;
    });
  };

  window.addEventListener("scroll", notify, { passive: true });

  return () => {
    window.removeEventListener("scroll", notify);
  };
}

function getScrollSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.scrollY >= 350;
}

export function HeaderShellClient({ user }: { user: User | null }) {
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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isTransparent
          ? "border-none bg-transparent"
          : "border-b border-[#E8E6E1]/80 bg-[#F8F7F4] shadow-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex h-10 w-auto shrink-0 items-center bg-transparent [background:transparent] [background-color:transparent!important] [background-image:none!important]"
          aria-label="KoreaScout home"
        >
          <Logo
            className="h-full w-auto object-contain transition-all duration-500"
            style={{
              filter: isTransparent ? "brightness(0) invert(1)" : "none",
            }}
          />
        </Link>

        <HeaderNavClient user={user} isTransparent={isTransparent} />
      </div>
    </header>
  );
}
