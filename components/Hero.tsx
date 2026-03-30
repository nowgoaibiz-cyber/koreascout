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
            fontSize: "clamp(8px, 1.5vw, 10px)",
            letterSpacing: "0.2em",
            textAlign: "center",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            padding: "0 16px",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          Weekly Korean Product Intelligence for Global Sellers.
        </p>
        <h1
          className="font-black text-[#FFFFFF]"
          style={{
            margin: 0,
            fontSize: "clamp(1.4rem, 3.2vw, 3.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            textAlign: "center",
            lineHeight: 1.1,
            padding: "0 20px",
            whiteSpace: "nowrap",
          }}
        >
          The K-Beauty Trend Pipeline.<br />Before Your Feed Knows It Exists.
        </h1>

        <div className="mt-20 flex flex-col items-center justify-center">
          <HeroCTA />
        </div>
      </div>
    </section>
  );
}
