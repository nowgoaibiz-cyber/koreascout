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
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">KR Price</p>
          <p className="text-lg font-semibold text-white tabular-nums">{krPrice}</p>
        </div>
        <div className="flex flex-1 min-w-[80px] items-center justify-center gap-2 px-2">
          <div className="h-1 flex-1 min-w-[40px] rounded-full bg-gradient-to-r from-white/20 via-emerald-500/50 to-white/20" aria-hidden />
          <ArrowRight className="h-5 w-5 shrink-0 text-emerald-400" aria-hidden />
          <div className="h-1 flex-1 min-w-[40px] rounded-full bg-gradient-to-r from-white/20 via-emerald-500/50 to-white/20" aria-hidden />
        </div>
        <div className="min-w-0 text-right">
          <p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">US Price</p>
          <p className="text-lg font-semibold text-white tabular-nums">{usPrice}</p>
        </div>
      </div>
    </div>
  );
}
