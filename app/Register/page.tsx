"use client";
import React, { useState } from "react";
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  Hash,
  ChevronDown,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react";
import Footer from "../components/Footer";
import Link from "next/link";
import Image from "next/image";

interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  registration_number: string;
  college_id: string;
}

const StudentRegistration: React.FC = () => {
  const [formData, setFormData] = useState<StudentFormData>({
    name: "",
    email: "",
    phone: "",
    registration_number: "",
    college_id: "",
  });

  const [errors, setErrors] = useState<Partial<StudentFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendingCode, setResendingCode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isRegistered, setIsRegistered] = useState(false);
  const [colleges, setColleges] = useState<{ id: string; name: string }[]>([]);
  const [collegesLoading, setCollegesLoading] = useState(true);

  React.useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch("/api/colleges");
        const data = await response.json();

        if (response.ok) {
          setColleges(data.colleges);
        } else {
          console.error("Failed to fetch colleges:", data.error);
        }
      } catch (error) {
        console.error("Error fetching colleges:", error);
      } finally {
        setCollegesLoading(false);
      }
    };

    fetchColleges();
  }, []);

  // Timer effect for countdown
  React.useEffect(() => {
    if (showVerification && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showVerification, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof StudentFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<StudentFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.registration_number.trim()) {
      newErrors.registration_number = "Registration number is required";
    }

    if (!formData.college_id) {
      newErrors.college_id = "Please select a college";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setShowVerification(true);
        setTimeLeft(600); // Reset timer
        alert("Verification code sent to your email! Please check your inbox.");
      } else {
        alert(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerification = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      setVerificationError("Please enter the verification code");
      return;
    }

    setIsVerifying(true);
    setVerificationError("");

    try {
      const response = await fetch("/api/register", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          verificationCode: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsRegistered(true);
        alert("Registration successful! Welcome to XWORKS.");
      } else {
        setVerificationError(
          data.error || "Verification failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setVerificationError("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setResendingCode(true);

    try {
      const response = await fetch(`/api/register?email=${formData.email}`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setTimeLeft(600); // Reset timer
        setVerificationCode(""); // Clear previous code
        setVerificationError("");
        alert("New verification code sent to your email!");
      } else {
        alert(data.error || "Failed to resend code. Please try again.");
      }
    } catch (error) {
      console.error("Resend failed:", error);
      alert("Failed to resend code. Please try again.");
    } finally {
      setResendingCode(false);
    }
  };

  const handleStartOver = () => {
    setShowVerification(false);
    setVerificationCode("");
    setVerificationError("");
    setTimeLeft(600);
    setIsRegistered(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      registration_number: "",
      college_id: "",
    });
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-white py-2 px-4 sm:px-6 lg:px-8">
        <Image
          src="/images/XWORKS.png"
          alt="XWORKS Logo"
          width={148}
          height={148}
          className="text-white w-[70px] h-[48px] md:w-[150px] md:h-[100px]"
        />
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Registration Successful!
            </h1>
            <p className="text-gray-600">Welcome to XWORKS</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border p-8 text-center">
            <p className="text-lg text-gray-700 mb-6">
              Your account has been created successfully. You can now start your
              journey with XWORKS.
            </p>

            <div className="space-y-4">
              <Link
                href="/Login"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
              >
                Go to Login
              </Link>

              <button
                onClick={handleStartOver}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Register Another Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showVerification) {
    return (
      <div className="min-h-screen bg-white py-2 px-4 sm:px-6 lg:px-8">
        <Image
          src="/images/XWORKS.png"
          alt="XWORKS Logo"
          width={148}
          height={148}
          className="text-white w-[70px] h-[48px] md:w-[150px] md:h-[100px]"
        />
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600">
              We've sent a verification code to <br />
              <span className="font-medium">{formData.email}</span>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                    setVerificationError("");
                  }}
                  className={`w-full px-4 py-3 text-center text-2xl font-mono border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    verificationError
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="000000"
                  maxLength={6}
                />
                {verificationError && (
                  <p className="mt-1 text-sm text-red-600">
                    {verificationError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Code expires in {formatTime(timeLeft)}</span>
              </div>

              <button
                onClick={handleVerification}
                disabled={isVerifying || timeLeft === 0}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isVerifying || timeLeft === 0
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </button>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendCode}
                  disabled={resendingCode || timeLeft > 540} // Allow resend only after 1 minute
                  className={`text-sm font-medium transition-colors ${
                    resendingCode || timeLeft > 540
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:text-blue-500"
                  }`}
                >
                  {resendingCode ? "Resending..." : "Resend Code"}
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={handleStartOver}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Change email address
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-2 px-4 sm:px-6 lg:px-8">
      <Image
        src="/images/XWORKS.png"
        alt="XWORKS Logo"
        width={148}
        height={148}
        className="text-white w-[70px] h-[48px] md:w-[150px] md:h-[100px]"
      />
      <div className="max-w-md mx-auto">
        <div className="text-center mb-4">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Student Registration
          </h1>
          <p className="text-gray-600">Join XWORKS and start your journey</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-8">
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.phone
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Registration Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.registration_number
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your registration number"
                  required
                />
              </div>
              {errors.registration_number && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.registration_number}
                </p>
              )}
            </div>

            {/* College Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  name="college_id"
                  value={formData.college_id}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none ${
                    errors.college_id
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  required
                  disabled={collegesLoading}
                >
                  <option value="">
                    {collegesLoading
                      ? "Loading colleges..."
                      : "Select your college"}
                  </option>
                  {colleges.map((college) => (
                    <option key={college.id} value={college.id}>
                      {college.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.college_id && (
                <p className="mt-1 text-sm text-red-600">{errors.college_id}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isSubmitting
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isSubmitting
                ? "Sending Verification Code..."
                : "Send Verification Code"}
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/Login"
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default StudentRegistration;
