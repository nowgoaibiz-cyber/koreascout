## 1. FaqAccordion 컴포넌트 파일 위치 확인

Requested command:
`find . -name "FaqAccordion*" -not -path "*/node_modules/*"`

Output:
```text
<workspace_result workspace_path="c:\k-productscout">
.\app\page.tsx
.\_docs\section-order-audit2.md
.\_docs\timewidget-audit.md
.\_docs\_file_tree_naver_audit.txt
.\_docs\NAVER_PRODUCT_NAME_IMPLEMENTATION_AUDIT.md
.\scan_result.md
.\scan_result2.md
.\PRINT_CSS_AUDIT.md
.\components\FaqAccordion.tsx
.\_docs\standard\PROJECT_2STATUS.md
</workspace_result>
```

## 2. FaqAccordion.tsx 전체 내용 출력

Requested command:
`cat components/FaqAccordion.tsx`

Output:
```text
L1:"use client";
L2:
L3:import { useState } from "react";
L4:import { motion, AnimatePresence } from "framer-motion";
L5:import { ChevronDown } from "lucide-react";
L6:
L7:type FaqItem = { q: string; a: string };
L8:type FaqCategory = { id: string; label: string; subtitle: string; items: FaqItem[] };
L9:
L10:const FAQ_DATA: FaqCategory[] = [
L11:  {
L12:    id: "data-strategy",
L13:    label: "Data & Strategy",
L14:    subtitle: "Is this actually different from Jungle Scout?",
L15:    items: [
L16:      {
L17:        q: "How is KoreaScout different from Jungle Scout or Helium 10?",
L18:        a: "Jungle Scout and Helium 10 tell you what's already selling on Amazon — meaning by the time you act, the margin is gone. KoreaScout operates 4–6 weeks upstream, inside the Korean market where trends are born. We scan TikTok Korea, Instagram Korea, Hwahae, Glowpick, Olive Young, Chicor, and Naver Data Lab — then cross-reference against Amazon's existing catalog to find the gap. You're not chasing demand. You're arriving before it.",
L19:      },
L20:      {
L21:        q: "How fresh is the intelligence?",
L22:        a: "Every report is compiled weekly, with source data refreshed within 72 hours of publication. Trend velocity scores (Gap Index, Platform Velocity) are calculated at the time of report generation — not recycled from a static database. You get the market as it exists right now, not last quarter.",
L23:      },
L24:      {
L25:        q: "What is the Gap Index?",
L26:        a: "The Gap Index is KoreaScout's proprietary scoring metric. It measures the spread between a product's Korean demand momentum and its current global supply footprint across Amazon US, Amazon EU, and Shopify. A high Gap Index means the product is buzzing in Korea but has virtually no established competition globally — that's your entry window. Products with a low Gap Index are filtered out before they reach your report.",
L27:      },
L28:      {
L29:        q: "Can I trust AI-generated product research?",
L30:        a: "KoreaScout is not a prompt-to-output AI tool. Our pipeline is: signal collection → AI pre-filtering → human verification → compliance check → report. Every product that reaches your report has been cross-verified across multiple Korean demand sources for market viability. The AI eliminates noise. The data verifies the signal.",
L31:      },
L32:      {
L33:        q: "How many products do I get each week?",
L34:        a: "Every week, KoreaScout publishes 10+ curated K-products. Standard and Alpha members get instant access to the latest 3 weeks — that's 30+ verified products from day one. Free members get access to one unlocked week with a 14-day delay. Every product in your report has cleared our Margin Multiplier threshold and passed multi-source Korean demand verification.",
L35:      },
L36:    ],
L37:  },
L38:  {
L39:    id: "sourcing-logistics",
L40:    label: "Sourcing & Logistics",
L41:    subtitle: "I don't speak Korean. How does this help me actually source?",
L42:    items: [
L43:      {
L44:        q: "What about customs and import regulations? I've been burned before.",
L45:        a: "Each Alpha report includes the estimated HS Code for US and EU import classification, along with hazmat status and key compliance flags (FDA MoCRA, CPNP, ingredient screening). This is reference intelligence — not legal advice. Use it to have an informed conversation with your customs broker before you commit to a shipment. The goal is no surprises at the border.",
L46:      },
L47:      {
L48:        q: "Is the supplier information verified or just scraped?",
L49:        a: "Alpha reports include manufacturer name, contact information, and sourcing reference links sourced from Korean B2B databases and verified product listings. We provide the lead — direct outreach and negotiation is yours to own. Supplier responsiveness and MOQ terms vary by manufacturer and are subject to change.",
L50:      },
L51:      {
L52:        q: "Can KoreaScout help me with logistics after sourcing?",
L53:        a: "KoreaScout is an intelligence platform, not a freight forwarder. We give you the product intelligence, compliance reference data, and supplier contact. Your existing freight partner handles the shipment. We are the 60-second decision, not the 3-month supply chain.",
L54:      },
L55:    ],
L56:  },
L57:  {
L58:    id: "alpha-membership",
L59:    label: "Alpha Membership",
L60:    subtitle: "Why is there a 3,000 member cap? Sounds like a sales tactic.",
L61:    items: [
L62:      {
L63:        q: "Why is Alpha limited to 3,000 members?",
L64:        a: "This is a structural decision, not a marketing gimmick. Each Alpha product report includes direct factory contacts and MOQ pricing. If 10,000 sellers receive the same supplier contact simultaneously, the factory gets overwhelmed, MOQs increase, and pricing negotiation leverage disappears. 3,000 is the ceiling at which our intelligence retains its commercial value. When that ceiling is hit, Alpha closes. This protects your investment, not ours.",
L65:      },
L66:      {
L67:        q: "Why does Alpha cost $129/mo when Standard is $69/mo?",
L68:        a: "Standard gives you the full trend intelligence layer: Gap Index, Margin Multiplier, Platform Velocity, Growth Signal. That alone replaces 58 hours of manual sourcing research per month. Alpha adds the action layer: verified factory contacts, MOQ + EXW pricing, HS Code reference, compliance flags, 4K On-Site Sourcing Footage (Raw), SEO keywords, and a broker email draft. The $60 difference buys you a complete sourcing brief — ready to act on, not just read. If your average margin is $8/unit and you source 200 units from one Alpha-sourced product, that's $1,600 gross from a $129 subscription. The math works on the first product.",
L69:      },
L70:      {
L71:        q: "Can I upgrade from Standard to Alpha later?",
L72:        a: "Yes, anytime. When you upgrade, you pay only the price difference — your existing Standard subscription credit is applied. Alpha access opens immediately upon payment. No waiting, no new billing cycle.",
L73:      },
L74:      {
L75:        q: "What if Alpha is sold out when I'm ready to upgrade?",
L76:        a: "Alpha membership is capped at 3,000 seats globally. If the cap is reached, the upgrade option closes and you join a waitlist. Standard members are given priority notification before public waitlist openings. This is the only honest answer: don't wait if you're considering it.",
L77:      },
L78:    ],
L79:  },
L80:  {
L81:    id: "trust-risk",
L82:    label: "Trust & Risk Reversal",
L83:    subtitle: "Who are you, and what happens if I hate it?",
L84:    items: [
L85:      {
L86:        q: "Who is behind KoreaScout's intelligence?",
L87:        a: "KoreaScout is built by a team with direct operational experience inside Korea's most aggressive e-commerce environment. Our lead operator spent years at Coupang — Korea's Amazon equivalent — where product velocity, logistics optimization, and competitive intelligence were not academic concepts but daily execution requirements. We didn't study the Korean market. We ran inside it.",
L88:      },
L89:      {
L90:        q: "Why should I trust your data over doing my own research?",
L91:        a: "You can do your own research. It will take approximately 58 hours per month — cross-referencing Korean social platforms, translating product listings, verifying supplier reliability, checking HS codes, and estimating landed costs. KoreaScout compresses that into 60 seconds of reading. The question isn't whether you trust our data. It's whether your time is worth $69/month.",
L92:      },
L93:      {
L94:        q: "What is your refund policy?",
L95:        a: "KoreaScout does not offer refunds after purchase. Here's why: the moment you access a weekly intelligence report, that information has commercial value — you now know what products are trending in Korea before most global sellers do. That knowledge cannot be returned. Unlike a SaaS tool you might not use, our intelligence is an asset the moment it's delivered. This is exactly why we offer a permanent free plan and a full sample report before you pay a single dollar. We want you to be certain before you commit — not after.",
L96:      },
L97:      {
L98:        q: "Can I cancel anytime?",
L99:        a: "Yes. One click, no forms, no calls. Before you cancel — know this: your KoreaScout vault is cumulative. Every week you're subscribed, your accessible report library grows. When you cancel, you lose access to all previously unlocked reports. If you resubscribe later, your vault does not restore — you start fresh from the new subscription date only. Cancellation simply stops the next charge. Your current paid period remains fully active until the last day.",
L100:      },
L101:      {
L102:        q: "Is my payment information secure?",
L103:        a: "All billing is processed through LemonSqueezy, a global Merchant of Record that handles payment processing, VAT/GST compliance, and fraud protection across 100+ countries. KoreaScout never stores your card information. LemonSqueezy is the same infrastructure used by thousands of SaaS products globally. Your payment data never touches our servers.",
L104:      },
L105:      {
L106:        q: "What if I start on Standard and want to downgrade or cancel?",
L107:        a: "Downgrade and cancellation both take effect at your next billing date. Until then, you keep every feature you're currently paying for. We don't claw back access early. What you paid for, you use in full.",
L108:      },
L109:    ],
L110:  },
L111:];
L112:
L113:const INITIAL_CATEGORY_LABEL = "Data & Strategy";
L114:
L115:/** Min height so section doesn't jump when switching categories (Trust has 6 items). */
L116:const ACCORDION_MIN_H = "min-h-[520px]";
L117:
L118:export default function FaqAccordion() {
L119:  const [activeCategoryLabel, setActiveCategoryLabel] = useState<string>(INITIAL_CATEGORY_LABEL);
L120:  const [openIndex, setOpenIndex] = useState<number | null>(null);
L121:
L122:  const activeCategory = FAQ_DATA.find((c) => c.label === activeCategoryLabel) ?? FAQ_DATA[0];
L123:
L124:  const handleCategoryClick = (label: string) => {
L125:    if (label === activeCategoryLabel) return;
L126:    setActiveCategoryLabel(label);
L127:    setOpenIndex(null);
L128:  };
L129:
L130:  const activeNavClasses = (isActive: boolean) =>
L131:    isActive
L132:      ? "border-[#16A34A] text-[#16A34A] bg-black/5"
L133:      : "border-transparent text-black/40 hover:text-black/60 hover:bg-black/[0.03]";
L134:
L135:  return (
L136:    <div className="flex flex-col md:flex-row gap-8 md:gap-16 relative" role="region" aria-label="FAQ">
L137:      {/* Mobile: Horizontal scroll tabs above the list */}
L138:      <div className="md:hidden overflow-x-auto -mx-6 px-6" style={{ WebkitOverflowScrolling: "touch" }}>
L139:        <div className="flex gap-1 min-w-max pb-1">
L140:          {FAQ_DATA.map((cat) => {
L141:            const isActive = activeCategoryLabel === cat.label;
L142:            return (
L143:              <button
L144:                key={cat.id}
L145:                type="button"
L146:                onClick={() => handleCategoryClick(cat.label)}
L147:                className={`shrink-0 text-left py-2.5 px-4 rounded-md border-l-2 transition-colors text-sm font-medium ${activeNavClasses(isActive)}`}
L148:              >
L149:                {cat.label}
L150:              </button>
L151:            );
L152:          })}
L153:        </div>
L154:      </div>
L155:
L156:      {/* Desktop: Left category nav (sticky; stops when this FAQ grid scrolls out) */}
L157:      <aside className="hidden md:block w-44 shrink-0 self-start" aria-label="FAQ categories">
L158:        <nav className="sticky top-24">
L159:          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 mb-4">
L160:            Categories
L161:          </p>
L162:          <ul className="space-y-1">
L163:            {FAQ_DATA.map((cat) => {
L164:              const isActive = activeCategoryLabel === cat.label;
L165:              return (
L166:                <li key={cat.id}>
L167:                  <button
L168:                    type="button"
L169:                    onClick={() => handleCategoryClick(cat.label)}
L170:                    className={`w-full text-left py-3 pl-3 pr-2 rounded-r-md border-l-2 transition-colors text-sm font-medium ${activeNavClasses(isActive)}`}
L171:                  >
L172:                    {cat.label}
L173:                  </button>
L174:                </li>
L175:              );
L176:            })}
L177:          </ul>
L178:        </nav>
L179:      </aside>
L180:
L181:      {/* Right: Only active category — AnimatePresence for fade + y offset */}
L182:      <div className={`flex-1 min-w-0 ${ACCORDION_MIN_H} flex flex-col`}>
L183:        <AnimatePresence mode="wait" initial={false}>
L184:          <motion.div
L185:            key={activeCategoryLabel}
L186:            initial={{ opacity: 0, y: 12 }}
L187:            animate={{ opacity: 1, y: 0 }}
L188:            exit={{ opacity: 0, y: -8 }}
L189:            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
L190:            className="flex flex-col flex-1"
L191:          >
L192:            <p className="text-sm font-bold text-[#16A34A] uppercase tracking-widest mb-5">
L193:              {activeCategory.label}
L194:            </p>
L195:
L196:            <div className="space-y-0 border-t border-black/5 flex-1">
L197:              {activeCategory.items.map((faq, itemIdx) => {
L198:                const isOpen = openIndex === itemIdx;
L199:                return (
L200:                  <div
L201:                    key={`${activeCategory.id}-${itemIdx}`}
L202:                    className="border-b border-black/5 last:border-b-0"
L203:                  >
L204:                    <button
L205:                      type="button"
L206:                      onClick={() => setOpenIndex(isOpen ? null : itemIdx)}
L207:                      className="w-full flex items-center justify-between gap-4 text-left group py-5"
L208:                      aria-expanded={isOpen}
L209:                    >
L210:                      <span className="text-lg md:text-xl font-bold text-black pr-4">
L211:                        {faq.q}
L212:                      </span>
L213:                      <span
L214:                        className={`shrink-0 transition-transform duration-300 ease-out ${
L215:                          isOpen ? "rotate-180" : "rotate-0"
L216:                        }`}
L217:                        aria-hidden
L218:                      >
L219:                        <ChevronDown className="w-5 h-5 text-black/50 group-hover:text-black/70" />
L220:                      </span>
L221:                    </button>
L222:                    <AnimatePresence initial={false}>
L223:                      {isOpen && (
L224:                        <motion.div
L225:                          initial={{ height: 0, opacity: 0 }}
L226:                          animate={{ height: "auto", opacity: 1 }}
L227:                          exit={{ height: 0, opacity: 0 }}
L228:                          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
L229:                          className="overflow-hidden"
L230:                        >
L231:                          <p className="text-base text-black/60 leading-relaxed pb-5 pl-0 pr-8">
L232:                            {faq.a}
L233:                          </p>
L234:                        </motion.div>
L235:                      )}
L236:                    </AnimatePresence>
L237:                  </div>
L238:                );
L239:              })}
L240:            </div>
L241:          </motion.div>
L242:        </AnimatePresence>
L243:      </div>
L244:    </div>
L245:  );
L246:}
L247:
```

AUDIT COMPLETE.
