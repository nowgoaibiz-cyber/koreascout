# SourcingIntel Component Documentation

**Source:** `components/report/SourcingIntel.tsx`

---

## 1. Props and Types

| Prop      | Type                   |
|----------|------------------------|
| `report` | `ScoutFinalReportsRow`  |
| `tier`   | `string`               |
| `isTeaser` | `boolean`            |

**Location:** Lines 12–20.

```ts
export function SourcingIntel({
  report,
  tier,
  isTeaser,
}: {
  report: ScoutFinalReportsRow;
  tier: string;
  isTeaser: boolean;
}) {
```

---

## 2. ScoutFinalReportsRow Fields Used (with line numbers)

| Field                  | Line(s) | Usage |
|------------------------|--------|--------|
| `sourcing_tip`         | 23–24, 204–228 | Parsed by `parseSourcingStrategy`; steps 4–5 shown in "Compliance & Logistics Strategy". |
| `actual_weight_g`      | 26, 95, 119 | Shown as "Actual Weight" (Xg); used in "Volumetric applies" / "Dead weight applies". |
| `volumetric_weight_g`  | 27, 104, 107, 119 | Shown as "Volumetric Weight" (Xg); compared to actual for billable copy. |
| `billable_weight_g`    | 28, 116 | Shown as "Billable Weight" (Xg). |
| `required_certificates`| 31–32, 153–164 | Split by comma, shown as certification pills. |
| `export_status`        | 35–38, 57–75 | Drives Export Readiness state (Green/Yellow/Red) and copy. |
| `status_reason`        | 65–66 | Shown under export status when present. |
| `dimensions_cm`        | 105–107 | Shown under Volumetric Weight when present. |
| `shipping_tier`        | 126–133 | Shown in "Shipping Tier" via `describeShippingTier`. |
| `hazmat_status`        | 141 | Passed to `<HazmatBadges status={...} />`. |
| `key_risk_ingredient`  | 144–148 | Shown as "Risk Ingredient: {value}". |
| `composition_info`     | 169–172 | Shown in "Ingredients" via `<ExpandableText>`. |
| `spec_summary`         | 174–177 | Shown in "Specifications" via `<ExpandableText>`. |
| `hazmat_summary`       | 185–188 | Shown in "Hazmat Summary" via `<ExpandableText>`. |
| `shipping_notes`       | 203, 233–236 | Filtered (no "tier" in notes); shown in "Shipping Notes". |
| (via GroupBBrokerSection) | 82 | `report` passed to `GroupBBrokerSection` (hs_code, hs_description, etc.). |

---

## 3. Conditional Renders (tier / canSeeAlpha / isTeaser)

**Derived:** `canSeeAlpha = tier === "alpha" || isTeaser` (line 21).

| Line(s)   | Exact condition | Behavior |
|-----------|------------------|----------|
| 55–79     | `canSeeAlpha ? (...) : (...)` | **True:** Export Readiness card (status, icon, status_reason, italic copy). **False:** Placeholder `<div className="h-20 w-full rounded-xl bg-[#F2F1EE]" />`. |
| 82        | —                | `<GroupBBrokerSection report={report} canSeeAlpha={canSeeAlpha} />` always rendered. |
| 88–201    | `canSeeAlpha ? (...) : (...)` | **True:** Full Logistics Dashboard (weights, shipping tier, Hazmat, certs, ingredients/specs/hazmat summary). **False:** Three placeholders: `h-16`, `h-24`, `h-20` with `rounded-xl bg-[#F2F1EE]`. |
| 207       | `logisticsSteps.length === 0 && !hasNotes` | Entire "Compliance & Logistics Strategy" block not rendered. |
| 214–248   | `canSeeAlpha ? (...) : (...)` | **True:** Steps 4–5 + optional Shipping Notes. **False:** Two placeholders (`h-24`, `h-16`) with `rounded-xl bg-[#F2F1EE]`. |
| 255–264   | `!canSeeAlpha` | Full-section overlay with lock CTA and "Go Alpha" button. |

---

## 4. Data Values Displayed to User (line + field name)

| Line(s) | Field / Source | What user sees |
|---------|----------------|----------------|
| 46–47   | Static         | Section title "Export & Logistics Intel". |
| 53      | Static         | "Export Readiness". |
| 55–76   | When `canSeeAlpha`: | |
| 57–62   | `export_status` | Icon (CheckCircle / AlertTriangle / XCircle). |
| 63      | `exportConfig.label` (from `export_status`) | "Ready for Export" / "Conditional Export" / "Export Restricted". |
| 65–66   | `status_reason` | Status reason text. |
| 68–75   | `export_status` | One of three italic strategy sentences. |
| 78      | —              | Placeholder gray block when !canSeeAlpha. |
| 82      | —              | GroupBBrokerSection (HS Code & Broker). |
| 85      | Static         | "Logistics Dashboard". |
| 88–201  | When `canSeeAlpha`: | |
| 94–95   | `actual_weight_g` | "Actual Weight" value (Xg or "—"). |
| 101–104 | `volumetric_weight_g` | "Volumetric Weight" value (Xg or "—"). |
| 106–107 | `dimensions_cm` | Dimensions badge under volumetric. |
| 115–116 | `billable_weight_g` | "Billable Weight" value (Xg or "—"). |
| 119     | `volumetric_weight_g`, `actual_weight_g` | "Volumetric applies" or "Dead weight applies". |
| 128–131 | `shipping_tier` | Shipping tier description. |
| 137     | Static         | "Hazmat & Compliance". |
| 140–141 | `hazmat_status` | HazmatBadges. |
| 144–148 | `key_risk_ingredient` | "Risk Ingredient: {value}". |
| 154     | Static         | "Certifications Required". |
| 156–163 | `required_certificates` | Certificate pills. |
| 170–171 | `composition_info` | "Ingredients" ExpandableText. |
| 175–176 | `spec_summary`  | "Specifications" ExpandableText. |
| 186–187 | `hazmat_summary`| "Hazmat Summary" ExpandableText. |
| 199–200 | —              | Placeholder blocks when !canSeeAlpha. |
| 212     | Static         | "Compliance & Logistics Strategy". |
| 214–248 | When `canSeeAlpha`: | |
| 221–226 | From `logisticsSteps` (from `sourcing_tip`) | Step number, label, content. |
| 234–235 | Static         | "Shipping Notes". |
| 236     | `shipping_notes` (as `notes`) | Shipping notes text. |
| 244–246 | —              | Placeholder blocks when !canSeeAlpha. |
| 255–264 | When `!canSeeAlpha`: | Overlay (see below). |
| 257     | —              | Lock icon. |
| 259–261 | Static         | "Unlock full logistics intelligence with Alpha." |
| 262–263 | —              | "Go Alpha $X/mo →" button (PRICING). |
| 267–272 | Static         | Footer "Compliance & Safety Cleared by: ...". |

---

## 5. Blur / Lock / Overlay Behavior

- **No blur (backdrop-blur)** in this component.
- **Placeholders when `!canSeeAlpha`:**
  - **Lines 77–78:** Single block — `className="h-20 w-full rounded-xl bg-[#F2F1EE]"`.
  - **Lines 199–201:** Three blocks — `h-16`, `h-24`, `h-20` each `w-full rounded-xl bg-[#F2F1EE]`.
  - **Lines 244–246:** Two blocks — `h-24`, `h-16` each `w-full rounded-xl bg-[#F2F1EE]`.
- **Full-section overlay when `!canSeeAlpha` (lines 255–264):**
  - **Wrapper:** `className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col items-center justify-end pb-6 gap-3 rounded-2xl"`.
  - **Icon:** `<Lock className="w-5 h-5 text-[#9E9C98]" />`.
  - **Text:** "Unlock full logistics intelligence with Alpha." (`text-sm text-[#6B6860] text-center max-w-xs`).
  - **CTA:** `<a href="/pricing"><Button variant="secondary" size="sm">Go Alpha {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo →</Button></a>`.
  - Section has `relative` (line 44) so overlay sits on top of content. No lock icon on individual blocks; one overlay covers the whole section.
