import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isOrdersPage = pathname.startsWith("/orders");
  const isCartPage = pathname.startsWith("/cart");
  
  const isDashboardPage = pathname.startsWith("/provider/dashboard") || pathname.startsWith("/admin/dashboard");

  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!sessionCookie && (isOrdersPage || isCartPage)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!sessionCookie && isDashboardPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login", 
    "/signup", 
    "/orders/:path*", 
    "/cart/:path*", 
    "/provider/dashboard/:path*", 
    "/admin/dashboard/:path*"
  ],
};