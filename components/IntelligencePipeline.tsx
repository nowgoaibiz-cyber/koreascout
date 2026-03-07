"use client";

import { ShieldCheck } from "lucide-react";

const KILL_ITEMS = [
  "Hazmat Detected (Liquid/Battery)",
  "HS Code Export Block",
  "Zero Margin (Gap Index < 2.0x)",
];

export default function IntelligencePipeline() {
  return (
    <section
      className="border-b border-[rgba(255,255,255,0.1)] py-24 md:py-32"
      style={{ backgroundColor: "#0A0908" }}
    >
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="font-black uppercase tracking-tighter text-white text-2xl md:text-3xl">
          We kill the risks. You own the margin.
        </h2>
        <p className="mt-4 max-w-2xl text-lg font-medium leading-relaxed text-white/60">
          500+ signals scanned. Customs cleared. Factory verified. 10
          export-ready winners, every week.
        </p>

        {/* Vertical pipeline with glowing line */}
        <div className="relative mt-16 flex flex-col gap-0">
          {/* Glowing center line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(22,163,74,0.6) 10%, rgba(22,163,74,0.9) 50%, rgba(22,163,74,0.6) 90%, transparent 100%)",
              boxShadow: "0 0 20px rgba(22,163,74,0.5)",
            }}
          />

          {/* Phase 1: RAW SIGNAL INGESTION */}
          <div className="relative z-10 flex flex-col items-center py-8">
            <div className="w-full max-w-md rounded-xl border border-white/20 bg-[#11100D] p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                Phase 1
              </p>
              <h3 className="mt-2 font-black uppercase tracking-tight text-white">
                Raw Signal Ingestion
              </h3>
              <p className="mt-3 text-sm text-white/50">
                Messy data blocks coming in.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="rounded bg-white/10 px-2 py-1 font-mono text-xs text-white/60"
                  >
                    block_{i}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Phase 2: THE KILL-SWITCH */}
          <div className="relative z-10 flex flex-col items-center py-8">
            <div className="w-full max-w-md rounded-xl border border-red-500/40 bg-[#1a0a0a] p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">
                Phase 2
              </p>
              <h3 className="mt-2 font-black uppercase tracking-tight text-red-400">
                The Kill-Switch
              </h3>
              <p className="mt-3 text-xs text-white/50">
                Active defense system. Blocked signals:
              </p>
              <ul className="mt-4 space-y-2">
                {KILL_ITEMS.map((label) => (
                  <li
                    key={label}
                    className="text-sm font-medium text-red-400"
                    style={{
                      textDecoration: "line-through",
                      textDecorationColor: "rgb(248 113 113)",
                    }}
                  >
                    ❌ {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Phase 3: HUMAN SCOUT AUDIT */}
          <div className="relative z-10 flex flex-col items-center py-8">
            <div className="w-full max-w-md rounded-xl border border-[#16A34A]/40 bg-[#0A0908] p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16A34A]">
                Phase 3
              </p>
              <h3 className="mt-2 font-black uppercase tracking-tight text-white">
                Human Scout Audit
              </h3>
              <div className="mt-4 flex items-center gap-3 text-[#16A34A]">
                <ShieldCheck className="size-6" strokeWidth={2} />
                <span className="text-sm font-medium">
                  Factory B2B Direct Line
                </span>
              </div>
            </div>
          </div>

          {/* Phase 4: THE WEEKLY 10 WINNERS */}
          <div className="relative z-10 flex flex-col items-center py-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16A34A] mb-4">
              Phase 4
            </p>
            <h3 className="font-black uppercase tracking-tight text-white mb-4">
              The Weekly 10 Winners
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[#16A34A]/30 bg-[#0d1f0d] px-3 py-4 text-center"
                >
                  <span className="text-xs font-bold text-[#16A34A]">
                    Winner {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
