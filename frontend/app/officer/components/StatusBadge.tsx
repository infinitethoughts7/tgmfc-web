import { GrievanceStatus, STATUS_LABELS, STATUS_COLORS } from "@/app/lib/types/grievance";

type StatusBadgeProps = {
  status: GrievanceStatus;
  className?: string;
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status];
  const label = STATUS_LABELS[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colors.bg} ${colors.text} ${className}`}
    >
      {label}
    </span>
  );
}
