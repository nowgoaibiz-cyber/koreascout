"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { ScoutFinalReportsRow } from "@/types/database";

const FALLBACK_RATE = 1430;

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
}

type ExportStatusDisplay = Record<string, { variant: "success" | "warning" | "danger"; label: string }>;

export default function ProductIdentity({
  report,
  tier,
  isTeaser,
  EXPORT_STATUS_DISPLAY,
  reportId,
  weekId,
  isFavorited,
  isSample,
}: {
  report: ScoutFinalReportsRow;
  tier: "free" | "standard" | "alpha";
  isTeaser: boolean;
  EXPORT_STATUS_DISPLAY: ExportStatusDisplay;
  reportId?: string;
  weekId?: string;
  isFavorited?: boolean;
  isSample?: boolean;
}) {
  const canSeeAlpha = tier === "alpha" || isTeaser;
  const [exchangeRate, setExchangeRate] = useState<number>(FALLBACK_RATE);
  const [rateDate, setRateDate] = useState<string>(formatDate(new Date()));
  const [rateLoading, setRateLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    fetch("https://api.frankfurter.app/latest?from=USD&to=KRW", {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        const rate = data?.rates?.KRW;
        if (typeof rate === "number" && rate > 0) {
          setExchangeRate(Math.round(rate));
          setRateDate(formatDate(new Date()));
        }
      })
      .catch(() => {
        setExchangeRate(FALLBACK_RATE);
      })
      .finally(() => {
        clearTimeout(timeout);
        setRateLoading(false);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const exportBadge = (() => {
    const s = report.export_status;
    const key = s?.toLowerCase() ?? "";
    const label = (EXPORT_STATUS_DISPLAY[key]?.label ?? s) as string;
    if (!s || !label) return null;
    if (s === "Green" || key === "green") return { label, color: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]" };
    if (s === "Yellow" || key === "yellow") return { label, color: "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]" };
    return { label, color: "bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]" };
  })();

  const usdPrice = report.kr_price != null
    ? (Number(report.kr_price) / exchangeRate).toFixed(2)
    : null;

  return (
    <section
      id="section-1"
      className="scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-8 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]"
    >
      <h2 className="text-3xl font-bold text-[#1A1916] tracking-tight mb-8">
        Product Identity
      </h2>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="relative w-full md:w-80 shrink-0 overflow-hidden rounded-2xl bg-[#F8F7F4] aspect-[3/4]">
          {report.image_url ? (
            <Image
              src={report.image_url}
              alt={report.product_name || report.translated_name || "Product"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-[#9E9C98]">No image</p>
            </div>
          )}
          {isSample && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 pointer-events-none">
              <div className="rotate-[-35deg] border-2 border-white/40 px-6 py-2 rounded-lg backdrop-blur-sm">
                <span className="text-white/70 font-black text-2xl tracking-widest uppercase drop-shadow-md">
                  KoreaScout Sample
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden @container relative">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              {report.category?.trim() && (
                <span className="inline-flex items-center px-3 py-1.5 bg-[#F8F7F4] border border-[#E8E6E1] text-xs font-bold text-[#1A1916] rounded-md uppercase tracking-wide">
                  {report.category}
                </span>
              )}
              {exportBadge && (
                <span className={`inline-flex items-center px-3 py-1.5 border text-xs font-bold rounded-md uppercase tracking-wide ${exportBadge.color}`}>
                  {exportBadge.label}
                </span>
              )}
            </div>
            {reportId != null && weekId != null && (
              <FavoriteButton
                reportId={reportId}
                weekId={weekId}
                isFavorited={isFavorited ?? false}
                className={`shrink-0 ${isFavorited ? "fill-[#16A34A] text-[#16A34A]" : "text-gray-300 hover:text-[#16A34A]"}`}
                iconClassName="w-8 h-8"
              />
            )}
          </div>

          <h1
            className="font-bold text-[#1A1916] leading-tight break-words mb-2"
            style={{
              fontSize: "clamp(1.5rem, 4cqw, 2.25rem)",
              textWrap: "balance",
            } as React.CSSProperties}
          >
            {report.translated_name || report.product_name}
          </h1>

          {report.product_name && (
            <p className="text-lg font-medium text-[#6B6860] line-clamp-2 mb-4">
              {report.product_name}
            </p>
          )}

          {(report.go_verdict?.trim() || report.composite_score != null) && (() => {
            const verdictStyleMap: Record<string, { bg: string; text: string; dot: string }> = {
              "GO":          { bg: "bg-[#F0FDF4] border border-[#16A34A]", text: "text-[#16A34A]", dot: "bg-[#16A34A]" },
              "CAUTIOUS GO": { bg: "bg-[#FFFBEB] border border-[#D97706]", text: "text-[#D97706]", dot: "bg-[#D97706]" },
              "NO GO":       { bg: "bg-[#FEF2F2] border border-[#DC2626]", text: "text-[#DC2626]", dot: "bg-[#DC2626]" },
            };
            const key = report.go_verdict?.trim().toUpperCase() ?? "";
            const style = verdictStyleMap[key] ?? { bg: "bg-[#F8F7F4] border border-[#E8E6E1]", text: "text-[#6B6860]", dot: "bg-[#9E9C98]" };

            return (
              <div className="flex items-center gap-3 mb-6">
                {report.go_verdict?.trim() && (
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-widest ${style.bg} ${style.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                    {report.go_verdict.trim()}
                  </span>
                )}
                {report.composite_score != null && (
                  <span className="text-xs font-bold text-[#9E9C98] tracking-wide">
                    {report.composite_score.toFixed(1)}
                    <span className="font-medium text-[#D5D3CE]"> / 10</span>
                    <span className="ml-2 text-[#9E9C98]">KoreaScout Intelligence Score</span>
                  </span>
                )}
              </div>
            );
          })()}

          <div className="mt-6 bg-[#F8F7F4] rounded-2xl p-6 border border-[#E8E6E1]">
            <div className="flex flex-col space-y-3">
              {report.kr_price != null && (
                <div>
                  <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-2">
                    Retail Price (KR Market)
                  </p>
                  <div className="flex items-baseline flex-wrap">
                    <span className="text-2xl md:text-3xl font-black text-[#1A1916] leading-none tracking-tighter">
                      KRW {Number(report.kr_price).toLocaleString()}
                    </span>
                    {usdPrice && (
                      <>
                        <span className="text-2xl md:text-3xl font-light text-[#D5D3CE] mx-4 leading-none">
                          |
                        </span>
                        <span className="text-2xl md:text-3xl font-black text-[#1A1916] leading-none tracking-tighter">
                          USD {usdPrice}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-[#9E9C98] font-semibold mt-2">
                    {rateLoading
                      ? "Fetching live rate..."
                      : `Ex. Rate: ${exchangeRate.toLocaleString()} KRW/USD (Daily fixed at ${rateDate} 09:00 KST)`}
                  </p>
                </div>
              )}

              {report.estimated_cost_usd != null && (
                <p className="text-sm font-medium text-[#9E9C98]">
                  Est. Wholesale: ~${report.estimated_cost_usd}
                  <span className="text-[#D97706] text-xs ml-1">⚠ Estimated</span>
                </p>
              )}

              <a
                href="#section-6"
                className="inline-flex items-center gap-2 bg-white border border-[#E8E6E1] px-3 py-2 rounded-md hover:border-[#16A34A] transition-colors cursor-pointer group w-fit"
              >
                <Lock className="w-3.5 h-3.5 text-[#9E9C98] group-hover:text-[#16A34A] transition-colors shrink-0" />
                <span className="text-xs font-bold text-[#6B6860] group-hover:text-[#16A34A] transition-colors">
                  Alpha members get verified supplier quotes
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {report.viability_reason?.trim() && (
        <div className="mt-8 bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] border-l-4 border-l-[#16A34A] p-6">
          <p className="text-sm font-semibold text-[#16A34A] uppercase tracking-widest mb-2">
            Why It&apos;s Trending
          </p>
          <p className="text-base text-[#3D3B36] leading-relaxed">
            {report.viability_reason}
          </p>
        </div>
      )}
    </section>
  );
}
