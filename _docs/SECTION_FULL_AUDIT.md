# SECTION FULL AUDIT (SCAN ONLY)

## 1) `components/Hero.tsx`

### 서브헤드 `<p>` 태그 전체 코드 (Weekly Korean Product... 부분)
```tsx
<p
  className="font-bold uppercase mb-4"
  style={{
    fontSize: "clamp(9px, 2vw, 11px)",
    letterSpacing: "0.2em",
    textAlign: "center",
    whiteSpace: "normal",
    overflowWrap: "break-word",
    padding: "0 16px",
    color: "rgba(255,255,255,0.4)",
  }}
>
  Weekly Korean Product Intelligence for Global Sellers.
</p>
```

### `whiteSpace` 관련 현재 스타일
- `whiteSpace: "normal"`
- `overflowWrap: "break-word"`

### 현재 `fontSize` clamp 값
- `fontSize: "clamp(9px, 2vw, 11px)"`

---

## 2) `components/LandingPipelineSneakPeek.tsx`

### `<h2>` 전체 코드 (We Scout What's Hot...)
```tsx
<h2 className="text-2xl md:text-3xl font-semibold text-ink-900 leading-[1.2] tracking-tight">
  We Scout What's Hot in Korea.<br />You Lead the Global Trend.
</h2>
```

### 현재 폰트 클래스
- `text-2xl md:text-3xl font-semibold text-ink-900 leading-[1.2] tracking-tight`

### 비교용: `DynamiteFuseSection`의 `<h2>` 폰트 클래스
`components/DynamiteFuseSection.tsx` 내 `<h2>` 2개:
- 첫 번째 `<h2>`: `font-bold text-white text-4xl md:text-6xl mb-2`
- 두 번째 `<h2>`: `font-bold text-4xl md:text-6xl mb-6`

---

## 3) `app/page.tsx` S2.5 SOLDOUT SIGNAL 섹션 전체 코드

```tsx
{/* ══ S2.5: SOLDOUT SIGNAL ════════════════════════════════════ */}
<section className="bg-[#0A0908] py-32 px-6 text-center overflow-hidden">
  <div className="max-w-4xl mx-auto">
    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#16A34A] mb-6">
      EVERY WEEK
    </p>
    <h2
      className="font-black text-white text-center mb-12"
      style={{
        fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
        letterSpacing: "-0.04em",
        lineHeight: 1.05,
      }}
    >
      The same question —<br />
      <span className="text-[#16A34A]">&ldquo;What&apos;s next?&rdquo;</span><br />
      We answer it before it sells out.
    </h2>
    <div className="relative max-w-xs mx-auto rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(22,163,74,0.15)]">
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
</section>
```

### 요청 항목 개별 체크
- `EVERY WEEK` eyebrow `<p>`: 위 코드 그대로
- `<h2>` 전체: 위 코드 그대로
- `<video>` 태그 전체: 위 코드 그대로

### 현재 레이아웃 구조 (flex/grid 여부)
- 해당 섹션(`S2.5`)은 **`flex`/`grid` 레이아웃 미사용**
- 사용 구조:
  - `<section>` (text-center, spacing/overflow 클래스)
  - 내부 래퍼 `<div className="max-w-4xl mx-auto">`
  - 비디오 컨테이너 `<div className="relative max-w-xs mx-auto ...">`

---

## 4) `app/page.tsx`의 `DynamiteFuseSection` 현재 위치

### 현재 어느 라인에 있는지
- `DynamiteFuseSection` 렌더 라인: **L584**
  - 코드: `<DynamiteFuseSection />`

### 전후 섹션 컴포넌트명
- 직전 섹션: **S8 PRICING** (`<section id="pricing-cards" ...>`, 시작 L404)
- 직후 섹션: **S8b INSTITUTIONAL POLICY** (`<section className="bg-[#1A1916] py-20 px-6">`, 시작 L587)

### Institutional Policy (Why only 3000) 섹션 라인
- 섹션 시작 라인: **L587**
- `"Why only 3,000 members?"` 헤드라인 라인: **L596**

### Institutional Policy 끝나는 라인
- 섹션 종료 라인: **L618** (`</section>`)

