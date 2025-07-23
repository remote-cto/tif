import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get("student_id");

  if (!studentId) {
    return NextResponse.json({ error: "Missing student_id" }, { status: 400 });
  }

  try {
    // Step 1: Get the latest assessment ID of the student
    const latestAssessmentResult = await pool.query(
      `SELECT id
       FROM student_assessments
       WHERE student_id = $1
       ORDER BY started_at DESC
       LIMIT 1`,
      [studentId]
    );

    if (latestAssessmentResult.rowCount === 0) {
      return NextResponse.json({ scores: [] });
    }

    const latestAssessmentId = latestAssessmentResult.rows[0].id;

    // Step 2: Get topic scores for the latest assessment
    const result = await pool.query(
      `SELECT 
         st.topic_id,
         t.name AS topic_name,
         st.correct_answers,
         st.total_questions,
         st.weighted_score,
         st.normalized_score,
         st.classification
       FROM student_topic_scores st
       JOIN topics t ON t.id = st.topic_id
       WHERE st.student_assessment_id = $1
       ORDER BY st.normalized_score DESC`,
      [latestAssessmentId]
    );

    return NextResponse.json({ scores: result.rows });
  } catch (err) {
    console.error("Error fetching topic scores:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}