"use client";

/**
 * Status badge for competition_level (Low/Medium/High) or gap_status (Blue Ocean/Emerging/Saturated).
 * Used in Section 2 (Trend Signal Dashboard) and elsewhere.
 */
type CompetitionLevel = "low" | "medium" | "high";
type GapStatus = "blue ocean" | "emerging" | "saturated";

function getCompetitionStyle(value: string): { className: string; icon: string } {
  const v = value.toLowerCase().trim();
  if (v === "low") return { className: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]", icon: "🟢" };
  if (v === "medium") return { className: "bg-amber-500/15 text-amber-300 border-amber-500/30", icon: "🟡" };
  if (v === "high") return { className: "bg-rose-500/15 text-rose-300 border-rose-500/30", icon: "🔴" };
  return { className: "bg-[#F8F7F4] text-[#6B6860] border-[#E8E6E1]", icon: "⬤" };
}

function getGapStyle(value: string): { className: string; icon: string } {
  const v = value.toLowerCase().trim();
  if (v === "blue ocean") return { className: "bg-blue-500/15 text-blue-300 border-blue-500/30", icon: "🔵" };
  if (v === "emerging") return { className: "bg-purple-500/15 text-purple-300 border-purple-500/30", icon: "🟣" };
  if (v === "saturated") return { className: "bg-[#F8F7F4] text-[#6B6860] border-[#E8E6E1]", icon: "⚫" };
  return { className: "bg-[#F8F7F4] text-[#6B6860] border-[#E8E6E1]", icon: "⬤" };
}

export function StatusBadge({
  variant,
  value,
  label,
}: {
  variant: "competition" | "gap";
  value: string;
  label?: string;
}) {
  const style = variant === "competition" ? getCompetitionStyle(value) : getGapStyle(value);
  const displayValue = value.trim() || (variant === "competition" ? "—" : "—");
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${style.className}`}
    >
      <span aria-hidden>{style.icon}</span>
      <span>{displayValue}</span>
      {label != null && <span className="sr-only">{label}</span>}
    </span>
  );
}
