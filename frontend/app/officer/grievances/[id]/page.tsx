"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { GrievanceAPI } from "@/app/lib/api/grievance-service";
import { Officer, Grievance, GrievanceActionType, LEVEL_ACTIONS } from "@/app/lib/types/grievance";
import { SCHEMES } from "@/app/lib/mock-data/schemes";
import { DISTRICTS, MANDALS } from "@/app/lib/mock-data/locations";
import OfficerLayout from "../../components/OfficerLayout";
import StatusBadge from "../../components/StatusBadge";
import GrievanceTimeline from "../../components/GrievanceTimeline";
import ActionModal from "../../components/ActionModal";
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  CheckCircle,
  XCircle,
  FileText,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Paperclip,
  Mic,
  User,
  AlertTriangle,
} from "lucide-react";

type ActionButton = {
  action: GrievanceActionType;
  label: string;
  icon: any;
  colorClass: string;
};

const ACTION_BUTTONS: Record<GrievanceActionType, ActionButton> = {
  forward: {
    action: "forward",
    label: "Forward to Next Level",
    icon: ArrowUp,
    colorClass: "bg-green-600 hover:bg-green-700",
  },
  send_back: {
    action: "send_back",
    label: "Send Back",
    icon: ArrowDown,
    colorClass: "bg-orange-600 hover:bg-orange-700",
  },
  request_info: {
    action: "request_info",
    label: "Request Information",
    icon: MessageSquare,
    colorClass: "bg-yellow-600 hover:bg-yellow-700",
  },
  add_note: {
    action: "add_note",
    label: "Add Note",
    icon: FileText,
    colorClass: "bg-gray-600 hover:bg-gray-700",
  },
  resolve: {
    action: "resolve",
    label: "Resolve Grievance",
    icon: CheckCircle,
    colorClass: "bg-green-600 hover:bg-green-700",
  },
  reject: {
    action: "reject",
    label: "Reject Grievance",
    icon: XCircle,
    colorClass: "bg-red-600 hover:bg-red-700",
  },
  submit: {
    action: "submit",
    label: "Submit",
    icon: FileText,
    colorClass: "bg-blue-600 hover:bg-blue-700",
  },
  schedule_visit: {
    action: "schedule_visit",
    label: "Schedule Visit",
    icon: Calendar,
    colorClass: "bg-purple-600 hover:bg-purple-700",
  },
};

export default function GrievanceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const grievanceId = params.id as string;

  const [officer, setOfficer] = useState<Officer | null>(null);
  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<GrievanceActionType | null>(null);

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

      const grv = await GrievanceAPI.getGrievanceDetails(grievanceId);
      if (!grv) {
        router.push("/officer/dashboard");
        return;
      }

      setGrievance(grv);
      setLoading(false);
    };

    loadData();
  }, [router, grievanceId]);

  const handleActionClick = (action: GrievanceActionType) => {
    setSelectedAction(action);
    setIsModalOpen(true);
  };

  const handleActionConfirm = async (note: string) => {
    if (!officer || !grievance || !selectedAction) return;

    setActionLoading(true);

    try {
      const result = await GrievanceAPI.performGrievanceAction(
        grievance.id,
        officer.id,
        {
          action: selectedAction,
          note,
          send_back_reason: selectedAction === "send_back" ? note : undefined,
        }
      );

      if (result.success) {
        // Reload grievance data
        const updatedGrievance = await GrievanceAPI.getGrievanceDetails(grievanceId);
        if (updatedGrievance) {
          setGrievance(updatedGrievance);
        }
        setIsModalOpen(false);
        setSelectedAction(null);
      } else {
        throw new Error(result.error || "Action failed");
      }
    } catch (error) {
      console.error("Action error:", error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading grievance details...</p>
        </div>
      </div>
    );
  }

  if (!officer || !grievance) return null;

  const scheme = SCHEMES.find((s) => s.id === grievance.scheme_id);
  const district = DISTRICTS.find((d) => d.id === grievance.district_id);
  const mandal = MANDALS.find((m) => m.id === grievance.mandal_id);

  const availableActions = LEVEL_ACTIONS[officer.level];

  return (
    <OfficerLayout officer={officer}>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {grievance.tracking_id}
              </h1>
              <p className="text-gray-600">{scheme?.name || "Unknown Scheme"}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={grievance.status} />
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                  grievance.priority === "urgent"
                    ? "bg-red-100 text-red-800"
                    : grievance.priority === "high"
                    ? "bg-orange-100 text-orange-800"
                    : grievance.priority === "medium"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {grievance.priority === "urgent" && (
                  <AlertTriangle className="h-3 w-3 animate-pulse" />
                )}
                {grievance.priority.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Citizen Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Citizen Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-base font-medium text-gray-900">
                    {grievance.citizen.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-base font-medium text-gray-900 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {grievance.citizen.phone.slice(0, -4) + "****"}
                  </p>
                </div>
                {grievance.citizen.email && (
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-base font-medium text-gray-900 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {grievance.citizen.email}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Aadhaar (Last 4)</p>
                  <p className="text-base font-medium text-gray-900">
                    XXXX-XXXX-{grievance.citizen.aadhaar_last_4}
                  </p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Location
              </h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  District: <span className="font-medium text-gray-900">{district?.name}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Mandal: <span className="font-medium text-gray-900">{mandal?.name}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Address: <span className="font-medium text-gray-900">{grievance.address}</span>
                </p>
              </div>
            </div>

            {/* Scheme Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Scheme Details
              </h2>
              {grievance.application_number && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600">Application Number</p>
                  <p className="text-base font-medium text-gray-900">
                    {grievance.application_number}
                  </p>
                </div>
              )}
              <div className="space-y-3">
                {Object.entries(grievance.scheme_details).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-gray-600">
                      {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                    <p className="text-base font-medium text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Grievance Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Grievance Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {grievance.description}
              </p>

              {/* Attachments */}
              {(grievance.attachments.length > 0 || grievance.has_voice_recording) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Attachments</h3>
                  <div className="space-y-2">
                    {grievance.has_voice_recording && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mic className="h-4 w-4 text-red-500" />
                        Voice Recording Available
                      </div>
                    )}
                    {grievance.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <Paperclip className="h-4 w-4 text-gray-400" />
                        {attachment.split("/").pop() || `Attachment ${index + 1}`}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Timeline Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="text-base font-medium text-gray-900">
                    {new Date(grievance.submitted_at).toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="text-base font-medium text-gray-900">
                    {new Date(grievance.updated_at).toLocaleString("en-IN")}
                  </p>
                </div>
                {grievance.resolved_at && (
                  <div>
                    <p className="text-sm text-gray-600">Resolved</p>
                    <p className="text-base font-medium text-gray-900">
                      {new Date(grievance.resolved_at).toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Timeline */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Activity Timeline</h2>
              <GrievanceTimeline timeline={grievance.timeline} showAllEntries={true} />
            </div>
          </div>
        </div>

        {/* Action Buttons - Sticky on Mobile */}
        {grievance.status !== "resolved" && grievance.status !== "rejected" && (
          <div className="sticky bottom-0 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions</h2>
            <div className="flex flex-wrap gap-3">
              {availableActions.map((action) => {
                const buttonConfig = ACTION_BUTTONS[action];
                const Icon = buttonConfig.icon;

                return (
                  <button
                    key={action}
                    onClick={() => handleActionClick(action)}
                    disabled={actionLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 ${buttonConfig.colorClass}`}
                  >
                    <Icon className="h-4 w-4" />
                    {buttonConfig.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {selectedAction && (
        <ActionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAction(null);
          }}
          onConfirm={handleActionConfirm}
          action={selectedAction}
          actionLabel={ACTION_BUTTONS[selectedAction].label}
        />
      )}
    </OfficerLayout>
  );
}
