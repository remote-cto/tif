"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";

const DashboardPage = () => {
  const router = useRouter();

  const handleStartAssessment = () => {
    // Navigate to the assessment page
    router.push("/dashboard/assessment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-6 py-12">
      <div className="max-w-4xl mx-auto text-center">
        {/* Welcome Section */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Your Dashboard
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          You’ve successfully logged in to XWORKS. Get started by taking your first assessment.
        </p>

        {/* Start Assessment Button */}
        <button
          onClick={handleStartAssessment}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold text-lg rounded-xl shadow hover:bg-blue-700 transition duration-200"
        >
          <Rocket className="w-5 h-5" />
          Start Your Assessment
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
