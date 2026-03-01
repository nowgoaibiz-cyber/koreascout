# K-Product Scout — UI/UX 전략 보고서 (v1.3)

> **작성:** 둘째 (Claude) — UI/UX 기획 & 전략 파트너
> **대상:** 셋째 (Cursor) — 프론트엔드 구현용
> **참조:** PROJECT_1SPEC.md (v1.2), PROJECT_3DATA_MAP.md (v1.3)
> **Date:** 2026-02-27

---

## 📍 Mission 1: 9개 섹션 데이터 시각화 디테일

> 원칙: "스크롤할수록 돈 냄새가 난다." 매 섹션이 다음 섹션을 궁금하게 만들어야 함.
> 디자인 톤: B2B SaaS 다크 모드. 차분하지만 핵심 숫자는 네온 강조.

---

### Section 1 — Product Identity (모든 Tier)

**목적:** "이게 뭔데?" → 3초 안에 상품 파악

```
┌─────────────────────────────────────────────────┐
│  [image_url]          product_name (한국어)       │
│  (메인 이미지)         translated_name (영어)      │
│  aspect 1:1           ─────────────────────       │
│  rounded-xl           category  뱃지              │
│  object-cover         export_status 뱃지          │
│                       viability_reason (1줄)      │
│                                                   │
│                       [▼ Product Specs]           │
│                       (아코디언 - 기본 접힘)       │
│                       └ composition_info          │
│                       └ spec_summary              │
└─────────────────────────────────────────────────┘
```

| 데이터 | 시각화 방식 | 노출 레벨 |
|--------|------------|----------|
| `image_url` | 1:1 비율 카드 이미지, rounded-xl, hover시 살짝 확대 | 메인 |
| `product_name` | 굵은 제목 (text-2xl font-bold) | 메인 |
| `translated_name` | 서브 제목 (text-lg text-gray-400) | 메인 |
| `category` | 컬러 뱃지 (예: Skincare=보라, Home=파랑, Food=초록) | 메인 |
| `export_status` | 신호등 뱃지: Green=🟢, Yellow=🟡, Red=🔴 + 텍스트 | 메인 |
| `viability_reason` | 이탤릭 한 줄 요약, text-sm, 아이콘(💡) 앞에 | 메인 |
| `composition_info` | 아코디언 "Product Specs ▼" 안에 | 상세 보기 |
| `spec_summary` | 아코디언 안, 줄바꿈 있는 텍스트 블록 | 상세 보기 |

**Cursor 구현 노트:**
- 아코디언은 `<details><summary>` 또는 커스텀 Disclosure 컴포넌트
- `composition_info`/`spec_summary`가 null이면 아코디언 자체를 렌더하지 않음
- `data_source`, `is_success`, `data_confidence` → **UI에 노출하지 않음** (내부 QA 지표)

---

### Section 2 — Trend Signal Dashboard (모든 Tier)

**목적:** "이거 진짜 뜨고 있어?" → Free 유저에게 확신을 심고 다음 섹션 갈증

```
┌──────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  MARKET   │  │ COMPETE  │  │  OPPORTUNITY  │  │
│  │  SCORE    │  │  LEVEL   │  │    STATUS     │  │
│  │           │  │          │  │               │  │
│  │   ◉ 85    │  │   Low    │  │  Blue Ocean   │  │
│  │  /100     │  │  🟢      │  │  🔵           │  │
│  └──────────┘  └──────────┘  └──────────────┘   │
│                                                   │
│  ⚡ "85/100 Market Score with Low Competition     │
│     — This is a Blue Ocean opportunity."          │
│     ─── AI-generated one-liner summary ───        │
└──────────────────────────────────────────────────┘
```

| 데이터 | 시각화 방식 |
|--------|------------|
| `market_viability` | **도넛 게이지 차트** (원형 프로그레스). 숫자를 중앙에 크게. 색상: 0-40 빨강, 41-70 노랑, 71-100 초록. |
| `competition_level` | **컬러 뱃지**: Low=🟢초록, Medium=🟡노랑, High=🔴빨강 |
| `gap_status` | **컬러 뱃지**: Blue Ocean=🔵파랑, Emerging=🟣보라, Saturated=⚫회색 |
| `export_status` | 위 Section 1에서 이미 노출. 여기선 생략 또는 작은 아이콘만. |
| (AI 요약) | 3개 지표를 조합한 한 줄 자동 생성 문장. 프론트엔드에서 템플릿 렌더링. |

**Cursor 구현 노트:**
- 도넛 게이지: CSS로 구현 (conic-gradient) 또는 가벼운 SVG. 라이브러리 불필요.
- 3개 카드를 `grid grid-cols-3 gap-4`로 가로 배치. 모바일에서 `grid-cols-1`.
- 하단의 AI 요약 문장은 프론트엔드에서 조립:
  ```ts
  `${market_viability}/100 Market Score with ${competition_level} Competition — This is a ${gap_status} opportunity.`
  ```

---

### Section 3 — Market Intelligence (Standard+ / 🔒Free)

**목적:** "얼마나 벌 수 있어?" → Free 유저가 가장 답답해하는 핵심 숫자들

```
┌──────────────────────────────────────────────────┐
│  💰 PROFIT POTENTIAL                              │
│  ┌────────────────────────────────────┐           │
│  │  KR Price        →   US Price     │           │
│  │  ₩3,900              $24.99       │           │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │           │
│  │          2.8x Profit Multiplier    │           │
│  └────────────────────────────────────┘           │
│                                                   │
│  📊 SEARCH & GROWTH                               │
│  ┌────────┐  ┌────────┐  ┌────────┐              │
│  │ Search │  │  MoM   │  │  WoW   │              │
│  │ Volume │  │ Growth │  │ Growth │              │
│  │ 50K+   │  │ +25%   │  │ +8%    │              │
│  │   📈   │  │   📈   │  │   📈   │              │
│  └────────┘  └────────┘  └────────┘              │
│                                                   │
│  🏪 Best Platform: Amazon FBA                     │
│                                                   │
│  [▼ Seller Intelligence]                          │
│  └ top_selling_point                              │
│  └ common_pain_point                              │
│  └ viral_hashtags (태그)                           │
└──────────────────────────────────────────────────┘
```

| 데이터 | 시각화 방식 |
|--------|------------|
| `kr_price` → `global_prices.us.price` | **가격 비교 바**: 좌측 한국 원가 → 우측 미국 판매가, 사이에 화살표. 차이를 강조하는 그라데이션 바. |
| `profit_multiplier` | **히어로 숫자**: text-4xl font-black, 네온 강조색(예: emerald-400). "2.8x" 형태. |
| `search_volume` | 카드 안에 큰 숫자 + 📈 아이콘. 텍스트 그대로. |
| `mom_growth` / `wow_rate` | 카드 안에 퍼센트 + 방향 화살표(↑초록 / ↓빨강). |
| `best_platform` | 플랫폼 아이콘(Amazon/eBay/Shopify) + 텍스트. |
| `top_selling_point` | 아코디언 "Seller Intelligence ▼" — 💎 아이콘 + 텍스트 |
| `common_pain_point` | 아코디언 안 — ⚠️ 아이콘 + 텍스트 ("Exploit this gap") |
| `viral_hashtags` | 아코디언 안 — 해시태그 칩(pill) 나열, 클릭 시 복사 |

**Cursor 구현 노트:**
- 가격 비교 바는 div 2개 + flex + 가운데 화살표 아이콘으로 간단히
- `viral_hashtags`는 TEXT[] 배열 → `.map(tag => <span className="pill">#{tag}</span>)`
- null 필드는 해당 카드/블록 자체를 숨김 (조건부 렌더링)

---

### Section 4 — Social Proof & Trend Intelligence (Standard+ / 🔒Free)

**목적:** "어디서 얼마나 화제야?" → 데이터로 확신 강화

```
┌──────────────────────────────────────────────────┐
│  🔥 SOCIAL BUZZ                                   │
│  "buzz_summary 텍스트 한두 줄"                     │
│                                                   │
│  📈 RISING KEYWORDS                               │
│  ┌─────┐ ┌──────────┐ ┌───────┐ ┌────────┐      │
│  │K-beauty│ │glass skin│ │sunscreen│ │viral│    │
│  └─────┘ └──────────┘ └───────┘ └────────┘      │
│                                                   │
│  📱 PLATFORM BREAKDOWN                            │
│  ┌──────────┬──────────┬──────────┬──────────┐   │
│  │ TikTok   │ Instagram│ YouTube  │ Reddit   │   │
│  │  ◉ 85    │  ◉ 72    │  ◉ 68   │ Positive │   │
│  │ /100     │ /100     │ /100    │  👍      │   │
│  │ "finding"│ "finding"│ "finding"│ "finding"│   │
│  └──────────┴──────────┴──────────┴──────────┘   │
│                                                   │
│  🌏 MARKET GAP ANALYSIS                           │
│  ┌────────────────────────────────────┐           │
│  │  Korea: 82/100  ████████░░        │           │
│  │  Global: 35/100 ████░░░░░░        │           │
│  │  Gap Index: 47 — "Blue Ocean"     │           │
│  └────────────────────────────────────┘           │
│                                                   │
│  [▼ Deep Analysis]                                │
│  └ opportunity_reasoning                          │
│  └ trend_entry_strategy                           │
│  └ new_content_volume                             │
└──────────────────────────────────────────────────┘
```

| 데이터 | 시각화 방식 |
|--------|------------|
| `buzz_summary` | 상단 인용문 스타일, 큰따옴표 아이콘, text-lg italic |
| `rising_keywords` | **태그 클라우드(칩/pill)**: TEXT[] 배열 → 각각 `bg-blue-500/20 text-blue-400 rounded-full px-3 py-1`. 호버 시 밝아짐. |
| `platform_scores` | **4열 카드 그리드**: 각 플랫폼별 (JSONB 파싱) — 상단: 플랫폼 로고/이름, 중앙: 미니 도넛 게이지(score/100), 하단: finding 한 줄. Reddit은 점수 대신 sentiment 텍스트 + 이모지. |
| `kr_local_score` vs `global_trend_score` | **수평 프로그레스 바 2개** 비교. Korea 바가 길고 Global이 짧으면 Gap이 크다는 걸 시각적으로 즉시 인지. |
| `gap_index` | 두 바 사이에 큰 숫자로 표시 + gap_status 뱃지 |
| `opportunity_reasoning` | 아코디언 "Deep Analysis ▼" 안. 긴 텍스트 블록. |
| `trend_entry_strategy` | 아코디언 안. 💡 아이콘 + 전략 텍스트 |
| `growth_signal` | Section 3의 MoM/WoW 근처에 뱃지로 이미 표현됨. 여기선 생략. |
| `new_content_volume` | 아코디언 안 작은 텍스트 ("📹 1,200+ new videos this month") |

**Cursor 구현 노트:**
- `platform_scores`는 JSONB → 프론트에서 파싱:
  ```ts
  interface PlatformScores {
    tiktok: { score: number; finding: string };
    instagram: { score: number; finding: string };
    youtube: { score: number; finding: string };
    reddit: { sentiment: string; finding: string };
  }
  ```
- 플랫폼 아이콘은 lucide-react 또는 간단한 SVG/이모지
- 모바일에서 4열 → 2x2 그리드

---

### Section 5 — Global Pricing Matrix (Standard: 가격O URL🔒 / Alpha: 전부)

**목적:** "전 세계에서 실제로 얼마에 팔려?" → Standard→Alpha 전환의 킬러 섹션

```
┌──────────────────────────────────────────────────┐
│  🌍 GLOBAL PRICING MATRIX                         │
│  "sourcing_tip (가격 인사이트 한 줄)"              │
│                                                   │
│  ┌──────────────────────────────────────────┐     │
│  │ Country │ Platform │ Price    │ Link     │     │
│  │─────────│──────────│──────────│──────────│     │
│  │ 🇺🇸 US   │ Amazon   │ $24.99  │ [🔗→]   │     │
│  │ 🇬🇧 UK   │ eBay     │ £19.99  │ [🔗→]   │     │
│  │ 🇸🇬 SEA  │ Shopee   │ $15.99  │ [🔗→]   │     │
│  │ 🇦🇺 AU   │ Amazon   │ A$29.99 │ [🔗→]   │     │
│  │ 🇮🇳 IN   │ Amazon   │ ₹1,499  │ [🔗→]   │     │
│  └──────────────────────────────────────────┘     │
│                                                   │
│  Standard: 링크 컬럼 전체에 🔒 오버레이            │
│  Alpha: 링크 클릭 가능 (새 탭)                     │
└──────────────────────────────────────────────────┘
```

| 데이터 | 시각화 방식 |
|--------|------------|
| `global_prices` (JSONB) | **테이블/카드 그리드**: 국가 국기 이모지 + 플랫폼명 + 가격 + 링크 버튼. JSONB에서 각 국가 키를 순회하며 렌더. |
| 가격 (price_original) | 굵은 숫자, 현지 통화 표기 |
| URL (링크) | **Alpha:** 아이콘 버튼 `[🔗 Visit →]` 클릭 → 새 탭. **Standard:** 같은 버튼이지만 🔒 아이콘 + 블러 + 클릭 불가. |
| `sourcing_tip` (from 145) | 섹션 상단에 한 줄 인사이트, italic, 💡 아이콘 |

#### Standard 유저의 URL 잠금 UI (핵심 디테일)

```
┌──────────────────────────────────────────┐
│ 🇺🇸 US  │ Amazon  │ $24.99  │  🔒 ░░░░  │  ← 링크 칸만 블러+자물쇠
│ 🇬🇧 UK  │ eBay    │ £19.99  │  🔒 ░░░░  │
│ 🇸🇬 SEA │ Shopee  │ $15.99  │  🔒 ░░░░  │
│ 🇦🇺 AU  │ Amazon  │ A$29.99 │  🔒 ░░░░  │
│ 🇮🇳 IN  │ Amazon  │ ₹1,499  │  🔒 ░░░░  │
├──────────────────────────────────────────┤
│  "You see the prices. Alpha sees the    │
│   actual stores. One click away."        │
│  [ Unlock All Links — $29/mo → ]         │
└──────────────────────────────────────────┘
```

**Cursor 구현 노트:**
- `global_prices` JSONB 구조 예시:
  ```ts
  interface GlobalPrices {
    us: { platform: string; price_original: string; url: string };
    uk: { platform: string; price_original: string; url: string };
    sea: { platform: string; price_original: string; url: string };
    australia: { platform: string; price_original: string; url: string };
    india: { platform: string; price_original: string; url: string };
  }
  ```
- 테이블의 마지막 컬럼(Link)에만 조건부 렌더링:
  ```tsx
  {tier === 'alpha' || isTeaser ? (
    <a href={price.url} target="_blank" className="text-blue-400 hover:underline">
      🔗 Visit →
    </a>
  ) : (
    <span className="blur-sm text-gray-500 select-none">🔒 ██████</span>
  )}
  ```
- **중요:** 가격 숫자/플랫폼명은 Standard에게 완전 공개. **오직 URL만 잠금.** 이게 "돈은 보이는데 가게 문이 잠겨있는" 느낌을 만듦.

---

### Section 6 — Export & Logistics Intel (Alpha 전용 / 🔒Free+Standard)

**목적:** "통관 어떻게 해?" → 실행에 필요한 물류 정보

```
┌──────────────────────────────────────────────────┐
│  📦 EXPORT & LOGISTICS                            │
│                                                   │
│  HS Code: 3304.99    [📋 Copy]                    │
│  "hs_description 텍스트"                           │
│                                                   │
│  ⚠️ HAZMAT CHECK                                  │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐            │
│  │💧 No │ │🧪 No │ │🔋 No │ │💨 Yes│            │
│  │Liquid│ │Powder│ │Battery││Aerosol│            │
│  └──────┘ └──────┘ └──────┘ └──────┘            │
│                                                   │
│  📐 DIMENSIONS & WEIGHT                           │
│  Size: 15 × 8 × 5 cm                             │
│  Billable: 450g (Standard Parcel)                 │
│                                                   │
│  🏷️ CERTIFICATIONS REQUIRED                       │
│  ┌──────────┐ ┌──────────┐                       │
│  │ FDA 510K │ │ CE Mark  │                       │
│  └──────────┘ └──────────┘                       │
│                                                   │
│  [▼ Detailed Logistics]                           │
│  └ shipping_notes                                 │
│  └ key_risk_ingredient                            │
│  └ status_reason (규제 근거)                       │
│  └ actual_weight vs volumetric_weight             │
│  └ sourcing_tip (물류 팁)                          │
└──────────────────────────────────────────────────┘
```

| 데이터 | 시각화 방식 |
|--------|------------|
| `hs_code` + `hs_description` | 코드는 monospace 폰트 + 복사 버튼(📋). 설명은 바로 아래 text-sm. |
| `hazmat_status` (JSONB) | **4개 아이콘 뱃지 가로 배열**: 각 항목(liquid/powder/battery/aerosol)별로 Yes=🔴빨강배경+아이콘 / No=🟢초록배경+아이콘. 즉시 위험 여부 스캔 가능. |
| `dimensions_cm` | 텍스트 표시 (W × H × D cm) |
| `billable_weight_g` + `shipping_tier` | "450g (Standard Parcel)" 형태 |
| `required_certificates` | 뱃지/칩으로 나열 (여러 개면 comma split) |
| `shipping_notes` | 아코디언 안 |
| `key_risk_ingredient` | 아코디언 안, ⚠️ 강조 |
| `status_reason` | 아코디언 안 |
| `actual_weight_g` vs `volumetric_weight_g` | 아코디언 안, 비교 표시 |

**Cursor 구현 노트:**
- `hazmat_status` JSONB:
  ```ts
  interface HazmatStatus {
    contains_liquid: boolean;
    contains_powder: boolean;
    contains_battery: boolean;
    contains_aerosol: boolean;
  }
  ```
- 복사 버튼: `navigator.clipboard.writeText(hs_code)` + 토스트 피드백

---

### Section 7 — Supplier & Contact (Alpha 전용 / 🔒Free+Standard)

**목적:** "누구한테 연락해?" → 소싱 실행의 마지막 퍼즐

```
┌──────────────────────────────────────────────────┐
│  🏭 SUPPLIER CONTACT                              │
│                                                   │
│  Company: 한국화장품(주)                            │
│  Scale: "Mid-size manufacturer, est. 2015"        │
│                                                   │
│  ┌─────────────────────────────────────┐          │
│  │ 📧 contact@koreaco.com    [Copy]   │          │
│  │ 📞 +82-2-1234-5678       [Copy]   │          │
│  │ 🌐 koreaco.com           [Visit]  │          │
│  │ 🛒 naver.com/store/...   [Visit]  │          │
│  │ 📦 Wholesale Inquiry     [Visit]  │          │
│  └─────────────────────────────────────┘          │
│                                                   │
│  [▼ Negotiation Tips]                             │
│  └ sourcing_tip (소싱/협상 팁)                     │
└──────────────────────────────────────────────────┘
```

| 데이터 | 시각화 방식 |
|--------|------------|
| `m_name` | 굵은 텍스트 + 🏭 아이콘 |
| `corporate_scale` | 서브텍스트, text-sm text-gray-400 |
| `contact_email` | 📧 + 이메일 + [Copy] 버튼 |
| `contact_phone` | 📞 + 전화번호 + [Copy] 버튼 |
| `m_homepage` | 🌐 + 도메인 표시 + [Visit →] 새탭 링크 |
| `naver_link` | 🛒 + "Naver Store" + [Visit →] |
| `wholesale_link` | 📦 + "Wholesale Inquiry" + [Visit →] |
| `sourcing_tip` (from 68) | 아코디언 "Negotiation Tips ▼" |

**Cursor 구현 노트:**
- 연락처 블록은 `bg-gray-800/50 rounded-lg p-4 border border-gray-700` 카드
- 각 항목에 복사/방문 버튼 (lucide-react의 Copy, ExternalLink 아이콘)
- `corporate_scale`은 메인에 노출하되 작게. 영업비밀 수준은 아니지만 너무 강조할 필요 없음.

---

### Section 8 — Media Vault (Alpha 전용 / 🔒Free+Standard)

**목적:** "직접 확인해" → 바이럴 증거 + 제품 영상

```
┌──────────────────────────────────────────────────┐
│  🎬 MEDIA VAULT                                   │
│                                                   │
│  ┌──────────────────┐  ┌──────────────────┐      │
│  │ 📹 Product Video  │  │ 🔥 Viral Video   │      │
│  │ (4K)              │  │ (Korean SNS)     │      │
│  │ [video embed]     │  │ [video embed]    │      │
│  │                   │  │                  │      │
│  └──────────────────┘  └──────────────────┘      │
│                                                   │
│  🖼️ AI Product Image                              │
│  [ai_image_url — 클릭 시 풀스크린 모달]             │
└──────────────────────────────────────────────────┘
```

| 데이터 | 시각화 방식 |
|--------|------------|
| `video_url` | YouTube/외부 영상 iframe 임베드 또는 링크 버튼 |
| `viral_video_url` | 동일. 2열 그리드로 나란히 배치. |
| `ai_image_url` | 이미지 카드. 클릭 시 모달로 확대. |

**Cursor 구현 노트:**
- 영상 임베드: YouTube URL이면 `<iframe>`, 아니면 `<a>` 링크 버튼으로 폴백
- 2열 그리드: `grid grid-cols-1 md:grid-cols-2 gap-4`
- null인 영상은 해당 카드 숨김

---

### Section 9 — Navigation (모든 Tier)

```
┌──────────────────────────────────────────────────┐
│  ← Previous Product    │    Next Product →        │
│                                                   │
│  📋 Back to Week 10 Product List                  │
│                                                   │
│  ┌──────────────────────────────────────────┐     │
│  │ (Tier별 동적 CTA)                        │     │
│  │ Free: "Unlock Market Data — $9/mo →"    │     │
│  │ Standard: "Go Alpha — $29/mo →"         │     │
│  │ Alpha: "You have full access ✨"         │     │
│  └──────────────────────────────────────────┘     │
└──────────────────────────────────────────────────┘
```

---

## 📍 Mission 2: Tier별 Paywall UX 시나리오

### Free 유저의 여정 (3중 FOMO)

```
📱 스크롤 시작

✅ Section 1 — Product Identity
   "오 다이소 콜라겐 마스크팩이구나. 수출 Green이네. 트렌드 이유도 그럴듯."

✅ Section 2 — Trend Signal Dashboard
   "시장성 85점?! 경쟁 Low?! 블루오션?! 이거 대박인데?!"

   ── 여기서 확신이 생긴 직후에 벽 ──

🔒 Section 3 — Market Intelligence
   [전체 블러 처리]
   블러 뒤로 "2.8x" 같은 큰 숫자가 어렴풋이 보임.
   숫자의 형태는 보이지만 읽을 수 없음.
   → 핵심: "수익률이 뭔가 크다는 건 알겠는데 정확히 몇 배인지 모르겠어"

🔒 Section 4 — Social Proof
   [전체 블러 처리]
   플랫폼 카드 4개의 형태와 색깔은 보이지만 점수가 안 보임.
   태그 클라우드도 블러. "뭔가 키워드가 많다는 건 알겠는데..."

🔒 Section 5~8 — 전부 잠금, 블러 한 장으로 통합

✅ Section 9 — Navigation
   "Unlock Full Market Intelligence — Start at $9/mo →"

💭 Free 유저의 내면:
   "85점 블루오션인 거 확인했는데, 수익률이 안 보여서 미치겠다.
    겨우 $9인데... 한 달이면 커피 두 잔 값이잖아."
```

**Free 잠금 디자인 규칙:**
- Section 3~4: **각각 개별 블러 + 개별 CTA** (두 번의 좌절감)
- Section 5~8: **하나의 큰 블러 블록으로 합침** (어차피 Free는 여기까지 안 보니까 간결하게)
- 블러 뒤에 **실제 컴포넌트의 윤곽이 보여야 함** → 데이터가 있다는 느낌. 빈 박스가 아님.

---

### Standard 유저의 여정 (Alpha 갈증)

```
📱 스크롤 시작

✅ Section 1 — "좋아, 이 상품이구나."
✅ Section 2 — "85점, Low, Blue Ocean. 알고 있지."

✅ Section 3 — Market Intelligence
   "수익률 2.8x! 검색량 50K! MoM +25%! 아마존 추천!
    셀링포인트도 있고, 해시태그도 복사했고."
   → 완전한 만족.

✅ Section 4 — Social Proof
   "틱톡 85점, 인스타 72점, 레딧 Positive!
    한국 82점 vs 글로벌 35점, Gap 47... 진짜 블루오션이다."
   → 확신 극대화.

✅ Section 5 — Global Pricing Matrix ⚡ (여기가 핵심)
   "US $24.99 Amazon, UK £19.99 eBay, SEA $15.99 Shopee...
    가격 다 보이고 플랫폼도 보이는데..."
   [Link 컬럼에만 🔒 블러]
   "...실제 판매 페이지 링크가 안 열려?! 🔒🔒🔒"

   → CTA: "You see the prices. Alpha sees the stores."
   → 💭 "아 ㅋㅋ 가격은 알겠는데 직접 찾으려면 30분은 서치해야 되잖아.
         $29면 바로 클릭해서 볼 수 있는데..."

🔒 Section 6 — Export & Logistics
   [블러] "HS Code가... 뭔가 숫자가 보이는데"
   → 💭 "통관 코드를 직접 조사하면 하루는 걸리는데..."

🔒 Section 7 — Supplier Contact
   [블러] "📧 ■■■@■■■.com / 📞 +82-■■-■■■■"
   이메일/전화번호 형태는 보이지만 읽을 수 없음.
   → 💭 "제조사 연락처가 바로 저기 있는데 $29 하나면 열리잖아.
         이 상품 하나만 성공해도 $500은 벌텐데."

🔒 Section 8 — Media Vault
   [블러된 영상 썸네일]
   → 💭 "바이럴 영상 증거까지 있다고? 보고 싶다..."

✅ Section 9 — "Become Alpha — $29/mo →"
```

**Standard 잠금 디자인 규칙:**
- Section 5: **테이블 자체는 완전 공개, Link 컬럼만 잠금** (이게 핵심. 가격이 보이니까 더 답답함)
- Section 6~7: **개별 블러 + 개별 CTA** (HS Code 따로, 연락처 따로. 각각의 가치를 인지시킴)
- Section 8: **블러된 영상 썸네일이 보여야 함** (빈 박스 아님)
- 잠금 섹션마다 **구체적으로 뭐가 잠겨있는지** 힌트를 줌 (예: "HS Code: ■■■■.■■")

---

### Alpha 유저의 경험

모든 섹션 전체 공개. 잠금 없음. 링크 전부 클릭 가능. 복사 버튼 전부 작동.
Section 9에 "You have full access ✨" 메시지로 프리미엄 소속감.

---

### is_teaser 리포트

Free/Standard도 Alpha와 **완전히 동일한 UI** 렌더. 잠금 없음.
- 프론트엔드에서 `if (isTeaser) → 모든 LockedSection 스킵`
- 리스트에서 "🆓 FREE THIS WEEK" 뱃지

---

## 📍 Mission 3: 킬러 CTA 카피라이팅

> 원칙: 짧고, 구체적이고, 돈 이야기를 한다.

---

### Free → Standard ($9) CTA들

#### Section 3 잠금 (Market Intelligence)

```
┌──────────────────────────────────────────────────┐
│  [블러 배경 — 수익률/검색량 숫자 형태가 어렴풋이]   │
│                                                   │
│  📊 The numbers are in. You just can't see them.  │
│                                                   │
│  This product has a ■.■x profit multiplier        │
│  with ■■K+ monthly searches.                      │
│                                                   │
│  ┌─────────────────────────────────────────┐      │
│  │  Unlock Market Intelligence — $9/mo →   │      │
│  └─────────────────────────────────────────┘      │
│                                                   │
│  ✓ Profit margins  ✓ Search trends               │
│  ✓ Growth rates    ✓ Platform recommendations     │
└──────────────────────────────────────────────────┘
```

**Headline:** `The numbers are in. You just can't see them.`
**Sub-copy:** `This product has a ■.■x profit multiplier with ■■K+ monthly searches.`
**Button:** `Unlock Market Intelligence — $9/mo →`
**Trust bullets:** 4개 (뭐가 열리는지 미리 보기)

#### Section 4 잠금 (Social Proof)

```
┌──────────────────────────────────────────────────┐
│  [블러 — 플랫폼 카드 4개 형태 보임]                │
│                                                   │
│  🔥 This product is trending on ■ platforms.      │
│     TikTok alone scored ■■/100.                   │
│                                                   │
│  ┌────────────────────────────────────────────┐   │
│  │  See What's Trending — $9/mo →              │   │
│  └────────────────────────────────────────────┘   │
│                                                   │
│  ✓ Platform scores  ✓ Rising keywords            │
│  ✓ Gap analysis     ✓ Entry strategy             │
└──────────────────────────────────────────────────┘
```

**Headline:** `This product is trending on ■ platforms.`
**Sub-copy:** `TikTok alone scored ■■/100.`
**Button:** `See What's Trending — $9/mo →`

---

### Standard → Alpha ($29) CTA들

#### Section 5 — Link 컬럼 잠금 (Global Pricing)

이건 풀 블러가 아니라 **테이블 안의 링크 컬럼만 잠금**이므로, 테이블 하단에 배치:

```
┌──────────────────────────────────────────────────┐
│  (가격 테이블 — 숫자는 다 보임)                     │
│  ...                                              │
│  ─────────────────────────────────────────────    │
│                                                   │
│  🔗 You see the prices.                           │
│     Alpha members see the actual stores.          │
│                                                   │
│  ┌────────────────────────────────────────────┐   │
│  │  Unlock All Links — Go Alpha $29/mo →       │   │
│  └────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

**Headline:** `You see the prices. Alpha members see the actual stores.`
**Button:** `Unlock All Links — Go Alpha $29/mo →`

#### Section 6 잠금 (Export & Logistics)

```
┌──────────────────────────────────────────────────┐
│  [블러 — HS Code 숫자 형태, Hazmat 아이콘 형태]    │
│                                                   │
│  📦 HS Code: ■■■■.■■ | Hazmat: ■ items flagged   │
│                                                   │
│  You know what sells.                             │
│  Now learn how to ship it.                        │
│                                                   │
│  ┌────────────────────────────────────────────┐   │
│  │  Unlock Logistics Intel — $29/mo →          │   │
│  └────────────────────────────────────────────┘   │
│                                                   │
│  ✓ HS codes     ✓ Hazmat checks                  │
│  ✓ Dimensions   ✓ Certifications                 │
└──────────────────────────────────────────────────┘
```

**Headline:** `You know what sells. Now learn how to ship it.`
**Button:** `Unlock Logistics Intel — $29/mo →`

#### Section 7 잠금 (Supplier Contact)

```
┌──────────────────────────────────────────────────┐
│  [블러 — 이메일/전화 형태 보임]                     │
│                                                   │
│  🏭 Manufacturer: ■■■■■ Co., Ltd.                 │
│     📧 ■■■@■■■.co.kr                              │
│     📞 +82-■■-■■■■-■■■■                           │
│                                                   │
│  The supplier is right here.                      │
│  One upgrade away.                                │
│                                                   │
│  ┌────────────────────────────────────────────┐   │
│  │  Get Supplier Contact — $29/mo →            │   │
│  └────────────────────────────────────────────┘   │
│                                                   │
│  💡 One successful product pays for a full year.  │
└──────────────────────────────────────────────────┘
```

**Headline:** `The supplier is right here. One upgrade away.`
**Button:** `Get Supplier Contact — $29/mo →`
**Trust line:** `💡 One successful product pays for a full year of Alpha.`

#### Section 8 잠금 (Media Vault)

```
┌──────────────────────────────────────────────────┐
│  [블러된 영상 썸네일 2개]                          │
│                                                   │
│  🎬 See the viral Korean video that              │
│     started the trend — ■■K views in ■ days.     │
│                                                   │
│  ┌────────────────────────────────────────────┐   │
│  │  Unlock Media Vault — $29/mo →              │   │
│  └────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

**Headline:** `See the viral Korean video that started the trend.`
**Button:** `Unlock Media Vault — $29/mo →`

---

## Appendix: Cursor용 컴포넌트 체크리스트

### 새로 만들어야 할 컴포넌트

| 컴포넌트명 | 용도 | 위치 |
|-----------|------|------|
| `DonutGauge` | market_viability 원형 게이지 | Section 2 |
| `StatusBadge` | competition_level, gap_status, export_status 뱃지 | 여러 곳 |
| `PriceComparisonBar` | KR Price → Global Price 비교 바 | Section 3 |
| `PlatformScoreCard` | 틱톡/인스타/유튜브/레딧 점수 카드 | Section 4 |
| `TagCloud` | rising_keywords, seo_keywords, viral_hashtags 태그 | Section 3, 4 |
| `GapAnalysisBar` | kr_local_score vs global_trend_score 비교 | Section 4 |
| `GlobalPricingTable` | 국가별 가격 테이블 + URL 잠금 | Section 5 |
| `HazmatBadges` | hazmat_status 4개 아이콘 뱃지 | Section 6 |
| `ContactCard` | 제조사 연락처 블록 | Section 7 |
| `MediaEmbed` | video_url, viral_video_url 임베드 | Section 8 |
| `LockedSection` | 기존 컴포넌트 확장 — CTA 카피 다양화 | 모든 잠금 섹션 |
| `CopyButton` | HS Code, 이메일, 전화번호 복사 | Section 6, 7 |
| `Accordion` | 상세 보기 접기/펼치기 | Section 1, 3, 4, 6, 7 |

### 기존 컴포넌트 수정

| 컴포넌트 | 수정 사항 |
|---------|----------|
| `LockedSection` | 현재: 고정 message/cta/href. 수정: headline, sub_copy, button_text, trust_bullets 등 props 추가하여 섹션별 다른 카피 지원. |

### 모든 CTA 버튼 링크

모든 결제 유도 버튼은 → `/pricing` 이동. 직접 결제 아님.

---

> **이 보고서를 셋째(Cursor)에게 전달할 때:**
> 1. 이 파일(`PROJECT_4UI_STRATEGY.md`)을 프로젝트 루트에 저장
> 2. Cursor Composer에서: "Read PROJECT_4UI_STRATEGY.md and implement Section [N] following the visualization specs."
> 3. 한 섹션씩 순서대로 구현. Section 1→2→3→4→5→6→7→8→9.

---

**끝. 이제 코딩만 남았다. 🚀**
