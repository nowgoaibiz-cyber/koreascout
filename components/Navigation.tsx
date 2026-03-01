import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

export async function Navigation() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9998] flex items-center justify-between px-4 sm:px-8 md:px-12 h-[72px] bg-[#030303]/70 backdrop-blur-xl border-b border-white/10">
      <Link
        href="/"
        className="font-[family-name:var(--font-syne)] font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent"
      >
        K-Product Scout 🇰🇷
      </Link>
      <div className="flex items-center gap-4 sm:gap-6">
        {user ? (
          <>
            <Link
              href="/weekly"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors hidden sm:inline"
            >
              Weekly Reports
            </Link>
            <Link
              href="/account"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Account
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-500 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-400 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
