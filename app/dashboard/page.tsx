"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Rocket, User, Mail, Hash, GraduationCap, LogOut } from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  email: string;
  registration_number: string;
  college_name: string;
}

const DashboardPage = () => {
  const router = useRouter();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get student data from sessionStorage (set during login)
    const storedStudentData = sessionStorage.getItem("studentData");
    if (storedStudentData) {
      setStudentData(JSON.parse(storedStudentData));
    } else {
      // If no student data, redirect to login
      router.push("/Login");
    }
    setLoading(false);
  }, [router]);

  const handleStartAssessment = () => {
    // Navigate to the assessment page
    router.push("/dashboard/assessment");
  };

  const handleLogout = () => {
    // Clear session data and redirect to login
    sessionStorage.removeItem("studentData");
    router.push("/Login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome to Your Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <div className="text-center mb-6">
                <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {studentData.name}
                </h2>
                <p className="text-gray-600">Student Profile</p>
              </div>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-900">{studentData.email}</p>
                  </div>
                </div>

                {/* Registration Number */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Hash className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Registration Number
                    </p>
                    <p className="text-sm text-gray-900">
                      {studentData.registration_number}
                    </p>
                  </div>
                </div>

                {/* College */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">College</p>
                    <p className="text-sm text-gray-900">
                      {studentData.college_name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border p-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  You've successfully logged in to XWORKS. Take your first
                  assessment to begin your journey.
                </p>

                {/* Start Assessment Button */}
                <button
                  onClick={handleStartAssessment}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-xl shadow hover:bg-blue-700 transition duration-200"
                >
                  <Rocket className="w-5 h-5" />
                  Start Your Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
