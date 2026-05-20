import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthTier } from "@/lib/auth-server";

export default async function LatestWeeklyPage() {
  const supabase = await createClient();
  const { userId, tier, subscriptionStartAt } = await getAuthTier();

  if (!userId) {
    redirect("/login");
  }

  let query = supabase
    .from("weeks")
    .select("week_id")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1);

  if (tier === "alpha" && subscriptionStartAt) {
    query = query
      .gte("published_at", subscriptionStartAt)
      .lte("published_at", new Date().toISOString());
  } else if (tier === "free") {
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    query = query.lt("published_at", fourteenDaysAgo);
  } else {
    redirect("/weekly");
  }

  const { data: latestWeek } = await query.single();

  if (latestWeek) {
    redirect(`/weekly/${latestWeek.week_id}`);
  } else {
    redirect("/weekly");
  }
}
