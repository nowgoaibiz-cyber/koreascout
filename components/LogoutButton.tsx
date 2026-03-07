"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LogoutButtonProps = { className?: string; style?: React.CSSProperties };

export function LogoutButton({ className, style }: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={className ?? "text-sm font-medium text-[#6B6860] hover:text-[#1A1916] transition-colors"}
      style={style}
    >
      Logout
    </button>
  );
}
