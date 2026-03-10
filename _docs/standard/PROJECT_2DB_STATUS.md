# KoreaScout — DB 현황 (PROJECT_2DB_STATUS) v3.0

> 전수조사 기준: supabase/migrations/*.sql, types/database.ts, lib/auth-server.ts 직접 열람. 모든 항목에 근거 파일·줄번호 명시.

---

## 1. 마이그레이션 파일 목록

- **supabase/migrations/001_phase2_schema.sql** — 프로필·주차·보고서·트리거·RLS
- **supabase/migrations/002_product_identity_pricing.sql** — 가격·USD·트리거·백필

---

## 2. 테이블 스키마 (001_phase2_schema.sql 기준)

### 2.1 profiles (10-18행)

| 컬럼 | 타입 | 제약/기본값 |
|------|------|-------------|
| id | UUID | PRIMARY KEY, REFERENCES auth.users(id) ON DELETE CASCADE |
| email | TEXT | NOT NULL |
| tier | TEXT | NOT NULL DEFAULT 'free', CHECK (tier IN ('free','standard','alpha')) |
| ls_customer_id | TEXT | — |
| ls_subscription_id | TEXT | — |
| tier_updated_at | TIMESTAMPTZ | — |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() |

- **001에 없는 컬럼:** subscription_start_at, subscription_reset_at (04_ACCESS_CONTROL_LOGIC.md 및 lib/auth-server.ts에서 사용/언급).

### 2.2 weeks (26-34행)

| 컬럼 | 타입 | 제약/기본값 |
|------|------|-------------|
| week_id | TEXT | PRIMARY KEY |
| week_label | TEXT | NOT NULL |
| start_date | DATE | NOT NULL |
| end_date | DATE | NOT NULL |
| published_at | TIMESTAMPTZ | — |
| product_count | INTEGER | NOT NULL DEFAULT 0 |
| summary | TEXT | — |
| status | TEXT | NOT NULL DEFAULT 'draft', CHECK (status IN ('draft','published','archived')) |

### 2.3 scout_final_reports (41-83행)

001에 정의된 컬럼만 나열. (002 및 types 확장은 아래 섹션 참고.)

| 컬럼 | 타입 | 제약/기본값 |
|------|------|-------------|
| id | UUID | PRIMARY KEY DEFAULT gen_random_uuid() |
| week_id | TEXT | NOT NULL REFERENCES weeks(week_id) ON DELETE CASCADE |
| product_name | translated_name | image_url | ai_image_url | summary | consumer_insight | category | viability_reason | TEXT (필수/선택 001 참조) |
| market_viability | INTEGER | NOT NULL |
| competition_level | profit_multiplier | search_volume | mom_growth | gap_status | TEXT (또는 NUMERIC) | NOT NULL 등 |
| global_price | JSONB | — |
| seo_keywords | TEXT[] | — |
| export_status | hs_code | sourcing_tip | manufacturer_check | TEXT | NOT NULL 또는 nullable |
| m_name | contact_email | contact_phone | m_homepage | naver_link | TEXT | — |
| video_url | competitor_analysis_pdf | TEXT | — |
| published_at | free_list_at | TIMESTAMPTZ | — |
| is_premium | is_teaser | BOOLEAN | NOT NULL DEFAULT TRUE/FALSE |
| status | TEXT | NOT NULL DEFAULT 'draft', CHECK (status IN ('draft','published','archived')) |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() |

- **001에 없는 컬럼:** kr_price. 002에서 trigger와 backfill이 `kr_price`를 참조(002 23-25, 44, 50-52행). 즉 002는 kr_price가 이미 존재한다고 가정함. 별도 마이그레이션으로 kr_price 추가되었거나, 001 이전에 수동 추가된 것으로 추정되며, 001·002만으로는 스키마 불완전.

### 2.4 user_favorites

- **001·002 어디에도 CREATE TABLE 없음.**  
- **사용처:** types/database.ts 161-165행 UserFavoritesRow, app/actions/favorites.ts (user_favorites insert/delete), app/account/page.tsx (select), app/weekly/[weekId]/page.tsx·[id]/page.tsx (select).  
- **결론:** 앱은 user_favorites 테이블을 사용하나, 현재 열람한 마이그레이션에는 정의가 없음. 별도 마이그레이션 또는 수동 생성 필요.

---

## 3. 002_product_identity_pricing.sql 반영 컬럼·객체

- **추가 컬럼 (7-14행):** kr_price_usd, estimated_cost_usd (NUMERIC); verified_cost_usd, verified_cost_note, moq, lead_time (TEXT).  
- **트리거 (16-45행):** calculate_price_usd() — kr_price 변경 시 kr_price_usd, estimated_cost_usd 계산 (환율 1430). trigger_calculate_price_usd ON scout_final_reports BEFORE INSERT OR UPDATE OF kr_price.  
- **백필 (47-52행):** kr_price가 숫자 문자열인 기존 행에 대해 kr_price_usd, estimated_cost_usd 업데이트.

---

## 4. 트리거 함수 원문 (001)

### 4.1 handle_new_user (95-106행)

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, tier)
  VALUES (NEW.id, NEW.email, 'free');
  RETURN NEW;
END; $$;
```

- 트리거: on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); (108-111행)

### 4.2 set_free_list_at (117-130행)

```sql
CREATE OR REPLACE FUNCTION public.set_free_list_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.published_at IS NOT NULL THEN
    NEW.free_list_at := NEW.published_at + INTERVAL '14 days';
  ELSE
    NEW.free_list_at := NULL;
  END IF;
  RETURN NEW;
END; $$;
```

- 트리거: trigger_set_free_list_at BEFORE INSERT OR UPDATE OF published_at ON scout_final_reports (132-136행)

---

## 5. RLS 정책 (001 141-174행)

- **profiles:** RLS 활성화. users_read_own_profile (SELECT, auth.uid()=id), users_update_own_profile (UPDATE, auth.uid()=id).  
- **weeks:** RLS 활성화. weeks_public_read (SELECT, status='published').  
- **scout_final_reports:** RLS 활성화. report_access (SELECT):  
  - status = 'published' AND (  
  - (SELECT tier FROM profiles WHERE id = auth.uid()) IN ('alpha','standard')  
  - OR (free_list_at IS NOT NULL AND free_list_at <= NOW() AND is_premium = FALSE)  
  - OR is_teaser = TRUE  
  - ).

---

## 6. 인덱스 (001 86-88행)

- idx_scout_final_reports_week_id ON scout_final_reports(week_id)  
- idx_scout_final_reports_status ON scout_final_reports(status)  
- idx_scout_final_reports_free_list_at ON scout_final_reports(free_list_at) WHERE status = 'published'

---

## 7. TypeScript 타입 불일치 및 주의사항

| 항목 | 코드/타입 | DB(마이그레이션) | 근거 |
|------|-----------|------------------|------|
| profiles.subscription_start_at | lib/auth-server.ts 26행 select "tier, subscription_start_at" | 001 profiles 테이블에 해당 컬럼 없음 | getAuthTier()가 반환하는 subscriptionStartAt 사용처: app/weekly/page.tsx 등. DB에 컬럼 없으면 쿼리 오류 또는 null. |
| types/database.ts ProfilesRow | subscription_start_at 미정의 | 동일 | 타입에도 없음. |
| user_favorites 테이블 | types 161-165, app/actions/favorites.ts, account, weekly 페이지 | 001·002에 CREATE TABLE 없음 | 앱 동작하려면 테이블·RLS가 실제 DB에 존재해야 함. |
| scout_final_reports.kr_price | 002 trigger·backfill에서 사용 | 001 스키마에 kr_price 없음 | 002는 kr_price 존재 가정. 001만 적용 시 트리거/백필 실패 가능. |
| scout_final_reports.status | types ReportStatus: 'draft'\|'published'\|'archived'\|'hidden' (12행) | 001 CHECK: 'draft','published','archived' (81행) | 'hidden' 값은 001 제약과 충돌. app/admin/[id]/page.tsx 316-317행에서 status hidden 선택 가능. |
| ScoutFinalReportsRow 확장 필드 | types 79-158행 다수 optional 필드 (composition_info, spec_summary, kr_price, global_prices, viral_hashtags 등) | 001에는 일부 없음, 002는 kr_price_usd 등 일부만 추가 | 타입은 v1.3 확장 반영. 실제 DB는 별도 마이그레이션으로 추가되었을 가능성 있음. |

---

## 8. 요약

- **정의된 테이블:** profiles, weeks, scout_final_reports (001).  
- **정의된 트리거:** handle_new_user, set_free_list_at (001), calculate_price_usd (002).  
- **RLS:** profiles(본인), weeks(published), scout_final_reports(tier+free_list_at+is_teaser).  
- **타입/스키마 불일치:**  
  1) profiles.subscription_start_at 없음 (코드·스펙에서는 사용).  
  2) user_favorites 테이블 마이그레이션 없음.  
  3) scout_final_reports.kr_price 001에 없고 002에서 참조.  
  4) status 'hidden' 타입에는 있으나 001 CHECK에는 없음.

---

*문서 끝. 모든 스키마·정책·트리거 서술은 001·002 및 types/database.ts, lib/auth-server.ts 행 번호 기준.*
