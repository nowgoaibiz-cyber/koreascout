# KoreaScout System Scan Report

**Scan Date:** 2026-06-29  
**Mode:** READ-ONLY AUDIT (no code modifications)  
**Scanner:** Cursor Agent

---

## Executive Summary

| Area | Finding |
|------|---------|
| Admin UI | 4 pages under `app/admin/`, 3 helper components under `components/admin/` |
| Admin API | 7 route handlers under `app/api/admin/` |
| Admin Auth | Password cookie (`ADMIN_PASSWORD` → `kps_admin_session`), NOT Supabase Auth |
| Main product table | `scout_final_reports` (229 rows live) — **NOT** `scout_products` for app |
| Staging table | `scout_products` (446 rows live) — exists in DB only, **zero code references** |
| Tier system | `free` / `standard` / `alpha` via `profiles.tier` + RLS + `maskReportByTier()` |
| Token/Share | **No share-token or report-link token system found** |
| ZombieWatermark | Used on PDP for logged-in users (anti-screenshot watermark) |

---

## 1. ADMIN FILES INVENTORY

### 1.1 `find app/admin -type f` equivalent

```
app/admin/page.tsx
app/admin/login/page.tsx
app/admin/[id]/page.tsx
app/admin/script-generator/page.tsx
```

### 1.2 `find components -name "*admin*" -o -name "*Admin*"` equivalent

```
components/admin/GlobalPricesHelper.tsx
components/admin/AiPageLinksHelper.tsx
components/admin/HazmatCheckboxes.tsx
```

### 1.3 `grep -r "admin" app/ --include="*.tsx" -l`

```
app/admin/login/page.tsx
app/admin/page.tsx
app/admin/script-generator/page.tsx
app/admin/[id]/page.tsx
```

### 1.4 Additional Admin-Related Files (not in grep above)

```
app/api/admin/auth/route.ts
app/api/admin/logout/route.ts
app/api/admin/reports/route.ts
app/api/admin/reports/[id]/route.ts
app/api/admin/site-config/route.ts
app/api/admin/generate-script/route.ts
app/api/admin/generate-voiceover/route.ts
lib/supabase/admin.ts
middleware.ts (admin route guard)
```

---

## 2. ADMIN FILE CONTENTS & ANALYSIS

### 2.1 `app/admin/login/page.tsx` (70 lines)

**Purpose:** Password-only admin login.  
**Flow:** POST `/api/admin/auth` with `{ password }` → on success `router.push("/admin")`.  
**UI:** English only. Centered card, password input, error display.

```tsx
// Key endpoint
fetch("/api/admin/auth", { method: "POST", body: JSON.stringify({ password }) })
```

---

### 2.2 `app/admin/page.tsx` (190 lines)

**Purpose:** Reports list dashboard.  
**Data:** GET `/api/admin/reports` → `scout_final_reports` summary rows.  
**Features:**
- Week filter, status filter (Draft = not published, Live = published)
- Row click → `/admin/{id}`
- Logout → POST `/api/admin/logout`
- Nav tabs: Reports | Script Generator

**Type:**
```ts
type ReportRow = {
  id: string;
  product_name: string | null;
  week_id: string;
  market_viability: number | null;
  status: string | null;
  created_at: string;
};
```

---

### 2.3 `app/admin/script-generator/page.tsx` (353 lines)

**Purpose:** Internal marketing script + voiceover generator.  
**APIs:**
- POST `/api/admin/generate-script` (Anthropic Claude)
- POST `/api/admin/generate-voiceover` (ElevenLabs)

**Note:** UI labels are in **Korean** (키 컨텐츠, 풀링 컨텐츠) — violates product UI English-only rule but is admin-internal.

---

### 2.4 `app/admin/[id]/page.tsx` (1,655 lines)

**Purpose:** Full report editor for `scout_final_reports`.  
**Data:** GET/PATCH `/api/admin/reports/{id}`  
**Key subsystems:**

| Section | Fields |
|---------|--------|
| s1 Product Identity | product_name, kr_price, export_status, go_verdict, images, etc. |
| s2 Trend Signal Dashboard | market_viability, competition_level, platform_scores JSON, gap_status |
| s3 Market Intelligence | profit_multiplier, strategy_price, search_volume, wow/mom growth |
| s4 Social Proof | buzz_summary, kr/global scores, keywords, sourcing_tip steps 1-3 |
| s5 Export & Logistics | HS code, hazmat, weights, sourcing_tip steps 4-5 |
| s7 Global Market Prices | `GlobalPricesHelper` component |
| s6a Launch Kit | manufacturer/contact fields |
| s6b Brand Intel | sample_policy auto-gen (Daiso→Delivered URL), CEO verified cost |
| s6c Media | `AiPageLinksHelper`, video URLs |
| Edit History | `edit_history` JSONB append on save |
| Sample Toggle | `SampleToggle` → `/api/admin/site-config` key `sample_product_id` |

**Status values in UI:** `published` | `hidden` (maps to admin Draft/Live on list page)

**Korean in UI:** Field labels use bilingual `FIELD_LABELS_KO` map; modal text mixed KO/EN.

**Full source:** See repository file `app/admin/[id]/page.tsx` (too large to inline; 1,655 lines audited in full).

---

### 2.5 `components/admin/GlobalPricesHelper.tsx` (599 lines)

**Purpose:** Visual editor for `global_prices` JSONB.  
**Regions:** US, UK, EU, JP, SEA, UAE (+ shopee_lazada merged into SEA).  
**Features:** Per-listing platform/price/url, sold_out, official flags, seller_type, raw JSON view.

---

### 2.6 `components/admin/AiPageLinksHelper.tsx` (94 lines)

**Purpose:** Up to 5 YouTube/reference URLs → `ai_detail_page_links` JSON array.

---

### 2.7 `components/admin/HazmatCheckboxes.tsx` (87 lines)

**Purpose:** Hazmat flags JSON: `contains_liquid`, `contains_powder`, `contains_battery`, `contains_aerosol`.

---

## 3. ADMIN API ROUTES

### 3.1 `app/api/admin/auth/route.ts`

- Compares `body.password` to `process.env.ADMIN_PASSWORD`
- Sets httpOnly cookie `ADMIN_COOKIE_NAME` (default `kps_admin_session`) = `"authenticated"`
- maxAge: 7 days, sameSite: strict, secure in production

### 3.2 `app/api/admin/logout/route.ts`

- Clears admin cookie, redirects to `/admin/login`

### 3.3 `app/api/admin/reports/route.ts` (GET)

- Cookie auth check
- `createServiceRoleClient()` → bypasses RLS
- Selects: `id, product_name, week_id, market_viability, status, created_at`
- Orders by `market_viability` DESC, `naver_product_name` ASC

### 3.4 `app/api/admin/reports/[id]/route.ts`

- **GET:** Full row `select("*")` from `scout_final_reports`
- **PATCH:** Updates any fields except `id`, `created_at`; strips `kr_price_usd`, `estimated_cost_usd` (DB trigger-managed)
- Revalidates `/weekly/{weekId}/{id}` and `/weekly`

### 3.5 `app/api/admin/site-config/route.ts`

- **GET:** `?key=` → reads `site_config` table
- **POST:** upsert `site_config` row
- Special logic for `sample_product_id`: sets `is_teaser=true` on new sample, clears old sample

### 3.6 `app/api/admin/generate-script/route.ts`

- Requires admin cookie
- Anthropic `claude-sonnet-4-5` for KO+EN shorts scripts
- Content types: `키 컨텐츠` | `풀링 컨텐츠`

### 3.7 `app/api/admin/generate-voiceover/route.ts`

- Requires admin cookie
- ElevenLabs TTS → returns `audio/mpeg` blob

---

## 4. ADMIN MIDDLEWARE (`middleware.ts`)

```ts
// /admin/* routes (except /admin/login) require cookie === "authenticated"
// Otherwise redirect to /admin/login
// All other routes: updateSession() for Supabase auth refresh
```

**Important:** Admin pages are NOT protected at page level — only middleware cookie + API route checks. No Supabase user role.

---

## 5. SUPABASE CLIENT FILES

### 5.1 `lib/supabase/server.ts`

```ts
// createClient() — anon key + cookies, RLS applies
// Used by: Server Components, Route Handlers, Server Actions
```

### 5.2 `lib/supabase/admin.ts`

```ts
// createServiceRoleClient() — SUPABASE_SERVICE_ROLE_KEY, bypasses RLS
// Used by: admin API routes, LemonSqueezy webhook, billing
```

### 5.3 `lib/supabase/client.ts`

```ts
// createBrowserClient() — browser-side anon key
```

### 5.4 `lib/supabase/middleware.ts`

```ts
// updateSession() — refreshes Supabase auth session on each request
```

---

## 6. MIGRATIONS (FULL CONTENT)

### 6.1 `supabase/migrations/001_phase2_schema.sql`

```sql
-- =============================================================================
-- K-Product Scout — Phase 2: Database Schema, Triggers, and RLS
-- Run this script in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TABLE: profiles
-- User profile; extends Supabase Auth. One row per auth.users.id.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'standard', 'alpha')),
  ls_customer_id TEXT,
  ls_subscription_id TEXT,
  tier_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'User profile; tier updated by LemonSqueezy webhook';

-- -----------------------------------------------------------------------------
-- 2. TABLE: weeks
-- Weekly report batch. Data source for /weekly hub.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weeks (
  week_id TEXT PRIMARY KEY,
  week_label TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  published_at TIMESTAMPTZ,
  product_count INTEGER NOT NULL DEFAULT 0,
  summary TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
);

COMMENT ON TABLE public.weeks IS 'Weekly report batches for /weekly hub';

-- -----------------------------------------------------------------------------
-- 3. TABLE: scout_final_reports
-- Main product report table. One row = one product report.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.scout_final_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id TEXT NOT NULL REFERENCES public.weeks(week_id) ON DELETE CASCADE,
  -- Basic product info
  product_name TEXT NOT NULL,
  translated_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  ai_image_url TEXT,
  summary TEXT,
  consumer_insight TEXT,
  category TEXT NOT NULL,
  viability_reason TEXT NOT NULL,
  -- Market data
  market_viability INTEGER NOT NULL,
  competition_level TEXT NOT NULL,
  profit_multiplier NUMERIC NOT NULL,
  search_volume TEXT NOT NULL,
  mom_growth TEXT NOT NULL,
  gap_status TEXT NOT NULL,
  global_price JSONB,
  seo_keywords TEXT[],
  -- Sourcing & logistics
  export_status TEXT NOT NULL,
  hs_code TEXT,
  sourcing_tip TEXT,
  manufacturer_check TEXT,
  -- Manufacturer/contact (Alpha only)
  m_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  m_homepage TEXT,
  naver_link TEXT,
  -- Media (Alpha only)
  video_url TEXT,
  competitor_analysis_pdf TEXT,
  -- Access control
  published_at TIMESTAMPTZ,
  free_list_at TIMESTAMPTZ,
  is_premium BOOLEAN NOT NULL DEFAULT TRUE,
  is_teaser BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.scout_final_reports IS 'Product reports; access controlled by RLS and tier';

-- Optional: index for common filters
CREATE INDEX IF NOT EXISTS idx_scout_final_reports_week_id ON public.scout_final_reports(week_id);
CREATE INDEX IF NOT EXISTS idx_scout_final_reports_status ON public.scout_final_reports(status);
CREATE INDEX IF NOT EXISTS idx_scout_final_reports_free_list_at ON public.scout_final_reports(free_list_at) WHERE status = 'published';

-- -----------------------------------------------------------------------------
-- 4. TRIGGER: handle_new_user
-- Creates a profile row when a new user signs up (auth.users INSERT).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, tier)
  VALUES (NEW.id, NEW.email, 'free');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 5. TRIGGER: set_free_list_at
-- Sets free_list_at = published_at + 14 days on INSERT/UPDATE of published_at.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_free_list_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.published_at IS NOT NULL THEN
    NEW.free_list_at := NEW.published_at + INTERVAL '14 days';
  ELSE
    NEW.free_list_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_set_free_list_at ON public.scout_final_reports;
CREATE TRIGGER trigger_set_free_list_at
  BEFORE INSERT OR UPDATE OF published_at
  ON public.scout_final_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.set_free_list_at();

-- -----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scout_final_reports ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read and update their own row
CREATE POLICY "users_read_own_profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Weeks: only published weeks are visible
CREATE POLICY "weeks_public_read"
  ON public.weeks FOR SELECT
  USING (status = 'published');

-- Reports: tier-based row access (anon = free)
CREATE POLICY "report_access"
  ON public.scout_final_reports FOR SELECT
  USING (
    status = 'published'
    AND (
      -- Paid (Standard/Alpha): full access
      (SELECT tier FROM public.profiles WHERE id = auth.uid()) IN ('alpha', 'standard')
      -- Free (or anon when auth.uid() is null): 14-day delay + non-premium only
      OR (free_list_at IS NOT NULL AND free_list_at <= NOW() AND is_premium = FALSE)
      -- Teaser: everyone
      OR is_teaser = TRUE
    )
  );

-- -----------------------------------------------------------------------------
-- 7. SERVICE ROLE / BACKEND
-- Webhooks and admin need to write to profiles (e.g. tier updates).
-- Use the service_role key in API routes; it bypasses RLS.
-- No additional policies needed for app reads; anon key + RLS is sufficient.
-- -----------------------------------------------------------------------------
```

### 6.2 `supabase/migrations/002_product_identity_pricing.sql`

```sql
-- =============================================================================
-- K-Product Scout — Product Identity / Pricing (Section 1 deep revision)
-- Adds: auto-calculated USD fields, verified cost (Alpha), trigger + backfill
-- =============================================================================

-- Auto-calculated price fields
ALTER TABLE scout_final_reports ADD COLUMN IF NOT EXISTS kr_price_usd NUMERIC;
ALTER TABLE scout_final_reports ADD COLUMN IF NOT EXISTS estimated_cost_usd NUMERIC;

-- Alpha verified pricing (manual input via Admin)
ALTER TABLE scout_final_reports ADD COLUMN IF NOT EXISTS verified_cost_usd TEXT;
ALTER TABLE scout_final_reports ADD COLUMN IF NOT EXISTS verified_cost_note TEXT;
ALTER TABLE scout_final_reports ADD COLUMN IF NOT EXISTS moq TEXT;
ALTER TABLE scout_final_reports ADD COLUMN IF NOT EXISTS lead_time TEXT;

-- Auto-calculate trigger: when kr_price changes, compute USD + estimated cost
CREATE OR REPLACE FUNCTION calculate_price_usd()
RETURNS TRIGGER AS $$
DECLARE
  exchange_rate NUMERIC := 1430; -- KRW per USD, update periodically
  kr_num NUMERIC;
BEGIN
  -- Parse kr_price (might be string like "16000")
  BEGIN
    kr_num := NEW.kr_price::NUMERIC;
  EXCEPTION WHEN OTHERS THEN
    kr_num := NULL;
  END;
  
  IF kr_num IS NOT NULL AND kr_num > 0 THEN
    NEW.kr_price_usd := ROUND(kr_num / exchange_rate, 2);
    NEW.estimated_cost_usd := ROUND((kr_num / exchange_rate) * 0.6, 2);
  ELSE
    NEW.kr_price_usd := NULL;
    NEW.estimated_cost_usd := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_calculate_price_usd ON scout_final_reports;
CREATE TRIGGER trigger_calculate_price_usd
  BEFORE INSERT OR UPDATE OF kr_price
  ON scout_final_reports
  FOR EACH ROW EXECUTE FUNCTION calculate_price_usd();

-- Backfill existing data
UPDATE scout_final_reports 
SET kr_price_usd = ROUND(kr_price::NUMERIC / 1430, 2),
    estimated_cost_usd = ROUND((kr_price::NUMERIC / 1430) * 0.6, 2)
WHERE kr_price IS NOT NULL AND kr_price ~ '^\d+$';
```

### 6.3 `supabase/migrations/003_sync_from_live_audit.sql`

```sql
-- =============================================================================
-- K-Product Scout — 003: Sync from Live DB Audit (REFERENCE ONLY)
-- =============================================================================
-- ⚠️ DO NOT RUN THIS FILE ON THE LIVE SUPABASE PROJECT.
-- Purpose: Record schema/objects that exist (or are required) on the real DB
--          but were missing from 001/002. Use only when building a fresh DB
--          or when aligning a new environment to the live design.
-- Audit source: PROJECT_2DB_STATUS.md, types/database.ts, app/actions/favorites.ts,
--               lib/auth-server.ts, 04_ACCESS_CONTROL_LOGIC.md
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TABLE: user_favorites (missing in 001, 002)
-- Used by: app/actions/favorites.ts, app/account/page.tsx, app/weekly/[weekId]/page.tsx,
--          app/weekly/[weekId]/[id]/page.tsx. types/database.ts UserFavoritesRow.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_favorites (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id UUID NOT NULL REFERENCES public.scout_final_reports(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, report_id)
);

COMMENT ON TABLE public.user_favorites IS 'User favorite reports; RLS must restrict to auth.uid() = user_id';

CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_report_id ON public.user_favorites(report_id);

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_favorites_select"
  ON public.user_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_own_favorites_insert"
  ON public.user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_own_favorites_delete"
  ON public.user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 2. PROFILES: columns missing in 001 (used by lib/auth-server.ts, webhook, access logic)
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_start_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_reset_at TIMESTAMPTZ;
COMMENT ON COLUMN public.profiles.subscription_start_at IS 'When current subscription started; used for paid archive access';
COMMENT ON COLUMN public.profiles.subscription_reset_at IS 'Audit: when subscription was last reset (e.g. after cancel + resubscribe)';

-- -----------------------------------------------------------------------------
-- 3. SCOUT_FINAL_REPORTS: kr_price missing in 001 (002 trigger/backfill assume it exists)
-- -----------------------------------------------------------------------------
ALTER TABLE public.scout_final_reports ADD COLUMN IF NOT EXISTS kr_price TEXT;
COMMENT ON COLUMN public.scout_final_reports.kr_price IS 'Korean price string e.g. "12,000원"; drives kr_price_usd/estimated_cost_usd via trigger';

-- -----------------------------------------------------------------------------
-- 4. SCOUT_FINAL_REPORTS: status CHECK — 001 allows only draft|published|archived;
--    types/database.ts ReportStatus includes 'hidden'; admin UI may set hidden.
-- -----------------------------------------------------------------------------
ALTER TABLE public.scout_final_reports DROP CONSTRAINT IF EXISTS scout_final_reports_status_check;
ALTER TABLE public.scout_final_reports ADD CONSTRAINT scout_final_reports_status_check
  CHECK (status IN ('draft', 'published', 'archived', 'hidden'));

-- =============================================================================
-- End of 003_sync_from_live_audit.sql (reference only)
-- =============================================================================
```

**Migration files total:** 3 (`001`, `002`, `003`)

**Not in migrations but used in live DB / code:**
- `site_config` table (admin sample report config)
- `scout_products` table (Make.com pipeline staging — 446 rows, no app code)

---

## 7. LIVE SUPABASE DATABASE QUERY RESULTS

> **Method:** Service-role REST API probe (equivalent to SQL steps 4–5; `information_schema` not exposed via PostgREST).  
> **Date:** 2026-06-29

### 7.1 `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`

**Confirmed public tables (probed):**

| table_name | row_count | in migrations | in app code |
|------------|-----------|---------------|-------------|
| profiles | 8 | 001 | Yes |
| weeks | 9 | 001 | Yes |
| scout_final_reports | 229 | 001 | Yes |
| user_favorites | 0 | 003 (reference) | Yes |
| site_config | 1 | **No** | Yes (admin API) |
| scout_products | 446 | **No** | **No** |

**Note:** Other public tables may exist but were not probed. `auth.*` schema tables exist per Supabase default.

### 7.2 `scout_products` TABLE — **DOES NOT EXIST IN CODEBASE**

User query asked for `scout_products` — this table exists in **live DB only** (likely Make.com ingestion staging).

**Columns (from live sample row, inferred types):**

| column_name | data_type (inferred) |
|-------------|---------------------|
| id | uuid/string |
| raw_data_id | string |
| korean_name | string |
| english_name | null/string |
| naver_product_name | null/string |
| category | string |
| price | number |
| weight_g | string |
| manufacturer | string |
| description | string |
| ingredients_text | string |
| detail_html | string |
| image_url | string |
| purchase_link | string |
| source_platform | string |
| source_keyword | string |
| source_comment | string |
| status | string |
| is_verified | boolean |
| retry_count | number |
| next_retry_at | null/timestamptz |
| rejected_at | null/timestamptz |
| created_at | timestamptz |

### 7.3 `scout_final_reports` COLUMNS (live sample — 90+ columns)

The live table has significantly more columns than migration 001 alone. Full column list from live probe:

```
actual_weight_g, ai_detail_page_links, ai_image_url, b2b_inquiry_url, best_platform,
billable_weight_g, buzz_summary, can_oem, category, common_pain_point, competition_level,
composite_score, composition_info, consumer_insight, contact_email, contact_phone,
corporate_scale, created_at, customs_confidence, data_anomaly_alert, data_confidence,
dimensions_cm, edit_history, estimated_cost_usd, export_cert_note, export_posture,
export_status, free_list_at, gap_index, gap_status, global_evidence, global_prices,
global_site_url, global_trend_score, go_verdict, growth_evidence, growth_signal,
hazmat_status, hazmat_summary, hs_code, hs_description, id, image_url, is_premium,
is_teaser, key_risk_ingredient, kr_evidence, kr_local_score, kr_price, kr_price_usd,
kr_source_used, lead_time, m_address, m_homepage, m_name, market_viability,
min_order_hint, mom_growth, moq, naver_link, naver_product_name, new_content_volume,
opportunity_reasoning, platform_scores, product_id, product_name, profit_multiplier,
published_at, required_certificates, rising_keywords, sample_policy, scout_one_line,
search_volume, seo_keywords, shipping_notes, shipping_tier, sourcing_tip,
sourcing_tip_logistics, spec_summary, status, status_reason, strategy_price,
top_selling_point, translated_name, trend_entry_strategy, verified_at, verified_cost_note,
verified_cost_usd, viability_reason, video_url, video_url_2, video_url_3, viral_hashtags,
volumetric_weight_g, week_id, wholesale_link, wow_rate
```

**Live-only columns not in types/database.ts:** `customs_confidence`, `data_anomaly_alert`, `data_confidence`, `export_posture`, `m_address`, `min_order_hint`, `product_id`, `scout_one_line`, `sourcing_tip_logistics`

### 7.4 `site_config` live data

```json
[
  {
    "key": "sample_product_id",
    "value": "5a635b4c-8ac3-45d4-8bfc-a25000488767",
    "updated_at": "2026-05-20T03:00:01.135+00:00"
  }
]
```

---

## 8. AUTH / PERMISSION LOGIC

### 8.1 `grep tier|package|starter|pro|elite|alpha|standard app/**/*.tsx` — Files

```
app/page.tsx
app/layout.tsx
app/weekly/latest/page.tsx
app/weekly/[weekId]/[id]/page.tsx
app/admin/[id]/page.tsx
app/signup/page.tsx
app/sample-report/page.tsx
app/pricing/page.tsx
app/legal/privacy/page.tsx
app/legal/terms/page.tsx
app/weekly/[weekId]/page.tsx
app/admin/page.tsx
app/account/page.tsx
app/weekly/page.tsx
```

**Note:** No `starter`, `pro`, `elite` package names in app code. Tiers are **`free` | `standard` | `alpha`** only.

### 8.2 Core Auth: `lib/auth-server.ts`

| Function | Purpose |
|----------|---------|
| `getUserProfile()` | Returns user + `profiles.tier`, `subscription_start_at` |
| `getAuthTier()` | Returns `userId`, `userEmail`, `tier`, `subscriptionStartAt` |
| `maskReportByTier()` | Server-side field nulling before render (defense in depth) |

**maskReportByTier nulling rules:**
- **free + standard:** Logistics, supplier, media, verified cost, etc. (28 fields)
- **free only:** Market intel, social proof, gap data (22 additional fields)
- **alpha:** No masking (full report)

### 8.3 Component-Level Gating

| Pattern | Files |
|---------|-------|
| `canSeeStandard` | MarketIntelligence, SocialProofTrendIntelligence |
| `canSeeAlpha` | ProductIdentity, SourcingIntel, SupplierContact, GroupBBrokerSection, SocialProof (strategy section) |
| `LockedValue` | Wraps gated field display |
| `LockedSection` | Paywall placeholder UI (fake data + CTA) |
| `isTeaser` bypass | `canSeeAlpha = tier === "alpha" \|\| isTeaser` |

### 8.4 `ZombieWatermark` — `grep -r ZombieWatermark components/`

**Files:**
- `components/ZombieWatermark.tsx` (definition)
- `app/weekly/[weekId]/[id]/page.tsx` (usage when `userEmail` present)

**Behavior:** Fixed overlay with user email + date, opacity 0.028, MutationObserver re-attaches if removed from DOM. Print opacity 0.15.

### 8.5 RLS (Database Layer)

From `001_phase2_schema.sql` policy `report_access`:
- Published reports visible if: paid tier OR (free_list_at passed + not premium) OR is_teaser

### 8.6 Week Access: `lib/week-access.ts` (referenced by PDP)

- Free users: only oldest published week (>14 days)
- Paid users: rolling window based on `subscription_start_at` via `getAccessibleWeekIds()`

### 8.7 Billing Tier Updates

- `app/api/webhooks/lemonsqueezy/route.ts` — maps LemonSqueezy variant_id → `standard` | `alpha`, updates `profiles`

### 8.8 Admin Auth (Separate from User Auth)

- Env: `ADMIN_PASSWORD`, `ADMIN_COOKIE_NAME` (default `kps_admin_session`)
- Cookie value: literal string `"authenticated"`
- No role in `profiles` table for admin

---

## 9. TOKEN / SHARE LOGIC

### 9.1 `grep token|share|report app/**/*.tsx` — Files

```
app/account/page.tsx
app/weekly/[weekId]/page.tsx
app/legal/privacy/page.tsx
app/sample-report/page.tsx
app/page.tsx
app/pricing/page.tsx
app/weekly/page.tsx
app/admin/page.tsx
app/admin/[id]/page.tsx
app/legal/terms/page.tsx
app/weekly/[weekId]/[id]/page.tsx
```

### 9.2 Analysis

| Expected feature | Status |
|------------------|--------|
| Share link with token | **NOT IMPLEMENTED** |
| Report access token | **NOT IMPLEMENTED** |
| JWT share tokens | **NOT IMPLEMENTED** |
| `share_token` DB column | **NOT FOUND** |

**Matches are incidental:**
- `report` = product report entity
- `share` in privacy policy = "do not share personal data"
- `token` in middleware = Supabase session token refresh
- `sample-report` page = public teaser via `is_teaser` flag, not token

**Sample report access:** `site_config.sample_product_id` + `is_teaser=true` on that report row.

---

## 10. ENVIRONMENT VARIABLES (Admin-Related)

| Variable | Used By |
|----------|---------|
| `ADMIN_PASSWORD` | `/api/admin/auth` |
| `ADMIN_COOKIE_NAME` | middleware, all admin API routes |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase/admin.ts`, admin APIs |
| `NEXT_PUBLIC_SUPABASE_URL` | All Supabase clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | User-facing Supabase |
| `ANTHROPIC_API_KEY` | Script generator |
| `ELEVENLABS_API_KEY` | Voiceover generator |
| `ELEVENLABS_VOICE_ID` | Voiceover generator |

---

## 11. SCHEMA / CODE GAPS (Audit Findings)

1. **`scout_products`** exists in live DB (446 rows) but has **zero application references** — likely Make.com-only pipeline table.
2. **`site_config`** used by admin but **not in any migration file**.
3. **`scout_final_reports`** live schema has ~15+ columns beyond `types/database.ts`.
4. **Admin UI contains Korean text** in script-generator and edit page labels (product rule: UI should be English).
5. **Admin auth** is single shared password cookie — no per-user audit trail, no 2FA.
6. **`status: hidden`** used in admin but RLS policy only checks `status = 'published'` — hidden reports won't appear to users (intended).
7. **Migration 003** marked "DO NOT RUN ON LIVE" — live DB already has diverged schema.

---

## 12. FILE SIZE REFERENCE (Admin Full Content Locations)

| File | Lines | Repository Path |
|------|-------|-----------------|
| Admin login | 70 | `app/admin/login/page.tsx` |
| Admin list | 190 | `app/admin/page.tsx` |
| Admin edit | 1,655 | `app/admin/[id]/page.tsx` |
| Script generator | 353 | `app/admin/script-generator/page.tsx` |
| GlobalPricesHelper | 599 | `components/admin/GlobalPricesHelper.tsx` |
| AiPageLinksHelper | 94 | `components/admin/AiPageLinksHelper.tsx` |
| HazmatCheckboxes | 87 | `components/admin/HazmatCheckboxes.tsx` |

All files were read in full during this audit. Full source is in the repository at the paths above.

---

*End of scan_report_system.md*
