// api/save-score/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

interface SaveScoreRequest {
  student_id: number;
  answers: { [key: string]: number }; // question_id -> selected_option
  questions: Array<{
    id: string;
    correctAnswer: number;
    topic: string;
    level: string;
  }>;
  time_started: number;
  time_completed: number;
  // Add calculated scores from frontend
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
      readiness_score, // Use frontend calculated value
      total_score,     // Use frontend calculated value
      topic_scores     // Use frontend calculated topic scores
    }: SaveScoreRequest = await req.json();

    if (!student_id || !answers || !questions || !time_started || !time_completed) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calculate basic scores only (no complex calculations)
    const totalQuestions = questions.length;
    const correctAnswers = questions.filter(q => answers[q.id] === q.correctAnswer).length;
    const scorePercent = (correctAnswers / totalQuestions) * 100;

    // Create student_assessment record using frontend calculated scores
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
      total_score,      // Use frontend calculated total_score
      readiness_score,  // Use frontend calculated readiness_score
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
        String.fromCharCode(65 + selectedOption), // Convert 0,1,2,3 to A,B,C,D
        isCorrect,
        completedAt
      ]);
    });

    await Promise.all(answerInserts);

    // Insert topic-wise scores using frontend calculated data
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

    // Maintain the old student_results table for backward compatibility
    await client.query(`
      INSERT INTO student_results (student_id, assessment_id, correct_answers, total_questions, score_percent)
      VALUES ($1, $2, $3, $4, $5)
    `, [student_id, studentAssessmentId, correctAnswers, totalQuestions, scorePercent]);

    await client.query('COMMIT');

    return NextResponse.json({ 
      success: true, 
      assessment_id: studentAssessmentId,
      total_score: total_score,        
      readiness_score: readiness_score, 
      correct_answers: correctAnswers,
      total_questions: totalQuestions
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Error saving assessment:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    client.release();
  }
}