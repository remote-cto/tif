import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

export async function GET(req: NextRequest) {
  try {
    const query = `
      SELECT * FROM (
        SELECT 
          q.id,
          q.question,
          q.option_a,
          q.option_b,
          q.option_c,
          q.option_d,
          q.correct_answer,
          t.name AS topic,
          s.name AS section,
          l.name AS level,
          t.industry_weight,
          l.difficulty_weight,
          ROW_NUMBER() OVER (
            PARTITION BY q.topic_id, q.level_id 
            ORDER BY RANDOM()
          ) AS row_num
        FROM questions q
        JOIN topics t ON q.topic_id = t.id
        JOIN sections s ON t.section_id = s.id
        JOIN levels l ON q.level_id = l.id
        WHERE q.is_active = TRUE
      ) sub
      WHERE sub.row_num = 1;
    `;

    const result = await pool.query(query);

    // Filter to get every other question (odd row numbers: 1, 3, 5, etc.)
    const filteredRows = result.rows.filter((row: any) => row.row_num % 2 === 1);

    const formattedQuestions = filteredRows.map((q: any) => {
      const correctAnswerIndex = { A: 0, B: 1, C: 2, D: 3 }[
        q.correct_answer as "A" | "B" | "C" | "D"
      ];

      return {
        id: q.id.toString(),
        topic: q.topic,
        section: q.section,
        level: q.level,
        question: q.question,
        options: [q.option_a, q.option_b, q.option_c, q.option_d],
        correctAnswer: correctAnswerIndex,
      };
    });

    return NextResponse.json(
      { questions: formattedQuestions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to load questions" },
      { status: 500 }
    );
  }
}
