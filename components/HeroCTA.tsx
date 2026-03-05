"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function HeroCTA() {
  const router = useRouter();
  const supabase = createClient();

  async function handleCTA() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      router.push("/sample-report");
    } else {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/sample-report`,
        },
      });
    }
  }

  return (
    <button
      onClick={handleCTA}
      className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-xl font-black text-base text-white transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.2)",
        backdropFilter: "blur(12px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(22,163,74,0.2)";
        e.currentTarget.style.borderColor = "#16A34A";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
      }}
    >
      <span>View Sample Report</span>
      <span className="text-[#16A34A] group-hover:translate-x-1 transition-transform">
        →
      </span>
    </button>
  );
}
