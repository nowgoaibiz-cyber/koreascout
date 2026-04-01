import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/weekly";

  // Force www domain to prevent cookie domain mismatch
  const baseUrl = origin.includes("www.")
    ? origin
    : origin.replace("https://", "https://www.");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth Callback Error:", error.message);
      return NextResponse.redirect(
        `${baseUrl}/login?error=invalid_recovery_link`
      );
    }
  }

  if (type === "recovery") {
    return NextResponse.redirect(`${baseUrl}/reset-password`);
  }

  return NextResponse.redirect(`${baseUrl}${next}`);
}
