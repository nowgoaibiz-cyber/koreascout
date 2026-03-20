```text
L1:import { createClient } from "@/lib/supabase/server";
L2:import type { ScoutFinalReportsRow, Tier } from "@/types/database";
L3:
L4:export interface AuthResult {
L5:  userId: string | null;
L6:  userEmail: string | null;
L7:  tier: Tier;
L8:  subscriptionStartAt: string | null;
L9:}
L10:
L11:/**
L12: * Get current user id and tier for server components.
L13: * Guests and unauthenticated users get tier 'free'.
L14: * RLS uses this tier for report_access on scout_final_reports.
L15: */
L16:export async function getAuthTier(): Promise<AuthResult> {
L17:  const supabase = await createClient();
L18:  const {
L19:    data: { user },
L20:  } = await supabase.auth.getUser();
L21:  if (!user) {
L22:    return { userId: null, userEmail: null, tier: "free", subscriptionStartAt: null };
L23:  }
L24:  const { data: profile } = await supabase
L25:    .from("profiles")
L26:    .select("tier, subscription_start_at")
L27:    .eq("id", user.id)
L28:    .single();
L29:  const tier = (profile?.tier as Tier) ?? "free";
L30:  return {
L31:    userId: user.id,
L32:    userEmail: user.email ?? null,
L33:    tier,
L34:    subscriptionStartAt: profile?.subscription_start_at ?? null,
L35:  };
L36:}
L37:
L38:export function maskReportByTier(
L39:  report: ScoutFinalReportsRow,
L40:  tier: "free" | "standard" | "alpha"
L41:): ScoutFinalReportsRow {
L42:  if (tier === "alpha") return report;
L43:
L44:  const masked = { ...report };
L45:
L46:  // Fields nulled for BOTH free and standard
L47:  const nullForFreeAndStandard = [
L48:    "export_status",
L49:    "status_reason",
L50:    "actual_weight_g",
L51:    "volumetric_weight_g",
L52:    "billable_weight_g",
L53:    "dimensions_cm",
L54:    "shipping_tier",
L55:    "required_certificates",
L56:    "shipping_notes",
L57:    "hazmat_status",
L58:    "key_risk_ingredient",
L59:    "composition_info",
L60:    "spec_summary",
L61:    "hazmat_summary",
L62:    "sourcing_tip",
L63:    "hs_code",
L64:    "hs_description",
L65:    "verified_cost_usd",
L66:    "verified_cost_note",
L67:    "verified_at",
L68:    "moq",
L69:    "lead_time",
L70:    "can_oem",
L71:    "m_name",
L72:    "translated_name",
L73:    "corporate_scale",
L74:    "contact_email",
L75:    "contact_phone",
L76:    "m_homepage",
L77:    "naver_link",
L78:    "wholesale_link",
L79:    "global_site_url",
L80:    "b2b_inquiry_url",
L81:    "sample_policy",
L82:    "export_cert_note",
L83:    "viral_video_url",
L84:    "video_url",
L85:    "ai_detail_page_links",
L86:    "marketing_assets_url",
L87:    "ai_image_url",
L88:  ] as const;
L89:
L90:  // Additional fields nulled for FREE only (not standard)
L91:  const nullForFreeOnly = [
L92:    "profit_multiplier",
L93:    "estimated_cost_usd",
L94:    "global_prices",
L95:    "search_volume",
L96:    "mom_growth",
L97:    "wow_rate",
L98:    "top_selling_point",
L99:    "common_pain_point",
L100:    "best_platform",
L101:    "gap_index",
L102:    "gap_status",
L103:    "buzz_summary",
L104:    "rising_keywords",
L105:    "seo_keywords",
L106:    "viral_hashtags",
L107:    "trend_entry_strategy",
L108:    "opportunity_reasoning",
L109:    "kr_local_score",
L110:    "global_trend_score",
L111:    "kr_evidence",
L112:    "global_evidence",
L113:    "kr_source_used",
L114:  ] as const;
L115:
L116:  for (const key of nullForFreeAndStandard) {
L117:    (masked as Record<string, unknown>)[key] = null;
L118:  }
L119:
L120:  if (tier === "free") {
L121:    for (const key of nullForFreeOnly) {
L122:      (masked as Record<string, unknown>)[key] = null;
L123:    }
L124:  }
L125:
L126:  return masked;
L127:}
L128:```

