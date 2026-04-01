import type { Metadata } from "next";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { PRICING } from "@/src/config/pricing";
import CheckoutButton from "@/components/CheckoutButton";

export const metadata: Metadata = {
  title: "Pricing — KoreaScout",
  description: `Compare Free, Standard ${PRICING.CURRENCY}${PRICING.STANDARD.monthly}, and Alpha ${PRICING.CURRENCY}${PRICING.ALPHA.monthly}. Choose your intelligence level.`,
};

const STANDARD_CHECKOUT_URL =
  "https://getkoreascout.lemonsqueezy.com/checkout/buy/e9701b40-aad3-446e-b00a-617d0159d501";
const ALPHA_CHECKOUT_URL =
  "https://getkoreascout.lemonsqueezy.com/checkout/buy/936321c8-fba1-4f88-bb30-8865c8006fac";
const ALPHA_MAX_SPOTS = 3000;

async function getAlphaMemberCount(): Promise<number> {
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

type FeatureRow = {
  feature: string;
  free: string;
  standard: string;
  alpha: string;
};
type FeatureGroup = {
  label: string;
  rows: FeatureRow[];
};

const FEATURE_GROUPS: FeatureGroup[] = [
  {
    label: "Product Identity",
    rows: [
      { feature: "Product Profile & Selective Tier Badges", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Strategic Viability & Trend Insights", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Real-time Retail Price & FX Tracker", free: "✓", standard: "✓", alpha: "✓" },
    ],
  },
  {
    label: "Trend Signal Dashboard",
    rows: [
      { feature: "Proprietary Market Score", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Competition Level Indicator", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Opportunity Status", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Real-time Growth Momentum", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Cross-Platform Vitality (TikTok, IG, YT)", free: "✓", standard: "✓", alpha: "✓" },
    ],
  },
  {
    label: "Market Intelligence",
    rows: [
      { feature: "Global Market Availability (6 Regions)", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Search Volume & Growth (MoM/WoW)", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Margin Potential Multiplier", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Strategic Valuation & Global Price Benchmarks", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Analyst Brief (Edge & Risk Factors)", free: "—", standard: "✓", alpha: "✓" },
    ],
  },
  {
    label: "Social Proof & Trend Intelligence",
    rows: [
      { feature: "Korea Gap Index™", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Social Buzz & Sentiment Analysis", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Rising Korean Keywords (KR)", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Global SEO Actionable Keywords", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Viral Hashtag Strategy", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Scout Strategy Report", free: "—", standard: "—", alpha: "✓" },
    ],
  },
  {
    label: "Export & Logistics Intelligence",
    rows: [
      { feature: "Export Readiness & Market Moat", free: "—", standard: "—", alpha: "✓" },
      { feature: "Required Certifications (FDA, CPNP, etc.)", free: "—", standard: "—", alpha: "✓" },
      { feature: "Hazmat Status & Full Ingredient List", free: "—", standard: "—", alpha: "✓" },
      { feature: "Logistics Dashboard (Actual / Vol / Billable Weight)", free: "—", standard: "—", alpha: "✓" },
      { feature: "Shipping Notes & Carrier Strategy", free: "—", standard: "—", alpha: "✓" },
      { feature: "HS Code & Broker Email Draft", free: "—", standard: "—", alpha: "✓" },
      { feature: "Compliance & Logistics Strategy", free: "—", standard: "—", alpha: "✓" },
    ],
  },
  {
    label: "Launch & Execution Kit",
    rows: [
      { feature: "Verified Cost Per Unit & MOQ", free: "—", standard: "—", alpha: "✓" },
      { feature: "Est. Production Lead Time", free: "—", standard: "—", alpha: "✓" },
      { feature: "Sample Policy & Distribution Rights", free: "—", standard: "—", alpha: "✓" },
      { feature: "Supplier Contact (Email, Phone, Web)", free: "—", standard: "—", alpha: "✓" },
      { feature: "Direct Wholesale Portal Link", free: "—", standard: "—", alpha: "✓" },
      { feature: "Global Market Proof Links", free: "—", standard: "—", alpha: "✓" },
      { feature: "Viral Hook Reference (Success Cases)", free: "—", standard: "—", alpha: "✓" },
      { feature: "4K On-Site Sourcing Footage (Raw)", free: "—", standard: "—", alpha: "✓" },
    ],
  },
];

export default async function PricingPage() {
  const alphaCount = await getAlphaMemberCount();
  const isMembershipFull = alphaCount >= ALPHA_MAX_SPOTS;
  const remainingSpots = Math.max(0, ALPHA_MAX_SPOTS - alphaCount);

  return (
    <>
      {/* S1: DARK HERO */}
      <section className="bg-[#1A1916] py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center text-center w-full mb-12 px-4 md:px-8">
            <p className="text-xs font-bold tracking-[0.08em] uppercase text-[#16A34A] mb-6">
              THE GLOBAL STANDARD FOR KOREAN PRODUCT INTELLIGENCE
            </p>
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] flex flex-col items-center text-center max-w-full">
              <span className="text-[#F8F7F4] block max-w-full">The Price of Knowing Early.</span>
              <span className="text-[#16A34A] block max-w-full">The Cost of Finding Out Late.</span>
            </h1>
          </div>
          <p className="text-sm md:text-base text-white/50 font-medium leading-relaxed max-w-2xl mx-auto px-4">
            Weekly verified intelligence on Korea&apos;s fastest-moving products —
            before your competitors find them.
          </p>
        </div>
      </section>

      {/* S2: 3-TIER CARDS */}
      <section id="pricing-cards" className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
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
                  See what KoreaScout finds.
                  Before you commit.
                </p>
              </div>
              <div className="mt-auto">
                <a
                  href="/signup"
                  className="block w-full text-center py-3 rounded-xl border-2 border-[#1A1916] text-sm font-black text-[#1A1916] hover:bg-[#1A1916] hover:text-white transition-all"
                >
                  Unlock Free Intelligence
                </a>
                <p className="text-xs text-[#9E9C98] text-center mt-3">
                  10+ products · 1 week unlocked · 14-day delay
                </p>
              </div>
            </div>

            {/* STANDARD */}
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
                  The market intelligence engine
                  for serious global sellers.
                  Know what Korea is trending —
                  and exactly why it will sell.
                </p>
              </div>
              <div className="mt-auto">
                <CheckoutButton
                  checkoutUrl={STANDARD_CHECKOUT_URL}
                  className="block w-full text-center py-3 rounded-xl border-2 border-[#1A1916] text-sm font-black text-[#1A1916] hover:bg-[#1A1916] hover:text-white transition-all"
                >
                  Start Knowing — {PRICING.CURRENCY}{PRICING.STANDARD.monthly}/mo
                </CheckoutButton>
                <p className="text-xs text-[#9E9C98] text-center mt-3">
                  30+ products · Last 3 weeks · Instant access
                </p>
              </div>
            </div>

            {/* ALPHA */}
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
                  Know exactly who to call.
                  Exactly what to pay.
                </p>
                {!isMembershipFull && (
                  <p className="mt-4 text-xs font-bold text-[#16A34A]">
                    EXCLUSIVE: Limited to {ALPHA_MAX_SPOTS.toLocaleString()} Global Membership Spots ({remainingSpots.toLocaleString()} remaining)
                  </p>
                )}
              </div>
              <div className="mt-auto">
                {isMembershipFull ? (
                  <a
                    href="/waitlist"
                    className="block w-full text-center py-3 rounded-xl bg-[#1A1916] text-white text-sm font-black hover:bg-[#2D2B26] transition-colors"
                  >
                    Join the Waiting List
                  </a>
                ) : (
                  <CheckoutButton
                    checkoutUrl={ALPHA_CHECKOUT_URL}
                    className="block w-full text-center py-3 rounded-xl bg-[#16A34A] text-white text-sm font-black hover:bg-[#15803D] transition-colors shadow-[0_4px_12px_0_rgb(22_163_74/0.3)]"
                  >
                    Go Alpha — {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo
                  </CheckoutButton>
                )}
                <p className="text-xs text-[#9E9C98] text-center mt-3">
                  30+ products · Last 3 weeks · Full sourcing intel
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* S3: ALPHA MOAT */}
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
          {!isMembershipFull && (
            <div className="mt-8 flex items-center gap-3">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#16A34A] shadow-[0_0_10px_2px_rgba(22,163,74,0.9)]" />
              </span>
              <p className="text-xl md:text-2xl font-black text-[#16A34A]">
                {remainingSpots.toLocaleString()} of {ALPHA_MAX_SPOTS.toLocaleString()} spots remaining
              </p>
            </div>
          )}
        </div>
      </section>

      {/* S4: FEATURE BREAKDOWN (no emoji, text-base rows) */}
      <section className="bg-[#F8F7F4] py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-black text-[#1A1916] tracking-tighter uppercase text-center mb-16 text-xl text-balance">
            What&apos;s Inside Every Report
          </h2>
          {FEATURE_GROUPS.map((group) => (
            <div key={group.label} className="mb-8">
              <div className="bg-white rounded-2xl border border-[#E8E6E1] overflow-hidden">
              <div className="px-3 py-3 border-b border-[#E8E6E1]">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#1A1916]">
                  {group.label}
                </p>
              </div>
              <div className="grid grid-cols-4 px-2 py-3 bg-[#F8F7F4] border-b border-[#E8E6E1]">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9E9C98]">
                  Feature
                </p>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9E9C98] text-center">
                  Free
                </p>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9E9C98] text-center">
                  Standard
                </p>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#16A34A] text-center pt-1">
                  Alpha
                </p>
              </div>
              {group.rows.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-4 px-2 py-4 items-center border-b border-[#E8E6E1] last:border-0 ${
                    i % 2 === 0 ? "bg-white" : "bg-[#F8F7F4]/50"
                  }`}
                >
                  <p className="text-xs font-medium text-[#1A1916] pr-1 leading-snug">
                    {row.feature}
                  </p>
                  <p
                    className={`text-xs font-bold text-center ${
                      row.free === "✓" ? "text-[#16A34A]" : "text-[#9E9C98]"
                    }`}
                  >
                    {row.free}
                  </p>
                  <p
                    className={`text-xs font-bold text-center ${
                      row.standard === "✓" ? "text-[#16A34A]" : "text-[#9E9C98]"
                    }`}
                  >
                    {row.standard}
                  </p>
                  <p
                    className={`text-sm font-black text-center ${
                      row.alpha === "✓" || row.alpha === "Full"
                        ? "text-[#16A34A]"
                        : "text-[#1A1916]"
                    }`}
                  >
                    {row.alpha}
                  </p>
                </div>
              ))}
              </div>
            </div>
          ))}
          <p className="text-[11px] md:text-xs text-[#8A8884] mt-6 italic text-center max-w-3xl mx-auto leading-relaxed">
            * Note: Certain supplier information in the Alpha tier may be redacted or undisclosed depending on strict manufacturer confidentiality policies.
          </p>
        </div>
      </section>

      {/* S6: FINAL FOMO HOOK (FAQ 제거) */}
      <section className="bg-[#1A1916] py-32 px-6 text-center">
        <div className="mt-6 mb-20 text-center flex flex-col items-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#16A34A] mb-6">
            THE CLOCK IS RUNNING
          </p>
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <p className="text-lg md:text-2xl text-gray-400 font-medium leading-relaxed">
              You just saw the complete blueprint. From trend signals<br className="hidden md:block" />
              to direct supplier contacts—
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] flex flex-col items-center">
              <span className="text-[#F8F7F4] block">Unlock the entire intelligence pipeline.</span>
              <span className="text-[#16A34A] block mt-1 md:mt-2">For under {PRICING.CURRENCY}{PRICING.ALPHA.marketingDailyLimit.toFixed(2)} a day.</span>
            </h2>
          </div>
        </div>
        {!isMembershipFull && (
          <div className="flex items-center justify-center gap-2 mb-10">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#16A34A] shadow-[0_0_10px_2px_rgba(22,163,74,0.9)]" />
            </span>
            <p className="text-base font-black text-[#16A34A]">
              {remainingSpots.toLocaleString()} of {ALPHA_MAX_SPOTS.toLocaleString()} Alpha spots remaining
            </p>
          </div>
        )}
        <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <CheckoutButton
              checkoutUrl={STANDARD_CHECKOUT_URL}
              className="w-full text-center py-4 border border-white/30 text-white rounded-xl font-bold text-base hover:border-white/60 transition-colors"
            >
              Start with Standard — {PRICING.CURRENCY}{PRICING.STANDARD.monthly}/mo
            </CheckoutButton>
            {isMembershipFull ? (
              <a
                href="/waitlist"
                className="w-full text-center py-4 bg-[#1A1916] text-white rounded-xl font-black text-base hover:bg-[#2D2B26] transition-colors"
              >
                Join Alpha Waiting List
              </a>
            ) : (
              <CheckoutButton
                checkoutUrl={ALPHA_CHECKOUT_URL}
                className="w-full text-center py-4 bg-[#16A34A] text-white rounded-xl font-black text-base hover:bg-[#15803D] shadow-[0_4px_20px_0_rgb(22_163_74/0.4)] transition-colors"
              >
                Go Alpha — {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo
              </CheckoutButton>
            )}
          </div>
        </div>
        <p className="text-xs text-white/30 font-medium">
          No contracts · Cancel anytime · Instant access
        </p>
      </section>
    </>
  );
}
