"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ReportRow = {
  id: string;
  product_name: string | null;
  week_id: string;
  market_viability: number | null;
  status: string | null;
  created_at: string;
};

function formatWeek(weekId: string): string {
  const m = weekId.match(/^(\d{4})-W?(\d+)$/i);
  if (m) return `W${m[2]}-${m[1]}`;
  return weekId;
}

export default function AdminPage() {
  const router = useRouter();
  const [list, setList] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekFilter, setWeekFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/reports", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setList(Array.isArray(data) ? data : []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const weeks = useMemo(() => {
    const set = new Set(list.map((r) => r.week_id).filter(Boolean));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [list]);

  const filtered = useMemo(() => {
    return list.filter((row) => {
      if (weekFilter && row.week_id !== weekFilter) return false;
      if (statusFilter === "Draft") return row.status !== "published";
      if (statusFilter === "Live") return row.status === "published";
      return true;
    });
  }, [list, weekFilter, statusFilter]);

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
      redirect: "manual",
    });
    window.location.href = "/admin/login";
  }

  return (
    <div className="bg-[#F8F7F4] min-h-screen">
      <header className="bg-white border-b border-[#E8E6E1] px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#1A1916]">KoreaScout Admin</span>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-[#9E9C98] hover:text-[#1A1916] transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="px-6 py-3 flex items-center gap-4">
        <select
          value={weekFilter}
          onChange={(e) => setWeekFilter(e.target.value)}
          className="bg-white border border-[#E8E6E1] rounded-md px-3 py-2 text-sm text-[#1A1916] focus:border-[#16A34A] outline-none"
        >
          <option value="">All Weeks</option>
          {weeks.map((w) => (
            <option key={w} value={w}>
              {formatWeek(w)}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-[#E8E6E1] rounded-md px-3 py-2 text-sm text-[#1A1916] focus:border-[#16A34A] outline-none"
        >
          <option value="">All</option>
          <option value="Draft">Draft</option>
          <option value="Live">Live</option>
        </select>
      </div>

      <div className="mx-6 bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#6B6860] text-sm">Loading…</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F7F4] border-b border-[#E8E6E1]">
                <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">ID</th>
                <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">Week</th>
                <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">Product Name</th>
                <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">Score</th>
                <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-[#9E9C98] uppercase tracking-widest px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => router.push(`/admin/${row.id}`)}
                  className="border-b border-[#E8E6E1] hover:bg-[#F8F7F4] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-[#9E9C98]">
                    {row.id.slice(0, 6)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-[#F2F1EE] text-[#6B6860] text-xs font-medium px-2 py-0.5 rounded">
                      {formatWeek(row.week_id)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-[#1A1916]">
                    {row.product_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#3D3B36] font-mono">
                    {row.market_viability != null ? row.market_viability : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        row.status === "published"
                          ? "bg-[#DCFCE7] text-[#16A34A] text-xs font-medium px-2.5 py-1 rounded-full"
                          : "bg-[#FEE2E2] text-[#DC2626] text-xs font-medium px-2.5 py-1 rounded-full"
                      }
                    >
                      {row.status === "published" ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/${row.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-[#16A34A] hover:text-[#15803D] font-medium transition-colors"
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
          <div className="p-8 text-center text-[#6B6860] text-sm">
            No reports match the filters.
          </div>
        )}
      </div>
    </div>
  );
}
