// app/api/student-topic-scores/route.ts

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get("student_id");

  if (!studentId) {
    return NextResponse.json({ error: "Missing student_id" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `
      SELECT 
        st.topic_id,
        t.name AS topic_name,
        st.correct_answers,
        st.total_questions,
        st.weighted_score,
        st.normalized_score,
        st.classification
      FROM student_topic_scores st
      JOIN topics t ON t.id = st.topic_id
      JOIN student_assessments sa ON sa.id = st.student_assessment_id
      WHERE sa.student_id = $1
      ORDER BY st.normalized_score DESC;
      `,
      [studentId]
    );

    return NextResponse.json({ scores: result.rows });
  } catch (err) {
    console.error("Error fetching topic scores:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
