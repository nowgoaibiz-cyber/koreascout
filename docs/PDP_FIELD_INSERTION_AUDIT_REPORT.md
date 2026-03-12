# PDP Field Insertion Points — Technical Audit Report

**Auditor:** Senior Technical Auditor for KoreaScout  
**Scope:** 4 locations for upcoming field additions (sourcing_tip_logistics, can_oem, hazmat_summary, corporate_scale / m_name)  
**Rule:** Investigation and report only — no code modified.

---

## TASK 1 — sourcing_tip_logistics & Shipping Notes location

### 1. Component that renders "Shipping Notes"
- **File:** `components/report/SourcingIntel.tsx`

### 2. EXACT code block for Shipping Notes (full card/section)
The Shipping Notes **label + content** block is:

```tsx
                  {hasNotes && (
                    <div className="border-t border-dashed border-[#E8E6E1] pt-8">
                      <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-3">Shipping Notes</p>
                      <p className="text-sm italic text-[#6B6860] leading-relaxed">{notes}</p>
                    </div>
                  )}
```

It lives inside the larger **Compliance & Logistics Strategy** card (IIFE), which starts at line 198:

```tsx
        {(() => {
          const notes = report.shipping_notes?.trim();
          const hasNotes = notes && !/tier/i.test(notes);
          if (logisticsSteps.length === 0 && !hasNotes) return null;

          return (
            <div className="bg-[#F8F7F4] rounded-2xl p-10">
              <p className="text-xl font-bold text-[#1A1916] mb-10">Compliance &amp; Logistics Strategy</p>
              ...
                  {hasNotes && (
                    <div className="border-t border-dashed border-[#E8E6E1] pt-8">
                      <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-3">Shipping Notes</p>
                      <p className="text-sm italic text-[#6B6860] leading-relaxed">{notes}</p>
                    </div>
                  )}
                </>
              ) : (
                ...
              )}
            </div>
          );
        })()}
```

### 3. DB field used
- **`report.shipping_notes`** (used at lines 195 and 225; `notes` is derived from it).

### 4. Exact line numbers
- **Shipping Notes section start (label):** line **224** (`<p ...>Shipping Notes</p>`).
- **Block containing Shipping Notes:** lines **221–226** (the `hasNotes && (...)` block).

### 5. Is sourcing_tip_logistics referenced anywhere?
- **No.** Grep over `*.ts` and `*.tsx` found **no** references to `sourcing_tip_logistics` in any component or type.

### 6. Is sourcing_tip_logistics in ScoutFinalReportsRow?
- **No.** `types/database.ts` defines `ScoutFinalReportsRow` with `shipping_notes` (line 139) but **does not** include `sourcing_tip_logistics`.

---

## TASK 2 — can_oem & Lead Time location

### 1. Component that renders "Est. Production Lead Time"
- **File:** `components/report/SupplierContact.tsx`

### 2. EXACT code block for Lead Time card/row
```tsx
                {report.lead_time?.trim() && (
                  <div>
                    <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">Est. Production Lead Time</p>
                    <p className="text-4xl font-black tracking-tighter text-[#1A1916]">{report.lead_time}</p>
                  </div>
                )}
```

### 3. DB field used
- **`report.lead_time`** (lines 204 condition, 213 value).

### 4. Exact line numbers
- **Lead Time block:** lines **208–214** (inclusive).  
- **Label "Est. Production Lead Time":** line **211**.  
- **Value:** line **213**.

### 5. Is can_oem referenced anywhere?
- **No.** Grep over `*.ts` and `*.tsx` found **no** references to `can_oem` in any component.

### 6. Is can_oem in ScoutFinalReportsRow?
- **No.** `types/database.ts` has `lead_time` (line 94) on `ScoutFinalReportsRow` but **does not** include `can_oem`.

---

## TASK 3 — hazmat_summary & Hazmat badges location

### 1. Component that renders Hazmat badges
- **Badge UI:** `components/HazmatBadges.tsx` (renders Liquid, Powder, Battery, Aerosol from `contains_liquid`, `contains_powder`, `contains_battery`, `contains_aerosol`).
- **Usage:** `components/report/SourcingIntel.tsx` — "Hazmat & Compliance" block that includes `<HazmatBadges status={report.hazmat_status as unknown} />`.

### 2. EXACT code block for the entire Hazmat section (in SourcingIntel.tsx)
```tsx
              <div className="border-t border-[#E8E6E1] pt-8 mt-4">
                <p className="text-xl font-bold text-[#1A1916] mb-6">Hazmat &amp; Compliance</p>
                <div className="w-full mb-10">
                  <HazmatBadges status={report.hazmat_status as unknown} />
                </div>
                {report.key_risk_ingredient?.trim() && (
                  ...
                )}
                {certs.length > 0 && (
                  ...
                )}
              </div>
```

Hazmat badges-only block (the wrapper that ends where badges end):

```tsx
                <div className="w-full mb-10">
                  <HazmatBadges status={report.hazmat_status as unknown} />
                </div>
```
- **Lines:** 136–138.

### 3. Exact line number where Hazmat badges end (insertion point for hazmat_summary below)
- **Hazmat badges end at line 138** (closing `</div>` of the `w-full mb-10` wrapper).
- **Insertion point for hazmat_summary:** immediately **after line 138**, before line 139 (`{report.key_risk_ingredient?.trim() && (`).

### 4. Is hazmat_summary referenced anywhere?
- **No.** Grep over `*.ts` and `*.tsx` found **no** references to `hazmat_summary` in any component.

### 5. Is hazmat_summary in ScoutFinalReportsRow?
- **No.** `types/database.ts` has `hazmat_status` (line 129) on `ScoutFinalReportsRow` but **does not** include `hazmat_summary`.

---

## TASK 4 — corporate_scale & manufacturer name location

### 1. Component that renders manufacturer name (m_name)
- **File:** `components/report/SupplierContact.tsx`

### 2. EXACT code block showing how m_name is rendered
```tsx
            {report.m_name?.trim() && (
              <p className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter break-words mb-8">
                {report.m_name}
              </p>
            )}
```

### 3. Exact line numbers
- **Block:** lines **221–225**.  
- **Condition:** 221. **Rendered value:** 223 (`{report.m_name}`).

### 4. Is corporate_scale referenced in the render output (not just logic)?
- **No.** `corporate_scale` is used only in **logic**: `hasSupplierFields` in `SupplierContact.tsx` (line 20) and in `app/weekly/[weekId]/[id]/page.tsx` (line 88) to decide whether to show the Launch Kit / Section 6. It is **never** rendered as text in the UI (no `<p>`, `<span>`, etc. displaying `report.corporate_scale`).

### 5. English translation of m_name?
- **No.** There is no translation layer. The code renders `{report.m_name}` as-is; Korean (or any stored value) is displayed without translation.

### 6. translated_manufacturer_name or english_name in ScoutFinalReportsRow?
- **No.** Grep found no `translated_manufacturer_name` or `english_name` in the codebase. `types/database.ts` defines `m_name` (line 62) on `ScoutFinalReportsRow` but **does not** define `translated_manufacturer_name` or `english_name`.

---

## FINAL DELIVERABLE — Summary table

| Task | Target field / area | Component (file) | Insertion / location | DB field currently used | Field in ScoutFinalReportsRow? | Field referenced in UI? |
|------|--------------------|------------------|------------------------|---------------------------|--------------------------------|---------------------------|
| 1 | sourcing_tip_logistics / Shipping Notes | `components/report/SourcingIntel.tsx` | Near Shipping Notes block: lines **221–226** (after or alongside `shipping_notes`) | `shipping_notes` | **No** | **No** (sourcing_tip_logistics) |
| 2 | can_oem / Lead Time | `components/report/SupplierContact.tsx` | Lead Time row: lines **208–214** | `lead_time` | **No** | **No** (can_oem) |
| 3 | hazmat_summary / Hazmat badges | `components/report/SourcingIntel.tsx` | After line **138** (below `<HazmatBadges />` wrapper) | `hazmat_status` (JSONB) | **No** | **No** (hazmat_summary) |
| 4 | corporate_scale / m_name | `components/report/SupplierContact.tsx` | m_name block: lines **221–225**; corporate_scale not rendered | `m_name` | **Yes** (corporate_scale at line 65) | corporate_scale: **logic only**; m_name: **yes** |

**File and line reference:**

- **Shipping Notes (sourcing_tip_logistics):** `components/report/SourcingIntel.tsx` — Shipping Notes block **224** (label), block **221–226**; add/use `sourcing_tip_logistics` in same card/section.
- **Lead Time (can_oem):** `components/report/SupplierContact.tsx` — **211** (label), **208–214** (row); add `can_oem` near this row.
- **Hazmat (hazmat_summary):** `components/report/SourcingIntel.tsx` — Hazmat badges end at **138**; insert hazmat_summary **after line 138**.
- **Manufacturer (m_name / corporate_scale):** `components/report/SupplierContact.tsx` — m_name at **221–225**; corporate_scale is in type and logic only, not in render — add render near m_name if desired.

---

*End of audit report. No code was modified.*
