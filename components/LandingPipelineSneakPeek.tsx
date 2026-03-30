"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function LandingPipelineSneakPeek() {
  return (
    <section
      className="w-full bg-cream-50 py-20 md:py-24 px-4 md:px-6 overflow-hidden"
      aria-label="Pipeline Sneak Peek — Exclusive report preview"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-20 items-center">
        {/* ── 좌측: Eyebrow & Copy ── */}
        <div className="w-full md:w-1/2 flex flex-col justify-center md:items-start">
          <p className="text-sm font-bold tracking-[0.2em] uppercase text-accent mb-4">
            WHAT WE DO
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-ink-900 leading-[1.2] tracking-tight">
            We Scout What's Hot in Korea.<br />You Lead the Global Trend.
          </h2>
        </div>

        {/* ── 우측: Product Identity Card (Floating) ── */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          <motion.div
            className="w-full max-w-[480px] rounded-2xl bg-white border border-cream-300 shadow-xl p-6 md:p-8 pb-5"
            animate={{ y: [-8, 8, -8] }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
            }}
          >
            {/* 상단: Image & Title */}
            <div className="flex gap-5 mb-6">
              <div className="shrink-0 w-24 h-32 rounded-xl overflow-hidden bg-cream-200">
                <Image
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop"
                  alt=""
                  width={96}
                  height={128}
                  className="w-24 h-32 object-cover rounded-xl"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="inline-flex items-center bg-cream-200 text-ink-500 text-xs font-medium px-2 py-1 rounded-md">
                    BEAUTY &gt; SKINCARE &gt; SUN CARE
                  </span>
                  <span className="inline-flex items-center bg-danger-light text-danger text-xs font-semibold px-2 py-1 rounded-md">
                    HIGHLY RECOMMENDED
                  </span>
                </div>
                <p className="font-bold text-lg text-ink-900 break-keep leading-snug">
                  Centella Hyaluronic Water-Fit Sun Serum
                </p>
                <p className="text-sm text-ink-500 break-keep mt-1 leading-snug">
                  센텔라 히알루론 수분 선 세럼
                </p>
              </div>
            </div>

            {/* 중단: Pricing & Alpha Lock */}
            <div className="mb-6">
              <div className="rounded-xl bg-cream-100 border border-cream-300 p-5 space-y-2">
                <p className="font-mono text-lg md:text-xl font-bold text-ink-900">
                  KRW 18,000 | USD 12.12
                </p>
                <p className="text-xs text-ink-500">
                  Ex. Rate: 1,485 KRW/USD
                </p>
                <p className="font-mono text-sm font-semibold text-warning">
                  Est. Wholesale: ~$4.84 - Estimated
                </p>
                <button
                  type="button"
                  disabled
                  className="mt-3 w-full flex items-center justify-center gap-2 rounded-md border border-cream-300 bg-cream-200/50 py-2.5 text-xs font-medium text-ink-500 cursor-default"
                  aria-disabled="true"
                >
                  <Lock className="w-4 h-4 text-ink-500" aria-hidden />
                  Alpha members get verified supplier quotes
                </button>
              </div>
            </div>

            {/* 하단: Trending Signal */}
            <div>
              <div className="rounded-xl border-2 border-accent/30 bg-accent-light/50 p-5">
                <p className="text-xs font-semibold tracking-wider text-accent uppercase mb-2">
                  WHY IT&apos;S TRENDING
                </p>
                <p className="text-sm text-ink-700 leading-relaxed">
                  Viral &apos;Glass Skin&apos; sunscreen. Zero white cast,
                  hyper-hydrating centella formula driving massive US TikTok
                  engagement.
                </p>
              </div>
            </div>
            <p
              className="text-[10px] text-right block mt-2 mb-1"
              style={{ color: "var(--color-ink-300)" }}
            >
              * Sample Intelligence Data
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
