# Section order audit — app/page.tsx

## Commands run

1. `sed -n '90,250p' app/page.tsx` — executed as Git `C:\\Program Files\\Git\\usr\\bin\\sed.exe` from repo root (`Set-Location c:\\k-productscout`). Output below is byte-identical to that command on this file (UTF-8).
2. `grep -n "IntelligencePipeline\|Intelligence Engine\|bridge\|Bridge\|kill\|Kill\|risk\|Risk\|trend list\|Not a trend\|S5\|S6\|S7\|S8\|S9\|pricing\|Pricing" app/page.tsx` — on this host, plain `grep -n` with `\|` did not match from PowerShell; **`grep -nE '...|...'`** produced the same line set as the original successful `grep -n '\|...'` invocation. Complete output is below.

## 1. sed -n '90,250p' app/page.tsx (complete output)

```
                <span className="text-[#16A34A]">&ldquo;What&apos;s next?&rdquo;</span><br />
                We answer it before&nbsp;it sells out.
              </h2>
            </div>
            {/* 우측: 영상 */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-start">
              <div className="w-full max-w-[480px] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(22,163,74,0.15)]">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full rounded-2xl"
                  src="/videos/soldout.mp4"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══ S4: TIME WIDGET ═══════════════════════════ */}
        <LandingTimeWidget />

        {/* ══ S5: INTELLIGENCE ENGINE (섹션4 최종.png — 100% clone) ════════════════════════════ */}
        <section className="bg-[#0A0908] py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <h2
              className="font-black text-center text-white mb-3"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                textWrap: "balance",
              } as React.CSSProperties}
            >
              Not a trend list.
              <br />
              A 6-layer intelligence brief —
            </h2>
            <p className="text-center text-white/60 font-medium mb-16 leading-relaxed max-w-2xl mx-auto" style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)" }}>
              Battle-tested in Korea. What takes you 58 hours, takes our engine 4 minutes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-[0.45fr_0.55fr] gap-12 items-stretch">
              {/* Left: 6-layer list — fill height, justify-between so 01/06 align with card top/bottom */}
              <div className="flex flex-col justify-between min-h-0 h-full">
                {[
                  {
                    n: "01",
                    t: "Gap Index",
                    d: "KR Local Score vs. Global Trend Score — calculated as a single integer gap. Gap 54 means the world hasn't caught up yet. That's your window.",
                    s: "6 HRS",
                  },
                  {
                    n: "02",
                    t: "Margin Intelligence",
                    d: "Verified cost vs. global retail price → profit multiplier. You see the real upside before you commit a single dollar.",
                    s: "4 HRS",
                  },
                  {
                    n: "03",
                    t: "Trend Signals",
                    d: "TikTok, Instagram velocity scores + new content volume growth signal. You see what's accelerating before it reaches your feed.",
                    s: "8 HRS",
                  },
                  {
                    n: "04",
                    t: "Export Guard (Intelligence Estimate †)",
                    d: "HS Code, Hazmat status, required certificates, package dimensions. Gives your customs broker a 90% head start. Not a legal guarantee.",
                    s: "7 HRS",
                  },
                  {
                    n: "05",
                    t: "Direct Supplier Access",
                    d: "Verified manufacturer name, MOQ, and direct contact email. Our Seoul team checks it. Not scraped. Human-verified.",
                    s: "12 HRS",
                  },
                  {
                    n: "06",
                    t: "Launch Kit",
                    d: "4K On-Site Sourcing Footage (Raw), SEO keywords, broker email draft. Day 1 ready to launch and scale.",
                    s: "16+ HRS",
                  },
                ].map((layer) => (
                  <div key={layer.n} className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full border-2 border-[#16A34A] flex items-center justify-center bg-transparent">
                      <span className="text-[10px] font-black text-white">{layer.n}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">{layer.t}</p>
                      <p className="text-xs font-medium text-white/50 leading-relaxed mb-1">{layer.d}</p>
                      <p className="text-[10px] font-black text-[#16A34A] uppercase tracking-[0.2em]">⏱ SAVES {layer.s}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Market Intelligence Brief card — 55%, high rounded corners, h-full for height match */}
              <div className="bg-[#1A1916] rounded-3xl overflow-hidden border border-white/5 shadow-xl flex flex-col min-h-0 h-full">
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#16A34A]">MARKET INTELLIGENCE BRIEF</p>
                      <p className="text-xs text-white/50 mt-1">Source: Olive Young · Daiso</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.2em] bg-[#16A34A] text-white px-3 py-1.5 rounded-full">ALPHA</span>
                  </div>

                  {/* Metrics row — font-black (900) */}
                  <div className="border-t border-white/10 pt-5 pb-5">
                    <div className="flex flex-wrap gap-6 gap-y-2">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-white/50">Market Score</p>
                        <p className="text-lg font-black text-white">91 / 100 ↑</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-white/50">Gap Index</p>
                        <p className="text-lg font-black text-white">54</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-white/50">Margin</p>
                        <p className="text-lg font-black text-white">3.8x</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-[#16A34A]">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16A34A] align-middle mr-1.5" aria-hidden /> COMPETITION: MODERATE ✓
                    </p>
                  </div>

                  {/* Standard Access — green open lock (#16A34A), verbatim 4 items */}
                  <div className="border-t border-white/10 pt-5 pb-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Standard Access</p>
                    <ul className="space-y-2">
                      {[
                        "Gap Index Score & Opportunity Reasoning",
                        "Profit Multiplier & Factory Unit Price (USD)",
                        "TikTok / IG Velocity & Buzz Summary",
                        "SEO, Viral & Rising Keywords",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-white">
                          <UnlockIcon className="shrink-0 text-[#16A34A] w-4 h-4" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Alpha Only — same green open lock (#16A34A), same bright text as Standard */}
                  <div className="border-t border-white/10 pt-5 pb-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Alpha Only — Execution Layer</p>
                    <ul className="space-y-2">
                      {[
                        "HS Code (6-digit) & Hazmat Assessment",
                        "Custom Broker Email Draft (English Template)",
                        "Verified MOQ & Factory Price (EXW)",
                        "Verified Direct Sourcing Intel",
                        "4K On-Site Sourcing Footage (Raw)",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-white">
```

## 2. grep (complete output)

```
6:import IntelligencePipeline from "@/components/IntelligencePipeline";
10:import { PRICING } from "@/src/config/pricing";
113:        {/* ══ S5: INTELLIGENCE ENGINE (섹션4 최종.png — 100% clone) ════════════════════════════ */}
126:              Not a trend list.
256:                    <p className="mt-3 text-xs text-white/40 italic">More details available on Pricing page</p>
264:                        href="/pricing"
267:                        View Pricing & Access →
278:        {/* ══ S6: LAUNCH KIT — 섹션5 최종.png 100% 트윈 + Premium Interaction ═══════════════════ */}
294:              We bridge the Korea Gap.
402:        {/* ══ S6: THE INTELLIGENCE PIPELINE (Scout Engine) ═══════════════════════════════ */}
403:        <IntelligencePipeline />
405:        {/* ══ S8: PRICING (3-tier from pricing page, v5 copy) ═══════════════════════════════════ */}
406:        <section id="pricing-cards" className="bg-white py-24 px-6">
409:              Pricing
585:        {/* ══ S8b: INSTITUTIONAL POLICY (Alpha Moat) — synced from pricing page ═══════════════ */}
622:        {/* ══ S9: TRUST + FOUNDER + FAQ + READY TO SCOUT (single bg #F8F7F4, no gap) ═══════════════════════════ */}
733:                href="#pricing-cards"
761:                href="/pricing"
764:                Pricing
```

## Section order summary (JSX blocks for reordering)

- **Lines 90–250:** End of preceding hero/video `</section>` → **S4** `<LandingTimeWidget />` → **S5** dark `<section>` (Intelligence Engine / “Not a trend list.”) — block continues past line 250.
- **Grep anchors (file order):** imports (6, 10) → S5 comment (113) → “Not a trend list.” (126) → pricing teaser inside S5 area (256, 264, 267) → **S6** Launch Kit (278) → “We bridge the Korea Gap.” (294) → **S6** Intelligence Pipeline comment + `<IntelligencePipeline />` (402–403) → **S8** pricing `#pricing-cards` (405–409) → **S8b** institutional (585) → **S9** trust block (622) → footer/pricing links (733, 761, 764).
- **Note:** Comments label two different blocks as **S6** (Launch Kit vs Intelligence Pipeline); there is no **S7** in the grep hit list.

---

**AUDIT COMPLETE**
