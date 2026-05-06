# Creative Assets 썸네일 추가 전수조사

---

## SECTION 1: components/report/SupplierContact.tsx — Full File

```tsx
"use client";

import { useState } from "react";
import { LockedValue } from "@/components/ui/LockedValue";
import { ArrowRight, ArrowUpRight, Download, ExternalLink, Film, Globe, Globe2, ImageIcon, LayoutTemplate, Mail, Phone, Play, ShoppingBag } from "lucide-react";
import type { ScoutFinalReportsRow } from "@/types/database";
import { getAiDetailUrl } from "./utils";

export function SupplierContact({
  report,
  tier,
  isTeaser,
}: {
  report: ScoutFinalReportsRow;
  tier: "free" | "standard" | "alpha";
  isTeaser: boolean;
}) {
  const canSeeAlpha = tier === "alpha" || isTeaser;
  const hasSupplierFields =
    (report.m_name && report.m_name.trim()) ||
    (report.corporate_scale && report.corporate_scale.trim()) ||
    (report.contact_email && report.contact_email.trim()) ||
    (report.contact_phone && report.contact_phone.trim()) ||
    (report.m_homepage && report.m_homepage.trim()) ||
    (report.naver_link && report.naver_link.trim()) ||
    (report.wholesale_link && report.wholesale_link?.trim()) ||
    (report.sourcing_tip && report.sourcing_tip.trim());

  // Always render the section so labels are visible to all tiers.
  // hasSupplierFields is kept for potential future use but no longer gates rendering.

  const verifiedCostUsd = report.verified_cost_usd ?? null;
  const verifiedCostNote = report.verified_cost_note?.trim()?.toLowerCase() ?? null;
  const isUndisclosed = verifiedCostNote === "undisclosed";
  const costNum =
    verifiedCostUsd != null && verifiedCostUsd !== ""
      ? parseFloat(String(verifiedCostUsd))
      : NaN;
  const hasVerifiedPrice = !Number.isNaN(costNum);

  const viralUrl = report.viral_video_url?.trim() || null;
  const videoUrl = report.video_url?.trim() || null;
  const aiDetailUrl = getAiDetailUrl(report.ai_detail_page_links as string | unknown[] | Record<string, unknown> | null);
  const marketingUrl = report.marketing_assets_url?.trim() || null;
  const aiImageUrl = report.ai_image_url?.trim() || null;

  let rawPrices: Record<string, { url?: string; platform?: string }> = {};
  try {
    const raw = report.global_prices;
    if (typeof raw === "string") {
      const once = JSON.parse(raw);
      rawPrices = typeof once === "string" ? JSON.parse(once) : (once as typeof rawPrices);
    } else if (raw && typeof raw === "object") {
      rawPrices = raw as typeof rawPrices;
    }
  } catch {
    // ignore
  }
  const hasNested = "us_uk_eu" in rawPrices || "jp_sea" in rawPrices || "uae" in rawPrices;
  if (hasNested) {
    const usUkEu = rawPrices["us_uk_eu"] as { us?: { url?: string; platform?: string; listings?: unknown[] }; uk?: { url?: string; platform?: string; listings?: unknown[] }; eu?: { url?: string; platform?: string; listings?: unknown[] } } | undefined;
    const jpSea = rawPrices["jp_sea"] as { jp?: { url?: string; platform?: string }; sea?: { url?: string; platform?: string; listings?: unknown[] } } | undefined;
    const uaeVal = rawPrices["uae"] as { uae?: { url?: string; platform?: string } } | undefined;
    const shopeeData = rawPrices["shopee_lazada"] as { price_usd?: number; url?: string; listings?: Array<{ price_usd?: number; url?: string; platform?: string; title?: string }> } | undefined;
    const seaBase = jpSea?.sea as { url?: string; platform?: string; price_usd?: number; listings?: Array<{ price_usd?: number; url?: string; platform?: string }> } | undefined;

    // SEA: jp_sea.sea.listings + shopee_lazada.listings 둘 다 병합 후 표시
    const mergedSeaListings = [
      ...(seaBase?.listings ?? []),
      ...(shopeeData?.listings ?? []),
    ];
    const bestSeaListing = mergedSeaListings
      .filter(l => l.price_usd && l.price_usd > 0)
      .sort((a, b) => (a.price_usd ?? 0) - (b.price_usd ?? 0))[0];

    const seaMerged = {
      ...(seaBase ?? {}),
      url: bestSeaListing?.url ?? seaBase?.url ?? shopeeData?.url ?? undefined,
      platform: bestSeaListing?.platform ?? seaBase?.platform ?? undefined,
      listings: mergedSeaListings,
    };

    rawPrices = {
      ...Object.fromEntries(Object.entries(rawPrices).filter(([k]) => k !== "us_uk_eu" && k !== "jp_sea" && k !== "uae" && k !== "shopee_lazada")),
      us: usUkEu?.us,
      uk: usUkEu?.uk,
      eu: usUkEu?.eu,
      jp: jpSea?.jp,
      sea: seaMerged,
      uae: uaeVal?.uae,
    } as Record<string, { url?: string; platform?: string }>;
  }
  const regionsList = [
    { id: "us",  name: "US",  fullName: "North America" },
    { id: "uk",  name: "UK",  fullName: "United Kingdom" },
    { id: "eu",  name: "EU",  fullName: "European Union" },
    { id: "jp",  name: "JP",  fullName: "Japan" },
    { id: "sea", name: "SEA", fullName: "Southeast Asia" },
    { id: "uae", name: "UAE", fullName: "Middle East" },
  ];
  type ProofListing = { platform?: string; title?: string; price_usd?: number; url?: string; sold_out?: boolean };
  type ProofTag = { region: string; fullName: string; url: string; platform?: string; listings?: ProofListing[] };
  const globalProofTags: ProofTag[] = regionsList
    .map((r) => {
      const regionData = rawPrices[r.id] as { url?: string; platform?: string; listings?: ProofListing[] } | undefined;
      const hasUrl = regionData?.url?.startsWith("http");
      const hasListings = (regionData?.listings?.length ?? 0) > 0;
      if (!hasUrl && !hasListings) return null;
      const url = regionData?.url || (regionData?.listings?.[0] as { url?: string } | undefined)?.url || "#";
      const tag: ProofTag = {
        region: r.name,
        fullName: r.fullName,
        url,
        platform: regionData?.platform?.trim() || undefined,
        listings: regionData?.listings ?? [],
      };
      return tag;
    })
    .filter((t): t is ProofTag => t !== null);

  const assetCards = [
    viralUrl && {
      id: "viral",
      platform: "Viral" as const,
      title: "Viral Reference",
      description: "Korean TikTok/Reels success case. Study the hook.",
      href: viralUrl,
      ctaText: "Watch Original",
      isPrimary: true,
      icon: <Play className="w-32 h-32 text-[#1A1916]" />,
      hoverIcon: <Play className="w-5 h-5 text-[#1A1916]" />,
    },
    videoUrl && {
      id: "video",
      platform: "Video" as const,
      title: "Raw Ad Footage",
      description: "Unedited footage ready for your market adaptation.",
      href: videoUrl,
      ctaText: "Watch & Download",
      isPrimary: false,
      icon: <Film className="w-32 h-32 text-[#1A1916]" />,
      hoverIcon: <Download className="w-5 h-5 text-[#1A1916]" />,
    },
    aiDetailUrl && {
      id: "ai-landing",
      platform: "AI Page" as const,
      title: "AI Landing Page",
      description: "Opal-generated A/B product page drafts.",
      href: aiDetailUrl,
      ctaText: "Open Page",
      isPrimary: false,
      icon: <LayoutTemplate className="w-32 h-32 text-[#1A1916]" />,
      hoverIcon: <ExternalLink className="w-5 h-5 text-[#1A1916]" />,
    },
    marketingUrl && {
      id: "brand-asset",
      platform: "Assets" as const,
      title: "Brand Asset Kit",
      description: "High-res model shots and product imagery from the manufacturer.",
      href: marketingUrl,
      ctaText: "Access Assets",
      isPrimary: false,
      icon: <ImageIcon className="w-32 h-32 text-[#1A1916]" />,
      hoverIcon: <ArrowRight className="w-5 h-5 text-[#1A1916]" />,
    },
    aiImageUrl && {
      id: "ai-image",
      platform: "AI Image" as const,
      title: "AI Product Image",
      description: "AI-generated product image. Open or download.",
      href: aiImageUrl,
      ctaText: "Open / Download",
      isPrimary: false,
      icon: <ImageIcon className="w-32 h-32 text-[#1A1916]" />,
      hoverIcon: <Download className="w-5 h-5 text-[#1A1916]" />,
    },
  ].filter(Boolean) as Array<{
    id: string;
    platform: string;
    title: string;
    description: string;
    href: string;
    ctaText: string;
    isPrimary: boolean;
    icon: React.ReactNode;
    hoverIcon: React.ReactNode;
  }>;

  const refC = "text-base text-[#3D3B36] leading-relaxed opacity-90";

  return (
    <section className="bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
      <>
        <h2 className="text-3xl font-bold text-[#1A1916] mb-4 tracking-tight">
          Launch &amp; Execution Kit
        </h2>
        <p className="text-sm text-[#6B6860] mb-8">
          From product discovery to live campaign — everything you need.
        </p>

        <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-6 mt-6">
          <p className="text-xl font-bold text-[#1A1916] mb-10">Financial Briefing</p>

          <div className="mb-6">
            <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">
              Cost Per Unit
            </p>
            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="80px">
              {hasVerifiedPrice && !isUndisclosed ? (
                <div>
                  <p className="text-5xl font-black tracking-tighter text-[#1A1916]">
                    ${costNum.toFixed(2)}
                  </p>
                  {report.verified_at && (
                    <p className="text-xs text-[#9E9C98] mt-2">
                      Verified by KoreaScout on{" "}
                      {new Date(report.verified_at).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              ) : verifiedCostUsd != null && isUndisclosed ? (
                <p className="text-sm italic text-[#6B6860] leading-relaxed">
                  Pricing verified and on file. Contact the manufacturer directly.
                </p>
              ) : (
                <p className="text-sm italic text-[#9E9C98]">Not available</p>
              )}
            </LockedValue>
          </div>

          <div className="flex gap-32 mt-10">
            <div>
              <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">MOQ</p>
              <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
                <p className="text-4xl font-black tracking-tighter text-[#1A1916]">
                  {report.moq?.trim() || "—"}
                </p>
              </LockedValue>
            </div>
            <div>
              <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">
                Est. Production Lead Time
              </p>
              <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
                <p className="text-4xl font-black tracking-tighter text-[#1A1916]">
                  {report.lead_time?.trim() || "—"}
                </p>
              </LockedValue>
            </div>
            <div>
              <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">
                OEM / ODM
              </p>
              <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
                <p className="text-2xl font-black tracking-tighter text-[#1A1916]">
                  {report.can_oem == null ? "—" : report.can_oem ? "Available" : "Not Available"}
                </p>
              </LockedValue>
            </div>
          </div>
        </div>

        <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-6">
          <p className="text-xl font-bold text-[#1A1916] mb-10">Supplier &amp; Brand Intel</p>

          <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="120px">
            <div>
              {report.m_name?.trim() && (
                <div className="mb-8">
                  <p className="text-4xl font-black tracking-tighter text-[#1A1916] mb-2">
                    {report.translated_name?.split(" ")[0]?.toUpperCase() || report.m_name}
                    {" "}<span className="text-[#1A1916]/40">|</span>{" "}
                    {report.m_name}
                    {report.corporate_scale?.trim() && (
                      <span className="ml-3 text-sm font-bold text-[#9E9C98]">
                        {report.corporate_scale === "중소기업" ? "SME" :
                         report.corporate_scale === "대기업" ? "Enterprise" :
                         report.corporate_scale === "스타트업" ? "Startup" :
                         report.corporate_scale === "중견기업" ? "Mid-size" :
                         report.corporate_scale}
                      </span>
                    )}
                  </p>
                </div>
              )}
              {(() => {
                const contacts = [
                  report.contact_email?.trim() && {
                    id: "email",
                    icon: <Mail className="w-8 h-8 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                    label: report.contact_email!.trim(),
                    href: `mailto:${report.contact_email!.trim()}`,
                    external: false as const,
                  },
                  report.contact_phone?.trim() && {
                    id: "phone",
                    icon: <Phone className="w-8 h-8 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                    label: report.contact_phone!.trim(),
                    href: `tel:${report.contact_phone!.trim()}`,
                    external: false as const,
                  },
                  report.m_homepage?.trim() && {
                    id: "website",
                    icon: <Globe className="w-8 h-8 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                    label: "Website",
                    href: report.m_homepage!.trim(),
                    external: true as const,
                  },
                  report.wholesale_link?.trim() && {
                    id: "wholesale",
                    icon: <ShoppingBag className="w-8 h-8 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                    label: "Wholesale Portal",
                    href: report.wholesale_link!.trim(),
                    external: true as const,
                  },
                  report.global_site_url?.trim() && {
                    id: "global_site",
                    icon: <Globe2 className="w-8 h-8 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                    label: "Global Site",
                    href: report.global_site_url!.trim(),
                    external: true as const,
                  },
                  report.b2b_inquiry_url?.trim() && {
                    id: "b2b_inquiry",
                    icon: <ArrowUpRight className="w-8 h-8 text-[#9E9C98] group-hover:text-[#16A34A] shrink-0 transition-colors" />,
                    label: "B2B Inquiry",
                    href: report.b2b_inquiry_url!.trim(),
                    external: true as const,
                  },
                ].filter(Boolean) as Array<{ id: string; icon: React.ReactNode; label: string; href: string; external: boolean }>;

                if (contacts.length === 0) return null;
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    {contacts.map((contact, i) => (
                      <a
                        key={contact.id}
                        href={contact.href}
                        target={contact.external ? "_blank" : undefined}
                        rel={contact.external ? "noopener noreferrer" : undefined}
                        className={`flex items-center gap-5 bg-white border-2 border-[#E8E6E1] rounded-2xl p-8 hover:border-[#16A34A] transition-colors group ${contacts.length === 3 && i === 2 ? "col-span-1 sm:col-span-2" : ""}`}
                      >
                        {contact.icon}
                        <span className="text-xl font-bold text-[#1A1916] truncate">{contact.label}</span>
                      </a>
                    ))}
                  </div>
                );
              })()}
            </div>
          </LockedValue>

          <div className="mt-8">
            <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">
              Sample Policy
            </p>
            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="50px">
              <p className="text-sm text-[#3D3B36] leading-relaxed">
                {report.sample_policy?.trim() || "—"}
              </p>
            </LockedValue>
          </div>

          <div className="mt-6">
            <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">
              Compliance Note
            </p>
            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="50px">
              <p className="text-sm text-[#3D3B36] leading-relaxed">
                {report.export_cert_note?.trim() || "—"}
              </p>
            </LockedValue>
          </div>

          <div className="mt-8">
            <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-6">
              Global Market Proof
            </p>
            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="100px">
              {globalProofTags.length > 0 ? (
                <GlobalProofAccordion tags={globalProofTags} />
              ) : (
                <p className="text-sm italic text-[#9E9C98]">No global listings found.</p>
              )}
            </LockedValue>
          </div>
        </div>

        <div className="bg-[#F8F7F4] rounded-2xl p-10">
          <p className="text-xl font-bold text-[#1A1916] mb-10">Creative Assets</p>
          <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="120px">
            {assetCards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {assetCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white rounded-2xl border border-[#E8E6E1] overflow-hidden group hover:border-[#16A34A] transition-all duration-300 hover:shadow-[0_4px_20px_0_rgb(22_163_74/0.1)]"
                  >
                    <div className="aspect-video bg-[#F8F7F4] relative flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 text-[#1A1916] opacity-5 flex items-center justify-center">{card.icon}</div>
                      </div>
                      {card.platform && (
                        <span className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold rounded px-2 py-1 uppercase tracking-wide z-10">
                          {card.platform}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-[#16A34A]/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                          {card.hoverIcon}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-xl font-bold text-[#1A1916] mb-2">{card.title}</p>
                      <p className={`${refC} mb-6`}>{card.description}</p>
                      <a
                        href={card.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors duration-200 ${
                          card.isPrimary ? "bg-[#1A1916] text-white hover:bg-[#2D2B26]" : "bg-white border border-[#E8E6E1] text-[#1A1916] hover:border-[#1A1916]"
                        }`}
                      >
                        {card.ctaText}
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-[#9E9C98]">No creative assets available.</p>
            )}
          </LockedValue>
        </div>
      </>
    </section>
  );
}

function getShopeeOrLazadaLabel(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const h = new URL(url).hostname;
    if (h.includes("shopee.sg")) return "Shopee SG";
    if (h.includes("shopee.com.my")) return "Shopee MY";
    if (h.includes("lazada.sg")) return "Lazada SG";
    if (h.includes("lazada.com.my")) return "Lazada MY";
  } catch { return null; }
  return null;
}

function getPlatformLabel(l: { platform?: string | null; title?: string | null; url?: string | null }): string {
  if (l.platform) return l.platform;
  const sl = getShopeeOrLazadaLabel(l.url ?? null);
  if (sl) return sl;
  if (l.url) {
    try {
      return new URL(l.url).hostname.replace("www.", "");
    } catch { /* ignore */ }
  }
  return l.title || "Unknown";
}

function GlobalProofAccordion({ tags }: { tags: Array<{ region: string; fullName: string; url: string; platform?: string; listings?: Array<{ platform?: string; title?: string; price_usd?: number; url?: string; sold_out?: boolean }> }> }) {
  const [openRegion, setOpenRegion] = useState<string | null>(null);
  const toggle = (region: string) => setOpenRegion(prev => prev === region ? null : region);

  return (
    <div className="space-y-3">
      {tags.map((tag) => {
        const isOpen = openRegion === tag.region;

        // 1. 중복 제거 (platform명 + price_usd 기준)
        const seenKeys = new Set<string>();
        const deduped = (tag.listings ?? [])
          .filter(l => l.url && l.url.trim() !== "")
          .filter(l => {
            const name = getPlatformLabel(l);
            const key = `${name}__${l.price_usd ?? 0}`;
            if (seenKeys.has(key)) return false;
            seenKeys.add(key);
            return true;
          });

        // 2. 정렬: 활성(가격 있음, sold_out 아님) 오름차순 → 품절/무가격 맨 아래 가격 내림차순
        const topGroup = deduped
          .filter(l => (l.price_usd ?? 0) > 0 && l.sold_out !== true)
          .sort((a, b) => (a.price_usd ?? 0) - (b.price_usd ?? 0));
        const bottomGroup = deduped
          .filter(l => (l.price_usd ?? 0) === 0 || l.sold_out === true)
          .sort((a, b) => (b.price_usd ?? 0) - (a.price_usd ?? 0));
        const sortedListings = [...topGroup, ...bottomGroup];

        const sellerCount = sortedListings.length;

        return (
          <div key={tag.region} className="bg-white rounded-xl border border-[#E8E6E1] overflow-hidden transition-all">
            {/* 헤더 */}
            <button
              onClick={() => toggle(tag.region)}
              className="w-full flex items-center justify-between p-5 hover:bg-[#F8F7F4] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <span className="bg-[#1A1916] text-white px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-widest shrink-0">
                  {tag.region}
                </span>
                <span className="text-sm text-[#9E9C98] ml-2">{tag.fullName}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                {sellerCount > 0 && (
                  <span className="text-xs text-[#9E9C98]">{sellerCount} seller{sellerCount > 1 ? "s" : ""}</span>
                )}
                <span className="text-[#9E9C98] group-hover:text-[#1A1916] transition-colors text-sm">
                  {isOpen ? "▲" : "▼"}
                </span>
              </div>
            </button>

            {/* 펼쳐진 listings */}
            {isOpen && (
              <div className="border-t border-[#E8E6E1] divide-y divide-[#E8E6E1]/60">
                {sortedListings.length > 0 ? sortedListings.map((l, i) => {
                  const isSoldOut = (l.price_usd ?? 0) === 0 || l.sold_out === true;
                  const hasPrice = (l.price_usd ?? 0) > 0;
                  return (
                    <a
                      key={i}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-[#F8F7F4] transition-colors group/row"
                    >
                      <span className="text-sm font-medium text-[#1A1916] truncate">
                        {getPlatformLabel(l)}
                      </span>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {isSoldOut && (
                          <span className="text-[9px] font-black tracking-widest uppercase text-[#9E9C98] bg-[#F8F7F4] border border-[#E8E6E1] px-2 py-0.5 rounded-full">
                            Sold Out
                          </span>
                        )}
                        {hasPrice && (
                          <span className="text-sm font-bold text-[#1A1916]">
                            ${l.price_usd!.toFixed(2)}
                          </span>
                        )}
                        <ArrowUpRight className="w-4 h-4 text-[#9E9C98] group-hover/row:text-[#1A1916] transition-colors" />
                      </div>
                    </a>
                  );
                }) : (
                  <a
                    href={tag.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-[#F8F7F4] transition-colors group/row"
                  >
                    <span className="text-sm font-medium text-[#1A1916]">{tag.platform || tag.region}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#9E9C98] group-hover/row:text-[#1A1916] transition-colors" />
                  </a>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

---

## SECTION 2: 현재 Creative Assets 카드 구조 분석

코드 기준 답변.

1. **assetCards 배열에서 `video_url`과 `viral_video_url`이 각각 어떤 카드로 렌더되는가?**
   - `viral_video_url` → `viralUrl`로 읽혀 첫 번째 조건부 항목: `id: "viral"`, `title: "Viral Reference"`, `href: viralUrl`, `platform: "Viral"`, `ctaText: "Watch Original"`, 아이콘 `Play`.
   - `video_url` → `videoUrl`로 읽혀 두 번째 조건부 항목: `id: "video"`, `title: "Raw Ad Footage"`, `href: videoUrl`, `platform: "Video"`, `ctaText: "Watch & Download"`, 아이콘 `Film`, 호버 아이콘 `Download`.

2. **`aspect-video` 영역에 현재 무엇이 렌더되는가?**
   - 배경 클래스 `aspect-video bg-[#F8F7F4]`.
   - 큰 **`card.icon`(Lucide SVG)** 만 `opacity-5` 로 중앙 배치 — **실제 비디오/이미지/iframe 없음.**
   - `card.platform`이 있으면 좌상단 배지 텍스트.
   - 호버 시 녹색 오버레이 + `card.hoverIcon` 원형 버튼.
   - **이미지(`<img>`)나 `<iframe>`은 이 영역에 없음.**

3. **`thumbnail_url` 같은 별도 필드가 있는가?**
   - **없음.** `assetCards` 항목 타입에는 `thumbnail_url` 또는 유사 필드 없고, `report`에서는 `video_url`, `viral_video_url`, `marketing_assets_url`, `ai_image_url`, `ai_detail_page_links` 등만 사용.

4. **`LockedValue`가 어디에 wrapping되어 있는가?**
   - Financial Briefing: Cost Per Unit, MOQ, Est. Production Lead Time, OEM/ODM 각각 `<LockedValue locked={!canSeeAlpha} tier="alpha" …>`.
   - Supplier & Brand Intel: 메인 콘텐츠 블록, Sample Policy, Compliance Note, Global Market Proof 각각 `<LockedValue …>`.
   - **Creative Assets:** 제목 `Creative Assets`는 밖에 두고, **그리드 전체**가 `<LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="120px">` 로 감싸져 있음 (자산 카드 목록 또는 “No creative assets available.”).

5. **카드 클릭 시 `href`로 새 탭 열리는 구조인가?**
   - 카드 **전체**는 `<div>`라서 클릭해도 네비게이션 없음.
   - 하단 **CTA만** `<a href={card.href} target="_blank" rel="noopener noreferrer">` — **새 탭에서 `card.href` 열림.**
   - `aspect-video` 영역은 링크가 아님.

---

## SECTION 3: 구글드라이브 썸네일 URL 변환 가능 여부

**질문:** `video_url`에서 FILE_ID를 추출하는 로직이 컴포넌트 안에 있는가?

**답:** **없다.** `SupplierContact.tsx` 전체에서 `drive.google.com`, `thumbnail`, `FILE_ID`, `id=` 패턴으로 URL을 파싱하거나 Google Drive 전용 추출을 하는 코드는 없다. `videoUrl` / `viralUrl`은 `trim()` 후 `href`에 그대로 전달될 뿐이다.

관련 코드 (추출 없음, URL 그대로 사용):

```41:45:components/report/SupplierContact.tsx
  const viralUrl = report.viral_video_url?.trim() || null;
  const videoUrl = report.video_url?.trim() || null;
  const aiDetailUrl = getAiDetailUrl(report.ai_detail_page_links as string | unknown[] | Record<string, unknown> | null);
  const marketingUrl = report.marketing_assets_url?.trim() || null;
  const aiImageUrl = report.ai_image_url?.trim() || null;
```

```133:138:components/report/SupplierContact.tsx
    videoUrl && {
      id: "video",
      platform: "Video" as const,
      title: "Raw Ad Footage",
      description: "Unedited footage ready for your market adaptation.",
      href: videoUrl,
```

(참고: `getShopeeOrLazadaLabel` / `getPlatformLabel`은 **Global Market Proof**용 Shopee/Lazada/hostname 라벨만 다루며 Google Drive와 무관.)

---

## SECTION 4: database.ts — thumbnail 관련 필드 확인

`types/database.ts` 전체를 `thumbnail`, `poster`, `preview`(대소문자 무관), `image`로 검색한 결과:

- **`thumbnail` / `poster` / `preview`:** 해당 파일 **어느 줄에도 필드명으로 없음.**
- **`image` 포함 필드 복사 (해당 줄):**

```
  image_url: string;
  ai_image_url: string | null;
```

```
  /** Marketing assets (e.g. image pack, banner) URL */
  marketing_assets_url?: string | null;
```

위 세 줄은 `ScoutFinalReportsRow` 안의 이미지/에셋 URL과 관련된 유일한 직접 매칭이다.

---

## SECTION 5: 구현 난이도 평가

분석만 기준으로 한 평가(구현 지시 아님).

1. **`https://drive.google.com/thumbnail?id={FILE_ID}&sz=w400` 를 `aspect-video` 안에 `<img>`로 넣는 것이 가능한가?**  
   - **기술적으로는 가능.** 현재该区域는 아이콘 전용이므로, 조건부로 `<img>`를 추가하는 레이아웃 변경만으로 시도할 수 있다. 다만 브라우저/구글측 **hotlink·CORS·403·로그인 요구**, 파일 공개 설정 등으로 **실제로 로드 실패할 수 있는 리스크**는 코드만으로 제거 불가.

2. **`video_url` → FILE_ID 추출 → 썸네일 URL → `<img src>` 를 `SupplierContact.tsx` 안에서만 처리 가능한가?**  
   - **부분적으로만.** 순수 문자열 파싱(예: `/file/d/`, `id=` 쿼리, `/open?id=`)으로 보조 함수 만들기는 파일 내부에서 가능하다.  
   - 반면 URL 형식이 다양하거나 비드라이브이면 분기 필요. **외부 패키지/서버 프록시 없이 클라만**으로 할지는 요구사항에 따름.

3. **DB 스키마 변경 없이 프론트만으로 가능한가?**  
   - **썸네일을 파생값으로만 쓰는 경우 가능:** 기존 `video_url`(및 선택적으로 `viral_video_url`)만으로 계산하면 DB 변경 없음.  
   - 별도 썸네일 URL 저장이 필요하면 **스키마 확장 또는 파이프라인** 필요.

4. **예상 작업 범위 (대략)**  
   - **파일 개수:** 핵심 UI는 **`components/report/SupplierContact.tsx` 1개** 가능. 선택적으로 헬버를 **`components/report/utils.ts`** 등으로 분리 시 +1. 드라이브 URL 단위 테스트를 두면 **`*.test.ts`** 추가 가능.  
   - **줄 수 (대략):** 헬버(파일 ID 추출 + 썸네일 URL 생성) **~15–45줄**, 카드 레이아웃에 선택적 `<img>` + 폴백 아이콘 **카드별 ~10–25줄**, 타입 확장(assetCards에 선택 `thumbnailSrc?`) **~5–15줄** — 합하면 **약 35–95줄** 수준 추정 (에러 처리·URL 패턴 분기·`next/image` vs `img` 선택에 따라 변동).

