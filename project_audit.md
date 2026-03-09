# KoreaScout — Project Audit Report

**Purpose:** Structured reference for strategy planning (e.g., Claude or other AI).  
**Scope:** Brand, business model, page structure, product details, technical stack, and marketing moats.  
**Source:** Analysis of `app/`, `components/`, `src/config/`, `_docs/standard/`, and codebase.

---

## 1. Brand Identity

### 1.1 Name
- **Product name:** KoreaScout  
- **Domain / positioning:** koreascout.com — "Korean Retail Intelligence Hub"  
- **Operator:** 지금행컴퍼니 (JigeumHaeng Company), Seoul, Korea  

### 1.2 Mission
- Decode Korea’s hyper-fast retail trends for the rest of the world.  
- Provide **verified, export-ready product intelligence** so global sellers can source and scale before margins compress.  
- “We find the gold in Seoul. You take it to the global stage.” — division of labor: KoreaScout scouts; the user scales.

### 1.3 Tone of Voice
- **Professional, confident, data-led:** “Not a trend list. A 6-layer intelligence brief — battle-tested in Korea.”  
- **Urgency without hype:** “You aren’t late to the trend. You’re late to the profit.”  
- **Concrete value:** Time saved (“58 hours … delivered in 1 second”), daily cost (“under $4.50 a day”), and scarcity (“3,000 spots”).  
- **English-only in product/UI:** All labels, copy, and CTAs in English (per `.cursorrules`).

### 1.4 Target Audience
- **Primary:** Global sellers (Amazon FBA, eBay, Shopify, etc.) who want to source Korean trend products.  
- **Secondary:** Anyone needing “Korean product intelligence” — verified data from Olive Young, Daiso, and related channels.  
- **Positioning:** “The global standard for Korean product intelligence” and “Hire your dedicated Korea-based intelligence team.”

---

## 2. Business Model (BM)

### 2.1 Subscription Plans (Source: `src/config/pricing.ts` + pricing page)

| Tier      | Price (USD)      | Daily equivalent | Notes                          |
|-----------|------------------|------------------|--------------------------------|
| **Free**  | $0               | $0               | Forever free                   |
| **Standard** | $69/month    | ~$2.30/day       | No cap on subscribers          |
| **Alpha** | $129/month      | ~$4.30/day       | **Capped at 3,000 spots**      |

- Alpha marketing copy may use “under $4.50 a day” (`marketingDailyLimit: 4.5` in config).  
- Currency: `PRICING.CURRENCY` = `"$"`.

### 2.2 Limits and Access
- **Alpha cap:** 3,000 members. Count read from `profiles` where `tier = 'alpha'`; remaining = `3000 - alphaCount`.  
- **Free:** 14-day delay for week access; ~half of products (is_premium = false) per week; 3 products/week unlocked.  
- **Paid (Standard/Alpha):** Instant access; last 3 weeks + current week; full product set per week (~10+ products).  
- **Checkout:** LemonSqueezy (Standard and Alpha each have a fixed checkout URL; Alpha full state links to `/waitlist`).

### 2.3 Value Proposition (Summary)
- **Free:** “See what KoreaScout finds. Before you commit.” — 3 products/week, 14-day delayed access.  
- **Standard ($69):** “Know WHAT survived Korea’s market.” — 30+ verified products (last 3 weeks), market intelligence, trend/social/SEO; no sourcing/logistics.  
- **Alpha ($129):** “Know HOW to bring it to your market.” — Same as Standard plus full Export & Logistics, Launch Kit, supplier contact (MOQ, verified cost, direct contact, 4K/viral media, broker draft, etc.). “58 hours of work. 60 seconds to receive.”  
- **Institutional policy (Alpha moat):** “Why only 3,000?” — Limit information spread to protect edge; “top 0.006% of the global market”; “we protect your opportunity.”

---

## 3. Page Structure

### 3.1 Current Landing Page Sections (Home — `app/page.tsx`)
1. **S1 Hero** — Full-screen video (hero.mp4), headline, CTA.  
2. **S2 The Intelligence Gap** — “You’re late to the profit”; margin scale (0.9× vs 4.0× Alpha potential).  
3. **S4 Landing Time Widget** — Time/urgency.  
4. **S5 Intelligence Engine** — 6-layer brief (Gap Index, Margin Intel, Trend Signals, Export Guard, Direct Supplier, Launch Kit); “Market Intelligence Brief” card (Standard vs Alpha bullets).  
5. **S6 Launch Kit** — “We bridge the Korea Gap”; four question cards (Should I source? / Contact? / Customs? / Market?).  
6. **S6 Intelligence Pipeline** — Scout engine (signals → noise filter → 10 export-ready winners).  
7. **S8 Pricing** — 3-tier cards (Free, Standard $69, Alpha $129); Alpha spot counter (X / 3,000).  
8. **S8b Institutional Policy** — “Why only 3,000 members?”  
9. **S9 Trust + Founder** — Three moats (Ex-Coupang DNA, AI + Human Curated, We search / You scale); Founder’s Note (“Since April 2025 …”).  
10. **FAQ** — Accordion.  
11. **Final CTA** — “Ready to Scout?” + Alpha remaining.  
12. **Footer** — Links: Pricing, Sample Report, Contact.

### 3.2 Implemented Pages (Routes)
- `/` — Home (landing).  
- `/pricing` — Pricing comparison, feature matrix, Alpha count, checkout / waitlist.  
- `/login`, `/signup`, `/forgot-password`, `/reset-password` — Auth.  
- `/auth/callback` — Auth callback.  
- `/weekly` — Weekly reports hub (requires login); month accordion, week cards.  
- `/weekly/[weekId]` — Product list for a week; tier-based access.  
- `/weekly/[weekId]/[id]` — Single product report (6 sections, tier-gated).  
- `/sample-report` — Public sample report (static/sample data).  
- `/account` — User account.  
- `/account/password` — Password change.  
- `/admin`, `/admin/login`, `/admin/[id]` — Admin (reports CRUD).  

### 3.3 Referenced but Possibly Unbuilt
- **`/contact`** — Linked in footer and CTAs; no `app/contact/page.tsx` found.  
- **`/waitlist`** — Linked when Alpha is full (“Join the Waiting List”); no `app/waitlist/page.tsx` found.  

Treat these as planned; confirm in codebase before strategy.

### 3.4 Navigation Flow (Header — `HeaderNavClient`)
- **Logged out:** Weekly Report (→ login), Pricing, Login.  
- **Logged in:** Weekly Report (→ `/weekly`), Account, Logout.  

Flow: Land → Pricing or Login → Weekly hub → Week → Product report (with locked sections by tier).

---

## 4. Product Details: Weekly Report

### 4.1 What the “Weekly Report” Is
- A **weekly batch of product intelligence reports** (one report per product).  
- Each week has a `week_id`, `week_label`, `product_count`, `summary`, `published_at`.  
- Reports are stored in `scout_final_reports`; access is controlled by tier and `free_list_at` / `is_teaser` (RLS).  
- One product per week can be a **teaser** (`is_teaser = true`): full report visible to all (including Free).

### 4.2 Report Structure (6 Sections on `/weekly/[weekId]/[id]`)
1. **Product Identity** — Name (KR/EN), image, category, viability reason, market score, export badge, KR price + FX, tier badges.  
2. **Trend Signal Dashboard** — Market Score (gauge), Competition Level, Opportunity Status (Gap), Platform Breakdown (TikTok, Instagram, YouTube, Reddit), growth momentum.  
3. **Market Intelligence** — Profit multiplier, est. wholesale, global valuation, search volume / MoM/WoW, global price grid (6 regions), analyst brief (edge/risk).  
4. **Social Proof & Trend Intelligence** — Buzz summary, Korea vs Global scores (Gap Analysis), Gap Index, rising keywords (KR), SEO keywords, viral hashtags, Scout Strategy (sourcing steps).  
5. **Export & Logistics** — Export readiness (Green/Yellow/Red), HS Code + broker email draft, certifications, hazmat, dimensions, actual/volumetric/billable weight, shipping tier, shipping notes.  
6. **Launch Kit (Supplier + Media)** — Supplier contact (name, scale, email, phone, homepage, Naver, wholesale link), verified cost/MOQ/lead time, sample policy, global proof links, viral video, 4K/product video, AI detail page, marketing assets, AI image.

### 4.3 Data Points (from `ScoutFinalReportsRow` and report components)

**Product & identity**  
- product_name, translated_name, image_url, ai_image_url, category, summary, consumer_insight, composition_info, spec_summary, viability_reason, market_viability, export_status.

**Trend signals**  
- competition_level, gap_status, platform_scores (TikTok, Instagram, YouTube, Reddit), growth_signal, growth_evidence, new_content_volume.

**Market intelligence**  
- profit_multiplier, estimated_cost_usd, search_volume, mom_growth, wow_rate, global_price, global_prices (by region), best_platform, top_selling_point, common_pain_point.

**Social proof & gap**  
- buzz_summary, kr_local_score, global_trend_score, gap_index, kr_evidence, global_evidence, kr_source_used, opportunity_reasoning, trend_entry_strategy, rising_keywords, seo_keywords, viral_hashtags, sourcing_tip (strategy steps).

**Export & logistics (Alpha)**  
- hs_code, hs_description, hazmat_status, dimensions_cm, actual_weight_g, volumetric_weight_g, billable_weight_g, shipping_tier, required_certificates, shipping_notes, key_risk_ingredient, status_reason.

**Supplier & launch kit (Alpha)**  
- m_name, corporate_scale, contact_email, contact_phone, m_homepage, naver_link, wholesale_link, verified_cost_usd, verified_cost_note, moq, lead_time, sample_policy, video_url, viral_video_url, marketing_assets_url, ai_detail_page_links, ai_image_url, verified_at.

**Broker**  
- Broker email draft (English) includes HS Code; built from report fields (e.g. `BrokerEmailDraft`, `GroupBBrokerSection`).

### 4.4 Tier Visibility (Summary)
- **Free:** Product Identity + Trend Signal Dashboard; Market Intelligence, Social Proof, Export & Logistics, Launch Kit are locked (placeholders with upgrade CTAs).  
- **Standard:** + Market Intelligence, Social Proof; Export & Logistics and Launch Kit (supplier/HS/broker/media) locked.  
- **Alpha:** Full report.  
- **Teaser:** One product per week shows full report to all tiers.

---

## 5. Technical Stack

### 5.1 Tools and Versions (from `package.json` and `_docs/standard/01_CORE_SPEC.md`)
- **Framework:** Next.js 16.1.6 (App Router), React 19.2.3.  
- **Styling:** Tailwind CSS 4, PostCSS.  
- **Icons:** lucide-react ^0.575.0.  
- **Animation:** framer-motion ^12.35.0.  
- **Backend / DB / Auth:** Supabase (@supabase/ssr ^0.8.0, @supabase/supabase-js ^2.98.0).  
- **Payments:** LemonSqueezy (checkout links; webhook updates `profiles.tier`).  
- **Hosting:** Vercel (implied; spec says “GitHub push → auto deploy”).  
- **Automation:** Make.com (data → Claude API → Supabase `scout_final_reports`).  
- **External API:** Frankfurter (KRW/USD for Product Identity).  

### 5.2 Implementation Status (High Level)
- **Auth:** Supabase Auth; middleware; login/signup/forgot-password/reset-password; auth callback.  
- **Tier:** `getAuthTier()` (auth-server); RLS on `scout_final_reports` and `profiles`; tier-driven UI (canSeeStandard, canSeeAlpha, LockedSection).  
- **Pricing:** Single source `src/config/pricing.ts`; pricing and landing use it; Alpha count from DB.  
- **Weekly:** Hub with month accordion; week list; product list per week; product detail with 6 sections and left nav.  
- **Report components:** ProductIdentity, TrendSignalDashboard, MarketIntelligence, SocialProofTrendIntelligence, SourcingIntel, SupplierContact; constants for locked CTAs.  
- **Admin:** Admin login, report list, report edit (admin/[id]).  
- **Favorites:** user_favorites; FavoriteButton on list and detail.  
- **Design system:** `.cursorrules` and `_docs/standard/02_DESIGN_SYSTEM.md` (colors, section/card standards); approved green #16A34A, borders #E8E6E1, etc.  

### 5.3 Data Pipeline
- Make.com → Claude API (curation/translation) → Supabase `scout_final_reports` (and `weeks`).  
- Required for tier/visibility: week_id, published_at, is_premium, is_teaser, status.  
- DB schema and RLS documented in `_docs/standard` and `types/database.ts`.

---

## 6. Marketing Moats

### 6.1 “Ex-Coupang” DNA
- **Copy:** “The ‘Korea’s Amazon’ DNA” — “Built by a former operator at Coupang (Korea’s Amazon). We bring the fastest e-commerce market’s execution speed and local vendor network directly to your sourcing pipeline.”  
- **Placement:** Trust section (S9) on landing; 3-column trust cards.  
- **Role:** Credibility and execution speed; local network as differentiator.

### 6.2 “Since April 2025”
- **Copy:** “Since April 2025, we’ve been quietly building the foundation for KoreaScout. We engineered our own AI system with one clear mission: to decode Korea’s hyper-fast trends for the rest of the world.”  
- **Placement:** Founder’s Note (S9), dark card with green accent.  
- **Role:** Recency, founder-led story, and “living startup” narrative.

### 6.3 “AI + Human Curated”
- **Copy:** “AI Scouted. Human Curated.” — “While our AI engine monitors Korea’s fastest-moving platforms, our human operators filter out the noise. You get 100% verified intelligence, ready for scaling.”  
- **Placement:** Same trust block (S9); Intelligence Pipeline references “500+ signals scanned” and “Factory verified.”  
- **Role:** Quality and trust (not raw automation); “Human-verified” and “Seoul team checks it” in 6-layer brief (Direct Supplier Access).

### 6.4 Other Moat Elements
- **Scarcity:** Alpha 3,000 cap; “X of 3,000 spots remaining” across landing and pricing.  
- **Time saved:** “58 hours … 1 second”; “4 minutes” (engine) vs “58 hours” (manual).  
- **Margin framing:** “0.9× Margin” vs “4.0× Alpha Potential”; profit multiplier and “4.0× margin potential” in reports.  
- **Sources:** Olive Young, Daiso; TikTok, Instagram, YouTube; “B2B Product Data” in pipeline.  
- **Compliance:** Export Guard “90% head start” for broker; MoCRA/CPNP, hazmat, HS code as Alpha value.

---

## Document Control

- **Generated from:** Repository analysis (app/, components/, config/, _docs/, types/).  
- **Single source for pricing:** `src/config/pricing.ts`.  
- **Spec authority:** `_docs/standard/01_CORE_SPEC.md`, `02_PRICING_STRATEGY.md`, `04_ACCESS_CONTROL_LOGIC.md`.  
- **Use:** Strategy planning, onboarding, and consistent positioning across AI or human workflows.
