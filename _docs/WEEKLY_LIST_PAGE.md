```text
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
L81:    return (
L82:      <div className="min-h-screen bg-[#F8F7F4] pt-8 px-4 py-12">
L83:        <div className="max-w-5xl mx-auto text-center">
L84:          <p className="text-lg text-[#DC2626]">Failed to load weeks.</p>
L85:          <Link href="/" className="text-[#16A34A] hover:text-[#15803D] text-base font-medium mt-4 inline-block">← Back to home</Link>
L86:        </div>
L87:      </div>
L88:    );
L89:  }
L90:
L91:  const { data: latest3Weeks } = await supabase
L92:    .from("weeks")
L93:    .select("week_id")
L94:    .eq("status", "published")
L95:    .order("published_at", { ascending: false })
L96:    .limit(3);
L97:  const latest3WeekIds = (latest3Weeks ?? []).map((w) => w.week_id);
L98:
L99:  const freeOpenWeekId =
L100:    weeks
L101:      ?.filter((w) => isWeekAvailableForFree(w.published_at))
L102:      .sort(
L103:        (a, b) =>
L104:          new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime()
L105:      )[0]?.week_id ?? null;
L106:
L107:  const monthGroups: MonthGroup[] = [];
L108:  for (const week of weeks ?? []) {
L109:    const d = new Date(week.start_date ?? 0);
L110:    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
L111:    const monthLabel = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
L112:    const existing = monthGroups.find((g) => g.monthKey === monthKey);
L113:    if (existing) {
L114:      existing.weeks.push(week);
L115:    } else {
L116:      monthGroups.push({ monthKey, monthLabel, weeks: [week] });
L117:    }
L118:  }
L119:
L120:  const currentMonthKey = (() => {
L121:    const now = new Date();
L122:    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
L123:  })();
L124:
L125:  function canAccessWeek(week: WeekRow): boolean {
L126:    const isLatestWeek = latest3WeekIds.includes(week.week_id);
L127:    const isAfterSub =
L128:      subscriptionStartAt && week.published_at
L129:        ? new Date(week.published_at) >= new Date(subscriptionStartAt)
L130:        : false;
L131:    return isPaid ? isLatestWeek || isAfterSub : week.week_id === freeOpenWeekId;
L132:  }
L133:
L134:  const unlockedWeeks = (weeks ?? []).filter(canAccessWeek);
L135:  const featuredWeek =
L136:    unlockedWeeks.sort(
L137:      (a, b) =>
L138:        new Date(b.published_at ?? 0).getTime() -
L139:        new Date(a.published_at ?? 0).getTime()
L140:    )[0] ?? null;
L141:
L142:  // Only remove the featured week from the vault when user is free tier. Paid users see all accessible weeks.
L143:  const weeksForVault =
L144:    tier === "free" && featuredWeek
L145:      ? (weeks ?? []).filter((w) => w.week_id !== featuredWeek.week_id)
L146:      : weeks ?? [];
L147:
L148:  const monthGroupsForVault: MonthGroup[] = [];
L149:  for (const week of weeksForVault) {
L150:    const d = new Date(week.start_date ?? 0);
L151:    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
L152:    const monthLabel = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
L153:    const existing = monthGroupsForVault.find((g) => g.monthKey === monthKey);
L154:    if (existing) {
L155:      existing.weeks.push(week);
L156:    } else {
L157:      monthGroupsForVault.push({ monthKey, monthLabel, weeks: [week] });
L158:    }
L159:  }
L160:
L161:  const tierLabel = tier === "alpha" ? "Alpha" : tier === "standard" ? "Standard" : "Free";
L162:  const tierBadgeClass =
L163:    tier === "alpha"
L164:      ? "bg-[#16A34A]/20 border-[#16A34A]/40 text-[#16A34A]"
L165:      : tier === "standard"
L166:        ? "bg-[#16A34A]/10 border-[#16A34A]/30 text-[#15803D]"
L167:        : "bg-white/10 border-white/20 text-[#9E9C98]";
L168:
L169:  return (
L170:    <div className="min-h-screen bg-[#F8F7F4]">
L171:      {/* 1. DARK HERO — section label + tier badge only */}
L172:      <section className="bg-[#1A1916] pt-24 pb-6 px-6">
L173:        <div className="max-w-5xl mx-auto">
L174:          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
L175:            <p className="text-sm font-bold tracking-[0.3em] uppercase text-[#16A34A]">
L176:              Weekly Intelligence
L177:            </p>
L178:            <span
L179:              className={`inline-flex items-center px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase w-fit ${tierBadgeClass}`}
L180:            >
L181:              {tierLabel}
L182:            </span>
L183:          </div>
L184:        </div>
L185:      </section>
L186:
L187:      {/* 2. TREND NEWS — Massive rolling hero banner */}
L188:      <section className="bg-[#1A1916] px-6 pb-10">
L189:        <div className="max-w-5xl mx-auto">
L190:          <div className="relative rounded-2xl overflow-hidden min-h-[320px] md:min-h-[400px] border border-[#BBF7D0]/20 flex items-end group cursor-pointer">
L191:            {/* Placeholder background (replace with dynamic image later) */}
L192:            <div
L193:              className="absolute inset-0 bg-[#0A0908] bg-cover bg-center opacity-50 group-hover:opacity-60 transition-opacity"
L194:              style={{
L195:                backgroundImage: "url(https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1200)",
L196:              }}
L197:            />
L198:            {/* Gradient overlay for text readability */}
L199:            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1916] via-[#1A1916]/80 to-transparent" />
L200:            {/* Carousel nav — left */}
L201:            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur border border-white/10 text-white/90 hover:bg-black/50 transition-colors">
L202:              <ChevronLeft className="w-5 h-5" strokeWidth={2.5} aria-hidden />
L203:            </div>
L204:            {/* Carousel nav — right */}
L205:            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur border border-white/10 text-white/90 hover:bg-black/50 transition-colors">
L206:              <ChevronRight className="w-5 h-5" strokeWidth={2.5} aria-hidden />
L207:            </div>
L208:            {/* Pagination dots — bottom center */}
L209:            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
L210:              <span className="w-2 h-2 rounded-full bg-[#16A34A]" aria-current="true" />
L211:              <span className="w-2 h-2 rounded-full bg-white/40" />
L212:              <span className="w-2 h-2 rounded-full bg-white/40" />
L213:            </div>
L214:            {/* Content */}
L215:            <div className="relative z-10 p-6 md:p-8 w-full">
L216:              <span className="inline-block px-3 py-1 bg-[#16A34A] text-white text-xs font-bold uppercase tracking-wider rounded-sm mb-3">
L217:                HOT ISSUE
L218:              </span>
L219:              <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight group-hover:text-[#BBF7D0] transition-colors">
L220:                Coming Soon
L221:              </h2>
L222:            </div>
L223:          </div>
L224:        </div>
L225:      </section>
L226:
L227:      {/* MAIN CONTENT */}
L228:      <div className="max-w-5xl mx-auto px-6 sm:px-8 pt-12 pb-10 bg-[#F8F7F4]">
L229:        {!weeks?.length ? (
L230:          <p className="text-lg text-[#9E9C98]">No reports published yet. Check back soon.</p>
L231:        ) : (
L232:          <>
L233:            {/* 3. FEATURED REPORT (Unlocked Intel) — only for free tier; paid users go straight to The Vault */}
L234:            {tier === "free" && featuredWeek && (
L235:              <div className="mb-12">
L236:                <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#16A34A] mb-3">
L237:                  UNLOCKED INTEL
L238:                </p>
L239:                <Link
L240:                  href={`/weekly/${featuredWeek.week_id}`}
L241:                  className="block rounded-2xl border-2 border-[#16A34A]/30 bg-[#16A34A]/10 p-8 sm:p-10
L242:                    shadow-[0_4px_24px_-4px_rgb(22_163_74/0.2)]
L243:                    hover:border-[#16A34A] hover:shadow-[0_8px_32px_-4px_rgb(22_163_74/0.25)]
L244:                    transition-all duration-200"
L245:                >
L246:                  <div className="flex items-start gap-4">
L247:                    <div className="shrink-0 w-12 h-12 rounded-xl bg-[#16A34A]/15 flex items-center justify-center">
L248:                      <FileText className="w-6 h-6 text-[#16A34A]" strokeWidth={2} />
L249:                    </div>
L250:                    <div className="min-w-0 flex-1">
L251:                      <p className="text-xs font-black tracking-[0.25em] uppercase text-[#16A34A] mb-2">
L252:                        Featured Report
L253:                      </p>
L254:                      <h2 className="text-2xl sm:text-3xl font-black text-[#1A1916] tracking-tight mb-1">
L255:                        {featuredWeek.week_label}
L256:                      </h2>
L257:                      {formatPublishedDate(featuredWeek.published_at) && (
L258:                        <p className="text-sm text-[#9E9C98] mb-4">
L259:                          Published: {formatPublishedDate(featuredWeek.published_at)}
L260:                        </p>
L261:                      )}
L262:                      <span className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-5 py-2.5 text-sm font-bold text:white shadow-[0_2px_8px_-2px_rgb(22_163_74/0.4)] hover:bg-[#15803D] transition-colors">
L263:                        Open report
L264:                        <span aria-hidden>→</span>
L265:                      </span>
L266:                    </div>
L267:                  </div>
L268:                </Link>
L269:              </div>
L270:            )}
L271:
L272:            {/* 4. THE VAULT (Classified Folders) */}
L273:            <div className="mt-16 mb-6">
L274:              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#9E9C98] mb-2">
L275:                The Vault
L276:              </p>
L277:              <h2 className="text-xl font-black text-[#1A1916] tracking-tight uppercase">
L278:                Archive by month
L279:              </h2>
L280:            </div>
L281:            <div className="space-y-0">
L282:              {monthGroupsForVault.map((group, index) => (
L283:                <MonthAccordion
L284:                  key={group.monthKey}
L285:                  monthLabel={group.monthLabel}
L286:                  monthKey={group.monthKey}
L287:                  currentMonthKey={currentMonthKey}
L288:                  defaultOpen={index === 0}
L289:                >
L290:                  {group.weeks.map((week, weekIndex) => {
L291:                    const canAccess = canAccessWeek(week);
L292:                    const isLocked = !canAccess;
L293:                    const actualCount = week.scout_final_reports?.[0]?.count ?? 0;
L294:                    const isFirstItemInVault = index === 0 && weekIndex === 0;
L295:                    const withinThreeDays = isWithinLastNDays(week.published_at, 3);
L296:                    const showJustReleased = isPaid && (isFirstItemInVault || withinThreeDays);
L297:
L298:                    return (
L299:                      <div key={week.week_id}>
L300:                        {isLocked ? (
L301:                          <div className="relative rounded-xl border border-[#E8E6E1] bg:white overflow-hidden">
L302:                            <div className="p-6 opacity-90">
L303:                              <div className="flex items-center justify-between gap-2">
L304:                                <span className="text-lg font-semibold text-[#1A1916]">
L305:                                  {week.week_label}
L306:                                </span>
L307:                                <span className="text-sm text-[#9E9C98]">
L308:                                  {!isPaid && week.published_at
L309:                                    ? `Available ${formatAvailableDate(week.published_at)}`
L310:                                    : "Archive"}
L311:                                </span>
L312:                              </div>
L313:                              <p className="text-base text-[#6B6860] mt-1.5">
L314:                                {actualCount} product{actualCount !== 1 ? "s" : ""}
L315:                              </p>
L316:                            </div>
L317:                            {/* Frosted overlay + CTA */}
L318:                            <div className="absolute inset-0 flex flex-col items-center justify-center bg:white/70 backdrop-blur-[6px] rounded-xl">
L319:                              <Lock className="w-10 h-10 text-[#6B6860] mb-3" strokeWidth={2} aria-hidden />
L320:                              <p className="text-sm font-bold text-[#1A1916] uppercase tracking-wider mb-2">
L321:                                Classified
L322:                              </p>
L323:                              {tier === "free" ? (
L324:                                <Link
L325:                                  href="/pricing"
L326:                                  className="inline-flex items-center rounded-lg bg-[#1A1916] px-5 py-2.5 text-sm font-bold text:white hover:bg-[#16A34A] transition-colors"
L327:                                >
L328:                                  UPGRADE TO UNLOCK
L329:                                </Link>
L330:                              ) : (
L331:                                <button
L332:                                  type="button"
L333:                                  disabled
L334:                                  className="inline-flex items-center rounded-lg bg-[#F8F7F4] text-[#9E9C98] border border-[#E8E6E1] cursor-not-allowed px-5 py-2.5 text-sm font-bold"
L335:                                >
L336:                                  ARCHIVE LOCKED
L337:                                </button>
L338:                              )}
L339:                            </div>
L340:                          </div>
L341:                        ) : (
L342:                          <Link
L343:                            href={`/weekly/${week.week_id}`}
L344:                            className="rounded-xl border border-[#E8E6E1] bg:white p-6 block
L345:                              shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]
L346:                              hover:border-[#BBF7D0]
L347:                              hover:shadow-[0_4px_16px_-4px_rgb(26_25_22/0.12)]
L348:                              transition-all duration-200"
L349:                          >
L350:                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
L351:                              <div className="min-w-0 flex-1">
L352:                                <div className="flex flex-wrap items-center gap-2">
L353:                                  <span className="text-lg font-semibold text-[#1A1916]">
L354:                                    {week.week_label}
L355:                                  </span>
L356:                                  {showJustReleased && (
L357:                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
L358:                                      Just released
L359:                                    </span>
L360:                                  )}
L361:                                  {!isPaid && (
L362:                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
L363:                                      Free access
L364:                                    </span>
L365:                                  )}
L366:                                </div>
L367:                                <p className="text-sm text-[#6B6860] mt-1.5">
L368:                                  {formatPublishedDate(week.published_at) && (
L369:                                    <>Published: {formatPublishedDate(week.published_at)}</>
L370:                                  )}
L371:                                  {formatPublishedDate(week.published_at) && " • "}
L372:                                  {actualCount} product{actualCount !== 1 ? "s" : ""}
L373:                                </p>
L374:                                {week.summary && (
L375:                                  <p className="text-base text-[#3D3B36] mt-2 line-clamp-1">
L376:                                    {week.summary}
L377:                                  </p>
L378:                                )}
L379:                              </div>
L380:                              <span className="shrink-0 bg-[#16A34A] text:white px-4 py-2 rounded-md font-medium text-sm inline-flex items-center hover:bg-[#15803D] transition-colors">
L381:                                Open report →
L382:                              </span>
L383:                            </div>
L384:                          </Link>
L385:                        )}
L386:                      </div>
L387:                    );
L388:                  })}
L389:                </MonthAccordion>
L390:              ))}
L391:            </div>
L392:          </>
L393:        )}
L394:
L395:        <Link href="/" className="mt-10 inline-block text-base font-medium text-[#9E9C98] hover:text-[#1A1916] transition-colors">← Back to home</Link>
L396:      </div>
L397:    </div>
L398:  );
L399:}
L400:```

