import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { ScoutFinalReportsRow } from "@/types/database";

function assertAdmin(request: NextRequest): boolean {
  const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
  const cookie = request.cookies.get(cookieName);
  return cookie?.value === "authenticated";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("scout_final_reports")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "Not found" },
        { status: error?.code === "PGRST116" ? 404 : 500 }
      );
    }
    return NextResponse.json(data as ScoutFinalReportsRow);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  let body: Partial<ScoutFinalReportsRow>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id: _id, created_at: _ca, ...updates } = body as Partial<ScoutFinalReportsRow> & { id?: string; created_at?: string };
  if ("kr_price_usd" in updates) delete (updates as Record<string, unknown>).kr_price_usd;
  if ("estimated_cost_usd" in updates) delete (updates as Record<string, unknown>).estimated_cost_usd;

  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("scout_final_reports")
      .update(updates)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const weekId = updates.week_id;
    if (typeof weekId === "string" && weekId) {
      revalidatePath(`/weekly/${weekId}/${id}`);
    }
    revalidatePath("/weekly");
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update" },
      { status: 500 }
    );
  }
}
