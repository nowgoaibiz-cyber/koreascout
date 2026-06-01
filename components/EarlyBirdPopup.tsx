"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "eb_seen_v1";

const EARLYBIRD = {
  slots: 20,
  price: 59,
  originalPrice: 149,
  deadline: "July 6th, 9AM KST",
} as const;

export default function EarlyBirdPopup() {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("/api/alpha-count")
      .then((res) => (res.ok ? res.json() : { count: 0 }))
      .then((data: { count?: number }) => {
        setCount(typeof data.count === "number" ? data.count : 0);
      })
      .catch(() => setCount(0));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = window.setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => setAnimateIn(true));
    }, 3000);

    return () => window.clearTimeout(timer);
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setAnimateIn(false);
    window.setTimeout(() => setVisible(false), 300);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        animateIn ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="early-bird-popup-title"
    >
      <div
        className={`relative max-w-sm w-full mx-4 bg-[#1A1916] rounded-2xl p-8 shadow-[0_20px_60px_0_rgb(0_0_0/0.5)] transition-all duration-300 ${
          animateIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#9E9C98] hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="inline-flex items-center gap-1.5 bg-[#16A34A]/20 text-[#16A34A] text-xs font-bold px-3 py-1 rounded-full mb-4">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#16A34A]" />
          </span>
          EARLY BIRD — 1ST ROUND
        </div>

        <h2
          id="early-bird-popup-title"
          className="text-2xl font-black text-white leading-tight mb-2"
        >
          Lock in 60% OFF.
          <br />
          <span className="text-[#16A34A]">Forever.</span>
        </h2>

        <div className="mb-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-black text-[#9E9C98] line-through">$149</span>
            <span className="text-xs font-black bg-[#16A34A]/20 text-[#16A34A] px-2 py-0.5 rounded-md">
              -60% OFF
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white leading-none">$59</span>
            <span className="text-base text-[#9E9C98]">/ month</span>
          </div>
        </div>
        <p className="text-xs text-[#16A34A] font-bold mb-4">
          Price locked forever · Never increases
        </p>

        <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 mb-6">
          <span className="text-sm text-[#9E9C98]">Spots remaining</span>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
            </span>
            <span className="text-sm font-black text-white">
              {count} / {EARLYBIRD.slots} joined
            </span>
          </div>
        </div>

        <p className="text-xs text-[#9E9C98] text-center mb-6">
          Offer expires {EARLYBIRD.deadline}
        </p>

        <a
          href="/#pricing-cards"
          onClick={handleClose}
          className="block w-full text-center py-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-black text-base transition-all mb-3"
        >
          See Early Bird Offer →
        </a>

        <button
          type="button"
          onClick={handleClose}
          className="block w-full text-center text-xs text-[#6B6860] hover:text-[#9E9C98] transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}
