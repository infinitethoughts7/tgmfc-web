"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GrievanceAPI } from "@/app/lib/api/grievance-service";
import { Officer, DashboardStats } from "@/app/lib/types/grievance";
import OfficerLayout from "../components/OfficerLayout";
import { Loader2, BarChart3, TrendingUp, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function ReportsPage() {
  const router = useRouter();
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("officer_token");
    if (!token) {
      router.push("/officer/login");
      return;
    }

    const loadData = async () => {
      const off = await GrievanceAPI.getCurrentOfficer(token);
      if (!off) {
        localStorage.removeItem("officer_token");
        router.push("/officer/login");
        return;
      }

      setOfficer(off);

      const statsData = await GrievanceAPI.getOfficerDashboardStats(off.id);
      setStats(statsData);
      setLoading(false);
    };

    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (!officer || !stats) return null;

  return (
    <OfficerLayout officer={officer}>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">View detailed statistics and performance metrics</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Grievances</h3>
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total_grievances}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Pending</h3>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Resolved</h3>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.resolved}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Rejected</h3>
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.rejected}</p>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Priority Distribution
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-4xl font-bold text-gray-800">{stats.by_priority.low}</p>
              <p className="text-sm text-gray-600 mt-2">Low Priority</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <p className="text-4xl font-bold text-blue-800">{stats.by_priority.medium}</p>
              <p className="text-sm text-blue-600 mt-2">Medium Priority</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <p className="text-4xl font-bold text-orange-800">{stats.by_priority.high}</p>
              <p className="text-sm text-orange-600 mt-2">High Priority</p>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <p className="text-4xl font-bold text-red-800">{stats.by_priority.urgent}</p>
              <p className="text-sm text-red-600 mt-2">Urgent</p>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Status by Level
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 border border-yellow-200 bg-yellow-50 rounded-lg">
              <p className="text-3xl font-bold text-yellow-800">{stats.at_mandal}</p>
              <p className="text-sm text-yellow-600 mt-2">At Mandal Level</p>
            </div>
            <div className="p-6 border border-orange-200 bg-orange-50 rounded-lg">
              <p className="text-3xl font-bold text-orange-800">{stats.at_district}</p>
              <p className="text-sm text-orange-600 mt-2">At District Level</p>
            </div>
            <div className="p-6 border border-purple-200 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-800">{stats.at_hod}</p>
              <p className="text-sm text-purple-600 mt-2">At HOD Level</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-700">Average Resolution Time</h4>
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-4xl font-bold text-green-800">{stats.avg_resolution_days}</p>
              <p className="text-sm text-green-600 mt-1">days</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-700">Resolved This Month</h4>
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-4xl font-bold text-blue-800">{stats.resolved_this_month}</p>
              <p className="text-sm text-blue-600 mt-1">grievances</p>
            </div>
          </div>
        </div>
      </div>
    </OfficerLayout>
  );
}
