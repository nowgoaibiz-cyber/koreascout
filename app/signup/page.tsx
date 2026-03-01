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
      <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block font-[family-name:var(--font-syne)] font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">
              K-Product Scout
            </Link>
          </div>
          <div className="bg-[#0d0d0f] border border-white/10 rounded-2xl p-8 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 text-green-400">✓</div>
            <h1 className="font-[family-name:var(--font-syne)] text-xl font-bold text-white mb-2">Check your email</h1>
            <p className="text-sm text-white/60 mb-6">
              We sent a confirmation link to <strong className="text-white/80">{email}</strong>. Click it to activate your account.
            </p>
            <Link
              href="/login"
              className="inline-block w-full rounded-xl bg-indigo-500 text-white py-3 text-sm font-semibold hover:bg-indigo-400 transition text-center"
            >
              Go to sign in
            </Link>
            <p className="mt-6 text-sm text-white/50">
              <Link href="/" className="hover:text-white/70">← Back to home</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block font-[family-name:var(--font-syne)] font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">
            K-Product Scout
          </Link>
        </div>
        <div className="bg-[#0d0d0f] border border-white/10 rounded-2xl p-8 shadow-xl">
          <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-white mb-1">Create account</h1>
          <p className="text-sm text-white/50 mb-6">Start with a free tier. Use Google or email.</p>
          <GoogleSignInButton />
          <div className="relative my-6">
            <span className="absolute inset-0 flex items-center" aria-hidden>
              <span className="w-full border-t border-white/10" />
            </span>
            <span className="relative flex justify-center text-xs text-white/40">or</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-4 py-3">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
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
                className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="At least 6 characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-500 text-white py-3 text-sm font-semibold hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0d0d0f] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-white/50">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-white/40">
          <Link href="/" className="hover:text-white/60">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
