"use client";

import HeroCTA from "@/components/HeroCTA";

export default function GrandEntrance() {
  return (
    <section
      className="relative min-h-screen w-full overflow-hidden -mt-24 pt-24 flex flex-col items-center justify-center"
      aria-label="Hero"
    >
      {/* Full-bleed video background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%230A0908'/%3E%3Cstop offset='100%25' stop-color='%231a1a18'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='1920' height='1080'/%3E%3C/svg%3E"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        {/* Overlay: top readability + seamless bottom into #0A0908 [cite: 2026-03-07] */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0A0908]"
          aria-hidden
        />
      </div>

      {/* Content — 2-line lock, golden-ratio spacing [cite: 2026-03-07] */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center pt-[15vh]">
        <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#16A34A] mb-8">
          Weekly Korean product intelligence for global sellers.
        </p>
        <h1 className="font-bold tracking-tighter text-white text-4xl md:text-7xl leading-[1.15] max-w-4xl mx-auto">
          <span className="block whitespace-nowrap">See what&apos;s selling in Korea today.</span>
          <span className="block whitespace-nowrap">Sell it globally tomorrow.</span>
        </h1>
        <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
          <HeroCTA />
        </div>
      </div>

      {/* Bottom edge: ticker will sit below in page.tsx */}
    </section>
  );
}
