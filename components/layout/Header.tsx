import { createClient } from "@/lib/supabase/server";
import { HeaderShellClient } from "./HeaderShellClient";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let tier = "free";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("tier")
      .eq("id", user.id)
      .single();
    tier = profile?.tier ?? "free";
  }

  return <HeaderShellClient user={user} tier={tier} />;
}
