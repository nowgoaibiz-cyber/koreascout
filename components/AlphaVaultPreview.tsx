export default function AlphaVaultPreview() {
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

  return (
    <div
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#11100D]
      shadow-[0_18px_50px_-24px_rgba(22,163,74,0.45)] transition-colors duration-500"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#0D0C09] px-6 py-4 transition-colors duration-500">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16A34A]">
            Report #KS-2026-W09
          </p>
          <p className="mt-0.5 text-xs text-white/45 transition-colors duration-500">
            Source: Olive Young · K-Wellness
          </p>
        </div>
        <span
          className="text-[10px] font-black uppercase tracking-[0.2em]
          bg-[#16A34A] text-white px-3 py-1 rounded-full"
        >
          Alpha
        </span>
      </div>

      {/* Scores */}
      <div className="border-b border-white/10 px-6 py-4 transition-colors duration-500">
        <p className="mb-3 text-2xl font-black tracking-tighter text-[#F8F7F4] transition-colors duration-500">
          █████████████████████████████
        </p>
        <div className="flex gap-6">
          {[
            { label: "Trend Score", value: "91 / 100 ↑" },
            { label: "Gap Index", value: "54" },
            { label: "Margin", value: "4×" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45 transition-colors duration-500">
                {s.label}
              </p>
              <p className="text-base font-black text-[#F8F7F4] transition-colors duration-500">
                {s.value}
              </p>
            </div>
          ))}
        </div>
        <div
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#16A34A]/30
          bg-[#16A34A]/10 px-3 py-1 shadow-[0_0_20px_rgba(22,163,74,0.12)] transition-colors duration-500"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-[0.2em]">
            Viral Sandbox: Passed ✓
          </span>
        </div>
      </div>

      {/* Standard Fields */}
      <div className="border-b border-white/10 px-6 py-4 transition-colors duration-500">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-white/45 transition-colors duration-500">
          Standard Access
        </p>
        <div className="space-y-2">
          {STANDARD_FIELDS.map((f) => (
            <div key={f} className="flex items-center gap-2">
              <span className="text-[#16A34A] font-black text-sm">🔓</span>
              <span className="text-sm font-medium text-white/85 transition-colors duration-500">
                {f}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Alpha Vault */}
      <div className="bg-[radial-gradient(circle_at_top,_rgba(22,163,74,0.16),_rgba(17,16,13,1)_55%)] px-6 py-4 transition-colors duration-500">
        <p
          className="text-[10px] font-black uppercase tracking-[0.25em]
          text-[#16A34A] mb-3"
        >
          Alpha Only — Execution Layer
        </p>
        <div className="space-y-2">
          {ALPHA_FIELDS.map((f) => (
            <div
              key={f}
              className="group relative flex items-center gap-2 cursor-default"
            >
              <span className="text-sm">🔒</span>
              <span
                className="text-sm font-medium text-white/50
                group-hover:text-[#F8F7F4] transition-colors duration-200"
              >
                {f}
              </span>
              <div
                className="absolute left-0 -top-10 z-20 hidden group-hover:flex
                items-center gap-2 bg-[#1A1916] text-white text-xs font-bold
                px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none
                shadow-[0_4px_20px_0_rgb(22_163_74/0.2)]"
              >
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
        <p className="mt-2 text-center text-[10px] text-white/45 transition-colors duration-500">
          † Pre-verified intelligence estimates. See disclaimer.
        </p>
      </div>
    </div>
  );
}

