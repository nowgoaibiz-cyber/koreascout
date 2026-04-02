# Admin System Full Audit (SCAN ONLY)

Generated: 2026-04-02. Repository: k-productscout.

---

## 1. Discovery: admin-related files

### Command: grep/rg `admin` in `app/` (*.ts, *.tsx)

| Path | Note |
|------|------|
| app/api/billing/portal/route.ts | imports `createServiceRoleClient` from `@/lib/supabase/admin` (not UI admin) |
| app/pricing/page.tsx | same |
| app/page.tsx | same |
| app/admin/[id]/page.tsx | admin UI |
| app/admin/page.tsx | admin UI |
| app/admin/login/page.tsx | admin UI |
| app/api/admin/reports/[id]/route.ts | admin API |
| app/api/admin/reports/route.ts | admin API |
| app/api/admin/logout/route.ts | admin API |
| app/api/admin/auth/route.ts | admin API |

### Command: grep `admin` in `components/` (*.ts, *.tsx)

No line matches (admin helpers live under `components/admin/`; file bodies may not contain the substring `admin`).

### `app/admin/` tree (all files)

- app/admin/page.tsx
- app/admin/login/page.tsx
- app/admin/[id]/page.tsx

### `components/` names matching *admin* / *Admin*

- components/admin/GlobalPricesHelper.tsx
- components/admin/HazmatCheckboxes.tsx
- components/admin/AiPageLinksHelper.tsx

### `app/api/` all `*.ts` routes (find)

- app/api/billing/portal/route.ts
- app/api/webhooks/lemonsqueezy/route.ts
- app/api/webhook/route.ts (re-exports lemonsqueezy POST)
- app/api/admin/reports/[id]/route.ts
- app/api/admin/reports/route.ts
- app/api/admin/logout/route.ts
- app/api/admin/auth/route.ts

---

## 2. Live DB: information_schema via supabase-js

Attempted: `createClient(url, service_role).schema('information_schema').from('columns')...`

**Result:** `Invalid schema: information_schema` — this client API does not expose `information_schema` on the linked Supabase project.

**To obtain live columns**, run in Supabase SQL Editor:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'scout_final_reports'
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'weeks'
ORDER BY ordinal_position;
```

### Inferred schema (repo sources)

- **profiles** (001 + 003): `id`, `email`, `tier`, `ls_customer_id`, `ls_subscription_id`, `tier_updated_at`, `created_at`, plus 003: `subscription_start_at`, `subscription_reset_at`.
- **weeks** (001): `week_id`, `week_label`, `start_date`, `end_date`, `published_at`, `product_count`, `summary`, `status`.
- **scout_final_reports**: base in 001; 002 adds pricing columns + trigger; 003 adds `kr_price`, extends `status` CHECK; many v1.2/v1.3 fields exist in `types/database.ts` and admin UI but may rely on manual SQL on live DB — **align live DB with types/migrations**.

---

## 3. Full file contents (verbatim)

### `app/admin/page.tsx`

```tsx
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

```

### `app/admin/login/page.tsx`

```tsx
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

```

### `app/admin/[id]/page.tsx`

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { ScoutFinalReportsRow } from "@/types/database";
import { GlobalPricesHelper } from "@/components/admin/GlobalPricesHelper";
import { HazmatCheckboxes } from "@/components/admin/HazmatCheckboxes";
import { AiPageLinksHelper } from "@/components/admin/AiPageLinksHelper";

type SaveStatus = "idle" | "saved" | "error";
type OpenSections = { s1: boolean; s2: boolean; s3: boolean; s4: boolean; s5: boolean; s6: boolean; s7: boolean };
type DiffItem = { field: string; fieldKo: string; before: string; after: string };

const EXPORT_STATUS_OPTIONS = ["Green", "Yellow", "Red"];
const COMPETITION_OPTIONS = ["Low", "Medium", "High"];

/** Korean labels for every DB field (for diff modal & edit history) */
const FIELD_LABELS_KO: Record<string, string> = {
  id: "ID",
  product_name: "제품명",
  naver_product_name: "네이버 상품명",
  translated_name: "번역명",
  category: "카테고리",
  kr_price: "한국가격(₩)",
  kr_price_usd: "USD가격",
  estimated_cost_usd: "추정도매원가",
  export_status: "수출상태",
  viability_reason: "시장성요약",
  image_url: "이미지URL",
  naver_link: "네이버링크",
  week_id: "주차ID",
  m_name: "제조사명",
  corporate_scale: "기업규모",
  contact_email: "문의이메일",
  contact_phone: "문의전화번호",
  m_homepage: "제조사홈페이지",
  wholesale_link: "도매문의링크",
  status: "상태",
  market_viability: "시장성점수",
  competition_level: "경쟁수준",
  gap_status: "갭상태",
  wow_rate: "WoW성장률",
  mom_growth: "MoM성장률",
  growth_evidence: "성장근거",
  profit_multiplier: "마진배수",
  top_selling_point: "핵심강점",
  common_pain_point: "소비자페인포인트",
  new_content_volume: "신규콘텐츠량",
  global_prices: "글로벌가격",
  buzz_summary: "버즈요약",
  kr_local_score: "국내로컬점수",
  global_trend_score: "글로벌트렌드점수",
  gap_index: "갭지수",
  billable_weight_g: "과금중량(g)",
  kr_evidence: "국내근거",
  global_evidence: "글로벌근거",
  kr_source_used: "국내출처",
  opportunity_reasoning: "기회논리",
  rising_keywords: "상승키워드",
  seo_keywords: "SEO키워드",
  viral_hashtags: "바이럴해시태그",
  platform_scores: "플랫폼점수",
  sourcing_tip: "소싱팁",
  hs_code: "HS코드",
  hs_description: "HS설명",
  status_reason: "상태사유",
  composition_info: "성분정보",
  spec_summary: "스펙요약",
  actual_weight_g: "실제중량(g)",
  volumetric_weight_g: "부피중량(g)",
  dimensions_cm: "치수(cm)",
  hazmat_status: "위험물여부",
  required_certificates: "필요인증",
  shipping_notes: "배송메모",
  verified_cost_usd: "검증된원가(USD)",
  verified_cost_note: "검증원가메모",
  verified_at: "검증일시",
  moq: "최소주문수량",
  lead_time: "리드타임",
  sample_policy: "샘플정책",
  export_cert_note: "수출인증메모",
  viral_video_url: "바이럴영상URL",
  video_url: "영상URL",
  marketing_assets_url: "마케팅자산URL",
  ai_detail_page_links: "AI상세페이지링크",
  published_at: "발행일시",
  go_verdict: "GO판정",
  composite_score: "종합점수",
  growth_signal: "성장시그널",
  search_volume: "검색볼륨",
  best_platform: "최적플랫폼",
  trend_entry_strategy: "진입전략",
  shipping_tier: "배송티어",
  key_risk_ingredient: "위험성분",
  hazmat_summary: "위험물요약",
  global_site_url: "글로벌사이트URL",
  b2b_inquiry_url: "B2B문의URL",
  can_oem: "OEM가능여부",
  ai_image_url: "AI이미지URL",
};

/** Normalizes value for display: parses JSON array strings so we don't show escaped slashes. */
function toCommaStr(v: string | string[] | null | undefined): string {
  if (v == null) return "";
  let target: unknown = v;
  if (typeof v === "string" && v.trim().startsWith("[")) {
    try {
      target = JSON.parse(v);
    } catch {
      target = v;
    }
  }
  if (Array.isArray(target)) return target.filter(Boolean).map(String).join(", ");
  return String(target);
}

function fromCommaStr(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

/** Indestructible parser: handles deeply corrupted JSON strings, always returns exactly 5 slots. */
function ensureLength5(val: unknown): string[] {
  let arr: string[] = [];
  if (Array.isArray(val)) arr = val.map(String);
  else if (typeof val === "string") {
    const clean = val.replace(/[\[\]\\"]/g, "");
    arr = clean.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [...arr, "", "", "", "", ""].slice(0, 5);
}

function toDisplayVal(v: unknown): string {
  if (v == null) return "—";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export default function AdminEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [formData, setFormData] = useState<Partial<ScoutFinalReportsRow> | null>(null);
  const [originalData, setOriginalData] = useState<Partial<ScoutFinalReportsRow> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveDiff, setSaveDiff] = useState<DiffItem[]>([]);
  const [openSections, setOpenSections] = useState<OpenSections>({
    s1: false,
    s2: false,
    s3: false,
    s4: false,
    s5: false,
    s6: true,
    s7: true,
  });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/reports/${id}`, { credentials: "include" });
        if (!res.ok) {
          if (!cancelled) setFormData(null);
          return;
        }
        const row = (await res.json()) as ScoutFinalReportsRow;
        if (!cancelled) {
          const initial = {
            ...row,
            seo_keywords: ensureLength5(row.seo_keywords),
            rising_keywords: ensureLength5(row.rising_keywords ?? null),
            viral_hashtags: ensureLength5(row.viral_hashtags ?? null),
          } as unknown as Partial<ScoutFinalReportsRow>;
          setFormData(initial);
          setOriginalData(JSON.parse(JSON.stringify(initial)));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const toggleSection = useCallback((key: keyof OpenSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const formKeys = [
    "product_name", "naver_product_name", "translated_name", "category", "kr_price", "export_status", "viability_reason",
    "image_url", "naver_link", "week_id", "m_name", "corporate_scale", "contact_email", "contact_phone", "m_homepage", "wholesale_link", "status",
    "market_viability", "competition_level", "gap_status", "gap_index", "billable_weight_g",
    "go_verdict", "composite_score", "growth_signal", "search_volume", "best_platform", "trend_entry_strategy",
    "shipping_tier", "key_risk_ingredient", "hazmat_summary", "global_site_url", "b2b_inquiry_url", "can_oem", "ai_image_url",
    "wow_rate", "mom_growth", "growth_evidence", "profit_multiplier", "top_selling_point", "common_pain_point",
    "new_content_volume", "global_prices", "buzz_summary", "kr_local_score", "global_trend_score", "kr_evidence",
    "global_evidence", "kr_source_used", "opportunity_reasoning", "rising_keywords", "seo_keywords", "viral_hashtags",
    "platform_scores", "sourcing_tip", "hs_code", "hs_description", "status_reason", "composition_info", "spec_summary",
    "actual_weight_g", "volumetric_weight_g", "dimensions_cm", "hazmat_status", "required_certificates", "shipping_notes",
    "verified_cost_usd", "verified_cost_note", "verified_at", "moq", "lead_time", "sample_policy", "export_cert_note",
    "viral_video_url", "video_url", "marketing_assets_url", "ai_detail_page_links", "published_at",
  ];

  function getDiff(orig: Partial<ScoutFinalReportsRow> | null, current: Partial<ScoutFinalReportsRow> | null): DiffItem[] {
    if (!orig || !current) return [];
    const out: DiffItem[] = [];
    for (const key of formKeys) {
      const a = toDisplayVal(orig[key as keyof ScoutFinalReportsRow]);
      const b = toDisplayVal(current[key as keyof ScoutFinalReportsRow]);
      if (a !== b) out.push({ field: key, fieldKo: FIELD_LABELS_KO[key] ?? key, before: a, after: b });
    }
    return out;
  }

  function openSaveModal() {
    if (!formData || !originalData) return;
    setSaveDiff(getDiff(originalData, formData));
    setSaveModalOpen(true);
  }

  const handleConfirmSave = async () => {
    if (!formData || !id || !originalData) return;
    const updates: Record<string, unknown> = { ...formData };
    delete updates.id;
    delete updates.kr_price_usd;
    delete updates.estimated_cost_usd;
    delete updates.created_at;
    if (updates.status === "published") {
      updates.published_at = updates.published_at || new Date().toISOString();
    }
    const seoArr = ensureLength5(updates.seo_keywords).filter(Boolean);
    updates.seo_keywords = seoArr.length ? seoArr : null;
    const risingArr = ensureLength5(updates.rising_keywords).filter(Boolean);
    updates.rising_keywords = risingArr.length ? risingArr : null;
    const viralArr = ensureLength5(updates.viral_hashtags).filter(Boolean);
    updates.viral_hashtags = viralArr.length ? viralArr : null;
    if (typeof updates.platform_scores === "string" && updates.platform_scores) {
      try {
        updates.platform_scores = JSON.parse(updates.platform_scores as string);
      } catch {
        /* leave as string */
      }
    }
    const changes = saveDiff.map((d) => ({ field: d.field, before: d.before, after: d.after }));
    const newEntry = { timestamp: new Date().toISOString(), changes };
    const existing = formData.edit_history as { entries?: { timestamp: string; changes: { field: string; before: string; after: string }[] }[] } | null | undefined;
    const entries = Array.isArray(existing?.entries) ? [...existing.entries, newEntry] : [newEntry];
    updates.edit_history = { entries };

    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        setSaveStatus("error");
        setSaveModalOpen(false);
        return;
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
      const nextForm = { ...formData, edit_history: { entries } };
      setFormData(nextForm);
      setOriginalData(JSON.parse(JSON.stringify(nextForm)));
      setSaveModalOpen(false);
      router.refresh();
    } catch {
      setSaveStatus("error");
      setSaveModalOpen(false);
    }
  };

  function handleCancelSave() {
    setSaveModalOpen(false);
  }

  /* Un saved changes warning: prompt before leaving if formData !== originalData */
  useEffect(() => {
    if (!formData || !originalData) return;
    const handler = (e: BeforeUnloadEvent) => {
      try {
        const a = JSON.stringify(formData);
        const b = JSON.stringify(originalData);
        if (a !== b) {
          e.preventDefault();
          e.returnValue = "";
        }
      } catch {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [formData, originalData]);

  if (loading || !formData) {
    return (
      <div className="bg-[#F8F7F4] min-h-screen flex items-center justify-center">
        <p className="text-[#6B6860] text-sm">{loading ? "Loading…" : "Report not found."}</p>
      </div>
    );
  }

  const inputClass =
    "bg-white border border-[#E8E6E1] rounded-md px-3 py-2 text-sm text-[#1A1916] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] outline-none placeholder:text-[#C4C2BE] w-full transition-colors";
  const readOnlyClass =
    "bg-[#F8F7F4] border border-[#E8E6E1] rounded-md px-3 py-2 text-sm text-[#9E9C98] cursor-not-allowed w-full";
  const labelClass = "text-xs font-medium text-[#9E9C98] uppercase tracking-wider";

  return (
    <div className="bg-[#F8F7F4] min-h-screen">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E8E6E1] px-6 py-3 flex items-center justify-between">
        <Link
          href="/admin"
          className="text-sm text-[#9E9C98] hover:text-[#1A1916] transition-colors"
        >
          ← Back to List
        </Link>
        <span className="text-sm font-semibold text-[#1A1916] truncate max-w-[200px] mx-2">
          {formData.product_name ?? "—"}
        </span>
        <div className="flex items-center gap-2">
          {saveStatus === "saved" && (
            <span className="text-xs text-[#16A34A]">Saved!</span>
          )}
          {saveStatus === "error" && (
            <span className="text-xs text-[#DC2626]">Save failed</span>
          )}
          <label className="sr-only" htmlFor="admin-status-select">Status (상태)</label>
          <select
            id="admin-status-select"
            value={formData.status === "published" ? "published" : "hidden"}
            onChange={(e) => {
              const v = e.target.value as "published" | "hidden";
              setFormData((p) => ({
                ...p!,
                status: v,
                published_at: v === "published" ? new Date().toISOString() : null,
              }));
            }}
            className="bg-[#F2F1EE] text-[#3D3B36] border border-[#E8E6E1] text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-[#E8E6E1] transition-colors"
          >
            <option value="published">published (공개)</option>
            <option value="hidden">hidden (숨김)</option>
          </select>
          <button
            type="button"
            onClick={openSaveModal}
            className="bg-[#16A34A] text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-[#15803D] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </header>

      {/* Save confirmation modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="bg-white border border-[#E8E6E1] rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col">
            <div className="px-6 py-4 border-b border-[#E8E6E1]">
              <h2 className="text-lg font-semibold text-[#1A1916]">
                Save Changes — 변경 사항 확인
              </h2>
              <p className="text-xs text-[#9E9C98] mt-1">다음 필드가 변경됩니다.</p>
            </div>
            <div className="px-6 py-4 overflow-y-auto flex-1">
              {saveDiff.length === 0 ? (
                <p className="text-[#6B6860] text-sm">변경된 필드가 없습니다.</p>
              ) : (
                <ul className="space-y-2">
                  {saveDiff.map((d, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium text-[#3D3B36]">{d.fieldKo} ({d.field}):</span>{" "}
                      <span className="text-[#9E9C98]">[{d.before}]</span> → <span className="text-[#16A34A]">[{d.after}]</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="px-6 py-4 border-t border-[#E8E6E1] flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelSave}
                className="px-4 py-2 rounded-lg text-[#6B6860] hover:text-[#1A1916] border border-[#E8E6E1] hover:border-[#E8E6E1] transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="px-4 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-medium transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-4">
        {/* Section 1 — Product Identity */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s1")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Product Identity</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s1 ? "▼" : "▶"}</span>
          </button>
          {openSections.s1 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>id (ID) <span className="text-[#9E9C98] normal-case font-normal">(자동)</span></label>
                <div className={readOnlyClass}>
                  {formData.id ?? "—"}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Product Name (제품명)</label>
                <input
                  value={formData.product_name ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, product_name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Naver Product Name (네이버 상품명)</label>
                <input
                  value={formData.naver_product_name ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, naver_product_name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Translated Name (번역명)</label>
                <input
                  value={formData.translated_name ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, translated_name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Category (카테고리)</label>
                <input
                  value={formData.category ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, category: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>KR Price (₩) (한국가격)</label>
                <input
                  type="text"
                  value={formData.kr_price ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, kr_price: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>USD Price (USD가격) <span className="text-[#9E9C98] normal-case font-normal">(자동계산)</span></label>
                <div className={readOnlyClass}>
                  {formData.kr_price_usd ?? "—"}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Est. Wholesale Cost (추정도매원가) <span className="text-[#9E9C98] normal-case font-normal">(자동계산)</span></label>
                <div className={readOnlyClass}>
                  {formData.estimated_cost_usd ?? "—"}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Export Status (수출상태)</label>
                <select
                  value={formData.export_status ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, export_status: e.target.value }))}
                  className={inputClass}
                >
                  {EXPORT_STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Viability Summary (시장성요약)</label>
                <textarea
                  rows={3}
                  value={formData.viability_reason ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, viability_reason: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Image URL (이미지URL)</label>
                <input
                  value={formData.image_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, image_url: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>AI Image URL (AI이미지URL)</label>
                <input
                  value={formData.ai_image_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, ai_image_url: e.target.value }))}
                  className={inputClass}
                  placeholder="AI-generated image URL"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>GO Verdict (GO판정) <span className="text-[#9E9C98] normal-case font-normal">(자동)</span></label>
                <div className={readOnlyClass}>{formData.go_verdict ?? "—"}</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Composite Score (종합점수) <span className="text-[#9E9C98] normal-case font-normal">(자동)</span></label>
                <div className={readOnlyClass}>{formData.composite_score ?? "—"}</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Naver Link (네이버링크)</label>
                <input
                  value={formData.naver_link ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, naver_link: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Week ID (주차ID)</label>
                <input
                  value={formData.week_id ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, week_id: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 2 — Trend Signal Dashboard */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s2")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Trend Signal Dashboard</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s2 ? "▼" : "▶"}</span>
          </button>
          {openSections.s2 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Market Score (0–100) (시장성점수)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.market_viability ?? ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p!,
                      market_viability: e.target.value === "" ? 0 : Number(e.target.value),
                    }))
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Competition Level (경쟁수준)</label>
                <select
                  value={formData.competition_level ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, competition_level: e.target.value }))}
                  className={inputClass}
                >
                  {COMPETITION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>WoW Growth (WoW성장률)</label>
                <input
                  value={formData.wow_rate ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, wow_rate: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>MoM Growth (MoM성장률)</label>
                <input
                  value={formData.mom_growth ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, mom_growth: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Growth Evidence (성장근거)</label>
                <textarea
                  rows={3}
                  value={formData.growth_evidence ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, growth_evidence: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Growth Signal (성장시그널)</label>
                <input
                  value={formData.growth_signal ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, growth_signal: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Stable, Rising, Viral"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 3 — Market Intelligence */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s3")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Market Intelligence</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s3 ? "▼" : "▶"}</span>
          </button>
          {openSections.s3 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Profit Multiplier (마진배수)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.profit_multiplier ?? ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p!,
                      profit_multiplier: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Winning Feature (핵심강점)</label>
                <textarea
                  rows={3}
                  value={formData.top_selling_point ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, top_selling_point: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Pain Point (소비자페인포인트)</label>
                <textarea
                  rows={3}
                  value={formData.common_pain_point ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, common_pain_point: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>New Content Volume (신규콘텐츠량)</label>
                <input
                  value={formData.new_content_volume ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, new_content_volume: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Search Volume (검색볼륨)</label>
                <input
                  value={formData.search_volume ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, search_volume: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Rising (18,100/mo)"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Best Platform (최적플랫폼)</label>
                <input
                  value={formData.best_platform ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, best_platform: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Amazon US, TikTok Shop"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Global Prices (글로벌가격)</label>
                <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-4">
                  <GlobalPricesHelper
                    value={
                      typeof formData.global_prices === "string"
                        ? formData.global_prices
                        : formData.global_prices != null
                          ? JSON.stringify(formData.global_prices)
                          : null
                    }
                    onChange={(s) => setFormData((p) => ({ ...p!, global_prices: s as unknown as ScoutFinalReportsRow["global_prices"] }))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4 — Social Proof & Trend Intelligence */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s4")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Social Proof & Trend Intelligence</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s4 ? "▼" : "▶"}</span>
          </button>
          {openSections.s4 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Buzz Summary (버즈요약)</label>
                <textarea
                  rows={4}
                  value={formData.buzz_summary ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, buzz_summary: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>KR Local Score (0–100) (국내로컬점수)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.kr_local_score ?? ""}
                  onChange={(e) => {
                    const newKr = e.target.value === "" ? null : Number(e.target.value);
                    setFormData((p) => {
                      if (!p) return null;
                      const gt = p.global_trend_score;
                      const gap = (newKr != null && gt != null) ? newKr - gt : null;
                      return { ...p, kr_local_score: newKr, gap_index: gap };
                    });
                  }}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Global Trend Score (0–100) (글로벌트렌드점수)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.global_trend_score ?? ""}
                  onChange={(e) => {
                    const newGt = e.target.value === "" ? null : Number(e.target.value);
                    setFormData((p) => {
                      if (!p) return null;
                      const kr = p.kr_local_score;
                      const gap = (kr != null && newGt != null) ? kr - newGt : null;
                      return { ...p, global_trend_score: newGt, gap_index: gap };
                    });
                  }}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Gap Index (갭지수) <span className="text-[#9E9C98] normal-case font-normal">(자동: 국내점수 − 글로벌점수)</span></label>
                <div className={readOnlyClass}>
                  {formData.gap_index != null ? formData.gap_index : "—"}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>KR Evidence (국내근거)</label>
                <textarea
                  rows={3}
                  value={formData.kr_evidence ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, kr_evidence: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Global Evidence (글로벌근거)</label>
                <textarea
                  rows={3}
                  value={formData.global_evidence ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, global_evidence: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>KR Source Used (국내출처)</label>
                <input
                  value={formData.kr_source_used ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, kr_source_used: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Gap Status (갭상태)</label>
                <input
                  value={formData.gap_status ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, gap_status: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Opportunity Reasoning (기회논리)</label>
                <textarea
                  rows={3}
                  value={formData.opportunity_reasoning ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, opportunity_reasoning: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Rising Keywords (상승키워드)</label>
                <div className="grid grid-cols-5 gap-2">
                  {ensureLength5(formData.rising_keywords).map((kw, i) => (
                    <input
                      key={i}
                      value={kw}
                      onChange={(e) => {
                        const next = [...ensureLength5(formData.rising_keywords)];
                        next[i] = e.target.value;
                        setFormData((p) => ({ ...p!, rising_keywords: next } as unknown as Partial<ScoutFinalReportsRow>));
                      }}
                      className={inputClass}
                      placeholder={`Keyword ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>SEO Keywords (SEO키워드)</label>
                <div className="grid grid-cols-5 gap-2">
                  {ensureLength5(formData.seo_keywords).map((kw, i) => (
                    <input
                      key={i}
                      value={kw}
                      onChange={(e) => {
                        const next = [...ensureLength5(formData.seo_keywords)];
                        next[i] = e.target.value;
                        setFormData((p) => ({ ...p!, seo_keywords: next } as unknown as Partial<ScoutFinalReportsRow>));
                      }}
                      className={inputClass}
                      placeholder={`Keyword ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Viral Hashtags (바이럴해시태그)</label>
                <div className="grid grid-cols-5 gap-2">
                  {ensureLength5(formData.viral_hashtags).map((tag, i) => (
                    <input
                      key={i}
                      value={tag}
                      onChange={(e) => {
                        const next = [...ensureLength5(formData.viral_hashtags)];
                        next[i] = e.target.value;
                        setFormData((p) => ({ ...p!, viral_hashtags: next } as unknown as Partial<ScoutFinalReportsRow>));
                      }}
                      className={inputClass}
                      placeholder={`Hashtag ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Platform Scores (플랫폼점수) (JSON)</label>
                <textarea
                  rows={4}
                  value={
                    typeof formData.platform_scores === "string"
                      ? formData.platform_scores
                      : formData.platform_scores != null
                        ? JSON.stringify(formData.platform_scores, null, 2)
                        : ""
                  }
                  onChange={(e) => {
                    const s = e.target.value.trim();
                    if (!s) {
                      setFormData((p) => ({ ...p!, platform_scores: null }));
                      return;
                    }
                    try {
                      JSON.parse(s);
                      setFormData((p) => ({ ...p!, platform_scores: s as unknown as ScoutFinalReportsRow["platform_scores"] }));
                    } catch {
                      setFormData((p) => ({ ...p!, platform_scores: s as unknown as ScoutFinalReportsRow["platform_scores"] }));
                    }
                  }}
                  className={`${inputClass} resize-none font-mono text-xs`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Sourcing Tip (소싱팁)</label>
                <textarea
                  rows={6}
                  value={formData.sourcing_tip ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, sourcing_tip: e.target.value }))}
                  className={`${inputClass} resize-none`}
                  placeholder="AI-generated. Edit to fix hallucinations."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Trend Entry Strategy (진입전략)</label>
                <textarea
                  rows={3}
                  value={formData.trend_entry_strategy ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, trend_entry_strategy: e.target.value }))}
                  className={`${inputClass} resize-none`}
                  placeholder="AI-generated. Edit if needed."
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 5 — Export & Logistics Intel */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s5")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Export & Logistics Intel</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s5 ? "▼" : "▶"}</span>
          </button>
          {openSections.s5 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>HS Code (HS코드)</label>
                <input
                  value={formData.hs_code ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, hs_code: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>HS Description (HS설명)</label>
                <input
                  value={formData.hs_description ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, hs_description: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Status Reason (상태사유)</label>
                <textarea
                  rows={3}
                  value={formData.status_reason ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, status_reason: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Composition Info (성분정보)</label>
                <textarea
                  rows={3}
                  value={formData.composition_info ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, composition_info: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Spec Summary (스펙요약)</label>
                <textarea
                  rows={3}
                  value={formData.spec_summary ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, spec_summary: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Actual Weight (g) (실제중량)</label>
                <input
                  type="number"
                  value={formData.actual_weight_g ?? ""}
                  onChange={(e) => {
                    const newAw = e.target.value === "" ? null : Number(e.target.value);
                    setFormData((p) => {
                      if (!p) return null;
                      const vw = p.volumetric_weight_g;
                      const billable = (newAw != null || vw != null) ? Math.max(newAw ?? 0, vw ?? 0) : null;
                      return { ...p, actual_weight_g: newAw, billable_weight_g: billable };
                    });
                  }}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Volumetric Weight (g) (부피중량)</label>
                <input
                  type="number"
                  value={formData.volumetric_weight_g ?? ""}
                  onChange={(e) => {
                    const newVw = e.target.value === "" ? null : Number(e.target.value);
                    setFormData((p) => {
                      if (!p) return null;
                      const aw = p.actual_weight_g;
                      const billable = (aw != null || newVw != null) ? Math.max(aw ?? 0, newVw ?? 0) : null;
                      return { ...p, volumetric_weight_g: newVw, billable_weight_g: billable };
                    });
                  }}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Billable Weight (g) (과금중량) <span className="text-[#9E9C98] normal-case font-normal">(자동: max(실제, 부피))</span></label>
                <div className={readOnlyClass}>
                  {formData.billable_weight_g != null ? formData.billable_weight_g : "—"}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Dimensions (cm) (치수)</label>
                <input
                  value={formData.dimensions_cm ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, dimensions_cm: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Hazmat Status (위험물여부)</label>
                <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-4">
                  <HazmatCheckboxes
                    value={
                      typeof formData.hazmat_status === "string"
                        ? formData.hazmat_status
                        : formData.hazmat_status != null
                          ? JSON.stringify(formData.hazmat_status)
                          : null
                    }
                    onChange={(s) => setFormData((p) => ({ ...p!, hazmat_status: s as unknown as ScoutFinalReportsRow["hazmat_status"] }))}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Required Certificates (필요인증)</label>
                <input
                  value={formData.required_certificates ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, required_certificates: e.target.value }))}
                  className={inputClass}
                  placeholder="Comma-separated"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Shipping Notes (배송메모)</label>
                <textarea
                  rows={3}
                  value={formData.shipping_notes ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, shipping_notes: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Shipping Tier (배송티어)</label>
                <input
                  value={formData.shipping_tier ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, shipping_tier: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Tier 1"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Key Risk Ingredient (위험성분)</label>
                <input
                  value={formData.key_risk_ingredient ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, key_risk_ingredient: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Retinol, Aerosol"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Hazmat Summary (위험물요약)</label>
                <textarea
                  rows={2}
                  value={formData.hazmat_summary ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, hazmat_summary: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 6 — Launch & Execution Kit (default open) */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s6")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Launch & Execution Kit</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s6 ? "▼" : "▶"}</span>
          </button>
          {openSections.s6 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest pt-2">
                📋 제조사·연락처 (Manufacturer & Contact)
              </p>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Manufacturer Name (제조사명)</label>
                <input
                  value={formData.m_name ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, m_name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Corporate Scale (기업 규모 e.g. SME)</label>
                <input
                  value={formData.corporate_scale ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, corporate_scale: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. SME"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Contact Email (문의 이메일)</label>
                <input
                  type="email"
                  value={formData.contact_email ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, contact_email: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Contact Phone (문의 전화번호)</label>
                <input
                  type="tel"
                  value={formData.contact_phone ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, contact_phone: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Manufacturer Website (제조사 홈페이지)</label>
                <input
                  type="url"
                  value={formData.m_homepage ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, m_homepage: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Wholesale Portal (도매 문의 링크)</label>
                <input
                  type="url"
                  value={formData.wholesale_link ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, wholesale_link: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Global Site URL (글로벌사이트URL)</label>
                <input
                  type="url"
                  value={formData.global_site_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, global_site_url: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>B2B Inquiry URL (B2B문의URL)</label>
                <input
                  type="url"
                  value={formData.b2b_inquiry_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, b2b_inquiry_url: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Can OEM (OEM가능여부)</label>
                <select
                  value={formData.can_oem === true ? "true" : formData.can_oem === false ? "false" : ""}
                  onChange={(e) => setFormData((p) => ({
                    ...p!,
                    can_oem: e.target.value === "true" ? true : e.target.value === "false" ? false : null
                  }))}
                  className={inputClass}
                >
                  <option value="">— 미확인 —</option>
                  <option value="true">Yes (가능)</option>
                  <option value="false">No (불가)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border-2 border-[#16A34A] bg-white shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s7")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-white bg-[#16A34A] px-2 py-0.5 rounded-md uppercase tracking-widest">CEO</span>
              <span className="text-sm font-semibold text-[#1A1916]">CEO Direct Input Zone</span>
              <span className="text-xs text-[#9E9C98]">— 대표님 직접 입력 전용</span>
            </div>
            <span className="text-[#9E9C98] text-xs">{openSections.s7 ? "▼" : "▶"}</span>
          </button>
          {openSections.s7 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t-2 border-[#16A34A]">
              <p className="text-xs text-[#9E9C98] pt-4">이 구역은 대표님이 브랜드와 직접 협의하거나 발품 팔아 확인한 정보만 입력합니다. Make.com이 자동으로 채우지 않습니다.</p>

              <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-widest pt-2">B2B 소싱 원가 & 조건</p>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Verified Cost (USD) (검증된 원가)</label>
                <input
                  type="text"
                  value={formData.verified_cost_usd ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, verified_cost_usd: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Verified Cost Note (검증원가메모)</label>
                <input
                  value={formData.verified_cost_note ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, verified_cost_note: e.target.value }))}
                  className={inputClass}
                  placeholder="Type 'undisclosed' to hide price"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Verified At (검증일시)</label>
                <input
                  type="date"
                  value={formData.verified_at ? String(formData.verified_at).slice(0, 10) : ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, verified_at: e.target.value ? e.target.value : null }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>MOQ (최소주문수량)</label>
                <input
                  value={formData.moq ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, moq: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Lead Time (리드타임)</label>
                <input
                  value={formData.lead_time ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, lead_time: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Sample Policy (샘플정책)</label>
                <input
                  value={formData.sample_policy ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, sample_policy: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Export Cert Note (수출인증메모)</label>
                <input
                  value={formData.export_cert_note ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, export_cert_note: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-widest pt-4">미디어 & 마케팅 자산</p>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Viral Video URL (바이럴영상URL)</label>
                <input
                  value={formData.viral_video_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, viral_video_url: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Video URL (영상URL)</label>
                <input
                  value={formData.video_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, video_url: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Marketing Assets URL (마케팅자산URL)</label>
                <input
                  value={formData.marketing_assets_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, marketing_assets_url: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <p className="text-xs font-semibold text-[#7C3AED] uppercase tracking-widest pt-4">AI 자산</p>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>AI Detail Page Links (AI상세페이지링크)</label>
                <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-4">
                  <AiPageLinksHelper
                    value={
                      typeof formData.ai_detail_page_links === "string"
                        ? formData.ai_detail_page_links
                        : formData.ai_detail_page_links != null
                          ? JSON.stringify(formData.ai_detail_page_links)
                          : null
                    }
                    onChange={(s) => setFormData((p) => ({ ...p!, ai_detail_page_links: s as unknown as ScoutFinalReportsRow["ai_detail_page_links"] }))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit History */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden mt-8">
          <h2 className="px-6 py-4 border-b border-[#E8E6E1] text-sm font-semibold text-[#1A1916]">
            수정 이력 (Edit History)
          </h2>
          <div className="overflow-x-auto">
            {(() => {
              const hist = formData.edit_history as { entries?: { timestamp: string; changes: { field: string; before: string; after: string }[] }[] } | null | undefined;
              const entries = Array.isArray(hist?.entries) ? hist.entries : [];
              if (entries.length === 0) {
                return (
                  <div className="px-6 py-8 text-center text-[#6B6860] text-sm">
                    아직 수정 이력이 없습니다.
                  </div>
                );
              }
              return (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#F8F7F4] border-b border-[#E8E6E1] text-xs font-semibold text-[#9E9C98] uppercase tracking-widest">
                      <th className="px-4 py-3">일시</th>
                      <th className="px-4 py-3">필드 (한글)</th>
                      <th className="px-4 py-3">변경 전</th>
                      <th className="px-4 py-3">변경 후</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...entries].reverse().map((entry, ei) =>
                      entry.changes?.map((c, ci) => (
                        <tr key={`${ei}-${ci}`} className="border-t border-[#E8E6E1] text-sm">
                          <td className="px-4 py-2 text-[#6B6860] font-mono text-xs whitespace-nowrap">
                            {entry.timestamp ? new Date(entry.timestamp).toLocaleString("ko-KR") : "—"}
                          </td>
                          <td className="px-4 py-2 text-[#3D3B36]">
                            {FIELD_LABELS_KO[c.field] ?? c.field}
                          </td>
                          <td className="px-4 py-2 text-[#6B6860] max-w-[200px] truncate" title={c.before}>
                            {c.before}
                          </td>
                          <td className="px-4 py-2 text-[#16A34A] max-w-[200px] truncate" title={c.after}>
                            {c.after}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              );
            })()}
          </div>
        </div>
      </main>
    </div>
  );
}

```

### `app/api/admin/reports/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
  const cookie = request.cookies.get(cookieName);
  if (cookie?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    const msg = !url
      ? "Missing NEXT_PUBLIC_SUPABASE_URL in environment"
      : "Missing SUPABASE_SERVICE_ROLE_KEY in environment";
    console.error("[GET /api/admin/reports]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("scout_final_reports")
      .select("id, product_name, week_id, market_viability, status, created_at")
      .order("created_at", { ascending: false }); // newest first for Admin List View

    if (error) {
      console.error("[GET /api/admin/reports] Supabase error:", error.message, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data ?? []);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch";
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[GET /api/admin/reports] Exception:", message, stack ?? err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

```

### `app/api/admin/reports/[id]/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { ScoutFinalReportsRow } from "@/types/database";

function assertAdmin(request: NextRequest): boolean {
  const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
  const cookie = request.cookies.get(cookieName);
  return cookie?.value === "authenticated";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("scout_final_reports")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "Not found" },
        { status: error?.code === "PGRST116" ? 404 : 500 }
      );
    }
    return NextResponse.json(data as ScoutFinalReportsRow);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  let body: Partial<ScoutFinalReportsRow>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id: _id, created_at: _ca, ...updates } = body as Partial<ScoutFinalReportsRow> & { id?: string; created_at?: string };
  if ("kr_price_usd" in updates) delete (updates as Record<string, unknown>).kr_price_usd;
  if ("estimated_cost_usd" in updates) delete (updates as Record<string, unknown>).estimated_cost_usd;

  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("scout_final_reports")
      .update(updates)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const weekId = updates.week_id;
    if (typeof weekId === "string" && weekId) {
      revalidatePath(`/weekly/${weekId}/${id}`);
    }
    revalidatePath("/weekly");
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update" },
      { status: 500 }
    );
  }
}

```

### `app/api/admin/auth/route.ts`

```ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = body?.password;
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      return NextResponse.json(
        { error: "Admin not configured" },
        { status: 500 }
      );
    }

    if (password !== expected) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
    const isProduction = process.env.NODE_ENV === "production";

    const res = NextResponse.json({ success: true }, { status: 200 });
    res.cookies.set(cookieName, "authenticated", {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "strict",
      secure: isProduction,
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

```

### `app/api/admin/logout/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
  const origin = request.nextUrl.origin;
  const res = NextResponse.redirect(new URL("/admin/login", origin));
  res.cookies.set(cookieName, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return res;
}

```

### `app/api/billing/portal/route.ts`

```ts
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. 현재 로그인 유저 확인
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. profiles에서 ls_subscription_id 가져오기
    const admin = createServiceRoleClient();
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("ls_subscription_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.ls_subscription_id) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    // 3. LemonSqueezy API 호출
    const lsRes = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions/${profile.ls_subscription_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
          Accept: "application/vnd.api+json",
        },
      }
    );

    if (!lsRes.ok) {
      console.error("[billing/portal] LemonSqueezy API error:", lsRes.status);
      return NextResponse.json({ error: "Failed to fetch portal URL" }, { status: 502 });
    }

    const lsData = await lsRes.json();
    const portalUrl = lsData?.data?.attributes?.urls?.customer_portal;

    if (!portalUrl) {
      return NextResponse.json({ error: "Portal URL not available" }, { status: 404 });
    }

    return NextResponse.json({ url: portalUrl });
  } catch (e) {
    console.error("[billing/portal] error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

```

### `app/api/webhooks/lemonsqueezy/route.ts`

```ts
import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createServiceRoleClient } from "@/lib/supabase/admin";

const LEMONSQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

/** Standard $69 — checkout URL UUID (LemonSqueezy 웹훅은 variant_id를 숫자로 보낼 수 있음) */
const STANDARD_VARIANT_UUID = "141f6710-c704-4ab3-b7c7-f30b2c587587";
/** Alpha $129 — checkout URL UUID */
const ALPHA_VARIANT_UUID = "41bb4d4b-b9d6-4a60-8e19-19287c35516d";
/** Standard/Alpha 숫자 variant_id (.env: LEMONSQUEEZY_VARIANT_ID_STANDARD / _ALPHA) — 일치 시 tier 업데이트 */
const STANDARD_VARIANT_NUMERIC = process.env.LEMONSQUEEZY_VARIANT_ID_STANDARD
  ? parseInt(process.env.LEMONSQUEEZY_VARIANT_ID_STANDARD, 10)
  : null;
const ALPHA_VARIANT_NUMERIC = process.env.LEMONSQUEEZY_VARIANT_ID_ALPHA
  ? parseInt(process.env.LEMONSQUEEZY_VARIANT_ID_ALPHA, 10)
  : null;

function verifySignature(rawBody: string, signature: string | null): boolean {
  if (!LEMONSQUEEZY_WEBHOOK_SECRET || !signature) return false;
  const hmac = crypto.createHmac("sha256", LEMONSQUEEZY_WEBHOOK_SECRET);
  hmac.update(rawBody, "utf8");
  const digest = hmac.digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(digest, "utf8"),
      Buffer.from(signature, "utf8")
    );
  } catch {
    return false;
  }
}

function variantIdToTier(variantId: string | number): "standard" | "alpha" | null {
  const num =
    typeof variantId === "number"
      ? variantId
      : typeof variantId === "string" && /^\d+$/.test(variantId)
        ? parseInt(variantId, 10)
        : NaN;
  if (!Number.isNaN(num)) {
    if (STANDARD_VARIANT_NUMERIC !== null && num === STANDARD_VARIANT_NUMERIC) return "standard";
    if (ALPHA_VARIANT_NUMERIC !== null && num === ALPHA_VARIANT_NUMERIC) return "alpha";
    return null;
  }
  const id = String(variantId).toLowerCase();
  if (id === STANDARD_VARIANT_UUID.toLowerCase()) return "standard";
  if (id === ALPHA_VARIANT_UUID.toLowerCase()) return "alpha";
  return null;
}

function parseDateSafe(value: unknown): string | null {
  if (!value || typeof value !== "string") return null;
  try {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d.toISOString();
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const signature = (
      request.headers.get("x-signature") ?? request.headers.get("X-Signature")
    )?.trim() ?? null;
    const rawBody = await request.text();
    if (!rawBody) {
      console.warn("[lemonsqueezy] 400: Missing body");
      return NextResponse.json(
        { error: "Missing body" },
        { status: 400 }
      );
    }
    if (!verifySignature(rawBody, signature)) {
      console.warn("[lemonsqueezy] 401: Invalid signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody) as {
      meta?: {
        event_name?: string;
        custom_data?: Record<string, unknown>;
      };
      data?: {
        id?: string;
        type?: string;
        attributes?: {
          variant_id?: number | string;
          user_email?: string;
          customer_id?: number;
          [key: string]: unknown;
        };
      };
    };

    const eventName =
      payload.meta?.event_name ??
      request.headers.get("x-event-name") ??
      "";
    const data = payload.data;
    const attrs = data?.attributes;
    const customData = payload.meta?.custom_data as Record<string, unknown> | undefined;

    // 디버깅: 수신 이벤트와 payload 구조 로그
    console.log("[lemonsqueezy] event:", eventName, "data.type:", data?.type, "data.id:", data?.id);
    console.log("[lemonsqueezy] data.attributes keys:", attrs ? Object.keys(attrs) : "none");
    if (attrs?.variant_id !== undefined) {
      console.log("[lemonsqueezy] variant_id:", attrs.variant_id, "typeof:", typeof attrs.variant_id);
    }

    if (eventName === "subscription_created" || eventName === "subscription_updated") {
      const variantId = attrs?.variant_id;
      if (variantId == null) {
        console.warn("[lemonsqueezy] 400: Missing variant_id. attrs:", JSON.stringify(attrs ?? {}));
        return NextResponse.json(
          { error: "Missing variant_id" },
          { status: 400 }
        );
      }
      const tier = variantIdToTier(variantId);
      if (!tier) {
        console.warn(
          "[lemonsqueezy] 400: Unknown variant_id. received:",
          variantId,
          "typeof:",
          typeof variantId,
          typeof variantId === "number"
            ? "→ LemonSqueezy는 웹훅에 숫자 variant_id를 보냅니다. .env에 LEMONSQUEEZY_VARIANT_ID_STANDARD, LEMONSQUEEZY_VARIANT_ID_ALPHA (숫자) 설정 후 재시도."
            : "→ Standard/Alpha UUID와 일치하는지 확인하세요."
        );
        return NextResponse.json(
          { error: "Unknown variant_id" },
          { status: 400 }
        );
      }

      let profileId: string | null = null;
      if (customData?.user_id && typeof customData.user_id === "string") {
        profileId = customData.user_id;
      }

      const supabase = createServiceRoleClient();
      const now = new Date().toISOString();
      const subscriptionStartAt = parseDateSafe(attrs?.starts_at) ?? parseDateSafe(attrs?.created_at) ?? null;
      const subscriptionResetAt = parseDateSafe(attrs?.renews_at) ?? null;

      if (profileId) {
        const { error } = await supabase
          .from("profiles")
          .update({
            tier,
            ls_subscription_id: data?.id ?? null,
            tier_updated_at: now,
            ...(subscriptionStartAt && { subscription_start_at: subscriptionStartAt }),
            ...(subscriptionResetAt && { subscription_reset_at: subscriptionResetAt }),
          })
          .eq("id", profileId);

        if (error) {
          console.error("[lemonsqueezy] profiles update by id:", error);
          return NextResponse.json(
            { error: "Profile update failed" },
            { status: 500 }
          );
        }
      } else {
        const userEmail = attrs?.user_email ?? (payload as { data?: { attributes?: { user_email?: string } } }).data?.attributes?.user_email;
        if (typeof userEmail === "string" && userEmail) {
          const { error } = await supabase
            .from("profiles")
            .update({
              tier,
              ls_subscription_id: data?.id ?? null,
              tier_updated_at: now,
              ...(subscriptionStartAt && { subscription_start_at: subscriptionStartAt }),
              ...(subscriptionResetAt && { subscription_reset_at: subscriptionResetAt }),
            })
            .eq("email", userEmail);

          if (error) {
            console.error("[lemonsqueezy] profiles update by email:", error);
            return NextResponse.json(
              { error: "Profile update failed" },
              { status: 500 }
            );
          }
        }
      }
    } else if (
      eventName === "subscription_cancelled" ||
      eventName === "subscription_expired"
    ) {
      const subscriptionId = data?.id;
      if (!subscriptionId) {
        console.warn("[lemonsqueezy] 400: Missing subscription id. data:", JSON.stringify(data ?? {}));
        return NextResponse.json(
          { error: "Missing subscription id" },
          { status: 400 }
        );
      }
      const supabase = createServiceRoleClient();
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("profiles")
        .update({
          tier: "free",
          tier_updated_at: now,
          ls_subscription_id: null,
        })
        .eq("ls_subscription_id", subscriptionId);

      if (error) {
        console.error("[lemonsqueezy] profiles downgrade:", error);
        return NextResponse.json(
          { error: "Profile update failed" },
          { status: 500 }
        );
      }
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("[lemonsqueezy] webhook error:", e);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}

```

### `app/api/webhook/route.ts`

```ts
export { POST } from "../webhooks/lemonsqueezy/route";

```

### `components/admin/GlobalPricesHelper.tsx`

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";

// ——— Types ———
type ListingItem = {
  platform?: string;
  price_usd?: number;
  url?: string;
  sold_out?: boolean;
  [k: string]: unknown;
};

type RegionDataLike = {
  price_usd?: number;
  url?: string | null;
  official_url?: string;
  seller_type?: string;
  listings?: ListingItem[];
  [k: string]: unknown;
};

type GlobalPricesLike = {
  us_uk_eu?: { us?: RegionDataLike; uk?: RegionDataLike; eu?: RegionDataLike; [k: string]: unknown };
  jp_sea?: { jp?: RegionDataLike; sea?: RegionDataLike; [k: string]: unknown };
  uae?: { uae?: RegionDataLike; [k: string]: unknown };
  shopee_lazada?: RegionDataLike;
  [k: string]: unknown;
};

const REGIONS: Array<{ key: string; flag: string; name: string }> = [
  { key: "us", flag: "🇺🇸", name: "US" },
  { key: "gb", flag: "🇬🇧", name: "UK" },
  { key: "eu", flag: "🇪🇺", name: "EU" },
  { key: "jp", flag: "🇯🇵", name: "Japan" },
  { key: "sea", flag: "🇸🇬", name: "SEA" },
  { key: "uae", flag: "🇦🇪", name: "UAE" },
];

const inputCls =
  "bg-white border border-[#E8E6E1] rounded-md px-2 py-1.5 text-sm text-[#1A1916] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] outline-none";

function parseValue(value: string | null): GlobalPricesLike {
  if (value == null || value === "") return {};
  try {
    let raw: unknown = JSON.parse(value);
    if (typeof raw === "string") raw = JSON.parse(raw);
    if (typeof raw !== "object" || raw === null) return {};
    return raw as GlobalPricesLike;
  } catch {
    return {};
  }
}

function getRegionData(data: GlobalPricesLike, regionKey: string): RegionDataLike | undefined {
  if (regionKey === "shopee_lazada") return data.shopee_lazada;
  if (regionKey === "us") return data.us_uk_eu?.us;
  if (regionKey === "gb") return data.us_uk_eu?.uk;
  if (regionKey === "eu") return data.us_uk_eu?.eu;
  if (regionKey === "jp") return data.jp_sea?.jp;
  if (regionKey === "sea") return data.jp_sea?.sea;
  if (regionKey === "uae") return data.uae?.uae;
  return undefined;
}

function normalizeListing(l: unknown, source?: "sea" | "shopee_lazada"): ListingItem {
  if (l && typeof l === "object" && !Array.isArray(l)) {
    const o = l as Record<string, unknown>;
    const price_usd = typeof o.price_usd === "number" ? o.price_usd : 0;
    const sold_out = o.sold_out === true || price_usd === 0;
    const item: ListingItem = {
      platform: typeof o.platform === "string" ? o.platform : "",
      price_usd,
      url: typeof o.url === "string" ? o.url : "",
      sold_out,
    };
    if (source) item.source = source;
    return item;
  }
  const item: ListingItem = { platform: "", price_usd: 0, url: "", sold_out: true };
  if (source) item.source = source;
  return item;
}

function getRegionListings(data: GlobalPricesLike, regionKey: string): ListingItem[] {
  if (regionKey === "sea") {
    const seaList = getRegionData(data, "sea")?.listings;
    const shopeeList = data.shopee_lazada?.listings;
    const seaItems = Array.isArray(seaList) ? seaList.map((l) => normalizeListing(l, "sea")) : [];
    const shopeeItems = Array.isArray(shopeeList) ? shopeeList.map((l) => normalizeListing(l, "shopee_lazada")) : [];
    return [...seaItems, ...shopeeItems];
  }
  const region = getRegionData(data, regionKey);
  const list = region?.listings;
  if (!Array.isArray(list)) return [];
  return list.map((l) => normalizeListing(l));
}

/** Minimum price_usd > 0 is the Best price for the badge. */
function getBestPrice(listings: ListingItem[]): number | null {
  const prices = listings.map((l) => l.price_usd ?? 0).filter((p) => p > 0);
  if (prices.length === 0) return null;
  return Math.min(...prices);
}

function getBestListingIndex(listings: ListingItem[]): number {
  let bestIdx = -1;
  let best = Infinity;
  listings.forEach((l, i) => {
    const p = l.price_usd ?? 0;
    if (p > 0 && p < best) {
      best = p;
      bestIdx = i;
    }
  });
  return bestIdx;
}

function sortListings(listings: ListingItem[]): ListingItem[] {
  return [...listings].sort((a, b) => {
    const pa = a.price_usd ?? 0;
    const pb = b.price_usd ?? 0;
    if (pa > 0 && pb > 0) return pa - pb;
    if (pa > 0) return -1;
    if (pb > 0) return 1;
    return 0;
  });
}

function stripSource(listing: ListingItem): Omit<ListingItem, "source"> {
  const { source: _s, ...rest } = listing;
  return rest;
}

function setRegionListings(
  data: GlobalPricesLike,
  regionKey: string,
  listings: ListingItem[]
): GlobalPricesLike {
  const next = JSON.parse(JSON.stringify(data)) as GlobalPricesLike;
  if (regionKey === "sea") {
    const seaListings = listings
      .filter((l) => (l as ListingItem & { source?: string }).source !== "shopee_lazada")
      .map(stripSource);
    const shopeeListings = listings
      .filter((l) => (l as ListingItem & { source?: string }).source === "shopee_lazada")
      .map(stripSource);
    if (!next.jp_sea) next.jp_sea = {};
    if (!next.jp_sea.sea) next.jp_sea.sea = {};
    next.jp_sea.sea.listings = seaListings;
    if (!next.shopee_lazada) next.shopee_lazada = {};
    next.shopee_lazada.listings = shopeeListings;
    return next;
  }
  if (regionKey === "shopee_lazada") {
    if (!next.shopee_lazada) next.shopee_lazada = {};
    next.shopee_lazada.listings = listings.map(stripSource);
    return next;
  }
  if (regionKey === "us") {
    if (!next.us_uk_eu) next.us_uk_eu = {};
    if (!next.us_uk_eu.us) next.us_uk_eu.us = {};
    next.us_uk_eu.us.listings = listings.map(stripSource);
    return next;
  }
  if (regionKey === "gb") {
    if (!next.us_uk_eu) next.us_uk_eu = {};
    if (!next.us_uk_eu.uk) next.us_uk_eu.uk = {};
    next.us_uk_eu.uk.listings = listings.map(stripSource);
    return next;
  }
  if (regionKey === "eu") {
    if (!next.us_uk_eu) next.us_uk_eu = {};
    if (!next.us_uk_eu.eu) next.us_uk_eu.eu = {};
    next.us_uk_eu.eu.listings = listings.map(stripSource);
    return next;
  }
  if (regionKey === "jp") {
    if (!next.jp_sea) next.jp_sea = {};
    if (!next.jp_sea.jp) next.jp_sea.jp = {};
    next.jp_sea.jp.listings = listings.map(stripSource);
    return next;
  }
  if (regionKey === "uae") {
    if (!next.uae) next.uae = {};
    if (!next.uae.uae) next.uae.uae = {};
    next.uae.uae.listings = listings.map(stripSource);
    return next;
  }
  return next;
}

export function GlobalPricesHelper({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (newJsonString: string) => void;
}) {
  const [data, setData] = useState<GlobalPricesLike>(() => parseValue(value));
  const [rawOpen, setRawOpen] = useState(false);
  const [openRegions, setOpenRegions] = useState<Record<string, boolean>>(() =>
    REGIONS.reduce((acc, r) => ({ ...acc, [r.key]: true }), {})
  );
  const [pendingDelete, setPendingDelete] = useState<{ regionKey: string; index: number } | null>(null);

  useEffect(() => {
    setData(parseValue(value));
  }, [value]);

  const emit = useCallback(
    (next: GlobalPricesLike) => {
      setData(next);
      onChange(JSON.stringify(next));
    },
    [onChange]
  );

  const updateRegionListings = useCallback(
    (regionKey: string, updater: (prev: ListingItem[]) => ListingItem[]) => {
      const prev = getRegionListings(data, regionKey);
      const nextListings = updater(prev);
      const nextData = setRegionListings(data, regionKey, nextListings);
      emit(nextData);
    },
    [data, emit]
  );

  const setListing = useCallback(
    (regionKey: string, index: number, listing: ListingItem) => {
      updateRegionListings(regionKey, (list) => {
        const next = [...list];
        next[index] = listing;
        return next;
      });
    },
    [updateRegionListings]
  );

  const addListing = useCallback(
    (regionKey: string) => {
      updateRegionListings(regionKey, (list) => {
        const newItem: ListingItem = { platform: "", price_usd: 0, url: "", sold_out: true };
        if (regionKey === "sea") (newItem as ListingItem & { source?: string }).source = "sea";
        return [...list, newItem];
      });
    },
    [updateRegionListings]
  );

  const deleteListing = useCallback(
    (regionKey: string, index: number) => {
      updateRegionListings(regionKey, (list) => list.filter((_, i) => i !== index));
    },
    [updateRegionListings]
  );

  const openUrl = useCallback((url: string) => {
    const u = (url ?? "").trim();
    if (u) window.open(u, "_blank");
  }, []);

  const currentJson = JSON.stringify(data, null, 2);

  return (
    <div className="flex flex-col gap-2">
      {REGIONS.map((r) => {
        const regionKey = r.key;
        const listings = getRegionListings(data, regionKey);
        const sorted = sortListings(listings);
        const bestPrice = getBestPrice(listings);
        const bestIdx = getBestListingIndex(sorted);
        const hasAnyPrice = listings.some((l) => (l.price_usd ?? 0) > 0);

        return (
          <div
            key={regionKey}
            className="bg-white border border-[#E8E6E1] rounded-xl overflow-hidden"
          >
            {/* Region header */}
            <button
              type="button"
              onClick={() => setOpenRegions((prev) => ({ ...prev, [regionKey]: !prev[regionKey] }))}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-[#F8F7F4] border-b border-[#E8E6E1] text-left hover:bg-[#F0EDE8] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-[15px]">{r.flag}</span>
                <span className="text-sm font-bold text-[#1A1916]">{r.name}</span>
                {hasAnyPrice && bestPrice != null ? (
                  <span
                    className="text-[11px] px-2 py-0.5 rounded-md border border-[#BBF7D0] font-medium"
                    style={{
                      color: "#16A34A",
                      background: "#F0FDF4",
                      borderWidth: "1px",
                      borderRadius: "6px",
                    }}
                  >
                    Best ${Number(bestPrice).toFixed(2)}
                  </span>
                ) : (
                  <span className="text-xs text-[#9E9C98]">No data</span>
                )}
              </div>
              <span className="text-[#9E9C98] text-sm shrink-0">
                {openRegions[regionKey] !== false ? "▼" : "▶"}
              </span>
            </button>

            {/* Listings — expand when open */}
            {openRegions[regionKey] !== false && sorted.map((listing, idx) => {
              const price = listing.price_usd ?? 0;
              const isBest = hasAnyPrice && idx === bestIdx;
              const isZero = price === 0;
              const originalIndex = listings.findIndex((l) => l === listing);
              const isPendingDelete = pendingDelete?.regionKey === regionKey && pendingDelete?.index === originalIndex;

              if (isPendingDelete) {
                return (
                  <div
                    key={`del-${regionKey}-${originalIndex}`}
                    className="flex items-center gap-2 px-4 py-2 border-b border-[#E8E6E1] last:border-b-0 bg-[#FEE2E2]"
                  >
                    <span className="text-sm text-[#1A1916] flex-1">이 항목을 삭제하시겠습니까?</span>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(null)}
                      className="text-sm px-3 py-1.5 rounded border border-[#E8E6E1] bg-white text-[#1A1916] hover:bg-[#F8F7F4] transition-colors"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteListing(regionKey, originalIndex);
                        setPendingDelete(null);
                      }}
                      className="text-sm px-3 py-1.5 rounded border border-[#DC2626] bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FECACA] transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={originalIndex >= 0 ? originalIndex : idx}
                  className={`flex items-center gap-2 px-4 py-2 border-b border-[#E8E6E1] last:border-b-0 ${isBest ? "bg-[#F0FDF4]" : ""} ${isZero ? "opacity-70" : ""}`}
                >
                  <input
                    type="text"
                    placeholder="Platform"
                    value={listing.platform ?? ""}
                    onChange={(e) =>
                      setListing(regionKey, originalIndex, {
                        ...listing,
                        platform: e.target.value,
                      })
                    }
                    className={`${inputCls} w-[100px]`}
                  />
                  <input
                    type="number"
                    step={0.01}
                    min={0}
                    value={price === 0 ? "" : price}
                    onChange={(e) => {
                      const v = e.target.value;
                      const num = v === "" ? 0 : Number(v);
                      setListing(regionKey, originalIndex, {
                        ...listing,
                        price_usd: num,
                      });
                    }}
                    className={`${inputCls} w-[70px]`}
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    value={listing.url ?? ""}
                    onChange={(e) =>
                      setListing(regionKey, originalIndex, {
                        ...listing,
                        url: e.target.value,
                      })
                    }
                    className={`${inputCls} flex-1 min-w-0`}
                  />
                  <label className="flex items-center gap-1 text-xs text-[#9E9C98] whitespace-nowrap cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={listing.sold_out === true}
                      onChange={(e) =>
                        setListing(regionKey, originalIndex, {
                          ...listing,
                          sold_out: e.target.checked,
                        })
                      }
                      className="rounded border-[#E8E6E1] text-[#16A34A] focus:ring-[#16A34A]"
                    />
                    Sold Out
                  </label>
                  <button
                    type="button"
                    onClick={() => openUrl(listing.url ?? "")}
                    className="text-[#9E9C98] hover:text-[#1A1916] text-sm px-1.5 py-1 rounded transition-colors bg-transparent border-none cursor-pointer flex-shrink-0"
                    aria-label="Open URL"
                  >
                    🔗
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete({ regionKey, index: originalIndex })}
                    className="text-[#9E9C98] hover:text-[#1A1916] text-sm px-1.5 py-1 rounded transition-colors bg-transparent border-none cursor-pointer flex-shrink-0"
                    aria-label="Delete"
                  >
                    🗑
                  </button>
                </div>
              );
            })}

            {openRegions[regionKey] !== false && (
              <button
                type="button"
                onClick={() => addListing(regionKey)}
                className="text-xs text-[#16A34A] hover:text-[#15803D] px-4 py-2 text-left bg-transparent border-none cursor-pointer w-full"
              >
                + Add listing
              </button>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => setRawOpen((o) => !o)}
        className="text-xs text-[#C4C2BE] hover:text-[#9E9C98] cursor-pointer bg-transparent border-none mt-1"
      >
        {rawOpen ? "▼ Hide Raw JSON" : "▶ Show Raw JSON"}
      </button>
      {rawOpen && (
        <textarea
          readOnly
          value={currentJson}
          rows={10}
          className="mt-1 w-full bg-[#F8F7F4] border border-[#E8E6E1] rounded-md px-2 py-1.5 text-xs font-mono text-[#1A1916] resize-none"
        />
      )}
      <p className="text-xs text-[#9E9C98] italic mt-1">
        Leave URL empty to show Blue Ocean badge on the product page.
      </p>
    </div>
  );
}

```

### `components/admin/HazmatCheckboxes.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";

type HazmatState = {
  is_liquid: boolean;
  is_powder: boolean;
  is_battery: boolean;
  is_aerosol: boolean;
};

function parseValue(value: string | null): HazmatState {
  const def: HazmatState = {
    is_liquid: false,
    is_powder: false,
    is_battery: false,
    is_aerosol: false,
  };
  if (!value?.trim()) return def;
  try {
    const p = JSON.parse(value);
    if (typeof p !== "object" || p === null) return def;
    return {
      is_liquid: Boolean(p.is_liquid),
      is_powder: Boolean(p.is_powder),
      is_battery: Boolean(p.is_battery),
      is_aerosol: Boolean(p.is_aerosol),
    };
  } catch {
    return def;
  }
}

export function HazmatCheckboxes({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (newJsonString: string) => void;
}) {
  const [state, setState] = useState<HazmatState>(() => parseValue(value));

  useEffect(() => {
    setState(parseValue(value));
  }, [value]);

  function toggle(key: keyof HazmatState) {
    const newState = { ...state, [key]: !state[key] };
    setState(newState);
    onChange(
      JSON.stringify({
        is_liquid: newState.is_liquid,
        is_powder: newState.is_powder,
        is_battery: newState.is_battery,
        is_aerosol: newState.is_aerosol,
      })
    );
  }

  const items: { key: keyof HazmatState; icon: string; label: string }[] = [
    { key: "is_liquid", icon: "💧", label: "Liquid" },
    { key: "is_powder", icon: "🧪", label: "Powder" },
    { key: "is_battery", icon: "🔋", label: "Battery" },
    { key: "is_aerosol", icon: "💨", label: "Aerosol" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 bg-[#F8F7F4] p-4 rounded-lg">
      {items.map(({ key, icon, label }) => (
        <label
          key={key}
          className="flex items-center gap-2 cursor-pointer text-sm text-[#3D3B36]"
        >
          <input
            type="checkbox"
            checked={state[key]}
            onChange={() => toggle(key)}
            className="appearance-none w-4 h-4 rounded border border-[#E8E6E1] bg-white checked:bg-[#16A34A] checked:border-[#16A34A] focus:border-[#16A34A] outline-none"
          />
          <span>
            {icon} {label}
          </span>
        </label>
      ))}
    </div>
  );
}

```

### `components/admin/AiPageLinksHelper.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";

const MAX_LINKS = 5;

function parseValue(value: string | null): string[] {
  if (value == null || value === "") return [""];
  try {
    const p = JSON.parse(value);
    if (Array.isArray(p)) {
      const arr = p.map((x) => (typeof x === "string" ? x : "")).slice(0, MAX_LINKS);
      return arr.length ? arr : [""];
    }
    if (typeof p === "string" && p.trim()) return [p.trim()];
  } catch {
    if (typeof value === "string" && value.trim()) return [value.trim()];
  }
  return [""];
}

export function AiPageLinksHelper({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (newJsonString: string) => void;
}) {
  const [links, setLinks] = useState<string[]>(() => parseValue(value));

  useEffect(() => {
    setLinks(parseValue(value));
  }, [value]);

  function updateLink(i: number, v: string) {
    const newLinks = [...links];
    newLinks[i] = v;
    setLinks(newLinks);
    const filtered = newLinks.filter((s) => s.trim());
    onChange(JSON.stringify(filtered.length ? filtered : []));
  }

  function removeLink(i: number) {
    const newLinks = links.filter((_, idx) => idx !== i);
    setLinks(newLinks);
    const filtered = newLinks.filter((s) => s.trim());
    onChange(JSON.stringify(filtered.length ? filtered : []));
  }

  function addLink() {
    if (links.length >= MAX_LINKS) return;
    const newLinks = [...links, ""];
    setLinks(newLinks);
    const filtered = newLinks.filter((s) => s.trim());
    onChange(JSON.stringify(filtered.length ? filtered : []));
  }

  const inputClass =
    "bg-white border border-[#E8E6E1] rounded-lg px-3 py-2 text-sm text-[#1A1916] placeholder:text-[#C4C2BE] focus:border-[#16A34A] outline-none flex-1 min-w-0";

  return (
    <div className="flex flex-col gap-2 bg-[#F8F7F4] border border-[#E8E6E1] rounded-lg p-4">
      {links.map((link, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-[#9E9C98] text-xs w-14">Link {i + 1}:</span>
          <input
            type="url"
            value={link}
            onChange={(e) => updateLink(i, e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => removeLink(i)}
            className="text-[#9E9C98] hover:text-[#DC2626] p-1 shrink-0"
            aria-label="Remove"
          >
            🗑
          </button>
        </div>
      ))}
      {links.length < MAX_LINKS && (
        <button
          type="button"
          onClick={addLink}
          className="text-xs text-[#16A34A] hover:text-[#15803D] w-fit"
        >
          + Add Link
        </button>
      )}
    </div>
  );
}

```

### `lib/supabase/admin.ts`

```ts
import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service_role key.
 * Bypasses RLS. Use only in trusted server code (e.g. webhooks, cron).
 * Never expose this key to the client.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL for admin client"
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

```

### `lib/supabase/server.ts`

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server Supabase client. Use for Server Components, Route Handlers, Server Actions.
 * RLS applies: profiles (own row), weeks (published only), scout_final_reports (tier-based).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component; middleware will refresh the session.
          }
        },
      },
    }
  );
}

```

### `lib/auth-server.ts`

```ts
import { createClient } from "@/lib/supabase/server";
import type { ScoutFinalReportsRow, Tier } from "@/types/database";

export interface AuthResult {
  userId: string | null;
  userEmail: string | null;
  tier: Tier;
  subscriptionStartAt: string | null;
}

/**
 * Get current user id and tier for server components.
 * Guests and unauthenticated users get tier 'free'.
 * RLS uses this tier for report_access on scout_final_reports.
 */
export async function getAuthTier(): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { userId: null, userEmail: null, tier: "free", subscriptionStartAt: null };
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier, subscription_start_at")
    .eq("id", user.id)
    .single();
  const tier = (profile?.tier as Tier) ?? "free";
  return {
    userId: user.id,
    userEmail: user.email ?? null,
    tier,
    subscriptionStartAt: profile?.subscription_start_at ?? null,
  };
}

export function maskReportByTier(
  report: ScoutFinalReportsRow,
  tier: "free" | "standard" | "alpha"
): ScoutFinalReportsRow {
  if (tier === "alpha") return report;

  const masked = { ...report };

  // Fields nulled for BOTH free and standard
  const nullForFreeAndStandard = [
    "export_status",
    "status_reason",
    "actual_weight_g",
    "volumetric_weight_g",
    "billable_weight_g",
    "dimensions_cm",
    "shipping_tier",
    "required_certificates",
    "shipping_notes",
    "hazmat_status",
    "key_risk_ingredient",
    "composition_info",
    "spec_summary",
    "hazmat_summary",
    "sourcing_tip",
    "hs_code",
    "hs_description",
    "verified_cost_usd",
    "verified_cost_note",
    "verified_at",
    "moq",
    "lead_time",
    "can_oem",
    "m_name",
    "translated_name",
    "corporate_scale",
    "contact_email",
    "contact_phone",
    "m_homepage",
    "naver_link",
    "wholesale_link",
    "global_site_url",
    "b2b_inquiry_url",
    "sample_policy",
    "export_cert_note",
    "viral_video_url",
    "video_url",
    "ai_detail_page_links",
    "marketing_assets_url",
    "ai_image_url",
  ] as const;

  // Additional fields nulled for FREE only (not standard)
  const nullForFreeOnly = [
    "profit_multiplier",
    "estimated_cost_usd",
    "global_prices",
    "search_volume",
    "mom_growth",
    "wow_rate",
    "top_selling_point",
    "common_pain_point",
    "best_platform",
    "gap_index",
    "gap_status",
    "buzz_summary",
    "rising_keywords",
    "seo_keywords",
    "viral_hashtags",
    "trend_entry_strategy",
    "opportunity_reasoning",
    "kr_local_score",
    "global_trend_score",
    "kr_evidence",
    "global_evidence",
    "kr_source_used",
  ] as const;

  for (const key of nullForFreeAndStandard) {
    (masked as Record<string, unknown>)[key] = null;
  }

  if (tier === "free") {
    for (const key of nullForFreeOnly) {
      (masked as Record<string, unknown>)[key] = null;
    }
  }

  return masked;
}

```

### `middleware.ts`

```ts
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const response = pathname.startsWith("/admin")
    ? (() => {
        const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
        const cookie = request.cookies.get(cookieName);
        const isLoginPage = pathname === "/admin/login";
        if (isLoginPage || cookie?.value === "authenticated") return null;
        return NextResponse.redirect(new URL("/admin/login", request.url));
      })()
    : null;

  if (response) return response;

  const res = await updateSession(request);
  res.headers.set("x-pathname", pathname);
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

```

### `lib/supabase/middleware.ts`

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if expired; tokens are written via setAll to the response.
  await supabase.auth.getUser();

  return supabaseResponse;
}

```

### `types/database.ts`

```ts
/**
 * Database types for Supabase tables (Phase 2 + v1.3 확장).
 * Use with createClient() for typed CRUD when needed:
 *   const supabase = createClient() as SupabaseClient<Database>
 * Or pass to createServerClient/createBrowserClient options.
 * JSONB → Json; TEXT[] → string[] | null.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Tier = "free" | "standard" | "alpha";
export type WeekStatus = "draft" | "published" | "archived";
export type ReportStatus = "draft" | "published" | "archived" | "hidden";

export interface ProfilesRow {
  id: string;
  email: string;
  tier: Tier;
  ls_customer_id: string | null;
  ls_subscription_id: string | null;
  tier_updated_at: string | null;
  created_at: string;
}

export interface WeeksRow {
  week_id: string;
  week_label: string;
  start_date: string;
  end_date: string;
  published_at: string | null;
  product_count: number;
  summary: string | null;
  status: WeekStatus;
}

export interface ScoutFinalReportsRow {
  id: string;
  week_id: string;
  product_name: string;
  naver_product_name?: string | null;
  translated_name: string;
  image_url: string;
  ai_image_url: string | null;
  summary: string | null;
  consumer_insight: string | null;
  /** v1.3: optional product composition info (Section 1 accordion). May be null or absent on older rows. */
  composition_info?: string | null;
  /** v1.3: optional spec summary text block (Section 1 accordion). */
  spec_summary?: string | null;
  category: string;
  viability_reason: string;
  market_viability: number;
  competition_level: string;
  profit_multiplier: string;
  search_volume: string;
  mom_growth: string;
  gap_status: string;
  /** JSONB — 국가별 가격 { "US": "$24.99", ... } */
  global_price: Json | null;
  /** TEXT[] or comma-separated TEXT from pipeline */
  seo_keywords: string | string[] | null;
  export_status: string;
  hs_code: string | null;
  sourcing_tip: string | null;
  manufacturer_check: string | null;
  m_name: string | null;
  corporate_scale?: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  m_homepage: string | null;
  naver_link: string | null;
  wholesale_link?: string | null;
  global_site_url?: string | null;
  b2b_inquiry_url?: string | null;
  video_url: string | null;
  competitor_analysis_pdf: string | null;
  /** v1.2: 바이럴 숏폼 영상 URL */
  viral_video_url: string | null;
  published_at: string | null;
  free_list_at: string | null;
  is_premium: boolean;
  is_teaser: boolean;
  status: ReportStatus;
  created_at: string;
  /* ----- v1.3 신규 컬럼 (28개 중 선반영; 나머지는 마이그레이션 확정 후 추가) ----- */
  /** 한국 가격 (예: "12,000원") */
  kr_price?: string | null;
  /** Auto-calculated: kr_price in USD (trigger). */
  kr_price_usd?: number | null;
  /** Auto-calculated: estimated wholesale cost USD (trigger). */
  estimated_cost_usd?: number | null;
  /** Alpha: verified unit cost from supplier (admin input). */
  verified_cost_usd?: string | null;
  /** Alpha: note e.g. "undisclosed". */
  verified_cost_note?: string | null;
  /** Alpha: minimum order quantity. */
  moq?: string | null;
  /** Alpha: lead time. */
  lead_time?: string | null;
  /** 국가별 가격 상세 (JSONB). e.g. { us: { price: string }, ... } */
  global_prices?: Json | null;
  /** 플랫폼별 점수/지표 (JSONB) */
  platform_scores?: Json | null;
  /** WoW 성장률 (Section 3) */
  wow_rate?: string | null;
  /** Best platform recommendation (e.g. "Amazon FBA") */
  best_platform?: string | null;
  /** Seller Intelligence accordion */
  top_selling_point?: string | null;
  common_pain_point?: string | null;
  /** Hashtag pills, click to copy */
  viral_hashtags?: string[] | null;
  /* ----- Section 4 Social Proof & Trend Intelligence ----- */
  buzz_summary?: string | null;
  rising_keywords?: string[] | null;
  /** Korea local score 0–100 (Gap Analysis) */
  kr_local_score?: number | null;
  /** Global trend score 0–100 (Gap Analysis) */
  global_trend_score?: number | null;
  /** Gap index (e.g. 47). Can be derived or stored. */
  gap_index?: number | null;
  opportunity_reasoning?: string | null;
  trend_entry_strategy?: string | null;
  new_content_volume?: string | null;
  kr_evidence?: string | null;
  global_evidence?: string | null;
  growth_evidence?: string | null;
  kr_source_used?: string | null;
  growth_signal?: string | null;
  /* ----- Section 6 Export & Logistics Intel ----- */
  /** HS description text shown under hs_code */
  hs_description?: string | null;
  /** Hazmat JSONB status flags */
  hazmat_status?: Json | null;
  /** Dimensions in centimeters, e.g. "15 × 8 × 5" */
  dimensions_cm?: string | null;
  /** Billable weight (grams) used for shipping cost */
  billable_weight_g?: number | null;
  /** Shipping tier label, e.g. "Standard Parcel" */
  shipping_tier?: string | null;
  /** Comma-separated certificates, e.g. "FDA 510K, CE" */
  required_certificates?: string | null;
  /** Freeform logistics notes */
  shipping_notes?: string | null;
  sourcing_tip_logistics?: string | null;
  hazmat_summary?: string | null;
  can_oem?: boolean | null;
  /** Key risky ingredient to highlight */
  key_risk_ingredient?: string | null;
  /** Regulatory or status reasoning text */
  status_reason?: string | null;
  /** Actual physical weight (grams) */
  actual_weight_g?: number | null;
  /** Volumetric weight (grams) */
  volumetric_weight_g?: number | null;
  /* ----- Launch & Execution Kit / Section 6 신규 컬럼 ----- */
  /** Marketing assets (e.g. image pack, banner) URL */
  marketing_assets_url?: string | null;
  /** AI-generated detail/landing page links (URL or JSON array of URLs) */
  ai_detail_page_links?: string | null;
  /** When supplier pricing/contact was verified (ISO timestamp) */
  verified_at?: string | null;
  /** Sample order / sampling policy text */
  sample_policy?: string | null;
  /** Export or certification note for customs/compliance */
  export_cert_note?: string | null;
  /** Admin edit history log: { entries: [{ timestamp, changes: [{ field, before, after }] }] } */
  edit_history?: Json | null;
  composite_score?: number | null;
  go_verdict?: string | null;
}

export interface UserFavoritesRow {
  user_id: string;
  report_id: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: ProfilesRow; Insert: Omit<ProfilesRow, "created_at"> & { created_at?: string }; Update: Partial<ProfilesRow> };
      weeks: { Row: WeeksRow; Insert: Omit<WeeksRow, "product_count"> & { product_count?: number }; Update: Partial<WeeksRow> };
      scout_final_reports: { Row: ScoutFinalReportsRow; Insert: Omit<ScoutFinalReportsRow, "id" | "created_at"> & { id?: string; created_at?: string }; Update: Partial<ScoutFinalReportsRow> };
      user_favorites: { Row: UserFavoritesRow; Insert: Omit<UserFavoritesRow, "created_at"> & { created_at?: string }; Update: Partial<UserFavoritesRow> };
    };
  };
}

```

### `supabase/migrations/001_phase2_schema.sql`

```sql
-- =============================================================================
-- K-Product Scout — Phase 2: Database Schema, Triggers, and RLS
-- Run this script in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TABLE: profiles
-- User profile; extends Supabase Auth. One row per auth.users.id.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'standard', 'alpha')),
  ls_customer_id TEXT,
  ls_subscription_id TEXT,
  tier_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'User profile; tier updated by LemonSqueezy webhook';

-- -----------------------------------------------------------------------------
-- 2. TABLE: weeks
-- Weekly report batch. Data source for /weekly hub.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weeks (
  week_id TEXT PRIMARY KEY,
  week_label TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  published_at TIMESTAMPTZ,
  product_count INTEGER NOT NULL DEFAULT 0,
  summary TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
);

COMMENT ON TABLE public.weeks IS 'Weekly report batches for /weekly hub';

-- -----------------------------------------------------------------------------
-- 3. TABLE: scout_final_reports
-- Main product report table. One row = one product report.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.scout_final_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id TEXT NOT NULL REFERENCES public.weeks(week_id) ON DELETE CASCADE,
  -- Basic product info
  product_name TEXT NOT NULL,
  translated_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  ai_image_url TEXT,
  summary TEXT,
  consumer_insight TEXT,
  category TEXT NOT NULL,
  viability_reason TEXT NOT NULL,
  -- Market data
  market_viability INTEGER NOT NULL,
  competition_level TEXT NOT NULL,
  profit_multiplier NUMERIC NOT NULL,
  search_volume TEXT NOT NULL,
  mom_growth TEXT NOT NULL,
  gap_status TEXT NOT NULL,
  global_price JSONB,
  seo_keywords TEXT[],
  -- Sourcing & logistics
  export_status TEXT NOT NULL,
  hs_code TEXT,
  sourcing_tip TEXT,
  manufacturer_check TEXT,
  -- Manufacturer/contact (Alpha only)
  m_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  m_homepage TEXT,
  naver_link TEXT,
  -- Media (Alpha only)
  video_url TEXT,
  competitor_analysis_pdf TEXT,
  -- Access control
  published_at TIMESTAMPTZ,
  free_list_at TIMESTAMPTZ,
  is_premium BOOLEAN NOT NULL DEFAULT TRUE,
  is_teaser BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.scout_final_reports IS 'Product reports; access controlled by RLS and tier';

-- Optional: index for common filters
CREATE INDEX IF NOT EXISTS idx_scout_final_reports_week_id ON public.scout_final_reports(week_id);
CREATE INDEX IF NOT EXISTS idx_scout_final_reports_status ON public.scout_final_reports(status);
CREATE INDEX IF NOT EXISTS idx_scout_final_reports_free_list_at ON public.scout_final_reports(free_list_at) WHERE status = 'published';

-- -----------------------------------------------------------------------------
-- 4. TRIGGER: handle_new_user
-- Creates a profile row when a new user signs up (auth.users INSERT).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, tier)
  VALUES (NEW.id, NEW.email, 'free');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 5. TRIGGER: set_free_list_at
-- Sets free_list_at = published_at + 14 days on INSERT/UPDATE of published_at.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_free_list_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.published_at IS NOT NULL THEN
    NEW.free_list_at := NEW.published_at + INTERVAL '14 days';
  ELSE
    NEW.free_list_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_set_free_list_at ON public.scout_final_reports;
CREATE TRIGGER trigger_set_free_list_at
  BEFORE INSERT OR UPDATE OF published_at
  ON public.scout_final_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.set_free_list_at();

-- -----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scout_final_reports ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read and update their own row
CREATE POLICY "users_read_own_profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Weeks: only published weeks are visible
CREATE POLICY "weeks_public_read"
  ON public.weeks FOR SELECT
  USING (status = 'published');

-- Reports: tier-based row access (anon = free)
CREATE POLICY "report_access"
  ON public.scout_final_reports FOR SELECT
  USING (
    status = 'published'
    AND (
      -- Paid (Standard/Alpha): full access
      (SELECT tier FROM public.profiles WHERE id = auth.uid()) IN ('alpha', 'standard')
      -- Free (or anon when auth.uid() is null): 14-day delay + non-premium only
      OR (free_list_at IS NOT NULL AND free_list_at <= NOW() AND is_premium = FALSE)
      -- Teaser: everyone
      OR is_teaser = TRUE
    )
  );

-- -----------------------------------------------------------------------------
-- 7. SERVICE ROLE / BACKEND
-- Webhooks and admin need to write to profiles (e.g. tier updates).
-- Use the service_role key in API routes; it bypasses RLS.
-- No additional policies needed for app reads; anon key + RLS is sufficient.
-- -----------------------------------------------------------------------------

```

### `supabase/migrations/002_product_identity_pricing.sql`

```sql
-- =============================================================================
-- K-Product Scout — Product Identity / Pricing (Section 1 deep revision)
-- Adds: auto-calculated USD fields, verified cost (Alpha), trigger + backfill
-- =============================================================================

-- Auto-calculated price fields
ALTER TABLE scout_final_reports ADD COLUMN IF NOT EXISTS kr_price_usd NUMERIC;
ALTER TABLE scout_final_reports ADD COLUMN IF NOT EXISTS estimated_cost_usd NUMERIC;

-- Alpha verified pricing (manual input via Admin)
ALTER TABLE scout_final_reports ADD COLUMN IF NOT EXISTS verified_cost_usd TEXT;
ALTER TABLE scout_final_reports ADD COLUMN IF NOT EXISTS verified_cost_note TEXT;
ALTER TABLE scout_final_reports ADD COLUMN IF NOT EXISTS moq TEXT;
ALTER TABLE scout_final_reports ADD COLUMN IF NOT EXISTS lead_time TEXT;

-- Auto-calculate trigger: when kr_price changes, compute USD + estimated cost
CREATE OR REPLACE FUNCTION calculate_price_usd()
RETURNS TRIGGER AS $$
DECLARE
  exchange_rate NUMERIC := 1430; -- KRW per USD, update periodically
  kr_num NUMERIC;
BEGIN
  -- Parse kr_price (might be string like "16000")
  BEGIN
    kr_num := NEW.kr_price::NUMERIC;
  EXCEPTION WHEN OTHERS THEN
    kr_num := NULL;
  END;
  
  IF kr_num IS NOT NULL AND kr_num > 0 THEN
    NEW.kr_price_usd := ROUND(kr_num / exchange_rate, 2);
    NEW.estimated_cost_usd := ROUND((kr_num / exchange_rate) * 0.6, 2);
  ELSE
    NEW.kr_price_usd := NULL;
    NEW.estimated_cost_usd := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_calculate_price_usd ON scout_final_reports;
CREATE TRIGGER trigger_calculate_price_usd
  BEFORE INSERT OR UPDATE OF kr_price
  ON scout_final_reports
  FOR EACH ROW EXECUTE FUNCTION calculate_price_usd();

-- Backfill existing data
UPDATE scout_final_reports 
SET kr_price_usd = ROUND(kr_price::NUMERIC / 1430, 2),
    estimated_cost_usd = ROUND((kr_price::NUMERIC / 1430) * 0.6, 2)
WHERE kr_price IS NOT NULL AND kr_price ~ '^\d+$';

```

### `supabase/migrations/003_sync_from_live_audit.sql`

```sql
-- =============================================================================
-- K-Product Scout — 003: Sync from Live DB Audit (REFERENCE ONLY)
-- =============================================================================
-- ⚠️ DO NOT RUN THIS FILE ON THE LIVE SUPABASE PROJECT.
-- Purpose: Record schema/objects that exist (or are required) on the real DB
--          but were missing from 001/002. Use only when building a fresh DB
--          or when aligning a new environment to the live design.
-- Audit source: PROJECT_2DB_STATUS.md, types/database.ts, app/actions/favorites.ts,
--               lib/auth-server.ts, 04_ACCESS_CONTROL_LOGIC.md
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TABLE: user_favorites (missing in 001, 002)
-- Used by: app/actions/favorites.ts, app/account/page.tsx, app/weekly/[weekId]/page.tsx,
--          app/weekly/[weekId]/[id]/page.tsx. types/database.ts UserFavoritesRow.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_favorites (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id UUID NOT NULL REFERENCES public.scout_final_reports(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, report_id)
);

COMMENT ON TABLE public.user_favorites IS 'User favorite reports; RLS must restrict to auth.uid() = user_id';

CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_report_id ON public.user_favorites(report_id);

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_favorites_select"
  ON public.user_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_own_favorites_insert"
  ON public.user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_own_favorites_delete"
  ON public.user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 2. PROFILES: columns missing in 001 (used by lib/auth-server.ts, webhook, access logic)
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_start_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_reset_at TIMESTAMPTZ;
COMMENT ON COLUMN public.profiles.subscription_start_at IS 'When current subscription started; used for paid archive access';
COMMENT ON COLUMN public.profiles.subscription_reset_at IS 'Audit: when subscription was last reset (e.g. after cancel + resubscribe)';

-- -----------------------------------------------------------------------------
-- 3. SCOUT_FINAL_REPORTS: kr_price missing in 001 (002 trigger/backfill assume it exists)
-- -----------------------------------------------------------------------------
ALTER TABLE public.scout_final_reports ADD COLUMN IF NOT EXISTS kr_price TEXT;
COMMENT ON COLUMN public.scout_final_reports.kr_price IS 'Korean price string e.g. "12,000원"; drives kr_price_usd/estimated_cost_usd via trigger';

-- -----------------------------------------------------------------------------
-- 4. SCOUT_FINAL_REPORTS: status CHECK — 001 allows only draft|published|archived;
--    types/database.ts ReportStatus includes 'hidden'; admin UI may set hidden.
-- -----------------------------------------------------------------------------
ALTER TABLE public.scout_final_reports DROP CONSTRAINT IF EXISTS scout_final_reports_status_check;
ALTER TABLE public.scout_final_reports ADD CONSTRAINT scout_final_reports_status_check
  CHECK (status IN ('draft', 'published', 'archived', 'hidden'));

-- =============================================================================
-- End of 003_sync_from_live_audit.sql (reference only)
-- =============================================================================

```

---

## 4. Middleware & auth-server summary

- **middleware.ts**: For paths starting with `/admin`, checks cookie `process.env.ADMIN_COOKIE_NAME || "kps_admin_session"` === `"authenticated"`. If not `/admin/login` and cookie missing/invalid → redirect to `/admin/login`. Otherwise runs `updateSession` from `@/lib/supabase/middleware` (Supabase user session refresh for the rest of the app).
- **lib/auth-server.ts**: `getAuthTier()` uses **anon** Supabase server client + RLS; `maskReportByTier()` for public report views — **not** used for admin routes (admin uses service role + cookie).

---

## 5. Admin UI: editable vs read-only fields (`app/admin/[id]/page.tsx`)

### Read-only / display-only (not user-editable inputs)

- `id` — div
- `kr_price_usd`, `estimated_cost_usd` — computed (DB trigger); shown as read-only
- `go_verdict`, `composite_score` — shown read-only (labeled 자동); still listed in `formKeys` for diff if values ever differ from loaded state
- `gap_index` — auto from KR/Global scores
- `billable_weight_g` — auto from max(actual, volumetric)
- Edit History table — read-only display of `edit_history`

### Editable inputs (by control type)

- **Login** (`app/admin/login/page.tsx`): password `<input type="password">`; submit button.
- **List** (`app/admin/page.tsx`): week `<select>`, status `<select>` (All / Draft / Live); table rows navigate to edit; Logout button.
- **Edit page**: numerous `<input>`, `<textarea>`, `<select>` — see `formKeys` array (lines ~195–208) for fields included in save diff + PATCH payload (minus stripped keys). **GlobalPricesHelper**: per-region platform/price/url/sold-out/checkboxes + raw JSON read-only textarea. **HazmatCheckboxes**: 4 checkboxes. **AiPageLinksHelper**: up to 5 URL inputs. **Header**: status `<select>` (published/hidden), Save opens modal then Confirm.

---

## 6. `ScoutFinalReportsRow` fields vs admin coverage

### Fields in `types/database.ts` with **no** dedicated admin control (potential gap)

- `summary` — not in formKeys / no input
- `consumer_insight` — not in formKeys
- `global_price` (legacy JSONB) — admin edits `global_prices`; if legacy column still populated in DB, not surfaced
- `manufacturer_check` — not in admin
- `competitor_analysis_pdf` — not in admin
- `free_list_at` — trigger-driven from `published_at`; not directly editable
- `is_premium` — not in admin UI
- `is_teaser` — not in admin UI
- `sourcing_tip_logistics` — optional in types; not in formKeys
- `created_at` — stripped server-side from PATCH

### `edit_history`

- Not a direct form field; client **appends** an entry on each successful save and sends in PATCH.

---

## 7. Gaps & risks (admin / QC workflow)

### Fields in DB (or types) not editable in admin UI

- See section 6. Highest impact for QC: `is_premium`, `is_teaser`, `summary`, `consumer_insight`, teaser/paywall behavior cannot be toggled from this admin.

### Validation

- **PATCH** route does not whitelist fields; any JSON key in body (except stripped `id`, `created_at`, `kr_price_usd`, `estimated_cost_usd`) can be sent to Supabase — client-side form is honest, but API is permissive.
- Numeric fields (e.g. `market_viability` 0–100) are not server-validated.
- `export_status` options hardcoded Green/Yellow/Red; DB may allow other strings.

### Error handling

- List page: `fetch` failure or `!res.ok` leaves list empty with no error message.
- Edit page: load failure shows "Report not found." without HTTP detail.
- Save: only `!res.ok` → "Save failed"; no body parse for error message.

### QC workflow

- No admin UI for **weeks** (`weeks` table): cannot create/publish week batches from admin.
- No admin UI for **profiles** / subscriptions.
- No per-user admin audit (shared password; cookie value is static string).
- **Diff modal** compares `formKeys` only; fields not in `formKeys` never appear in diff.
- **Status**: list filter "Draft" = `status !== "published"` (includes `hidden`, `draft`, `archived` per types). "Live" = `published` only.
- **Logout** (`POST /api/admin/logout`): returns **redirect** response; client uses `fetch(..., redirect: "manual")` on list page — edit page has no logout button.

### Security notes (observational)

- Admin auth is single env password → httpOnly cookie value `authenticated` (not a signed JWT).
- Middleware only validates presence/value of cookie, not cryptographic session binding.

---

## 8. Every input / control by file (inventory)

### `app/admin/login/page.tsx`

| Control | Binds to |
|---------|----------|
| `<input type="password">` | local `password` state → POST `/api/admin/auth` |

### `app/admin/page.tsx`

| Control | Purpose |
|---------|---------|
| `<select>` week | `weekFilter` — client filter by `week_id` |
| `<select>` status | `statusFilter` — All / Draft (`!== published`) / Live (`=== published`) |
| Logout `<button>` | POST `/api/admin/logout` |
| Table row click / Edit link | navigate to `/admin/[id]` |

### `app/admin/[id]/page.tsx` — header

| Control | Field / behavior |
|---------|------------------|
| `<select id="admin-status-select">` | `status` — `published` vs `hidden`; sets `published_at` to now or null |
| Save Changes `<button>` | opens diff modal |
| Modal Cancel / Confirm | Confirm → PATCH with `formData` mutations |

### `app/admin/[id]/page.tsx` — form fields (editable unless noted)

Product Identity: `product_name`, `naver_product_name`, `translated_name`, `category`, `kr_price` (text input); `export_status` (select Green/Yellow/Red); `viability_reason` (textarea); `image_url`, `ai_image_url`, `naver_link`, `week_id`; read-only: `id`, `kr_price_usd`, `estimated_cost_usd`, `go_verdict`, `composite_score`.

Trend Signal: `market_viability` (number), `competition_level` (select), `wow_rate`, `mom_growth`, `growth_evidence`, `growth_signal`.

Market Intelligence: `profit_multiplier`, `top_selling_point`, `common_pain_point`, `new_content_volume`, `search_volume`, `best_platform`; `global_prices` via **GlobalPricesHelper** (not a single input).

Social Proof: `buzz_summary`, `kr_local_score`, `global_trend_score`, read-only `gap_index`; `kr_evidence`, `global_evidence`, `kr_source_used`, `gap_status`, `opportunity_reasoning`; `rising_keywords` ×5, `seo_keywords` ×5, `viral_hashtags` ×5 inputs; `platform_scores` (textarea JSON), `sourcing_tip`, `trend_entry_strategy`.

Export & Logistics: `hs_code`, `hs_description`, `status_reason`, `composition_info`, `spec_summary`, `actual_weight_g`, `volumetric_weight_g`, read-only `billable_weight_g`, `dimensions_cm`, **HazmatCheckboxes** → `hazmat_status`, `required_certificates`, `shipping_notes`, `shipping_tier`, `key_risk_ingredient`, `hazmat_summary`.

Launch & Execution: `m_name`, `corporate_scale`, `contact_email`, `contact_phone`, `m_homepage`, `wholesale_link`, `global_site_url`, `b2b_inquiry_url`, `can_oem` (select).

CEO zone: `verified_cost_usd`, `verified_cost_note`, `verified_at` (date input → partial ISO date string in state), `moq`, `lead_time`, `sample_policy`, `export_cert_note`, `viral_video_url`, `video_url`, `marketing_assets_url`; **AiPageLinksHelper** → `ai_detail_page_links`.

**Not rendered as inputs:** `summary`, `consumer_insight`, `manufacturer_check`, `competitor_analysis_pdf`, `global_price` (legacy), `is_premium`, `is_teaser`, `sourcing_tip_logistics`, `created_at` (readonly id display only). `published_at` is set indirectly via status select + save logic, not a dedicated datetime picker.

### `components/admin/GlobalPricesHelper.tsx`

Per listing: Platform (text), price USD (number), URL, Sold Out (checkbox); region expand buttons; optional read-only raw JSON `<textarea>`; Add listing / delete flows use buttons (not separate DB columns).

### `components/admin/HazmatCheckboxes.tsx`

Four checkboxes → JSON `hazmat_status`: `is_liquid`, `is_powder`, `is_battery`, `is_aerosol`.

### `components/admin/AiPageLinksHelper.tsx`

Up to 5 URL `<input>`s → JSON string array stored in `ai_detail_page_links`.



---

## 9. Related pages (grep "admin" — import `lib/supabase/admin`, not admin UI)

### `app/page.tsx`

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import LandingPipelineSneakPeek from "@/components/LandingPipelineSneakPeek";
import DynamiteFuseSection from "@/components/DynamiteFuseSection";
import IntelligencePipeline from "@/components/IntelligencePipeline";
import LandingTimeWidget from "@/components/LandingTimeWidget";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import CheckoutButton from "@/components/CheckoutButton";
import { PRICING } from "@/src/config/pricing";
import { Rocket, Handshake, ShieldCheck } from "lucide-react";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "KoreaScout — Korean Retail Intelligence Hub",
  description:
    "Weekly verified intelligence from Olive Young & Daiso. Stop chasing trends. Start scouting them.",
  openGraph: {
    title: "KoreaScout — Korean Retail Intelligence Hub",
    description: "Korea moves first. We tell you what moves.",
  },
};

const STANDARD_CHECKOUT_URL =
  "https://getkoreascout.lemonsqueezy.com/checkout/buy/e9701b40-aad3-446e-b00a-617d0159d501";
const ALPHA_CHECKOUT_URL =
  "https://getkoreascout.lemonsqueezy.com/checkout/buy/936321c8-fba1-4f88-bb30-8865c8006fac";
const ALPHA_MAX = 3000;

function UnlockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 5.9-5 4 4 0 0 1 4.1 4v1" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

async function getAlphaCount(): Promise<number> {
  try {
    const supabase = createServiceRoleClient();
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("tier", "alpha");
    if (error || count === null) return 0;
    return count;
  } catch {
    return 0;
  }
}

export default async function HomePage() {
  const alphaCount = await getAlphaCount();
  const remaining = Math.max(0, ALPHA_MAX - alphaCount);
  const isFull = alphaCount >= ALPHA_MAX;

  return (
    <>
      <main className="w-full min-h-screen bg-[#0A0908] text-white selection:bg-[#16A34A]/30 overflow-x-clip">

        {/* ══ S1: HERO ═══════════════════════════════════════════════════════════ */}
        <Hero />

        {/* ══ S1.5: PIPELINE SNEAK PEEK ═══════════════════════════════════════════ */}
        <LandingPipelineSneakPeek />

        {/* ══ S2.5: SOLDOUT SIGNAL ════════════════════════════════════ */}
        <section className="bg-[#0A0908] py-20 md:py-24 px-4 md:px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-20 items-center">
            {/* 좌측: 카피 */}
            <div className="w-full md:w-1/2 flex flex-col items-start">
              <h2
                className="font-black text-white mb-0"
                style={{
                  fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                }}
              >
                <span className="text-[#16A34A]">&ldquo;What&apos;s next?&rdquo;</span><br />
                We answer it before&nbsp;it sells out.
              </h2>
            </div>
            {/* 우측: 영상 */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-start">
              <div className="w-full max-w-[480px] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(22,163,74,0.15)]">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full rounded-2xl"
                  src="/videos/soldout.mp4"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══ S4: TIME WIDGET ═══════════════════════════ */}
        <LandingTimeWidget />

        {/* ══ S6: LAUNCH KIT — 섹션5 최종.png 100% 트윈 + Premium Interaction ═══════════════════ */}
        <section className="bg-[#0A0908] py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/50 text-center mb-4">
              LAUNCH KIT
            </p>
            <h2
              className="font-black text-center text-white mb-5"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                textWrap: "balance",
              } as React.CSSProperties}
            >
              We bridge the Korea Gap.
            </h2>
            <div className="text-center mb-16 space-y-1">
              <p className="text-base font-normal">
                <span className="text-white/50">Language barrier?</span>{" "}
                <span className="text-[#16A34A]">Eliminated.</span>
              </p>
              <p className="text-base font-normal">
                <span className="text-white/50">Next viral trend?</span>{" "}
                <span className="text-[#16A34A]">Pre-scouted.</span>
              </p>
              <p className="text-base font-normal">
                <span className="text-white/50">Sourcing & logistics?</span>{" "}
                <span className="text-[#16A34A]">Handled.</span>
              </p>
              <p className="text-base font-normal text-white">You just focus on growing.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  alpha: false,
                  badge: "Standard & Alpha",
                  q: "Is this the next viral hit?",
                  items: [
                    { text: "Gap Index & Opportunity Analysis", lock: false },
                    { text: "Cross-Platform Vitality (TikTok · IG · YT)", lock: false },
                    { text: "Social Buzz & Sentiment Analysis", lock: false },
                    { text: "Margin Potential Multiplier", lock: false },
                  ],
                  cta: "Answers the WHY.",
                  time: "SAVES 14 HRS",
                },
                {
                  alpha: true,
                  badge: "Alpha Exclusive",
                  q: "How do I buy it wholesale?",
                  items: [
                    { text: "Verified Factory Cost ($) & MOQ", lock: false },
                    { text: "Direct Supplier Contact Intel", lock: false },
                    { text: "Factory Sample Policy & Availability", lock: false },
                    { text: "Production & Lead Time Data", lock: false },
                  ],
                  cta: "Verified Korea Intel. Just hit send.",
                  time: "SAVES 21 HRS",
                },
                {
                  alpha: true,
                  badge: "Alpha Exclusive",
                  q: "Will customs flag this?",
                  items: [
                    { text: "HS Code Guidance (Standard 6-digit)", lock: false },
                    { text: "Compliance Requirement Analysis (MoCRA/CPNP)", lock: false },
                    { text: "Hazmat & Shipping Specifications", lock: false },
                    { text: "Technical Product Data Framework", lock: false },
                  ],
                  cta: "We give your broker a 90% head start.",
                  time: "SAVES 7 HRS",
                },
                {
                  alpha: false,
                  badge: "Standard & Alpha",
                  q: "How do I make it go viral?",
                  items: [
                    { text: "Viral Hashtag Strategy", lock: false },
                    { text: "Global SEO Actionable Keywords", lock: false },
                    { text: "Rising Korean Keywords (KR)", lock: false },
                    { text: "4K On-Site Sourcing Footage (Raw)", lock: true },
                  ],
                  cta: "Day 1 ready to launch.",
                  time: "SAVES 16 HRS",
                },
              ].map((card) => (
                <div
                  key={card.q}
                  className={`group rounded-2xl p-8 bg-[#1A1916] flex flex-col border border-white/10 hover:scale-[1.02] origin-center ${card.alpha ? "border-l-2 border-l-[#16A34A]" : ""}`}
                  style={{ transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)" } as React.CSSProperties}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex flex-col gap-2">
                      <span
                        className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full w-fit"
                        style={
                          card.alpha
                            ? { background: "rgb(22 163 74 / 0.12)", color: "#16A34A" }
                            : { background: "rgb(248 247 244 / 0.08)", color: "rgba(248,247,244,0.5)" }
                        }
                      >
                        {card.badge}
                      </span>
                      <p className="text-[20px] font-bold text-white leading-tight pr-2">&ldquo;{card.q}&rdquo;</p>
                    </div>
                    <div className="relative w-5 h-5 shrink-0 mt-1" aria-hidden>
                      <LockIcon className="absolute inset-0 w-5 h-5 text-[#16A34A] transition-opacity duration-500 group-hover:opacity-0" />
                      <UnlockIcon className="absolute inset-0 w-5 h-5 text-[#16A34A] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>
                  </div>
                  <ul className="space-y-2 flex-1">
                    {card.items.map((item) => (
                      <li
                        key={item.text}
                        className="flex items-center gap-2 text-sm font-medium text-white/45 transition-colors duration-500 group-hover:text-white"
                        style={{ transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)" }}
                      >
                        <span className="text-[#16A34A]/70 shrink-0 group-hover:text-[#16A34A] transition-colors duration-500">–</span>
                        {item.text}
                        {item.lock && (
                          <LockIcon className="w-3 h-3 text-[#16A34A]/60 shrink-0 ml-auto" />
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <p className="text-[14px] font-bold text-white">{card.cta}</p>
                    <p className="text-[13px] font-black text-[#16A34A] uppercase tracking-[0.2em]">
                      ⏱ {card.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10 text-center text-[19px] font-normal text-[#16A34A]">
              58 hours of manual research. Delivered in 1 second.
            </p>
          </div>
        </section>

        {/* ══ S6: THE INTELLIGENCE PIPELINE (Scout Engine) ═══════════════════════════════ */}
        <IntelligencePipeline />

        {/* ══ S7: INTELLIGENCE ENGINE (섹션4 최종.png — 100% clone) ════════════════════════════ */}
        <section className="bg-[#0A0908] py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <h2
              className="font-black text-center text-white mb-3"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                textWrap: "balance",
              } as React.CSSProperties}
            >
              Not a trend list.
              <br />
              A 6-layer intelligence brief —
            </h2>
            <p className="text-center text-white/60 font-medium mb-16 leading-relaxed max-w-2xl mx-auto" style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)" }}>
              Battle-tested in Korea. What takes you 58 hours, takes our engine 4 minutes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-[0.45fr_0.55fr] gap-12 items-stretch">
              {/* Left: 6-layer list — fill height, justify-between so 01/06 align with card top/bottom */}
              <div className="flex flex-col justify-between min-h-0 h-full">
                {[
                  {
                    n: "01",
                    t: "Gap Index",
                    d: "KR Local Score vs. Global Trend Score — calculated as a single integer gap. Gap 54 means the world hasn't caught up yet. That's your window.",
                    s: "6 HRS",
                  },
                  {
                    n: "02",
                    t: "Margin Intelligence",
                    d: "Verified cost vs. global retail price → profit multiplier. You see the real upside before you commit a single dollar.",
                    s: "4 HRS",
                  },
                  {
                    n: "03",
                    t: "Trend Signals",
                    d: "TikTok, Instagram velocity scores + new content volume growth signal. You see what's accelerating before it reaches your feed.",
                    s: "8 HRS",
                  },
                  {
                    n: "04",
                    t: "Export Guard (Intelligence Estimate †)",
                    d: "HS Code, Hazmat status, required certificates, package dimensions. Gives your customs broker a 90% head start. Not a legal guarantee.",
                    s: "7 HRS",
                  },
                  {
                    n: "05",
                    t: "Direct Supplier Access",
                    d: "Verified manufacturer name, MOQ, and direct contact email. Our Seoul team checks it. Not scraped. Human-verified.",
                    s: "12 HRS",
                  },
                  {
                    n: "06",
                    t: "Launch Kit",
                    d: "4K On-Site Sourcing Footage (Raw), SEO keywords, broker email draft. Day 1 ready to launch and scale.",
                    s: "16+ HRS",
                  },
                ].map((layer) => (
                  <div key={layer.n} className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full border-2 border-[#16A34A] flex items-center justify-center bg-transparent">
                      <span className="text-[10px] font-black text-white">{layer.n}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">{layer.t}</p>
                      <p className="text-xs font-medium text-white/50 leading-relaxed mb-1">{layer.d}</p>
                      <p className="text-[10px] font-black text-[#16A34A] uppercase tracking-[0.2em]">⏱ SAVES {layer.s}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Market Intelligence Brief card — 55%, high rounded corners, h-full for height match */}
              <div className="bg-[#1A1916] rounded-3xl overflow-hidden border border-white/5 shadow-xl flex flex-col min-h-0 h-full">
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16A34A]">MARKET INTELLIGENCE BRIEF</p>
                      <p className="text-xs text-white/50 mt-1">Source: Olive Young · Daiso</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.2em] bg-[#16A34A] text-white px-3 py-1.5 rounded-full">ALPHA</span>
                  </div>

                  {/* Metrics row — font-black (900) */}
                  <div className="border-t border-white/10 pt-5 pb-5">
                    <div className="flex flex-wrap gap-6 gap-y-2">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-white/50">Market Score</p>
                        <p className="text-lg font-black text-white">91 / 100 ↑</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-white/50">Gap Index</p>
                        <p className="text-lg font-black text-white">54</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-white/50">Margin</p>
                        <p className="text-lg font-black text-white">3.8x</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-[#16A34A]">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16A34A] align-middle mr-1.5" aria-hidden /> COMPETITION: MODERATE ✓
                    </p>
                  </div>

                  {/* Standard Access — green open lock (#16A34A), verbatim 4 items */}
                  <div className="border-t border-white/10 pt-5 pb-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Standard Access</p>
                    <ul className="space-y-2">
                      {[
                        "Gap Index Score & Opportunity Reasoning",
                        "Profit Multiplier & Factory Unit Price (USD)",
                        "TikTok / IG Velocity & Buzz Summary",
                        "SEO, Viral & Rising Keywords",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-white">
                          <UnlockIcon className="shrink-0 text-[#16A34A] w-4 h-4" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Alpha Only — same green open lock (#16A34A), same bright text as Standard */}
                  <div className="border-t border-white/10 pt-5 pb-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Alpha Only — Execution Layer</p>
                    <ul className="space-y-2">
                      {[
                        "HS Code (6-digit) & Hazmat Assessment",
                        "Custom Broker Email Draft (English Template)",
                        "Verified MOQ & Factory Price (EXW)",
                        "Verified Direct Sourcing Intel",
                        "4K On-Site Sourcing Footage (Raw)",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-white">
                          <UnlockIcon className="shrink-0 text-[#16A34A] w-4 h-4" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-white/40 italic">More details available on Pricing page</p>
                  </div>

                  {/* Footer — white regular centered, button with glow, disclaimer bottom-most */}
                  <div className="border-t border-white/10 pt-5 mt-auto">
                    <p className="text-sm font-normal text-white text-center mb-4">Unlock to access 30+ verified products immediately.</p>
                    <div className="flex justify-center">
                      <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#16A34A] px-5 py-3 text-sm font-black text-white hover:bg-[#15803D] transition-colors duration-200 shadow-[0_0_25px_rgba(22,163,74,0.4)]"
                      >
                        View Pricing & Access →
                      </Link>
                    </div>
                    <p className="text-[10px] text-white/40 text-center mt-4">† Pre-verified intelligence estimates. Not a legal guarantee.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ S8: PRICING (3-tier from pricing page, v5 copy) ═══════════════════════════════════ */}
        <section id="pricing-cards" className="bg-white py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#9E9C98] text-center mb-4">
              Pricing
            </p>
            <h2
              className="font-black text-[#1A1916] text-center mb-4"
              style={{
                fontSize: "clamp(1.75rem, 4.5vw, 3.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
              } as React.CSSProperties}
            >
              For less than <span className="text-[#16A34A]">{PRICING.CURRENCY}{PRICING.ALPHA.daily.toFixed(2)}</span> a day.
            </h2>
            <p
              className="text-sm text-center mb-16"
              style={{ color: "rgba(10,9,8,0.4)" }}
            >
              Hire your dedicated Korea-based intelligence team.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* FREE */}
              <div className="bg-white border border-[#E8E6E1] rounded-2xl flex flex-col h-full p-8 md:p-12">
                <div className="min-h-[100px]">
                  <p className="text-3xl md:text-4xl font-black text-[#1A1916] tracking-tighter leading-none mb-8">
                    Scout Free
                  </p>
                  <div className="mb-1">
                    <span className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                      {PRICING.CURRENCY}{PRICING.FREE.monthly}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-1">
                    Forever Free
                  </p>
                </div>
                <div className="w-8 h-px bg-[#E8E6E1] my-5" />
                <div className="bg-[#F8F7F4] border border-[#E8E6E1] rounded-xl px-4 py-3 min-h-[120px] flex items-center">
                  <p className="text-sm text-[#1A1916] leading-relaxed">
                    <span className="font-black uppercase">INSTANT ACCESS:</span>{" "}
                    <span className="font-medium">10+ products unlocked immediately. (1 week · 14-day delay)</span>
                  </p>
                </div>
                <div className="flex-grow my-8">
                  <p className="text-base font-medium text-[#6B6860] leading-relaxed">
                    See what KoreaScout finds. Before you commit.
                  </p>
                </div>
                <div className="mt-auto">
                  <a
                    href="/signup"
                    className="block w-full text-center py-3 rounded-xl border-2 border-[#1A1916] text-sm font-black text-[#1A1916] hover:bg-[#1A1916] hover:text-white transition-all duration-200"
                  >
                    Unlock Free Intelligence
                  </a>
                  <p className="text-xs text-[#9E9C98] text-center mt-3">
                    10+ products · 1 week unlocked · 14-day delay
                  </p>
                </div>
              </div>

              {/* STANDARD — v5 copy */}
              <div className="bg-white border border-[#E8E6E1] rounded-2xl flex flex-col h-full p-8 md:p-12 shadow-[0_4px_20px_0_rgb(26_25_22/0.08)]">
                <div className="min-h-[100px]">
                  <p className="text-3xl md:text-4xl font-black text-[#1A1916] tracking-tighter leading-none mb-8">
                    Standard
                  </p>
                  <div className="mb-1">
                    <span className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                      {PRICING.CURRENCY}{PRICING.STANDARD.monthly}
                    </span>
                    <span className="text-base text-[#9E9C98] font-medium ml-2">/ month</span>
                  </div>
                  <p className="text-xs font-bold text-[#9E9C98] mb-1">
                    Approx. {PRICING.CURRENCY}{PRICING.STANDARD.daily.toFixed(2)} / day
                  </p>
                </div>
                <div className="w-8 h-px bg-[#E8E6E1] my-5" />
                <div className="bg-[#F8F7F4] border border-[#E8E6E1] rounded-xl px-4 py-3 min-h-[120px] flex items-center">
                  <p className="text-sm text-[#1A1916] leading-relaxed">
                    <span className="font-black uppercase">INSTANT ACCESS:</span>{" "}
                    <span className="font-medium">30+ Verified Products (Last 3 weeks) unlocked immediately.</span>
                  </p>
                </div>
                <div className="flex-grow my-8">
                  <p className="text-base font-medium text-[#6B6860] leading-relaxed">
                    Know WHAT survived Korea&apos;s market. {PRICING.CURRENCY}{PRICING.STANDARD.daily.toFixed(2)}/day — less than your morning coffee,
                    more valuable than 14 hours of research.
                  </p>
                </div>
                <div className="mt-auto">
                  <CheckoutButton
                    checkoutUrl={STANDARD_CHECKOUT_URL}
                    className="block w-full text-center py-3 rounded-xl border-2 border-[#1A1916] text-sm font-black text-[#1A1916] hover:bg-[#1A1916] hover:text-white transition-all duration-200"
                  >
                    Start Knowing — {PRICING.CURRENCY}{PRICING.STANDARD.monthly}/mo
                  </CheckoutButton>
                  <p className="text-xs text-[#9E9C98] text-center mt-3">
                    10+ products/week · Instant access
                  </p>
                </div>
              </div>

              {/* ALPHA — v5 copy, URL 41bb4d4b */}
              <div
                className="bg-[#F8F7F4] border border-[#E8E6E1] border-l-4 border-l-[#16A34A] rounded-2xl flex flex-col h-full p-8 md:p-12 shadow-[0_4px_20px_0_rgb(22_163_74/0.1)]"
                style={{ transform: "scale(1.03)", transformOrigin: "center" }}
              >
                <div className="min-h-[100px]">
                  <div className="flex items-center justify-between mb-8">
                    <p className="text-3xl md:text-4xl font-black text-[#16A34A] tracking-tighter leading-none">
                      Alpha
                    </p>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#16A34A]/10 border border-[#16A34A]/20 rounded-full">
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16A34A] shadow-[0_0_8px_1px_rgba(22,163,74,0.8)]" />
                      </span>
                      <span className="text-xs md:text-sm font-black text-[#16A34A] tracking-widest uppercase">
                        {alphaCount.toLocaleString()} / 3,000
                      </span>
                    </div>
                  </div>
                  <div className="mb-1">
                    <span className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                      {PRICING.CURRENCY}{PRICING.ALPHA.monthly}
                    </span>
                    <span className="text-base text-[#9E9C98] font-medium ml-2">/ month</span>
                  </div>
                  <p className="text-xs font-bold text-[#16A34A] mb-1">
                    Approx. {PRICING.CURRENCY}{PRICING.ALPHA.daily.toFixed(2)} / day
                  </p>
                </div>
                <div className="w-8 h-px bg-[#E8E6E1] my-5" />
                <div className="bg-white border border-[#16A34A] rounded-xl px-4 py-3 min-h-[120px] flex items-center">
                  <p className="text-sm text-[#1A1916] leading-relaxed">
                    <span className="font-black uppercase">FULL-SPECTRUM ACCESS:</span>{" "}
                    <span className="font-medium">30+ Premium Assets (Last 3 Weeks) Unlocked Immediately, Plus Direct HQ Contacts.</span>
                  </p>
                </div>
                <div className="flex-grow my-8">
                  <p className="text-base font-medium text-[#6B6860] leading-relaxed">
                    Know HOW to bring it to your market. {PRICING.CURRENCY}{PRICING.ALPHA.daily.toFixed(2)}/day. Your Seoul-based sourcing team —
                    58 hours of work. 60 seconds to receive.
                  </p>
                  {!isFull && (
                    <p className="mt-4 text-xs font-bold text-[#16A34A]">
                      EXCLUSIVE: Limited to {ALPHA_MAX.toLocaleString()} Global Membership Spots (
                      {remaining.toLocaleString()} remaining)
                    </p>
                  )}
                </div>
                <div className="mt-auto">
                  {isFull ? (
                    <a
                      href="/waitlist"
                      className="block w-full text-center py-3 rounded-xl bg-[#1A1916] text-white text-sm font-black hover:bg-[#2D2B26] transition-colors duration-200"
                    >
                      Join the Waiting List
                    </a>
                  ) : (
                    <CheckoutButton
                      checkoutUrl={ALPHA_CHECKOUT_URL}
                      className="block w-full text-center py-3 rounded-xl bg-[#16A34A] text-white text-sm font-black hover:bg-[#15803D] transition-colors duration-200 shadow-[0_4px_12px_0_rgb(22_163_74/0.3)]"
                    >
                      Go Alpha — {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo
                    </CheckoutButton>
                  )}
                  <p className="text-xs text-[#9E9C98] text-center mt-3">
                    10+ products/week · Full sourcing intel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ S8b: INSTITUTIONAL POLICY (Alpha Moat) — synced from pricing page ═══════════════ */}
        <section className="bg-[#1A1916] py-20 px-6">
          <div className="max-w-3xl mx-auto border border-white/10 rounded-2xl p-10">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#16A34A] mb-6">
              Institutional Policy
            </p>
            <h3
              className="font-black text-white leading-tight tracking-tighter mb-6"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
            >
              Why only 3,000 members?
            </h3>
            <p className="text-lg text-white/60 font-medium leading-relaxed">
              With over 50 million global sellers competing for the same demand, trend saturation is a certainty. Information loses its edge when everyone has it.
              <br /><br />
              By capping Alpha at exactly 3,000 spots—representing the top 0.006% of the global market—we mathematically minimize competition and protect your exclusive profit margins. We provide the verified intelligence. The execution is yours.
              <br /><br />
              We don&apos;t just find trends —{" "}
              <span className="text-white font-semibold">we protect your opportunity.</span>
            </p>
            {!isFull && (
              <div className="mt-8 flex items-center gap-3">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#16A34A] shadow-[0_0_10px_2px_rgba(22,163,74,0.9)]" />
                </span>
                <p className="text-xl md:text-2xl font-black text-[#16A34A]">
                  {remaining.toLocaleString()} of {ALPHA_MAX.toLocaleString()} spots remaining
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ══ S2: THE INTELLIGENCE GAP — Dynamite Fuse + Bottom Copy ═══════════════════ */}
        <DynamiteFuseSection />

        {/* ══ S9: TRUST + FOUNDER + FAQ + READY TO SCOUT (single bg #F8F7F4, no gap) ═══════════════════════════ */}
        <section className="bg-[#F8F7F4] pt-24 pb-24 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Trust & Moat — Headlines */}
            <h2
              className="font-black text-[#1A1916] text-center mb-4"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                textWrap: "balance",
              } as React.CSSProperties}
            >
              A perfect division of labor.
            </h2>
            <p className="text-base md:text-lg text-center text-[#6B6860] max-w-2xl mx-auto mb-16 leading-relaxed">
              We find the gold in Seoul. You take it to the global stage.
            </p>

            {/* 3-Column Trust & Moat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8E6E1]">
                <Rocket className="text-[#16A34A] w-8 h-8 mb-4" aria-hidden />
                <h3 className="text-lg font-bold text-[#1A1916] mb-3">The &quot;Korea&apos;s Amazon&quot; DNA.</h3>
                <p className="text-base text-[#6B6860] leading-relaxed">
                  Built by a former operator at Coupang (Korea&apos;s Amazon). We bring the fastest e-commerce market&apos;s execution speed and local vendor network directly to your sourcing pipeline.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8E6E1]">
                <ShieldCheck className="text-[#16A34A] w-8 h-8 mb-4" aria-hidden />
                <h3 className="text-lg font-bold text-[#1A1916] mb-3">AI Scouted. Human Curated.</h3>
                <p className="text-base text-[#6B6860] leading-relaxed">
                  Operated by KoreaScout in Korea. While our AI engine monitors Korea&apos;s fastest-moving platforms, our human operators filter out the noise. You get 100% verified intelligence, ready for scaling.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8E6E1]">
                <Handshake className="text-[#16A34A] w-8 h-8 mb-4" aria-hidden />
                <h3 className="text-lg font-bold text-[#1A1916] mb-3">We search. You scale.</h3>
                <p className="text-base text-[#6B6860] leading-relaxed">
                  We are your boots on the ground in Korea. You are the global scaling expert. A perfect synergy for less than <span className="text-[#16A34A] font-bold">{PRICING.CURRENCY}{PRICING.ALPHA.daily.toFixed(2)}</span> a day.
                </p>
              </div>
            </div>

            {/* Founder's Note — same container width, cream flow */}
            <div className="mt-12">
              <div className="bg-[#2A2824] rounded-3xl p-12 md:p-16 border border-white/5">
                <h2 className="text-[10px] font-bold text-[#F8F7F4]/30 uppercase tracking-[0.3em] mb-8">
                  Founder&apos;s Note
                </h2>
                <div className="border-l-2 border-[#16A34A] pl-6 md:pl-10">
                  <div className="space-y-8 text-lg md:text-xl text-[#F8F7F4]/60 leading-relaxed tracking-tight font-sans font-medium">
                    <p>
                      &ldquo;Since April 2025, we&apos;ve been quietly building the foundation for KoreaScout. We engineered our own AI system with one clear mission: to decode Korea&apos;s hyper-fast trends for the rest of the world.&rdquo;
                    </p>
                    <p>
                      &ldquo;Our philosophy is a perfect division of labor. We will relentlessly hunt down the best export-ready products in Seoul. You focus 100% on what you do best—scaling and dominating the global market.&rdquo;
                    </p>
                    <p>
                      &ldquo;KoreaScout is a living startup. We will never stop evolving, and our intelligence will continuously update. Focus on selling. We&apos;ve got the scouting covered.&rdquo;
                    </p>
                  </div>
                  <p className="mt-10 text-right text-[#F8F7F4]/40 text-sm font-bold">
                    — KoreaScout · Korea
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ — Category accordion (compact), no border for background continuity */}
          <div className="max-w-6xl mx-auto pt-16 pb-0 px-6 border-0">
            <h2 className="text-5xl font-black text-black mb-8">
              Frequently Asked
            </h2>
            <FaqAccordion />
          </div>

          {/* Ready to Scout CTA — same section, no gap (no black band) */}
          <div className="max-w-6xl mx-auto pt-0 pb-0 text-center overflow-x-clip border-0">
            <h2
              className="font-black text-[#1A1916] mt-6 mb-6"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                textWrap: "balance",
              } as React.CSSProperties}
            >
              Ready to Scout?
            </h2>
            <p className="text-base md:text-lg font-medium text-[#6B6860] leading-relaxed mb-4 max-w-xl mx-auto">
              The market moves while you hesitate.
            </p>
            <p className="text-base md:text-lg font-medium text-[#6B6860] leading-relaxed mb-10 max-w-xl mx-auto">
              Secure your intelligence before the 3,000 spots are gone.
            </p>

            {!isFull && (
              <div className="flex items-center justify-center gap-2 mb-10">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
                <p className="text-base font-black text-[#16A34A]">
                  {remaining.toLocaleString()} of {ALPHA_MAX.toLocaleString()} Alpha spots remaining
                </p>
              </div>
            )}

            <div className="flex flex-col items-center mb-4">
              <a
                href="#pricing-cards"
                className="w-full max-w-md px-12 py-5 rounded-xl font-black text-lg text-white bg-[#16A34A] hover:bg-[#15803D] transition-colors duration-200 shadow-[0_4px_20px_0_rgb(22_163_74/0.4)] text-center"
              >
                Get Exclusive Access Now
              </a>
              <p className="text-xs text-[#9E9C98] font-medium mt-4">
                No contracts · Cancel anytime · Instant access
              </p>
            </div>
          </div>
        </section>

        {/* Footer — Cream Shutter (Constitution) */}
        <footer className="bg-[#F8F7F4] border-t border-[#E8E6E1] py-10 px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-start">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-[#9E9C98]">© 2026 KoreaScout. All rights reserved.</p>
              <p className="text-xs text-[#9E9C98]">KoreaScout | CEO: Haengbok Jwa | Biz Reg No.: 640-22-02088</p>
              <p className="text-xs text-[#9E9C98]">E-commerce License No.: 2026-용인처인-00830</p>
              <p className="text-xs text-[#9E9C98]">Dream Biz Tech, 1391 Jungbu-daero, 2F D240, Yongin-si, Gyeonggi-do, Korea</p>
              <p className="text-xs text-[#9E9C98]">support@koreascout.com</p>
              <div className="flex gap-4 pt-1">
                <a href="/legal/terms" className="text-xs text-[#9E9C98] hover:text-[#0A0908] transition-colors">Terms of Service</a>
                <a href="/legal/privacy" className="text-xs text-[#9E9C98] hover:text-[#0A0908] transition-colors">Privacy Policy</a>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-6">
              <Link
                href="/pricing"
                className="text-sm font-medium text-[#0A0908] transition-colors duration-200 hover:text-[#16A34A]"
              >
                Pricing
              </Link>
              <Link
                href="/sample-report"
                className="text-sm font-medium text-[#0A0908] transition-colors duration-200 hover:text-[#16A34A]"
              >
                Sample Report
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-[#0A0908] transition-colors duration-200 hover:text-[#16A34A]"
              >
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

```

### `app/pricing/page.tsx`

```tsx
import type { Metadata } from "next";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { PRICING } from "@/src/config/pricing";
import CheckoutButton from "@/components/CheckoutButton";

export const metadata: Metadata = {
  title: "Pricing — KoreaScout",
  description: `Compare Free, Standard ${PRICING.CURRENCY}${PRICING.STANDARD.monthly}, and Alpha ${PRICING.CURRENCY}${PRICING.ALPHA.monthly}. Choose your intelligence level.`,
};

const STANDARD_CHECKOUT_URL =
  "https://getkoreascout.lemonsqueezy.com/checkout/buy/e9701b40-aad3-446e-b00a-617d0159d501";
const ALPHA_CHECKOUT_URL =
  "https://getkoreascout.lemonsqueezy.com/checkout/buy/936321c8-fba1-4f88-bb30-8865c8006fac";
const ALPHA_MAX_SPOTS = 3000;

async function getAlphaMemberCount(): Promise<number> {
  try {
    const supabase = createServiceRoleClient();
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("tier", "alpha");
    if (error || count === null) return 0;
    return count;
  } catch {
    return 0;
  }
}

type FeatureRow = {
  feature: string;
  free: string;
  standard: string;
  alpha: string;
};
type FeatureGroup = {
  label: string;
  rows: FeatureRow[];
};

const FEATURE_GROUPS: FeatureGroup[] = [
  {
    label: "Product Identity",
    rows: [
      { feature: "Product Profile & Selective Tier Badges", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Strategic Viability & Trend Insights", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Real-time Retail Price & FX Tracker", free: "✓", standard: "✓", alpha: "✓" },
    ],
  },
  {
    label: "Trend Signal Dashboard",
    rows: [
      { feature: "Proprietary Market Score", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Competition Level Indicator", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Opportunity Status", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Real-time Growth Momentum", free: "✓", standard: "✓", alpha: "✓" },
      { feature: "Cross-Platform Vitality (TikTok, IG, YT)", free: "✓", standard: "✓", alpha: "✓" },
    ],
  },
  {
    label: "Market Intelligence",
    rows: [
      { feature: "Global Market Availability (6 Regions)", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Search Volume & Growth (MoM/WoW)", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Margin Potential Multiplier", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Strategic Valuation & Global Price Benchmarks", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Analyst Brief (Edge & Risk Factors)", free: "—", standard: "✓", alpha: "✓" },
    ],
  },
  {
    label: "Social Proof & Trend Intelligence",
    rows: [
      { feature: "Korea Gap Index™", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Social Buzz & Sentiment Analysis", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Rising Korean Keywords (KR)", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Global SEO Actionable Keywords", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Viral Hashtag Strategy", free: "—", standard: "✓", alpha: "✓" },
      { feature: "Scout Strategy Report", free: "—", standard: "—", alpha: "✓" },
    ],
  },
  {
    label: "Export & Logistics Intelligence",
    rows: [
      { feature: "Export Readiness & Market Moat", free: "—", standard: "—", alpha: "✓" },
      { feature: "Required Certifications (FDA, CPNP, etc.)", free: "—", standard: "—", alpha: "✓" },
      { feature: "Hazmat Status & Full Ingredient List", free: "—", standard: "—", alpha: "✓" },
      { feature: "Logistics Dashboard (Actual / Vol / Billable Weight)", free: "—", standard: "—", alpha: "✓" },
      { feature: "Shipping Notes & Carrier Strategy", free: "—", standard: "—", alpha: "✓" },
      { feature: "HS Code & Broker Email Draft", free: "—", standard: "—", alpha: "✓" },
      { feature: "Compliance & Logistics Strategy", free: "—", standard: "—", alpha: "✓" },
    ],
  },
  {
    label: "Launch & Execution Kit",
    rows: [
      { feature: "Verified Cost Per Unit & MOQ", free: "—", standard: "—", alpha: "✓" },
      { feature: "Est. Production Lead Time", free: "—", standard: "—", alpha: "✓" },
      { feature: "Sample Policy & Distribution Rights", free: "—", standard: "—", alpha: "✓" },
      { feature: "Supplier Contact (Email, Phone, Web)", free: "—", standard: "—", alpha: "✓" },
      { feature: "Direct Wholesale Portal Link", free: "—", standard: "—", alpha: "✓" },
      { feature: "Global Market Proof Links", free: "—", standard: "—", alpha: "✓" },
      { feature: "Viral Hook Reference (Success Cases)", free: "—", standard: "—", alpha: "✓" },
      { feature: "4K On-Site Sourcing Footage (Raw)", free: "—", standard: "—", alpha: "✓" },
    ],
  },
];

export default async function PricingPage() {
  const alphaCount = await getAlphaMemberCount();
  const isMembershipFull = alphaCount >= ALPHA_MAX_SPOTS;
  const remainingSpots = Math.max(0, ALPHA_MAX_SPOTS - alphaCount);

  return (
    <>
      {/* S1: DARK HERO */}
      <section className="bg-[#1A1916] py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center text-center w-full mb-12 px-4 md:px-8">
            <p className="text-xs font-bold tracking-[0.08em] uppercase text-[#16A34A] mb-6">
              THE GLOBAL STANDARD FOR KOREAN PRODUCT INTELLIGENCE
            </p>
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] flex flex-col items-center text-center max-w-full">
              <span className="text-[#F8F7F4] block max-w-full">The Price of Knowing Early.</span>
              <span className="text-[#16A34A] block max-w-full">The Cost of Finding Out Late.</span>
            </h1>
          </div>
          <p className="text-sm md:text-base text-white/50 font-medium leading-relaxed max-w-2xl mx-auto px-4">
            Weekly verified intelligence on Korea&apos;s fastest-moving products —
            before your competitors find them.
          </p>
        </div>
      </section>

      {/* S2: 3-TIER CARDS */}
      <section id="pricing-cards" className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-black text-[#1A1916] text-center mb-4"
            style={{
              fontSize: "clamp(1.75rem, 4.5vw, 3.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
            } as React.CSSProperties}
          >
            For less than <span className="text-[#16A34A]">{PRICING.CURRENCY}{PRICING.ALPHA.daily.toFixed(2)}</span> a day.
          </h2>
          <p
            className="text-sm text-center mb-16"
            style={{ color: "rgba(10,9,8,0.4)" }}
          >
            Hire your dedicated Korea-based intelligence team.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* FREE */}
            <div className="bg-white border border-[#E8E6E1] rounded-2xl flex flex-col h-full p-8 md:p-12">
              <div className="min-h-[100px]">
                <p className="text-3xl md:text-4xl font-black text-[#1A1916] tracking-tighter leading-none mb-8">
                  Scout Free
                </p>
                <div className="mb-1">
                  <span className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                    {PRICING.CURRENCY}{PRICING.FREE.monthly}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-1">
                  Forever Free
                </p>
              </div>
              <div className="w-8 h-px bg-[#E8E6E1] my-5" />
              <div className="bg-[#F8F7F4] border border-[#E8E6E1] rounded-xl px-4 py-3 min-h-[120px] flex items-center">
                <p className="text-sm text-[#1A1916] leading-relaxed">
                  <span className="font-black uppercase">INSTANT ACCESS:</span>{" "}
                  <span className="font-medium">10+ products unlocked immediately. (1 week · 14-day delay)</span>
                </p>
              </div>
              <div className="flex-grow my-8">
                <p className="text-base font-medium text-[#6B6860] leading-relaxed">
                  See what KoreaScout finds.
                  Before you commit.
                </p>
              </div>
              <div className="mt-auto">
                <a
                  href="/signup"
                  className="block w-full text-center py-3 rounded-xl border-2 border-[#1A1916] text-sm font-black text-[#1A1916] hover:bg-[#1A1916] hover:text-white transition-all"
                >
                  Unlock Free Intelligence
                </a>
                <p className="text-xs text-[#9E9C98] text-center mt-3">
                  10+ products · 1 week unlocked · 14-day delay
                </p>
              </div>
            </div>

            {/* STANDARD */}
            <div className="bg-white border border-[#E8E6E1] rounded-2xl flex flex-col h-full p-8 md:p-12 shadow-[0_4px_20px_0_rgb(26_25_22/0.08)]">
              <div className="min-h-[100px]">
                <p className="text-3xl md:text-4xl font-black text-[#1A1916] tracking-tighter leading-none mb-8">
                  Standard
                </p>
                <div className="mb-1">
                  <span className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                    {PRICING.CURRENCY}{PRICING.STANDARD.monthly}
                  </span>
                  <span className="text-base text-[#9E9C98] font-medium ml-2">/ month</span>
                </div>
                <p className="text-xs font-bold text-[#9E9C98] mb-1">
                  Approx. {PRICING.CURRENCY}{PRICING.STANDARD.daily.toFixed(2)} / day
                </p>
              </div>
              <div className="w-8 h-px bg-[#E8E6E1] my-5" />
              <div className="bg-[#F8F7F4] border border-[#E8E6E1] rounded-xl px-4 py-3 min-h-[120px] flex items-center">
                <p className="text-sm text-[#1A1916] leading-relaxed">
                  <span className="font-black uppercase">INSTANT ACCESS:</span>{" "}
                  <span className="font-medium">30+ Verified Products (Last 3 weeks) unlocked immediately.</span>
                </p>
              </div>
              <div className="flex-grow my-8">
                <p className="text-base font-medium text-[#6B6860] leading-relaxed">
                  The market intelligence engine
                  for serious global sellers.
                  Know what Korea is trending —
                  and exactly why it will sell.
                </p>
              </div>
              <div className="mt-auto">
                <CheckoutButton
                  checkoutUrl={STANDARD_CHECKOUT_URL}
                  className="block w-full text-center py-3 rounded-xl border-2 border-[#1A1916] text-sm font-black text-[#1A1916] hover:bg-[#1A1916] hover:text-white transition-all"
                >
                  Start Knowing — {PRICING.CURRENCY}{PRICING.STANDARD.monthly}/mo
                </CheckoutButton>
                <p className="text-xs text-[#9E9C98] text-center mt-3">
                  30+ products · Last 3 weeks · Instant access
                </p>
              </div>
            </div>

            {/* ALPHA */}
            <div
              className="bg-[#F8F7F4] border border-[#E8E6E1] border-l-4 border-l-[#16A34A] rounded-2xl flex flex-col h-full p-8 md:p-12 shadow-[0_4px_20px_0_rgb(22_163_74/0.1)]"
              style={{ transform: "scale(1.03)", transformOrigin: "center" }}
            >
              <div className="min-h-[100px]">
                <div className="flex items-center justify-between mb-8">
                  <p className="text-3xl md:text-4xl font-black text-[#16A34A] tracking-tighter leading-none">
                    Alpha
                  </p>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#16A34A]/10 border border-[#16A34A]/20 rounded-full">
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16A34A] shadow-[0_0_8px_1px_rgba(22,163,74,0.8)]" />
                    </span>
                    <span className="text-xs md:text-sm font-black text-[#16A34A] tracking-widest uppercase">
                      {alphaCount.toLocaleString()} / 3,000
                    </span>
                  </div>
                </div>
                <div className="mb-1">
                  <span className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                    {PRICING.CURRENCY}{PRICING.ALPHA.monthly}
                  </span>
                  <span className="text-base text-[#9E9C98] font-medium ml-2">/ month</span>
                </div>
                <p className="text-xs font-bold text-[#16A34A] mb-1">
                  Approx. {PRICING.CURRENCY}{PRICING.ALPHA.daily.toFixed(2)} / day
                </p>
              </div>
              <div className="w-8 h-px bg-[#E8E6E1] my-5" />
              <div className="bg-white border border-[#16A34A] rounded-xl px-4 py-3 min-h-[120px] flex items-center">
                <p className="text-sm text-[#1A1916] leading-relaxed">
                  <span className="font-black uppercase">FULL-SPECTRUM ACCESS:</span>{" "}
                  <span className="font-medium">30+ Premium Assets (Last 3 Weeks) Unlocked Immediately, Plus Direct HQ Contacts.</span>
                </p>
              </div>
              <div className="flex-grow my-8">
                <p className="text-base font-medium text-[#6B6860] leading-relaxed">
                  Know exactly who to call.
                  Exactly what to pay.
                </p>
                {!isMembershipFull && (
                  <p className="mt-4 text-xs font-bold text-[#16A34A]">
                    EXCLUSIVE: Limited to {ALPHA_MAX_SPOTS.toLocaleString()} Global Membership Spots ({remainingSpots.toLocaleString()} remaining)
                  </p>
                )}
              </div>
              <div className="mt-auto">
                {isMembershipFull ? (
                  <a
                    href="/waitlist"
                    className="block w-full text-center py-3 rounded-xl bg-[#1A1916] text-white text-sm font-black hover:bg-[#2D2B26] transition-colors"
                  >
                    Join the Waiting List
                  </a>
                ) : (
                  <CheckoutButton
                    checkoutUrl={ALPHA_CHECKOUT_URL}
                    className="block w-full text-center py-3 rounded-xl bg-[#16A34A] text-white text-sm font-black hover:bg-[#15803D] transition-colors shadow-[0_4px_12px_0_rgb(22_163_74/0.3)]"
                  >
                    Go Alpha — {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo
                  </CheckoutButton>
                )}
                <p className="text-xs text-[#9E9C98] text-center mt-3">
                  30+ products · Last 3 weeks · Full sourcing intel
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* S3: ALPHA MOAT */}
      <section className="bg-[#1A1916] py-20 px-6">
        <div className="max-w-3xl mx-auto border border-white/10 rounded-2xl p-10">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#16A34A] mb-6">
            Institutional Policy
          </p>
          <h3
            className="font-black text-white leading-tight tracking-tighter mb-6"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Why only 3,000 members?
          </h3>
          <p className="text-lg text-white/60 font-medium leading-relaxed">
            With over 50 million global sellers competing for the same demand, trend saturation is a certainty. Information loses its edge when everyone has it.
            <br /><br />
            By capping Alpha at exactly 3,000 spots—representing the top 0.006% of the global market—we mathematically minimize competition and protect your exclusive profit margins. We provide the verified intelligence. The execution is yours.
            <br /><br />
            We don&apos;t just find trends —{" "}
            <span className="text-white font-semibold">we protect your opportunity.</span>
          </p>
          {!isMembershipFull && (
            <div className="mt-8 flex items-center gap-3">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#16A34A] shadow-[0_0_10px_2px_rgba(22,163,74,0.9)]" />
              </span>
              <p className="text-xl md:text-2xl font-black text-[#16A34A]">
                {remainingSpots.toLocaleString()} of {ALPHA_MAX_SPOTS.toLocaleString()} spots remaining
              </p>
            </div>
          )}
        </div>
      </section>

      {/* S4: FEATURE BREAKDOWN (no emoji, text-base rows) */}
      <section className="bg-[#F8F7F4] py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-black text-[#1A1916] tracking-tighter uppercase text-center mb-16 text-xl text-balance">
            What&apos;s Inside Every Report
          </h2>
          {FEATURE_GROUPS.map((group) => (
            <div key={group.label} className="mb-8">
              <div className="bg-white rounded-2xl border border-[#E8E6E1] overflow-hidden">
              <div className="px-3 py-3 border-b border-[#E8E6E1]">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#1A1916]">
                  {group.label}
                </p>
              </div>
              <div className="grid grid-cols-4 px-2 py-3 bg-[#F8F7F4] border-b border-[#E8E6E1]">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9E9C98] border-t-2 border-transparent pt-3">
                  Feature
                </p>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9E9C98] text-center border-t-2 border-transparent pt-3">
                  Free
                </p>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9E9C98] text-center border-t-2 border-transparent pt-3">
                  Standard
                </p>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#16A34A] text-center border-t-2 border-[#16A34A] pt-3">
                  Alpha
                </p>
              </div>
              {group.rows.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-4 px-2 py-4 items-center border-b border-[#E8E6E1] last:border-0 ${
                    i % 2 === 0 ? "bg-white" : "bg-[#F8F7F4]/50"
                  }`}
                >
                  <p className="text-xs font-medium text-[#1A1916] pr-1 leading-snug">
                    {row.feature}
                  </p>
                  <p
                    className={`text-xs font-bold text-center ${
                      row.free === "✓" ? "text-[#16A34A]" : "text-[#9E9C98]"
                    }`}
                  >
                    {row.free}
                  </p>
                  <p
                    className={`text-xs font-bold text-center ${
                      row.standard === "✓" ? "text-[#16A34A]" : "text-[#9E9C98]"
                    }`}
                  >
                    {row.standard}
                  </p>
                  <p
                    className={`text-sm font-black text-center ${
                      row.alpha === "✓" || row.alpha === "Full"
                        ? "text-[#16A34A]"
                        : "text-[#1A1916]"
                    }`}
                  >
                    {row.alpha}
                  </p>
                </div>
              ))}
              </div>
            </div>
          ))}
          <p className="text-[11px] md:text-xs text-[#8A8884] mt-6 italic text-center max-w-3xl mx-auto leading-relaxed">
            * Note: Certain supplier information in the Alpha tier may be redacted or undisclosed depending on strict manufacturer confidentiality policies.
          </p>
        </div>
      </section>

      {/* S6: FINAL FOMO HOOK (FAQ 제거) */}
      <section className="bg-[#1A1916] py-32 px-6 text-center">
        <div className="mt-6 mb-20 text-center flex flex-col items-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#16A34A] mb-6">
            THE CLOCK IS RUNNING
          </p>
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <p className="text-lg md:text-2xl text-gray-400 font-medium leading-relaxed">
              You just saw the complete blueprint. From trend signals<br className="hidden md:block" />
              to direct supplier contacts—
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] flex flex-col items-center">
              <span className="text-[#F8F7F4] block">Unlock the entire intelligence pipeline.</span>
              <span className="text-[#16A34A] block mt-1 md:mt-2">For under {PRICING.CURRENCY}{PRICING.ALPHA.marketingDailyLimit.toFixed(2)} a day.</span>
            </h2>
          </div>
        </div>
        {!isMembershipFull && (
          <div className="flex items-center justify-center gap-2 mb-10">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#16A34A] shadow-[0_0_10px_2px_rgba(22,163,74,0.9)]" />
            </span>
            <p className="text-base font-black text-[#16A34A]">
              {remainingSpots.toLocaleString()} of {ALPHA_MAX_SPOTS.toLocaleString()} Alpha spots remaining
            </p>
          </div>
        )}
        <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <CheckoutButton
              checkoutUrl={STANDARD_CHECKOUT_URL}
              className="w-full text-center py-4 border border-white/30 text-white rounded-xl font-bold text-base hover:border-white/60 transition-colors"
            >
              Start with Standard — {PRICING.CURRENCY}{PRICING.STANDARD.monthly}/mo
            </CheckoutButton>
            {isMembershipFull ? (
              <a
                href="/waitlist"
                className="w-full text-center py-4 bg-[#1A1916] text-white rounded-xl font-black text-base hover:bg-[#2D2B26] transition-colors"
              >
                Join Alpha Waiting List
              </a>
            ) : (
              <CheckoutButton
                checkoutUrl={ALPHA_CHECKOUT_URL}
                className="w-full text-center py-4 bg-[#16A34A] text-white rounded-xl font-black text-base hover:bg-[#15803D] shadow-[0_4px_20px_0_rgb(22_163_74/0.4)] transition-colors"
              >
                Go Alpha — {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo
              </CheckoutButton>
            )}
          </div>
        </div>
        <p className="text-xs text-white/30 font-medium">
          No contracts · Cancel anytime · Instant access
        </p>
      </section>
    </>
  );
}

```
