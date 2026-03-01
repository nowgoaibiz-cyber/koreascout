import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
  const origin = request.nextUrl.origin;
  const res = NextResponse.redirect(new URL("/admin/login", origin));
  res.cookies.set(cookieName, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return res;
}
