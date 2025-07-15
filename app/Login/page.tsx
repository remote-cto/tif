"use client";
import React, { useState, useEffect } from "react";
import { Mail, Hash, GraduationCap, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "../components/Footer";
import Image from "next/image";
import NewHeader from "../components/NewHeader";

const LoginPage: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [colleges, setColleges] = useState<{ id: string; name: string }[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(true);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch colleges on mount
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await fetch("/api/colleges");
        const data = await res.json();

        if (res.ok) {
          // Ensure id is treated as string
          setColleges(
            data.colleges.map((college: any) => ({
              id: String(college.id),
              name: college.name,
            }))
          );
        } else {
          setError("Failed to load colleges");
        }
      } catch (err) {
        console.error("College fetch error:", err);
        setError("Something went wrong while loading colleges");
      } finally {
        setLoadingColleges(false);
      }
    };

    fetchColleges();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const selectedCollege = colleges.find((c) => c.id === collegeId);
    if (!selectedCollege) {
      setError("Please select a valid college");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          registration_number: registrationNumber,
          college_name: selectedCollege.name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store student data in sessionStorage for dashboard access
        const studentData = {
          id: data.student.id,
          name: data.student.name,
          email: email,
          registration_number: registrationNumber,
          college_name: selectedCollege.name,
        };

        sessionStorage.setItem("studentData", JSON.stringify(studentData));

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <NewHeader />
      <div className="min-h-screen bg-white py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-4">
            <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mb-4 mt-25">
              <LogIn className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Student Login
            </h1>
            <p className="text-gray-600">Access your XWORKS account</p>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-white rounded-xl shadow-lg border p-8 space-y-6"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Registration Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                  placeholder="Enter registration number"
                  required
                />
              </div>
            </div>

            {/* College Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  value={collegeId}
                  onChange={(e) => setCollegeId(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                  disabled={loadingColleges}
                  required
                >
                  <option value="">
                    {loadingColleges
                      ? "Loading colleges..."
                      : "Select your college"}
                  </option>
                  {colleges.map((college) => (
                    <option key={college.id} value={college.id}>
                      {college.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-600 text-sm">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                loading
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center mt-4 text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                href="/Register"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Register here
              </Link>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LoginPage;
