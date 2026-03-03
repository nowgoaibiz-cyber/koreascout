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
      width="16"
      height="16"
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function LockedSection({
  message,
  cta,
  href,
  lockedFields,
}: LockedSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E8E6E1] bg-white">

      {/* ── ZONE 1: Teaser — 블러된 가짜 데이터 배경 ── */}
      <div
        className="px-6 pt-6 pb-0 select-none pointer-events-none"
        aria-hidden
      >
        {/* 가짜 데이터 행들 */}
        <div className="space-y-3 opacity-40">
          <div className="flex items-center justify-between">
            <div className="h-3 w-36 rounded-full bg-[#C4C2BE]" />
            <div className="h-3 w-24 rounded-full bg-[#16A34A]/30" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 w-52 rounded-full bg-[#C4C2BE]" />
            <div className="h-3 w-16 rounded-full bg-[#C4C2BE]" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 w-44 rounded-full bg-[#C4C2BE]" />
            <div className="h-5 w-20 rounded-md bg-[#DCFCE7]" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 w-32 rounded-full bg-[#C4C2BE]" />
            <div className="h-3 w-28 rounded-full bg-[#C4C2BE]" />
          </div>
        </div>
      </div>

      {/* ── ZONE 2: "What's locked inside" 티징 체크리스트 ── */}
      {lockedFields && lockedFields.length > 0 && (
        <div
          className="relative px-6 pt-5 pb-4 select-none pointer-events-none"
          aria-hidden
        >
          {/* 섹션 헤더 */}
          <p className="text-xs font-semibold uppercase tracking-widest text-[#9E9C98] mb-3">
            What&apos;s locked inside
          </p>

          {/* 필드 체크리스트 뱃지 */}
          <div className="flex flex-wrap gap-2">
            {lockedFields.map((field) => (
              <div
                key={field}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8E6E1] bg-[#F8F7F4] px-3 py-1.5"
              >
                {/* 자물쇠 도트 */}
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#E8E6E1]">
                  <LockIcon className="text-[#9E9C98]" />
                </span>
                <span className="text-sm font-medium text-[#6B6860]">
                  {field}
                </span>
              </div>
            ))}
          </div>

          {/* "결제 후엔 체크마크로 바뀐다" 암시 */}
          <p className="mt-3 text-xs text-[#C4C2BE]">
            🔓 Unlock → each item above becomes instantly available
          </p>
        </div>
      )}

      {/* ── 그라데이션 페이드 오버레이 ── */}
      <div
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/0 to-white/0 pointer-events-none"
        aria-hidden
      />

      {/* ── ZONE 3: CTA 블록 ── */}
      <div className="relative border-t border-[#F2F1EE] bg-white px-6 py-6 flex flex-col items-center text-center">

        {/* 메시지 */}
        <p className="text-base font-semibold text-[#1A1916] mb-1 max-w-sm leading-snug">
          {message}
        </p>

        {/* Rule of 3 서브카피 */}
        <p className="text-sm text-[#6B6860] mb-5 max-w-xs leading-relaxed">
          Active subscribers see the{" "}
          <span className="font-semibold text-[#1A1916]">3 most recent reports</span>
          {" "}— live data, every Monday.
        </p>

        {/* CTA 버튼 */}
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#15803D] shadow-[0_2px_8px_0_rgb(22_163_74/0.3)]"
        >
          {cta}
          <span aria-hidden>→</span>
        </Link>

        {/* 심리적 앵커 */}
        <p className="mt-3 text-xs text-[#9E9C98]">
          Cancel anytime · The window closes every Monday.
        </p>

      </div>
    </div>
  );
}
