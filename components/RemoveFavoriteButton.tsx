"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleFavorite } from "@/app/actions/favorites";

type Props = {
  reportId: string;
  variant?: "icon" | "text";
  className?: string;
};

export function RemoveFavoriteButton({ reportId, variant = "icon", className }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;
    setPending(true);
    await toggleFavorite(reportId);
    router.refresh();
    setPending(false);
  }

  const baseClass =
    variant === "text"
      ? "text-sm font-medium text-[#9E9C98] hover:text-[#6B6860] transition-colors disabled:opacity-50"
      : "absolute top-2 right-2 p-1 rounded-md text-gray-400 hover:text-[#DC2626] hover:bg-[#FEE2E2] transition-colors disabled:opacity-50";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={className ?? baseClass}
      aria-label="Remove from My Picks"
    >
      {variant === "text" ? "Unsave" : <X className="h-4 w-4" />}
    </button>
  );
}
