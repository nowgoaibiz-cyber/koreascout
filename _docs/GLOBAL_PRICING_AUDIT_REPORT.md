# GLOBAL PRICING AUDIT 2.0 — DEEP SCAN REPORT (Read-Only)

**Scope:** All hardcoded pricing values (current, legacy, and marketing).  
**Rule:** No code was modified. This is a scan-only audit.

---

## 1. app/page.tsx

| Line | Snippet | Context |
|------|--------|--------|
| 22 | `const ALPHA_MAX = 3000;` | Alpha 멤버십 최대 인원 상수 (가격 아님, 정책 숫자) |
| 498 | `<span ...>$0</span>` | Scout Free 티어 가격 표시 |
| 538 | `$69` | Standard 티어 월 가격 |
| 543 | `Approx. $2.30 / day` | Standard 일일 환산 마케팅 문구 |
| 555 | `$2.30/day — less than your morning coffee` | Standard 카드 본문 복사 |
| 566 | `Start Knowing — $69/mo` | Standard CTA 버튼 |
| 596 | `$129` | Alpha 티어 월 가격 |
| 601 | `Approx. $4.30 / day` | Alpha 일일 환산 마케팅 문구 |
| 613 | `$4.30/day. Your Seoul-based sourcing team` | Alpha 카드 본문 복사 |
| 638 | `Go Alpha — $129/mo` | Alpha CTA 버튼 |
| 685 | `$129/mo. Perfect synergy.` | Trust 섹션 "Your Synergy" 카드 본문 |

**Context:** 랜딩 페이지 메인 가격 카드(Free / Standard / Alpha) 및 Trust 섹션 카피. 현재 플랜 가격: $69 (Standard), $129 (Alpha).

---

## 2. app/pricing/page.tsx

| Line | Snippet | Context |
|------|--------|--------|
| 6 | `description: "Compare Free, Standard $9, and Alpha $29. Choose your intelligence level."` | 메타데이터 description — **레거시 가격 ($9, $29)** |
| 13 | `const ALPHA_MAX_SPOTS = 3000;` | Alpha 최대 스팟 수 상수 |
| 150 | `$0` | Scout Free 티어 가격 |
| 191 | `$69` | Standard 월 가격 |
| 196 | `Approx. $2.30 / day` | Standard 일일 환산 |
| 221 | `Start Knowing — $69/mo` | Standard CTA |
| 251 | `$129` | Alpha 월 가격 |
| 256 | `Approx. $4.30 / day` | Alpha 일일 환산 |
| 292 | `Go Alpha — $129/mo` | Alpha CTA 버튼 |
| 424 | `For under $4.50 a day.` | Final FOMO 섹션 마케팅 문구 |
| 447 | `Start with Standard — $69/mo` | 하단 Standard CTA |
| 463 | `Go Alpha — $129/mo` | 하단 Alpha CTA |

**Context:** 가격 전용 페이지. SEO description에 **레거시 $9 / $29** 가 남아 있음. UI는 현재 가격 $69 / $129 사용.

---

## 3. app/weekly/[weekId]/[id]/page.tsx

| Line | Snippet | Context |
|------|--------|--------|
| 186 | `Unlock Full Market Intelligence — Start at $9/mo →` | Free 유저용 업그레이드 링크 — **레거시 $9** |
| 191 | `Go Alpha — Get Supplier Contacts for $29/mo →` | Standard 유저용 Alpha 업그레이드 링크 — **레거시 $29** |

**Context:** 주간 리포트 상세 페이지. 레거시 MVP 가격 ($9, $29) 하드코딩.

---

## 4. components/LandingTimeWidget.tsx

| Line | Snippet | Context |
|------|--------|--------|
| 106 | `<span ...>$129/month</span>` | Alpha 비용 표시 (Cost 행) |

**Context:** 랜딩 위젯 내 “Cost” 라벨 옆 현재 Alpha 월 가격.

---

## 5. components/GlobalPricingTable.tsx

| Line | Snippet | Context |
|------|--------|--------|
| 42 | `return t === "" \|\| t === "$0" \|\| t === "0";` | “무료/가격 없음” 판별용 문자열 비교 ($0) |

**Context:** 글로벌 가격 테이블에서 빈/무료 가격 처리. 표시용 가격이 아닌 로직용.

---

## 6. components/ui/PaywallOverlay.tsx

| Line | Snippet | Context |
|------|--------|--------|
| 24 | `tier === 'alpha' ? 'Go Alpha $29/mo →' : 'Go Standard $9/mo →'` | Paywall CTA 텍스트 — **레거시 $9, $29** |

**Context:** Paywall 오버레이 CTA. 레거시 MVP 가격 하드코딩.

---

## 7. components/report/constants.ts

| Line | Snippet | Context |
|------|--------|--------|
| 4 | `cta: "Unlock Market Intelligence — $9/mo →"` | **레거시 $9** |
| 11 | `cta: "Start Standard — $9/mo"` | **레거시 $9** |
| 18 | `cta: "See What's Trending — $9/mo →"` | **레거시 $9** |
| 25 | `cta: "Start Standard — $9/mo"` | **레거시 $9** |
| 32 | `cta: "Unlock Logistics Intel — $29/mo →"` | **레거시 $29** |
| 39 | `cta: "Unlock Media Vault — $29/mo →"` | **레거시 $29** |
| 47 | `cta: "Get Supplier Contact — $29/mo →"` | **레거시 $29** |

**Context:** 리포트 잠금 섹션 CTA 상수. 전부 레거시 $9 / $29.

---

## 8. components/report/SourcingIntel.tsx

| Line | Snippet | Context |
|------|--------|--------|
| 247 | `<Button ...>Go Alpha $29/mo →</Button>` | **레거시 $29** CTA 버튼 |

**Context:** 소싱 인텔 섹션 Alpha 업그레이드 버튼.

---

## 9. components/report/SocialProofTrendIntelligence.tsx

| Line | Snippet | Context |
|------|--------|--------|
| 184 | `<Button ...>Go Alpha $29/mo →</Button>` | **레거시 $29** CTA |
| 224 | `<Button ...>Go Alpha $29/mo →</Button>` | **레거시 $29** CTA (다른 블록) |

**Context:** 소셜/트렌드 인텔 컴포넌트 내 Alpha 업셀 버튼 2곳.

---

## 10. app/api/webhooks/lemonsqueezy/route.ts

| Line | Snippet | Context |
|------|--------|--------|
| 7 | `/** Standard $9 — checkout URL UUID ... */` | 주석 — **레거시 $9** |
| 9 | `/** Alpha $29 — checkout URL UUID */` | 주석 — **레거시 $29** |

**Context:** LemonSqueezy 웹훅 라우트. 코드는 UUID만 사용하고, 주석에 레거시 가격 표기.

---

## 11. data/sampleReportData.ts

| Line | Snippet | Context |
|------|--------|--------|
| 32 | `US: "$22.50"` | 샘플 리포트 국가별 가격 (제품 리테일) |
| 34 | `SEA: "$15.00"` | 샘플 리포트 국가별 가격 |
| 35 | `AU: "$18.50"` | 샘플 리포트 국가별 가격 |
| 48 | `Retail positioning at $24. Direct B2B...` | 샘플 sourcing_tip 문구 내 $24 |
| 77 | `price_original: "$22.50"` | 샘플 global_prices US |
| 89 | `price_original: "$18.50"` | 샘플 global_prices AU |
| 95 | `price_original: "$15.00"` | 샘플 global_prices SEA |

**Context:** 샘플 리포트/데모용 데이터. 구독 가격이 아니라 **제품 리테일/글로벌 가격** 예시.

---

## 12. types/database.ts

| Line | Snippet | Context |
|------|--------|--------|
| 56 | `/** JSONB — 국가별 가격 { "US": "$24.99", ... } */` | 스키마 주석 예시 (가격 필드 설명) |

**Context:** DB 타입/스키마 문서용 예시. 실제 표시 가격 아님.

---

## 요약

### 현재 플랜 가격 (일관 적용 권장)

- **Standard:** $69/mo, 일일 환산 $2.30/day  
- **Alpha:** $129/mo, 일일 환산 $4.30/day, 마케팅 문구 “under $4.50 a day”  
- **Free:** $0  

### 레거시 MVP 가격 ($9 / $29) — 일괄 검토 권장

- **app/pricing/page.tsx** — metadata description  
- **app/weekly/[weekId]/[id]/page.tsx** — 업그레이드 링크 2곳  
- **components/ui/PaywallOverlay.tsx** — Paywall CTA  
- **components/report/constants.ts** — CTA 상수 7곳  
- **components/report/SourcingIntel.tsx** — 버튼 1곳  
- **components/report/SocialProofTrendIntelligence.tsx** — 버튼 2곳  
- **app/api/webhooks/lemonsqueezy/route.ts** — 주석 2곳  

### 기타 숫자

- **3000:** Alpha 최대 스팟 (`app/page.tsx`, `app/pricing/page.tsx`) — 가격이 아닌 정책 상수.  
- **$0:** Free 티어 및 GlobalPricingTable “무료” 판별 로직.  
- **sampleReportData.ts** 의 $22.50, $18.50, $15.00, $24 — 제품/리테일 샘플 데이터.

---

*Report generated by read-only audit. No code was modified.*
