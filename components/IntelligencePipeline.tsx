"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, X, Check, ArrowRight } from "lucide-react";

const SOURCES = ["TikTok", "Olive Young", "Hwahae", "Reddit", "Instagram"];
const REJECTED = [
  { label: "Hazmat Detected", suffix: "REJECTED" },
  { label: "HS Code Block", suffix: "REJECTED" },
  { label: "Zero Margin", suffix: "REJECTED" },
];
const APPROVED = [
  "Factory Direct Line",
  "MoCRA / CPNP Checked",
];

const stagger = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
};

export default function IntelligencePipeline() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="py-24 md:py-32 px-6"
      style={{ backgroundColor: "#0A0908" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-black text-white text-center tracking-tighter leading-tight mb-4"
          style={{
            fontSize: "clamp(1.75rem,4vw,3rem)",
            textWrap: "balance",
          }}
        >
          We kill the risks. You own the margin.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-gray-400 text-center text-sm md:text-base max-w-2xl mx-auto mb-16"
        >
          500+ signals scanned. Customs cleared. Factory verified. 10 export-ready
          winners, every week.
        </motion.p>

        {/* Horizontal pipeline: flex-row desktop, flex-col mobile */}
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-4">
          {/* Phase 01: Mass Ingestion */}
          <motion.div
            custom={0}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={stagger}
            className="flex-1 min-w-0 rounded-2xl border border-white/10 bg-[#11100D] p-6 flex flex-col"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16A34A] mb-4">
              01. RAW SIGNAL INGESTION
            </p>
            <div className="flex flex-wrap gap-2 justify-center items-center flex-1 min-h-[100px]">
              {SOURCES.map((name, i) => (
                <motion.span
                  key={name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  className="rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white/80 border border-white/5"
                >
                  {name}
                </motion.span>
              ))}
            </div>
            <p className="text-[10px] text-white/40 text-center mt-2">
              Data blocks → pipeline
            </p>
          </motion.div>

          {/* Connector: right (desktop) / down (mobile) */}
          <div className="flex lg:hidden justify-center py-2 text-[#16A34A]">
            <ArrowRight className="w-5 h-5 rotate-90" strokeWidth={2.5} />
          </div>
          <div className="hidden lg:flex items-center justify-center shrink-0 w-8 self-center">
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-[#16A34A] drop-shadow-[0_0_8px_rgba(22,163,74,0.6)]"
            >
              <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
            </motion.div>
          </div>

          {/* Phase 02: Risk Elimination */}
          <motion.div
            custom={1}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={stagger}
            className="flex-1 min-w-0 rounded-2xl border border-white/10 bg-[#1a0a0a] p-6 flex flex-col relative overflow-hidden"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400 mb-4">
              02. RISK ELIMINATION
            </p>
            {/* Red laser radar line */}
            <div
              className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2 opacity-80"
              style={{
                background: `linear-gradient(180deg, transparent 0%, #EF4444 20%, #EF4444 80%, transparent 100%)`,
                boxShadow: "0 0 20px #EF4444, 0 0 40px rgba(239,68,68,0.4)",
              }}
            />
            <ul className="relative z-10 space-y-2 flex-1">
              {REJECTED.map(({ label, suffix }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, x: 8 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.35 }}
                  className="flex items-center gap-2 text-sm font-medium text-red-400"
                  style={{
                    textDecoration: "line-through",
                    textDecorationColor: "#EF4444",
                  }}
                >
                  <X className="w-4 h-4 shrink-0" />
                  <span>
                    {label} ➔ {suffix}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <div className="flex lg:hidden justify-center py-2 text-[#16A34A]">
            <ArrowRight className="w-5 h-5 rotate-90" strokeWidth={2.5} />
          </div>
          {/* Connector */}
          <div className="hidden lg:flex items-center justify-center shrink-0 w-8 self-center">
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.85, duration: 0.4 }}
              className="text-[#16A34A] drop-shadow-[0_0_8px_rgba(22,163,74,0.6)]"
            >
              <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
            </motion.div>
          </div>

          {/* Phase 03: Human Audit */}
          <motion.div
            custom={2}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={stagger}
            className="flex-1 min-w-0 rounded-2xl border border-white/10 bg-[#0d1f0d] p-6 flex flex-col"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16A34A] mb-4">
              03. HUMAN SCOUT AUDIT
            </p>
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="rounded-full bg-[#16A34A]/20 p-3 text-[#16A34A]"
              >
                <ShieldCheck className="w-8 h-8" strokeWidth={2} />
              </motion.div>
            </div>
            <ul className="space-y-2 flex-1">
              {APPROVED.map((line, i) => (
                <motion.li
                  key={line}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 1 + i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-2 text-sm font-medium text-[#16A34A]"
                >
                  <Check
                    className="w-4 h-4 shrink-0 drop-shadow-[0_0_6px_rgba(22,163,74,0.8)]"
                    strokeWidth={2.5}
                  />
                  {line}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <div className="flex lg:hidden justify-center py-2 text-[#16A34A]">
            <ArrowRight className="w-5 h-5 rotate-90" strokeWidth={2.5} />
          </div>
          {/* Connector */}
          <div className="hidden lg:flex items-center justify-center shrink-0 w-8 self-center">
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.15, duration: 0.4 }}
              className="text-[#16A34A] drop-shadow-[0_0_8px_rgba(22,163,74,0.6)]"
            >
              <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
            </motion.div>
          </div>

          {/* Phase 04: The Weekly 10 Winners */}
          <motion.div
            custom={3}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={stagger}
            className="flex-1 min-w-0 rounded-2xl border border-[#16A34A]/30 bg-[#0d1f0d] p-6 flex flex-col relative"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16A34A] mb-4">
              04. THE WEEKLY 10 WINNERS
            </p>
            {/* Stacked cards visual */}
            <div className="relative flex-1 min-h-[120px] flex items-center justify-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.2 + i * 0.06, duration: 0.35 }}
                  className="absolute rounded-xl border border-[#16A34A]/40 bg-[#0A0908] px-4 py-3 shadow-[0_0_20px_rgba(22,163,74,0.15)]"
                  style={{
                    transform: `translate(${i * 6}px, ${i * 4}px)`,
                    zIndex: i,
                  }}
                >
                  <span className="text-xs font-bold text-[#16A34A]">
                    Winner card
                  </span>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.45, duration: 0.4 }}
                className="relative z-10 rounded-xl border border-[#16A34A]/50 bg-[#0d1f0d] px-5 py-4 text-center"
              >
                <span className="text-sm font-black text-[#16A34A]">10</span>
                <span className="text-xs text-white/70 ml-1">winners</span>
              </motion.div>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.5, duration: 0.4 }}
              className="mt-4 text-center text-sm font-bold text-[#16A34A] drop-shadow-[0_0_12px_rgba(22,163,74,0.5)]"
            >
              Ready to source. Zero blind spots.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
