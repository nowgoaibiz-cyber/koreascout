"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type FaqItem = { q: string; a: string };
type FaqCategory = { id: string; label: string; subtitle: string; items: FaqItem[] };

const FAQ_DATA: FaqCategory[] = [
  {
    id: "data-strategy",
    label: "Data & Strategy",
    subtitle: "Is this actually different from Jungle Scout?",
    items: [
      {
        q: "How is KoreaScout different from Jungle Scout or Helium 10?",
        a: "Jungle Scout and Helium 10 tell you what's already selling on Amazon — meaning by the time you act, the margin is gone. KoreaScout operates 4–6 weeks upstream, inside the Korean market where trends are born. We scan TikTok Korea, Instagram Korea, Hwahae, Glowpick, Olive Young, Chicor, and Naver Data Lab — then cross-reference against Amazon's existing catalog to find the gap. You're not chasing demand. You're arriving before it.",
      },
      {
        q: "How fresh is the intelligence?",
        a: "Every report is compiled weekly, with source data refreshed within 72 hours of publication. Trend velocity scores (Gap Index, Platform Velocity) are calculated at the time of report generation — not recycled from a static database. You get the market as it exists right now, not last quarter.",
      },
      {
        q: "What is the Gap Index?",
        a: "The Gap Index is KoreaScout's proprietary scoring metric. It measures the spread between a product's Korean demand momentum and its current global supply footprint across Amazon US, Amazon EU, and Shopify. A high Gap Index means the product is buzzing in Korea but has virtually no established competition globally — that's your entry window. Products with a low Gap Index are filtered out before they reach your report.",
      },
      {
        q: "Can I trust AI-generated product research?",
        a: "KoreaScout is not a prompt-to-output AI tool. Our pipeline is: signal collection → AI pre-filtering → human verification → compliance check → report. Every product that reaches your report has been cross-verified across multiple Korean demand sources for market viability. The AI eliminates noise. The data verifies the signal.",
      },
      {
        q: "How many products do I get each week?",
        a: "Every week, KoreaScout publishes 10+ curated K-products. Standard and Alpha members get instant access to the latest 3 weeks — that's 30+ verified products from day one. Free members get access to one unlocked week with a 14-day delay. Every product in your report has cleared our Margin Multiplier threshold and passed multi-source Korean demand verification.",
      },
    ],
  },
  {
    id: "sourcing-logistics",
    label: "Sourcing & Logistics",
    subtitle: "I don't speak Korean. How does this help me actually source?",
    items: [
      {
        q: "What about customs and import regulations? I've been burned before.",
        a: "Each Alpha report includes the estimated HS Code for US and EU import classification, along with hazmat status and key compliance flags (FDA MoCRA, CPNP, ingredient screening). This is reference intelligence — not legal advice. Use it to have an informed conversation with your customs broker before you commit to a shipment. The goal is no surprises at the border.",
      },
      {
        q: "Is the supplier information verified or just scraped?",
        a: "Alpha reports include manufacturer name, contact information, and sourcing reference links sourced from Korean B2B databases and verified product listings. We provide the lead — direct outreach and negotiation is yours to own. Supplier responsiveness and MOQ terms vary by manufacturer and are subject to change.",
      },
      {
        q: "Can KoreaScout help me with logistics after sourcing?",
        a: "KoreaScout is an intelligence platform, not a freight forwarder. We give you the product intelligence, compliance reference data, and supplier contact. Your existing freight partner handles the shipment. We are the 60-second decision, not the 3-month supply chain.",
      },
    ],
  },
  {
    id: "alpha-membership",
    label: "Alpha Membership",
    subtitle: "Why is there a 3,000 member cap? Sounds like a sales tactic.",
    items: [
      {
        q: "Why is Alpha limited to 3,000 members?",
        a: "This is a structural decision, not a marketing gimmick. Each Alpha product report includes direct factory contacts and MOQ pricing. If 10,000 sellers receive the same supplier contact simultaneously, the factory gets overwhelmed, MOQs increase, and pricing negotiation leverage disappears. 3,000 is the ceiling at which our intelligence retains its commercial value. When that ceiling is hit, Alpha closes. This protects your investment, not ours.",
      },
      {
        q: "Why does Alpha cost $129/mo when Standard is $69/mo?",
        a: "Standard gives you the full trend intelligence layer: Gap Index, Margin Multiplier, Platform Velocity, Growth Signal. That alone replaces 58 hours of manual sourcing research per month. Alpha adds the action layer: verified factory contacts, MOQ + EXW pricing, HS Code reference, compliance flags, 4K On-Site Sourcing Footage (Raw), SEO keywords, and a broker email draft. The $60 difference buys you a complete sourcing brief — ready to act on, not just read. If your average margin is $8/unit and you source 200 units from one Alpha-sourced product, that's $1,600 gross from a $129 subscription. The math works on the first product.",
      },
      {
        q: "Can I upgrade from Standard to Alpha later?",
        a: "Yes, anytime. When you upgrade, you pay only the price difference — your existing Standard subscription credit is applied. Alpha access opens immediately upon payment. No waiting, no new billing cycle.",
      },
      {
        q: "What if Alpha is sold out when I'm ready to upgrade?",
        a: "Alpha membership is capped at 3,000 seats globally. If the cap is reached, the upgrade option closes and you join a waitlist. Standard members are given priority notification before public waitlist openings. This is the only honest answer: don't wait if you're considering it.",
      },
    ],
  },
  {
    id: "trust-risk",
    label: "Trust & Risk Reversal",
    subtitle: "Who are you, and what happens if I hate it?",
    items: [
      {
        q: "Who is behind KoreaScout's intelligence?",
        a: "KoreaScout is built by a team with direct operational experience inside Korea's most aggressive e-commerce environment. Our lead operator spent years at Coupang — Korea's Amazon equivalent — where product velocity, logistics optimization, and competitive intelligence were not academic concepts but daily execution requirements. We didn't study the Korean market. We ran inside it.",
      },
      {
        q: "Why should I trust your data over doing my own research?",
        a: "You can do your own research. It will take approximately 58 hours per month — cross-referencing Korean social platforms, translating product listings, verifying supplier reliability, checking HS codes, and estimating landed costs. KoreaScout compresses that into 60 seconds of reading. The question isn't whether you trust our data. It's whether your time is worth $69/month.",
      },
      {
        q: "What is your refund policy?",
        a: "KoreaScout does not offer refunds after purchase. Here's why: the moment you access a weekly intelligence report, that information has commercial value — you now know what products are trending in Korea before most global sellers do. That knowledge cannot be returned. Unlike a SaaS tool you might not use, our intelligence is an asset the moment it's delivered. This is exactly why we offer a permanent free plan and a full sample report before you pay a single dollar. We want you to be certain before you commit — not after.",
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes. One click, no forms, no calls. Before you cancel — know this: your KoreaScout vault is cumulative. Every week you're subscribed, your accessible report library grows. When you cancel, you lose access to all previously unlocked reports. If you resubscribe later, your vault does not restore — you start fresh from the new subscription date only. Cancellation simply stops the next charge. Your current paid period remains fully active until the last day.",
      },
      {
        q: "Is my payment information secure?",
        a: "All billing is processed through LemonSqueezy, a global Merchant of Record that handles payment processing, VAT/GST compliance, and fraud protection across 100+ countries. KoreaScout never stores your card information. LemonSqueezy is the same infrastructure used by thousands of SaaS products globally. Your payment data never touches our servers.",
      },
      {
        q: "What if I start on Standard and want to downgrade or cancel?",
        a: "Downgrade and cancellation both take effect at your next billing date. Until then, you keep every feature you're currently paying for. We don't claw back access early. What you paid for, you use in full.",
      },
    ],
  },
];

const INITIAL_CATEGORY_LABEL = "Data & Strategy";

/** Min height so section doesn't jump when switching categories (Trust has 6 items). */
const ACCORDION_MIN_H = "min-h-[520px]";

export default function FaqAccordion() {
  const [activeCategoryLabel, setActiveCategoryLabel] = useState<string>(INITIAL_CATEGORY_LABEL);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const activeCategory = FAQ_DATA.find((c) => c.label === activeCategoryLabel) ?? FAQ_DATA[0];

  const handleCategoryClick = (label: string) => {
    if (label === activeCategoryLabel) return;
    setActiveCategoryLabel(label);
    setOpenIndex(null);
  };

  const activeNavClasses = (isActive: boolean) =>
    isActive
      ? "border-[#16A34A] text-[#16A34A] bg-black/5"
      : "border-transparent text-black/40 hover:text-black/60 hover:bg-black/[0.03]";

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-16 relative" role="region" aria-label="FAQ">
      {/* Mobile: Horizontal scroll tabs above the list */}
      <div className="md:hidden overflow-x-auto -mx-6 px-6" style={{ WebkitOverflowScrolling: "touch" }}>
        <div className="flex gap-1 min-w-max pb-1">
          {FAQ_DATA.map((cat) => {
            const isActive = activeCategoryLabel === cat.label;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.label)}
                className={`shrink-0 text-left py-2.5 px-4 rounded-md border-l-2 transition-colors text-sm font-medium ${activeNavClasses(isActive)}`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: Left category nav (sticky; stops when this FAQ grid scrolls out) */}
      <aside className="hidden md:block w-44 shrink-0 self-start" aria-label="FAQ categories">
        <nav className="sticky top-24">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 mb-4">
            Categories
          </p>
          <ul className="space-y-1">
            {FAQ_DATA.map((cat) => {
              const isActive = activeCategoryLabel === cat.label;
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(cat.label)}
                    className={`w-full text-left py-3 pl-3 pr-2 rounded-r-md border-l-2 transition-colors text-sm font-medium ${activeNavClasses(isActive)}`}
                  >
                    {cat.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Right: Only active category — AnimatePresence for fade + y offset */}
      <div className={`flex-1 min-w-0 ${ACCORDION_MIN_H} flex flex-col`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeCategoryLabel}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col flex-1"
          >
            <p className="text-sm font-bold text-[#16A34A] uppercase tracking-widest mb-5">
              {activeCategory.label}
            </p>

            <div className="space-y-0 border-t border-black/5 flex-1">
              {activeCategory.items.map((faq, itemIdx) => {
                const isOpen = openIndex === itemIdx;
                return (
                  <div
                    key={`${activeCategory.id}-${itemIdx}`}
                    className="border-b border-black/5 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : itemIdx)}
                      className="w-full flex items-center justify-between gap-4 text-left group py-5"
                      aria-expanded={isOpen}
                    >
                      <span className="text-lg md:text-xl font-bold text-black pr-4">
                        {faq.q}
                      </span>
                      <span
                        className={`shrink-0 transition-transform duration-300 ease-out ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                        aria-hidden
                      >
                        <ChevronDown className="w-5 h-5 text-black/50 group-hover:text-black/70" />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="text-base text-black/60 leading-relaxed pb-5 pl-0 pr-8">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
