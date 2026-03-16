# Supabase RLS 전수조사 보고서

**작성일:** 2025-03-16  
**범위:** `app/api/`, `lib/supabase/`  
**규칙:** READ-ONLY 감사, 코드 수정 없음.

---

## 1. 명령 실행 결과

### 1.1 `grep -rn "scout_final_reports|scout_products" --include="*.ts" --include="*.tsx" app/api/`

```
app/api/admin/reports/route.ts
  24:      .from("scout_final_reports")

app/api/admin/reports/[id]/route.ts
  23:      .from("scout_final_reports")
  65:      .from("scout_final_reports")
```

**해석:**
- `scout_final_reports` 테이블은 **admin API**에서만 사용됨 (목록 GET, 단건 GET, PATCH).
- `app/api/` 내에서는 **`scout_products` 참조 없음**.

### 1.2 `cat lib/supabase/server.ts`

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server Supabase client. Use for Server Components, Route Handlers, Server Actions.
 * RLS applies: profiles (own row), weeks (published only), scout_final_reports (tier-based).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component; middleware will refresh the session.
          }
        },
      },
    }
  );
}
```

**해석:**  
- **ANON key** 사용 → RLS 적용됨.  
- 주석대로 `scout_final_reports`는 tier 기반 RLS 적용 대상으로 문서화됨.

### 1.3 `cat lib/supabase/client.ts`

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**해석:**  
- **ANON key**만 사용 → RLS 적용됨. 클라이언트 노출용.

---

## 2. service_role / SUPABASE_SERVICE 사용 여부 (app/api/)

### 2.1 `grep -rn "service_role|SUPABASE_SERVICE" --include="*.ts" --include="*.tsx" app/api/`

```
app/api/admin/reports/route.ts
  12:  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  16:      : "Missing SUPABASE_SERVICE_ROLE_KEY in environment";
```

**해석:**
- **직접 env 참조:** `app/api/admin/reports/route.ts`에서 `SUPABASE_SERVICE_ROLE_KEY`를 읽어 존재 여부만 검사하고, 실제 쿼리는 `createServiceRoleClient()`로 수행.
- **실제 service_role 사용처:**  
  - `app/api/admin/reports/route.ts` → `createServiceRoleClient()` (GET 목록)  
  - `app/api/admin/reports/[id]/route.ts` → `createServiceRoleClient()` (GET 단건, PATCH)  
- `createServiceRoleClient()` 정의: `lib/supabase/admin.ts` → `SUPABASE_SERVICE_ROLE_KEY` 사용, RLS 우회.

---

## 3. 요약 표

| 구분 | 파일 | 테이블 | 클라이언트 | RLS |
|------|------|--------|------------|-----|
| Admin API | `app/api/admin/reports/route.ts` | `scout_final_reports` | service_role (admin) | 우회 |
| Admin API | `app/api/admin/reports/[id]/route.ts` | `scout_final_reports` | service_role (admin) | 우회 |
| Server | `lib/supabase/server.ts` | (일반) | anon | 적용 |
| Client | `lib/supabase/client.ts` | (일반) | anon | 적용 |
| Admin 유틸 | `lib/supabase/admin.ts` | — | service_role | 우회 |

---

## 4. 결론

- **`app/api/`**  
  - `scout_final_reports`만 사용. `scout_products`는 API 라우트에서 미사용.  
  - Admin reports API는 **service_role**로 `scout_final_reports` 접근, RLS 우회.  
  - Admin 접근은 `ADMIN_COOKIE_NAME` / `kps_admin_session` 쿠키로 1차 인증 후 사용.  
- **RLS**  
  - anon 기반 클라이언트(server/client)는 RLS 적용.  
  - service_role은 `lib/supabase/admin.ts`에서만 사용, Admin API로만 호출됨.

---

*이 문서는 자동 감사 결과이며, 코드 변경 없이 보고 목적으로만 생성되었습니다.*
