import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { HeaderNavClient } from "./HeaderNavClient";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-[88px] flex items-center justify-between px-6 pt-4 pb-1 border-b border-[#E8E6E1] bg-[#F8F7F4]">
      <Link
        href="/"
        className="flex items-center justify-center shrink-0 max-w-[320px] [background:transparent] [background-color:transparent!important] [background-image:none!important]"
      >
        <Image
          src="/images/KoreaScout_LOGO.png"
          alt="KoreaScout Logo"
          width={320}
          height={80}
          priority
          className="w-full max-w-[320px] h-auto object-contain mix-blend-multiply"
        />
      </Link>
      <HeaderNavClient user={user} />
    </header>
  );
}
