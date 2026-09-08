import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const token = req.headers.get("x-admin-bootstrap-token");

  if (
    !token ||
    token !== process.env.ADMIN_BOOTSTRAP_TOKEN
  ) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const email = process.env.ADMIN_EMAIL?.toLowerCase();

  if (!email) {
    return NextResponse.json(
      { error: "ADMIN_EMAIL missing" },
      { status: 500 }
    );
  }

  const { password } = await req.json();

  if (
    typeof password !== "string" ||
    password.length < 12
  ) {
    return NextResponse.json(
      { error: "Password must be 12+ characters." },
      { status: 400 }
    );
  }

  const { db } = await import("@/lib/db");

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.user.upsert({
    where: { email },
    create: {
      email,
      passwordHash,
      role: "ADMIN",
    },
    update: {
      role: "ADMIN",
      passwordHash,
    },
  });

  return NextResponse.json({
    id: user.id,
    email: user.email,
    role: user.role,
  });
}
