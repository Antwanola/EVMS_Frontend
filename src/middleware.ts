// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/login", "/signup"];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  const token = req.cookies.get("token")?.value;
  console.log({token})

  // 1. Redirect authenticated users away from login/signup
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2. Allow public routes if unauthenticated
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 3. Block access to private routes if no token
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 4. Otherwise, allow request (authenticated private route)
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply to all routes except Next.js internals and static files
   "/((?!api/login|api/signup|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg)$).*)",
  ],
  runtime: "nodejs"
};
