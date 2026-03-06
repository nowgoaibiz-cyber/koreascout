"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

export function MonthAccordion({
  monthLabel,
  monthKey,
  currentMonthKey,
  defaultOpen,
  children,
}: {
  monthLabel: string;
  monthKey: string;
  currentMonthKey: string;
  /** When true, accordion is open on first render. Use e.g. index === 0 for first item. */
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(
    defaultOpen !== undefined ? defaultOpen : monthKey === currentMonthKey
  );
  return (
    <div className="rounded-none border border-[#E8E6E1] border-t-0 first:border-t first:rounded-t-2xl last:rounded-b-2xl overflow-hidden shadow-[0_1px_4px_0_rgb(26_25_22/0.06)] bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-8 py-5 bg-[#F8F7F4] hover:bg-[#F0EDE8] transition-colors border-b border-[#E8E6E1]"
      >
        <span className="text-xl font-bold text-[#1A1916] tracking-tight uppercase">
          {monthLabel}
        </span>
        <span
          className="text-[#1A1916] transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <ChevronDown className="w-6 h-6" strokeWidth={2.5} />
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6 pt-4 bg-[#F8F7F4] space-y-4 border-b border-[#E8E6E1]">
          {children}
        </div>
      )}
    </div>
  );
}
