"use client";

import { useState } from "react";
import { LineChart } from "lucide-react";
import { ScrollToIdButton } from "@/components/ScrollToIdButton";
import { LockedValue } from "@/components/ui/LockedValue";
import { isPositiveGrowth, parseGlobalPricesForGrid } from "./utils";
import type { ScoutFinalReportsRow } from "@/types/database";

function getShopeeOrLazadaName(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const hostname = new URL(url).hostname;
    if (hostname.includes("shopee.sg")) return "Shopee SG";
    if (hostname.includes("shopee.com.my")) return "Shopee MY";
    if (hostname.includes("lazada.sg")) return "Lazada SG";
    if (hostname.includes("lazada.com.my")) return "Lazada MY";
  } catch { return null; }
  return null;
}

function ListingsBlock({ row }: { row: import("./utils").RegionPriceRow }) {
  const [open, setOpen] = useState(false);

  const allListings = row.listings ?? [];
  const validListings = allListings.filter(l => l.price_usd && l.price_usd > 0 && (l as { sold_out?: boolean }).sold_out !== true);
  const soldOutListings = allListings.filter(l => (l as { sold_out?: boolean }).sold_out === true || (l.price_usd ?? 0) === 0);

  const officialListing = row.official_url
    ? allListings.find(l => l.url === row.official_url) ?? null
    : null;

  const nonOfficialListings = validListings.filter(l => l.url !== row.official_url);
  const cheapestListing = nonOfficialListings
    .sort((a, b) => (a.price_usd ?? 0) - (b.price_usd ?? 0))[0];
  const bestPriceListing = cheapestListing ?? officialListing;
  const showOfficialSeparately = !!(cheapestListing && officialListing && (row.official_price_usd ?? 0) > 0);
  const bestPriceDisplay = bestPriceListing?.price_usd
    ? `$${bestPriceListing.price_usd.toFixed(2)}`
    : row.priceDisplay;

  const seenKeys = new Set<string>();
  // cheapestListing과 officialListing key 미리 등록 (중복 방지)
  if (cheapestListing) {
    const name = cheapestListing.platform || getShopeeOrLazadaName(cheapestListing.url) || cheapestListing.title || "";
    seenKeys.add(`${name}__${cheapestListing.price_usd ?? 0}`);
  }
  if (officialListing) {
    const name = officialListing.platform || getShopeeOrLazadaName(officialListing.url) || officialListing.title || "";
    seenKeys.add(`${name}__${officialListing.price_usd ?? 0}`);
  }
  const otherValidListings = validListings
    .filter(l => l.url !== cheapestListing?.url && l.url !== row.official_url)
    .sort((a, b) => (a.price_usd ?? 0) - (b.price_usd ?? 0))
    .filter(l => {
      const name = l.platform || getShopeeOrLazadaName(l.url) || l.title || "";
      const key = `${name}__${l.price_usd ?? 0}`;
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });
  const moreSellersList = [...otherValidListings, ...soldOutListings];

  const reviewDisplay = (() => {
    const r = row.review_data?.trim();
    if (!r || r === "Untapped" || r === "Available") return null;
    if (/\d+(\.\d+)?\s*stars?/i.test(r)) return r;
    return null;
  })();

  const priceTextSize = "text-2xl font-extrabold text-[#1A1916] tracking-tight leading-none";

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10px] font-black tracking-[0.15em] uppercase text-[#9E9C98] mb-1">
          Best Price
        </p>
        <p className={priceTextSize}>{bestPriceDisplay ?? "—"}</p>
        {row.seller_type && row.seller_type !== "Untapped" && (
          <p className="text-xs text-[#9E9C98] mt-0.5">{row.seller_type}</p>
        )}
      </div>

      {showOfficialSeparately && officialListing && (row.official_price_usd ?? 0) > 0 && (
        <div className="pt-2 border-t border-[#E8E6E1]">
          <p className="text-[10px] font-black tracking-[0.15em] uppercase text-[#16A34A] mb-1">
            Official Store
          </p>
          <p className={priceTextSize}>
            ${row.official_price_usd!.toFixed(2)}
          </p>
          {officialListing.platform && (
            <p className="text-xs text-[#9E9C98] mt-0.5">{officialListing.platform}</p>
          )}
        </div>
      )}

      {moreSellersList.length > 0 && (
        <div className="pt-1">
          <button
            onClick={() => setOpen(v => !v)}
            className="text-xs font-semibold text-[#6B6860] hover:text-[#1A1916] transition-colors flex items-center gap-1"
          >
            <span>{open ? "▲" : "▼"}</span>
            <span>+ {moreSellersList.length} more sellers</span>
          </button>
          {open && (
            <div className="mt-2 space-y-1.5 border-t border-[#E8E6E1] pt-2">
              {moreSellersList.map((l, i) => {
                const soldOut = (l as { sold_out?: boolean }).sold_out === true || (l.price_usd ?? 0) === 0;
                const hasPrice = (l.price_usd ?? 0) > 0;
                return (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs text-[#6B6860] truncate max-w-[120px]">
                      {l.platform || getShopeeOrLazadaName(l.url) || l.title || "Unknown"}
                    </span>
                    <span className="text-xs font-bold text-[#1A1916] shrink-0 ml-2 flex items-center gap-1.5">
                      {soldOut && (
                        <span className="text-[9px] font-black tracking-widest uppercase text-[#9E9C98] bg-[#F8F7F4] border border-[#E8E6E1] px-1.5 py-0.5 rounded-full">
                          Sold Out
                        </span>
                      )}
                      {hasPrice && <span>${l.price_usd!.toFixed(2)}</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {reviewDisplay && (
        <p className="text-xs text-[#9E9C98] pt-1">{reviewDisplay}</p>
      )}
    </div>
  );
}

export function MarketIntelligence({
  report,
  tier,
  isTeaser,
}: {
  report: ScoutFinalReportsRow;
  tier: "free" | "standard" | "alpha";
  isTeaser: boolean;
}) {
  const estimatedCost = report.estimated_cost_usd ?? null;
  const profitMultiplier = report.profit_multiplier ?? null;
  const rows = parseGlobalPricesForGrid(report.global_prices, report.global_price as string | Record<string, unknown> | null | undefined);

  const pricedRows = rows.filter((r) => !r.isBlueOcean && r.priceDisplay);
  const parsedPrices = pricedRows
    .map((r) => parseFloat(r.priceDisplay?.replace(/[^0-9.]/g, "") ?? ""))
    .filter((n) => !isNaN(n) && n > 0);

  let globalValuation: number | null = null;
  const globalValuationLabel = "Avg. Global Retail";

  if (parsedPrices.length === 1) {
    globalValuation = parsedPrices[0];
  } else if (parsedPrices.length >= 2) {
    globalValuation = parsedPrices.reduce((a, b) => a + b, 0) / parsedPrices.length;
  } else if (estimatedCost && profitMultiplier) {
    globalValuation = estimatedCost * profitMultiplier;
  }

  const globalValuationDisplay = globalValuation ? `~$${globalValuation.toFixed(2)}` : "—";
  const hasProfitBlock = profitMultiplier || estimatedCost || globalValuation;

  const searchVolume = report.search_volume?.trim() || null;
  const momGrowth = report.mom_growth?.trim() || null;
  const wowRate = report.wow_rate?.trim() || null;
  const hasSearchGrowth = searchVolume || momGrowth || wowRate;

  const winningFeature = report.top_selling_point?.trim() || null;
  const painPoint = report.common_pain_point?.trim() || null;

  const isAlpha = tier === "alpha";
  const canSeeStandard = tier === "standard" || tier === "alpha" || isTeaser;

  return (
    <section
      id="section-3"
      className="scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]"
    >
      <h2 className="text-3xl font-bold text-[#1A1916] tracking-tight mb-6">
        Market Intelligence
      </h2>

      <div className="space-y-6">

        {hasProfitBlock && (
          <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 mb-6">
            <div style={{ marginBottom: "1.2cm" }}>
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-4 py-2 inline-flex items-center mb-2">
                <LockedValue locked={!canSeeStandard} tier="standard">
                  <p className="text-3xl font-extrabold text-[#16A34A] tracking-tight">
                    🔥 UP TO {String(profitMultiplier ?? "").replace(/[x×]/gi, "")}× MARGIN POTENTIAL
                  </p>
                </LockedValue>
              </div>
              <p className="text-base italic text-[#6B6860]">
                *Projected margin based on estimated KR wholesale cost and global market analysis.
              </p>
            </div>

            <div className="grid grid-cols-2">
              <div className="pr-8 border-r border-[#E8E6E1]">
                <p className="text-lg font-bold text-[#6B6860] uppercase tracking-widest" style={{ marginTop: "0.8cm" }}>
                  Est. Wholesale
                </p>
                <LockedValue locked={!canSeeStandard} tier="standard">
                  <p className="text-5xl font-extrabold text-[#1A1916] tracking-tighter" style={{ marginTop: "0.4cm" }}>
                    {estimatedCost ? `~$${estimatedCost}` : "—"}
                  </p>
                </LockedValue>
                <p className="text-xs text-[#9E9C98] mt-2">Est. KR Wholesale</p>
                <div style={{ marginTop: "0.6cm" }}>
                  {isAlpha ? (
                    <ScrollToIdButton sectionId="section-6" className="text-base font-bold text-[#16A34A] hover:underline transition-colors">
                      ✓ View Verified Supplier Cost ↓
                    </ScrollToIdButton>
                  ) : (
                    <button disabled className="inline-flex items-center gap-2 text-base font-bold text-[#9E9C98] cursor-not-allowed">
                      🔒 View Verified Supplier Cost
                      <span className="text-[10px] font-bold text-white bg-[#16A34A] rounded-full px-2 py-0.5">Alpha</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="pl-8">
                <p className="text-lg font-bold text-[#6B6860] uppercase tracking-widest" style={{ marginTop: "0.8cm" }}>
                  Global Valuation
                </p>
                <LockedValue locked={!canSeeStandard} tier="standard">
                  <p className="text-5xl font-extrabold text-[#16A34A] tracking-tighter" style={{ marginTop: "0.4cm" }}>
                    {globalValuationDisplay}
                  </p>
                </LockedValue>
                {parsedPrices.length >= 1 ? (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-[#16A34A]/80">Verified Market Price</p>
                    <p className="text-xs italic text-[#9E9C98] mt-0.5">Based on real-time commerce data.</p>
                  </div>
                ) : (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-[#16A34A]/80">Estimated Strategic Valuation</p>
                    <p className="text-xs italic text-[#9E9C98] mt-0.5">Calculated via KoreaScout Margin Multiplier.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {(() => {
          const findRow = (label: string) => rows.find((r) => r.label.toLowerCase() === label.toLowerCase());
          const sixMarkets: { code: string; label: string; row: (typeof rows)[number] | null }[] = [
            { code: "US", label: "North America", row: findRow("US") ?? null },
            { code: "UK", label: "United Kingdom", row: findRow("UK") ?? null },
            { code: "EU", label: "European Union", row: findRow("EU") ?? null },
            { code: "JP", label: "Japan", row: findRow("JP") ?? null },
            { code: "SEA", label: "Southeast Asia", row: findRow("SEA") ?? null },
            { code: "UAE", label: "Middle East", row: findRow("UAE") ?? null },
          ];

          return (
            <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-6 mb-6">
              <div className="flex items-baseline">
                <h3 className="text-xl font-bold text-[#1A1916]">Global Market Availability</h3>
                <span className="text-sm text-[#6B6860] font-normal ml-3">6 Strategic Markets for K-Products</span>
              </div>
              {report.best_platform?.trim() && (
                <p className="text-xs text-[#9E9C98] mt-1">
                  Best Entry: <span className="font-bold text-[#1A1916]">{report.best_platform}</span>
                </p>
              )}
              <LockedValue locked={!canSeeStandard} tier="standard">
                <div className="grid grid-cols-2 gap-x-16" style={{ marginTop: "1.2cm", rowGap: "1.2cm" }}>
                  {sixMarkets.map((market) => {
                  const isUntapped = !market.row || market.row.isBlueOcean;
                  return (
                    <div key={market.code} className="border-l-4 border-[#16A34A] pl-8 py-6 min-h-[150px]">
                      <p className="text-2xl font-extrabold text-[#6B6860] uppercase tracking-widest mb-3">
                        {market.code}
                        <span className="text-sm font-normal normal-case tracking-normal text-[#9E9C98] ml-2">{market.label}</span>
                      </p>
                      <div style={{ marginTop: "0.6cm" }}>
                        {isUntapped ? (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
                              <p className="text-sm font-semibold text-[#16A34A] tracking-widest uppercase">Untapped</p>
                            </div>
                            <p className="text-xs italic text-[#9E9C98]">No established sellers detected.</p>
                          </>
                        ) : (
                          !isUntapped && market.row && (
                            <ListingsBlock row={market.row} />
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
                </div>
              </LockedValue>
              <div style={{ marginTop: "2.5cm" }}>
                <div className="border-t border-[#E8E6E1] pt-6">
                  <p className="text-base italic text-[#6B6860]">
                    ● Untapped = No established sellers detected. <span className="text-sm">* Data may vary based on real-time market changes.</span>
                  </p>
                  <ScrollToIdButton sectionId="global-market-proof" className="text-base font-bold text-[#16A34A] hover:underline transition-colors block mt-[0.6cm]">
                    Analyze Pricing Sources &amp; Entry Points ↓
                  </ScrollToIdButton>
                </div>
              </div>
            </div>
          );
        })()}

        {(hasSearchGrowth || winningFeature || painPoint) && (
          <div className="bg-[#F8F7F4] rounded-3xl p-12">
            <div className="grid grid-cols-2 gap-x-24 mt-6">
              {hasSearchGrowth && (
                <div>
                  <h3 className="text-xl font-bold text-[#1A1916] mb-12">Search &amp; Growth</h3>
                  {searchVolume && (
                    <div className="mb-16">
                      <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">SEARCH VOLUME</p>
                      <LockedValue locked={!canSeeStandard} tier="standard">
                        <p className="text-4xl font-extrabold text-[#1A1916]">{searchVolume}</p>
                      </LockedValue>
                    </div>
                  )}
                  {momGrowth && (
                    <div className="mb-16">
                      <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">MoM GROWTH</p>
                      <LockedValue locked={!canSeeStandard} tier="standard">
                        {momGrowth.length <= 10 ? (
                          <p className={`text-4xl font-extrabold ${isPositiveGrowth(momGrowth) ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                            {momGrowth} <span className="text-3xl">{isPositiveGrowth(momGrowth) ? "↑" : "↓"}</span>
                          </p>
                        ) : (
                          <p className={`text-lg font-medium leading-relaxed ${isPositiveGrowth(momGrowth) ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                            {momGrowth}
                          </p>
                        )}
                      </LockedValue>
                    </div>
                  )}
                  {wowRate && wowRate !== "N/A" && (
                    <div className="mb-16">
                      <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">WoW GROWTH</p>
                      <LockedValue locked={!canSeeStandard} tier="standard">
                        {wowRate.length <= 10 ? (
                          <p className={`text-4xl font-extrabold ${isPositiveGrowth(wowRate) ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                            {wowRate} <span className="text-3xl">{isPositiveGrowth(wowRate) ? "↑" : "↓"}</span>
                          </p>
                        ) : (
                          <p className={`text-lg font-medium leading-relaxed ${isPositiveGrowth(wowRate) ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                            {wowRate}
                          </p>
                        )}
                      </LockedValue>
                    </div>
                  )}
                </div>
              )}
              {(winningFeature || painPoint) && (
                <div>
                  <h3 className="text-xl font-bold text-[#1A1916] mb-12">Analyst Brief</h3>
                  <div className="border-l-4 border-[#16A34A] pl-8 py-2">
                    {winningFeature && (
                      <div>
                        <p className="text-sm font-bold text-[#6B6860] uppercase tracking-widest mb-4">Competitive Edge</p>
                        <LockedValue locked={!canSeeStandard} tier="standard">
                          <p className="text-lg text-[#1A1916] leading-relaxed mb-16">{winningFeature}</p>
                        </LockedValue>
                      </div>
                    )}
                    {painPoint && (
                      <div>
                        <p className="text-sm font-bold text-[#6B6860] uppercase tracking-widest mb-4 mt-8">Risk Factor</p>
                        <LockedValue locked={!canSeeStandard} tier="standard">
                          <p className="text-lg text-[#1A1916] leading-relaxed mb-16">{painPoint}</p>
                        </LockedValue>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-[#E8E6E1] pt-6 mt-8" />
            <p className="text-sm italic text-[#6B6860] text-center w-full mt-2">
              Powered by KoreaScout&apos;s proprietary Gap Index engine, synthesizing 50+ cross-border signals across 12 demand variables.
              <br />
              Your sourcing decisions are backed by live market calculations, not a hunch.
            </p>
          </div>
        )}

      </div>

      <div className="mt-6 pt-4 border-t border-[#E8E6E1]/50 flex flex-wrap items-start gap-1.5">
        <LineChart className="w-3 h-3 text-[#9E9C98]/60 shrink-0" />
        <span className="text-[10px] text-[#9E9C98]/60 uppercase tracking-widest font-medium">
          Real-time Market Radar:
        </span>
        <span className="w-full text-[10px] text-[#9E9C98]/50 tracking-wide">
          Americas & Europe — Amazon (US · UK · DE · FR) · Sephora · YesStyle · Stylevana · StyleKorean
        </span>
        <span className="w-full text-[10px] text-[#9E9C98]/50 tracking-wide">
          Japan & Southeast Asia — Qoo10 · Rakuten · @cosme · Shopee · Lazada · Tokopedia
        </span>
        <span className="w-full text-[10px] text-[#9E9C98]/50 tracking-wide">
          Middle East — Amazon AE · Noon · Namshi · Boutiqaat · Carrefour UAE · Olive Young Global · Lamise Beauty
        </span>
      </div>
    </section>
  );
}
