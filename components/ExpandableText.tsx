"use client";

import { useState, useRef, useEffect } from "react";

export function ExpandableText({ text, label }: { text: string; label: string }) {
  const [expanded, setExpanded] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isCompositionInfo = text.includes("\n\n") && text.includes("⚠️");
  const parts = isCompositionInfo ? text.split("\n\n").slice(0, 3) : [];

  useEffect(() => {
    if (ref.current && !expanded) {
      setNeedsClamp(ref.current.scrollHeight > ref.current.clientHeight + 4);
    }
  }, [text, expanded]);

  return (
    <div className="mb-3" aria-label={label}>
      <div className="relative">
        <div
          ref={ref}
          className={`text-sm text-[#6B6860] leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}
        >
          {isCompositionInfo ? (
            <div className="space-y-2">
              <div className="text-sm text-[#6B6860] whitespace-pre-wrap">
                {parts[0]}
              </div>
              <div className="text-sm text-[#2d2d2d] whitespace-pre-wrap">
                {parts[1] ?? ""}
              </div>
              <div className="text-xs text-[#6B6860] italic whitespace-pre-wrap">
                {parts[2] ?? ""}
              </div>
            </div>
          ) : (
            text
          )}
        </div>
        {!expanded && needsClamp && (
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#F8F7F4] to-transparent" />
        )}
      </div>
      {needsClamp && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-[#16A34A] hover:text-[#15803D] mt-1"
        >
          {expanded ? "Show Less ▲" : "Read More ▼"}
        </button>
      )}
    </div>
  );
}
