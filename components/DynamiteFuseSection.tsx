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
