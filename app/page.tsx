import type { Metadata } from "next";
import HeroCTA from "@/components/HeroCTA";

export const metadata: Metadata = {
  title: "KoreaScout — Korean Product Intelligence",
  description:
    "Weekly verified intelligence on Korea's fastest-moving products.",
};

export default function HomePage() {
  return (
    <>
      <main>
        {/* ══ CINEMATIC HERO — 100vh ════════════════ */}
        <section
          className="relative w-full overflow-hidden flex items-center justify-center"
          style={{ height: "100vh", minHeight: "600px" }}
        >
          {/* Video Background Layer */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.35) saturate(0.8)" }}
            >
              {/*
                대표님: public/videos/hero.mp4 에 영상 파일 추가 필요
                임시: 영상 없으면 다크 그라디언트 fallback 표시
              */}
              <source src="/videos/hero.mp4" type="video/mp4" />
            </video>

            {/* Fallback: 영상 없을 때 다크 배경 */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #0A0908 0%, #1A1916 50%, #0D1F12 100%)",
              }}
            />
          </div>

          {/* Dark overlay gradient (영상 위) */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)",
            }}
          />

          {/* Subtle green scan line (시네마틱 효과) */}
          <div
            className="absolute left-0 right-0 z-10 pointer-events-none"
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(22,163,74,0.4), transparent)",
              top: "30%",
            }}
          />

          {/* Hero Content — Center */}
          <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
            {/* Intelligence Agency Super Label */}
            <p
              className="font-black uppercase text-[#16A34A] mb-8 tracking-[0.4em]"
              style={{ fontSize: "11px", letterSpacing: "0.4em" }}
            >
              The Global Standard for Korean Product Intelligence
            </p>

            {/* ONE KILLER SLOGAN — 그 외 모든 서브텍스트 제거 */}
            <h1
              className="font-black text-white leading-none tracking-tighter"
              style={{
                fontSize: "clamp(3rem, 8vw, 7rem)",
                textWrap: "balance",
                textShadow: "0 0 80px rgba(22,163,74,0.15)",
              } as React.CSSProperties}
            >
              Korea moves first.
              <br />
              <span style={{ color: "#16A34A" }}>We tell you what moves.</span>
            </h1>

            {/* ONE-KILL CTA — 중앙 단 하나 */}
            <div className="mt-14">
              <HeroCTA />
            </div>
          </div>

          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
            style={{
              height: "120px",
              background:
                "linear-gradient(to bottom, transparent, rgba(10,9,8,0.8))",
            }}
          />
        </section>
      </main>

      {/* Footer — PHASE 1 인라인 푸터 유지 */}
      <footer className="py-8 px-4 sm:px-12 border-t border-[#3D3B36] bg-[#1A1916] flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
        <span className="text-base font-medium text-[#9E9C98] text-center sm:text-left">
          © 2026 KoreaScout. All rights reserved.
        </span>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-base font-medium text-white/80 hover:text-[#16A34A] transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-base font-medium text-white/80 hover:text-[#16A34A] transition-colors"
          >
            Terms
          </a>
          <a
            href="/sample-report"
            className="text-base font-medium text-white/80 hover:text-[#16A34A] transition-colors"
          >
            Sample Report
          </a>
          <a
            href="#"
            className="text-base font-medium text-white/80 hover:text-[#16A34A] transition-colors"
          >
            Contact
          </a>
        </div>
      </footer>
    </>
  );
}
