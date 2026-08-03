import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  getSupabaseConfig,
  hasSupabaseConfig,
} from "@/lib/supabase/config";

export async function updateSupabaseSession(request: NextRequest) {
  if (!hasSupabaseConfig()) {
    return NextResponse.next({ request });
  }

  const { url, publishableKey } = getSupabaseConfig();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data, error } = await supabase.auth.getClaims();
  const isProtectedAdminPath =
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/giris";

  if (isProtectedAdminPath && (error || !data?.claims)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/giris";
    redirectUrl.search = "";
    const redirectResponse = NextResponse.redirect(redirectUrl);
    response.cookies.getAll().forEach((cookie) =>
      redirectResponse.cookies.set(cookie),
    );
    return redirectResponse;
  }

  return response;
}
