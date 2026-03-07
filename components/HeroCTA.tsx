"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SplashScreen from "./SplashScreen";

export default function HeroCTA() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [showEntrance, setShowEntrance] = useState(false);

  async function handleAccess() {
    if (loading) return;
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setShowEntrance(true);
      } else {
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback?next=/sample-report`,
          },
        });
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <>
      {showEntrance && (
        <SplashScreen onComplete={() => router.push("/sample-report")} />
      )}

      <div className="flex w-full flex-col items-center justify-center gap-6 md:w-auto md:flex-row md:gap-8">
        <button
          onClick={handleAccess}
          disabled={loading}
          type="button"
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#16A34A] px-8 py-4 text-base font-bold text-white transition-all duration-200 shadow-[0_0_0_0_rgba(22,163,74,0.4)] hover:shadow-[0_0_30px_8px_rgba(22,163,74,0.5)] hover:bg-[#15803D] disabled:cursor-wait disabled:opacity-90 md:w-auto"
        >
          {loading ? "Authenticating..." : "Request Access"}
        </button>

        <a
          href="/sample-report"
          className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-transparent px-8 py-4 text-base font-bold text-white no-underline transition-all duration-200 hover:bg-white/10 md:w-auto"
        >
          View Sample Report
        </a>
      </div>
    </>
  );
}

