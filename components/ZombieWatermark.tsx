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
    <>
      <style jsx global>{`
        @media print {
          #ghost-watermark span {
            opacity: 0.15 !important;
          }
        }
      `}</style>

      <div
        id="ghost-watermark"
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
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 3 }).map((_, col) => (
            <span
              key={`${row}-${col}`}
              style={{
                position: "absolute",
                top: `${row * 30}%`,
                left: `${col * 40 - 10}%`,
                transform: "rotate(-30deg)",
                fontSize: "11px",
                color: "#1A1916",
                opacity: 0.028,
                whiteSpace: "nowrap",
                userSelect: "none",
                fontWeight: 200,
              }}
            >
              {text}
            </span>
          ))
        )}
      </div>
    </>
  );
}

