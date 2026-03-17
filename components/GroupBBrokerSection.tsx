"use client";

import { useState } from "react";
import { BrokerEmailDraft } from "@/components/BrokerEmailDraft";
import { LockedValue } from "@/components/ui/LockedValue";
import type { ScoutFinalReportsRow } from "@/types/database";

function formatHsCode(raw: string | null | undefined): string {
  const s = raw?.trim().replace(/\D/g, "") ?? "";
  if (s.length === 6) return `${s.slice(0, 4)}.${s.slice(4)}`;
  return raw?.trim() ?? "";
}

export function GroupBBrokerSection({
  report,
  canSeeAlpha,
}: {
  report: ScoutFinalReportsRow;
  canSeeAlpha: boolean;
}) {
  const [isEmailOpen, setIsEmailOpen] = useState(false);

  const hsCodeValue = report.hs_code?.trim()
    ? formatHsCode(report.hs_code) || report.hs_code || ""
    : "";
  const [hsCopied, setHsCopied] = useState(false);
  async function copyHsCode() {
    if (!hsCodeValue) return;
    try {
      await navigator.clipboard.writeText(hsCodeValue);
      setHsCopied(true);
      setTimeout(() => setHsCopied(false), 1500);
    } catch {
      // noop
    }
  }

  return (
    <div className="bg-[#F8F7F4] rounded-2xl p-10">
      <p className="text-xl font-bold text-[#1A1916] mb-8">
        HS Code &amp; Broker Weapon
      </p>

      {canSeeAlpha ? (
        <div
          className={`transition-all duration-300 ease-in-out ${
            isEmailOpen
              ? "flex flex-col w-full gap-8"
              : "grid grid-cols-2"
          }`}
        >
          <div className={
            isEmailOpen
              ? "w-full pb-6 border-b border-[#E8E6E1]"
              : "pr-10 border-r border-[#E8E6E1]"
          }>
            <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-3">HS Code</p>
            {report.hs_code?.trim() ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <p className={`font-extrabold font-mono text-[#1A1916] tracking-tight transition-all duration-300 ${
                    isEmailOpen ? "text-2xl" : "text-4xl"
                  }`}>
                    {formatHsCode(report.hs_code) || report.hs_code}
                  </p>
                  <button
                    type="button"
                    onClick={copyHsCode}
                    className="text-xs font-medium px-3 py-1 rounded-md border border-[#E8E6E1] text-[#6B6860] hover:text-[#1A1916] hover:border-[#1A1916] transition-colors"
                  >
                    {hsCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
                {!isEmailOpen && report.hs_description?.trim() && (
                  <p className="text-lg text-[#1A1916] leading-relaxed">
                    {report.hs_description}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-[#9E9C98] italic">
                No HS code available.
              </p>
            )}
          </div>

          <div className={isEmailOpen ? "w-full" : "pl-10"}>
            <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">Broker Email Draft</p>
            {report.hs_code?.trim() ? (
              <BrokerEmailDraft
                report={report}
                onOpenChange={setIsEmailOpen}
              />
            ) : (
              <p className="text-sm text-[#9E9C98] italic">
                Available once HS code is confirmed.
              </p>
            )}
          </div>
        </div>
      ) : (
        <LockedValue locked={!canSeeAlpha} tier="alpha">
          <div className="grid grid-cols-2 gap-6">
            <div className="h-24 rounded-xl bg-[#F2F1EE]" />
            <div className="h-24 rounded-xl bg-[#F2F1EE]" />
          </div>
        </LockedValue>
      )}
    </div>
  );
}
