"use client";

import { DonutGauge } from "@/components/DonutGauge";
import { Badge } from "@/components/ui";
import { TrendingUp } from "lucide-react";
import type { ScoutFinalReportsRow } from "@/types/database";
import { safeParsePlatformScores } from "./utils";

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

      <div className="mt-8 bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 pl-6 md:pl-10">
        <h3 className="text-xl font-bold text-[#1A1916] mb-4">Platform Breakdown</h3>
        {platformData ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-start">
            {platforms.map(({ key, label }) => {
              const data = platformData[key];
              const platformScore = data?.score ?? 0;
              return (
                <div key={key} className="flex flex-col items-center">
                  <p className="text-base font-bold text-[#6B6860] mb-3 uppercase tracking-widest shrink-0">{label}</p>
                  <DonutGauge value={platformScore} size={100} strokeWidth={8} />
                </div>
              );
            })}
            <div className="flex flex-col items-center">
              <p className="text-base font-bold text-[#6B6860] mb-3 uppercase tracking-widest shrink-0">Reddit</p>
              <div className="w-[100px] h-[100px] flex items-center justify-center">
                {reddit?.sentiment ? (
                  <Badge
                    variant={
                      reddit.sentiment.toLowerCase() === "positive"
                        ? "success"
                        : reddit.sentiment.toLowerCase() === "negative"
                          ? "danger"
                          : "default"
                    }
                  >
                    {reddit.sentiment}
                  </Badge>
                ) : (
                  <span className="text-sm text-[#9E9C98]">No data</span>
                )}
              </div>
            </div>
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
    </section>
  );
}
