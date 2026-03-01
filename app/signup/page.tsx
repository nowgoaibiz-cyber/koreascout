"use client";

import { createClient } from "@/lib/supabase/client";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setSuccess(true);
    router.refresh();
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block text-2xl font-bold text-[#1A1916] text-center">K-Product Scout</Link>
          </div>
          <div className="bg-white rounded-2xl border border-[#E8E6E1] p-8 shadow-[0_4px_6px_-1px_rgb(26_25_22/0.08)] text-center">
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center mx-auto mb-4 text-[#16A34A]">✓</div>
            <h1 className="text-lg font-semibold text-[#1A1916] text-center mt-6 mb-2">Check your email</h1>
            <p className="text-sm text-[#6B6860] mb-6">
              We sent a confirmation link to <strong className="text-[#1A1916]">{email}</strong>. Click it to activate your account.
            </p>
            <Link
              href="/login"
              className="inline-block w-full rounded-md bg-[#16A34A] text-white py-2.5 text-sm font-semibold hover:bg-[#15803D] transition-colors text-center"
            >
              Go to sign in
            </Link>
            <p className="mt-6 text-sm text-[#6B6860] text-center">
              <Link href="/" className="text-[#16A34A] hover:text-[#15803D]">← Back to home</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-bold text-[#1A1916] text-center">K-Product Scout</Link>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8E6E1] p-8 shadow-[0_4px_6px_-1px_rgb(26_25_22/0.08)]">
          <h1 className="text-lg font-semibold text-[#1A1916] text-center mt-6">Create account</h1>
          <p className="text-sm text-[#6B6860] mb-6 text-center">Start with a free tier. Use Google or email.</p>
          <div className="bg-white border border-[#E8E6E1] rounded-md hover:bg-[#F8F7F4] transition-colors w-full">
            <GoogleSignInButton />
          </div>
          <div className="relative my-6">
            <span className="absolute inset-0 flex items-center" aria-hidden>
              <span className="w-full border-t border-[#E8E6E1]" />
            </span>
            <span className="relative flex justify-center text-xs text-[#9E9C98]">or</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-md text-sm text-[#DC2626] bg-[#FEE2E2] border border-[#FECACA] px-3 py-2">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-[#9E9C98] uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#E8E6E1] rounded-md px-3 py-2 text-sm text-[#1A1916] placeholder:text-[#C4C2BE] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] outline-none transition-colors"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-[#9E9C98] uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#E8E6E1] rounded-md px-3 py-2 text-sm text-[#1A1916] placeholder:text-[#C4C2BE] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] outline-none transition-colors"
                placeholder="At least 6 characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#16A34A] text-white font-semibold py-2.5 rounded-md text-sm hover:bg-[#15803D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[#6B6860]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#16A34A] hover:text-[#15803D]">
              Sign in
            </Link>
          </p>
        </div>
        <p className="mt-6 text-center text-sm text-[#6B6860]">
          <Link href="/" className="text-[#16A34A] hover:text-[#15803D]">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
