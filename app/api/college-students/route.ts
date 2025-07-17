// app/api/college-students/route.ts
// app/api/college-students/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

export async function GET(req: NextRequest) {
  const collegeId = req.nextUrl.searchParams.get("college_id");

  if (!collegeId) {
    return NextResponse.json({ error: "Missing college_id" }, { status: 400 });
  }

  try {
    const query = `
      SELECT 
        s.id AS student_id,
        s.name,
        s.email,
        s.registration_number,
        r.id AS result_id,
        r.correct_answers,
        r.total_questions,
        r.score_percent,
        r.created_at
      FROM students s
      LEFT JOIN student_results r ON s.id = r.student_id
      WHERE s.college_id = $1
      ORDER BY s.id, r.created_at DESC;
    `;

    const { rows } = await pool.query(query, [collegeId]);

    // Group by student
    const studentMap = new Map();

    for (const row of rows) {
      if (!studentMap.has(row.student_id)) {
        studentMap.set(row.student_id, {
          id: row.student_id,
          name: row.name,
          registration_number: row.registration_number,
          email: row.email,
          assessments: [],
        });
      }

      if (row.result_id) {
        studentMap.get(row.student_id).assessments.push({
          id: row.result_id,
          score: row.correct_answers,
          total_questions: row.total_questions,
          score_percent: row.score_percent,
          attempted_at: row.created_at,
        });
      }
    }

    return NextResponse.json({ students: Array.from(studentMap.values()) });
  } catch (error) {
    console.error("Error fetching students with results:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

