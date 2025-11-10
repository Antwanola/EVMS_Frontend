// src/app/api/login/route.ts
// import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/config/apiConfig";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();
    console.log("login attempt", { API_BASE_URL});
    if(!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    try {
       const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

  const data = await res.json();
  console.log("token from login logic",data.data.token)

  if (!data.success || !data.data.token) {
    console.error("Login API error:", data);
    throw new Error(data.message || "Login failed");
  }

  // ✅ Set cookie here
  const response = NextResponse.json({
    success: data.success,
    user: data.user,
    token: data.data.token, // Include token in response body
  });

  response.cookies.set("token", data.data.token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      return NextResponse.json({ error: message || "Login failed" }, { status: 401 });
    }
}
