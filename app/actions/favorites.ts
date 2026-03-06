"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Toggle a product report in the current user's favorites.
 * If the report is already favorited, remove it; otherwise add it.
 * Revalidates /weekly/[weekId] and /account so the UI updates immediately.
 * @param weekId Optional; when provided, revalidates that week's page.
 */
export async function toggleFavorite(
  reportId: string,
  weekId?: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Not authenticated" };
  }

  const { data: existing } = await supabase
    .from("user_favorites")
    .select("report_id")
    .eq("user_id", user.id)
    .eq("report_id", reportId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("report_id", reportId);
    if (error) {
      console.error("[favorites] delete error:", error);
      return { ok: false, error: error.message };
    }
  } else {
    const { error } = await supabase.from("user_favorites").insert({
      user_id: user.id,
      report_id: reportId,
    });
    if (error) {
      console.error("[favorites] insert error:", error);
      return { ok: false, error: error.message };
    }
  }

  revalidatePath("/account");
  if (weekId) revalidatePath(`/weekly/${weekId}`);
  return { ok: true };
}
