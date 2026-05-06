## FILE: components/admin/GlobalPricesHelper.tsx
"use client";

import { useState, useEffect, useCallback } from "react";

// ?붴붴?Types ?붴붴?type ListingItem = {
  platform?: string;
  price_usd?: number;
  url?: string;
  sold_out?: boolean;
  is_official?: boolean;
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
  { key: "us", flag: "?눣?눡", name: "US" },
  { key: "gb", flag: "?눐?눉", name: "UK" },
  { key: "eu", flag: "?눎?눣", name: "EU" },
  { key: "jp", flag: "?눓?눝", name: "Japan" },
  { key: "sea", flag: "?눡?눐", name: "SEA" },
  { key: "uae", flag: "?눇?눎", name: "UAE" },
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
    const price_usd_val = typeof o.price_usd === "number" ? o.price_usd : 0;
    const sold_out = o.sold_out === true || price_usd_val === 0;
    const item: ListingItem = {
      platform: typeof o.platform === "string" ? o.platform : "",
      price_usd: price_usd_val,
      url: typeof o.url === "string" ? o.url : "",
      sold_out,
      is_official: o.is_official === true,
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
  const activePrices = listings
    .filter((l) => !l.sold_out && (l.price_usd ?? 0) > 0)
    .map((l) => l.price_usd as number);
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
    if (activePrices.length === 0) {
      next.jp_sea.sea.price_usd = 0;
      next.jp_sea.sea.url = null;
    } else {
      next.jp_sea.sea.price_usd = Math.min(...activePrices);
    }
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
    if (activePrices.length === 0) {
      next.us_uk_eu.us.price_usd = 0;
      next.us_uk_eu.us.url = null;
    } else {
      next.us_uk_eu.us.price_usd = Math.min(...activePrices);
    }
    return next;
  }
  if (regionKey === "gb") {
    if (!next.us_uk_eu) next.us_uk_eu = {};
    if (!next.us_uk_eu.uk) next.us_uk_eu.uk = {};
    next.us_uk_eu.uk.listings = listings.map(stripSource);
    if (activePrices.length === 0) {
      next.us_uk_eu.uk.price_usd = 0;
      next.us_uk_eu.uk.url = null;
    } else {
      next.us_uk_eu.uk.price_usd = Math.min(...activePrices);
    }
    return next;
  }
  if (regionKey === "eu") {
    if (!next.us_uk_eu) next.us_uk_eu = {};
    if (!next.us_uk_eu.eu) next.us_uk_eu.eu = {};
    next.us_uk_eu.eu.listings = listings.map(stripSource);
    if (activePrices.length === 0) {
      next.us_uk_eu.eu.price_usd = 0;
      next.us_uk_eu.eu.url = null;
    } else {
      next.us_uk_eu.eu.price_usd = Math.min(...activePrices);
    }
    return next;
  }
  if (regionKey === "jp") {
    if (!next.jp_sea) next.jp_sea = {};
    if (!next.jp_sea.jp) next.jp_sea.jp = {};
    next.jp_sea.jp.listings = listings.map(stripSource);
    if (activePrices.length === 0) {
      next.jp_sea.jp.price_usd = 0;
      next.jp_sea.jp.url = null;
    } else {
      next.jp_sea.jp.price_usd = Math.min(...activePrices);
    }
    return next;
  }
  if (regionKey === "uae") {
    if (!next.uae) next.uae = {};
    if (!next.uae.uae) next.uae.uae = {};
    next.uae.uae.listings = listings.map(stripSource);
    if (activePrices.length === 0) {
      next.uae.uae.price_usd = 0;
      next.uae.uae.url = null;
    } else {
      next.uae.uae.price_usd = Math.min(...activePrices);
    }
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
      // Official 泥댄겕 ??region official_url ?먮룞 諛섏쁺
      setData((prev) => {
        const next = JSON.parse(JSON.stringify(prev)) as GlobalPricesLike;

        // ?대떦 region??official_url ?낅뜲?댄듃
        const setOfficialUrl = (regionObj: Record<string, unknown> | undefined, url: string | null) => {
          if (regionObj) regionObj.official_url = url;
        };

        if (listing.is_official && listing.url) {
          // Official 泥댄겕 ON ????URL??official_url濡??ㅼ젙
          if (regionKey === "us") setOfficialUrl(next.us_uk_eu?.us as Record<string, unknown>, listing.url);
          else if (regionKey === "gb") setOfficialUrl(next.us_uk_eu?.uk as Record<string, unknown>, listing.url);
          else if (regionKey === "eu") setOfficialUrl(next.us_uk_eu?.eu as Record<string, unknown>, listing.url);
          else if (regionKey === "jp") setOfficialUrl(next.jp_sea?.jp as Record<string, unknown>, listing.url);
          else if (regionKey === "sea") setOfficialUrl(next.jp_sea?.sea as Record<string, unknown>, listing.url);
          else if (regionKey === "uae") setOfficialUrl(next.uae?.uae as Record<string, unknown>, listing.url);
        } else if (!listing.is_official) {
          // Official 泥댄겕 OFF ???ㅻⅨ Official 泥댄겕??listing???놁쑝硫?official_url ?쒓굅
          const updatedListings = getRegionListings(next, regionKey);
          const hasOtherOfficial = updatedListings.some((l, i) => i !== index && l.is_official);
          if (!hasOtherOfficial) {
            if (regionKey === "us") setOfficialUrl(next.us_uk_eu?.us as Record<string, unknown>, null);
            else if (regionKey === "gb") setOfficialUrl(next.us_uk_eu?.uk as Record<string, unknown>, null);
            else if (regionKey === "eu") setOfficialUrl(next.us_uk_eu?.eu as Record<string, unknown>, null);
            else if (regionKey === "jp") setOfficialUrl(next.jp_sea?.jp as Record<string, unknown>, null);
            else if (regionKey === "sea") setOfficialUrl(next.jp_sea?.sea as Record<string, unknown>, null);
            else if (regionKey === "uae") setOfficialUrl(next.uae?.uae as Record<string, unknown>, null);
          }
        }
        onChange(JSON.stringify(next));
        return next;
      });
    },
    [updateRegionListings, getRegionListings, onChange]
  );

  const addListing = useCallback(
    (regionKey: string) => {
      updateRegionListings(regionKey, (list) => {
        const newItem: ListingItem = { platform: "", price_usd: 0, url: "", sold_out: false };
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
                {openRegions[regionKey] !== false ? "?? : "??}
              </span>
            </button>

            {/* Listings ??expand when open */}
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
                    <span className="text-sm text-[#1A1916] flex-1">????ぉ????젣?섏떆寃좎뒿?덇퉴?</span>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(null)}
                      className="text-sm px-3 py-1.5 rounded border border-[#E8E6E1] bg-white text-[#1A1916] hover:bg-[#F8F7F4] transition-colors"
                    >
                      痍⑥냼
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteListing(regionKey, originalIndex);
                        setPendingDelete(null);
                      }}
                      className="text-sm px-3 py-1.5 rounded border border-[#DC2626] bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FECACA] transition-colors"
                    >
                      ??젣
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
                  <label className="flex items-center gap-1 text-xs text-[#16A34A] whitespace-nowrap cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={listing.is_official === true}
                      onChange={(e) =>
                        setListing(regionKey, originalIndex, {
                          ...listing,
                          is_official: e.target.checked,
                        })
                      }
                      className="appearance-none w-4 h-4 rounded border border-[#E8E6E1] bg-white checked:bg-[#16A34A] checked:border-[#16A34A] focus:border-[#16A34A] outline-none"
                    />
                    Official
                  </label>
                  <button
                    type="button"
                    onClick={() => openUrl(listing.url ?? "")}
                    className="text-[#9E9C98] hover:text-[#1A1916] text-sm px-1.5 py-1 rounded transition-colors bg-transparent border-none cursor-pointer flex-shrink-0"
                    aria-label="Open URL"
                  >
                    ?뵕
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete({ regionKey, index: originalIndex })}
                    className="text-[#9E9C98] hover:text-[#1A1916] text-sm px-1.5 py-1 rounded transition-colors bg-transparent border-none cursor-pointer flex-shrink-0"
                    aria-label="Delete"
                  >
                    ?뿊
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
        {rawOpen ? "??Hide Raw JSON" : "??Show Raw JSON"}
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


## FILE: app/admin/[id]/page.tsx
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
const GAP_STATUS_OPTIONS = ["Blue Ocean", "Emerging", "Competitive", "Saturated"] as const;
const GO_VERDICT_OPTIONS = ["GO", "CAUTIOUS GO", "WATCH", "NO GO"] as const;

/** Korean labels for every DB field (for diff modal & edit history) */
const FIELD_LABELS_KO: Record<string, string> = {
  id: "ID",
  product_name: "?쒗뭹紐?,
  naver_product_name: "?ㅼ씠踰??곹뭹紐?,
  translated_name: "踰덉뿭紐?,
  category: "移댄뀒怨좊━",
  kr_price: "?쒓뎅媛寃???",
  kr_price_usd: "USD媛寃?,
  estimated_cost_usd: "異붿젙?꾨ℓ?먭?",
  export_status: "?섏텧?곹깭",
  viability_reason: "?쒖옣?깆슂??,
  image_url: "?대?吏URL",
  naver_link: "?ㅼ씠踰꾨쭅??,
  week_id: "二쇱감ID",
  m_name: "?쒖“?щ챸",
  corporate_scale: "湲곗뾽洹쒕え",
  contact_email: "臾몄쓽?대찓??,
  contact_phone: "臾몄쓽?꾪솕踰덊샇",
  m_homepage: "?쒖“?ы솃?섏씠吏",
  wholesale_link: "?꾨ℓ臾몄쓽留곹겕",
  status: "?곹깭",
  market_viability: "?쒖옣?깆젏??,
  competition_level: "寃쎌웳?섏?",
  gap_status: "媛?긽??,
  wow_rate: "WoW?깆옣瑜?,
  mom_growth: "MoM?깆옣瑜?,
  growth_evidence: "?깆옣洹쇨굅",
  profit_multiplier: "留덉쭊諛곗닔",
  top_selling_point: "?듭떖媛뺤젏",
  common_pain_point: "?뚮퉬?먰럹?명룷?명듃",
  new_content_volume: "?좉퇋肄섑뀗痢좊웾",
  global_prices: "湲濡쒕쾶媛寃?,
  buzz_summary: "踰꾩쫰?붿빟",
  kr_local_score: "援?궡濡쒖뺄?먯닔",
  global_trend_score: "湲濡쒕쾶?몃젋?쒖젏??,
  gap_index: "媛????,
  billable_weight_g: "怨쇨툑以묐웾(g)",
  kr_evidence: "援?궡洹쇨굅",
  global_evidence: "湲濡쒕쾶洹쇨굅",
  kr_source_used: "援?궡異쒖쿂",
  opportunity_reasoning: "湲고쉶?쇰━",
  rising_keywords: "?곸듅?ㅼ썙??,
  seo_keywords: "SEO?ㅼ썙??,
  viral_hashtags: "諛붿씠?댄빐?쒗깭洹?,
  platform_scores: "?뚮옯?쇱젏??,
  sourcing_tip: "?뚯떛??,
  hs_code: "HS肄붾뱶",
  hs_description: "HS?ㅻ챸",
  status_reason: "?곹깭?ъ쑀",
  composition_info: "?깅텇?뺣낫",
  spec_summary: "?ㅽ럺?붿빟",
  actual_weight_g: "?ㅼ젣以묐웾(g)",
  volumetric_weight_g: "遺?쇱쨷??g)",
  dimensions_cm: "移섏닔(cm)",
  hazmat_status: "?꾪뿕臾쇱뿬遺",
  required_certificates: "?꾩슂?몄쬆",
  shipping_notes: "諛곗넚硫붾え",
  verified_cost_usd: "寃利앸맂?먭?(USD)",
  verified_cost_note: "寃利앹썝媛硫붾え",
  verified_at: "寃利앹씪??,
  moq: "理쒖냼二쇰Ц?섎웾",
  lead_time: "由щ뱶???,
  sample_policy: "?섑뵆?뺤콉",
  export_cert_note: "?섏텧?몄쬆硫붾え",
  viral_video_url: "諛붿씠?댁쁺?갪RL",
  video_url: "?곸긽URL",
  marketing_assets_url: "留덉??낆옄?캵RL",
  ai_detail_page_links: "AI?곸꽭?섏씠吏留곹겕",
  published_at: "諛쒗뻾?쇱떆",
  go_verdict: "GO?먯젙",
  composite_score: "醫낇빀?먯닔",
  growth_signal: "?깆옣?쒓렇??,
  search_volume: "寃?됰낵瑜?,
  best_platform: "理쒖쟻?뚮옯??,
  trend_entry_strategy: "吏꾩엯?꾨왂",
  shipping_tier: "諛곗넚?곗뼱",
  key_risk_ingredient: "?꾪뿕?깅텇",
  hazmat_summary: "?꾪뿕臾쇱슂??,
  global_site_url: "湲濡쒕쾶?ъ씠?퇥RL",
  b2b_inquiry_url: "B2B臾몄쓽URL",
  can_oem: "OEM媛?μ뿬遺",
  ai_image_url: "AI?대?吏URL",
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
  if (v == null) return "??;
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
    s6: false,
    s7: false,
  });

  const serializeSourcingTip = (steps: string[]): string => {
    const headers = [
      "Marketing Strategy",
      "Price / Margin Strategy",
      "B2B Sourcing Strategy",
      "Customs / Compliance Strategy",
      "Logistics / Shipping Strategy",
    ];
    return steps
      .map((content, i) => `[${headers[i]}]\n${content ?? ""}`)
      .join("\n\n");
  };

  const parseTipToSteps = (raw: string | null | undefined): string[] => {
    if (!raw) return ["", "", "", "", ""];
    const regex = /(?:^|\n)\s*\[([^\n]*?)\]/g;
    const matches: { title: string; index: number }[] = [];
    let m;
    while ((m = regex.exec(raw)) !== null) {
      matches.push({ title: m[1].trim(), index: m.index });
    }
    if (matches.length === 0) return [raw.trim(), "", "", "", ""];
    const steps: string[] = [];
    for (let i = 0; i < 5; i++) {
      if (!matches[i]) { steps.push(""); continue; }
      const start = raw.indexOf("]", matches[i].index) + 1;
      const end = matches[i + 1] ? matches[i + 1].index : raw.length;
      steps.push(raw.slice(start, end).trim());
    }
    return steps;
  };

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
    "wow_rate", "mom_growth", "growth_evidence", "profit_multiplier", "strategy_price", "top_selling_point", "common_pain_point",
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
        <p className="text-[#6B6860] text-sm">{loading ? "Loading?? : "Report not found."}</p>
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
          ??Back to List
        </Link>
        <span className="text-sm font-semibold text-[#1A1916] truncate max-w-[200px] mx-2">
          {formData.product_name ?? "??}
        </span>
        <div className="flex items-center gap-2">
          {saveStatus === "saved" && (
            <span className="text-xs text-[#16A34A]">Saved!</span>
          )}
          {saveStatus === "error" && (
            <span className="text-xs text-[#DC2626]">Save failed</span>
          )}
          <label className="sr-only" htmlFor="admin-status-select">Status (?곹깭)</label>
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
            <option value="published">published (怨듦컻)</option>
            <option value="hidden">hidden (?④?)</option>
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
                Save Changes ??蹂寃??ы빆 ?뺤씤
              </h2>
              <p className="text-xs text-[#9E9C98] mt-1">?ㅼ쓬 ?꾨뱶媛 蹂寃쎈맗?덈떎.</p>
            </div>
            <div className="px-6 py-4 overflow-y-auto flex-1">
              {saveDiff.length === 0 ? (
                <p className="text-[#6B6860] text-sm">蹂寃쎈맂 ?꾨뱶媛 ?놁뒿?덈떎.</p>
              ) : (
                <ul className="space-y-2">
                  {saveDiff.map((d, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium text-[#3D3B36]">{d.fieldKo} ({d.field}):</span>{" "}
                      <span className="text-[#9E9C98]">[{d.before}]</span> ??<span className="text-[#16A34A]">[{d.after}]</span>
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
        {/* Section 1 ??Product Identity */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s1")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Product Identity</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s1 ? "?? : "??}</span>
          </button>
          {openSections.s1 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>id (ID) <span className="text-[#9E9C98] normal-case font-normal">(?먮룞)</span></label>
                <div className={readOnlyClass}>
                  {formData.id ?? "??}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Image URL (?대?吏URL)</label>
                {formData.image_url && (
                  <div className="rounded-xl overflow-hidden border border-[#E8E6E1] w-48 h-48 flex items-center justify-center bg-[#F8F7F4]">
                    <img
                      src={formData.image_url}
                      alt="product"
                      className="object-contain w-full h-full"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
                <input
                  type="text"
                  value={formData.image_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, image_url: e.target.value }))}
                  className={inputClass}
                  placeholder="?대?吏 URL??遺숈뿬?ｌ쑝?몄슂"
                />
                <p className="text-xs text-[#9E9C98]">?좑툘 ?대?吏媛 源⑥쭊 寃쎌슦 ?ㅼ씠踰??곹뭹 ?섏씠吏?먯꽌 ?대?吏 URL??蹂듭궗??援먯껜?섏꽭??</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>AI Image URL (AI?대?吏URL)</label>
                {formData.ai_image_url && (
                  <div className="rounded-xl overflow-hidden border border-[#E8E6E1] w-48 h-48 flex items-center justify-center bg-[#F8F7F4]">
                    <img
                      src={formData.ai_image_url}
                      alt="ai product"
                      className="object-contain w-full h-full"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
                <input
                  type="text"
                  value={formData.ai_image_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, ai_image_url: e.target.value }))}
                  className={inputClass}
                  placeholder="AI ?앹꽦 ?대?吏 URL"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Product Name (?쒗뭹紐?</label>
                <input
                  value={formData.product_name ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, product_name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Naver Product Name (?ㅼ씠踰??곹뭹紐?</label>
                <input
                  value={formData.naver_product_name ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, naver_product_name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Translated Name (踰덉뿭紐?</label>
                <input
                  value={formData.translated_name ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, translated_name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Category (移댄뀒怨좊━)</label>
                <input
                  value={formData.category ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, category: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>KR Price (?? (?쒓뎅媛寃?</label>
                <input
                  type="text"
                  value={formData.kr_price ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, kr_price: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>USD Price (USD媛寃? <span className="text-[#9E9C98] normal-case font-normal">(?먮룞怨꾩궛)</span></label>
                <div className={readOnlyClass}>
                  {formData.kr_price_usd ?? "??}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Est. Wholesale Cost (異붿젙?꾨ℓ?먭?) <span className="text-[#9E9C98] normal-case font-normal">(?먮룞怨꾩궛)</span></label>
                <div className={readOnlyClass}>
                  {formData.estimated_cost_usd ?? "??}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Export Status (?섏텧?곹깭)</label>
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
                <label className={labelClass}>Viability Summary (?쒖옣?깆슂??</label>
                <textarea
                  rows={3}
                  value={formData.viability_reason ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, viability_reason: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>GO Verdict (GO?먯젙)</label>
                <select
                  value={formData.go_verdict ?? ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p!,
                      go_verdict: e.target.value === "" ? null : e.target.value,
                    }))
                  }
                  className={inputClass}
                >
                  <option value="">??/option>
                  {GO_VERDICT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Composite Score (醫낇빀?먯닔) <span className="text-[#9E9C98] normal-case font-normal">(?먮룞)</span></label>
                <div className={readOnlyClass}>{formData.composite_score ?? "??}</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Naver Link (?ㅼ씠踰꾨쭅??</label>
                <input
                  value={formData.naver_link ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, naver_link: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Week ID (二쇱감ID)</label>
                <input
                  value={formData.week_id ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, week_id: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 2 ??Trend Signal Dashboard */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s2")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Trend Signal Dashboard</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s2 ? "?? : "??}</span>
          </button>
          {openSections.s2 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Market Score (0??00) (?쒖옣?깆젏??</label>
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
                <label className={labelClass}>Competition Level (寃쎌웳?섏?)</label>
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
                <label className={labelClass}>Growth Evidence (?깆옣洹쇨굅)</label>
                <textarea
                  rows={3}
                  value={formData.growth_evidence ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, growth_evidence: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Growth Signal (?깆옣?쒓렇??</label>
                <input
                  value={formData.growth_signal ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, growth_signal: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Stable, Rising, Viral"
                />
              </div>
              {/* gap_status ??moved from Opportunity Status */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>GAP STATUS / Opportunity Status (媛??곹깭)</label>
                <select
                  value={formData.gap_status ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, gap_status: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">??/option>
                  {formData.gap_status &&
                    !GAP_STATUS_OPTIONS.includes(
                      formData.gap_status as (typeof GAP_STATUS_OPTIONS)[number]
                    ) && (
                      <option value={formData.gap_status}>{formData.gap_status}</option>
                    )}
                  {GAP_STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {/* platform_scores ??moved from Social Proof */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Platform Scores JSON (?뚮옯?쇱젏??</label>
                <textarea
                  rows={6}
                  value={typeof formData.platform_scores === "string" ? formData.platform_scores : JSON.stringify(formData.platform_scores ?? {}, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setFormData((p) => ({ ...p!, platform_scores: parsed }));
                    } catch {
                      setFormData((p) => ({
                        ...p!,
                        platform_scores: e.target.value as unknown as ScoutFinalReportsRow["platform_scores"],
                      }));
                    }
                  }}
                  className={`${inputClass} resize-none font-mono text-xs`}
                />
              </div>
              {/* new_content_volume ??moved from Market Intelligence */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>New Content Volume (?좉퇋肄섑뀗痢좊웾)</label>
                <input
                  type="text"
                  value={formData.new_content_volume ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, new_content_volume: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>OPPORTUNITY REASONING (湲고쉶 洹쇨굅)</label>
                <textarea
                  rows={4}
                  value={formData.opportunity_reasoning ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, opportunity_reasoning: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 3 ??Market Intelligence */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s3")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Market Intelligence</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s3 ? "?? : "??}</span>
          </button>
          {openSections.s3 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Profit Multiplier (留덉쭊諛곗닔)</label>
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
                <label className={labelClass}>
                  Strategic Target Price (?꾨왂??紐⑺몴媛 USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={
                    (formData as Record<string, unknown>).strategy_price != null
                      ? String((formData as Record<string, unknown>).strategy_price)
                      : ""
                  }
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p!,
                      strategy_price: e.target.value === "" ? null : e.target.value,
                    }))
                  }
                  placeholder="?? 18.50 ??鍮꾩슦硫??먮룞怨꾩궛 ?쒖떆"
                  className={inputClass}
                />
                <p className="text-xs text-[#9E9C98]">
                  ?낅젰 ??PDP??Strategic Target Price濡??쒖떆. 鍮꾩슦硫??④?.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Winning Feature (?듭떖媛뺤젏)</label>
                <textarea
                  rows={3}
                  value={formData.top_selling_point ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, top_selling_point: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Pain Point (?뚮퉬?먰럹?명룷?명듃)</label>
                <textarea
                  rows={3}
                  value={formData.common_pain_point ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, common_pain_point: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Search Volume (寃?됰낵瑜?</label>
                <input
                  value={formData.search_volume ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, search_volume: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Rising (18,100/mo)"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>MoM Growth (MoM?깆옣瑜?</label>
                <input
                  type="text"
                  value={formData.mom_growth ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, mom_growth: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>WoW Growth (WoW?깆옣瑜?</label>
                <input
                  type="text"
                  value={formData.wow_rate ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, wow_rate: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Best Platform (理쒖쟻?뚮옯??</label>
                <input
                  value={formData.best_platform ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, best_platform: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Amazon US, TikTok Shop"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 4 ??Social Proof & Trend Intelligence */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s4")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Social Proof & Trend Intelligence</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s4 ? "?? : "??}</span>
          </button>
          {openSections.s4 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Buzz Summary (踰꾩쫰?붿빟)</label>
                <textarea
                  rows={4}
                  value={formData.buzz_summary ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, buzz_summary: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>KR Local Score (0??00) (援?궡濡쒖뺄?먯닔)</label>
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
                <label className={labelClass}>Global Trend Score (0??00) (湲濡쒕쾶?몃젋?쒖젏??</label>
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
                <label className={labelClass}>Gap Index (媛???? <span className="text-[#9E9C98] normal-case font-normal">(?먮룞: 援?궡?먯닔 ??湲濡쒕쾶?먯닔)</span></label>
                <div className={readOnlyClass}>
                  {formData.gap_index != null ? formData.gap_index : "??}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>KR Evidence (援?궡洹쇨굅)</label>
                <textarea
                  rows={3}
                  value={formData.kr_evidence ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, kr_evidence: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Global Evidence (湲濡쒕쾶洹쇨굅)</label>
                <textarea
                  rows={3}
                  value={formData.global_evidence ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, global_evidence: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>KR Source Used (援?궡異쒖쿂)</label>
                <input
                  value={formData.kr_source_used ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, kr_source_used: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Rising Keywords (?곸듅?ㅼ썙??</label>
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
                <label className={labelClass}>SEO Keywords (SEO?ㅼ썙??</label>
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
                <label className={labelClass}>Viral Hashtags (諛붿씠?댄빐?쒗깭洹?</label>
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
              {/* Scout Strategy Report - Steps 1-3 */}
              <div className="flex flex-col gap-3 border border-[#E8E6E1] rounded-xl p-4">
                <p className="text-sm font-semibold text-[#1A1916]">?뱥 Scout Strategy Report (Steps 1??)</p>
                {["Marketing Strategy", "Price / Margin Strategy", "B2B Sourcing Strategy"].map((header, i) => {
                  const steps = parseTipToSteps(formData.sourcing_tip);
                  return (
                    <div key={i} className="flex flex-col gap-1.5">
                      <label className={labelClass}>Step {i + 1}: {header}</label>
                      <textarea
                        rows={4}
                        value={steps[i] ?? ""}
                        onChange={(e) => {
                          const current = parseTipToSteps(formData.sourcing_tip);
                          current[i] = e.target.value;
                          setFormData((p) => ({ ...p!, sourcing_tip: serializeSourcingTip(current) }));
                        }}
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Trend Entry Strategy (吏꾩엯?꾨왂)</label>
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

        {/* Section 5 ??Export & Logistics Intel */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s5")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Export & Logistics Intel</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s5 ? "?? : "??}</span>
          </button>
          {openSections.s5 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>HS Code (HS肄붾뱶)</label>
                <input
                  value={formData.hs_code ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, hs_code: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>HS Description (HS?ㅻ챸)</label>
                <input
                  value={formData.hs_description ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, hs_description: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Status Reason (?곹깭?ъ쑀)</label>
                <textarea
                  rows={3}
                  value={formData.status_reason ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, status_reason: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Composition Info (?깅텇?뺣낫)</label>
                <textarea
                  rows={3}
                  value={formData.composition_info ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, composition_info: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Spec Summary (?ㅽ럺?붿빟)</label>
                <textarea
                  rows={3}
                  value={formData.spec_summary ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, spec_summary: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Actual Weight (g) (?ㅼ젣以묐웾)</label>
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
                <label className={labelClass}>Volumetric Weight (g) (遺?쇱쨷??</label>
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
                <label className={labelClass}>Billable Weight (g) (怨쇨툑以묐웾) <span className="text-[#9E9C98] normal-case font-normal">(?먮룞: max(?ㅼ젣, 遺??)</span></label>
                <div className={readOnlyClass}>
                  {formData.billable_weight_g != null ? formData.billable_weight_g : "??}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Dimensions (cm) (移섏닔)</label>
                <input
                  value={formData.dimensions_cm ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, dimensions_cm: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Hazmat Status (?꾪뿕臾쇱뿬遺)</label>
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
                <label className={labelClass}>Required Certificates (?꾩슂?몄쬆)</label>
                <input
                  value={formData.required_certificates ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, required_certificates: e.target.value }))}
                  className={inputClass}
                  placeholder="Comma-separated"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Shipping Notes (諛곗넚硫붾え)</label>
                <textarea
                  rows={3}
                  value={formData.shipping_notes ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, shipping_notes: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Shipping Tier (諛곗넚?곗뼱)</label>
                <input
                  value={formData.shipping_tier ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, shipping_tier: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Tier 1"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Key Risk Ingredient (?꾪뿕?깅텇)</label>
                <input
                  value={formData.key_risk_ingredient ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, key_risk_ingredient: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Retinol, Aerosol"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Hazmat Summary (?꾪뿕臾쇱슂??</label>
                <textarea
                  rows={2}
                  value={formData.hazmat_summary ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, hazmat_summary: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              {/* Compliance & Logistics Strategy - Steps 4-5 */}
              <div className="flex flex-col gap-3 border border-[#E8E6E1] rounded-xl p-4">
                <p className="text-sm font-semibold text-[#1A1916]">?벀 Compliance & Logistics Strategy (Steps 4??)</p>
                {["Customs / Compliance Strategy", "Logistics / Shipping Strategy"].map((header, i) => {
                  const steps = parseTipToSteps(formData.sourcing_tip);
                  return (
                    <div key={i} className="flex flex-col gap-1.5">
                      <label className={labelClass}>Step {i + 4}: {header}</label>
                      <textarea
                        rows={4}
                        value={steps[i + 3] ?? ""}
                        onChange={(e) => {
                          const current = parseTipToSteps(formData.sourcing_tip);
                          current[i + 3] = e.target.value;
                          setFormData((p) => ({ ...p!, sourcing_tip: serializeSourcingTip(current) }));
                        }}
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Section 7 ??Global Market Prices (before Launch Kit) */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s7")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">?뙇 Global Market Prices</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s7 ? "?? : "??}</span>
          </button>
          {openSections.s7 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Global Prices (湲濡쒕쾶媛寃???US/UK/EU/JP/SEA/UAE)</label>
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
          )}
        </div>

        {/* Section 6 ??Launch & Execution Kit (default open) */}
        <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("s6")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
          >
            <span className="text-sm font-semibold text-[#1A1916]">Launch & Execution Kit</span>
            <span className="text-[#9E9C98] text-xs">{openSections.s6 ? "?? : "??}</span>
          </button>
          {openSections.s6 && (
            <div className="px-6 pb-6 flex flex-col gap-5 border-t border-[#E8E6E1]">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest pt-2">
                ?뱥 ?쒖“??룹뿰?쎌쿂 (Manufacturer & Contact)
              </p>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Manufacturer Name (?쒖“?щ챸)</label>
                <input
                  value={formData.m_name ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, m_name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Corporate Scale (湲곗뾽 洹쒕え e.g. SME)</label>
                <input
                  value={formData.corporate_scale ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, corporate_scale: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. SME"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Contact Email (臾몄쓽 ?대찓??</label>
                <input
                  type="email"
                  value={formData.contact_email ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, contact_email: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Contact Phone (臾몄쓽 ?꾪솕踰덊샇)</label>
                <input
                  type="tel"
                  value={formData.contact_phone ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, contact_phone: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Manufacturer Website (?쒖“???덊럹?댁?)</label>
                <input
                  type="url"
                  value={formData.m_homepage ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, m_homepage: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Wholesale Portal (?꾨ℓ 臾몄쓽 留곹겕)</label>
                <input
                  type="url"
                  value={formData.wholesale_link ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, wholesale_link: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Global Site URL (湲濡쒕쾶?ъ씠?퇥RL)</label>
                <input
                  type="url"
                  value={formData.global_site_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, global_site_url: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>B2B Inquiry URL (B2B臾몄쓽URL)</label>
                <input
                  type="url"
                  value={formData.b2b_inquiry_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, b2b_inquiry_url: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Can OEM (OEM媛?μ뿬遺)</label>
                <select
                  value={formData.can_oem === true ? "true" : formData.can_oem === false ? "false" : ""}
                  onChange={(e) => setFormData((p) => ({
                    ...p!,
                    can_oem: e.target.value === "true" ? true : e.target.value === "false" ? false : null
                  }))}
                  className={inputClass}
                >
                  <option value="">??誘명솗????/option>
                  <option value="true">Yes (媛??</option>
                  <option value="false">No (遺덇?)</option>
                </select>
              </div>
              <div className="border-t border-[#E8E6E1] pt-5">
                <p className="text-sm font-semibold text-[#1A1916] mb-4">?렞 CEO Direct Input</p>
              </div>
              <p className="text-xs text-[#9E9C98] pt-4">??援ъ뿭? ??쒕떂??釉뚮옖?쒖? 吏곸젒 ?묒쓽?섍굅??諛쒗뭹 ?붿븘 ?뺤씤???뺣낫留??낅젰?⑸땲?? Make.com???먮룞?쇰줈 梨꾩슦吏 ?딆뒿?덈떎.</p>

              <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-widest pt-2">B2B ?뚯떛 ?먭? & 議곌굔</p>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Verified Cost (USD) (寃利앸맂 ?먭?)</label>
                <input
                  type="text"
                  value={formData.verified_cost_usd ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, verified_cost_usd: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Verified Cost Note (寃利앹썝媛硫붾え)</label>
                <input
                  value={formData.verified_cost_note ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, verified_cost_note: e.target.value }))}
                  className={inputClass}
                  placeholder="Type 'undisclosed' to hide price"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Verified At (寃利앹씪??</label>
                <input
                  type="date"
                  value={formData.verified_at ? String(formData.verified_at).slice(0, 10) : ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, verified_at: e.target.value ? e.target.value : null }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>MOQ (理쒖냼二쇰Ц?섎웾)</label>
                <input
                  value={formData.moq ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, moq: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Lead Time (由щ뱶???</label>
                <input
                  value={formData.lead_time ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, lead_time: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Sample Policy (?섑뵆?뺤콉)</label>
                <input
                  value={formData.sample_policy ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, sample_policy: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Export Cert Note (?섏텧?몄쬆硫붾え)</label>
                <input
                  value={formData.export_cert_note ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, export_cert_note: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-widest pt-4">誘몃뵒??& 留덉????먯궛</p>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Viral Video URL (諛붿씠?댁쁺?갪RL)</label>
                <input
                  value={formData.viral_video_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, viral_video_url: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Video URL (?곸긽URL)</label>
                <input
                  value={formData.video_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, video_url: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Marketing Assets URL (留덉??낆옄?캵RL)</label>
                <input
                  value={formData.marketing_assets_url ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p!, marketing_assets_url: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <p className="text-xs font-semibold text-[#7C3AED] uppercase tracking-widest pt-4">AI ?먯궛</p>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>AI Detail Page Links (AI?곸꽭?섏씠吏留곹겕)</label>
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
            ?섏젙 ?대젰 (Edit History)
          </h2>
          <div className="overflow-x-auto">
            {(() => {
              const hist = formData.edit_history as { entries?: { timestamp: string; changes: { field: string; before: string; after: string }[] }[] } | null | undefined;
              const entries = Array.isArray(hist?.entries) ? hist.entries : [];
              if (entries.length === 0) {
                return (
                  <div className="px-6 py-8 text-center text-[#6B6860] text-sm">
                    ?꾩쭅 ?섏젙 ?대젰???놁뒿?덈떎.
                  </div>
                );
              }
              return (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#F8F7F4] border-b border-[#E8E6E1] text-xs font-semibold text-[#9E9C98] uppercase tracking-widest">
                      <th className="px-4 py-3">?쇱떆</th>
                      <th className="px-4 py-3">?꾨뱶 (?쒓?)</th>
                      <th className="px-4 py-3">蹂寃???/th>
                      <th className="px-4 py-3">蹂寃???/th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...entries].reverse().map((entry, ei) =>
                      entry.changes?.map((c, ci) => (
                        <tr key={`${ei}-${ci}`} className="border-t border-[#E8E6E1] text-sm">
                          <td className="px-4 py-2 text-[#6B6860] font-mono text-xs whitespace-nowrap">
                            {entry.timestamp ? new Date(entry.timestamp).toLocaleString("ko-KR") : "??}
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


## FILE: components/report/utils.ts
import { SHIPPING_TIER_TOOLTIP } from "./constants";

const GLOBAL_REGIONS = [
  { key: "us",  flag: "?눣?눡", label: "US",  fullLabel: "North America" },
  { key: "uk",  flag: "?눐?눉", label: "UK",  fullLabel: "United Kingdom" },
  { key: "eu",  flag: "?눎?눣", label: "EU",  fullLabel: "European Union" },
  { key: "jp",  flag: "?눓?눝", label: "JP",  fullLabel: "Japan" },
  { key: "sea", flag: "?눡?눐", label: "SEA", fullLabel: "Southeast Asia" },
  { key: "uae", flag: "?눇?눎", label: "UAE", fullLabel: "Middle East" },
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
    return { description: "Tier 2: 500g??kg", tooltip };
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
      return [{ icon: "?뱥", label: "Strategy Overview", color: "emerald", content: raw.trim() }];
    }
    return [];
  }
  const iconColorList: { icon: string; color: string }[] = [
    { icon: "?뱢", color: "emerald" },
    { icon: "?뮥", color: "amber" },
    { icon: "?룺", color: "blue" },
    { icon: "?뱥", color: "red" },
    { icon: "?벀", color: "purple" },
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
  /** Trimmed-median global retail summary; set by parseGlobalPricesForGrid when applicable. */
  globalRetailValuation?: number | null;
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
  globalPriceText: string | Record<string, unknown> | null | undefined,
  valuationContext?: { estimatedCost?: number | null; profitMultiplier?: number | null } | null
): RegionPriceRow[] {
  const out: RegionPriceRow[] = [];

  function attachGlobalValuation(rows: RegionPriceRow[]) {
    // Helper: 以묒쐞媛?怨꾩궛
    function calcMedian(nums: number[]): number {
      const sorted = [...nums].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    // Helper: ?ㅽ븨/?댁긽媛??쒓굅 ??以묒쐞媛?(?곹븯??15% ?쒓굅)
    function calcTrimmedMedian(nums: number[]): number {
      if (nums.length <= 2) return calcMedian(nums);
      const sorted = [...nums].sort((a, b) => a - b);
      const trimCount = Math.floor(sorted.length * 0.15);
      const trimmed = sorted.slice(trimCount, sorted.length - trimCount);
      return calcMedian(trimmed.length > 0 ? trimmed : sorted);
    }

    const pricedRows = rows.filter((r) => !r.isBlueOcean && r.priceDisplay);
    const parsedPrices = pricedRows
      .map((r) => parseFloat(r.priceDisplay?.replace(/[^0-9.]/g, "") ?? ""))
      .filter((n) => !isNaN(n) && n > 0);

    const estimatedCost = valuationContext?.estimatedCost ?? null;
    const profitMultiplier =
      valuationContext?.profitMultiplier != null
        ? parseFloat(String(valuationContext.profitMultiplier).replace(/[^0-9.]/g, "")) || 1
        : null;

    let globalValuation: number | null = null;

    if (parsedPrices.length === 1) {
      globalValuation = parsedPrices[0];
    } else if (parsedPrices.length >= 2) {
      globalValuation = calcTrimmedMedian(parsedPrices);
    } else if (estimatedCost && profitMultiplier) {
      globalValuation = estimatedCost * profitMultiplier;
    }

    for (const row of rows) {
      row.globalRetailValuation = globalValuation;
    }
  }
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
    // shopee_lazada ?곗씠?곕? SEA??蹂묓빀
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
      const data = flat[r.key];
      const priceUsd = data?.price_usd;
      const priceOrig = data?.price_original != null ? String(data.price_original).replace(/[$,]/g, "") : "";
      // Auto-derive price from listings if region price_usd is 0 or missing
      let effectivePriceUsd = priceUsd;
      if ((effectivePriceUsd == null || effectivePriceUsd === 0) && data?.listings?.length) {
        const activePrices = (data.listings as Array<{ price_usd?: number | null; sold_out?: boolean }>)
          .filter(l => !l.sold_out && typeof l.price_usd === "number" && l.price_usd > 0)
          .map(l => l.price_usd as number);
        if (activePrices.length > 0) {
          effectivePriceUsd = Math.min(...activePrices);
        }
      }
      // Auto-derive official_url from listings if not set
      let effectiveOfficialUrl = data?.official_url ?? null;
      if (!effectiveOfficialUrl && data?.listings?.length) {
        const officialListing = (data.listings as Array<{ url?: string | null; is_official?: boolean }>)
          .find(l => l.is_official === true);
        if (officialListing?.url) effectiveOfficialUrl = officialListing.url;
      }
      const num = effectivePriceUsd != null && effectivePriceUsd > 0
        ? effectivePriceUsd
        : priceOrig ? parseFloat(priceOrig) : NaN;
      const isBlueOcean = Number.isNaN(num) || num === 0;
      const priceDisplay = !isBlueOcean
        ? (typeof data?.price_original === "string"
            ? data.price_original
            : effectivePriceUsd != null && effectivePriceUsd > 0
              ? `$${effectivePriceUsd}`
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
        official_url: effectiveOfficialUrl,
        official_price_usd: (() => {
          if (!effectiveOfficialUrl || !data?.listings) return null;
          const found = (data.listings as Array<{ url?: string | null; price_usd?: number | null }>)
            .find(l => l.url === effectiveOfficialUrl);
          return (found?.price_usd && found.price_usd > 0) ? found.price_usd : null;
        })(),
        official_platform: (() => {
          if (!effectiveOfficialUrl || !data?.listings) return null;
          const found = (data.listings as Array<{ url?: string | null; platform?: string | null }>)
            .find(l => l.url === effectiveOfficialUrl);
          return found?.platform ?? null;
        })(),
        price_local: data?.price_local ?? null,
        currency: data?.currency ?? null,
        listings: (data?.listings ?? null) as RegionPriceRow["listings"],
      });
    }
    attachGlobalValuation(out);
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
      attachGlobalValuation(out);
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
  if (out.length > 0) {
    attachGlobalValuation(out);
    return out;
  }
  const fallback = GLOBAL_REGIONS.map((r) => ({
    flag: r.flag,
    label: r.label,
    priceDisplay: null,
    platform: null,
    isBlueOcean: true,
    url: null,
    official_url: null,
    official_price_usd: null,
    official_platform: null,
    price_local: null,
    currency: null,
    listings: null,
  }));
  attachGlobalValuation(fallback);
  return fallback;
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


