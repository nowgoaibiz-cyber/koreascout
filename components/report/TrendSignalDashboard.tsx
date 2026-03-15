"use client";

import { DonutGauge } from "@/components/DonutGauge";
import { Badge } from "@/components/ui";
import { Radar, TrendingUp } from "lucide-react";
import type { ScoutFinalReportsRow } from "@/types/database";
import { safeParsePlatformScores } from "./utils";

function getPlatformBadge(score: number): { label: string; bg: string; text: string; border: string } {
  if (score === 0) return { label: "UNTAPPED", bg: "#16A34A", text: "#FFFFFF", border: "#16A34A" };
  if (score <= 30) return { label: "EARLY SIGNAL", bg: "#F8F7F4", text: "#1A1916", border: "#E8E6E1" };
  if (score <= 70) return { label: "TRENDING", bg: "#F8F7F4", text: "#1A1916", border: "#E8E6E1" };
  return { label: "SATURATED", bg: "#F8F7F4", text: "#9E9C98", border: "#E8E6E1" };
}

function getRedditBadge(sentiment: string | undefined): { label: string; bg: string; text: string; border: string } {
  if (sentiment?.toLowerCase() === "positive") return { label: "VALIDATED", bg: "#F8F7F4", text: "#1A1916", border: "#E8E6E1" };
  if (sentiment?.toLowerCase() === "negative") return { label: "FRICTION", bg: "#F8F7F4", text: "#1A1916", border: "#E8E6E1" };
  return { label: "QUIET", bg: "#F8F7F4", text: "#9E9C98", border: "#E8E6E1" };
}

export function TrendSignalDashboard({ report }: { report: ScoutFinalReportsRow }) {
  const score = typeof report.market_viability === "number" ? report.market_viability : 0;
  const competitionLevel = report.competition_level?.trim() || "—";
  const gapStatus = report.gap_status?.trim() || "—";
  const platformData = safeParsePlatformScores(report.platform_scores);
  const platforms = [
    { key: "tiktok", label: "TikTok" },
    { key: "instagram", label: "Instagram" },
    { key: "youtube", label: "YouTube" },
  ] as const;
  const reddit = platformData?.["reddit"];
  const hasGrowthMomentum =
    report.growth_signal?.trim() ||
    report.growth_evidence?.trim() ||
    report.new_content_volume?.trim();

  return (
    <section id="section-2" className="scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
      <h2 className="text-3xl font-bold text-[#1A1916] mb-0 tracking-tight">Trend Signal Dashboard</h2>

      <div className="bg-[#F8F7F4]/50 text-base italic text-[#6B6860] py-3 px-4 border-l-2 border-[#16A34A] mb-8 mt-4">
        Every week, KoreaScout screens <span className="font-semibold not-italic text-[#1A1916]">500+ Korean products</span>
        {" "}and curates only those scoring above 50.{" "}
        <span className="font-semibold not-italic text-[#1A1916]">It&apos;s worth your attention.</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 flex flex-col items-center gap-3">
          <p className="text-xl font-bold text-[#1A1916] text-center h-8 flex items-center justify-center mt-0">Market Score</p>
          <DonutGauge value={score} size={180} strokeWidth={14} />
          <p className="text-sm text-[#6B6860] text-center leading-relaxed mt-4">
            Product-market fit based on demand, margin & trend signals
          </p>
        </div>
        <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 flex flex-col items-center justify-center gap-3">
          <p className="text-xl font-bold text-[#1A1916] text-center h-8 flex items-center justify-center mt-0">Competition Level</p>
          <p className={`text-3xl font-extrabold text-center mt-1 mb-4 ${
            competitionLevel === "Low" ? "text-[#16A34A]" :
            competitionLevel === "High" ? "text-[#DC2626]" :
            competitionLevel === "Medium" ? "text-[#D97706]" :
            "text-[#6B6860]"
          }`}>
            {competitionLevel}
          </p>
          <p className="text-sm text-[#6B6860] text-center leading-relaxed">
            How crowded this niche is on global marketplaces
          </p>
        </div>
        <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 flex flex-col items-center justify-center gap-3">
          <p className="text-xl font-bold text-[#1A1916] text-center h-8 flex items-center justify-center mt-0">Opportunity Status</p>
          <p className={`text-3xl font-extrabold text-center mt-1 mb-4 whitespace-nowrap ${
            gapStatus === "Blue Ocean" || gapStatus === "Emerging" ? "text-[#16A34A]" :
            gapStatus === "Saturated" ? "text-[#D97706]" :
            "text-[#6B6860]"
          }`}>
            {gapStatus}
          </p>
          <p className="text-sm text-[#6B6860] text-center leading-relaxed">
            Gap between Korean buzz and global availability
          </p>
        </div>
      </div>

      <div className="mt-8 bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6">
        <h3 className="text-xl font-bold text-[#1A1916] mb-6">Platform Breakdown</h3>
        {platformData ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {platforms.map(({ key, label }) => {
              const data = platformData[key];
              const platformScore = data?.score ?? 0;
              const badge = getPlatformBadge(platformScore);
              return (
                <div
                  key={key}
                  className="bg-white rounded-xl border border-[#E8E6E1] p-5 flex flex-col items-center justify-between gap-3 min-h-[160px]"
                >
                  <p className="text-sm font-bold text-[#9E9C98] uppercase tracking-widest">{label}</p>
                  <span
                    className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest"
                    style={{ backgroundColor: badge.bg, color: badge.text, border: `1px solid ${badge.border}` }}
                  >
                    {badge.label}
                  </span>
                  <p className="text-sm text-center leading-relaxed"
                    style={{ color: platformScore === 0 ? "#16A34A" : "#9E9C98" }}
                  >
                    {platformScore === 0 ? "No mentions found" : `Score: ${platformScore}`}
                  </p>
                </div>
              );
            })}
            {(() => {
              const redditBadge = getRedditBadge(reddit?.sentiment);
              return (
                <div className="bg-white rounded-xl border border-[#E8E6E1] p-5 flex flex-col items-center justify-between gap-3 min-h-[160px]">
                  <p className="text-sm font-bold text-[#9E9C98] uppercase tracking-widest">Reddit</p>
                  <span
                    className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest"
                    style={{ backgroundColor: redditBadge.bg, color: redditBadge.text, border: `1px solid ${redditBadge.border}` }}
                  >
                    {redditBadge.label}
                  </span>
                  <p className="text-sm text-[#9E9C98] text-center leading-relaxed">
                    {reddit?.sentiment ? `Sentiment: ${reddit.sentiment}` : "No data"}
                  </p>
                </div>
              );
            })()}
          </div>
        ) : (
          <p className="text-base text-[#9E9C98]">No platform data</p>
        )}
      </div>

      <div className="mt-8 bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 pl-6 md:pl-10">
        {hasGrowthMomentum ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="md:col-span-1 flex flex-col justify-center gap-1">
              <p className="text-xl font-bold text-[#1A1916] inline-flex items-center gap-2">
                Growth Momentum
                <TrendingUp className="w-5 h-5 text-[#16A34A] shrink-0" />
              </p>
              {report.growth_signal?.trim() && (
                <p className="text-4xl font-black text-[#16A34A] leading-tight">{report.growth_signal}</p>
              )}
            </div>
            <div className="md:col-span-2 border-l-0 md:border-l-2 border-[#16A34A] pl-0 md:pl-6 flex flex-col justify-center space-y-2">
              {report.growth_evidence?.trim() && (
                <p className="text-xl leading-relaxed text-[#3D3B36]">{report.growth_evidence}</p>
              )}
              {report.new_content_volume?.trim() && (
                <p className="text-xl leading-relaxed text-[#3D3B36]">{report.new_content_volume}</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <p className="text-xl font-bold text-[#1A1916] mb-4 inline-flex items-center gap-2">
              Growth Momentum
              <TrendingUp className="w-5 h-5 text-[#16A34A] shrink-0" />
            </p>
            <p className="text-base text-[#9E9C98]">No growth data</p>
          </>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-[#E8E6E1]/50 flex flex-wrap items-center gap-2">
        <Radar className="w-3 h-3 text-[#9E9C98]/60 shrink-0" />
        <span className="text-[10px] text-[#9E9C98]/60 uppercase tracking-widest font-medium">
          Verified Local Demand via:
        </span>
        <span className="text-[10px] text-[#9E9C98]/50 tracking-wide">
          Hwahae · Glowpick · Olive Young · Chicor · Naver Data Lab
        </span>
      </div>
    </section>
  );
}
