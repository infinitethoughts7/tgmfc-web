"use client";

import { useState } from "react";
import { Search, Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";

type GrievanceStatus = {
  trackingId: string;
  schemeName: string;
  status: "pending" | "in_progress" | "resolved" | "rejected";
  submittedAt: string;
  lastUpdated: string;
  department: string;
  timeline: {
    date: string;
    status: string;
    description: string;
  }[];
};

export default function TrackGrievancePage() {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GrievanceStatus | null>(null);

  const validateInputs = (): boolean => {
    if (!aadhaarNumber.trim() || aadhaarNumber.length !== 12) {
      setError("Please enter a valid 12-digit Aadhaar number");
      return false;
    }
    if (!mobileNumber.trim() || mobileNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return false;
    }
    return true;
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    setError("");
    if (!validateInputs()) return;

    setIsSendingOtp(true);
    try {
      // TODO: Replace with actual API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("OTP sent to:", mobileNumber);
      setOtpSent(true);
      startResendTimer();
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsSendingOtp(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("OTP resent to:", mobileNumber);
      startResendTimer();
    } catch (err) {
      setError("Failed to resend OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleEditDetails = () => {
    setOtpSent(false);
    setOtp("");
    setError("");
    setResult(null);
  };

  const handleVerifyAndSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter 6-digit OTP");
      return;
    }

    setIsSearching(true);
    try {
      // TODO: Replace with actual API call to verify OTP and fetch grievance
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock result
      const mockResult: GrievanceStatus = {
        trackingId: "GRV-LXY123-AB45",
        schemeName: "Shaadi Mubarak",
        status: "in_progress",
        submittedAt: "2025-12-25T10:30:00.000Z",
        lastUpdated: "2025-12-28T14:20:00.000Z",
        department: "Minorities Welfare",
        timeline: [
          {
            date: "2025-12-25T10:30:00.000Z",
            status: "Submitted",
            description: "Grievance submitted successfully",
          },
          {
            date: "2025-12-26T09:00:00.000Z",
            status: "Under Review",
            description: "Grievance assigned to department officer",
          },
          {
            date: "2025-12-28T14:20:00.000Z",
            status: "In Progress",
            description: "Documents being verified",
          },
        ],
      };

      setResult(mockResult);
    } catch (err) {
      setError("No grievance found or invalid OTP. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "in_progress":
        return <AlertCircle className="w-5 h-5" />;
      case "resolved":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-teal-800 mb-2">
            Track Your Grievance
          </h1>
          <p className="text-gray-600">
            Check the status of your submitted grievance
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-green-100 rounded-xl px-10 py-6 mb-6">
          {!otpSent ? (
            // Step 1: Enter Aadhaar + Mobile
            <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }} className="space-y-4">
              <div>
                <label
                  htmlFor="aadhaar"
                  className="block text-sm font-semibold text-gray-800 mb-1"
                >
                  Aadhaar Number
                </label>
                <input
                  type="text"
                  id="aadhaar"
                  value={aadhaarNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                    setAadhaarNumber(val);
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter 12-digit Aadhaar number"
                />
              </div>

              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-semibold text-gray-800 mb-1"
                >
                  Registered Mobile Number
                </label>
                <input
                  type="text"
                  id="mobile"
                  value={mobileNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setMobileNumber(val);
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter 10-digit mobile number"
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSendingOtp ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : !result ? (
            // Step 2: Enter OTP
            <form onSubmit={handleVerifyAndSearch} className="space-y-4">
              {/* Show where OTP was sent */}
              <div className="bg-white rounded-lg p-3 border border-gray-300">
                <p className="text-sm text-gray-600">OTP sent to:</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="font-semibold text-gray-900">+91 {mobileNumber}</p>
                  <button
                    type="button"
                    onClick={handleEditDetails}
                    className="text-sm text-green-600 hover:underline"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* OTP Input */}
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-semibold text-gray-800 mb-1"
                >
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(val);
                    if (error) setError("");
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 text-center text-2xl font-mono tracking-widest border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="● ● ● ● ● ●"
                  maxLength={6}
                  autoFocus
                />
              </div>

              {/* Resend OTP */}
              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-600">
                    Resend OTP in <span className="font-semibold">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isSendingOtp}
                    className="text-sm text-green-600 font-semibold hover:underline disabled:opacity-50"
                  >
                    {isSendingOtp ? "Sending..." : "Resend OTP"}
                  </button>
                )}
              </div>

              {error && <p className="text-red-600 text-sm text-center">{error}</p>}

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleEditDetails}
                  className="flex-1 px-6 py-3 rounded-lg border border-gray-400 text-gray-700 font-semibold hover:bg-white transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSearching || otp.length !== 6}
                  className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Search className="w-5 h-5" />
                  {isSearching ? "Searching..." : "Verify & Search"}
                </button>
              </div>
            </form>
          ) : (
            // Step 3: Show search again option
            <div className="text-center">
              <p className="text-gray-700 mb-3">Showing results for Aadhaar: ****{aadhaarNumber.slice(-4)}</p>
              <button
                onClick={handleEditDetails}
                className="text-green-600 font-semibold hover:underline"
              >
                Search Another Grievance
              </button>
            </div>
          )}
        </div>

        {/* Search Result */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            {/* Status Header */}
            <div className="bg-green-50 p-6 border-b border-green-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tracking ID</p>
                  <p className="text-xl font-bold font-mono text-gray-800">
                    {result.trackingId}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(
                    result.status
                  )}`}
                >
                  {getStatusIcon(result.status)}
                  {result.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Scheme</p>
                  <p className="font-medium text-gray-800">{result.schemeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-800">{result.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted On</p>
                  <p className="font-medium text-gray-800">
                    {new Date(result.submittedAt).toLocaleDateString("en-IN", {
                      dateStyle: "medium",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-800">
                    {new Date(result.lastUpdated).toLocaleDateString("en-IN", {
                      dateStyle: "medium",
                    })}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-gray-800 mb-4">Status Timeline</h3>
                <div className="space-y-4">
                  {result.timeline.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === result.timeline.length - 1
                              ? "bg-green-600"
                              : "bg-gray-300"
                          }`}
                        />
                        {index < result.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-gray-800">{item.status}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(item.date).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/grievance"
            className="text-green-600 font-semibold hover:underline"
          >
            ← File a New Grievance
          </Link>
        </div>
      </div>
    </div>
  );
}