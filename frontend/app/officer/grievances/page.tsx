"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GrievanceAPI } from "@/app/lib/api/grievance-service";
import { Officer, Grievance, GrievanceStatus } from "@/app/lib/types/grievance";
import OfficerLayout from "../components/OfficerLayout";
import GrievanceTable from "../components/GrievanceTable";
import { SCHEMES } from "@/app/lib/mock-data/schemes";
import { Loader2 } from "lucide-react";

export default function MyGrievancesPage() {
  const router = useRouter();
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<GrievanceStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<Grievance["priority"] | "">("");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

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

      // Load grievances
      const filters: any = {};
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;
      if (searchQuery) filters.search = searchQuery;

      const response = await GrievanceAPI.getOfficerGrievances(
        off.id,
        filters,
        currentPage,
        perPage
      );

      setGrievances(response.data);
      setTotalPages(response.total_pages);
      setLoading(false);
    };

    loadData();
  }, [router, statusFilter, priorityFilter, searchQuery, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading grievances...</p>
        </div>
      </div>
    );
  }

  if (!officer) return null;

  return (
    <OfficerLayout officer={officer}>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Grievances</h2>
          <p className="text-gray-600 mt-1">View and manage all grievances assigned to you</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Filter Grievances
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as GrievanceStatus | "");
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="at_mandal">At Mandal</option>
                <option value="at_district">At District</option>
                <option value="at_hod">At HOD</option>
                <option value="info_requested">Info Requested</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value as Grievance["priority"] | "");
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tracking ID or Name..."
                className="w-full px-4 py-2 text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Grievances Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Grievances ({grievances.length})
            </h3>
          </div>
          <GrievanceTable grievances={grievances} schemes={SCHEMES} />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </OfficerLayout>
  );
}
