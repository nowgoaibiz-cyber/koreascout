import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createServiceRoleClient } from "@/lib/supabase/admin";

const LEMONSQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

/** Standard $9 — checkout URL UUID (LemonSqueezy 웹훅은 variant_id를 숫자로 보낼 수 있음) */
const STANDARD_VARIANT_UUID = "141f6710-c704-4ab3-b7c7-f30b2c587587";
/** Alpha $29 — checkout URL UUID */
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
