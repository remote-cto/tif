//app/api/save-score

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

export async function POST(req: NextRequest) {
  try {
    const { student_id, assessment_id, correct_answers, total_questions, score_percent } = await req.json();

    if (!student_id || correct_answers === undefined || total_questions === undefined || score_percent === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const query = `
      INSERT INTO student_results (student_id, assessment_id, correct_answers, total_questions, score_percent)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [student_id, assessment_id || null, correct_answers, total_questions, score_percent];
    const result = await pool.query(query, values);

    return NextResponse.json({ success: true, result: result.rows[0] });
  } catch (err) {
    console.error("Error saving result:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
