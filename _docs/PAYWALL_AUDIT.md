# Paywall Audit — Master Document

Based on audit of: `MarketIntelligence.tsx`, `SourcingIntel.tsx`, `SupplierContact.tsx`, `GroupBBrokerSection.tsx`.

---

## 1. Tier Access Matrix

Table: every data field used in these four components → which tier can see it (free / standard / alpha).  
*Teaser is treated as Alpha for visibility in the current code.*

| Field | Free | Standard | Alpha | Component(s) |
|-------|------|----------|-------|--------------|
| `estimated_cost_usd` | ✓ | ✓ | ✓ | MarketIntelligence |
| `profit_multiplier` | ✓ | ✓ | ✓ | MarketIntelligence |
| `global_prices` | ✓ | ✓ | ✓ | MarketIntelligence, SupplierContact |
| `global_price` | ✓ | ✓ | ✓ | MarketIntelligence |
| `best_platform` | ✓ | ✓ | ✓ | MarketIntelligence |
| `search_volume` | ✓ | ✓ | ✓ | MarketIntelligence |
| `mom_growth` | ✓ | ✓ | ✓ | MarketIntelligence |
| `wow_rate` | ✓ | ✓ | ✓ | MarketIntelligence |
| `top_selling_point` | ✓ | ✓ | ✓ | MarketIntelligence |
| `common_pain_point` | ✓ | ✓ | ✓ | MarketIntelligence |
| `export_status` | — | — | ✓ | SourcingIntel |
| `status_reason` | — | — | ✓ | SourcingIntel |
| `actual_weight_g` | — | — | ✓ | SourcingIntel |
| `volumetric_weight_g` | — | — | ✓ | SourcingIntel |
| `billable_weight_g` | — | — | ✓ | SourcingIntel |
| `dimensions_cm` | — | — | ✓ | SourcingIntel |
| `shipping_tier` | — | — | ✓ | SourcingIntel |
| `required_certificates` | — | — | ✓ | SourcingIntel |
| `shipping_notes` | — | — | ✓ | SourcingIntel |
| `hazmat_status` | — | — | ✓ | SourcingIntel |
| `key_risk_ingredient` | — | — | ✓ | SourcingIntel |
| `composition_info` | — | — | ✓ | SourcingIntel |
| `spec_summary` | — | — | ✓ | SourcingIntel |
| `hazmat_summary` | — | — | ✓ | SourcingIntel |
| `sourcing_tip` (steps 4–5 / logistics) | — | — | ✓ | SourcingIntel |
| `hs_code` | — | — | ✓ | GroupBBrokerSection |
| `hs_description` | — | — | ✓ | GroupBBrokerSection |
| `verified_cost_usd` | — | — | ✓ | SupplierContact |
| `verified_cost_note` | — | — | ✓ | SupplierContact |
| `verified_at` | — | — | ✓ | SupplierContact |
| `moq` | — | — | ✓ | SupplierContact |
| `lead_time` | — | — | ✓ | SupplierContact |
| `can_oem` | — | — | ✓ | SupplierContact |
| `m_name` | — | — | ✓ | SupplierContact |
| `translated_name` | — | — | ✓ | SupplierContact |
| `corporate_scale` | — | — | ✓ | SupplierContact |
| `contact_email` | — | — | ✓ | SupplierContact |
| `contact_phone` | — | — | ✓ | SupplierContact |
| `m_homepage` | — | — | ✓ | SupplierContact |
| `wholesale_link` | — | — | ✓ | SupplierContact |
| `global_site_url` | — | — | ✓ | SupplierContact |
| `b2b_inquiry_url` | — | — | ✓ | SupplierContact |
| `sample_policy` | — | — | ✓ | SupplierContact |
| `export_cert_note` | — | — | ✓ | SupplierContact |
| `viral_video_url` | — | — | ✓ | SupplierContact |
| `video_url` | — | — | ✓ | SupplierContact |
| `ai_detail_page_links` | — | — | ✓ | SupplierContact |
| `marketing_assets_url` | — | — | ✓ | SupplierContact |
| `ai_image_url` | — | — | ✓ | SupplierContact |

---

## 2. Fields to NULL by Tier

Server (or API) should send masked report so that fields the tier cannot see are `null`. Below lists which `ScoutFinalReportsRow` fields must be sent as `null` per tier.

### Free user: fields that must be null

- `export_status`
- `status_reason`
- `actual_weight_g`
- `volumetric_weight_g`
- `billable_weight_g`
- `dimensions_cm`
- `shipping_tier`
- `required_certificates`
- `shipping_notes`
- `hazmat_status`
- `key_risk_ingredient`
- `composition_info`
- `spec_summary`
- `hazmat_summary`
- `hs_code`
- `hs_description`
- `verified_cost_usd`
- `verified_cost_note`
- `verified_at`
- `moq`
- `lead_time`
- `can_oem`
- `m_name`
- `corporate_scale`
- `contact_email`
- `contact_phone`
- `m_homepage`
- `naver_link`
- `wholesale_link`
- `global_site_url`
- `b2b_inquiry_url`
- `sample_policy`
- `export_cert_note`
- `viral_video_url`
- `video_url`
- `ai_detail_page_links`
- `marketing_assets_url`
- `ai_image_url`

*Optional:* For free, `sourcing_tip` can be null (or truncated) so that steps 4–5 (Compliance & Logistics Strategy) have no content. If steps 1–3 are shown to free elsewhere, only the part used for steps 4–5 needs to be masked or nulled.

### Standard user: fields that must be null

Same list as **Free user** above. (In the four audited components there is no separate “standard” visibility; standard and free behave the same. If product later grants standard more access, this list can be reduced for standard.)

### Alpha user: fields that must be null

None. All fields may be populated.

---

## 3. Components That Need Blur Placeholder

For each component, which JSX blocks need blur treatment: line numbers, field/section, current behavior, required change.

### MarketIntelligence

| Line(s) | Field / block | Current behavior | Required change |
|---------|----------------|------------------|------------------|
| 195–256 | Profit block (Est. Wholesale, Global Valuation, CTA) | All tiers see numbers; only “View Verified Supplier Cost” is a disabled button for non-Alpha. | Optional: wrap profit block (or just Est. Wholesale + Global Valuation values) in a blur placeholder for free/standard so numbers are not visible. No change required for the existing CTA lock. |

### SourcingIntel

| Line(s) | Field / block | Current behavior | Required change |
|---------|----------------|------------------|------------------|
| 55–79 | Export Readiness | `!canSeeAlpha`: single gray block `h-20 w-full rounded-xl bg-[#F2F1EE]`. | Replace with blur placeholder (frosted glass + lock icon). |
| 88–201 | Logistics Dashboard | `!canSeeAlpha`: three gray blocks `h-16`, `h-24`, `h-20` with `bg-[#F2F1EE]`. | Replace with one (or multiple) blur placeholder(s) matching design spec. |
| 214–248 | Compliance & Logistics Strategy | `!canSeeAlpha`: two gray blocks `h-24`, `h-16` with `bg-[#F2F1EE]`. | Replace with blur placeholder. |
| 255–264 | Section overlay | `!canSeeAlpha`: gradient overlay + Lock icon + “Go Alpha” CTA. | Keep overlay; optionally restyle to match blur placeholder design (e.g. frosted glass, lock, no black boxes). |

### SupplierContact

| Line(s) | Field / block | Current behavior | Required change |
|---------|----------------|------------------|------------------|
| 196–351 | Entire “Launch & Execution Kit” content | `!canSeeAlpha`: no content (section empty or not rendered). No placeholder. | When `!canSeeAlpha` but section is rendered, show a single blur placeholder (frosted glass + lock) for the whole section so layout is reserved and paywall is clear. |

### GroupBBrokerSection

| Line(s) | Field / block | Current behavior | Required change |
|---------|----------------|------------------|------------------|
| 42–99 vs 100–104 | HS Code + Broker Email Draft | `!canSeeAlpha`: two gray boxes `h-24 rounded-xl bg-[#F2F1EE]`. | Replace with blur placeholder (frosted glass + lock icon), no solid gray boxes. |

---

## 4. Server Masking Function Spec

Exact TypeScript contract and which fields to set to `null` per tier.

```ts
function maskReportByTier(
  report: ScoutFinalReportsRow,
  tier: "free" | "standard" | "alpha"
): ScoutFinalReportsRow {
  if (tier === "alpha") return report;

  const masked = { ...report };

  // Free and Standard: same masking (adjust if product grants standard more access)
  const nullForFreeAndStandard = [
    "export_status",
    "status_reason",
    "actual_weight_g",
    "volumetric_weight_g",
    "billable_weight_g",
    "dimensions_cm",
    "shipping_tier",
    "required_certificates",
    "shipping_notes",
    "hazmat_status",
    "key_risk_ingredient",
    "composition_info",
    "spec_summary",
    "hazmat_summary",
    "hs_code",
    "hs_description",
    "verified_cost_usd",
    "verified_cost_note",
    "verified_at",
    "moq",
    "lead_time",
    "can_oem",
    "m_name",
    "corporate_scale",
    "contact_email",
    "contact_phone",
    "m_homepage",
    "naver_link",
    "wholesale_link",
    "global_site_url",
    "b2b_inquiry_url",
    "sample_policy",
    "export_cert_note",
    "viral_video_url",
    "video_url",
    "ai_detail_page_links",
    "marketing_assets_url",
    "ai_image_url",
  ] as const;

  for (const key of nullForFreeAndStandard) {
    if (key in masked) (masked as Record<string, unknown>)[key] = null;
  }

  return masked;
}
```

- **Alpha:** return `report` unchanged; no fields set to null.
- **Free / Standard:** every field in `nullForFreeAndStandard` is set to `null` on the returned object. All other fields (e.g. `global_prices`, `profit_multiplier`, `search_volume`, etc.) remain as in `report`.

---

## 5. Blur Placeholder Design Spec

Reusable “paywall” placeholder to replace gray boxes and align overlay with KoreaScout design.

### Visual

- **Effect:** Frosted glass — use `backdrop-blur-sm` (or `backdrop-blur-md` if desired). Semi-transparent background so underlying layout is hinted but content is unreadable.
- **No black boxes:** Do not use solid black or heavy masks; avoid “██████” style blocks.
- **Colors:** Match KoreaScout design system:
  - Dark: `#0A0908`
  - Light background: `#F8F7F4` (and existing neutrals e.g. `#E8E6E1`, `#9E9C98`, `#6B6860`, `#1A1916` as in the app).
- **Border/radius:** Use existing section styling (e.g. `rounded-2xl`, `border border-[#E8E6E1]`) so the placeholder fits current cards/sections.

### Icon

- **Lock:** Use `Lock` from `lucide-react` (same as SourcingIntel overlay). Size and color to match secondary text (e.g. `text-[#9E9C98]` or `text-[#6B6860]`).

### Content

- Optional short line of copy, e.g. “Unlock with Alpha” or “Go Alpha to view”, in small type (`text-[10px]` / `text-xs`) in the same gray palette.
- Optional CTA button linking to `/pricing` (e.g. “Go Alpha” or “Upgrade”) using existing `Button` and KoreaScout green (`#16A34A`) for primary actions.

### Usage

- **SourcingIntel:** Replace each `bg-[#F2F1EE]` placeholder div with this blur placeholder; optionally restyle the full-section overlay to use the same frosted + lock treatment.
- **SupplierContact:** When section is rendered but `!canSeeAlpha`, render one blur placeholder for the whole “Launch & Execution Kit” area.
- **GroupBBrokerSection:** Replace the two `h-24 rounded-xl bg-[#F2F1EE]` divs with one (or two) blur placeholder(s) with frosted glass + lock, no solid gray boxes.

### Example structure (conceptual)

- Wrapper: `relative overflow-hidden rounded-2xl border border-[#E8E6E1]` with min-height as needed.
- Back layer: same background as section (e.g. `bg-[#F8F7F4]`) so layout is preserved.
- Blur layer: `absolute inset-0 backdrop-blur-sm bg-white/60` (or similar) so content underneath is blurred.
- Foreground: flex column, center, with `<Lock className="w-5 h-5 text-[#9E9C98]" />` and optional text + CTA.

This keeps the design consistent with KoreaScout (#0A0908, #F8F7F4, existing borders and typography) and avoids black boxes while making locked content clearly paywalled.
