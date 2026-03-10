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
