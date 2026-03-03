import { createClient } from "@/lib/supabase/server";
import type { Tier } from "@/types/database";

export interface AuthResult {
  userId: string | null;
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
    return { userId: null, tier: "free", subscriptionStartAt: null };
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier, subscription_start_at")
    .eq("id", user.id)
    .single();
  const tier = (profile?.tier as Tier) ?? "free";
  return {
    userId: user.id,
    tier,
    subscriptionStartAt: profile?.subscription_start_at ?? null,
  };
}
