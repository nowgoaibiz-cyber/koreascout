import { createClient } from "@/lib/supabase/server";
import { HeaderShellClient } from "./HeaderShellClient";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <HeaderShellClient user={user} />;
}
