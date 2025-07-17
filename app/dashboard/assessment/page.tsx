
//app/dashboard/assessment/page.tsx
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

interface AssessmentState {
  currentQuestion: number;
  questions: Question[];
  answers: { [key: string]: number };
  topicScores: { [key: string]: TopicScore };
  isCompleted: boolean;
  timeStarted: number;
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

const topicIcons: Record<TopicKey, React.ComponentType<{ className?: string }>> = {
  Python: Code,
  "ML Concepts": Brain,
  "Cloud & Deployment": Cloud,
  "Tools & Git": GitBranch,
  "AI Use Cases": Lightbulb,
  Projects: FolderOpen,
  Math: Calculator,
  "Modern AI Stack Awareness": Brain,
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

  useEffect(() => {
  const saveResult = async () => {
    const student = getStudentData();
    if (!student) return;

    const correctAnswers = Object.keys(state.answers).reduce((acc, key) => {
      const question = state.questions.find((q) => q.id === key);
      if (question && state.answers[key] === question.correctAnswer) {
        acc += 1;
      }
      return acc;
    }, 0);

    const totalQuestions = state.questions.length;
    const scorePercent = (correctAnswers / totalQuestions) * 100;

    await fetch("/api/save-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: parseInt(student.id),
        assessment_id: null, // or pass the actual ID if available
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
        score_percent: scorePercent,
      }),
    });
  };

  if (state.isCompleted) {
    saveResult();
  }
}, [state.isCompleted]);


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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - state.timeStarted) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [state.timeStarted]);

  const currentQuestion = state.questions[state.currentQuestion];

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const calculateTopicScore = (topic: string, answers: { [key: string]: number }) => {
    const topicQuestions = state.questions.filter((q) => q.topic === topic);
    const correctAnswers = topicQuestions.filter((q) => answers[q.id] === q.correctAnswer);
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

  const calculateDetailedTopicScore = (topic: string, answers: { [key: string]: number }): TopicScore => {
    const topicQuestions = state.questions.filter((q) => q.topic === topic);
    const correctAnswers = topicQuestions.filter((q) => answers[q.id] === q.correctAnswer);
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

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = { ...state.answers, [currentQuestion.id]: selectedAnswer };

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
        finalTopicScores[topic] = calculateDetailedTopicScore(topic, newAnswers);
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
    const totalScore = Object.values(state.topicScores).reduce((sum, t) => sum + t.score, 0);
    const maxPossible = state.questions.length * 2.0 * 1.5;
    return Math.min(100, (totalScore / maxPossible) * 100);
  };

  const getStrengthsAndGaps = () => {
    const strengths: string[] = [];
    const gaps: string[] = [];

    Object.values(state.topicScores).forEach((topic) => {
      if (topic.normalizedScore >= 70) strengths.push(topic.topic);
      else if (topic.normalizedScore < 50) gaps.push(topic.topic);
    });

    return { strengths, gaps };
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
      "Modern AI Stack Awareness": "Understand tools like LangChain, Vector DBs, and inference APIs.",
    };
    return map[topic] || "Practice and deepen understanding of this topic.";
  };

  if (state.isCompleted) {
    const score = getReadinessScore();
    const { strengths, gaps } = getStrengthsAndGaps();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <CheckCircle className="text-green-600 w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Assessment Complete!</h1>
              <p className="text-gray-600">Here’s your AI Readiness Report</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-500 rounded-xl p-6 text-white text-center">
                <div className="text-3xl font-bold">{score.toFixed(1)}%</div>
                <div className="text-green-100">Readiness Score</div>
              </div>
              <div className="bg-purple-500 rounded-xl p-6 text-white text-center">
                <div className="text-3xl font-bold">{formatTime(timeElapsed)}</div>
                <div className="text-purple-100">Time Taken</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <CheckCircle className="mr-2 w-5 h-5" /> Strengths
                </h3>
                {strengths.length > 0 ? (
                  strengths.map((topic, idx) => {
                    const Icon = topicIcons[topic as TopicKey];
                    return (
                      <div key={idx} className="flex items-center bg-white p-3 rounded-lg">
                        {Icon && <Icon className="text-green-600 w-5 h-5 mr-3" />}
                        <span className="text-gray-700">{topic}</span>
                        <span className="ml-auto text-green-600 font-semibold">
                          {state.topicScores[topic]?.normalizedScore.toFixed(0)}%
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-green-700">Keep improving!</p>
                )}
              </div>

              {/* Gaps */}
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                  <XCircle className="mr-2 w-5 h-5" /> Areas to Improve
                </h3>
                {gaps.length > 0 ? (
                  gaps.map((topic, idx) => {
                    const Icon = topicIcons[topic as TopicKey];
                    return (
                      <div key={idx} className="flex items-center bg-white p-3 rounded-lg">
                        {Icon && <Icon className="text-red-600 w-5 h-5 mr-3" />}
                        <span className="text-gray-700">{topic}</span>
                        <span className="ml-auto text-red-600 font-semibold">
                          {state.topicScores[topic]?.normalizedScore.toFixed(0)}%
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-red-700">No major gaps identified.</p>
                )}
              </div>
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Recommendations</h3>
              <div className="space-y-3">
                {gaps.length > 0 ? (
                  gaps.map((topic, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg">
                      <div className="font-medium text-gray-900">{topic}</div>
                      <div className="text-gray-600 text-sm mt-1">{getRecommendationText(topic)}</div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-4 rounded-lg">
                    <div className="font-medium text-gray-900">Awesome work!</div>
                    <div className="text-gray-600 text-sm mt-1">
                      You’re performing well across all topics. Try advanced capstone projects!
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.questions.length === 0) {
    return <div className="p-10 text-center text-lg text-gray-700">Loading questions...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Industry Readiness Assessment</h1>
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
                  width: `${((state.currentQuestion + 1) / state.questions.length) * 100}%`,
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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestion.question}</h2>
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition disabled:opacity-50"
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
