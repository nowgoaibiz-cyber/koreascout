"use client";

import { Button } from "@/components/ui";
import { PRICING } from "@/src/config/pricing";
import { Globe, Lock } from "lucide-react";
import type { ScoutFinalReportsRow } from "@/types/database";
import { normalizeToArray, parseSourcingStrategy } from "./utils";

export function SocialProofTrendIntelligence({
  report,
  tier,
  isTeaser,
}: {
  report: ScoutFinalReportsRow;
  tier: "free" | "standard" | "alpha";
  isTeaser: boolean;
}) {
  const canSeeAlpha = tier === "alpha" || isTeaser;
  const canSeeStandard = tier === "standard" || tier === "alpha" || isTeaser;

  const risingKw = normalizeToArray(report.rising_keywords);
  const seoKw = normalizeToArray(report.seo_keywords);
  const viralHt = normalizeToArray(report.viral_hashtags);
  const hasAnyTrending = risingKw.length > 0 || seoKw.length > 0 || viralHt.length > 0;

  const allSteps = parseSourcingStrategy(report.sourcing_tip);
  const steps = allSteps.slice(0, 3);

  return (
    <section
      id="section-4"
      className="scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-8 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]"
    >
      <h2 className="text-3xl font-bold text-[#1A1916] tracking-tight mb-12">
        Social Proof &amp; Trend Intelligence
      </h2>

      {report.buzz_summary?.trim() && (
        <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-12">
          <p className="text-xl font-bold text-[#1A1916] mb-6">Social Buzz</p>
          <span className="block text-6xl font-serif text-[#16A34A] leading-none mb-6">&ldquo;</span>
          <p className="text-3xl italic font-medium text-[#1A1916] leading-tight max-w-4xl">
            {report.buzz_summary}
          </p>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#9E9C98] mt-8">
            KoreaScout Intelligence Engine
          </p>
        </div>
      )}

      {(report.kr_local_score != null || report.global_trend_score != null) && (
        <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-12">
          <p className="text-xl font-bold text-[#1A1916] mb-10">Market Gap Analysis</p>
          <div className="grid grid-cols-2">
            <div className="pr-12 border-r border-[#E8E6E1]">
              <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">Korean Traction</p>
              <p className="text-7xl font-extrabold text-[#16A34A] tracking-tighter leading-none">
                {report.kr_local_score ?? "—"}
              </p>
              <div className="w-full h-1 rounded-full bg-[#E8E6E1] overflow-hidden mt-4 mb-6">
                <div
                  className="h-full rounded-full bg-[#16A34A] transition-all"
                  style={{ width: `${Math.min(report.kr_local_score || 0, 100)}%` }}
                />
              </div>
              {report.kr_evidence?.trim() && (
                <p className="text-lg text-[#1A1916] leading-relaxed mt-4">{report.kr_evidence}</p>
              )}
              {report.kr_source_used?.trim() && (
                <p className="text-xs text-[#9E9C98] mt-3">Source: {report.kr_source_used}</p>
              )}
            </div>
            <div className="pl-12">
              <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">Global Presence</p>
              <p className="text-7xl font-extrabold text-[#2563EB] tracking-tighter leading-none">
                {report.global_trend_score ?? "—"}
              </p>
              <div className="w-full h-1 rounded-full bg-[#E8E6E1] overflow-hidden mt-4 mb-6">
                <div
                  className="h-full rounded-full bg-[#2563EB] transition-all"
                  style={{ width: `${Math.min(report.global_trend_score || 0, 100)}%` }}
                />
              </div>
              {report.global_evidence?.trim() && (
                <p className="text-lg text-[#1A1916] leading-relaxed mt-4">{report.global_evidence}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {report.gap_index != null && (
        <div className="mt-32 mb-32 text-center">
          <p className="text-xl font-bold text-[#1A1916] mb-6">Gap Index</p>
          <p className="font-black text-[#16A34A] leading-none tracking-tighter" style={{ fontSize: "140px" }}>
            {report.gap_index}
          </p>
          {report.gap_status && (
            <div className="mt-4 mb-6 flex justify-center">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full font-semibold text-sm ${
                  report.gap_status === "Blue Ocean" || report.gap_status === "Emerging"
                    ? "bg-[#DCFCE7] text-[#16A34A]"
                    : "bg-[#FEF3C7] text-[#D97706]"
                }`}
              >
                {report.gap_status}
              </span>
            </div>
          )}
          {report.trend_entry_strategy?.trim() && (
            <div className="mt-4">
              <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-2">Entry Strategy</p>
              <p className="text-sm text-[#6B6860] leading-relaxed">{report.trend_entry_strategy}</p>
            </div>
          )}
          {report.opportunity_reasoning?.trim() && (
            <p className="text-base italic text-[#6B6860] max-w-lg mx-auto leading-relaxed mt-4">
              {report.opportunity_reasoning}
            </p>
          )}
        </div>
      )}

      {hasAnyTrending && (
        <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-12">
          <p className="text-xl font-bold text-[#1A1916] mb-10">Trending Signals</p>

          {risingKw.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">Rising Keywords (KR)</p>
              <div className="flex flex-wrap gap-3 w-full">
                {risingKw.map((kw) => (
                  <span
                    key={kw}
                    className="flex-1 min-w-max text-center bg-[#DCFCE7] text-[#16A34A] rounded-full px-6 py-3 text-sm font-bold tracking-tight hover:bg-[#BBF7D0] transition-colors cursor-default"
                  >
                    ↗ {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {seoKw.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">Global SEO Keywords</p>
              {canSeeStandard ? (
                <div className="flex flex-wrap gap-3 w-full">
                  {seoKw.map((kw) => (
                    <span
                      key={kw}
                      className="flex-1 min-w-max text-center bg-white border border-[#E8E6E1] text-[#1A1916] rounded-full px-6 py-3 text-sm font-bold tracking-tight hover:bg-[#F1F0ED] transition-colors cursor-default"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="h-12 w-full rounded-full bg-[#E8E6E1]/50" />
              )}
            </div>
          )}

          {viralHt.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">Viral Hashtags</p>
              {canSeeStandard ? (
                <div className="flex flex-wrap gap-3 w-full">
                  {viralHt.map((ht) => (
                    <span
                      key={ht}
                      className="flex-1 min-w-max text-center bg-white border border-[#E8E6E1] text-[#1A1916] rounded-full px-6 py-3 text-sm font-black hover:bg-[#F1F0ED] transition-colors cursor-default"
                    >
                      #{ht.startsWith("#") ? ht.slice(1) : ht}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="h-12 w-full rounded-full bg-[#E8E6E1]/50" />
              )}
            </div>
          )}

          {!canSeeStandard && (seoKw.length > 0 || viralHt.length > 0) && (
            <div className="mt-6 flex flex-col items-center justify-center py-8 gap-3 rounded-xl border border-[#E8E6E1] bg-white px-4">
              <Lock className="w-4 h-4 text-[#9E9C98]" />
              <p className="text-sm text-[#6B6860] text-center">
                SEO keywords &amp; viral hashtags are available on Standard and above.
              </p>
              <a href="/pricing">
                <Button variant="secondary" size="sm">Go Standard {PRICING.CURRENCY}{PRICING.STANDARD.monthly}/mo →</Button>
              </a>
            </div>
          )}
        </div>
      )}

      {steps.length > 0 && (
        <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-12">
          <p className="text-xl font-bold text-[#1A1916] mb-10">Scout Strategy Report</p>

          {canSeeAlpha ? (
            <div className="space-y-16">
              {steps.map((step, i) => (
                <div key={i} className="relative flex gap-6">
                  <span
                    className="absolute -top-4 -left-2 text-[80px] font-black leading-none select-none pointer-events-none opacity-[0.03]"
                    style={{ color: "#1A1916" }}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-1 bg-[#16A34A] rounded-full shrink-0 self-stretch" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2">Step {i + 1}</p>
                    <p className="text-base font-extrabold text-[#1A1916] mb-3">{step.label}</p>
                    <p className="text-lg text-[#1A1916] leading-relaxed mb-16 font-medium whitespace-pre-line">
                      {step.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-32 w-full rounded-xl bg-[#E8E6E1]/50" />
              <div className="flex flex-col items-center justify-center py-8 gap-3 rounded-xl border border-[#E8E6E1] bg-white px-4">
                <Lock className="w-4 h-4 text-[#9E9C98]" />
                <p className="text-sm text-[#6B6860] text-center">Full entry strategy is available on Alpha.</p>
                <a href="/pricing">
                  <Button variant="secondary" size="sm">Go Alpha {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo →</Button>
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-[#E8E6E1]/50 flex flex-wrap items-center gap-2">
        <Globe className="w-3 h-3 text-[#9E9C98]/60 shrink-0" />
        <span className="text-[10px] text-[#9E9C98]/60 uppercase tracking-widest font-medium">
          Global Sentiment Tracked via:
        </span>
        <span className="text-[10px] text-[#9E9C98]/50 tracking-wide">
          Reddit (r/AsianBeauty) · TikTok · Google Trends · YouTube · Weee!
        </span>
      </div>
    </section>
  );
}
