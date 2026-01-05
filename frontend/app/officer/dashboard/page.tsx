"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GrievanceAPI } from "@/app/lib/api/grievance-service";
import { Officer, DashboardStats } from "@/app/lib/types/grievance";
import OfficerLayout from "../components/OfficerLayout";
import StatsCard from "../components/StatsCard";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Users,
} from "lucide-react";

export default function OfficerDashboard() {
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

      // Load stats
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
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!officer || !stats) return null;

  return (
    <OfficerLayout officer={officer}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-teal-700 to-green-600 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
          <p className="text-teal-100">Welcome back! Here's your performance summary</p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Assigned"
            value={stats.pending}
            icon={FileText}
            iconColor="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatsCard
            title="Pending Actions"
            value={stats.pending}
            icon={Clock}
            iconColor="text-yellow-600"
            bgColor="bg-yellow-50"
          />
          <StatsCard
            title="Resolved This Month"
            value={stats.resolved_this_month}
            icon={CheckCircle}
            iconColor="text-green-600"
            bgColor="bg-green-50"
          />
          <StatsCard
            title="High Priority"
            value={stats.by_priority.high + stats.by_priority.urgent}
            icon={AlertTriangle}
            iconColor="text-red-600"
            bgColor="bg-red-50"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/officer/grievances"
              className="group p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <FileText className="h-8 w-8 text-green-600" />
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">View All Grievances</h4>
              <p className="text-sm text-gray-600">Browse and manage all assigned grievances</p>
            </Link>

            <Link
              href="/officer/reports"
              className="group p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">View Reports</h4>
              <p className="text-sm text-gray-600">Check detailed analytics and statistics</p>
            </Link>

            <Link
              href="/officer/profile"
              className="group p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <Users className="h-8 w-8 text-purple-600" />
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">My Profile</h4>
              <p className="text-sm text-gray-600">View and update your profile information</p>
            </Link>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Priority Breakdown</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="text-4xl font-bold text-gray-800">{stats.by_priority.low}</p>
              <p className="text-sm text-gray-600 mt-2 font-medium">Low Priority</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <p className="text-4xl font-bold text-blue-800">{stats.by_priority.medium}</p>
              <p className="text-sm text-blue-600 mt-2 font-medium">Medium Priority</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <p className="text-4xl font-bold text-orange-800">{stats.by_priority.high}</p>
              <p className="text-sm text-orange-600 mt-2 font-medium">High Priority</p>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              <p className="text-4xl font-bold text-red-800">{stats.by_priority.urgent}</p>
              <p className="text-sm text-red-600 mt-2 font-medium">Urgent</p>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-sm font-medium text-gray-600 mb-3">At Mandal Level</h4>
            <p className="text-4xl font-bold text-yellow-800">{stats.at_mandal}</p>
            <div className="mt-4 h-2 bg-yellow-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full"
                style={{
                  width: `${(stats.at_mandal / stats.total_grievances) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-sm font-medium text-gray-600 mb-3">At District Level</h4>
            <p className="text-4xl font-bold text-orange-800">{stats.at_district}</p>
            <div className="mt-4 h-2 bg-orange-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{
                  width: `${(stats.at_district / stats.total_grievances) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-sm font-medium text-gray-600 mb-3">At HOD Level</h4>
            <p className="text-4xl font-bold text-purple-800">{stats.at_hod}</p>
            <div className="mt-4 h-2 bg-purple-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{
                  width: `${(stats.at_hod / stats.total_grievances) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl shadow-sm border border-green-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-700">Average Resolution Time</h4>
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-5xl font-bold text-green-800 mb-2">{stats.avg_resolution_days}</p>
            <p className="text-sm text-green-600">days average</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-700">Total Grievances</h4>
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-5xl font-bold text-blue-800 mb-2">{stats.total_grievances}</p>
            <p className="text-sm text-blue-600">across all levels</p>
          </div>
        </div>
      </div>
    </OfficerLayout>
  );
}
