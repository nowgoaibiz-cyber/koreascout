import { PRICING } from "@/src/config/pricing";

/** Locked section CTA configs for weekly detail page. */
export const SECTION_3_LOCKED_CTA = {
  message: "The numbers are in. You just can't see them.",
  cta: `Unlock Market Intelligence — ${PRICING.CURRENCY}${PRICING.STANDARD.monthly}/mo →`,
  href: "/pricing",
  lockedFields: ["Profit multiplier", "Search volume", "Growth", "Global price", "SEO keywords"],
};

export const SECTION_STANDARD_CTA = {
  message: "Unlock profit margins, search trends, and global pricing intel.",
  cta: `Start Standard — ${PRICING.CURRENCY}${PRICING.STANDARD.monthly}/mo`,
  href: "/pricing",
  lockedFields: ["Profit multiplier", "Search volume", "Growth", "Global price", "SEO keywords"],
};

export const SECTION_4_LOCKED_CTA = {
  message: "This product is trending on ■ platforms. TikTok alone scored ■■/100.",
  cta: `See What's Trending — ${PRICING.CURRENCY}${PRICING.STANDARD.monthly}/mo →`,
  href: "/pricing",
  lockedFields: ["Platform scores", "Rising keywords", "Gap analysis", "Entry strategy"],
};

export const SECTION_CONSUMER_CTA = {
  message: "See exactly who's buying and which keywords drive sales.",
  cta: `Start Standard — ${PRICING.CURRENCY}${PRICING.STANDARD.monthly}/mo`,
  href: "/pricing",
  lockedFields: ["Consumer insight", "SEO keywords"],
};

export const SECTION_ALPHA_SOURCING_CTA = {
  message: "You know what sells. Now learn how to ship it.",
  cta: `Unlock Logistics Intel — ${PRICING.CURRENCY}${PRICING.ALPHA.monthly}/mo →`,
  href: "/pricing",
  lockedFields: ["✓ HS codes", "✓ Hazmat checks", "✓ Dimensions", "✓ Certifications"],
};

export const SECTION_ALPHA_MEDIA_CTA = {
  message: "See the viral Korean video that started the trend.",
  cta: `Unlock Media Vault — ${PRICING.CURRENCY}${PRICING.ALPHA.monthly}/mo →`,
  href: "/pricing",
  lockedFields: ["Product video (4K)", "Viral video", "AI product image"],
};

export const SECTION_ALPHA_SUPPLIER_CTA = {
  message:
    "The supplier is right here. One upgrade away. 💡 One successful product pays for a full year of Alpha.",
  cta: `Get Supplier Contact — ${PRICING.CURRENCY}${PRICING.ALPHA.monthly}/mo →`,
  href: "/pricing",
  lockedFields: [
    "Supplier Contact Info",
    "Verified Wholesale Cost",
    "MOQ & Lead Time",
    "Direct Factory Link",
    "B2B Negotiation Script",
  ],
};

export const EXPORT_STATUS_DISPLAY: Record<
  string,
  { variant: "success" | "warning" | "danger"; label: string }
> = {
  green: { variant: "success", label: "Ready to Export" },
  yellow: { variant: "warning", label: "Check Regulations" },
  red: { variant: "danger", label: "Export Restricted" },
};

export const SHIPPING_TIER_TOOLTIP =
  "Tier 1: <500g | Tier 2: 500g–2kg | Tier 3: 2kg+";
