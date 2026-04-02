# KoreaScout Mobile Scan Report — 2026-04-01

## 1. Mobile Header

- **File:** `c:\k-productscout\components\layout\HeaderShellClient.tsx` (헤더 셸), `c:\k-productscout\components\layout\HeaderNavClient.tsx` (우측 네비), `c:\k-productscout\components\layout\Header.tsx` (서버 래퍼)
- **Hamburger implemented:** no
- **Responsive logic:** `HeaderNavClient.tsx`에서 링크 묶음에 `className="hidden items-center gap-2 md:flex md:gap-3"` — `md` 미만에서 Weekly Report / Pricing(또는 Upgrade) / Account 링크는 숨김. `useMediaQuery` 등은 사용하지 않음.
- **Items shown on mobile (< md):**
  - 비로그인: **Login** 버튼만 (`Weekly Report`, `Pricing` 숨김).
  - 로그인: **LogoutButton**만 (`Weekly Report`, `Pricing`/`Upgrade`, `Account` 숨김).
- **Dedicated mobile nav / hamburger JSX block:** NOT FOUND (햄버거·드로어·별도 모바일 메뉴 컴포넌트 없음).

**Relevant lines — `HeaderShellClient.tsx` 60–93:**

```tsx
    <header
      className={`fixed top-0 left-0 w-full z-50 h-[80px] flex flex-col justify-center ${
        isTransparent
          ? "bg-transparent shadow-none"
          : "bg-[#F8F7F4] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]"
      }`}
      style={{
        contain: "layout",
        transform: "translate3d(0,0,0)",
        backfaceVisibility: "hidden",
        WebkitFontSmoothing: "antialiased",
        transition: "background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        borderBottom: isTransparent ? "1px solid transparent" : "1px solid rgba(232,230,225,0.8)",
      }}
    >
      <div className="mx-auto flex h-[80px] w-full max-w-[1440px] items-center justify-between px-8 sm:px-12">
        <Link
          href="/"
          className="flex h-10 w-auto shrink-0 items-center bg-transparent [background:transparent] [background-color:transparent!important] [background-image:none!important]"
          aria-label="KoreaScout home"
        >
          <Logo
            className="h-full w-auto object-contain"
            style={{
              filter: isTransparent ? "brightness(0) invert(1)" : "none",
              transition: "filter 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </Link>

        <HeaderNavClient user={user} tier={tier} isTransparent={isTransparent} />
      </div>
    </header>
```

**Relevant lines — `HeaderNavClient.tsx` 41–81 (모바일에서 보이는 영역 = `md` 미만 시 링크 그룹 숨김 + Login/Logout만 노출):**

```tsx
  if (!user) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 md:flex md:gap-3">
          <Link href="/login" className={ghostClass} style={transitionStyle} title="Sign in to view weekly reports">
            Weekly Report
          </Link>
          <Link href="/pricing" className={ghostClass} style={transitionStyle}>
            Pricing
          </Link>
        </div>
        <Link href="/login" className={primaryClass} style={transitionStyle}>
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="hidden items-center gap-2 md:flex md:gap-3">
        <Link href="/weekly" className={ghostClass} style={transitionStyle}>
          Weekly Report
        </Link>
        {tier === "free" && (
          <Link href="/pricing" className={ghostClass} style={transitionStyle}>
            Pricing
          </Link>
        )}
        {tier === "standard" && (
          <Link href="/pricing" className={ghostClass} style={transitionStyle}>
            Upgrade
          </Link>
        )}
        <Link href="/account" className={ghostClass} style={transitionStyle}>
          Account
        </Link>
      </div>
      <LogoutButton className={primaryClass} style={transitionStyle} />
    </div>
  );
```

---

## 2. Creator/Seller Toggle

- **File:** `c:\k-productscout\components\LandingTimeWidget.tsx`
- **Relevant lines:** 63–91 (토글 컨테이너 + 버튼)
- **Toggle button styles (요약):**
  - **className (버튼):** `px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap`
  - **font size:** `text-sm` (Tailwind)
  - **padding:** `px-6 py-2.5`
  - **width:** 명시적 `w-*` 없음 (콘텐츠·패딩에 따름)
  - **외곽 pill:** `flex rounded-full p-1` + 인라인 `style={{ background: "#E8E6E1" }}`
  - **활성/비활성:** 인라인 `style`로 배경·색·그림자 제어

```tsx
        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div
            className="flex rounded-full p-1"
            style={{ background: "#E8E6E1" }}
          >
            {(["creator", "seller"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap"
                style={
                  mode === m
                    ? {
                        background: "#0A0908",
                        color: "#F8F7F4",
                        boxShadow: "0 2px 8px 0 rgb(10 9 8 / 0.18)",
                      }
                    : {
                        background: "transparent",
                        color: "#9E9C98",
                      }
                }
              >
                {m === "creator" ? "🎬 I'm a Creator" : "🏪 I'm a Global Seller"}
              </button>
            ))}
          </div>
        </div>
```

---

## 3. Hero Headline

- **File:** `c:\k-productscout\components\Hero.tsx`
- **Relevant lines:** 20–83 (섹션 + `h1`)
- **Headline `className`:** `font-black text-[#FFFFFF]`
- **Headline 인라인 스타일:** `margin: 0`, `fontSize: "clamp(1.4rem, 3.2vw, 3.5rem)"`, `fontWeight: 900`, `letterSpacing: "-0.04em"`, `textAlign: "center"`, `lineHeight: 1.1`, `padding: "0 20px"`, `whiteSpace: "nowrap"` — **overflow 관련 클래스 없음** (`overflow-hidden` 등 headline 자체에는 없음)
- **Parent `overflow` / clip:** 최상위 `<section>`에 **`className="... overflow-hidden ..."`** 있음 (라인 21–22).

```tsx
    <section
      className="relative w-full h-screen min-h-[640px] flex flex-col items-center justify-end overflow-hidden bg-[#0A0908]"
      style={{ marginTop: 0, paddingTop: 0, width: "100%", maxWidth: "100vw" }}
    >
      {/* ... video, overlays omitted ... */}

      <div
        className="relative text-center px-6 max-w-7xl mx-auto flex flex-col items-center justify-center"
        style={{ zIndex: 20, paddingBottom: "clamp(60px, 10vh, 120px)" }}
      >
        <h1
          className="font-black text-[#FFFFFF]"
          style={{
            margin: 0,
            fontSize: "clamp(1.4rem, 3.2vw, 3.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            textAlign: "center",
            lineHeight: 1.1,
            padding: "0 20px",
            whiteSpace: "nowrap",
          }}
        >
          The K-Beauty Trend Pipeline.<br />Before Your Feed Knows It Exists.
        </h1>

        <div className="mt-20 flex flex-col items-center justify-center">
          <HeroCTA />
        </div>
      </div>
    </section>
```

---

## 4. Pricing Table

- **File (요청 문구 “What’s Inside Every Report” + “Product Identity” 그룹):** `c:\k-productscout\app\pricing\page.tsx`
- **Relevant lines:** 데이터 `FEATURE_GROUPS` 42–107 (첫 그룹 라벨 `"Product Identity"`); UI 348–418
- **Layout:** **CSS Grid** — `grid grid-cols-4` (헤더 행 + 각 기능 행). **`<table>` 아님.**
- **className (요약):** 섹션 `bg-[#F8F7F4] py-24 px-6`; 카드 `mb-8 bg-white rounded-2xl border border-[#E8E6E1] overflow-hidden`; 그리드 행 `grid grid-cols-4 px-6 py-4 ...`; 기능 텍스트 `text-base font-medium ... leading-snug`; 열 헤더 `text-xs font-black uppercase ...`
- **overflow:** 카드에 `overflow-hidden`; 그리드에 별도 `overflow-x-auto` 없음 (좁은 뷰포트에서 4열 고정 시 가로 압박 가능).
- **참고:** `components/GlobalPricingTable.tsx`는 별도 **`<table className="min-w-full text-sm">`** 기반 “Global Pricing Matrix”이며, 파일 주석상 **ORPHAN COMPONENT — not currently imported** 상태임.

**전체 테이블 구조 JSX (`app/pricing/page.tsx` 348–418):**

```tsx
      <section className="bg-[#F8F7F4] py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-black text-[#1A1916] tracking-tighter uppercase text-center mb-16 text-xl whitespace-nowrap">
            What&apos;s Inside Every Report
          </h2>
          {FEATURE_GROUPS.map((group) => (
            <div
              key={group.label}
              className="mb-8 bg-white rounded-2xl border border-[#E8E6E1] overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-[#E8E6E1]">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#1A1916]">
                  {group.label}
                </p>
              </div>
              <div className="grid grid-cols-4 px-6 py-3 bg-[#F8F7F4] border-b border-[#E8E6E1]">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9E9C98]">
                  Feature
                </p>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9E9C98] text-center">
                  Free
                </p>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9E9C98] text-center">
                  Standard
                </p>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#16A34A] text-center border-t-2 border-[#16A34A] -mt-3 pt-3">
                  Alpha
                </p>
              </div>
              {group.rows.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-4 px-6 py-4 items-center border-b border-[#E8E6E1] last:border-0 ${
                    i % 2 === 0 ? "bg-white" : "bg-[#F8F7F4]/50"
                  }`}
                >
                  <p className="text-base font-medium text-[#1A1916] pr-4 leading-snug">
                    {row.feature}
                  </p>
                  <p
                    className={`text-base font-bold text-center ${
                      row.free === "✓" ? "text-[#16A34A]" : "text-[#9E9C98]"
                    }`}
                  >
                    {row.free}
                  </p>
                  <p
                    className={`text-base font-bold text-center ${
                      row.standard === "✓" ? "text-[#16A34A]" : "text-[#9E9C98]"
                    }`}
                  >
                    {row.standard}
                  </p>
                  <p
                    className={`text-base font-black text-center ${
                      row.alpha === "✓" || row.alpha === "Full"
                        ? "text-[#16A34A]"
                        : "text-[#1A1916]"
                    }`}
                  >
                    {row.alpha}
                  </p>
                </div>
              ))}
            </div>
          ))}
          <p className="text-[11px] md:text-xs text-[#8A8884] mt-6 italic text-center max-w-3xl mx-auto leading-relaxed">
            * Note: Certain supplier information in the Alpha tier may be redacted or undisclosed depending on strict manufacturer confidentiality policies.
          </p>
        </div>
      </section>
```

---

## 5. page.tsx Structure

- **File:** `c:\k-productscout\app\page.tsx`
- **Total lines:** 805

**렌더 순서 (`<main>` 기준, 주석 라벨 포함):**

1. `<Hero />` — S1 HERO  
2. `<LandingPipelineSneakPeek />` — S1.5  
3. **인라인** `<section>` — S2.5 SOLDOUT SIGNAL (라인 78–108)  
4. `<LandingTimeWidget />` — S4  
5. **인라인** `<section>` — S6 LAUNCH KIT (라인 114–255)  
6. `<IntelligencePipeline />` — S6 THE INTELLIGENCE PIPELINE  
7. **인라인** `<section>` — S7 INTELLIGENCE ENGINE (라인 261–423)  
8. **인라인** `<section id="pricing-cards">` — S8 PRICING (라인 426–603)  
9. **인라인** `<section>` — S8b INSTITUTIONAL POLICY (라인 606–637)  
10. `<DynamiteFuseSection />` — S2 THE INTELLIGENCE GAP  
11. **인라인** `<section>` — S9 TRUST + FOUNDER + FAQ + READY (라인 643–763; 내부에 `<FaqAccordion />`)  
12. **인라인** `<footer>` (라인 766–800)

**인라인 섹션(컴포넌트로 추출되지 않은 블록):** 위 3, 5, 7, 8, 9, 11, 12.

**페이지 내 로컬 컴포넌트/함수:** `UnlockIcon`, `LockIcon`, `getAlphaCount` (이 파일 전용).

```tsx
// Imports (컴포넌트)
import Hero from "@/components/Hero";
import LandingPipelineSneakPeek from "@/components/LandingPipelineSneakPeek";
import DynamiteFuseSection from "@/components/DynamiteFuseSection";
import IntelligencePipeline from "@/components/IntelligencePipeline";
import LandingTimeWidget from "@/components/LandingTimeWidget";
import CheckoutButton from "@/components/CheckoutButton";
import FaqAccordion from "@/components/FaqAccordion";

// <main> 내부 순서 (개념적 목록)
<Hero />
<LandingPipelineSneakPeek />
<section> {/* S2.5 soldout */} ... </section>
<LandingTimeWidget />
<section> {/* Launch Kit */} ... </section>
<IntelligencePipeline />
<section> {/* Intelligence Engine / Market Brief card */} ... </section>
<section id="pricing-cards"> {/* 3-tier pricing */} ... </section>
<section> {/* Institutional Policy */} ... </section>
<DynamiteFuseSection />
<section> {/* Trust, Founder, FAQ, Ready CTA */} ... <FaqAccordion /> ... </section>
<footer> ... </footer>
```

---

## 6. Global Styles

### tailwind.config.ts findings

- **NOT FOUND** — 프로젝트 루트 및 일반 경로에서 `tailwind.config.ts` (및 `tailwind.config.js`) 파일 없음. `package.json`에 `tailwindcss: ^4`, `@tailwindcss/postcss` 사용.

### globals.css findings

- **파일:** `c:\k-productscout\app\globals.css`
- **Custom breakpoints:** Tailwind `@theme inline` 블록 안에 **명시적 `screens` / breakpoint 키 정의 없음**. 대신 **`.s6-row` 등용 `@media (max-width: 768px)`** (라인 341–363)로 768px 이하 레이아웃 전환.
- **Global `overflow-x`:** `body`/`html`에 **`overflow-x: hidden` 전역 규칙 없음**. 다만 랜딩 `app/page.tsx`의 `<main>`에 `overflow-x-clip` (라인 69).
- **Font size / heading scale (모바일 전용 전역):**
  - `@layer base`의 `body { font-size: 1.0625rem; }` (~17px, 라인 57–64) — 뷰포트 구분 없이 전역.
  - `.s6-headline h2`, `.s6-output-num` 등 **일부 레거시/섹션 클래스**에 `clamp(...)` (라인 138–148, 299–307).
  - `@media (max-width: 768px)` 블록은 주로 `.s6-*` 파이프라인 레이아웃 조정 (라인 341–363); 일반 `h1` 모바일 전용 글로벌 스케일은 해당 미디어쿼리에 **없음** (일반 `h1`/`h2` 크기는 `@media print` 안에만 별도 지정, 라인 452–454).

---

*본 문서는 저장소 읽기 전용 스캔 결과이며, 애플리케이션 소스 코드는 변경하지 않았습니다.*
