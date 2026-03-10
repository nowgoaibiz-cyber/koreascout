# RLS 보안 강화 가이드 (Reconnaissance Only)

> 실서버 DB를 수정하지 말고, 정책 변경 시 참고용으로만 사용하세요.  
> 적용 전 Supabase 대시보드에서 현재 정책을 확인한 뒤, 테스트 환경에서 먼저 검증하세요.

---

## 1. 위험 정책 식별 (실서버에서 조회)

Supabase 실서버에서 **"Enable all access for all users"** 같은 전면 개방 정책이 걸린 테이블을 찾으려면 SQL Editor에서 아래 쿼리를 실행하세요.

```sql
-- 실서버 SQL Editor에서만 실행. 결과를 JSON으로 내보낸 뒤 로컬에서 비교용으로 보관 가능.
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND policyname ILIKE '%enable all%'
   OR policyname ILIKE '%all access%'
   OR (qual IS NULL AND with_check IS NULL AND cmd = 'ALL');
```

- `policyname`이 "Enable all access for all users"이거나, `cmd = 'ALL'`이면서 `qual`/`with_check`가 비어 있으면 **anon/authenticated 구분 없이 전체 허용**일 가능성이 큽니다.

---

## 2. 테이블별 강화 방향 (쿼리는 주석으로만 제공)

아래는 **Authenticated 유저 전용** 또는 **Owner 전용**으로 정책을 좁히는 **예시 방향**입니다.  
실제 적용 시에는 기존 정책 이름과 충돌하지 않도록 이름을 바꾸거나, 기존 정책을 DROP한 뒤 새로 만드세요.

### 2.1 `public.profiles`

- **목표:** 본인 행만 SELECT/UPDATE. INSERT는 트리거(handle_new_user)로만.
- **강화 예시 (주석):**
  ```sql
  -- DROP POLICY IF EXISTS "Enable all access for all users" ON public.profiles;
  -- CREATE POLICY "users_read_own_profile"
  --   ON public.profiles FOR SELECT USING (auth.uid() = id);
  -- CREATE POLICY "users_update_own_profile"
  --   ON public.profiles FOR UPDATE USING (auth.uid() = id);
  -- (INSERT는 service_role / handle_new_user 트리거로만 수행)
  ```

### 2.2 `public.weeks`

- **목표:** published 주차만 모든 사용자(anon 포함) SELECT.
- **강화 예시 (주석):**
  ```sql
  -- DROP POLICY IF EXISTS "Enable all access for all users" ON public.weeks;
  -- CREATE POLICY "weeks_public_read"
  --   ON public.weeks FOR SELECT USING (status = 'published');
  ```

### 2.3 `public.scout_final_reports`

- **목표:** 001에 정의된 report_access와 동일 — published + (유료 전용 또는 free_list_at 경과 또는 is_teaser).
- **강화 예시 (주석):**
  ```sql
  -- DROP POLICY IF EXISTS "Enable all access for all users" ON public.scout_final_reports;
  -- CREATE POLICY "report_access"
  --   ON public.scout_final_reports FOR SELECT
  --   USING (
  --     status = 'published'
  --     AND (
  --       (SELECT tier FROM public.profiles WHERE id = auth.uid()) IN ('alpha', 'standard')
  --       OR (free_list_at IS NOT NULL AND free_list_at <= NOW() AND is_premium = FALSE)
  --       OR is_teaser = TRUE
  --     )
  --   );
  ```
- **쓰기(INSERT/UPDATE/DELETE):** 애플리케이션에서는 service_role(Admin API)로만 수행하므로, anon/authenticated용 쓰기 정책은 두지 않는 것이 안전합니다.

### 2.4 `public.user_favorites`

- **목표:** Authenticated 유저가 본인(user_id = auth.uid()) 행만 SELECT / INSERT / DELETE.
- **강화 예시 (주석):**
  ```sql
  -- DROP POLICY IF EXISTS "Enable all access for all users" ON public.user_favorites;
  -- CREATE POLICY "users_own_favorites_select"
  --   ON public.user_favorites FOR SELECT USING (auth.uid() = user_id);
  -- CREATE POLICY "users_own_favorites_insert"
  --   ON public.user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
  -- CREATE POLICY "users_own_favorites_delete"
  --   ON public.user_favorites FOR DELETE USING (auth.uid() = user_id);
  ```

---

## 3. 적용 순서 제안

1. 위 1번 쿼리로 실서버에서 위험 정책 목록 확인.
2. 테스트(또는 스테이징) DB에서 위 2.x 주석 해제 후 정책 생성/교체 및 앱 동작 검증.
3. 실서버 적용 시 유지보수 창에서 DROP → CREATE 순으로 적용하고, 즉시 로그인/주차/보고서/즐겨찾기 플로우 확인.

---

*이 문서는 로컬 마이그레이션 sync 및 보안 감사(Reconnaissance) 결과를 반영한 참고용 가이드입니다.*
