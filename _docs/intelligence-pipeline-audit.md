## 1. IntelligencePipeline 컴포넌트 파일 위치 확인

Requested command:
`find . -name "IntelligencePipeline*" -not -path "*/node_modules/*"`

Output (equivalent workspace search result):
```text
<workspace_result workspace_path="c:\k-productscout">
.\app\page.tsx
.\_docs\section-order-audit2.md
.\_docs\section-order-audit.md
.\_docs\timewidget-audit.md
.\_docs\_file_tree_naver_audit.txt
.\_docs\NAVER_PRODUCT_NAME_IMPLEMENTATION_AUDIT.md
.\scan_result.md
.\components\IntelligencePipeline.tsx
.\_docs\standard\PROJECT_2STATUS.md
</workspace_result>
```

## 2. IntelligencePipeline.tsx 전체 내용

Requested command:
`cat components/IntelligencePipeline.tsx`

Output:
```text
L1:const PILLS = [
L2:  { label: "TikTok", top: "0px", left: "0px", rot: "-1.2deg", delay: "0s", dur: "3.8s" },
L3:  { label: "Instagram", top: "4px", left: "68px", rot: "1deg", delay: "0.5s", dur: "4s" },
L4:  { label: "YouTube", top: "44px", left: "76px", rot: "-0.5deg", delay: "1s", dur: "4.2s" },
L5:  { label: "Olive Young", top: "52px", left: "0px", rot: "0.8deg", delay: "0.3s", dur: "3.6s" },
L6:  { label: "Daiso", top: "108px", left: "88px", rot: "-0.4deg", delay: "0.8s", dur: "4.1s" },
L7:  { label: "B2B Product Data", top: "112px", left: "0px", rot: "0.6deg", delay: "1.3s", dur: "3.9s" },
L8:] as const;
L9:
L10:const NOISE_ITEMS = ["Hazmat / Battery", "HS Code Blocked", "Margin Multiplier < 2.0×"] as const;
L11:
L12:const NOISE_LINES = ["Zero-margin trends purged", "Global market gaps detected"] as const;
L13:
L14:const KOREA_HQ_ROWS = [
L15:  { main: "Factory Direct Line", sub: "— Human-verified" },
L16:  { main: "Exact MOQ & Unit Cost", sub: "— EXW price locked" },
L17:  { main: "MoCRA / CPNP", sub: "— Compliance pre-cleared" },
L18:] as const;
L19:
L20:export default function IntelligencePipeline() {
L21:  return (
L22:    <section className="s6-section">
L23:      {/* HEADLINE */}
L24:      <div className="s6-headline">
L25:        <h2>We kill the risks.<br />You own the margin.</h2>
L26:        <p>
L27:          500+ signals scanned. Customs cleared. Factory verified. 10 export-ready winners, every
L28:          week.
L29:        </p>
L30:      </div>
L31:
L32:      {/* PIPELINE ROW */}
L33:      <div className="s6-row">
L34:        {/* 00. THE SIGNALS */}
L35:        <div className="s6-step">
L36:          <span className="s6-label">00. The Signals</span>
L37:          <div className="s6-pill-cloud">
L38:            {PILLS.map((p) => (
L39:              <span
L40:                key={p.label}
L41:                className="s6-pill"
L42:                style={{
L43:                  top: p.top,
L44:                  left: p.left,
L45:                  transform: `rotate(${p.rot})`,
L46:                  animationDelay: p.delay,
L47:                  animationDuration: p.dur,
L48:                  zIndex: p.label === "YouTube" || p.label === "Daiso" ? 4 : 2,
L49:                }}
L50:              >
L51:                {p.label}
L52:              </span>
L53:            ))}
L54:          </div>
L55:        </div>
L56:
L57:        {/* ARROW */}
L58:        <div className="s6-arrow-wrap">→</div>
L59:
L60:        {/* 01. THE NOISE FILTER */}
L61:        <div className="s6-step">
L62:          <span className="s6-label">01. The Noise Filter</span>
L63:          {NOISE_ITEMS.map((item) => (
L64:            <div key={item} className="s6-kill-row">
L65:              <span className="s6-kill-tag">KILL</span>
L66:              <span className="s6-kill-text">{item}</span>
L67:            </div>
L68:          ))}
L69:          <div className="s6-filter-desc">
L70:            {NOISE_LINES.map((line) => (
L71:              <p key={line}>
L72:                <span style={{ color: "rgba(10,9,8,0.2)", fontSize: "10px" }}>→</span>
L73:                {line}
L74:              </p>
L75:            ))}
L76:          </div>
L77:        </div>
L78:
L79:        {/* ARROW */}
L80:        <div className="s6-arrow-wrap">→</div>
L81:
L82:        {/* 02. KOREA HQ VERIFICATION */}
L83:        <div className="s6-step">
L84:          <span className="s6-label">02. Korea HQ Verification</span>
L85:          {KOREA_HQ_ROWS.map((row) => (
L86:            <div key={row.main} className="s6-verify-row">
L87:              <span className="s6-verify-check" aria-hidden>✓</span>
L88:              <div>
L89:                <div className="s6-v-main">{row.main}</div>
L90:                <div className="s6-v-sub">{row.sub}</div>
L91:              </div>
L92:            </div>
L93:          ))}
L94:        </div>
L95:
L96:        {/* ARROW */}
L97:        <div className="s6-arrow-wrap">→</div>
L98:
L99:        {/* 03. THE OUTPUT */}
L100:        <div className="s6-step">
L101:          <span className="s6-label">03. The Output</span>
L102:          <div className="s6-output-num">10+</div>
L103:          <p className="s6-output-desc">
L104:            Export-ready winners.
L105:            <br />
L106:            Every week.
L107:          </p>
L108:          <div className="s6-badge">
L109:            <div className="s6-badge-dot" />
L110:            <span>Ready to source</span>
L111:          </div>
L112:        </div>
L113:      </div>
L114:    </section>
L115:  );
L116:}
L117:
```

## 3. app/page.tsx에서 "We kill the risks" 관련 텍스트 위치 확인

Requested command:
`grep -n "kill\|margin\|signals\|Customs\|Factory\|export-ready\|winners\|500" app/page.tsx`

Output:
```text
<workspace_result workspace_path="c:\k-productscout">
app\page.tsx
  167:                    { text: "Verified Factory Cost ($) & MOQ", lock: false },
  169:                    { text: "Factory Sample Policy & Availability", lock: false },
  222:                      <LockIcon className="absolute inset-0 w-5 h-5 text-[#16A34A] transition-opacity duration-500 group-hover:opacity-0" />
  223:                      <UnlockIcon className="absolute inset-0 w-5 h-5 text-[#16A34A] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
  230:                        className="flex items-center gap-2 text-sm font-medium text-white/45 transition-colors duration-500 group-hover:text-white"
  233:                        <span className="text-[#16A34A]/70 shrink-0 group-hover:text-[#16A34A] transition-colors duration-500">–</span>
  374:                        "Profit Multiplier & Factory Unit Price (USD)",
  393:                        "Verified MOQ & Factory Price (EXW)",
  620:              By capping Alpha at exactly 3,000 spots—representing the top 0.006% of the global market—we mathematically minimize competition and protect your exclusive profit margins. We provide the verified intelligence. The execution is yours.
  699:                      &ldquo;Our philosophy is a perfect division of labor. We will relentlessly hunt down the best export-ready products in Seoul. You focus 100% on what you do best—scaling and dominating the global market.&rdquo;
</workspace_result>
```

## 4. app/page.tsx에서 해당 섹션 전체 확인 (IntelligencePipeline 앞뒤 50줄)

Requested command:
`grep -n "IntelligencePipeline" app/page.tsx`

Output:
```text
<workspace_result workspace_path="c:\k-productscout">
app\page.tsx
  6:import IntelligencePipeline from "@/components/IntelligencePipeline";
  258:        <IntelligencePipeline />
</workspace_result>
```

Additional context window (around `IntelligencePipeline`, ±50 lines):
```text
... 207 lines not shown ...
L208:                    <div className="flex flex-col gap-2">
L209:                      <span
L210:                        className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full w-fit"
L211:                        style={
L212:                          card.alpha
L213:                            ? { background: "rgb(22 163 74 / 0.12)", color: "#16A34A" }
L214:                            : { background: "rgb(248 247 244 / 0.08)", color: "rgba(248,247,244,0.5)" }
L215:                        }
L216:                      >
L217:                        {card.alpha ? "🔒" : "🟢"} {card.badge}
L218:                      </span>
L219:                      <p className="text-[20px] font-bold text-white leading-tight pr-2">&ldquo;{card.q}&rdquo;</p>
L220:                    </div>
L221:                    <div className="relative w-5 h-5 shrink-0 mt-1" aria-hidden>
L222:                      <LockIcon className="absolute inset-0 w-5 h-5 text-[#16A34A] transition-opacity duration-500 group-hover:opacity-0" />
L223:                      <UnlockIcon className="absolute inset-0 w-5 h-5 text-[#16A34A] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
L224:                    </div>
L225:                  </div>
L226:                  <ul className="space-y-2 flex-1">
L227:                    {card.items.map((item) => (
L228:                      <li
L229:                        key={item.text}
L230:                        className="flex items-center gap-2 text-sm font-medium text-white/45 transition-colors duration-500 group-hover:text-white"
L231:                        style={{ transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)" }}
L232:                      >
L233:                        <span className="text-[#16A34A]/70 shrink-0 group-hover:text-[#16A34A] transition-colors duration-500">–</span>
L234:                        {item.text}
L235:                        {item.lock && (
L236:                          <LockIcon className="w-3 h-3 text-[#16A34A]/60 shrink-0 ml-auto" />
L237:                        )}
L238:                      </li>
L239:                    ))}
L240:                  </ul>
L241:                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
L242:                    <p className="text-[14px] font-bold text-white">{card.cta}</p>
L243:                    <p className="text-[13px] font-black text-[#16A34A] uppercase tracking-[0.2em]">
L244:                      ⏱ {card.time}
L245:                    </p>
L246:                  </div>
L247:                </div>
L248:              ))}
L249:            </div>
L250:
L251:            <p className="mt-10 text-center text-[19px] font-normal text-[#16A34A]">
L252:              58 hours of manual research. Delivered in 1 second.
L253:            </p>
L254:          </div>
L255:        </section>
L256:
L257:        {/* ══ S6: THE INTELLIGENCE PIPELINE (Scout Engine) ═══════════════════════════════ */}
L258:        <IntelligencePipeline />
L259:
L260:        {/* ══ S7: INTELLIGENCE ENGINE (섹션4 최종.png — 100% clone) ════════════════════════════ */}
L261:        <section className="bg-[#0A0908] py-32 px-6">
L262:          <div className="max-w-6xl mx-auto">
L263:            <h2
L264:              className="font-black text-center text-white mb-3"
L265:              style={{
L266:                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
L267:                fontWeight: 900,
L268:                letterSpacing: "-0.04em",
L269:                lineHeight: 1.05,
L270:                textWrap: "balance",
L271:              } as React.CSSProperties}
L272:            >
L273:              Not a trend list.
L274:              <br />
L275:              A 6-layer intelligence brief —
L276:            </h2>
L277:            <p className="text-center text-white/60 font-medium mb-16 leading-relaxed max-w-2xl mx-auto" style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)" }}>
L278:              Battle-tested in Korea. What takes you 58 hours, takes our engine 4 minutes.
L279:            </p>
L280:
L281:            <div className="grid grid-cols-1 md:grid-cols-[0.45fr_0.55fr] gap-12 items-stretch">
L282:              {/* Left: 6-layer list — fill height, justify-between so 01/06 align with card top/bottom */}
L283:              <div className="flex flex-col justify-between min-h-0 h-full">
L284:                {[
L285:                  {
L286:                    n: "01",
L287:                    t: "Gap Index",
L288:                    d: "KR Local Score vs. Global Trend Score — calculated as a single integer gap. Gap 54 means the world hasn't caught up yet. That's your window.",
L289:                    s: "6 HRS",
L290:                  },
L291:                  {
L292:                    n: "02",
L293:                    t: "Margin Intelligence",
L294:                    d: "Verified cost vs. global retail price → profit multiplier. You see the real upside before you commit a single dollar.",
L295:                    s: "4 HRS",
L296:                  },
L297:                  {
L298:                    n: "03",
L299:                    t: "Trend Signals",
L300:                    d: "TikTok, Instagram velocity scores + new content volume growth signal. You see what's accelerating before it reaches your feed.",
L301:                    s: "8 HRS",
L302:                  },
L303:                  {
L304:                    n: "04",
L305:                    t: "Export Guard (Intelligence Estimate †)",
L306:                    d: "HS Code, Hazmat status, required certificates, package dimensions. Gives your customs broker a 90% head start. Not a legal guarantee.",
L307:                    s: "7 HRS",
L308:                  },
L309:                  {
L310:                    n: "05",
L311:                    t: "Direct Supplier Access",
L312:                    d: "Verified manufacturer name, MOQ, and direct contact email. Our Seoul team checks it. Not scraped. Human-verified.",
L313:                    s: "12 HRS",
L314:                  },
L315:                  {
L316:                    n: "06",
L317:                    t: "Launch Kit",
L318:                    d: "4K On-Site Sourcing Footage (Raw), SEO keywords, broker email draft. Day 1 ready to launch and scale.",
L319:                    s: "16+ HRS",
L320:                  },
L321:                ].map((layer) => (
L322:                  <div key={layer.n} className="flex gap-4">
L323:                    <div className="shrink-0 w-8 h-8 rounded-full border-2 border-[#16A34A] flex items-center justify-center bg-transparent">
L324:                      <span className="text-[10px] font-black text-white">{layer.n}</span>
L325:                    </div>
L326:                    <div>
L327:                      <p className="text-sm font-bold text-white mb-1">{layer.t}</p>
... 478 lines not shown ...
```

## 5. IntelligencePipeline 컴포넌트에서 알약/pill/signal 관련 텍스트 확인

Requested command:
`grep -n "TikTok\|Instagram\|YouTube\|Olive\|Daiso\|B2B\|Hwahae\|Naver\|Amazon\|pill\|signal\|SIGNAL\|KILL\|filter\|Filter\|Output\|OUTPUT\|Verification\|VERIFICATION\|margin\|Customs\|Factory" components/IntelligencePipeline.tsx`

Output:
```text
<workspace_result workspace_path="c:\k-productscout">
components\IntelligencePipeline.tsx
  2:  { label: "TikTok", top: "0px", left: "0px", rot: "-1.2deg", delay: "0s", dur: "3.8s" },
  3:  { label: "Instagram", top: "4px", left: "68px", rot: "1deg", delay: "0.5s", dur: "4s" },
  4:  { label: "YouTube", top: "44px", left: "76px", rot: "-0.5deg", delay: "1s", dur: "4.2s" },
  5:  { label: "Olive Young", top: "52px", left: "0px", rot: "0.8deg", delay: "0.3s", dur: "3.6s" },
  6:  { label: "Daiso", top: "108px", left: "88px", rot: "-0.4deg", delay: "0.8s", dur: "4.1s" },
  7:  { label: "B2B Product Data", top: "112px", left: "0px", rot: "0.6deg", delay: "1.3s", dur: "3.9s" },
  12:const NOISE_LINES = ["Zero-margin trends purged", "Global market gaps detected"] as const;
  15:  { main: "Factory Direct Line", sub: "— Human-verified" },
  25:        <h2>We kill the risks.<br />You own the margin.</h2>
  27:          500+ signals scanned. Customs cleared. Factory verified. 10 export-ready winners, every
  34:        {/* 00. THE SIGNALS */}
  37:          <div className="s6-pill-cloud">
  41:                className="s6-pill"
  48:                  zIndex: p.label === "YouTube" || p.label === "Daiso" ? 4 : 2,
  62:          <span className="s6-label">01. The Noise Filter</span>
  65:              <span className="s6-kill-tag">KILL</span>
  69:          <div className="s6-filter-desc">
  82:        {/* 02. KOREA HQ VERIFICATION */}
  84:          <span className="s6-label">02. Korea HQ Verification</span>
  99:        {/* 03. THE OUTPUT */}
  101:          <span className="s6-label">03. The Output</span>
</workspace_result>
```

## 6. DynamiteFuseSection 컴포넌트 전체 내용 (We kill the risks 여기있을수도)

Requested command:
`cat components/DynamiteFuseSection.tsx`

Output:
```text
L1:"use client";
L2:
L3:import { motion } from "framer-motion";
L4:
L5:const TOTAL_DURATION = 9;
L6:// 2단 일시정지: 0→25%(2s), [PAUSE 25% 1s], 25→80%(2.5s), [PAUSE 80% 2s], 80→100%(1.5s)
L7:const WIDTH_KEYFRAMES = ["0%", "25%", "25%", "80%", "80%", "100%"];
L8:const TIMES = [0, 0.222, 0.333, 0.611, 0.833, 1];
L9:
L10:// 용접 불꽃: 중심에서 사방으로 튀는 미세 입자 (거리 px, 각도 없이 x/y로 표현)
L11:const WELDING_PARTICLES = [
L12:  { burstX: 4, burstY: -3 },
L13:  { burstX: -3, burstY: -4 },
L14:  { burstX: 2, burstY: 3 },
L15:  { burstX: -4, burstY: 1 },
L16:  { burstX: 3, burstY: 4 },
L17:  { burstX: -2, burstY: -2 },
L18:  { burstX: 5, burstY: 0 },
L19:  { burstX: -3, burstY: 3 },
L20:  { burstX: 1, burstY: -4 },
L21:  { burstX: -4, burstY: -2 },
L22:  { burstX: 3, burstY: -3 },
L23:  { burstX: -2, burstY: 4 },
L24:  { burstX: 4, burstY: 2 },
L25:  { burstX: -1, burstY: -3 },
L26:];
L27:
L28:const TRAVEL_VARIANTS = {
L29:  travel: {
L30:    x: WIDTH_KEYFRAMES,
L31:    transition: {
L32:      duration: TOTAL_DURATION,
L33:      times: TIMES,
L34:      ease: "linear" as const,
L35:    },
L36:  },
L37:  extinguish: {
L38:    opacity: 0,
L39:    transition: { delay: TOTAL_DURATION, duration: 0.25 },
L40:  },
L41:};
L42:
L43:// 25%·80% 일시정지 구간: 스파클러 강도 상승 (그 자리에서 타오르는 연출)
L44:const PAUSE_INTENSITY_VARIANT = {
L45:  scale: [1, 1, 1.14, 1.14, 1.14, 1],
L46:  filter: [
L47:    "brightness(1)",
L48:    "brightness(1)",
L49:    "brightness(1.35)",
L50:    "brightness(1.35)",
L51:    "brightness(1.35)",
L52:    "brightness(1)",
L53:  ],
L54:  transition: { duration: TOTAL_DURATION, times: TIMES },
L55:};
L56:
L57:export default function DynamiteFuseSection() {
L58:  return (
L59:    <section className="bg-[#0A0908] pt-24 md:pt-32 pb-20 md:pb-28 px-6 overflow-x-clip">
L60:      <div className="max-w-5xl mx-auto flex flex-col items-center w-full overflow-x-clip">
L61:        <motion.div
L62:          className="w-full max-w-4xl mx-auto flex flex-col items-center overflow-x-clip px-4"
L63:          initial="hidden"
L64:          whileInView="visible"
L65:          viewport={{ once: true, amount: 0.3 }}
L66:          variants={{ hidden: {}, visible: {} }}
L67:        >
L68:          <div className="relative w-full overflow-x-clip min-w-0" style={{ height: "72px" }}>
L69:            {/* 기본 라인 — 1px white/10 */}
L70:            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px rounded-full bg-white/10" />
L71:
L72:            {/* 활성화 선: 9초 0%→25%→[PAUSE 1s]→80%→[PAUSE 2s]→100% (불꽃 이동과 동일) */}
L73:            <motion.div
L74:              className="absolute left-0 top-1/2 -translate-y-1/2 h-px rounded-full origin-left pointer-events-none bg-white"
L75:              initial={{ width: "0%" }}
L76:              whileInView="burn"
L77:              viewport={{ once: true, amount: 0.3 }}
L78:              variants={{
L79:                burn: {
L80:                  width: WIDTH_KEYFRAMES,
L81:                  transition: {
L82:                    duration: TOTAL_DURATION,
L83:                    times: TIMES,
L84:                    ease: "linear" as const,
L85:                  },
L86:                },
L87:              }}
L88:            />
L89:
L90:            {/* Left marker — Market Saturation Margin, 25% (1초 일시정지) */}
L91:            <div
L92:              className="absolute flex flex-col items-center pointer-events-none"
L93:              style={{ left: "25%", bottom: "50%", transform: "translate(-50%, 0)" }}
L94:            >
L95:              <motion.span
L96:                className="text-[9px] md:text-[14px] font-light tracking-tighter text-white/40 uppercase mb-1 whitespace-nowrap"
L97:                initial={{ opacity: 0 }}
L98:                whileInView="revealLeft"
L99:                viewport={{ once: true, amount: 0.3 }}
L100:                variants={{
L101:                  revealLeft: {
L102:                    opacity: 1,
L103:                    transition: { delay: 2, duration: 0.35 },
L104:                  },
L105:                }}
L106:              >
L107:                Market Saturation Margin
L108:              </motion.span>
L109:              <div className="w-px bg-white/30" style={{ height: "8px" }} />
L110:            </div>
L111:
L112:            {/* Right marker — KoreaScout Edge Potential, 80% (2초 일시정지) */}
L113:            <div
L114:              className="absolute flex flex-col items-center pointer-events-none"
L115:              style={{ left: "80%", bottom: "50%", transform: "translate(-50%, 0)" }}
L116:            >
L117:              <motion.span
L118:                className="text-[9px] md:text-[14px] font-light tracking-tighter text-white/40 uppercase mb-1 whitespace-nowrap"
L119:                style={{
L120:                  textShadow: "0 0 8px rgba(255,255,255,0.2), 0 0 16px rgba(255,255,255,0.08)",
L121:                }}
L122:                initial={{ opacity: 0 }}
L123:                whileInView="revealRight"
L124:                viewport={{ once: true, amount: 0.3 }}
L125:                variants={{
L126:                  revealRight: {
L127:                    opacity: 1,
L128:                    transition: { delay: 5.5, duration: 0.35 },
L129:                  },
L130:                }}
L131:              >
L132:                KoreaScout Edge Potential
L133:              </motion.span>
L134:              <div className="w-px bg-white/40" style={{ height: "8px" }} />
L135:            </div>
L136:
L137:            {/* ══ Welding Sparkler: 0→25%(2s)→[PAUSE 1s]→80%(2.5s)→[PAUSE 2s]→100%(1.5s) (정지 시 파티클은 그 자리에서 계속 타오름) ══ */}
L138:            <motion.div
L139:              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-full"
L140:              style={{ height: 0 }}
L141:              initial={{ x: "0%" }}
L142:              whileInView={["travel", "extinguish"]}
L143:              viewport={{ once: true, amount: 0.3 }}
L144:              variants={TRAVEL_VARIANTS}
L145:            >
L146:              {/* 25%·80% 정지 구간에 스파클 강도 상승 (폭발 직전 에너지) */}
L147:              <motion.div
L148:                className="absolute top-0 left-0 -translate-x-1/2 origin-center"
L149:                style={{ width: "2px", height: "2px" }}
L150:                initial={{ scale: 1, filter: "brightness(1)" }}
L151:                whileInView="pauseIntensity"
L152:                viewport={{ once: true, amount: 0.3 }}
L153:                variants={{ pauseIntensity: PAUSE_INTENSITY_VARIANT }}
L154:              >
L155:                {WELDING_PARTICLES.map((p, i) => (
L156:                  <motion.div
L157:                    key={i}
L158:                    className="absolute rounded-full bg-white"
L159:                    style={{
L160:                      left: 0,
L161:                      top: 0,
L162:                      width: "2px",
L163:                      height: "2px",
L164:                      boxShadow:
L165:                        "0 0 4px 1px rgba(255,255,255,0.95), 0 0 8px 2px rgba(255,255,255,0.5), 0 0 12px 2px rgba(255,255,255,0.25)",
L166:                    }}
L167:                    initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
L168:                    animate={{
L169:                      x: [0, p.burstX, p.burstX],
L170:                      y: [0, p.burstY, p.burstY],
L171:                      opacity: [0, 1, 0.15, 1, 0],
L172:                      scale: [0, 1.4, 0.6, 1.2, 0],
L173:                    }}
L174:                    transition={{
L175:                      duration: 0.12 + (i % 5) * 0.02,
L176:                      repeat: Infinity,
L177:                      repeatDelay: 0.02 + (i % 3) * 0.015,
L178:                      times: [0, 0.15, 0.5, 0.75, 1],
L179:                    }}
L180:                  />
L181:                ))}
L182:              </motion.div>
L183:            </motion.div>
L184:          </div>
L185:        </motion.div>
L186:
L187:        <div className="text-center mt-4 md:mt-5">
L188:          <h2
L189:            className="font-bold text-white text-4xl md:text-6xl mb-2"
L190:            style={{ letterSpacing: "-0.04em", lineHeight: 1.05, textWrap: "balance" }}
L191:          >
L192:            You aren&apos;t late to the trend.
L193:          </h2>
L194:          <h2
L195:            className="font-bold text-4xl md:text-6xl mb-6"
L196:            style={{ color: "#16A34A", letterSpacing: "-0.04em", lineHeight: 1.05, textWrap: "balance" }}
L197:          >
L198:            You&apos;re late to the profit.
L199:          </h2>
L200:          <p className="text-white/60 mt-6 max-w-2xl mx-auto leading-relaxed">
L201:            By the time a product trends on social media, the margin is already gone.
L202:          </p>
L203:        </div>
L204:      </div>
L205:    </section>
L206:  );
L207:}
L208:
```

## 7. page.tsx 전체에서 "kill" 또는 "margin" 텍스트 위치

Requested command:
`grep -n "kill\|You own" app/page.tsx`

Output:
```text
<workspace_result workspace_path="c:\k-productscout">
No matches found
</workspace_result>
```

AUDIT COMPLETE.
