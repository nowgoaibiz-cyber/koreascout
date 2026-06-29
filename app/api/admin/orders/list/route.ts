import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

function isAdminAuthed(req: NextRequest): boolean {
  const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
  return req.cookies.get(cookieName)?.value === "authenticated";
}

type ShareTokenRow = {
  token: string;
  expires_at: string;
  is_active: boolean;
};

type OrderRow = {
  id: string;
  buyer_name: string;
  platform: string;
  package_tier: string;
  created_at: string;
  share_tokens: ShareTokenRow[] | ShareTokenRow | null;
  order_products: { count: number }[] | null;
};

function resolveStatus(
  token: ShareTokenRow | null
): "active" | "expired" | "deactivated" {
  if (!token) return "expired";
  if (!token.is_active) return "deactivated";
  if (new Date(token.expires_at) < new Date()) return "expired";
  return "active";
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("client_orders")
      .select(
        `
        id,
        buyer_name,
        platform,
        package_tier,
        created_at,
        share_tokens ( token, expires_at, is_active ),
        order_products ( count )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET /api/admin/orders/list]", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const orders = ((data ?? []) as OrderRow[]).map((row) => {
      const tokenRow = Array.isArray(row.share_tokens)
        ? row.share_tokens[0] ?? null
        : row.share_tokens;
      const productCount = row.order_products?.[0]?.count ?? 0;
      const status = resolveStatus(tokenRow);
      const token = tokenRow?.token ?? "";
      const url = token ? `https://koreascout.com/report/${token}` : "";

      return {
        id: row.id,
        buyer_name: row.buyer_name,
        platform: row.platform,
        package_tier: row.package_tier,
        product_count: productCount,
        expires_at: tokenRow?.expires_at ?? null,
        is_active: tokenRow?.is_active ?? false,
        token,
        url,
        status,
        created_at: row.created_at,
      };
    });

    return NextResponse.json(orders);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch orders";
    console.error("[GET /api/admin/orders/list]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
