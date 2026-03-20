# SupplierContact Component Documentation

**Source:** `components/report/SupplierContact.tsx`

---

## 1. Props and Types

| Prop      | Type                        |
|----------|-----------------------------|
| `report` | `ScoutFinalReportsRow`      |
| `tier`   | `"free" \| "standard" \| "alpha"` |
| `isTeaser` | `boolean`                 |

**Location:** Lines 9–17.

```ts
export function SupplierContact({
  report,
  tier,
  isTeaser,
}: {
  report: ScoutFinalReportsRow;
  tier: "free" | "standard" | "alpha";
  isTeaser: boolean;
}) {
```

---

## 2. ScoutFinalReportsRow Fields Used (with line numbers)

| Field                  | Line(s) | Usage |
|------------------------|--------|--------|
| `m_name`               | 20, 264, 268, 271 | Visibility check; displayed (EN + KR). |
| `corporate_scale`     | 21, 274–287 | Visibility; displayed (with scaleMap). |
| `contact_email`       | 22, 294–299 | Visibility; contact card label + mailto. |
| `contact_phone`       | 23, 300–305 | Visibility; contact card label + tel. |
| `m_homepage`          | 24, 306–311 | Visibility; "Website" card. |
| `naver_link`          | 25 | Visibility only (not displayed in contacts array). |
| `wholesale_link`      | 26, 312–317 | Visibility; "Wholesale Portal" card. |
| `sourcing_tip`        | 26 | Visibility only. |
| `verified_cost_usd`   | 30–37, 206, 221–222 | Cost display; "undisclosed" handling. |
| `verified_cost_note`   | 31–32 | Drives `isUndisclosed`. |
| `viral_video_url`     | 39, 119–128 | Viral asset card. |
| `video_url`           | 40, 129–139 | Video asset card. |
| `ai_detail_page_links`| 41 | Passed to `getAiDetailUrl` for AI landing card. |
| `marketing_assets_url`| 42, 152–161 | Brand Asset Kit card. |
| `ai_image_url`        | 43, 163–172 | AI Product Image card. |
| `global_prices`       | 47–56, 80–89, 100–116 | Parsed for region/listings; drives `globalProofTags`. |
| `moq`                 | 237–241 | "MOQ" value. |
| `lead_time`           | 244–249 | "Est. Production Lead Time" value. |
| `can_oem`             | 250–257 | "OEM / ODM" "Available" / "Not Available". |
| `verified_at`         | 212–220 | "Verified by KoreaScout on {date}". |
| `translated_name`     | 268 | First word uppercased for display. |
| `global_site_url`     | 318–323 | "Global Site" contact card. |
| `b2b_inquiry_url`     | 324–329 | "B2B Inquiry" contact card. |
| `sample_policy`       | 306, 311 | "Sample Policy" block. |
| `export_cert_note`    | 313, 318 | "Compliance Note" block. |

---

## 3. Conditional Renders (tier / canSeeAlpha / isTeaser)

**Derived:** `canSeeAlpha = tier === "alpha" || isTeaser` (line 18).

| Line(s)   | Exact condition | Behavior |
|-----------|------------------|----------|
| 28        | `!hasSupplierFields && !canSeeAlpha` | Component returns `null` (section not rendered). |
| 196       | `canSeeAlpha && (` | **True:** Entire "Launch & Execution Kit" content (heading, Financial Briefing, Supplier & Brand Intel, Creative Assets). **False:** Nothing rendered inside the section (no placeholder, no overlay). |
| 207–228   | `hasVerifiedPrice && !isUndisclosed` / else `verifiedCostUsd != null && verifiedCostUsd !== "" && isUndisclosed` / else | Cost: numeric + verified_at, or "Pricing verified and on file...", or "Not available". |
| 234       | `(report.moq?.trim() \|\| report.lead_time?.trim() \|\| report.can_oem != null)` | Renders MOQ / Lead Time / OEM block. |
| 236–241   | `report.moq?.trim()` | MOQ value. |
| 244–249   | `report.lead_time?.trim()` | Lead time value. |
| 250–257   | `report.can_oem != null` | OEM/ODM value. |
| 264       | `report.m_name?.trim()` | Supplier name + translated_name + corporate_scale block. |
| 274–287   | `report.corporate_scale?.trim()` | Scale label (SME/Enterprise/Startup/Mid-size or raw). |
| 293–348   | contacts from report fields | Contact cards (email, phone, website, wholesale, global_site, b2b_inquiry). |
| 306       | `(report.sample_policy?.trim() \|\| report.export_cert_note?.trim())` | Sample Policy + Compliance Note block. |
| 309–311   | `report.sample_policy?.trim()` | Sample policy text. |
| 314–318   | `report.export_cert_note?.trim()` | Export/cert note text. |
| 315–319   | `globalProofTags.length > 0` | "Global Market Proof" + GlobalProofAccordion. |
| 322       | `assetCards.length > 0` | "Creative Assets" grid. |

---

## 4. Data Values Displayed to User (line + field name)

| Line(s) | Field / Source | What user sees |
|---------|----------------|----------------|
| 197–199 | Static         | "Launch & Execution Kit", subtitle. |
| 202     | Static         | "Financial Briefing". |
| 204     | Static         | "Cost Per Unit". |
| 206–220 | `verified_cost_usd`, `verified_at` | Dollar value + "Verified by KoreaScout on {date}". |
| 221–223 | `verified_cost_note` (undisclosed) | "Pricing verified and on file. Contact the manufacturer...". |
| 226     | —              | "Not available". |
| 238     | Static         | "MOQ". |
| 240     | `moq`          | MOQ value. |
| 245     | Static         | "Est. Production Lead Time". |
| 248     | `lead_time`    | Lead time value. |
| 252     | Static         | "OEM / ODM". |
| 254–256 | `can_oem`      | "Available" or "Not Available". |
| 263     | Static         | "Supplier & Brand Intel". |
| 267–271 | `translated_name`, `m_name` | Brand name (EN first word + \| + m_name). |
| 276–287 | `corporate_scale` | Scale label (SME/Enterprise/Startup/Mid-size). |
| 298, 304, 310, 316, 322, 328 | contact.label / href | Contact cards (email, phone, Website, Wholesale Portal, Global Site, B2B Inquiry). |
| 310     | Static         | "Sample Policy". |
| 311     | `sample_policy`| Sample policy text. |
| 316     | Static         | "Compliance Note". |
| 318     | `export_cert_note` | Compliance note text. |
| 319     | Static         | "Global Market Proof". |
| 320     | —              | GlobalProofAccordion (tags from global_prices). |
| 324     | Static         | "Creative Assets". |
| 327–358 | assetCards     | Card title, description, CTA (from viral_video_url, video_url, ai_detail_page_links, marketing_assets_url, ai_image_url). |

**GlobalProofAccordion (same file):** Displays `tag.region`, `tag.fullName`, `tag.platform`, listings (platform, price_usd, url, sold_out) — all derived from `report.global_prices`.

---

## 5. Blur / Lock Behavior

- **No blur, no overlay, no lock icon** in this component.
- When `!canSeeAlpha`, the section wrapper is still rendered (if `hasSupplierFields || canSeeAlpha`), but the **only** content inside is the `canSeeAlpha && (...)` block. So when tier is free/standard and not teaser, the section either:
  - **Does not render at all** (return `null` when `!hasSupplierFields && !canSeeAlpha`), or
  - **Renders an empty section** (section with border/padding but no inner content when `hasSupplierFields` but `!canSeeAlpha` — in that case the outer condition is hasSupplierFields \|\| canSeeAlpha, so if canSeeAlpha is false and hasSupplierFields is true, we still render the section and then canSeeAlpha is false so the fragment is not rendered; result is empty section).
- No placeholder divs or "locked" copy; content is simply omitted for non-Alpha.
