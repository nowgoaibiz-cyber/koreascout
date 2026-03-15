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