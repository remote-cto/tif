//app/dashboard/assessment/page.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Brain, Code, Cloud, GitBranch, Lightbulb, Calculator, FolderOpen } from 'lucide-react';

// Types
interface Question {
  id: string;
  topic: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  correctAnswer: number;
  section: 'Foundational' | 'Industrial';
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

// Type for topic weights
type TopicKey = 'ML Concepts' | 'Python' | 'Cloud & Deployment' | 'Tools & Git' | 'AI Use Cases' | 'Projects' | 'Math';

// Type for difficulty levels
type DifficultyKey = 'Basic' | 'Intermediate' | 'Advanced';

// Mock questions data
const mockQuestions: Question[] = [
  {
    id: '1',
    topic: 'Python',
    level: 'Basic',
    section: 'Foundational',
    question: 'What is the correct way to create a list in Python?',
    options: ['list = []', 'list = ()', 'list = {}', 'list = ""'],
    correctAnswer: 0
  },
  {
    id: '2',
    topic: 'ML Concepts',
    level: 'Basic',
    section: 'Foundational',
    question: 'What is supervised learning?',
    options: [
      'Learning without labeled data',
      'Learning with input-output pairs',
      'Learning through trial and error',
      'Learning without any data'
    ],
    correctAnswer: 1
  },
  {
    id: '3',
    topic: 'Cloud & Deployment',
    level: 'Intermediate',
    section: 'Industrial',
    question: 'Which AWS service is primarily used for hosting web applications?',
    options: ['S3', 'EC2', 'RDS', 'Lambda'],
    correctAnswer: 1
  },
  {
    id: '4',
    topic: 'Tools & Git',
    level: 'Basic',
    section: 'Foundational',
    question: 'What command is used to clone a Git repository?',
    options: ['git clone', 'git pull', 'git push', 'git init'],
    correctAnswer: 0
  },
  {
    id: '5',
    topic: 'AI Use Cases',
    level: 'Intermediate',
    section: 'Industrial',
    question: 'Which of the following is NOT a typical AI use case?',
    options: ['Image recognition', 'Natural language processing', 'Database indexing', 'Recommendation systems'],
    correctAnswer: 2
  },
  {
    id: '6',
    topic: 'Math',
    level: 'Advanced',
    section: 'Foundational',
    question: 'What is the derivative of x²?',
    options: ['2x', 'x²', '2', 'x'],
    correctAnswer: 0
  }
];

// Topic weights and difficulty weights
const topicWeights: Record<TopicKey, number> = {
  'ML Concepts': 1.2,
  'Python': 1.0,
  'Cloud & Deployment': 1.5,
  'Tools & Git': 1.1,
  'AI Use Cases': 1.1,
  'Projects': 0.9,
  'Math': 0.8
};

const difficultyWeights: Record<DifficultyKey, number> = {
  'Basic': 1.0,
  'Intermediate': 1.5,
  'Advanced': 2.0
};

const topicIcons: Record<TopicKey, React.ComponentType<{ className?: string }>> = {
  'Python': Code,
  'ML Concepts': Brain,
  'Cloud & Deployment': Cloud,
  'Tools & Git': GitBranch,
  'AI Use Cases': Lightbulb,
  'Projects': FolderOpen,
  'Math': Calculator
};

const AssessmentPage: React.FC = () => {
  const [state, setState] = useState<AssessmentState>({
    currentQuestion: 0,
    questions: mockQuestions,
    answers: {},
    topicScores: {},
    isCompleted: false,
    timeStarted: Date.now()
  });

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - state.timeStarted) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [state.timeStarted]);

  const currentQuestion = state.questions[state.currentQuestion];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const calculateTopicScore = (topic: string, answers: { [key: string]: number }): number => {
    const topicQuestions = state.questions.filter(q => q.topic === topic);
    if (topicQuestions.length === 0) return 0;
    
    const correctAnswers = topicQuestions.filter(q => answers[q.id] === q.correctAnswer);
    
    const levels = { Basic: 0, Intermediate: 0, Advanced: 0 };
    correctAnswers.forEach(q => {
      levels[q.level]++;
    });

    const totalCorrect = correctAnswers.length;
    if (totalCorrect === 0) return 0;

    const levelAvg = (
      levels.Basic * difficultyWeights.Basic +
      levels.Intermediate * difficultyWeights.Intermediate +
      levels.Advanced * difficultyWeights.Advanced
    ) / totalCorrect;

    const topicWeight = topicWeights[topic as TopicKey] || 1.0;
    const topicScore = totalCorrect * levelAvg * topicWeight;
    return topicScore;
  };

  const calculateDetailedTopicScore = (topic: string, answers: { [key: string]: number }): TopicScore => {
    const topicQuestions = state.questions.filter(q => q.topic === topic);
    const correctAnswers = topicQuestions.filter(q => answers[q.id] === q.correctAnswer);
    
    const levels = { Basic: 0, Intermediate: 0, Advanced: 0 };
    correctAnswers.forEach(q => {
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
      normalizedScore
    };
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = { ...state.answers, [currentQuestion.id]: selectedAnswer };

    if (state.currentQuestion < state.questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        answers: newAnswers
      }));
      setSelectedAnswer(null);
    } else {
      // Calculate final scores
      const finalTopicScores: { [key: string]: TopicScore } = {};
      Object.keys(topicWeights).forEach(topic => {
        finalTopicScores[topic] = calculateDetailedTopicScore(topic, newAnswers);
      });

      setState(prev => ({
        ...prev,
        answers: newAnswers,
        topicScores: finalTopicScores,
        isCompleted: true
      }));
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getReadinessScore = (): number => {
    const totalScore = Object.values(state.topicScores).reduce((sum, topic) => sum + topic.score, 0);
    const maxPossible = state.questions.length * 2.0 * 1.5; // Max difficulty * Max topic weight
    return Math.min(100, (totalScore / maxPossible) * 100);
  };

  const getStrengthsAndGaps = (): { strengths: string[], gaps: string[] } => {
    const strengths: string[] = [];
    const gaps: string[] = [];
    
    Object.values(state.topicScores).forEach(topic => {
      if (topic.normalizedScore >= 70) {
        strengths.push(topic.topic);
      } else if (topic.normalizedScore < 50) {
        gaps.push(topic.topic);
      }
    });

    return { strengths, gaps };
  };

  const getRecommendationText = (gap: string): string => {
    const recommendations: Record<string, string> = {
      'Python': 'Practice Python basics on W3Schools or build small projects like calculator, to-do app.',
      'ML Concepts': 'Take an ML course on Coursera focusing on supervised models and implement real ML models.',
      'Cloud & Deployment': 'Build a CI/CD pipeline using GitHub Actions and AWS, practice with EC2 and S3.',
      'Tools & Git': 'Learn Git basics, practice with GitHub, and explore development tools and IDEs.',
      'AI Use Cases': 'Study real-world AI applications and practice implementing AI solutions for business problems.',
      'Math': 'Review linear algebra, statistics, and calculus fundamentals for machine learning.',
      'Projects': 'Build end-to-end projects that demonstrate your skills and understanding of the full development lifecycle.'
    };
    return recommendations[gap] || 'Focus on improving your understanding of this topic through practice and study.';
  };

  if (state.isCompleted) {
    const readinessScore = getReadinessScore();
    const { strengths, gaps } = getStrengthsAndGaps();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
              <p className="text-gray-600">Here's your AI Industry Readiness Report</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white text-center">
                <div className="text-3xl font-bold">{readinessScore.toFixed(1)}%</div>
                <div className="text-green-100">Assessment Score</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white text-center">
                <div className="text-3xl font-bold">{formatTime(timeElapsed)}</div>
                <div className="text-purple-100">Time Taken</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Your Strengths
                </h3>
                {strengths.length > 0 ? (
                  <div className="space-y-2">
                    {strengths.map((strength, index) => {
                      const IconComponent = topicIcons[strength as TopicKey];
                      return (
                        <div key={index} className="flex items-center p-3 bg-white rounded-lg">
                          {IconComponent && <IconComponent className="w-5 h-5 text-green-600 mr-3" />}
                          <span className="text-gray-700">{strength}</span>
                          <span className="ml-auto text-green-600 font-semibold">
                            {state.topicScores[strength]?.normalizedScore.toFixed(0)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-green-700">Keep practicing to develop your strengths!</p>
                )}
              </div>

              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                  <XCircle className="w-5 h-5 mr-2" />
                  Areas for Improvement
                </h3>
                {gaps.length > 0 ? (
                  <div className="space-y-2">
                    {gaps.map((gap, index) => {
                      const IconComponent = topicIcons[gap as TopicKey];
                      return (
                        <div key={index} className="flex items-center p-3 bg-white rounded-lg">
                          {IconComponent && <IconComponent className="w-5 h-5 text-red-600 mr-3" />}
                          <span className="text-gray-700">{gap}</span>
                          <span className="ml-auto text-red-600 font-semibold">
                            {state.topicScores[gap]?.normalizedScore.toFixed(0)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-red-700">Great job! No major gaps identified.</p>
                )}
              </div>
            </div>

            <div className="mt-8 bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Recommendations</h3>
              <div className="space-y-3">
                {gaps.length > 0 ? (
                  gaps.map((gap, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg">
                      <div className="font-medium text-gray-900">{gap}</div>
                      <div className="text-gray-600 text-sm mt-1">
                        {getRecommendationText(gap)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-4 rounded-lg">
                    <div className="font-medium text-gray-900">Great Performance!</div>
                    <div className="text-gray-600 text-sm mt-1">
                      You're showing strong performance across all areas. Consider taking on more advanced projects to further develop your skills.
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Industry Readiness Assessment</h1>
              <p className="text-gray-600">{currentQuestion.section} Section • {currentQuestion.topic}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                {formatTime(timeElapsed)}
              </div>
            </div>
          </div>

          {/* Simple Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">
                {state.currentQuestion + 1} / {state.questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((state.currentQuestion + 1) / state.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Level Badge */}
          <div className="flex items-center mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentQuestion.level === 'Basic' ? 'bg-green-100 text-green-800' :
              currentQuestion.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentQuestion.level}
            </span>
            <span className="ml-3 text-gray-600">Difficulty Level</span>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium mr-3">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {state.currentQuestion === state.questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;