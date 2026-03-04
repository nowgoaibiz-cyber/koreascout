# Pricing Page 전수조사 보고서

> **조사일:** 2026-03-05  
> **규칙:** 코드 수정 없음(Read-Only).  
> **목적:** Stitch MCP 럭셔리 UI 덧씌우기 전 기존 로직 백업 및 보존 필수 항목 정리.

---

## 1. 컴포넌트 기본 정보

| 항목 | 내용 |
|------|------|
| **파일 경로** | `app/pricing/page.tsx` |
| **총 라인 수** | 192 라인 |
| **Server / Client** | **Server 컴포넌트** (`"use client"` 없음. useState/useEffect/useRouter 등 훅 미사용) |
| **Next.js Metadata** | `export const metadata: Metadata` 사용 |
| **title** | `"Pricing — KoreaScout"` |
| **description** | `"Compare Free, Standard $9, and Alpha $29. Choose your intelligence level."` |

---

## 2. 결제 로직 상세

| 발견된 요소 | 현재 역할 | 보존 전략 |
|-------------|-----------|-----------|
| **Standard Checkout URL** | Standard $9 결제 진입. `Link`의 `href`로 직접 연결. | **절대 변경/삭제 금지.** URL 전체 복사 보존. |
| **Alpha Checkout URL** | Alpha $29 결제 진입. 동일 방식. | **절대 변경/삭제 금지.** URL 전체 복사 보존. |
| **Free CTA** | `href="#"`. 결제 없음, “Continue Free” 안내. | 유지. 필요 시 `#` 또는 `/weekly` 등으로만 변경. |
| **버튼 핸들러** | **없음.** `onClick`/`handleCheckout`/`window.open` 미사용. 전부 `<Link href="..." target="_blank" rel="noopener noreferrer">` 사용. | 링크 기반 동작 유지. Stitch 시 `Link`/`href` 제거하지 말 것. |
| **환경변수** | **이 페이지 내에서는 미참조.** `process.env`/`NEXT_PUBLIC_*` 사용 없음. Checkout URL은 **하드코딩**. | 웹훅(`LEMONSQUEEZY_VARIANT_ID_*`)은 별도 파일에서 사용. 이 페이지는 URL 문자열만 보존하면 됨. |

### LemonSqueezy Checkout URL 목록 (덮어쓰기 금지)

| 티어 | URL (전체) |
|------|-------------|
| **Standard** | `https://k-productscout26.lemonsqueezy.com/checkout/buy/141f6710-c704-4ab3-b7c7-f30b2c587587` |
| **Alpha** | `https://k-productscout26.lemonsqueezy.com/checkout/buy/41bb4d4b-b9d6-4a60-8e19-19287c35516d` |

- 두 링크 모두 `target="_blank"` + `rel="noopener noreferrer"` 적용됨. 보존 권장.

---

## 3. State & Auth 로직

| 발견된 요소 | 현재 역할 | 보존 전략 |
|-------------|-----------|-----------|
| **React 훅** | **없음.** useState, useEffect, useCallback, useMemo, useRef, useRouter, useSession, useUser 전부 미사용. | Server Component 유지 시 훅 불필요. Client로 전환 시에만 훅 추가 검토. |
| **Supabase Auth** | **없음.** createClient, getSession, getUser, auth.* 미사용. | 이 페이지는 비로그인 상태에서도 전체 노출. 인증 체크 없음. |
| **사용자 세션** | 미활용. | 티어별 “이미 구독 중” 등 표시는 향후 Phase 2 등에서 별도 구현. |

**요약:** Pricing 페이지는 **완전 정적(Server Component)** 이며, 상태/인증 로직이 없음. 보존할 state/auth 코드 없음.

---

## 4. 데이터 구조

| 발견된 요소 | 현재 역할 | 보존 전략 |
|-------------|-----------|-----------|
| **FeatureRow 타입** | `feature: string` + `free`/`standard`/`alpha`가 각각 `boolean` 또는 `string`. | 타입 정의 유지. 스티치 시 비교표 행 구조 변경 시 동일 타입으로 맞출 것. |
| **FEATURES 상수 배열** | 20행. 접근 시점, 주간 상품 수, 시장성 점수 ~ 바이럴 숏폼 영상까지. Free/Standard/Alpha별 boolean 또는 문자열. | **기능 목록 내용**은 비즈니스 스펙. 순서·항목명 변경 시 기획 확인. 카피만 바꿀 경우 안전 교체 가능. |
| **조건부 렌더링** | `TierCell` 내부: `typeof value === "string"` → 문자열 셀, 아니면 Check/X 아이콘. `isAlphaColumn` → Alpha 컬럼 시 다크 스타일. | TierCell 시맨틱(문자열 vs 불리언, Alpha 컬럼 여부) 유지. |
| **하드코딩 가격/티어명** | 테이블 헤더: "Free $0", "Standard $9", "Alpha $29". 카드: "Standard — $9/mo", "Alpha — $29/mo". | 숫자·티어명은 카피. 브랜드 일관성 유지 범위에서 텍스트만 교체 가능. |

### 티어/플랜 정의 요약

- **Free:** $0, 14일 딜레이, ~5개 상품, 제한된 기능.
- **Standard:** $9/mo, 즉시, ~10개, 대부분 기능 포함. “MOST POPULAR” 뱃지.
- **Alpha:** $29/mo, 즉시, ~10개, 전 기능 + HS Code·소싱팁·연락처·4K·숏폼 등. “Early Bird” 뱃지.

---

## 5. 의존성 목록

| 구분 | 발견된 요소 | 현재 역할 | 보존 전략 |
|------|-------------|-----------|-----------|
| **외부 패키지** | `next/link` (Link), `lucide-react` (Check, X, Sparkles), `next` (Metadata 타입) | 라우팅, 아이콘, 메타데이터. | import 경로 유지. 아이콘 교체 시 동일 패키지 내에서만. |
| **내부 컴포넌트** | **없음.** Navigation, Footer, Button, Card, Badge, Modal, Checkout 등 미사용. | 페이지 단일 파일 내에서 Link + TierCell + 테이블/카드만 사용. | 레이아웃 추가 시 기존 Link/테이블/카드 구조 유지. |
| **Lucide 아이콘** | `Check`, `X`, `Sparkles` | TierCell 체크/엑스, Alpha 컬럼 “MOST POPULAR” 뱃지. | 시맨틱(체크/엑스/강조) 유지. 스타일만 변경 가능. |

---

## 6. 보존 필수 항목 (Critical — 덮어쓰기 금지)

1. **결제 URL**
   - Standard: `https://k-productscout26.lemonsqueezy.com/checkout/buy/141f6710-c704-4ab3-b7c7-f30b2c587587`
   - Alpha: `https://k-productscout26.lemonsqueezy.com/checkout/buy/41bb4d4b-b9d6-4a60-8e19-19287c35516d`
   - 두 링크의 `target="_blank"` 및 `rel="noopener noreferrer"` 유지.

2. **인증 로직**
   - 현재 없음. 추후 추가 시 기존 정적 노출(비로그인 전체 비교표)과 충돌하지 않도록 설계.

3. **환경변수 참조**
   - 이 페이지는 env 미사용. 웹훅 쪽 `LEMONSQUEEZY_VARIANT_ID_STANDARD` / `_ALPHA`는 그대로 두고, Pricing 페이지는 **URL 문자열만** 보존하면 됨.

4. **데이터 계약**
   - `FEATURES` 배열의 행 개수·키(`feature`, `free`, `standard`, `alpha`) 및 `TierCell`의 `value`(boolean | string), `isAlphaColumn` 시맨틱 유지.

---

## 7. 안전 교체 가능 항목 (Stitch MCP 대상)

| 항목 | 설명 |
|------|------|
| **순수 UI/레이아웃 className** | `min-h-screen`, `pt-20`, `max-w-7xl`, `rounded-2xl`, `border-[#E8E6E1]`, `shadow-[...]`, `p-3 sm:p-4` 등 Tailwind 클래스. Constitution 색/폰트/간격으로 교체 가능. |
| **하드코딩 텍스트 카피** | “Choose Your Intelligence Level”, “Compare features across…”, “Continue Free”, “Start Standard — $9/mo →”, “Go Alpha — $29/mo →”, “← Back to home”, “MOST POPULAR”, “Early Bird” 등. |
| **색상/폰트/간격** | `#F8F7F4`, `#1A1916`, `#16A34A`, `#15803D`, `#E8E6E1`, `#6B6860`, `#9E9C98`, `#3D3B36`, `text-xs`, `tracking-widest` 등. `10_LUXURY_UI_AUDIT.md` v2.0 토큰으로 통일 가능. |
| **메타데이터 문구** | `metadata.title`, `metadata.description` 문자열. 브랜드/톤에 맞게 수정 가능. |

---

전수조사가 완료되었습니다. 기존 로직을 안전하게 백업했습니다.  
이제 Stitch MCP를 활용한 럭셔리 UI 덧씌우기 작업을 시작할 수 있습니다.
