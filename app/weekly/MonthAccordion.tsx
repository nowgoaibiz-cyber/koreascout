"use client";

import React from "react";

export function MonthAccordion({
  monthLabel,
  monthKey,
  currentMonthKey,
  children,
}: {
  monthLabel: string;
  monthKey: string;
  currentMonthKey: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(monthKey === currentMonthKey);
  return (
    <div className="rounded-2xl border border-[#E8E6E1] overflow-hidden shadow-[0_1px_4px_0_rgb(26_25_22/0.06)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-8 py-6 bg-white hover:bg-[#F8F7F4] transition-colors"
      >
        <span className="text-2xl font-bold text-[#1A1916] tracking-tight">
          {monthLabel}
        </span>
        <span
          className="text-[#9E9C98] text-xl transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6 pt-3 bg-[#F8F7F4] space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}
