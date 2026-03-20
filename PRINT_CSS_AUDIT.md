# PRINT_CSS_AUDIT

## SCAN 1 - Existing `@media print` rules

File: `components/ZombieWatermark.tsx`

```tsx
L30:        @media print {
L31:          #ghost-watermark span {
L32:            opacity: 0.15 !important;
L33:          }
L34:        }
L35:      `}</style>
L36:
L37:      <div
L38:        id="ghost-watermark"
L39:        ref={containerRef}
L40:        style={{
L41:          position: "fixed",
L42:          top: 0,
L43:          left: 0,
L44:          width: "100vw",
L45:          height: "100vh",
L46:          pointerEvents: "none",
L47:          zIndex: 9999,
L48:          overflow: "hidden",
L49:          printColorAdjust: "exact",
L50:          WebkitPrintColorAdjust: "exact",
L51:        }}
L52:      >
L53:        {Array.from({ length: 4 }).map((_, row) =>
L54:          Array.from({ length: 3 }).map((_, col) => (
L55:            <span
L56:              key={`${row}-${col}`}
L57:              style={{
L58:                position: "absolute",
L59:                top: `${row * 30}%`,
L60:                left: `${col * 40 - 10}%`,
L61:                transform: "rotate(-30deg)",
L62:                fontSize: "11px",
L63:                color: "#1A1916",
L64:                opacity: 0.028,
L65:                whiteSpace: "nowrap",
L66:                userSelect: "none",
L67:                fontWeight: 200,
L68:              }}
L69:            >
L70:              {text}
L71:            </span>
L72:          ))
L73:        )}
L74:      </div>
L75:    </>
L76:  );
L77:}
L78:
L79:
```

## SCAN 2 - Global CSS file content

Found: `app/globals.css`

`global.css` not found (excluding `node_modules`)

```css
L1:@import "tailwindcss";
L2:
L3:@theme inline {
L4:  /* ── BRAND COLORS ── */
L5:  --color-cream-50:  #FDFCFA;
L6:  --color-cream-100: #F8F7F4;
L7:  --color-cream-200: #F2F1EE;
L8:  --color-cream-300: #E8E6E1;
L9:  --color-cream-400: #D4D1CA;
L10:
L11:  --color-ink-900:   #1A1916;
L12:  --color-ink-700:   #3D3B36;
L13:  --color-ink-500:   #6B6860;
L14:  --color-ink-300:   #9E9C98;
L15:  --color-ink-200:   #C4C2BE;
L16:  --color-ink-100:   #E4E2DE;
L17:
L18:  --color-accent:         #16A34A;
L19:  --color-accent-hover:   #15803D;
L20:  --color-accent-light:   #DCFCE7;
L21:  --color-accent-muted:   #BBF7D0;
L22:
L23:  --color-danger:         #DC2626;
L24:  --color-danger-light:  #FEE2E2;
L25:  --color-warning:        #D97706;
L26:  --color-warning-light:  #FEF3C7;
L27:  --color-info:           #2563EB;
L28:  --color-info-light:     #DBEAFE;
L29:
L30:  /* ── SEMANTIC ALIASES ── */
L31:  --color-bg-page:        var(--color-cream-100);
L32:  --color-bg-card:        #FFFFFF;
L33:  --color-bg-subcard:     var(--color-cream-200);
L34:  --color-border:         var(--color-cream-300);
L35:  --color-border-strong:  var(--color-cream-400);
L36:  --color-text-primary:   var(--color-ink-900);
L37:  --color-text-secondary: var(--color-ink-500);
L38:  --color-text-tertiary:  var(--color-ink-300);
L39:
L40:  /* ── TYPOGRAPHY ── */
L41:  --font-sans:  'Inter', system-ui, -apple-system, sans-serif;
L42:  --font-mono:  'JetBrains Mono', 'Fira Code', monospace;
L43:
L44:  /* ── RADIUS ── */
L45:  --radius-sm:  0.375rem;  /* 6px  — badges, pills */
L46:  --radius-md:  0.5rem;    /* 8px  — inputs, buttons */
L47:  --radius-lg:  0.75rem;   /* 12px — small cards */
L48:  --radius-xl:  1rem;      /* 16px — cards */
L49:  --radius-2xl: 1.5rem;    /* 24px — section wrappers */
L50:
L51:  /* ── SHADOWS ── */
L52:  --shadow-card:    0 1px 3px 0 rgb(26 25 22 / 0.06), 0 1px 2px -1px rgb(26 25 22 / 0.04);
L53:  --shadow-elevated: 0 4px 6px -1px rgb(26 25 22 / 0.08), 0 2px 4px -2px rgb(26 25 22 / 0.05);
L54:  --shadow-modal:   0 20px 25px -5px rgb(26 25 22 / 0.1);
L55:}
L56:
L57:@layer base {
L58:  body {
L59:    background-color: var(--color-bg-page);
L60:    color: var(--color-text-primary);
L61:    font-family: var(--font-sans);
L62:    font-size: 1.0625rem; /* ~17px — global UI scale-up for 100% zoom */
L63:    -webkit-font-smoothing: antialiased;
L64:  }
L65:
L66:  * {
L67:    border-color: var(--color-border);
L68:  }
L69:}
L70:
L71::root {
L72:  --background: #030303;
L73:  --foreground: #ffffff;
L74:  --indigo: #6366f1;
L75:  --purple: #a855f7;
L76:  --amber: #f59e0b;
L77:  --bg-card: #0d0d0f;
L78:  --border: rgba(255, 255, 255, 0.08);
L79:  --text-muted: rgba(255, 255, 255, 0.45);
L80:  --text-mid: rgba(255, 255, 255, 0.7);
L81:}
L82:
L83:html {
L84:  scroll-behavior: smooth;
L85:}
L86:
L87:@keyframes hero-fade-in {
L88:  from {
L89:    opacity: 0;
L90:    transform: translateY(8px);
L91:  }
L92:  to {
L93:    opacity: 1;
L94:    transform: translateY(0);
L95:  }
L96:}
L97:
L98:.animate-hero-fade-in {
L99:  animation: hero-fade-in 0.8s ease-out both;
L100:}
L101:
L102:@keyframes s2-scale-noise {
L103:  to {
L104:    opacity: 1;
L105:  }
L106:}
L107:
L108:@keyframes s2-scale-alpha {
L109:  to {
L110:    opacity: 1;
L111:  }
L112:}
L113:
L114:@keyframes floatDrift {
L115:  0%   { transform: translateY(0px) rotate(var(--r, 0deg)); }
L116:  100% { transform: translateY(-6px) rotate(var(--r, 0deg)); }
L117:}
L118:@keyframes pulse {
L119:  0%, 100% { opacity: 1; transform: scale(1); }
L120:  50%      { opacity: 0.5; transform: scale(0.85); }
L121:}
L122:
L123:/* ── S6 Pipeline ── */
L124:@keyframes floatDrift {
L125:  0%   { transform: translateY(0px); }
L126:  100% { transform: translateY(-8px); }
L127:}
L128:@keyframes pulseDot {
L129:  0%, 100% { opacity: 1; transform: scale(1); }
L130:  50%       { opacity: 0.5; transform: scale(0.8); }
L131:}
L132:
L133:.s6-section {
L134:  background: #F8F7F4;
L135:  padding: clamp(80px, 10vw, 140px) clamp(32px, 6vw, 100px);
L136:}
L137:
L138:.s6-headline {
L139:  text-align: center;
L140:  margin-bottom: 80px;
L141:}
L142:.s6-headline h2 {
L143:  font-size: clamp(2rem, 4.5vw, 3.5rem);
L144:  font-weight: 900;
L145:  letter-spacing: -0.04em;
L146:  color: #0A0908;
L147:  line-height: 1.05;
L148:  margin-bottom: 16px;
L149:}
L150:.s6-headline p {
L151:  font-size: 14px;
L152:  color: rgba(10,9,8,0.4);
L153:  font-weight: 400;
L154:}
L155:
L156:/* ── 데스크탑: 가로 flex (max-w-6xl 정렬) ── */
L157:.s6-row {
L158:  display: flex;
L159:  flex-direction: row;
L160:  align-items: flex-start;
L161:  justify-content: space-between;
L162:  max-width: 72rem; /* 1152px, max-w-6xl */
L163:  margin: 0 auto;
L164:  gap: 0;
L165:}
L166:
L167:.s6-step {
L168:  flex: 0 0 auto;
L169:  width: 200px;
L170:  display: flex;
L171:  flex-direction: column;
L172:  align-items: flex-start;
L173:}
L174:
L175:.s6-arrow-wrap {
L176:  flex: 0 0 auto;
L177:  width: 40px;
L178:  display: flex;
L179:  align-items: flex-start;
L180:  justify-content: flex-start;
L181:  padding-top: 2px;
L182:  color: rgba(10,9,8,0.18);
L183:  font-size: 1.2rem;
L184:  font-weight: 300;
L185:}
L186:
L187:.s6-label {
L188:  font-size: 12px;
L189:  font-weight: 900;
L190:  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
L191:  letter-spacing: 0.2em;
L192:  text-transform: uppercase;
L193:  color: #16A34A;
L194:  line-height: 1;
L195:  margin-bottom: 18px;
L196:  display: block;
L197:  text-align: left;
L198:}
L199:
L200:/* ── PILL CLOUD ── */
L201:.s6-pill-cloud {
L202:  position: relative;
L203:  width: 200px;
L204:  height: 180px;
L205:}
L206:.s6-pill {
L207:  position: absolute;
L208:  background: #FFFFFF;
L209:  border: 1px solid rgba(10,9,8,0.07);
L210:  border-radius: 999px;
L211:  padding: 6px 14px;
L212:  font-size: 12px;
L213:  font-weight: 500;
L214:  color: #0A0908;
L215:  box-shadow: 0 2px 8px rgba(10,9,8,0.06);
L216:  white-space: nowrap;
L217:  animation: floatDrift 4s ease-in-out infinite alternate;
L218:}
L219:
L220:/* ── KILL ROW ── */
L221:.s6-kill-row {
L222:  display: flex;
L223:  align-items: center;
L224:  gap: 8px;
L225:  padding: 8px 0;
L226:}
L227:.s6-kill-tag {
L228:  font-size: 9px;
L229:  font-weight: 900;
L230:  letter-spacing: 0.15em;
L231:  text-transform: uppercase;
L232:  color: #B91C1C;
L233:  background: rgba(185,28,28,0.07);
L234:  border-radius: 4px;
L235:  padding: 2px 6px;
L236:  flex-shrink: 0;
L237:}
L238:.s6-kill-text {
L239:  font-size: 12px;
L240:  color: rgba(10,9,8,0.5);
L241:  font-weight: 400;
L242:  text-decoration: line-through;
L243:  text-decoration-color: rgba(185,28,28,0.35);
L244:  white-space: nowrap;
L245:}
L246:.s6-filter-desc {
L247:  margin-top: 12px;
L248:  display: flex;
L249:  flex-direction: column;
L250:  gap: 4px;
L251:}
L252:.s6-filter-desc p {
L253:  font-size: 12px;
L254:  color: rgba(10,9,8,0.4);
L255:  display: flex;
L256:  align-items: center;
L257:  gap: 6px;
L258:  white-space: nowrap;
L259:}
L260:
L261:/* ── VERIFY ROW ── */
L262:.s6-verify-row {
L263:  display: flex;
L264:  align-items: flex-start;
L265:  gap: 10px;
L266:  padding: 9px 0;
L267:}
L268:.s6-verify-check {
L269:  display: inline-flex;
L270:  align-items: center;
L271:  justify-content: center;
L272:  width: 20px;
L273:  height: 20px;
L274:  min-width: 20px;
L275:  border-radius: 50%;
L276:  background: #16A34A;
L277:  color: #FFFFFF;
L278:  font-size: 12px;
L279:  font-weight: 900;
L280:  flex-shrink: 0;
L281:  margin-top: 3px;
L282:}
L283:.s6-v-main {
L284:  font-size: 14px;
L285:  color: #0A0908;
L286:  font-weight: 600;
L287:  white-space: nowrap;
L288:  line-height: 1.4;
L289:  -webkit-font-smoothing: antialiased;
L290:}
L291:.s6-v-sub {
L292:  font-size: 11px;
L293:  color: rgba(10,9,8,0.4);
L294:  font-weight: 400;
L295:  white-space: nowrap;
L296:  margin-top: 1px;
L297:}
L298:
L299:/* ── OUTPUT ── */
L300:.s6-output-num {
L301:  font-size: clamp(4rem, 7vw, 6rem);
L302:  font-weight: 900;
L303:  color: #16A34A;
L304:  letter-spacing: -0.02em;
L305:  line-height: 1;
L306:  margin: 4px 0 8px;
L307:  text-align: left;
L308:  -webkit-font-smoothing: antialiased;
L309:}
L310:.s6-output-desc {
L311:  font-size: 13px;
L312:  color: rgba(10,9,8,0.45);
L313:  line-height: 1.7;
L314:  text-align: left;
L315:}
L316:.s6-badge {
L317:  display: inline-flex;
L318:  align-items: center;
L319:  gap: 6px;
L320:  margin-top: 14px;
L321:  padding: 4px 12px;
L322:  border: 1px solid rgba(22,163,74,0.25);
L323:  border-radius: 999px;
L324:  background: rgba(22,163,74,0.05);
L325:}
L326:.s6-badge-dot {
L327:  width: 5px;
L328:  height: 5px;
L329:  border-radius: 50%;
L330:  background: #16A34A;
L331:  animation: pulseDot 2s infinite;
L332:}
L333:.s6-badge span {
L334:  font-size: 9px;
L335:  font-weight: 800;
L336:  letter-spacing: 0.2em;
L337:  text-transform: uppercase;
L338:  color: #16A34A;
L339:}
L340:
L341:/* ── 모바일 (768px 이하) ── */
L342:@media (max-width: 768px) {
L343:  .s6-row {
L344:    flex-direction: column;
L345:    gap: 0;
L346:    align-items: stretch;
L347:  }
L348:  .s6-step {
L349:    width: 100%;
L350:    padding: 28px 0;
L351:    border-bottom: 1px solid rgba(10,9,8,0.07);
L352:  }
L353:  .s6-step:last-child {
L354:    border-bottom: none;
L355:  }
L356:  .s6-arrow-wrap {
L357:    display: none;
L358:  }
L359:  .s6-pill-cloud {
L360:    width: 100%;
L361:    height: 160px;
L362:  }
L363:}
L364:
```

## SCAN 3 - Tailwind config for `print:` utilities

Found `tailwind.config.*` files (excluding `node_modules`): none

`print:` utility matches (TSX/JS/CSS/SCSS):
- No matches found

## SCAN 4 - Product detail page route files (first 80 lines)

`find . -path "*/weekly/*" -name "*.tsx"` results (first 80 lines):

`find . -path "*/weekly/*" -name "*.jsx"` results (first 80 lines): none found (excluding `node_modules`)

`find . -name "[id].tsx"` results (first 80 lines): none found (excluding `node_modules`)

File: `app/weekly/MonthAccordion.tsx`

```tsx
L1:"use client";
L2:
L3:import React from "react";
L4:import { ChevronDown } from "lucide-react";
L5:
L6:export function MonthAccordion({
L7:  monthLabel,
L8:  monthKey,
L9:  currentMonthKey,
L10:  defaultOpen,
L11:  children,
L12:}: {
L13:  monthLabel: string;
L14:  monthKey: string;
L15:  currentMonthKey: string;
L16:  /** When true, accordion is open on first render. Use e.g. index === 0 for first item. */
L17:  defaultOpen?: boolean;
L18:  children: React.ReactNode;
L19:}) {
L20:  const [open, setOpen] = React.useState(
L21:    defaultOpen !== undefined ? defaultOpen : monthKey === currentMonthKey
L22:  );
L23:  return (
L24:    <div className="rounded-none border border-[#E8E6E1] border-t-0 first:border-t first:rounded-t-2xl last:rounded-b-2xl overflow-hidden shadow-[0_1px_4px_0_rgb(26_25_22/0.06)] bg-white">
L25:      <button
L26:        type="button"
L27:        onClick={() => setOpen((o) => !o)}
L28:        className="w-full flex items-center justify-between px-8 py-5 bg-[#F8F7F4] hover:bg-[#F0EDE8] transition-colors border-b border-[#E8E6E1]"
L29:      >
L30:        <span className="text-xl font-bold text-[#1A1916] tracking-tight uppercase">
L31:          {monthLabel}
L32:        </span>
L33:        <span
L34:          className="text-[#1A1916] transition-transform duration-200"
L35:          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
L36:        >
L37:          <ChevronDown className="w-6 h-6" strokeWidth={2.5} />
L38:        </span>
L39:      </button>
L40:      {open && (
L41:        <div className="px-6 pb-6 pt-4 bg-[#F8F7F4] space-y-4 border-b border-[#E8E6E1]">
L42:          {children}
L43:        </div>
L44:      )}
L45:    </div>
L46:  );
L47:}
```

File: `app/weekly/page.tsx`

```tsx
L1:import React from "react";
L2:import { createClient } from "@/lib/supabase/server";
L3:import { getAuthTier } from "@/lib/auth-server";
L4:import Link from "next/link";
L5:import { redirect } from "next/navigation";
L6:import { ChevronLeft, ChevronRight, FileText, Lock } from "lucide-react";
L7:import { MonthAccordion } from "./MonthAccordion";
L8:
L9:const FREE_DELAY_DAYS = 14;
L10:
L11:function formatAvailableDate(publishedAt: string): string {
L12:  const d = new Date(publishedAt);
L13:  d.setDate(d.getDate() + FREE_DELAY_DAYS);
L14:  return d.toLocaleDateString("en-US", {
L15:    month: "short",
L16:    day: "numeric",
L17:    year: "numeric",
L18:  });
L19:}
L20:
L21:function formatPublishedDate(publishedAt: string | null): string {
L22:  if (!publishedAt) return "";
L23:  const d = new Date(publishedAt);
L24:  const y = d.getFullYear();
L25:  const m = String(d.getMonth() + 1).padStart(2, "0");
L26:  const day = String(d.getDate()).padStart(2, "0");
L27:  return `${y}.${m}.${day}`;
L28:}
L29:
L30:function isWeekAvailableForFree(publishedAt: string | null): boolean {
L31:  if (!publishedAt) return false;
L32:  const freeAt = new Date(publishedAt);
L33:  freeAt.setDate(freeAt.getDate() + FREE_DELAY_DAYS);
L34:  return new Date() >= freeAt;
L35:}
L36:
L37:/** True if published in the past and within the last N days. */
L38:function isWithinLastNDays(publishedAtString: string | null, days: number): boolean {
L39:  if (!publishedAtString) return false;
L40:  const publishDate = new Date(publishedAtString);
L41:  const today = new Date();
L42:  const diffTime = today.getTime() - publishDate.getTime();
L43:  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
L44:  return diffDays >= 0 && diffDays <= days;
L45:}
L46:
L47:type WeekRow = {
L48:  week_id: string;
L49:  week_label: string | null;
L50:  start_date: string | null;
L51:  end_date: string | null;
L52:  published_at: string | null;
L53:  product_count: number | null;
L54:  summary: string | null;
L55:  scout_final_reports?: { count: number }[];
L56:};
L57:type MonthGroup = {
L58:  monthKey: string;
L59:  monthLabel: string;
L60:  weeks: WeekRow[];
L61:};
L62:
L63:export default async function WeeklyHubPage() {
L64:  const supabase = await createClient();
L65:  const { userId, tier, subscriptionStartAt } = await getAuthTier();
L66:
L67:  if (!userId) {
L68:    redirect("/login");
L69:  }
L70:
L71:  const isPaid = tier === "standard" || tier === "alpha";
L72:
L73:  const { data: weeks, error } = await supabase
L74:    .from("weeks")
L75:    .select("week_id, week_label, start_date, end_date, published_at, product_count, summary, scout_final_reports(count)")
L76:    .filter("scout_final_reports.status", "eq", "published")
L77:    .eq("status", "published")
L78:    .order("start_date", { ascending: false });
L79:
L80:  if (error) {
```

File: `app/weekly/[weekId]/page.tsx`

```tsx
L1:import { createClient } from "@/lib/supabase/server";
L2:import { getAuthTier } from "@/lib/auth-server";
L3:import Link from "next/link";
L4:import { notFound, redirect } from "next/navigation";
L5:import Image from "next/image";
L6:import { ChevronLeft, ImageOff, ArrowRight } from "lucide-react";
L7:import { FavoriteButton } from "@/components/FavoriteButton";
L8:
L9:export default async function ProductListPage({
L10:  params,
L11:}: {
L12:  params: Promise<{ weekId: string }>;
L13:}) {
L14:  const { weekId } = await params;
L15:  const supabase = await createClient();
L16:  const { userId, tier, subscriptionStartAt } = await getAuthTier();
L17:
L18:  if (!userId) redirect("/login");
L19:
L20:  const isPaid = tier === "standard" || tier === "alpha";
L21:
L22:  const { data: week, error: weekError } = await supabase
L23:    .from("weeks")
L24:    .select("week_id, week_label, product_count, summary, published_at")
L25:    .eq("week_id", weekId)
L26:    .eq("status", "published")
L27:    .single();
L28:
L29:  if (weekError || !week) notFound();
L30:
L31:  const { data: latest3Weeks } = await supabase
L32:    .from("weeks")
L33:    .select("week_id")
L34:    .eq("status", "published")
L35:    .order("published_at", { ascending: false })
L36:    .limit(3);
L37:  const latest3WeekIds = (latest3Weeks ?? []).map((w) => w.week_id);
L38:  const isLatestWeek = latest3WeekIds.includes(weekId);
L39:
L40:  let canAccess = false;
L41:  if (isPaid) {
L42:    const isAfterSub =
L43:      subscriptionStartAt && week.published_at
L44:        ? new Date(week.published_at) >= new Date(subscriptionStartAt)
L45:        : false;
L46:    canAccess = isLatestWeek || isAfterSub;
L47:  } else {
L48:    const { data: allWeeks } = await supabase
L49:      .from("weeks")
L50:      .select("week_id, published_at")
L51:      .eq("status", "published");
L52:    const freeOpenWeekId =
L53:      allWeeks
L54:        ?.filter((w) => {
L55:          if (!w.published_at) return false;
L56:          const freeAt = new Date(w.published_at);
L57:          freeAt.setDate(freeAt.getDate() + 14);
L58:          return new Date() >= freeAt;
L59:        })
L60:        .sort(
L61:          (a, b) =>
L62:            new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime()
L63:        )[0]?.week_id ?? null;
L64:    canAccess = weekId === freeOpenWeekId;
L65:  }
L66:
L67:  if (!canAccess) {
L68:    return (
L69:      <div className="min-h-screen bg-[#F8F7F4] pt-20">
L70:        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
L71:          <Link
L72:            href="/weekly"
L73:            className="text-sm text-[#9E9C98] hover:text-[#1A1916] transition-colors flex items-center gap-1 mb-6"
L74:          >
L75:            ← Weekly Reports
L76:          </Link>
L77:          <h1 className="text-2xl font-bold text-[#1A1916] mb-2">
L78:            {week.week_label}
L79:          </h1>
L80:          <div className="rounded-2xl border border-[#E8E6E1] bg-white p-10 text-center mt-8">
```

File: `app/weekly/[weekId]/[id]/page.tsx`

```tsx
L1:import { createClient } from "@/lib/supabase/server";
L2:import { getAuthTier, maskReportByTier } from "@/lib/auth-server";
L3:import Link from "next/link";
L4:import { notFound } from "next/navigation";
L5:import { PRICING } from "@/src/config/pricing";
L6:import { ClientLeftNav } from "@/components/layout/ClientLeftNav";
L7:import ProductIdentity from "@/components/ProductIdentity";
L8:import {
L9:  TrendSignalDashboard,
L10:  MarketIntelligence,
L11:  SocialProofTrendIntelligence,
L12:  SourcingIntel,
L13:  SupplierContact,
L14:  EXPORT_STATUS_DISPLAY,
L15:} from "@/components/report";
L16:import ZombieWatermark from "@/components/ZombieWatermark";
L17:import type { ScoutFinalReportsRow } from "@/types/database";
L18:
L19:export default async function ProductDetailPage({
L20:  params,
L21:}: {
L22:  params: Promise<{ weekId: string; id: string }>;
L23:}) {
L24:  const { weekId, id } = await params;
L25:  const supabase = await createClient();
L26:  const { userId, userEmail, tier, subscriptionStartAt } = await getAuthTier();
L27:
L28:  const [
L29:    { data: report, error },
L30:    { data: weekReports },
L31:    { data: week },
L32:    { data: favoriteRow },
L33:  ] = await Promise.all([
L34:    supabase
L35:      .from("scout_final_reports")
L36:      .select("*")
L37:      .eq("id", id)
L38:      .eq("week_id", weekId)
L39:      .eq("status", "published")
L40:      .single(),
L41:    supabase
L42:      .from("scout_final_reports")
L43:      .select("id")
L44:      .eq("week_id", weekId)
L45:      .eq("status", "published")
L46:      .order("created_at", { ascending: true }),
L47:    supabase.from("weeks").select("week_label, published_at").eq("week_id", weekId).single(),
L48:    userId
L49:      ? supabase
L50:          .from("user_favorites")
L51:          .select("report_id")
L52:          .eq("user_id", userId)
L53:          .eq("report_id", id)
L54:          .maybeSingle()
L55:      : Promise.resolve({ data: null }),
L56:  ]);
L57:  const { data: freeWeek } = await supabase
L58:    .from("weeks")
L59:    .select("week_id, published_at")
L60:    .eq("status", "published")
L61:    .lt("published_at", new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
L62:    .order("published_at", { ascending: false })
L63:    .limit(1)
L64:    .single();
L65:  const { data: latest3Weeks } = await supabase
L66:    .from("weeks")
L67:    .select("week_id")
L68:    .eq("status", "published")
L69:    .order("published_at", { ascending: false })
L70:    .limit(3);
L71:  const latest3WeekIds = (latest3Weeks ?? []).map((w) => w.week_id);
L72:  const isFavorited = !!favoriteRow?.report_id;
L73:
L74:  if (error || !report) notFound();
L75:
L76:  const isTeaser = report.is_teaser === true;
L77:
L78:  const canAccessThisWeek = (() => {
L79:    if (tier === "free") {
L80:      return freeWeek?.week_id === weekId;
```

`find . -name "page.tsx" ... | grep -i "weekly\|product\|detail\|report"` results:

File: `app/sample-report/page.tsx`

```tsx
L1:import Link from "next/link";
L2:import ProductIdentity from "@/components/ProductIdentity";
L3:import {
L4:  TrendSignalDashboard,
L5:  MarketIntelligence,
L6:  SocialProofTrendIntelligence,
L7:  SourcingIntel,
L8:  SupplierContact,
L9:  EXPORT_STATUS_DISPLAY,
L10:} from "@/components/report";
L11:import { sampleReportData } from "@/data/sampleReportData";
L12:
L13:export default function SampleReportPage() {
L14:  const report = sampleReportData;
L15:  const tier = "alpha" as const;
L16:  const isTeaser = true;
L17:
L18:  return (
L19:    <div className="min-h-screen bg-[#F8F7F4]">
L20:      {/* Sticky premium banner */}
L21:      <div className="sticky top-0 z-50 w-full border-b border-[#E8E6E1] bg-[#1A1916] shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
L22:        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
L23:          <p className="text-white/95 text-sm sm:text-base font-medium text-center sm:text-left">
L24:            This is a curated sample report. Get full access to our weekly intelligence.
L25:          </p>
L26:          <Link
L27:            href="/pricing"
L28:            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#15803D] transition-colors shadow-[0_2px_8px_rgba(22,163,74,0.35)]"
L29:          >
L30:            Subscribe to Alpha
L31:          </Link>
L32:        </div>
L33:      </div>
L34:
L35:      <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-10 pb-[60vh]">
L36:        <div className="space-y-6 mt-6">
L37:          <Link
L38:            href="/"
L39:            className="text-base font-medium text-[#6B6860] hover:text-[#1A1916] transition-colors inline-block"
L40:          >
L41:            ← Back to home
L42:          </Link>
L43:
L44:          <ProductIdentity
L45:            report={report}
L46:            tier={tier}
L47:            isTeaser={isTeaser}
L48:            EXPORT_STATUS_DISPLAY={EXPORT_STATUS_DISPLAY}
L49:            isSample={true}
L50:          />
L51:          <TrendSignalDashboard report={report} />
L52:          <MarketIntelligence report={report} tier={tier} isTeaser={isTeaser} />
L53:          <SocialProofTrendIntelligence report={report} tier={tier} isTeaser={isTeaser} />
L54:          <SourcingIntel report={report} tier={tier} isTeaser={isTeaser} />
L55:          <div id="section-6" className="scroll-mt-[160px]">
L56:            <SupplierContact report={report} tier={tier} isTeaser={isTeaser} />
L57:          </div>
L58:        </div>
L59:      </div>
L60:    </div>
L61:  );
L62:}
L63:
```

## SCAN 5 - ALL `layout.tsx` files (full content)

File: `app/layout.tsx`

```tsx
L1:import type { Metadata } from "next";
L2:import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
L3:import { ConditionalRootContent } from "./ConditionalRootContent";
L4:import "./globals.css";
L5:
L6:const plusJakartaSans = Plus_Jakarta_Sans({
L7:  subsets: ["latin"],
L8:  weight: ["400", "500", "600", "700"],
L9:  variable: "--font-sans",
L10:  display: "swap",
L11:});
L12:
L13:const jetbrainsMono = JetBrains_Mono({
L14:  subsets: ["latin"],
L15:  weight: ["400", "500", "600", "700"],
L16:  variable: "--font-mono",
L17:  display: "swap",
L18:});
L19:
L20:export const metadata: Metadata = {
L21:  title: "KoreaScout",
L22:  description: "Korean product intelligence for global sellers",
L23:};
L24:
L25:export default function RootLayout({
L26:  children,
L27:}: Readonly<{
L28:  children: React.ReactNode;
L29:}>) {
L30:  return (
L31:    <html lang="en" className="scroll-smooth">
L32:      <body
L33:        className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#0A0908]`}
L34:      >
L35:        <ConditionalRootContent>{children}</ConditionalRootContent>
L36:      </body>
L37:    </html>
L38:  );
L39:}
```

File: `app/jisun/layout.tsx`

```tsx
L1:import type { Metadata } from "next";
L2:
L3:export const metadata: Metadata = {
L4:  robots: { index: false, follow: false },
L5:};
L6:
L7:export default function JisunLayout({ children }: { children: React.ReactNode }) {
L8:  return (
L9:    <div
L10:      style={{
L11:        margin: 0,
L12:        padding: 0,
L13:        background: "#0f1117",
L14:        overflow: "hidden",
L15:        minHeight: "100vh",
L16:        minWidth: "100vw",
L17:      }}
L18:    >
L19:      {children}
L20:    </div>
L21:  );
L22:}
```

## SCAN 6 - Sidebar component (full file content)

No files matched the `sidebar|Sidebar|SideBar|side-bar` grep in `*.tsx` / `*.jsx` (excluding `node_modules`).

## SCAN 7 - Header / Top Navigation component (full file content)

Files matched by:
- `navbar|NavBar|Navbar|TopNav|topnav|top-nav` grep: none
- `Header.tsx` / `header.tsx` / `Nav.tsx` / `Navbar.tsx` search:
  - `components/layout/Header.tsx`

File: `components/layout/Header.tsx`

```tsx
L1:import { createClient } from "@/lib/supabase/server";
L2:import { HeaderShellClient } from "./HeaderShellClient";
L3:
L4:export async function Header() {
L5:  const supabase = await createClient();
L6:  const { data: { user } } = await supabase.auth.getUser();
L7:
L8:  let tier = "free";
L9:  if (user) {
L10:    const { data: profile } = await supabase
L11:      .from("profiles")
L12:      .select("tier")
L13:      .eq("id", user.id)
L14:      .single();
L15:    tier = profile?.tier ?? "free";
L16:  }
L17:
L18:  return <HeaderShellClient user={user} tier={tier} />;
L19:}
```

## SCAN 8 - Bottom user account / tier badge area (matching lines)

File: `components/ui/Badge.tsx`

  12:  'tier-free': 'bg-[#F2F1EE] text-[#6B6860]',
  13:  'tier-standard': 'bg-[#DBEAFE] text-[#2563EB]',
  14:  'tier-alpha': 'bg-[#DCFCE7] text-[#16A34A]',

File: `components/report/SupplierContact.tsx`

  11:  tier,
  15:  tier: "free" | "standard" | "alpha";
  18:  const canSeeAlpha = tier === "alpha" || isTeaser;
  29:  // Always render the section so labels are visible to all tiers.
  208:            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="80px">
  236:              <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
  246:              <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
  256:              <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
  268:          <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="120px">
  359:            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="50px">
  370:            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="50px">
  381:            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="100px">
  393:          <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="120px">

File: `components/report/MarketIntelligence.tsx`

  143:  tier,
  147:  tier: "free" | "standard" | "alpha";
  181:  const isAlpha = tier === "alpha";
  182:  const canSeeStandard = tier === "standard" || tier === "alpha" || isTeaser;
  199:                <LockedValue locked={!canSeeStandard} tier="standard">
  215:                <LockedValue locked={!canSeeStandard} tier="standard">
  238:                <LockedValue locked={!canSeeStandard} tier="standard">
  293:                        <LockedValue locked={!canSeeStandard} tier="standard" minHeight="60px">
  338:                      <LockedValue locked={!canSeeStandard} tier="standard">
  346:                      <LockedValue locked={!canSeeStandard} tier="standard">
  362:                      <LockedValue locked={!canSeeStandard} tier="standard">
  384:                        <LockedValue locked={!canSeeStandard} tier="standard">
  392:                        <LockedValue locked={!canSeeStandard} tier="standard">

File: `components/report/SocialProofTrendIntelligence.tsx`

  10:  tier,
  14:  tier: "free" | "standard" | "alpha";
  17:  const canSeeAlpha = tier === "alpha" || isTeaser;
  18:  const canSeeStandard = tier === "standard" || tier === "alpha" || isTeaser;
  19:  const canSeeFree = tier === "free" || tier === "standard" || tier === "alpha" || isTeaser;
  39:        <LockedValue locked={!canSeeStandard} tier="standard" minHeight="80px">
  57:            <LockedValue locked={!canSeeStandard} tier="standard" minHeight="80px">
  79:            <LockedValue locked={!canSeeStandard} tier="standard" minHeight="80px">
  101:        <LockedValue locked={!canSeeStandard} tier="standard" minHeight="120px">
  139:          <LockedValue locked={!canSeeStandard} tier="standard" minHeight="52px">
  155:          <LockedValue locked={!canSeeStandard} tier="standard" minHeight="52px">
  171:          <LockedValue locked={!canSeeStandard} tier="standard" minHeight="52px">
  213:                  <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="80px">

File: `components/report/SourcingIntel.tsx`

  13:  tier,
  17:  tier: string;
  20:  const canSeeAlpha = tier === "alpha" || isTeaser;
  53:          <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="120px">
  83:          <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="100px">
  120:            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
  122:                {report.shipping_tier ? describeShippingTier(report.shipping_tier).description : "—"}
  129:            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
  138:            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
  151:            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
  160:            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
  169:            <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="60px">
  181:          <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="160px">
  210:                const hasNotes = notes && !/tier/i.test(notes);

File: `components/FaqAccordion.tsx`

  68:        a: "Standard gives you the full trend intelligence layer: Gap Index, Margin Multiplier, Platform Velocity, Growth Signal. That alone replaces 58 hours of manual sourcing research per month. Alpha adds the action layer: verified factory contacts, MOQ + EXW pricing, HS Code reference, compliance flags, 4K On-Site Sourcing Footage (Raw), SEO keywords, and a broker email draft. The $60 difference buys you a complete sourcing brief — ready to act on, not just read. If your average margin is $8/unit and you source 200 units from one Alpha-sourced product, that's $1,600 gross from a $129 subscription. The math works on the first product.",
  72:        a: "Yes, anytime. When you upgrade, you pay only the price difference — your existing Standard subscription credit is applied. Alpha access opens immediately upon payment. No waiting, no new billing cycle.",
  99:        a: "Yes. One click, no forms, no calls. Before you cancel — know this: your KoreaScout vault is cumulative. Every week you're subscribed, your accessible report library grows. When you cancel, you lose access to all previously unlocked reports. If you resubscribe later, your vault does not restore — you start fresh from the new subscription date only. Cancellation simply stops the next charge. Your current paid period remains fully active until the last day.",

File: `components/ui/PaywallOverlay.tsx`

  10:  tier: PaywallTier
  18:  tier,
  25:    tier === 'alpha' ? `Go Alpha ${PRICING.CURRENCY}${PRICING.ALPHA.monthly}/mo →` : `Go Standard ${PRICING.CURRENCY}${PRICING.STANDARD.monthly}/mo →`

File: `components/LandingTimeWidget.tsx`

  108:                <span className="text-xs font-black text-[#1A1916]">{PRICING.CURRENCY}{PRICING.ALPHA.monthly}/month</span>

File: `components/AlphaVaultPreview.tsx`

  11:const ALPHA_FIELDS = [
  89:          {ALPHA_FIELDS.map((f) => (

File: `components/GroupBBrokerSection.tsx`

  33:          <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="80px">
  66:          <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="80px">

File: `components/ProductIdentity.tsx`

  22:  tier,
  31:  tier: "free" | "standard" | "alpha";
  39:  const canSeeAlpha = tier === "alpha" || isTeaser;

File: `components/LogoutButton.tsx`

  7:type LogoutButtonProps = { className?: string; style?: React.CSSProperties };
  9:export function LogoutButton({ className, style }: LogoutButtonProps) {
  12:  async function handleLogout() {
  22:      onClick={handleLogout}
  26:      Logout

File: `components/GlobalPricingTable.tsx`

  25:  tier: Tier;
  45:export function GlobalPricingTable({ prices, tier, isTeaser, sourcingTip }: GlobalPricingTableProps) {
  76:  const canSeeLinks = tier === "alpha" || isTeaser;

File: `components/layout/Header.tsx`

  8:  let tier = "free";
  12:      .select("tier")
  15:    tier = profile?.tier ?? "free";
  18:  return <HeaderShellClient user={user} tier={tier} />;

File: `components/layout/HeaderNavClient.tsx`

  5:import { LogoutButton } from "@/components/LogoutButton";
  29:  tier,
  33:  tier: string;
  65:        {tier === "free" && (
  70:        {tier === "standard" && (
  79:      <LogoutButton className={primaryClass} style={transitionStyle} />

File: `components/layout/HeaderShellClient.tsx`

  50:export function HeaderShellClient({ user, tier }: { user: User | null; tier: string }) {
  91:        <HeaderNavClient user={user} tier={tier} isTransparent={isTransparent} />

File: `components/layout/ClientLeftNav.tsx`

  13:  tier?: NavTier
  25:export function ClientLeftNav({ sections, userEmail, tier }: ClientLeftNavProps) {
  100:              {tier != null && (
  103:                    tier === 'alpha'
  108:                  {tier === 'alpha' ? 'Alpha' : tier === 'standard' ? 'Standard' : 'Free'}

File: `components/ui/LockedValue.tsx`

  9:  tier?: "standard" | "alpha";
  16:  tier = "standard",
  22:    tier === "alpha" ? "Unlock with Alpha →" : "Unlock with Standard →";

File: `app/weekly/page.tsx`

  65:  const { userId, tier, subscriptionStartAt } = await getAuthTier();
  71:  const isPaid = tier === "standard" || tier === "alpha";
  128:      subscriptionStartAt && week.published_at
  129:        ? new Date(week.published_at) >= new Date(subscriptionStartAt)
  142:  // Only remove the featured week from the vault when user is free tier. Paid users see all accessible weeks.
  144:    tier === "free" && featuredWeek
  161:  const tierLabel = tier === "alpha" ? "Alpha" : tier === "standard" ? "Standard" : "Free";
  162:  const tierBadgeClass =
  165:      : tier === "standard"
  171:      {/* 1. DARK HERO — section label + tier badge only */}
  179:              className={`inline-flex items-center px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase w-fit ${tierBadgeClass}`}
  181:              {tierLabel}
  233:            {/* 3. FEATURED REPORT (Unlocked Intel) — only for free tier; paid users go straight to The Vault */}
  234:            {tier === "free" && featuredWeek && (
  323:                              {tier === "free" ? (

File: `app/weekly/[weekId]/page.tsx`

  16:  const { userId, tier, subscriptionStartAt } = await getAuthTier();
  20:  const isPaid = tier === "standard" || tier === "alpha";
  43:      subscriptionStartAt && week.published_at
  44:        ? new Date(week.published_at) >= new Date(subscriptionStartAt)
  107:  // RLS filters by tier and free_list_at; we get only rows the user is allowed to see.

File: `app/weekly/[weekId]/[id]/page.tsx`

  26:  const { userId, userEmail, tier, subscriptionStartAt } = await getAuthTier();
  79:    if (tier === "free") {
  82:    if (tier === "standard" || tier === "alpha") {
  86:      if (!subscriptionStartAt) return false;
  87:      const subDate = new Date(subscriptionStartAt);
  105:  const canSeeAlpha = tier === "alpha" || isTeaser;
  106:  const maskedReport = maskReportByTier(report as ScoutFinalReportsRow, tier as "free" | "standard" | "alpha");
  115:    (report.shipping_tier && report.shipping_tier.trim()) ||
  147:      <ClientLeftNav sections={sections} userEmail={userEmail} tier={tier as "free" | "standard" | "alpha"} />
  163:              tier={tier as "free" | "standard" | "alpha"}
  173:              <MarketIntelligence report={maskedReport} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
  174:              <SocialProofTrendIntelligence report={maskedReport} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
  177:            {hasLogistics && <SourcingIntel report={maskedReport} tier={tier as string} isTeaser={isTeaser} />}
  180:              <SupplierContact report={maskedReport} tier={tier as "free" | "standard" | "alpha"} isTeaser={isTeaser} />
  206:                {tier === "free" && (
  211:                {tier === "standard" && (
  213:                    Go Alpha — Get Supplier Contacts for {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo →
  216:                {tier === "alpha" && <p className="text-sm font-medium text-[#16A34A]">You have full access</p>}

File: `app/pricing/page.tsx`

  8:  description: `Compare Free, Standard ${PRICING.CURRENCY}${PRICING.STANDARD.monthly}, and Alpha ${PRICING.CURRENCY}${PRICING.ALPHA.monthly}. Choose your intelligence level.`,
  13:const ALPHA_CHECKOUT_URL =
  15:const ALPHA_MAX_SPOTS = 3000;
  23:      .eq("tier", "alpha");
  111:  const isMembershipFull = alphaCount >= ALPHA_MAX_SPOTS;
  112:  const remainingSpots = Math.max(0, ALPHA_MAX_SPOTS - alphaCount);
  147:            For less than <span className="text-[#16A34A]">{PRICING.CURRENCY}{PRICING.ALPHA.daily.toFixed(2)}</span> a day.
  241:            {/* ALPHA */}
  263:                    {PRICING.CURRENCY}{PRICING.ALPHA.monthly}
  268:                  Approx. {PRICING.CURRENCY}{PRICING.ALPHA.daily.toFixed(2)} / day
  285:                    EXCLUSIVE: Limited to {ALPHA_MAX_SPOTS.toLocaleString()} Global Membership Spots ({remainingSpots.toLocaleString()} remaining)
  299:                    checkoutUrl={ALPHA_CHECKOUT_URL}
  302:                    Go Alpha — {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo
  314:      {/* S3: ALPHA MOAT */}
  341:                {remainingSpots.toLocaleString()} of {ALPHA_MAX_SPOTS.toLocaleString()} spots remaining
  416:            * Note: Certain supplier information in the Alpha tier may be redacted or undisclosed depending on strict manufacturer confidentiality policies.
  434:              <span className="text-[#16A34A] block mt-1 md:mt-2">For under {PRICING.CURRENCY}{PRICING.ALPHA.marketingDailyLimit.toFixed(2)} a day.</span>
  445:              {remainingSpots.toLocaleString()} of {ALPHA_MAX_SPOTS.toLocaleString()} Alpha spots remaining
  466:                checkoutUrl={ALPHA_CHECKOUT_URL}
  469:                Go Alpha — {PRICING.CURRENCY}{PRICING.ALPHA.monthly}/mo

File: `app/account/page.tsx`

  6:import { LogoutButton } from "@/components/LogoutButton";
  11:function tierBadgeLabel(tier: string): string {
  12:  if (tier === "alpha") return "ALPHA ACCESS";
  13:  if (tier === "standard") return "STANDARD ACCESS";
  25:  const { tier } = await getAuthTier();
  78:            {tierBadgeLabel(tier)}
  93:            <LogoutButton className="text-[#F8F7F4]/80 hover:text-[#F8F7F4] transition-colors font-medium" />
  209:        {/* SUBSCRIPTION & BILLING (tier-based) */}
  215:            Current plan: <span className="font-semibold text-[#1A1916]">{tierBadgeLabel(tier)}</span>
  218:          {tier === "free" && (
  227:          {tier === "standard" && (
  242:          {tier === "alpha" && (

File: `app/legal/terms/page.tsx`

  10:          <p className="text-[#4A4845] leading-relaxed">KoreaScout is a subscription-based B2B intelligence platform providing weekly Korean product trend reports for global sellers. The service is operated by Haengbok Jwa. Payment processing, tax collection, and receipts are handled by LemonSqueezy, acting as the Merchant of Record. By using this service, you confirm you are at least 18 years of age.</p>
  20:          <p className="text-[#4A4845] leading-relaxed">Subscriptions are automatically renewed on a monthly basis. By subscribing, you acknowledge and consent to recurring charges until you cancel. Subscribers may cancel at any time. Upon cancellation, full access to the subscribed tier is retained through the end of the current billing cycle. No partial refunds will be issued for unused days.</p>
  30:          <p className="text-[#4A4845] leading-relaxed">Each subscription is a Single-User License. Account sharing, unauthorized scraping, automated data extraction, reproduction, resale, or redistribution of KoreaScout content in any format is strictly prohibited. We monitor access patterns and IP addresses to ensure compliance. Violation will result in immediate permanent account termination without refund. KoreaScout reserves the right to pursue legal action under applicable laws.</p>

File: `app/signup/page.tsx`

  53:            Start with a free tier. Use Google or email.

File: `app/legal/privacy/page.tsx`

  10:          <p className="text-[#4A4845] leading-relaxed">We collect your email address and subscription tier for the purpose of providing access to KoreaScout services. Payment information is processed exclusively by LemonSqueezy and is never stored on our servers.</p>

File: `app/admin/page.tsx`

  58:  async function handleLogout() {
  59:    await fetch("/api/admin/logout", {
  73:          onClick={handleLogout}
  76:          Logout

File: `app/admin/[id]/page.tsx`

  93:  shipping_tier: "배송티어",
  199:    "shipping_tier", "key_risk_ingredient", "hazmat_summary", "global_site_url", "b2b_inquiry_url", "can_oem", "ai_image_url",
  1059:                  value={formData.shipping_tier ?? ""}
  1060:                  onChange={(e) => setFormData((p) => ({ ...p!, shipping_tier: e.target.value }))}

File: `app/sample-report/page.tsx`

  15:  const tier = "alpha" as const;
  46:            tier={tier}
  52:          <MarketIntelligence report={report} tier={tier} isTeaser={isTeaser} />
  53:          <SocialProofTrendIntelligence report={report} tier={tier} isTeaser={isTeaser} />
  54:          <SourcingIntel report={report} tier={tier} isTeaser={isTeaser} />
  56:            <SupplierContact report={report} tier={tier} isTeaser={isTeaser} />

## SCAN 9 - Extract `className` props (from SCAN 6 + SCAN 7 files)

Files used:
- SCAN 6 (sidebar): none
- SCAN 7 (header): `components/layout/Header.tsx`

Component: `Header`
- `className` props: none found in `components/layout/Header.tsx`

## SCAN 10 - Existing print button component

File: `components/ZombieWatermark.tsx`

  30:        @media print {
  49:          printColorAdjust: "exact",

File: `components/FaqAccordion.tsx`

  26:        a: "The Gap Index is KoreaScout's proprietary scoring metric. It measures the spread between a product's Korean demand momentum and its current global supply footprint across Amazon US, Amazon EU, and Shopify. A high Gap Index means the product is buzzing in Korea but has virtually no established competition globally — that's your entry window. Products with a low Gap Index are filtered out before they reach your report.",

File: `app/pricing/page.tsx`

  429:              You just saw the complete blueprint. From trend signals<br className="hidden md:block" />

