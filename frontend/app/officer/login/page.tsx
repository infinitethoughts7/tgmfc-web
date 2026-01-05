"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GrievanceAPI } from "@/app/lib/api/grievance-service";
import { Lock, User, Loader2, AlertCircle } from "lucide-react";

export default function OfficerLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await GrievanceAPI.loginOfficer(username, password);

      if (response.success && response.token) {
        localStorage.setItem("officer_token", response.token);
        router.push("/officer/dashboard");
      } else {
        setError(response.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-700 to-green-600 px-8 py-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative h-20 w-20 bg-white rounded-full p-3">
                <Image
                  src="/logos/telangana.png"
                  alt="Telangana Government Logo"
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Officer Portal
            </h1>
            <p className="text-teal-100 text-sm">
              Grievance Management System
            </p>
            <p className="text-teal-100 text-xs mt-1">
              Ministry of Minority Welfare, Telangana
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Sign in to your account
            </h2>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                    className="w-full pl-11 pr-4 py-3 text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-4 py-3 text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Test credentials hint */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-2">Test Credentials:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <p>HOD: hod.sm / demo123</p>
                <p>District (Hyderabad): do.hyd / demo123</p>
                <p>Mandal (Charminar): mo.charminar / demo123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Government of Telangana &copy; 2024
        </p>
      </div>
    </div>
  );
}
