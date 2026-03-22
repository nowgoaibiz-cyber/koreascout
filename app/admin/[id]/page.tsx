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
