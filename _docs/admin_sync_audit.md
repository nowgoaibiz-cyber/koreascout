# Admin Sync Audit Report

**Purpose:** Exhaustive comparison of Product Detail Page (PDP) vs Admin edit page to identify every field gap, ordering mismatch, and missing input so Admin can be fully synchronized to match PDP.

**Scope:** Read-only audit. No file modifications except this report.

**Sources:**
- PDP: `app/weekly/[weekId]/[id]/page.tsx`, `components/ProductIdentity.tsx`, `components/report/TrendSignalDashboard.tsx`, `components/report/MarketIntelligence.tsx`, `components/report/SocialProofTrendIntelligence.tsx`, `components/report/SourcingIntel.tsx`, `components/report/SupplierContact.tsx`, `components/GroupBBrokerSection.tsx`
- Admin: `app/admin/[id]/page.tsx` (edit form), `app/admin/page.tsx` (list)
- DB types: `types/database.ts` (ScoutFinalReportsRow)

---

## 1. PDP Field Map (Section by Section, top to bottom)

PDP section order on the page (from `app/weekly/[weekId]/[id]/page.tsx`):

1. **Section 1 — Product Identity** (`ProductIdentity.tsx`)
   - [image_url, product_name, translated_name, category, export_status, kr_price, estimated_cost_usd, go_verdict, composite_score, viability_reason]

2. **Section 2 — Trend Signal Dashboard** (`TrendSignalDashboard.tsx`)
   - [market_viability, competition_level, gap_status, platform_scores, growth_signal, growth_evidence, new_content_volume]
   - (platform_scores parsed for: tiktok, instagram, youtube, reddit score/sentiment)

3. **Section 3 — Market Intelligence** (`MarketIntelligence.tsx`)
   - [estimated_cost_usd, profit_multiplier, global_prices, global_price (fallback), best_platform, search_volume, mom_growth, wow_rate, top_selling_point, common_pain_point]
   - (ListingsBlock uses row/listings from parseGlobalPricesForGrid: price_usd, official_url, official_price_usd, platform, review_data, seller_type)

4. **Section 4 — Social Proof & Trend Intelligence** (`SocialProofTrendIntelligence.tsx`)
   - [buzz_summary, kr_local_score, global_trend_score, kr_evidence, kr_source_used, global_evidence, gap_index, gap_status, trend_entry_strategy, opportunity_reasoning, rising_keywords, seo_keywords, viral_hashtags, sourcing_tip (parsed as steps 1–3)]

5. **Section 5 — Export & Logistics Intel** (`SourcingIntel.tsx` + `GroupBBrokerSection.tsx`)
   - [export_status, status_reason, hs_code, hs_description, actual_weight_g, volumetric_weight_g, billable_weight_g, dimensions_cm, shipping_tier, hazmat_status, key_risk_ingredient, required_certificates, composition_info, spec_summary, hazmat_summary, sourcing_tip (parsed as steps 4–5), shipping_notes]

6. **Section 6 — Launch & Execution Kit / Supplier & Contact** (`SupplierContact.tsx`)
   - [verified_cost_usd, verified_cost_note, verified_at, moq, lead_time, can_oem, m_name, translated_name, corporate_scale, contact_email, contact_phone, m_homepage, wholesale_link, global_site_url, b2b_inquiry_url, sample_policy, export_cert_note, global_prices (Global Market Proof), viral_video_url, video_url, ai_detail_page_links, marketing_assets_url, ai_image_url]

**Deduplicated PDP field list (all report.* references):**
- actual_weight_g, ai_detail_page_links, ai_image_url, best_platform, billable_weight_g, buzz_summary, can_oem, category, common_pain_point, competition_level, composite_score, composition_info, contact_email, contact_phone, corporate_scale, dimensions_cm, estimated_cost_usd, export_cert_note, export_status, gap_index, gap_status, global_evidence, global_price, global_prices, global_site_url, global_trend_score, go_verdict, growth_evidence, growth_signal, hazmat_status, hazmat_summary, hs_code, hs_description, image_url, key_risk_ingredient, kr_evidence, kr_local_score, kr_price, kr_source_used, lead_time, m_homepage, m_name, marketing_assets_url, market_viability, moq, mom_growth, naver_link, new_content_volume, opportunity_reasoning, platform_scores, product_name, profit_multiplier, required_certificates, rising_keywords, search_volume, seo_keywords, shipping_notes, shipping_tier, spec_summary, sourcing_tip, status_reason, top_selling_point, translated_name, trend_entry_strategy, verified_at, verified_cost_note, verified_cost_usd, viability_reason, viral_hashtags, viral_video_url, video_url, volumetric_weight_g, wow_rate, b2b_inquiry_url, wholesale_link

---

## 2. Current Admin Fields (as-is)

Admin edit page (`app/admin/[id]/page.tsx`) is organized into 6 collapsible sections. Field order and presence as implemented:

**Section 1 — Product Identity**
- id (read-only), product_name, translated_name, category, kr_price, kr_price_usd (read-only), estimated_cost_usd (read-only), export_status, viability_reason, image_url, naver_link, week_id

**Section 2 — Trend Signal Dashboard**
- market_viability, competition_level, gap_status, wow_rate, mom_growth, growth_evidence
- (Missing here: growth_signal, new_content_volume, platform_scores — but platform_scores and new_content_volume appear in other sections; see below)

**Section 3 — Market Intelligence**
- profit_multiplier, top_selling_point, common_pain_point, new_content_volume, global_prices
- (Missing: search_volume, best_platform, estimated_cost_usd is read-only in S1)

**Section 4 — Social Proof & Trend Intelligence**
- buzz_summary, kr_local_score, global_trend_score, gap_index (read-only), kr_evidence, global_evidence, kr_source_used, gap_status (duplicate), opportunity_reasoning, rising_keywords (×5), seo_keywords (×5), viral_hashtags (×5), platform_scores, sourcing_tip

**Section 5 — Export & Logistics Intel**
- hs_code, hs_description, status_reason, composition_info, spec_summary, actual_weight_g, volumetric_weight_g, billable_weight_g (read-only), dimensions_cm, hazmat_status, required_certificates, shipping_notes
- (Missing: export_status is in S1; shipping_tier, key_risk_ingredient, hazmat_summary)

**Section 6 — Launch & Execution Kit**
- m_name, corporate_scale, contact_email, contact_phone, m_homepage, wholesale_link
- verified_cost_usd, verified_cost_note, verified_at, moq, lead_time, sample_policy, export_cert_note
- viral_video_url, video_url, marketing_assets_url
- ai_detail_page_links
- (Missing: global_site_url, b2b_inquiry_url, ai_image_url, can_oem)

**Admin formKeys (used for diff/save):**
product_name, translated_name, category, kr_price, export_status, viability_reason, image_url, naver_link, week_id, m_name, corporate_scale, contact_email, contact_phone, m_homepage, wholesale_link, status, market_viability, competition_level, gap_status, gap_index, billable_weight_g, wow_rate, mom_growth, growth_evidence, profit_multiplier, top_selling_point, common_pain_point, new_content_volume, global_prices, buzz_summary, kr_local_score, global_trend_score, kr_evidence, global_evidence, kr_source_used, opportunity_reasoning, rising_keywords, seo_keywords, viral_hashtags, platform_scores, sourcing_tip, hs_code, hs_description, status_reason, composition_info, spec_summary, actual_weight_g, volumetric_weight_g, dimensions_cm, hazmat_status, required_certificates, shipping_notes, verified_cost_usd, verified_cost_note, verified_at, moq, lead_time, sample_policy, export_cert_note, viral_video_url, video_url, marketing_assets_url, ai_detail_page_links, published_at

**Admin FIELD_LABELS_KO** includes the above; it does not include: search_volume, best_platform, trend_entry_strategy, growth_signal, shipping_tier, key_risk_ingredient, hazmat_summary, global_site_url, b2b_inquiry_url, ai_image_url, can_oem, global_price.

---

## 3. Missing Fields (in PDP, not in Admin)

These fields are used on the PDP but have **no input or display** on the Admin edit page. They must be added to Admin for full sync.

| Field | PDP usage | Section |
|-------|-----------|---------|
| **search_volume** | Market Intelligence — "Search Volume" block | Section 3 |
| **best_platform** | Market Intelligence — "Best Entry: {best_platform}" under Global Market Availability | Section 3 |
| **growth_signal** | Trend Signal Dashboard — "Growth Momentum" headline value | Section 2 |
| **trend_entry_strategy** | Social Proof — "Entry Strategy" under Gap Index | Section 4 |
| **shipping_tier** | Sourcing Intel — "Shipping Tier" with describeShippingTier() | Section 5 |
| **key_risk_ingredient** | Sourcing Intel — "Risk Ingredient" in Hazmat & Compliance | Section 5 |
| **hazmat_summary** | Sourcing Intel — "Hazmat Summary" expandable block | Section 5 |
| **global_site_url** | Supplier Contact — "Global Site" contact link | Section 6 |
| **b2b_inquiry_url** | Supplier Contact — "B2B Inquiry" contact link | Section 6 |
| **ai_image_url** | Supplier Contact — Creative Assets card "AI Product Image" | Section 6 |
| **can_oem** | Supplier Contact — "OEM / ODM" (Available / Not Available) | Section 6 |

**Optional / derived:**
- **global_price** — Used in PDP as fallback in `parseGlobalPricesForGrid(report.global_prices, report.global_price)`. If stored separately in DB, Admin may need it; otherwise it can remain derived/legacy.

---

## 4. Orphaned Fields (in Admin, not in PDP)

Fields that exist in the Admin form but are **not referenced** in the PDP components above (no `report.<field>` in ProductIdentity, TrendSignalDashboard, MarketIntelligence, SocialProofTrendIntelligence, SourcingIntel, SupplierContact, GroupBBrokerSection):

| Field | Admin section | Note |
|-------|----------------|------|
| **week_id** | S1 | Used in PDP only for navigation/back link (from page.tsx), not from report object in these components. Not orphaned for data integrity; keep. |
| **status** | Header | Report status (published/hidden). Used in PDP for visibility; keep. |
| **published_at** | formKeys / save | Used for publish timestamp. Keep. |

There are no true “orphan” content fields that the PDP never reads. The only structural oddity is **gap_status** appearing in both Admin Section 2 and Section 4 (duplicate input).

---

## 5. Correct Field Order for Admin (final target sequence)

Order below follows PDP section order so that Admin sections mirror PDP 1:1. Each line is the intended order within that section.

**Section 1 — Product Identity**
1. id (read-only)
2. product_name
3. translated_name
4. category
5. kr_price
6. kr_price_usd (read-only)
7. estimated_cost_usd (read-only)
8. export_status
9. viability_reason
10. go_verdict
11. composite_score
12. image_url
13. naver_link
14. week_id

**Section 2 — Trend Signal Dashboard**
1. market_viability
2. competition_level
3. gap_status
4. platform_scores
5. growth_signal  ← ADD
6. growth_evidence
7. new_content_volume

(Remove wow_rate, mom_growth from S2; they belong in Market Intelligence below.)

**Section 3 — Market Intelligence**
1. profit_multiplier
2. estimated_cost_usd (if made editable; else leave in S1 as read-only)
3. global_prices
4. best_platform  ← ADD
5. search_volume  ← ADD
6. mom_growth
7. wow_rate
8. top_selling_point
9. common_pain_point
10. new_content_volume  ← move here from current S3 (or keep single placement in S2; avoid duplicate)

**Section 4 — Social Proof & Trend Intelligence**
1. buzz_summary
2. kr_local_score
3. global_trend_score
4. kr_evidence
5. kr_source_used
6. global_evidence
7. gap_index (read-only)
8. gap_status  ← single placement (remove duplicate from S2 in current Admin)
9. trend_entry_strategy  ← ADD
10. opportunity_reasoning
11. rising_keywords
12. seo_keywords
13. viral_hashtags
14. platform_scores  ← single placement (currently only in S4; S2 should have it as above)
15. sourcing_tip

**Section 5 — Export & Logistics Intel**
1. export_status  ← consider moving here from S1 so all “Export & Logistics” fields are together; or keep in S1 for hero badge.
2. status_reason
3. hs_code
4. hs_description
5. actual_weight_g
6. volumetric_weight_g
7. billable_weight_g (read-only)
8. dimensions_cm
9. shipping_tier  ← ADD
10. hazmat_status
11. key_risk_ingredient  ← ADD
12. required_certificates
13. hazmat_summary  ← ADD
14. composition_info
15. spec_summary
16. shipping_notes

**Section 6 — Launch & Execution Kit (Supplier & Contact)**
1. m_name
2. corporate_scale
3. contact_email
4. contact_phone
5. m_homepage
6. wholesale_link
7. global_site_url  ← ADD
8. b2b_inquiry_url  ← ADD
9. verified_cost_usd
10. verified_cost_note
11. verified_at
12. moq
13. lead_time
14. can_oem  ← ADD
15. sample_policy
16. export_cert_note
17. viral_video_url
18. video_url
19. marketing_assets_url
20. ai_detail_page_links
21. ai_image_url  ← ADD

**Ordering mismatches to fix:**
- **gap_status**: Currently in Admin S2 and S4; should appear once (e.g. in S4 only, or S2 only to match “Opportunity Status” in PDP S2).
- **new_content_volume**: In Admin S3; PDP uses it in Section 2 (Trend Signal) and Section 3 (Market Intelligence). One placement in Admin is enough; prefer S2 to match “Growth Momentum” block.
- **wow_rate, mom_growth**: In Admin S2; PDP uses them in Section 3 (Market Intelligence, Search & Growth). Move to Admin S3.
- **platform_scores**: In Admin S4 only; PDP uses in Section 2 (Platform Breakdown). Add to Admin S2; keep single field (no duplicate).
- **go_verdict, composite_score**: Used in PDP ProductIdentity; not present in Admin. Add to S1.

---

## 6. CEO Manual Input Zone Fields (goes to bottom)

These fields require CEO (or human) manual research and are not auto-filled by Make.com. They should be grouped at the **bottom of the Admin form** (e.g. within Section 6 or a dedicated “Manual Input Zone” subsection):

| Field | PDP usage |
|-------|-----------|
| **verified_cost_usd** | Supplier cost per unit (Alpha) |
| **verified_cost_note** | e.g. "undisclosed" |
| **verified_at** | When cost was verified |
| **moq** | Minimum order quantity |
| **lead_time** | Est. production lead time |
| **sample_policy** | Sample order policy text |
| **video_url** | Raw ad footage URL |
| **viral_video_url** | Viral reference URL |
| **marketing_assets_url** | Brand asset kit URL |
| **ai_image_url** | AI product image URL (if manually overridden) |
| **export_cert_note** | Compliance/export note |
| **key_risk_ingredient** | Risk ingredient callout (manual review) |
| **status_reason** | Export status reasoning (manual) |
| **trend_entry_strategy** | Entry strategy text (can be manual polish) |
| **best_platform** | Best entry platform recommendation |

Optional to include in Manual Zone (if often manually set): **global_site_url**, **b2b_inquiry_url**, **can_oem**, **sample_policy** (already listed).

---

## 7. Export Status Value Mismatch

- **PDP** (SourcingIntel, ProductIdentity) expects `export_status` values: **"Green"**, **"Yellow"**, or anything else (e.g. "Red") for "Export Restricted".
- **Admin** dropdown: `EXPORT_STATUS_OPTIONS = ["Available", "Check Regulations", "Restricted", "Not Recommended"]`.
- **EXPORT_STATUS_DISPLAY** (constants): keys are `green`, `yellow`, `red` with labels "Ready to Export", "Check Regulations", "Export Restricted".

**Recommendation:** Align Admin dropdown with PDP/DB by using **Green**, **Yellow**, **Red** (or same casing as stored) so that PDP badges and copy render correctly without mapping layer.

---

## 8. Summary Checklist

| Action | Count |
|--------|--------|
| **Add to Admin** | 11 fields: search_volume, best_platform, growth_signal, trend_entry_strategy, shipping_tier, key_risk_ingredient, hazmat_summary, global_site_url, b2b_inquiry_url, ai_image_url, can_oem |
| **Add to Admin (PDP hero)** | 2 fields: go_verdict, composite_score |
| **Reorder / move** | wow_rate, mom_growth → S3; platform_scores in S2; gap_status single placement; new_content_volume single placement (S2) |
| **Remove duplicate** | gap_status (currently in S2 and S4) |
| **CEO Manual Zone** | 15+ fields listed in §6, grouped at bottom |
| **Export status values** | Change Admin options to Green / Yellow / Red (or stored values) to match PDP |

---

*End of Admin Sync Audit Report.*
