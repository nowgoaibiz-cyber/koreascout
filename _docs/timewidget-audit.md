## 1. PRICING CONFIG — full file contents

```
export const PRICING = {
  FREE: {
    monthly: 0,
    daily: 0,
  },
  STANDARD: {
    monthly: 79,
    daily: 2.63,
  },
  ALPHA: {
    monthly: 199,
    daily: 6.63,
    marketingDailyLimit: 6.7, // For "under $4.50 a day" copy
  },
  CURRENCY: "$",
} as const;
```

## 2. COMPONENTS DIRECTORY STRUCTURE — full tree

components/AlphaVaultPreview.tsx
components/BrokerEmailDraft.tsx
components/CheckoutButton.tsx
components/ContactCard.tsx
components/CopyButton.tsx
components/DonutGauge.tsx
components/DynamiteFuseSection.tsx
components/ExpandableText.tsx
components/FaqAccordion.tsx
components/FavoriteButton.tsx
components/GlobalPricingTable.tsx
components/GoogleSignInButton.tsx
components/GrandEntrance.tsx
components/GroupBBrokerSection.tsx
components/HazmatBadges.tsx
components/Hero.tsx
components/HeroCTA.tsx
components/IntelligencePipeline.tsx
components/IntelligenceTicker.tsx
components/LandingPipelineSneakPeek.tsx
components/LandingTimeWidget.tsx
components/LaunchKit.tsx
components/LockedSection.tsx
components/Logo.tsx
components/LogoutButton.tsx
components/ManageBillingButton.tsx
components/PriceComparisonBar.tsx
components/ProductIdentity.tsx
components/RemoveFavoriteButton.tsx
components/ScrollToIdButton.tsx
components/SplashScreen.tsx
components/StatusBadge.tsx
components/TagCloud.tsx
components/ViralHashtagPills.tsx
components/ZombieWatermark.tsx
components/admin/AiPageLinksHelper.tsx
components/admin/GlobalPricesHelper.tsx
components/admin/HazmatCheckboxes.tsx
components/layout/ClientLeftNav.tsx
components/layout/Header.tsx
components/layout/HeaderNavClient.tsx
components/layout/HeaderShellClient.tsx
components/report/MarketIntelligence.tsx
components/report/SocialProofTrendIntelligence.tsx
components/report/SourcingIntel.tsx
components/report/SupplierContact.tsx
components/report/TrendSignalDashboard.tsx
components/ui/Badge.tsx
components/ui/Button.tsx
components/ui/Card.tsx
components/ui/Input.tsx
components/ui/KeywordPill.tsx
components/ui/LockedValue.tsx
components/ui/PaywallOverlay.tsx

## 3. FULL LandingTimeWidget.tsx contents

```
// Server Component — "use client" 없음
// red-400/60: IRON RULE 예외 — 수동 리서치 bar 전용 허용

import { PRICING } from "@/src/config/pricing";

const LEFT_ROWS = [
  { label: "Find trending product", hrs: 8 },
  { label: "Verify market demand", hrs: 6 },
  { label: "Find Korean supplier", hrs: 12 },
  { label: "Translate + negotiate", hrs: 9 },
  { label: "HS Code + logistics †", hrs: 7 },
  { label: "Video + creative assets", hrs: 16 },
];
const TOTAL = LEFT_ROWS.reduce((s, r) => s + r.hrs, 0); // 58

export default function LandingTimeWidget() {
  return (
    <section className="bg-[#F8F7F4] py-24 px-6">
      <div className="max-w-6xl mx-auto">

        <p className="text-[10px] font-black uppercase tracking-[0.35em]
          text-[#9E9C98] text-center mb-4">
          Time vs. Money
        </p>
        <h2
          className="font-black text-center text-[#1A1916] mb-16"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            textWrap: "balance",
          } as React.CSSProperties}
        >
          Time is your only
          <br />non-renewable resource.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT — Manual (red-400/60 IRON RULE 예외 적용) */}
          <div className="bg-white border border-[#E8E6E1] rounded-2xl p-8
            shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
            <p className="text-sm md:text-base font-bold uppercase tracking-widest
              text-[#9E9C98] mb-6 whitespace-nowrap">❌ Manual Research</p>
            <div className="space-y-4">
              {LEFT_ROWS.map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-[#6B6860]">{row.label}</span>
                    <span className="text-base font-bold text-[#1A1916]">{row.hrs} hrs</span>
                  </div>
                  <div className="h-1.5 bg-[#F8F7F4] rounded-full overflow-hidden">
                    {/* red-400/60: IRON RULE 예외 허용 구역 */}
                    <div
                      className="h-full rounded-full bg-red-400/60"
                      style={{ width: `${(row.hrs / 16) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E8E6E1] mt-6 pt-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-black text-[#1A1916]">Total / month</span>
                <span className="text-sm font-black text-[#1A1916]">{TOTAL} hours</span>
              </div>
              {[40, 60, 80].map((rate) => (
                <div key={rate} className="flex justify-between">
                  <span className="text-xs text-[#9E9C98]">@ ${rate}/hr</span>
                  <span className="text-xs font-bold text-[#6B6860]">
                    ${(TOTAL * rate).toLocaleString()}/mo
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — KoreaScout Alpha */}
          <div className="bg-[#F8F7F4] border border-[#E8E6E1] border-l-4
            border-l-[#16A34A] rounded-2xl p-8
            shadow-[0_4px_20px_0_rgb(22_163_74/0.08)]">
            <p className="text-sm md:text-base font-bold uppercase tracking-widest
              text-[#16A34A] mb-6 whitespace-nowrap">✓ KoreaScout Alpha</p>
            <div className="space-y-4">
              {LEFT_ROWS.map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-[#6B6860]">{row.label}</span>
                    <span className="text-sm font-bold text-[#16A34A]">✓ included</span>
                  </div>
                  <div className="h-1.5 bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#16A34A]"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E8E6E1] mt-6 pt-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-black text-[#1A1916]">Total / month</span>
                <span className="text-sm font-black text-[#16A34A]">&lt; 60 seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#9E9C98]">Cost</span>
                <span className="text-xs font-black text-[#1A1916]">{PRICING.CURRENCY}{PRICING.ALPHA.monthly}/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#9E9C98]">Your ROI</span>
                <span className="text-xs font-black text-[#16A34A]">17× – 35×</span>
              </div>
            </div>
          </div>
        </div>

        <p
          className="text-center mt-10 font-black text-[#1A1916] tracking-tighter"
          style={{ fontSize: "clamp(1.25rem,3vw,2rem)" }}
        >
          58 hours vs. 60 seconds.
          <span style={{ color: "#16A34A" }}> The math is already done.</span>
        </p>

        {/* Disclaimer */}
        <div className="mt-8 border border-[#E8E6E1] rounded-xl px-6 py-4 bg-white
          max-w-3xl mx-auto">
          <p className="text-xs font-medium text-[#9E9C98] leading-relaxed text-center">
            † HS Code classifications, MOQ figures, and compliance data provided by
            KoreaScout are pre-verified intelligence estimates designed to give your
            customs broker a 90% head start — not a legal guarantee.
            Always confirm with your licensed broker.
          </p>
        </div>
      </div>
    </section>
  );
}
```

## 4. FRAMER MOTION usage patterns in landing components

components/LandingPipelineSneakPeek.tsx:29:          <motion.div
components/LandingPipelineSneakPeek.tsx:31:            animate={{ y: [-8, 8, -8] }}
components/LandingPipelineSneakPeek.tsx:32:            transition={{
components/LandingPipelineSneakPeek.tsx:111:          </motion.div>

## 5. ALL "use client" components in /components

components/admin/AiPageLinksHelper.tsx:1:"use client";
components/admin/GlobalPricesHelper.tsx:1:"use client";
components/admin/HazmatCheckboxes.tsx:1:"use client";
components/AlphaVaultPreview.tsx:1:// Server Component — "use client" 없음. Hover: CSS group-hover only
components/BrokerEmailDraft.tsx:1:"use client";
components/CheckoutButton.tsx:1:"use client";
components/ContactCard.tsx:1:"use client";
components/CopyButton.tsx:1:"use client";
components/DonutGauge.tsx:1:"use client";
components/DynamiteFuseSection.tsx:1:"use client";
components/ExpandableText.tsx:1:"use client";
components/FaqAccordion.tsx:1:"use client";
components/FavoriteButton.tsx:1:"use client";
components/GoogleSignInButton.tsx:1:"use client";
components/GrandEntrance.tsx:1:"use client";
components/GroupBBrokerSection.tsx:1:"use client";
components/Hero.tsx:1:"use client";
components/HeroCTA.tsx:1:"use client";
components/IntelligenceTicker.tsx:1:// Server Component — "use client" 없음
components/LandingPipelineSneakPeek.tsx:1:"use client";
components/LandingTimeWidget.tsx:1:// Server Component — "use client" 없음
components/LaunchKit.tsx:1:"use client";
components/layout/HeaderNavClient.tsx:1:"use client";
components/layout/HeaderShellClient.tsx:1:"use client";
components/LockedSection.tsx:1:"use client";
components/LogoutButton.tsx:1:"use client";
components/ManageBillingButton.tsx:1:"use client";
components/ProductIdentity.tsx:1:"use client";
components/RemoveFavoriteButton.tsx:1:"use client";
components/report/MarketIntelligence.tsx:1:"use client";
components/report/SocialProofTrendIntelligence.tsx:1:"use client";
components/report/SourcingIntel.tsx:1:"use client";
components/report/SupplierContact.tsx:1:"use client";
components/report/TrendSignalDashboard.tsx:1:"use client";
components/ScrollToIdButton.tsx:1:"use client";
components/SplashScreen.tsx:1:"use client";
components/StatusBadge.tsx:1:"use client";
components/ui/LockedValue.tsx:1:"use client";
components/ViralHashtagPills.tsx:1:"use client";
components/ZombieWatermark.tsx:1:"use client";

## 6. useState / useEffect patterns in components

components/admin/AiPageLinksHelper.tsx:3:import { useState, useEffect } from "react";
components/admin/AiPageLinksHelper.tsx:29:  const [links, setLinks] = useState<string[]>(() => parseValue(value));
components/admin/AiPageLinksHelper.tsx:31:  useEffect(() => {
components/admin/GlobalPricesHelper.tsx:3:import { useState, useEffect, useCallback } from "react";
components/admin/GlobalPricesHelper.tsx:200:  const [data, setData] = useState<GlobalPricesLike>(() => parseValue(value));
components/admin/GlobalPricesHelper.tsx:201:  const [rawOpen, setRawOpen] = useState(false);
components/admin/GlobalPricesHelper.tsx:202:  const [openRegions, setOpenRegions] = useState<Record<string, boolean>>(() =>
components/admin/GlobalPricesHelper.tsx:205:  const [pendingDelete, setPendingDelete] = useState<{ regionKey: string; index: number } | null>(null);
components/admin/GlobalPricesHelper.tsx:207:  useEffect(() => {
components/admin/HazmatCheckboxes.tsx:3:import { useState, useEffect } from "react";
components/admin/HazmatCheckboxes.tsx:41:  const [state, setState] = useState<HazmatState>(() => parseValue(value));
components/admin/HazmatCheckboxes.tsx:43:  useEffect(() => {
components/BrokerEmailDraft.tsx:3:import { useState } from "react";
components/BrokerEmailDraft.tsx:17:  const [open, setOpen] = useState(false);
components/BrokerEmailDraft.tsx:18:  const [destination, setDestination] = useState("");
components/BrokerEmailDraft.tsx:19:  const [copied, setCopied] = useState(false);
components/ContactCard.tsx:3:import { useState, useCallback } from "react";
components/ContactCard.tsx:16:  const [copied, setCopied] = useState(false);
components/CopyButton.tsx:3:import { useState } from "react";
components/CopyButton.tsx:11:  const [copied, setCopied] = useState(false);
components/ExpandableText.tsx:3:import { useState, useRef, useEffect } from "react";
components/ExpandableText.tsx:6:  const [expanded, setExpanded] = useState(false);
components/ExpandableText.tsx:7:  const [needsClamp, setNeedsClamp] = useState(false);
components/ExpandableText.tsx:8:  const ref = useRef<HTMLDivElement>(null);
components/ExpandableText.tsx:13:  useEffect(() => {
components/FaqAccordion.tsx:3:import { useState } from "react";
components/FaqAccordion.tsx:119:  const [activeCategoryLabel, setActiveCategoryLabel] = useState<string>(INITIAL_CATEGORY_LABEL);
components/FaqAccordion.tsx:120:  const [openIndex, setOpenIndex] = useState<number | null>(null);
components/FavoriteButton.tsx:4:import { useState } from "react";
components/FavoriteButton.tsx:18:  const [isFavorited, setIsFavorited] = useState(initial);
components/FavoriteButton.tsx:19:  const [pending, setPending] = useState(false);
components/GrandEntrance.tsx:3:import { useEffect, useState } from "react";
components/GrandEntrance.tsx:8:  const [stage, setStage] = useState<Stage>("clearance");
components/GrandEntrance.tsx:9:  const [opacity, setOpacity] = useState(0);
components/GrandEntrance.tsx:11:  useEffect(() => {
components/GroupBBrokerSection.tsx:3:import { useState } from "react";
components/GroupBBrokerSection.tsx:21:  const [isEmailOpen, setIsEmailOpen] = useState(false);
components/GroupBBrokerSection.tsx:22:  const [isCopied, setIsCopied] = useState(false);
components/Hero.tsx:3:import { useRef, useEffect } from "react";
components/Hero.tsx:7:  const videoRef = useRef<HTMLVideoElement>(null);
components/Hero.tsx:9:  useEffect(() => {
components/HeroCTA.tsx:2:import { useState } from "react";
components/HeroCTA.tsx:9:  const [loading, setLoading] = useState(false);
components/LaunchKit.tsx:3:import { useState } from "react";
components/LaunchKit.tsx:14:  const [hoveredId, setHoveredId] = useState<string | null>(null);
components/layout/ClientLeftNav.tsx:3:import { useEffect, useState } from 'react'
components/layout/ClientLeftNav.tsx:26:  const [activeId, setActiveId] = useState<string | null>(null)
components/layout/ClientLeftNav.tsx:28:  useEffect(() => {
components/ManageBillingButton.tsx:3:import { useState, useEffect } from "react";
components/ManageBillingButton.tsx:15:  const [open, setOpen] = useState(false);
components/ManageBillingButton.tsx:16:  const [isAgreed, setIsAgreed] = useState(false);
components/ManageBillingButton.tsx:18:  useEffect(() => {
components/ProductIdentity.tsx:3:import { useState, useEffect } from "react";
components/ProductIdentity.tsx:40:  const [exchangeRate, setExchangeRate] = useState<number>(FALLBACK_RATE);
components/ProductIdentity.tsx:41:  const [rateDate, setRateDate] = useState<string>(formatDate(new Date()));
components/ProductIdentity.tsx:42:  const [rateLoading, setRateLoading] = useState(true);
components/ProductIdentity.tsx:44:  useEffect(() => {
components/RemoveFavoriteButton.tsx:4:import { useState } from "react";
components/RemoveFavoriteButton.tsx:16:  const [pending, setPending] = useState(false);
components/report/MarketIntelligence.tsx:3:import { useState } from "react";
components/report/MarketIntelligence.tsx:23:  const [open, setOpen] = useState(false);
components/report/SupplierContact.tsx:3:import { useState } from "react";
components/report/SupplierContact.tsx:469:  const [openRegion, setOpenRegion] = useState<string | null>(null);
components/SplashScreen.tsx:3:import { useEffect, useState } from "react";
components/SplashScreen.tsx:12:  const [stage, setStage] = useState<Stage>("clearance");
components/SplashScreen.tsx:13:  const [opacity, setOpacity] = useState(0);
components/SplashScreen.tsx:15:  useEffect(() => {
components/ViralHashtagPills.tsx:3:import { useState, useCallback } from "react";
components/ViralHashtagPills.tsx:10:  const [copied, setCopied] = useState<string | null>(null);
components/ZombieWatermark.tsx:2:import { useEffect, useRef } from "react";
components/ZombieWatermark.tsx:5:  const containerRef = useRef<HTMLDivElement>(null);
components/ZombieWatermark.tsx:9:  useEffect(() => {

## 7. Tailwind responsive classes used in landing components (mobile breakpoints)

components/LandingPipelineSneakPeek.tsx:10:      className="w-full bg-cream-50 py-20 md:py-24 px-4 md:px-6 overflow-hidden"
components/LandingPipelineSneakPeek.tsx:13:      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-20 items-center">
components/LandingPipelineSneakPeek.tsx:15:        <div className="w-full md:w-1/2 flex flex-col justify-center md:items-start">
components/LandingPipelineSneakPeek.tsx:28:        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
components/LandingPipelineSneakPeek.tsx:30:            className="w-full max-w-[480px] rounded-2xl bg-white border border-cream-300 shadow-xl p-6 md:p-8 pb-5"
components/LandingPipelineSneakPeek.tsx:71:                <p className="font-mono text-lg md:text-xl font-bold text-ink-900">
components/LandingTimeWidget.tsx:39:        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
components/LandingTimeWidget.tsx:44:            <p className="text-sm md:text-base font-bold uppercase tracking-widest
components/LandingTimeWidget.tsx:83:            <p className="text-sm md:text-base font-bold uppercase tracking-widest

## 8. Current TimeWidget section — surrounding sections in page.tsx (lines 100–130)

                  loop
                  playsInline
                  className="w-full rounded-2xl"
                  src="/videos/soldout.mp4"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══ S4: TIME WIDGET ═══════════════════════════ */}
        <LandingTimeWidget />

        {/* ══ S5: INTELLIGENCE ENGINE (섹션4 최종.png — 100% clone) ════════════════════════════ */}
        <section className="bg-[#0A0908] py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <h2
              className="font-black text-center text-white mb-3"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                textWrap: "balance",
              } as React.CSSProperties}
            >
              Not a trend list.
              <br />
              A 6-layer intelligence brief —
            </h2>
            <p className="text-center text-white/60 font-medium mb-16 leading-relaxed max-w-2xl mx-auto" style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)" }}>

## 9. Check if framer-motion is installed

    "framer-motion": "^12.35.0",

## 10. Any existing toggle/tab components anywhere in project

./app/account/page.tsx
./app/admin/page.tsx
./app/admin/[id]/page.tsx
./app/weekly/[weekId]/page.tsx
./app/weekly/[weekId]/[id]/page.tsx
./components/admin/HazmatCheckboxes.tsx
./components/BrokerEmailDraft.tsx
./components/DonutGauge.tsx
./components/FaqAccordion.tsx
./components/FavoriteButton.tsx
./components/GlobalPricingTable.tsx
./components/GroupBBrokerSection.tsx
./components/PriceComparisonBar.tsx
./components/ProductIdentity.tsx
./components/RemoveFavoriteButton.tsx
./components/report/MarketIntelligence.tsx
./components/report/SocialProofTrendIntelligence.tsx
./components/report/SourcingIntel.tsx
./components/report/SupplierContact.tsx
./components/report/TrendSignalDashboard.tsx

---
AUDIT COMPLETE
