// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/login", "/signup"];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  const token = req.cookies.get("token")?.value;
  console.log({ token });

  // 1. Allow public routes if unauthenticated
  if (isPublicRoute) {
    // If authenticated, redirect away from login/signup
    if (token && await isValidToken(token)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 2. Block access to private routes if no token or invalid/expired token
  if (!token || !(await isValidToken(token))) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    // Clear the invalid/expired token
    response.cookies.delete("token");
    return response;
  }

  // 3. Allow request (authenticated private route with valid token)
  return NextResponse.next();
}

async function isValidToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );
    
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    // Token is invalid or expired
    console.log("Token validation failed:", error);
    return false;
  }
}

export const config = {
  matcher: [
    "/((?!api/login|api/signup|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg)$).*)",
  ],
  runtime: "nodejs"
};