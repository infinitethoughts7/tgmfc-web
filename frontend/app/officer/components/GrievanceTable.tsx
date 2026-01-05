import Link from "next/link";
import { Grievance } from "@/app/lib/types/grievance";
import StatusBadge from "./StatusBadge";
import { Eye, AlertTriangle } from "lucide-react";

type GrievanceTableProps = {
  grievances: Grievance[];
  schemes: { id: string; name: string }[];
};

const PRIORITY_COLORS = {
  low: { bg: "bg-gray-100", text: "text-gray-800" },
  medium: { bg: "bg-blue-100", text: "text-blue-800" },
  high: { bg: "bg-orange-100", text: "text-orange-800" },
  urgent: { bg: "bg-red-100", text: "text-red-800" },
};

export default function GrievanceTable({ grievances, schemes }: GrievanceTableProps) {
  const getSchemeName = (schemeId: string) => {
    return schemes.find((s) => s.id === schemeId)?.name || "Unknown Scheme";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (grievances.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-gray-500">No grievances found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Tracking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Citizen
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Scheme
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {grievances.map((grievance) => {
              const priorityColors = PRIORITY_COLORS[grievance.priority];
              return (
                <tr key={grievance.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/officer/grievances/${grievance.id}`}
                      className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline"
                    >
                      {grievance.tracking_id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {grievance.citizen.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {grievance.citizen.phone.slice(0, -4) + "****"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {getSchemeName(grievance.scheme_id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={grievance.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${priorityColors.bg} ${priorityColors.text}`}
                    >
                      {grievance.priority === "urgent" && (
                        <AlertTriangle className="h-3 w-3 animate-pulse" />
                      )}
                      {grievance.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(grievance.submitted_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`/officer/grievances/${grievance.id}`}
                      className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
