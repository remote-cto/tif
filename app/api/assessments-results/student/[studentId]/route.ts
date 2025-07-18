//app/api/student/[studentId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

export async function GET(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const studentId = parseInt(params.studentId);
    
    if (!studentId) {
      return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
    }

    const query = `
      SELECT 
        sa.id,
        sa.started_at,
        sa.completed_at,
        sa.total_score,
        sa.readiness_score,
        sa.status,
        q.title as questionnaire_title,
        COUNT(san.id) as total_questions,
        COUNT(CASE WHEN san.is_correct THEN 1 END) as correct_answers
      FROM student_assessments sa
      LEFT JOIN questionnaires q ON sa.questionnaire_id = q.id
      LEFT JOIN student_answers san ON sa.id = san.student_assessment_id
      WHERE sa.student_id = $1
      GROUP BY sa.id, q.title
      ORDER BY sa.started_at DESC
    `;

    const result = await pool.query(query, [studentId]);

    return NextResponse.json({
      assessments: result.rows
    });

  } catch (err) {
    console.error("Error fetching student assessments:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}