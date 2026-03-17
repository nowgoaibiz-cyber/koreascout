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
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="bg-[#F8F7F4] rounded-2xl p-10">
      <p className="text-xl font-bold text-[#1A1916] mb-8">
        HS Code &amp; Broker Weapon
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">HS Code</p>
          <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="80px">
            {report.hs_code?.trim() ? (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <p className="text-4xl font-black tracking-tighter text-[#1A1916]">
                    {formatHsCode(report.hs_code)}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(report.hs_code ?? "");
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="text-xs font-bold text-[#9E9C98] border border-[#E8E6E1] px-3 py-1 rounded-full hover:bg-white transition-colors"
                  >
                    {isCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
                {!isEmailOpen && report.hs_description?.trim() && (
                  <p className="text-sm text-[#6B6860] leading-relaxed">
                    {report.hs_description}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm italic text-[#9E9C98]">No HS code available.</p>
            )}
          </LockedValue>
        </div>

        <div>
          <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-4">Broker Email Draft</p>
          <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="80px">
            {report.hs_code?.trim() ? (
              <BrokerEmailDraft report={report} onOpenChange={setIsEmailOpen} />
            ) : (
              <p className="text-sm italic text-[#9E9C98]">
                Available once HS code is confirmed.
              </p>
            )}
          </LockedValue>
        </div>
      </div>
    </div>
  );
}
