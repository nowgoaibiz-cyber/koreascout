import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/admin")) {
    const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
    const cookie = request.cookies.get(cookieName);
    const isLoginPage = pathname === "/admin/login";
    if (isLoginPage) return await updateSession(request);
    if (cookie?.value === "authenticated") return await updateSession(request);
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, other static assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
