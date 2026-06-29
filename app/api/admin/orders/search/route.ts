import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

function isAdminAuthed(req: NextRequest): boolean {
  const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
  return req.cookies.get(cookieName)?.value === "authenticated";
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("scout_final_reports")
      .select("id, translated_name, product_name, market_viability")
      .or(`translated_name.ilike.%${q}%,product_name.ilike.%${q}%`)
      .limit(10);

    if (error) {
      console.error("[GET /api/admin/orders/search]", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Search failed";
    console.error("[GET /api/admin/orders/search]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
