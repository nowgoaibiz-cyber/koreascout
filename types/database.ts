/**
 * Database types for Supabase tables (Phase 2 + v1.3 확장).
 * Use with createClient() for typed CRUD when needed:
 *   const supabase = createClient() as SupabaseClient<Database>
 * Or pass to createServerClient/createBrowserClient options.
 * JSONB → Json; TEXT[] → string[] | null.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Tier = "free" | "standard" | "alpha";
export type WeekStatus = "draft" | "published" | "archived";
export type ReportStatus = "draft" | "published" | "archived" | "hidden";

export interface ProfilesRow {
  id: string;
  email: string;
  tier: Tier;
  ls_customer_id: string | null;
  ls_subscription_id: string | null;
  tier_updated_at: string | null;
  created_at: string;
}

export interface WeeksRow {
  week_id: string;
  week_label: string;
  start_date: string;
  end_date: string;
  published_at: string | null;
  product_count: number;
  summary: string | null;
  status: WeekStatus;
}

export interface ScoutFinalReportsRow {
  id: string;
  week_id: string;
  product_name: string;
  naver_product_name?: string | null;
  translated_name: string;
  image_url: string;
  ai_image_url: string | null;
  summary: string | null;
  consumer_insight: string | null;
  /** v1.3: optional product composition info (Section 1 accordion). May be null or absent on older rows. */
  composition_info?: string | null;
  /** v1.3: optional spec summary text block (Section 1 accordion). */
  spec_summary?: string | null;
  category: string;
  viability_reason: string;
  market_viability: number;
  competition_level: string;
  profit_multiplier: string;
  search_volume: string;
  mom_growth: string;
  gap_status: string;
  /** JSONB — 국가별 가격 { "US": "$24.99", ... } */
  global_price: Json | null;
  /** TEXT[] or comma-separated TEXT from pipeline */
  seo_keywords: string | string[] | null;
  export_status: string;
  hs_code: string | null;
  sourcing_tip: string | null;
  manufacturer_check: string | null;
  m_name: string | null;
  corporate_scale?: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  m_homepage: string | null;
  naver_link: string | null;
  wholesale_link?: string | null;
  global_site_url?: string | null;
  b2b_inquiry_url?: string | null;
  video_url: string | null;
  competitor_analysis_pdf: string | null;
  /** v1.2: 바이럴 숏폼 영상 URL */
  viral_video_url: string | null;
  published_at: string | null;
  free_list_at: string | null;
  is_premium: boolean;
  is_teaser: boolean;
  status: ReportStatus;
  created_at: string;
  /* ----- v1.3 신규 컬럼 (28개 중 선반영; 나머지는 마이그레이션 확정 후 추가) ----- */
  /** 한국 가격 (예: "12,000원") */
  kr_price?: string | null;
  /** Auto-calculated: kr_price in USD (trigger). */
  kr_price_usd?: number | null;
  /** Auto-calculated: estimated wholesale cost USD (trigger). */
  estimated_cost_usd?: number | null;
  /** Alpha: verified unit cost from supplier (admin input). */
  verified_cost_usd?: string | null;
  /** Alpha: note e.g. "undisclosed". */
  verified_cost_note?: string | null;
  /** Alpha: minimum order quantity. */
  moq?: string | null;
  /** Alpha: lead time. */
  lead_time?: string | null;
  /** 국가별 가격 상세 (JSONB). e.g. { us: { price: string }, ... } */
  global_prices?: Json | null;
  /** 플랫폼별 점수/지표 (JSONB) */
  platform_scores?: Json | null;
  /** WoW 성장률 (Section 3) */
  wow_rate?: string | null;
  /** Best platform recommendation (e.g. "Amazon FBA") */
  best_platform?: string | null;
  /** Seller Intelligence accordion */
  top_selling_point?: string | null;
  common_pain_point?: string | null;
  /** Hashtag pills, click to copy */
  viral_hashtags?: string[] | null;
  /* ----- Section 4 Social Proof & Trend Intelligence ----- */
  buzz_summary?: string | null;
  rising_keywords?: string[] | null;
  /** Korea local score 0–100 (Gap Analysis) */
  kr_local_score?: number | null;
  /** Global trend score 0–100 (Gap Analysis) */
  global_trend_score?: number | null;
  /** Gap index (e.g. 47). Can be derived or stored. */
  gap_index?: number | null;
  opportunity_reasoning?: string | null;
  trend_entry_strategy?: string | null;
  new_content_volume?: string | null;
  kr_evidence?: string | null;
  global_evidence?: string | null;
  growth_evidence?: string | null;
  kr_source_used?: string | null;
  growth_signal?: string | null;
  /* ----- Section 6 Export & Logistics Intel ----- */
  /** HS description text shown under hs_code */
  hs_description?: string | null;
  /** Hazmat JSONB status flags */
  hazmat_status?: Json | null;
  /** Dimensions in centimeters, e.g. "15 × 8 × 5" */
  dimensions_cm?: string | null;
  /** Billable weight (grams) used for shipping cost */
  billable_weight_g?: number | null;
  /** Shipping tier label, e.g. "Standard Parcel" */
  shipping_tier?: string | null;
  /** Comma-separated certificates, e.g. "FDA 510K, CE" */
  required_certificates?: string | null;
  /** Freeform logistics notes */
  shipping_notes?: string | null;
  sourcing_tip_logistics?: string | null;
  hazmat_summary?: string | null;
  can_oem?: boolean | null;
  /** Key risky ingredient to highlight */
  key_risk_ingredient?: string | null;
  /** Regulatory or status reasoning text */
  status_reason?: string | null;
  /** Actual physical weight (grams) */
  actual_weight_g?: number | null;
  /** Volumetric weight (grams) */
  volumetric_weight_g?: number | null;
  /* ----- Launch & Execution Kit / Section 6 신규 컬럼 ----- */
  /** Marketing assets (e.g. image pack, banner) URL */
  marketing_assets_url?: string | null;
  /** AI-generated detail/landing page links (URL or JSON array of URLs) */
  ai_detail_page_links?: string | null;
  /** When supplier pricing/contact was verified (ISO timestamp) */
  verified_at?: string | null;
  /** Sample order / sampling policy text */
  sample_policy?: string | null;
  /** Export or certification note for customs/compliance */
  export_cert_note?: string | null;
  /** Admin edit history log: { entries: [{ timestamp, changes: [{ field, before, after }] }] } */
  edit_history?: Json | null;
  composite_score?: number | null;
  go_verdict?: string | null;
}

export interface UserFavoritesRow {
  user_id: string;
  report_id: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: ProfilesRow; Insert: Omit<ProfilesRow, "created_at"> & { created_at?: string }; Update: Partial<ProfilesRow> };
      weeks: { Row: WeeksRow; Insert: Omit<WeeksRow, "product_count"> & { product_count?: number }; Update: Partial<WeeksRow> };
      scout_final_reports: { Row: ScoutFinalReportsRow; Insert: Omit<ScoutFinalReportsRow, "id" | "created_at"> & { id?: string; created_at?: string }; Update: Partial<ScoutFinalReportsRow> };
      user_favorites: { Row: UserFavoritesRow; Insert: Omit<UserFavoritesRow, "created_at"> & { created_at?: string }; Update: Partial<UserFavoritesRow> };
    };
  };
}
