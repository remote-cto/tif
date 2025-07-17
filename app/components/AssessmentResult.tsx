// components/AssessmentResultTemplate.tsx
"use client";

import React, { useEffect } from "react";
import Chart from "chart.js/auto";

interface TopicScore {
  topic: string;
  score: number; // normalized score (0-100)
}

interface Props {
  student: {
    name: string;
    email: string;
    department?: string;
  };
  readiness: number;
  topicScores: TopicScore[];
  strengths: string[];
  gaps: string[];
  getRecommendationText: (topic: string) => string;
}

const AssessmentResult: React.FC<Props> = ({
  student,
  readiness,
  topicScores,
  strengths,
  gaps,
  getRecommendationText,
}) => {
  useEffect(() => {
    const radarLabels = topicScores.map((t) => t.topic);
    const radarData = topicScores.map((t) => t.score);

    const canvas = document.getElementById("radarChart") as HTMLCanvasElement;
    if (!canvas) return;

    const chart = new Chart(canvas, {
      type: "radar",
      data: {
        labels: radarLabels,
        datasets: [
          {
            label: "Skill Level (%)",
            data: radarData,
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            borderColor: "rgba(99, 102, 241, 1)",
            pointBackgroundColor: "rgba(99, 102, 241, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(99, 102, 241, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 100,
            grid: { color: "#ddd" },
            pointLabels: { 
              font: { size: 12 },
              color: "#374151"
            },
            ticks: {
              color: "#6b7280"
            }
          },
        },
        plugins: { 
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.parsed.r.toFixed(1)}%`;
              }
            }
          }
        },
      },
    });

    return () => chart.destroy();
  }, [topicScores]);

  const placementStatus =
    readiness >= 80 ? "Ready" : readiness >= 60 ? "Almost Ready" : "Needs Improvement";

  const getStatusColor = () => {
    if (readiness >= 80) return "bg-green-100 text-green-800";
    if (readiness >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="max-w-5xl mx-auto glass p-6 sm:p-10 space-y-10">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-indigo-700 mb-2">🚀 Skill Assessment Report</h1>
        <p className="text-sm text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Profile */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-lg">
            <strong className="text-gray-700">Name:</strong> <span className="text-gray-900">{student.name}</span>
          </p>
          <p className="text-lg">
            <strong className="text-gray-700">Email:</strong> <span className="text-gray-900">{student.email}</span>
          </p>
          
        </div>
        <div className="text-center sm:text-right">
          <p className="text-lg text-indigo-700 font-semibold mb-2">🎯 Industry Readiness</p>
          <p className="text-5xl font-bold text-indigo-600 mb-2">{readiness.toFixed(1)}%</p>
          <p className="text-sm text-gray-500">Target Role: AI Developer</p>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📌 Skill Radar Overview</h2>
        <div className="relative h-80">
          <canvas id="radarChart"></canvas>
        </div>
      </div>

      {/* Bar Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📊 Skill Scores Breakdown</h2>
        <div className="space-y-6">
          {topicScores.map((skill, i) => (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{skill.topic}</span>
                <span className="text-sm font-semibold text-blue-700">{skill.score.toFixed(0)}%</span>
              </div>
              <div className="h-4 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${skill.score}%`,
                    background: skill.score >= 70 
                      ? "linear-gradient(to right, #10b981, #059669)" 
                      : skill.score >= 50 
                      ? "linear-gradient(to right, #f59e0b, #d97706)"
                      : "linear-gradient(to right, #ef4444, #dc2626)",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths and Gaps */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-200">
          <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center">
            <span className="mr-2">✅</span> Strengths
          </h3>
          <div className="space-y-2">
            {strengths.length > 0 ? (
              strengths.map((strength, i) => (
                <div key={i} className="flex items-center p-2 bg-white rounded-lg">
                  <span className="text-green-600 mr-2">•</span>
                  <span className="text-green-800 text-sm">{strength}</span>
                </div>
              ))
            ) : (
              <p className="text-green-700 text-sm italic">Keep working to build your strengths!</p>
            )}
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-200">
          <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center">
            <span className="mr-2">🚧</span> Areas to Improve
          </h3>
          <div className="space-y-2">
            {gaps.length > 0 ? (
              gaps.map((gap, i) => (
                <div key={i} className="flex items-center p-2 bg-white rounded-lg">
                  <span className="text-red-600 mr-2">•</span>
                  <span className="text-red-800 text-sm">{gap}</span>
                </div>
              ))
            ) : (
              <p className="text-red-700 text-sm italic">No major gaps identified. Great job!</p>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-200">
        <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center">
          <span className="mr-2">📈</span> Personalized Recommendations
        </h3>
        <div className="space-y-3">
          {gaps.length > 0 ? (
            gaps.map((gap, i) => (
              <div key={i} className="bg-white p-4 rounded-lg border-l-4 border-blue-400">
                <div className="font-medium text-blue-900 mb-1">{gap}</div>
                <div className="text-blue-700 text-sm">{getRecommendationText(gap)}</div>
              </div>
            ))
          ) : (
            <div className="bg-white p-4 rounded-lg border-l-4 border-green-400">
              <div className="font-medium text-green-900 mb-1">Excellent Performance!</div>
              <div className="text-green-700 text-sm">
                You're performing well across all areas. Consider taking on advanced capstone projects 
                and contributing to open-source AI projects to further enhance your skills.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Final Status */}
      <div className="text-center">
        <div className={`inline-flex items-center px-8 py-4 rounded-full text-lg font-semibold shadow-lg ${getStatusColor()}`}>
          <span className="mr-2">🎖️</span>
          <span>Placement Status: {placementStatus}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Based on your performance across all assessment areas
        </p>
      </div>
    </div>
  );
};

export default AssessmentResult;