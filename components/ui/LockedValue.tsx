"use client";

import { Lock } from "lucide-react";
import Link from "next/link";

interface LockedValueProps {
  children: React.ReactNode;
  locked: boolean;
  tier?: "standard" | "alpha";
}

export function LockedValue({ children, locked, tier = "standard" }: LockedValueProps) {
  if (!locked) return <>{children}</>;

  const ctaLabel = tier === "alpha"
    ? `Unlock with Alpha`
    : `Unlock with Standard`;

  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="blur-sm select-none pointer-events-none opacity-60">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#F8F7F4]/70 backdrop-blur-sm">
        <Lock className="w-4 h-4 text-[#0A0908]" strokeWidth={1.5} />
        <Link
          href="/pricing"
          className="text-[10px] font-medium text-[#16A34A] hover:underline"
        >
          {ctaLabel} →
        </Link>
      </div>
    </div>
  );
}
