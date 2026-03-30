# HERO 섹션 전수조사 (모바일 카피/버튼/반응형/영상)

기준 파일:
- `components/Hero.tsx`
- `components/HeroCTA.tsx` (`Hero` 내부 CTA 버튼 컴포넌트)

---

## 1) `components/Hero.tsx` 전체 코드

```tsx
"use client";

import { useRef, useEffect } from "react";
import HeroCTA from "@/components/HeroCTA";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const play = () => {
      video.play().catch(() => {});
    };
    play();
    video.addEventListener("loadeddata", play);
    return () => video.removeEventListener("loadeddata", play);
  }, []);

  return (
    <section
      className="relative w-full h-screen min-h-[640px] flex flex-col items-center justify-end overflow-hidden bg-[#0A0908]"
      style={{ marginTop: 0, paddingTop: 0, width: "100%", maxWidth: "100vw" }}
    >
      {/* Video BG — z-0, starts at viewport top */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ opacity: 0.6 }}
          src="/videos/hero.mp4"
        />
      </div>

      {/* Overlay: bg-black/30 for readability without hiding video — z-10 */}
      <div
        className="absolute inset-0 pointer-events-none bg-black/30"
        style={{ zIndex: 10 }}
        aria-hidden
      />

      {/* Gradient fade to black at bottom — z-10 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 10,
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(10,9,8,0.25) 50%, #0A0908 100%)",
        }}
        aria-hidden
      />

      {/* Center content — Pre-headline + Headline + Buttons — z-20 */}
      <div
        className="relative text-center px-6 max-w-7xl mx-auto flex flex-col items-center justify-center"
        style={{ zIndex: 20, paddingBottom: "clamp(60px, 10vh, 120px)" }}
      >
        <p
          className="font-bold uppercase mb-4"
          style={{
            fontSize: "clamp(9px, 2vw, 11px)",
            letterSpacing: "0.2em",
            textAlign: "center",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            padding: "0 16px",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          Weekly Korean product intelligence for global sellers.
        </p>
        <h1
          className="font-black text-[#FFFFFF]"
          style={{
            margin: 0,
            fontSize: "clamp(1.8rem, 4.5vw, 4rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            textAlign: "center",
            lineHeight: 1.1,
            padding: "0 20px",
          }}
        >
          See what&apos;s selling in Korea today.
          <br />
          Sell it globally tomorrow.
        </h1>

        <div className="mt-20 flex flex-col items-center justify-center">
          <HeroCTA />
        </div>
      </div>
    </section>
  );
}
```

---

## 2) 텍스트 카피 전체 목록 (문자열 + 라인 번호)

### `components/Hero.tsx`
- L74: `Weekly Korean product intelligence for global sellers.` (서브헤드라인)
- L88: `See what's selling in Korea today.` (메인 헤드라인 1행, 코드상 `what&apos;s`)
- L90: `Sell it globally tomorrow.` (메인 헤드라인 2행)

### `components/HeroCTA.tsx` (Hero 버튼 카피)
- L46: `Loading...`
- L49: `View Weekly Report` (버튼 메인 텍스트)
- L50: `→` (버튼 아이콘 텍스트)

---

## 3) 버튼 스타일링 전체

버튼은 `components/HeroCTA.tsx`의 `<button>` (L28~L53) 기준.

### 버튼 `className` 전체
- L32:
`w-full md:w-64 h-14 rounded-xl flex items-center justify-center gap-2 font-black text-[15px] tracking-wide text-white border border-transparent transition-all duration-200 outline-none disabled:cursor-wait`

### 패딩/폰트 사이즈/너비 관련 클래스 전부
- 너비: `w-full`, `md:w-64`
- 높이: `h-14`
- 폰트 크기: `text-[15px]`
- 패딩 클래스: **없음** (`px-*`, `py-*`, `p-*` 미사용)

### 모바일 반응형 클래스 (`sm:`, `md:` 등) 전부
- `md:w-64` (기본은 `w-full`, md 이상에서 고정 너비)

---

## 4) 모바일 반응형 관련 (Hero 섹션)

### Hero 섹션 모바일 관련 클래스 전부 (`components/Hero.tsx`)
- 섹션 컨테이너 L22: `w-full h-screen min-h-[640px]`
- 내부 컨텐츠 L59: `px-6 max-w-7xl mx-auto`
- CTA 래퍼 L93: `mt-20 flex flex-col ...` (모바일에서 세로 배치)

### 텍스트 사이즈 반응형 클래스/스타일 전부
- 클래스 기반 텍스트 반응형: **없음** (`text-sm`, `md:text-*` 등 미사용)
- 인라인 반응형:
  - 서브헤드라인 L65: `fontSize: "clamp(9px, 2vw, 11px)"`
  - 메인헤드라인 L80: `fontSize: "clamp(1.8rem, 4.5vw, 4rem)"`

### min-height, height 관련 클래스 전부
- L22: `h-screen`
- L22: `min-h-[640px]`
- L33: 비디오 클래스에 `h-full`

---

## 5) 영상 관련 현재 코드

### `video` 태그 전체 속성 (`components/Hero.tsx` L27~L36)
- `ref={videoRef}`
- `autoPlay`
- `muted`
- `loop`
- `playsInline`
- `className="w-full h-full object-cover"`
- `style={{ opacity: 0.6 }}`
- `src="/videos/hero.mp4"`

### opacity, overlay 관련 스타일 전부
- 비디오 투명도:
  - L34: `style={{ opacity: 0.6 }}`
- 오버레이(검정):
  - L41: `className="absolute inset-0 pointer-events-none bg-black/30"`
  - L42: `style={{ zIndex: 10 }}`
- 그라디언트 오버레이:
  - L48: `className="absolute inset-0 pointer-events-none"`
  - L50: `zIndex: 10`
  - L52: `background: "linear-gradient(to bottom, transparent 0%, rgba(10,9,8,0.25) 50%, #0A0908 100%)"`

---

검토 범위 내 코드 수정은 수행하지 않았고, 요청하신 리포트만 저장했습니다.
