import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "tq_auth";

function getPassword(): string {
  return process.env.SITE_PASSWORD || "8687";
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== getPassword()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, getPassword(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
