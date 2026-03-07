import Link from "next/link";
import GrandEntrance from "@/components/GrandEntrance";
import HeroCTA from "@/components/HeroCTA";
import IntelligenceTicker from "@/components/IntelligenceTicker";
import LandingTimeWidget from "@/components/LandingTimeWidget";
import AlphaVaultPreview from "@/components/AlphaVaultPreview";
import LaunchKit from "@/components/LaunchKit";
import IntelligencePipeline from "@/components/IntelligencePipeline";

export default async function HomePage() {
  return (
    <>
      <div className="w-full min-h-screen bg-[#0A0908] text-white selection:bg-[#16A34A]/30">
        {/* Section 1: Hero (full-bleed video) */}
        <GrandEntrance />
        <div className="relative z-10 border-t border-white/10 bg-[#0A0908]/95">
          <IntelligenceTicker />
        </div>

        {/* Section 2: Pain / The Shift (inline) */}
        <section className="border-b border-white/10 bg-[#0A0908] py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-black uppercase tracking-tighter text-white text-xl md:text-2xl">
              The raw truth
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 border border-white/10 rounded-lg md:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-[#0A0908] p-8 text-white/50">
                <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-white/40">
                  The amateur
                </h3>
                <p className="font-medium leading-relaxed">
                  Chase algorithms. Guess what will trend. Copy what already went
                  viral. Compete on price because you arrived late.
                </p>
              </div>
              <div className="rounded-lg border border-[#16A34A]/40 bg-[#0A0908] p-8">
                <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-[#16A34A]">
                  The intel-driven
                </h3>
                <p className="font-medium leading-relaxed text-white/70">
                  Scout before the trend peaks. Verified intelligence from
                  Korea&apos;s fastest-moving products. Get supplier contacts and
                  cost data. You move first.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Time widget */}
        <LandingTimeWidget />

        {/* Section 4: Intelligence Engine + Alpha Vault */}
        <section className="border-b border-white/10 bg-[#0A0908] py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-black uppercase tracking-tighter text-white text-xl md:text-2xl">
              The intelligence engine
            </h2>
            <p className="mt-3 max-w-xl text-white/50">
              We do the grunt work. You get the files.
            </p>
            <div className="mt-10">
              <AlphaVaultPreview />
            </div>
          </div>
        </section>

        {/* Section 5: Launch Kit */}
        <LaunchKit />

        {/* Section 6: Intelligence Pipeline */}
        <IntelligencePipeline />

        {/* Section 7: Pricing CTA */}
        <section
          id="pricing"
          className="border-b border-white/10 bg-[#0A0908] py-20 md:py-24"
        >
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="font-black uppercase tracking-tighter text-white text-xl md:text-2xl">
              Choose your intelligence level
            </h2>
            <p className="mt-4 text-white/60">
              Standard $9/mo · Alpha $29/mo · Founders DNA by application
            </p>
            <Link
              href="/pricing"
              className="mt-8 inline-block rounded-xl border border-[#16A34A]/40 bg-[#16A34A]/10 px-8 py-4 font-bold uppercase tracking-tight text-[#16A34A] transition-colors hover:bg-[#16A34A]/20"
            >
              View plans & pricing
            </Link>
          </div>
        </section>

        {/* Section 8: Final CTA */}
        <section className="border-b border-white/10 bg-[#0A0908] py-20 md:py-24">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="font-black uppercase tracking-tighter text-white text-xl">
              See the intelligence first
            </h2>
            <p className="mt-4 text-white/60">
              Sample report. No commitment. See what we deliver before you
              subscribe.
            </p>
            <div className="mt-8 flex justify-center">
              <HeroCTA />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-[#0A0908] py-8 px-6">
          <div className="mx-auto flex max-w-6xl flex-col flex-wrap items-center justify-between gap-4 sm:flex-row">
            <span className="text-center text-sm text-white/50 sm:text-left">
              © 2026 KoreaScout. All rights reserved.
            </span>
            <div className="flex gap-6">
              <Link
                href="/pricing"
                className="text-sm font-medium text-white/70 transition-colors hover:text-[#16A34A]"
              >
                Pricing
              </Link>
              <Link
                href="/sample-report"
                className="text-sm font-medium text-white/70 transition-colors hover:text-[#16A34A]"
              >
                Sample Report
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-white/70 transition-colors hover:text-[#16A34A]"
              >
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
