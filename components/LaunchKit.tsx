"use client";

import { useState } from "react";
import { Lock, LockOpen } from "lucide-react";

const CARDS = [
  { title: "Should I source this?", id: "c1" },
  { title: "How do I contact them?", id: "c2" },
  { title: "Will customs flag this?", id: "c3" },
  { title: "How do I market this?", id: "c4" },
] as const;

export default function LaunchKit() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="border-b border-[rgba(255,255,255,0.1)] bg-[#0A0908] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <h2
          className="font-black uppercase tracking-tighter text-white"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
          }}
        >
          We bridge the Korea Gap.
        </h2>
        <p className="mt-4 max-w-2xl text-lg font-medium leading-relaxed text-white/60">
          Language barrier? Eliminated. Logistics fear? Pre-answered. Sourcing
          legwork? Already handled. You focus on scaling.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ title, id }) => (
            <div
              key={id}
              className="group relative flex flex-col rounded-xl border border-white/10 bg-[#0A0908] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="transition-all duration-300">
                  {hoveredId === id ? (
                    <LockOpen
                      className="size-6 text-[#16A34A]"
                      strokeWidth={2}
                    />
                  ) : (
                    <Lock
                      className="size-6 text-white/50"
                      strokeWidth={2}
                    />
                  )}
                </span>
              </div>
              <h3 className="font-bold uppercase tracking-tight text-white">
                {title}
              </h3>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-base font-bold text-[#16A34A]">
          58 hours of manual research. Delivered in 1 second.
        </p>
      </div>
    </section>
  );
}
