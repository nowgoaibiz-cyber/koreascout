# K-Product Scout — DB 현황

> **대상:** Gemini, Claude 등 AI 팀원 공유용  
> **최종 갱신:** 2026년 2월 27일  
> **참고:** 행 수·샘플 데이터는 Supabase SQL Editor에서 아래 쿼리를 실행한 뒤 채워 넣을 수 있음.

---

## 1. 테이블 목록 및 스키마

스키마: `public`. 마이그레이션 파일: `supabase/migrations/001_phase2_schema.sql`.

### 1.1 `public.profiles`

| 컬럼명 | 데이터 타입 | 기본값 | NULL | 제약/비고 |
|--------|-------------|--------|------|-----------|
| id | UUID | — | NOT NULL | PK, `auth.users(id)` ON DELETE CASCADE |
| email | TEXT | — | NOT NULL | |
| tier | TEXT | `'free'` | NOT NULL | CHECK: `'free'` \| `'standard'` \| `'alpha'` |
| ls_customer_id | TEXT | NULL | YES | LemonSqueezy 고객 ID |
| ls_subscription_id | TEXT | NULL | YES | LemonSqueezy 구독 ID |
| tier_updated_at | TIMESTAMPTZ | NULL | YES | |
| created_at | TIMESTAMPTZ | `NOW()` | NOT NULL | |

**테이블 코멘트:** User profile; tier updated by LemonSqueezy webhook.

---

### 1.2 `public.weeks`

| 컬럼명 | 데이터 타입 | 기본값 | NULL | 제약/비고 |
|--------|-------------|--------|------|-----------|
| week_id | TEXT | — | NOT NULL | PK (예: `'2026-W10'`) |
| week_label | TEXT | — | NOT NULL | 표시용 라벨 |
| start_date | DATE | — | NOT NULL | 주 시작(월) |
| end_date | DATE | — | NOT NULL | 주 종료(금) |
| published_at | TIMESTAMPTZ | NULL | YES | 발행 시점 |
| product_count | INTEGER | `0` | NOT NULL | 해당 주 상품 수 |
| summary | TEXT | NULL | YES | 주 하이라이트 요약 |
| status | TEXT | `'draft'` | NOT NULL | CHECK: `'draft'` \| `'published'` \| `'archived'` |

**테이블 코멘트:** Weekly report batches for /weekly hub.

---

### 1.3 `public.scout_final_reports`

| 컬럼명 | 데이터 타입 | 기본값 | NULL | 제약/비고 |
|--------|-------------|--------|------|-----------|
| id | UUID | `gen_random_uuid()` | NOT NULL | PK |
| week_id | TEXT | — | NOT NULL | FK → `weeks(week_id)` ON DELETE CASCADE |
| product_name | TEXT | — | NOT NULL | 한국어 상품명 |
| translated_name | TEXT | — | NOT NULL | 영어 상품명 |
| image_url | TEXT | — | NOT NULL | 메인 이미지 URL |
| ai_image_url | TEXT | NULL | YES | AI 이미지 URL |
| summary | TEXT | NULL | YES | 짧은 요약 |
| consumer_insight | TEXT | NULL | YES | 상세 인사이트 |
| category | TEXT | — | NOT NULL | 카테고리 |
| viability_reason | TEXT | — | NOT NULL | 트렌드 이유 한 줄 |
| market_viability | INTEGER | — | NOT NULL | 0–100 |
| competition_level | TEXT | — | NOT NULL | Low/Medium/High |
| profit_multiplier | NUMERIC | — | NOT NULL | |
| search_volume | TEXT | — | NOT NULL | |
| mom_growth | TEXT | — | NOT NULL | |
| gap_status | TEXT | — | NOT NULL | Blue Ocean / Emerging / Saturated |
| global_price | JSONB | NULL | YES | 국가별 가격 |
| seo_keywords | TEXT[] | NULL | YES | 키워드 배열 |
| export_status | TEXT | — | NOT NULL | Green/Yellow/Red |
| hs_code | TEXT | NULL | YES | |
| sourcing_tip | TEXT | NULL | YES | **5-step strategy:** multi-line formatted (Market, Price, B2B, Regulation, Logistics) |
| manufacturer_check | TEXT | NULL | YES | MOQ/리드타임 |
| m_name | TEXT | NULL | YES | 제조사명 (Alpha) |
| contact_email | TEXT | NULL | YES | |
| contact_phone | TEXT | NULL | YES | |
| m_homepage | TEXT | NULL | YES | |
| naver_link | TEXT | NULL | YES | |
| video_url | TEXT | NULL | YES | 4K 영상 (Alpha) |
| competitor_analysis_pdf | TEXT | NULL | YES | (Alpha) |
| **kr_evidence** | **TEXT** | **NULL** | **YES** | 한국 시장 증거 텍스트 |
| **global_evidence** | **TEXT** | **NULL** | **YES** | 글로벌 시장 증거 텍스트 |
| **growth_evidence** | **TEXT** | **NULL** | **YES** | 성장 지표 증거 텍스트 |
| **kr_source_used** | **TEXT** | **NULL** | **YES** | 한국 출처 설명 |
| **status_reason** | **TEXT** | **NULL** | **YES** | 규제/상태 사유 |
| **new_content_volume** | **TEXT** | **NULL** | **YES** | 신규 콘텐츠 볼륨 설명 |
| **rising_keywords** | **TEXT** | **NULL** | **YES** | 콤마 구분 문자열 (NO LONGER ARRAY) |
| **viral_hashtags** | **TEXT** | **NULL** | **YES** | 콤마 구분 문자열 (NO LONGER ARRAY) |
| **actual_weight_g** | **INTEGER** | **NULL** | **YES** | 실제 무게( g) |
| **volumetric_weight_g** | **INTEGER** | **NULL** | **YES** | 부피 무게( g) |
| published_at | TIMESTAMPTZ | NULL | YES | 발행일(14일 계산 기준) |
| free_list_at | TIMESTAMPTZ | (트리거) | YES | `published_at + 14일` 자동 설정 |
| is_premium | BOOLEAN | `TRUE` | NOT NULL | TRUE = 유료 전용 |
| is_teaser | BOOLEAN | `FALSE` | NOT NULL | TRUE = 미끼 리포트, 전체 공개 |
| status | TEXT | `'draft'` | NOT NULL | draft \| published \| archived |
| created_at | TIMESTAMPTZ | `NOW()` | NOT NULL | |

**테이블 코멘트:** Product reports; access controlled by RLS and tier. `rising_keywords` / `viral_hashtags` are stored as comma-separated TEXT; frontend must split before rendering pills/tags.

---

## 2. 행 수 (Row Counts)

Supabase 대시보드 → **SQL Editor**에서 아래 쿼리를 실행한 뒤, 결과를 아래 표에 채우면 됨.

```sql
SELECT schemaname, relname AS table_name, n_live_tup AS row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY relname;
```

| 테이블명 | 행 수 (실행 후 기입) |
|----------|----------------------|
| profiles | |
| scout_final_reports | |
| weeks | |

※ 시드 데이터를 넣기 전에는 `weeks`, `scout_final_reports`는 0이고, `profiles`는 가입한 유저 수만큼 존재할 수 있음.

---

## 3. RLS 정책 (Row Level Security)

모든 `public` 테이블에 RLS 활성화됨.

| 테이블 | 정책명 | 명령 | 역할 | 조건 (USING) |
|--------|--------|------|------|----------------|
| profiles | users_read_own_profile | SELECT | — | `auth.uid() = id` |
| profiles | users_update_own_profile | UPDATE | — | `auth.uid() = id` |
| weeks | weeks_public_read | SELECT | — | `status = 'published'` |
| scout_final_reports | report_access | SELECT | — | `status = 'published'` 이고, (Paid: `profiles.tier` IN ('alpha','standard') **또는** Free: `free_list_at IS NOT NULL AND free_list_at <= NOW() AND is_premium = FALSE` **또는** `is_teaser = TRUE`) |

확인용 SQL:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## 4. 트리거 및 함수

### 4.1 트리거

| 트리거명 | 대상 테이블 | 이벤트 | 동작 |
|----------|-------------|--------|------|
| on_auth_user_created | auth.users | AFTER INSERT | `public.handle_new_user()` 호출 → `profiles`에 id, email, tier='free' 삽입 |
| trigger_set_free_list_at | public.scout_final_reports | BEFORE INSERT OR UPDATE OF published_at | `set_free_list_at()` 호출 → `free_list_at := published_at + 14일` (published_at이 NULL이면 free_list_at NULL) |

확인용 SQL:

```sql
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
   OR event_object_schema = 'auth';
```

### 4.2 함수 (public 스키마)

| 함수명 | 타입 | 설명 |
|--------|------|------|
| handle_new_user | TRIGGER | 가입 시 `profiles` 행 생성 |
| set_free_list_at | TRIGGER | `scout_final_reports.published_at` 변경 시 `free_list_at` 자동 계산 |

확인용 SQL:

```sql
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

---

## 5. 샘플 데이터 (테이블별 2~3행)

데이터가 있을 때 확인용 쿼리. 시드 삽입 전에는 결과가 비어 있음.

```sql
-- profiles (최대 3행)
SELECT * FROM public.profiles ORDER BY created_at DESC LIMIT 3;

-- weeks (최대 3행)
SELECT * FROM public.weeks ORDER BY start_date DESC LIMIT 3;

-- scout_final_reports (최대 3행)
SELECT id, week_id, product_name, translated_name, category, status, is_premium, is_teaser
FROM public.scout_final_reports
ORDER BY created_at DESC LIMIT 3;
```

| 테이블 | 샘플 (실행 후 요약 기입) |
|--------|---------------------------|
| profiles | 예: id, email, tier 정도만 기록 |
| weeks | 예: week_id, week_label, status |
| scout_final_reports | 예: id, product_name, week_id, status |

※ Phase 2 이후 시드 데이터는 01_CORE_SPEC.md §14, DB_STATUS “Next Steps”에 따라 `weeks` 1행 + `scout_final_reports` 5~10행 정도 넣어서 테스트하는 것을 권장.

---

## 6. 인덱스

| 인덱스명 | 테이블 | 컬럼 | 부분 인덱스 조건 |
|----------|--------|------|------------------|
| (PK) profiles_pkey | profiles | id | — |
| (PK) weeks_pkey | weeks | week_id | — |
| (PK) scout_final_reports_pkey | scout_final_reports | id | — |
| idx_scout_final_reports_week_id | scout_final_reports | week_id | — |
| idx_scout_final_reports_status | scout_final_reports | status | — |
| idx_scout_final_reports_free_list_at | scout_final_reports | free_list_at | `WHERE status = 'published'` |

확인용 SQL:

```sql
SELECT indexname, tablename, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

---

## 7. 01_CORE_SPEC.md Section 7와의 비교

- **테이블 구조:** `profiles`, `weeks`, `scout_final_reports` 구성·컬럼·타입·기본값이 설계서 §7과 일치함.
- **트리거:**  
  - `handle_new_user`: 설계서와 동일.  
  - `set_free_list_at`: 설계서는 `published_at` 기준만 기술, 현재 구현은 `published_at`이 NULL이면 `free_list_at`도 NULL로 두어 동작 일치.
- **RLS:**  
  - profiles: 본인 SELECT/UPDATE.  
  - weeks: `status = 'published'`만 SELECT.  
  - scout_final_reports: 설계서의 Paid/Free/Teaser 조건과 동일. 단, Free 조건을 `free_list_at IS NOT NULL AND free_list_at <= NOW()`로 명시한 것은 스펙을 더 엄격히 반영한 것임.
- **인덱스:** 설계서에 명시된 것 외에 `week_id`, `status`, `free_list_at`(partial) 인덱스가 있어 쿼리 성능에 유리함.
- **차이점:**  
  - **타입:** `types/database.ts`에서 `seo_keywords`는 `string | null`로 되어 있으나 DB는 `TEXT[]`. 배열로 다루는 부분이 있으면 타입 정의를 `string[] | null` 등으로 맞추는 것이 좋음.  
  - **쓰기 정책:** 설계서대로 Webhook/백오피스는 `service_role`로 `profiles` 등에 쓰고, RLS는 읽기/본인 업데이트만 담당함.

---

## 8. 한 번에 확인하는 SQL (팀 공유용)

아래를 Supabase SQL Editor에 붙여 넣고 실행하면, 테이블 목록·컬럼·정책·트리거·함수·행 수를 한 번에 조회할 수 있음.

```sql
-- 테이블 목록
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- 컬럼 상세
SELECT table_name, column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- RLS 정책
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies WHERE schemaname = 'public';

-- 트리거
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers WHERE trigger_schema = 'public';

-- 함수
SELECT routine_name, routine_type
FROM information_schema.routines WHERE routine_schema = 'public';

-- 행 수 (대략)
SELECT schemaname, relname, n_live_tup FROM pg_stat_user_tables WHERE schemaname = 'public';
```

---

이 문서는 `01_CORE_SPEC.md` §7, `PROJECT_2STATUS.md`와 함께 사용하면 DB 현재 상태와 스펙 차이를 빠르게 맞출 수 있습니다.
