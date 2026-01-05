import { TimelineEntry } from "@/app/lib/types/grievance";
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  AlertTriangle
} from "lucide-react";

type GrievanceTimelineProps = {
  timeline: TimelineEntry[];
  showAllEntries?: boolean; // If false, only show public entries
};

const ACTION_ICONS = {
  submit: User,
  forward: ArrowUp,
  send_back: ArrowDown,
  request_info: MessageSquare,
  add_note: FileText,
  schedule_visit: Clock,
  resolve: CheckCircle,
  reject: XCircle,
};

const ACTION_COLORS = {
  submit: "bg-blue-100 text-blue-600",
  forward: "bg-green-100 text-green-600",
  send_back: "bg-orange-100 text-orange-600",
  request_info: "bg-yellow-100 text-yellow-600",
  add_note: "bg-gray-100 text-gray-600",
  schedule_visit: "bg-purple-100 text-purple-600",
  resolve: "bg-green-100 text-green-600",
  reject: "bg-red-100 text-red-600",
};

const ACTION_LABELS = {
  submit: "Submitted",
  forward: "Forwarded",
  send_back: "Sent Back",
  request_info: "Information Requested",
  add_note: "Note Added",
  schedule_visit: "Visit Scheduled",
  resolve: "Resolved",
  reject: "Rejected",
};

export default function GrievanceTimeline({
  timeline,
  showAllEntries = true
}: GrievanceTimelineProps) {
  const entries = showAllEntries
    ? timeline
    : timeline.filter(entry => entry.is_public);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {entries.map((entry, index) => {
        const Icon = ACTION_ICONS[entry.action];
        const colorClass = ACTION_COLORS[entry.action];
        const isLast = index === entries.length - 1;

        return (
          <div key={entry.id} className="relative">
            {/* Connecting line */}
            {!isLast && (
              <div className="absolute left-5 top-12 h-full w-0.5 bg-gray-200" />
            )}

            <div className="flex gap-4">
              {/* Icon */}
              <div className={`flex-shrink-0 h-10 w-10 rounded-full ${colorClass} flex items-center justify-center ring-4 ring-white`}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {ACTION_LABELS[entry.action]}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {entry.performed_by.type === "citizen" ? (
                          "By Citizen"
                        ) : entry.performed_by.type === "system" ? (
                          "System Action"
                        ) : (
                          `By ${entry.performed_by.name}`
                        )}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDateTime(entry.timestamp)}
                    </span>
                  </div>

                  {/* Note/Reason */}
                  {entry.note && (
                    <div className="mt-3 text-sm text-gray-700 bg-gray-50 rounded-md p-3">
                      {entry.note}
                    </div>
                  )}

                  {/* Send back reason (highlighted) */}
                  {entry.send_back_reason && (
                    <div className="mt-3 flex items-start gap-2 text-sm text-orange-800 bg-orange-50 rounded-md p-3 border border-orange-200">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Reason for sending back:</p>
                        <p className="mt-1">{entry.send_back_reason}</p>
                      </div>
                    </div>
                  )}

                  {/* Status transition */}
                  {entry.from_status !== entry.to_status && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-medium">{entry.from_status}</span>
                      <ArrowUp className="h-3 w-3 rotate-90" />
                      <span className="font-medium">{entry.to_status}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
