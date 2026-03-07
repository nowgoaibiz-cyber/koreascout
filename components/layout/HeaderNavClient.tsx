"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { LogoutButton } from "@/components/LogoutButton";

function getGhostClass(isTransparent: boolean) {
  return `rounded-md px-3.5 py-2 text-sm font-semibold tracking-tight transition-all duration-500 sm:text-base ${
    isTransparent
      ? "text-white hover:bg-white/10 hover:text-white"
      : "text-[#1A1916] hover:bg-[#F2F1EE] hover:text-[#1A1916]"
  }`;
}

function getPrimaryClass(isTransparent: boolean) {
  return `rounded-md px-5 py-2 text-sm font-semibold tracking-tight transition-all duration-500 sm:text-base ${
    isTransparent
      ? "border border-white/20 bg-transparent text-white hover:bg-white/10"
      : "bg-[#16A34A] text-white hover:bg-[#15803D]"
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

  if (!user) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 md:flex md:gap-3">
          <Link href="/login" className={ghostClass} title="Sign in to view weekly reports">
            Weekly Report
          </Link>
          <Link href="/pricing" className={ghostClass}>
            Pricing
          </Link>
        </div>
        <Link href="/login" className={primaryClass}>
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="hidden items-center gap-2 md:flex md:gap-3">
        <Link href="/weekly" className={ghostClass}>
          Weekly Report
        </Link>
        <Link href="/account" className={ghostClass}>
          Account
        </Link>
      </div>
      <LogoutButton className={primaryClass} />
    </div>
  );
}
