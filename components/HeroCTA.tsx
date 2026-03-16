"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
export default function HeroCTA() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleAccess() {
    if (loading) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/sample-report");
      } else {
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto max-w-sm md:max-w-none mx-auto">
        {/* PRIMARY CTA — Request Access: #16A34A, same box as secondary */}
        <button
          type="button"
          onClick={handleAccess}
          disabled={loading}
          className="w-full md:w-48 h-14 min-w-[12rem] rounded-xl flex items-center justify-center gap-2 font-black text-[15px] tracking-wide text-white border border-transparent transition-all duration-200 outline-none disabled:cursor-wait"
          style={{
            background: "#16A34A",
          }}
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
            <span>Authenticating...</span>
          ) : (
            <>
              <span>Request Access</span>
              <span>→</span>
            </>
          )}
        </button>
        <p className="text-center text-xs text-white/50 mt-2">
          By signing up, you agree to our{" "}
          <a href="/legal/terms" className="underline hover:text-white/80">Terms of Service</a>
          {" "}and{" "}
          <a href="/legal/privacy" className="underline hover:text-white/80">Privacy Policy</a>.
        </p>
        {/* SECONDARY CTA — View Sample Report: transparent, border #F8F7F4/30, same box */}
        <a
          href="/sample-report"
          className="w-full md:w-48 h-14 min-w-[12rem] rounded-xl flex items-center justify-center gap-2 font-bold text-[15px] tracking-wide text-white/70 no-underline border transition-all duration-200 box-border"
          style={{
            background: "transparent",
            borderColor: "rgba(248,247,244,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(248,247,244,0.5)";
            e.currentTarget.style.color = "rgba(255,255,255,0.95)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(248,247,244,0.3)";
            e.currentTarget.style.color = "rgba(255,255,255,0.7)";
          }}
        >
          View Sample Report
        </a>
      </div>
    </>
  );
}
