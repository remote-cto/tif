
//api/save-score/route.

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
      time_completed 
    }: SaveScoreRequest = await req.json();

    if (!student_id || !answers || !questions || !time_started || !time_completed) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calculate scores
    const totalQuestions = questions.length;
    const correctAnswers = questions.filter(q => answers[q.id] === q.correctAnswer).length;
    const scorePercent = (correctAnswers / totalQuestions) * 100;

    // Create student_assessment record (without questionnaire_id)
    const assessmentQuery = `
      INSERT INTO student_assessments (
        student_id, 
        started_at, 
        completed_at, 
        total_score, 
        status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;

    const startedAt = new Date(time_started);
    const completedAt = new Date(time_completed);

    const assessmentResult = await client.query(assessmentQuery, [
      student_id,
      startedAt,
      completedAt,
      scorePercent,
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


 // 3. Calculate and store topic-wise scores
    const topicScores = calculateTopicScores(answers, questions);
    
    const topicInserts = Object.entries(topicScores).map(([topicName, scores]) => {
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
        scores.correct,
        scores.total,
        scores.levels.Basic,
        scores.levels.Intermediate,
        scores.levels.Advanced,
        scores.weightedScore,
        scores.normalizedScore,
        scores.classification,
        topicName
      ]);
    });

    await Promise.all(topicInserts);
   

function calculateTopicScores(answers: { [key: string]: number }, questions: Array<any>) {
  const topicScores: { [key: string]: any } = {};

  questions.forEach(question => {
    const topic = question.topic;
    const level = question.level;
    const isCorrect = answers[question.id] === question.correctAnswer;

    if (!topicScores[topic]) {
      topicScores[topic] = {
        correct: 0,
        total: 0,
        levels: { Basic: 0, Intermediate: 0, Advanced: 0 },
        weightedScore: 0,
        normalizedScore: 0,
        classification: 'Optional'
      };
    }

    topicScores[topic].total++;
    if (isCorrect) {
      topicScores[topic].correct++;
      topicScores[topic].levels[level]++;
    }
  });

  // Calculate weighted and normalized scores
  Object.keys(topicScores).forEach(topic => {
    const scores = topicScores[topic];
    const accuracy = scores.correct / scores.total;
    
    // Calculate weighted score based on difficulty distribution
    const difficultyWeights = { Basic: 1.0, Intermediate: 1.5, Advanced: 2.0 };
    const avgDifficultyWeight = (
      scores.levels.Basic * difficultyWeights.Basic +
      scores.levels.Intermediate * difficultyWeights.Intermediate +
      scores.levels.Advanced * difficultyWeights.Advanced
    ) / (scores.levels.Basic + scores.levels.Intermediate + scores.levels.Advanced || 1);

    scores.weightedScore = accuracy * avgDifficultyWeight * 100;
    scores.normalizedScore = Math.min(100, scores.weightedScore);
    
    // Classify performance
    if (scores.normalizedScore >= 75) {
      scores.classification = 'Strength';
    } else if (scores.normalizedScore < 50) {
      scores.classification = 'Gap';
    } else {
      scores.classification = 'Optional';
    }
  });

  return topicScores;
}





    // Maintain the old student_results table for backward compatibility
    await client.query(`
      INSERT INTO student_results (student_id, assessment_id, correct_answers, total_questions, score_percent)
      VALUES ($1, $2, $3, $4, $5)
    `, [student_id, studentAssessmentId, correctAnswers, totalQuestions, scorePercent]);

    await client.query('COMMIT');

    return NextResponse.json({ 
      success: true, 
      assessment_id: studentAssessmentId,
      total_score: scorePercent,
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