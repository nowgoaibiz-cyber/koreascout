# Phase 7B Hit List — Overnight Audit Report
Generated: 2025-03-02

## SUMMARY
- **Total components with dark remnants:** 18 (including admin and layout)
- **Total typography violations found:** 22+ (banned font sizes, missing font-mono on numeric data in dark-theme components, section label tracking, gray/slate usage)
- **Quick wins identified:** 12
- **Estimated total fix time:** 4–6 hours

---

## SECTION A: Dark Mode Hit List

Sorted by priority: HIGH effort first, then user-visible vs internal.  
Legend: 🔴 USER-FACING | 🟡 SEMI-VISIBLE | 🟢 INTERNAL

| Component | File path | Dark classes found (exact) | Affects which page/section | Fix effort | Priority |
|-----------|-----------|---------------------------|---------------------------|------------|----------|
| Navigation | components/Navigation.tsx | `bg-[#030303]/70`, `border-white/10`, `text-white/70`, `text-white/60`, `bg-indigo-500 text-white` | Comment references "Section 8 dark footer" — component not imported in weekly page; used elsewhere if at all | MED | 🟡 |
| GlobalPricingTable | components/GlobalPricingTable.tsx | `border border-white/10`, `bg-[var(--bg-card)]`, `text-white`, `text-white/80`, `text-white/60`, `bg-black/30`, `bg-white/[0.03]`, `text-white/30`, `text-white/70`, `text-white/40`, `blur-sm text-gray-500` | Not currently imported in app (orphan); doc says Section 5 | MED | 🟡 |
| LockedSection | components/LockedSection.tsx | `border border-white/10`, `bg-[var(--bg-card)]`, `from-white/[0.03]`, `text-white/40`, `text-white/90`, `bg-indigo-500 ... text-white` | Product detail (weekly/[weekId]/[id]) — locked CTAs for Standard/Alpha | MED | 🔴 |
| DonutGauge | components/DonutGauge.tsx | `stroke="rgba(255,255,255,0.1)"`, `text-white`, `text-white/50` | Section 2, Section 4 (product detail) | LOW | 🔴 |
| PriceComparisonBar | components/PriceComparisonBar.tsx | `border border-white/10`, `bg-white/[0.02]`, `text-[11px] ... text-white/50`, `text-white` | Section 3 Market Intelligence (product detail) | LOW | 🔴 |
| ViralHashtagPills | components/ViralHashtagPills.tsx | `border-white/20`, `bg-white/5`, `text-white/80`, `hover:border-white/40`, `hover:bg-white/10`, `hover:text-white` | Section 3 (product detail) | LOW | 🔴 |
| StatusBadge | components/StatusBadge.tsx | `bg-white/5`, `text-white/70`, `border-white/20`, `bg-white/10`, `text-white/60` | Section 2, Section 4 (product detail) | LOW | 🔴 |
| ContactCard | components/ContactCard.tsx | `bg-white/5`, `border-white/10`, `text-zinc-300`, `bg-zinc-700`, `text-zinc-300`, `text-white` | Section 6 Launch Kit (product detail) | MED | 🔴 |
| BrokerEmailDraft | components/BrokerEmailDraft.tsx | `text-[11px] text-white/40`, `text-white/60`, `bg-white/5`, `border-white/10`, `text-white`, `placeholder:text-white/30`, `bg-black/30`, `text-white/50`, `bg-white/[0.03]` | Section 5 (product detail, Alpha) | MED | 🔴 |
| CopyButton | components/CopyButton.tsx | `border-white/20`, `bg-white/5`, `text-white/80`, `hover:bg-white/10`, `text-[10px] text-emerald-400` | Section 5 HS Code (product detail) | LOW | 🔴 |
| ExpandableText | components/ExpandableText.tsx | `text-white/40`, `text-white/60` | Section 5 Product Specs (product detail) | LOW | 🔴 |
| HazmatBadges | components/HazmatBadges.tsx | `trueClass`/`falseClass`: `text-white`, `bg-white/10`, `border-white/20`, `text-white/50`, `bg-gray-500/80`, `border-gray-400/80` | Section 5 Hazmat (product detail) | MED | 🔴 |
| GlobalPricesHelper | components/admin/GlobalPricesHelper.tsx | `bg-zinc-800`, `border-zinc-700`, `text-white`, `text-zinc-400`, `text-[10px] text-zinc-600`, `bg-zinc-950`, `text-zinc-500`, `border-zinc-800`, `text-[10px] text-zinc-600` | Admin [id] — global prices helper | HIGH | 🟢 |
| HazmatCheckboxes | components/admin/HazmatCheckboxes.tsx | `text-zinc-300`, `border-zinc-600`, `bg-zinc-800` | Admin [id] — hazmat checkboxes | MED | 🟢 |
| AiPageLinksHelper | components/admin/AiPageLinksHelper.tsx | `bg-zinc-800`, `border-zinc-700`, `text-white`, `text-zinc-500`, `text-zinc-600` | Admin [id] — AI page links | MED | 🟢 |
| HeaderNavClient | components/layout/HeaderNavClient.tsx | `bg-[#16A34A] text-white` (intentional primary button) | All pages with header | — | Intentional |
| Button (ui) | components/ui/Button.tsx | `text-white` on primary/danger (intentional) | Global | — | Intentional |
| LogoutButton | components/LogoutButton.tsx | `text-white/60 hover:text-white` | Account, header | LOW | 🟡 |

**Note:** `app/page.tsx` uses intentional dark section "Alpha Vault" (`bg-[#1A1916]`, `bg-[#0d0d0f]`, `text-white`, `text-[#9E9C98]`) and footer `bg-[#1A1916]` — these are design-approved dark sections, not remnants. Image overlay `bg-black/70 ... text-white` on labels is intentional. Primary CTAs `bg-[#16A34A] text-white` are correct per Design System.

---

## SECTION B: Typography Hit List

### BANNED font sizes (Design System: minimum text-xs / 12px)

| File | Line(s) | Exact class/code | Rule violated | Should be |
|------|---------|------------------|--------------|-----------|
| components/admin/GlobalPricesHelper.tsx | 113, 122, 125 | `text-[10px]` | Minimum 12px | `text-xs` |
| components/BrokerEmailDraft.tsx | 127 | `text-[11px] text-white/40` | Minimum 12px | `text-xs text-white/40` (or ink-tertiary when light) |
| components/CopyButton.tsx | 46 | `text-[10px] text-emerald-400` | Minimum 12px | `text-xs text-emerald-400` |
| components/PriceComparisonBar.tsx | 18, 27 | `text-[11px] uppercase tracking-wider text-white/50` | Minimum 12px | `text-xs uppercase tracking-wider ...` |

### Section labels: missing or wrong tracking (Design System: `text-xs font-semibold tracking-widest uppercase`)

- **app/weekly/[weekId]/[id]/page.tsx:** Many section labels use `tracking-wider` instead of `tracking-widest`. Design System v2 specifies section labels as `text-xs font-semibold tracking-widest uppercase`. Lines 572, 578, 589 use `uppercase text-[#6B6860] font-semibold` without `tracking-widest` (others use `tracking-wider`). Line 1308 uses `tracking-widest` correctly; 1448, 1492 use `tracking-widest`. Inconsistency: some use `tracking-wider`, some `tracking-widest`.
- **components/GlobalPricingTable.tsx:** Table headers use `tracking-wider` (lines 91–94); Design System prefers section labels `tracking-widest`. Change to `tracking-widest` for consistency.
- **components/PriceComparisonBar.tsx:** Labels "KR Price" / "US Price" use `tracking-wider`; can align to `tracking-widest` when fixing font size.

### Numeric/price/score data — font-mono usage

- **app/weekly/[weekId]/[id]/page.tsx:** Prices, scores, HS code, weights correctly use `font-mono` (lines 244, 248, 255, 309, 478, 499, 511, 517, 547, 665, 684, 700, 950, 1002, 1011, 1020, 1305). No violation.
- **components/DonutGauge.tsx:** Center number uses `font-[family-name:var(--font-syne)]` and `text-white` (line 63). Design System: numbers/scores → `font-mono`. Should be: `font-mono text-2xl font-bold tabular-nums` with color per context (e.g. `text-ink-900` on light background). Current use is on dark gauge (white text) — if migrating to light theme, use `font-mono` + ink/accent.
- **components/PriceComparisonBar.tsx:** KR/US prices use `text-lg font-semibold text-white tabular-nums` (lines 19, 28) — no `font-mono`. Rule: numbers/prices → `font-mono`. Should add `font-mono`.
- **components/GlobalPricingTable.tsx:** Price cells show `row.price_original` without `font-mono` (line 109); Design System: price data → `font-mono`. Add `font-mono` to price cell.

### Inconsistent text color (gray/slate vs Design System)

- **components/GoogleSignInButton.tsx** (line 52): `text-gray-800`, `hover:bg-gray-100` — BANNED (`gray-*`). Use `text-ink-900` (or `text-[#1A1916]`) and `hover:bg-cream-200` (or `hover:bg-[#F2F1EE]`).
- **components/GlobalPricingTable.tsx** (line 128): `text-gray-500` — BANNED. Use `text-ink-300` or `text-[#9E9C98]`.
- **components/HazmatBadges.tsx** (lines 41–44): `bg-gray-500/80 border-gray-400/80` in Powder badge — BANNED. Use stone or custom token (e.g. `bg-ink-500`/border equivalent or neutral from theme).

### Per-file violation summary

#### app/page.tsx
- No banned font sizes; section labels use `tracking-widest` / `uppercase` appropriately.
- Intentional dark sections and primary button `text-white` — no change.

#### app/pricing/page.tsx
- Line 76: `text-xs uppercase tracking-wider` — could standardize to `tracking-widest` for section label.
- No banned sizes; no numeric data without font-mono in inspected areas.

#### app/weekly/[weekId]/[id]/page.tsx
- Section labels: mix of `tracking-wider` and `tracking-widest`; standardize to `text-xs font-semibold tracking-widest uppercase` for all section labels.
- Prices/scores/HS/weights: already use `font-mono`. No violation.

#### components/DonutGauge.tsx
- Line 63: Score number uses `font-[family-name:var(--font-syne)]` instead of `font-mono`. Rule: numbers/scores → `font-mono`. Should be: `font-mono text-2xl font-bold tabular-nums` + appropriate color.
- Line 66: `text-xs text-white/50` — when moving to light theme, use `text-xs text-ink-300` (or equivalent).

#### components/GlobalPricingTable.tsx
- Line 78: Heading `text-white` — theme-dependent.
- Lines 91–94: Table headers `text-white/60`; add `tracking-widest` for section/label consistency.
- Line 109: Price cell — add `font-mono` for price.
- Line 128: `text-gray-500` → use Design System token (e.g. `text-ink-300`).
- Line 87: `bg-black/30` — dark remnant.

#### components/BrokerEmailDraft.tsx
- Line 127: `text-[11px]` → `text-xs`.
- Lines 135, 141, 144: Dark text/placeholder — migrate to ink/cream when moving off dark theme.

#### components/LockedSection.tsx
- Lines 41, 43, 51: `text-white/40`, `text-white/90` — dark remnant; CTA button `text-white` on indigo is intentional for button.

#### components/ContactCard.tsx
- Lines 13, 80: `bg-white/5`, `border-white/10`, `text-zinc-300`.
- Line 84: `text-white` (name).
- Line 90: `bg-zinc-700 text-zinc-300` — dark + zinc; replace with cream/ink when light.

#### components/HazmatBadges.tsx
- Lines 41–44: `gray-*` in Powder badge; `bg-white/10`, `text-white/50` etc. — dark theme. Use Design System tokens and no gray.

#### components/CopyButton.tsx
- Line 42: Dark pill `border-white/20 bg-white/5 text-white/80`.
- Line 46: `text-[10px]` → `text-xs`.

#### components/ExpandableText.tsx
- Lines 18, 22: `text-white/40`, `text-white/60` — dark remnant.

#### components/ViralHashtagPills.tsx
- Line 38: Dark pill styles — align to cream/ink when moving to light.

#### components/PriceComparisonBar.tsx
- Lines 18, 27: `text-[11px]` → `text-xs`; add `font-mono` to price lines (19, 28).
- Lines 15, 18–19, 27–28: Dark borders/text — migrate with theme.

#### components/StatusBadge.tsx
- Lines 15, 22, 23: Fallback/unknown state uses `bg-white/5 text-white/70 border-white/20` — dark; migrate to cream/ink variants.

#### components/layout/ClientLeftNav.tsx
- No typography violations; uses `text-[#...]` and `text-xs text-[#9E9C98]` correctly.

#### components/layout/Header.tsx
- No violations; uses `text-[#1A1916]`, `text-xs text-[#9E9C98]`.

---

## SECTION C: Component Usage Map

| Component | Used in | User-visible | Dark remnants | Typo violations |
|-----------|---------|--------------|---------------|-----------------|
| DonutGauge | weekly/[weekId]/[id] Section 2, Section 4 | yes | yes | yes (font-syne → font-mono for number) |
| GlobalPricingTable | Not imported in app (orphan) | no | yes | yes (gray-500, missing font-mono on price, tracking-widest) |
| BrokerEmailDraft | weekly/[weekId]/[id] Section 5 (Alpha) | yes | yes | yes (text-[11px]) |
| LockedSection | weekly/[weekId]/[id] (multiple locked CTAs) | yes | yes | no |
| ContactCard | weekly/[weekId]/[id] Section 6 (ContactPill from same file) | yes | yes | no |
| HazmatBadges | weekly/[weekId]/[id] Section 5 | yes | yes | yes (gray-* in Powder) |
| CopyButton | weekly/[weekId]/[id] Section 5 HS Code | yes | yes | yes (text-[10px]) |
| ExpandableText | weekly/[weekId]/[id] Section 5 Specs | yes | yes | no |
| ViralHashtagPills | weekly/[weekId]/[id] Section 3 | yes | yes | no |
| PriceComparisonBar | weekly/[weekId]/[id] Section 3 | yes | yes | yes (text-[11px], no font-mono on prices) |
| StatusBadge | weekly/[weekId]/[id] Section 2, 4 | yes | yes | no |
| ClientLeftNav | weekly/[weekId]/[id] | yes | no | no |
| Header | app/layout.tsx | yes | no | no |
| HeaderNavClient | layout/Header.tsx | yes | no (text-white on button intentional) | no |
| LogoutButton | account, HeaderNavClient | yes | yes (text-white/60) | no |
| GoogleSignInButton | login, signup | yes | no dark; gray-* only | yes (gray-800, gray-100) |
| Navigation | Not imported in weekly page (comment "Section 8" is inline section, not this component) | unclear | yes | no |
| ScrollToIdButton | weekly/[weekId]/[id] | yes | — | — |
| Badge, Button, KeywordPill | weekly/[weekId]/[id], various | yes | — | — |
| GlobalPricesHelper | admin/[id] | no (admin) | yes | yes (text-[10px]) |
| HazmatCheckboxes | admin/[id] | no (admin) | yes | no |
| AiPageLinksHelper | admin/[id] | no (admin) | yes | no |

---

## SECTION D: Quick Wins (Do These First Tomorrow)

Single-class or single-line changes, high impact:

1. **BrokerEmailDraft.tsx L127:** `text-[11px]` → `text-xs`.
2. **CopyButton.tsx L46:** `text-[10px]` → `text-xs`.
3. **PriceComparisonBar.tsx L18, L27:** `text-[11px]` → `text-xs`.
4. **PriceComparisonBar.tsx L19, L28:** Add `font-mono` to price lines (e.g. `text-lg font-mono font-semibold text-white tabular-nums`).
5. **DonutGauge.tsx L63:** Replace `font-[family-name:var(--font-syne)]` with `font-mono` for the score number (keep size/weight).
6. **GlobalPricingTable.tsx L128:** `text-gray-500` → `text-ink-300` or `text-[#9E9C98]`.
7. **GoogleSignInButton.tsx L52:** `text-gray-800` → `text-[#1A1916]` or `text-ink-900`; `hover:bg-gray-100` → `hover:bg-[#F2F1EE]`.
8. **GlobalPricingTable.tsx** price cell (L109): Add `font-mono` to the element displaying `row.price_original`.
9. **admin/GlobalPricesHelper.tsx L113, L122, L125:** All `text-[10px]` → `text-xs` (3 occurrences).
10. **HazmatBadges.tsx** Powder badge: Replace `bg-gray-500/80 border-gray-400/80` with theme token (e.g. neutral/stone or `bg-ink-500/80 border-ink-400/80` or equivalent from globals.css).
11. **GlobalPricingTable.tsx** table headers L91–94: Add `tracking-widest` (replace `tracking-wider`) for section-label consistency.
12. **app/pricing/page.tsx L76:** Optional: `tracking-wider` → `tracking-widest` for section label.

---

## SECTION E: Recommended Execution Order for Tomorrow

**Phase 7B-1 — Quick wins (no theme switch)**  
- Apply all Section D quick wins: banned font sizes → `text-xs`, add `font-mono` where required, remove `gray-*`/`slate-*`, fix tracking on labels.  
- No dark→light migration yet; keeps risk low and delivers Design System typography compliance.

**Phase 7B-2 — User-facing dark components (product detail)**  
- Migrate DonutGauge, PriceComparisonBar, ViralHashtagPills, StatusBadge, CopyButton, ExpandableText, LockedSection, ContactCard, BrokerEmailDraft, HazmatBadges from white/zinc/black to cream/ink tokens so product detail page is fully on Design System base.  
- Then adjust product detail page wrapper/section backgrounds if they still assume dark (e.g. Section 8 footer is intentionally dark in page; leave or document).

**Phase 7B-3 — Admin and orphan components**  
- Migrate admin components (GlobalPricesHelper, HazmatCheckboxes, AiPageLinksHelper) from zinc/dark to cream/ink.  
- Decide: use GlobalPricingTable somewhere (and migrate it) or remove; if keeping, migrate its dark classes in same pass.

**Phase 7B-4 — Navigation and edge cases**  
- If Navigation is used anywhere, migrate its dark nav bar to Header-style (or document as intentional dark).  
- LogoutButton, any remaining white/zinc in layout: align to Design System tokens.

---

## 한국어 요약 (Korean Summary)

- **다크 모드 잔재:** `components/` 내 18개 컴포넌트에서 `bg-zinc`, `bg-black`, `text-white`, `border-white/10`, `text-zinc` 등 다크용 클래스 사용. 제품 상세(weekly), 락된 섹션, 게이지/가격/배지/연락처/이메일 초안 등 사용자 노출 구간과 admin 헬퍼에 분포.
- **타이포 위반:** `text-[10px]`, `text-[11px]` 사용처 5곳(GlobalPricesHelper 3곳, BrokerEmailDraft, CopyButton, PriceComparisonBar 2곳) → 전부 `text-xs`(12px)로 교체 필요. 숫자/가격은 `font-mono` 원칙에 맞게 DonutGauge 점수, PriceComparisonBar 가격, GlobalPricingTable 가격 셀에 `font-mono` 적용. 섹션 라벨은 `tracking-widest`로 통일 권장. `gray-*`/`slate-*` 금지에 따라 GoogleSignInButton, GlobalPricingTable, HazmatBadges의 gray 사용을 디자인 시스템 토큰(ink/cream)으로 교체.
- **퀵 윈:** 12개 항목(폰트 크기 1:1 교체, font-mono 추가, gray 제거, tracking 조정)을 먼저 처리하면 5분 미만 단위로 적용 가능하며 시각적/일관성 효과 큼.
- **실행 순서:** 7B-1 퀵 윈(타이포/색상 규칙만) → 7B-2 제품 상세용 다크 컴포넌트 크림/잉크 전환 → 7B-3 Admin 및 미사용(GlobalPricingTable) 처리 → 7B-4 Navigation 등 나머지.  
- **코드 변경 없음:** 본 오버나이트 감사는 읽기 전용으로 수행되었으며, 단일 산출물은 `_docs/05_PHASE7B_HIT_LIST.md` 입니다.
