# LandingTimeWidget — row 레이아웃 / className 스캔

**스캔 전용 — 코드 미수정**

**환경:** Windows PowerShell에서 `grep`/`cat` 미제공. 아래 **§1**은 동일 패턴으로 수행한 ripgrep 결과(라인 번호·본문 UTF-8 보존), **§2**는 `components/LandingTimeWidget.tsx` 전체 내용입니다.

---

## 1. `grep -n "flex\|justify\|items\|row-top\|row-label\|row-val\|whitespace\|truncate\|min-w\|shrink" components/LandingTimeWidget.tsx`

```
64:        <div className="flex justify-center mb-12">
66:            className="flex rounded-full p-1"
73:                className="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap"
99:              text-[#9E9C98] mb-6 whitespace-nowrap">❌ Manual Research</p>
103:                  <div className="flex justify-between mb-1">
118:              <div className="flex justify-between">
123:                <div key={rate} className="flex justify-between">
138:              text-[#16A34A] mb-6 whitespace-nowrap">{`✓ ${rightLabel}`}</p>
142:                  <div className="flex justify-between mb-1">
156:              <div className="flex justify-between">
160:              <div className="flex justify-between">
165:                <div className="flex justify-between">
```

**요약:** `items-`, `row-top`, `row-label`, `row-val`, `truncate`, `min-w`, `shrink` 매치 없음. `flex`, `justify-*`, `whitespace-nowrap`만 존재.

---

## 2. `cat components/LandingTimeWidget.tsx`

```
"use client";
// red-400/60: IRON RULE 예외 — 수동 리서치 bar 전용 허용

import { useState } from "react";
import { PRICING } from "@/src/config/pricing";

const CREATOR_ROWS = [
  { label: "Scroll KR TikTok / IG / YT for trending products", hrs: 8 },
  { label: "Track Korean social buzz & reviews manually", hrs: 8 },
  { label: "Research viral hooks & content angles", hrs: 6 },
  { label: "SEO & keyword research", hrs: 6 },
];
const CREATOR_TOTAL = CREATOR_ROWS.reduce((s, r) => s + r.hrs, 0); // 28

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
  type Mode = "creator" | "seller";
  const [mode, setMode] = useState<Mode>("creator");

  const isCreator = mode === "creator";
  const rows = isCreator ? CREATOR_ROWS : LEFT_ROWS;
  const total = isCreator ? CREATOR_TOTAL : TOTAL;
  const rightLabel = isCreator ? "KoreaScout Standard" : "KoreaScout Alpha";
  const rightPrice = isCreator
    ? `${PRICING.CURRENCY}${PRICING.STANDARD.monthly}/month`
    : `${PRICING.CURRENCY}${PRICING.ALPHA.monthly}/month`;
  const bottomHrs = isCreator ? "28 hours" : "58 hours";
  const bottomTagline = isCreator
    ? " Stop searching, start filming."
    : " The math is already done.";

  return (
    <section className="bg-[#F8F7F4] py-24 px-6">
      <div className="max-w-6xl mx-auto">

        <p className="text-[10px] font-black uppercase tracking-[0.35em]
          text-[#9E9C98] text-center mb-4">
          Time vs. Money
        </p>
        <h2
          className="font-black text-center text-[#1A1916] mb-8"
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

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div
            className="flex rounded-full p-1"
            style={{ background: "#E8E6E1" }}
          >
            {(["creator", "seller"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap"
                style={
                  mode === m
                    ? {
                        background: "#0A0908",
                        color: "#F8F7F4",
                        boxShadow: "0 2px 8px 0 rgb(10 9 8 / 0.18)",
                      }
                    : {
                        background: "transparent",
                        color: "#9E9C98",
                      }
                }
              >
                {m === "creator" ? "🎬 I'm a Creator" : "🏪 I'm a Global Seller"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT — Manual (red-400/60 IRON RULE 예외 적용) */}
          <div className="bg-white border border-[#E8E6E1] rounded-2xl p-8
            shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
            <p className="text-sm md:text-base font-bold uppercase tracking-widest
              text-[#9E9C98] mb-6 whitespace-nowrap">❌ Manual Research</p>
            <div className="space-y-4">
              {rows.map((row) => (
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
                <span className="text-sm font-black text-[#1A1916]">{total} hours</span>
              </div>
              {[40, 60, 80].map((rate) => (
                <div key={rate} className="flex justify-between">
                  <span className="text-xs text-[#9E9C98]">@ ${rate}/hr</span>
                  <span className="text-xs font-bold text-[#6B6860]">
                    ${(total * rate).toLocaleString()}/mo
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
              text-[#16A34A] mb-6 whitespace-nowrap">{`✓ ${rightLabel}`}</p>
            <div className="space-y-4">
              {rows.map((row) => (
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
                <span className="text-xs font-black text-[#1A1916]">{rightPrice}</span>
              </div>
              {!isCreator && (
                <div className="flex justify-between">
                  <span className="text-xs text-[#9E9C98]">Your ROI</span>
                  <span className="text-xs font-black text-[#16A34A]">17× – 35×</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <p
          className="text-center mt-10 font-black text-[#1A1916] tracking-tighter"
          style={{ fontSize: "clamp(1.25rem,3vw,2rem)" }}
        >
          {bottomHrs} vs. 60 seconds.
          <span style={{ color: "#16A34A" }}>{bottomTagline}</span>
        </p>

        {/* Disclaimer */}
        {!isCreator && (
          <div className="mt-8 border border-[#E8E6E1] rounded-xl px-6 py-4 bg-white
            max-w-3xl mx-auto">
            <p className="text-xs font-medium text-[#9E9C98] leading-relaxed text-center">
              † HS Code classifications, MOQ figures, and compliance data provided by
              KoreaScout are pre-verified intelligence estimates designed to give your
              customs broker a 90% head start — not a legal guarantee.
              Always confirm with your licensed broker.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
```

---

**AUDIT COMPLETE**
