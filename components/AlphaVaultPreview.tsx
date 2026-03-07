// Server Component — "use client" 없음. Hover: CSS group-hover only

const STANDARD_FIELDS = [
  "Viability Score",
  "Competition Map",
  "Growth Momentum Signal",
  "Global Price Benchmark",
  "Social Buzz Summary",
];

const ALPHA_FIELDS = [
  "HS Code (est.) †",
  "MOQ: ███ units (est.) †",
  "Lead Time: ██ days †",
  "Supplier Email + Phone",
  "4K Video Assets",
  "Broker Email Draft",
];

export default function AlphaVaultPreview() {
  return (
    <div className="bg-white border border-[#E8E6E1] rounded-2xl overflow-hidden
      shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">

      {/* Header */}
      <div className="bg-[#1A1916] px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16A34A]">
            Report #KS-2026-W09
          </p>
          <p className="text-xs text-white/40 mt-0.5">Source: Olive Young · K-Wellness</p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]
          bg-[#16A34A] text-white px-3 py-1 rounded-full">
          Alpha
        </span>
      </div>

      {/* Scores */}
      <div className="px-6 py-4 border-b border-[#E8E6E1]">
        <p className="text-2xl font-black text-[#1A1916] mb-3 tracking-tighter">
          █████████████████████████████
        </p>
        <div className="flex gap-6">
          {[
            { label: "Trend Score", value: "91 / 100 ↑" },
            { label: "Gap Index", value: "54" },
            { label: "Margin", value: "4×" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9E9C98]">
                {s.label}
              </p>
              <p className="text-base font-black text-[#1A1916]">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 bg-[#F8F7F4]
          border border-[#E8E6E1] rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-[0.2em]">
            Viral Sandbox: Passed ✓
          </span>
        </div>
      </div>

      {/* Standard Fields */}
      <div className="px-6 py-4 border-b border-[#E8E6E1]">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#9E9C98] mb-3">
          Standard Access
        </p>
        <div className="space-y-2">
          {STANDARD_FIELDS.map((f) => (
            <div key={f} className="flex items-center gap-2">
              <span className="text-[#16A34A] font-black text-sm">🔓</span>
              <span className="text-sm font-medium text-[#1A1916]">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alpha Vault */}
      <div className="px-6 py-4 bg-[#F8F7F4]">
        <p className="text-[10px] font-black uppercase tracking-[0.25em]
          text-[#16A34A] mb-3">
          Alpha Only — Execution Layer
        </p>
        <div className="space-y-2">
          {ALPHA_FIELDS.map((f) => (
            <div key={f} className="group relative flex items-center gap-2 cursor-default">
              <span className="text-sm">🔒</span>
              <span className="text-sm font-medium text-[#9E9C98]
                group-hover:text-[#1A1916] transition-colors duration-200">
                {f}
              </span>
              <div className="absolute left-0 -top-10 z-20 hidden group-hover:flex
                items-center gap-2 bg-[#1A1916] text-white text-xs font-bold
                px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none
                shadow-[0_4px_20px_0_rgb(22_163_74/0.2)]">
                <span className="text-[#16A34A]">🔒</span>
                Alpha only — Unlock the execution layer →
              </div>
            </div>
          ))}
        </div>
        <a
          href="/pricing"
          className="mt-4 block w-full text-center py-2.5 rounded-xl bg-[#16A34A]
            text-white text-sm font-black hover:bg-[#15803D]
            transition-colors duration-200
            shadow-[0_4px_12px_0_rgb(22_163_74/0.25)]"
        >
          Unlock the Execution Layer →
        </a>
        <p className="text-[10px] text-[#9E9C98] text-center mt-2">
          † Pre-verified intelligence estimates. See disclaimer.
        </p>
      </div>
    </div>
  );
}
