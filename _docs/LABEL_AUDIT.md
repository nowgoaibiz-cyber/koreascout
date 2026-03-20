# Label Audit: Labels Always Visible, Values Blurred When Null

## 1. Problem Summary

라벨이 데이터가 null일 때 사라지는 이유는 다음과 같습니다.

**SourcingIntel.tsx**
- 섹션 제목 "Export & Logistics Intel"(45–46행)은 항상 표시됨.
- "Export Readiness"(51행), "Logistics Dashboard"(82행) 라벨은 `LockedValue` 바깥에 있어 표시되나, **"Compliance & Logistics Strategy"**(196–240행) 블록 전체가 `logisticsSteps.length === 0 && !hasNotes`이면 `return null`(199행)로 아예 렌더되지 않아, 해당 라벨도 함께 사라짐. `sourcing_tip`이 tier로 마스킹되면 `logisticsSteps`가 비어 이 조건에 걸림.

**SupplierContact.tsx**
- 28–29행: `if (!hasSupplierFields && !canSeeAlpha) return null`로, 알파가 아니고 supplier 필드가 모두 null(마스킹)이면 컴포넌트 전체가 렌더되지 않음.
- 195–316행: `{canSeeAlpha && (<>...</>)}` 안에 "Launch & Execution Kit", "Financial Briefing", "MOQ", "Est. Production Lead Time", "OEM / ODM", "Supplier & Brand Intel", "Sample Policy", "Compliance Note", "Global Market Proof", "Creative Assets" 등 **모든 라벨과 콘텐츠**가 들어 있음. 따라서 standard/free tier에서는 섹션 DOM은 있지만 자식이 없어 빈 섹션만 보이고, 모든 라벨이 숨겨짐.

**GroupBBrokerSection.tsx**
- "HS Code & Broker Weapon"(39–41행) 제목은 `canSeeAlpha` 바깥에 있어 항상 표시됨.
- 43–109행: `canSeeAlpha ? (실제 콘텐츠) : (LockedValue 플레이스홀더)`. 실제 콘텐츠 안의 서브 라벨 "HS Code"(56행), "Broker Email Draft"(88행)는 `canSeeAlpha`가 true일 때만 렌더됨. 알파가 아니면 회색 박스 두 개만 보이고, 이 두 서브 라벨은 숨겨짐.

**SocialProofTrendIntelligence.tsx**
- 210–248행: `{steps.length > 0 && ( ... "Scout Strategy Report" ... )}`. `steps`는 `report.sourcing_tip`에서 파싱되므로, free/standard에서 `sourcing_tip`이 null로 마스킹되면 `steps.length === 0`이 되어 블록 전체가 렌더되지 않음. 따라서 "Scout Strategy Report" 라벨(212행)과 Step 1/2/3 라벨이 모두 사라짐.
- "Social Buzz", "Market Gap Analysis", "Gap Index", "Trending Signals" 등은 각각 `report.buzz_summary`, `kr_local_score`/`global_trend_score`, `report.gap_index`, `hasAnyTrending` 조건으로 블록이 감싸져 있어, 해당 데이터가 null이면 블록과 라벨이 함께 숨겨짐.

**MarketIntelligence.tsx**
- 197–261행: `hasProfitBlock`(estimated_cost_usd, profit_multiplier, globalValuation)이 false면 블록 전체 미렌더. "Est. Wholesale", "Global Valuation", "UP TO … MARGIN POTENTIAL" 등 라벨이 모두 사라짐.
- 268–324행: "Global Market Availability" h3(276행)는 항상 표시되나, 그리드 내용은 `LockedValue` 안에 있음.
- 326–377행: `(hasSearchGrowth || winningFeature || painPoint)`일 때만 "Search & Growth", "Analyst Brief", "SEARCH VOLUME", "MoM GROWTH", "WoW GROWTH", "Competitive Edge", "Risk Factor" 블록이 렌더됨. free tier에서 해당 필드가 null로 마스킹되면 블록과 라벨이 모두 숨겨짐.

**LockedValue.tsx**
- 라벨을 숨기지는 않지만, `locked`일 때 자식 전체를 blur 처리하고 오버레이를 씌움. 라벨이 LockedValue **안**에 있으면 blur/오버레이에 같이 묶여 보이고, 라벨이 **밖**에 있으면 항상 선명하게 보임. 현재 여러 컴포넌트에서 라벨까지 LockedValue 또는 canSeeAlpha 블록 안에 넣어 두어, tier/데이터 조건에 따라 라벨이 아예 안 나오는 경우가 많음.

---

## 2. Every Hidden Label - Complete List

### SourcingIntel (components/report/SourcingIntel.tsx)

| Label Text | Line | Condition causing it to hide | Field that is null |
|-----------|------|-----------------------------|--------------------|
| Compliance & Logistics Strategy | 201 | logisticsSteps.length === 0 && !hasNotes (block returns null) | sourcing_tip (masked → allSteps empty → logisticsSteps empty), shipping_notes |
| Step 4, Step 5 (sub-labels) | 218–219 | Same block as above | sourcing_tip |
| Shipping Notes | 234 | Same block, and hasNotes false | shipping_notes |

*Note: "Export Readiness" (51), "Logistics Dashboard" (82) labels are outside LockedValue so they stay visible; only the value area is locked. The block that can disappear entirely is "Compliance & Logistics Strategy".*

### SupplierContact (components/report/SupplierContact.tsx)

| Label Text | Line | Condition causing it to hide | Field that is null |
|-----------|------|-----------------------------|--------------------|
| (Entire section) | 194–316 | canSeeAlpha === false | N/A (whole content wrapped in canSeeAlpha) |
| Launch & Execution Kit | 201 | canSeeAlpha === false | N/A |
| Financial Briefing | 206 | canSeeAlpha === false | N/A |
| Cost Per Unit | 208 | canSeeAlpha === false | N/A |
| MOQ | 241 | canSeeAlpha === false | N/A |
| Est. Production Lead Time | 247 | canSeeAlpha === false | N/A |
| OEM / ODM | 254 | canSeeAlpha === false | N/A |
| Supplier & Brand Intel | 266 | canSeeAlpha === false | N/A |
| Sample Policy | 354 | canSeeAlpha === false | N/A |
| Compliance Note | 360 | canSeeAlpha === false | N/A |
| Global Market Proof | 367 | canSeeAlpha === false | N/A |
| Creative Assets | 372 | canSeeAlpha === false | N/A |

*When !hasSupplierFields && !canSeeAlpha (line 28–29), the entire component returns null, so no labels from this component render at all.*

### GroupBBrokerSection (components/GroupBBrokerSection.tsx)

| Label Text | Line | Condition causing it to hide | Field that is null |
|-----------|------|-----------------------------|--------------------|
| HS Code | 56 | canSeeAlpha === false | N/A |
| Broker Email Draft | 88 | canSeeAlpha === false | N/A |

*"HS Code & Broker Weapon" (39–41) is outside the branch and always visible.*

### SocialProofTrendIntelligence (components/report/SocialProofTrendIntelligence.tsx)

| Label Text | Line | Condition causing it to hide | Field that is null |
|-----------|------|-----------------------------|--------------------|
| Social Buzz | 39 | !report.buzz_summary?.trim() | buzz_summary |
| Market Gap Analysis | 52 | kr_local_score == null && global_trend_score == null | kr_local_score, global_trend_score |
| Korean Traction | 55 | Same as above | kr_local_score |
| Global Presence | 74 | Same as above | global_trend_score |
| Gap Index | 95 | report.gap_index == null | gap_index |
| Entry Strategy | 116 | report.gap_index == null (block not rendered) | gap_index |
| Trending Signals | 131 | !hasAnyTrending (rising_keywords, seo_keywords, viral_hashtags all empty) | rising_keywords, seo_keywords, viral_hashtags |
| Rising Keywords (KR) | 134 | risingKw.length === 0 | rising_keywords |
| Global SEO Keywords | 153 | seoKw.length === 0 (or block not rendered) | seo_keywords |
| Viral Hashtags | 174 | viralHt.length === 0 (or block not rendered) | viral_hashtags |
| Scout Strategy Report | 212 | steps.length === 0 | sourcing_tip (parsed for steps) |
| Step 1, Step 2, Step 3 | 225–226 | steps.length === 0 or canSeeAlpha === false | sourcing_tip |

### MarketIntelligence (components/report/MarketIntelligence.tsx)

| Label Text | Line | Condition causing it to hide | Field that is null |
|-----------|------|-----------------------------|--------------------|
| (Profit block labels) | 203–258 | !hasProfitBlock | estimated_cost_usd, profit_multiplier, global_prices |
| UP TO … MARGIN POTENTIAL | 204–206 | !hasProfitBlock | profit_multiplier, estimated_cost_usd |
| Est. Wholesale | 217–222 | !hasProfitBlock | estimated_cost_usd |
| Global Valuation | 239–245 | !hasProfitBlock | (globalValuation derived from parsedPrices / estimatedCost / profitMultiplier) |
| Search & Growth | 330 | !hasSearchGrowth && !winningFeature && !painPoint | search_volume, mom_growth, wow_rate |
| SEARCH VOLUME | 332–336 | !searchVolume | search_volume |
| MoM GROWTH | 339–351 | !momGrowth | mom_growth |
| WoW GROWTH | 354–366 | !wowRate or wowRate === "N/A" | wow_rate |
| Analyst Brief | 357 | !winningFeature && !painPoint | top_selling_point, common_pain_point |
| Competitive Edge | 361–365 | !winningFeature | top_selling_point |
| Risk Factor | 368–372 | !painPoint | common_pain_point |

*"Market Intelligence" (193–194) and "Global Market Availability" (276) section titles are always rendered; "Global Market Availability" content is inside LockedValue.*

---

## 3. Labels That Should ALWAYS Be Visible (by tier)

### Standard tier should always see these labels

- **Export & Logistics Intel (section)**: Export & Logistics Intel, Export Readiness, HS Code & Broker Weapon, HS Code, Broker Email Draft, Logistics Dashboard, Actual Weight, Volumetric Weight, Billable Weight, Shipping Tier, Hazmat & Compliance, Certifications Required, Ingredients, Specifications, Hazmat Summary, Compliance & Logistics Strategy, Step 4, Step 5, Shipping Notes.
- **Launch & Execution Kit (section)**: Launch & Execution Kit, Financial Briefing, Cost Per Unit, MOQ, Est. Production Lead Time, OEM / ODM, Supplier & Brand Intel, Sample Policy, Compliance Note, Global Market Proof, Creative Assets.
- **Scout Strategy Report (in Social Proof)**: Scout Strategy Report, Step 1, Step 2, Step 3.
- **Compliance & Logistics Strategy**: 해당 블록이 데이터 유무와 관계없이 표시되고, 값만 LockedValue로 블러 처리.

### Free tier should always see these labels

- Standard에서 보이는 위 모든 라벨.
- **Market Intelligence**: Market Intelligence, (profit block) Est. Wholesale, Global Valuation, UP TO … MARGIN POTENTIAL, Global Market Availability, 6 markets (US, UK, EU, JP, SEA, UAE), Search & Growth, SEARCH VOLUME, MoM GROWTH, WoW GROWTH, Analyst Brief, Competitive Edge, Risk Factor.
- **Social Proof & Trend Intelligence**: Social Buzz, Market Gap Analysis, Korean Traction, Global Presence, Gap Index, Entry Strategy, Trending Signals, Rising Keywords (KR), Global SEO Keywords, Viral Hashtags, Scout Strategy Report, Step 1–3.

즉, 모든 티어에서 **라벨은 항상 보이고**, 값만 tier에 따라 LockedValue(블러 + Unlock CTA) 또는 실제 값으로 표시되어야 함.

---

## 4. Exact Fix Required Per Component

### SourcingIntel

- **Line 51**: "Export Readiness" 라벨은 이미 LockedValue 바깥에 있음. 유지.
- **Line 54–76**: LockedValue는 값 영역만 감싸도록 유지. 라벨(51)은 그대로 두면 됨.
- **Line 82**: "Logistics Dashboard" 라벨은 이미 LockedValue 바깥. 유지.
- **Line 84–186**: LockedValue는 내부 콘텐츠만. 라벨(82) 유지.
- **Line 196–240**: "Compliance & Logistics Strategy" 블록을 데이터 유무와 관계없이 항상 렌더하도록 변경.  
  - **Line 199**: `if (logisticsSteps.length === 0 && !hasNotes) return null;` 제거 또는 수정.  
  - 대신 해당 블록을 항상 렌더하고, 라벨 "Compliance & Logistics Strategy"(201)는 LockedValue 바깥에 두며, 내용(Step 4/5, Shipping Notes)만 LockedValue로 감싸거나, 내용이 없을 때는 빈 영역을 LockedValue 플레이스홀더로 표시.
- **Line 201**: "Compliance & Logistics Strategy" 라벨을 canSeeAlpha/데이터 조건 밖으로 이동해 항상 표시.
- **Line 206–236**: LockedValue는 값/스텝 콘텐츠만 감싸고, 서브 라벨(Step 4, Step 5, Shipping Notes)은 가능하면 라벨만 바깥에 두고 값만 LockedValue 안에.

### SupplierContact

- **Line 28–29**: `if (!hasSupplierFields && !canSeeAlpha) return null` 유지하되, standard/free에서도 "Launch Kit" 섹션을 보여 주려면 조건을 완화할 수 있음(예: 항상 섹션은 렌더하고 내부만 tier로 제어).
- **Line 195**: `{canSeeAlpha && (<>...</>)}` 제거 또는 구조 변경.  
  - **Line 201**: "Launch & Execution Kit" h2를 canSeeAlpha 블록 밖으로 이동(항상 표시).
  - **Line 206**: "Financial Briefing" 라벨을 canSeeAlpha 밖으로 이동.
  - **Line 208**: "Cost Per Unit" 라벨을 밖으로, 값만 LockedValue 또는 조건부 표시.
  - **Line 237–262**: MOQ, Est. Production Lead Time, OEM/ODM 라벨(241, 247, 254)을 canSeeAlpha 밖으로 이동하고, 값만 LockedValue/블러 처리.
  - **Line 266**: "Supplier & Brand Intel" 라벨을 canSeeAlpha 밖으로 이동.
  - **Line 354, 360**: "Sample Policy", "Compliance Note" 라벨을 canSeeAlpha 밖으로 이동.
  - **Line 367**: "Global Market Proof" 라벨을 canSeeAlpha 밖으로 이동.
  - **Line 372**: "Creative Assets" 라벨을 canSeeAlpha 밖으로 이동.
- 각 블록: 라벨은 항상 표시, 값/리스트/카드만 LockedValue(tier="alpha")로 감싸기.

### GroupBBrokerSection

- **Line 39–41**: "HS Code & Broker Weapon"은 이미 바깥에 있음. 유지.
- **Line 43**: `canSeeAlpha ? (...) : (LockedValue ...)` 구조 변경.  
  - **Line 56**: "HS Code" 서브 라벨을 canSeeAlpha 분기 밖으로 이동(항상 표시).  
  - **Line 88**: "Broker Email Draft" 서브 라벨을 canSeeAlpha 분기 밖으로 이동.  
  - 값/폼 영역만 canSeeAlpha일 때 실제 콘텐츠, 아니면 LockedValue 플레이스홀더(동일한 레이아웃: HS Code 영역 + Broker Email 영역)로 표시.

### SocialProofTrendIntelligence

- **Line 210**: `{steps.length > 0 && (...)}` 변경.  
  - "Scout Strategy Report" 라벨(212)은 steps 유무와 관계없이 항상 표시.  
  - steps가 있을 때: Step 1/2/3 콘텐츠를 canSeeAlpha면 실제 표시, 아니면 LockedValue.  
  - steps가 없을 때(sourcing_tip 마스킹): "Scout Strategy Report" 라벨만 보이고, 아래는 LockedValue 플레이스홀더 또는 빈 영역.
- **Line 212**: "Scout Strategy Report" 라벨을 steps.length 조건 밖으로 이동.
- **Line 215–246**: canSeeAlpha 분기 안에서는 값만 렌더하고, 라벨(Step 1, 2, 3)은 분기 밖에 두거나, 비알파일 때도 동일 라벨 + LockedValue 블록으로 표시.

### MarketIntelligence

- **Line 197**: `hasProfitBlock`이 false여도 블록을 렌더하도록 변경.  
  - **Line 204–206**: "UP TO … MARGIN POTENTIAL" 라벨/배지 영역은 항상 표시, 값만 LockedValue.  
  - **Line 217, 239**: "Est. Wholesale", "Global Valuation" 라벨은 항상 표시, 값만 LockedValue.  
- **Line 268–324**: "Global Market Availability" h3는 이미 바깥. 그리드 셀별로 라벨(US, UK, …)은 항상 보이게, 셀 값만 LockedValue.
- **Line 326**: `(hasSearchGrowth || winningFeature || painPoint)`가 false여도 "Search & Growth", "Analyst Brief" 등 **섹션 제목**은 표시하고, 값만 LockedValue 또는 플레이스홀더.  
  - **Line 330**: "Search & Growth" 제목을 조건 밖으로.  
  - **Line 332, 339, 354**: SEARCH VOLUME, MoM GROWTH, WoW GROWTH 라벨을 항상 표시, 값만 LockedValue.  
  - **Line 357**: "Analyst Brief" 제목을 조건 밖으로.  
  - **Line 361, 368**: "Competitive Edge", "Risk Factor" 라벨을 항상 표시, 값만 LockedValue.

---

## 5. LockedValue Component Spec (current vs needed)

### Current LockedValue behavior (LockedValue.tsx)

- **Lines 12–13**: `if (!locked) return <>{children}</>;` → unlocked면 children 그대로 렌더.
- **Lines 19–32**: locked일 때:
  - 자식 전체를 `blur-sm select-none pointer-events-none opacity-60`으로 블러 처리(21–23).
  - 그 위에 `absolute inset-0` 오버레이: `bg-[#F8F7F4]/70 backdrop-blur-sm`, 중앙에 Lock 아이콘(w-4 h-4), 그 아래 `/pricing` 링크 "Unlock with Alpha →" 또는 "Unlock with Standard →"(25–31).
- 라벨이 children 안에 있으면 라벨도 함께 블러되고 오버레이에 가려짐. 라벨을 항상 보이게 하려면 라벨은 LockedValue **밖**에 두고 children에는 값만 넣어야 함.

### Needed changes to make blur look premium

- **Frosted glass effect**: 이미 `backdrop-blur-sm`과 `bg-[#F8F7F4]/70` 사용 중. 강도 조정(예: `backdrop-blur-md`, 투명도)으로 더 유리 느낌 강화 가능.
- **Lock icon centered**: 현재도 `flex flex-col items-center justify-center`로 중앙 정렬됨. 아이콘 크기/두께 조정 가능.
- **CTA**: "Unlock with Alpha →" / "Unlock with Standard →" 링크 유지. 필요 시 버튼 스타일로 변경.
- **Minimum height**: locked일 때도 `min-h-[...]` 적용해 영역이 완전히 줄어들지 않게 함. 값이 비어 있을 때도 플레이스홀더 높이 확보.
- **Background that hints at content underneath**: 블러된 children이 보이도록 `opacity-60` 유지하거나 살짝 올려서, 아래에 내용이 있다는 느낌을 주기.
- **라벨/구조 분리**: LockedValue는 “값”만 감싸도록 사용하고, 라벨은 부모에서 항상 렌더하도록 가이드(문서/코드 컨벤션).

---

## 6. maskReportByTier Fields Check

**Source**: `lib/auth-server.ts`, `maskReportByTier` (lines 37–92). `tier !== "alpha"`일 때 아래 필드들이 null로 설정됨.

| Field | Line | Corresponding label(s) that should still show | Flag if label has NO blur placeholder |
|-------|------|----------------------------------------------|--------------------------------------|
| export_status | 46 | Export Readiness (SourcingIntel) | Label visible; value in LockedValue ✓ |
| status_reason | 47 | (inside Export Readiness block) | Same block ✓ |
| actual_weight_g | 48 | Actual Weight (SourcingIntel) | In LockedValue ✓ |
| volumetric_weight_g | 49 | Volumetric Weight | In LockedValue ✓ |
| billable_weight_g | 50 | Billable Weight | In LockedValue ✓ |
| dimensions_cm | 51 | (with Volumetric Weight) | In LockedValue ✓ |
| shipping_tier | 52 | Shipping Tier | In LockedValue ✓ |
| required_certificates | 53 | Certifications Required | In LockedValue ✓ |
| shipping_notes | 54 | Compliance & Logistics Strategy, Shipping Notes | Block can disappear → **Flag**: label needs to always show + placeholder |
| hazmat_status | 55 | Hazmat & Compliance | In LockedValue ✓ |
| key_risk_ingredient | 56 | (Risk Ingredient in same block) | In LockedValue ✓ |
| composition_info | 57 | Ingredients | In LockedValue ✓ |
| spec_summary | 58 | Specifications | In LockedValue ✓ |
| hazmat_summary | 59 | Hazmat Summary | In LockedValue ✓ |
| sourcing_tip | 60 | Compliance & Logistics Strategy (Steps 4–5), Scout Strategy Report (Steps 1–3) | **Flag**: blocks return null when empty → labels disappear; need always-visible labels + placeholders |
| hs_code | 61 | HS Code, Broker Email Draft (GroupBBrokerSection) | Sub-labels hidden when !canSeeAlpha → **Flag** |
| hs_description | 62 | (with HS Code) | Same ✓ |
| verified_cost_usd | 64–66 | Cost Per Unit, Financial Briefing | **Flag**: whole section in canSeeAlpha → labels hidden |
| verified_cost_note | 65 | (Cost Per Unit) | Same |
| verified_at | 66 | (Verified by KoreaScout…) | Same |
| moq | 67 | MOQ | **Flag**: label inside canSeeAlpha |
| lead_time | 68 | Est. Production Lead Time | **Flag** |
| can_oem | 69 | OEM / ODM | **Flag** |
| m_name, translated_name, corporate_scale | 69–71 | Supplier & Brand Intel, brand name | **Flag** |
| contact_email, contact_phone, m_homepage, naver_link, wholesale_link, global_site_url, b2b_inquiry_url | 71–77 | Contact links | **Flag** |
| sample_policy | 79 | Sample Policy | **Flag** |
| export_cert_note | 80 | Compliance Note | **Flag** |
| viral_video_url, video_url, ai_detail_page_links, marketing_assets_url, ai_image_url | 81–85 | Creative Assets, asset cards | **Flag** |

**Summary**

- **Labels with NO corresponding blur placeholder / labels hidden when data is null**:  
  SupplierContact 전체(Launch & Execution Kit, Financial Briefing, MOQ, Lead Time, OEM/ODM, Supplier & Brand Intel, Sample Policy, Compliance Note, Global Market Proof, Creative Assets), GroupBBrokerSection의 "HS Code", "Broker Email Draft", SourcingIntel의 "Compliance & Logistics Strategy"(및 Step 4/5, Shipping Notes), SocialProofTrendIntelligence의 "Scout Strategy Report"(및 Step 1–3).  
  → 이들에 대해 라벨은 항상 노출하고, 값/블록만 LockedValue 또는 플레이스홀더로 처리해야 함.
- **maskReportByTier에서 null로 두는 모든 필드**에 대해, 해당 필드를 보여 주는 UI에는 반드시 “라벨은 항상 표시 + 값은 blur/placeholder” 규칙을 적용할 것.

---

*File created: _docs/LABEL_AUDIT.md*
