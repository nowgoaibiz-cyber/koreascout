"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { LogoutButton } from "@/components/LogoutButton";

const ghostClass =
  "text-base text-[#6B6860] font-medium px-3.5 py-2 rounded-md hover:bg-[#F2F1EE] hover:text-[#1A1916] transition-colors";
const primaryClass =
  "bg-[#16A34A] text-white text-base font-semibold px-5 py-2 rounded-md hover:bg-[#15803D] transition-colors";

export function HeaderNavClient({ user }: { user: User | null }) {
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/login" className={ghostClass} title="Sign in to view weekly reports">
          Weekly Report
        </Link>
        <Link href="/pricing" className={ghostClass}>
          Pricing
        </Link>
        <Link href="/login" className={primaryClass}>
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/weekly" className={ghostClass}>
        Weekly Report
      </Link>
      <Link href="/account" className={ghostClass}>
        Account
      </Link>
      <LogoutButton className={ghostClass} />
    </div>
  );
}
