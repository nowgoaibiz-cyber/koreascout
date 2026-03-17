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
