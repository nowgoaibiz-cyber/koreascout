# global_prices Full Audit: Admin → DB → Frontend

## STEP 1 — Full file contents

---

### components/admin/GlobalPricesHelper.tsx

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";

// ——— Types ———
type ListingItem = {
  platform?: string;
  price_usd?: number;
  url?: string;
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
  us_uk_eu?: { us?: RegionDataLike; gb?: RegionDataLike; [k: string]: unknown };
  jp_sea?: { jp?: RegionDataLike; sea?: RegionDataLike; [k: string]: unknown };
  uae?: { uae?: RegionDataLike; [k: string]: unknown };
  shopee_lazada?: RegionDataLike;
  [k: string]: unknown;
};

const REGIONS: Array<{ key: string; flag: string; name: string }> = [
  { key: "us", flag: "🇺🇸", name: "US" },
  { key: "gb", flag: "🇬🇧", name: "UK" },
  { key: "jp", flag: "🇯🇵", name: "Japan" },
  { key: "sea", flag: "🇸🇬", name: "SEA" },
  { key: "uae", flag: "🇦🇪", name: "UAE" },
  { key: "shopee_lazada", flag: "🛍", name: "Shopee/Lazada" },
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
  if (regionKey === "gb") return data.us_uk_eu?.gb;
  if (regionKey === "jp") return data.jp_sea?.jp;
  if (regionKey === "sea") return data.jp_sea?.sea;
  if (regionKey === "uae") return data.uae?.uae;
  return undefined;
}

function getRegionListings(data: GlobalPricesLike, regionKey: string): ListingItem[] {
  const region = getRegionData(data, regionKey);
  const list = region?.listings;
  if (!Array.isArray(list)) return [];
  return list.map((l) => {
    if (l && typeof l === "object" && !Array.isArray(l)) {
      const o = l as Record<string, unknown>;
      return {
        platform: typeof o.platform === "string" ? o.platform : "",
        price_usd: typeof o.price_usd === "number" ? o.price_usd : 0,
        url: typeof o.url === "string" ? o.url : "",
      };
    }
    return { platform: "", price_usd: 0, url: "" };
  });
}

/** First listing (in array order) with price_usd > 0 is the Best price for the badge. */
function getBestPrice(listings: ListingItem[]): number | null {
  const first = listings.find((l) => (l.price_usd ?? 0) > 0);
  return first != null && first.price_usd != null && first.price_usd > 0
    ? first.price_usd
    : null;
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

function setRegionListings(
  data: GlobalPricesLike,
  regionKey: string,
  listings: ListingItem[]
): GlobalPricesLike {
  const next = JSON.parse(JSON.stringify(data)) as GlobalPricesLike;
  if (regionKey === "shopee_lazada") {
    if (!next.shopee_lazada) next.shopee_lazada = {};
    next.shopee_lazada.listings = listings;
    return next;
  }
  if (regionKey === "us") {
    if (!next.us_uk_eu) next.us_uk_eu = {};
    if (!next.us_uk_eu.us) next.us_uk_eu.us = {};
    next.us_uk_eu.us.listings = listings;
    return next;
  }
  if (regionKey === "gb") {
    if (!next.us_uk_eu) next.us_uk_eu = {};
    if (!next.us_uk_eu.gb) next.us_uk_eu.gb = {};
    next.us_uk_eu.gb.listings = listings;
    return next;
  }
  if (regionKey === "jp") {
    if (!next.jp_sea) next.jp_sea = {};
    if (!next.jp_sea.jp) next.jp_sea.jp = {};
    next.jp_sea.jp.listings = listings;
    return next;
  }
  if (regionKey === "sea") {
    if (!next.jp_sea) next.jp_sea = {};
    if (!next.jp_sea.sea) next.jp_sea.sea = {};
    next.jp_sea.sea.listings = listings;
    return next;
  }
  if (regionKey === "uae") {
    if (!next.uae) next.uae = {};
    if (!next.uae.uae) next.uae.uae = {};
    next.uae.uae.listings = listings;
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
  /** Sold Out is UI-only: key = regionKey, value = per-listing booleans. Not saved to JSON. */
  const [soldOutByRegion, setSoldOutByRegion] = useState<Record<string, (boolean | undefined)[]>>({});

  useEffect(() => {
    setData(parseValue(value));
  }, [value]);

  const getSoldOut = useCallback(
    (regionKey: string, originalIndex: number, price: number): boolean => {
      const arr = soldOutByRegion[regionKey];
      if (arr && originalIndex < arr.length && arr[originalIndex] !== undefined)
        return arr[originalIndex] as boolean;
      return price === 0;
    },
    [soldOutByRegion]
  );

  const setSoldOut = useCallback((regionKey: string, originalIndex: number, checked: boolean) => {
    setSoldOutByRegion((prev) => {
      const arr = [...(prev[regionKey] ?? [])];
      while (arr.length <= originalIndex) arr.push(undefined);
      arr[originalIndex] = checked;
      return { ...prev, [regionKey]: arr };
    });
  }, []);

  const removeSoldOutIndex = useCallback((regionKey: string, index: number) => {
    setSoldOutByRegion((prev) => {
      const arr = (prev[regionKey] ?? []).filter((_, i) => i !== index);
      return { ...prev, [regionKey]: arr };
    });
  }, []);

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
      updateRegionListings(regionKey, (list) => [
        ...list,
        { platform: "", price_usd: 0, url: "" },
      ]);
    },
    [updateRegionListings]
  );

  const deleteListing = useCallback(
    (regionKey: string, index: number) => {
      removeSoldOutIndex(regionKey, index);
      updateRegionListings(regionKey, (list) => list.filter((_, i) => i !== index));
    },
    [updateRegionListings, removeSoldOutIndex]
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
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F8F7F4] border-b border-[#E8E6E1]">
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

            {/* Listings — always expanded */}
            {sorted.map((listing, idx) => {
              const price = listing.price_usd ?? 0;
              const isBest = hasAnyPrice && idx === bestIdx;
              const isZero = price === 0;
              const originalIndex = listings.findIndex((l) => l === listing);

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
                      checked={getSoldOut(regionKey, originalIndex, price)}
                      onChange={(e) => setSoldOut(regionKey, originalIndex, e.target.checked)}
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
                    onClick={() => deleteListing(regionKey, originalIndex)}
                    className="text-[#9E9C98] hover:text-[#1A1916] text-sm px-1.5 py-1 rounded transition-colors bg-transparent border-none cursor-pointer flex-shrink-0"
                    aria-label="Delete"
                  >
                    🗑
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => addListing(regionKey)}
              className="text-xs text-[#16A34A] hover:text-[#15803D] px-4 py-2 text-left bg-transparent border-none cursor-pointer w-full"
            >
              + Add listing
            </button>
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

---

### components/report/SupplierContact.tsx

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { ArrowRight, ArrowUpRight, Download, ExternalLink, Film, Globe, Globe2, ImageIcon, LayoutTemplate, Mail, Phone, Play, ShoppingBag } from "lucide-react";
import type { ScoutFinalReportsRow } from "@/types/database";
import { getAiDetailUrl } from "./utils";

export function SupplierContact({
  report,
  tier,
  isTeaser,
}: {
  report: ScoutFinalReportsRow;
  tier: "free" | "standard" | "alpha";
  isTeaser: boolean;
}) {
  const canSeeAlpha = tier === "alpha" || isTeaser;
  const hasSupplierFields =
    (report.m_name && report.m_name.trim()) ||
    (report.corporate_scale && report.corporate_scale.trim()) ||
    (report.contact_email && report.contact_email.trim()) ||
    (report.contact_phone && report.contact_phone.trim()) ||
    (report.m_homepage && report.m_homepage.trim()) ||
    (report.naver_link && report.naver_link.trim()) ||
    (report.wholesale_link && report.wholesale_link?.trim()) ||
    (report.sourcing_tip && report.sourcing_tip.trim());

  if (!hasSupplierFields && !canSeeAlpha) return null;

  const verifiedCostUsd = report.verified_cost_usd ?? null;
  const verifiedCostNote = report.verified_cost_note?.trim()?.toLowerCase() ?? null;
  const isUndisclosed = verifiedCostNote === "undisclosed";
  const costNum =
    verifiedCostUsd != null && verifiedCostUsd !== ""
      ? parseFloat(String(verifiedCostUsd))
      : NaN;
  const hasVerifiedPrice = !Number.isNaN(costNum);

  const viralUrl = report.viral_video_url?.trim() || null;
  const videoUrl = report.video_url?.trim() || null;
  const aiDetailUrl = getAiDetailUrl(report.ai_detail_page_links as string | unknown[] | Record<string, unknown> | null);
  const marketingUrl = report.marketing_assets_url?.trim() || null;
  const aiImageUrl = report.ai_image_url?.trim() || null;

  let rawPrices: Record<string, { url?: string; platform?: string }> = {};
  try {
    const raw = report.global_prices;
    if (typeof raw === "string") {
      const once = JSON.parse(raw);
      rawPrices = typeof once === "string" ? JSON.parse(once) : (once as typeof rawPrices);
    } else if (raw && typeof raw === "object") {
      rawPrices = raw as typeof rawPrices;
    }
  } catch {
    // ignore
  }
  const hasNested = "us_uk_eu" in rawPrices || "jp_sea" in rawPrices || "uae" in rawPrices;
  if (hasNested) {
    const usUkEu = rawPrices["us_uk_eu"] as { us?: { url?: string; platform?: string }; uk?: { url?: string; platform?: string }; eu?: { url?: string; platform?: string } } | undefined;
    const jpSea = rawPrices["jp_sea"] as { jp?: { url?: string; platform?: string }; sea?: { url?: string; platform?: string } } | undefined;
    const uaeVal = rawPrices["uae"] as { uae?: { url?: string; platform?: string } } | undefined;
    // shopee_lazada listings를 sea listings에 병합 후 최저가 URL로 sea.url 업데이트
    const shopeeData = rawPrices["shopee_lazada"] as { price_usd?: number; url?: string; listings?: Array<{ price_usd?: number; url?: string; platform?: string; title?: string }> } | undefined;
    const seaBase = jpSea?.sea as { url?: string; platform?: string; price_usd?: number; listings?: Array<{ price_usd?: number; url?: string; platform?: string }> } | undefined;

    // 기존 SEA + shopee_lazada listings 합산 후 최저가 URL 선택
    const mergedSeaListings = [
      ...(seaBase?.listings ?? []),
      ...(shopeeData?.listings ?? []),
    ];
    const bestSeaListing = mergedSeaListings
      .filter(l => l.price_usd && l.price_usd > 0)
      .sort((a, b) => (a.price_usd ?? 0) - (b.price_usd ?? 0))[0];

    const seaMerged = {
      ...(seaBase ?? {}),
      url: bestSeaListing?.url ?? seaBase?.url ?? shopeeData?.url ?? undefined,
      platform: bestSeaListing?.platform ?? seaBase?.platform ?? undefined,
      listings: mergedSeaListings,
    };

    rawPrices = {
      ...Object.fromEntries(Object.entries(rawPrices).filter(([k]) => k !== "us_uk_eu" && k !== "jp_sea" && k !== "uae" && k !== "shopee_lazada")),
      us: usUkEu?.us,
      uk: usUkEu?.uk,
      eu: usUkEu?.eu,
      jp: jpSea?.jp,
      sea: seaMerged,
      uae: uaeVal?.uae,
    } as Record<string, { url?: string; platform?: string }>;
  }
  const regionsList = [
    { id: "us", name: "US" },
    { id: "uk", name: "UK" },
    { id: "sea", name: "SEA" },
    { id: "australia", name: "AU" },
    { id: "india", name: "IN" },
    { id: "eu", name: "EU" },
    { id: "jp", name: "JP" },
    { id: "uae", name: "UAE" },
  ];
  type ProofListing = { platform?: string; title?: string; price_usd?: number; url?: string };
  type ProofTag = { region: string; url: string; platform?: string; listings?: ProofListing[] };
  const globalProofTags: ProofTag[] = regionsList
    .map((r) => {
      const regionData = rawPrices[r.id] as { url?: string; platform?: string; listings?: ProofListing[] } | undefined;
      if (!regionData?.url?.startsWith("http")) return null;
      return {
        region: r.name,
        url: regionData.url,
        platform: regionData.platform?.trim() || undefined,
        listings: regionData.listings ?? [],
      };
    })
    .filter((t): t is ProofTag => t !== null);

  const assetCards = [
    viralUrl && {
      id: "viral",
      platform: "Viral" as const,
      title: "Viral Reference",
      description: "Korean TikTok/Reels success case. Study the hook.",
      href: viralUrl,
      ctaText: "Watch Original",
      isPrimary: true,
      icon: <Play className="w-32 h-32 text-[#1A1916]" />,
      hoverIcon: <Play className="w-5 h-5 text-[#1A1916]" />,
    },
    videoUrl && {
      id: "video",
      platform: "Video" as const,
      title: "Raw Ad Footage",
      description: "Unedited footage ready for your market adaptation.",
      href: videoUrl,
      ctaText: "Watch & Download",
      isPrimary: false,
      icon: <Film className="w-32 h-32 text-[#1A1916]" />,
      hoverIcon: <Download className="w-5 h-5 text-[#1A1916]" />,
    },
    aiDetailUrl && {
      id: "ai-landing",
      platform: "AI Page" as const,
      title: "AI Landing Page",
      description: "Opal-generated A/B product page drafts.",
      href: aiDetailUrl,
      ctaText: "Open Page",
      isPrimary: false,
      icon: <LayoutTemplate className="w-32 h-32 text-[#1A1916]" />,
      hoverIcon: <ExternalLink className="w-5 h-5 text-[#1A1916]" />,
    },
    marketingUrl && {
      id: "brand-asset",
      platform: "Assets" as const,
      title: "Brand Asset Kit",
      description: "High-res model shots and product imagery from the manufacturer.",
      href: marketingUrl,
      ctaText: "Access Assets",
      isPrimary: false,
      icon: <ImageIcon className="w-32 h-32 text-[#1A1916]" />,
      hoverIcon: <ArrowRight className="w-5 h-5 text-[#1A1916]" />,
    },
    aiImageUrl && {
      id: "ai-image",
      platform: "AI Image" as const,
      title: "AI Product Image",
      description: "AI-generated product image. Open or download.",
      href: aiImageUrl,
      ctaText: "Open / Download",
      isPrimary: false,
      icon: <ImageIcon className="w-32 h-32 text-[#1A1916]" />,
      hoverIcon: <Download className="w-5 h-5 text-[#1A1916]" />,
    },
  ].filter(Boolean) as Array<{
    id: string;
    platform: string;
    title: string;
    description: string;
    href: string;
    ctaText: string;
    isPrimary: boolean;
    icon: React.ReactNode;
    hoverIcon: React.ReactNode;
  }>;

  const refA = "text-xl font-bold text-[#1A1916] mb-10";
  const refB = "text-sm font-bold text-[#6B6860] tracking-widest mb-4";
  const refC = "text-base text-[#3D3B36] leading-relaxed opacity-90";

  return (
    <section className="bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
      {canSeeAlpha && (
        <>
          <div>
            <h2 className="text-3xl font-bold text-[#1A1916] mb-4 tracking-tight">Launch & Execution Kit</h2>
            <p className="text-sm text-[#6B6860] leading-relaxed mt-1">
              From product discovery to live campaign — everything you need.
            </p>
          </div>

          <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-6 mt-6">
            <p className={refA}>Financial Briefing</p>
            <div className="mb-10">
              <p className={refB}>Cost Per Unit</p>
              {hasVerifiedPrice && !isUndisclosed ? (
                <>
                  <p className="font-black tracking-tighter text-[#1A1916] leading-none" style={{ fontSize: "80px" }}>
                    ${costNum.toFixed(2)}
                  </p>
                  {report.verified_at && (
                    <p className="text-xs italic text-[#9E9C98] mt-3">
                      Verified by KoreaScout on{" "}
                      {new Date(report.verified_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </>
              ) : verifiedCostUsd != null && verifiedCostUsd !== "" && isUndisclosed ? (
                <p className="text-sm italic text-[#6B6860]">
                  Pricing verified and on file. Contact the manufacturer directly or use the broker email in Section 5.
                </p>
              ) : (
                <p className="text-sm italic text-[#9E9C98]">Not available</p>
              )}
            </div>
            {(report.moq?.trim() || report.lead_time?.trim() || report.can_oem != null) && (
              <div className="flex gap-32 mt-10">
                {report.moq?.trim() && (
                  <div>
                    <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">MOQ</p>
                    <p className="text-4xl font-black tracking-tighter text-[#1A1916]">{report.moq}</p>
                  </div>
                )}
                <div className="flex items-start gap-10">
                  {report.lead_time?.trim() && (
                    <div>
                      <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">Est. Production Lead Time</p>
                      <p className="text-4xl font-black tracking-tighter text-[#1A1916]">{report.lead_time}</p>
                    </div>
                  )}
                  {report.can_oem != null && (
                    <div>
                      <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">OEM / ODM</p>
                      <p className="text-4xl font-black tracking-tighter text-[#1A1916]">
                        {report.can_oem ? "Available" : "Not Available"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-6">
            <p className={refA}>Supplier &amp; Brand Intel</p>
            {report.m_name?.trim() && (
              <div className="mb-8">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <p className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                    {report.translated_name?.split(" ")[0]?.toUpperCase() ?? report.m_name}
                    <span className="text-5xl font-black text-[#1A1916] ml-3">
                    <span className="font-thin text-[#9E9C98] mx-2">|</span>
                    {report.m_name}
                  </span>
                  </p>
                  {report.corporate_scale?.trim() && (
                    <p className="text-lg font-medium text-[#9E9C98]">
                      {(() => {
                        const scaleMap: Record<string, string> = {
                          "중소기업": "SME",
                          "대기업": "Enterprise",
                          "스타트업": "Startup",
                          "중견기업": "Mid-size",
                        };
                        return scaleMap[report.corporate_scale!.trim()] ?? report.corporate_scale;
                      })()}
                    </p>
                  )}
                </div>
              </div>
            )}
            {(() => {
              const contacts = [
                report.contact_email?.trim() && {
                  id: "email",
                  icon: <Mail className="w-8 h-8 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                  label: report.contact_email!.trim(),
                  href: `mailto:${report.contact_email!.trim()}`,
                  external: false as const,
                },
                report.contact_phone?.trim() && {
                  id: "phone",
                  icon: <Phone className="w-8 h-8 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                  label: report.contact_phone!.trim(),
                  href: `tel:${report.contact_phone!.trim()}`,
                  external: false as const,
                },
                report.m_homepage?.trim() && {
                  id: "website",
                  icon: <Globe className="w-8 h-8 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                  label: "Website",
                  href: report.m_homepage!.trim(),
                  external: true as const,
                },
                report.wholesale_link?.trim() && {
                  id: "wholesale",
                  icon: <ShoppingBag className="w-8 h-8 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                  label: "Wholesale Portal",
                  href: report.wholesale_link!.trim(),
                  external: true as const,
                },
                report.global_site_url?.trim() && {
                  id: "global_site",
                  icon: <Globe2 className="w-8 h-8 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                  label: "Global Site",
                  href: report.global_site_url!.trim(),
                  external: true as const,
                },
                report.b2b_inquiry_url?.trim() && {
                  id: "b2b_inquiry",
                  icon: <ArrowUpRight className="w-8 h-8 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                  label: "B2B Inquiry",
                  href: report.b2b_inquiry_url!.trim(),
                  external: true as const,
                },
              ].filter(Boolean) as Array<{ id: string; icon: React.ReactNode; label: string; href: string; external: boolean }>;

              if (contacts.length === 0) return null;
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {contacts.map((contact, i) => (
                    <a
                      key={contact.id}
                      href={contact.href}
                      target={contact.external ? "_blank" : undefined}
                      rel={contact.external ? "noopener noreferrer" : undefined}
                      className={`flex items-center gap-5 bg-white border-2 border-[#E8E6E1] rounded-2xl p-8 hover:border-[#16A34A] transition-colors group ${contacts.length === 3 && i === 2 ? "col-span-1 sm:col-span-2" : ""}`}
                    >
                      {contact.icon}
                      <span className="text-xl font-bold text-[#1A1916] truncate">{contact.label}</span>
                    </a>
                  ))}
                </div>
              );
            })()}
            {(report.sample_policy?.trim() || report.export_cert_note?.trim()) && (
              <div className="border-t border-[#E8E6E1] pt-8 space-y-5">
                {report.sample_policy?.trim() && (
                  <div>
                    <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">Sample Policy</p>
                    <p className="text-sm font-medium text-[#1A1916] leading-relaxed">{report.sample_policy}</p>
                  </div>
                )}
                {report.export_cert_note?.trim() && (
                  <div>
                    <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">Compliance Note</p>
                    <p className="text-sm font-medium text-[#1A1916] leading-relaxed">{report.export_cert_note}</p>
                  </div>
                )}
              </div>
            )}
            {globalProofTags.length > 0 && (
              <div id="global-market-proof" className="border-t border-[#E8E6E1] pt-8 mt-8 scroll-mt-[160px]">
                <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-6">Global Market Proof</p>
                <GlobalProofAccordion tags={globalProofTags} />
              </div>
            )}
          </div>

          {assetCards.length > 0 && (
            <div className="bg-[#F8F7F4] rounded-2xl p-10">
              <p className={refA}>Creative Assets</p>
              <div className="grid grid-cols-2 gap-6">
                {assetCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white rounded-2xl border border-[#E8E6E1] overflow-hidden group hover:border-[#16A34A] transition-all duration-300 hover:shadow-[0_4px_20px_0_rgb(22_163_74/0.1)]"
                  >
                    <div className="aspect-video bg-[#F8F7F4] relative flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 text-[#1A1916] opacity-5 flex items-center justify-center">{card.icon}</div>
                      </div>
                      {card.platform && (
                        <span className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold rounded px-2 py-1 uppercase tracking-wide z-10">
                          {card.platform}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-[#16A34A]/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                          {card.hoverIcon}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-xl font-bold text-[#1A1916] mb-2">{card.title}</p>
                      <p className={`${refC} mb-6`}>{card.description}</p>
                      <a
                        href={card.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors duration-200 ${
                          card.isPrimary ? "bg-[#1A1916] text-white hover:bg-[#2D2B26]" : "bg-white border border-[#E8E6E1] text-[#1A1916] hover:border-[#1A1916]"
                        }`}
                      >
                        {card.ctaText}
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function getShopeeOrLazadaLabel(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const h = new URL(url).hostname;
    if (h.includes("shopee.sg")) return "Shopee SG";
    if (h.includes("shopee.com.my")) return "Shopee MY";
    if (h.includes("lazada.sg")) return "Lazada SG";
    if (h.includes("lazada.com.my")) return "Lazada MY";
  } catch { return null; }
  return null;
}

function getPlatformLabel(l: { platform?: string | null; title?: string | null; url?: string | null }): string {
  if (l.platform) return l.platform;
  const sl = getShopeeOrLazadaLabel(l.url ?? null);
  if (sl) return sl;
  if (l.url) {
    try {
      return new URL(l.url).hostname.replace("www.", "");
    } catch { /* ignore */ }
  }
  return l.title || "Unknown";
}

function GlobalProofAccordion({ tags }: { tags: Array<{ region: string; url: string; platform?: string; listings?: Array<{ platform?: string; title?: string; price_usd?: number; url?: string }> }> }) {
  const [openRegion, setOpenRegion] = useState<string | null>(null);
  const toggle = (region: string) => setOpenRegion(prev => prev === region ? null : region);

  return (
    <div className="space-y-3">
      {tags.map((tag) => {
        const isOpen = openRegion === tag.region;

        // 1. 중복 제거 (platform명 + price_usd 기준)
        const seenKeys = new Set<string>();
        const deduped = (tag.listings ?? [])
          .filter(l => l.url?.startsWith("http"))
          .filter(l => {
            const name = getPlatformLabel(l);
            const key = `${name}__${l.price_usd ?? 0}`;
            if (seenKeys.has(key)) return false;
            seenKeys.add(key);
            return true;
          });

        // 2. 정렬: price_usd > 0 오름차순, 0은 맨 아래
        const sortedListings = [
          ...deduped.filter(l => (l.price_usd ?? 0) > 0).sort((a, b) => (a.price_usd ?? 0) - (b.price_usd ?? 0)),
          ...deduped.filter(l => (l.price_usd ?? 0) === 0),
        ];

        const sellerCount = sortedListings.length;

        return (
          <div key={tag.region} className="bg-white rounded-xl border border-[#E8E6E1] overflow-hidden transition-all">
            {/* 헤더 */}
            <button
              onClick={() => toggle(tag.region)}
              className="w-full flex items-center justify-between p-5 hover:bg-[#F8F7F4] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <span className="bg-[#1A1916] text-white px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-widest shrink-0">
                  {tag.region}
                </span>
                {tag.platform && (
                  <span className="text-sm font-bold text-[#1A1916] truncate">{tag.platform}</span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                {sellerCount > 0 && (
                  <span className="text-xs text-[#9E9C98]">{sellerCount} seller{sellerCount > 1 ? "s" : ""}</span>
                )}
                <span className="text-[#9E9C98] group-hover:text-[#1A1916] transition-colors text-sm">
                  {isOpen ? "▲" : "▼"}
                </span>
              </div>
            </button>

            {/* 펼쳐진 listings */}
            {isOpen && (
              <div className="border-t border-[#E8E6E1] divide-y divide-[#E8E6E1]/60">
                {sortedListings.length > 0 ? sortedListings.map((l, i) => {
                  const isSoldOut = (l.price_usd ?? 0) === 0;
                  return (
                    <a
                      key={i}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-[#F8F7F4] transition-colors group/row"
                    >
                      <span className="text-sm font-medium text-[#1A1916] truncate">
                        {getPlatformLabel(l)}
                      </span>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {isSoldOut ? (
                          <span className="text-[9px] font-black tracking-widest uppercase text-[#9E9C98] bg-[#F8F7F4] border border-[#E8E6E1] px-2 py-0.5 rounded-full">
                            Sold Out
                          </span>
                        ) : (
                          <span className="text-sm font-bold text-[#1A1916]">
                            ${l.price_usd!.toFixed(2)}
                          </span>
                        )}
                        <ArrowUpRight className="w-4 h-4 text-[#9E9C98] group-hover/row:text-[#1A1916] transition-colors" />
                      </div>
                    </a>
                  );
                }) : (
                  <a
                    href={tag.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-[#F8F7F4] transition-colors group/row"
                  >
                    <span className="text-sm font-medium text-[#1A1916]">{tag.platform || tag.region}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#9E9C98] group-hover/row:text-[#1A1916] transition-colors" />
                  </a>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

---

### components/report/MarketIntelligence.tsx

```tsx
"use client";

import { useState } from "react";
import { LineChart } from "lucide-react";
import { ScrollToIdButton } from "@/components/ScrollToIdButton";
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
  const validListings = allListings.filter(l => l.price_usd && l.price_usd > 0);

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
  const otherListings = validListings
    .filter(l => l.url !== cheapestListing?.url && l.url !== row.official_url)
    .sort((a, b) => (a.price_usd ?? 0) - (b.price_usd ?? 0))
    .filter(l => {
      const name = l.platform || getShopeeOrLazadaName(l.url) || l.title || "";
      const key = `${name}__${l.price_usd ?? 0}`;
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });

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

      {otherListings.length > 0 && (
        <div className="pt-1">
          <button
            onClick={() => setOpen(v => !v)}
            className="text-xs font-semibold text-[#6B6860] hover:text-[#1A1916] transition-colors flex items-center gap-1"
          >
            <span>{open ? "▲" : "▼"}</span>
            <span>+ {otherListings.length} more sellers</span>
          </button>
          {open && (
            <div className="mt-2 space-y-1.5 border-t border-[#E8E6E1] pt-2">
              {otherListings.map((l, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-[#6B6860] truncate max-w-[120px]">
                    {l.platform || getShopeeOrLazadaName(l.url) || l.title || "Unknown"}
                  </span>
                  <span className="text-xs font-bold text-[#1A1916] shrink-0 ml-2">
                    ${l.price_usd?.toFixed(2)}
                  </span>
                </div>
              ))}
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
                <p className="text-3xl font-extrabold text-[#16A34A] tracking-tight">
                  🔥 UP TO {String(profitMultiplier ?? "").replace(/[x×]/gi, "")}× MARGIN POTENTIAL
                </p>
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
                <p className="text-5xl font-extrabold text-[#1A1916] tracking-tighter" style={{ marginTop: "0.4cm" }}>
                  {estimatedCost ? `~$${estimatedCost}` : "—"}
                </p>
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
                <p className="text-5xl font-extrabold text-[#16A34A] tracking-tighter" style={{ marginTop: "0.4cm" }}>
                  {globalValuationDisplay}
                </p>
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
                      <p className="text-4xl font-extrabold text-[#1A1916]">{searchVolume}</p>
                    </div>
                  )}
                  {momGrowth && (
                    <div className="mb-16">
                      <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">MoM GROWTH</p>
                      {momGrowth.length <= 10 ? (
                        <p className={`text-4xl font-extrabold ${isPositiveGrowth(momGrowth) ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                          {momGrowth} <span className="text-3xl">{isPositiveGrowth(momGrowth) ? "↑" : "↓"}</span>
                        </p>
                      ) : (
                        <p className={`text-lg font-medium leading-relaxed ${isPositiveGrowth(momGrowth) ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                          {momGrowth}
                        </p>
                      )}
                    </div>
                  )}
                  {wowRate && wowRate !== "N/A" && (
                    <div className="mb-16">
                      <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">WoW GROWTH</p>
                      {wowRate.length <= 10 ? (
                        <p className={`text-4xl font-extrabold ${isPositiveGrowth(wowRate) ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                          {wowRate} <span className="text-3xl">{isPositiveGrowth(wowRate) ? "↑" : "↓"}</span>
                        </p>
                      ) : (
                        <p className={`text-lg font-medium leading-relaxed ${isPositiveGrowth(wowRate) ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                          {wowRate}
                        </p>
                      )}
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
                        <p className="text-lg text-[#1A1916] leading-relaxed mb-16">{winningFeature}</p>
                      </div>
                    )}
                    {painPoint && (
                      <div>
                        <p className="text-sm font-bold text-[#6B6860] uppercase tracking-widest mb-4 mt-8">Risk Factor</p>
                        <p className="text-lg text-[#1A1916] leading-relaxed mb-16">{painPoint}</p>
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
```

---

### components/report/utils.ts

```ts
import { SHIPPING_TIER_TOOLTIP } from "./constants";

const GLOBAL_REGIONS = [
  { key: "us", flag: "🇺🇸", label: "US" },
  { key: "uk", flag: "🇬🇧", label: "UK" },
  { key: "sea", flag: "🇸🇬", label: "SEA" },
  { key: "eu", flag: "🇪🇺", label: "EU" },
  { key: "jp", flag: "🇯🇵", label: "JP" },
  { key: "uae", flag: "🇦🇪", label: "UAE" },
] as const;

export function formatHsCode(raw: string | null | undefined): string {
  const s = raw?.trim().replace(/\D/g, "") ?? "";
  if (s.length === 6) return `${s.slice(0, 4)}.${s.slice(4)}`;
  return raw?.trim() ?? "";
}

export function describeShippingTier(
  tier: string | null | undefined
): { description: string; tooltip: string } {
  const t = tier?.trim().toLowerCase() ?? "";
  const tooltip = SHIPPING_TIER_TOOLTIP;
  if (t.includes("1") || t.includes("light") || t.includes("lightweight") || t.includes("<500"))
    return { description: "Tier 1: Lightweight packet (< 500g)", tooltip };
  if (t.includes("2") || t.includes("500") || t.includes("2kg") || t.includes("standard"))
    return { description: "Tier 2: 500g–2kg", tooltip };
  if (t.includes("3") || t.includes("heavy") || t.includes("2kg+") || t.includes("freight"))
    return { description: "Tier 3: 2kg+", tooltip };
  if (t) return { description: tier!.trim(), tooltip };
  return { description: "", tooltip };
}

export function safeParsePlatformScores(
  raw: unknown
): Record<string, { score?: number; sentiment?: string }> | null {
  if (!raw) return null;
  try {
    let parsed = raw;
    if (typeof parsed === "string") parsed = JSON.parse(parsed);
    if (typeof parsed === "string") parsed = JSON.parse(parsed);
    if (typeof parsed === "object" && parsed !== null)
      return parsed as Record<string, { score?: number; sentiment?: string }>;
    return null;
  } catch {
    return null;
  }
}

export function normalizeToArray(raw: unknown): string[] {
  if (!raw) return [];
  let str = "";
  if (Array.isArray(raw)) {
    str = raw.map(String).join(",");
  } else if (typeof raw === "string") {
    str = raw;
  } else {
    return [];
  }
  const cleanStr = str.replace(/[\[\]\\"]/g, "");
  return cleanStr.split(",").map((s) => s.trim()).filter(Boolean);
}

export interface StrategyStep {
  icon: string;
  label: string;
  color: string;
  content: string;
}

export function parseSourcingStrategy(
  raw: string | null | undefined
): StrategyStep[] {
  if (!raw) return [];
  // Language-agnostic: any line that is entirely [ ... ] is a section header
  const headerRegex = /(?:^|\n)\s*\[([^\n]*?)\]/g;
  const matches: { index: number; fullMatch: string; title: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = headerRegex.exec(raw)) !== null) {
    matches.push({ index: m.index, fullMatch: m[0], title: m[1].trim() });
  }
  if (matches.length === 0) {
    if (raw.trim()) {
      return [{ icon: "📋", label: "Strategy Overview", color: "emerald", content: raw.trim() }];
    }
    return [];
  }
  const iconColorList: { icon: string; color: string }[] = [
    { icon: "📈", color: "emerald" },
    { icon: "💰", color: "amber" },
    { icon: "🏭", color: "blue" },
    { icon: "📋", color: "red" },
    { icon: "📦", color: "purple" },
  ];
  const steps: StrategyStep[] = [];
  for (let i = 0; i < matches.length; i++) {
    const startIdx = matches[i].index + matches[i].fullMatch.length;
    const endIdx = matches[i + 1] ? matches[i + 1].index : raw.length;
    const content = raw.slice(startIdx, endIdx).trim();
    const { icon, color } = iconColorList[i % iconColorList.length];
    steps.push({ icon, label: matches[i].title, color, content });
  }
  return steps;
}

export function isPositiveGrowth(s: string | null | undefined): boolean {
  if (!s || typeof s !== "string") return false;
  const t = s.trim();
  return t.startsWith("+") || /^\d/.test(t);
}

export type RegionPriceRow = {
  flag: string;
  label: string;
  priceDisplay: string | null;
  platform?: string | null;
  isBlueOcean: boolean;
  review_data?: string | null;
  seller_type?: string | null;
  url?: string | null;
  official_url?: string | null;
  official_price_usd?: number | null;
  official_platform?: string | null;
  price_local?: number | null;
  currency?: string | null;
  listings?: Array<{
    platform?: string | null;
    title?: string | null;
    price_usd?: number | null;
    price_local?: number | null;
    currency?: string | null;
    url?: string | null;
  }> | null;
};

export function parseGlobalPricesForGrid(
  globalPrices: unknown,
  globalPriceText: string | Record<string, unknown> | null | undefined
): RegionPriceRow[] {
  const out: RegionPriceRow[] = [];
  let parsed: Record<string, { price_usd?: number; price_original?: string | number; platform?: string }> | null = null;
  if (globalPrices != null) {
    try {
      let p: unknown = globalPrices;
      if (typeof p === "string") p = JSON.parse(p);
      if (typeof p === "string") p = JSON.parse(p);
      if (p && typeof p === "object" && !Array.isArray(p))
        parsed = p as Record<string, { price_usd?: number; price_original?: string | number; platform?: string }>;
    } catch {
      // ignore
    }
  }
  if (parsed) {
    type MarketData = {
      price_usd?: number;
      price_original?: string | number;
      platform?: string;
      review_data?: string | null;
      seller_type?: string | null;
      url?: string | null;
      official_url?: string | null;
      price_local?: number | null;
      currency?: string | null;
      listings?: Array<{ platform?: string | null; title?: string | null; price_usd?: number | null; price_local?: number | null; currency?: string | null; url?: string | null }> | null;
    };
    const hasGroupKeys = "us_uk_eu" in parsed || "jp_sea" in parsed || "uae" in parsed;
    const flat: Record<string, MarketData | undefined> = hasGroupKeys
      ? {
          us: (parsed as Record<string, { us?: MarketData; uk?: MarketData; eu?: MarketData }>)["us_uk_eu"]?.us,
          uk: (parsed as Record<string, { us?: MarketData; uk?: MarketData; eu?: MarketData }>)["us_uk_eu"]?.uk,
          eu: (parsed as Record<string, { us?: MarketData; uk?: MarketData; eu?: MarketData }>)["us_uk_eu"]?.eu,
          jp: (parsed as Record<string, { jp?: MarketData; sea?: MarketData }>)["jp_sea"]?.jp,
          sea: (parsed as Record<string, { jp?: MarketData; sea?: MarketData }>)["jp_sea"]?.sea,
          uae: (parsed as Record<string, { uae?: MarketData }>)["uae"]?.uae,
        }
      : (parsed as Record<string, MarketData>);
    // shopee_lazada 데이터를 SEA에 병합
    const shopeeLazada = (parsed as Record<string, unknown>)["shopee_lazada"] as MarketData | undefined;
    if (shopeeLazada?.listings?.length) {
      const seaData = flat["sea"];
      const mergedListings = [...(seaData?.listings ?? []), ...shopeeLazada.listings];
      const withPrice = mergedListings.filter((l): l is typeof l & { price_usd: number } =>
        typeof (l as { price_usd?: number }).price_usd === "number" && (l as { price_usd: number }).price_usd > 0
      );
      const minEntry = withPrice.length
        ? withPrice.reduce((best, l) => ((l as { price_usd?: number }).price_usd! < (best as { price_usd?: number }).price_usd! ? l : best))
        : null;
      flat["sea"] = {
        ...seaData,
        listings: mergedListings,
        ...(minEntry
          ? {
              price_usd: (minEntry as { price_usd?: number }).price_usd,
              url: (minEntry as { url?: string | null }).url ?? seaData?.url ?? shopeeLazada.url,
            }
          : {}),
      };
    }
    for (const r of GLOBAL_REGIONS) {
      const data = flat[r.key] ?? flat[r.key === "au" ? "australia" : r.key];
      const priceUsd = data?.price_usd;
      const priceOrig = data?.price_original != null ? String(data.price_original).replace(/[$,]/g, "") : "";
      const num = priceUsd != null ? priceUsd : priceOrig ? parseFloat(priceOrig) : NaN;
      const isBlueOcean = Number.isNaN(num) || num === 0;
      const priceDisplay = !isBlueOcean
        ? (typeof data?.price_original === "string"
            ? data.price_original
            : priceUsd != null
              ? `$${priceUsd}`
              : priceOrig
                ? `$${priceOrig}`
                : null)
        : null;
      const review_data = data?.review_data ?? null;
      const seller_type = data?.seller_type ?? null;
      out.push({
        flag: r.flag,
        label: r.label,
        priceDisplay: priceDisplay ?? null,
        platform: data?.platform ?? null,
        isBlueOcean,
        review_data,
        seller_type,
        url: data?.url ?? null,
        official_url: data?.official_url ?? null,
        official_price_usd: (() => {
          if (!data?.official_url || !data?.listings) return null;
          const found = (data.listings as Array<{ url?: string | null; price_usd?: number | null }>)
            .find(l => l.url === data.official_url);
          return (found?.price_usd && found.price_usd > 0) ? found.price_usd : null;
        })(),
        official_platform: (() => {
          if (!data?.official_url || !data?.listings) return null;
          const found = (data.listings as Array<{ url?: string | null; platform?: string | null }>)
            .find(l => l.url === data.official_url);
          return found?.platform ?? null;
        })(),
        price_local: data?.price_local ?? null,
        currency: data?.currency ?? null,
        listings: (data?.listings ?? null) as RegionPriceRow["listings"],
      });
    }
    return out;
  }
  if (typeof globalPriceText === "string" && globalPriceText.trim()) {
    const priceByRegion: Record<string, { priceStr: string; num: number }> = {};
    const segments = globalPriceText.split(" | ");
    for (const segment of segments) {
      const match = segment.trim().match(/(\w+)\(\$(.+)\)/);
      if (!match) continue;
      const [, region, priceStr] = match;
      const num = parseFloat(priceStr);
      const key = region.toUpperCase();
      priceByRegion[key] = { priceStr, num };
    }
    if (Object.keys(priceByRegion).length > 0) {
      for (const r of GLOBAL_REGIONS) {
        const key = r.label.toUpperCase();
        const data = priceByRegion[key] ?? priceByRegion[r.key.toUpperCase()];
        const isBlueOcean = !data || Number.isNaN(data.num) || data.num === 0;
        out.push({
          flag: r.flag,
          label: r.label,
          priceDisplay: !isBlueOcean && data ? `$${data.priceStr}` : null,
          platform: null,
          isBlueOcean,
        });
      }
      return out;
    }
  }
  if (globalPriceText && typeof globalPriceText === "object" && !Array.isArray(globalPriceText)) {
    const gp = globalPriceText as Record<string, string>;
    for (const r of GLOBAL_REGIONS) {
      const v = gp[r.label] ?? gp[r.key] ?? gp[r.key.toUpperCase()];
      const s = typeof v === "string" ? v.trim().replace(/[$,]/g, "") : "";
      const num = s ? parseFloat(s) : NaN;
      const isBlueOcean = Number.isNaN(num) || num === 0;
      out.push({
        flag: r.flag,
        label: r.label,
        priceDisplay: !isBlueOcean && s ? `$${s}` : null,
        platform: null,
        isBlueOcean,
      });
    }
  }
  return out.length > 0 ? out : GLOBAL_REGIONS.map((r) => ({ flag: r.flag, label: r.label, priceDisplay: null, platform: null, isBlueOcean: true, url: null, official_url: null, official_price_usd: null, official_platform: null, price_local: null, currency: null, listings: null }));
}

export function parseGlobalPrices(
  raw: string | Record<string, { url?: string; platform?: string }> | null | undefined
): Record<string, string> | null {
  let obj: Record<string, unknown> | null = null;
  if (raw == null) return null;
  if (typeof raw === "string") {
    try {
      let parsed: unknown = JSON.parse(raw);
      if (typeof parsed === "string") parsed = JSON.parse(parsed);
      obj = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  } else if (typeof raw === "object" && !Array.isArray(raw)) {
    obj = raw as Record<string, unknown>;
  }
  if (!obj) return null;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === "object" && !Array.isArray(v) && "url" in v) {
      const url = (v as { url?: string }).url;
      if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) out[k] = url;
    }
  }
  return Object.keys(out).length ? out : null;
}

export function getAiDetailUrl(
  raw: string | unknown[] | Record<string, unknown> | null | undefined
): string | null {
  if (raw == null) return null;
  if (Array.isArray(raw) && raw.length > 0) {
    const first = raw[0];
    if (typeof first === "string" && (first.startsWith("http://") || first.startsWith("https://"))) return first;
    if (first && typeof first === "object" && "url" in first && typeof (first as { url: string }).url === "string")
      return (first as { url: string }).url;
    return null;
  }
  if (typeof raw === "object" && !Array.isArray(raw) && "url" in raw && typeof (raw as { url: string }).url === "string")
    return (raw as { url: string }).url;
  if (typeof raw === "string") {
    const t = raw.trim();
    if (t.startsWith("http")) return t;
    try {
      const parsed = JSON.parse(t) as unknown;
      if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === "string") return parsed[0];
      if (typeof parsed === "string") return parsed;
    } catch {
      // ignore
    }
  }
  return null;
}

export function formatVerifiedAt(iso: string | null | undefined): string | null {
  if (!iso?.trim()) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return null;
  }
}
```

---

## STEP 2 — grep: global_prices | parseGlobalPrices | ListingsBlock | sold_out | soldOut | price_usd.*0 | SOLD OUT | Sold Out

```
app\admin\[id]\page.tsx
  49:  global_prices: "글로벌가격",
  201:    "new_content_volume", "global_prices", "buzz_summary", "kr_local_score", "global_trend_score", "kr_evidence",
  693:                      typeof formData.global_prices === "string"
  694:                        ? formData.global_prices
  695:                        : formData.global_prices != null
  696:                          ? JSON.stringify(formData.global_prices)
  699:                    onChange={(s) => setFormData((p) => ({ ...p!, global_prices: s as unknown as ScoutFinalReportsRow["global_prices"] }))}

components/report/SupplierContact.tsx
  48:    const raw = report.global_prices;
  73:      .filter(l => l.price_usd && l.price_usd > 0)
  74:      .sort((a, b) => (a.price_usd ?? 0) - (b.price_usd ?? 0))[0];
  462:            const key = `${name}__${l.price_usd ?? 0}`;
  468:        // 2. 정렬: price_usd > 0 오름차순, 0은 맨 아래
  470:          ...deduped.filter(l => (l.price_usd ?? 0) > 0).sort((a, b) => (a.price_usd ?? 0) - (b.price_usd ?? 0)),
  471:          ...deduped.filter(l => (l.price_usd ?? 0) === 0),
  505:                  const isSoldOut = (l.price_usd ?? 0) === 0;
  520:                            Sold Out

app/admin/[id]/page.tsx
  49:  global_prices: "글로벌가격",
  201:    "new_content_volume", "global_prices", "buzz_summary", "kr_local_score", "global_trend_score", "kr_evidence",
  693:                      typeof formData.global_prices === "string"
  694:                        ? formData.global_prices
  695:                        : formData.global_prices != null
  696:                          ? JSON.stringify(formData.global_prices)
  699:                    onChange={(s) => setFormData((p) => ({ ...p!, global_prices: s as unknown as ScoutFinalReportsRow["global_prices"] }))}

components\admin\GlobalPricesHelper.tsx
  73:        price_usd: typeof o.price_usd === "number" ? o.price_usd : 0,
  77:    return { platform: "", price_usd: 0, url: "" };
  81:/** First listing (in array order) with price_usd > 0 is the Best price for the badge. */
  83:  const first = listings.find((l) => (l.price_usd ?? 0) > 0);
  84:  return first != null && first.price_usd != null && first.price_usd > 0
  93:    const p = l.price_usd ?? 0;
  104:    const pa = a.price_usd ?? 0;
  105:    const pb = b.price_usd ?? 0;
  166:  /** Sold Out is UI-only: key = regionKey, value = per-listing booleans. Not saved to JSON. */
  167:  const [soldOutByRegion, setSoldOutByRegion] = useState<Record<string, (boolean | undefined)[]>>({});
  175:      const arr = soldOutByRegion[regionKey];
  180:    [soldOutByRegion]
  232:        { platform: "", price_usd: 0, url: "" },
  261:        const hasAnyPrice = listings.some((l) => (l.price_usd ?? 0) > 0);
  291:              const price = listing.price_usd ?? 0;
  347:                    Sold Out

components/report/MarketIntelligence.tsx
  6:import { isPositiveGrowth, parseGlobalPricesForGrid } from "./utils";
  21:function ListingsBlock({ row }: { row: import("./utils").RegionPriceRow }) {
  25:  const validListings = allListings.filter(l => l.price_usd && l.price_usd > 0);
  33:    .sort((a, b) => (a.price_usd ?? 0) - (b.price_usd ?? 0))[0];
  35:  const showOfficialSeparately = !!(cheapestListing && officialListing && (row.official_price_usd ?? 0) > 0);
  44:    seenKeys.add(`${name}__${cheapestListing.price_usd ?? 0}`);
  48:    seenKeys.add(`${name}__${officialListing.price_usd ?? 0}`);
  52:    .sort((a, b) => (a.price_usd ?? 0) - (b.price_usd ?? 0))
  55:      const key = `${name}__${l.price_usd ?? 0}`;
  82:      {showOfficialSeparately && officialListing && (row.official_price_usd ?? 0) > 0 && (
  140:  const rows = parseGlobalPricesForGrid(report.global_prices, report.global_price as string | Record<string, unknown> | null | undefined);
  282:                            <ListingsBlock row={market.row} />

components/report/utils.ts
  135:export function parseGlobalPricesForGrid(
  182:        typeof (l as { price_usd?: number }).price_usd === "number" && (l as { price_usd: number }).price_usd > 0
  229:          return (found?.price_usd && found.price_usd > 0) ? found.price_usd : null;
  290:export function parseGlobalPrices(

components\report\MarketIntelligence.tsx
  6:import { isPositiveGrowth, parseGlobalPricesForGrid } from "./utils";
  21:function ListingsBlock({ row }: { row: import("./utils").RegionPriceRow }) {
  ... (same as above)

data/sampleReportData.ts
  74:  global_prices: {
  94:      price_usd: 15.0,
  100:      price_usd: 0,

components\report\SupplierContact.tsx
  (same as components/report/SupplierContact.tsx)

types/database.ts
  99:  global_prices?: Json | null;
```
