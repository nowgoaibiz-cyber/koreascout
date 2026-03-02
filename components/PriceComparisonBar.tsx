import { ArrowRight } from "lucide-react";

/**
 * KR price (left) → US price (right) with arrow and gradient bar.
 * Section 3 Market Intelligence.
 */
export function PriceComparisonBar({
  krPrice,
  usPrice,
}: {
  krPrice: string;
  usPrice: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E8E6E1] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-[#9E9C98] font-semibold">KR Price</p>
          <p className="text-lg font-mono font-semibold text-[#1A1916] tabular-nums">{krPrice}</p>
        </div>
        <div className="flex flex-1 min-w-[80px] items-center justify-center gap-2 px-2">
          <div className="h-1 flex-1 min-w-[40px] rounded-full bg-gradient-to-r from-[#E8E6E1] via-[#16A34A]/50 to-[#E8E6E1]" aria-hidden />
          <ArrowRight className="h-5 w-5 shrink-0 text-[#16A34A]" aria-hidden />
          <div className="h-1 flex-1 min-w-[40px] rounded-full bg-gradient-to-r from-[#E8E6E1] via-[#16A34A]/50 to-[#E8E6E1]" aria-hidden />
        </div>
        <div className="min-w-0 text-right">
          <p className="text-xs uppercase tracking-widest text-[#9E9C98] font-semibold">US Price</p>
          <p className="text-lg font-mono font-semibold text-[#1A1916] tabular-nums">{usPrice}</p>
        </div>
      </div>
    </div>
  );
}
