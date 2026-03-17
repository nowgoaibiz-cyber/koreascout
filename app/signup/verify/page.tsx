"use client";

import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [resendCooldown, setResendCooldown] = useState(0);

  async function handleResend() {
    if (resendCooldown > 0 || !email) return;
    const supabase = createClient();
    await supabase.auth.resend({ type: "signup", email });
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4] px-4">
      <div className="w-full max-w-md mx-auto bg-[#FFFFFF] rounded-2xl shadow-sm p-8 sm:p-12 flex flex-col items-center gap-6">
        <Logo className="w-48 h-auto" />
        <div className="text-4xl text-[#16A34A] text-center">✓</div>
        <h1 className="text-xl font-bold text-[#0A0908] text-center">
          Check your email
        </h1>
        <p className="text-sm text-[#0A0908] text-center">
          We sent a confirmation link to{" "}
          <span className="font-bold text-[#0A0908]">{email || "your email"}</span>
          . Click the link to activate your account.
        </p>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="w-full border border-[#0A0908] text-[#0A0908] rounded-xl py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {resendCooldown > 0
            ? `Resend available in ${resendCooldown}s`
            : "Resend email"}
        </button>
        <Link
          href="/login"
          className="text-[#16A34A] font-medium hover:underline"
        >
          Go to sign in
        </Link>
        <Link
          href="/"
          className="text-[#0A0908] opacity-60 text-sm hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyContent />
    </Suspense>
  );
}
