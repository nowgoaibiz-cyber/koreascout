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
      className="relative w-full h-screen min-h-[640px] flex flex-col items-center justify-center overflow-hidden bg-[#0A0908]"
      style={{ marginTop: 0, paddingTop: 0 }}
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
        className="relative text-center px-6 max-w-5xl mx-auto flex flex-col items-center justify-center"
        style={{ zIndex: 20 }}
      >
        <p
          className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-4"
          style={{ color: "rgba(248,247,244,0.6)" }}
        >
          Weekly Korean product intelligence for global sellers.
        </p>
        <h1
          className="font-black tracking-tighter leading-[1.15] text-[#FFFFFF] text-4xl md:text-[clamp(2.5rem,5.5vw,4.5rem)]"
          style={{ margin: 0 }}
        >
          <span className="whitespace-nowrap">See what&apos;s selling in Korea today.</span>
          <br />
          <span className="whitespace-nowrap">Sell it globally tomorrow.</span>
        </h1>

        <div className="mt-20 flex flex-col items-center justify-center">
          <HeroCTA />
        </div>
      </div>
    </section>
  );
}
