"use client";

import React, { useEffect, useState } from "react";

interface Student {
  id: number;
  name: string;
  registration_number: string;
  email: string;
  assessments?: AssessmentResult[];
  topicScores?: TopicScore[];
}

interface AssessmentResult {
  id: number;
  score: number;
  total_questions: number;
  score_percent: number;
  attempted_at: string;
  total_score?: number;
  readiness_score?: number;
  status?: string;
}

interface TopicScore {
  topic_id: number;
  topic_name: string;
  correct_answers: number;
  total_questions: number;
  weighted_score: number;
  normalized_score: number;
  classification: string;
}

interface Admin {
  id?: number;
  name?: string;
  college_id?: number;
  email?: string;
}

interface College {
  id: number;
  name: string;
}

const DeanDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [admin, setAdmin] = useState<Admin>({});
  const [college, setCollege] = useState<College | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedStudent, setExpandedStudent] = useState<number | null>(null);

  useEffect(() => {
    const adminData = sessionStorage.getItem("adminData");
    const adminInfo: Admin = adminData ? JSON.parse(adminData) : {};

    if (!adminInfo.college_id) {
      setError("Invalid session. Please log in again.");
      setLoading(false);
      return;
    }

    setAdmin(adminInfo);

    const fetchData = async () => {
      try {
        // Fetch college information
        const collegeRes = await fetch(
          `/api/college-info?college_id=${adminInfo.college_id}`
        );
        if (collegeRes.ok) {
          const collegeData = await collegeRes.json();
          setCollege(collegeData.college);
        }

        // Fetch students with results
        const studentsRes = await fetch(
          `/api/college-students?college_id=${adminInfo.college_id}`
        );
        if (!studentsRes.ok) throw new Error("Network error");

        const studentsData = await studentsRes.json();
        const studentsWithScores = studentsData.students || [];

        // Fetch topic scores for each student
        for (const student of studentsWithScores) {
          try {
            const topicScoresRes = await fetch(
              `/api/student-topic-scores?student_id=${student.id}`
            );
            if (topicScoresRes.ok) {
              const topicScoresData = await topicScoresRes.json();
              student.topicScores = topicScoresData.scores || [];
            }
          } catch (err) {
            console.error(
              `Error fetching topic scores for student ${student.id}:`,
              err
            );
          }
        }

        setStudents(studentsWithScores);
        setFilteredStudents(studentsWithScores);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter students based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((student) =>
        student.registration_number
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Strength":
        return "bg-green-100 text-green-800 border-green-200";
      case "Gap":
        return "bg-red-100 text-red-800 border-red-200";
      case "Optional":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const toggleStudentExpansion = (studentId: number) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Admin and College Info */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl md:text-5xl font-bold text-slate-800 text-center">
              🎓 XWORKS- TIF DASHBOARD
            </h1>
            <button
              onClick={() => {
                sessionStorage.removeItem("adminData");
                window.location.href = "/login"; // Redirect to login route
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
              <div>
                <p className="text-sm text-blue-600 font-medium">Admin Name</p>
                <p className="text-lg font-semibold text-slate-800">
                  {admin.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  College Name
                </p>
                <p className="text-lg font-semibold text-slate-800">
                  {college?.name || "Loading..."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {students.length === 0 && !error && (
          <div className="text-gray-500 text-center mt-10">
            No students found.
          </div>
        )}

        {students.length > 0 && (
          <>
            {/* Search Section */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by registration number, name, or email..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    Clear
                  </button>
                )}
                <div className="text-sm text-gray-600">
                  {filteredStudents.length} of {students.length} students
                </div>
              </div>
            </div>

            <div className="text-3xl font-bold text-slate-800 mb-6 text-center">
              Students Performance
            </div>

            {filteredStudents.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  No students found matching "{searchQuery}"
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Try searching by registration number, name, or email
                </p>
              </div>
            )}

            <div className="space-y-6">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="bg-white shadow-md border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Student Basic Info */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-semibold text-slate-700 mb-2">
                          {student.name}
                        </h2>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium text-slate-600">
                            Reg No:
                          </span>{" "}
                          <span className="bg-blue-50 px-2 py-1 rounded text-blue-700 font-medium">
                            {student.registration_number}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-slate-600">
                            Email:
                          </span>{" "}
                          {student.email}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleStudentExpansion(student.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        {expandedStudent === student.id
                          ? "Hide Details"
                          : "View Details"}
                      </button>
                    </div>

                    {/* Assessment Overview */}
                    {student.assessments && student.assessments.length > 0 && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {student.assessments.map((assessment) => (
                          <div
                            key={assessment.id}
                            className="bg-gray-50 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-600">
                                Assessment
                              </span>
                              <span
                                className={`text-sm px-2 py-1 rounded-full ${
                                  assessment.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : assessment.status === "in_progress"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {assessment.status || "completed"}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                  Basic Score:
                                </span>
                                <span
                                  className={`text-sm font-semibold ${getScoreColor(
                                    assessment.score_percent
                                  )}`}
                                >
                                  {assessment.score}/
                                  {assessment.total_questions} (
                                  {assessment.score_percent?.toFixed(1)}%)
                                </span>
                              </div>
                              {assessment.total_score !== undefined && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">
                                    Total Score:
                                  </span>
                                  <span
                                    className={`text-sm font-semibold ${getScoreColor(
                                      assessment.total_score
                                    )}`}
                                  >
                                    {assessment.total_score?.toFixed(1)}
                                  </span>
                                </div>
                              )}
                              {assessment.readiness_score !== undefined && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">
                                    Readiness:
                                  </span>
                                  <span
                                    className={`text-sm font-semibold ${getScoreColor(
                                      assessment.readiness_score
                                    )}`}
                                  >
                                    {assessment.readiness_score?.toFixed(1)}%
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                  Date:
                                </span>
                                <span className="text-sm text-gray-800">
                                  {new Date(
                                    assessment.attempted_at
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {expandedStudent === student.id && (
                    <div className="p-6 bg-gray-50">
                      <h3 className="text-lg font-semibold text-slate-700 mb-4">
                        📊 Topic-wise Performance
                      </h3>

                      {student.topicScores && student.topicScores.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {student.topicScores.map((topic, index) => (
                            <div
                              key={`${student.id}-${topic.topic_id}-${index}`}
                              className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-sm font-medium text-slate-700 flex-1">
                                  {topic.topic_name}
                                </h4>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full border ${getClassificationColor(
                                    topic.classification
                                  )}`}
                                >
                                  {topic.classification}
                                </span>
                              </div>

                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Correct:
                                  </span>
                                  <span className="font-medium">
                                    {topic.correct_answers}/
                                    {topic.total_questions}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Weighted Score:
                                  </span>
                                  <span
                                    className={`font-medium ${getScoreColor(
                                      Number(topic.weighted_score)
                                    )}`}
                                  >
                                    {Number(topic.weighted_score || 0).toFixed(
                                      1
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Normalized:
                                  </span>
                                  <span
                                    className={`font-medium ${getScoreColor(
                                      Number(topic.normalized_score)
                                    )}`}
                                  >
                                    {Number(
                                      topic.normalized_score || 0
                                    ).toFixed(1)}
                                    %
                                  </span>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div className="mt-3">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      Number(topic.normalized_score) >= 80
                                        ? "bg-green-500"
                                        : Number(topic.normalized_score) >= 60
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`}
                                    style={{
                                      width: `${Math.min(
                                        Number(topic.normalized_score || 0),
                                        100
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">
                            No topic-wise scores available for this student.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* No Assessment Message */}
                  {(!student.assessments ||
                    student.assessments.length === 0) && (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">
                        No assessments completed yet.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeanDashboard;