# K-Product Scout — 최종 프로젝트 설계서 (v1.2)

> **Company:** 지금행컴퍼니 (JigumHaeng Company)
> **Date:** 2026년 2월 27일
> **Service:** Korean Trend Product Sourcing Intelligence Platform
> **Status:** CONFIRMED — 이 문서는 CEO, Claude(전략/설계), Gemini(CTO) 간 합의된 최종 사양입니다.
> **Usage:** Cursor IDE에서 바이브코딩 시 이 파일을 컨텍스트로 참조할 것.
> **Version History:**
> - v1.0 (2026-02-27): 초기 설계서
> - v1.1 (2026-02-27): is_premium 추가, Free 상품 절반 노출
> - v1.2 (2026-02-27): competitor_analysis_pdf → viral_video_url 변경, 8-Step 로드맵, DB 변경 규칙 추가, Make.com 연동 주의사항 추가

---

## ⛔ 절대 규칙 (모든 AI 팀원 필독)

### DB 변경 규칙

> **추가(ADD):** 자유롭게 진행 가능. 컬럼 추가, 테이블 추가, 인덱스 추가 등은 기존 시스템에 영향 없음.
>
> **수정(ALTER) / 삭제(DROP): 반드시 CEO 컨펌 후 진행.**
>
> 이유: scout_final_reports 테이블은 Make.com 자동화 파이프라인과 직접 연결되어 있음. 컬럼명 변경, 타입 변경, 컬럼 삭제 시 Make.com 시나리오가 전부 깨짐. 실제로 이미 한 번 깨져서 복구에 고생한 전례 있음.
>
> **절차:**
> 1. 수정/삭제가 필요한 이유를 CEO에게 설명
> 2. 영향 범위 명시 (어떤 Make 시나리오, 어떤 코드에 영향?)
> 3. CEO "ㅇㅇ 해" 확인 후에만 실행
> 4. 실행 후 PROJECT_2DB_STATUS.md + PROJECT_2STATUS.md 즉시 업데이트

### Make.com 연동 주의사항

> scout_final_reports 테이블은 Make.com에서 자동으로 데이터를 적재하는 대상임.
> Make에서 들어오는 데이터가 아래 **접근 제어 필드**를 정확히 포함해야 Tier 시스템이 작동함:
> - `week_id`: 올바른 주차 ID (weeks 테이블에 존재해야 함)
> - `published_at`: 발행일 (이 값 기준으로 free_list_at이 자동 계산됨)
> - `is_premium`: TRUE(Paid 전용) / FALSE(Free 공개) — 매주 약 절반을 FALSE로
> - `is_teaser`: TRUE면 미끼 리포트 (매주 정확히 1개만)
> - `status`: 'published'로 설정해야 RLS에서 노출됨
>
> 이 필드들이 누락되거나 잘못 들어가면 상품이 아예 안 보이거나, 유료 상품이 무료로 풀리는 등 심각한 문제 발생.

---

## 목차

1. [서비스 개요](#1-서비스-개요)
2. [기술 스택 (확정)](#2-기술-스택-확정)
3. [아키텍처 흐름](#3-아키텍처-흐름)
4. [3-Tier 멤버십 모델 (확정)](#4-3-tier-멤버십-모델-확정)
5. [업그레이드 심리 흐름](#5-업그레이드-심리-흐름)
6. [Tier Access Matrix (전체 필드)](#6-tier-access-matrix-전체-필드)
7. [데이터베이스 스키마 (Supabase)](#7-데이터베이스-스키마-supabase)
8. [페이지 구조](#8-페이지-구조)
9. [상세 페이지 섹션 배치 (UX)](#9-상세-페이지-섹션-배치-ux)
10. [Weekly 허브 페이지 동작](#10-weekly-허브-페이지-동작)
11. [미끼 리포트 전략 (Teaser)](#11-미끼-리포트-전략-teaser)
12. [Pricing 페이지 비교표](#12-pricing-페이지-비교표)
13. [Next.js 구현 가이드](#13-nextjs-구현-가이드)
14. [개발 로드맵 (8-Step)](#14-개발-로드맵-8-step)
15. [주간 운영 체크리스트](#15-주간-운영-체크리스트)
16. [놓치면 안 되는 주의사항 모음](#16-놓치면-안-되는-주의사항-모음)

---

## 1. 서비스 개요

K-Product Scout는 한국 트렌드 상품(다이소, 올리브영 등)을 글로벌 이커머스 셀러에게 주간 리포트 형태로 제공하는 B2B SaaS 플랫폼.

**핵심 가치:** 셀러가 서양 시장에서 해당 상품이 유행하기 **전에** 소싱할 수 있도록 선점 정보를 제공.

**타겟 고객:** Amazon FBA, eBay, Shopify 등에서 한국 상품을 소싱하려는 글로벌 이커머스 셀러.

**비즈니스 모델:** 3-Tier 구독 (Free / Standard $9 / Alpha $29)

**수익 목표 (Month 3):**
- Free: 500 users (유입 풀)
- Standard $9: 80 users = $720/month
- Alpha $29: 50 users = $1,450/month
- **합계: $2,170/month**

**장기 목표:** Alpha 멤버 3,000명 모집

---

## 2. 기술 스택 (확정)

| 레이어 | 도구 | 역할 |
|--------|------|------|
| **프론트엔드** | Next.js (App Router, React) | SSR, SEO 최적화, 페이지 라우팅, Tier별 조건부 렌더링 |
| **스타일링** | Tailwind CSS | 유틸리티 기반 CSS, Cursor 바이브코딩과 최적 호환 |
| **백엔드/DB** | Supabase | PostgreSQL, Row Level Security(RLS), Auth, File Storage |
| **결제** | LemonSqueezy | 구독 결제($9/$29), 글로벌 세금 자동 처리, Merchant of Record |
| **배포** | Vercel | GitHub push → 자동 배포, SSL/CDN, 커스텀 도메인 |
| **자동화** | Make.com | 트렌드 데이터 수집 → Claude API 정제 → Supabase 자동 적재 |
| **개발 도구** | Cursor IDE | AI 바이브코딩. 이것 하나로 개발 전담. |

### 2-1. 왜 LemonSqueezy인가 (Stripe 대신)

LemonSqueezy는 **Merchant of Record(MoR)** 모델:
- 글로벌 판매 시 EU VAT, UK VAT, 각국 판매세를 자동 신고/납부
- 1인 기업에 결정적. 환불/분쟁 처리도 대행.
- 건당 수수료 모델이라 고정비 없음 → 미리 세팅 가능

### 2-2. AI 팀 역할 분담

| 역할 | 호칭 | 담당 | 임무 |
|------|------|------|------|
| 총사령관 (CEO) | 대표 | 대표 | 비즈니스 결정, DB 수정/삭제 컨펌 |
| CTO | 첫째 | Gemini | 기술 검증, Phase별 프롬프트 작성 |
| 전략 파트너 | 둘째 | Claude | 전략/설계, PROJECT_SPEC 관리 |
| 수석 개발자 | 셋째 | Cursor | 코드 작성/수정, 디버깅 |

---

## 3. 아키텍처 흐름

```
[유저 브라우저]
      ↓
[Next.js on Vercel] — SSR + 라우팅 + Tier별 렌더링
      ↓                    ↓                    ↓
[Supabase Auth]    [Supabase DB + RLS]    [LemonSqueezy]
 로그인/회원가입      데이터 접근 제어         구독 결제
                          ↑                      ↓
                    [Make.com]           [Webhook → profiles.tier
                     자동 데이터 적재       자동 업데이트]
```

### 결제 → 권한 흐름:
1. `/pricing`에서 Plan 선택 → LemonSqueezy Checkout → 결제 완료
2. Webhook → `/api/webhooks/lemonsqueezy` → `profiles.tier` UPDATE
3. 다음 페이지 로드부터 즉시 Tier 변경 반영

### 데이터 자동 적재 흐름 (Make.com):
1. Make.com이 한국 트렌드 소스에서 데이터 수집
2. Claude API로 정제 (한글→영어 번역, 필드 패키징)
3. Supabase `scout_final_reports`에 INSERT
4. ⚠️ 접근 제어 필드 5개 필수: week_id, published_at, is_premium, is_teaser, status

---

## 4. 3-Tier 멤버십 모델 (확정)

### 4-1. 핵심: 3축 업그레이드 압력

| 축 | 구분 | 메커니즘 |
|----|------|----------|
| **시간** | Free vs Paid | Free는 14일 대기. Paid는 즉시. |
| **수량** | Free vs Paid | Free는 절반(~5개). Paid는 전체(~10개). |
| **깊이** | Standard vs Alpha | Standard는 분석. Alpha는 소싱 연락처. |

### 4-2. 한눈에 비교

| 구분 | Free $0 | Standard $9 | Alpha $29 |
|------|---------|-------------|-----------|
| 접근 시점 | 14일 딜레이 | 즉시 | 즉시 |
| 상품 수 | 절반 (~5개) | 전체 (~10개) | 전체 (~10개) |
| 시장 데이터 | 기본 3개만 | 전체 | 전체 |
| 소싱처 | 🔒 | 🔒 | ✅ |
| 미디어 | 🔒 | 🔒 | ✅ |

### 4-3. Free — $0/month

**접근:** 14일 후 + 절반 상품(is_premium=FALSE)
**볼 수 있는 것:** 상품명, 이미지, 카테고리, 트렌드 이유, 시장성 점수, 경쟁도, 블루오션, 수출 여부
**볼 수 없는 것:** 수익률, 검색량, 성장률, 가격, SEO, 인사이트, AI이미지, 소싱정보, 연락처, 영상
**전환 트리거:** "2주 늦게, 반만, 대충" → $9면 즉시+전부+상세

### 4-4. Standard — $9/month

**접근:** 즉시 + 전체 상품
**추가:** 수익률, 검색량, 성장률, 글로벌 가격, SEO, 인사이트, AI이미지
**못 보는 것:** HS Code, 소싱팁, MOQ, 제조사 연락처, 네이버 링크, 4K영상, 바이럴 영상
**전환 트리거:** "숫자는 다 보이는데 소싱처가 어디야?"

### 4-5. Alpha — $29/month

**접근:** 즉시 + 전체 + **모든 것**
**포함:** 소싱처 연락처, HS Code, 소싱팁, MOQ, 네이버 링크, 4K영상, 한국 바이럴 숏폼 링크

---

## 5. 업그레이드 심리 흐름

```
FREE: "2주 지났고 절반밖에 안 보여"
      ↓ $9 → 속도 + 수량
STANDARD: "수익률 2.8x인데 소싱처가 어디야?"
      ↓ $29 → 실행력
ALPHA: "트렌드 → 바이럴 확인 → 제조사 컨택 → 끝"
```

---

## 6. Tier Access Matrix (전체 필드)

✅ = 열람 / 🔒 = 잠금 / (14d) = 14일 후

### A. 기본 상품 정보

| Field | Free | Standard | Alpha |
|-------|------|----------|-------|
| `product_name` | ✅(14d) | ✅ | ✅ |
| `translated_name` | ✅(14d) | ✅ | ✅ |
| `image_url` | ✅(14d) | ✅ | ✅ |
| `ai_image_url` | 🔒 | ✅ | ✅ |
| `category` | ✅(14d) | ✅ | ✅ |
| `viability_reason` | ✅(14d) | ✅ | ✅ |
| `summary`/`consumer_insight` | 🔒 | ✅ | ✅ |

### B. 시장성 데이터

| Field | Free | Standard | Alpha |
|-------|------|----------|-------|
| `market_viability` | ✅(14d) | ✅ | ✅ |
| `competition_level` | ✅(14d) | ✅ | ✅ |
| `gap_status` | ✅(14d) | ✅ | ✅ |
| `profit_multiplier` | 🔒 | ✅ | ✅ |
| `search_volume` | 🔒 | ✅ | ✅ |
| `mom_growth` | 🔒 | ✅ | ✅ |
| `global_price` | 🔒 | ✅ | ✅ |
| `seo_keywords` | 🔒 | ✅ | ✅ |

### C. 소싱 & 물류

| Field | Free | Standard | Alpha |
|-------|------|----------|-------|
| `export_status` | ✅(14d) | ✅ | ✅ |
| `hs_code` | 🔒 | 🔒 | ✅ |
| `sourcing_tip` | 🔒 | 🔒 | ✅ |
| `manufacturer_check` | 🔒 | 🔒 | ✅ |

### D. 제조사/컨택 (Alpha 전용)

| Field | Free | Standard | Alpha |
|-------|------|----------|-------|
| `m_name` | 🔒 | 🔒 | ✅ |
| `contact_email` | 🔒 | 🔒 | ✅ |
| `contact_phone` | 🔒 | 🔒 | ✅ |
| `m_homepage` | 🔒 | 🔒 | ✅ |
| `naver_link` | 🔒 | 🔒 | ✅ |

### E. 프리미엄 미디어 (Alpha 전용)

| Field | Free | Standard | Alpha |
|-------|------|----------|-------|
| `video_url` (4K 영상) | 🔒 | 🔒 | ✅ |
| `viral_video_url` (바이럴 숏폼) | 🔒 | 🔒 | ✅ |

---

## 7. 데이터베이스 스키마 (Supabase)

> ⛔ **DB 수정/삭제 시 반드시 CEO 컨펌.** Make.com 연동 깨짐 위험.

### 7-1. `profiles`

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | UUID (PK) | — | auth.users.id 참조 |
| `email` | TEXT | — | 유저 이메일 |
| `tier` | TEXT | `'free'` | free/standard/alpha |
| `ls_customer_id` | TEXT | NULL | LemonSqueezy 고객 ID |
| `ls_subscription_id` | TEXT | NULL | LemonSqueezy 구독 ID |
| `tier_updated_at` | TIMESTAMPTZ | NULL | Tier 변경 시점 |
| `created_at` | TIMESTAMPTZ | `NOW()` | 생성일 |

### 7-2. `weeks`

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `week_id` | TEXT (PK) | — | '2026-W10' |
| `week_label` | TEXT | — | 표시용 라벨 |
| `start_date` | DATE | — | 월요일 |
| `end_date` | DATE | — | 금요일 |
| `published_at` | TIMESTAMPTZ | NULL | 발행 시점 |
| `product_count` | INTEGER | `0` | 상품 수 |
| `summary` | TEXT | NULL | 하이라이트 |
| `status` | TEXT | `'draft'` | draft/published/archived |

### 7-3. `scout_final_reports`

> ⛔ Make.com 직접 연결 테이블. 컬럼 수정/삭제 → CEO 컨펌 필수.

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | UUID (PK) | `gen_random_uuid()` | 고유 ID |
| `week_id` | TEXT (FK) | — | weeks.week_id 참조 |
| `product_name` | TEXT | — | 한국어 상품명 |
| `translated_name` | TEXT | — | 영어 상품명 |
| `image_url` | TEXT | — | 메인 이미지 |
| `ai_image_url` | TEXT | NULL | AI 이미지 |
| `summary` | TEXT | NULL | 요약 |
| `consumer_insight` | TEXT | NULL | 상세 인사이트 |
| `category` | TEXT | — | 카테고리 |
| `viability_reason` | TEXT | — | 트렌드 이유 |
| `market_viability` | INTEGER | — | 점수 0-100 |
| `competition_level` | TEXT | — | Low/Medium/High |
| `profit_multiplier` | NUMERIC | — | 수익률 |
| `search_volume` | TEXT | — | 검색량 |
| `mom_growth` | TEXT | — | 성장률 |
| `gap_status` | TEXT | — | Blue Ocean/Emerging/Saturated |
| `global_price` | JSONB | NULL | 국가별 가격 |
| `seo_keywords` | TEXT[] | NULL | 키워드 배열 |
| `export_status` | TEXT | — | Green/Yellow/Red |
| `hs_code` | TEXT | NULL | 관세 코드 |
| `sourcing_tip` | TEXT | NULL | 소싱팁 |
| `manufacturer_check` | TEXT | NULL | MOQ/리드타임 |
| `m_name` | TEXT | NULL | 제조사명 |
| `contact_email` | TEXT | NULL | 이메일 |
| `contact_phone` | TEXT | NULL | 전화번호 |
| `m_homepage` | TEXT | NULL | 제조사 웹사이트 |
| `naver_link` | TEXT | NULL | 네이버 링크 |
| `video_url` | TEXT | NULL | 4K 영상 |
| `viral_video_url` | TEXT | NULL | **바이럴 숏폼 링크** ← v1.2 |
| `published_at` | TIMESTAMPTZ | NULL | **발행일 (핵심)** |
| `free_list_at` | TIMESTAMPTZ | — | **자동: published_at + 14일** |
| `is_premium` | BOOLEAN | `TRUE` | **TRUE=Paid전용, FALSE=Free공개** |
| `is_teaser` | BOOLEAN | `FALSE` | **TRUE=미끼, 매주 1개만** |
| `status` | TEXT | `'draft'` | draft/published/archived |
| `created_at` | TIMESTAMPTZ | `NOW()` | 생성 시점 |

### 7-4. 트리거

```sql
-- 유저 가입 시 profile 자동 생성
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- published_at 변경 시 free_list_at 자동 계산
CREATE TRIGGER trigger_set_free_list_at
  BEFORE INSERT OR UPDATE OF published_at
  ON scout_final_reports
  FOR EACH ROW EXECUTE FUNCTION set_free_list_at();
```

### 7-5. RLS

```sql
-- 리포트: Paid=즉시전체, Free=14일후+비프리미엄만, Teaser=항상
CREATE POLICY "report_access" ON scout_final_reports FOR SELECT
USING (
  status = 'published' AND (
    (SELECT tier FROM profiles WHERE id = auth.uid()) IN ('alpha', 'standard')
    OR (free_list_at IS NOT NULL AND free_list_at <= NOW() AND is_premium = FALSE)
    OR is_teaser = TRUE
  )
);
```

---

## 8. 페이지 구조

| 경로 | 목적 | 상태 |
|------|------|------|
| `/` | 랜딩 | ✅ |
| `/pricing` | 3-tier 비교 + 결제 | ❌ TODO |
| `/weekly` | 주차별 허브 | ✅ |
| `/weekly/[weekId]` | 상품 리스트 | ✅ |
| `/weekly/[weekId]/[id]` | 상세 (Tier 분기) | ✅ |
| `/login`, `/signup` | 인증 | ✅ |
| `/account` | 구독 관리 | ⚠️ 부분 |
| `/api/webhooks/lemonsqueezy` | Webhook | ❌ TODO |

---

## 9. 상세 페이지 섹션 배치

| # | 섹션 | Free | Std | Alpha | 잠금 CTA |
|---|------|------|-----|-------|----------|
| 1 | Product Identity | ✅ | ✅ | ✅ | — |
| 2 | Market Basic | ✅ | ✅ | ✅ | — |
| 3 | Market Premium | 🔒 | ✅ | ✅ | Standard $9 |
| 4 | Consumer & SEO | 🔒 | ✅ | ✅ | Standard $9 |
| 5 | Sourcing Intel | 🔒 | 🔒 | ✅ | Alpha $29 |
| 6 | Media (4K+바이럴) | 🔒 | 🔒 | ✅ | Alpha $29 |
| 7 | Navigation | ✅ | ✅ | ✅ | 동적 |

### Paywall 문구

| 섹션 | 메시지 | CTA |
|------|--------|-----|
| Market Data | "Unlock profit margins, search trends, and global pricing intel." | Start Standard — $9/mo → |
| Consumer/SEO | "See exactly who's buying and which keywords drive sales." | Start Standard — $9/mo → |
| Sourcing | "You know it sells. Now get the supplier." | Upgrade to Alpha — $29/mo → |
| Media | "Watch the product video and see what went viral in Korea." | Upgrade to Alpha — $29/mo → |

---

## 10. Weekly 허브 동작

```
🔥 Week 10 — Paid: 전체 10개 / Free: 🔒 "Available Mar 9"
✅ Week 9  — 14일+ 경과 / Free: ~5개 / Paid: 전체 10개
✅ Week 8  — 동일
```

---

## 11. 미끼 리포트 (Teaser)

매주 **정확히 1개** `is_teaser = TRUE`. Free에게도 Alpha 수준 전체 공개.
뱃지: "🆓 FREE THIS WEEK". is_teaser와 is_premium은 독립적.

---

## 12. Pricing 비교표

| Feature | Free $0 | Standard $9 | Alpha $29 |
|---------|---------|-------------|-----------|
| 접근 시점 | 14일 딜레이 | 즉시 | 즉시 |
| 주간 상품 수 | 절반 (~5) | 전체 (~10) | 전체 (~10) |
| 시장성 점수 | ✅ | ✅ | ✅ |
| 경쟁 강도 | ✅ | ✅ | ✅ |
| 블루오션 | ✅ | ✅ | ✅ |
| 수익률 | ❌ | ✅ | ✅ |
| 검색량 | ❌ | ✅ | ✅ |
| 성장률 | ❌ | ✅ | ✅ |
| 글로벌 가격 | ❌ | ✅ | ✅ |
| SEO 키워드 | ❌ | ✅ | ✅ |
| 소비자 인사이트 | ❌ | ✅ | ✅ |
| AI 이미지 | ❌ | ✅ | ✅ |
| HS Code | ❌ | ❌ | ✅ |
| 소싱팁 | ❌ | ❌ | ✅ |
| MOQ/리드타임 | ❌ | ❌ | ✅ |
| 소싱처 연락처 | ❌ | ❌ | ✅ |
| 제조사 웹사이트 | ❌ | ❌ | ✅ |
| 마켓플레이스 링크 | ❌ | ❌ | ✅ |
| 4K 영상 | ❌ | ❌ | ✅ |
| **바이럴 숏폼 영상** | ❌ | ❌ | ✅ |

Alpha에 "MOST POPULAR" 뱃지.

---

## 13. Next.js 구현 가이드

### Tier 조건부 렌더링

```tsx
const tier = profile?.tier || 'free';
const isTeaser = report.is_teaser;

// Section 1-2: 모든 Tier
// Section 3-4: tier !== 'free' || isTeaser
// Section 5-6: tier === 'alpha' || isTeaser
```

### LemonSqueezy Webhook

```
POST /api/webhooks/lemonsqueezy
- 서명 검증 (x-signature)
- subscription_created/updated → tier 업데이트
- subscription_cancelled/expired → tier = 'free'
- service_role key 사용 (RLS 우회)
```

---

## 14. 개발 로드맵 (8-Step)

| Step | 내용 | 예상 | 상태 |
|------|------|------|------|
| 1 | `/pricing` 페이지 뼈대 | 1일 | 📋 TODO |
| 2 | LemonSqueezy 연동 (계정+상품+Checkout+Webhook+/account) | 2~3일 | 📋 TODO |
| 3 | 시드 데이터 + E2E 테스트 | 1일 | 📋 TODO |
| 4 | 전체 UX 디테일 (폰트/레이아웃/간격/섹션배치/모바일) | 2~3일 | 📋 TODO |
| 5 | 최종 디자인 + QA 검수 (통일성/CTA동선/크로스브라우저/SEO) | 1~2일 | 📋 TODO |
| 6 | Make.com 자동화 완성 (파이프라인/중복체크/Claude패키징/필드매핑) | 2~3일 | 📋 TODO |
| 7 | 데이터 누적 + 실전 테스트 (2~3주치 사전 적재) | 1~2주 | 📋 TODO |
| 8 | 최종 QA + 글로벌 런칭 🚀 | 1~2일 | 📋 TODO |

**완료:** ✅ Auth, ✅ DB 스키마/트리거/RLS, ✅ /weekly + 상품리스트 + 상세(Tier분기)

---

## 15. 주간 운영 체크리스트

```
□ 상품 ~10개 분석
□ scout_final_reports INSERT (published_at 설정)
□ ~5개에 is_premium = FALSE
□ is_teaser = TRUE 정확히 1개
□ weeks 레코드 추가 (product_count, summary)
□ status = 'published'
□ 미끼 리포트 SNS/뉴스레터 배포
```

---

## 16. 놓치면 안 되는 주의사항 모음

### ⛔ DB 관련
- scout_final_reports 수정/삭제 → **CEO 컨펌 필수** (Make.com 보호)
- 추가(ADD)는 자유
- seo_keywords: DB=TEXT[], TS타입도 string[]|null로 맞출 것

### ⛔ Make.com
- INSERT 시 필수 5개: week_id, published_at, is_premium, is_teaser, status
- published_at 누락 → free_list_at NULL → Free에게 영원히 안 보임
- status 누락 → 기본 'draft' → 아무에게도 안 보임
- week_id 미존재 → FK 에러로 실패

### ⛔ LemonSqueezy
- Webhook 서명 검증 필수 (가짜 요청 방지)
- service_role key 사용 (anon은 RLS에 걸림)
- 구독 취소/만료 이벤트 반드시 처리

### ⛔ 일반
- 모든 잠금 CTA → /pricing (직접 결제 아님)
- is_teaser 매주 정확히 1개 (2개↑이면 유료 가치 희석)
- viral_video_url은 v1.2에서 competitor_analysis_pdf 대체

---

## Appendix: 결정 히스토리

| 결정 | 선택 | 이유 |
|------|------|------|
| 전환 전략 | 시간+수량+깊이 3축 | FOMO 극대화 |
| Free 시간차 | 14일 | 최적 인내 한계점 |
| Std↔Alpha | 깊이차(소싱잠금) | 시간차는 Std 만족도 훼손 |
| Free 상품 수 | 절반(is_premium) | Alpha 체감 가치 |
| 개발 도구 | Cursor 단일 | 실행 스타일 적합 |
| 결제 | LemonSqueezy | MoR 세금 자동 |
| 미디어 | viral_video_url | 셀러에게 더 가치 |
| DB 규칙 | 수정/삭제 CEO 컨펌 | Make.com 보호 |

---

> **v1.2 — 2026년 2월 27일 확정**