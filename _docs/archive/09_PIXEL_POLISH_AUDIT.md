# Pixel Polish Audit Report
Generated: 2026-03-03

**대상 파일:** `app/weekly/[weekId]/[id]/page.tsx` (읽기 전용 스캔)

---

## SCAN 1. 섹션 래퍼 Padding 현황

| 라인 | 클래스 | 어떤 블록인지 | 현재값 | 권장값 |
|------|--------|----------------|--------|--------|
| 200 | p-6 | section-1 (Product Identity) 래퍼 | p-6 | 유지 (섹션 표준) |
| 210 | p-2 | 상품 이미지 object-contain 영역 | p-2 | 유지 |
| 268 | p-4 | Why It's Trending 인용 카드 | p-4 | 유지 |
| 301 | p-6 | section-2 (Trend Signal Dashboard) 래퍼 | p-6 | 유지 |
| 304 | p-5 | Market Score 카드 | p-5 | p-4로 통일 검토 |
| 312 | p-5 | Competition Level 카드 | p-5 | p-4로 통일 검토 |
| 326 | p-5 | Opportunity Status 카드 | p-5 | p-4로 통일 검토 |
| 340 | px-4 py-3 | 주간 스크리닝 설명 박스 | px-4 py-3 | 유지 |
| 476 | p-6 | section-3 (Market Intelligence) 래퍼 | p-6 | 유지 |
| 508 | p-4 | KR Retail 카드 | p-4 | 유지 |
| 520 | p-4 | USD 카드 | p-4 | 유지 |
| 526 | p-4 | Est. Wholesale 카드 | p-4 | 유지 |
| 533 | p-4 | Verified Cost CTA 카드 | p-4 | 유지 |
| 551 | p-4 | Global Retail (Blue Ocean) 카드 | p-4 | 유지 |
| 556 | p-4 | Global Retail 일반 카드 | p-4 | 유지 |
| 582 | p-4 | Search Volume 카드 | p-4 | 유지 |
| 588 | p-4 | MoM Growth 카드 | p-4 | 유지 |
| 599 | p-4 | WoW Growth 카드 | p-4 | 유지 |
| 612 | p-4 | Winning Feature 카드 | p-4 | 유지 |
| 621 | p-4 | Consumer Pain Point 카드 | p-4 | 유지 |
| 633 | p-4 | Viral Hashtags 박스 | p-4 | 유지 |
| 655 | p-6 | section-4 (Social Proof) 래퍼 | p-6 | 유지 |
| 660 | p-4 | Social Buzz 인용 카드 | p-4 | 유지 |
| 673 | p-4 | Market Gap (Korean Traction) 카드 | p-4 | 유지 |
| 692 | p-4 | Market Gap (Global Presence) 카드 | p-4 | 유지 |
| 709 | p-4 | Gap Index 요약 카드 | p-4 | 유지 |
| 745 | p-4 | Platform Breakdown 플랫폼 카드 | p-4 | 유지 |
| 752 | p-4 | Reddit 카드 | p-4 | 유지 |
| 835 | px-4 py-4, pb-6 | Unlock CTA 박스 | px-4 py-4, pb-6 | 유지 |
| 846 | p-4 | Growth Signal 블록 | p-4 | 유지 |
| 873 | p-5 | Scout Strategy Report 컨테이너 | p-5 | p-4로 통일 검토 |
| 875 | p-4 | Strategy step 카드 | p-4 | 유지 |
| 885 | px-4 py-4 | Unlock CTA 내부 | px-4 py-4 | 유지 |
| 915 | p-6 | section-5 (Export & Logistics) 래퍼 | p-6 | 유지 |
| 922 | p-4 | Export Readiness 카드 | p-4 | 유지 |
| 931 | px-3 py-2 | Export status 인라인 박스 | px-3 py-2 | 유지 |
| 966 | p-5 | HS Code 블록 | p-5 | p-4로 통일 검토 |
| 998 | p-5 | Broker Email Draft 블록 | p-5 | p-4로 통일 검토 |
| 1003 | p-4 | Broker Email Draft 플레이스홀더 | p-4 | 유지 |
| 1022 | p-4 | Actual Weight 카드 | p-4 | 유지 |
| 1031 | p-4 | Volumetric Weight 카드 | p-4 | 유지 |
| 1040 | p-4 | Billable Weight 카드 | p-4 | 유지 |
| 1076 | p-4 | Hazmat & Compliance 카드 | p-4 | 유지 |
| 1110 | p-4 | Product Specs 카드 | p-4 | 유지 |
| 1154 | p-4 | Compliance & Logistics step 카드 | p-4 | 유지 |
| 1170 | pb-6 | Alpha Lock Overlay 하단 | pb-6 | 유지 |
| 1172 | px-4 | Lock CTA 텍스트 | px-4 | 유지 |
| 1311 | p-6 | section (Launch & Execution Kit) 래퍼 | p-6 | 유지 |
| 1325 | p-6 | Sourcing Economics 카드 | p-6 | p-5 또는 p-4 검토 |
| 1327 | px-3 py-1 | Scout Verified 뱃지 영역 | px-3 py-1 | 유지 |
| 1412 | p-6 | Manufacturer Contact 카드 | p-6 | p-5 또는 p-4 검토 |
| 1479 | pt-3 | Global Market Proof 상단 여백 | pt-3 | 유지 |
| 1497 | px-2.5 py-1 | Global Market Proof 링크 버튼 | px-2.5 py-1 | 유지 |
| 1507 | px-2.5 py-1 | Blue Ocean 플레이스홀더 | px-2.5 py-1 | 유지 |
| 1537 | p-4 | Execution Gallery 카드 (Viral Reference) | p-4 | 유지 |
| 1560 | p-4 | Execution Gallery 카드 | p-4 | 유지 |
| 1583 | p-4 | Execution Gallery 카드 | p-4 | 유지 |
| 1606 | p-4 | Execution Gallery 카드 | p-4 | 유지 |
| 1630 | p-4 | Execution Gallery 카드 | p-4 | 유지 |
| 1732 | px-6 py-8 | 페이지 메인 컨테이너 | px-6 py-8 | 유지 |
| 1737 | px-4 py-2 | FREE THIS WEEK 뱃지 | px-4 py-2 | 유지 |
| 1785 | p-6 | 하단 네비 섹션 (다크) | p-6 | 유지 |
| 1816 | px-4 py-3 | 하단 CTA 박스 | px-4 py-3 | 유지 |

**요약:** 섹션 래퍼는 `p-6`, 카드/박스는 대부분 `p-4`. `p-5` 사용처(304, 312, 326, 873, 966, 998, 1325, 1412)는 디자인 시스템에 따라 `p-4`로 통일 검토 권장.

---

## SCAN 2. 텍스트 크기 위계 현황

| 라인 | 클래스 | 어떤 텍스트인지 | 위계 적절한가? |
|------|--------|------------------|----------------|
| 201 | text-lg | Product Identity 섹션 제목 | ✅ 적절 |
| 215 | text-sm | No image 플레이스홀더 | ✅ 적절 |
| 219 | text-3xl | 상품명 (메인 헤드라인) | ✅ 적절 |
| 222 | text-sm | 원어 상품명 보조 | ✅ 적절 |
| 225 | text-xs | Category 레이블 | ✅ 적절 |
| 230 | text-xs | Export Status 레이블 | ✅ 적절 |
| 242 | text-xl | KR 가격 (원화) | ✅ 적절 |
| 246 | text-base | USD 환산 가격 | ✅ 적절 |
| 252 | text-xs | Est. Wholesale 레이블 | ✅ 적절 |
| 253 | text-lg | Est. Wholesale 금액 | ✅ 적절 |
| 254 | text-xs | Estimated 보조 문구 | ✅ 적절 |
| 259 | text-sm | Alpha 멤버 문구 | ✅ 적절 |
| 269 | text-xs | Why It's Trending 레이블 | ✅ 적절 |
| 270 | text-sm | Why It's Trending 본문 | ✅ 적절 |
| 302 | text-lg | Trend Signal Dashboard 제목 | ✅ 적절 |
| 305 | text-xs | Market Score 레이블 | ✅ 적절 |
| 307 | text-2xl | Market Score 숫자 | ✅ 적절 |
| 308 | text-xs | Market Score 설명 | ✅ 적절 |
| 313 | text-xs | Competition Level 레이블 | ✅ 적절 |
| 314 | text-xl | Competition Level 값 | ✅ 적절 |
| 322 | text-xs | Competition 설명 | ✅ 적절 |
| 327 | text-xs | Opportunity Status 레이블 | ✅ 적절 |
| 328 | text-xl | Opportunity Status 값 | ✅ 적절 |
| 335 | text-xs | Opportunity 설명 | ✅ 적절 |
| 342 | text-sm | 주간 스크리닝 설명 본문 | ✅ 적절 |
| 477 | text-xl | Market Intelligence 섹션 제목 | ✅ 적절 |
| 481 | text-xs | Profit Potential 레이블 | ✅ 적절 |
| 489 | text-3xl | Profit Multiplier 숫자 | ✅ 적절 |
| 492 | text-xs | Estimated margin 푸터 | ✅ 적절 |
| 501 | text-xs | Global Retail Evidence 레이블 | ✅ 적절 |
| 509 | text-xs | KR Retail 레이블 | ✅ 적절 |
| 510 | text-lg | KR Retail 금액 | ✅ 적절 |
| 521 | text-xs | USD 레이블 | ✅ 적절 |
| 522 | text-lg | USD 금액 | ✅ 적절 |
| 527 | text-xs | Est. Wholesale 레이블 | ✅ 적절 |
| 528 | text-lg | Est. Wholesale 금액 | ✅ 적절 |
| 535 | text-xs | Verified Cost 레이블 | ✅ 적절 |
| 536 | text-sm | View ↓ CTA | ✅ 적절 |
| 547 | text-xs | Global Retail Prices 레이블 | ✅ 적절 |
| 552 | text-xs | Global row 레이블 | ✅ 적절 |
| 557 | text-xs | Global row 레이블 | ✅ 적절 |
| 558 | text-lg | Global 가격 | ✅ 적절 |
| 559 | text-sm | platform | ✅ 적절 |
| 564 | text-xs | Blue Ocean 설명 | ✅ 적절 |
| 567 | text-xs | View source 링크 | ✅ 적절 |
| 579 | text-xs | Search & Growth 레이블 | ✅ 적절 |
| 583 | text-xs | Search Volume 레이블 | ✅ 적절 |
| 584 | text-lg | Search Volume 값 | ✅ 적절 |
| 589 | text-xs | MoM Growth 레이블 | ✅ 적절 |
| 590 | text-lg | MoM Growth 값 | ✅ 적절 |
| 600 | text-xs | WoW Growth 레이블 | ✅ 적절 |
| 601 | text-lg | WoW Growth 값 | ✅ 적절 |
| 613 | text-xs | Winning Feature 레이블 | ✅ 적절 |
| 617 | text-sm | Winning Feature 본문 | ✅ 적절 |
| 622 | text-xs | Consumer Pain Point 레이블 | ✅ 적절 |
| 626 | text-sm | Consumer Pain Point 본문 | ✅ 적절 |
| 634 | text-xs | Viral Hashtags 레이블 | ✅ 적절 |
| 656 | text-xl | Social Proof 섹션 제목 | ✅ 적절 |
| 661 | text-xs | Social Buzz 레이블 | ✅ 적절 |
| 662 | text-sm | Social Buzz 인용 | ✅ 적절 |
| 670 | text-xs | Market Gap Analysis 레이블 | ✅ 적절 |
| 675 | text-xs | Korean Traction 레이블 | ✅ 적절 |
| 676 | text-2xl | kr_local_score | ✅ 적절 |
| 694 | text-xs | Global Presence 레이블 | ✅ 적절 |
| 695 | text-2xl | global_trend_score | ✅ 적절 |
| 710 | text-xs | Gap Index 레이블 | ✅ 적절 |
| 711 | text-3xl | gap_index | ✅ 적절 |
| 739 | text-xs | Platform Breakdown 레이블 | ✅ 적절 |
| 746 | text-xs | 플랫폼명 레이블 | ✅ 적절 |
| 748 | text-lg | 플랫폼 점수 | ✅ 적절 |
| 753 | text-xs | Reddit 레이블 | ✅ 적절 |
| 790 | text-xs | Trending Signals 레이블 | ✅ 적절 |
| 837 | text-sm | Unlock CTA 문구 | ✅ 적절 |
| 847 | text-xs | Growth signal 레이블 | ✅ 적절 |
| 870 | text-xs | Scout Strategy Report 레이블 | ✅ 적절 |
| 877 | text-sm | Strategy step 제목 | ✅ 적절 |
| 878 | text-sm | Strategy step 본문 | ✅ 적절 |
| 887 | text-sm | Unlock CTA 문구 | ✅ 적절 |
| 916 | text-xl | Export & Logistics 제목 | ✅ 적절 |
| 920 | text-xs | Export Readiness 레이블 | ✅ 적절 |
| 938 | text-sm | Export status 텍스트 | ✅ 적절 |
| 964 | text-xs | HS Code 레이블 | ✅ 적절 |
| 976 | text-sm | HS description | ✅ 적절 |
| 978 | text-xs | HS 푸터 | ✅ 적절 |
| 984 | text-sm | HS not available | ✅ 적절 |
| 985 | text-xs | HS 푸터 | ✅ 적절 |
| 1004 | text-xs | Broker 플레이스홀더 | ✅ 적절 |
| 1010 | text-xs | Weight & Shipping 레이블 | ✅ 적절 |
| 1023 | text-xs | Actual Weight 레이블 | ✅ 적절 |
| 1024 | text-2xl | actual_weight_g | ✅ 적절 |
| 1032 | text-xs | Volumetric Weight 레이블 | ✅ 적절 |
| 1033 | text-2xl | volumetric_weight_g | ✅ 적절 |
| 1041 | text-xs | Billable Weight 레이블 | ✅ 적절 |
| 1042 | text-2xl | billable_weight_g | ✅ 적절 |
| 1048 | text-sm | dimensions/shipping tier | ✅ 적절 |
| 1074 | text-xs | Hazmat 레이블 | ✅ 적절 |
| 1079 | text-sm | Risk Ingredient | ✅ 적절 |
| 1086 | text-xs | Certifications 레이블 | ✅ 적절 |
| 1103 | text-xs | Product Specs 레이블 | ✅ 적절 |
| 1105 | text-xs | Ingredients 푸터 | ✅ 적절 |
| 1130 | text-xs | Shipping Notes 레이블 | ✅ 적절 |
| 1132 | text-sm | shipping_notes | ✅ 적절 |
| 1148 | text-xs | Compliance & Logistics 레이블 | ✅ 적절 |
| 1156 | text-sm | step 제목 | ✅ 적절 |
| 1157 | text-sm | step 본문 | ✅ 적절 |
| 1172 | text-sm | Alpha Lock CTA | ✅ 적절 |
| 1315 | text-xl | Launch & Execution Kit 제목 | ✅ 적절 |
| 1318 | text-sm | 부제 | ✅ 적절 |
| 1329 | text-xs | Scout Verified | ✅ 적절 |
| 1340 | text-xs | COST PER UNIT | ✅ 적절 |
| 1346 | text-2xl | MOQ | ✅ 적절 |
| 1349 | text-xs | MOQ 레이블 | ✅ 적절 |
| 1354 | text-2xl | LEAD TIME | ✅ 적절 |
| 1357 | text-xs | LEAD TIME 레이블 | ✅ 적절 |
| 1385 | text-2xl | MOQ (Right block) | ✅ 적절 |
| 1388 | text-xs | MOQ 레이블 | ✅ 적절 |
| 1393 | text-2xl | LEAD TIME | ✅ 적절 |
| 1396 | text-xs | LEAD TIME 레이블 | ✅ 적절 |
| 1404 | text-sm | verifying pricing 문구 | ✅ 적절 |
| 1414 | text-xl | Manufacturer 이름 | ✅ 적절 |
| 1480 | text-xs | Global Market Proof 레이블 | ✅ 적절 |
| 1497 | text-xs | Global 링크 버튼 | ✅ 적절 |
| 1507 | text-xs | Blue Ocean 플레이스홀더 | ✅ 적절 |
| 1524 | text-sm | Creative Assets 레이블 | ✅ 적절 |
| 1527 | text-xs | assets ready | ✅ 적절 |
| 1538 | text-sm | Viral Reference 제목 | ✅ 적절 |
| 1541 | text-xs | Viral Reference 설명 | ✅ 적절 |
| 1561 | text-sm | Execution 카드 제목 | ✅ 적절 |
| 1584 | text-sm | Execution 카드 제목 | ✅ 적절 |
| 1607 | text-sm | Execution 카드 제목 | ✅ 적절 |
| 1631 | text-sm | Execution 카드 제목 | ✅ 적절 |
| 1734 | text-sm | Back to week 링크 | ✅ 적절 |
| 1737 | text-sm | FREE THIS WEEK | ✅ 적절 |

**요약:** text-xs(레이블/보조), text-sm(본문), text-base/xl/2xl/3xl(숫자·제목) 위계가 일관됨. 위계 문제 0건.

---

## SCAN 3. Font-weight 현황

| 라인 | 클래스 | 용도 |
|------|--------|------|
| 201 | font-bold | Product Identity 섹션 제목 |
| 219 | font-bold | 상품명 헤드라인 |
| 242 | font-semibold | KR 가격 |
| 252 | font-medium | Est. Wholesale 레이블 |
| 253 | font-semibold | Est. Wholesale 금액 |
| 269 | font-semibold | Why It's Trending 레이블 |
| 302 | font-bold | Trend Signal Dashboard 제목 |
| 305 | font-semibold | Market Score 레이블 |
| 307 | font-bold | Market Score 숫자 |
| 313 | font-semibold | Competition Level 레이블 |
| 314 | font-semibold | Competition Level 값 |
| 327 | font-semibold | Opportunity Status 레이블 |
| 328 | font-semibold | Opportunity Status 값 |
| 343 | font-semibold | 본문 강조 (500+ products) |
| 345 | font-semibold | 본문 강조 (worth your attention) |
| 477 | font-semibold | Market Intelligence 제목 |
| 481 | font-medium | Profit Potential 레이블 |
| 489 | font-bold | Profit Multiplier 숫자 |
| 501 | font-semibold | Global Retail Evidence 레이블 |
| 510 | font-semibold | KR Retail 금액 |
| 522 | font-semibold | USD 금액 |
| 528 | font-semibold | Est. Wholesale 금액 |
| 536 | font-bold | View ↓ CTA |
| 547 | font-semibold | Global Retail Prices 레이블 |
| 558 | font-semibold | Global 가격 |
| 559 | font-medium | platform |
| 579 | font-semibold | Search & Growth 레이블 |
| 583 | font-semibold | Search Volume 레이블 |
| 584 | font-semibold | Search Volume 값 |
| 589 | font-semibold | MoM Growth 레이블 |
| 590 | font-semibold | MoM Growth 값 |
| 600 | font-semibold | WoW Growth 레이블 |
| 601 | font-semibold | WoW Growth 값 |
| 613 | font-semibold | Winning Feature 레이블 |
| 622 | font-semibold | Consumer Pain Point 레이블 |
| 634 | font-semibold | Viral Hashtags 레이블 |
| 656 | font-semibold | Social Proof 제목 |
| 661 | font-semibold | Social Buzz 레이블 |
| 670 | font-semibold | Market Gap 레이블 |
| 676 | font-bold | kr_local_score |
| 695 | font-bold | global_trend_score |
| 711 | font-bold | gap_index |
| 739 | font-semibold | Platform Breakdown 레이블 |
| 746 | font-semibold | 플랫폼 레이블 |
| 748 | font-bold | 플랫폼 점수 |
| 753 | font-semibold | Reddit 레이블 |
| 790 | font-semibold | Trending Signals 레이블 |
| 837 | font-semibold | Unlock CTA |
| 870 | font-semibold | Scout Strategy Report 레이블 |
| 877 | font-semibold | Strategy step 제목 |
| 887 | font-semibold | Alpha Lock CTA |
| 916 | font-semibold | Export & Logistics 제목 |
| 920 | font-semibold | Export Readiness 레이블 |
| 938 | font-semibold | Export status 텍스트 |
| 964 | font-semibold | HS Code 레이블 |
| 970 | font-bold | HS Code 코드 |
| 1010 | font-semibold | Weight & Shipping 레이블 |
| 1024 | font-semibold | actual_weight_g |
| 1033 | font-semibold | volumetric_weight_g |
| 1042 | font-semibold | billable_weight_g |
| 1074 | font-semibold | Hazmat 레이블 |
| 1103 | font-semibold | Product Specs 레이블 |
| 1130 | font-semibold | Shipping Notes 레이블 |
| 1148 | font-semibold | Compliance & Logistics 레이블 |
| 1156 | font-semibold | step 제목 |
| 1172 | font-semibold | Alpha Lock CTA |
| 1315 | font-semibold | Launch Kit 제목 |
| 1329 | font-semibold | Scout Verified |
| 1337 | font-bold | Cost per unit 금액 |
| 1346 | font-semibold | MOQ 값 |
| 1354 | font-semibold | LEAD TIME 값 |
| 1385 | font-semibold | MOQ 값 |
| 1393 | font-semibold | LEAD TIME 값 |
| 1414 | font-bold | Manufacturer 이름 |
| 1480 | font-semibold | Global Market Proof 레이블 |
| 1524 | font-semibold | Creative Assets 레이블 |
| 1538 | font-semibold | Viral Reference 제목 |
| 1561 | font-semibold | Execution 카드 제목 |
| 1584 | font-semibold | Execution 카드 제목 |
| 1607 | font-semibold | Execution 카드 제목 |
| 1631 | font-semibold | Execution 카드 제목 |
| 1734 | font-medium | Back to week 링크 |
| 1790 | font-medium | Previous Product 링크 |
| 1800 | font-medium | Next Product 링크 |
| 1811 | font-medium | Back to week (다크) |
| 1820 | font-medium | Unlock CTA |
| 1828 | font-medium | Unlock CTA |
| 1834 | font-medium | You have full access |

**요약:** 레이블·보조는 font-semibold/font-medium, 숫자·제목은 font-bold/font-semibold로 일관됨. font-normal은 미사용(필요 시 보조 본문에 적용 검토).

---

## SCAN 4. 색상 사용 현황 (브랜드 외 색상 잔재)

**결과:** `app/weekly/[weekId]/[id]/page.tsx` 내 **gray-, slate-, zinc-, neutral-, stone- 계열 Tailwind 클래스 0건**.

전체가 `#1A1916`, `#3D3B36`, `#6B6860`, `#9E9C98`, `#E8E6E1`, `#F8F7F4`, `#16A34A`, `#2563EB`, `#DC2626`, `#D97706` 등 Design System hex 사용.

| 라인 | 클래스 | 비고 |
|------|--------|------|
| — | (없음) | 색상 잔재 0건 |

---

## SCAN 5. K-Product Scout / KoreaScout 브랜드명 현황

### 5-1. "K-Product Scout" 표기 (앱·컴포넌트·문서)

| 파일 | 라인 | 내용 |
|------|------|------|
| `_docs/01_CORE_SPEC.md` | 61 | # K-Product Scout — 최종 프로젝트 설계서 |
| `_docs/01_CORE_SPEC.md` | 129 | K-Product Scout는 한국 트렌드 상품... |
| `components/BrokerEmailDraft.tsx` | 96 | Generated by K-Product Scout |
| `app/weekly/[weekId]/[id]/page.tsx` | 343 | Every week, K-Product Scout screens ... |
| `app/page.tsx` | 220 | The K-Product Scout Way |
| `app/page.tsx` | 672 | K-Product Scout · Seoul Intelligence |
| `app/page.tsx` | 1014 | © 2025 K-Product Scout. All rights reserved. |
| `app/layout.tsx` | 21 | title: "K-Product Scout" |
| `app/pricing/page.tsx` | 6 | title: "Pricing — K-Product Scout" |
| `app/admin/login/page.tsx` | 40 | 🔐 K-Product Scout Admin |
| `app/signup/page.tsx` | 37 | K-Product Scout (로고/헤딩) |
| `app/signup/page.tsx` | 64 | K-Product Scout (로고/헤딩) |
| `app/login/page.tsx` | 49 | K-Product Scout |
| `components/layout/Header.tsx` | 17 | K-Product Scout |
| `components/layout/ClientLeftNav.tsx` | 73 | K-Product Scout |
| `app/admin/page.tsx` | 70 | K-Product Scout Admin |
| `_docs/02_DESIGN_SYSTEM.md` | 63–64 | K-Product Scout — Design System / Tagline |
| `_docs/02_DESIGN_SYSTEM.md` | 209 | [K-Product Scout] |
| `_docs/PROJECT_2DB_STATUS.md` | 1 | # K-Product Scout — DB 현황 |
| `_docs/PROJECT_2STATUS.md` | 1 | # K-Product Scout — 프로젝트 현황 |
| `_docs/PROJECT_2STATUS.md` | 264 | Pricing 페이지 메타데이터 K-Product Scout |
| `_docs/PROJECT_3DATA_MAP.md` | 1 | # K-Product Scout — 상세 페이지 데이터 매핑 |
| `_docs/PROJECT_4UI_STRATEGY.md` | 1 | # K-Product Scout — UI/UX 전략 |
| `_docs/03_AUDIT_PROJECT_STATE.md` | 160 | K-Product Scout |

### 5-2. "KoreaScout" 표기 (문서만)

| 파일 | 라인 | 내용 |
|------|------|------|
| `_docs/01_CORE_SPEC.md` | 72 | 브랜드명 KoreaScout 확정 |
| `_docs/02_PRICING_STRATEGY.md` | 1 | # KoreaScout — Pricing & Business Strategy |
| `_docs/02_PRICING_STRATEGY.md` | 11 | Service: KoreaScout (koreascout.com) |

**해석:** 스펙/가격 문서에는 브랜드명 "KoreaScout" 확정으로 기재되어 있으나, 앱·레이아웃·메타·푸터·이메일 등은 전부 "K-Product Scout" 사용. 브랜드 통일 시 "K-Product Scout" → "KoreaScout" 전수 교체 대상 20+ 건.

---

## 한국어 요약

- **위계 문제:** 0건 (text-xs/sm/base/lg/xl/2xl/3xl 사용 일관)
- **색상 잔재:** 0건 (gray/slate/zinc/neutral/stone 미사용)
- **브랜드명 잔재:**  
  - "K-Product Scout" **24건** (앱 12 + 문서 12)  
  - "KoreaScout" **3건** (문서만, 스펙/가격 정책)

**수술 우선순위 Top 3**

1. **브랜드명 통일:** 스펙상 "KoreaScout" 확정이면 앱·레이아웃·메타·푸터·이메일 등에서 "K-Product Scout" → "KoreaScout" 일괄 교체 (문서 포함).
2. **Padding 통일:** `p-5` 사용처(섹션2 카드 3곳, Scout Strategy 컨테이너, HS Code·Broker 블록, Launch Kit 좌우 카드)를 디자인 시스템에 맞춰 `p-4` 또는 공식 카드 패딩으로 통일 검토.
3. **Rule of 3 / 추가 폴리시:** 위계·색상은 정리된 상태이므로, Rule of 3 로직 적용 및 기타 픽셀 폴리시(간격·라운드 등)는 필요 시 동일 방식으로 스캔 후 수술 프롬프트 작성.

---

*본 문서는 코드 수정 없이 읽기 전용 스캔 결과만 기록한 감사 보고서입니다.*
