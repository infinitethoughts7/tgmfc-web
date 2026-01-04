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
  const [searchMethod, setSearchMethod] = useState<"tracking" | "aadhaar">("tracking");
  const [trackingId, setTrackingId] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GrievanceStatus | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    // Validation
    if (searchMethod === "tracking" && !trackingId.trim()) {
      setError("Please enter your Tracking ID");
      return;
    }

    if (searchMethod === "aadhaar") {
      if (!aadhaarNumber.trim() || aadhaarNumber.length !== 12) {
        setError("Please enter a valid 12-digit Aadhaar number");
        return;
      }
      if (!mobileNumber.trim() || mobileNumber.length !== 10) {
        setError("Please enter a valid 10-digit mobile number");
        return;
      }
    }

    setIsSearching(true);

    try {
      // TODO: Replace with actual API call to Wagtail CMS
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock result for demonstration
      const mockResult: GrievanceStatus = {
        trackingId: trackingId || "GRV-LXY123-AB45",
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
      setError("No grievance found with the provided details. Please check and try again.");
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
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-teal-800 mb-2">
            Track Your Grievance
          </h1>
          <p className="text-gray-600">
            Check the status of your submitted grievance
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Search Method Toggle */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSearchMethod("tracking")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                searchMethod === "tracking"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              By Tracking ID
            </button>
            <button
              onClick={() => setSearchMethod("aadhaar")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                searchMethod === "aadhaar"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              By Aadhaar + Mobile
            </button>
          </div>

          <form onSubmit={handleSearch}>
            {searchMethod === "tracking" ? (
              <div className="mb-4">
                <label
                  htmlFor="trackingId"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Tracking ID
                </label>
                <input
                  type="text"
                  id="trackingId"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                  placeholder="e.g., GRV-LXY123-AB45"
                />
              </div>
            ) : (
              <div className="space-y-4 mb-4">
                <div>
                  <label
                    htmlFor="aadhaar"
                    className="block text-sm font-semibold text-gray-700 mb-2"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter 12-digit Aadhaar number"
                  />
                </div>
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-semibold text-gray-700 mb-2"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Search className="w-5 h-5" />
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        {/* Search Result */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
        <div className="mt-8 text-center">
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