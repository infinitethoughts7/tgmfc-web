"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { GrievanceActionType } from "@/app/lib/types/grievance";

type ActionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => Promise<void>;
  action: GrievanceActionType;
  actionLabel: string;
};

const ACTION_DESCRIPTIONS: Record<GrievanceActionType, string> = {
  submit: "Submit this grievance",
  forward: "Forward this grievance to the next level for review",
  send_back: "Send this grievance back to the previous level (reason required)",
  request_info: "Request additional information from the citizen",
  add_note: "Add an internal note to this grievance",
  schedule_visit: "Schedule a field visit for verification",
  resolve: "Mark this grievance as resolved",
  reject: "Reject this grievance (reason required)",
};

const REQUIRES_REASON: GrievanceActionType[] = ["send_back", "reject"];

export default function ActionModal({
  isOpen,
  onClose,
  onConfirm,
  action,
  actionLabel,
}: ActionModalProps) {
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const requiresReason = REQUIRES_REASON.includes(action);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (requiresReason && !note.trim()) {
      setError("Please provide a reason for this action");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await onConfirm(note);
      setNote("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setNote("");
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{actionLabel}</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">
              {ACTION_DESCRIPTIONS[action]}
            </p>

            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                {requiresReason ? "Reason" : "Note"} {requiresReason && <span className="text-red-500">*</span>}
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                required={requiresReason}
                placeholder={
                  requiresReason
                    ? "Please provide a detailed reason..."
                    : "Add any additional notes or comments (optional)..."
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Processing..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
