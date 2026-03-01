"use client";

import Link from "next/link";

export interface LockedSectionProps {
  message: string;
  cta: string;
  href: string;
  lockedFields?: string[];
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function LockedSection({ message, cta, href, lockedFields }: LockedSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[var(--bg-card)] p-8">
      {/* Blur overlay to suggest hidden content */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-[2px]"
        aria-hidden
      />
      <div className="relative flex flex-col items-center text-center">
        <LockIcon className="mx-auto mb-4 text-white/40" />
        {lockedFields && lockedFields.length > 0 && (
          <div className="mb-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-white/40">
            {lockedFields.map((field) => (
              <span key={field}>
                🔒 {field}: ■■■■■■
              </span>
            ))}
          </div>
        )}
        <p className="text-lg font-medium text-white/90 mb-6 max-w-md">{message}</p>
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-400"
        >
          {cta}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
