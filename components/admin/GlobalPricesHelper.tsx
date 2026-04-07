"use client";

import { useState, useEffect, useCallback } from "react";

// ——— Types ———
type ListingItem = {
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
  { key: "us", flag: "🇺🇸", name: "US" },
  { key: "gb", flag: "🇬🇧", name: "UK" },
  { key: "eu", flag: "🇪🇺", name: "EU" },
  { key: "jp", flag: "🇯🇵", name: "Japan" },
  { key: "sea", flag: "🇸🇬", name: "SEA" },
  { key: "uae", flag: "🇦🇪", name: "UAE" },
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
    const price_usd = typeof o.price_usd === "number" ? o.price_usd : 0;
    const sold_out = o.sold_out === true;
    const item: ListingItem = {
      platform: typeof o.platform === "string" ? o.platform : "",
      price_usd,
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
    return next;
  }
  if (regionKey === "gb") {
    if (!next.us_uk_eu) next.us_uk_eu = {};
    if (!next.us_uk_eu.uk) next.us_uk_eu.uk = {};
    next.us_uk_eu.uk.listings = listings.map(stripSource);
    return next;
  }
  if (regionKey === "eu") {
    if (!next.us_uk_eu) next.us_uk_eu = {};
    if (!next.us_uk_eu.eu) next.us_uk_eu.eu = {};
    next.us_uk_eu.eu.listings = listings.map(stripSource);
    return next;
  }
  if (regionKey === "jp") {
    if (!next.jp_sea) next.jp_sea = {};
    if (!next.jp_sea.jp) next.jp_sea.jp = {};
    next.jp_sea.jp.listings = listings.map(stripSource);
    return next;
  }
  if (regionKey === "uae") {
    if (!next.uae) next.uae = {};
    if (!next.uae.uae) next.uae.uae = {};
    next.uae.uae.listings = listings.map(stripSource);
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
      // Official 체크 시 region official_url 자동 반영
      setData((prev) => {
        const next = JSON.parse(JSON.stringify(prev)) as GlobalPricesLike;

        // 해당 region의 official_url 업데이트
        const setOfficialUrl = (regionObj: Record<string, unknown> | undefined, url: string | null) => {
          if (regionObj) regionObj.official_url = url;
        };

        if (listing.is_official && listing.url) {
          // Official 체크 ON → 이 URL을 official_url로 설정
          if (regionKey === "us") setOfficialUrl(next.us_uk_eu?.us as Record<string, unknown>, listing.url);
          else if (regionKey === "gb") setOfficialUrl(next.us_uk_eu?.uk as Record<string, unknown>, listing.url);
          else if (regionKey === "eu") setOfficialUrl(next.us_uk_eu?.eu as Record<string, unknown>, listing.url);
          else if (regionKey === "jp") setOfficialUrl(next.jp_sea?.jp as Record<string, unknown>, listing.url);
          else if (regionKey === "sea") setOfficialUrl(next.jp_sea?.sea as Record<string, unknown>, listing.url);
          else if (regionKey === "uae") setOfficialUrl(next.uae?.uae as Record<string, unknown>, listing.url);
        } else if (!listing.is_official) {
          // Official 체크 OFF → 다른 Official 체크된 listing이 없으면 official_url 제거
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
                {openRegions[regionKey] !== false ? "▼" : "▶"}
              </span>
            </button>

            {/* Listings — expand when open */}
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
                    <span className="text-sm text-[#1A1916] flex-1">이 항목을 삭제하시겠습니까?</span>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(null)}
                      className="text-sm px-3 py-1.5 rounded border border-[#E8E6E1] bg-white text-[#1A1916] hover:bg-[#F8F7F4] transition-colors"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteListing(regionKey, originalIndex);
                        setPendingDelete(null);
                      }}
                      className="text-sm px-3 py-1.5 rounded border border-[#DC2626] bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FECACA] transition-colors"
                    >
                      삭제
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
                    🔗
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete({ regionKey, index: originalIndex })}
                    className="text-[#9E9C98] hover:text-[#1A1916] text-sm px-1.5 py-1 rounded transition-colors bg-transparent border-none cursor-pointer flex-shrink-0"
                    aria-label="Delete"
                  >
                    🗑
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
