# AUDIT MISSION 2: Dark Mode Remnants — Full Page Scan

**Date:** 2025-03-01  
**Rule:** Read and report only. Zero code changes.

---

## TASK 1: All Routes Found

### page.tsx
```
app/account/page.tsx
app/admin/[id]/page.tsx
app/admin/login/page.tsx
app/admin/page.tsx
app/login/page.tsx
app/page.tsx
app/pricing/page.tsx
app/signup/page.tsx
app/weekly/[weekId]/[id]/page.tsx
app/weekly/[weekId]/page.tsx
app/weekly/page.tsx
```

### layout.tsx
```
app/layout.tsx
```

### loading.tsx
*(none found)*

### error.tsx
*(none found)*

### not-found.tsx
*(none found)*

---

## DARK MODE REMNANTS MAP

| File | Dark Classes Found | Effort | Has Auth | Has LemonSqueezy URL |
|------|--------------------|--------|----------|----------------------|
| app/page.tsx | text-white, bg-black/70, border-white/15, bg-[#0d0d0f], border-[#3D3B36] (Alpha Vault + image label overlay) | LOW | no | yes (constants only) |
| app/admin/[id]/page.tsx | bg-black/40 (modal overlay only) | LOW | no | no |
| app/admin/login/page.tsx | bg-zinc-950, bg-zinc-900, border-zinc-800, border-zinc-700, bg-zinc-800, text-white | MEDIUM | no (API auth) | no |
| app/pricing/page.tsx | bg-[#030303], text-white, border-white/10, bg-[#0d0d0f], text-white/80, text-white/60, etc. | HIGH | no | yes |
| app/signup/page.tsx | bg-[#030303], bg-[#0d0d0f], border-white/10, text-white, bg-white/5, placeholder-white/30, etc. | HIGH | yes | no |
| app/weekly/page.tsx | bg-[#030303], text-white, border-white/10, bg-white/[0.02], etc. | HIGH | yes | no |
| app/weekly/[weekId]/page.tsx | bg-[#030303], text-white, border-white/10, text-white/60, text-white/70, etc. | HIGH | yes | no |
| app/weekly/[weekId]/[id]/page.tsx | text-white/60 (footer “Back to week” link) | LOW | yes | no |

**Not in table (no dark remnants or intentional only):**
- app/layout.tsx — no dark classes
- app/account/page.tsx — light (cream) only
- app/login/page.tsx — light; only `text-white` on primary green button (intentional)
- app/admin/page.tsx — light only

---

## LEMONSQUEEZY URLS FOUND (verbatim)

```
https://k-productscout26.lemonsqueezy.com/checkout/buy/141f6710-c704-4ab3-b7c7-f30b2c587587
https://k-productscout26.lemonsqueezy.com/checkout/buy/41bb4d4b-b9d6-4a60-8e19-19287c35516d
```

*(Both appear in app/page.tsx as constants and in app/pricing/page.tsx as href attributes.)*

---

## PRIORITY ORDER FOR CLEANUP

1. **app/pricing/page.tsx** — Full dark theme; user-facing pricing page. High impact, full rebuild to cream.
2. **app/signup/page.tsx** — Full dark; auth funnel. Must match login/account (already light).
3. **app/weekly/page.tsx** — Full dark; hub for paid content. Has Supabase + getAuthTier.
4. **app/weekly/[weekId]/page.tsx** — Full dark; product list. Has Supabase RLS.
5. **app/admin/login/page.tsx** — Zinc dark; internal. Medium effort (form + card).
6. **app/weekly/[weekId]/[id]/page.tsx** — One link (Back to week) uses text-white/60; rest already light. Low effort.
7. **app/page.tsx** — Optional: image label overlay (bg-black/70, text-white). Alpha Vault section is intentionally dark per design.
8. **app/admin/[id]/page.tsx** — Optional: modal overlay bg-black/40 only; rest light.

---

## FILES ALREADY CLEAN (light mode)

- app/layout.tsx
- app/account/page.tsx
- app/login/page.tsx
- app/admin/page.tsx

---

## TASK 3: Special Files Check

### app/pricing/page.tsx
- **First 30 lines:** Metadata, FeatureRow type, FEATURES array (Korean labels). Server component.
- **Theme:** Dark (bg-[#030303], text-white, bg-[#0d0d0f], border-white/10).
- **LemonSqueezy URLs:** Yes — Standard and Alpha checkout hrefs (see verbatim list above).
- **Auth:** No.

### app/success/page.tsx
- **Exists:** No.

### app/error.tsx
- **Exists:** No.

### app/not-found.tsx
- **Exists:** No.

### app/reset-password/page.tsx
- **Exists:** No.

### app/signup/page.tsx
- **First 30 lines:** Client component; createClient, GoogleSignInButton, handleSubmit with signUp. Success state: dark layout. Form state: email, password, error, loading.
- **Theme:** Dark (bg-[#030303], bg-[#0d0d0f], border-white/10, text-white).
- **LemonSqueezy:** No.
- **Auth:** Yes (Supabase signUp).

### app/weekly/page.tsx
- **First 30 lines:** Server component; createClient, getAuthTier, formatAvailableDate, isWeekAvailableForFree. Fetches weeks, isPaid from tier.
- **Theme:** Dark (bg-[#030303], text-white).
- **LemonSqueezy:** No.
- **Auth:** Yes (getAuthTier, Supabase).

### app/weekly/[weekId]/page.tsx
- **First 30 lines:** Server component; createClient, fetches week and products (scout_final_reports). Error state dark.
- **Theme:** Dark (bg-[#030303], text-white, border-white/10).
- **LemonSqueezy:** No.
- **Auth:** Yes (RLS / server).

### app/admin/login/page.tsx
- **First 30 lines:** Client component; useState password/error/loading; handleSubmit calls /api/admin/auth.
- **Theme:** Dark (bg-zinc-950, bg-zinc-900, border-zinc-800, text-white).
- **LemonSqueezy:** No.
- **Auth:** No (API password only).

---

## TASK 4: Component Dark Class Check

**Files under `components/` that still use dark-related classes:**

| Component | Dark Classes |
|-----------|---------------|
| components/layout/HeaderNavClient.tsx | text-white (on primary green button — intentional) |
| components/LogoutButton.tsx | text-white/60, hover:text-white (default when no className) |
| components/ui/Button.tsx | text-white (primary/danger buttons — intentional) |
| components/admin/GlobalPricesHelper.tsx | bg-zinc-800, border-zinc-700, text-white; bg-zinc-950, border-zinc-800 |
| components/admin/HazmatCheckboxes.tsx | border-zinc-600, bg-zinc-800 |
| components/admin/AiPageLinksHelper.tsx | bg-zinc-800, border-zinc-700, text-white |
| components/ContactCard.tsx | text-white, bg-zinc-700, text-zinc-300 |
| components/BrokerEmailDraft.tsx | text-white/40, text-white/60, border-white/10, bg-white/5, text-white/50, bg-black/30, text-white |
| components/HazmatBadges.tsx | text-white, bg-white/10, border-white/20, text-white/50 |
| components/CopyButton.tsx | text-white, border-white/20, bg-white/5, text-white/80 |
| components/ExpandableText.tsx | text-white/40, text-white/60 |
| components/GlobalPricingTable.tsx | text-white, border-white/10, bg-black/30, text-white/60, text-white/80, etc. |
| components/PriceComparisonBar.tsx | text-white/50, text-white |
| components/ViralHashtagPills.tsx | border-white/20, bg-white/5, text-white/80 |
| components/StatusBadge.tsx | bg-white/5, text-white/70, border-white/20 |
| components/DonutGauge.tsx | text-white, text-white/50 |
| components/LockedSection.tsx | text-white/40, text-white/90, text-white (indigo CTA) |
| components/Navigation.tsx | bg-[#030303]/70, border-white/10, text-white/70, text-white/60, text-white |

---

## 요약 (한국어)

- **라우트:** `page.tsx` 11개, `layout.tsx` 1개. `loading.tsx`, `error.tsx`, `not-found.tsx`, `success/page.tsx`, `reset-password/page.tsx` 는 없음.
- **다크 클래스 잔존:** `app/pricing`, `app/signup`, `app/weekly`, `app/weekly/[weekId]` 는 전체 다크(bg-[#030303], text-white 등). `app/admin/login` 은 zinc 다크. `app/page.tsx` 는 Alpha Vault와 이미지 라벨만 다크(의도적). `app/admin/[id]` 는 모달 오버레이만 `bg-black/40`. `app/weekly/[weekId]/[id]` 는 푸터 링크 한 곳만 `text-white/60`.
- **이미 라이트:** `app/layout`, `app/account`, `app/login`, `app/admin/page`.
- **LemonSqueezy:** 동일한 두 개 URL이 `app/page.tsx`(상수)와 `app/pricing/page.tsx`(href)에 있음. 수정 없이 보고만 함.
- **컴포넌트:** `components/admin`(GlobalPricesHelper, HazmatCheckboxes, AiPageLinksHelper), `Navigation`, `BrokerEmailDraft`, `GlobalPricingTable`, `LockedSection`, `DonutGauge`, `PriceComparisonBar`, `ViralHashtagPills`, `StatusBadge`, `ContactCard`, `CopyButton`, `ExpandableText`, `HazmatBadges` 등에서 다크/white 계열 클래스 사용. Primary 버튼용 `text-white`(HeaderNavClient, Button, Login)는 의도적.
- **정리 우선순위:** 1) pricing 2) signup 3) weekly 4) weekly/[weekId] 5) admin/login 6) weekly 상세 푸터 링크 7) page 이미지 오버레이(선택) 8) admin [id] 모달(선택).

*End of report. No files were modified.*
