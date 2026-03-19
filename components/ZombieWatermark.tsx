"use client";
import { useEffect, useRef } from "react";

export default function ZombieWatermark({ email }: { email: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().slice(0, 10);
  const text = `${email} · ${today}`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new MutationObserver(() => {
      if (!document.contains(container)) {
        document.body.appendChild(container);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
      }}
    >
      {Array.from({ length: 10 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => (
          <span
            key={`${row}-${col}`}
            style={{
              position: "absolute",
              top: `${row * 18}%`,
              left: `${col * 20 - 5}%`,
              transform: "rotate(-30deg)",
              fontSize: "13px",
              color: "#1A1916",
              opacity: 0.06,
              whiteSpace: "nowrap",
              userSelect: "none",
              fontWeight: 500,
            }}
          >
            {text}
          </span>
        ))
      )}
    </div>
  );
}

