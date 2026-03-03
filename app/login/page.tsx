"use client";

import { createClient } from "@/lib/supabase/client";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    errorParam === "auth" ? "Authentication failed. Please try again." : null
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Link
              href="/"
              className="text-2xl font-bold text-[#1A1916]"
            >
              KoreaScout
            </Link>
            <span className="text-[#9E9C98] font-light border-l border-[#E8E6E1] pl-2 text-sm">
              Intelligence
            </span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8E6E1] p-8 shadow-[0_4px_6px_-1px_rgb(26_25_22/0.08)]">
          <h1 className="text-lg font-semibold text-[#1A1916] text-center mt-6">
            Sign In
          </h1>
          <p className="text-sm text-[#6B6860] text-center mt-2 mb-6">
            Enter your credentials or continue with Google.
          </p>
          <GoogleSignInButton className="w-full flex items-center justify-center gap-3 py-2.5 rounded-md bg-white border border-[#E8E6E1] text-[#3D3B36] font-medium hover:bg-[#F8F7F4] transition-colors" />
          <div className="relative my-6">
            <span className="absolute inset-0 flex items-center" aria-hidden>
              <span className="w-full border-t border-[#E8E6E1]" />
            </span>
            <span className="relative flex justify-center text-xs text-[#9E9C98] bg-white px-2">
              or
            </span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-sm text-[#DC2626] bg-[#FEE2E2] border border-[#FECACA] rounded-md px-3 py-2">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1A1916] mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#E8E6E1] rounded-md px-3 py-2 text-sm text-[#1A1916] placeholder-[#9E9C98] focus:outline-none focus:ring-1 focus:ring-[#16A34A] focus:border-[#16A34A] transition-colors"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1A1916] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#E8E6E1] rounded-md px-3 py-2 text-sm text-[#1A1916] placeholder-[#9E9C98] focus:outline-none focus:ring-1 focus:ring-[#16A34A] focus:border-[#16A34A] transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#16A34A] text-white font-semibold py-2.5 rounded-md hover:bg-[#15803D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[#6B6860]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-[#16A34A] hover:text-[#15803D]"
            >
              Sign up
            </Link>
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-[#6B6860]">
          <Link href="/" className="hover:text-[#1A1916]">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
