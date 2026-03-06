"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleFavorite } from "@/app/actions/favorites";

type Props = {
  reportId: string;
  weekId?: string;
  isFavorited: boolean;
  className?: string;
  iconClassName?: string;
};

export function FavoriteButton({ reportId, weekId, isFavorited: initial, className, iconClassName }: Props) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(initial);
  const [pending, setPending] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;
    setPending(true);
    const prev = isFavorited;
    setIsFavorited(!prev);
    const { ok } = await toggleFavorite(reportId, weekId);
    if (!ok) setIsFavorited(prev);
    router.refresh();
    setPending(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={
        className ??
        `absolute top-4 right-4 transition-colors hover:opacity-90 cursor-pointer disabled:opacity-50 ${
          isFavorited ? "fill-[#16A34A] text-[#16A34A]" : "text-gray-300 hover:text-[#16A34A]"
        }`
      }
      aria-label={isFavorited ? "Remove from My Picks" : "Add to My Picks"}
    >
      <Bookmark
        className={iconClassName ?? "h-5 w-5"}
        strokeWidth={1.5}
        fill={isFavorited ? "currentColor" : "none"}
      />
    </button>
  );
}
