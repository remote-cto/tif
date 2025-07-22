"use client";
import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Brain,
  Code,
  Cloud,
  GitBranch,
  Lightbulb,
  Calculator,
  FolderOpen,
} from "lucide-react";
import { getStudentData } from "@/utils/getStudentData";
import AssessmentResult from "../../components/AssessmentResult";

interface Question {
  id: string;
  topic: string;
  level: "Basic" | "Intermediate" | "Advanced";
  question: string;
  options: string[];
  correctAnswer: number;
  section: "Foundational" | "Industrial";
}

interface TopicScore {
  topic: string;
  correct: number;
  total: number;
  levels: {
    Basic: number;
    Intermediate: number;
    Advanced: number;
  };
  score: number;
  normalizedScore: number;
}

interface AssessmentResultTopicScore {
  topic_id: number;
  topic_name: string;
  correct_answers: number;
  total_questions: number;
  weighted_score: number;
  normalized_score: number;
  classification: string;
}

interface AssessmentResultData {
  id: number;
  score: number;
  total_questions: number;
  score_percent: number;
  attempted_at: string;
  total_score?: number;
  readiness_score?: number;
  status?: string;
}

interface AssessmentState {
  currentQuestion: number;
  questions: Question[];
  answers: { [key: string]: number };
  topicScores: { [key: string]: TopicScore };
  isCompleted: boolean;
  timeStarted: number;
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  registration_number?: string;
}

type TopicKey =
  | "ML Concepts"
  | "Python"
  | "Cloud & Deployment"
  | "Tools & Git"
  | "AI Use Cases"
  | "Projects"
  | "Math"
  | "Modern AI Stack Awareness";

type DifficultyKey = "Basic" | "Intermediate" | "Advanced";

const topicWeights: Record<TopicKey, number> = {
  "ML Concepts": 1.2,
  Python: 1.0,
  "Cloud & Deployment": 1.5,
  "Tools & Git": 1.1,
  "AI Use Cases": 1.1,
  Projects: 0.9,
  Math: 0.8,
  "Modern AI Stack Awareness": 1.5,
};

const difficultyWeights: Record<DifficultyKey, number> = {
  Basic: 1.0,
  Intermediate: 1.5,
  Advanced: 2.0,
};

const AssessmentPage: React.FC = () => {
  const [state, setState] = useState<AssessmentState>({
    currentQuestion: 0,
    questions: [],
    answers: {},
    topicScores: {},
    isCompleted: false,
    timeStarted: Date.now(),
  });

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [student, setStudent] = useState<StudentData | null>(null);

  // Initialize student data
  useEffect(() => {
    const studentData = getStudentData();
    if (studentData) {
      setStudent(studentData);
    }
  }, []);

  // Load questions
  useEffect(() => {
    fetch("/api/assessment")
      .then((res) => res.json())
      .then((data) => {
        setState((prev) => ({
          ...prev,
          questions: data.questions,
        }));
      })
      .catch((err) => console.error("Failed to fetch questions", err));
  }, []);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - state.timeStarted) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [state.timeStarted]);

  // Save assessment results
  useEffect(() => {
    const saveResult = async () => {
      if (!student) return;

      setIsSaving(true);
      setSaveError(null);

      try {
        const readinessScore = getReadinessScore();
        const totalScore = Object.values(state.topicScores).reduce(
          (sum, t) => sum + t.score,
          0
        );

        const topicScoresData = Object.values(state.topicScores).map(
          (topic) => ({
            topic: topic.topic,
            correct: topic.correct,
            total: topic.total,
            weighted_score: topic.score,
            normalized_score: topic.normalizedScore,
            classification: getClassification(topic.normalizedScore),
            levels: topic.levels,
          })
        );

        const response = await fetch("/api/save-score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: parseInt(student.id),
            answers: state.answers,
            questions: state.questions.map((q) => ({
              id: q.id,
              correctAnswer: q.correctAnswer,
              topic: q.topic,
              level: q.level,
            })),
            time_started: state.timeStarted,
            time_completed: Date.now(),
            readiness_score: readinessScore,
            total_score: totalScore,
            topic_scores: topicScoresData,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save assessment");
        }

        const result = await response.json();
        if (result.assessment_id) {
          setAssessmentId(result.assessment_id);
        }
      } catch (error) {
        console.error("Error saving assessment:", error);
        setSaveError("Failed to save assessment. Please try again.");
      } finally {
        setIsSaving(false);
      }
    };

    if (state.isCompleted && !assessmentId && !isSaving && student) {
      saveResult();
    }
  }, [state.isCompleted, assessmentId, isSaving, student]);

  const calculateTopicScore = (
    topic: string,
    answers: { [key: string]: number }
  ) => {
    const topicQuestions = state.questions.filter((q) => q.topic === topic);
    const correctAnswers = topicQuestions.filter(
      (q) => answers[q.id] === q.correctAnswer
    );
    const levels = { Basic: 0, Intermediate: 0, Advanced: 0 };

    correctAnswers.forEach((q) => {
      levels[q.level]++;
    });

    const totalCorrect = correctAnswers.length;
    if (totalCorrect === 0) return 0;

    const levelAvg =
      (levels.Basic * difficultyWeights.Basic +
        levels.Intermediate * difficultyWeights.Intermediate +
        levels.Advanced * difficultyWeights.Advanced) /
      totalCorrect;

    const topicWeight = topicWeights[topic as TopicKey] || 1.0;
    return totalCorrect * levelAvg * topicWeight;
  };

  const calculateDetailedTopicScore = (
    topic: string,
    answers: { [key: string]: number }
  ): TopicScore => {
    const topicQuestions = state.questions.filter((q) => q.topic === topic);
    const correctAnswers = topicQuestions.filter(
      (q) => answers[q.id] === q.correctAnswer
    );
    const levels = { Basic: 0, Intermediate: 0, Advanced: 0 };

    correctAnswers.forEach((q) => {
      levels[q.level]++;
    });

    const score = calculateTopicScore(topic, answers);
    const normalizedScore = Math.min(100, (score / 10) * 100);

    return {
      topic,
      correct: correctAnswers.length,
      total: topicQuestions.length,
      levels,
      score,
      normalizedScore,
    };
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = {
      ...state.answers,
      [state.questions[state.currentQuestion].id]: selectedAnswer,
    };

    if (state.currentQuestion < state.questions.length - 1) {
      setState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        answers: newAnswers,
      }));
      setSelectedAnswer(null);
    } else {
      const finalTopicScores: { [key: string]: TopicScore } = {};
      const uniqueTopics = [...new Set(state.questions.map((q) => q.topic))];

      uniqueTopics.forEach((topic) => {
        finalTopicScores[topic] = calculateDetailedTopicScore(
          topic,
          newAnswers
        );
      });

      setState((prev) => ({
        ...prev,
        answers: newAnswers,
        topicScores: finalTopicScores,
        isCompleted: true,
      }));
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getReadinessScore = (): number => {
    const totalScore = Object.values(state.topicScores).reduce(
      (sum, t) => sum + t.score,
      0
    );
    const maxPossible = state.questions.length * 2.0 * 1.5;
    return Math.min(100, (totalScore / maxPossible) * 100);
  };

  const getClassification = (normalizedScore: number): string => {
    if (normalizedScore >= 80) return "Strength";
    if (normalizedScore < 60) return "Gap";
    return "Optional";
  };

  const getRecommendationText = (topic: string): string => {
    const map: Record<string, string> = {
      Python: "Practice basic Python syntax and build small CLI apps.",
      Math: "Brush up on linear algebra, stats, and derivatives.",
      Projects: "Work on hands-on mini-projects to apply concepts.",
      "Cloud & Deployment": "Try deploying apps to AWS/GCP.",
      "ML Concepts": "Study supervised/unsupervised algorithms.",
      "Tools & Git": "Learn Git basics with real collaborative projects.",
      "AI Use Cases": "Explore real-world applications and case studies.",
      "Modern AI Stack Awareness":
        "Understand tools like LangChain, Vector DBs, and inference APIs.",
    };
    return map[topic] || "Practice and deepen understanding of this topic.";
  };

  const currentQuestion = state.questions[state.currentQuestion];

  // Loading state for student data
  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading student data...</p>
        </div>
      </div>
    );
  }

  // Show loading state while saving
  if (state.isCompleted && (isSaving || (!assessmentId && !saveError))) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">
            Saving your assessment and Generate your Report
          </p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  // Show error state if save failed
  if (state.isCompleted && saveError && !assessmentId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <XCircle className="w-16 h-16 mx-auto mb-2" />
            <p className="text-lg font-semibold">Save Failed</p>
          </div>
          <p className="text-gray-600 mb-4">{saveError}</p>
          <button
            onClick={() => {
              setSaveError(null);
              setState((prev) => ({ ...prev, isCompleted: false }));
              setTimeout(
                () => setState((prev) => ({ ...prev, isCompleted: true })),
                100
              );
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition mr-3"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  // Show results if assessment is completed and saved successfully
  if (state.isCompleted && assessmentId) {
    const readinessScore = getReadinessScore();
    const totalCorrectAnswers = Object.values(state.topicScores).reduce(
      (sum, topic) => sum + topic.correct,
      0
    );
    const scorePercent = (totalCorrectAnswers / state.questions.length) * 100;

    const topicScoresForTemplate: AssessmentResultTopicScore[] = Object.values(
      state.topicScores
    ).map((topic, index) => ({
      topic_id: index + 1,
      topic_name: topic.topic,
      correct_answers: topic.correct,
      total_questions: topic.total,
      weighted_score: topic.score,
      normalized_score: topic.normalizedScore,
      classification: getClassification(topic.normalizedScore),
    }));

    const assessmentData: AssessmentResultData = {
      id: assessmentId,
      score: totalCorrectAnswers,
      total_questions: state.questions.length,
      score_percent: scorePercent,
      attempted_at: new Date(state.timeStarted).toISOString(),
      total_score: Object.values(state.topicScores).reduce(
        (sum, t) => sum + t.score,
        0
      ),
      readiness_score: readinessScore,
      status: "completed",
    };

    const studentData = {
      id: parseInt(student.id) || 1,
      name: student.name,
      email: student.email,
      registration_number: student.registration_number || "N/A",
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <AssessmentResult
          student={studentData}
          assessments={[assessmentData]}
          topicScores={topicScoresForTemplate}
          getRecommendationText={getRecommendationText}
        />
      </div>
    );
  }

  // Loading state for questions
  if (state.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading questions...</p>
        </div>
      </div>
    );
  }

  // Assessment in progress - show current question
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                AI Industry Readiness Assessment
              </h1>
              <p className="text-gray-600">
                {currentQuestion.section} Section • {currentQuestion.topic}
              </p>
            </div>
            <div className="text-gray-600 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              {formatTime(timeElapsed)}
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>
                {state.currentQuestion + 1}/{state.questions.length}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all"
                style={{
                  width: `${
                    ((state.currentQuestion + 1) / state.questions.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-6">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentQuestion.level === "Basic"
                  ? "bg-green-100 text-green-800"
                  : currentQuestion.level === "Intermediate"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {currentQuestion.level}
            </span>
            <span className="ml-3 text-gray-600">Difficulty Level</span>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left border-2 p-4 rounded-xl transition ${
                    selectedAnswer === index
                      ? "border-blue-500 bg-blue-50 text-blue-800"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 mr-3 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.currentQuestion === state.questions.length - 1
                ? "Finish Assessment"
                : "Next Question"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;