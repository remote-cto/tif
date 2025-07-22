// api/save-score/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

interface SaveScoreRequest {
  student_id: number;
  answers: { [key: string]: number };
  questions: Array<{
    id: string;
    correctAnswer: number;
    topic: string;
    level: string;
  }>;
  time_started: number;
  time_completed: number;
  readiness_score: number;
  total_score: number;
  topic_scores: Array<{
    topic: string;
    correct: number;
    total: number;
    weighted_score: number;
    normalized_score: number;
    classification: string;
    levels: {
      Basic: number;
      Intermediate: number;
      Advanced: number;
    };
  }>;
}

export async function POST(req: NextRequest) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { 
      student_id, 
      answers, 
      questions, 
      time_started, 
      time_completed,
      readiness_score,
      total_score,
      topic_scores
    }: SaveScoreRequest = await req.json();

    if (!student_id || !answers || !questions || !time_started || !time_completed) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create student_assessment record
    const assessmentQuery = `
      INSERT INTO student_assessments (
        student_id, 
        started_at, 
        completed_at, 
        total_score, 
        readiness_score,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;

    const startedAt = new Date(time_started);
    const completedAt = new Date(time_completed);

    const assessmentResult = await client.query(assessmentQuery, [
      student_id,
      startedAt,
      completedAt,
      total_score,
      readiness_score,
      'completed'
    ]);

    const studentAssessmentId = assessmentResult.rows[0].id;

    // Insert individual answers
    const answerInserts = questions.map(question => {
      const selectedOption = answers[question.id];
      const isCorrect = selectedOption === question.correctAnswer;
      
      return client.query(`
        INSERT INTO student_answers (
          student_assessment_id, 
          question_id, 
          selected_option, 
          is_correct, 
          answered_at
        )
        VALUES ($1, $2, $3, $4, $5)
      `, [
        studentAssessmentId,
        parseInt(question.id),
        String.fromCharCode(65 + selectedOption),
        isCorrect,
        completedAt
      ]);
    });

    await Promise.all(answerInserts);

    // Insert topic-wise scores
    const topicInserts = topic_scores.map(topicData => {
      return client.query(`
        INSERT INTO student_topic_scores (
          student_assessment_id,
          topic_id,
          correct_answers,
          total_questions,
          basic_correct,
          intermediate_correct,
          advanced_correct,
          weighted_score,
          normalized_score,
          classification
        )
        SELECT $1, t.id, $2, $3, $4, $5, $6, $7, $8, $9
        FROM topics t 
        WHERE t.name = $10
      `, [
        studentAssessmentId,
        topicData.correct,
        topicData.total,
        topicData.levels.Basic,
        topicData.levels.Intermediate,
        topicData.levels.Advanced,
        topicData.weighted_score,
        topicData.normalized_score,
        topicData.classification,
        topicData.topic
      ]);
    });

    await Promise.all(topicInserts);

    await client.query('COMMIT');

    return NextResponse.json({ 
      success: true, 
      assessment_id: studentAssessmentId,
      total_score: total_score,        
      readiness_score: readiness_score
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Error saving assessment:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    client.release();
  }
}