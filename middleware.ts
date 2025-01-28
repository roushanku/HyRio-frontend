// app/middleware.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Incoming request", request.nextUrl.pathname);
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/signup";
  const token = request.cookies.get("token")?.value || "";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/login", "/signup", "/dashboard/:path*"],
};
