# KoreaScout — Luxury UI Design Constitution

> **위치:** `_docs/standard/` (CONSTITUTION — 영구 표준)  
> **기준:** Section 4 (Social Proof & Trend Intelligence) 최종 코드에서 확정  
> **적용 범위:** 상품 상세 페이지 및 동일 계층의 럭셔리 카드/타이포그래피

---

## Absolute Typography & Card Rules

다음 규칙은 **추측 없이** Section 4에서 확정된 값만 사용한다.  
다른 섹션(Section 5 등) 오버홀 시 이 Constitution을 우선 적용한다.

---

### 1. Main Header (블록 최상단 라벨)

카드/블록의 메인 헤더(예: "Social Buzz", "Market Gap Analysis", "Trending Signals").

```tsx
className="text-xs font-semibold text-[#9E9C98] uppercase tracking-[0.2em] mb-4"
```

- **용도:** 블록 제목, 섹션 내 1단계 라벨.
- **margin:** `mb-4` (필요 시 디자인에 따라 `mb-6`, `mb-10` 등으로 확장 가능).

---

### 2. Sub-Label (블록 내 서브 라벨)

블록 내 2단계 라벨(예: "Korean Traction", "Global Presence", "Rising Keywords (KR)").

```tsx
className="text-[10px] font-bold text-[#9E9C98] uppercase tracking-[0.3em] mb-3"
```

- **용도:** 숫자/본문 바로 위의 작은 라벨.
- **margin:** `mb-3` (필요 시 `mb-4` 등).

---

### 3. Body Text (200자 삼항 로직)

길이에 따라 폰트 크기를 나누는 evidence/본문 텍스트.

```tsx
className={
  (report.[field]?.length ?? 0) > 200
    ? "text-sm text-[#3D3B36] leading-relaxed mt-5 opacity-90"
    : "text-base text-[#3D3B36] leading-relaxed mt-5 opacity-90"
}
```

- **용도:** `kr_evidence`, `global_evidence` 등 긴 본문.
- **규칙:** 200자 초과 시 `text-sm`, 이하 시 `text-base`. 공통: `text-[#3D3B36] leading-relaxed mt-5 opacity-90`.
- **DOM:** 동일한 데이터 소스에 대해 한 블록 내에서만 한 번 적용. 구조/로직 변경 없이 className만 통일.

---

### 4. Card Container (크림 카드 래퍼)

블록 전체를 감싸는 카드(배경·둥근 모서리·패딩).

```tsx
className="bg-[#F8F7F4] rounded-2xl p-10 mb-12"
```

- **용도:** Section 4 Block 1~5, 동일 톤의 카드 블록.
- **색:** `#F8F7F4` (소프트 크림). 테두리 필요 시 `border border-[#E8E6E1]` 추가.

---

### 5. Hero Number (중앙 대형 숫자)

Gap Index 등 단일 숫자 히어로.

```tsx
<p
  className="font-black text-[#16A34A] leading-none tracking-tighter py-32"
  style={{ fontSize: "140px" }}
>
  {value}
</p>
```

- **레이아웃:** 부모에 `text-center`. Hero 숫자 자체에 `py-32` 적용(중앙 정렬·세로 여백).
- **규칙:** `text-[140px]` (또는 style `fontSize: "140px"`), `font-black`, `text-[#16A34A]`, `leading-none`, `py-32`.

---

## Enforcement

- **Section 5(Export & Logistics) 오버홀 전:** 이 문서를 반드시 읽고, 위 규칙과 충돌하는 기존 스타일은 Constitution 우선으로 교체.
- **새 블록 추가 시:** Main Header / Sub-Label / Body / Card / Hero에 위 클래스를 사용. 색상은 `.cursorrules` 및 `DESIGN_SYSTEM.md` 승인 토큰 준수.
- **변경 시:** Constitution 수정은 대표 승인 후 `_docs/standard/` 내 이 파일만 업데이트. 아카이브 복사본은 갱신하지 않음.

---

*Last updated from Section 4 final code. Do not start Section 5 until this Constitution is saved and read.*
