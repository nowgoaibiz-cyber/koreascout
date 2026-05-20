import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";
import type { ScoutFinalReportsRow, Tier } from "@/types/database";

export interface UserProfile {
  tier: Tier;
  subscription_start_at: string | null;
}

export interface UserProfileResult {
  user: User | null;
  profile: UserProfile | null;
}

export async function getUserProfile(): Promise<UserProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { user: null, profile: null };
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier, subscription_start_at")
    .eq("id", user.id)
    .single();
  if (!profile) {
    return { user, profile: null };
  }
  return {
    user,
    profile: {
      tier: (profile.tier as Tier) ?? "free",
      subscription_start_at: profile.subscription_start_at ?? null,
    },
  };
}

export interface AuthResult {
  userId: string | null;
  userEmail: string | null;
  tier: Tier;
  subscriptionStartAt: string | null;
}

/**
 * Get current user id and tier for server components.
 * Guests and unauthenticated users get tier 'free'.
 * RLS uses this tier for report_access on scout_final_reports.
 */
export async function getAuthTier(): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { userId: null, userEmail: null, tier: "free", subscriptionStartAt: null };
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier, subscription_start_at")
    .eq("id", user.id)
    .single();
  const tier = (profile?.tier as Tier) ?? "free";
  return {
    userId: user.id,
    userEmail: user.email ?? null,
    tier,
    subscriptionStartAt: profile?.subscription_start_at ?? null,
  };
}

export function maskReportByTier(
  report: ScoutFinalReportsRow,
  tier: "free" | "standard" | "alpha"
): ScoutFinalReportsRow {
  if (tier === "alpha") return report;

  const masked = { ...report };

  // Fields nulled for BOTH free and standard
  const nullForFreeAndStandard = [
    "export_status",
    "status_reason",
    "actual_weight_g",
    "volumetric_weight_g",
    "billable_weight_g",
    "dimensions_cm",
    "shipping_tier",
    "required_certificates",
    "shipping_notes",
    "hazmat_status",
    "key_risk_ingredient",
    "composition_info",
    "spec_summary",
    "hazmat_summary",
    "sourcing_tip",
    "hs_code",
    "hs_description",
    "verified_cost_usd",
    "verified_cost_note",
    "verified_at",
    "moq",
    "lead_time",
    "can_oem",
    "m_name",
    "translated_name",
    "corporate_scale",
    "contact_email",
    "contact_phone",
    "m_homepage",
    "naver_link",
    "wholesale_link",
    "global_site_url",
    "b2b_inquiry_url",
    "sample_policy",
    "export_cert_note",
    "video_url_2",
    "video_url",
    "ai_detail_page_links",
    "video_url_3",
    "ai_image_url",
  ] as const;

  // Additional fields nulled for FREE only (not standard)
  const nullForFreeOnly = [
    "profit_multiplier",
    "estimated_cost_usd",
    "global_prices",
    "search_volume",
    "mom_growth",
    "wow_rate",
    "top_selling_point",
    "common_pain_point",
    "best_platform",
    "gap_index",
    "gap_status",
    "buzz_summary",
    "rising_keywords",
    "seo_keywords",
    "viral_hashtags",
    "trend_entry_strategy",
    "opportunity_reasoning",
    "kr_local_score",
    "global_trend_score",
    "kr_evidence",
    "global_evidence",
    "kr_source_used",
  ] as const;

  for (const key of nullForFreeAndStandard) {
    (masked as Record<string, unknown>)[key] = null;
  }

  if (tier === "free") {
    for (const key of nullForFreeOnly) {
      (masked as Record<string, unknown>)[key] = null;
    }
  }

  return masked;
}
