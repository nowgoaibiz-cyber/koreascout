import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { HeaderNavClient } from "./HeaderNavClient";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white border-b border-[#E8E6E1]">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-xl font-bold text-[#1A1916] tracking-tight">
            KoreaScout
          </span>
          <span className="text-[#9E9C98] font-light border-l border-[#E8E6E1] pl-2.5 hidden sm:inline text-base">
            Intelligence
          </span>
        </Link>
        <HeaderNavClient user={user} />
      </div>
    </header>
  );
}
