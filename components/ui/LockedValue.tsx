"use client";

import { Lock } from "lucide-react";
import Link from "next/link";

interface LockedValueProps {
  children: React.ReactNode;
  locked: boolean;
  tier?: "standard" | "alpha";
  minHeight?: string;
}

export function LockedValue({
  children,
  locked,
  tier = "standard",
  minHeight = "80px",
}: LockedValueProps) {
  if (!locked) return <>{children}</>;

  const ctaLabel =
    tier === "alpha" ? "Unlock with Alpha →" : "Unlock with Standard →";
  const ctaHref = "/pricing";

  return (
    <div className="relative rounded-xl overflow-hidden" style={{ minHeight }}>
      <div
        className="blur-md select-none pointer-events-none opacity-40"
        aria-hidden
      >
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#F8F7F4]/60 backdrop-blur-md rounded-xl">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0A0908]/5 border border-[#0A0908]/10">
          <Lock className="w-4 h-4 text-[#0A0908]/40" strokeWidth={1.5} />
        </div>
        <Link
          href={ctaHref}
          className="text-xs font-semibold text-[#16A34A] hover:underline tracking-wide"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
