"use client";

import { useState, useRef, useEffect } from "react";

export function ExpandableText({ text, label }: { text: string; label: string }) {
  const [expanded, setExpanded] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (ref.current && !expanded) {
      setNeedsClamp(ref.current.scrollHeight > ref.current.clientHeight + 4);
    }
  }, [text, expanded]);

  return (
    <div className="mb-3">
      <p className="text-xs text-[#9E9C98] mb-1">{label}</p>
      <div className="relative">
        <p
          ref={ref}
          className={`text-sm text-[#6B6860] leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}
        >
          {text}
        </p>
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
