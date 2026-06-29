import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

const PACKAGE_LIMITS: Record<string, number> = {
  starter: 1,
  pro: 3,
  elite: 5,
};

const VALID_PLATFORMS = ["Fiverr", "Upwork", "Contra", "Freelancer", "Direct"];
const VALID_PACKAGES = ["starter", "pro", "elite"];

function isAdminAuthed(req: NextRequest): boolean {
  const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
  return req.cookies.get(cookieName)?.value === "authenticated";
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    buyer_name?: string;
    platform?: string;
    package_tier?: string;
    report_ids?: string[];
    note?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { buyer_name: rawBuyerName, platform, package_tier: rawPackageTier, report_ids, note } =
    body;
  const buyer_name = rawBuyerName?.trim();
  const package_tier = rawPackageTier?.toLowerCase();

  if (!buyer_name) {
    return NextResponse.json({ error: "buyer_name is required" }, { status: 400 });
  }
  if (!platform || !VALID_PLATFORMS.includes(platform)) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
  }
  if (!package_tier || !VALID_PACKAGES.includes(package_tier)) {
    return NextResponse.json({ error: "Invalid package_tier" }, { status: 400 });
  }
  if (!Array.isArray(report_ids) || report_ids.length === 0) {
    return NextResponse.json({ error: "report_ids must be a non-empty array" }, { status: 400 });
  }

  const expectedCount = PACKAGE_LIMITS[package_tier];
  if (report_ids.length !== expectedCount) {
    return NextResponse.json(
      {
        error: `Package "${package_tier}" requires exactly ${expectedCount} product(s), got ${report_ids.length}`,
      },
      { status: 400 }
    );
  }

  try {
    const supabase = createServiceRoleClient();

    const { data: order, error: orderError } = await supabase
      .from("client_orders")
      .insert({
        buyer_name,
        platform: platform.toLowerCase(),
        package_tier,
        notes: note || null,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("[POST /api/admin/orders/create] order insert:", orderError?.message);
      return NextResponse.json(
        { error: orderError?.message ?? "Failed to create order" },
        { status: 500 }
      );
    }

    const orderProducts = report_ids.map((report_id) => ({
      order_id: order.id,
      report_id,
    }));

    const { error: productsError } = await supabase
      .from("order_products")
      .insert(orderProducts);

    if (productsError) {
      console.error("[POST /api/admin/orders/create] products insert:", productsError.message);
      return NextResponse.json({ error: productsError.message }, { status: 500 });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 60);

    const { error: tokenError } = await supabase.from("share_tokens").insert({
      order_id: order.id,
      token,
      expires_at: expiresAt.toISOString(),
      is_active: true,
    });

    if (tokenError) {
      console.error("[POST /api/admin/orders/create] token insert:", tokenError.message);
      return NextResponse.json({ error: tokenError.message }, { status: 500 });
    }

    const url = `https://koreascout.com/report/${token}`;
    return NextResponse.json({ token, url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create order";
    console.error("[POST /api/admin/orders/create]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
