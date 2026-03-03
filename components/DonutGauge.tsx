"use client";

/**
 * Donut gauge for 0–100 score. Color zones: 0–40 red, 41–70 yellow, 71–100 green.
 * Used in Section 2 (Trend Signal Dashboard) for market_viability.
 */
export function DonutGauge({
  value,
  size = 120,
  strokeWidth = 10,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const clamped = Math.min(100, Math.max(0, Number(value)));
  const normalized = clamped / 100;

  const color =
    clamped <= 40
      ? "rgb(239, 68, 68)" // red-500
      : clamped <= 70
        ? "rgb(234, 179, 8)" // amber-400 / yellow
        : "#16A34A"; // Design System green

  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const strokeDasharray = `${normalized * circumference} ${circumference}`;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        {/* background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#E8E6E1"
          strokeWidth={strokeWidth}
        />
        {/* progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={0}
          className="transition-[stroke-dasharray] duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-bold tabular-nums text-[#1A1916]">
          {Math.round(clamped)}
        </span>
        <span className="text-xs text-[#9E9C98]">/100</span>
      </div>
    </div>
  );
}
