"use client";

import { useState, useCallback } from "react";

/**
 * Viral hashtag pills; click to copy to clipboard.
 * Section 3 Seller Intelligence.
 */
export function ViralHashtagPills({ tags }: { tags: string[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback(async (tag: string) => {
    const text = tag.startsWith("#") ? tag : `#${tag}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(tag);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // ignore
    }
  }, []);

  if (!tags?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const display = tag.startsWith("#") ? tag : `#${tag}`;
        const isCopied = copied === tag;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => copy(tag)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              isCopied
                ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                : "border-[#E8E6E1] bg-[#F8F7F4] text-[#3D3B36] hover:border-[#BBF7D0] hover:bg-[#DCFCE7] hover:text-[#16A34A]"
            }`}
          >
            {isCopied ? "Copied!" : display}
          </button>
        );
      })}
    </div>
  );
}
