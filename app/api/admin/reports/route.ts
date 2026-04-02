import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
  const cookie = request.cookies.get(cookieName);
  if (cookie?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    const msg = !url
      ? "Missing NEXT_PUBLIC_SUPABASE_URL in environment"
      : "Missing SUPABASE_SERVICE_ROLE_KEY in environment";
    console.error("[GET /api/admin/reports]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("scout_final_reports")
      .select("id, product_name, week_id, market_viability, status, created_at")
      .order("market_viability", { ascending: false })
      .order("naver_product_name", { ascending: true }); // newest first for Admin List View

    if (error) {
      console.error("[GET /api/admin/reports] Supabase error:", error.message, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data ?? []);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch";
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[GET /api/admin/reports] Exception:", message, stack ?? err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
