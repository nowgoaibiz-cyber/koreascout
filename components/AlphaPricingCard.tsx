"use client";

import { useEffect, useState } from "react";
import CheckoutButton from "@/components/CheckoutButton";
import { PRICING } from "@/src/config/pricing";

const ALPHA_CHECKOUT_URL =
  "https://getkoreascout.lemonsqueezy.com/checkout/buy/60ceb399-f681-4d65-a067-e250cf7d7e0d";

const EARLYBIRD = {
  code: "EARLYBIRD",
  discountPct: 60,
  maxSlots: 20,
  earlyPrice: 59,
  deadline: new Date("2026-07-06T00:00:00Z"),
  betaEndDate: "July 6th",
} as const;

interface AlphaPricingCardProps {
  showEarlyBird?: boolean;
  alphaCount?: number;
}

export default function AlphaPricingCard({
  showEarlyBird = true,
  alphaCount: alphaCountProp,
}: AlphaPricingCardProps) {
  const [alphaCount, setAlphaCount] = useState(alphaCountProp ?? 0);

  useEffect(() => {
    if (alphaCountProp !== undefined) {
      setAlphaCount(alphaCountProp);
      return;
    }
    let cancelled = false;
    fetch("/api/alpha-count")
      .then((res) => (res.ok ? res.json() : { count: 0 }))
      .then((data: { count?: number }) => {
        if (!cancelled) setAlphaCount(typeof data.count === "number" ? data.count : 0);
      })
      .catch(() => {
        if (!cancelled) setAlphaCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, [alphaCountProp]);

  const isEarlyBirdActive =
    showEarlyBird && new Date() < EARLYBIRD.deadline;

  const ctaClassName =
    "block w-full text-center py-4 rounded-xl border-2 border-[#16A34A] bg-[#16A34A] text-lg font-semibold text-white hover:bg-[#15803D] hover:border-[#15803D] transition-all";

  const checkoutUrl = isEarlyBirdActive
    ? `${ALPHA_CHECKOUT_URL}?checkout[discount_code]=${EARLYBIRD.code}`
    : ALPHA_CHECKOUT_URL;

  return (
    <div className="bg-white border-2 border-[#16A34A] rounded-2xl flex flex-col h-full p-8 md:p-12 shadow-[0_4px_24px_0_rgb(22_163_74/0.18)]">
      <div className="min-h-[100px]">
        {isEarlyBirdActive && (
          <span className="inline-block mb-4 bg-[#DCFCE7] text-[#16A34A] text-xs font-bold px-3 py-1 rounded-full">
            🔥 EARLY BIRD — 1ST ROUND · {EARLYBIRD.discountPct}% OFF
          </span>
        )}
        <p className="text-3xl md:text-4xl font-black text-[#1A1916] tracking-tighter leading-none mb-8">
          Alpha
        </p>

        {isEarlyBirdActive ? (
          <>
            <div className="mb-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl font-black text-[#9E9C98] line-through">$149</span>
                <span className="text-xs font-black bg-[#FEE2E2] text-[#DC2626] px-2 py-1 rounded-md">
                  -{EARLYBIRD.discountPct}% OFF
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                  ${EARLYBIRD.earlyPrice}
                </span>
                <span className="text-base text-[#9E9C98] font-medium">/ month</span>
              </div>
              <p className="text-xs font-bold text-[#16A34A] mt-1">Locked forever at this price</p>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-[#6B6860]">Closes July 6th, 9AM KST</span>
              <div className="flex items-center gap-1 bg-[#DCFCE7] text-[#16A34A] px-2 py-0.5 rounded-full">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#16A34A]"></span>
                </span>
                <span className="text-xs font-black">
                  {alphaCount} / {EARLYBIRD.maxSlots}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-1">
              <span className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                {PRICING.CURRENCY}{PRICING.ALPHA.monthly}
              </span>
              <span className="text-base text-[#9E9C98] font-medium ml-2">/ month</span>
            </div>
            <p className="text-xs font-bold text-[#9E9C98] mb-1">
              Approx. {PRICING.CURRENCY}{PRICING.ALPHA.daily.toFixed(2)} / day
            </p>
          </>
        )}
      </div>

      <div className="w-8 h-px bg-[#E8E6E1] my-5" />

      <div className="bg-[#F8F7F4] border border-[#E8E6E1] rounded-xl px-4 py-3 min-h-[120px] flex items-center">
        <p className="text-sm text-[#1A1916] leading-relaxed">
          <span className="font-black uppercase">INSTANT ACCESS:</span>{" "}
          <span className="font-medium">
            30+ Verified Products (Last 3 weeks) unlocked immediately.
          </span>
        </p>
      </div>

      {isEarlyBirdActive && (
        <div className="bg-[#FEF3C7] border border-[#D97706] rounded-xl px-4 py-3 mt-3">
          <p className="text-xs text-[#92400E] leading-relaxed">
            <span className="font-black">BETA PERIOD:</span> Reports publish from{" "}
            {EARLYBIRD.betaEndDate}. Join now to lock your early price and get instant
            access on launch day.
          </p>
        </div>
      )}

      {!isEarlyBirdActive && (
        <div className="flex-grow my-8">
          <p className="text-base font-medium text-[#6B6860] leading-relaxed">
            Discover 10+ winning Korean products every week.{" "}
            {PRICING.CURRENCY}
            {PRICING.ALPHA.daily.toFixed(2)}/day — less than coffee, worth more than 40
            hours of market research.
          </p>
        </div>
      )}

      {isEarlyBirdActive && <div className="flex-grow my-8" />}

      <div className="mt-auto">
        <CheckoutButton checkoutUrl={checkoutUrl} className={ctaClassName}>
          {isEarlyBirdActive
            ? `Join Alpha — ${PRICING.CURRENCY}${EARLYBIRD.earlyPrice}/mo →`
            : `Join Alpha — ${PRICING.CURRENCY}${PRICING.ALPHA.monthly}/mo`}
        </CheckoutButton>
        {isEarlyBirdActive ? (
          <p className="text-xs text-[#9E9C98] text-center mt-3">
            Discount applied automatically · Price locked forever
          </p>
        ) : (
          <p className="text-xs text-[#9E9C98] text-center mt-3">
            10+ products/week · Instant access
          </p>
        )}
      </div>
    </div>
  );
}
