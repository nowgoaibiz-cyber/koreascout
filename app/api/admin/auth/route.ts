import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = body?.password;
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      return NextResponse.json(
        { error: "Admin not configured" },
        { status: 500 }
      );
    }

    if (password !== expected) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    const cookieName = process.env.ADMIN_COOKIE_NAME || "kps_admin_session";
    const isProduction = process.env.NODE_ENV === "production";

    const res = NextResponse.json({ success: true }, { status: 200 });
    res.cookies.set(cookieName, "authenticated", {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "strict",
      secure: isProduction,
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
