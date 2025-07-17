//app/Login/Page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Mail, Hash, GraduationCap, LogIn, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "../components/Footer";
import NewHeader from "../components/NewHeader";
import { getStudentData } from "@/utils/getStudentData";

const LoginPage: React.FC = () => {
  const router = useRouter();

  const [loginType, setLoginType] = useState<"student" | "admin">("student");

  const [email, setEmail] = useState("");
  const [passwordOrRegNo, setPasswordOrRegNo] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [colleges, setColleges] = useState<{ id: string; name: string }[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const student = getStudentData(); // your helper from utils
  const admin = sessionStorage.getItem("adminData");

  if (student) {
    router.push("/dashboard");
  } else if (admin) {
    router.push("/dean-dashboard");
  }
}, []);


  // Fetch colleges on mount
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await fetch("/api/colleges");
        const data = await res.json();

        if (res.ok) {
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

  const handleStudentLogin = async (e: React.FormEvent) => {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          registration_number: passwordOrRegNo,
          college_name: selectedCollege.name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem(
          "studentData",
          JSON.stringify({
            id: data.student.id,
            name: data.student.name,
            email,
            registration_number: passwordOrRegNo,
            college_name: selectedCollege.name,
          })
        );
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

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/college-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: passwordOrRegNo }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("adminData", JSON.stringify(data.admin));
        router.push("/dean-dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Admin login failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <NewHeader />
      <div className="min-h-screen bg-white py-2 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-4">
            <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <LogIn className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {loginType === "student"
                ? "Student Login"
                : "College Admin Login"}
            </h1>
            <p className="text-gray-600">
              {loginType === "student"
                ? "Access your XWORKS student account"
                : "Access your Dean/College Admin dashboard"}
            </p>
          </div>

          {/* Toggle Login Type */}
          <div className="flex justify-center mb-6">
            <button
              className={`px-4 py-2 rounded-l-lg border font-medium ${
                loginType === "student"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setLoginType("student")}
            >
              Student
            </button>
            <button
              className={`px-4 py-2 rounded-r-lg border font-medium ${
                loginType === "admin"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setLoginType("admin")}
            >
              College Admin
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={
              loginType === "student" ? handleStudentLogin : handleAdminLogin
            }
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

            {/* Password / Reg. No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {loginType === "student" ? "Registration Number" : "Password"}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 w-5 h-5 text-gray-400">
                  {loginType === "student" ? <Hash /> : <Lock />}
                </div>
                <input
                  type={loginType === "student" ? "text" : (showPassword ? "text" : "password")}
                  value={passwordOrRegNo}
                  onChange={(e) => setPasswordOrRegNo(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                  placeholder={
                    loginType === "student"
                      ? "Enter registration number"
                      : "Enter your password"
                  }
                  required
                />
                {loginType === "admin" && (
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3 w-5 h-5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                )}
              </div>
            </div>

            {/* College Dropdown (only for student) */}
            {loginType === "student" && (
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
            )}

            {/* Error */}
            {error && <p className="text-red-600 text-sm">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                loading
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading
                ? "Logging in..."
                : loginType === "student"
                ? "Login as Student"
                : "Login as Admin"}
            </button>

            {/* Registration link for students */}
            {loginType === "student" && (
              <div className="text-center mt-4 text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/Register"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Register here
                </Link>
              </div>
            )}
          </form>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LoginPage;