# Security Audit Report
Generated: 2025-03-02

## CRITICAL FINDINGS (즉시 수정 필요)

- **🔴 Case B (보안 누수)**: **0건** — blur/opacity가 조건 분기 밖에서 진짜 DB 데이터에 적용된 곳 없음.
- **🔴 lockedFields 미주입**: **1건** — `SECTION_ALPHA_SUPPLIER_CTA` (S6 Supplier Contact)의 `lockedFields: []` 빈 배열. 호출부에서 lockedFields가 비어 있음.

## STRUCTURE FINDINGS (UI 개선 필요)

- **🟡 Case C (헤더 페이드아웃)**: **2건**
  - **라인 865–880 (Scout Strategy Report)**: 섹션 헤더 "Scout Strategy Report"(정적 텍스트)가 조건 없이 렌더되고, 그 아래 블러된 콘텐츠 위에 그라데이션 오버레이. 헤더는 DB 값 아님.
  - **라인 910–1151 (Section 5 Export & Logistics)**: "Export Readiness", "HS Code & Classification", "Weight & Shipping" 등 정적 섹션 헤더가 BlurredValue 밖에서 렌더됨. `!canSeeAlpha` 시 전체 섹션 위에 그라데이션 오버레이. 헤더는 모두 정적 라벨.

---

## SCAN 1. blur / opacity / 시각적 은폐 클래스 분류

| 라인 | 클래스 | 주변 컨텍스트 (10줄 확인) | 분류 |
|------|--------|--------------------------|------|
| 24 | blur-sm select-none pointer-events-none | BlurredValue 컴포넌트: `!canSee ? "blur-sm ..." : ""` 로 자식 래핑. 호출처는 S5에서만 canSee={canSeeAlpha} 로 사용 → 진짜 DB 데이터지만 **조건 분기 내** (BlurredValue가 가드) | ✅ Case A (안전) |
| 809 | blur-sm select-none pointer-events-none | SocialProofTrendIntelligence 내 Global SEO Keywords div. `${!canSeeAlpha ? "blur-sm ..." : ""}` — **canSeeAlpha 분기 내**, seoKw(report 기반) 렌더 후 비Alpha일 때만 blur | ✅ Case A (안전) |
| 820 | blur-sm select-none pointer-events-none | 동일 섹션 Viral Hashtags div. `${!canSeeAlpha ? "blur-sm ..."}` — viralHt(report 기반), **조건 분기 내** | ✅ Case A (안전) |
| 867 | blur-md select-none pointer-events-none | Scout Strategy Report 래퍼. `${!canSeeAlpha ? "blur-md ..."}` — report.sourcing_tip 기반 스텝 콘텐츠, **조건 분기 내** | ✅ Case A (안전) |
| 879 | pointer-events-none | Scout Strategy 블록 위 오버레이 wrapper (absolute inset-0). Lock CTA가 올라가는 레이어, **!canSeeAlpha 시에만** 렌더 | ✅ Case A (안전) |
| 1516 | opacity-50 | Execution Gallery 카드 내 아이콘 (TrendingUp). SupplierContact는 **canSeeAlpha일 때만** 렌더 → 가짜 데이터 아님 but Alpha 전용 섹션 내 장식 | ✅ Case A (안전) |
| 1539 | opacity-50 | 동일, Film 아이콘 | ✅ Case A (안전) |
| 1562 | opacity-50 | LayoutTemplate 아이콘 | ✅ Case A (안전) |
| 1585 | opacity-50 | ImageIcon 아이콘 | ✅ Case A (안전) |
| 1609 | opacity-50 | ImageIcon 아이콘 | ✅ Case A (안전) |

- 134, 473, 1277: `.filter(Boolean)` — JS 배열 메서드, CSS 아님. 제외.
- 1741: 주석 "Section 5" — 제외.

---

## SCAN 2. LockedSection 호출부

| 호출 위치 | message prop | cta prop | href prop | lockedFields prop | 비어있음? |
|---------|-------------|---------|---------|------------------|---------|
| S3 (Market Intelligence) | "The numbers are in. You just can't see them." | "Unlock Market Intelligence — $9/mo →" | /pricing | ["Profit multiplier", "Search volume", "Growth", "Global price", "SEO keywords"] | NO |
| S4 (Social Proof) | "This product is trending on ■ platforms. TikTok alone scored ■■/100." | "See What's Trending — $9/mo →" | /pricing | ["Platform scores", "Rising keywords", "Gap analysis", "Entry strategy"] | NO |
| Consumer (추가 S3·S4 대체) | "See exactly who's buying and which keywords drive sales." | "Start Standard — $9/mo" | /pricing | ["Consumer insight", "SEO keywords"] | NO |
| S5 (Export & Logistics) | "You know what sells. Now learn how to ship it." | "Unlock Logistics Intel — $29/mo →" | /pricing | ["✓ HS codes", "✓ Hazmat checks", "✓ Dimensions", "✓ Certifications"] | NO |
| S6 (Supplier Contact) | "The supplier is right here. One upgrade away. …" | "Get Supplier Contact — $29/mo →" | /pricing | [] | 🔴 **YES** |

- **SECTION_ALPHA_SUPPLIER_CTA** (라인 97–103): `lockedFields: []` → 🔴 lockedFields 미주입.

---

## SCAN 3. 조건 분기 구조도

```
Section 1 (Product Identity)
  → 조건 분기: 없음
  → 분기 없으면: 전체 공개 (의도적 — 상품명·카테고리·이미지·KR가격·트렌드 사유 등)
  → 실제 DB 데이터 렌더 여부: YES

Section 2 (Trend Signal Dashboard)
  → 조건 분기: 없음
  → canSee 변수: 없음
  → LockedSection 대체: NO (항상 전체 노출)

Section 3 (Market Intelligence)
  → 조건 분기 라인: 1728 (canSeeStandard ? … : <LockedSection x3>)
  → canSee 변수: 페이지 레벨 canSeeStandard; 컴포넌트 내 tier/isTeaser
  → LockedSection lockedFields: SECTION_3_LOCKED_CTA 5개 항목

Section 4 (Social Proof & Trend Intelligence)
  → 조건 분기: 1728 동일 (canSeeStandard일 때만 섹션 렌더)
  → Growth Momentum 카드: 조건 분기 없음 (섹션 자체가 canSeeStandard일 때만 렌더)
  → Platform Breakdown: 조건 분기 없음 (동일)
  → Scout Strategy Report: canSeeAlpha 시 blur 제거, !canSeeAlpha 시 blur-md + 오버레이

Section 5 (Export & Logistics)
  → Export Readiness: BlurredValue canSee={canSeeAlpha} 래핑
  → HS Code 블록: BlurredValue canSee={canSeeAlpha} 래핑
  → Weight/Shipping 블록: BlurredValue canSee={canSeeAlpha} 래핑
  → LockedSection 위치: canSeeStandard가 false일 때 **섹션 전체 대체** (라인 1750)

Section 6 (Supplier Contact)
  → 조건 분기: canSeeAlpha (라인 1757)
  → LockedSection lockedFields: SECTION_ALPHA_SUPPLIER_CTA → [] (빈 배열) 🔴
```

---

## SCAN 4. 그라데이션 오버레이

| 라인 | 클래스 | 이 오버레이 아래에 뭐가 있나? | 분류 |
|------|--------|---------------------------|------|
| 829 | bg-gradient-to-t from-white via-white/80 to-transparent | SEO Keywords / Viral Hashtags 블록 (실제 데이터, !canSeeAlpha 시 blur-sm 적용된 div 위) | ✅ 조건 내 블러 + CTA 오버레이 |
| 879–880 | absolute inset-0, pointer-events-none / bg-gradient-to-t from-white via-white/80 to-transparent | "Scout Strategy Report" 정적 헤더 + blur-md 적용된 strategy 콘텐츠 | 🟡 헤더(정적) 페이드아웃 (Case C) |
| 1151 | bg-gradient-to-t from-white via-white/80 to-transparent | S5 전체 (Export Readiness, HS Code, Weight 등 **정적 헤더** + BlurredValue로 감싼 진짜 데이터) | 🟡 헤더(정적) 페이드아웃 (Case C) |
| 1515, 1538, 1561, 1584, 1608 | bg-gradient-to-br from-[#F2F1EE] to-[#E8E6E1] | Execution Gallery 카드 내 **플레이스홀더 배경** (아이콘 영역). DB 데이터 아님 | ✅ 장식용 |

---

## SCAN 5. 진짜 DB 데이터 렌더링 누수

(조건: canSeeAlpha/canSeeStandard **변수명**이 같은 줄에 없는 `{report.xxx}` 렌더. 실제 보안 판정은 **해당 줄이 속한 컴포넌트/섹션의 조건** 기준으로 함.)

| 라인 | 렌더되는 데이터 | 민감도 | 조건 분기 있음? | 판정 |
|------|--------------|--------|--------------|------|
| 206–210, 222, 224, 228 | report.image_url, translated_name, product_name, category | 🟢 LOW | NO (S1 항상 노출) | 의도적 공개 |
| 241–255, 269–274 | report.kr_price, kr_price_usd, estimated_cost_usd, viability_reason | 🟡 MEDIUM (가격) | NO (S1) | 의도적 공개 (트레일러 수준) |
| 298–300 (S2) | report.market_viability, competition_level, gap_status | 🟡 MEDIUM | NO (S2 항상 노출) | 의도적 공개 |
| 489–530, 583–604 등 (S3) | report.profit_multiplier, kr_price, search_volume, mom_growth, wow_rate 등 | 🟡~🔴 | YES (섹션 자체가 canSeeStandard일 때만 렌더) | 분기 내 |
| 661–721, 845–848 (S4) | report.buzz_summary, kr_local_score, gap_index, growth_signal 등 | 🟡 | YES (canSeeStandard) | 분기 내 |
| 919–1102, 1015–1052 등 (S5) | report.export_status, hs_code, actual_weight_g, dimensions_cm 등 | 🔴 HIGH | YES (BlurredValue canSee={canSeeAlpha} 또는 canSeeStandard로 섹션 진입) | 분기 내 (Blur로 은폐) |
| 1325–1430 (S6) | report.moq, lead_time, m_name, contact_email, wholesale_link 등 | 🔴 HIGH | YES (SupplierContact는 canSeeAlpha일 때만 렌더) | 분기 내 |

- **요약**: 조건 분기 **밖**에서 노출되는 DB 데이터는 **S1·S2뿐**이며, 상품명·카테고리·이미지·KR가격·트렌드 사유·마켓 점수·경쟁도·갭 상태 등 **의도적 공개** 범위. HIGH 민감도(HS Code, 제조사, 연락처, 중량 등)는 모두 canSeeAlpha 또는 BlurredValue/canSeeStandard 분기 내부에서만 렌더됨.

---

## SCAN 6. Emerald 찌꺼기 (전체 프로젝트)

| 파일 | 라인 | 클래스 | 교체 필요? |
|------|------|--------|----------|
| components/BrokerEmailDraft.tsx | 121 | bg-emerald-500/10, border-emerald-500/30, hover:bg-emerald-500/20 | ✅ |
| components/BrokerEmailDraft.tsx | 124 | text-emerald-400 | ✅ |
| components/BrokerEmailDraft.tsx | 125 | text-emerald-400/70 | ✅ |
| components/CopyButton.tsx | 30 | bg-emerald-500, hover:bg-emerald-400 | ✅ |
| components/ViralHashtagPills.tsx | 37 | border-emerald-500/50, bg-emerald-500/20, text-emerald-300 | ✅ |
| components/StatusBadge.tsx | 12 | bg-emerald-500/15, text-emerald-300, border-emerald-500/30 | ✅ |
| components/DonutGauge.tsx | 24 | rgb(52, 211, 153) // emerald-400 (인라인 스타일 주석) | ✅ (디자인 시스템 hex 권장) |

- app/weekly/[weekId]/[id]/page.tsx: **0건** (Phase 8에서 이미 제거됨).

---

## SCAN 7. Export Readiness / 노란·amber·warning 배너

| 라인 | 클래스/문맥 | 데이터/용도 |
|------|------------|------------|
| 190 | EXPORT_STATUS_DISPLAY | Record "yellow" → variant "warning", label "Check Regulations" (Export Status 뱃지용) |
| 192 | yellow: { variant: "warning", … } | Export Status가 Yellow일 때 표시 |
| 283–286 | competitionVariant "warning" | competition_level === "Medium" 시 뱃지 variant |
| 715 | Badge variant={… "warning"} | gap_status가 Blue Ocean/Emerging이 아닐 때 (Saturated 등) |
| 930 | bg-[#FEF3C7] border-[#FDE68A] | Export Readiness 블록 내 **Yellow** 상태 (report.export_status === "Yellow") 카드 배경/보더 |
| 931 | bg-[#FEE2E2] border-[#FECACA] | Red (Export Restricted) 카드 |
| 1069 | Badge variant="warning" | Hazmat & Compliance 블록 내 "Risk Ingredient" 뱃지 |
| 1352 | Badge variant="warning" | report.export_cert_note (Launch Kit) |

- **노란/amber 계열**: 930 라인 `#FEF3C7`, `#FDE68A` 가 Export Readiness **Yellow**(규제 확인 필요) 배너에 사용됨. 나머지는 Tailwind variant "warning" 또는 빨강/초록과 구분된 뱃지용.

---

## 한국어 요약

- **🔴 보안 누수**: **0건** (blur/opacity가 조건 밖에서 DB 데이터에 적용된 곳 없음)
- **🟡 헤더 페이드아웃 (Case C)**: **2건** (Scout Strategy 정적 헤더, S5 정적 섹션 헤더 — DB 값 아님)
- **🔴 lockedFields 미주입**: **1건** (S6 SECTION_ALPHA_SUPPLIER_CTA — lockedFields: [])
- **🔴 Emerald 찌꺼기**: **6개 파일·다수 라인** (BrokerEmailDraft, CopyButton, ViralHashtagPills, StatusBadge, DonutGauge — Design System hex로 통일 권장)
- **수술 우선순위 Top 3**
  1. **SECTION_ALPHA_SUPPLIER_CTA**에 lockedFields 주입 (예: ["Supplier name", "Contact", "Wholesale link", "Verified cost"] 등).
  2. **Emerald** → Design System hex (BBF7D0, DCFCE7, 16A34A 등) 교체 (components 전반).
  3. (선택) Case C 구간에서 정적 헤더를 오버레이와 시각적으로 더 분리하거나, LockedSection 내부에서만 헤더가 보이도록 구조 조정.

---

**보안 감사 완료, 코드 변경 없음.**
