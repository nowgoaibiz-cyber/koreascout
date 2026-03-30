# LOGOUT BUG AUDIT

작성일: 2026-03-24  
범위: 결제 후 로그아웃 현상 전수조사 (코드 수정 없음, 리포트 저장만 수행)

---

## 1) CHECKOUT BUTTON 전체 코드

파일: `components/CheckoutButton.tsx`

```tsx
"use client";
import { createClient } from "@/lib/supabase/client";

interface CheckoutButtonProps {
  checkoutUrl: string;
  children: React.ReactNode;
  className?: string;
}

export default function CheckoutButton({ checkoutUrl, children, className }: CheckoutButtonProps) {
  const handleClick = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    const email = user?.email;
    const params = new URLSearchParams();
    if (email) params.set("checkout[email]", email);
    if (userId) params.set("checkout[custom][user_id]", userId);
    const qs = params.toString();
    const url = qs ? `${checkoutUrl}?${qs}` : checkoutUrl;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
```

확인 결과:
- `window.open(url, "_blank", "noopener,noreferrer")` 사용: **새 탭 오픈**
- 결제 완료 후 리다이렉트 로직: **컴포넌트 내부에 없음**
- 추가되는 쿼리: `checkout[email]`, `checkout[custom][user_id]`만 존재

---

## 2) LEMONSQUEEZY 결제 완료 후 리다이렉트 설정

### 2-1. `app/pricing/page.tsx` 체크아웃 URL 정의

```ts
const STANDARD_CHECKOUT_URL =
  "https://getkoreascout.lemonsqueezy.com/checkout/buy/e9701b40-aad3-446e-b00a-617d0159d501";
const ALPHA_CHECKOUT_URL =
  "https://getkoreascout.lemonsqueezy.com/checkout/buy/936321c8-fba1-4f88-bb30-8865c8006fac";
```

확인 결과:
- URL에 `?checkout[redirect_url]=...` **없음**

### 2-2. `app/page.tsx` 체크아웃 URL 정의

```ts
const STANDARD_CHECKOUT_URL =
  "https://getkoreascout.lemonsqueezy.com/checkout/buy/e9701b40-aad3-446e-b00a-617d0159d501";
const ALPHA_CHECKOUT_URL =
  "https://getkoreascout.lemonsqueezy.com/checkout/buy/936321c8-fba1-4f88-bb30-8865c8006fac";
```

확인 결과:
- URL에 `?checkout[redirect_url]=...` **없음**

### 2-3. 실제 최종 checkout URL 조립 로직 (`CheckoutButton`)

```ts
const params = new URLSearchParams();
if (email) params.set("checkout[email]", email);
if (userId) params.set("checkout[custom][user_id]", userId);
const qs = params.toString();
const url = qs ? `${checkoutUrl}?${qs}` : checkoutUrl;
```

확인 결과:
- 최종 URL에도 `checkout[redirect_url]` 추가 없음

---

## 3) AUTH 세션 관련 코드 전수조사

### 3-1. `middleware.ts` 전체 코드

파일: `middleware.ts`

```ts
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const response = pathname.startsWith("/admin")
    ? (() => {
        const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
        const cookie = request.cookies.get(cookieName);
        const isLoginPage = pathname === "/admin/login";
        if (isLoginPage || cookie?.value === "authenticated") return null;
        return NextResponse.redirect(new URL("/admin/login", request.url));
      })()
    : null;

  if (response) return response;

  const res = await updateSession(request);
  res.headers.set("x-pathname", pathname);
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### 3-2. `app/api/auth/` 폴더

확인 결과:
- `app/api/auth/` 폴더/파일: **없음**

### 3-3. `lib/supabase/` 폴더 전체 파일 목록 및 코드

파일 목록:
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/admin.ts`
- `lib/supabase/middleware.ts`

#### `lib/supabase/client.ts`

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

#### `lib/supabase/server.ts`

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

#### `lib/supabase/admin.ts`

```ts
import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service_role key.
 * Bypasses RLS. Use only in trusted server code (e.g. webhooks, cron).
 * Never expose this key to the client.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL for admin client"
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
```

#### `lib/supabase/middleware.ts`

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if expired; tokens are written via setAll to the response.
  await supabase.auth.getUser();

  return supabaseResponse;
}
```

### 3-4. Supabase auth callback 라우트 존재 여부

확인 결과:
- 존재함: `app/auth/callback/route.ts`

파일 전체 코드:

```ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/weekly";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (type === "recovery") {
    return NextResponse.redirect(`${origin}/reset-password`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
```

### 3-5. `app/auth/` 폴더 전체 코드

폴더 내 파일:
- `app/auth/callback/route.ts` (위에 전체 코드 포함)

---

## 4) WEBHOOK 처리 후 로직

파일: `app/api/webhooks/lemonsqueezy/route.ts`

```ts
import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createServiceRoleClient } from "@/lib/supabase/admin";

const LEMONSQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

/** Standard $69 — checkout URL UUID (LemonSqueezy 웹훅은 variant_id를 숫자로 보낼 수 있음) */
const STANDARD_VARIANT_UUID = "141f6710-c704-4ab3-b7c7-f30b2c587587";
/** Alpha $129 — checkout URL UUID */
const ALPHA_VARIANT_UUID = "41bb4d4b-b9d6-4a60-8e19-19287c35516d";
/** Standard/Alpha 숫자 variant_id (.env: LEMONSQUEEZY_VARIANT_ID_STANDARD / _ALPHA) — 일치 시 tier 업데이트 */
const STANDARD_VARIANT_NUMERIC = process.env.LEMONSQUEEZY_VARIANT_ID_STANDARD
  ? parseInt(process.env.LEMONSQUEEZY_VARIANT_ID_STANDARD, 10)
  : null;
const ALPHA_VARIANT_NUMERIC = process.env.LEMONSQUEEZY_VARIANT_ID_ALPHA
  ? parseInt(process.env.LEMONSQUEEZY_VARIANT_ID_ALPHA, 10)
  : null;

function verifySignature(rawBody: string, signature: string | null): boolean {
  if (!LEMONSQUEEZY_WEBHOOK_SECRET || !signature) return false;
  const hmac = crypto.createHmac("sha256", LEMONSQUEEZY_WEBHOOK_SECRET);
  hmac.update(rawBody, "utf8");
  const digest = hmac.digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(digest, "utf8"),
      Buffer.from(signature, "utf8")
    );
  } catch {
    return false;
  }
}

function variantIdToTier(variantId: string | number): "standard" | "alpha" | null {
  const num =
    typeof variantId === "number"
      ? variantId
      : typeof variantId === "string" && /^\d+$/.test(variantId)
        ? parseInt(variantId, 10)
        : NaN;
  if (!Number.isNaN(num)) {
    if (STANDARD_VARIANT_NUMERIC !== null && num === STANDARD_VARIANT_NUMERIC) return "standard";
    if (ALPHA_VARIANT_NUMERIC !== null && num === ALPHA_VARIANT_NUMERIC) return "alpha";
    return null;
  }
  const id = String(variantId).toLowerCase();
  if (id === STANDARD_VARIANT_UUID.toLowerCase()) return "standard";
  if (id === ALPHA_VARIANT_UUID.toLowerCase()) return "alpha";
  return null;
}

export async function POST(request: Request) {
  try {
    const signature = (
      request.headers.get("x-signature") ?? request.headers.get("X-Signature")
    )?.trim() ?? null;
    const rawBody = await request.text();
    if (!rawBody) {
      console.warn("[lemonsqueezy] 400: Missing body");
      return NextResponse.json(
        { error: "Missing body" },
        { status: 400 }
      );
    }
    if (!verifySignature(rawBody, signature)) {
      console.warn("[lemonsqueezy] 401: Invalid signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody) as {
      meta?: {
        event_name?: string;
        custom_data?: Record<string, unknown>;
      };
      data?: {
        id?: string;
        type?: string;
        attributes?: {
          variant_id?: number | string;
          user_email?: string;
          customer_id?: number;
          [key: string]: unknown;
        };
      };
    };

    const eventName =
      payload.meta?.event_name ??
      request.headers.get("x-event-name") ??
      "";
    const data = payload.data;
    const attrs = data?.attributes;
    const customData = payload.meta?.custom_data as Record<string, unknown> | undefined;

    // 디버깅: 수신 이벤트와 payload 구조 로그
    console.log("[lemonsqueezy] event:", eventName, "data.type:", data?.type, "data.id:", data?.id);
    console.log("[lemonsqueezy] data.attributes keys:", attrs ? Object.keys(attrs) : "none");
    if (attrs?.variant_id !== undefined) {
      console.log("[lemonsqueezy] variant_id:", attrs.variant_id, "typeof:", typeof attrs.variant_id);
    }

    if (eventName === "subscription_created" || eventName === "subscription_updated") {
      const variantId = attrs?.variant_id;
      if (variantId == null) {
        console.warn("[lemonsqueezy] 400: Missing variant_id. attrs:", JSON.stringify(attrs ?? {}));
        return NextResponse.json(
          { error: "Missing variant_id" },
          { status: 400 }
        );
      }
      const tier = variantIdToTier(variantId);
      if (!tier) {
        console.warn(
          "[lemonsqueezy] 400: Unknown variant_id. received:",
          variantId,
          "typeof:",
          typeof variantId,
          typeof variantId === "number"
            ? "→ LemonSqueezy는 웹훅에 숫자 variant_id를 보냅니다. .env에 LEMONSQUEEZY_VARIANT_ID_STANDARD, LEMONSQUEEZY_VARIANT_ID_ALPHA (숫자) 설정 후 재시도."
            : "→ Standard/Alpha UUID와 일치하는지 확인하세요."
        );
        return NextResponse.json(
          { error: "Unknown variant_id" },
          { status: 400 }
        );
      }

      let profileId: string | null = null;
      if (customData?.user_id && typeof customData.user_id === "string") {
        profileId = customData.user_id;
      }

      const supabase = createServiceRoleClient();
      const now = new Date().toISOString();

      if (profileId) {
        const { error } = await supabase
          .from("profiles")
          .update({
            tier,
            ls_subscription_id: data?.id ?? null,
            tier_updated_at: now,
          })
          .eq("id", profileId);

        if (error) {
          console.error("[lemonsqueezy] profiles update by id:", error);
          return NextResponse.json(
            { error: "Profile update failed" },
            { status: 500 }
          );
        }
      } else {
        const userEmail = attrs?.user_email ?? (payload as { data?: { attributes?: { user_email?: string } } }).data?.attributes?.user_email;
        if (typeof userEmail === "string" && userEmail) {
          const { error } = await supabase
            .from("profiles")
            .update({
              tier,
              ls_subscription_id: data?.id ?? null,
              tier_updated_at: now,
            })
            .eq("email", userEmail);

          if (error) {
            console.error("[lemonsqueezy] profiles update by email:", error);
            return NextResponse.json(
              { error: "Profile update failed" },
              { status: 500 }
            );
          }
        }
      }
    } else if (
      eventName === "subscription_cancelled" ||
      eventName === "subscription_expired"
    ) {
      const subscriptionId = data?.id;
      if (!subscriptionId) {
        console.warn("[lemonsqueezy] 400: Missing subscription id. data:", JSON.stringify(data ?? {}));
        return NextResponse.json(
          { error: "Missing subscription id" },
          { status: 400 }
        );
      }
      const supabase = createServiceRoleClient();
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("profiles")
        .update({
          tier: "free",
          tier_updated_at: now,
          ls_subscription_id: null,
        })
        .eq("ls_subscription_id", subscriptionId);

      if (error) {
        console.error("[lemonsqueezy] profiles downgrade:", error);
        return NextResponse.json(
          { error: "Profile update failed" },
          { status: 500 }
        );
      }
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("[lemonsqueezy] webhook error:", e);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
```

확인 결과:
- tier 업데이트 후 세션 갱신 코드: **없음** (쿠키/세션 재발급/리프레시 트리거 없음)
- 세션 무효화(signOut/쿠키 삭제) 코드: **없음**
- 웹훅은 `profiles.tier` 업데이트에만 집중

---

## 5) SUPABASE SESSION 관련

### 5-1. 클라이언트 사이드에서 세션 체크하는 컴포넌트 전체 목록

검색 기준: `supabase.auth.getSession()` / `supabase.auth.getUser()` (클라이언트 컨텍스트)

- `components/CheckoutButton.tsx`
  - `supabase.auth.getUser()` 사용
- `components/HeroCTA.tsx`
  - `supabase.auth.getSession()` 사용
- `app/account/password/page.tsx` (클라이언트 페이지)
  - `supabase.auth.getUser()` 사용

참고(서버 측 getUser):
- `app/account/page.tsx` (서버 컴포넌트)
- `components/layout/Header.tsx` (서버 컴포넌트)

### 5-2. `useEffect`로 auth 상태 체크하는 곳 전체 목록

실질 auth 체크가 들어간 `useEffect`:
- `app/account/password/page.tsx`
  - 마운트 시 `supabase.auth.getUser()` 호출 후 미로그인 시 `/login` 리다이렉트

코드:

```tsx
useEffect(() => {
  const supabase = createClient();
  supabase.auth.getUser().then(({ data: { user } }) => {
    setCheckingSession(false);
    if (!user) router.replace("/login");
  });
}, [router]);
```

### 5-3. `onAuthStateChange` 사용하는 곳 전체 목록

검색 결과:
- **없음** (레포 전체에서 `onAuthStateChange(` 미사용)

---

## 6) ACCOUNT PAGE

파일: `app/account/page.tsx`

```tsx
import { createClient } from "@/lib/supabase/server";
import { getAuthTier } from "@/lib/auth-server";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { ManageBillingButton } from "@/components/ManageBillingButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ImageOff, Bookmark } from "lucide-react";

function tierBadgeLabel(tier: string): string {
  if (tier === "alpha") return "ALPHA ACCESS";
  if (tier === "standard") return "STANDARD ACCESS";
  return "FREE ACCESS";
}

type AccountPageProps = { searchParams: Promise<{ updated?: string }> };

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const supabase = await createClient();
  const params = await searchParams;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { tier } = await getAuthTier();

  const { count: accessibleProductCount } = await supabase
    .from("scout_final_reports")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const { data: favRows } = await supabase
    .from("user_favorites")
    .select("report_id")
    .eq("user_id", user.id);

  const reportIds = (favRows ?? []).map((r) => r.report_id);
  let picks: Array<{
    id: string;
    week_id: string;
    translated_name: string | null;
    image_url: string;
    market_viability: number | null;
    category: string | null;
    viability_reason: string | null;
  }> = [];

  if (reportIds.length > 0) {
    const { data: reports } = await supabase
      .from("scout_final_reports")
      .select("id, week_id, translated_name, image_url, market_viability, category, viability_reason")
      .in("id", reportIds)
      .eq("status", "published");
    picks = (reports ?? []).map((r) => ({
      id: r.id,
      week_id: r.week_id,
      translated_name: r.translated_name ?? null,
      image_url: r.image_url,
      market_viability: r.market_viability ?? null,
      category: r.category ?? null,
      viability_reason: r.viability_reason ?? null,
    }));
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* DARK HERO */}
      <section className="bg-[#1A1916] pt-20 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#16A34A] mb-2">
            Premium Sourcing Vault
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#F8F7F4] mb-3">
            My Account
          </h1>
          <p className="text-[#F8F7F4]/80 text-sm font-medium mb-4">{user.email}</p>
          <span className="inline-block rounded-md bg-[#16A34A]/20 px-3 py-1.5 text-xs font-bold tracking-wider text-[#16A34A] uppercase">
            {tierBadgeLabel(tier)}
          </span>
          {params?.updated === "password" && (
            <p className="mt-4 text-sm text-[#16A34A] font-medium">
              Password updated successfully.
            </p>
          )}
          <div className="flex items-center gap-3 mt-6 text-sm font-medium tracking-tight">
            <Link
              href="/account/password"
              className="text-[#F8F7F4]/80 hover:text-[#F8F7F4] transition-colors"
            >
              Change Password
            </Link>
            <span className="text-[#F8F7F4]/50 select-none" aria-hidden>|</span>
            <LogoutButton className="text-[#F8F7F4]/80 hover:text-[#F8F7F4] transition-colors font-medium" />
          </div>
        </div>
      </section>

      {/* SINGLE COLUMN: MY PICKS FIRST, THEN BILLING */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
        {/* MY PICKS (main focus) */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-[#1A1916] tracking-tight mb-1">
            My Picks
          </h2>
          <p className="text-sm text-[#6B6860] mb-6">
            Your saved products. Unbookmark from the report page or remove below.
          </p>

          {picks.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-2xl p-12 text-center flex flex-col items-center justify-center bg-gray-50/50">
              <Bookmark className="text-gray-300 w-12 h-12 mb-4" strokeWidth={1.5} />
              <p className="text-lg font-medium text-gray-900">Your vault is empty.</p>
              <p className="text-gray-500 mt-1 mb-6">
                Save products from the weekly reports to build your sourcing list.
              </p>
              <Link
                href="/weekly"
                className="inline-flex items-center justify-center rounded-xl bg-[#16A34A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#15803D] shadow-[0_2px_8px_0_rgb(22_163_74/0.3)] transition-colors"
              >
                Browse Weekly Reports →
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {picks.map((p) => {
                const categoryTags = (p.category ?? "")
                  .split(/[>/]/)
                  .map((s) => s.trim())
                  .filter(Boolean);
                return (
                  <li key={p.id}>
                    <div className="relative flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#16A34A]/40 hover:shadow-lg transition-all">
                      {/* Bookmark: absolute top-right of card */}
                      <FavoriteButton
                        reportId={p.id}
                        weekId={p.week_id}
                        isFavorited={true}
                        className="absolute top-6 right-6 fill-[#16A34A] text-[#16A34A] hover:opacity-90 disabled:opacity-50"
                        iconClassName="w-6 h-6"
                      />
                      {/* Left: Image */}
                      <div className="relative h-24 w-24 md:h-32 md:w-32 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
                        {p.image_url ? (
                          <Image
                            src={p.image_url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 96px, 128px"
                          />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 gap-1">
                            <ImageOff className="h-8 w-8" strokeWidth={1.5} />
                            <span className="text-[10px] font-medium">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Center: Title, categories, market score */}
                      <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <h3 className="text-xl font-bold text-[#1A1916]">
                          {p.translated_name || "Product"}
                        </h3>
                        {categoryTags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {categoryTags.map((tag, i) => (
                              <span
                                key={i}
                                className="bg-gray-50 border border-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded-md font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="text-[10px] font-bold text-[#16A34A] tracking-wider uppercase mb-1 block mt-3">
                          ⚡ Trend Insight
                        </span>
                        <p className="text-gray-700 leading-relaxed line-clamp-2">
                          {p.viability_reason || "—"}
                        </p>
                        <div className="flex flex-col mt-2">
                          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                            Market Score
                          </span>
                          <span className="text-3xl font-black text-[#1A1916] tabular-nums">
                            {p.market_viability ?? "—"}
                          </span>
                        </div>
                      </div>

                      {/* Right: View Report link (bottom-right of content flow) */}
                      <div className="flex flex-col items-end justify-end shrink-0">
                        <Link
                          href={`/weekly/${p.week_id}/${p.id}`}
                          className="text-sm font-semibold text-[#16A34A] hover:text-[#15803D]"
                        >
                          View Report →
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* SUBSCRIPTION & BILLING (tier-based) */}
        <div className="mt-16 bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
          <h2 className="text-lg font-bold text-[#1A1916] tracking-tight mb-1">
            Subscription & Billing
          </h2>
          <p className="text-sm text-[#6B6860] mb-4">
            Current plan: <span className="font-semibold text-[#1A1916]">{tierBadgeLabel(tier)}</span>
          </p>

          {tier === "free" && (
            <Link
              href="/pricing"
              className="bg-[#16A34A] text-white w-full py-2 rounded-lg text-center font-medium block hover:bg-[#15803D] transition-colors"
            >
              Upgrade to Premium
            </Link>
          )}

          {tier === "standard" && (
            <>
              <Link
                href="/pricing"
                className="bg-[#16A34A] text-white w-full py-2 rounded-lg text-center font-medium block hover:bg-[#15803D] transition-colors"
              >
                Upgrade to Alpha Access
              </Link>
              <ManageBillingButton
                accessibleProductCount={accessibleProductCount ?? 0}
                className="text-gray-500 border border-gray-200 mt-3 w-full py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              />
            </>
          )}

          {tier === "alpha" && (
            <ManageBillingButton
              accessibleProductCount={accessibleProductCount ?? 0}
              className="w-full py-2 rounded-lg border-2 border-[#1A1916] text-[#1A1916] text-sm font-semibold hover:bg-[#1A1916] hover:text-white transition-colors"
            />
          )}

          <p className="text-xs text-[#9E9C98] mt-3">
            Billing portal will be available in Phase 4.
          </p>
        </div>

        <p className="mt-8">
          <Link
            href="/"
            className="text-sm font-medium text-[#16A34A] hover:text-[#15803D]"
          >
            ← Back to home
          </Link>
        </p>
      </section>
    </div>
  );
}
```

결제 후 리다이렉트되는 페이지 확인:
- `CheckoutButton` 자체는 새 탭에서 LemonSqueezy 체크아웃만 오픈
- 코드 상 **결제 완료 후 앱 내 강제 이동 경로(예: `/weekly`)는 정의되어 있지 않음**
- 앱 내 명시된 auth 콜백 기본 경로는 `app/auth/callback/route.ts`에서 `next ?? "/weekly"`

---

## 추가 관찰 (사실 기록)

1. 결제 플로우가 새 탭(`window.open`) 기반이라, 결제 완료 후 원탭/신탭의 세션 동기화 타이밍 문제 가능성 존재  
2. checkout URL에 `checkout[redirect_url]`가 없어, 결제 완료 후 앱 복귀 경로가 코드 기준으로 고정되지 않음  
3. 웹훅은 `profiles.tier` 갱신만 수행하고, 클라이언트 세션 리프레시 유도 로직은 없음  
4. `onAuthStateChange` 미사용으로 실시간 auth 상태 변화 구독이 없음

---

## 조사 요약 체크리스트

- [x] `components/CheckoutButton.tsx` 전체 코드 첨부
- [x] `window.open` 사용 여부 확인
- [x] 결제 완료 후 리다이렉트 로직 존재 여부 확인
- [x] `app/pricing/page.tsx` checkout URL redirect 파라미터 확인
- [x] `app/page.tsx` checkout URL redirect 파라미터 확인
- [x] LemonSqueezy URL의 `checkout[redirect_url]` 파라미터 확인
- [x] `middleware.ts` 전체 코드 첨부
- [x] `app/api/auth/` 폴더 존재 여부 및 파일 목록 확인
- [x] `lib/supabase/` 전체 파일 목록 및 코드 첨부
- [x] Supabase auth callback 라우트 확인
- [x] `app/auth/` 폴더 코드 확인
- [x] `app/api/webhooks/lemonsqueezy/route.ts` 전체 코드 첨부
- [x] tier 업데이트 후 세션 갱신 코드 여부 확인
- [x] 세션 무효화 가능 코드 여부 확인
- [x] 클라이언트 세션 체크 목록 정리
- [x] `useEffect` auth 체크 위치 정리
- [x] `onAuthStateChange` 사용처 조사
- [x] `app/account/page.tsx` 전체 코드 첨부

