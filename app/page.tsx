import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import IntelligencePipeline from "@/components/IntelligencePipeline";
import LandingTimeWidget from "@/components/LandingTimeWidget";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "KoreaScout — Korean Retail Intelligence Hub",
  description:
    "Weekly verified intelligence from Olive Young & Daiso. Stop chasing trends. Start scouting them.",
  openGraph: {
    title: "KoreaScout — Korean Retail Intelligence Hub",
    description: "Korea moves first. We tell you what moves.",
  },
};

const STANDARD_CHECKOUT_URL =
  "https://k-productscout26.lemonsqueezy.com/checkout/buy/141f6710-c704-4ab3-b7c7-f30b2c587587";
const ALPHA_CHECKOUT_URL =
  "https://k-productscout26.lemonsqueezy.com/checkout/buy/41bb4d4b-b9d6-4a60-8e19-19287c35516d";
const ALPHA_MAX = 3000;

function UnlockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 5.9-5 4 4 0 0 1 4.1 4v1" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

async function getAlphaCount(): Promise<number> {
  try {
    const supabase = createServiceRoleClient();
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("tier", "alpha");
    if (error || count === null) return 0;
    return count;
  } catch {
    return 0;
  }
}

export default async function HomePage() {
  const alphaCount = await getAlphaCount();
  const remaining = Math.max(0, ALPHA_MAX - alphaCount);
  const isFull = alphaCount >= ALPHA_MAX;

  return (
    <>
      <main className="w-full min-h-screen bg-[#0A0908] text-white selection:bg-[#16A34A]/30">

        {/* ══ S1: HERO ═══════════════════════════════════════════════════════════ */}
        <Hero />

        {/* ══ S2: THE INTELLIGENCE GAP (섹션2최종.png — post-Hero) ═══════════════════ */}
        <section className="bg-[#F8F7F4] pt-24 md:pt-32 pb-20 md:pb-28 px-6">
          <div className="max-w-5xl mx-auto text-center">
            {/* Header — centered, verbatim from image */}
            <p
              className="text-[10px] font-black uppercase tracking-[0.35em] text-[#16A34A] mb-4"
              style={{ letterSpacing: "0.35em" }}
            >
              THE INTELLIGENCE GAP
            </p>
            <h2
              className="font-black tracking-tighter leading-none mb-2"
              style={{
                fontSize: "clamp(2rem,5vw,4rem)",
                textWrap: "balance",
                color: "#0A0908",
              } as React.CSSProperties}
            >
              You aren&apos;t late to the trend.
            </h2>
            <h2
              className="font-black tracking-tighter leading-none mb-6"
              style={{
                fontSize: "clamp(2rem,5vw,4rem)",
                textWrap: "balance",
                color: "#16A34A",
              } as React.CSSProperties}
            >
              You&apos;re late to the profit.
            </h2>
            <p className="text-[#6B6860] font-medium text-base md:text-lg max-w-xl mx-auto mb-14 md:mb-20 leading-relaxed">
              By the time a product trends on social media,
              <br />
              the margin is already gone.
            </p>

            {/* Comparison card — white #FFFFFF, high border-radius, two panels */}
            <div className="bg-[#FFFFFF] rounded-3xl overflow-hidden shadow-sm border border-[#E8E6E1]/60 flex flex-col md:flex-row">
              {/* Left panel — WHAT YOU SEE, bg #1A1916 */}
              <div className="flex-1 bg-[#1A1916] p-8 md:p-10 text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#9E9C98] mb-6">
                  WHAT YOU SEE
                </p>
                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6860] mb-0.5">
                      DATA SOURCE
                    </p>
                    <p className="text-sm font-medium text-[#9E9C98]">
                      TikTok · Instagram · Reddit
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6860] mb-0.5">
                      SIGNAL AGE
                    </p>
                    <p className="text-sm font-medium text-[#9E9C98]">
                      60-90 days old
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6860] mb-0.5">
                      COMPETITORS AWARE
                    </p>
                    <p className="text-sm font-medium text-[#9E9C98]">
                      Thousands
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6860] mb-0.5">
                      YOUR POSITION
                    </p>
                    <p className="text-sm font-medium text-[#9E9C98]">
                      Sourcing what everyone knows
                    </p>
                  </div>
                  <div className="pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6860] mb-0.5">
                      MARGIN POTENTIAL
                    </p>
                    <p className="text-xl font-black text-[#9E9C98]">
                      0.9x
                    </p>
                  </div>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9E9C98] mt-8 pt-6 border-t border-white/10">
                  ⚠️ LATE INTELLIGENCE
                </p>
              </div>

              {/* Vertical divider — thin green line per image */}
              <div className="w-px bg-[#16A34A] shrink-0 self-stretch hidden md:block" aria-hidden />

              {/* Right panel — WHAT ALPHA MEMBERS SEE, bg #FFFFFF */}
              <div className="flex-1 bg-[#FFFFFF] p-8 md:p-10 border-t md:border-t-0 border-[#E8E6E1] md:border-l-0 text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#16A34A] mb-6">
                  WHAT ALPHA MEMBERS SEE
                </p>
                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6860] mb-0.5">
                      DATA SOURCE
                    </p>
                    <p className="text-sm font-medium text-[#0A0908]">
                      Olive Young · Daiso · Real-time retail
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6860] mb-0.5">
                      SIGNAL AGE
                    </p>
                    <p className="text-sm font-medium text-[#0A0908]">
                      Week 1 - Zero lag
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6860] mb-0.5">
                      COMPETITORS AWARE
                    </p>
                    <p className="text-sm font-medium text-[#0A0908]">
                      &lt; 10 globally
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6860] mb-0.5">
                      YOUR POSITION
                    </p>
                    <p className="text-sm font-medium text-[#0A0908]">
                      Sourcing before anyone knows
                    </p>
                  </div>
                  <div className="pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6860] mb-0.5">
                      MARGIN POTENTIAL
                    </p>
                    <p className="text-xl font-black text-[#16A34A]">
                      4.0x
                    </p>
                  </div>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#16A34A] mt-8 pt-6 border-t border-[#E8E6E1]">
                  <span style={{ color: "#16A34A" }}>●</span> REAL-TIME INTELLIGENCE
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ S4: TIME WIDGET ═══════════════════════════ */}
        <LandingTimeWidget />

        {/* ══ S5: INTELLIGENCE ENGINE (섹션4 최종.png — 100% clone) ════════════════════════════ */}
        <section className="bg-[#0A0908] py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <h2
              className="font-black text-white tracking-tighter text-center leading-none mb-4"
              style={
                { fontSize: "clamp(2rem,5vw,4rem)", textWrap: "balance" } as React.CSSProperties
              }
            >
              Not a trend list.
              <br />
              A 6-layer intelligence brief —
              <br />
              <span style={{ color: "#16A34A" }}>battle-tested in Seoul.</span>
            </h2>
            <p className="text-center text-white/40 font-medium mb-16">
              What takes you 58 hours, takes our engine 4 minutes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-[0.45fr_0.55fr] gap-12 items-stretch">
              {/* Left: 6-layer list — fill height, justify-between so 01/06 align with card top/bottom */}
              <div className="flex flex-col justify-between min-h-0 h-full">
                {[
                  {
                    n: "01",
                    t: "Gap Index",
                    d: "KR Local Score vs. Global Trend Score — calculated as a single integer gap. Gap 54 means the world hasn't caught up yet. That's your window.",
                    s: "6 HRS",
                  },
                  {
                    n: "02",
                    t: "Margin Intelligence",
                    d: "Verified cost vs. global retail price → profit multiplier. You see the real upside before you commit a single dollar.",
                    s: "4 HRS",
                  },
                  {
                    n: "03",
                    t: "Trend Signals",
                    d: "TikTok, Instagram velocity scores + new content volume growth signal. You see what's accelerating before it reaches your feed.",
                    s: "8 HRS",
                  },
                  {
                    n: "04",
                    t: "Export Guard (Intelligence Estimate †)",
                    d: "HS Code, Hazmat status, required certificates, package dimensions. Gives your customs broker a 90% head start. Not a legal guarantee.",
                    s: "7 HRS",
                  },
                  {
                    n: "05",
                    t: "Direct Supplier Access",
                    d: "Verified manufacturer name, MOQ, and direct contact email. Our Seoul team checks it. Not scraped. Human-verified.",
                    s: "12 HRS",
                  },
                  {
                    n: "06",
                    t: "Launch Kit",
                    d: "4K viral video, marketing assets, SEO keywords, broker email draft. Day 1 ready. Nothing left to produce.",
                    s: "16+ HRS",
                  },
                ].map((layer) => (
                  <div key={layer.n} className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full border-2 border-[#16A34A] flex items-center justify-center bg-transparent">
                      <span className="text-[10px] font-black text-white">{layer.n}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">{layer.t}</p>
                      <p className="text-xs font-medium text-white/50 leading-relaxed mb-1">{layer.d}</p>
                      <p className="text-[10px] font-black text-[#16A34A] uppercase tracking-[0.2em]">⏱ SAVES {layer.s}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Market Intelligence Brief card — 55%, high rounded corners, h-full for height match */}
              <div className="bg-[#1A1916] rounded-3xl overflow-hidden border border-white/5 shadow-xl flex flex-col min-h-0 h-full">
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16A34A]">MARKET INTELLIGENCE BRIEF</p>
                      <p className="text-xs text-white/50 mt-1">Source: Olive Young · Daiso</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.2em] bg-[#16A34A] text-white px-3 py-1.5 rounded-full">ALPHA</span>
                  </div>

                  {/* Metrics row — font-black (900) */}
                  <div className="border-t border-white/10 pt-5 pb-5">
                    <div className="flex flex-wrap gap-6 gap-y-2">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-white/50">Market Score</p>
                        <p className="text-lg font-black text-white">91 / 100 ↑</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-white/50">Gap Index</p>
                        <p className="text-lg font-black text-white">54</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-white/50">Margin</p>
                        <p className="text-lg font-black text-white">3.8x</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-[#16A34A]">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16A34A] align-middle mr-1.5" aria-hidden /> COMPETITION: MODERATE ✓
                    </p>
                  </div>

                  {/* Standard Access — green open lock (#16A34A), verbatim 4 items */}
                  <div className="border-t border-white/10 pt-5 pb-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Standard Access</p>
                    <ul className="space-y-2">
                      {[
                        "Gap Index Score & Opportunity Reasoning",
                        "Profit Multiplier & Factory Unit Price (USD)",
                        "TikTok / IG Velocity & Buzz Summary",
                        "SEO, Viral & Rising Keywords",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-white">
                          <UnlockIcon className="shrink-0 text-[#16A34A] w-4 h-4" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Alpha Only — same green open lock (#16A34A), same bright text as Standard */}
                  <div className="border-t border-white/10 pt-5 pb-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Alpha Only — Execution Layer</p>
                    <ul className="space-y-2">
                      {[
                        "HS Code (6-digit) & Hazmat Assessment",
                        "Custom Broker Email Draft (English Template)",
                        "Verified MOQ & Factory Price (EXW)",
                        "Verified Direct Sourcing Intel",
                        "4K Viral Video & Marketing Asset Kit",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-white">
                          <UnlockIcon className="shrink-0 text-[#16A34A] w-4 h-4" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-white/40 italic">More details available on Pricing page</p>
                  </div>

                  {/* Footer — white regular centered, button with glow, disclaimer bottom-most */}
                  <div className="border-t border-white/10 pt-5 mt-auto">
                    <p className="text-sm font-normal text-white text-center mb-4">Unlock to access 30+ verified products immediately.</p>
                    <div className="flex justify-center">
                      <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#16A34A] px-5 py-3 text-sm font-black text-white hover:bg-[#15803D] transition-colors duration-200 shadow-[0_0_25px_rgba(22,163,74,0.4)]"
                      >
                        View Pricing & Access →
                      </Link>
                    </div>
                    <p className="text-[10px] text-white/40 text-center mt-4">† Pre-verified intelligence estimates. Not a legal guarantee.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ S6: LAUNCH KIT — 섹션5 최종.png 100% 트윈 + Premium Interaction ═══════════════════ */}
        <section className="bg-[#0A0908] py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/50 text-center mb-4">
              LAUNCH KIT
            </p>
            <h2
              className="font-black text-white tracking-tighter text-center leading-none mb-5"
              style={{
                fontSize: "clamp(2.25rem,5.5vw,4.25rem)",
                textWrap: "balance",
              } as React.CSSProperties}
            >
              We bridge the Korea Gap.
            </h2>
            <div className="text-center mb-16 space-y-1">
              <p className="text-base font-normal">
                <span className="text-white/50">Language barrier?</span>{" "}
                <span className="text-[#16A34A]">Eliminated.</span>
              </p>
              <p className="text-base font-normal">
                <span className="text-white/50">Logistics fear?</span>{" "}
                <span className="text-[#16A34A]">Pre-answered.</span>
              </p>
              <p className="text-base font-normal">
                <span className="text-white/50">Sourcing legwork?</span>{" "}
                <span className="text-[#16A34A]">Already handled.</span>
              </p>
              <p className="text-base font-normal text-white">You focus on scaling.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  alpha: false,
                  q: "Should I source this?",
                  items: [
                    "Gap Index & Opportunity Analysis",
                    "Global Market Saturation (6-Country Check)",
                    "Platform Breakdown (YT/TT/IG/Reddit)",
                    "Profit Multiplier & Price Benchmark",
                    "SEO & Viral Keyword Matrix",
                  ],
                  cta: "Answers the WHY.",
                  time: "SAVES 14 HRS",
                },
                {
                  alpha: true,
                  q: "How do I contact them?",
                  items: [
                    "Verified Factory Cost ($) & MOQ",
                    "Direct Supplier Contact Intel",
                    "Factory Sample Policy & Availability",
                    "Production & Lead Time Data",
                  ],
                  cta: "Verified Korea Intel. Just hit send.",
                  time: "SAVES 21 HRS",
                },
                {
                  alpha: true,
                  q: "Will customs flag this?",
                  items: [
                    "HS Code Guidance (Standard 6-digit)",
                    "Compliance Requirement Analysis (MoCRA/CPNP)",
                    "Hazmat & Shipping Specifications",
                    "Technical Product Data Framework",
                  ],
                  cta: "We give your broker a 90% head start.",
                  time: "SAVES 7 HRS",
                },
                {
                  alpha: true,
                  q: "How do I market this?",
                  items: [
                    "Raw Ad Footage & Store Visuals",
                    "Viral Video References",
                    "Sales Page Design Framework",
                    "Curated Brand Resource Kit",
                  ],
                  cta: "Day 1 ready to launch.",
                  time: "SAVES 16 HRS",
                },
              ].map((card) => (
                <div
                  key={card.q}
                  className={`group rounded-2xl p-8 bg-[#1A1916] flex flex-col border border-white/10 hover:scale-[1.02] origin-center ${card.alpha ? "border-l-2 border-l-[#16A34A]" : ""}`}
                  style={{ transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)" } as React.CSSProperties}
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <p className="text-[24px] font-bold text-white leading-tight pr-2">&ldquo;{card.q}&rdquo;</p>
                    <div className="relative w-5 h-5 shrink-0 mt-1" aria-hidden>
                      <LockIcon className="absolute inset-0 w-5 h-5 text-[#16A34A] transition-opacity duration-500 group-hover:opacity-0" />
                      <UnlockIcon className="absolute inset-0 w-5 h-5 text-[#16A34A] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>
                  </div>
                  <ul className="space-y-2 flex-1">
                    {card.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm font-medium text-white/45 transition-colors duration-500 group-hover:text-white"
                        style={{ transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)" }}
                      >
                        <span className="text-[#16A34A]/70 shrink-0 group-hover:text-[#16A34A] transition-colors duration-500">–</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <p className="text-[14px] font-bold text-white">{card.cta}</p>
                    <p className="text-[13px] font-black text-[#16A34A] uppercase tracking-[0.2em]">
                      ⏱ {card.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10 text-center text-[19px] font-normal text-[#16A34A]">
              58 hours of manual research. Delivered in 1 second.
            </p>
          </div>
        </section>

        {/* ══ S6: THE INTELLIGENCE PIPELINE (Scout Engine) ═══════════════════════════════ */}
        <IntelligencePipeline />

        {/* ══ S7: VIRAL SANDBOX TIMELINE ════════════════════ */}
        <section className="bg-[#1A1916] py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#9E9C98] text-center mb-4">
              The Viral Sandbox
            </p>
            <h2
              className="font-black text-white tracking-tighter text-center leading-none mb-4"
              style={
                { fontSize: "clamp(2rem,5vw,4rem)", textWrap: "balance" } as React.CSSProperties
              }
            >
              Korea is the world&apos;s most
              <br />
              brutal product testing ground.
              <br />
              <span style={{ color: "#16A34A" }}>We are your ringside analyst.</span>
            </h2>
            <p className="text-center text-white/40 font-medium mb-16">
              If it survives Korea&apos;s hyper-competitive market, it&apos;s a proven winner for
              your global store.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 relative">
              <div className="hidden md:block absolute top-4 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#16A34A]/30 to-transparent" />
              {[
                {
                  w: "Week 01",
                  e: "KoreaScout detects signal",
                  d: "Olive Young hit\nGap Index: 54\nTrend Score: 91",
                  q: "Our members\nhad 10 weeks.",
                },
                {
                  w: "Week 04",
                  e: "Alpha members source first",
                  d: "Landed: $3.80\nMOQ: 500 units\nViral Sandbox: PASSED ✓",
                  q: "While the\nmarket slept.",
                },
                {
                  w: "Week 12",
                  e: "TikTok US viral explosion",
                  d: "22M views\nSearch +710%\nKR trend confirmed",
                  q: "General public\ndiscovers it.",
                },
                {
                  w: "Week 20",
                  e: "Amazon Best Seller",
                  d: "Sold out 3×\nLate movers\npaying 3× more",
                  q: "You either\nscouted first,\nor you lost.",
                },
              ].map((node, i) => (
                <div
                  key={node.w}
                  className={`flex flex-col items-center text-center px-4 ${
                    i < 3 ? "border-r border-white/10" : ""
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-[#16A34A] mb-4 relative z-10" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16A34A] mb-3">
                    {node.w}
                  </p>
                  <p className="text-sm font-black text-white mb-3">{node.e}</p>
                  <p className="text-xs text-white/50 leading-relaxed whitespace-pre-line mb-4">
                    {node.d}
                  </p>
                  <p className="text-xs font-bold text-white/30 italic whitespace-pre-line">
                    &ldquo;{node.q}&rdquo;
                  </p>
                </div>
              ))}
            </div>
            <p className="text-center text-white/20 text-xs mt-10">
              * Representative case based on KoreaScout tracking methodology. Individual results
              may vary.
            </p>
          </div>
        </section>

        {/* ══ S8: PRICING (3-tier from pricing page, v5 copy) ═══════════════════════════════════ */}
        <section id="pricing-cards" className="bg-white py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#9E9C98] text-center mb-4">
              Pricing
            </p>
            <h2
              className="font-black text-[#1A1916] tracking-tighter text-center leading-none mb-16"
              style={{ fontSize: "clamp(2rem,5vw,4rem)" }}
            >
              Choose your intelligence level.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* FREE */}
              <div className="bg-white border border-[#E8E6E1] rounded-2xl flex flex-col h-full p-8 md:p-12">
                <div className="min-h-[100px]">
                  <p className="text-3xl md:text-4xl font-black text-[#1A1916] tracking-tighter leading-none mb-8">
                    Scout Free
                  </p>
                  <div className="mb-1">
                    <span className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                      $0
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-1">
                    Forever Free
                  </p>
                </div>
                <div className="w-8 h-px bg-[#E8E6E1] my-5" />
                <div className="bg-[#F8F7F4] border border-[#E8E6E1] rounded-xl px-4 py-3 min-h-[120px] flex items-center">
                  <p className="text-sm text-[#1A1916] leading-relaxed">
                    <span className="font-black uppercase">INSTANT ACCESS:</span>{" "}
                    <span className="font-medium">3 products/week unlocked immediately.</span>
                  </p>
                </div>
                <div className="flex-grow my-8">
                  <p className="text-base font-medium text-[#6B6860] leading-relaxed">
                    See what KoreaScout finds. Before you commit.
                  </p>
                </div>
                <div className="mt-auto">
                  <a
                    href="/signup"
                    className="block w-full text-center py-3 rounded-xl border-2 border-[#1A1916] text-sm font-black text-[#1A1916] hover:bg-[#1A1916] hover:text-white transition-all duration-200"
                  >
                    Unlock Free Intelligence
                  </a>
                  <p className="text-xs text-[#9E9C98] text-center mt-3">
                    3 products/week · 14-day delayed access
                  </p>
                </div>
              </div>

              {/* STANDARD — v5 copy */}
              <div className="bg-white border border-[#E8E6E1] rounded-2xl flex flex-col h-full p-8 md:p-12 shadow-[0_4px_20px_0_rgb(26_25_22/0.08)]">
                <div className="min-h-[100px]">
                  <p className="text-3xl md:text-4xl font-black text-[#1A1916] tracking-tighter leading-none mb-8">
                    Standard
                  </p>
                  <div className="mb-1">
                    <span className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                      $69
                    </span>
                    <span className="text-base text-[#9E9C98] font-medium ml-2">/ month</span>
                  </div>
                  <p className="text-xs font-bold text-[#9E9C98] mb-1">
                    Approx. $2.30 / day
                  </p>
                </div>
                <div className="w-8 h-px bg-[#E8E6E1] my-5" />
                <div className="bg-[#F8F7F4] border border-[#E8E6E1] rounded-xl px-4 py-3 min-h-[120px] flex items-center">
                  <p className="text-sm text-[#1A1916] leading-relaxed">
                    <span className="font-black uppercase">INSTANT ACCESS:</span>{" "}
                    <span className="font-medium">30+ Verified Products (Last 3 weeks) unlocked immediately.</span>
                  </p>
                </div>
                <div className="flex-grow my-8">
                  <p className="text-base font-medium text-[#6B6860] leading-relaxed">
                    Know WHAT survived Korea&apos;s market. $2.30/day — less than your morning coffee,
                    more valuable than 14 hours of research.
                  </p>
                </div>
                <div className="mt-auto">
                  <a
                    href={STANDARD_CHECKOUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-3 rounded-xl border-2 border-[#1A1916] text-sm font-black text-[#1A1916] hover:bg-[#1A1916] hover:text-white transition-all duration-200"
                  >
                    Start Knowing — $69/mo
                  </a>
                  <p className="text-xs text-[#9E9C98] text-center mt-3">
                    10+ products/week · Instant access
                  </p>
                </div>
              </div>

              {/* ALPHA — v5 copy, URL 41bb4d4b */}
              <div
                className="bg-[#F8F7F4] border border-[#E8E6E1] border-l-4 border-l-[#16A34A] rounded-2xl flex flex-col h-full p-8 md:p-12 shadow-[0_4px_20px_0_rgb(22_163_74/0.1)]"
                style={{ transform: "scale(1.03)", transformOrigin: "center" }}
              >
                <div className="min-h-[100px]">
                  <div className="flex items-center justify-between mb-8">
                    <p className="text-3xl md:text-4xl font-black text-[#16A34A] tracking-tighter leading-none">
                      Alpha
                    </p>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#16A34A]/10 border border-[#16A34A]/20 rounded-full">
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16A34A] shadow-[0_0_8px_1px_rgba(22,163,74,0.8)]" />
                      </span>
                      <span className="text-xs md:text-sm font-black text-[#16A34A] tracking-widest uppercase">
                        {alphaCount.toLocaleString()} / 3,000
                      </span>
                    </div>
                  </div>
                  <div className="mb-1">
                    <span className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                      $129
                    </span>
                    <span className="text-base text-[#9E9C98] font-medium ml-2">/ month</span>
                  </div>
                  <p className="text-xs font-bold text-[#16A34A] mb-1">
                    Approx. $4.30 / day
                  </p>
                </div>
                <div className="w-8 h-px bg-[#E8E6E1] my-5" />
                <div className="bg-white border border-[#16A34A] rounded-xl px-4 py-3 min-h-[120px] flex items-center">
                  <p className="text-sm text-[#1A1916] leading-relaxed">
                    <span className="font-black uppercase">FULL-SPECTRUM ACCESS:</span>{" "}
                    <span className="font-medium">30+ Premium Assets (Last 3 Weeks) Unlocked Immediately, Plus Direct HQ Contacts.</span>
                  </p>
                </div>
                <div className="flex-grow my-8">
                  <p className="text-base font-medium text-[#6B6860] leading-relaxed">
                    Know HOW to bring it to your market. $4.30/day. Your Seoul-based sourcing team —
                    on call every Thursday. 58 hours of work. 60 seconds to receive.
                  </p>
                  {!isFull && (
                    <p className="mt-4 text-xs font-bold text-[#16A34A]">
                      EXCLUSIVE: Limited to {ALPHA_MAX.toLocaleString()} Global Membership Spots (
                      {remaining.toLocaleString()} remaining)
                    </p>
                  )}
                </div>
                <div className="mt-auto">
                  {isFull ? (
                    <a
                      href="/waitlist"
                      className="block w-full text-center py-3 rounded-xl bg-[#1A1916] text-white text-sm font-black hover:bg-[#2D2B26] transition-colors duration-200"
                    >
                      Join the Waiting List
                    </a>
                  ) : (
                    <a
                      href={ALPHA_CHECKOUT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-3 rounded-xl bg-[#16A34A] text-white text-sm font-black hover:bg-[#15803D] transition-colors duration-200 shadow-[0_4px_12px_0_rgb(22_163_74/0.3)]"
                    >
                      Go Alpha — $129/mo
                    </a>
                  )}
                  <p className="text-xs text-[#9E9C98] text-center mt-3">
                    10+ products/week · Full sourcing intel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ S9: TRUST + FOUNDER ═══════════════════════════ */}
        <section className="bg-[#F8F7F4] py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#9E9C98] text-center mb-4">
              The Seoul Agency
            </p>
            <h2
              className="font-black text-[#1A1916] tracking-tighter text-center leading-none mb-16"
              style={
                { fontSize: "clamp(2rem,5vw,4rem)", textWrap: "balance" } as React.CSSProperties
              }
            >
              We find the gold.
              <br />
              You take it to the global stage.
              <br />
              <span style={{ color: "#16A34A" }}>A perfect division of labor.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  label: "The Seoul Agency",
                  body: "Operated by 지금행컴퍼니 (Jigeumhaeng Co.), registered in Seoul, Korea.\n\nDirect Olive Young & Daiso trend monitoring. Factory floor access. Human-verified. Not a scraper. Not a directory.",
                },
                {
                  label: "The Expert Moat",
                  body: "Built by ex-Coupang (Korea's Amazon) data specialists.\n\nWe understand how Korean consumer data moves before it becomes global. That's not a feature. That's a moat.",
                },
                {
                  label: "Your Synergy",
                  body: "We are search & data specialists.\nYou are the sales & scaling specialist.\n\nWe find the winner. You take it global.\n$129/mo. Perfect synergy.",
                },
              ].map((col) => (
                <div
                  key={col.label}
                  className="bg-white border border-[#E8E6E1] rounded-2xl p-8 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#9E9C98] mb-4">
                    {col.label}
                  </p>
                  <p className="text-base font-medium text-[#6B6860] leading-relaxed whitespace-pre-line">
                    {col.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-[#1A1916] rounded-2xl p-10 mb-12">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#16A34A] mb-6">
                Founder&apos;s Note
              </p>
              <p
                className="text-lg font-medium text-white/70 leading-relaxed"
                style={{ fontStyle: "italic" }}
              >
                &ldquo;We spent years inside Korea&apos;s largest e-commerce operations, watching
                which products exploded globally and which faded. The pattern was always the same:
                the winners were spotted in Seoul 60–90 days before they hit the rest of the world.
                <br />
                <br />
                KoreaScout is the system we built to give every global seller access to what we saw
                from the inside.&rdquo;
              </p>
              <p className="text-sm font-bold text-white/40 mt-6">
                — 지금행컴퍼니 (Jigeumhaeng Co.) · Seoul, Korea
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#9E9C98] text-center mb-8">
                Frequently Asked
              </p>
              {[
                {
                  q: "How is this different from Jungle Scout?",
                  a: "Jungle Scout tells you what's selling on Amazon. KoreaScout tells you what will sell — 60–90 days before it reaches any marketplace. They're downstream. We're upstream.",
                },
                {
                  q: "I don't speak Korean.",
                  a: "Every report is in English. Supplier contacts include ready-to-send English email templates. You never need a word of Korean.",
                },
                {
                  q: "Are the HS Codes and MOQ data guaranteed?",
                  a: "No — and we'll be upfront about that. Our data are pre-verified intelligence estimates that give your customs broker a 90% head start. Professional guidance, not legal advice. Your broker confirms. We eliminate the research.",
                },
              ].map((item) => (
                <details key={item.q} className="border-b border-[#E8E6E1] py-5 group">
                  <summary className="text-sm font-bold text-[#1A1916] cursor-pointer list-none flex items-center justify-between gap-4">
                    <span>{item.q}</span>
                    <span className="text-[#9E9C98] group-open:rotate-180 transition-transform duration-200 shrink-0">
                      ↓
                    </span>
                  </summary>
                  <p className="text-sm font-medium text-[#6B6860] leading-relaxed mt-4">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ══ S10: FINAL CTA ════════════════════════════════ */}
        <section className="bg-[#1A1916] py-32 px-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#16A34A] mb-8">
            Ready to Scout?
          </p>
          <h2
            className="font-black text-white tracking-tighter leading-none mb-10"
            style={{
              fontSize: "clamp(2rem,5vw,4.5rem)",
              textWrap: "balance",
            } as React.CSSProperties}
          >
            The market moves while you hesitate.
            <br />
            Secure your intelligence
            <br />
            <span style={{ color: "#16A34A" }}>before the 3,000 spots are gone.</span>
          </h2>

          {!isFull && (
            <div className="flex items-center justify-center gap-2 mb-10">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
              <p className="text-base font-black text-[#16A34A]">
                {remaining.toLocaleString()} of {ALPHA_MAX.toLocaleString()} Alpha spots remaining
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <a
              href="#pricing-cards"
              className="px-10 py-4 rounded-xl font-black text-base text-white bg-[#16A34A] hover:bg-[#15803D] transition-colors duration-200 shadow-[0_4px_20px_0_rgb(22_163_74/0.4)]"
            >
              Get Exclusive Access Now
            </a>
            <a
              href="/pricing"
              className="px-10 py-4 rounded-xl font-bold text-base text-white border border-white/30 hover:border-white/60 transition-colors duration-200"
            >
              View All Plans
            </a>
          </div>
          <p className="text-xs text-white/30 font-medium">
            No contracts · Cancel anytime · Instant access
          </p>
        </section>

        {/* Footer — Cream Shutter (Constitution) */}
        <footer className="bg-[#F8F7F4] border-t border-[#E8E6E1] py-8 px-6">
          <div className="mx-auto flex max-w-6xl flex-col flex-wrap items-center justify-between gap-4 sm:flex-row">
            <span className="text-center text-sm text-[#6B6860] sm:text-left">
              © 2026 KoreaScout. All rights reserved.
            </span>
            <div className="flex gap-6">
              <Link
                href="/pricing"
                className="text-sm font-medium text-[#1A1916] transition-colors duration-200 hover:text-[#16A34A]"
              >
                Pricing
              </Link>
              <Link
                href="/sample-report"
                className="text-sm font-medium text-[#1A1916] transition-colors duration-200 hover:text-[#16A34A]"
              >
                Sample Report
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-[#1A1916] transition-colors duration-200 hover:text-[#16A34A]"
              >
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
