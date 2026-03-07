"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { LogoutButton } from "@/components/LogoutButton";

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

export function HeaderNavClient({
  user,
  isTransparent,
}: {
  user: User | null;
  isTransparent: boolean;
}) {
  const ghostClass = getGhostClass(isTransparent);
  const primaryClass = getPrimaryClass(isTransparent);

  const transitionStyle = { transition: NAV_TRANSITION };

  if (!user) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
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
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="hidden items-center gap-2 md:flex md:gap-3">
        <Link href="/weekly" className={ghostClass} style={transitionStyle}>
          Weekly Report
        </Link>
        <Link href="/account" className={ghostClass} style={transitionStyle}>
          Account
        </Link>
      </div>
      <LogoutButton className={primaryClass} style={transitionStyle} />
    </div>
  );
}
