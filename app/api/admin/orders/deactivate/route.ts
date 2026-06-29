import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

function isAdminAuthed(req: NextRequest): boolean {
  const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
  return req.cookies.get(cookieName)?.value === "authenticated";
}

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { order_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const order_id = body.order_id;
  if (!order_id) {
    return NextResponse.json({ error: "order_id is required" }, { status: 400 });
  }

  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("share_tokens")
      .update({ is_active: false })
      .eq("order_id", order_id);

    if (error) {
      console.error("[PATCH /api/admin/orders/deactivate]", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to deactivate";
    console.error("[PATCH /api/admin/orders/deactivate]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
