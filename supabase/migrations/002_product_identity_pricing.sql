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
