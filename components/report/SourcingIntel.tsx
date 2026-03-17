"use client";

import { GroupBBrokerSection } from "@/components/GroupBBrokerSection";
import { HazmatBadges } from "@/components/HazmatBadges";
import { ExpandableText } from "@/components/ExpandableText";
import { LockedValue } from "@/components/ui/LockedValue";
import { AlertTriangle, ArrowRight, CheckCircle, ShieldCheck, XCircle } from "lucide-react";
import type { ScoutFinalReportsRow } from "@/types/database";
import { describeShippingTier, parseSourcingStrategy } from "./utils";

export function SourcingIntel({
  report,
  tier,
  isTeaser,
}: {
  report: ScoutFinalReportsRow;
  tier: string;
  isTeaser: boolean;
}) {
  const canSeeAlpha = tier === "alpha" || isTeaser;

  const allSteps = parseSourcingStrategy(report.sourcing_tip);
  const logisticsSteps = allSteps.slice(3, 5);

  const hasActual = report.actual_weight_g != null;
  const hasVol = report.volumetric_weight_g != null;
  const hasBillable = report.billable_weight_g != null;

  const certs = report.required_certificates?.trim()
    ? report.required_certificates.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

  const exportConfig = (() => {
    const s = report.export_status;
    if (s === "Green") return { icon: "✓", label: "Ready for Export", color: "text-[#16A34A]", bg: "bg-[#DCFCE7]", border: "border-[#BBF7D0]" };
    if (s === "Yellow") return { icon: "⚠", label: "Conditional Export", color: "text-[#D97706]", bg: "bg-[#FEF3C7]", border: "border-[#FDE68A]" };
    return { icon: "✗", label: "Export Restricted", color: "text-[#DC2626]", bg: "bg-[#FEE2E2]", border: "border-[#FECACA]" };
  })();

  return (
    <section
      id="section-5"
      className="scroll-mt-[160px] bg-white rounded-2xl border border-[#E8E6E1] p-8 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] relative"
    >
      <h2 className="text-3xl font-bold text-[#1A1916] tracking-tight mb-12">
        Export &amp; Logistics Intel
      </h2>

      <div className="space-y-6">

        <div className="bg-[#F8F7F4] rounded-2xl p-10">
          <p className="text-xl font-bold text-[#1A1916] mb-8">Export Readiness</p>
          <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="120px">
            <div className={`rounded-xl border-2 ${exportConfig.border} ${exportConfig.bg} px-8 py-6`}>
              <div className="flex items-center gap-4 mb-4">
                {report.export_status === "Green" && <CheckCircle className={`w-8 h-8 shrink-0 ${exportConfig.color}`} />}
                {report.export_status === "Yellow" && <AlertTriangle className={`w-8 h-8 shrink-0 ${exportConfig.color}`} />}
                {report.export_status !== "Green" && report.export_status !== "Yellow" && (
                  <XCircle className={`w-8 h-8 shrink-0 ${exportConfig.color}`} />
                )}
                <p className={`text-2xl font-black tracking-tighter ${exportConfig.color}`}>{exportConfig.label}</p>
              </div>
              {report.status_reason?.trim() && (
                <p className="text-lg text-[#1A1916] leading-relaxed">{report.status_reason}</p>
              )}
              <p className="text-sm font-semibold italic text-[#3D3B36] mt-4 pt-4 border-t border-black/5">
                {report.export_status === "Green" &&
                  "Full clearance. Market dominance is within reach. Immediate high-velocity sourcing recommended."}
                {report.export_status === "Yellow" &&
                  "Strategic entry point. Success depends on precise compliance handling. Navigate with care for smooth export."}
                {report.export_status !== "Green" && report.export_status !== "Yellow" &&
                  "A high-entry barrier is your competitive moat. Overcoming this hurdle ensures market exclusivity. Verify local compliance status."}
              </p>
            </div>
          </LockedValue>
        </div>

        <GroupBBrokerSection report={report} canSeeAlpha={canSeeAlpha} />

        <div className="bg-[#F8F7F4] rounded-2xl p-10">
          <p className="text-xl font-bold text-[#1A1916] mb-8">Logistics Dashboard</p>

          <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="100px">
            <div className="flex items-center gap-3 mb-12">
              <div className="flex-1 bg-white border border-[#E8E6E1] rounded-xl p-5 text-center">
                <p className="text-lg font-bold text-[#6B6860] uppercase tracking-widest mb-3">Actual Weight</p>
                <p className="text-4xl font-black tracking-tighter text-[#1A1916]">
                  {hasActual ? `${report.actual_weight_g}g` : "—"}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-[#9E9C98] shrink-0" />
              <div className="flex-1 bg-white border border-[#E8E6E1] rounded-xl p-5 text-center">
                <p className="text-lg font-bold text-[#6B6860] uppercase tracking-widest mb-3">Volumetric Weight</p>
                <p className="text-4xl font-black tracking-tighter text-[#1A1916]">
                  {hasVol ? `${report.volumetric_weight_g}g` : "—"}
                </p>
                {report.dimensions_cm?.trim() && (
                  <span className="inline-block mt-2 bg-[#F2F1EE] text-[#9E9C98] rounded px-2 py-0.5 text-xs font-medium">
                    {report.dimensions_cm}
                  </span>
                )}
              </div>
              <ArrowRight className="w-5 h-5 text-[#9E9C98] shrink-0" />
              <div className="flex-1 bg-[#DCFCE7] border border-[#BBF7D0] rounded-xl p-5 text-center">
                <p className="text-lg font-bold text-[#6B6860] uppercase tracking-widest mb-3 text-[#16A34A]">Billable Weight</p>
                <p className="text-4xl font-black tracking-tighter text-[#16A34A]">
                  {hasBillable ? `${report.billable_weight_g}g` : "—"}
                </p>
                {hasVol && hasActual && (
                  <p className="text-xs font-bold text-[#16A34A]/70 mt-2">
                    {report.volumetric_weight_g! > report.actual_weight_g! ? "Volumetric applies" : "Dead weight applies"}
                  </p>
                )}
              </div>
            </div>
          </LockedValue>

          <div className="mb-10 mt-8">
            <p className="text-xl font-bold text-[#1A1916] mb-4">Shipping Tier</p>
            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
              <p className="text-lg text-[#1A1916] leading-relaxed">
                {report.shipping_tier ? describeShippingTier(report.shipping_tier).description : "—"}
              </p>
            </LockedValue>
          </div>

          <div className="border-t border-[#E8E6E1] pt-8 mt-4">
            <p className="text-xl font-bold text-[#1A1916] mb-6">Hazmat &amp; Compliance</p>
            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
              <div className="w-full mb-10">
                <HazmatBadges status={report.hazmat_status as unknown} />
              </div>
            </LockedValue>
          </div>

          <div className="mt-8">
            <p className="text-xl font-bold text-[#1A1916] mb-4">Certifications Required</p>
            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
              <div className="flex flex-wrap gap-3">
                {certs.length > 0 ? certs.map((cert) => (
                  <span key={cert} className="bg-white border border-[#E8E6E1] text-[#1A1916] rounded-full px-5 py-2 text-sm font-bold">
                    {cert}
                  </span>
                )) : <span className="text-[#9E9C98]">—</span>}
              </div>
            </LockedValue>
          </div>

          <div className="border-t border-[#E8E6E1] pt-8 mt-8">
            <p className="text-xl font-bold text-[#1A1916] mb-4">Ingredients</p>
            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
              {report.composition_info?.trim()
                ? <ExpandableText text={report.composition_info} label="Ingredients" />
                : <span className="text-[#9E9C98]">—</span>}
            </LockedValue>
          </div>

          <div className="mt-8">
            <p className="text-xl font-bold text-[#1A1916] mb-4">Specifications</p>
            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
              {report.spec_summary?.trim()
                ? <ExpandableText text={report.spec_summary} label="Specifications" />
                : <span className="text-[#9E9C98]">—</span>}
            </LockedValue>
          </div>

          <div className="mt-8">
            <p className="text-xl font-bold text-[#1A1916] mb-4">Hazmat Summary</p>
            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
              {report.hazmat_summary?.trim()
                ? <ExpandableText text={report.hazmat_summary} label="Hazmat Summary" />
                : <span className="text-[#9E9C98]">—</span>}
            </LockedValue>
          </div>
        </div>

        <div className="bg-[#F8F7F4] rounded-2xl p-10">
          <p className="text-xl font-bold text-[#1A1916] mb-10">
            Compliance &amp; Logistics Strategy
          </p>
          <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="160px">
            <>
              {logisticsSteps.length > 0 && (
                <div className="space-y-16 mb-10">
                  {logisticsSteps.map((step, i) => (
                    <div key={i} className="relative flex gap-6">
                      <span
                        className="absolute -top-4 -left-2 text-[80px] font-black leading-none select-none pointer-events-none opacity-[0.03]"
                        style={{ color: "#1A1916" }}
                        aria-hidden="true"
                      >
                        {String(i + 4).padStart(2, "0")}
                      </span>
                      <div className="w-1 bg-[#16A34A] rounded-full shrink-0 self-stretch" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[#9E9C98] uppercase tracking-widest mb-2">
                          Step {i + 4}
                        </p>
                        <p className="text-base font-extrabold text-[#1A1916] mb-3">{step.label}</p>
                        <p className="text-lg text-[#1A1916] leading-relaxed whitespace-pre-line">
                          {step.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {(() => {
                const notes = report.shipping_notes?.trim();
                const hasNotes = notes && !/tier/i.test(notes);
                if (!hasNotes) return null;
                return (
                  <div className="border-t border-dashed border-[#E8E6E1] pt-8">
                    <p className="text-sm font-bold text-[#6B6860] tracking-widest mb-3">
                      Shipping Notes
                    </p>
                    <p className="text-sm italic text-[#6B6860] leading-relaxed">{notes}</p>
                  </div>
                );
              })()}
            </>
          </LockedValue>
        </div>

      </div>

      <div className="mt-6 pt-4 border-t border-[#E8E6E1]/50 flex flex-wrap items-center gap-2">
        <ShieldCheck className="w-3 h-3 text-[#9E9C98]/60 shrink-0" />
        <span className="text-[10px] text-[#9E9C98]/60 uppercase tracking-widest font-medium">
          Compliance &amp; Safety Cleared by:
        </span>
        <span className="text-[10px] text-[#9E9C98]/50 tracking-wide">
          FDA MoCRA · CPNP · INCIDecoder · EWG · CosDNA
        </span>
      </div>
    </section>
  );
}
