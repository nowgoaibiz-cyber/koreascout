"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STANDARD_CHECKOUT_URL =
  "https://k-productscout26.lemonsqueezy.com/checkout/buy/141f6710-c704-4ab3-b7c7-f30b2c587587";
const ALPHA_CHECKOUT_URL =
  "https://k-productscout26.lemonsqueezy.com/checkout/buy/41bb4d4b-b9d6-4a60-8e19-19287c35516d";

function HeroCTABlock() {
  const router = useRouter();
  const supabase = createClient();

  async function handleCTA() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      router.push("/sample-report");
    } else {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/sample-report`,
        },
      });
    }
  }

  return (
    <div className="mt-14 flex flex-col items-center gap-3">
      <p className="text-[10px] tracking-[0.3em] uppercase text-[#16A34A]">
        Intelligence clearance required
      </p>
      <button
        onClick={handleCTA}
        className="group inline-flex items-center gap-2 border border-[rgba(22,163,74,0.2)] bg-white/[0.04] px-8 py-4 font-black uppercase tracking-tight text-white transition-colors hover:border-[#16A34A]/40 hover:bg-[#16A34A]/10 rounded-sm"
        type="button"
      >
        Request Access
        <span className="text-[#16A34A] transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </button>
    </div>
  );
}

const TICKER_ITEMS = [
  "Gap Index Verified",
  "Seoul Sourcing",
  "4K Raw Footage",
  "HS Code Ready",
  "Supplier Contacts",
  "Weekly Drops",
  "Korea-First Intelligence",
  "Verified Cost & MOQ",
  "Export Readiness",
];

export default function HomePage() {
  return (
    <>
      <main className="w-full min-h-screen bg-[#0A0908] text-white selection:bg-[#16A34A]/30">
        {/* ══ 1. HERO: The Command Center ═══════════════════════════════════ */}
        <section className="relative border-b border-[rgba(255,255,255,0.1)] bg-[#0A0908] py-32 md:py-40">
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4 text-[#16A34A]">
              THE GLOBAL STANDARD FOR KOREAN PRODUCT INTELLIGENCE
            </p>
            <h1 className="font-black uppercase tracking-tighter text-white/90 text-5xl md:text-7xl">
              STOP CHASING TRENDS. START SCOUTING THEM.
            </h1>
            <p className="font-serif italic text-white/40 text-xl md:text-2xl mt-6">
              Korea moves first. We tell you what moves.
            </p>
            <HeroCTABlock />
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden border-t border-[rgba(255,255,255,0.1)] bg-[#0A0908]/90 py-3">
            <div
              className="flex w-max gap-12 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.25em] text-white/30"
              style={{ animation: "ticker 40s linear infinite" }}
            >
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={i}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 2. THE SHIFT: The Raw Truth (Comparison) ═══════════════════════ */}
        <section className="border-b border-[rgba(255,255,255,0.1)] bg-[#0A0908] py-32">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-black uppercase tracking-tighter text-white">
              THE RAW TRUTH
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-8 border border-[rgba(255,255,255,0.1)] rounded-sm md:grid-cols-2">
              <div className="border border-[rgba(255,255,255,0.1)] bg-[#0A0908] p-8 md:p-10 rounded-sm text-white/50">
                <h3 className="mb-6 text-sm font-black uppercase tracking-[0.2em] text-white/40">
                  The Amateur
                </h3>
                <p className="font-medium leading-relaxed text-white/50">
                  Chase algorithms. Guess what will trend. Copy what already went viral. Compete on price because you arrived late.
                </p>
              </div>
              <div className="border border-[#16A34A] bg-[#0A0908] p-8 md:p-10 rounded-sm">
                <h3 className="mb-6 text-sm font-black uppercase tracking-[0.2em] text-[#16A34A]">
                  The Intel-Driven
                </h3>
                <p className="font-medium leading-relaxed text-white/70">
                  Scout before the trend peaks. Verified intelligence from Korea's fastest-moving products. Get supplier contacts and cost data. You move first.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 3. HOW IT GETS MADE — Sourcing Nodes ═══════════════════════════ */}
        <section className="border-b border-[rgba(255,255,255,0.1)] bg-[#0A0908] py-32">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-black uppercase tracking-tighter text-white">
              How It Gets Made
            </h2>
            <p className="mt-4 max-w-2xl font-serif text-lg italic text-white/40">
              We Do The Grunt Work. You Get The Files.
            </p>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="border border-[rgba(255,255,255,0.1)] bg-[#0A0908] p-8 rounded-sm">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16A34A]">
                  Step 01
                </span>
                <h3 className="mt-4 text-lg font-black uppercase tracking-tight text-white">
                  Scout & Verify
                </h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-white/70">
                  Our team tracks Korea’s platforms, retail, and supply chain.
                  Every product is verified for availability, margin potential,
                  and export readiness.
                </p>
              </div>
              <div className="border border-[rgba(255,255,255,0.1)] bg-[#0A0908] p-8 rounded-sm">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16A34A]">
                  Step 02
                </span>
                <h3 className="mt-4 text-lg font-black uppercase tracking-tight text-white">
                  Build The Intel
                </h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-white/70">
                  Gap Index, HS codes, supplier contacts, MOQ, cost per unit, and
                  raw 4K footage. Everything you need to move from idea to
                  order — no guesswork.
                </p>
              </div>
              <div className="border border-[rgba(255,255,255,0.1)] bg-[#0A0908] p-8 rounded-sm">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16A34A]">
                  Step 03
                </span>
                <h3 className="mt-4 text-lg font-black uppercase tracking-tight text-white">
                  You Execute
                </h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-white/70">
                  Weekly drops. Instant access. You get the files. Your team
                  executes. We don’t sell the product — we give you the
                  intelligence to win.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 4. PRICING — Choose Your Intelligence Level ═════════════════════ */}
        <section
          id="pricing"
          className="border-b border-[rgba(255,255,255,0.1)] bg-[#0A0908] py-32"
        >
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-black tracking-tighter uppercase text-white text-xl">
              Choose Your Intelligence Level
            </h2>
            <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex flex-col border border-[rgba(22,163,74,0.2)] bg-[#0A0908] p-8 rounded-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                  Essential
                </p>
                <p className="mt-4 text-2xl font-black uppercase tracking-tighter text-white md:text-3xl">
                  Standard
                </p>
                <p className="mt-6 text-4xl font-black tracking-tighter text-white">
                  $9
                  <span className="ml-1 text-base font-medium text-white/50">
                    /mo
                  </span>
                </p>
                <p className="mt-1 text-xs font-medium text-white/40">
                  per month · Essential Intelligence
                </p>
                <div className="my-6 h-px w-full bg-white/10" />
                <p className="text-sm font-medium leading-relaxed text-white/70">
                  Weekly verified products. Market intelligence. Gap Index.
                  Enough to move before the crowd.
                </p>
                <div className="mt-auto pt-8">
                  <a
                    href={STANDARD_CHECKOUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full border border-[rgba(22,163,74,0.2)] py-4 text-center text-sm font-black uppercase tracking-tight text-white transition-colors hover:border-[#16A34A]/40 hover:bg-[#16A34A]/10 rounded-sm"
                  >
                    Start Standard — $9/mo
                  </a>
                </div>
              </div>

              <div className="flex flex-col border border-[rgba(22,163,74,0.2)] bg-[#0A0908] p-8 rounded-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16A34A]">
                  Full Suite
                </p>
                <p className="mt-4 text-2xl font-black uppercase tracking-tighter text-[#16A34A] md:text-3xl">
                  Alpha
                </p>
                <p className="mt-6 text-4xl font-black tracking-tighter text-white">
                  $29
                  <span className="ml-1 text-base font-medium text-white/50">
                    /mo
                  </span>
                </p>
                <p className="mt-1 text-xs font-medium text-[#16A34A]">
                  per month · Full Intelligence Suite
                </p>
                <div className="my-6 h-px w-full bg-white/10" />
                <p className="text-sm font-medium leading-relaxed text-white/70">
                  Everything in Standard plus HS codes, supplier contacts, 4K
                  raw footage, export & logistics intel. Execution-ready.
                </p>
                <div className="mt-auto pt-8">
                  <a
                    href={ALPHA_CHECKOUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-[#16A34A] py-4 text-center text-sm font-black uppercase tracking-tight text-white transition-colors hover:bg-[#15803D] rounded-sm"
                  >
                    Go Alpha — $29/mo
                  </a>
                </div>
              </div>

              <div className="flex flex-col border border-[rgba(255,255,255,0.1)] bg-[#0A0908] p-8 rounded-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                  Institutional
                </p>
                <p className="mt-4 text-2xl font-black uppercase tracking-tighter text-white md:text-3xl">
                  Founders DNA
                </p>
                <p className="mt-6 text-4xl font-black tracking-tighter text-white">
                  —
                </p>
                <p className="mt-1 text-xs font-medium text-white/40">
                  By application · White-glove access
                </p>
                <div className="my-6 h-px w-full bg-white/10" />
                <p className="text-sm font-medium leading-relaxed text-white/70">
                  Direct line to the team. Priority sourcing requests. Custom
                  briefs. For brands and operators who need more than the
                  standard product.
                </p>
                <div className="mt-auto pt-8">
                  <Link
                    href="/contact"
                    className="block w-full border border-[rgba(255,255,255,0.1)] py-4 text-center text-sm font-black uppercase tracking-tight text-white transition-colors hover:border-white/20 hover:bg-white/5 rounded-sm"
                  >
                    Request Access
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 5. FAQ ══════════════════════════════════════════════════════════ */}
        <section className="border-b border-[rgba(255,255,255,0.1)] bg-[#0A0908] py-32">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-black uppercase tracking-tighter text-white">
              FAQ
            </h2>
            <dl className="mt-12 space-y-8">
              <div className="border-b border-[rgba(255,255,255,0.1)] pb-8">
                <dt className="text-sm font-black uppercase tracking-tight text-white">
                  What do I get each week?
                </dt>
                <dd className="mt-3 text-sm font-medium leading-relaxed text-white/70">
                  Every week we publish verified product intelligence: Gap Index,
                  margin potential, supplier context, and for Alpha members —
                  HS codes, contacts, and raw 4K footage. You get the files;
                  we do the grunt work.
                </dd>
              </div>
              <div className="border-b border-[rgba(255,255,255,0.1)] pb-8">
                <dt className="text-sm font-black uppercase tracking-tight text-white">
                  How is this different from other product research tools?
                </dt>
                <dd className="mt-3 text-sm font-medium leading-relaxed text-white/70">
                  We focus only on Korea-sourced, export-ready products. Our
                  team verifies availability and builds execution assets — not
                  just screenshots. You get supplier contacts and real cost
                  data, not guesses.
                </dd>
              </div>
              <div className="border-b border-[rgba(255,255,255,0.1)] pb-8">
                <dt className="text-sm font-black uppercase tracking-tight text-white">
                  Can I cancel anytime?
                </dt>
                <dd className="mt-3 text-sm font-medium leading-relaxed text-white/70">
                  Yes. No long-term contracts. Cancel anytime. Instant access
                  when you subscribe; you keep access until the end of your
                  billing period.
                </dd>
              </div>
              <div className="pb-8">
                <dt className="text-sm font-black uppercase tracking-tight text-white">
                  What is Founders DNA?
                </dt>
                <dd className="mt-3 text-sm font-medium leading-relaxed text-white/70">
                  Founders DNA is our highest tier: white-glove, by application.
                  For brands and operators who need custom briefs, priority
                  sourcing, or direct access to the team. Contact us to apply.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* ══ 6. CTA BOTTOM ════════════════════════════════════════════════════ */}
        <section className="border-b border-[rgba(255,255,255,0.1)] bg-[#0A0908] py-32">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="font-black uppercase tracking-tighter text-white">
              See The Intelligence First
            </h2>
            <p className="mt-4 font-medium text-white/60">
              Sample report. No commitment. See what we deliver before you
              subscribe.
            </p>
            <div className="mt-10">
              <HeroCTABlock />
            </div>
          </div>
        </section>
      </main>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[rgba(255,255,255,0.1)] bg-[#0A0908] py-8 px-4 sm:px-12">
        <div className="mx-auto flex max-w-6xl flex-col flex-wrap items-center justify-between gap-4 sm:flex-row">
          <span className="text-center text-base font-medium text-white/50 sm:text-left">
            © 2026 KoreaScout. All rights reserved.
          </span>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-base font-medium text-white/70 transition-colors hover:text-[#16A34A]"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-base font-medium text-white/70 transition-colors hover:text-[#16A34A]"
            >
              Terms
            </a>
            <Link
              href="/sample-report"
              className="text-base font-medium text-white/70 transition-colors hover:text-[#16A34A]"
            >
              Sample Report
            </Link>
            <a
              href="#"
              className="text-base font-medium text-white/70 transition-colors hover:text-[#16A34A]"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`,
        }}
      />
    </>
  );
}
