"use client";
import React, { useEffect, useState } from "react";

interface Student {
  id: number;
  name: string;
  registration_number: string;
  email: string;
}

interface Admin {
  college_id?: number;
}

const DeanDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const adminData = sessionStorage.getItem("adminData");
    const admin: Admin = adminData ? JSON.parse(adminData) : {};

    if (!admin.college_id) {
      setError("Invalid session. Please log in again.");
      return;
    }

    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `/api/college-students?college_id=${admin.college_id}`
        );
        if (!res.ok) throw new Error("Network error");

        const data = await res.json();
        setStudents(data.students || []);
      } catch (err) {
        setError("Failed to load students. Please try again later.");
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">
          🎓 Dean Dashboard
        </h1>

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
        <div className="text-3xl font-bold text-slate-800 mb-6 text-center">
          Students Information
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((s) => (
            <div
              key={s.id}
              className="bg-white shadow-md border border-gray-200 rounded-lg p-5 hover:shadow-lg transition duration-300"
            >
              <h2 className="text-xl font-semibold text-slate-700 mb-1">
                {s.name}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-slate-600">Reg No:</span>{" "}
                {s.registration_number}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-slate-600">Email:</span>{" "}
                {s.email}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeanDashboard;
