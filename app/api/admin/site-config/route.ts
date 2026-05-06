import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

function isAdminAuthed(req: NextRequest): boolean {
  const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
  return req.cookies.get(cookieName)?.value === "authenticated";
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", key)
    .single();
  return NextResponse.json({ value: data?.value ?? null });
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { key, value } = await req.json();
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });
  const supabase = createServiceRoleClient();
  await supabase.from("site_config").upsert({
    key,
    value,
    updated_at: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true });
}
