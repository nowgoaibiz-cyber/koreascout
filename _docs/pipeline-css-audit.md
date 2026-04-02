## 1. s6- 커스텀 클래스 CSS 파일 위치 찾기

Requested command:
`find . -type f \( -name "*.css" -o -name "*.scss" \) -not -path "*/node_modules/*"`

Output (tool-equivalent results):
```text
<workspace_result workspace_path="c:\k-productscout">
.\app\globals.css
</workspace_result>

<workspace_result workspace_path="c:\k-productscout">
No files with matches found
</workspace_result>
```

## 2. s6- 클래스 정의된 파일 찾기

Requested command:
`grep -rn "s6-" --include="*.css" --include="*.scss" --include="*.tsx" --include="*.ts" . | grep -v node_modules`

Output:
```text
<workspace_result workspace_path="c:\k-productscout">
.\app\globals.css
  133:.s6-section {
  138:.s6-headline {
  142:.s6-headline h2 {
  150:.s6-headline p {
  157:.s6-row {
  167:.s6-step {
  175:.s6-arrow-wrap {
  187:.s6-label {
  201:.s6-pill-cloud {
  206:.s6-pill {
  221:.s6-kill-row {
  227:.s6-kill-tag {
  238:.s6-kill-text {
  246:.s6-filter-desc {
  252:.s6-filter-desc p {
  262:.s6-verify-row {
  268:.s6-verify-check {
  283:.s6-v-main {
  291:.s6-v-sub {
  300:.s6-output-num {
  310:.s6-output-desc {
  316:.s6-badge {
  326:.s6-badge-dot {
  333:.s6-badge span {
  343:  .s6-row {
  348:  .s6-step {
  353:  .s6-step:last-child {
  356:  .s6-arrow-wrap {
  359:  .s6-pill-cloud {

.\components\IntelligencePipeline.tsx
  22:    <section className="s6-section">
  24:      <div className="s6-headline">
  33:      <div className="s6-row">
  35:        <div className="s6-step">
  36:          <span className="s6-label">00. The Signals</span>
  37:          <div className="s6-pill-cloud">
  41:                className="s6-pill"
  58:        <div className="s6-arrow-wrap">→</div>
  61:        <div className="s6-step">
  62:          <span className="s6-label">01. The Noise Filter</span>
  64:            <div key={item} className="s6-kill-row">
  65:              <span className="s6-kill-tag">KILL</span>
  66:              <span className="s6-kill-text">{item}</span>
  69:          <div className="s6-filter-desc">
  80:        <div className="s6-arrow-wrap">→</div>
  83:        <div className="s6-step">
  84:          <span className="s6-label">02. Korea HQ Verification</span>
  86:            <div key={row.main} className="s6-verify-row">
  87:              <span className="s6-verify-check" aria-hidden>✓</span>
  89:                <div className="s6-v-main">{row.main}</div>
  90:                <div className="s6-v-sub">{row.sub}</div>
  97:        <div className="s6-arrow-wrap">→</div>
  100:        <div className="s6-step">
  101:          <span className="s6-label">03. The Output</span>
  102:          <div className="s6-output-num">10+</div>
  103:          <p className="s6-output-desc">
  108:          <div className="s6-badge">
  109:            <div className="s6-badge-dot" />
</workspace_result>
```

## 3. globals.css 전체 내용 (있다면)

Requested command:
`cat app/globals.css 2>/dev/null || cat styles/globals.css 2>/dev/null`

Output:
```text
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
L24:  --color-danger-light:   #FEE2E2;
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
L365:@media print {
L366:
L367:  /* ── 1. HIDE ALL WEB UI CHROME ── */
L368:
L369:  /* Hide top header / navigation bar */
L370:  header,
L371:  [class*="header"],
L372:  [class*="Header"],
L373:  nav,
L374:  [class*="navbar"],
L375:  [class*="NavBar"] {
L376:    display: none !important;
L377:  }
L378:
L379:  /* Hide left sidebar (ClientLeftNav) */
L380:  /* Target: the aside or nav wrapper rendered by ClientLeftNav */
L381:  /* Also target common sidebar wrapper patterns */
L382:  aside,
L383:  [class*="sidebar"],
L384:  [class*="left-nav"],
L385:  [class*="ClientLeftNav"],
L386:  [class*="leftnav"],
L387:  [class*="side-nav"] {
L388:    display: none !important;
L389:  }
L390:
L391:  /* Hide bottom account/tier/logout area inside sidebar */
L392:  [class*="logout"],
L393:  [class*="Logout"],
L394:  [class*="tier-badge"],
L395:  [class*="account-info"] {
L396:    display: none !important;
L397:  }
L398:
L399:  /* Hide "Back to week" navigation link */
L400:  a[href*="/weekly"]:first-of-type {
L401:    display: none !important;
L402:  }
L403:
L404:  /* Hide any sticky banners, overlays, toasts */
L405:  [class*="sticky"],
L406:  [class*="toast"],
L407:  [class*="modal"],
L408:  [class*="overlay"],
L409:  [class*="PaywallOverlay"],
L410:  [class*="banner"] {
L411:    display: none !important;
L412:  }
L413:
L414:  /* Hide upgrade CTA buttons at bottom of report */
L415:  [class*="upgrade"],
L416:  [class*="cta"],
L417:  [class*="upsell"] {
L418:    display: none !important;
L419:  }
L420:
L421:  /* Force full-width layout when sidebar is hidden */
L422:  .print-hide + * {
L423:    width: 100% !important;
L424:    max-width: 100% !important;
L425:    margin-left: 0 !important;
L426:    padding-left: 0 !important;
L427:    flex: 1 1 100% !important;
L428:  }
L429:
L430:  /* Also target the parent flex container */
L431:  .print-hide {
L432:    display: none !important;
L433:    width: 0 !important;
L434:    min-width: 0 !important;
L435:    padding: 0 !important;
L436:    margin: 0 !important;
L437:    flex: 0 0 0 !important;
L438:  }
L439:
L440:  /* ── 2. MAIN CONTENT EXPANDS TO FULL WIDTH ── */
L441:
L442:  /* Reset body and html */
L443:  html, body {
L444:    background: #FFFFFF !important;
L445:    color: #1A1916 !important;
L446:    font-size: 11pt !important;
L447:    margin: 0 !important;
L448:    padding: 0 !important;
L449:    width: 100% !important;
L450:  }
L451:
L452:  h1 { font-size: 18pt !important; }
L453:  h2 { font-size: 14pt !important; }
L454:  h3 { font-size: 12pt !important; }
L455:
L456:  /* Make main content fill the full page width since sidebar is gone */
L457:  main,
L458:  [class*="main-content"],
L459:  [class*="content-area"],
L460:  [class*="report-body"] {
L461:    margin-left: 0 !important;
L462:    padding-left: 0 !important;
L463:    width: 100% !important;
L464:    max-width: 100% !important;
L465:  }
L466:
L467:  /* Page wrapper — remove sidebar offset */
L468:  .max-w-6xl,
L469:  .max-w-5xl,
L470:  .max-w-4xl {
L471:    max-width: 100% !important;
L472:    margin: 0 auto !important;
L473:    padding: 0 24px !important;
L474:  }
L475:
L476:  /* ── 3. PAGE BREAK — PREVENT CARD SLICING ── */
L477:
L478:  /* Only prevent breaks inside small cards, not entire sections */
L479:  section,
L480:  article {
L481:    break-inside: auto !important;
L482:    page-break-inside: auto !important;
L483:  }
L484:
L485:  /* Only avoid breaks inside small individual cards */
L486:  [class*="rounded-2xl"],
L487:  [class*="rounded-xl"] {
L488:    break-inside: avoid !important;
L489:    page-break-inside: avoid !important;
L490:  }
L491:
L492:  /* Force page break before each major report section */
L493:  [id*="section"],
L494:  [class*="report-section"] {
L495:    break-before: auto;
L496:    page-break-before: auto;
L497:  }
L498:
L499:  /* Reduce excessive spacing between sections for print */
L500:  .space-y-6 > * + * {
L501:    margin-top: 12px !important;
L502:  }
L503:  .space-y-8 > * + * {
L504:    margin-top: 16px !important;
L505:  }
L506:  .mb-6, .mb-8, .mb-10, .mb-12 {
L507:    margin-bottom: 12px !important;
L508:  }
L509:  .pb-6, .pb-8, .pb-10, .pb-12 {
L510:    padding-bottom: 12px !important;
L511:  }
L512:  .pt-6, .pt-8, .pt-10 {
L513:    padding-top: 12px !important;
L514:  }
L515:  .py-6, .py-8, .py-10 {
L516:    padding-top: 12px !important;
L517:    padding-bottom: 12px !important;
L518:  }
L519:
L520:  /* ── 4. PRINT COLOR & LINK ADJUSTMENTS ── */
L521:
L522:  /* Ensure colors print correctly */
L523:  * {
L524:    -webkit-print-color-adjust: exact !important;
L525:    print-color-adjust: exact !important;
L526:  }
L527:
L528:  /* Hide URLs that appear after links when printing */
L529:  a[href]::after {
L530:    content: none !important;
L531:  }
L532:
L533:  /* ── 5. PAGE MARGINS (A4 B2B REPORT STYLE) ── */
L534:  @page {
L535:    size: A4;
L536:    margin: 16mm 20mm 16mm 20mm;
L537:  }
L538:
L539:  /* Kill the 60vh bottom padding that creates blank pages */
L540:  .pb-\[60vh\] {
L541:    padding-bottom: 0 !important;
L542:  }
L543:
L544:  /* Kill min-h-screen that forces full viewport height */
L545:  .min-h-screen {
L546:    min-height: 0 !important;
L547:  }
L548:
L549:  /* Kill sidebar left padding on main column */
L550:  .pl-\[18rem\] {
L551:    padding-left: 0 !important;
L552:  }
L553:
L554:  /* Kill top margin on content stack */
L555:  .mt-10 {
L556:    margin-top: 8px !important;
L557:  }
L558:
L559:  /* Kill top padding on content wrapper */
L560:  .pt-10 {
L561:    padding-top: 8px !important;
L562:  }
L563:}
L564:
```

## 4. IntelligencePipeline 관련 CSS 전체 (s6 클래스 정의 전체)

Requested command:
`grep -n "s6-" app/globals.css 2>/dev/null || grep -rn "s6-" --include="*.css" . | grep -v node_modules`

Output:
```text
<workspace_result workspace_path="c:\k-productscout">
.\app\globals.css
  133:.s6-section {
  138:.s6-headline {
  142:.s6-headline h2 {
  150:.s6-headline p {
  157:.s6-row {
  167:.s6-step {
  175:.s6-arrow-wrap {
  187:.s6-label {
  201:.s6-pill-cloud {
  206:.s6-pill {
  221:.s6-kill-row {
  227:.s6-kill-tag {
  238:.s6-kill-text {
  246:.s6-filter-desc {
  252:.s6-filter-desc p {
  262:.s6-verify-row {
  268:.s6-verify-check {
  283:.s6-v-main {
  291:.s6-v-sub {
  300:.s6-output-num {
  310:.s6-output-desc {
  316:.s6-badge {
  326:.s6-badge-dot {
  333:.s6-badge span {
  343:  .s6-row {
  348:  .s6-step {
  353:  .s6-step:last-child {
  356:  .s6-arrow-wrap {
  359:  .s6-pill-cloud {
</workspace_result>
```

## 5. tailwind.config 확인 (커스텀 클래스 혹시 여기 있는지)

Requested command:
`cat tailwind.config.ts 2>/dev/null || cat tailwind.config.js 2>/dev/null`

Output:
```text
Error: File not found
Error: File not found
```

AUDIT COMPLETE.
