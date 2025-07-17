// app/api/college-students/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

export async function GET(req: NextRequest) {
  const collegeId = req.nextUrl.searchParams.get("college_id");

  if (!collegeId) {
    return NextResponse.json({ error: "Missing college_id" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `SELECT id, name, email, registration_number FROM students WHERE college_id = $1`,
      [collegeId]
    );

    return NextResponse.json({ students: result.rows });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}
