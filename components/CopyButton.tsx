"use client";

import { useState } from "react";

interface CopyButtonProps {
  value: string;
  variant?: "default" | "primary";
}

export function CopyButton({ value, variant = "default" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // noop
    }
  }

  if (!value) return null;

  if (variant === "primary") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition-colors shrink-0"
      >
        <span aria-hidden>📋</span>
        {copied ? "Copied!" : "Copy Code"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="ml-2 inline-flex items-center rounded-md border border-white/20 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
    >
      <span aria-hidden>📋</span>
      <span className="sr-only">Copy</span>
      {copied && <span className="ml-2 text-[10px] text-emerald-400">Copied!</span>}
    </button>
  );
}

