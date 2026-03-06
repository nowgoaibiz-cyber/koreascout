"use client";

import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function isPasswordValid(p: string): boolean {
    if (p.length < 8) return false;
    return /\d/.test(p) || /[^a-zA-Z0-9]/.test(p);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isPasswordValid(password)) {
      setError("At least 8 characters with a number or special character.");
      return;
    }
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1916] relative overflow-hidden px-4 py-12">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-900/20 blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-md flex flex-col items-center gap-8 relative z-10">
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-2xl w-full">
          <Link
            href="/"
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 rounded-lg w-fit mx-auto"
          >
            <Logo className="w-48 h-auto mx-auto mb-8" />
          </Link>
          <h1 className="text-xl font-bold text-center text-gray-900">
            Set new password
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6 mt-2">
            Please enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                New Password
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
              {loading ? "Updating…" : "Update Password"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            <Link
              href="/login"
              className="font-medium text-[#16A34A] hover:text-[#15803D]"
            >
              ← Back to sign in
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
