# KoreaScout — 프로젝트 현황 (PROJECT_2STATUS) v3.0

> 전수조사 기준: 코드베이스 직접 열람. 모든 항목에 근거 파일명·줄번호 명시.

---

## ZONE A: 설정 및 인프라

### 기술 스택 (package.json)
- **next:** 16.1.6 (package.json 15행)
- **react / react-dom:** 19.2.3 (package.json 16-17행)
- **@supabase/ssr:** ^0.8.0, **@supabase/supabase-js:** ^2.98.0 (package.json 11-12행)
- **framer-motion:** ^12.35.0, **lucide-react:** ^0.575.0 (package.json 13-14행)
- **tailwindcss:** ^4, **@tailwindcss/postcss:** ^4 (package.json 21, 26행)
- **typescript:** ^5 (package.json 27행)

### 루트 설정
- **next.config.ts:** images.remotePatterns에 Unsplash, Supabase, Naver, Coupang 등 허용 (1-56행).
- **middleware.ts:** /admin 비로그인 시 /admin/login 리다이렉트; 쿠키 `kps_admin_session` 또는 env `ADMIN_COOKIE_NAME` 사용 (1-27행). 그 외 경로는 `updateSession` 호출.
- **tsconfig.json:** target ES2017, paths `@/*` → `./*`, strict true, jsx react-jsx (1-33행).
- **postcss.config.mjs:** `@tailwindcss/postcss`만 사용 (1-7행).
- **eslint.config.mjs:** next core-web-vitals + typescript, .next/ out/ build/ 무시 (1-17행).

### 환경 변수 (코드에서 참조된 것)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (lib/supabase/client.ts 5-6, server.ts 11-12, middleware.ts 8-9, admin.ts 9-10)
- `SUPABASE_SERVICE_ROLE_KEY` (lib/supabase/admin.ts 10)
- `LEMONSQUEEZY_WEBHOOK_SECRET` (app/api/webhooks/lemonsqueezy/route.ts 5)
- `LEMONSQUEEZY_VARIANT_ID_STANDARD`, `LEMONSQUEEZY_VARIANT_ID_ALPHA` (app/api/webhooks/lemonsqueezy/route.ts 12-16)
- `ADMIN_COOKIE_NAME` (middleware.ts 7, app/api/admin/reports/route.ts 5, app/api/admin/reports/[id]/route.ts 7, app/api/admin/auth/route.ts 22, app/api/admin/logout/route.ts 4)
- `ADMIN_PASSWORD` (app/api/admin/auth/route.ts 7)

### .cursorrules 요약
- _docs/standard: 헌법 문서만. _docs/ 루트에 파일 생성 금지.
- 3-tier 접근: FREE / STANDARD / ALPHA. canSeeAlpha·LockedSection 제거·티어 조건 완화 금지.
- UI 100% 영어, CEO 소통 100% 한국어.
- Spec 선독: PROJECT_SPEC, DESIGN_SYSTEM, ACCESS_CONTROL_LOGIC.
- 색상: #16A34A, #15803D, #1A1916, #E8E6E1, #F8F7F4 등 지정 토큰만 사용 (.cursorrules 176-197행).
- Git: checkout/reset/revert/clean 사용자 명시 허락 없이 금지 (.cursorrules 243-245행).

---

## ZONE B: 설정 파일 (pricing 등)

### src/config/pricing.ts (전문)
- `PRICING.FREE`: monthly 0, daily 0
- `PRICING.STANDARD`: monthly 69, daily 2.3
- `PRICING.ALPHA`: monthly 129, daily 4.3, marketingDailyLimit 4.5
- `PRICING.CURRENCY`: "$"

---

## ZONE C: lib/ 백엔드 로직

### lib/supabase/client.ts
- `createClient()`: createBrowserClient(URL, ANON_KEY). 클라이언트 컴포넌트용.

### lib/supabase/server.ts
- `createClient()`: createServerClient + cookies (getAll/setAll). RLS 적용.

### lib/supabase/middleware.ts
- `updateSession(request)`: createServerClient로 세션 갱신, getUser() 호출.

### lib/supabase/admin.ts
- `createServiceRoleClient()`: service_role 키, RLS 우회. 웹훅·관리용.

### lib/auth-server.ts
- `getAuthTier()`: 서버에서 createClient()로 getUser(), profiles에서 tier·subscription_start_at 조회 (23-27행). **주의:** profiles 스키마(001)에 subscription_start_at 없음 — 타입/DB 불일치.

### app/actions/favorites.ts
- `toggleFavorite(reportId, weekId?)`: user_favorites 테이블 insert/delete, revalidatePath /account, /weekly/[weekId].

---

## ZONE D: app/ 라우팅 전체

### app/layout.tsx
- Plus_Jakarta_Sans, JetBrains_Mono 폰트 변수. Header 포함. body bg-[#0A0908].

### app/page.tsx (랜딩)
- **권한:** 비로그인 포함 전체 공개.
- **구현 섹션:** S1 Hero(Hero), S2 DynamiteFuseSection, S4 LandingTimeWidget, S5 Intelligence Engine(6-layer+Market Brief 카드), S6 Launch Kit(4문항 카드), S6 IntelligencePipeline, S8 Pricing(3-tier 카드, getAlphaCount 서비스롤), S8b Institutional Policy, S9 Trust+Founder+FAQ(FaqAccordion)+Ready CTA, Footer(Pricing/Sample Report/Contact 링크).
- **상태:** 서버 컴포넌트. getAlphaCount()로 profiles tier=alpha count 조회 (45-56행). STANDARD/ALPHA 체크아웃 URL 하드코딩 (22-25행). isFull 시 /waitlist 링크 (411-416행).
- **미구현 라우트:** /contact, /waitlist 링크는 있으나 해당 page.tsx 없음 (footer 509행, pricing 411행).

### app/pricing/page.tsx
- **권한:** 전체 공개.
- **구현:** S1 다크 히어로, S2 3-tier 카드(Free/Standard/Alpha), S3 Alpha Moat, S4 FEATURE_GROUPS 테이블, S6 최종 CTA. getAlphaMemberCount() 서비스롤. Alpha 만석 시 /waitlist.

### app/auth/callback/route.ts
- GET: code 있으면 exchangeCodeForSession 후 `${origin}/sample-report` 리다이렉트 (4-12행). next 파라미터 미반영.

### app/login/page.tsx
- **권한:** 비로그인 대상. useRouter, useSearchParams(next, error). signInWithPassword. 성공 시 nextUrl || "/". GoogleSignInButton.

### app/signup/page.tsx
- **권한:** 비로그인 대상. signUp 후 success 시 "Check your email" UI. isPasswordValid: 8자 이상+숫자 또는 특수문자.

### app/forgot-password/page.tsx
- resetPasswordForEmail, redirectTo `${origin}/auth/callback?next=/reset-password`.

### app/reset-password/page.tsx
- updateUser({ password }), 성공 시 router.push("/login").

### app/account/page.tsx
- **권한:** 로그인 필수, 미로그인 시 redirect("/login") (19-22행).
- **구현:** getAuthTier(), scout_final_reports count, user_favorites로 My Picks 목록, FavoriteButton·ManageBillingButton. tier별 Upgrade/Manage Billing 링크. "Billing portal will be available in Phase 4." (261행).

### app/account/password/page.tsx
- **권한:** 로그인 필수. useEffect에서 getUser 없으면 replace("/login"). updateUser({ password }) 후 /account?updated=password.

### app/weekly/page.tsx
- **권한:** 로그인 필수 (66-68행 redirect("/login")).
- **구현:** getAuthTier(), weeks 조회(status=published), latest 3주, Free Sliding Window(14일 지난 주 1개), Golden Handcuffs(subscriptionStartAt·최신 3주). MonthAccordion으로 The Vault, Featured Report(Free만). canAccessWeek 분기.

### app/weekly/[weekId]/page.tsx
- **권한:** 로그인 필수. canAccess 동일 로직. RLS로 scout_final_reports·user_favorites 조회. FavoriteButton, 제품 카드 링크 /weekly/[weekId]/[id].

### app/weekly/[weekId]/[id]/page.tsx
- **권한:** 로그인 후 RLS로 열람 가능한 보고서만. canSeeStandard / canSeeAlpha·isTeaser 분기. ProductIdentity, TrendSignalDashboard, MarketIntelligence, SocialProofTrendIntelligence, SourcingIntel, SupplierContact. LockedSection(SECTION_3/4/CONSUMER/ALPHA_SOURCING/ALPHA_SUPPLIER). ClientLeftNav.

### app/weekly/MonthAccordion.tsx
- 클라이언트: useState(open), ChevronDown, defaultOpen·currentMonthKey.

### app/sample-report/page.tsx
- **권한:** 공개. sampleReportData 사용, tier="alpha", isTeaser true. ProductIdentity~SupplierContact 전부 표시. 상단 배너 "Subscribe to Alpha".

### app/admin/page.tsx
- **권한:** 쿠키 kps_admin_session=authenticated. GET /api/admin/reports. week/status 필터, 로그아웃 POST /api/admin/logout 후 location /admin/login.

### app/admin/login/page.tsx
- POST /api/admin/auth { password }. 성공 시 router.push("/admin").

### app/admin/[id]/page.tsx
- **권한:** 동일 쿠키. GET/PATCH /api/admin/reports/[id]. 폼: Product Identity, Trend Signal, Market Intel, Social Proof, Export & Logistics, Launch Kit. GlobalPricesHelper, HazmatCheckboxes, AiPageLinksHelper. status published/hidden 선택. edit_history JSON 저장. PATCH 시 kr_price_usd·estimated_cost_usd 제외 (57-58행).

### app/error.tsx
- "use client". error, reset. Logo, "Intelligence Interrupted.", Try Again·Back to Home.

### app/not-found.tsx
- Logo, "Intelligence Not Found.", Back to Home.

### API 라우트
- **app/api/webhooks/lemonsqueezy/route.ts:** POST, x-signature 검증, subscription_created/updated 시 variant_id로 tier 매핑, profiles update by user_id(custom_data) 또는 email. subscription_cancelled/expired 시 tier=free, ls_subscription_id=null.
- **app/api/admin/reports/route.ts:** GET, 쿠키 검사 후 scout_final_reports 목록 (id, product_name, week_id, market_viability, status, created_at).
- **app/api/admin/reports/[id]/route.ts:** GET 단일, PATCH 업데이트. assertAdmin 쿠키. revalidatePath weekly.
- **app/api/admin/auth/route.ts:** POST { password }, ADMIN_PASSWORD와 일치 시 쿠키 설정 7일.
- **app/api/admin/logout/route.ts:** POST, 쿠키 삭제 후 redirect /admin/login.

---

## ZONE E: components/ 요약

- **layout:** Header(server)→HeaderShellClient, HeaderNavClient(로그인 시 Weekly Report/Account/Logout), ClientLeftNav(sections, userEmail, tier, IntersectionObserver).
- **report:** ProductIdentity, TrendSignalDashboard, MarketIntelligence, SocialProofTrendIntelligence, SourcingIntel, SupplierContact. constants(SECTION_*_CTA, EXPORT_STATUS_DISPLAY). utils(formatHsCode, parseGlobalPricesForGrid, getAiDetailUrl 등).
- **ui (components/ui/index.ts):** Button, Card, Badge, Input, Textarea, KeywordPill, PaywallOverlay.
- **기타:** Hero(HeroCTA, /videos/hero.mp4), DynamiteFuseSection, LandingTimeWidget, IntelligencePipeline, FaqAccordion, LaunchKit, Logo, LogoutButton, ManageBillingButton, FavoriteButton(toggleFavorite), RemoveFavoriteButton, GoogleSignInButton(signInWithOAuth google), HazmatBadges, BrokerEmailDraft, ExpandableText, GroupBBrokerSection, DonutGauge, LockedSection, StatusBadge, ViralHashtagPills, CopyButton, GlobalPricingTable, TagCloud, PriceComparisonBar, ScrollToIdButton, AlphaVaultPreview, SplashScreen, GrandEntrance, IntelligenceTicker, ContactCard. **admin:** HazmatCheckboxes, AiPageLinksHelper, GlobalPricesHelper.

---

## ZONE F: CSS 및 디자인 시스템

### app/globals.css
- @import "tailwindcss"; @theme inline: --color-cream-50~400, --color-ink-100~900, --color-accent, --color-danger, --color-warning, --color-info, semantic aliases (--color-bg-page 등), --font-sans/mono, --radius-sm~2xl, --shadow-card/elevated/modal.
- :root: --background #030303, --foreground #ffffff, --indigo, --purple, --amber, --bg-card, --border, --text-muted/mid.
- @layer base: body 배경·색·font-family·font-size 1.0625rem.
- keyframes: hero-fade-in, s2-scale-noise, s2-scale-alpha, floatDrift, pulse, pulseDot.
- .s6-section ~ .s6-badge: Intelligence Pipeline 섹션용 클래스. @media (max-width: 768px) .s6-row 컬럼 전환.

### _docs/standard (참조된 스펙)
- 01_CORE_SPEC.md: DB 변경 규칙, v1.3 가격 정책 등.
- 04_ACCESS_CONTROL_LOGIC.md: Gate 1~3, Golden Handcuffs, Free Sliding Window, subscription_start_at 언급.
- 02_DESIGN_SYSTEM.md, 02_PRICING_STRATEGY.md, 10_LUXURY_UI_AUDIT.md, SAMPLE_REPORT_AUDIT.md, DATA_SCHEMA_RECON_REPORT.md 등 존재.

---

## ZONE G: public/ 미디어

- **확인된 파일:** window.svg, file.svg, vercel.svg, images/skin1004.png, images/noise-search.png, images/Gemini_Generated_Image_x9yjm1x9yjm1x9yj.png, videos/README.md, **videos/hero.mp4** (존재). Hero.tsx 35행 src="/videos/hero.mp4".

---

## 구현 여부 요약

| 항목 | 상태 | 근거 |
|------|------|------|
| /contact | 미구현 | app/contact/page.tsx 없음, footer 링크만 존재 |
| /waitlist | 미구현 | app/waitlist/page.tsx 없음, pricing·home 링크만 존재 |
| auth/callback next 파라미터 | 미반영 | route.ts 항상 /sample-report로 리다이렉트 |
| Billing portal | 미구현 | account 페이지 "Phase 4" 문구 |
| user_favorites 테이블 | 코드에서 사용 | 마이그레이션 파일에는 정의 없음 (PROJECT_2DB_STATUS 참고) |
| profiles.subscription_start_at | 코드에서 조회 | lib/auth-server.ts 26행; 스키마/타입에 없음 |

---

## 신규 발견 항목 (블라인드 스팟)

- **app/weekly/MonthAccordion.tsx:** app/weekly 하위에 있는 클라이언트 컴포넌트 (페이지가 아님).
- **components/admin/GlobalPricesHelper, HazmatCheckboxes, AiPageLinksHelper:** admin [id] 편집 폼에서만 사용.
- **data/sampleReportData.ts:** sample-report 전용 정적 데이터, ScoutFinalReportsRow 타입 완전 구현.
- **ReportStatus 'hidden':** types/database.ts 12행 ReportStatus에 'hidden' 포함. admin [id]에서 status published/hidden 선택 (316-317행). 001 마이그레이션 CHECK에는 'draft','published','archived'만 있음.

---

*문서 끝. 모든 기술적 서술은 위에 명시한 파일·행 기준으로 검증됨.*
