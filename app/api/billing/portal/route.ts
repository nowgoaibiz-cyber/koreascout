import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. 현재 로그인 유저 확인
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. profiles에서 ls_subscription_id 가져오기
    const admin = createServiceRoleClient();
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("ls_subscription_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.ls_subscription_id) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    // 3. LemonSqueezy API 호출
    const lsRes = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions/${profile.ls_subscription_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
          Accept: "application/vnd.api+json",
        },
      }
    );

    if (!lsRes.ok) {
      console.error("[billing/portal] LemonSqueezy API error:", lsRes.status);
      return NextResponse.json({ error: "Failed to fetch portal URL" }, { status: 502 });
    }

    const lsData = await lsRes.json();
    const portalUrl = lsData?.data?.attributes?.urls?.customer_portal;

    if (!portalUrl) {
      return NextResponse.json({ error: "Portal URL not available" }, { status: 404 });
    }

    return NextResponse.json({ url: portalUrl });
  } catch (e) {
    console.error("[billing/portal] error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
