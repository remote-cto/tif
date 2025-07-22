//app/dean-dashboard/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

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
  //foundation_score?: number;
  //industrial_score?: number;
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
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [admin, setAdmin] = useState<Admin>({});
  const [college, setCollege] = useState<College | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const roleOptions = [{ value: "ai-assessment", label: "AI Assessment" }];

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
      } catch (err) {
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
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

  const openStudentDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedStudent(null);
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
                window.location.href = "/Login";
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

        {/* Role Selection Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <label
              htmlFor="role-select"
              className="text-lg font-semibold text-slate-700"
            >
              Select Combo:
            </label>
            <select
              id="role-select"
              value={selectedRole}
              onChange={handleRoleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
            >
              <option value="">Choose an AI assessment</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Students List - Show only when role is selected */}
        {selectedRole && students.length === 0 && !error && (
          <div className="text-gray-500 text-center mt-10">
            No students found.
          </div>
        )}

        {selectedRole && students.length > 0 && (
          <>
            <div className="text-3xl font-bold text-slate-800 mb-6 text-center">
              Students Performance -{" "}
              {roleOptions.find((r) => r.value === selectedRole)?.label}
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Basic Score
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Score
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Readiness
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-700">
                              {student.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Reg:</span>{" "}
                              {student.registration_number}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Email:</span>{" "}
                              {student.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {student.assessments &&
                          student.assessments.length > 0 ? (
                            <span
                              className={`text-lg font-semibold ${getScoreColor(
                                student.assessments[0].score_percent
                              )}`}
                            >
                              {student.assessments[0].score}/
                              {student.assessments[0].total_questions}(
                              {student.assessments[0].score_percent?.toFixed(1)}
                              %)
                            </span>
                          ) : (
                            <span className="text-gray-400">No data</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {student.assessments &&
                          student.assessments.length > 0 &&
                          student.assessments[0].total_score !== undefined ? (
                            <span
                              className={`text-lg font-semibold ${getScoreColor(
                                student.assessments[0].total_score
                              )}`}
                            >
                              {student.assessments[0].total_score?.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-gray-400">No data</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {student.assessments &&
                          student.assessments.length > 0 &&
                          student.assessments[0].readiness_score !==
                            undefined ? (
                            <span
                              className={`text-lg font-semibold ${getScoreColor(
                                student.assessments[0].readiness_score
                              )}`}
                            >
                              {student.assessments[0].readiness_score?.toFixed(
                                1
                              )}
                              %
                            </span>
                          ) : (
                            <span className="text-gray-400">No data</span>
                          )}
                        </td>
                        
                       
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              // Navigate to assessment report page with student data
                              sessionStorage.setItem(
                                "selectedStudentData",
                                JSON.stringify(student)
                              );
                              window.location.href = `/dean-assessment-report?student_id=${student.id}`;
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            View Assessment Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {!selectedRole && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Please select a role to view students data
            </p>
          </div>
        )}
      </div>

      {/* Popup Modal for Student Details */}
      {isPopupOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Popup Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-700">
                  {selectedStudent.name} - Detailed Performance
                </h2>
                <p className="text-sm text-gray-600">
                  Reg: {selectedStudent.registration_number} | Email:{" "}
                  {selectedStudent.email}
                </p>
              </div>
              <button
                onClick={closePopup}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Popup Content */}
            <div className="p-6">
              {/* Assessment Overview */}
              {selectedStudent.assessments &&
                selectedStudent.assessments.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-slate-700 mb-4">
                      📈 Assessment Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedStudent.assessments.map((assessment) => (
                        <div
                          key={assessment.id}
                          className="bg-gray-50 rounded-lg p-4 border"
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
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">
                                Basic Score:
                              </span>
                              <span
                                className={`text-sm font-semibold ${getScoreColor(
                                  assessment.score_percent
                                )}`}
                              >
                                {assessment.score}/{assessment.total_questions}{" "}
                                ({assessment.score_percent?.toFixed(1)}%)
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
                  </div>
                )}

              {/* Topic-wise Performance */}
              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">
                  📊 Topic-wise Performance
                </h3>

                {selectedStudent.topicScores &&
                selectedStudent.topicScores.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedStudent.topicScores.map((topic, index) => (
                      <div
                            key={`${selectedStudent.id}-${topic.topic_id}-${index}`}

                        className="bg-white rounded-lg p-4 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
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

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Correct:</span>
                            <span className="font-medium">
                              {topic.correct_answers}/{topic.total_questions}
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
                              {Number(topic.weighted_score || 0).toFixed(1)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Normalized:</span>
                            <span
                              className={`font-medium ${getScoreColor(
                                Number(topic.normalized_score)
                              )}`}
                            >
                              {Number(topic.normalized_score || 0).toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-500 ${
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeanDashboard;
