# Global Prices 전수 감사 (PDP UNTAPPED ↔ Admin GlobalPricesHelper)

**범위:** 읽기 전용 코드 스캔. 본 문서 생성만 수행 (애플리케이션 소스는 미수정).  
**목적:** `GlobalPricesHelper` 수정 전, Make 파이프라인과 충돌 없이 `listings` 변경 시 `price_usd` / `seller_type` 자동 반영을 하려면 어디를 고쳐야 하는지에 대한 단일 기준 문서.

---

## STEP 1: `MarketIntelligence.tsx` — UNTAPPED 판단 및 표시

### 1.1 `parseGlobalPricesForGrid` 위치 (중요)

함수 **본문은 `components/report/MarketIntelligence.tsx`에 없음**. 아래에서 `./utils`로 import 됨.

- Import: `components/report/MarketIntelligence.tsx` **L7**
- 호출: **L152** — `parseGlobalPricesForGrid(report.global_prices, report.global_price as ...)`

**전체 함수**는 `components/report/utils.ts` **L135–L288**에 있음. 아래에 전문 인용.

### 1.2 `parseGlobalPricesForGrid` 전체 (`utils.ts` L135–L288)

```ts
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
      const data = flat[r.key];
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
```

(`GLOBAL_REGIONS` 정의: 동일 파일 **L3–L10** — 키 `us` / `uk` / `eu` / `jp` / `sea` / `uae`.)

### 1.3 지역별(US/UK/EU/JP/SEA/UAE) UNTAPPED · 가격 · 공식 스토어 조건

PDP 6개 카드는 **모두 동일한 분기**를 씀 (`MarketIntelligence.tsx` **L282–L308**).

| 표시 | 조건 (정확히) | 근거 라인 |
|------|----------------|-----------|
| **"Untapped"** + **"No established sellers detected."** | `isUntapped === true` 인 경우. `isUntapped = !market.row \|\| market.row.isBlueOcean` | **L282–L304** |
| **"Best Price" 블록의 금액** (`$XX` 형태) | `isUntapped === false` 이고 `market.row`가 있을 때 `ListingsBlock` 렌더. 블록 상단 금액은 `bestPriceListing?.price_usd`가 있으면 `$` + 고정소수, 없으면 `row.priceDisplay` 폴백 | `ListingsBlock` **L38–L40**, **L76–L79**; 분기 **L306–L308** |
| **"Official Store"** + **$XX** | `showOfficialSeparately && officialListing && (row.official_price_usd ?? 0) > 0` — 여기서 `official_price_usd`는 `official_url`과 일치하는 listing의 `price_usd`에서 파생 (`parseGlobalPricesForGrid`가 row에 넣음) | `ListingsBlock` **L37**, **L85–L96**; `official_price_usd` 계산 **utils.ts L225–L229** |

**핵심:** 카드가 UNTAPPED인지는 **`parseGlobalPricesForGrid`가 만든 `row.isBlueOcean`**에 달림. 이 값은 **지역 객체의 `price_usd` / `price_original`만**으로 계산됨 (`num` → `isBlueOcean`).  
**예외:** **SEA**는 `shopee_lazada` 병합 후 **listings 중 최저가로 `flat.sea.price_usd`/`url`을 보강**할 수 있음 (**utils.ts L176–L196**). **US/UK/EU/JP/UAE**는 이 listing 기반 보강이 **없음** — region 레벨 `price_usd`가 0이거나 없으면 `isBlueOcean === true`이고, **listings에 가격이 있어도** UNTAPPED로 남을 수 있음.

### 1.4 지역 객체에서 읽는 필드 (`parseGlobalPricesForGrid` → `RegionPriceRow`)

각 리전 `data`(flatten 후)에서 읽는 것:

- **`price_usd`**, **`price_original`** → 숫자 `num`, **`isBlueOcean`**, **`priceDisplay`**
- **`platform`**, **`review_data`**, **`seller_type`**, **`url`**, **`official_url`**
- **`price_local`**, **`currency`**
- **`listings`** — 그대로 `RegionPriceRow.listings`에 전달 + `official_url`이 있으면 그 URL과 매칭되는 listing에서 **`official_price_usd` / `official_platform` 파생**

`ListingsBlock`은 추가로 각 listing의 **`price_usd`**, **`url`**, **`platform`**, **`title`**, **`sold_out`**(타입 캐스팅)을 사용함 (`MarketIntelligence.tsx` **L25–L37**, **L110–L125**).

### 1.5 지역 카드 JSX (UNTAPPED vs 가격) — `MarketIntelligence.tsx` **L259–L327**

6개 시장 그리드 및 `isUntapped` / `ListingsBlock` 분기는 **L259–L327** (내부 `sixMarkets.map`은 **L282–L313**).

요약 인용:

- **L282–L284:** `const isUntapped = !market.row || market.row.isBlueOcean;`
- **L294–L307:** `isUntapped`이면 "Untapped" + "No established sellers detected."; 아니면 `<ListingsBlock row={market.row} />`

---

## STEP 2: `GlobalPricesHelper.tsx` — 현재 구조

파일: `components/admin/GlobalPricesHelper.tsx`

### 2.1 L60–L160 (요청 범위 그대로)

해당 구간은 `getRegionData` 일부, **`normalizeListing`**, **`getRegionListings`**, `getBestPrice` 등, **`setRegionListings`의 앞부분**까지 포함. **`setRegionListings` 전체는 L135–L191**까지 이어짐.

```tsx
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
```

**`setRegionListings` 나머지 (L161–L191):** `gb`/`eu`/`jp`/`uae` 등 동일 패턴으로 **해당 노드의 `listings`만** 할당.

### 2.2 L200–L320 (요청 범위 그대로)

```tsx
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
    },
    [updateRegionListings]
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
```

### 2.3 리스팅 행 JSX (Platform / Price / URL / Sold Out) — **L346–L420**

각 행: Platform 입력 **L351–L362**, Price **L363–L377**, URL **L378–L389**, **Sold Out** 체크박스 **L390–L403**, 링크/삭제 버튼 **L404–L419**.

**Sold Out 체크박스 정확 위치:** **L390–L403** (`<label>` 안의 `<input type="checkbox" />` + 텍스트 "Sold Out").

### 2.4 `setListing` 호출 시 region-level 필드 자동 갱신 여부

| 필드 | 자동 업데이트? | 근거 |
|------|----------------|------|
| **`price_usd` (region)** | **NO** | `updateRegionListings` → `setRegionListings`는 **`listings` 배열만** 해당 region 노드에 씀 (**L135–L191**). `price_usd`를 쓰는 코드 없음. |
| **`seller_type` (region)** | **NO** | 동일 — region 객체에 `seller_type`을 설정하는 경로 없음. |
| **`official_url` (region)** | **NO** | UI에 `official_url` 편집 필드 없음; `setRegionListings`도 `official_url` 미변경. |

### 2.5 `emit()` 전체 — **L211–L216**

```ts
  const emit = useCallback(
    (next: GlobalPricesLike) => {
      setData(next);
      onChange(JSON.stringify(next));
    },
    [onChange]
  );
```

---

## STEP 3: Make 블루프린트 (`2__Perplexity_blueprint__17_.json`)

**결과:** 본 저장소(`c:\k-productscout`) 내에서 해당 파일 및 `*blueprint*.json` **검색 결과 0건**. **node 72 / `global_prices` 매퍼 원문은 이 레포에 없음.**

### 3.1 레포 외부에서 확인 필요

Make 시나리오 JSON을 워크스페이스에 두면 동일 감사를 재실행할 수 있음.

### 3.2 관측 가능한 `global_prices` 계약 (문서·타입·샘플 기준)

- `_docs/중복_비교분석.md` 등에 실제 JSON 샘플이 길게 인용되어 있으며, 구조는 대략:
  - `us_uk_eu.us` / `us_uk_eu.uk` / `us_uk_eu.eu`
  - `jp_sea.jp` / `jp_sea.sea`
  - `uae.uae`
  - (선택) 최상위 `shopee_lazada` — **PDP 파서가 SEA와 병합**
- 각 region 객체에 **`price_usd`**, **`url`**, **`official_url`**, **`review_data`**, **`seller_type`**, **`listings[]`** 등이 등장.

**Make가 region `price_usd` / `seller_type` / `listings`를 채우는지**는 블루프린트 없이는 코드로 단정 불가. 다만 PDP는 **`parseGlobalPricesForGrid`**가 **region 레벨 `price_usd`**로 UNTAPPED를 판정하므로, Make가 **`price_usd: 0` + 빈 `listings`** 또는 **`Untapped` 문자열**을 넣는 패턴이면 UNTAPPED와 일치함.

---

## STEP 4: Gap 분석 (요청 답변)

1. **Admin이 UK에 $25 listing만 추가했을 때, UK region `price_usd`가 25로 자동 갱신되나?** → **현재 NO.** `setRegionListings`는 `us_uk_eu.uk.listings`만 갱신 (**L166–L170**). `parseGlobalPricesForGrid`는 UK의 **`data.price_usd`**로 `isBlueOcean` 판정 (**utils.ts L200–L203**).

2. **listing 추가 시 `seller_type` 자동 갱신?** → **현재 NO.** (`setListing` / `setRegionListings`에 해당 로직 없음.)

3. **listing 행에 "Official" 체크박스가 있나?** → **NO.** **Sold Out**만 있음 (**GlobalPricesHelper.tsx L390–L403**). Region `official_url` 편집 UI도 없음.

4. **UNTAPPED → PDP에 실제 가격이 나오게 하려면 `GlobalPricesHelper`에서 필요한 변화 (방향)**

   - **옵션 A (Admin만 수정):** `emit` 직전 또는 `setRegionListings` 안에서, listings(및 SEA의 shopee 분리 규칙)로부터 **`price_usd`**, 필요 시 **`url`**, **`seller_type`**, **`official_url`**을 **파생 규칙에 맞게** region 객체에 씀. PDP의 `parseGlobalPricesForGrid`는 수정 없이도 **region `price_usd` > 0**이면 `isBlueOcean`이 false가 됨 (**utils.ts L200–L203**).
   - **옵션 B (PDP 파서 수정):** `parseGlobalPricesForGrid`에서 US/UK/EU/JP/UAE도 SEA처럼 **listings 최저가로 `num`/`isBlueOcean` 보강**. 이 경우 Admin이 region `price_usd`를 안 맞춰도 되지만 **Make 출력 의미가 바뀌는지**와 **중복 규칙**을 블루프린트와 맞춰야 함.

**Make 파이프라인 보호:** 최상위 키 `us_uk_eu`, `jp_sea`, `uae`, `shopee_lazada` 유지, 기존 필드명 유지, **추가 필드**는 보통 안전 — 단, 시나리오가 정확히 고정 JSON을 기대하면 **문자열 길이/타입** 확인 필요.

---

## 라인 번호 빠른 색인

| 항목 | 파일 | 라인 |
|------|------|------|
| `parseGlobalPricesForGrid` 전체 | `components/report/utils.ts` | 135–288 |
| `isBlueOcean` / `num` | `components/report/utils.ts` | 198–203 |
| SEA + `shopee_lazada` 병합 | `components/report/utils.ts` | 176–196 |
| `official_price_usd` 파생 | `components/report/utils.ts` | 225–236 |
| `parseGlobalPricesForGrid` 호출 | `components/report/MarketIntelligence.tsx` | 152 |
| `isUntapped` / Untapped 문구 | `components/report/MarketIntelligence.tsx` | 282–304 |
| `ListingsBlock` Best / Official | `components/report/MarketIntelligence.tsx` | 22–137 (컴포넌트), 특히 37–96 |
| `normalizeListing` | `components/admin/GlobalPricesHelper.tsx` | 66–83 |
| `getRegionListings` | `components/admin/GlobalPricesHelper.tsx` | 85–97 |
| `setRegionListings` (전체) | `components/admin/GlobalPricesHelper.tsx` | 135–191 |
| `emit` | `components/admin/GlobalPricesHelper.tsx` | 211–216 |
| `updateRegionListings` / `setListing` / `addListing` | `components/admin/GlobalPricesHelper.tsx` | 218–249 |
| 리스팅 행 입력 + Sold Out | `components/admin/GlobalPricesHelper.tsx` | 346–420 |

---

*문서 끝.*
