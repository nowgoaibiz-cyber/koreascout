import { createClient } from "@/lib/supabase/server";

export async function getAccessibleWeekIds(
  subscriptionStartAt: string | null,
  isPaid: boolean
): Promise<string[]> {
  if (!isPaid || !subscriptionStartAt) return [];

  const supabase = await createClient();
  const signupDate = new Date(subscriptionStartAt);
  const now = new Date();

  const { data: weeksAtSignup } = await supabase
    .from("weeks")
    .select("week_id")
    .eq("status", "published")
    .lte("published_at", signupDate.toISOString())
    .order("published_at", { ascending: false })
    .limit(3);

  const initialWeekIds = (weeksAtSignup ?? []).map((w) => w.week_id);

  const { data: weeksAfterSignup } = await supabase
    .from("weeks")
    .select("week_id")
    .eq("status", "published")
    .gt("published_at", signupDate.toISOString())
    .lte("published_at", now.toISOString())
    .order("published_at", { ascending: true });

  const accumulatedWeekIds = (weeksAfterSignup ?? []).map((w) => w.week_id);

  return [...new Set([...initialWeekIds, ...accumulatedWeekIds])];
}
