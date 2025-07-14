// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, registration_number, college_name } = body;

    if (!email || !registration_number || !college_name) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT id, name FROM students 
       WHERE email = $1 AND registration_number = $2 
       AND college_id IN (SELECT id FROM colleges WHERE name = $3)`,
      [email, registration_number, college_name]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // TODO: set session / token / cookie here if needed

    return NextResponse.json({
      success: true,
      student: result.rows[0],
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
