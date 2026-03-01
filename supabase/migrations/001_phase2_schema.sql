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
