# DESIGN SECTION AUDIT

## 1) `components/DynamiteFuseSection.tsx` 전체 코드

```tsx
"use client";

import { motion } from "framer-motion";

const TOTAL_DURATION = 9;
// 2단 일시정지: 0→25%(2s), [PAUSE 25% 1s], 25→80%(2.5s), [PAUSE 80% 2s], 80→100%(1.5s)
const WIDTH_KEYFRAMES = ["0%", "25%", "25%", "80%", "80%", "100%"];
const TIMES = [0, 0.222, 0.333, 0.611, 0.833, 1];

// 용접 불꽃: 중심에서 사방으로 튀는 미세 입자 (거리 px, 각도 없이 x/y로 표현)
const WELDING_PARTICLES = [
  { burstX: 4, burstY: -3 },
  { burstX: -3, burstY: -4 },
  { burstX: 2, burstY: 3 },
  { burstX: -4, burstY: 1 },
  { burstX: 3, burstY: 4 },
  { burstX: -2, burstY: -2 },
  { burstX: 5, burstY: 0 },
  { burstX: -3, burstY: 3 },
  { burstX: 1, burstY: -4 },
  { burstX: -4, burstY: -2 },
  { burstX: 3, burstY: -3 },
  { burstX: -2, burstY: 4 },
  { burstX: 4, burstY: 2 },
  { burstX: -1, burstY: -3 },
];

const TRAVEL_VARIANTS = {
  travel: {
    x: WIDTH_KEYFRAMES,
    transition: {
      duration: TOTAL_DURATION,
      times: TIMES,
      ease: "linear" as const,
    },
  },
  extinguish: {
    opacity: 0,
    transition: { delay: TOTAL_DURATION, duration: 0.25 },
  },
};

// 25%·80% 일시정지 구간: 스파클러 강도 상승 (그 자리에서 타오르는 연출)
const PAUSE_INTENSITY_VARIANT = {
  scale: [1, 1, 1.14, 1.14, 1.14, 1],
  filter: [
    "brightness(1)",
    "brightness(1)",
    "brightness(1.35)",
    "brightness(1.35)",
    "brightness(1.35)",
    "brightness(1)",
  ],
  transition: { duration: TOTAL_DURATION, times: TIMES },
};

export default function DynamiteFuseSection() {
  return (
    <section className="bg-[#0A0908] pt-24 md:pt-32 pb-20 md:pb-28 px-6 overflow-x-clip">
      <div className="max-w-5xl mx-auto flex flex-col items-center w-full overflow-x-clip">
        <motion.div
          className="w-full max-w-4xl mx-auto flex flex-col items-center overflow-x-clip px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, visible: {} }}
        >
          <div className="relative w-full overflow-x-clip min-w-0" style={{ height: "72px" }}>
            {/* 기본 라인 — 1px white/10 */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px rounded-full bg-white/10" />

            {/* 활성화 선: 9초 0%→25%→[PAUSE 1s]→80%→[PAUSE 2s]→100% (불꽃 이동과 동일) */}
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-px rounded-full origin-left pointer-events-none bg-white"
              initial={{ width: "0%" }}
              whileInView="burn"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                burn: {
                  width: WIDTH_KEYFRAMES,
                  transition: {
                    duration: TOTAL_DURATION,
                    times: TIMES,
                    ease: "linear" as const,
                  },
                },
              }}
            />

            {/* Left marker — Market Saturation Margin, 25% (1초 일시정지) */}
            <div
              className="absolute flex flex-col items-center pointer-events-none"
              style={{ left: "25%", bottom: "50%", transform: "translate(-50%, 0)" }}
            >
              <motion.span
                className="text-[9px] md:text-[14px] font-light tracking-tighter text-white/40 uppercase mb-1 whitespace-nowrap"
                initial={{ opacity: 0 }}
                whileInView="revealLeft"
                viewport={{ once: true, amount: 0.3 }}
                variants={{
                  revealLeft: {
                    opacity: 1,
                    transition: { delay: 2, duration: 0.35 },
                  },
                }}
              >
                Market Saturation Margin
              </motion.span>
              <div className="w-px bg-white/30" style={{ height: "8px" }} />
            </div>

            {/* Right marker — KoreaScout Edge Potential, 80% (2초 일시정지) */}
            <div
              className="absolute flex flex-col items-center pointer-events-none"
              style={{ left: "80%", bottom: "50%", transform: "translate(-50%, 0)" }}
            >
              <motion.span
                className="text-[9px] md:text-[14px] font-light tracking-tighter text-white/40 uppercase mb-1 whitespace-nowrap"
                style={{
                  textShadow: "0 0 8px rgba(255,255,255,0.2), 0 0 16px rgba(255,255,255,0.08)",
                }}
                initial={{ opacity: 0 }}
                whileInView="revealRight"
                viewport={{ once: true, amount: 0.3 }}
                variants={{
                  revealRight: {
                    opacity: 1,
                    transition: { delay: 5.5, duration: 0.35 },
                  },
                }}
              >
                KoreaScout Edge Potential
              </motion.span>
              <div className="w-px bg-white/40" style={{ height: "8px" }} />
            </div>

            {/* ══ Welding Sparkler: 0→25%(2s)→[PAUSE 1s]→80%(2.5s)→[PAUSE 2s]→100%(1.5s) (정지 시 파티클은 그 자리에서 계속 타오름) ══ */}
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-full"
              style={{ height: 0 }}
              initial={{ x: "0%" }}
              whileInView={["travel", "extinguish"]}
              viewport={{ once: true, amount: 0.3 }}
              variants={TRAVEL_VARIANTS}
            >
              {/* 25%·80% 정지 구간에 스파클 강도 상승 (폭발 직전 에너지) */}
              <motion.div
                className="absolute top-0 left-0 -translate-x-1/2 origin-center"
                style={{ width: "2px", height: "2px" }}
                initial={{ scale: 1, filter: "brightness(1)" }}
                whileInView="pauseIntensity"
                viewport={{ once: true, amount: 0.3 }}
                variants={{ pauseIntensity: PAUSE_INTENSITY_VARIANT }}
              >
                {WELDING_PARTICLES.map((p, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                      left: 0,
                      top: 0,
                      width: "2px",
                      height: "2px",
                      boxShadow:
                        "0 0 4px 1px rgba(255,255,255,0.95), 0 0 8px 2px rgba(255,255,255,0.5), 0 0 12px 2px rgba(255,255,255,0.25)",
                    }}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                    animate={{
                      x: [0, p.burstX, p.burstX],
                      y: [0, p.burstY, p.burstY],
                      opacity: [0, 1, 0.15, 1, 0],
                      scale: [0, 1.4, 0.6, 1.2, 0],
                    }}
                    transition={{
                      duration: 0.12 + (i % 5) * 0.02,
                      repeat: Infinity,
                      repeatDelay: 0.02 + (i % 3) * 0.015,
                      times: [0, 0.15, 0.5, 0.75, 1],
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <div className="text-center mt-4 md:mt-5">
          <h2
            className="font-bold text-white text-4xl md:text-6xl mb-2"
            style={{ letterSpacing: "-0.04em", lineHeight: 1.05, textWrap: "balance" }}
          >
            You aren&apos;t late to the trend.
          </h2>
          <h2
            className="font-bold text-4xl md:text-6xl mb-6"
            style={{ color: "#16A34A", letterSpacing: "-0.04em", lineHeight: 1.05, textWrap: "balance" }}
          >
            You&apos;re late to the profit.
          </h2>
          <p className="text-white/60 mt-6 max-w-2xl mx-auto leading-relaxed">
            By the time a product trends on social media, the margin is already gone.
          </p>
        </div>
      </div>
    </section>
  );
}
```

## 2) `app/page.tsx` S5 Intelligence Engine 섹션 전체 JSX (L83~L248)

```tsx
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
              Battle-tested in Korea. What takes you 58 hours, takes our engine 4 minutes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-[0.45fr_0.55fr] gap-12 items-stretch">
              {/* Left: 6-layer list — fill height, justify-between so 01/06 align with card top/bottom */}
              <div className="flex flex-col justify-between min-h-0 h-full">
                {[
                  {
                    n: "01",
                    t: "Gap Index",
                    d: "KR Local Score vs. Global Trend Score — calculated as a single integer gap. Gap 54 means the world hasn't caught up yet. That's your window.",
                    s: "6 HRS",
                  },
                  {
                    n: "02",
                    t: "Margin Intelligence",
                    d: "Verified cost vs. global retail price → profit multiplier. You see the real upside before you commit a single dollar.",
                    s: "4 HRS",
                  },
                  {
                    n: "03",
                    t: "Trend Signals",
                    d: "TikTok, Instagram velocity scores + new content volume growth signal. You see what's accelerating before it reaches your feed.",
                    s: "8 HRS",
                  },
                  {
                    n: "04",
                    t: "Export Guard (Intelligence Estimate †)",
                    d: "HS Code, Hazmat status, required certificates, package dimensions. Gives your customs broker a 90% head start. Not a legal guarantee.",
                    s: "7 HRS",
                  },
                  {
                    n: "05",
                    t: "Direct Supplier Access",
                    d: "Verified manufacturer name, MOQ, and direct contact email. Our Seoul team checks it. Not scraped. Human-verified.",
                    s: "12 HRS",
                  },
                  {
                    n: "06",
                    t: "Launch Kit",
                    d: "4K On-Site Sourcing Footage (Raw), SEO keywords, broker email draft. Day 1 ready to launch and scale.",
                    s: "16+ HRS",
                  },
                ].map((layer) => (
                  <div key={layer.n} className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full border-2 border-[#16A34A] flex items-center justify-center bg-transparent">
                      <span className="text-[10px] font-black text-white">{layer.n}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">{layer.t}</p>
                      <p className="text-xs font-medium text-white/50 leading-relaxed mb-1">{layer.d}</p>
                      <p className="text-[10px] font-black text-[#16A34A] uppercase tracking-[0.2em]">⏱ SAVES {layer.s}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Market Intelligence Brief card — 55%, high rounded corners, h-full for height match */}
              <div className="bg-[#1A1916] rounded-3xl overflow-hidden border border-white/5 shadow-xl flex flex-col min-h-0 h-full">
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16A34A]">MARKET INTELLIGENCE BRIEF</p>
                      <p className="text-xs text-white/50 mt-1">Source: Olive Young · Daiso</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.2em] bg-[#16A34A] text-white px-3 py-1.5 rounded-full">ALPHA</span>
                  </div>

                  {/* Metrics row — font-black (900) */}
                  <div className="border-t border-white/10 pt-5 pb-5">
                    <div className="flex flex-wrap gap-6 gap-y-2">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-white/50">Market Score</p>
                        <p className="text-lg font-black text-white">91 / 100 ↑</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-white/50">Gap Index</p>
                        <p className="text-lg font-black text-white">54</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-white/50">Margin</p>
                        <p className="text-lg font-black text-white">3.8x</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-[#16A34A]">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16A34A] align-middle mr-1.5" aria-hidden /> COMPETITION: MODERATE ✓
                    </p>
                  </div>

                  {/* Standard Access — green open lock (#16A34A), verbatim 4 items */}
                  <div className="border-t border-white/10 pt-5 pb-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Standard Access</p>
                    <ul className="space-y-2">
                      {[
                        "Gap Index Score & Opportunity Reasoning",
                        "Profit Multiplier & Factory Unit Price (USD)",
                        "TikTok / IG Velocity & Buzz Summary",
                        "SEO, Viral & Rising Keywords",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-white">
                          <UnlockIcon className="shrink-0 text-[#16A34A] w-4 h-4" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Alpha Only — same green open lock (#16A34A), same bright text as Standard */}
                  <div className="border-t border-white/10 pt-5 pb-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Alpha Only — Execution Layer</p>
                    <ul className="space-y-2">
                      {[
                        "HS Code (6-digit) & Hazmat Assessment",
                        "Custom Broker Email Draft (English Template)",
                        "Verified MOQ & Factory Price (EXW)",
                        "Verified Direct Sourcing Intel",
                        "4K On-Site Sourcing Footage (Raw)",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-white">
                          <UnlockIcon className="shrink-0 text-[#16A34A] w-4 h-4" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-white/40 italic">More details available on Pricing page</p>
                  </div>

                  {/* Footer — white regular centered, button with glow, disclaimer bottom-most */}
                  <div className="border-t border-white/10 pt-5 mt-auto">
                    <p className="text-sm font-normal text-white text-center mb-4">Unlock to access 30+ verified products immediately.</p>
                    <div className="flex justify-center">
                      <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#16A34A] px-5 py-3 text-sm font-black text-white hover:bg-[#15803D] transition-colors duration-200 shadow-[0_0_25px_rgba(22,163,74,0.4)]"
                      >
                        View Pricing & Access →
                      </Link>
                    </div>
                    <p className="text-[10px] text-white/40 text-center mt-4">† Pre-verified intelligence estimates. Not a legal guarantee.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
```

## 3) 현재 랜딩의 검정 배경 섹션 공통 패턴

### 기준 파일
- `app/page.tsx`
- `components/DynamiteFuseSection.tsx` (홈 랜딩에서 `<DynamiteFuseSection />`로 렌더됨)

### 검정 계열 섹션 식별
- `bg-[#0A0908]`: 메인 배경, S5, S6, `DynamiteFuseSection`
- `bg-[#1A1916]`: S8b (Institutional Policy)

### 공통 패턴 요약
- **py 값**
  - `py-32`: S5, S6
  - 변형: `pt-24 pb-20`(+ md에서 `pt-32 pb-28`) in `DynamiteFuseSection`, `py-20` in S8b
- **px 값**
  - `px-6`: 거의 모든 검정 계열 섹션 공통
  - 내부 보조: 카드/내부 래퍼에서 `p-6 md:p-8`, `px-4`, `p-10` 등 사용
- **max-w 값**
  - 메인 컨테이너 공통: `max-w-6xl mx-auto` (S5, S6)
  - 변형: `max-w-5xl`, `max-w-4xl` (`DynamiteFuseSection`), `max-w-3xl` (S8b), `max-w-2xl`(본문 제한)
- **h2 폰트 클래스**
  - 대표 패턴: `font-black text-center text-white` + `style`로 `letterSpacing: -0.04em`, `lineHeight: 1.05`
  - 크기 지정은 클래스(`text-4xl md:text-6xl`) 또는 clamp 인라인 스타일 병행
  - `DynamiteFuseSection`은 `font-bold` 기반 2줄 헤드라인 구조
- **eyebrow `p` 태그 스타일**
  - 패턴: `text-[10px] font-black uppercase tracking-[0.3~0.35em]`
  - 색상: 검정 배경 기준 `text-white/40`, `text-white/50`, 강조 시 `text-[#16A34A]`
  - 예시:
    - S5 카드 헤더: `text-[10px] font-black uppercase tracking-[0.3em] text-[#16A34A]`
    - S8b 라벨: `text-[10px] font-black uppercase tracking-[0.35em] text-[#16A34A]`

