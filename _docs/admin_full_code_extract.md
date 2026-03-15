# Admin Full Code Extract

## Step 1 — Admin-related files found

```
app/api/admin/logout/route.ts
app/api/admin/reports/route.ts
app/admin/[id]/page.tsx
app/api/admin/reports/[id]/route.ts
app/admin/login/page.tsx
components/admin/AiPageLinksHelper.tsx
components/admin/GlobalPricesHelper.tsx
app/admin/page.tsx
components/admin/HazmatCheckboxes.tsx
lib/supabase/admin.ts
app/api/admin/auth/route.ts
_docs/admin_sync_audit.md
```

---

## Step 2 & 3 — Full contents of every file

=== FILE: app/api/admin/logout/route.ts ===
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
=== END: app/api/admin/logout/route.ts ===

=== FILE: app/api/admin/reports/route.ts ===
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
=== END: app/api/admin/reports/route.ts ===

=== FILE: app/admin/[id]/page.tsx ===
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { ScoutFinalReportsRow } from "@/types/database";
import { GlobalPricesHelper } from "@/components/admin/GlobalPricesHelper";
import { HazmatCheckboxes } from "@/components/admin/HazmatCheckboxes";
import { AiPageLinksHelper } from "@/components/admin/AiPageLinksHelper";

type SaveStatus = "idle" | "saved" | "error";
type OpenSections = { s1: boolean; s2: boolean; s3: boolean; s4: boolean; s5: boolean; s6: boolean };
type DiffItem = { field: string; fieldKo: string; before: string; after: string };

const EXPORT_STATUS_OPTIONS = ["Available", "Check Regulations", "Restricted", "Not Recommended"];
const COMPETITION_OPTIONS = ["Low", "Medium", "High"];

/** Korean labels for every DB field (for diff modal & edit history) */
const FIELD_LABELS_KO: Record<string, string> = {
  id: "ID",
  product_name: "제품명",
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
    "product_name", "translated_name", "category", "kr_price", "export_status", "viability_reason",
    "image_url", "naver_link", "week_id", "m_name", "corporate_scale", "contact_email", "contact_phone", "m_homepage", "wholesale_link", "status",
    "market_viability", "competition_level", "gap_status", "gap_index", "billable_weight_g",
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
                <label className={labelClass}>Opportunity Status (기회상태)</label>
                <input
                  value={formData.gap_status ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, gap_status: e.target.value }))}
                  className={inputClass}
                />
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
                      profit_multiplier: e.target.value === "" ? 0 : Number(e.target.value),
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
              <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-widest pt-2">
                Golden Data
              </p>
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
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p!,
                      verified_at: e.target.value ? e.target.value : null,
                    }))
                  }
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

              <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-widest pt-4">
                Media Links
              </p>
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

              <p className="text-xs font-semibold text-[#7C3AED] uppercase tracking-widest pt-4">
                AI Assets
              </p>
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
=== END: app/admin/[id]/page.tsx ===

=== FILE: app/api/admin/reports/[id]/route.ts ===
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
=== END: app/api/admin/reports/[id]/route.ts ===

=== FILE: app/admin/login/page.tsx ===
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
=== END: app/admin/login/page.tsx ===

=== FILE: components/admin/AiPageLinksHelper.tsx ===
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
=== END: components/admin/AiPageLinksHelper.tsx ===

=== FILE: components/admin/GlobalPricesHelper.tsx ===
"use client";

import { useState, useEffect } from "react";

const REGIONS = [
  { id: "us", flag: "🇺🇸", name: "US", placeholder: "Amazon" },
  { id: "uk", flag: "🇬🇧", name: "UK", placeholder: "Amazon UK" },
  { id: "sea", flag: "🇸🇬", name: "SEA", placeholder: "Shopee" },
  { id: "australia", flag: "🇦🇺", name: "AU", placeholder: "Amazon AU" },
  { id: "india", flag: "🇮🇳", name: "IN", placeholder: "Flipkart" },
] as const;

type RegionRow = { platform: string; url: string };

function parseValue(value: string | null): Record<string, RegionRow> {
  if (!value?.trim()) return {};
  try {
    const p = JSON.parse(value);
    if (typeof p !== "object" || p === null) return {};
    const out: Record<string, RegionRow> = {};
    for (const r of REGIONS) {
      const v = p[r.id] ?? p[r.id === "australia" ? "au" : r.id];
      if (v && typeof v === "object") {
        out[r.id] = {
          platform: typeof v.platform === "string" ? v.platform : "",
          url: typeof v.url === "string" ? v.url : "",
        };
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function GlobalPricesHelper({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (newJsonString: string) => void;
}) {
  const [rows, setRows] = useState<Record<string, RegionRow>>(() =>
    parseValue(value)
  );
  const [rawOpen, setRawOpen] = useState(false);

  useEffect(() => {
    setRows(parseValue(value));
  }, [value]);

  function updateRegion(id: string, field: "platform" | "url", val: string) {
    const next = { ...rows };
    const current = next[id] ?? { platform: "", url: "" };
    next[id] = { ...current, [field]: val };
    setRows(next);
    const result: Record<string, RegionRow> = {};
    for (const r of REGIONS) {
      const row = next[r.id];
      if (row?.url?.trim()) {
        result[r.id] = {
          platform: row.platform?.trim() ?? "",
          url: row.url.trim(),
        };
      }
    }
    onChange(JSON.stringify(result));
  }

  const currentJson = (() => {
    const result: Record<string, RegionRow> = {};
    for (const r of REGIONS) {
      const row = rows[r.id];
      if (row?.url?.trim()) {
        result[r.id] = {
          platform: row.platform?.trim() ?? "",
          url: row.url.trim(),
        };
      }
    }
    return JSON.stringify(result, null, 2);
  })();

  const inputClass =
    "bg-white border border-[#E8E6E1] rounded-lg px-3 py-2 text-sm text-[#1A1916] focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] outline-none";

  return (
    <div className="flex flex-col gap-3">
      {REGIONS.map((r) => (
        <div key={r.id} className="flex items-center gap-2 flex-wrap">
          <span className="text-[#9E9C98] text-sm w-16">
            {r.flag} {r.name}
          </span>
          <input
            type="text"
            placeholder={r.placeholder}
            value={rows[r.id]?.platform ?? ""}
            onChange={(e) => updateRegion(r.id, "platform", e.target.value)}
            className={`${inputClass} w-28`}
          />
          <input
            type="url"
            placeholder="URL"
            value={rows[r.id]?.url ?? ""}
            onChange={(e) => updateRegion(r.id, "url", e.target.value)}
            className={`${inputClass} flex-1 min-w-0`}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRawOpen((o) => !o)}
        className="text-xs text-[#C4C2BE] hover:text-[#9E9C98] w-fit"
      >
        {rawOpen ? "▼ Hide Raw JSON" : "▶ Show Raw JSON"}
      </button>
      {rawOpen && (
        <textarea
          readOnly
          value={currentJson}
          rows={6}
          className="bg-[#F8F7F4] border border-[#E8E6E1] text-[#6B6860] text-xs font-mono rounded-lg px-3 py-2 resize-none w-full"
        />
      )}
      <p className="text-xs text-[#9E9C98] italic">
        Leave URL empty to show 🔵 Blue Ocean badge on the product page.
      </p>
    </div>
  );
}
=== END: components/admin/GlobalPricesHelper.tsx ===

=== FILE: app/admin/page.tsx ===
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
=== END: app/admin/page.tsx ===

=== FILE: components/admin/HazmatCheckboxes.tsx ===
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
=== END: components/admin/HazmatCheckboxes.tsx ===

=== FILE: lib/supabase/admin.ts ===
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
=== END: lib/supabase/admin.ts ===

=== FILE: app/api/admin/auth/route.ts ===
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
=== END: app/api/admin/auth/route.ts ===

=== FILE: _docs/admin_sync_audit.md ===
# Admin Sync Audit Report

**Purpose:** Exhaustive comparison of Product Detail Page (PDP) vs Admin edit page to identify every field gap, ordering mismatch, and missing input so Admin can be fully synchronized to match PDP.

**Scope:** Read-only audit. No file modifications except this report.

**Sources:**
- PDP: `app/weekly/[weekId]/[id]/page.tsx`, `components/ProductIdentity.tsx`, `components/report/TrendSignalDashboard.tsx`, `components/report/MarketIntelligence.tsx`, `components/report/SocialProofTrendIntelligence.tsx`, `components/report/SourcingIntel.tsx`, `components/report/SupplierContact.tsx`, `components/GroupBBrokerSection.tsx`
- Admin: `app/admin/[id]/page.tsx` (edit form), `app/admin/page.tsx` (list)
- DB types: `types/database.ts` (ScoutFinalReportsRow)

---

## 1. PDP Field Map (Section by Section, top to bottom)

PDP section order on the page (from `app/weekly/[weekId]/[id]/page.tsx`):

1. **Section 1 — Product Identity** (`ProductIdentity.tsx`)
   - [image_url, product_name, translated_name, category, export_status, kr_price, estimated_cost_usd, go_verdict, composite_score, viability_reason]

2. **Section 2 — Trend Signal Dashboard** (`TrendSignalDashboard.tsx`)
   - [market_viability, competition_level, gap_status, platform_scores, growth_signal, growth_evidence, new_content_volume]
   - (platform_scores parsed for: tiktok, instagram, youtube, reddit score/sentiment)

3. **Section 3 — Market Intelligence** (`MarketIntelligence.tsx`)
   - [estimated_cost_usd, profit_multiplier, global_prices, global_price (fallback), best_platform, search_volume, mom_growth, wow_rate, top_selling_point, common_pain_point]
   - (ListingsBlock uses row/listings from parseGlobalPricesForGrid: price_usd, official_url, official_price_usd, platform, review_data, seller_type)

4. **Section 4 — Social Proof & Trend Intelligence** (`SocialProofTrendIntelligence.tsx`)
   - [buzz_summary, kr_local_score, global_trend_score, kr_evidence, kr_source_used, global_evidence, gap_index, gap_status, trend_entry_strategy, opportunity_reasoning, rising_keywords, seo_keywords, viral_hashtags, sourcing_tip (parsed as steps 1–3)]

5. **Section 5 — Export & Logistics Intel** (`SourcingIntel.tsx` + `GroupBBrokerSection.tsx`)
   - [export_status, status_reason, hs_code, hs_description, actual_weight_g, volumetric_weight_g, billable_weight_g, dimensions_cm, shipping_tier, hazmat_status, key_risk_ingredient, required_certificates, composition_info, spec_summary, hazmat_summary, sourcing_tip (parsed as steps 4–5), shipping_notes]

6. **Section 6 — Launch & Execution Kit / Supplier & Contact** (`SupplierContact.tsx`)
   - [verified_cost_usd, verified_cost_note, verified_at, moq, lead_time, can_oem, m_name, translated_name, corporate_scale, contact_email, contact_phone, m_homepage, wholesale_link, global_site_url, b2b_inquiry_url, sample_policy, export_cert_note, global_prices (Global Market Proof), viral_video_url, video_url, ai_detail_page_links, marketing_assets_url, ai_image_url]

**Deduplicated PDP field list (all report.* references):**
- actual_weight_g, ai_detail_page_links, ai_image_url, best_platform, billable_weight_g, buzz_summary, can_oem, category, common_pain_point, competition_level, composite_score, composition_info, contact_email, contact_phone, corporate_scale, dimensions_cm, estimated_cost_usd, export_cert_note, export_status, gap_index, gap_status, global_evidence, global_price, global_prices, global_site_url, global_trend_score, go_verdict, growth_evidence, growth_signal, hazmat_status, hazmat_summary, hs_code, hs_description, image_url, key_risk_ingredient, kr_evidence, kr_local_score, kr_price, kr_source_used, lead_time, m_homepage, m_name, marketing_assets_url, market_viability, moq, mom_growth, naver_link, new_content_volume, opportunity_reasoning, platform_scores, product_name, profit_multiplier, required_certificates, rising_keywords, search_volume, seo_keywords, shipping_notes, shipping_tier, spec_summary, sourcing_tip, status_reason, top_selling_point, translated_name, trend_entry_strategy, verified_at, verified_cost_note, verified_cost_usd, viability_reason, viral_hashtags, viral_video_url, video_url, volumetric_weight_g, wow_rate, b2b_inquiry_url, wholesale_link

---

## 2. Current Admin Fields (as-is)

Admin edit page (`app/admin/[id]/page.tsx`) is organized into 6 collapsible sections. Field order and presence as implemented:

**Section 1 — Product Identity**
- id (read-only), product_name, translated_name, category, kr_price, kr_price_usd (read-only), estimated_cost_usd (read-only), export_status, viability_reason, image_url, naver_link, week_id

**Section 2 — Trend Signal Dashboard**
- market_viability, competition_level, gap_status, wow_rate, mom_growth, growth_evidence
- (Missing here: growth_signal, new_content_volume, platform_scores — but platform_scores and new_content_volume appear in other sections; see below)

**Section 3 — Market Intelligence**
- profit_multiplier, top_selling_point, common_pain_point, new_content_volume, global_prices
- (Missing: search_volume, best_platform, estimated_cost_usd is read-only in S1)

**Section 4 — Social Proof & Trend Intelligence**
- buzz_summary, kr_local_score, global_trend_score, gap_index (read-only), kr_evidence, global_evidence, kr_source_used, gap_status (duplicate), opportunity_reasoning, rising_keywords (×5), seo_keywords (×5), viral_hashtags (×5), platform_scores, sourcing_tip

**Section 5 — Export & Logistics Intel**
- hs_code, hs_description, status_reason, composition_info, spec_summary, actual_weight_g, volumetric_weight_g, billable_weight_g (read-only), dimensions_cm, hazmat_status, required_certificates, shipping_notes
- (Missing: export_status is in S1; shipping_tier, key_risk_ingredient, hazmat_summary)

**Section 6 — Launch & Execution Kit**
- m_name, corporate_scale, contact_email, contact_phone, m_homepage, wholesale_link
- verified_cost_usd, verified_cost_note, verified_at, moq, lead_time, sample_policy, export_cert_note
- viral_video_url, video_url, marketing_assets_url
- ai_detail_page_links
- (Missing: global_site_url, b2b_inquiry_url, ai_image_url, can_oem)

**Admin formKeys (used for diff/save):**
product_name, translated_name, category, kr_price, export_status, viability_reason, image_url, naver_link, week_id, m_name, corporate_scale, contact_email, contact_phone, m_homepage, wholesale_link, status, market_viability, competition_level, gap_status, gap_index, billable_weight_g, wow_rate, mom_growth, growth_evidence, profit_multiplier, top_selling_point, common_pain_point, new_content_volume, global_prices, buzz_summary, kr_local_score, global_trend_score, kr_evidence, global_evidence, kr_source_used, opportunity_reasoning, rising_keywords, seo_keywords, viral_hashtags, platform_scores, sourcing_tip, hs_code, hs_description, status_reason, composition_info, spec_summary, actual_weight_g, volumetric_weight_g, dimensions_cm, hazmat_status, required_certificates, shipping_notes, verified_cost_usd, verified_cost_note, verified_at, moq, lead_time, sample_policy, export_cert_note, viral_video_url, video_url, marketing_assets_url, ai_detail_page_links, published_at

**Admin FIELD_LABELS_KO** includes the above; it does not include: search_volume, best_platform, trend_entry_strategy, growth_signal, shipping_tier, key_risk_ingredient, hazmat_summary, global_site_url, b2b_inquiry_url, ai_image_url, can_oem, global_price.

---

## 3. Missing Fields (in PDP, not in Admin)

These fields are used on the PDP but have **no input or display** on the Admin edit page. They must be added to Admin for full sync.

| Field | PDP usage | Section |
|-------|-----------|---------|
| **search_volume** | Market Intelligence — "Search Volume" block | Section 3 |
| **best_platform** | Market Intelligence — "Best Entry: {best_platform}" under Global Market Availability | Section 3 |
| **growth_signal** | Trend Signal Dashboard — "Growth Momentum" headline value | Section 2 |
| **trend_entry_strategy** | Social Proof — "Entry Strategy" under Gap Index | Section 4 |
| **shipping_tier** | Sourcing Intel — "Shipping Tier" with describeShippingTier() | Section 5 |
| **key_risk_ingredient** | Sourcing Intel — "Risk Ingredient" in Hazmat & Compliance | Section 5 |
| **hazmat_summary** | Sourcing Intel — "Hazmat Summary" expandable block | Section 5 |
| **global_site_url** | Supplier Contact — "Global Site" contact link | Section 6 |
| **b2b_inquiry_url** | Supplier Contact — "B2B Inquiry" contact link | Section 6 |
| **ai_image_url** | Supplier Contact — Creative Assets card "AI Product Image" | Section 6 |
| **can_oem** | Supplier Contact — "OEM / ODM" (Available / Not Available) | Section 6 |

**Optional / derived:**
- **global_price** — Used in PDP as fallback in `parseGlobalPricesForGrid(report.global_prices, report.global_price)`. If stored separately in DB, Admin may need it; otherwise it can remain derived/legacy.

---

## 4. Orphaned Fields (in Admin, not in PDP)

Fields that exist in the Admin form but are **not referenced** in the PDP components above (no `report.<field>` in ProductIdentity, TrendSignalDashboard, MarketIntelligence, SocialProofTrendIntelligence, SourcingIntel, SupplierContact, GroupBBrokerSection):

| Field | Admin section | Note |
|-------|----------------|------|
| **week_id** | S1 | Used in PDP only for navigation/back link (from page.tsx), not from report object in these components. Not orphaned for data integrity; keep. |
| **status** | Header | Report status (published/hidden). Used in PDP for visibility; keep. |
| **published_at** | formKeys / save | Used for publish timestamp. Keep. |

There are no true "orphan" content fields that the PDP never reads. The only structural oddity is **gap_status** appearing in both Admin Section 2 and Section 4 (duplicate input).

---

## 5. Correct Field Order for Admin (final target sequence)

Order below follows PDP section order so that Admin sections mirror PDP 1:1. Each line is the intended order within that section.

**Section 1 — Product Identity**
1. id (read-only)
2. product_name
3. translated_name
4. category
5. kr_price
6. kr_price_usd (read-only)
7. estimated_cost_usd (read-only)
8. export_status
9. viability_reason
10. go_verdict
11. composite_score
12. image_url
13. naver_link
14. week_id

**Section 2 — Trend Signal Dashboard**
1. market_viability
2. competition_level
3. gap_status
4. platform_scores
5. growth_signal  ← ADD
6. growth_evidence
7. new_content_volume

(Remove wow_rate, mom_growth from S2; they belong in Market Intelligence below.)

**Section 3 — Market Intelligence**
1. profit_multiplier
2. estimated_cost_usd (if made editable; else leave in S1 as read-only)
3. global_prices
4. best_platform  ← ADD
5. search_volume  ← ADD
6. mom_growth
7. wow_rate
8. top_selling_point
9. common_pain_point
10. new_content_volume  ← move here from current S3 (or keep single placement in S2; avoid duplicate)

**Section 4 — Social Proof & Trend Intelligence**
1. buzz_summary
2. kr_local_score
3. global_trend_score
4. kr_evidence
5. kr_source_used
6. global_evidence
7. gap_index (read-only)
8. gap_status  ← single placement (remove duplicate from S2 in current Admin)
9. trend_entry_strategy  ← ADD
10. opportunity_reasoning
11. rising_keywords
12. seo_keywords
13. viral_hashtags
14. platform_scores  ← single placement (currently only in S4; S2 should have it as above)
15. sourcing_tip

**Section 5 — Export & Logistics Intel**
1. export_status  ← consider moving here from S1 so all "Export & Logistics" fields are together; or keep in S1 for hero badge.
2. status_reason
3. hs_code
4. hs_description
5. actual_weight_g
6. volumetric_weight_g
7. billable_weight_g (read-only)
8. dimensions_cm
9. shipping_tier  ← ADD
10. hazmat_status
11. key_risk_ingredient  ← ADD
12. required_certificates
13. hazmat_summary  ← ADD
14. composition_info
15. spec_summary
16. shipping_notes

**Section 6 — Launch & Execution Kit (Supplier & Contact)**
1. m_name
2. corporate_scale
3. contact_email
4. contact_phone
5. m_homepage
6. wholesale_link
7. global_site_url  ← ADD
8. b2b_inquiry_url  ← ADD
9. verified_cost_usd
10. verified_cost_note
11. verified_at
12. moq
13. lead_time
14. can_oem  ← ADD
15. sample_policy
16. export_cert_note
17. viral_video_url
18. video_url
19. marketing_assets_url
20. ai_detail_page_links
21. ai_image_url  ← ADD

**Ordering mismatches to fix:**
- **gap_status**: Currently in Admin S2 and S4; should appear once (e.g. in S4 only, or S2 only to match "Opportunity Status" in PDP S2).
- **new_content_volume**: In Admin S3; PDP uses it in Section 2 (Trend Signal) and Section 3 (Market Intelligence). One placement in Admin is enough; prefer S2 to match "Growth Momentum" block.
- **wow_rate, mom_growth**: In Admin S2; PDP uses them in Section 3 (Market Intelligence, Search & Growth). Move to Admin S3.
- **platform_scores**: In Admin S4 only; PDP uses in Section 2 (Platform Breakdown). Add to Admin S2; keep single field (no duplicate).
- **go_verdict, composite_score**: Used in PDP ProductIdentity; not present in Admin. Add to S1.

---

## 6. CEO Manual Input Zone Fields (goes to bottom)

These fields require CEO (or human) manual research and are not auto-filled by Make.com. They should be grouped at the **bottom of the Admin form** (e.g. within Section 6 or a dedicated "Manual Input Zone" subsection):

| Field | PDP usage |
|-------|-----------|
| **verified_cost_usd** | Supplier cost per unit (Alpha) |
| **verified_cost_note** | e.g. "undisclosed" |
| **verified_at** | When cost was verified |
| **moq** | Minimum order quantity |
| **lead_time** | Est. production lead time |
| **sample_policy** | Sample order policy text |
| **video_url** | Raw ad footage URL |
| **viral_video_url** | Viral reference URL |
| **marketing_assets_url** | Brand asset kit URL |
| **ai_image_url** | AI product image URL (if manually overridden) |
| **export_cert_note** | Compliance/export note |
| **key_risk_ingredient** | Risk ingredient callout (manual review) |
| **status_reason** | Export status reasoning (manual) |
| **trend_entry_strategy** | Entry strategy text (can be manual polish) |
| **best_platform** | Best entry platform recommendation |

Optional to include in Manual Zone (if often manually set): **global_site_url**, **b2b_inquiry_url**, **can_oem**, **sample_policy** (already listed).

---

## 7. Export Status Value Mismatch

- **PDP** (SourcingIntel, ProductIdentity) expects `export_status` values: **"Green"**, **"Yellow"**, or anything else (e.g. "Red") for "Export Restricted".
- **Admin** dropdown: `EXPORT_STATUS_OPTIONS = ["Available", "Check Regulations", "Restricted", "Not Recommended"]`.
- **EXPORT_STATUS_DISPLAY** (constants): keys are `green`, `yellow`, `red` with labels "Ready to Export", "Check Regulations", "Export Restricted".

**Recommendation:** Align Admin dropdown with PDP/DB by using **Green**, **Yellow**, **Red** (or same casing as stored) so that PDP badges and copy render correctly without mapping layer.

---

## 8. Summary Checklist

| Action | Count |
|--------|--------|
| **Add to Admin** | 11 fields: search_volume, best_platform, growth_signal, trend_entry_strategy, shipping_tier, key_risk_ingredient, hazmat_summary, global_site_url, b2b_inquiry_url, ai_image_url, can_oem |
| **Add to Admin (PDP hero)** | 2 fields: go_verdict, composite_score |
| **Reorder / move** | wow_rate, mom_growth → S3; platform_scores in S2; gap_status single placement; new_content_volume single placement (S2) |
| **Remove duplicate** | gap_status (currently in S2 and S4) |
| **CEO Manual Zone** | 15+ fields listed in §6, grouped at bottom |
| **Export status values** | Change Admin options to Green / Yellow / Red (or stored values) to match PDP |

---

*End of Admin Sync Audit Report.*
=== END: _docs/admin_sync_audit.md ===

=== FILE: types/database.ts ===
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
  profit_multiplier: number;
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
=== END: types/database.ts ===

=== FILE: components/ui/Badge.tsx ===
'use client'

const baseClasses =
  'inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full'

const variantClasses = {
  default: 'bg-[#F2F1EE] text-[#6B6860]',
  success: 'bg-[#DCFCE7] text-[#16A34A]',
  warning: 'bg-[#FEF3C7] text-[#D97706]',
  danger: 'bg-[#FEE2E2] text-[#DC2626]',
  info: 'bg-[#DBEAFE] text-[#2563EB]',
  'tier-free': 'bg-[#F2F1EE] text-[#6B6860]',
  'tier-standard': 'bg-[#DBEAFE] text-[#2563EB]',
  'tier-alpha': 'bg-[#DCFCE7] text-[#16A34A]',
} as const

export type BadgeVariant = keyof typeof variantClasses

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  className?: string
  children?: React.ReactNode
}

export function Badge({
  variant = 'default',
  className = '',
  children,
  ...rest
}: BadgeProps) {
  const variantClass = variantClasses[variant]
  return (
    <span
      className={`${baseClasses} ${variantClass} ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  )
}
=== END: components/ui/Badge.tsx ===

=== FILE: lib/supabase.ts ===
(File not found)
=== END: lib/supabase.ts ===

=== FILE: lib/auth.ts ===
(File not found)
=== END: lib/auth.ts ===
