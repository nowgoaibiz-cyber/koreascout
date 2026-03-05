import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Pricing — KoreaScout",
  description: "Compare Free, Standard $9, and Alpha $29. Choose your intelligence level.",
};

const STANDARD_CHECKOUT_URL =
  "https://k-productscout26.lemonsqueezy.com/checkout/buy/141f6710-c704-4ab3-b7c7-f30b2c587587";
const ALPHA_CHECKOUT_URL =
  "https://k-productscout26.lemonsqueezy.com/checkout/buy/41bb4d4b-b9d6-4a60-8e19-19287c35516d";
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
  icon: string;
  rows: FeatureRow[];
};

const FEATURE_GROUPS: FeatureGroup[] = [
  {
    label: "Market Intelligence",
    icon: "📊",
    rows: [
      { feature: "Viability Score", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Competition Level", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Blue Ocean Indicator", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Margin Potential", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Search Volume", free: "—", standard: "✓", alpha: "✓" },
      { feature: "MoM / WoW Growth Rate", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Global Price Benchmark", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Analyst Brief", free: "—", standard: "✓", alpha: "✓" },
    ],
  },
  {
    label: "Global SEO & Search",
    icon: "🌍",
    rows: [
      { feature: "Social Buzz Summary", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Rising Korean Keywords", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Global SEO Keywords", free: "—", standard: "—", alpha: "✓" },
      { feature: "Viral Hashtags", free: "—", standard: "—", alpha: "✓" },
    ],
  },
  {
    label: "Sourcing & Logistics",
    icon: "🏭",
    rows: [
      { feature: "5-Step Sourcing Strategy", free: "—", standard: "Partial", alpha: "Full" },
      { feature: "HS Code + Description", free: "—", standard: "—", alpha: "✓" },
      { feature: "Verified Wholesale Cost", free: "—", standard: "—", alpha: "✓" },
      {
        feature: "Supplier Contact (Email / Phone / Web)",
        free: "—",
        standard: "—",
        alpha: "✓",
      },
      { feature: "MOQ & Lead Time", free: "—", standard: "—", alpha: "✓" },
      { feature: "Hazmat & Compliance Badge", free: "—", standard: "—", alpha: "✓" },
      {
        feature: "Broker Email Draft (HS Code & Hazmat-ready)",
        free: "—",
        standard: "—",
        alpha: "✓",
      },
      { feature: "Weight & Shipping Tier", free: "—", standard: "—", alpha: "✓" },
    ],
  },
  {
    label: "Premium Media",
    icon: "🎬",
    rows: [
      { feature: "4K Product Video", free: "—", standard: "—", alpha: "✓" },
      { feature: "Viral Short-form Video", free: "—", standard: "—", alpha: "✓" },
      { feature: "AI Landing Page", free: "—", standard: "—", alpha: "✓" },
      { feature: "Brand Marketing Assets", free: "—", standard: "—", alpha: "✓" },
    ],
  },
];

const STATS = [
  { number: "10+", label: "Verified products\nevery week" },
  { number: "12+", label: "Countries\ntrusting KoreaScout" },
  { number: "$2.30", label: "Per day for full\nmarket intelligence" },
  { number: "14 days", label: "Faster than\nfree tier access" },
];

const FAQS = [
  {
    q: "How often are new products added?",
    a: "Every Thursday. 10+ new Korean trend products drop weekly for Standard and Alpha members. Free users access the same products 14 days later.",
  },
  {
    q: "What exactly is a 'Broker Email Draft'?",
    a: "Alpha members receive a pre-written, HS Code and hazmat-compliant email template for each product — ready to send directly to customs brokers. No more guessing on compliance language.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no lock-in. Cancel from your account settings at any time.",
  },
  {
    q: "Is the wholesale cost verified?",
    a: "Alpha reports include a verified unit cost sourced directly from the manufacturer or authorized distributor — not an estimate. Where verification is pending, it is clearly marked.",
  },
];

export default async function PricingPage() {
  const alphaCount = await getAlphaMemberCount();
  const isMembershipFull = alphaCount >= ALPHA_MAX_SPOTS;
  const remainingSpots = Math.max(0, ALPHA_MAX_SPOTS - alphaCount);

  return (
    <>
      {/* SECTION 1: DARK HERO */}
      <section className="bg-[#1A1916] py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#16A34A] mb-8">
            The Global Standard for Korean Product Intelligence
          </p>
          <h1
            className="font-black text-white leading-none tracking-tighter mb-8"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              textWrap: "balance",
            } as React.CSSProperties}
          >
            Korea moves first.
            <br />
            <span className="text-[#16A34A]">We tell you what moves.</span>
          </h1>
          <p className="text-xl text-white/50 font-medium leading-relaxed max-w-2xl mx-auto">
            Weekly verified intelligence on Korea&apos;s fastest-moving products —
            before your competitors find them.
          </p>
        </div>
      </section>

      {/* SECTION 2: 3-TIER CARDS */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#9E9C98] text-center mb-16">
            Choose Your Intelligence Level
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* FREE */}
            <div className="bg-white border border-[#E8E6E1] rounded-2xl p-8 flex flex-col">
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#9E9C98] mb-6">
                  Scout Free
                </p>
                <div className="mb-2">
                  <span className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                    $0
                  </span>
                </div>
                <p className="text-sm text-[#9E9C98] font-medium mb-1">Forever free</p>
                <div className="w-8 h-px bg-[#E8E6E1] my-5" />
                <p className="text-base font-medium text-[#6B6860] leading-relaxed mb-8">
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
                  3 products/week · 14-day delayed access
                </p>
              </div>
            </div>

            {/* STANDARD */}
            <div className="bg-white border border-[#E8E6E1] rounded-2xl p-8 flex flex-col shadow-[0_4px_20px_0_rgb(26_25_22/0.08)]">
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#9E9C98] mb-6">
                  Standard
                </p>
                <div className="mb-2">
                  <span className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                    $69
                  </span>
                  <span className="text-base text-[#9E9C98] font-medium ml-2">/ month</span>
                </div>
                <p className="text-xs font-bold text-[#9E9C98] mb-1">
                  Approx. $2.30 / day
                </p>
                <div className="w-8 h-px bg-[#E8E6E1] my-5" />
                <p className="text-base font-medium text-[#6B6860] leading-relaxed mb-8">
                  The market intelligence engine
                  for serious global sellers.
                  Know what Korea is trending —
                  and exactly why it will sell.
                </p>
              </div>
              <div className="mt-auto">
                <a
                  href={STANDARD_CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3 rounded-xl border-2 border-[#1A1916] text-sm font-black text-[#1A1916] hover:bg-[#1A1916] hover:text-white transition-all"
                >
                  Start Knowing — $69/mo
                </a>
                <p className="text-xs text-[#9E9C98] text-center mt-3">
                  10+ products/week · Instant access
                </p>
              </div>
            </div>

            {/* ALPHA */}
            <div
              className="bg-[#F8F7F4] border border-[#E8E6E1] border-l-4 border-l-[#16A34A] rounded-2xl p-8 flex flex-col relative shadow-[0_4px_20px_0_rgb(22_163_74/0.1)]"
              style={{ transform: "scale(1.03)", transformOrigin: "center" }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                {isMembershipFull ? (
                  <span className="bg-[#1A1916] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap">
                    Membership Full — Waiting List Only
                  </span>
                ) : (
                  <span className="bg-[#16A34A] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap">
                    {alphaCount.toLocaleString()} / {ALPHA_MAX_SPOTS.toLocaleString()} Membership Spots
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16A34A] mb-6">
                  Alpha
                </p>
                <div className="mb-2">
                  <span className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                    $129
                  </span>
                  <span className="text-base text-[#9E9C98] font-medium ml-2">/ month</span>
                </div>
                <p className="text-xs font-bold text-[#16A34A] mb-1">
                  Approx. $4.30 / day
                </p>
                <div className="w-8 h-px bg-[#E8E6E1] my-5" />
                <p className="text-xs font-bold text-[#16A34A] mb-8">
                  EXCLUSIVE: Limited to {ALPHA_MAX_SPOTS.toLocaleString()} Global Membership Spots
                  {!isMembershipFull && (
                    <span className="text-[#9E9C98] font-medium ml-1">
                      ({remainingSpots.toLocaleString()} remaining)
                    </span>
                  )}
                </p>
                <p className="text-base font-medium text-[#6B6860] leading-relaxed mb-8">
                  Know exactly who to call.
                  Exactly what to pay.
                </p>
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
                  <a
                    href={ALPHA_CHECKOUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-3 rounded-xl bg-[#16A34A] text-white text-sm font-black hover:bg-[#15803D] transition-colors shadow-[0_4px_12px_0_rgb(22_163_74/0.3)]"
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

      {/* SECTION 3: FEATURE BREAKDOWN */}
      <section className="bg-[#F8F7F4] py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#9E9C98] text-center mb-16">
            What&apos;s Inside Every Report
          </p>
          {FEATURE_GROUPS.map((group) => (
            <div
              key={group.label}
              className="mb-8 bg-white rounded-2xl border border-[#E8E6E1] overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-[#E8E6E1] flex items-center gap-3">
                <span className="text-lg">{group.icon}</span>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#1A1916]">
                  {group.label}
                </p>
              </div>
              <div className="grid grid-cols-4 px-6 py-3 bg-[#F8F7F4] border-b border-[#E8E6E1]">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9E9C98]">
                  Feature
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9E9C98] text-center">
                  Free
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9E9C98] text-center">
                  Standard
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#16A34A] text-center border-t-2 border-[#16A34A] -mt-3 pt-3">
                  Alpha
                </p>
              </div>
              {group.rows.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-4 px-6 py-4 items-center border-b border-[#E8E6E1] last:border-0 ${
                    i % 2 === 0 ? "bg-white" : "bg-[#F8F7F4]/50"
                  }`}
                >
                  <p className="text-sm font-medium text-[#1A1916] pr-4">{row.feature}</p>
                  <p
                    className={`text-sm font-bold text-center ${
                      row.free === "✓" ? "text-[#16A34A]" : "text-[#9E9C98]"
                    }`}
                  >
                    {row.free}
                  </p>
                  <p
                    className={`text-sm font-bold text-center ${
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
          ))}
        </div>
      </section>

      {/* SECTION 4: ROI PROOF BAR */}
      <section className="bg-white border-y border-[#E8E6E1] py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat) => (
            <div key={stat.number}>
              <p className="text-3xl font-black text-[#1A1916] tracking-tighter mb-2">
                {stat.number}
              </p>
              <p className="text-xs font-medium text-[#9E9C98] leading-relaxed whitespace-pre-line">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: FAQ */}
      <section className="bg-[#F8F7F4] py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#9E9C98] text-center mb-12">
            Frequently Asked
          </p>
          {FAQS.map((item) => (
            <details key={item.q} className="border-b border-[#E8E6E1] py-5 group">
              <summary className="text-sm font-bold text-[#1A1916] cursor-pointer list-none flex items-center justify-between gap-4">
                <span>{item.q}</span>
                <ChevronDown className="w-4 h-4 text-[#9E9C98] shrink-0 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-sm text-[#6B6860] leading-relaxed mt-4 font-medium">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* SECTION 6: FINAL CTA */}
      <section className="bg-[#1A1916] py-32 px-6 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#16A34A] mb-6">
          Ready to Scout?
        </p>
        <h2
          className="font-black text-white leading-none tracking-tighter mb-10"
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            textWrap: "balance",
          } as React.CSSProperties}
        >
          Your competitors are sourcing from Korea.
          <br />
          <span className="text-[#16A34A]">Are you?</span>
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <a
            href={isMembershipFull ? "/waitlist" : ALPHA_CHECKOUT_URL}
            {...(isMembershipFull
              ? {}
              : { target: "_blank", rel: "noopener noreferrer" })}
            className="px-10 py-4 bg-[#16A34A] text-white rounded-xl font-black text-base hover:bg-[#15803D] transition-colors shadow-[0_4px_20px_0_rgb(22_163_74/0.4)]"
          >
            {isMembershipFull ? "Join Alpha Waiting List" : "Go Alpha — $129/mo"}
          </a>
          <a
            href={STANDARD_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 border border-white/30 text-white rounded-xl font-bold text-base hover:border-white/60 transition-colors"
          >
            Start with Standard — $69/mo
          </a>
        </div>
        <p className="text-xs text-white/30 font-medium">
          No contracts · Cancel anytime · Instant access
        </p>
      </section>
    </>
  );
}
