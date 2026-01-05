"use client";

import { useState } from "react";
import { Search, Clock, CheckCircle, AlertCircle, FileText, XCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { GrievanceAPI } from "@/app/lib/api/grievance-service";
import { Grievance, STATUS_LABELS, STATUS_COLORS } from "@/app/lib/types/grievance";
import { SCHEMES } from "@/app/lib/mock-data/schemes";
import GrievanceTimeline from "@/app/officer/components/GrievanceTimeline";

export default function TrackGrievancePage() {
  const [searchMethod, setSearchMethod] = useState<"tracking" | "aadhaar">("tracking");
  const [trackingId, setTrackingId] = useState("");
  const [aadhaarLast4, setAadhaarLast4] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Grievance | null>(null);
  const [multipleResults, setMultipleResults] = useState<Grievance[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setMultipleResults([]);

    // Validation
    if (searchMethod === "tracking" && !trackingId.trim()) {
      setError("Please enter your Tracking ID");
      return;
    }

    if (searchMethod === "aadhaar") {
      if (!aadhaarLast4.trim() || aadhaarLast4.length !== 4) {
        setError("Please enter the last 4 digits of your Aadhaar number");
        return;
      }
      if (!mobileNumber.trim() || mobileNumber.length !== 10) {
        setError("Please enter a valid 10-digit mobile number");
        return;
      }
    }

    setIsSearching(true);

    try {
      if (searchMethod === "tracking") {
        const grievance = await GrievanceAPI.trackGrievance(trackingId);
        if (grievance) {
          setResult(grievance);
        } else {
          setError("No grievance found with this Tracking ID. Please check and try again.");
        }
      } else {
        const grievances = await GrievanceAPI.trackGrievancesByContact(mobileNumber, aadhaarLast4);
        if (grievances.length === 0) {
          setError("No grievances found with the provided details. Please check and try again.");
        } else if (grievances.length === 1) {
          setResult(grievances[0]);
        } else {
          setMultipleResults(grievances);
        }
      }
    } catch (err) {
      setError("An error occurred while searching. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const getSchemeName = (schemeId: string) => {
    return SCHEMES.find((s) => s.id === schemeId)?.name || "Unknown Scheme";
  };

  const getStatusIcon = (status: string) => {
    if (status.includes("resolved")) return <CheckCircle className="w-5 h-5" />;
    if (status.includes("rejected")) return <XCircle className="w-5 h-5" />;
    if (status.includes("info")) return <AlertTriangle className="w-5 h-5" />;
    if (status.includes("hod") || status.includes("district")) return <AlertCircle className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
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
                    Last 4 Digits of Aadhaar
                  </label>
                  <input
                    type="text"
                    id="aadhaar"
                    value={aadhaarLast4}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setAadhaarLast4(val);
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter last 4 digits"
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

        {/* Multiple Results */}
        {multipleResults.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Found {multipleResults.length} Grievances
            </h3>
            <div className="space-y-3">
              {multipleResults.map((grievance) => {
                const statusColors = STATUS_COLORS[grievance.status];
                return (
                  <button
                    key={grievance.id}
                    onClick={() => {
                      setResult(grievance);
                      setMultipleResults([]);
                    }}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono font-bold text-gray-800">
                          {grievance.tracking_id}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {getSchemeName(grievance.scheme_id)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors.bg} ${statusColors.text}`}>
                        {STATUS_LABELS[grievance.status]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Single Result */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Status Header */}
            <div className="bg-green-50 p-6 border-b border-green-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tracking ID</p>
                  <p className="text-xl font-bold font-mono text-gray-800">
                    {result.tracking_id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${STATUS_COLORS[result.status].bg} ${STATUS_COLORS[result.status].text}`}
                  >
                    {getStatusIcon(result.status)}
                    {STATUS_LABELS[result.status]}
                  </span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Scheme</p>
                  <p className="font-medium text-gray-800">{getSchemeName(result.scheme_id)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Level</p>
                  <p className="font-medium text-gray-800">
                    Level {result.current_level} {result.current_level === 1 ? "(Mandal)" : result.current_level === 2 ? "(District)" : "(HOD)"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted On</p>
                  <p className="font-medium text-gray-800">
                    {new Date(result.submitted_at).toLocaleDateString("en-IN", {
                      dateStyle: "medium",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-800">
                    {new Date(result.updated_at).toLocaleDateString("en-IN", {
                      dateStyle: "medium",
                    })}
                  </p>
                </div>
              </div>

              {/* Info Requested Message */}
              {result.status === "info_requested" && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-800">Additional Information Required</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        The officer has requested additional information. Please check the timeline below for details.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-gray-800 mb-6">Status Timeline</h3>
                <GrievanceTimeline
                  timeline={result.timeline.filter(entry => entry.is_public)}
                  showAllEntries={false}
                />
              </div>

              {/* Need Help */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-600 text-center">
                  Need help with your grievance?{" "}
                  <Link href="/contact" className="text-green-600 font-semibold hover:underline">
                    Contact Support
                  </Link>
                </p>
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