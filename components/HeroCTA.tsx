"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function HeroCTA() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleViewReport() {
    if (loading) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/weekly");
      } else {
        router.push("/login");
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleViewReport}
        disabled={loading}
        className="w-full md:w-64 h-14 rounded-xl flex items-center justify-center gap-2 font-black text-[15px] tracking-wide text-white border border-transparent transition-all duration-200 outline-none disabled:cursor-wait"
        style={{ background: "#16A34A" }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.background = "#15803D";
            e.currentTarget.style.boxShadow = "0 0 40px rgba(22,163,74,0.25)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#16A34A";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {loading ? (
          <span>Loading...</span>
        ) : (
          <>
            <span>View Weekly Report</span>
            <span>→</span>
          </>
        )}
      </button>
    </div>
  );
}
