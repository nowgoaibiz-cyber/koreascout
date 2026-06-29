import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { ScoutFinalReportsRow } from "@/types/database";

type ClientOrderRow = {
  id: string;
  buyer_name: string;
  package_tier: string;
  platform: string;
  created_at: string;
};

type ShareTokenRow = {
  token: string;
  expires_at: string;
  is_active: boolean;
  order_id: string;
  client_orders: ClientOrderRow | ClientOrderRow[] | null;
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token?.trim()) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  try {
    const supabase = createServiceRoleClient();
    const now = new Date().toISOString();

    const { data: tokenRow, error: tokenError } = await supabase
      .from("share_tokens")
      .select(
        `
        token,
        expires_at,
        is_active,
        order_id,
        client_orders (
          id,
          buyer_name,
          package_tier,
          platform,
          created_at
        )
      `
      )
      .eq("token", token)
      .eq("is_active", true)
      .gt("expires_at", now)
      .maybeSingle();

    if (tokenError || !tokenRow) {
      return NextResponse.json({ error: "Link expired or invalid" }, { status: 404 });
    }

    const row = tokenRow as ShareTokenRow;
    const order = Array.isArray(row.client_orders)
      ? row.client_orders[0] ?? null
      : row.client_orders;

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const { data: orderProducts, error: productsError } = await supabase
      .from("order_products")
      .select("report_id")
      .eq("order_id", order.id);

    if (productsError) {
      console.error("[GET /api/report/[token]] order_products:", productsError.message);
      return NextResponse.json({ error: productsError.message }, { status: 500 });
    }

    const reportIds = (orderProducts ?? []).map((op) => op.report_id as string);
    if (reportIds.length === 0) {
      return NextResponse.json({ error: "No reports linked to this order" }, { status: 404 });
    }

    const { data: reports, error: reportsError } = await supabase
      .from("scout_final_reports")
      .select("*")
      .in("id", reportIds);

    if (reportsError) {
      console.error("[GET /api/report/[token]] scout_final_reports:", reportsError.message);
      return NextResponse.json({ error: reportsError.message }, { status: 500 });
    }

    const reportMap = new Map(
      (reports ?? []).map((r) => [r.id as string, r as ScoutFinalReportsRow])
    );
    const orderedReports = reportIds
      .map((id) => reportMap.get(id))
      .filter((r): r is ScoutFinalReportsRow => r != null);

    return NextResponse.json({
      order: {
        id: order.id,
        buyer_name: order.buyer_name,
        package_tier: order.package_tier,
        platform: order.platform,
        created_at: order.created_at,
        expires_at: row.expires_at,
      },
      reports: orderedReports,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load report";
    console.error("[GET /api/report/[token]]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
