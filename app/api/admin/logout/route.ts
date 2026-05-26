import { NextResponse } from "next/server";
import { COOKIE_ADMIN } from "@/lib/session";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_ADMIN, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
