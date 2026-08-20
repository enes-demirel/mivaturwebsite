import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";

export function middleware(request: NextRequest) {
  const isLogin = request.nextUrl.pathname === "/admin/giris";
  if (!isLogin && !request.cookies.has(ADMIN_SESSION_COOKIE)) {
    return NextResponse.redirect(new URL("/admin/giris", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
