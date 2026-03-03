"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Incorrect password. Try again.");
        return;
      }
      router.push("/admin");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#F8F7F4] min-h-screen flex items-start justify-center pt-40">
      <div className="max-w-sm mx-auto w-full px-4">
        <div className="bg-white border border-[#E8E6E1] rounded-2xl p-8 flex flex-col gap-6">
          <h1 className="text-xl font-bold text-[#1A1916] text-center">
            🔐 KoreaScout Admin
          </h1>
          <p className="text-xs text-[#9E9C98] text-center">
            Internal use only
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-[#F2F1EE] border border-[#E8E6E1] rounded-lg px-4 py-2.5 text-[#1A1916] text-sm focus:border-[#16A34A] outline-none w-full"
              autoComplete="current-password"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold rounded-lg py-2.5 transition-colors disabled:opacity-60"
            >
              {loading ? "Checking..." : "Enter Dashboard →"}
            </button>
          </form>
          {error && (
            <p className="text-[#DC2626] text-sm text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
