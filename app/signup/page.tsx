"use client";

import { createClient } from "@/lib/supabase/client";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || undefined;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loginHref = nextUrl ? `/login?next=${encodeURIComponent(nextUrl)}` : "/login";

  function isPasswordValid(p: string): boolean {
    if (p.length < 8) return false;
    return /\d/.test(p) || /[^a-zA-Z0-9]/.test(p);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isPasswordValid(password)) {
      setError("At least 8 characters with a number or special character.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    router.push(`/signup/verify?email=${encodeURIComponent(email)}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4] relative overflow-hidden px-4 pt-24 pb-12">
      <div className="w-full max-w-md flex flex-col items-center gap-8 relative z-10">
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-2xl w-full">
          <Link href="/" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 rounded-lg w-fit mx-auto">
            <Logo className="w-48 h-auto mx-auto mb-8" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900 text-center">Create account</h1>
          <p className="text-sm text-gray-600 text-center mt-2 mb-6">
            Start with a free tier. Use Google or email.
          </p>
          <GoogleSignInButton
            next={nextUrl}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
          />
          <div className="relative my-6">
            <span className="absolute inset-0 flex items-center" aria-hidden>
              <span className="w-full border-t border-gray-200" />
            </span>
            <span className="relative flex justify-center text-xs text-gray-500 bg-white px-2">or</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all outline-none"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all outline-none"
                placeholder="Create a secure password"
              />
              <p className="mt-1 text-xs text-gray-500">
                At least 8 characters with a number or special character.
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1916] text-white font-bold py-3 rounded-xl hover:bg-black scale-100 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
          <p className="text-center text-[10px] text-[#9E9C98] mt-3 whitespace-nowrap">
            By signing up, you agree to our{" "}
            <a href="/legal/terms" className="underline hover:text-[#0A0908]">Terms</a>
            {" "}and{" "}
            <a href="/legal/privacy" className="underline hover:text-[#0A0908]">Privacy Policy</a>.
          </p>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href={loginHref}
              className="font-medium text-[#16A34A] hover:text-[#15803D]"
            >
              Sign in
            </Link>
          </p>
        </div>
        <p className="text-center text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpContent />
    </Suspense>
  );
}
