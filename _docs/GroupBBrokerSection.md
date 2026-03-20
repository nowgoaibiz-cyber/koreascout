# GroupBBrokerSection Component Documentation

**Source:** `components/GroupBBrokerSection.tsx`

---

## 1. Props and Types

| Prop            | Type                   |
|-----------------|------------------------|
| `report`       | `ScoutFinalReportsRow`  |
| `canSeeAlpha`  | `boolean`              |

**Location:** Lines 13–19.

```ts
export function GroupBBrokerSection({
  report,
  canSeeAlpha,
}: {
  report: ScoutFinalReportsRow;
  canSeeAlpha: boolean;
}) {
```

**Note:** This component does **not** receive `tier` or `isTeaser` directly. It receives `canSeeAlpha` from the parent (e.g. SourcingIntel: `canSeeAlpha = tier === "alpha" || isTeaser`).

---

## 2. ScoutFinalReportsRow Fields Used (with line numbers)

| Field           | Line(s) | Usage |
|-----------------|--------|--------|
| `hs_code`       | 22–24, 56, 61–62, 72, 88 | Formatting, display, Copy button; gate for Broker Email Draft. |
| `hs_description`| 72–76 | Shown under HS Code when not email-open and trim() truthy. |

**Note:** `<BrokerEmailDraft report={report} onOpenChange={setIsEmailOpen} />` (lines 89–91) receives the full `report`; any fields used inside BrokerEmailDraft are not listed here (see that component’s docs if needed).

---

## 3. Conditional Renders (tier / canSeeAlpha)

| Line(s)   | Exact condition | Behavior |
|-----------|------------------|----------|
| 42–104    | `canSeeAlpha ? (...) : (...)` | **True:** Two-column layout (HS Code + Broker Email Draft). **False:** Two placeholder divs (`grid grid-cols-2 gap-6`, each `h-24 rounded-xl bg-[#F2F1EE]`). |
| 56–84     | `report.hs_code?.trim() ? (...) : (...)` | **True:** HS code value + Copy button; when `!isEmailOpen && report.hs_description?.trim()` also description. **False:** "No HS code available." (italic). |
| 88–97     | `report.hs_code?.trim() ? (...) : (...)` | **True:** `<BrokerEmailDraft report={report} onOpenChange={setIsEmailOpen} />`. **False:** "Available once HS code is confirmed." (italic). |

There is **no** direct `tier` check in this file; only `canSeeAlpha` is used.

---

## 4. Data Values Displayed to User (line + field name)

| Line(s) | Field / Source | What user sees |
|---------|----------------|----------------|
| 38–40   | Static         | "HS Code & Broker Weapon". |
| 42–99   | When `canSeeAlpha`: | |
| 55      | Static         | "HS Code". |
| 59–62   | `hs_code` (via `formatHsCode`) | Formatted HS code value. |
| 64–70   | —              | "Copy" button (and "Copied!" state). |
| 72–76   | `hs_description` | Description under HS code (when not email-open). |
| 79–82   | —              | "No HS code available." when no hs_code. |
| 86      | Static         | "Broker Email Draft". |
| 89–91   | —              | BrokerEmailDraft (uses report). |
| 94–96   | —              | "Available once HS code is confirmed." when no hs_code. |
| 100–104 | When `!canSeeAlpha`: | Two gray placeholder blocks (no text). |

---

## 5. Blur / Lock Behavior

- **No blur (backdrop-blur)** in this component.
- **No lock icon** in this component.
- When `!canSeeAlpha`, the component renders **two placeholder divs** only (lines 101–102):
  - `className="h-24 rounded-xl bg-[#F2F1EE]"` (repeated for left and right).
- No overlay, no "Alpha" badge, no CTA; just gray boxes in a 2-column grid.
