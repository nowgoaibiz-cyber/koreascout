"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ───────── SLIDE DATA ───────── */
const slides = [
  { id: "slide1", component: Slide1 },
  { id: "slide2", component: Slide2 },
  { id: "slide3", component: Slide3 },
];

/* ───────── SLIDE 1 ───────── */
function Slide1() {
  return (
    <div className="slide-inner">
      <span className="eyebrow">FM · CS · AM Operations</span>
      <h1 className="slide-title">운영 조직의 역할 변화</h1>

      <div className="compare-grid">
        {/* 왼쪽 */}
        <div className="compare-box left">
          <p className="box-label">과거 인식</p>
          <Item>백오피스 지원 조직</Item>
          <Item>문제 대응 중심 운영</Item>
          <Item>시설 및 문의 관리</Item>
        </div>

        {/* 화살표 */}
        <div className="arrow-mid">
          <div className="arrow-line" />
          <div className="arrow-head" />
        </div>

        {/* 오른쪽 */}
        <div className="compare-box right">
          <p className="box-label accent">현재 역할</p>
          <Item accent>고객 경험 관리</Item>
          <Item accent>브랜드 평판 관리</Item>
          <Item accent>파트너 관계 관리</Item>
        </div>
      </div>

      <p className="key-msg">
        운영 조직은 단순 지원 조직이 아니라{" "}
        <strong>고객 경험과 브랜드 신뢰를 관리하는 핵심 사업 조직</strong>입니다.
      </p>
    </div>
  );
}

function Item({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`item ${accent ? "item-accent" : ""}`}>
      <div className={`dot ${accent ? "dot-accent" : ""}`} />
      <span>{children}</span>
    </div>
  );
}

/* ───────── SLIDE 2 ───────── */
function Slide2() {
  const flow1 = ["고객 경험 관리", "고객 만족도 상승", "장기 매출 안정"];
  const flow2 = [
    "파트너십 관계 구축 및 운영 관리",
    "악성 리뷰 감소 → 브랜드 평판 개선",
    "지점 개발 환경 개선",
  ];
  return (
    <div className="slide-inner">
      <h1 className="slide-title">운영 품질은 사업 성장과 직접 연결됩니다</h1>
      <div className="flows-grid">
        <FlowBox label="FLOW 1 — FM / CS" steps={flow1} />
        <FlowBox label="FLOW 2 — AM" steps={flow2} />
      </div>
    </div>
  );
}

function FlowBox({ label, steps }: { label: string; steps: string[] }) {
  return (
    <div className="flow-box">
      <span className="flow-label">{label}</span>
      {steps.map((s, i) => (
        <div key={i}>
          <div className="flow-step">
            <div className={`step-dot ${i === steps.length - 1 ? "step-dot-final" : ""}`} />
            <span className={`step-text ${i === steps.length - 1 ? "step-text-final" : ""}`}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && <div className="flow-connector" />}
        </div>
      ))}
    </div>
  );
}

/* ───────── SLIDE 3 ───────── */
function Slide3() {
  return (
    <div className="slide-inner">
      <span className="eyebrow">Strategic Conclusion</span>
      <h1 className="slide-title large">
        Operations as a <span className="accent-text">Growth Engine</span>
      </h1>
      <p className="sub-copy">
        운영은 단순한 비용이 아니라
        <br />
        <strong>장기적인 매출과 사업 확장을 만드는 시스템</strong>입니다.
      </p>
      <div className="pills-row">
        {["Customer Experience", "Brand Reputation", "Sustainable Revenue"].map((k) => (
          <span key={k} className="pill">
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────── MAIN PRESENTATION ───────── */
const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? "100%" : "-100%", opacity: 0 }),
};

export default function JisunPage() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const go = (next: number) => {
    const n = (next + slides.length) % slides.length;
    setDirection(next > current ? 1 : -1);
    setCurrent(n);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(current + 1);
      if (e.key === "ArrowLeft") go(current - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current]);

  const SlideComponent = slides[current].component;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0f1117;
          font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
        }

        .ppt-root {
          width: 100vw;
          height: 100vh;
          background: #0f1117;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        /* 슬라이드 영역 */
        .stage {
          width: min(92vw, 1100px);
          aspect-ratio: 16/9;
          position: relative;
          overflow: hidden;
        }

        .slide-inner {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6% 9%;
          gap: 0;
        }

        /* ── 공통 타이포 ── */
        .eyebrow {
          font-size: clamp(9px, 0.85vw, 13px);
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #6699FF;
          font-weight: 500;
          margin-bottom: 12px;
        }
        .slide-title {
          font-size: clamp(18px, 2.4vw, 34px);
          font-weight: 700;
          color: #f0f0f0;
          text-align: center;
          margin-bottom: 28px;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }
        .slide-title.large { font-size: clamp(22px, 3.2vw, 46px); margin-bottom: 20px; }
        .accent-text { color: #6699FF; }

        /* ── Slide 1 ── */
        .compare-grid {
          display: grid;
          grid-template-columns: 1fr 60px 1fr;
          gap: 0;
          width: 100%;
          max-width: 700px;
          align-items: center;
        }
        .compare-box {
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          padding: 20px 22px;
        }
        .compare-box.right {
          background: rgba(102,153,255,0.07);
          border-color: rgba(102,153,255,0.28);
        }
        .box-label {
          font-size: clamp(8px, 0.7vw, 11px);
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 14px;
          font-weight: 500;
        }
        .box-label.accent { color: #6699FF; }
        .item {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: clamp(10px, 1vw, 14px);
          color: rgba(255,255,255,0.45);
          margin-bottom: 9px;
          font-weight: 300;
        }
        .item-accent { color: rgba(255,255,255,0.82); }
        .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.2);
          flex-shrink: 0;
        }
        .dot-accent { background: #6699FF; }

        .arrow-mid {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
        }
        .arrow-line {
          width: 36px; height: 1px;
          background: linear-gradient(90deg, transparent, #6699FF 60%, transparent);
        }
        .arrow-head {
          width: 0; height: 0;
          border-left: 8px solid #6699FF;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
        }

        .key-msg {
          margin-top: 20px;
          font-size: clamp(9px, 0.9vw, 13px);
          color: rgba(255,255,255,0.38);
          text-align: center;
          max-width: 520px;
          line-height: 1.7;
          border-top: 0.5px solid rgba(255,255,255,0.06);
          padding-top: 16px;
        }
        .key-msg strong { color: rgba(255,255,255,0.68); font-weight: 500; }

        /* ── Slide 2 ── */
        .flows-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          width: 100%;
          max-width: 720px;
        }
        .flow-box {
          background: rgba(255,255,255,0.03);
          border: 0.5px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 18px 20px;
        }
        .flow-label {
          display: inline-block;
          background: rgba(102,153,255,0.12);
          color: #6699FF;
          font-size: clamp(8px, 0.75vw, 11px);
          font-weight: 700;
          letter-spacing: 1px;
          padding: 4px 12px;
          border-radius: 30px;
          margin-bottom: 14px;
        }
        .flow-step {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .step-dot {
          width: 18px; height: 18px; border-radius: 50%;
          background: rgba(102,153,255,0.1);
          border: 0.5px solid rgba(102,153,255,0.4);
          flex-shrink: 0;
          margin-top: 1px;
        }
        .step-dot-final { background: #6699FF; border-color: #6699FF; }
        .step-text {
          font-size: clamp(9px, 0.9vw, 12px);
          color: rgba(255,255,255,0.55);
          line-height: 1.5;
          font-weight: 300;
        }
        .step-text-final { color: rgba(255,255,255,0.9); font-weight: 500; }
        .flow-connector {
          width: 1px; height: 10px;
          background: rgba(102,153,255,0.25);
          margin: 4px 0 4px 8px;
        }

        /* ── Slide 3 ── */
        .sub-copy {
          font-size: clamp(11px, 1.1vw, 16px);
          color: rgba(255,255,255,0.38);
          text-align: center;
          line-height: 1.7;
          margin-bottom: 26px;
          max-width: 480px;
          font-weight: 300;
        }
        .sub-copy strong { color: rgba(255,255,255,0.68); font-weight: 500; }
        .pills-row { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .pill {
          border: 0.5px solid rgba(102,153,255,0.35);
          background: rgba(102,153,255,0.07);
          color: rgba(255,255,255,0.75);
          font-size: clamp(9px, 0.85vw, 12px);
          font-weight: 500;
          padding: 7px 18px;
          border-radius: 30px;
          letter-spacing: 0.3px;
        }

        /* ── 네비게이션 ── */
        .nav-bar {
          margin-top: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .nav-btn {
          background: rgba(255,255,255,0.05);
          border: 0.5px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.5);
          font-size: clamp(10px, 0.85vw, 13px);
          padding: 6px 18px;
          border-radius: 24px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .nav-btn:hover { background: rgba(102,153,255,0.15); border-color: #6699FF; color: #6699FF; }
        .nav-btn:disabled { opacity: 0.2; cursor: default; }

        .nav-dots { display: flex; gap: 7px; align-items: center; }
        .nav-dot {
          width: 6px; height: 6px; border-radius: 3px;
          background: rgba(255,255,255,0.18);
          cursor: pointer; transition: all 0.25s ease;
        }
        .nav-dot.active { background: #6699FF; width: 22px; }

        .slide-counter {
          position: fixed;
          top: 22px; right: 28px;
          font-size: 11px;
          color: rgba(255,255,255,0.18);
          letter-spacing: 1px;
        }
      `}</style>

      <div className="ppt-root">
        <div className="stage">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={slides[current].id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              style={{ position: "absolute", width: "100%", height: "100%" }}
            >
              <SlideComponent />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="nav-bar">
          <button className="nav-btn" onClick={() => go(current - 1)}>
            ← 이전
          </button>
          <div className="nav-dots">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`nav-dot ${i === current ? "active" : ""}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <button className="nav-btn" onClick={() => go(current + 1)}>
            다음 →
          </button>
        </div>

        <div className="slide-counter">
          0{current + 1} / 0{slides.length}
        </div>
      </div>
    </>
  );
}
