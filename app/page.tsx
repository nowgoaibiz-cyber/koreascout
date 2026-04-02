import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import LandingPipelineSneakPeek from "@/components/LandingPipelineSneakPeek";
import DynamiteFuseSection from "@/components/DynamiteFuseSection";
import IntelligencePipeline from "@/components/IntelligencePipeline";
import LandingTimeWidget from "@/components/LandingTimeWidget";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import CheckoutButton from "@/components/CheckoutButton";
import { PRICING } from "@/src/config/pricing";
import { Rocket, Handshake, ShieldCheck } from "lucide-react";
import FaqAccordion from "@/components/FaqAccordion";

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
  "https://getkoreascout.lemonsqueezy.com/checkout/buy/e9701b40-aad3-446e-b00a-617d0159d501";
const ALPHA_CHECKOUT_URL =
  "https://getkoreascout.lemonsqueezy.com/checkout/buy/936321c8-fba1-4f88-bb30-8865c8006fac";
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
      <main className="w-full min-h-screen bg-[#0A0908] text-white selection:bg-[#16A34A]/30 overflow-x-clip">

        {/* ══ S1: HERO ═══════════════════════════════════════════════════════════ */}
        <Hero />

        {/* ══ S1.5: PIPELINE SNEAK PEEK ═══════════════════════════════════════════ */}
        <LandingPipelineSneakPeek />

        {/* ══ S2.5: SOLDOUT SIGNAL ════════════════════════════════════ */}
        <section className="bg-[#0A0908] py-20 md:py-24 px-4 md:px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-20 items-center">
            {/* 좌측: 카피 */}
            <div className="w-full md:w-1/2 flex flex-col items-start">
              <h2
                className="font-black text-white mb-0"
                style={{
                  fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                }}
              >
                <span className="text-[#16A34A]">&ldquo;What&apos;s next?&rdquo;</span><br />
                We answer it before&nbsp;it sells out.
              </h2>
              <p
                className="whitespace-nowrap mt-1 text-[#F8F7F4] font-black"
                style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05 }}
              >
                First to the hype. First to the arbitrage.
              </p>
            </div>
            {/* 우측: 영상 */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-start">
              <div className="w-full max-w-[480px] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(22,163,74,0.15)]">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full rounded-2xl"
                  src="/videos/soldout.mp4"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══ S4: TIME WIDGET ═══════════════════════════ */}
        <LandingTimeWidget />

        {/* ══ S6: LAUNCH KIT — 섹션5 최종.png 100% 트윈 + Premium Interaction ═══════════════════ */}
        <section className="bg-[#0A0908] py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/50 text-center mb-4">
              LAUNCH KIT
            </p>
            <h2
              className="font-black text-center text-white mb-5"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
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
                <span className="text-white/50">Next viral trend?</span>{" "}
                <span className="text-[#16A34A]">Pre-scouted.</span>
              </p>
              <p className="text-base font-normal">
                <span className="text-white/50">Sourcing & logistics?</span>{" "}
                <span className="text-[#16A34A]">Handled.</span>
              </p>
              <p className="text-base font-normal text-white">You just focus on growing.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  alpha: false,
                  badge: "Standard & Alpha",
                  q: "Is this the next viral hit?",
                  items: [
                    { text: "Gap Index & Opportunity Analysis", lock: false },
                    { text: "Cross-Platform Vitality (TikTok · IG · YT)", lock: false },
                    { text: "Social Buzz & Sentiment Analysis", lock: false },
                    { text: "Margin Potential Multiplier", lock: false },
                  ],
                  cta: "Answers the WHY.",
                  time: "SAVES 14 HRS",
                },
                {
                  alpha: true,
                  badge: "Alpha Exclusive",
                  q: "How do I buy it wholesale?",
                  items: [
                    { text: "Verified Factory Cost ($) & MOQ", lock: false },
                    { text: "Direct Supplier Contact Intel", lock: false },
                    { text: "Factory Sample Policy & Availability", lock: false },
                    { text: "Production & Lead Time Data", lock: false },
                  ],
                  cta: "Verified Korea Intel. Just hit send.",
                  time: "SAVES 21 HRS",
                },
                {
                  alpha: true,
                  badge: "Alpha Exclusive",
                  q: "Will customs flag this?",
                  items: [
                    { text: "HS Code Guidance (Standard 6-digit)", lock: false },
                    { text: "Compliance Requirement Analysis (MoCRA/CPNP)", lock: false },
                    { text: "Hazmat & Shipping Specifications", lock: false },
                    { text: "Technical Product Data Framework", lock: false },
                  ],
                  cta: "We give your broker a 90% head start.",
                  time: "SAVES 7 HRS",
                },
                {
                  alpha: false,
                  badge: "Standard & Alpha",
                  q: "How do I make it go viral?",
                  items: [
                    { text: "Viral Hashtag Strategy", lock: false },
                    { text: "Global SEO Actionable Keywords", lock: false },
                    { text: "Rising Korean Keywords (KR)", lock: false },
                    { text: "4K On-Site Sourcing Footage (Raw)", lock: true },
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
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex flex-col gap-2">
                      <span
                        className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full w-fit"
                        style={
                          card.alpha
                            ? { background: "rgb(22 163 74 / 0.12)", color: "#16A34A" }
                            : { background: "rgb(248 247 244 / 0.08)", color: "rgba(248,247,244,0.5)" }
                        }
                      >
                        {card.badge}
                      </span>
                      <p className="text-[20px] font-bold text-white leading-tight pr-2">&ldquo;{card.q}&rdquo;</p>
                    </div>
                    <div className="relative w-5 h-5 shrink-0 mt-1" aria-hidden>
                      <LockIcon className="absolute inset-0 w-5 h-5 text-[#16A34A] transition-opacity duration-500 group-hover:opacity-0" />
                      <UnlockIcon className="absolute inset-0 w-5 h-5 text-[#16A34A] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>
                  </div>
                  <ul className="space-y-2 flex-1">
                    {card.items.map((item) => (
                      <li
                        key={item.text}
                        className="flex items-center gap-2 text-sm font-medium text-white/45 transition-colors duration-500 group-hover:text-white"
                        style={{ transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)" }}
                      >
                        <span className="text-[#16A34A]/70 shrink-0 group-hover:text-[#16A34A] transition-colors duration-500">–</span>
                        {item.text}
                        {item.lock && (
                          <LockIcon className="w-3 h-3 text-[#16A34A]/60 shrink-0 ml-auto" />
                        )}
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

        {/* ══ S7: INTELLIGENCE ENGINE (섹션4 최종.png — 100% clone) ════════════════════════════ */}
        <section className="bg-[#0A0908] py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <h2
              className="font-black text-center text-white mb-3"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                textWrap: "balance",
              } as React.CSSProperties}
            >
              Not a trend list.
              <br />
              A 6-layer intelligence brief —
            </h2>
            <p className="text-center text-white/60 font-medium mb-16 leading-relaxed max-w-2xl mx-auto" style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)" }}>
              Battle-tested in Korea. What takes you 58 hours, takes our engine 4 minutes.
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
                    d: "4K On-Site Sourcing Footage (Raw), SEO keywords, broker email draft. Day 1 ready to launch and scale.",
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
                        "4K On-Site Sourcing Footage (Raw)",
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

        {/* ══ S8: PRICING (3-tier from pricing page, v5 copy) ═══════════════════════════════════ */}
        <section id="pricing-cards" className="bg-white py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#9E9C98] text-center mb-4">
              Pricing
            </p>
            <h2
              className="font-black text-[#1A1916] text-center mb-4"
              style={{
                fontSize: "clamp(1.75rem, 4.5vw, 3.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
              } as React.CSSProperties}
            >
              For less than <span className="text-[#16A34A]">{PRICING.CURRENCY}{PRICING.ALPHA.daily.toFixed(2)}</span> a day.
            </h2>
            <p
              className="text-sm text-center mb-16"
              style={{ color: "rgba(10,9,8,0.4)" }}
            >
              Hire your dedicated Korea-based intelligence team.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* FREE */}
              <div className="bg-white border border-[#E8E6E1] rounded-2xl flex flex-col h-full p-8 md:p-12">
                <div className="min-h-[100px]">
                  <p className="text-3xl md:text-4xl font-black text-[#1A1916] tracking-tighter leading-none mb-8">
                    Scout Free
                  </p>
                  <div className="mb-1">
                    <span className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                      {PRICING.CURRENCY}{PRICING.FREE.monthly}
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
                    <span className="font-medium">10+ products unlocked immediately. (1 week · 14-day delay)</span>
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
                    10+ products · 1 week unlocked · 14-day delay
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
                      {PRICING.CURRENCY}{PRICING.STANDARD.monthly}
                    </span>
                    <span className="text-base text-[#9E9C98] font-medium ml-2">/ month</span>
                  </div>
                  <p className="text-xs font-bold text-[#9E9C98] mb-1">
                    Approx. {PRICING.CURRENCY}{PRICING.STANDARD.daily.toFixed(2)} / day
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
                    Know WHAT survived Korea&apos;s market. {PRICING.CURRENCY}{PRICING.STANDARD.daily.toFixed(2)}/day — less than your morning coffee,
                    more valuable than 14 hours of research.
                  </p>
                </div>
                <div className="mt-auto">
                  <CheckoutButton
                    checkoutUrl={STANDARD_CHECKOUT_URL}
                    className="block w-full text-center py-3 rounded-xl border-2 border-[#1A1916] text-sm font-black text-[#1A1916] hover:bg-[#1A1916] hover:text-white transition-all duration-200"
                  >
                    Start Knowing — {PRICING.CURRENCY}{PRICING.STANDARD.monthly}/mo
                  </CheckoutButton>
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
                      {PRICING.CURRENCY}{PRICING.ALPHA.monthly}
                    </span>
                    <span className="text-base text-[#9E9C98] font-medium ml-2">/ month</span>
                  </div>
                  <p className="text-xs font-bold text-[#16A34A] mb-1">
                    Approx. {PRICING.CURRENCY}{PRICING.ALPHA.daily.toFixed(2)} / day
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
                    Know HOW to bring it to your market. {PRICING.CURRENCY}{PRICING.ALPHA.daily.toFixed(2)}/day. Your Seoul-based sourcing team —
                    58 hours of work. 60 seconds to receive.
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
                    <CheckoutButton
                      checkoutUrl={ALPHA_CHECKOUT_URL}
                      className="block w-full text-center py-3 rounded-xl bg-[#16A34A] text-white text-sm font-black hover:bg-[#15803D] transition-colors duration-200 shadow-[0_4px_12px_0_rgb(22_163_74/0.3)]"
                    >
                      Go Alpha — {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo
                    </CheckoutButton>
                  )}
                  <p className="text-xs text-[#9E9C98] text-center mt-3">
                    10+ products/week · Full sourcing intel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ S8b: INSTITUTIONAL POLICY (Alpha Moat) — synced from pricing page ═══════════════ */}
        <section className="bg-[#1A1916] py-20 px-6">
          <div className="max-w-3xl mx-auto border border-white/10 rounded-2xl p-10">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#16A34A] mb-6">
              Institutional Policy
            </p>
            <h3
              className="font-black text-white leading-tight tracking-tighter mb-6"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
            >
              Why only 3,000 members?
            </h3>
            <p className="text-lg text-white/60 font-medium leading-relaxed">
              With over 50 million global sellers competing for the same demand, trend saturation is a certainty. Information loses its edge when everyone has it.
              <br /><br />
              By capping Alpha at exactly 3,000 spots—representing the top 0.006% of the global market—we mathematically minimize competition and protect your exclusive profit margins. We provide the verified intelligence. The execution is yours.
              <br /><br />
              We don&apos;t just find trends —{" "}
              <span className="text-white font-semibold">we protect your opportunity.</span>
            </p>
            {!isFull && (
              <div className="mt-8 flex items-center gap-3">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#16A34A] shadow-[0_0_10px_2px_rgba(22,163,74,0.9)]" />
                </span>
                <p className="text-xl md:text-2xl font-black text-[#16A34A]">
                  {remaining.toLocaleString()} of {ALPHA_MAX.toLocaleString()} spots remaining
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ══ S2: THE INTELLIGENCE GAP — Dynamite Fuse + Bottom Copy ═══════════════════ */}
        <DynamiteFuseSection />

        {/* ══ S9: TRUST + FOUNDER + FAQ + READY TO SCOUT (single bg #F8F7F4, no gap) ═══════════════════════════ */}
        <section className="bg-[#F8F7F4] pt-24 pb-24 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Trust & Moat — Headlines */}
            <h2
              className="font-black text-[#1A1916] text-center mb-4"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                textWrap: "balance",
              } as React.CSSProperties}
            >
              A perfect division of labor.
            </h2>
            <p className="text-base md:text-lg text-center text-[#6B6860] max-w-2xl mx-auto mb-16 leading-relaxed">
              We find the gold in Seoul. You take it to the global stage.
            </p>

            {/* 3-Column Trust & Moat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8E6E1]">
                <Rocket className="text-[#16A34A] w-8 h-8 mb-4" aria-hidden />
                <h3 className="text-lg font-bold text-[#1A1916] mb-3">The &quot;Korea&apos;s Amazon&quot; DNA.</h3>
                <p className="text-base text-[#6B6860] leading-relaxed">
                  Built by a former operator at Coupang (Korea&apos;s Amazon). We bring the fastest e-commerce market&apos;s execution speed and local vendor network directly to your sourcing pipeline.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8E6E1]">
                <ShieldCheck className="text-[#16A34A] w-8 h-8 mb-4" aria-hidden />
                <h3 className="text-lg font-bold text-[#1A1916] mb-3">AI Scouted. Human Curated.</h3>
                <p className="text-base text-[#6B6860] leading-relaxed">
                  Operated by KoreaScout in Korea. While our AI engine monitors Korea&apos;s fastest-moving platforms, our human operators filter out the noise. You get 100% verified intelligence, ready for scaling.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8E6E1]">
                <Handshake className="text-[#16A34A] w-8 h-8 mb-4" aria-hidden />
                <h3 className="text-lg font-bold text-[#1A1916] mb-3">We search. You scale.</h3>
                <p className="text-base text-[#6B6860] leading-relaxed">
                  We are your boots on the ground in Korea. You are the global scaling expert. A perfect synergy for less than <span className="text-[#16A34A] font-bold">{PRICING.CURRENCY}{PRICING.ALPHA.daily.toFixed(2)}</span> a day.
                </p>
              </div>
            </div>

            {/* Founder's Note — same container width, cream flow */}
            <div className="mt-12">
              <div className="bg-[#2A2824] rounded-3xl p-12 md:p-16 border border-white/5">
                <h2 className="text-[10px] font-bold text-[#F8F7F4]/30 uppercase tracking-[0.3em] mb-8">
                  Founder&apos;s Note
                </h2>
                <div className="border-l-2 border-[#16A34A] pl-6 md:pl-10">
                  <div className="space-y-8 text-lg md:text-xl text-[#F8F7F4]/60 leading-relaxed tracking-tight font-sans font-medium">
                    <p>
                      &ldquo;Since April 2025, we&apos;ve been quietly building the foundation for KoreaScout. We engineered our own AI system with one clear mission: to decode Korea&apos;s hyper-fast trends for the rest of the world.&rdquo;
                    </p>
                    <p>
                      &ldquo;Our philosophy is a perfect division of labor. We will relentlessly hunt down the best export-ready products in Seoul. You focus 100% on what you do best—scaling and dominating the global market.&rdquo;
                    </p>
                    <p>
                      &ldquo;KoreaScout is a living startup. We will never stop evolving, and our intelligence will continuously update. Focus on selling. We&apos;ve got the scouting covered.&rdquo;
                    </p>
                  </div>
                  <p className="mt-10 text-right text-[#F8F7F4]/40 text-sm font-bold">
                    — KoreaScout · Korea
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ — Category accordion (compact), no border for background continuity */}
          <div className="max-w-6xl mx-auto pt-16 pb-0 px-6 border-0">
            <h2 className="text-5xl font-black text-black mb-8">
              Frequently Asked
            </h2>
            <FaqAccordion />
          </div>

          {/* Ready to Scout CTA — same section, no gap (no black band) */}
          <div className="max-w-6xl mx-auto pt-0 pb-0 text-center overflow-x-clip border-0">
            <h2
              className="font-black text-[#1A1916] mt-6 mb-6"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                textWrap: "balance",
              } as React.CSSProperties}
            >
              Ready to Scout?
            </h2>
            <p className="text-base md:text-lg font-medium text-[#6B6860] leading-relaxed mb-4 max-w-xl mx-auto">
              The market moves while you hesitate.
            </p>
            <p className="text-base md:text-lg font-medium text-[#6B6860] leading-relaxed mb-10 max-w-xl mx-auto">
              Secure your intelligence before the 3,000 spots are gone.
            </p>

            {!isFull && (
              <div className="flex items-center justify-center gap-2 mb-10">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
                <p className="text-base font-black text-[#16A34A]">
                  {remaining.toLocaleString()} of {ALPHA_MAX.toLocaleString()} Alpha spots remaining
                </p>
              </div>
            )}

            <div className="flex flex-col items-center mb-4">
              <a
                href="#pricing-cards"
                className="w-full max-w-md px-12 py-5 rounded-xl font-black text-lg text-white bg-[#16A34A] hover:bg-[#15803D] transition-colors duration-200 shadow-[0_4px_20px_0_rgb(22_163_74/0.4)] text-center"
              >
                Get Exclusive Access Now
              </a>
              <p className="text-xs text-[#9E9C98] font-medium mt-4">
                No contracts · Cancel anytime · Instant access
              </p>
            </div>
          </div>
        </section>

        {/* Footer — Cream Shutter (Constitution) */}
        <footer className="bg-[#F8F7F4] border-t border-[#E8E6E1] py-10 px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-start">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-[#9E9C98]">© 2026 KoreaScout. All rights reserved.</p>
              <p className="text-xs text-[#9E9C98]">KoreaScout | CEO: Haengbok Jwa | Biz Reg No.: 640-22-02088</p>
              <p className="text-xs text-[#9E9C98]">E-commerce License No.: 2026-용인처인-00830</p>
              <p className="text-xs text-[#9E9C98]">Dream Biz Tech, 1391 Jungbu-daero, 2F D240, Yongin-si, Gyeonggi-do, Korea</p>
              <p className="text-xs text-[#9E9C98]">support@koreascout.com</p>
              <div className="flex gap-4 pt-1">
                <a href="/legal/terms" className="text-xs text-[#9E9C98] hover:text-[#0A0908] transition-colors">Terms of Service</a>
                <a href="/legal/privacy" className="text-xs text-[#9E9C98] hover:text-[#0A0908] transition-colors">Privacy Policy</a>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-6">
              <Link
                href="/pricing"
                className="text-sm font-medium text-[#0A0908] transition-colors duration-200 hover:text-[#16A34A]"
              >
                Pricing
              </Link>
              <Link
                href="/sample-report"
                className="text-sm font-medium text-[#0A0908] transition-colors duration-200 hover:text-[#16A34A]"
              >
                Sample Report
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-[#0A0908] transition-colors duration-200 hover:text-[#16A34A]"
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
