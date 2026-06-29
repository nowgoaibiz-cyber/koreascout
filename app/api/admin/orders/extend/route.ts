import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceRoleClient } from "@/lib/supabase/admin";

function addDays(iso: string, days: number): string {
  const date = new Date(iso);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get("kps_admin_session")?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { orderId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const orderId = body.orderId;
  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  try {
    const supabase = createServiceRoleClient();

    const { data: tokenRow, error: fetchError } = await supabase
      .from("share_tokens")
      .select("expires_at")
      .eq("order_id", orderId)
      .maybeSingle();

    if (fetchError) {
      console.error("[PATCH /api/admin/orders/extend] fetch:", fetchError.message);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!tokenRow?.expires_at) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const newExpiresAt = addDays(tokenRow.expires_at, 30);

    const { error: tokenError } = await supabase
      .from("share_tokens")
      .update({ expires_at: newExpiresAt })
      .eq("order_id", orderId);

    if (tokenError) {
      console.error("[PATCH /api/admin/orders/extend] share_tokens:", tokenError.message);
      return NextResponse.json({ error: tokenError.message }, { status: 500 });
    }

    const { error: orderError } = await supabase
      .from("client_orders")
      .update({ expires_at: newExpiresAt })
      .eq("id", orderId);

    if (orderError) {
      console.error("[PATCH /api/admin/orders/extend] client_orders:", orderError.message);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, new_expires_at: newExpiresAt });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to extend order";
    console.error("[PATCH /api/admin/orders/extend]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
