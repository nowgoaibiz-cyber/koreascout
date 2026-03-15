# CURSOR_WORK2_AUDIT.md

---

## 1. 소스 코드 전체

### 1.1 `components/report/SupplierContact.tsx` (전체)

```tsx
"use client";

import { Button } from "@/components/ui";
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

  if (!hasSupplierFields && !canSeeAlpha) return null;

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
    const usUkEu = rawPrices["us_uk_eu"] as { us?: { url?: string; platform?: string }; uk?: { url?: string; platform?: string }; eu?: { url?: string; platform?: string } } | undefined;
    const jpSea = rawPrices["jp_sea"] as { jp?: { url?: string; platform?: string }; sea?: { url?: string; platform?: string } } | undefined;
    const uaeVal = rawPrices["uae"] as { uae?: { url?: string; platform?: string } } | undefined;
    rawPrices = {
      ...Object.fromEntries(Object.entries(rawPrices).filter(([k]) => k !== "us_uk_eu" && k !== "jp_sea" && k !== "uae")),
      us: usUkEu?.us,
      uk: usUkEu?.uk,
      eu: usUkEu?.eu,
      jp: jpSea?.jp,
      sea: jpSea?.sea,
      uae: uaeVal?.uae,
    } as Record<string, { url?: string; platform?: string }>;
  }
  const regionsList = [
    { id: "us", name: "US" },
    { id: "uk", name: "UK" },
    { id: "sea", name: "SEA" },
    { id: "australia", name: "AU" },
    { id: "india", name: "IN" },
    { id: "eu", name: "EU" },
    { id: "jp", name: "JP" },
    { id: "uae", name: "UAE" },
  ];
  const globalProofTags: Array<{ region: string; url: string; platform?: string }> = regionsList
    .map((r) => ({
      region: r.name,
      url: rawPrices[r.id]?.url,
      platform: rawPrices[r.id]?.platform?.trim() || undefined,
    }))
    .filter((t): t is { region: string; url: string; platform: string | undefined } => typeof t.url === "string" && t.url.startsWith("http"));

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

  const refA = "text-xl font-bold text-[#1A1916] mb-10";
  const refB = "text-sm font-bold text-[#6B6860] tracking-widest mb-4";
  const refC = "text-base text-[#3D3B36] leading-relaxed opacity-90";

  return (
    <section className="bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
      {canSeeAlpha && (
        <>
          <div>
            <h2 className="text-3xl font-bold text-[#1A1916] mb-4 tracking-tight">Launch & Execution Kit</h2>
            <p className="text-sm text-[#6B6860] leading-relaxed mt-1">
              From product discovery to live campaign — everything you need.
            </p>
          </div>

          <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-6 mt-6">
            <p className={refA}>Financial Briefing</p>
            <div className="mb-10">
              <p className={refB}>Cost Per Unit</p>
              {hasVerifiedPrice && !isUndisclosed ? (
                <>
                  <p className="font-black tracking-tighter text-[#1A1916] leading-none" style={{ fontSize: "80px" }}>
                    ${costNum.toFixed(2)}
                  </p>
                  {report.verified_at && (
                    <p className="text-xs italic text-[#9E9C98] mt-3">
                      Verified by KoreaScout on{" "}
                      {new Date(report.verified_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </>
              ) : verifiedCostUsd != null && verifiedCostUsd !== "" && isUndisclosed ? (
                <p className="text-sm italic text-[#6B6860]">
                  Pricing verified and on file. Contact the manufacturer directly or use the broker email in Section 5.
                </p>
              ) : (
                <p className="text-sm italic text-[#9E9C98]">Not available</p>
              )}
            </div>
            {(report.moq?.trim() || report.lead_time?.trim() || report.can_oem != null) && (
              <div className="flex gap-32 mt-10">
                {report.moq?.trim() && (
                  <div>
                    <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">MOQ</p>
                    <p className="text-4xl font-black tracking-tighter text-[#1A1916]">{report.moq}</p>
                  </div>
                )}
                <div className="flex items-start gap-10">
                  {report.lead_time?.trim() && (
                    <div>
                      <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">Est. Production Lead Time</p>
                      <p className="text-4xl font-black tracking-tighter text-[#1A1916]">{report.lead_time}</p>
                    </div>
                  )}
                  {report.can_oem != null && (
                    <div>
                      <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">OEM / ODM</p>
                      <p className="text-4xl font-black tracking-tighter text-[#1A1916]">
                        {report.can_oem ? "Available" : "Not Available"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#F8F7F4] rounded-2xl p-10 mb-6">
            <p className={refA}>Supplier &amp; Brand Intel</p>
            {report.m_name?.trim() && (
              <div className="mb-8">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <p className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                    {report.translated_name?.split(" ")[0]?.toUpperCase() ?? report.m_name}
                    <span className="text-5xl font-black text-[#1A1916] ml-3">| {report.m_name}</span>
                  </p>
                  {report.corporate_scale?.trim() && (
                    <p className="text-lg font-medium text-[#9E9C98]">
                      {(() => {
                        const scaleMap: Record<string, string> = {
                          "중소기업": "SME",
                          "대기업": "Enterprise",
                          "스타트업": "Startup",
                          "중견기업": "Mid-size",
                        };
                        return scaleMap[report.corporate_scale!.trim()] ?? report.corporate_scale;
                      })()}
                    </p>
                  )}
                </div>
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
            {(report.sample_policy?.trim() || report.export_cert_note?.trim()) && (
              <div className="border-t border-[#E8E6E1] pt-8 space-y-5">
                {report.sample_policy?.trim() && (
                  <div>
                    <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">Sample Policy</p>
                    <p className="text-sm font-medium text-[#1A1916] leading-relaxed">{report.sample_policy}</p>
                  </div>
                )}
                {report.export_cert_note?.trim() && (
                  <div>
                    <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-3">Compliance Note</p>
                    <p className="text-sm font-medium text-[#1A1916] leading-relaxed">{report.export_cert_note}</p>
                  </div>
                )}
              </div>
            )}
            {globalProofTags.length > 0 && (
              <div id="global-market-proof" className="border-t border-[#E8E6E1] pt-8 mt-8 scroll-mt-[160px]">
                <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-6">Global Market Proof</p>
                {(() => {
                  const n = globalProofTags.length;
                  const renderCard = (
                    tag: { region: string; platform?: string; url: string },
                    borderClass: string,
                    paddingClass: string,
                    colClass: string = ""
                  ) => (
                    <a
                      key={tag.region}
                      href={tag.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-between bg-white rounded-xl ${borderClass} ${paddingClass} ${colClass} transition-all cursor-pointer group hover:border-[#1A1916] hover:shadow-md`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="bg-[#1A1916] text-white px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-widest shrink-0">
                          {tag.region}
                        </span>
                        {tag.platform && (
                          <span className="text-sm md:text-base font-bold text-[#1A1916] truncate">{tag.platform}</span>
                        )}
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-[#9E9C98] group-hover:text-[#1A1916] transition-colors shrink-0 ml-3" />
                    </a>
                  );
                  if (n === 1) return <div className="grid grid-cols-1">{renderCard(globalProofTags[0], "border-2 border-[#E8E6E1]", "p-6")}</div>;
                  if (n === 2) return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{globalProofTags.map((tag) => renderCard(tag, "border-2 border-[#E8E6E1]", "p-5"))}</div>;
                  if (n === 3) return <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{globalProofTags.map((tag) => renderCard(tag, "border border-[#E8E6E1]", "p-4"))}</div>;
                  if (n === 4) return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{globalProofTags.map((tag) => renderCard(tag, "border border-[#E8E6E1]", "p-4"))}</div>;
                  if (n === 5) return <div className="grid grid-cols-6 gap-3">{globalProofTags.map((tag, i) => renderCard(tag, "border border-[#E8E6E1]", "p-4", i < 2 ? "col-span-3" : "col-span-2"))}</div>;
                  return <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{globalProofTags.map((tag) => renderCard(tag, "border border-[#E8E6E1]", "p-4"))}</div>;
                })()}
              </div>
            )}
          </div>

          {assetCards.length > 0 && (
            <div className="bg-[#F8F7F4] rounded-2xl p-10">
              <p className={refA}>Creative Assets</p>
              <div className="grid grid-cols-2 gap-6">
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
            </div>
          )}
        </>
      )}
    </section>
  );
}
```

---

### 1.2 `components/ProductIdentity.tsx` (전체)

```tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { ScoutFinalReportsRow } from "@/types/database";

const FALLBACK_RATE = 1430;

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
}

type ExportStatusDisplay = Record<string, { variant: "success" | "warning" | "danger"; label: string }>;

export default function ProductIdentity({
  report,
  tier,
  isTeaser,
  EXPORT_STATUS_DISPLAY,
  reportId,
  weekId,
  isFavorited,
  isSample,
}: {
  report: ScoutFinalReportsRow;
  tier: "free" | "standard" | "alpha";
  isTeaser: boolean;
  EXPORT_STATUS_DISPLAY: ExportStatusDisplay;
  reportId?: string;
  weekId?: string;
  isFavorited?: boolean;
  isSample?: boolean;
}) {
  const canSeeAlpha = tier === "alpha" || isTeaser;
  const [exchangeRate, setExchangeRate] = useState<number>(FALLBACK_RATE);
  const [rateDate, setRateDate] = useState<string>(formatDate(new Date()));
  const [rateLoading, setRateLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    fetch("https://api.frankfurter.app/latest?from=USD&to=KRW", {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        const rate = data?.rates?.KRW;
        if (typeof rate === "number" && rate > 0) {
          setExchangeRate(Math.round(rate));
          setRateDate(formatDate(new Date()));
        }
      })
      .catch(() => {
        setExchangeRate(FALLBACK_RATE);
      })
      .finally(() => {
        clearTimeout(timeout);
        setRateLoading(false);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const exportBadge = (() => {
    const s = report.export_status;
    const key = s?.toLowerCase() ?? "";
    const label = (EXPORT_STATUS_DISPLAY[key]?.label ?? s) as string;
    if (!s || !label) return null;
    if (s === "Green" || key === "green") return { label, color: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]" };
    if (s === "Yellow" || key === "yellow") return { label, color: "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]" };
    return { label, color: "bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]" };
  })();

  const usdPrice = report.kr_price != null
    ? (Number(report.kr_price) / exchangeRate).toFixed(2)
    : null;

  return (
    <section
      id="section-1"
      className="scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-8 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]"
    >
      <h2 className="text-3xl font-bold text-[#1A1916] tracking-tight mb-8">
        Product Identity
      </h2>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="relative w-full md:w-80 shrink-0 overflow-hidden rounded-2xl bg-[#F8F7F4] aspect-[3/4]">
          {report.image_url ? (
            <Image
              src={report.image_url}
              alt={report.product_name || report.translated_name || "Product"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-[#9E9C98]">No image</p>
            </div>
          )}
          {isSample && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 pointer-events-none">
              <div className="rotate-[-35deg] border-2 border-white/40 px-6 py-2 rounded-lg backdrop-blur-sm">
                <span className="text-white/70 font-black text-2xl tracking-widest uppercase drop-shadow-md">
                  KoreaScout Sample
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden @container relative">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              {report.category?.trim() && (
                <span className="inline-flex items-center px-3 py-1.5 bg-[#F8F7F4] border border-[#E8E6E1] text-xs font-bold text-[#1A1916] rounded-md uppercase tracking-wide">
                  {report.category}
                </span>
              )}
              {exportBadge && (
                <span className={`inline-flex items-center px-3 py-1.5 border text-xs font-bold rounded-md uppercase tracking-wide ${exportBadge.color}`}>
                  {exportBadge.label}
                </span>
              )}
            </div>
            {reportId != null && weekId != null && (
              <FavoriteButton
                reportId={reportId}
                weekId={weekId}
                isFavorited={isFavorited ?? false}
                className={`shrink-0 ${isFavorited ? "fill-[#16A34A] text-[#16A34A]" : "text-gray-300 hover:text-[#16A34A]"}`}
                iconClassName="w-8 h-8"
              />
            )}
          </div>

          <h1
            className="font-bold text-[#1A1916] leading-tight break-words mb-2"
            style={{
              fontSize: "clamp(1.5rem, 4cqw, 2.25rem)",
              textWrap: "balance",
            } as React.CSSProperties}
          >
            {report.translated_name || report.product_name}
          </h1>

          {report.product_name && (
            <p className="text-lg font-medium text-[#6B6860] line-clamp-2 mb-4">
              {report.product_name}
            </p>
          )}

          {(report.go_verdict?.trim() || report.composite_score != null) && (() => {
            const verdictStyleMap: Record<string, { bg: string; text: string; dot: string }> = {
              "GO":          { bg: "bg-[#F0FDF4] border border-[#16A34A]", text: "text-[#16A34A]", dot: "bg-[#16A34A]" },
              "CAUTIOUS GO": { bg: "bg-[#FFFBEB] border border-[#D97706]", text: "text-[#D97706]", dot: "bg-[#D97706]" },
              "NO GO":       { bg: "bg-[#FEF2F2] border border-[#DC2626]", text: "text-[#DC2626]", dot: "bg-[#DC2626]" },
            };
            const key = report.go_verdict?.trim().toUpperCase() ?? "";
            const style = verdictStyleMap[key] ?? { bg: "bg-[#F8F7F4] border border-[#E8E6E1]", text: "text-[#6B6860]", dot: "bg-[#9E9C98]" };

            return (
              <div className="flex items-center gap-3 mb-6">
                {report.go_verdict?.trim() && (
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-widest ${style.bg} ${style.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                    {report.go_verdict.trim()}
                  </span>
                )}
                {report.composite_score != null && (
                  <span className="text-xs font-bold text-[#9E9C98] tracking-wide">
                    {report.composite_score.toFixed(1)}
                    <span className="font-medium text-[#D5D3CE]"> / 10</span>
                    <span className="ml-2 text-[#9E9C98]">KoreaScout Intelligence Score</span>
                  </span>
                )}
              </div>
            );
          })()}

          <div className="mt-6 bg-[#F8F7F4] rounded-2xl p-6 border border-[#E8E6E1]">
            <div className="flex flex-col space-y-3">
              {report.kr_price != null && (
                <div>
                  <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-2">
                    Retail Price (KR Market)
                  </p>
                  <div className="flex items-baseline flex-wrap">
                    <span className="text-2xl md:text-3xl font-black text-[#1A1916] leading-none tracking-tighter">
                      KRW {Number(report.kr_price).toLocaleString()}
                    </span>
                    {usdPrice && (
                      <>
                        <span className="text-2xl md:text-3xl font-light text-[#D5D3CE] mx-4 leading-none">
                          |
                        </span>
                        <span className="text-2xl md:text-3xl font-black text-[#1A1916] leading-none tracking-tighter">
                          USD {usdPrice}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-[#9E9C98] font-semibold mt-2">
                    {rateLoading
                      ? "Fetching live rate..."
                      : `Ex. Rate: ${exchangeRate.toLocaleString()} KRW/USD (Daily fixed at ${rateDate} 09:00 KST)`}
                  </p>
                </div>
              )}

              {report.estimated_cost_usd != null && (
                <p className="text-sm font-medium text-[#9E9C98]">
                  Est. Wholesale: ~${report.estimated_cost_usd}
                  <span className="text-[#D97706] text-xs ml-1">⚠ Estimated</span>
                </p>
              )}

              <a
                href="#section-6"
                className="inline-flex items-center gap-2 bg-white border border-[#E8E6E1] px-3 py-2 rounded-md hover:border-[#16A34A] transition-colors cursor-pointer group w-fit"
              >
                <Lock className="w-3.5 h-3.5 text-[#9E9C98] group-hover:text-[#16A34A] transition-colors shrink-0" />
                <span className="text-xs font-bold text-[#6B6860] group-hover:text-[#16A34A] transition-colors">
                  Alpha members get verified supplier quotes
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {report.viability_reason?.trim() && (
        <div className="mt-8 bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] border-l-4 border-l-[#16A34A] p-6">
          <p className="text-sm font-semibold text-[#16A34A] uppercase tracking-widest mb-2">
            Why It&apos;s Trending
          </p>
          <p className="text-base text-[#3D3B36] leading-relaxed">
            {report.viability_reason}
          </p>
        </div>
      )}
    </section>
  );
}
```

---

## 2. 조사 결과

### [조사 1] Global Market Proof 그리드 현재 상태

#### globalProofTags 배열 생성 방식 (rawPrices → url 추출)

1. **rawPrices 파싱 (44–69행)**  
   - `report.global_prices`를 문자열이면 `JSON.parse`(이중일 수 있음), 객체면 그대로 사용해 `rawPrices`에 넣음.  
   - `us_uk_eu`, `jp_sea`, `uae`가 있으면 이 그룹만 펼쳐서 `us`, `uk`, `eu`, `jp`, `sea`, `uae`로 평탄화하고, 나머지 키는 `Object.fromEntries(…filter)`로 유지.

2. **regionsList (70–79행)**  
   - 고정 리스트: `us`, `uk`, `sea`, `australia`, `india`, `eu`, `jp`, `uae` (id → name: US, UK, SEA, AU, IN, EU, JP, UAE).

3. **globalProofTags (80–86행)**  
   - `regionsList.map(r => ({ region: r.name, url: rawPrices[r.id]?.url, platform: rawPrices[r.id]?.platform?.trim() || undefined }))`  
   - `.filter(t => typeof t.url === "string" && t.url.startsWith("http"))`  
   - 즉, **region당 `rawPrices[regionId].url` 1개**만 사용하고, 유효한 URL(`http`로 시작)인 항목만 남김. `listings`나 여러 URL은 사용하지 않음.

#### 각 카드가 url 1개만 가지는지

- **예.**  
- `renderCard`의 타입은 `{ region: string; platform?: string; url: string }`이고, 카드의 `href={tag.url}`로 단일 URL만 사용함.  
- 카드 하나 = region 하나 = url 하나.

#### listings 배열 사용 여부

- **SupplierContact.tsx에서는 사용하지 않음.**  
- 이 컴포넌트는 `report.global_prices`만 읽고, `report.listings` 또는 `listings` 필드는 참조하지 않음.  
- `listings`는 `components/report/MarketIntelligence.tsx`(row.listings)와 `components/report/utils.ts`의 `parseGlobalPricesForGrid`(SEA 등 region 데이터의 listings 병합)에서만 사용됨.

---

### [조사 2] | 구분자 현재 상태

#### SupplierContact.tsx — "LAGOM | 라곰" 구분자 렌더링

- **위치:** Supplier & Brand Intel 섹션, 제조사명 블록.  
- **해당 라인 전체 (238–241행):**

```tsx
                  <p className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                    {report.translated_name?.split(" ")[0]?.toUpperCase() ?? report.m_name}
                    <span className="text-5xl font-black text-[#1A1916] ml-3">| {report.m_name}</span>
                  </p>
```

- **동작:**  
  - 앞: `report.translated_name`의 첫 단어를 대문자로, 없으면 `report.m_name`.  
  - 뒤: `"| " + report.m_name`.  
- 따라서 "LAGOM | 라곰" 형태는 `translated_name === "LAGOM …"`(또는 첫 단어만 대문자)이고 `m_name === "라곰"`일 때 나옴.

#### ProductIdentity.tsx — | 관련 코드

- **| 문자가 나오는 곳은 한 곳:**  
  - **203행:**  
    `<span className="text-2xl md:text-3xl font-light text-[#D5D3CE] mx-4 leading-none">|</span>`  
  - 용도: **가격 구분자** — "KRW 금액 | USD 금액" 사이에 시각적 구분용으로만 사용.  
- 브랜드/제품명용 "LAGOM | 라곰" 같은 구분자는 없음. `translated_name`, `product_name`만 그대로 표시함.

---

### [조사 3] shopee_lazada 키 처리 여부

#### SupplierContact.tsx의 rawPrices 파싱에서 shopee_lazada

- **처리하지 않음.**  
- 56행: `hasNested`는 `"us_uk_eu"`, `"jp_sea"`, `"uae"` 존재 여부만 봄.  
- 57–69행: 이 세 키만 펼쳐서 `us`, `uk`, `eu`, `jp`, `sea`, `uae`로 넣고, 그 외 키는 filter로 **제거하지 않고** 유지함.  
- 즉 `shopee_lazada`가 `global_prices`에 있어도 **그대로** `rawPrices["shopee_lazada"]`로 남음.  
- **하지만** `globalProofTags`는 **regionsList** 기준으로만 만듦(80–86행). `regionsList`의 `id`에는 `shopee_lazada`가 없음.  
- 따라서 `rawPrices["shopee_lazada"]`에 URL이 있어도 **globalProofTags에는 포함되지 않음.**

#### globalProofTags에 shopee_lazada URL이 들어가는지

- **아니오.**  
- `globalProofTags`는 `regionsList`의 8개 id(`us`, `uk`, `sea`, `australia`, `india`, `eu`, `jp`, `uae`)에 대해서만 `rawPrices[r.id]?.url`을 쓰므로, `shopee_lazada` 키는 완전히 무시됨.

#### 참고: utils.ts의 parseGlobalPricesForGrid

- `components/report/utils.ts`의 `parseGlobalPricesForGrid`에서는 **shopee_lazada를 SEA에 병합**함(176–186행):  
  `shopee_lazada.listings`를 `flat["sea"]`의 listings와 합치고, SEA의 url/price를 보강함.  
- 이 함수는 **MarketIntelligence.tsx**에서만 사용하고, **SupplierContact.tsx**는 이 함수를 쓰지 않고 자체 `rawPrices` + `regionsList` 로직만 사용함.

---

*문서 끝*
