// Server Component — "use client" 없음
import { createClient } from "@/lib/supabase/server";

const FALLBACK = [
  "Mugwort Body Wash [Olive Young] · TREND 91 · GAP 54 · MARGIN 4× · +41% WoW",
  "Foldable Storage Rack [Daiso] · TREND 88 · GAP 37 · MARGIN 3× · +31% WoW",
  "UV Arm Sleeve [K-Fashion] · TREND 85 · GAP 29 · MARGIN 3×",
  "Air Purifier Filter [K-Electronics · Scanning] · TREND 79 · GAP 19",
];

async function getTickerData() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("scout_final_reports")
      .select("translated_name, product_name, market_viability, gap_index, profit_multiplier")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(6);
    if (error || !data?.length) return null;
    return data;
  } catch {
    return null;
  }
}

export default async function IntelligenceTicker() {
  const data = await getTickerData();

  const items = data
    ? data.map((d) =>
        [
          d.translated_name ?? d.product_name ?? "—",
          d.market_viability != null ? `TREND ${d.market_viability}` : null,
          d.gap_index != null ? `GAP ${Math.round(d.gap_index as number)}` : null,
          d.profit_multiplier != null ? `MARGIN ${d.profit_multiplier}×` : null,
        ]
          .filter(Boolean)
          .join(" · ")
      )
    : FALLBACK;

  const text = items.join("          ·          ");

  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderTop: "1px solid rgba(22,163,74,0.2)",
        borderBottom: "1px solid rgba(22,163,74,0.2)",
        padding: "10px 0",
      }}
    >
      {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          className="absolute top-0 bottom-0 z-10 pointer-events-none"
          style={{
            [side]: 0,
            width: "80px",
            background: `linear-gradient(to ${
              side === "left" ? "right" : "left"
            }, rgba(10,9,8,0.95), transparent)`,
          }}
        />
      ))}
      <div
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          animation: "ticker-scroll 50s linear infinite",
        }}
      >
        {[text, text].map((t, i) => (
          <span
            key={i}
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(22,163,74,0.65)",
              paddingRight: "80px",
            }}
          >
            {t}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="ticker-scroll"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
