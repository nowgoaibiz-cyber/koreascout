# K-Product Scout — 프로젝트 현황

> **대상:** Gemini, Claude 등 AI 팀원 공유용  
> **최종 갱신:** 2026-03-04  
> **목적:** 현재 프로젝트 상태를 정확히 파악하기 위한 단일 문서

---

## 1. 파일 트리

`node_modules`, `.next`, `.git` 제외한 전체 파일 목록.

```
K-ProductScout/
├── .cursorrules
├── .env.local
├── .env.local.example
├── .gitignore
├── README.md
├── _docs/
│   ├── 01_CORE_SPEC.md
│   ├── 02_DESIGN_SYSTEM.md
│   ├── 03_AUDIT_PROJECT_STATE.md
│   ├── 04_AUDIT_DARK_REMNANTS.md
│   ├── PROJECT_2DB_STATUS.md
│   ├── PROJECT_2STATUS.md
│   ├── PROJECT_3DATA_MAP.md
│   ├── PROJECT_4UI_STRATEGY.md
│   ├── PROJECT_CURRENT_DESIGN.md
│   ├── SECTION_5_EXPORT_LOGISTICS_DATA_REPORT.md
│   └── SECTION_6_MEDIA_VAULT_DIAGNOSTIC.md
├── eslint.config.mjs
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── account/
│   │   └── page.tsx
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts
│   ├── api/
│   │   └── webhooks/
│   │       └── lemonsqueezy/
│   │           └── route.ts
│   ├── login/
│   │   └── page.tsx
│   ├── pricing/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   └── weekly/
│       ├── page.tsx
│       └── [weekId]/
│           ├── page.tsx
│           └── [id]/
│               └── page.tsx
├── components/
│   ├── GoogleSignInButton.tsx
│   ├── LockedSection.tsx
│   ├── LogoutButton.tsx
│   └── Navigation.tsx
├── lib/
│   ├── auth-server.ts
│   └── supabase/
│   │   ├── admin.ts
│   │   ├── client.ts
│   │   ├── middleware.ts
│   │   └── server.ts
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── supabase/
│   └── migrations/
│       └── 001_phase2_schema.sql
└── types/
    └── database.ts
```

---

## 2. 완료된 작업 (페이지/기능 상태)

| 항목 | 상태 | 비고 |
|------|------|------|
| **랜딩 페이지** (`/`) | ✅ 동작 | Hero, 가치 제안, FAQ, 인라인 #pricing 섹션. |
| **Pricing 전용 페이지** (`/pricing`) | ✅ 동작 | Section 12 비교표 구현. Dark B2B 테마, Alpha MOST POPULAR, Standard/Alpha CTA → LemonSqueezy Checkout URL 연결. |
| **로그인** (`/login`) | ✅ 동작 | 이메일/비밀번호 + Google, Supabase Auth |
| **회원가입** (`/signup`) | ✅ 동작 | 가입 시 `profiles` 자동 생성(트리거) |
| **Auth 콜백** (`/auth/callback`) | ✅ 동작 | OAuth 리다이렉트 처리 |
| **Weekly 허브** (`/weekly`) | ✅ 동작 | 주차 목록, Free 14일 잠금/해제, RLS 반영 |
| **상품 리스트** (`/weekly/[weekId]`) | ✅ 동작 | 상품 카드, `is_teaser` 뱃지 |
| **상품 상세** (`/weekly/[weekId]/[id]`) | ✅ 동작 | Tier별 섹션 분기, LockedSection CTA → `/pricing` |
| **계정** (`/account`) | ⚠️ 부분 | 로그인 필수, 이메일 표시. 구독/고객 포털 링크는 TODO. |
| **LemonSqueezy Webhook** (`POST /api/webhooks/lemonsqueezy`) | ✅ 동작 | 서명 검증, subscription_created/updated → tier 업데이트, subscription_cancelled/expired → tier=free. Service role로 RLS 우회. |
| **시드 데이터** | ❌ 미삽입 | `weeks` / `scout_final_reports` 테스트 데이터 없으면 Weekly 빈 목록. |

---

## 3. 현재 기술 구성

### 3-1. 패키지 (package.json)

| 구분 | 패키지 | 버전 |
|------|--------|------|
| **런타임** | next | 16.1.6 |
| | react | 19.2.3 |
| | react-dom | 19.2.3 |
| | @supabase/ssr | ^0.8.0 |
| | @supabase/supabase-js | ^2.98.0 |
| | lucide-react | ^0.575.0 |
| **개발** | typescript | ^5 |
| | eslint | ^9 |
| | eslint-config-next | 16.1.6 |
| | tailwindcss | ^4 |
| | @tailwindcss/postcss | ^4 |
| | @types/node | ^20 |
| | @types/react | ^19 |
| | @types/react-dom | ^19 |

결제: LemonSqueezy Checkout 링크 + Webhook. LemonSqueezy SDK 미사용.

### 3-2. 환경 변수

| 변수 | 설정 여부 | 용도 |
|------|------------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key (RLS 적용) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | 웹훅에서 profiles 업데이트 시 RLS 우회 |
| `LEMONSQUEEZY_API_KEY` | ✅ | LemonSqueezy API (선택 사용) |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | ✅ | 웹훅 X-Signature HMAC 검증 |
| `LEMONSQUEEZY_VARIANT_ID_STANDARD` | ✅ | 숫자 variant_id (예: 1349474) → tier `standard` |
| `LEMONSQUEEZY_VARIANT_ID_ALPHA` | ✅ | 숫자 variant_id (예: 1349486) → tier `alpha` |

---

## 4. 페이지 라우트

| 경로 | 설명 |
|------|------|
| `/` | 랜딩. Hero, 기능 소개, FAQ, #pricing. |
| `/pricing` | 3-tier 비교표 + Standard/Alpha LemonSqueezy Checkout 링크 (target=_blank). |
| `/login` | 로그인 (이메일/비밀번호 + Google). |
| `/signup` | 회원가입. |
| `/auth/callback` | OAuth 콜백. |
| `/account` | 계정(이메일). 구독/포털 TODO. |
| `/weekly` | Weekly 허브. |
| `/weekly/[weekId]` | 해당 주차 상품 리스트. |
| `/weekly/[weekId]/[id]` | 상품 상세. Tier 분기, CTA → /pricing. |
| `POST /api/webhooks/lemonsqueezy` | LemonSqueezy 웹훅. 서명 검증 후 tier 갱신. |

---

## 5. 컴포넌트

| 컴포넌트 | 경로 | 용도 |
|----------|------|------|
| Navigation | `components/Navigation.tsx` | 상단 공통 네비게이션. |
| GoogleSignInButton | `components/GoogleSignInButton.tsx` | Google OAuth. |
| LogoutButton | `components/LogoutButton.tsx` | 로그아웃. |
| LockedSection | `components/LockedSection.tsx` | 상세 페이지 잠금 섹션, CTA `/pricing`. |

---

## 6. Technical Log (14:00 KST 이후)

### 6-1. ngrok 및 웹훅 인증

- **상황:** 로컬/배포 웹훅 URL로 LemonSqueezy에서 POST 시 400/401/500 발생.
- **서명 검증:**  
  - `request.text()`로 **raw body** 확보 후 `JSON.parse` 분리. (body 한 번만 소비.)  
  - `X-Signature` 헤더와 `LEMONSQUEEZY_WEBHOOK_SECRET`으로 HMAC-SHA256 hex digest 계산, `crypto.timingSafeEqual`로 비교. 실패 시 401 반환.
- **ngrok 사용 시:** LemonSqueezy Webhook URL을 ngrok HTTPS URL (예: `https://xxx.ngrok.io/api/webhooks/lemonsqueezy`)로 설정하고, 동일한 Signing secret 사용. 로컬에서는 `next dev` + ngrok 터널로 수신.

### 6-2. 400 Bad Request 원인 및 수정

- **원인 1 — Unknown variant_id:**  
  LemonSqueezy 웹훅은 체크아웃 URL의 UUID가 아니라 **숫자 variant_id**를 보냄. 기존 코드는 UUID만 비교해 매칭 실패 → 400.
- **수정:**  
  - `.env`에 `LEMONSQUEEZY_VARIANT_ID_STANDARD`, `LEMONSQUEEZY_VARIANT_ID_ALPHA` (숫자) 추가.  
  - `variantIdToTier(variantId)`: `variantId`가 **number**이거나 숫자 **string**이면 `parseInt` 후 env에서 읽은 숫자와 비교해 `'standard'`/`'alpha'` 반환. UUID는 기존 로직 유지.
- **원인 2 — Missing variant_id:**  
  payload가 예상과 다르면 `data.attributes.variant_id`가 없을 수 있음.  
- **수정:**  
  - 400 반환 직전에 `attrs`(또는 관련 payload)를 `console.warn`으로 로그.  
  - 수신 시 `event`, `data.type`, `data.id`, `data.attributes` 키, `variant_id` 값/타입을 `console.log`로 출력해 실제 페이로드 구조 확인.

### 6-3. 500 및 프로필 업데이트

- **원인:** 웹훅에서 `profiles` 업데이트 시 anon 클라이언트 사용 → RLS로 인해 업데이트 거부 또는 행 미조회.
- **수정:**  
  - `lib/supabase/admin.ts`에 `createServiceRoleClient()` 추가. `SUPABASE_SERVICE_ROLE_KEY` 사용, `persistSession: false`.  
  - 웹훅 핸들러에서는 이 **service role 클라이언트**만 사용해 `profiles`의 `tier`, `ls_subscription_id`, `tier_updated_at` 갱신 (및 취소/만료 시 `tier='free'`, `ls_subscription_id=null`).
- **유저 식별:**  
  - 우선 `meta.custom_data.user_id` (Supabase auth UUID).  
  - 없으면 `data.attributes.user_email`로 `profiles`에서 해당 행을 찾아 업데이트.

### 6-4. 적용된 코드 요약

- **route.ts:**  
  - Raw body → 서명 검증 → JSON 파싱 → `meta.event_name` / `x-event-name`으로 이벤트 분기.  
  - `subscription_created` / `subscription_updated`: `variant_id` → `variantIdToTier()` → tier 결정 → `custom_data.user_id` 또는 `user_email`로 profile 업데이트.  
  - `subscription_cancelled` / `subscription_expired`: `data.id`로 `ls_subscription_id` 매칭 후 `tier='free'`, `ls_subscription_id=null`.  
  - 각 400/401/500 반환 직전에 원인과 수신값 로그 추가.

---

## 7. Progress — 결제 연동 및 테스트

| 항목 | 상태 | 비고 |
|------|------|------|
| Pricing 페이지 | ✅ | Section 12 비교표, Alpha 강조, CTA 버튼. |
| Checkout 링크 | ✅ | Standard/Alpha 각각 LemonSqueezy Checkout URL, `target="_blank"` `rel="noopener noreferrer"`. |
| Webhook 엔드포인트 | ✅ | `POST /api/webhooks/lemonsqueezy` 구현. |
| 서명 검증 | ✅ | HMAC-SHA256 + timingSafeEqual. |
| tier 업데이트 (구독 생성/갱신) | ✅ | variant_id(숫자) → env 매핑 → `profiles.tier` / `ls_subscription_id` / `tier_updated_at` 갱신. |
| tier 다운그레이드 (취소/만료) | ✅ | `ls_subscription_id`로 프로필 찾아 `tier='free'`. |
| 테스트 결제 → 200 성공 | ✅ | 로그에서 variant_id 숫자(1349474 등) 확인 후, `LEMONSQUEEZY_VARIANT_ID_STANDARD` 설정으로 400 해소, 웹훅 200 및 tier 반영 확인. |

**결제 연동 완성도:** Checkout 진입 → 결제 완료 → 웹훅 수신 → profiles tier 갱신까지 플로우 완료. `/account`에서 구독 상태/고객 포털 링크 노출은 별도 작업.

---

## 8. 알려진 이슈 / 미완료

- **시드 데이터:** `weeks` / `scout_final_reports` 미삽입 시 Weekly 빈 목록.
- **seo_keywords:** DB는 `TEXT[]`, `types/database.ts`는 `string[] | null` — 필요 시 타입 정리.
- **account:** 구독 상태 표시 및 LemonSqueezy 고객 포털 링크 미구현.

---

## 8b. Section Status (Product Detail Page)

| 섹션 | 상태 | 비고 |
|------|------|------|
| **Section 4** (Social Proof & Trend Intelligence) | **DONE** | 럭셔리 타이포·카드·Gap Index Hero·Trending Signals·Scout Strategy 최종 적용. Design Constitution 반영 완료. |
| **Section 5** (Export & Logistics Intel) | **READY FOR OVERHAUL** | Constitution 확정 후 오버홀 대기. `_docs/standard/10_LUXURY_UI_AUDIT.md` 선행 참조. |

---

## 8c. Current Focus

**Section 5 (Export & Logistics) 오버홀 준비 완료.**  
Design Constitution(`10_LUXURY_UI_AUDIT.md`) 저장됨. Section 5 작업 시작 전 해당 문서 및 `.cursorrules` Design System 준수.

---

## 9. Make.com 연동 및 DB 스키마

| 항목 | 상태 | 비고 |
|------|------|------|
| **Backend / Make.com 데이터 파이프라인** | ✅ **100% 완료** | 외부 소스 → Make.com → Supabase `scout_final_reports` 적재 완료. |
| **DB 스키마 업데이트** | ✅ **100% 완료** | `scout_final_reports` 확장 반영: evidence 필드, weight 컬럼, `rising_keywords`/`viral_hashtags` TEXT, `sourcing_tip` 5단계 전략 등. 상세는 `PROJECT_2DB_STATUS.md` 참고. |

설계상 LemonSqueezy → Next.js Webhook → Supabase `profiles` 업데이트는 구현 완료.

---

## 10. Additional Updates Found by AI

(14:00 KST 이후 대화·수정 기준으로, 사용자가 명시하지 않았으나 반영된 사항.)

- **Pricing 페이지 메타데이터:** `app/pricing/page.tsx`에 `metadata` (title: "Pricing — K-Product Scout", description) 추가.
- **웹훅 로그:** 400/401/500 원인 추적을 위해 `[lemonsqueezy]` 접두어로 event, data.type, data.id, attributes 키, variant_id 값/타입, 및 각 에러 반환 직전 상세 로그 추가.
- **variant_id 이중 지원:** 숫자 외에 **문자열 숫자**(`"1349474"`)도 `variantIdToTier`에서 `parseInt` 후 비교하도록 처리.
- **.env.local.example:** `SUPABASE_SERVICE_ROLE_KEY`, `LEMONSQUEEZY_*`, `LEMONSQUEEZY_VARIANT_ID_STANDARD` / `_ALPHA` 플레이스홀더 및 주석 추가.
- **Checkout 링크 보안:** Standard/Alpha CTA에 `target="_blank"` 및 `rel="noopener noreferrer"` 적용.
- **profiles 업데이트 필드:** 웹훅에서 `tier`, `ls_subscription_id`, `tier_updated_at`만 갱신. `ls_customer_id`는 현재 웹훅 로직에서 미설정(필요 시 추후 추가).

---

---

## 11. [2026-03-04] Governance — Design Constitution

- **Completed:** Section 4 럭셔리 UI 확정 기준으로 `_docs/standard/10_LUXURY_UI_AUDIT.md` (Absolute Typography & Card Rules) 작성. Main Header / Sub-Label / Body(200자 ternary) / Card Container / Hero Number 규칙 명시.
- **Completed:** Section 4 → **DONE**, Section 5 → **READY FOR OVERHAUL** 반영.
- **Pending:** Section 5 (Export & Logistics Intel) 오버홀 — Constitution 선행 참조 후 진행.
- **Blockers:** 없음.

---

이 문서는 `01_CORE_SPEC.md`, `PROJECT_2DB_STATUS.md`와 함께 사용하면 현재 구현 범위와 결제·웹훅 상태를 한눈에 맞출 수 있습니다.
