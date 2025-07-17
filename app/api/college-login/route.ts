// app/api/college-login/route.ts
// app/api/college-login/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT id, name, college_id, hashed_password FROM admins WHERE email = $1 AND is_active = true`,
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const admin = result.rows[0];

    // Direct text match (no bcrypt)
    const isPasswordCorrect = password === admin.hashed_password;

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        college_id: admin.college_id,
        email,
      },
    });
  } catch (error) {
    console.error("College login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
