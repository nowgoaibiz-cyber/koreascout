import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export const revalidate = 60;

export async function GET() {
  try {
    const supabase = createServiceRoleClient();
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("tier", "alpha");

    if (error) {
      console.error("[alpha-count]", error);
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: count ?? 0 });
  } catch (err) {
    console.error("[alpha-count]", err);
    return NextResponse.json({ count: 0 });
  }
}
