"use client";

import { useEffect, useState } from "react";

type Stage = "clearance" | "decrypting" | "sliding";

export default function SplashScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [stage, setStage] = useState<Stage>("clearance");
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    requestAnimationFrame(() => setOpacity(1));
    const t1 = setTimeout(() => setStage("decrypting"), 800);
    const t2 = setTimeout(() => setStage("sliding"), 1800);
    const t3 = setTimeout(() => {
      setOpacity(0);
      setTimeout(onComplete, 400);
    }, 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  const msg: Record<Stage, string> = {
    clearance: "Access Granted.",
    decrypting: "Preparing Intelligence Brief...",
    sliding: "Entering Secure Environment...",
  };
  const pct: Record<Stage, string> = {
    clearance: "33%",
    decrypting: "66%",
    sliding: "100%",
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6"
      style={{
        background: "#0A0908",
        opacity,
        transition: "opacity 0.4s ease",
      }}
    >
      <p
        style={{
          fontSize: "10px",
          fontWeight: 900,
          letterSpacing: "0.4em",
          color: "#16A34A",
          textTransform: "uppercase",
        }}
      >
        KoreaScout Intelligence
      </p>
      <p
        style={{
          fontSize: "clamp(1.25rem,3vw,1.75rem)",
          fontWeight: 900,
          color: "white",
          letterSpacing: "-0.02em",
          textAlign: "center",
          transition: "opacity 0.3s ease",
        }}
      >
        {msg[stage]}
      </p>
      <div
        style={{
          width: "200px",
          height: "1px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "#16A34A",
            borderRadius: "999px",
            width: pct[stage],
            transition: "width 0.6s ease",
          }}
        />
      </div>
      <p
        style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.2)",
          textTransform: "uppercase",
        }}
      >
        {stage !== "clearance"
          ? `Decrypting Report KS-${new Date().getFullYear()}`
          : "Verifying Credentials..."}
      </p>
    </div>
  );
}
