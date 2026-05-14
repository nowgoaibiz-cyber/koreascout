import type { Metadata } from "next";
import { PRICING } from "@/src/config/pricing";
import CheckoutButton from "@/components/CheckoutButton";

export const metadata: Metadata = {
  title: "Pricing — KoreaScout",
  description: `Compare Free, Alpha ${PRICING.CURRENCY}${PRICING.ALPHA.monthly}, and Alpha+ ${PRICING.CURRENCY}${PRICING.ALPHA_PLUS.monthly}. Choose your intelligence level.`,
};

const STANDARD_CHECKOUT_URL =
  "https://getkoreascout.lemonsqueezy.com/checkout/buy/e9701b40-aad3-446e-b00a-617d0159d501";

type FeatureRow = {
  feature: string;
  free: string;
  alpha: string;
  alphaPlus: string;
};
type FeatureGroup = {
  label: string;
  rows: FeatureRow[];
};

const FEATURE_GROUPS: FeatureGroup[] = [
  {
    label: "Product Identity",
    rows: [
      { feature: "Product Profile & Selective Tier Badges", free: "✓", alpha: "✓", alphaPlus: "✓" },
      { feature: "Strategic Viability & Trend Insights", free: "✓", alpha: "✓", alphaPlus: "✓" },
      { feature: "Real-time Retail Price & FX Tracker", free: "✓", alpha: "✓", alphaPlus: "✓" },
    ],
  },
  {
    label: "Trend Signal Dashboard",
    rows: [
      { feature: "Proprietary Market Score", free: "✓", alpha: "✓", alphaPlus: "✓" },
      { feature: "Competition Level Indicator", free: "✓", alpha: "✓", alphaPlus: "✓" },
      { feature: "Opportunity Status", free: "✓", alpha: "✓", alphaPlus: "✓" },
      { feature: "Real-time Growth Momentum", free: "✓", alpha: "✓", alphaPlus: "✓" },
      { feature: "Cross-Platform Vitality (TikTok, IG, YT)", free: "✓", alpha: "✓", alphaPlus: "✓" },
    ],
  },
  {
    label: "Market Intelligence",
    rows: [
      { feature: "Global Market Availability (6 Regions)", free: "—", alpha: "✓", alphaPlus: "✓" },
      { feature: "Search Volume & Growth (MoM/WoW)", free: "—", alpha: "✓", alphaPlus: "✓" },
      { feature: "Margin Potential Multiplier", free: "—", alpha: "✓", alphaPlus: "✓" },
      { feature: "Strategic Valuation & Global Price Benchmarks", free: "—", alpha: "✓", alphaPlus: "✓" },
      { feature: "Analyst Brief (Edge & Risk Factors)", free: "—", alpha: "✓", alphaPlus: "✓" },
    ],
  },
  {
    label: "Social Proof & Trend Intelligence",
    rows: [
      { feature: "Korea Gap Index™", free: "—", alpha: "✓", alphaPlus: "✓" },
      { feature: "Social Buzz & Sentiment Analysis", free: "—", alpha: "✓", alphaPlus: "✓" },
      { feature: "Rising Korean Keywords (KR)", free: "—", alpha: "✓", alphaPlus: "✓" },
      { feature: "Global SEO Actionable Keywords", free: "—", alpha: "✓", alphaPlus: "✓" },
      { feature: "Viral Hashtag Strategy", free: "—", alpha: "✓", alphaPlus: "✓" },
      { feature: "Scout Strategy Report", free: "—", alpha: "—", alphaPlus: "✓" },
    ],
  },
  {
    label: "Export & Logistics Intelligence",
    rows: [
      { feature: "Export Readiness & Market Moat", free: "—", alpha: "—", alphaPlus: "✓" },
      { feature: "Required Certifications (FDA, CPNP, etc.)", free: "—", alpha: "—", alphaPlus: "✓" },
      { feature: "Hazmat Status & Full Ingredient List", free: "—", alpha: "—", alphaPlus: "✓" },
      { feature: "Logistics Dashboard (Actual / Vol / Billable Weight)", free: "—", alpha: "—", alphaPlus: "✓" },
      { feature: "Shipping Notes & Carrier Strategy", free: "—", alpha: "—", alphaPlus: "✓" },
      { feature: "HS Code & Broker Email Draft", free: "—", alpha: "—", alphaPlus: "✓" },
      { feature: "Compliance & Logistics Strategy", free: "—", alpha: "—", alphaPlus: "✓" },
    ],
  },
  {
    label: "Launch & Execution Kit",
    rows: [
      { feature: "Verified Cost Per Unit & MOQ", free: "—", alpha: "—", alphaPlus: "✓" },
      { feature: "Est. Production Lead Time", free: "—", alpha: "—", alphaPlus: "✓" },
      { feature: "Sample Policy & Distribution Rights", free: "—", alpha: "—", alphaPlus: "✓" },
      { feature: "Supplier Contact (Email, Phone, Web)", free: "—", alpha: "—", alphaPlus: "✓" },
      { feature: "Direct Wholesale Portal Link", free: "—", alpha: "—", alphaPlus: "✓" },
      { feature: "Global Market Proof Links", free: "—", alpha: "—", alphaPlus: "✓" },
      { feature: "Viral Hook Reference (Success Cases)", free: "—", alpha: "—", alphaPlus: "✓" },
      { feature: "4K On-Site Sourcing Footage (Raw)", free: "—", alpha: "—", alphaPlus: "✓" },
    ],
  },
];

export default function PricingPage() {
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
                  <span className="font-medium">Access 1 sample report — no credit card required.</span>
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
                  1 sample report · free forever · no card needed
                </p>
              </div>
            </div>

            {/* ALPHA */}
            <div className="bg-white border border-[#E8E6E1] rounded-2xl flex flex-col h-full p-8 md:p-12 shadow-[0_4px_20px_0_rgb(26_25_22/0.08)]">
              <div className="min-h-[100px]">
                <p className="text-3xl md:text-4xl font-black text-[#1A1916] tracking-tighter leading-none mb-8">
                  Alpha
                </p>
                <div className="mb-1">
                  <span className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                    {PRICING.CURRENCY}{PRICING.ALPHA.monthly}
                  </span>
                  <span className="text-base text-[#9E9C98] font-medium ml-2">/ month</span>
                </div>
                <p className="text-xs font-bold text-[#9E9C98] mb-1">
                  Approx. {PRICING.CURRENCY}{PRICING.ALPHA.daily.toFixed(2)} / day
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
                  Join Alpha — {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo
                </CheckoutButton>
                <p className="text-xs text-[#9E9C98] text-center mt-3">
                  30+ products · Last 3 weeks · Instant access
                </p>
              </div>
            </div>

            {/* Alpha+ Card - Coming Soon */}
            <div
              className="relative rounded-2xl border-2 border-green-600 bg-white p-8 md:p-12 shadow-xl flex flex-col h-full"
              style={{ transform: "scale(1.03)", transformOrigin: "center" }}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div
                  className="rotate-[-15deg] border-4 border-gray-400/40 bg-gray-100/80 px-12 py-6 rounded-lg"
                  style={{
                    letterSpacing: "0.15em",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  <span className="text-4xl font-black text-gray-500/60 tracking-wider">
                    COMING SOON
                  </span>
                </div>
              </div>

              <div className="opacity-60 flex flex-col flex-grow">
                <div className="mb-6">
                  <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tighter">Alpha+</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl md:text-6xl font-black text-gray-900 leading-none tracking-tighter">
                      {PRICING.CURRENCY}{PRICING.ALPHA_PLUS.monthly}
                    </span>
                    <span className="text-base text-gray-600 font-medium">/ month</span>
                  </div>
                  <p className="text-xs font-bold text-gray-500">
                    Approx. {PRICING.CURRENCY}{PRICING.ALPHA_PLUS.daily.toFixed(2)} / day
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 min-h-[120px] flex items-center mb-8">
                  <div>
                    <div className="font-semibold text-green-900 mb-2 text-sm uppercase tracking-wide">
                      EVERYTHING IN ALPHA, PLUS:
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Advanced B2B sourcing intelligence, priority 1:1 support, early access to new features, and
                      exclusive market insights.
                    </p>
                  </div>
                </div>

                <p className="text-base text-gray-600 leading-relaxed mb-8">
                  The ultimate edge for high-volume sellers. Reserved for our most committed members.
                </p>
              </div>

              <a
                href="/waitlist"
                className="block w-full bg-gray-800 hover:bg-gray-900 text-white text-center px-8 py-4 rounded-lg font-semibold text-lg transition-colors relative z-20 mt-auto"
              >
                Join Waitlist →
              </a>
              <p className="text-center text-sm text-gray-500 mt-4 relative z-20">Be the first to know when Alpha+ launches</p>
            </div>
          </div>
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
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9E9C98] border-t-2 border-transparent pt-3">
                  Feature
                </p>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9E9C98] text-center border-t-2 border-transparent pt-3">
                  Free
                </p>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9E9C98] text-center border-t-2 border-transparent pt-3">
                  Alpha
                </p>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#16A34A] text-center border-t-2 border-[#16A34A] pt-3">
                  Alpha+
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
                      row.alpha === "✓" ? "text-[#16A34A]" : "text-[#9E9C98]"
                    }`}
                  >
                    {row.alpha}
                  </p>
                  <p
                    className={`text-sm font-black text-center ${
                      row.alphaPlus === "✓" || row.alphaPlus === "Full"
                        ? "text-[#16A34A]"
                        : "text-[#1A1916]"
                    }`}
                  >
                    {row.alphaPlus}
                  </p>
                </div>
              ))}
              </div>
            </div>
          ))}
          <p className="text-[11px] md:text-xs text-[#8A8884] mt-6 italic text-center max-w-3xl mx-auto leading-relaxed">
            * Note: Certain supplier information in the Alpha+ tier may be redacted or undisclosed depending on strict manufacturer confidentiality policies.
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
              <span className="text-[#16A34A] block mt-1 md:mt-2">For under {PRICING.CURRENCY}{PRICING.ALPHA_PLUS.marketingDailyLimit.toFixed(2)} a day.</span>
            </h2>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <CheckoutButton
              checkoutUrl={STANDARD_CHECKOUT_URL}
              className="w-full text-center py-4 border border-white/30 text-white rounded-xl font-bold text-base hover:border-white/60 transition-colors"
            >
              Join Alpha — {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo
            </CheckoutButton>
            <a
              href="/waitlist"
              className="w-full text-center py-4 bg-[#1A1916] text-white rounded-xl font-black text-base hover:bg-[#2D2B26] transition-colors"
            >
              Join Alpha+ Waitlist →
            </a>
          </div>
        </div>
        <p className="text-xs text-white/30 font-medium">
          No contracts · Cancel anytime · Instant access
        </p>
      </section>
    </>
  );
}
