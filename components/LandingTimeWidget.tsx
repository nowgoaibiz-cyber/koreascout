// Server Component — "use client" 없음
// red-400/60: IRON RULE 예외 — 수동 리서치 bar 전용 허용

const LEFT_ROWS = [
  { label: "Find trending product", hrs: 8 },
  { label: "Verify market demand", hrs: 6 },
  { label: "Find Korean supplier", hrs: 12 },
  { label: "Translate + negotiate", hrs: 9 },
  { label: "HS Code + logistics †", hrs: 7 },
  { label: "Video + creative assets", hrs: 16 },
];
const TOTAL = LEFT_ROWS.reduce((s, r) => s + r.hrs, 0); // 58

export default function LandingTimeWidget() {
  return (
    <section className="bg-[#F8F7F4] py-24 px-6">
      <div className="max-w-6xl mx-auto">

        <p className="text-[10px] font-black uppercase tracking-[0.35em]
          text-[#9E9C98] text-center mb-4">
          Time vs. Money
        </p>
        <h2
          className="font-black text-[#1A1916] tracking-tighter text-center
          leading-none mb-16"
          style={
            {
              fontSize: "clamp(2rem,5vw,4rem)",
              textWrap: "balance",
            } as React.CSSProperties
          }
        >
          Time is your only
          <br />non-renewable resource.
          <br />
          <span style={{ color: "#16A34A" }}>Here&apos;s the math.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT — Manual (red-400/60 IRON RULE 예외 적용) */}
          <div className="bg-white border border-[#E8E6E1] rounded-2xl p-8
            shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
            <p className="text-[10px] font-black uppercase tracking-[0.3em]
              text-[#9E9C98] mb-6">❌ Manual Research</p>
            <div className="space-y-4">
              {LEFT_ROWS.map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-[#6B6860]">{row.label}</span>
                    <span className="text-sm font-bold text-[#1A1916]">{row.hrs} hrs</span>
                  </div>
                  <div className="h-1.5 bg-[#F8F7F4] rounded-full overflow-hidden">
                    {/* red-400/60: IRON RULE 예외 허용 구역 */}
                    <div
                      className="h-full rounded-full bg-red-400/60"
                      style={{ width: `${(row.hrs / 16) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E8E6E1] mt-6 pt-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-black text-[#1A1916]">Total / month</span>
                <span className="text-sm font-black text-[#1A1916]">{TOTAL} hours</span>
              </div>
              {[40, 60, 80].map((rate) => (
                <div key={rate} className="flex justify-between">
                  <span className="text-xs text-[#9E9C98]">@ ${rate}/hr</span>
                  <span className="text-xs font-bold text-[#6B6860]">
                    ${(TOTAL * rate).toLocaleString()}/mo
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — KoreaScout Alpha */}
          <div className="bg-[#F8F7F4] border border-[#E8E6E1] border-l-4
            border-l-[#16A34A] rounded-2xl p-8
            shadow-[0_4px_20px_0_rgb(22_163_74/0.08)]">
            <p className="text-[10px] font-black uppercase tracking-[0.3em]
              text-[#16A34A] mb-6">✓ KoreaScout Alpha</p>
            <div className="space-y-4">
              {LEFT_ROWS.map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-[#6B6860]">{row.label}</span>
                    <span className="text-sm font-bold text-[#16A34A]">✓ included</span>
                  </div>
                  <div className="h-1.5 bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#16A34A]"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E8E6E1] mt-6 pt-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-black text-[#1A1916]">Total / month</span>
                <span className="text-sm font-black text-[#16A34A]">&lt; 60 seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#9E9C98]">Cost</span>
                <span className="text-xs font-black text-[#1A1916]">$129/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#9E9C98]">Your ROI</span>
                <span className="text-xs font-black text-[#16A34A]">17× – 35×</span>
              </div>
            </div>
          </div>
        </div>

        <p
          className="text-center mt-10 font-black text-[#1A1916] tracking-tighter"
          style={{ fontSize: "clamp(1.25rem,3vw,2rem)" }}
        >
          58 hours vs. 60 seconds.
          <span style={{ color: "#16A34A" }}> The math is already done.</span>
        </p>

        {/* Disclaimer */}
        <div className="mt-8 border border-[#E8E6E1] rounded-xl px-6 py-4 bg-white
          max-w-3xl mx-auto">
          <p className="text-xs font-medium text-[#9E9C98] leading-relaxed text-center">
            † HS Code classifications, MOQ figures, and compliance data provided by
            KoreaScout are pre-verified intelligence estimates designed to give your
            customs broker a 90% head start — not a legal guarantee.
            Always confirm with your licensed broker.
          </p>
        </div>
      </div>
    </section>
  );
}
