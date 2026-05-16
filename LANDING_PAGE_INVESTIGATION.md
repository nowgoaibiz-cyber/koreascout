# Landing Page Complete Structure Analysis

**Scope:** Primary source file `app/page.tsx` (717 lines), plus child components referenced from that file for section-level copy (Hero, pipeline sneak peek, time widget, FAQ, etc.). The home route composes these; pricing constants live in `@/src/config/pricing`.

**Generated:** 2026-05-15

---

## 1. FILE OVERVIEW

| Item | Detail |
|------|--------|
| **Total line count** | **717** (`app/page.tsx`) |
| **Main component** | `export default function HomePage()` — single `<main>` wrapping ordered sections and a `<footer>`. |
| **Metadata** | `title`: "KoreaScout — Korean Retail Intelligence Hub"; `description` + `openGraph.title` / `openGraph.description` (no dollar amounts). |

### Import statements related to pricing / features

| Line | Import | Role |
|------|--------|------|
| 7 | `CheckoutButton` | Alpha tier paid checkout trigger. |
| 8–9 | `PRICING` from `@/src/config/pricing` | Currency symbol, `FREE.monthly`, `ALPHA.monthly` / `daily`, `ALPHA_PLUS.monthly` / `daily` for cards and trust copy. |
| 10 | `Rocket`, `Handshake`, `ShieldCheck` (lucide-react) | Trust / moat cards (not price literals). |
| 11 | `FaqAccordion` | FAQ content (includes legacy Standard / $79 / $199 copy in answers — see §6). |

### In-file pricing-related definitions

- **`STANDARD_CHECKOUT_URL`** (lines 23–24): LemonSqueezy checkout URL; **variable name says "Standard"** but used for **Alpha** `CheckoutButton` (lines 497–502). ⚠️ Naming / tier confusion.
- **Inline SVG helpers:** `UnlockIcon`, `LockIcon` (lines 26–41) — used in Intelligence Engine mock card, not prices.

---

## 2. HERO SECTION

**Implementation:** `import Hero from "@/components/Hero"` → `components/Hero.tsx` (not inline in `page.tsx`).

| Element | Content |
|---------|---------|
| **Headline (h1)** | "The K-Beauty Trend Pipeline." + line break + "Before Your Feed Knows It Exists." |
| **Subheadline** | None (no separate subhead; video + gradient overlay only). |
| **CTA** | `HeroCTA`: single button **"Scout Now →"** (green `#16A34A`, hover `#15803D` + glow). **Action:** Supabase session → `/weekly` if logged in, else `/login`. **Not** a direct link to `/pricing` or checkout. |
| **Layout / styling** | Full viewport `section`, `min-h-[640px]`, `bg-[#0A0908]`, hero video `/videos/hero.mp4` at 60% opacity, `bg-black/30` overlay, bottom gradient to `#0A0908`. |
| **Pricing mentions** | **None** in Hero / HeroCTA. |

---

## 3. PRICING CARDS SECTION

**Location:** `app/page.tsx` — `<section id="pricing-cards" className="bg-white ...">` (lines 403–558).  
**Comment in file:** `{/* ══ S8: PRICING (3-tier from pricing page, v5 copy) ═══════════════════════════════════ */}`

### Section chrome

- Eyebrow: **"Pricing"** (`text-[#9E9C98]`, uppercase tracking).
- **H2:** "For less than **{CURRENCY}{PRICING.ALPHA.daily.toFixed(2)}** a day." — with current config that renders **$4.97**.
- Subcopy: "Hire your dedicated Korea-based intelligence team."

### Tier: Scout Free

| Field | Value |
|-------|--------|
| **Card title** | Scout Free |
| **Price display** | `{PRICING.CURRENCY}{PRICING.FREE.monthly}` → **$0** |
| **Monthly / daily** | Label: **"Forever Free"**; no separate daily line. |
| **CTA** | Text: **"Unlock Free Intelligence"** — `<a href="/signup">` — `border-2 border-[#1A1916]`, hover fill dark. |
| **Feature / marketing blocks** | Gray box: **INSTANT ACCESS:** "Access 1 sample report — no credit card required." Body: "See what KoreaScout finds. Before you commit." |
| **Creator / seller language** | None in card body. |
| **Border / background** | `bg-white border border-[#E8E6E1] rounded-2xl` |
| **Badges** | None. |
| **Extra vs `/pricing`** | Fine print under CTA: "1 sample report · free forever · no card needed" — **present on landing, absent on** `app/pricing/page.tsx` Free card. |

### Tier: Alpha

| Field | Value |
|-------|--------|
| **Card title** | Alpha |
| **Price display** | `{PRICING.CURRENCY}{PRICING.ALPHA.monthly}` + "/ month" → **$149** / month (from `pricing.ts`). |
| **Daily** | "Approx. {CURRENCY}{PRICING.ALPHA.daily.toFixed(2)} / day" → **$4.97 / day**. |
| **CTA** | **"Join Alpha — {CURRENCY}{PRICING.ALPHA.monthly}/mo"** via `CheckoutButton` with `checkoutUrl={STANDARD_CHECKOUT_URL}` — classes: `border-2 border-green-600 bg-green-600`, hover `green-700`. ⚠️ URL constant name `STANDARD_CHECKOUT_URL`. |
| **Feature list (bullets)** | No bullet list; INSTANT ACCESS box + paragraph only. |
| **INSTANT ACCESS box** | "30+ Verified Products (Last 3 weeks) unlocked immediately." |
| **Body copy** | Mentions Korea market survival + **"{daily}/day — less than your morning coffee, more valuable than 14 hours of research."** |
| **Creator / seller** | Generic "your morning coffee" / research — not explicitly creator-only. |
| **Border / background** | `border-2 border-green-600`, green shadow `rgb(22_163_74/0.18)` — **Alpha green emphasis: yes**. |
| **Badges** | None (no COMING SOON). |
| **Footer note** | "10+ products/week · Instant access" |

### Tier: Alpha+

| Field | Value |
|-------|--------|
| **Card title** | Alpha+ (`h3` styling) |
| **Price display** | `{PRICING.CURRENCY}{PRICING.ALPHA_PLUS.monthly}` → **$199** + "/ month". |
| **Daily** | "Approx. {CURRENCY}{PRICING.ALPHA_PLUS.daily.toFixed(2)} / day" → **$6.63 / day** (from `PRICING.ALPHA_PLUS.daily`). |
| **CTA** | **"Join Waitlist →"** — `<a href="/waitlist">` — gray border, `z-20` above overlay. |
| **Feature list** | No bullet list; copy: "More powerful sourcing tools." + "Built for **sellers** like you." + "Launching soon." |
| **Creator / seller** | **Seller-oriented** ("sellers like you"). |
| **Border / background** | `border border-[#E8E6E1] bg-white`, inner content `opacity-50` — **muted / gray treatment: yes** (not green). |
| **Badges** | **COMING SOON** — rotated stamp, `border-gray-600/50`, `text-gray-600`. |

**Note:** There is **no** "Standard" pricing card on the landing page UI; remaining "Standard" strings appear elsewhere (Launch Kit badges, mock card label, FAQ — see §7 and Specific Searches).

---

## 4. FEATURE COMPARISON TABLE

### Presence on `app/page.tsx`

**There is no feature comparison grid / `FEATURE_GROUPS` table defined or rendered in `app/page.tsx`.** The pricing section is three cards only. The full matrix lives on **`app/pricing/page.tsx`** (`FEATURE_GROUPS`).

Below is the **complete data structure** from `app/pricing/page.tsx` (source of truth for the comparison table). Landing visitors must navigate to `/pricing` or the mock card link ("More details available on Pricing page") for this table.

---

GROUP: Product Identity  
Row 1: feature: "Product Profile & Selective Tier Badges" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 2: feature: "Strategic Viability & Trend Insights" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 3: feature: "Real-time Retail Price & FX Tracker" | free: "—" | alpha: "✓" | alphaPlus: "✓"  

GROUP: Trend Signal Dashboard  
Row 1: feature: "Proprietary Market Score" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 2: feature: "Competition Level Indicator" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 3: feature: "Opportunity Status" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 4: feature: "Real-time Growth Momentum" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 5: feature: "Cross-Platform Vitality (TikTok, IG, YT)" | free: "—" | alpha: "✓" | alphaPlus: "✓"  

GROUP: Market Intelligence  
Row 1: feature: "Global Market Availability (6 Regions)" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 2: feature: "Search Volume & Growth (MoM/WoW)" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 3: feature: "Margin Potential Multiplier" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 4: feature: "Strategic Valuation & Global Price Benchmarks" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 5: feature: "Analyst Brief (Edge & Risk Factors)" | free: "—" | alpha: "✓" | alphaPlus: "✓"  

GROUP: Social Proof & Trend Intelligence  
Row 1: feature: "Korea Gap Index™" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 2: feature: "Social Buzz & Sentiment Analysis" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 3: feature: "Rising Korean Keywords (KR)" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 4: feature: "Global SEO Actionable Keywords" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 5: feature: "Viral Hashtag Strategy" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 6: feature: "Scout Strategy Report" | free: "—" | alpha: "✓" | alphaPlus: "✓"  

GROUP: Export & Logistics Intelligence  
Row 1: feature: "Export Readiness & Market Moat" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 2: feature: "Required Certifications (FDA, CPNP, etc.)" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 3: feature: "Hazmat Status & Full Ingredient List" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 4: feature: "Logistics Dashboard (Actual / Vol / Billable Weight)" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 5: feature: "Shipping Notes & Carrier Strategy" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 6: feature: "HS Code & Broker Email Draft" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 7: feature: "Compliance & Logistics Strategy" | free: "—" | alpha: "✓" | alphaPlus: "✓"  

GROUP: Launch & Execution Kit  
Row 1: feature: "Verified Cost Per Unit & MOQ" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 2: feature: "Est. Production Lead Time" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 3: feature: "Sample Policy & Distribution Rights" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 4: feature: "Supplier Contact (Email, Phone, Web)" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 5: feature: "Direct Wholesale Portal Link" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 6: feature: "Global Market Proof Links" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 7: feature: "Viral Hook Reference (Success Cases)" | free: "—" | alpha: "✓" | alphaPlus: "✓"  
Row 8: feature: "4K On-Site Sourcing Footage (Raw)" | free: "—" | alpha: "✓" | alphaPlus: "✓"  

GROUP: Coming Soon  
Row 1: feature: "Verified Cost Per Unit" | free: "—" | alpha: "—" | alphaPlus: "✓"  
Row 2: feature: "Minimum Order Quantity (MOQ)" | free: "—" | alpha: "—" | alphaPlus: "✓"  
Row 3: feature: "Est. Production Lead Time" | free: "—" | alpha: "—" | alphaPlus: "✓"  
Row 4: feature: "Sample Policy & Rights" | free: "—" | alpha: "—" | alphaPlus: "✓"  
Row 5: feature: "Additional Alpha+ services launching soon." | free: "" | alpha: "" | alphaPlus: "" *(full-width note row on pricing page)*  

### Difference from `/pricing` page

- **Landing (`app/page.tsx`):** No rendered table — **N/A vs identical**.
- **Pricing page:** Sole owner of `FEATURE_GROUPS` UI.

---

## 5. "TIME IS YOUR ONLY NON-RENEWABLE RESOURCE" SECTION

**Implementation:** `import LandingTimeWidget from "@/components/LandingTimeWidget"` → `components/LandingTimeWidget.tsx` (invoked from `page.tsx` line 89).

| Element | Content |
|---------|---------|
| **Eyebrow** | "Time vs. Money" |
| **Headline (h2)** | "Time is your only" + line break + "**non-renewable resource.**" |
| **Body / structure** | Two-column grid: left **"❌ Manual Research"** (dynamic rows by mode), right **"✓ KoreaScout Alpha"** or **"✓ KoreaScout Alpha+"** with green progress bars. Bottom line: "{28 or 58} hours vs. 60 seconds." + green tagline. |
| **"I'm a creator" / "I'm a seller"** | **Not exact strings.** Toggle buttons: **"🎬 I'm a Creator"** and **"🏪 I'm a Global Seller"** (lines 87–88 in `LandingTimeWidget.tsx`). |
| **Creator-specific language** | Creator mode rows: "Scroll KR TikTok & IG for trends", "Decode Korean buzz & reviews", "Guess the next global viral hit", "Hunt SEO keywords & viral hashtags"; total **28 hours**; right column shows **KoreaScout Alpha** and **$149/month**; tagline "**Stop searching, start filming.**" |
| **Seller-specific language** | Seller mode: 6 tasks (find product, verify demand, supplier, translate/negotiate, HS Code + logistics, video assets), **58 hours**; right column **KoreaScout Alpha+** and **$199/month**; "**The math is already done.**"; ROI "17× – 35×"; HS Code disclaimer block (seller only). |
| **CTA buttons** | **None** (toggle only; no primary link to checkout or `/pricing` in this section). |
| **Pricing-related** | Uses `PRICING.ALPHA.monthly` / `PRICING.ALPHA_PLUS.monthly` for right card "Cost" line. Hypothetical opportunity cost lines `@ $40/hr`, `$60/hr`, `$80/hr` (not tier list prices). |

---

## 6. FAQ SECTION

**Implementation:** `FaqAccordion` from `components/FaqAccordion.tsx` (embedded in `page.tsx` lines 634–639 inside cream trust section).

- **Total FAQ items:** **21** (5 + 3 + 3 + 4 + 6 across categories).

### All questions (verbatim)

1. How is KoreaScout different from Jungle Scout or Helium 10?  
2. How fresh is the intelligence?  
3. What is the Gap Index?  
4. Can I trust AI-generated product research?  
5. How many products do I get each week?  
6. I'm a content creator, not a seller. How does KoreaScout help me?  
7. Will I get content ideas from KoreaScout, or just product data?  
8. I don't source products. Do I still need Alpha?  
9. What about customs and import regulations? I've been burned before.  
10. Is the supplier information verified or just scraped?  
11. Can KoreaScout help me with logistics after sourcing?  
12. Why is Alpha limited to 3,000 members?  
13. Why does Alpha cost $199/mo when Standard is $79/mo?  
14. Can I upgrade from Standard to Alpha later?  
15. What if Alpha is sold out when I'm ready to upgrade?  
16. Who is behind KoreaScout's intelligence?  
17. Why should I trust your data over doing my own research?  
18. What is your refund policy?  
19. Can I cancel anytime?  
20. Is my payment information secure?  
21. What if I start on Standard and want to downgrade or cancel?  

### Per-question flags (Standard / Creator / Seller / Alpha vs Alpha+)

| # | Question | Standard tier | Creator use case | Seller use case | Alpha vs Alpha+ |
|---|----------|---------------|------------------|-----------------|-----------------|
| 1 | Jungle Scout… | — | — | implied global seller | — |
| 2 | How fresh… | — | — | — | — |
| 3 | Gap Index… | — | — | — | — |
| 4 | AI trust… | — | — | — | — |
| 5 | How many products… | **Answer:** "Standard and Alpha members" | — | — | — |
| 6 | Content creator… | Answer mentions **Standard** | **Yes** | Contrasts seller | — |
| 7 | Content ideas… | Answer: **Standard** delivers… | **Yes** | — | — |
| 8 | Don't source… need Alpha? | **Yes** ($79/mo Standard for creators) | **Yes** | **Yes** (Alpha for sellers) | Alpha vs Standard framing |
| 9 | Customs… | — | — | **Yes** | Alpha report |
| 10 | Supplier verified… | — | — | **Yes** | Alpha |
| 11 | Logistics after sourcing… | — | — | **Yes** | — |
| 12 | 3,000 cap… | — | — | **Yes** (sellers) | Alpha cap |
| 13 | $199 vs Standard $79… | **Yes** | — | **Yes** | Price comparison; answer says **$199** Alpha |
| 14 | Upgrade Standard → Alpha… | **Yes** | — | — | upgrade path |
| 15 | Alpha sold out… | **Standard** priority | — | — | — |
| 16 | Who is behind… | — | — | — | — |
| 17 | Trust data… | **$79/month** in answer | — | — | — |
| 18 | Refund… | — | — | — | — |
| 19 | Cancel… | — | — | — | — |
| 20 | Payment secure… | — | — | — | — |
| 21 | Start on Standard… | **Yes** | — | — | downgrade |

⚠️ **FAQ copy is inconsistent with current `PRICING`** (`ALPHA.monthly` = **149**, not 199 in UI cards; **Standard $79** tier is not shown on landing cards). Several answers still describe **Standard** as a live paid tier.

---

## 7. PRICING-RELATED CONSTANTS (`app/page.tsx`)

| Search | Result in `app/page.tsx` |
|--------|---------------------------|
| **Hardcoded `$69`** | **None** |
| **Hardcoded `$79`** | **None** |
| **Hardcoded `$99`** | **None** |
| **Hardcoded `$149`** | **None** (Alpha month comes from `PRICING.ALPHA.monthly`) |
| **Hardcoded `$199`** | **None** (Alpha+ from `PRICING.ALPHA_PLUS.monthly`) |
| **Daily rate** | All user-visible Alpha daily strings use **`PRICING.ALPHA.daily.toFixed(2)`** → **4.97** (not 6.70). Alpha+ card uses **`PRICING.ALPHA_PLUS.daily`** → **6.63**. |
| **`$6.70` literal** | **None** in `page.tsx`. ⚠️ `pricing.ts` defines `ALPHA_PLUS.marketingDailyLimit: 6.7` (used on `/pricing` FOMO section, not on `page.tsx`). |
| **"Standard" tier references** | See §8 Specific Searches and Launch Kit / mock card. |
| **"Creator" targeting** | **Not in `page.tsx` strings**; creator UX is in **`LandingTimeWidget`** + **FAQ** (`FaqAccordion`). |

---

## 8. OTHER SECTIONS (document order in `HomePage`)

Order as rendered in `app/page.tsx`:

| # | Section (comment / component) | Pricing / tier notes |
|---|-------------------------------|----------------------|
| 1 | **Hero** (`<Hero />`) | None. |
| 2 | **Pipeline sneak peek** (`LandingPipelineSneakPeek`) | Demo card: KRW/USD retail, est. wholesale ~$4.84, **Alpha** lock CTA — illustrative, not `PRICING` config. |
| 3 | **Soldout signal** (inline) | None. |
| 4 | **Time widget** (`LandingTimeWidget`) | Alpha / Alpha+ monthly prices; creator vs seller modes. |
| 5 | **Launch Kit** (inline grid) | Badges **"Standard & Alpha"** vs **"Alpha Exclusive"**; HS item "**Standard** 6-digit". ⚠️ Standard naming. |
| 6 | **Intelligence pipeline** (`IntelligencePipeline`) | No dollar amounts in scanned portion; marketing pipeline copy. |
| 7 | **Intelligence Engine / 6-layer** (inline + mock card) | "**Standard Access**" block vs "**Alpha Only**"; link **"View Pricing & Access →"** `/pricing`; **ALPHA** pill on card. |
| 8 | **Pricing cards** (`#pricing-cards`) | Free / Alpha / Alpha+ — see §3. |
| 9 | **Dynamite fuse** (`DynamiteFuseSection`) | No tier prices; profit / margin narrative. |
| 10 | **Trust + Founder + FAQ + Ready to Scout** (inline + `FaqAccordion`) | Trust card 3: "**less than {Alpha daily}** a day"; Founder note: "**Focus on selling**"; FAQ — legacy Standard; CTA "**Join Alpha today — Alpha+ waitlist**"; button `href="#pricing-cards"` **"Get Exclusive Access Now"**. |
| 11 | **Footer** | `Link` to `/pricing`, `/sample-report`, `/contact`; no price literals. |

---

## SPECIFIC SEARCHES (within `app/page.tsx`)

Search terms: **Standard**, **Creator**, **$69**, **$79**, **$99**, **I'm a creator**, **I'm a seller** (case-insensitive where applicable).

### "Standard" (case-insensitive)

| Line | Context (±2 lines) | Section name |
|------|-------------------|--------------|
| 23 | `import …` / `const STANDARD_CHECKOUT_URL =` / `"https://getkoreascout…` | File header / checkout constant |
| 24 | (URL continuation) | Same |
| 127–131 | `alpha: false,` / `badge: "Standard & Alpha",` / `q: "Is this the next viral hit?",` | Launch Kit cards |
| 156–160 | `items: [` / `{ text: "HS Code Guidance (Standard 6-digit)", lock: false },` / `{ text: "Compliance…` | Launch Kit — compliance card |
| 166–170 | `alpha: false,` / `badge: "Standard & Alpha",` / `q: "How do I make it go viral?",` | Launch Kit — viral card |
| 346–349 | `{/* Standard Access — green open lock … */}` / `<div className="border-t…` / `<p …>Standard Access</p>` | Intelligence Engine mock card |
| 363–366 | `{/* Alpha Only — same green … as Standard */}` / `<div …` / `<p …>Alpha Only` | Same section |
| 496–500 | `<div className="mt-auto">` / `<CheckoutButton` / `checkoutUrl={STANDARD_CHECKOUT_URL}` | Pricing — Alpha CTA |

### "Creator"

| Line | Context | Section |
|------|---------|---------|
| — | **No matches** in `app/page.tsx` | — |

### "$69" / "$79" / "$99"

| Line | Context | Section |
|------|---------|---------|
| — | **No matches** | — |

### "I'm a creator" / "I'm a seller"

| Line | Context | Section |
|------|---------|---------|
| — | **No matches** (exact phrases; toggle uses **"I'm a Creator"** / **"I'm a Global Seller"** in `LandingTimeWidget.tsx`) | — |

### "seller" (case-insensitive) — additional

| Line | Context | Section |
|------|---------|---------|
| 538–541 | `More powerful sourcing tools.<br />` / `Built for sellers like you.` / `Launching soon.` | Pricing — Alpha+ copy |

---

## COMPARISON CHECKLIST (Landing pricing block vs `/pricing`)

| Check | Result |
|-------|--------|
| Free / Alpha / Alpha+ **numeric** values identical? | **Yes** — both use shared `PRICING` for displayed amounts. |
| Coming Soon features identical? | **N/A on landing** (no table). Card-level COMING SOON: **aligned** with pricing page. |
| Alpha green styling? | **Yes** on both (`border-green-600`, green shadow, green CTA). |
| Alpha+ gray / muted styling? | **Yes** on both (`opacity-50`, gray stamp, gray waitlist button). |
| Standard tier remnants? | **Yes** elsewhere on landing: Launch Kit badges, **Standard Access** mock card, **`STANDARD_CHECKOUT_URL`**, FAQ. ⚠️ |
| Creator-specific cards/sections? | **Time widget** (creator toggle) + **FAQ "For Creators"**; not in pricing cards. |

### Copy differences (cards only)

- **Alpha body paragraph:** Landing uses **coffee + $4.97/day + 14 hours research**; `/pricing` uses **"market intelligence engine for serious global sellers"** block. ⚠️ Inconsistency.
- **Scout Free card:** Landing adds **extra fine print** under the signup CTA (see §3).

---

## ISSUES TO FLAG

| Issue | Severity |
|-------|----------|
| ⚠️ **`STANDARD_CHECKOUT_URL` used for Alpha join** — naming implies removed Standard tier. | High (confusion + maintenance) |
| ⚠️ **Launch Kit + mock card: "Standard & Alpha" / "Standard Access"** — UI still frames a Standard tier. | High |
| ⚠️ **FAQ** still sells **Standard $79/mo**, **Alpha $199/mo** in Q13, **$79/month** value prop, Standard→Alpha upgrade, Standard downgrade — conflicts with **$149 Alpha** cards and no Standard card. | High |
| ⚠️ **LandingTimeWidget:** Seller mode labels product as **Alpha+** at **$199/mo** while main Alpha paid tier is **$149** — may confuse **Alpha** vs **Alpha+** positioning. | Medium |
| ⚠️ **Feature table** exists only on `/pricing`; landing mock says "More details on Pricing page" but no embedded comparison. | Low (by design unless parity requested) |
| **$6.70 daily:** Not shown on `page.tsx`. Current Alpha headline daily is **$4.97** from config. If stakeholders expected **$6.70**, that would be **wrong for Alpha**; **Alpha+ `marketingDailyLimit` is 6.7** elsewhere — clarify product intent. | Informational |
| **HS "Standard 6-digit"** | Regulatory term (standard HS digit count), **not** the Standard tier — low risk of misread. |

---

## APPENDIX: `PRICING` snapshot (`src/config/pricing.ts`)

Relevant to landing rendering:

- `FREE.monthly`: 0  
- `ALPHA.monthly`: 149 — `daily`: 4.97 — `marketingDailyLimit`: 5.0  
- `ALPHA_PLUS.monthly`: 199 — `daily`: 6.63 — `marketingDailyLimit`: 6.7  
- `CURRENCY`: "$"  

---

*End of report.*
