// app/api/college-students/route.ts

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

type Assessment = {
  id: number | null;
  score: number;
  total_questions: number;
  score_percent: number;
  attempted_at: string;
  total_score: number;
  readiness_score: number;
  //foundation_score: number;
  //industrial_score: number;
  status: string;
};


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const college_id = searchParams.get("college_id");

  if (!college_id) {
    return NextResponse.json({ error: "College ID is required" }, { status: 400 });
  }

  try {
   
  const result = await pool.query(
  `
  WITH latest_assessments AS (
    SELECT sa.*
    FROM student_assessments sa
    INNER JOIN (
      SELECT student_id, MAX(started_at) AS max_started
      FROM student_assessments
      GROUP BY student_id
    ) latest ON sa.student_id = latest.student_id AND sa.started_at = latest.max_started
  )

  SELECT 
    s.id,
    s.name,
    s.registration_number,
    s.email,
    json_agg(
      json_build_object(
        'id', sa.id,
        'score', COALESCE(
          (SELECT COUNT(*) FROM student_answers ans 
           WHERE ans.student_assessment_id = sa.id AND ans.is_correct = true), 0
        ),
        'total_questions', COALESCE(
          (SELECT COUNT(*) FROM student_answers ans 
           WHERE ans.student_assessment_id = sa.id), 0
        ),
        'score_percent', CASE 
          WHEN (SELECT COUNT(*) FROM student_answers ans WHERE ans.student_assessment_id = sa.id) > 0 
          THEN (
            (SELECT COUNT(*) FROM student_answers ans 
             WHERE ans.student_assessment_id = sa.id AND ans.is_correct = true) * 100.0 / 
            (SELECT COUNT(*) FROM student_answers ans WHERE ans.student_assessment_id = sa.id)
          )
          ELSE 0
        END,
        'attempted_at', sa.started_at,
        'total_score', sa.total_score,
        'readiness_score', sa.readiness_score,
        'status', sa.status
      )
    ) FILTER (WHERE sa.id IS NOT NULL) AS assessments
  FROM students s
  LEFT JOIN latest_assessments sa ON s.id = sa.student_id
  WHERE s.college_id = $1
  GROUP BY s.id, s.name, s.registration_number, s.email
  ORDER BY s.name;
  `,
  [college_id]
);

    

    // Clean up the assessments array (remove null values)
    const students = result.rows.map(student => ({
      ...student,
      assessments: student.assessments
        ? student.assessments.filter((assessment: Assessment) => assessment.id !== null)
        : []
    }));

    return NextResponse.json({
      success: true,
      students: students,
    });
  } catch (error) {
    console.error("Error fetching college students:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


