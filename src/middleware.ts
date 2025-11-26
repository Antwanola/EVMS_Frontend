// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";


interface TokenValidation {
  valid: boolean;
  payload?: any;
  error?: string;
}


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Define public routes
  const publicRoutes = ["/login", "/signup"];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Get token from cookies
  const token = req.cookies.get("token")?.value;
  
  // Validate token once
  const tokenValidation = token ? await isValidToken(token) : null;

  // Handle public routes
  if (isPublicRoute) {
    // Redirect authenticated users away from login/signup
    if (tokenValidation?.valid) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (!token || !tokenValidation?.valid) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    
    // Clear invalid/expired token
    if (token) {
      response.cookies.delete("token");
    }
    
    return response;
  }

  // Attach user info to headers for use in API routes/server components (optional)
  const requestHeaders = new Headers(req.headers);
  if (tokenValidation.payload) {
    requestHeaders.set("x-user-id", tokenValidation.payload.userId || "");
    requestHeaders.set("x-user-role", tokenValidation.payload.role || "");
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}


async function isValidToken(token: string): Promise<TokenValidation> {
  try {
    // Get secret from environment
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      console.error("JWT_SECRET is not defined in environment variables");
      return { valid: false, error: "Server configuration error" };
    }

    const encodedSecret = new TextEncoder().encode(secret);
    
    // Verify token
    const { payload } = await jwtVerify(token, encodedSecret);
    
    return { 
      valid: true, 
      payload 
    };
  } catch (error: any) {
    // Log specific error types for debugging
    if (error.code === "ERR_JWT_EXPIRED") {
      console.log("Token expired");
      return { valid: false, error: "Token expired" };
    } else if (error.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED") {
      console.log("Invalid token signature");
      return { valid: false, error: "Invalid signature" };
    }
    
    console.log("Token validation failed:", error.message);
    return { valid: false, error: error.message };
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/login, api/signup (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, other icons
     * - public files (images, etc.)
     */
    "/((?!api/auth|api/login|api/signup|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)",
  ],
};